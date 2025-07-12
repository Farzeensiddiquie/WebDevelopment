# E-Commerce Web Application

A full-stack e-commerce application built with Next.js frontend and Express.js backend, featuring user authentication, product management, cart functionality, and admin dashboard.

## 🚀 Features

### Frontend (Next.js)
- **Modern UI/UX** with responsive design and theme switching
- **User Authentication** - Login, signup, and profile management
- **Product Browsing** - Browse products with search, filter, and sort
- **Shopping Cart** - Add, remove, and manage cart items
- **Admin Dashboard** - Product management for admin users
- **Wishlist** - Save favorite products
- **Order Management** - Place orders and view order history
- **Address Management** - Manage shipping addresses
- **Reviews** - Product reviews and ratings

### Backend (Express.js)
- **RESTful APIs** for all e-commerce functionality
- **JWT Authentication** with refresh tokens
- **MongoDB Database** with Mongoose ODM
- **Admin Authorization** - Role-based access control
- **Product CRUD** - Create, read, update, delete products
- **Cart Management** - Persistent cart for authenticated users
- **Order Processing** - Complete order workflow
- **File Upload** - Product image management
- **Search & Filtering** - Advanced product search

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **Tailwind CSS** - Utility-first CSS framework
- **Context API** - State management
- **Lucide React** - Icon library
- **React Hook Form** - Form handling

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone <repository-url>
cd e-commerce-web
```

### 2. Backend Setup

#### Navigate to server directory
```bash
cd server
```

#### Install dependencies
```bash
npm install
```

#### Create environment file
Create a `.env` file in the `server` directory with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=7d
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRE=30d
PORT=5000
NODE_ENV=development
```

#### Seed the database
```bash
npm run seed
```

This will create:
- Admin user: `admin@ecommerce.com` / `admin123`
- 80 sample products from the existing data

#### Start the backend server
```bash
npm run dev
```

The backend will be running on `http://localhost:5000`

### 3. Frontend Setup

#### Navigate back to project root
```bash
cd ..
```

#### Install dependencies
```bash
npm install
```

#### Create environment file
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Start the frontend development server
```bash
npm run dev
```

The frontend will be running on `http://localhost:3000`

## 👤 Admin Access

### Admin Credentials
- **Email:** `admin@ecommerce.com`
- **Password:** `admin123`

### Admin Features
- Access admin dashboard at `/admin`
- Add, edit, and delete products
- View all products in a table format
- Manage product inventory

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

### Wishlist
- `GET /api/wishlist` - Get user wishlist
- `POST /api/wishlist` - Add to wishlist
- `DELETE /api/wishlist/:id` - Remove from wishlist

### Addresses
- `GET /api/addresses` - Get user addresses
- `POST /api/addresses` - Add address
- `PUT /api/addresses/:id` - Update address
- `DELETE /api/addresses/:id` - Delete address

### Reviews
- `GET /api/reviews/product/:id` - Get product reviews
- `POST /api/reviews` - Add review

## 🎨 Features Overview

### User Features
1. **Browse Products** - View products with search and filtering
2. **Shopping Cart** - Add items, update quantities, remove items
3. **User Authentication** - Secure login and registration
4. **Profile Management** - Update personal information
5. **Order History** - View past orders
6. **Wishlist** - Save favorite products
7. **Address Management** - Manage shipping addresses
8. **Product Reviews** - Rate and review products

### Admin Features
1. **Product Management** - Add, edit, delete products
2. **Inventory Control** - Manage product stock
3. **Admin Dashboard** - Overview of all products
4. **Secure Access** - Role-based admin authentication

## 🔒 Security Features

- **JWT Authentication** with refresh tokens
- **Password Hashing** with bcrypt
- **Input Validation** with express-validator
- **CORS Protection** for cross-origin requests
- **Role-based Access Control** for admin features
- **Secure HTTP Headers** and best practices

## 🚀 Deployment

### Backend Deployment (Render/Heroku)
1. Push your code to GitHub
2. Connect your repository to Render/Heroku
3. Set environment variables in the deployment platform
4. Deploy the backend

### Frontend Deployment (Vercel/Netlify)
1. Connect your repository to Vercel/Netlify
2. Set environment variables:
   - `NEXT_PUBLIC_API_URL` - Your deployed backend URL
3. Deploy the frontend

## 📁 Project Structure

```
e-commerce-web/
├── src/
│   ├── app/                 # Next.js App Router
│   │   ├── admin/          # Admin dashboard
│   │   ├── login/          # Login page
│   │   ├── signup/         # Signup page
│   │   ├── shop/           # Product browsing
│   │   ├── cartpage/       # Shopping cart
│   │   ├── checkout/       # Checkout process
│   │   └── profile/        # User profile
│   ├── components/         # Reusable components
│   ├── context/           # React Context providers
│   ├── utils/             # Utility functions
│   └── data/              # Static data
├── server/                # Express.js backend
│   ├── routes/           # API routes
│   ├── models/           # Database models
│   ├── middleware/       # Custom middleware
│   ├── utils/           # Backend utilities
│   └── config/          # Configuration files
└── public/              # Static assets
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues:

1. Check the console for error messages
2. Verify your environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check that both frontend and backend servers are running

## 🎯 Next Steps

- [ ] Add payment integration (Stripe)
- [ ] Implement email notifications
- [ ] Add product image upload
- [ ] Create order tracking system
- [ ] Add analytics dashboard
- [ ] Implement search with Elasticsearch
- [ ] Add multi-language support
- [ ] Create mobile app with React Native

---

**Happy Coding! 🚀**
