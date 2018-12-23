const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const _ = require('lodash');

const router = express.Router();

const User = require('../../models/User');
const keys = require('../../config/keys');
const validateRegisterInput = require('../../utils/validation/register');
const validateLoginInput = require('../../utils/validation/login');
const ValidateForgotPasswordInput = require('../../utils/validation/forgotPassword');
const validateResetPasswordInput = require('../../utils/validation/resetPassword');

// @route   POST auth/register
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

// @route   POST auth/login
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

// @route   POST auth/forgot-password
// @desc    Get email from request and send a reset password email to the user
// @access  Public
router.post('/forgot-password', (req, res) => {
  const { errors, isValid } = ValidateForgotPasswordInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        errors.email = 'Email cannot be found in database.';
        return res.status(404).json(errors);
      }

      const token = crypto.randomBytes(20).toString('hex');

      user.resetPasswordToken = token;
      user.resetPasswordExpires = Date.now() + 14400000;

      user
        .save()
        .then(user => {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: keys.nodemailerEmail,
              pass: keys.nodemailerPassword
            }
          });

          const mailOptions = {
            from: 'lnguyendev@gmail.com',
            to: user.email,
            subject: 'Timesheet: Password Reset',
            text:
              `You are receiving this email because you (or someone else) have requested a password reset of your account.\n\n` +
              `Please click on the following link, or paste it into your browser to reset your password. You have 4 hours before this link expires.\n\n` +
              `${keys.resetPasswordLink}/reset-password/${token}\n\n` +
              `If you did not make this request, please ignore this email.`
          };

          transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
              return res.status(400).json(err);
            } else {
              return res.json({
                emailsent: 'email sent'
              });
            }
          });
        })
        .catch(err => {
          return res.status(400).json(err);
        });
    })
    .catch(err => {
      return res.status(400).json(err);
    });
});

// @route   GET auth/reset-password/:token
// @desc    Check if token is valid
// @access  Public
router.get('/reset-password/:token', (req, res) => {
  if (_.isEmpty(req.params.token)) {
    return res.status(404).json({
      invalidlink: 'Password reset link is invalid or has expired.'
    });
  }

  User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: {
      $gt: Date.now()
    }
  }).then(user => {
    if (!user) {
      return res.status(404).json({
        invalidlink: 'Password reset link is invalid or has expired.'
      });
    }

    return res.json({ success: 'Link is valid' });
  });
});

// @route   PUT auth/reset-password/:token
// @desc    Change password
// @access  Public
router.put('/reset-password/:token', (req, res) => {
  const { errors, isValid } = validateResetPasswordInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }

  const { email, password } = req.body;
  const { token } = req.params;

  User.findOne({
    email,
    resetPasswordToken: token
  })
    .then(user => {
      if (!user) {
        errors.email = 'Email does not exist in database.';
        return res.status(404).json(errors);
      }

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hashPassword) => {
          if (err) {
            throw err;
          }

          user.password = hashPassword;
          user.resetPasswordToken = null;
          user.resetPasswordExpires = null;

          user
            .save()
            .then(user => res.json({ success: 'Successfully reset password' }))
            .catch(err => res.status(400).json(err));
        });
      });
    })
    .catch(err =>
      res.status(404).json({ email: 'Email does not exist in database' })
    );
});

module.exports = router;
