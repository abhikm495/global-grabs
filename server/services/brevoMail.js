const SibApiV3Sdk = require("sib-api-v3-sdk");
const template = require("../config/template");
const keys = require("../config/keys");

const { apiKey, sender } = keys.brevo; // Update your keys configuration to include Brevo details

class BrevoService {
  constructor() {
    this.apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
    const apiKeyInstance =
      SibApiV3Sdk.ApiClient.instance.authentications["api-key"];
    apiKeyInstance.apiKey = apiKey;
  }

  async sendEmail(config) {
    try {
      return await this.apiInstance.sendTransacEmail(config);
    } catch (error) {
      console.error("Error sending email:", error);
      throw error;
    }
  }
}

const brevo = new BrevoService();

exports.sendEmail = async (email, type, host, data) => {
  try {
    const message = prepareTemplate(type, host, data);

    const config = {
      sender: { name: "MERN Store!", email: sender },
      to: [{ email }],
      subject: message.subject,
      htmlContent: message.text, // Use HTML content instead of plain text for better formatting
    };

    return await brevo.sendEmail(config);
  } catch (error) {
    console.error("Error in sendEmail:", error);
    return error;
  }
};

const prepareTemplate = (type, host, data) => {
  let message;

  switch (type) {
    case "reset":
      message = template.resetEmail(host, data);
      break;

    case "reset-confirmation":
      message = template.confirmResetPasswordEmail();
      break;

    case "signup":
      message = template.signupEmail(data);
      break;

    case "merchant-signup":
      message = template.merchantSignup(host, data);
      break;

    case "merchant-welcome":
      message = template.merchantWelcome(data);
      break;

    case "newsletter-subscription":
      message = template.newsletterSubscriptionEmail();
      break;

    case "contact":
      message = template.contactEmail();
      break;

    case "merchant-application":
      message = template.merchantApplicationEmail();
      break;

    case "merchant-deactivate-account":
      message = template.merchantDeactivateAccount();
      break;

    case "order-confirmation":
      message = template.orderConfirmationEmail(data);
      break;

    default:
      message = "";
  }

  return message;
};
