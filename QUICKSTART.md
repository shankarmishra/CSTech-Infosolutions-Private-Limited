# Quick Start Guide

Get the MERN Machine Test application up and running in minutes!

## 🚀 Quick Setup

### Prerequisites
- Node.js (v14+)
- MongoDB (running locally)

### 1. One-Command Setup
```bash
npm run setup
```

This will:
- Create `.env` file
- Install all dependencies
- Create uploads directory
- Seed the database

### 2. Start the Application
```bash
npm run dev
```

### 3. Access the Application
- Open: http://localhost:3000
- Login: admin@example.com / admin123

## 🧪 Quick Test

### 1. Add Agents
1. Go to "Agents" page
2. Click "Add Agent"
3. Fill in details:
   - Name: John Agent
   - Email: john@example.com
   - Mobile: +1234567890
   - Password: agent123
4. Save

### 2. Upload Sample Data
1. Go to "Lists" page
2. Use the provided `sample-data.csv` file
3. Drag & drop or click to upload
4. View the distribution results

### 3. View Dashboard
- Check the dashboard for statistics
- See how data was distributed among agents

## 📁 Sample Files

- `sample-data.csv` - Test data with 20 records
- Required columns: FirstName, Phone, Notes

## 🔧 Troubleshooting

### MongoDB Not Running
```bash
# Ubuntu/Debian
sudo systemctl start mongod

# macOS
brew services start mongodb-community

# Windows
net start MongoDB
```

### Port Issues
Change PORT in `.env` file if 5000 is busy

### Dependencies Issues
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📞 Need Help?

- Check the full README.md for detailed instructions
- Ensure MongoDB is running before setup
- Check console logs for error messages 