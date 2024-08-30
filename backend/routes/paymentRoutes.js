const express = require("express");
const router = express.Router();
const stripe = require("stripe")("sk_test_51PtFfiE9Am30zOrlPxu5HitLEu6v9PBGjNsivaQRlQsnDnYrM4pegv2LxjefI9AprIt9BlJGt7ojrwdBFKFjl2Fk002Zb6zfcr"); // Highly Sensitive

// Router endpoints
router.post("/intents", async (req, res) => {
  try {
    // Validate request data
    if (!req.body.amount || typeof req.body.amount !== 'number' || req.body.amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Create a paymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: req.body.amount, // Integer, 123 = 1.23
      currency: "myr",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Return the client_secret
    res.json({ paymentIntent: paymentIntent.client_secret });
  } catch (err) {
    res.status(400).json({
      error: err.message,
    });
  }
});

module.exports = router;
