const express = require('express');
const mongoose = require('mongoose');
const cookieSession = require('cookie-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const keys = require('./config/keys');
require('./models/User');
require('./models/Survey');
require('./services/passport');

mongoose.connect(keys.mongoURI);

const app = express();

app.use(bodyParser.json());

// allow express to be able to use cookies
// cookie is created and passed to the client
app.use(
  cookieSession({
    maxAge: 30 * 24 * 60 * 60 * 1000,
    keys: [keys.cookieKey]
  })
);

// next two lines tell passport to make use of the cookies to handle authentication
// what is in the cookie is used to populate the session
app.use(passport.initialize());
app.use(passport.session());

// Attempts Node/Express routes first
require('./routes/authRoutes')(app);
require('./routes/billingRoutes')(app);
require('./routes/surveyRoutes')(app);

// If in production, then the React build files will be available
// If no routes are matched on the server side then the below will proceed.
if (process.env.NODE_ENV === 'production') {
  // Express will serve up React build static assets it can match up first
  app.use(express.static('client/build'));

  // If Express can't match to a static asset first then it will forward it to index
  // React Router (if used in the app) will now direct any path matches
  const path = require('path');
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);