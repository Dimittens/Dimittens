/**
 * @typedef {function({ bin: string, payment_method_id?: string }, CallbackGetPaymentMethod): void} GetPaymentMethod
 */

/**
 * @typedef {function(number, Array<PaymentMethodResponse>): void} CallbackGetPaymentMethod
 */

/**
 * @typedef {Object} PaymentMethodResponse
 * @property {number} accreditation_time
 * @property {Array<string>} additional_info_needed
 * @property {string} deferred_capture
 * @property {Array<any>} financial_institutions
 * @property {string} id
 * @property {number} max_allowed_amount
 * @property {number} min_allowed_amount
 * @property {string} name
 * @property {string} payment_type_id
 * @property {Array<string>} processing_modes
 * @property {string} secure_thumbnail
 * @property {Array<Settings>} settings
 * @property {string} status
 * @property {string} thumbnail
 * @property {string} [error]
 * @property {Cause[]|Cause} [cause]
 * @property {string} [message]
 */

/**
 * @typedef {Object} Settings
 * @property {Object} bin
 * @property {string} bin.pattern
 * @property {string} bin.installments_pattern
 * @property {string} bin.exclusion_pattern
 * @property {Object} card_number
 * @property {number} card_number.length
 * @property {string} card_number.validation
 * @property {Object} security_code
 * @property {string} security_code.mode
 * @property {string} security_code.card_location
 * @property {number} security_code.length
 */

// Exemplo de implementação da função GetPaymentMethod
const getPaymentMethod = (settings, callback) => {
    // Simulação de um status e resposta
    const status = 200;
  
    const response = [
      {
        accreditation_time: 24,
        additional_info_needed: ['cardholder_name', 'cardholder_identification'],
        deferred_capture: 'optional',
        financial_institutions: [],
        id: "visa",
        max_allowed_amount: 5000,
        min_allowed_amount: 100,
        name: "Visa",
        payment_type_id: "credit_card",
        processing_modes: ['aggregator'],
        secure_thumbnail: "https://example.com/secure_thumbnail.png",
        settings: [
          {
            bin: {
              pattern: "4",
              installments_pattern: ".*",
              exclusion_pattern: "123456"
            },
            card_number: {
              length: 16,
              validation: "standard"
            },
            security_code: {
              mode: "mandatory",
              card_location: "back",
              length: 3
            }
          }
        ],
        status: "active",
        thumbnail: "https://example.com/thumbnail.png"
      }
    ];
  
    // Chama o callback com o status e a resposta simulada
    callback(status, response);
  };
  
  // Exemplo de uso da função
  getPaymentMethod({ bin: "411111" }, (status, response) => {
    if (status === 200) {
      console.log("Métodos de pagamento recebidos:", response);
    } else {
      console.error("Erro ao obter métodos de pagamento.");
    }
  });
  