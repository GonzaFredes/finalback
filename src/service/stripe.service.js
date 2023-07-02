const { default: Stripe } = require('stripe');

class StripeService {
  constructor() {
    this.stripe = new Stripe('sk_test_51NPAmiLqcyupffJlePUs3GmTk6MhEuXdRUjigXaArvL78icefDLUjr6EuJtaMgRK33l3F87cU9W2sGyRLUhVjS2100OUqm9mOq');
  }
  createPaymentIntents(data) {
    return this.stripe.paymentIntents.create(data);
  }
}
module.exports = new StripeService();