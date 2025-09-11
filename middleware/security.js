const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');

const securityMiddleware = (app) => {
  // Helmet → sets secure HTTP headers
  app.use(helmet());

  // Optional: Prevent MongoDB Operator Injection
  // Uncomment if you want to enable it
  // app.use(mongoSanitize({
  //   onSanitize: ({ key }) => {
  //     console.warn(`This request contained a prohibited key: ${key}`);
  //   },
  //   replaceWith: '_',
  //   allowDots: true,
  //   dryRun: false, // set to true for testing (doesn’t mutate input)
  // }));

  // Define allowed frontend origins
  const allowedOrigins = [
    process.env.CLIENT_URL,                     // from .env
    'http://localhost:3000',                    // local dev
    'https://tarot-frontend-seven.vercel.app',  // production frontend
  ].filter(Boolean); // remove undefined/null

  app.use(
    cors({
      origin: function (origin, callback) {
        // Allow requests with no origin (like Postman or curl)
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // allows cookies & auth headers
    })
  );
};

module.exports = securityMiddleware;
