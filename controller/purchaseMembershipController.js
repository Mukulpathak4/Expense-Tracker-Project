const Razorpay = require("razorpay");
const Order = require("../models/orderModel"); // Import the Order model
const userController = require("./userController"); // Import the userController for token generation

require('dotenv').config();

// Retrieve Razorpay API credentials from environment variables
const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

// Controller function to purchase premium
const purchasePremium = async (req, res) => {
  try {
    // Create a new Razorpay instance with API credentials
    const rzp = new Razorpay({
      key_id: razorpayKeyId,
      key_secret: razorpayKeySecret,
    });

    // Define the amount for the premium membership (in this case, 50000 INR)
    const amount = 5000;

    // Create a Razorpay order with the specified amount and currency
    const order = await rzp.orders.create({ amount, currency: "INR" });

    // Create a new order record in the database associated with the user
    const newOrder = await Order.create({ paymentid: order.id, status: "PENDING", user: req.user._id });

    // Return a success response with order details and Razorpay key ID
    res.status(201).json({ order, key_id: razorpayKeyId });
  } catch (err) {
    console.error("Error creating Razorpay object:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Controller function to update the transaction status for a premium membership purchase
const updateTransactionStatus = async (req, res) => {
  try {
    const userId = req.user._id;
    const { payment_id, order_id } = req.body;

    // Find the corresponding order in the database based on the order ID
    const order = await Order.findOne({ orderid: order_id, user: userId });

    // Update the order with the payment ID and set the status to "SUCCESSFUL"
    await order.updateOne({ paymentid: payment_id, status: "SUCCESSFUL" });

    // Update the user's status to indicate they are a premium user
    await User.findByIdAndUpdate(userId, { isPremiumUser: true });

    // Return a success response with a new access token
    res.status(202).json({
      success: true,
      message: "Transaction Successful",
      token: userController.generateAccessToken(userId, undefined, true), // Generate a new access token with premium status
    });
  } catch (err) {
    console.log(err);
    res.status(403).json({ error: err, message: "Something went wrong" });
  }
};

module.exports = {
  purchasePremium,
  updateTransactionStatus
};