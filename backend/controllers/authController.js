const bcrypt = require("bcryptjs");
const Customer = require("../models/Customer");
const generateToken = require("../utils/generateToken");

/**
 * @desc    Register a new customer
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerCustomer = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields (name, email, password)" });
    }

    // Check if email already exists
    const customerExists = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (customerExists) {
      return res.status(400).json({ message: "An account with this email already exists" });
    }

    // Hash password (10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create customer (role defaults to "customer")
    const customer = await Customer.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      role: "customer"
    });

    if (customer) {
      return res.status(201).json({
        success: true,
        message: "Registration successful!",
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        role: customer.role,
        createdAt: customer.createdAt,
        updatedAt: customer.updatedAt,
      });
    } else {
      return res.status(400).json({ message: "Invalid customer data" });
    }
  } catch (error) {
    console.error("Register Controller Error:", error);
    return res.status(500).json({ message: error.message || "Server Error during registration" });
  }
};

/**
 * @desc    Authenticate customer & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate fields
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // Find customer by email (case-insensitive)
    const customer = await Customer.findOne({ email: email.toLowerCase().trim() });
    if (!customer) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check if customer is blocked
    if (customer.blocked) {
      return res.status(403).json({ message: "This account has been suspended" });
    }

    // If the account is a wholesaler, check approval status
    if (customer.role === 'wholesaler') {
      if (customer.wholesalerStatus === 'pending') {
        return res.status(403).json({
          message: 'Your wholesaler account is pending verification by our team.',
          wholesalerStatus: 'pending',
        });
      }
      if (customer.wholesalerStatus === 'rejected') {
        return res.status(403).json({
          message: 'Your wholesaler application has been rejected. Please contact support.',
          wholesalerStatus: 'rejected',
        });
      }
    }

    // Update lastLogin timestamp
    customer.lastLogin = new Date();
    await customer.save();

    // Generate JWT
    const token = generateToken(customer);

    // Return success response, excluding password
    return res.status(200).json({
      success: true,
      message: "Login successful!",
      token,
      _id: customer._id,
      name: customer.name,
      email: customer.email,
      role: customer.role || "customer",
      address: customer.address || "",
      phone: customer.phone || "",
      image: customer.image || "",
      profileComplete: customer.profileComplete,
      wholesalerStatus: customer.wholesalerStatus,
      lastLogin: customer.lastLogin,
      customer: {
        _id: customer._id,
        name: customer.name,
        email: customer.email,
        role: customer.role || "customer",
        address: customer.address || "",
        phone: customer.phone || "",
        image: customer.image || "",
        profileComplete: customer.profileComplete,
        wholesalerStatus: customer.wholesalerStatus,
        lastLogin: customer.lastLogin
      }
    });
  } catch (error) {
    console.error("Login Controller Error:", error);
    return res.status(500).json({ message: error.message || "Server Error during login" });
  }
};

/**
 * @desc    Get currently logged-in customer profile
 * @route   GET /api/auth/me
 * @access  Private
 */
const getMe = async (req, res) => {
  try {
    // req.customer is already attached in the protect middleware (excluding password)
    if (!req.customer) {
      return res.status(404).json({ message: "Customer profile not found" });
    }

    return res.status(200).json({
      success: true,
      customer: req.customer
    });
  } catch (error) {
    console.error("GetMe Controller Error:", error);
    return res.status(500).json({ message: error.message || "Server Error fetching profile" });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getMe
};
