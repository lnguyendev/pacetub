const express = require('express');
const router = express.Router();

// @route   GET api/users/current
// @desc    Return current user
// @access  Private
router.get('/current', (req, res) => {
  res.json({
    id: req.user.id,
    name: req.user.name,
    email: req.user.email
  });
});

module.exports = router;
