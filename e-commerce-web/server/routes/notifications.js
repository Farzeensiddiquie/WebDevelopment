const express = require('express');
const { body, validationResult, query } = require('express-validator');
const User = require('../models/User');
const auth = require('../middleware/auth');
const { io, connectedUsers } = require('../server');

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user's notifications with pagination
// @access  Private
router.get('/', [
  auth.auth,
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('Limit must be between 1 and 50'),
  query('type').optional().isIn(['order', 'product', 'admin', 'system', 'shipped', 'delivered', 'cancelled', 'processing', 'pending']),
  query('read').optional().isBoolean()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { page = 1, limit = 20, type, read } = req.query;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Build filter for notifications
    let filter = {};
    if (type) filter.type = type;
    if (read !== undefined) filter.read = read === 'true';

    // Get notifications with pagination
    const notifications = user.notifications
      .filter(notification => {
        if (type && notification.type !== type) return false;
        if (read !== undefined && notification.read !== (read === 'true')) return false;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Calculate pagination
    const total = notifications.length;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const paginatedNotifications = notifications.slice(skip, skip + parseInt(limit));

    // Calculate unread count
    const unreadCount = user.notifications.filter(n => !n.read).length;

    res.json({
      success: true,
      data: paginatedNotifications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit),
        hasNextPage: skip + parseInt(limit) < total,
        hasPrevPage: page > 1
      },
      unreadCount
    });

  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/notifications
// @desc    Add a new notification for the user
// @access  Private
router.post('/', [
  auth.auth,
  body('type', 'Notification type is required').isIn(['order', 'product', 'admin', 'system', 'shipped', 'delivered', 'cancelled', 'processing', 'pending']),
  body('title', 'Notification title is required').not().isEmpty().trim(),
  body('message', 'Notification message is required').not().isEmpty().trim(),
  body('orderId').optional().trim(),
  body('productId').optional().trim()
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, title, message, orderId, productId } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Deduplication: check for similar notification in last 5 minutes
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
    const duplicate = user.notifications.find(n =>
      n.type === type &&
      n.title === title &&
      (orderId ? n.orderId === orderId : true) &&
      (productId ? n.productId === productId : true) &&
      new Date(n.createdAt) > fiveMinutesAgo
    );
    if (duplicate) {
      return res.status(200).json({ success: true, message: 'Duplicate notification skipped', data: duplicate });
    }

    // Create new notification
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      title,
      message,
      read: false,
      orderId: orderId || null,
      productId: productId || null,
      createdAt: new Date()
    };

    // Admin notification targeting: only allow admin/superadmin to receive/persist admin notifications
    if (type === 'admin' && user.role !== 'admin' && user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Only admins can receive admin notifications' });
    }

    // Add to user's notifications (limit to 100 notifications per user)
    user.notifications.unshift(notification);
    if (user.notifications.length > 100) {
      user.notifications = user.notifications.slice(0, 100);
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: 'Notification added successfully',
      data: notification
    });

  } catch (error) {
    console.error('Add notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   POST /api/notifications/global
// @desc    Admin sends a global notification to all users
// @access  Private (Admin only)
router.post('/global', auth.auth, async (req, res) => {
  try {
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'superadmin')) {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }
    const { title, message } = req.body;
    if (!title || !message) {
      return res.status(400).json({ error: 'Title and message are required' });
    }
    const notification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'admin',
      title,
      message,
      read: false,
      createdAt: new Date()
    };
    // Add notification to all users
    const users = await User.find({});
    for (const user of users) {
      user.notifications.unshift(notification);
      if (user.notifications.length > 100) {
        user.notifications = user.notifications.slice(0, 100);
      }
      await user.save();
      // Emit real-time notification if user is connected
      const userId = user._id.toString();
      if (connectedUsers[userId]) {
        connectedUsers[userId].forEach(socketId => {
          io.to(socketId).emit('user_notification', notification);
        });
      }
    }
    res.json({ success: true, message: 'Global notification sent to all users' });
  } catch (error) {
    console.error('Global notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark a notification as read
// @access  Private
router.put('/:id/read', auth.auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const notification = user.notifications.find(n => n.id === req.params.id);
    
    if (!notification) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.read = true;
    await user.save();

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification
    });

  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth.auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Mark all notifications as read
    user.notifications.forEach(notification => {
      notification.read = true;
    });

    await user.save();

    res.json({
      success: true,
      message: 'All notifications marked as read'
    });

  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/notifications/all
// @desc    Permanently delete all notifications for the current user
// @access  Private
router.delete('/all', auth.auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    user.notifications = [];
    await user.save();
    res.json({ success: true, message: 'All notifications deleted' });
  } catch (error) {
    console.error('Delete all notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', auth.auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const notificationIndex = user.notifications.findIndex(n => n.id === req.params.id);
    
    if (notificationIndex === -1) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    user.notifications.splice(notificationIndex, 1);
    await user.save();

    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });

  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/notifications
// @desc    Clear all notifications
// @access  Private
router.delete('/', auth.auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.notifications = [];
    await user.save();

    res.json({
      success: true,
      message: 'All notifications cleared'
    });

  } catch (error) {
    console.error('Clear notifications error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get unread notification count
// @access  Private
router.get('/unread-count', auth.auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const unreadCount = user.notifications.filter(n => !n.read).length;

    res.json({
      success: true,
      data: { unreadCount }
    });

  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 