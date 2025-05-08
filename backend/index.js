import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import sequelize from "./config/db.connection.js";
import errorHandler from "./middleware/errorHandler.js";
import customerRoute from "./routes/customer.route.js";
import adminRoute from "./routes/admin.route.js";
import loanRoute from "./routes/loan.route.js";
import swaggerUi from 'swagger-ui-express';
import { specs } from './config/swagger.js';

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json({ limit: "150mb" }));
app.use(express.urlencoded({ limit: "150mb" }));

// CORS configuration
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
  })
);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// API Routes - All API routes will be prefixed with /api
app.use("/api/customer", customerRoute);
app.use("/api/admin", adminRoute);
app.use("/api/loan", loanRoute);

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
