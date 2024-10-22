const mercadopago = require('mercadopago');
const dotenv = require('dotenv');

dotenv.config();

class MercadopagoService {
  async execute({
    transaction_amount,
    token,
    description,
    installments,
    payment_method_id,
    email
  }) {
    mercadopago.configure({
      access_token: process.env.ACCESS_TOKEN
    });

    return await mercadopago.payment.save({
      transaction_amount,
      token,
      description,
      installments,
      payment_method_id,
      payer: { email }
    }).then(async (data) => {
      const { status, response } = data;
      const { id, transaction_amount, date_approved, card } = response;
      const { first_six_digits, last_four_digits, cardholder } = card;

      return {
        status,
        id,
        transaction_amount,
        date_approved,
        first_six_digits,
        last_four_digits,
        display_name: cardholder.name
      };
    });
  }
}

// Exporta a classe diretamente
module.exports = MercadopagoService;

