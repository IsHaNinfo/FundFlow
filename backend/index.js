import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize from "./config/db.connection.js";
import errorHandler from "./middleware/errorHandler.js";
import loanRoute from "./routes/loan.route.js";
import userRoute from "./routes/user.routes.js";
import customerProfileRoute from "./routes/customerProfile.routes.js";
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';

const app = express();
const PORT = process.env.PORT || 8000;

// CORS configuration
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Middleware
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ extended: true, limit: "150mb" }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// API Routes - All API routes will be prefixed with /api
app.use("/api/customer-profiles", customerProfileRoute);
app.use("/api/loans", loanRoute);
app.use("/api/users", userRoute);
// Swagger Documentation Route - Separate from API routes
app.use('/docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "FundFlow API Documentation"
}));

// Connect database
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

// Table creation
sequelize
  .sync({ force: false })
  .then(() => {
    console.log("Tables created");
  })
  .catch((error) => {
    console.error("Unable to create tables: ", error);
  });

// Error handling middleware (should be last)
app.use(errorHandler);

// Run server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/docs`);
  console.log(`API Endpoints available at http://localhost:${PORT}/api`);
});
