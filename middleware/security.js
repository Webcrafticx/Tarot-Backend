const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cors = require('cors');

const securityMiddleware = (app) => {
    app.use(helmet())
//   app.use(mongoSanitize({
//   onSanitize: ({ key }) => {
//     console.warn(`This request contained a prohibited key: ${key}`);
//   },
//   replaceWith: '_',
//   allowDots: true,
//   dryRun: true, // <-- does not mutate the original object
// }))

    app.use(cors({
        origin: process.env.CLIENT_URL || 'http://localhost:3000' || 'https://tarot-frontend-seven.vercel.app/',
        credentials: true,
    }))
}

module.exports = securityMiddleware;
