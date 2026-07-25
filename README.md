# Artist Bazaar - Full-Stack E-commerce Platform

A modern, AI-powered marketplace connecting local artisans with customers, featuring robust authentication, cart management, chat and admin controls.

## 🚀 Features

### Frontend (React + TypeScript + Vite)
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components
- **Authentication**: Login/Signup with Google OAuth support
- **Product Management**: Browse, search, filter products with categories and tags
- **Shopping Cart**: Persistent cart with real-time updates
- **AI Chat Interface**: Interactive assistant for product discovery
- **Role-based Access**: Protected routes for Admin, Seller, Services, and Customer
- **Responsive Design**: Mobile-first approach with beautiful animations

### Backend (Node.js + Express + MongoDB)
- **RESTful API**: Comprehensive endpoints for all operations
- **Authentication**: JWT-based auth with 5-minute sessions and refresh tokens
- **Database**: MongoDB with Mongoose ODM
- **Security**: Password hashing, CORS, input validation with Zod
- **Real-time Features**: Cart synchronization across sessions

## 🛠️ Tech Stack

### Frontend
- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- shadcn/ui (Component library)
- React Router (Navigation)
- React Query (Data fetching)
- Context API (State management)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- JWT (Authentication)
- bcrypt (Password hashing)
- Zod (Validation)
- CORS (Cross-origin requests)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (local or cloud)
- Git


### Clone the repo
```
git clone https://github.com/Rogshivam/ArtistBazaar.git
cd ArtistBazaar
```
### Using Docker
Run Container
```
docker compose up -d
```
Check Running Docker Containers
```
docker ps
```
Look at the PORTS column
```
0.0.0.0:4000 -> 4000/tcp
```

### Mannual Setup
#### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp env.example .env
   ```

4. **Start MongoDB** (if running locally)
   ```bash
   # On macOS with Homebrew
   brew services start mongodb-community
   
   # On Ubuntu/Debian
   sudo systemctl start mongod
   
   # On Windows
   net start MongoDB
   ```

5. **Run the backend**
   ```bash
   npm run dev
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create environment file**
   ```bash
   cp env.example .env
   ```

4. **Run the frontend**
   ```bash
   npm run dev
   ```
## 🔐 Authentication System

### User Roles
- **Customer**: Browse products, add to cart, make purchases
- **Seller**: Manage products, view sales analytics
- **Services**: Provide services to customers
- **Admin**: Full system access, user management

### Login Methods
1. **Email/Password**: Traditional authentication
2. **Google OAuth**: One-click sign-in (simulated in demo)

### Session Management
- **Access Token**: 5-minute expiration for security
- **Refresh Token**: 7-day expiration for convenience
- **Auto-logout**: Session expires after 5 minutes of inactivity

## 🛒 Cart System

### Features
- **Persistent Storage**: Cart saved in MongoDB
- **Real-time Updates**: Changes sync across browser tabs
- **Quantity Management**: Add, update, remove items
- **Price Snapshots**: Prices locked at time of adding to cart
- **Guest Protection**: Login required for cart operations

### API Endpoints
- `GET /api/cart` - Get user's cart
- `POST /api/cart/add` - Add item to cart
- `POST /api/cart/update` - Update item quantity
- `POST /api/cart/clear` - Clear entire cart

## 🎨 Product Management

### Product Features
- **Search**: Full-text search across name, description, category, tags
- **Filtering**: By category, price range, tags
- **Pagination**: Efficient loading of large product catalogs
- **Sorting**: By price, date, popularity
- **Images**: Multiple image support
- **Tags**: Flexible tagging system

### Seller Features
- **Add Products**: Rich product creation form
- **Manage Inventory**: Update stock, prices, descriptions
- **Analytics**: View sales performance
- **Order Management**: Process customer orders

## 🤖 AI Chat Interface

### Capabilities
- **Product Discovery**: Help customers find products
- **Artisan Guidance**: Assist sellers with listing optimization
- **Natural Language**: Conversational interface
- **Context Awareness**: Remembers conversation history

## 🔒 Security Features

### Authentication
- JWT tokens with short expiration
- Refresh token rotation
- Password hashing with bcrypt
- Role-based access control

### Data Protection
- Input validation with Zod schemas
- CORS configuration
- SQL injection prevention (NoSQL)
- XSS protection

## 📱 API Documentation

### Authentication Endpoints
```
POST /api/auth/login
POST /api/auth/google/callback
POST /api/auth/logout
POST /api/customer/set-password (Customer signup)
POST /api/students/set-password (Seller signup)
POST /api/faculty/set-password (Services signup)
```

### Product Endpoints
```
GET /api/products?q=&category=&tags=&minPrice=&maxPrice=&page=&limit=
POST /api/products (Seller only)
GET /api/seller/products (Seller only)
```

### Cart Endpoints
```
GET /api/cart
POST /api/cart/add
POST /api/cart/update
POST /api/cart/clear
```

### Admin Endpoints
```
GET /api/admin/overview
GET /api/admin/sellers
GET /api/admin/customers
```

## 🚀 Deployment

### Backend Deployment
1. **Environment Setup**
   - Set production MongoDB URI
   - Configure JWT secrets
   - Set CORS origins

2. **Build & Deploy**
   ```bash
   npm run build
   ```

### Frontend Deployment
1. **Build for Production**
   ```bash
   npm run build
   ```

2. **Deploy to Vercel/Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set output directory: `dist`

## 🧪 Testing

### Backend Testing
```bash
cd backend
npm test
```

### Frontend Testing
```bash
cd frontend
npm test
```

## 📊 Database Schema

### User Model
```javascript
{
  email: String (unique, required)
  passwordHash: String
  role: String (Admin|Seller|Services|Customer)
  name: String
  avatar: String
  googleId: String
  lastLogin: Date
  isActive: Boolean
}
```

### Product Model
```javascript
{
  sellerId: ObjectId (ref: User)
  name: String (required)
  description: String (required)
  category: String (required)
  price: Number (required)
  sku: String
  stock: Number
  images: [String]
  tags: [String]
}
```

### Cart Model
```javascript
{
  userId: ObjectId (ref: User, unique)
  items: [{
    productId: ObjectId (ref: Product)
    quantity: Number
    priceSnapshot: Number
  }]
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🆘 Support

For support:

Email: shivamdevthakur@gmail.com

Email: souravbhardwaj2005@gmail.com

Or open an issue on the GitHub repository.

## 🎯 Roadmap

- [ ] Payment integration (Razor pay)
- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced AI features
- [ ] Video product showcases
- [ ] Social media integration

---

**Built with ❤️ for local artisans and craft enthusiasts**
