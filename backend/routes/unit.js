const express = require('express');
const router = express.Router();
const Unit = require('../models/Unit');
const auth = require('../middleware/auth');

// Create or Update Unit
router.post('/store', auth, async (req, res) => {
  try {
    const { id, name, description, isActive } = req.body;

    if (!name) {
      return res.status(400).json({ 
        status: false, 
        message: 'Unit name is required' 
      });
    }

    let unit;
    if (id) {
      // Update existing unit
      unit = await Unit.findByIdAndUpdate(
        id,
        { name, description, isActive },
        { new: true, runValidators: true }
      );
      
      if (!unit) {
        return res.status(404).json({ 
          status: false, 
          message: 'Unit not found' 
        });
      }
    } else {
      // Create new unit
      unit = new Unit({ name, description, isActive });
      await unit.save();
    }

    res.json({ 
      status: true, 
      message: id ? 'Unit updated successfully' : 'Unit created successfully',
      data: unit 
    });
  } catch (error) {
    console.error('Unit store error:', error);
    res.status(500).json({ 
      status: false, 
      message: 'Server error' 
    });
  }
});

// Delete Unit
router.delete('/delete/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const unit = await Unit.findByIdAndDelete(id);
    
    if (!unit) {
      return res.status(404).json({ 
        status: false, 
        message: 'Unit not found' 
      });
    }

    res.json({ 
      status: true, 
      message: 'Unit deleted successfully' 
    });
  } catch (error) {
    console.error('Unit delete error:', error);
    res.status(500).json({ 
      status: false, 
      message: 'Server error' 
    });
  }
});

// Get Unit List
router.post('/list', auth, async (req, res) => {
  try {
    const { search, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.body;
    
    const query = {};
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const units = await Unit.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Unit.countDocuments(query);

    res.json({
      status: true,
      data: units,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit
      }
    });
  } catch (error) {
    console.error('Unit list error:', error);
    res.status(500).json({ 
      status: false, 
      message: 'Server error' 
    });
  }
});

// Get Single Unit
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    const unit = await Unit.findById(id);
    
    if (!unit) {
      return res.status(404).json({ 
        status: false, 
        message: 'Unit not found' 
      });
    }

    res.json({ 
      status: true, 
      data: unit 
    });
  } catch (error) {
    console.error('Unit get error:', error);
    res.status(500).json({ 
      status: false, 
      message: 'Server error' 
    });
  }
});

module.exports = router; 