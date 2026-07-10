const jwt = require("jsonwebtoken");

/**
 * Generates a signed JWT for the customer session.
 * Payload contains: customerId, role.
 * Expiration defaults to 7d.
 */
const generateToken = (customer) => {
  return jwt.sign(
    {
      customerId: customer._id,
      role: customer.role || "customer",
    },
    process.env.JWT_SECRET || "your_secret_key",
    {
      expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    }
  );
};

module.exports = generateToken;
