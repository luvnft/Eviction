const path = require('path');
const router = require('express').Router();
// const configRoutes = require('./configs');
// const manifestRoutes = require('./manifest')
// const geoAPIRoutes = require('./geoapis');
// const userRoutes = require('./users');
// const sessoionRoutes = require('./sessions');
// API Routes
// router.use('/configs', configRoutes);
// router.use('/manifest', manifestRoutes);
// router.use('/geoapis', geoAPIRoutes);
// router.use('/users', userRoutes);
// router.use('/sessions', sessionRoutes)

// If no API routes are hit, send the React app
router.use((req, res) => res.sendFile(path.join(__dirname, '../client/build/index.html')));

router.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500
  let msg = err.message
  // If we are in production, override the message we
  // expose to the client (for security reasons)
  if (process.env.NODE_ENV === 'production') {
    msg = 'Internal server error'
  }
  if (err.statusCode === 500) {
    console.error(err)
  }
  res.status(err.statusCode).json({
    error: msg
  })
});

module.exports = router;
