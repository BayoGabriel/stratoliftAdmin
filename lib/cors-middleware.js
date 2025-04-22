// lib/cors-middleware.js
const Cors = require('cors');
const initMiddleware = require('./init-middleware');

const cors = initMiddleware(
  Cors({
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    origin: '*', // allow all origins (adjust for production!)
  })
);

module.exports = cors;
