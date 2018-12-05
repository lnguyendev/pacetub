const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const router = express.Router();

const User = require('../../models/User');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../utils/validation/register');
const validateLoginInput = require('../../utils/validation/login');

// @route   POST api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);

  // Check validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      errors.email = 'Email already exists';
      return res.status(400).json(errors);
    } else {
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) {
            throw err;
          }

          newUser.password = hash;
          newUser
            .save()
            .then(user => res.json(user))
            .catch(err => {
              console.log(err);
              res.status(400).json(err);
            });
        });
      });
    }
  });
});

// @route   POST api/users/login
// @desc    Login user / Returning JWT token
// @access  Public
router.post('/login', (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;

  User.findOne({ email }).then(user => {
    if (!user) {
      errors.credentials = 'Email And/Or Password Is Incorrect.';
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then(isMatch => {
      if (isMatch) {
        const payload = {
          id: user.id,
          name: user.name,
          email: user.email
        };

        jwt.sign(
          payload,
          keys.secretOrKey,
          {
            expiresIn: 18000
          },
          (err, token) => {
            if (err) {
              throw err;
            }

            res.json({
              success: true,
              token: 'Bearer ' + token
            });
          }
        );
      } else {
        errors.credentials = 'Email And/Or Password Is Incorrect.';
        return res.status(400).json(errors);
      }
    });
  });
});

module.exports = router;
