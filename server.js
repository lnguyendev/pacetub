const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');

const authRoute = require('./routes/api/auth');
const usersRoute = require('./routes/api/users');

const app = express();

/* Body Parser Middleware*/
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

/* DB Config */
mongoose.set('useFindAndModify', false);
const db = require('./config/keys').mongoURI;
mongoose
  .connect(
    db,
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(() => console.log('MongoDB Connected!'))
  .catch(err => console.log(err));

/* Passport Middleware */
app.use(passport.initialize());
require('./config/passport.js')(passport); // Passport Config

/* Setup Routes */
app.use('/auth', authRoute);
app.use(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  usersRoute
);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
