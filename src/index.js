const express = require('express');
const app = express();
const port = 3000; // Change this port number if needed

// Set up view engine
app.set('view engine', 'ejs');
app.set('views', './src/views');

// Define routes
const indexRoute = require('./routes/index.Route');
const loginRoute = require('./routes/login.Route');
const usersRoute = require('./routes/users.Route');
const pollsRoute = require('./routes/polls.Route');
const poll_attendanceRoute = require('./routes/polls.Route');
const commentsRoute = require('./routes/comments.Route');
app.use('/', indexRoute);
app.use('/auth', loginRoute);
app.use('/user', usersRoute);
app.use('/poll', pollsRoute);
app.use('/pollAt', poll_attendanceRoute);
app.use('/poll/:id', commentsRoute);


// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
