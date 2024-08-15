const AsyncHandler = require('express-async-handler');
const fs = require('fs');
const path = require('path');
const stripe = require('stripe')(
  'sk_test_51NZxakFZc1P48npZPrLNK1dqBGQzEA3bfH7Xd369P1xa5yfFoveUwYIBFJwIPBJrlvfrozU3IcbpgA4XAfvJ6FJp00rKkBXSbg',
);

exports.getPayment = AsyncHandler(async (req, res, next) => {
  const paymentData = await JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../../assets/payment.json')),
  );
  res.status(200).json({
    data: paymentData,
    success: true,
    message: `Get all data payment successfully.`,
  });
});

exports.postPayment = AsyncHandler(async (req, res, next) => {
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.monthlyPrice * 100,
    currency: 'usd',
    automatic_payment_methods: {
      enabled: true,
    },
    // locale: 'en',
  });

  res.status(200).json({
    success: true,
    clientSecret: paymentIntent.client_secret,
  });
});
