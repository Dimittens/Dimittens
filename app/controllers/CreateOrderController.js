const MercadopagoService = require('../services/MercadopagoService'); // Ajuste aqui
const Order = require('../models/Order');

class CreateOrderController {
  async handler(req, res) {
    const {
      token,
      payment_method_id,
      transaction_amount,
      description,
      installments,
      email
    } = req.body;

    // Verificação simples para garantir que todos os campos estão preenchidos
    if (!token || !payment_method_id || !transaction_amount || !description || !installments || !email) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }

    const mercadopagoService = new MercadopagoService(); // Mudei o nome da variável para ser mais intuitivo
    const { status, ...rest } = await mercadopagoService.execute({
      token,
      payment_method_id,
      transaction_amount,
      description,
      installments,
      email
    });

    // Verifica o status da resposta do Mercado Pago
    if (status !== 201) {
      return res.status(400).json({ error: 'Falha de pagamento!' });
    }

    const data = await Order.create(rest);

    // Verifica se a criação da ordem foi bem-sucedida
    if (!data) {
      return res.status(500).json({ error: 'Falha ao salvar no banco!' });
    }

    // Retorna a resposta com o status e o corpo da nova ordem
    res.status(200).json({ status: 200, body: data });
  }
}

module.exports = new CreateOrderController();


