const express = require('express');
const multer = require('multer');
const csv = require('csv-parser');
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const List = require('../models/List');
const Agent = require('../models/Agent');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    const allowedTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    const allowedExtensions = ['.csv', '.xlsx', '.xls'];
    
    const fileExtension = path.extname(file.originalname).toLowerCase();
    
    if (allowedTypes.includes(file.mimetype) || allowedExtensions.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV, XLSX, and XLS files are allowed'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// @desc    Upload CSV/Excel file and distribute to agents
// @route   POST /api/lists/upload
// @access  Private (Admin only)
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    // Get all active agents
    const agents = await Agent.find({ isActive: true });
    
    if (agents.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No active agents found. Please add agents first.'
      });
    }

    const uploadId = uuidv4();
    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    let data = [];

    // Parse file based on extension
    if (fileExtension === '.csv') {
      // Parse CSV file
      data = await parseCSV(filePath);
    } else if (fileExtension === '.xlsx' || fileExtension === '.xls') {
      // Parse Excel file
      data = await parseExcel(filePath);
    }

    // Validate data structure
    if (data.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid data found in the file'
      });
    }

    // Validate required columns
    const requiredColumns = ['FirstName', 'Phone', 'Notes'];
    const firstRow = data[0];
    const missingColumns = requiredColumns.filter(col => !(col in firstRow));
    
    if (missingColumns.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required columns: ${missingColumns.join(', ')}`
      });
    }

    // Distribute data among agents
    const distributedData = distributeDataAmongAgents(data, agents, uploadId);

    // Save to database
    const savedLists = await List.insertMany(distributedData);

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    res.status(200).json({
      success: true,
      message: `Successfully uploaded and distributed ${data.length} records among ${agents.length} agents`,
      data: {
        totalRecords: data.length,
        agentsCount: agents.length,
        uploadId: uploadId,
        distribution: agents.map((agent, index) => ({
          agentName: agent.name,
          recordsCount: Math.ceil(data.length / agents.length) - (index >= data.length % agents.length ? 1 : 0)
        }))
      }
    });

  } catch (error) {
    console.error('Upload error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error processing file'
    });
  }
});

// @desc    Get all distributed lists
// @route   GET /api/lists
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    const lists = await List.find()
      .populate('agentId', 'name email')
      .sort('-createdAt');

    // Group by upload ID
    const groupedLists = lists.reduce((acc, list) => {
      if (!acc[list.uploadId]) {
        acc[list.uploadId] = {
          uploadId: list.uploadId,
          uploadDate: list.createdAt,
          totalRecords: 0,
          agents: {}
        };
      }
      
      if (!acc[list.uploadId].agents[list.agentId._id]) {
        acc[list.uploadId].agents[list.agentId._id] = {
          agentName: list.agentName,
          agentEmail: list.agentId.email,
          records: []
        };
      }
      
      acc[list.uploadId].agents[list.agentId._id].records.push({
        firstName: list.firstName,
        phone: list.phone,
        notes: list.notes
      });
      
      acc[list.uploadId].totalRecords++;
      
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      count: Object.keys(groupedLists).length,
      data: Object.values(groupedLists)
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get lists by upload ID
// @route   GET /api/lists/upload/:uploadId
// @access  Private (Admin only)
router.get('/upload/:uploadId', async (req, res) => {
  try {
    const lists = await List.find({ uploadId: req.params.uploadId })
      .populate('agentId', 'name email')
      .sort('-createdAt');

    if (lists.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Upload not found'
      });
    }

    // Group by agent
    const groupedByAgent = lists.reduce((acc, list) => {
      if (!acc[list.agentId._id]) {
        acc[list.agentId._id] = {
          agentName: list.agentName,
          agentEmail: list.agentId.email,
          records: []
        };
      }
      
      acc[list.agentId._id].records.push({
        firstName: list.firstName,
        phone: list.phone,
        notes: list.notes
      });
      
      return acc;
    }, {});

    res.status(200).json({
      success: true,
      data: {
        uploadId: req.params.uploadId,
        uploadDate: lists[0].createdAt,
        totalRecords: lists.length,
        agents: groupedByAgent
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Helper function to parse CSV
function parseCSV(filePath) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (error) => reject(error));
  });
}

// Helper function to parse Excel
function parseExcel(filePath) {
  try {
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_json(worksheet);
  } catch (error) {
    throw new Error('Error parsing Excel file');
  }
}

// Helper function to distribute data among agents
function distributeDataAmongAgents(data, agents, uploadId) {
  const distributedData = [];
  const agentsCount = agents.length;
  
  data.forEach((record, index) => {
    const agentIndex = index % agentsCount;
    const agent = agents[agentIndex];
    
    distributedData.push({
      firstName: record.FirstName || '',
      phone: record.Phone || '',
      notes: record.Notes || '',
      agentId: agent._id,
      agentName: agent.name,
      uploadId: uploadId
    });
  });
  
  return distributedData;
}

module.exports = router; 