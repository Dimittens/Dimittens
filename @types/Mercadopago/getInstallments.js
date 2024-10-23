/**
 * @typedef {function({ bin: string, amount: number }, CallbackGetInstallments): void} GetInstallments
 */

/**
 * @typedef {function(number, Array<InstallmentResponse>): void} CallbackGetInstallments
 */

/**
 * @typedef {Object} InstallmentResponse
 * @property {null} agreements
 * @property {Object} issuer
 * @property {string} issuer.id
 * @property {string} issuer.name
 * @property {string} issuer.secure_thumbnail
 * @property {string} issuer.thumbnail
 * @property {null} merchant_account_id
 * @property {Array<PayerCost>} payer_costs
 * @property {string} payment_method_id
 * @property {string} payment_type_id
 */

/**
 * @typedef {Object} PayerCost
 * @property {number} discount_rate
 * @property {number} installment_amount
 * @property {number} installment_rate
 * @property {Array<string>} installment_rate_collector
 * @property {number} installments
 * @property {Array} labels
 * @property {number} max_allowed_amount
 * @property {number} min_allowed_amount
 * @property {string} payment_method_option_id
 * @property {string} recommended_message
 * @property {null} reimbursement_rate
 */

// Exemplo de implementação da função de parcelamento
const getInstallments = (settings, callback) => {
    // Suponha que o status de sucesso seja 200 e o response seja uma simulação
    const status = 200;
  
    const response = [
      {
        agreements: null,
        issuer: {
          id: "issuer123",
          name: "Bank XYZ",
          secure_thumbnail: "https://example.com/secure_thumbnail.png",
          thumbnail: "https://example.com/thumbnail.png"
        },
        merchant_account_id: null,
        payer_costs: [
          {
            discount_rate: 10,
            installment_amount: 100,
            installment_rate: 5,
            installment_rate_collector: ["collector1"],
            installments: 12,
            labels: [],
            max_allowed_amount: 5000,
            min_allowed_amount: 100,
            payment_method_option_id: "option_123",
            recommended_message: "Pague em 12 parcelas de 100",
            reimbursement_rate: null
          }
        ],
        payment_method_id: "visa",
        payment_type_id: "credit_card"
      }
    ];
  
    // Chama o callback com o status e a resposta simulada
    callback(status, response);
  };
  
  // Exemplo de uso da função
  getInstallments({ bin: "123456", amount: 1000 }, (status, response) => {
    if (status === 200) {
      console.log("Parcelamentos recebidos:", response);
    } else {
      console.error("Erro ao obter parcelamentos.");
    }
  });
  