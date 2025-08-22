const express = require('express');
const { body, validationResult } = require('express-validator');
const Agent = require('../models/Agent');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(protect);
router.use(authorize('admin'));

// @desc    Get all agents
// @route   GET /api/agents
// @access  Private (Admin only)
router.get('/', async (req, res) => {
  try {
    const agents = await Agent.find().select('-password');

    res.status(200).json({
      success: true,
      count: agents.length,
      data: agents
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single agent
// @route   GET /api/agents/:id
// @access  Private (Admin only)
router.get('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id).select('-password');

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Create agent
// @route   POST /api/agents
// @access  Private (Admin only)
router.post('/', [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('mobileNumber', 'Please include a valid mobile number with country code').matches(/^\+[1-9]\d{1,14}$/),
  body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    // Check if agent already exists
    const existingAgent = await Agent.findOne({ email: req.body.email });
    if (existingAgent) {
      return res.status(400).json({
        success: false,
        message: 'Agent with this email already exists'
      });
    }

    const agent = await Agent.create(req.body);

    // Remove password from response
    const agentResponse = agent.toObject();
    delete agentResponse.password;

    res.status(201).json({
      success: true,
      data: agentResponse
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Agent with this email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update agent
// @route   PUT /api/agents/:id
// @access  Private (Admin only)
router.put('/:id', [
  body('name', 'Name is required').not().isEmpty(),
  body('email', 'Please include a valid email').isEmail(),
  body('mobileNumber', 'Please include a valid mobile number with country code').matches(/^\+[1-9]\d{1,14}$/)
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      success: false,
      errors: errors.array() 
    });
  }

  try {
    let agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    // Check if email is being changed and if it already exists
    if (req.body.email && req.body.email !== agent.email) {
      const existingAgent = await Agent.findOne({ email: req.body.email });
      if (existingAgent) {
        return res.status(400).json({
          success: false,
          message: 'Agent with this email already exists'
        });
      }
    }

    agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    }).select('-password');

    res.status(200).json({
      success: true,
      data: agent
    });
  } catch (err) {
    console.error(err);
    if (err.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Agent with this email already exists'
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete agent
// @route   DELETE /api/agents/:id
// @access  Private (Admin only)
router.delete('/:id', async (req, res) => {
  try {
    const agent = await Agent.findById(req.params.id);

    if (!agent) {
      return res.status(404).json({
        success: false,
        message: 'Agent not found'
      });
    }

    await agent.remove();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router; 