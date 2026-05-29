require("dotenv").config();
const express = require("express");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(".")); // Serve your HTML/CSS/JS files

app.post("/create-checkout-session", async (req, res) => {
  const { cart, name, phone } = req.body;

  // Convert cart items into Stripe line items
  const lineItems = cart.map(item => ({
    price_data: {
      currency: "$", // USD
      product_data: { name: item.name },
      unit_amount: Math.round(item.price * 100), // Stripe uses cents
    },
    quantity: item.qty,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://localhost:3000/success.html",
    cancel_url: "http://localhost:3000/",
    customer_email: undefined,
    metadata: { customer_name: name, phone }
  });

  res.json({ url: session.url });
});

app.listen(3000, () => console.log("Server running at http://localhost:3000"));