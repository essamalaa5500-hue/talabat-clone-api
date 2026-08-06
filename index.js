require("dotenv").config();
const http = require("http");
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const helmet = require("helmet");
const compression = require("compression");
const hpp = require("hpp");
const logger = require("./config/logger");

require("./config/redis");
require("./workers/notification.worker");

const { initSocket } = require("./socket/socket");
const swaggerSpec = require("./src/docs/swagger");
const ErrorHandler = require("./utils/ErrorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

const morgan = require("morgan");

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: {
        write: (message) => logger.info(message.trim()),
      },
    }),
  );
}

/*Security */

app.disable("x-powered-by");
app.set("trust proxy", 1);

app.use(
  helmet({
    crossOriginResourcePolicy: false,
    contentSecurityPolicy: false,
  }),
);

app.use(hpp());
app.use(compression());

/* CORS*/

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);

/*Body Parsers*/

app.use(express.json());
app.use(cookieParser());

/*Swagger*/

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/*Routes*/

const authRoutes = require("./src/routes/auth.routes");
const usersRoutes = require("./src/routes/users.routes");
const restaurantRoutes = require("./src/routes/restaurant.routes");
const branchesRoutes = require("./src/routes/branches.routes");
const cuisinesRoutes = require("./src/routes/cuisines.routes");
const menuCategoryRoutes = require("./src/routes/menu-category.routes");
const productRoutes = require("./src/routes/product.routes");
const productVariantRoutes = require("./src/routes/product-variant.routes");
const productImageRoutes = require("./src/routes/product-image.routes");
const productOptionRoutes = require("./src/routes/product-option.routes");
const productOptionValueRoutes = require("./src/routes/product-option-value.routes");
const cartRoutes = require("./src/routes/cart.routes");
const couponRoutes = require("./src/routes/coupon.routes");
const orderRoutes = require("./src/routes/order.routes");
const paymentRoutes = require("./src/routes/payment.routes");
const deliveryRoutes = require("./src/routes/delivery.routes");
const restaurantReviewRoutes = require("./src/routes/restaurant.review.routes");
const driverReviewRoutes = require("./src/routes/driver-review.routes");
const notificationRoutes = require("./src/routes/notification.routes");
const driverRoutes = require("./src/routes/driver.routes");

app.use("/auth", authRoutes);
app.use("/users", usersRoutes);
app.use("/restaurants", restaurantRoutes);
app.use("/branches", branchesRoutes);
app.use("/cuisines", cuisinesRoutes);
app.use("/menu-categories", menuCategoryRoutes);
app.use("/product", productRoutes);
app.use("/product-variant", productVariantRoutes);
app.use("/product-image", productImageRoutes);
app.use("/product-option", productOptionRoutes);
app.use("/product-option-value", productOptionValueRoutes);
app.use("/cart", cartRoutes);
app.use("/coupons", couponRoutes);
app.use("/orders", orderRoutes);
app.use("/payments", paymentRoutes);
app.use("/deliveries", deliveryRoutes);
app.use("/restaurant-reviews", restaurantReviewRoutes);
app.use("/driver-reviews", driverReviewRoutes);
app.use("/notifications", notificationRoutes);
app.use("/drivers", driverRoutes);

app.get("/", (req, res) => {
  res.send("API Server is running...");
});

/*404*/

app.use((req, res, next) => {
  next(new ErrorHandler(`Can't find ${req.originalUrl} on this server!`, 404));
});

/*Global Error Handler*/

app.use((err, req, res, next) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    statusCode: err.statusCode,
  });

  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    message: err.message || "Internal Server Error",
    error: err.errors || null,
  });
});

/*Server*/

const server = http.createServer(app);

initSocket(server);

try {
  server.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
  });
} catch (err) {
  console.error(err);
}
