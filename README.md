# 🌾 AgroLink Backend

> **Farm Fresh, Farmer Direct** - Direct farmer-to-buyer marketplace platform eliminating middlemen

[![Node.js](https://img.shields.io/badge/Node.js-16%2B-green)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen)](https://www.mongodb.com/cloud/atlas)
[![Express](https://img.shields.io/badge/Express-4.x-blue)](https://expressjs.com/)

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Project Structure](#project-structure)

---

## ✨ Features

### Core Features
- ✅ **JWT Authentication** - Secure user authentication with role-based access (farmer/buyer)
- ✅ **Product Management** - CRUD operations for agricultural products
- ✅ **Order Processing** - Order creation with automatic inventory management
- ✅ **Payment Integration** - Razorpay payment gateway with signature verification
- ✅ **Image Uploads** - Cloudinary integration for product images
- ✅ **Notifications** - Firebase Cloud Messaging for real-time updates
- ✅ **Analytics** - FastAPI microservice for crop demand forecasting

### Security
- Password hashing with bcrypt
- JWT token-based authentication
- CORS enabled for cross-origin requests
- Razorpay webhook signature verification

---

## 🛠 Tech Stack

**Backend:**
- Node.js (v16+)
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- Bcrypt.js

**Integrations:**
- Razorpay (Payments)
- Cloudinary (Image hosting)
- Firebase Admin (Push notifications)

**Analytics Service:**
- FastAPI
- scikit-learn
- Python 3.8+

---

## 📦 Prerequisites

Before you begin, ensure you have:

- **Node.js** 16+ and npm
- **MongoDB Atlas** account (or local MongoDB)
- **Razorpay** account (for payments)
- **Cloudinary** account (for image uploads)
- **Firebase** project (for notifications)
- **Python** 3.8+ (for analytics service)

---

## 🚀 Installation

### 1. Clone the repository

```bash
cd agrolink-backend
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials (see [Environment Variables](#environment-variables))

### 3. Start the server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

Server will run on `http://localhost:5000`

### 4. (Optional) Start Analytics Service

```bash
cd analytics
python -m venv .venv
.\.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Mac/Linux
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Analytics API will run on `http://localhost:8000`

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

```env
# Server
PORT=5000

# Database
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/agrolinkDB

# Authentication
JWT_SECRET=your_super_secret_jwt_key_here

# Razorpay (Payment Gateway)
RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=your_razorpay_secret_key
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret

# Cloudinary (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Firebase (Notifications)
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

### How to Get API Keys

**MongoDB Atlas:**
1. Go to [cloud.mongodb.com](https://cloud.mongodb.com)
2. Create free cluster → Database Access → Create user
3. Network Access → Add IP (0.0.0.0/0 for testing)
4. Connect → Drivers → Copy connection string

**Razorpay:**
1. Sign up at [razorpay.com](https://razorpay.com)
2. Dashboard → Settings → API Keys → Generate Test/Live keys

**Cloudinary:**
1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Dashboard → Account Details → Copy credentials

**Firebase:**
1. [console.firebase.google.com](https://console.firebase.google.com)
2. Project Settings → Service Accounts → Generate private key

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "farmer"  // or "buyer"
}

Response: { user: {...}, token: "jwt_token" }
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: { user: {...}, token: "jwt_token" }
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <jwt_token>

Response: { user: {...} }
```

---

### Product Endpoints

#### Get All Products
```http
GET /api/products

Response: [{ _id, name, pricePerKg, quantityAvailable, farmerId: {...} }]
```

#### Get Single Product
```http
GET /api/products/:id

Response: { _id, name, category, pricePerKg, ... }
```

#### Create Product (Farmer Only)
```http
POST /api/products
Authorization: Bearer <farmer_jwt_token>
Content-Type: multipart/form-data

name: Fresh Tomatoes
category: Vegetables
pricePerKg: 40
quantityAvailable: 100
location: Punjab
image: <file>

Response: { _id, name, imageUrl, ... }
```

#### Update Product (Farmer Only)
```http
PUT /api/products/:id
Authorization: Bearer <farmer_jwt_token>
Content-Type: multipart/form-data

pricePerKg: 45
quantityAvailable: 150

Response: { _id, name, ... }
```

#### Delete Product (Farmer Only)
```http
DELETE /api/products/:id
Authorization: Bearer <farmer_jwt_token>

Response: { message: "Deleted" }
```

---

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <buyer_jwt_token>
Content-Type: application/json

{
  "productId": "6907d5b17e251c4a908c5052",
  "quantity": 10
}

Response: { _id, buyerId, productId, quantity, totalPrice, status: "pending" }
```

#### Get My Orders
```http
GET /api/orders
Authorization: Bearer <jwt_token>

Response: [{ _id, productId: {...}, quantity, totalPrice, status }]
```

#### Create Payment Order
```http
POST /api/orders/create-payment
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "orderId": "6907d5cd7e251c4a908c5058"
}

Response: { razorpayOrder: { id, amount, currency } }
```

#### Verify Payment
```http
POST /api/orders/verify
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "orderId": "6907d5cd7e251c4a908c5058",
  "razorpay_order_id": "order_xxx",
  "razorpay_payment_id": "pay_xxx",
  "razorpay_signature": "signature_xxx"
}

Response: { success: true, message: "Payment verified" }
```

#### Webhook (Razorpay)
```http
POST /api/orders/webhook
X-Razorpay-Signature: <signature>
Content-Type: application/json

{ event: "payment.captured", payload: {...} }

Response: { status: "ok" }
```

---

## 🧪 Testing

### Manual Testing with cURL/PowerShell

**Register Farmer:**
```powershell
$body = @{name='Test Farmer';email='farmer@test.com';password='test123';role='farmer'} | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:5000/api/auth/register' -Method POST -Body $body -ContentType 'application/json'
```

**Create Product:**
```powershell
$token = 'your_jwt_token_here'
$body = @{name='Tomatoes';category='Vegetables';pricePerKg=40;quantityAvailable=100;location='Punjab'} | ConvertTo-Json
Invoke-WebRequest -Uri 'http://localhost:5000/api/products' -Method POST -Headers @{Authorization="Bearer $token"} -Body $body -ContentType 'application/json'
```

### Automated Tests

(Coming soon: Jest/Supertest integration tests)

---

## 🚀 Deployment

### Deploy to Render

1. Push code to GitHub
2. Connect repo to [Render](https://render.com)
3. Render will detect `render.yaml` automatically
4. Add environment variables in Render dashboard
5. Deploy!

Your API will be live at: `https://your-app.onrender.com`

### Deploy to Railway/Heroku

Similar process - connect repo, add env vars, deploy.

---

## 📁 Project Structure

```
agrolink-backend/
├── server.js                 # Entry point
├── config/
│   └── db.js                # MongoDB connection
├── models/
│   ├── User.js              # User schema
│   ├── Product.js           # Product schema
│   └── Order.js             # Order schema
├── controllers/
│   ├── authController.js    # Auth logic
│   ├── productController.js # Product CRUD
│   └── orderController.js   # Order & payment logic
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── productRoutes.js     # Product endpoints
│   └── orderRoutes.js       # Order endpoints
├── middleware/
│   └── authMiddleware.js    # JWT protection
├── utils/
│   ├── generateToken.js     # JWT helper
│   ├── uploadImage.js       # Cloudinary upload
│   └── sendNotification.js  # Firebase notifications
├── analytics/
│   ├── main.py              # FastAPI analytics service
│   └── requirements.txt     # Python dependencies
├── .env.example             # Environment template
├── package.json             # Node dependencies
├── render.yaml              # Render deployment config
└── README.md                # This file
```

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or submit a pull request.

---

## 📄 License

This project is licensed under the MIT License.

---

## 📞 Support

For questions or support:
- 📧 Email: support@agrolink.com
- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/agrolink/issues)

---

**Made with ❤️ for farmers and buyers**
