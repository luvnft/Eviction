require('dotenv').config();
const express = require('express');
const compression = require('compression');
var path = require('path');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
// const session = require('express-session');
const mongoose = require('mongoose');
const routes = require('./routes');
const flash = require('express-flash');
const app = express();
const PORT = process.env.PORT || 3001;
// const aggregateByBuilding = require('./AggregateByBuilding');
const cron = require('node-cron');
const morgan = require('morgan');

// require('./config/passport');

// Define middleware here
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(compression());
app.use(cookieParser());
app.use(morgan('dev'));

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === 'production' || true) {
  app.use(express.static('client/dist'));

  // SPA fallback
  app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

//using the store: new MongoStore creates a new colection in our dB to store the sessions info (cookie)
//this way the web browser refresh will not delete it

// app.use(session({
//   secret: process.env.SessionSecret || 'sessionsecret',
//   resave: true,
//   saveUninitialized: true,
//   // resave: false,
//   store: new MongoStore({ mongooseConnection: mongoose.connection })
// }));

app.use(flash());

// // Incorporate PASSPORT
//   app.use(passport.initialize());
//   app.use(passport.session());

// Add routes, both API and view
app.use(routes);

const MONGODB_URI = process.env.MONGODB_URI;

// Connect to the Mongo DB
mongoose
	.connect(MONGODB_URI, 
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	.catch(err => {
		console.log('DB Connection ERROR: ', err);
	});

// Aggregate filings by building and insert into DB 
// cron.schedule('0 59 23 * * Sunday', () => aggregateByBuilding());
// aggregateByBuilding()

// Start the API server
app.listen(PORT, function () {
	console.log(`🌎  ==> API Server now listening on PORT ${PORT}!`);
});
