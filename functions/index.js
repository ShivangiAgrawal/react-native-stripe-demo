/* eslint-disable promise/always-return */
const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
const stripe = require('stripe')('STRIPE_SECRET_KEY');

exports.completePaymentWithStripe = functions.https.onRequest(
  (request, response) => {
    stripe.charges
      .create({
        amount: 100,
        currency: 'inr',
        source: 'tok_mastercard',
      })
      .then((charge) => {
        console.log('Charge:::::: ', charge);
        response.send(charge);
      })
      .catch((error) => {
        console.log(error);
      });
  },
);
