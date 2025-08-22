# MERN Stack Machine Test - Admin Dashboard

A complete MERN stack application for managing agents and distributing CSV/Excel data among them. This application demonstrates modern web development practices with a focus on user experience, security, and scalability.

## 🚀 Features

### Authentication
- **JWT-based authentication** for secure admin access
- **Password hashing** using bcryptjs
- **Protected routes** with role-based access control
- **Session management** with automatic token refresh

### Agent Management
- **CRUD operations** for agent management
- **Form validation** with real-time feedback
- **Mobile number validation** with country code support
- **Email uniqueness** validation
- **Password security** with minimum requirements

### File Upload & Distribution
- **Multi-format support**: CSV, XLSX, XLS files
- **Drag & drop interface** for easy file upload
- **File validation** (size, format, structure)
- **Automatic distribution** of data among agents
- **Equal distribution algorithm** with remainder handling
- **Upload history** with detailed analytics

### Dashboard & Analytics
- **Real-time statistics** showing agents, records, and uploads
- **Responsive design** for all device sizes
- **Modern UI/UX** with intuitive navigation
- **Toast notifications** for user feedback

## 🛠️ Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **bcryptjs** - Password hashing
- **Multer** - File upload handling
- **csv-parser** - CSV file processing
- **xlsx** - Excel file processing
- **express-validator** - Input validation

### Frontend
- **React.js** - UI library
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **React Toastify** - Notifications
- **React Icons** - Icon library
- **CSS3** - Styling with modern features

## 📋 Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v14 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn** package manager

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd mern-machine-test
```

### 2. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Edit the `.env` file with your configuration:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-machine-test
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=30d
```

### 4. Database Setup

Make sure MongoDB is running on your system:

```bash
# Start MongoDB (Ubuntu/Debian)
sudo systemctl start mongod

# Start MongoDB (macOS with Homebrew)
brew services start mongodb-community

# Start MongoDB (Windows)
net start MongoDB
```

### 5. Seed the Database

Create an admin user for initial access:

```bash
node scripts/seed.js
```

This will create an admin user with the following credentials:
- **Email**: admin@example.com
- **Password**: admin123

### 6. Run the Application

#### Development Mode (Recommended)

```bash
# Run both backend and frontend concurrently
npm run dev
```

This will start:
- Backend server on `http://localhost:5000`
- Frontend development server on `http://localhost:3000`

#### Production Mode

```bash
# Build the frontend
npm run build

# Start the production server
npm start
```

## 📁 Project Structure

```
mern-machine-test/
├── client/                 # React frontend
│   ├── public/            # Static files
│   ├── src/               # Source code
│   │   ├── components/    # React components
│   │   ├── context/       # React context
│   │   └── index.js       # Entry point
│   └── package.json
├── models/                # MongoDB models
│   ├── User.js           # User/Admin model
│   ├── Agent.js          # Agent model
│   └── List.js           # List model
├── routes/                # API routes
│   ├── auth.js           # Authentication routes
│   ├── agents.js         # Agent management routes
│   └── lists.js          # List management routes
├── middleware/            # Custom middleware
│   └── auth.js           # Authentication middleware
├── scripts/               # Utility scripts
│   └── seed.js           # Database seeding
├── uploads/               # File upload directory
├── server.js             # Express server
├── package.json          # Backend dependencies
└── README.md             # This file
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `GET /api/auth/me` - Get current user

### Agents
- `GET /api/agents` - Get all agents
- `POST /api/agents` - Create new agent
- `GET /api/agents/:id` - Get single agent
- `PUT /api/agents/:id` - Update agent
- `DELETE /api/agents/:id` - Delete agent

### Lists
- `POST /api/lists/upload` - Upload and distribute file
- `GET /api/lists` - Get all uploads
- `GET /api/lists/upload/:uploadId` - Get upload details

## 📊 File Upload Requirements

### Supported Formats
- **CSV** (.csv)
- **Excel** (.xlsx, .xls)

### Required Columns
Your CSV/Excel file must contain the following columns:
- `FirstName` - Text (required)
- `Phone` - Number/Text (required)
- `Notes` - Text (optional)

### Example CSV Format
```csv
FirstName,Phone,Notes
John Doe,1234567890,Important customer
Jane Smith,0987654321,Follow up needed
```

### File Size Limit
- Maximum file size: **5MB**

## 🔐 Security Features

- **JWT Authentication** with secure token handling
- **Password Hashing** using bcryptjs
- **Input Validation** on both client and server
- **File Upload Security** with type and size validation
- **CORS Configuration** for cross-origin requests
- **Environment Variables** for sensitive configuration

## 🎨 User Interface

### Features
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Modern UI** - Clean and intuitive interface
- **Real-time Feedback** - Toast notifications for all actions
- **Loading States** - Visual feedback during operations
- **Error Handling** - User-friendly error messages

### Pages
1. **Login Page** - Secure authentication
2. **Dashboard** - Overview and quick actions
3. **Agents Management** - CRUD operations for agents
4. **Lists Management** - File upload and distribution

## 🧪 Testing the Application

### 1. Login
- Navigate to `http://localhost:3000`
- Use the demo credentials:
  - Email: `admin@example.com`
  - Password: `admin123`

### 2. Add Agents
- Go to "Agents" page
- Click "Add Agent"
- Fill in the required information
- Save the agent

### 3. Upload Files
- Go to "Lists" page
- Drag and drop a CSV/Excel file or click to select
- Ensure the file has the required columns
- The system will automatically distribute data among agents

### 4. View Distribution
- After upload, click "View Details" to see how data was distributed
- Each agent will receive an equal portion of the records

## 🚨 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the connection string in `.env`
   - Verify MongoDB port (default: 27017)

2. **Port Already in Use**
   - Change the PORT in `.env` file
   - Kill processes using the port: `lsof -ti:5000 | xargs kill -9`

3. **File Upload Fails**
   - Check file format (CSV, XLSX, XLS only)
   - Ensure file size is under 5MB
   - Verify required columns are present

4. **Authentication Issues**
   - Clear browser localStorage
   - Run the seed script again: `node scripts/seed.js`
   - Check JWT_SECRET in `.env`

### Development Tips

- Use browser developer tools to check network requests
- Check server console for error logs
- Verify MongoDB connection in server logs
- Use React Developer Tools for frontend debugging

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For support or questions, please contact the development team.

---

**Note**: This is a demonstration project for the MERN Stack Machine Test. In production, ensure to:
- Use strong JWT secrets
- Implement proper error logging
- Add comprehensive testing
- Configure proper CORS settings
- Use environment-specific configurations
- Implement rate limiting
- Add input sanitization
- Set up proper backup strategies #   C S T e c h - I n f o s o l u t i o n s - P r i v a t e - L i m i t e d  
 