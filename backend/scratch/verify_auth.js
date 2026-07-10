const dns = require("node:dns/promises");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

require('../config/env');
const { connectDB } = require('../config/db');
const Customer = require('../models/Customer');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load our new backend implementations
const generateToken = require('../utils/generateToken');
const { protect } = require('../middleware/authMiddleware');

const TEST_EMAIL = `test_${Date.now()}@example.com`;
const TEST_PASSWORD = 'password123';
const TEST_NAME = 'Test User';

const runVerification = async () => {
  console.log('--- Auth Flow Verification Start ---');

  // 1. Database Connection
  await connectDB();
  console.log('1. Database connected successfully.');

  // 2. Registration Verification
  console.log('\n2. Verifying password hashing & registration...');
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, salt);

  const testCustomer = await Customer.create({
    name: TEST_NAME,
    email: TEST_EMAIL,
    password: hashedPassword,
    role: 'customer'
  });

  console.log('Customer created with hashed password.');
  console.log('Does email match?', testCustomer.email === TEST_EMAIL);
  console.log('Is password hashed?', testCustomer.password !== TEST_PASSWORD && testCustomer.password.startsWith('$2'));

  // 3. Login / Comparison Verification
  console.log('\n3. Verifying login & password comparison...');
  const foundCustomer = await Customer.findOne({ email: TEST_EMAIL });
  if (!foundCustomer) {
    throw new Error('Test customer not found after creation');
  }

  const isPasswordMatch = await bcrypt.compare(TEST_PASSWORD, foundCustomer.password);
  console.log('Password compare (correct):', isPasswordMatch);

  const isPasswordIncorrect = await bcrypt.compare('wrong_password', foundCustomer.password);
  console.log('Password compare (incorrect):', !isPasswordIncorrect);

  // 4. Token Generation Verification
  console.log('\n4. Verifying JWT generation...');
  const token = generateToken(foundCustomer);
  console.log('Generated JWT:', token ? 'Success (Token length: ' + token.length + ')' : 'Failed');

  const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
  console.log('Decoded payload customerId:', decoded.customerId);
  console.log('Decoded payload role:', decoded.role);
  console.log('Is customerId correct?', String(decoded.customerId) === String(foundCustomer._id));

  // 5. Middleware Verification
  console.log('\n5. Verifying auth middleware behavior...');
  let nextCalled = false;
  const mockReq = {
    headers: {
      authorization: `Bearer ${token}`
    }
  };
  const mockRes = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      this.body = data;
      return this;
    }
  };
  const mockNext = () => {
    nextCalled = true;
  };

  await protect(mockReq, mockRes, mockNext);
  console.log('Middleware attached customer object to request:', !!mockReq.customer);
  console.log('Is customer object correct ID?', String(mockReq.customer?._id) === String(foundCustomer._id));
  console.log('Is password excluded?', !mockReq.customer?.password);
  console.log('Did next() trigger?', nextCalled);

  // 6. Cleanup
  console.log('\n6. Cleaning up test customer...');
  await Customer.deleteOne({ _id: foundCustomer._id });
  console.log('Test customer deleted.');

  console.log('\n--- Verification Completed Successfully! ---');
  process.exit(0);
};

runVerification().catch(err => {
  console.error('\nVerification failed with error:', err);
  process.exit(1);
});
