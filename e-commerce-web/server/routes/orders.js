const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const User = require('../models/User');

// Get all orders for the authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Get orders from user's orders array
    const orders = user.orders || [];
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get all orders (admin only) - MUST come before /:orderId route
router.get('/admin/all', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Get all users with orders
    const users = await User.find({ 'orders.0': { $exists: true } });
    const allOrders = users.reduce((acc, user) => {
      const userOrders = (user.orders || []).map(order => ({
        ...order.toObject(),
        userEmail: user.email,
        userName: user.name
      }));
      return acc.concat(userOrders);
    }, []);

    // Sort by creation date (newest first)
    allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(allOrders);
  } catch (error) {
    console.error('Error fetching all orders:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// @route   DELETE /api/orders/clear-completed
// @desc    Clear delivered and cancelled orders (admin only)
// @access  Private (Admin)
router.delete('/clear-completed', auth, async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    // Find all users with orders and remove delivered/cancelled orders
    const users = await User.find({ 'orders.0': { $exists: true } });
    let totalDeleted = 0;

    for (const user of users) {
      const originalLength = user.orders.length;
      user.orders = user.orders.filter(order => 
        order.status !== 'delivered' && order.status !== 'cancelled'
      );
      const deletedCount = originalLength - user.orders.length;
      totalDeleted += deletedCount;
      
      if (deletedCount > 0) {
        await user.save();
      }
    }

    res.json({
      success: true,
      message: `Cleared ${totalDeleted} completed orders`,
      deletedCount: totalDeleted
    });

  } catch (error) {
    console.error('Clear completed orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get a specific order by ID
router.get('/:orderId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const order = user.orders?.find(o => o.id === req.params.orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json(order);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Create a new order
router.post('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const {
      items,
      shipping,
      payment,
      totals,
      shippingMethod,
      estimatedDelivery
    } = req.body;

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!shipping || !totals) {
      return res.status(400).json({ error: 'Shipping and totals information is required' });
    }

    // Validate payment method
    if (!payment || !['prepayment', 'cod'].includes(payment.method)) {
      return res.status(400).json({ error: 'Invalid payment method. Must be "prepayment" or "cod"' });
    }

    // Create order object
    const order = {
      id: req.body.id || `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId: user._id,
      items: items.map(item => ({
        productId: item.id || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      shipping: {
        firstName: shipping.firstName || user.name?.split(' ')[0] || '',
        lastName: shipping.lastName || user.name?.split(' ').slice(1).join(' ') || '',
        email: shipping.email || user.email || '',
        phone: shipping.phone || '',
        address: shipping.address,
        city: shipping.city || '',
        state: shipping.state || '',
        zipCode: shipping.zipCode,
        country: shipping.country || 'United States'
      },
      payment: {
        method: payment.method,
        cardNumber: payment.method === 'prepayment' ? (payment.cardNumber || '') : '',
        status: payment.status || (payment.method === 'prepayment' ? 'paid' : 'pending')
      },
      totals: {
        subtotal: totals.subtotal || 0,
        discount: totals.discount || 0,
        shipping: totals.shipping || 0,
        tax: totals.tax || 0,
        total: totals.total || 0
      },
      shippingMethod: shippingMethod || 'standard',
      status: req.body.status || 'pending',
      estimatedDelivery: estimatedDelivery || null,
      createdAt: req.body.createdAt ? new Date(req.body.createdAt) : new Date(),
      updatedAt: new Date()
    };

    // Add order to user's orders array
    if (!user.orders) {
      user.orders = [];
    }
    user.orders.unshift(order); // Add to beginning of array
    await user.save();

    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating order:', error);
    console.error('Request body:', req.body);
    console.error('User ID:', req.user?.id);
    res.status(500).json({ error: 'Server error', details: error.message });
  }
});

// Update order status (admin only - can update any user's order)
router.put('/admin/:orderId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Check if user is admin
    const adminUser = await User.findById(req.user.id);
    if (!adminUser || (adminUser.role !== 'admin' && adminUser.role !== 'superadmin')) {
      return res.status(403).json({ error: 'Access denied. Admin only.' });
    }

    // Find the order in any user's orders
    const allUsers = await User.find({ 'orders.id': req.params.orderId });
    if (allUsers.length === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const user = allUsers[0];
    const orderIndex = user.orders?.findIndex(o => o.id === req.params.orderId);
    
    if (orderIndex === -1 || orderIndex === undefined) {
      return res.status(404).json({ error: 'Order not found' });
    }

    user.orders[orderIndex].status = status;
    user.orders[orderIndex].updatedAt = new Date();
    await user.save();

    res.json(user.orders[orderIndex]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update order status
router.put('/:orderId/status', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const orderIndex = user.orders?.findIndex(o => o.id === req.params.orderId);
    if (orderIndex === -1 || orderIndex === undefined) {
      return res.status(404).json({ error: 'Order not found' });
    }

    user.orders[orderIndex].status = status;
    user.orders[orderIndex].updatedAt = new Date();
    await user.save();

    res.json(user.orders[orderIndex]);
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Cancel order
router.put('/:orderId/cancel', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const orderIndex = user.orders?.findIndex(o => o.id === req.params.orderId);
    if (orderIndex === -1 || orderIndex === undefined) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = user.orders[orderIndex];
    
    // Allow cancellation of pending or processing orders (both COD and prepaid)
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ error: 'Order cannot be cancelled at this stage' });
    }

    order.status = 'cancelled';
    order.updatedAt = new Date();
    
    // Add refund information for prepaid orders
    if (order.payment?.method === 'prepayment') {
      order.refund = {
        amount: order.totals?.total || 0,
        status: 'pending',
        requestedAt: new Date(),
        estimatedDays: '3-5 business days'
      };
    }
    
    await user.save();

    res.json(order);
  } catch (error) {
    console.error('Error cancelling order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete order (admin only or user can delete their own cancelled orders)
router.delete('/:orderId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const orderIndex = user.orders?.findIndex(o => o.id === req.params.orderId);
    if (orderIndex === -1 || orderIndex === undefined) {
      return res.status(404).json({ error: 'Order not found' });
    }

    const order = user.orders[orderIndex];
    
    // Only allow deletion of cancelled orders or if user is admin
    if (order.status !== 'cancelled' && user.role !== 'admin') {
      return res.status(400).json({ error: 'Order cannot be deleted' });
    }

    user.orders.splice(orderIndex, 1);
    await user.save();

    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router; 