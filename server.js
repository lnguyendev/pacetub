const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const path = require('path');

const authRoute = require('./routes/api/auth');
const usersRoute = require('./routes/api/users');
const timesheetRoute = require('./routes/api/timesheet');

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
app.use(
  '/api/timesheet',
  passport.authenticate('jwt', { session: false }),
  timesheetRoute
);

app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ error: err });
});

// Serve static assets if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
