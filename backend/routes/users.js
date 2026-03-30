const express = require('express');
const router = express.Router();
const { User } = require('../models');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['password'] } });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single user
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, { 
      attributes: { exclude: ['password'] } 
    });
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    const { password, ...userWithoutPassword } = user.toJSON();
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;