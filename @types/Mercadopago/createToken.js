/**
 * @typedef {function(HTMLFormElement, function(number, ISuccessRequest & IBadRequest): void): void} GetCreateToken
 */

/**
 * @typedef {function(number, ISuccessRequest & IBadRequest): void} CallbackGetCreateToken
 */

/**
 * @typedef {Object} ISuccessRequest
 * @property {number} card_number_length
 * @property {Object} cardholder
 * @property {Object} cardholder.identification
 * @property {string} cardholder.identification.number
 * @property {string} cardholder.identification.type
 * @property {string} cardholder.name
 * @property {string} date_created
 * @property {string} date_due
 * @property {string} date_last_updated
 * @property {number} expiration_month
 * @property {number} expiration_year
 * @property {string} first_six_digits
 * @property {string} id
 * @property {string} last_four_digits
 * @property {boolean} live_mode
 * @property {boolean} luhn_validation
 * @property {string} public_key
 * @property {boolean} require_esc
 * @property {number} security_code_length
 * @property {string} status
 */

/**
 * @typedef {Object} IBadRequest
 * @property {Array<ICauseBadRequest>} cause
 * @property {string} error
 * @property {string} message
 */

/**
 * @typedef {Object} ICauseBadRequest
 * @property {string} code
 * @property {string} description
 */

// Exemplo de implementação de uma função de criação de token
const getCreateToken = (settings, callback) => {
    // Implementação da função
    const status = 200; // Suponha que 200 seja o status de sucesso
    const response = {
      card_number_length: 16,
      cardholder: {
        identification: {
          number: "123456789",
          type: "CPF"
        },
        name: "John Doe"
      },
      date_created: "2024-10-23T12:00:00",
      date_due: "2024-12-23T12:00:00",
      date_last_updated: "2024-11-23T12:00:00",
      expiration_month: 12,
      expiration_year: 2025,
      first_six_digits: "123456",
      id: "abcd1234",
      last_four_digits: "7890",
      live_mode: true,
      luhn_validation: true,
      public_key: "public_key_123",
      require_esc: false,
      security_code_length: 3,
      status: "active"
    };
  
    // Chama o callback passando o status e o response
    callback(status, response);
  };
  
  // Exemplo de uso da função
  getCreateToken(document.querySelector('#formElement'), (status, response) => {
    if (status === 200) {
      console.log('Token criado com sucesso:', response);
    } else {
      console.error('Erro ao criar token:', response);
    }
  });
  