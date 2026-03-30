const express = require('express');
const router = express.Router();
const { Order, User, Product } = require('../models');

// GET all orders
router.get('/', async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Product }
      ]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET single order
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findByPk(req.params.id, {
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Product }
      ]
    });
    if (order) {
      res.json(order);
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST create new order
router.post('/', async (req, res) => {
  try {
    const order = await Order.create(req.body);
    const orderWithAssociations = await Order.findByPk(order.id, {
      include: [
        { model: User, attributes: { exclude: ['password'] } },
        { model: Product }
      ]
    });
    res.status(201).json(orderWithAssociations);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;