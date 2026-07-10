const jwt = require("jsonwebtoken");
const Customer = require("../models/Customer");

/**
 * Authentication middleware.
 * Verifies JWT token from Authorization header (Bearer token).
 * Finds customer in MongoDB and attaches it to req.customer.
 * Returns 401 if token is invalid, expired, or missing.
 */
const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract the token
      token = req.headers.authorization.split(" ")[1];

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_secret_key");

      // Find the customer in MongoDB and exclude the password
      req.customer = await Customer.findById(decoded.customerId).select("-password");

      if (!req.customer) {
        return res.status(401).json({ message: "Not authorized, customer not found" });
      }

      // Check if user is blocked (existing blocked field in Customer model)
      if (req.customer.blocked) {
        return res.status(403).json({ message: "This account has been suspended" });
      }

      return next();
    } catch (error) {
      console.error("JWT Verification error:", error.message);
      return res.status(401).json({ message: "Not authorized, token invalid or expired" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }
};

/**
 * Role-based authorization middleware.
 * Checks if the authenticated customer has any of the required roles.
 * Returns 403 if unauthorized.
 */
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.customer) {
      return res.status(401).json({ message: "Not authorized, no customer session" });
    }

    if (!roles.includes(req.customer.role)) {
      return res.status(403).json({
        message: `Forbidden: Role '${req.customer.role}' is not authorized to access this resource`
      });
    }

    return next();
  };
};

module.exports = {
  protect,
  authorizeRoles
};
