const SibApiV3Sdk = require("sib-api-v3-sdk");
const keys = require("../config/keys");

const { apiKey, listKey } = keys.brevo; // Your API key and List ID (listKey)

class BrevoService {
  constructor() {
    this.apiInstance = new SibApiV3Sdk.ContactsApi(); // Use ContactsApi for managing contacts
    const apiKeyInstance =
      SibApiV3Sdk.ApiClient.instance.authentications["api-key"];
    apiKeyInstance.apiKey = apiKey;
  }

  async subscribeToNewsletter(email) {
    try {
      const response = await this.apiInstance.createContact({
        email: email,
        listIds: [parseInt(listKey)], // Ensure listKey is a number
        updateEnabled: false, // Don't update if the contact already exists
      });
      return response;
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      throw error;
    }
  }
}

const brevoService = new BrevoService();

exports.subscribeToNewsletter = async (email) => {
  try {
    return await brevoService.subscribeToNewsletter(email);
  } catch (error) {
    return error;
  }
};
