# E-commerce Backend API

This is the Express.js backend API for the e-commerce application.

## Setup Instructions

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Environment Configuration
Copy the environment example file and configure your variables:
```bash
cp env.example .env
```

Edit `.env` file with your configuration:
- Set your MongoDB connection string
- Configure JWT secrets
- Set your frontend URL
- Configure other environment variables as needed

### 3. Database Setup
Make sure MongoDB is running locally or use MongoDB Atlas:
- Local: `mongodb://localhost:27017/ecommerce`
- Atlas: `mongodb+srv://username:password@cluster.mongodb.net/ecommerce`

### 4. Run the Server

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile

### Products
- `GET /api/products` - Get all products (with filtering/pagination)
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin only)
- `PUT /api/products/:id` - Update product (Admin only)
- `DELETE /api/products/:id` - Delete product (Admin only)
- `GET /api/products/categories` - Get all categories
- `GET /api/products/brands` - Get all brands

### Health Check
- `GET /api/health` - Server health status

## Features

- ✅ JWT Authentication with refresh tokens
- ✅ User registration and login
- ✅ Product management with filtering and pagination
- ✅ Role-based access control (Admin/User)
- ✅ Input validation and sanitization
- ✅ Error handling middleware
- ✅ Rate limiting
- ✅ CORS configuration
- ✅ Security headers (Helmet)
- ✅ Request logging (Morgan)
- ✅ Compression middleware

## Database Models

- **User**: Authentication and user management
- **Product**: Product catalog with categories and brands

## Next Steps

1. **Add remaining models and routes:**
   - Cart management
   - Wishlist management
   - Order management
   - Address management
   - Review system

2. **Add data seeding:**
   - Import products from your JSON file
   - Create admin user

3. **Connect frontend:**
   - Update frontend to use API endpoints
   - Replace localStorage with API calls

## Development

The server uses:
- **Express.js** - Web framework
- **MongoDB/Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **helmet** - Security headers
- **cors** - Cross-origin requests
- **morgan** - Request logging 