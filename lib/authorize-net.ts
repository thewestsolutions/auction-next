import { APIContracts, APIControllers, Constants } from "authorizenet";
import { authorizeNetConfig } from "./authorize-net-config";

/**
 * Creates a merchant authentication object with credentials from config
 */
export function getMerchantAuthentication() {
  const merchantAuthenticationType = new APIContracts.MerchantAuthenticationType();
  merchantAuthenticationType.setName(authorizeNetConfig.apiLoginId);
  merchantAuthenticationType.setTransactionKey(authorizeNetConfig.transactionKey);
  return merchantAuthenticationType;
}

/**
 * Process a credit card payment
 */
export async function chargeCreditCard({
  cardNumber,
  expirationDate,
  cardCode,
  amount,
  description = "Payment transaction",
  customerEmail,
}: {
  cardNumber: string;
  expirationDate: string; // Format: 'MMYY'
  cardCode: string;
  amount: number;
  description?: string;
  customerEmail?: string;
}) {
  return new Promise<{
    success: boolean;
    transactionId?: string;
    message: string;
    responseCode?: string;
  }>((resolve) => {
    try {
      const merchantAuthenticationType = getMerchantAuthentication();

      // Set up credit card information
      const creditCard = new APIContracts.CreditCardType();
      creditCard.setCardNumber(cardNumber);
      creditCard.setExpirationDate(expirationDate);
      creditCard.setCardCode(cardCode);

      const paymentType = new APIContracts.PaymentType();
      paymentType.setCreditCard(creditCard);

      // Create order information
      const orderDetails = new APIContracts.OrderType();
      orderDetails.setDescription(description);

      // Set up customer information if provided
      let customerData;
      if (customerEmail) {
        customerData = new APIContracts.CustomerDataType();
        customerData.setEmail(customerEmail);
      }

      // Set up the transaction request
      const transactionRequestType = new APIContracts.TransactionRequestType();
      transactionRequestType.setTransactionType(
        APIContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
      );
      transactionRequestType.setPayment(paymentType);
      transactionRequestType.setAmount(amount);
      transactionRequestType.setOrder(orderDetails);
      if (customerData) {
        transactionRequestType.setCustomer(customerData);
      }

      // Create the API request and set the parameters
      const createRequest = new APIContracts.CreateTransactionRequest();
      createRequest.setMerchantAuthentication(merchantAuthenticationType);
      createRequest.setTransactionRequest(transactionRequestType);

      // Call the service
      const ctrl = new APIControllers.CreateTransactionController(createRequest.getJSON());

      // Set the environment
      if (authorizeNetConfig.environment === "production") {
        ctrl.setEnvironment(Constants.endpoint.production);
      }

      ctrl.execute(() => {
        const apiResponse = ctrl.getResponse();
        const response = new APIContracts.CreateTransactionResponse(apiResponse);

        if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
          const transactionResponse = response.getTransactionResponse();
          if (transactionResponse && transactionResponse.getResponseCode() === "1") {
            resolve({
              success: true,
              transactionId: transactionResponse.getTransId(),
              message: "Transaction approved",
              responseCode: transactionResponse.getResponseCode(),
            });
          } else {
            let errorMessage = "Transaction failed";
            if (transactionResponse && transactionResponse.getErrors()) {
              errorMessage = transactionResponse.getErrors().getError()[0].getErrorText();
            }
            resolve({
              success: false,
              message: errorMessage,
              responseCode: transactionResponse?.getResponseCode(),
            });
          }
        } else {
          let errorMessage = "Transaction failed";
          const errorMessages = response.getMessages().getMessage();
          if (errorMessages && errorMessages.length > 0) {
            errorMessage = errorMessages[0].getText();
          }
          resolve({
            success: false,
            message: errorMessage,
          });
        }
      });
    } catch (error) {
      resolve({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  });
}

/**
 * Create a customer payment profile for future transactions
 */
export async function createCustomerProfile({
  email,
  description,
  cardNumber,
  expirationDate,
  cardCode,
}: {
  email: string;
  description?: string;
  cardNumber: string;
  expirationDate: string;
  cardCode: string;
}) {
  return new Promise<{
    success: boolean;
    customerProfileId?: string;
    customerPaymentProfileId?: string;
    message: string;
  }>((resolve) => {
    try {
      const merchantAuthenticationType = getMerchantAuthentication();

      // Set up credit card information
      const creditCard = new APIContracts.CreditCardType();
      creditCard.setCardNumber(cardNumber);
      creditCard.setExpirationDate(expirationDate);
      creditCard.setCardCode(cardCode);

      const paymentType = new APIContracts.PaymentType();
      paymentType.setCreditCard(creditCard);

      // Create payment profile
      const paymentProfile = new APIContracts.CustomerPaymentProfileType();
      paymentProfile.setPayment(paymentType);

      // Create customer profile
      const customerProfile = new APIContracts.CustomerProfileType();
      customerProfile.setEmail(email);
      customerProfile.setDescription(description || `Customer profile for ${email}`);
      customerProfile.setPaymentProfiles([paymentProfile]);

      // Create the API request and set the parameters
      const createRequest = new APIContracts.CreateCustomerProfileRequest();
      createRequest.setProfile(customerProfile);
      createRequest.setMerchantAuthentication(merchantAuthenticationType);

      // Call the service
      const ctrl = new APIControllers.CreateCustomerProfileController(createRequest.getJSON());

      // Set the environment
      if (authorizeNetConfig.environment === "production") {
        ctrl.setEnvironment(Constants.endpoint.production);
      }

      ctrl.execute(() => {
        const apiResponse = ctrl.getResponse();
        const response = new APIContracts.CreateCustomerProfileResponse(apiResponse);

        if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
          resolve({
            success: true,
            customerProfileId: response.getCustomerProfileId(),
            customerPaymentProfileId: response
              .getCustomerPaymentProfileIdList()
              .getNumericString()[0],
            message: "Customer profile created successfully",
          });
        } else {
          let errorMessage = "Failed to create customer profile";
          const errorMessages = response.getMessages().getMessage();
          if (errorMessages && errorMessages.length > 0) {
            errorMessage = errorMessages[0].getText();
          }
          resolve({
            success: false,
            message: errorMessage,
          });
        }
      });
    } catch (error) {
      resolve({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  });
}

/**
 * Add a new credit card to an existing customer profile
 */
export async function addCreditCardToCustomerProfile({
  customerProfileId,
  cardNumber,
  expirationDate,
  cardCode,
  billTo,
}: {
  customerProfileId: string;
  cardNumber: string;
  expirationDate: string; // Format: 'MMYY'
  cardCode: string;
  billTo?: {
    firstName?: string;
    lastName?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
    phoneNumber?: string;
  };
}) {
  return new Promise<{
    success: boolean;
    customerPaymentProfileId?: string;
    message: string;
  }>((resolve) => {
    try {
      const merchantAuthenticationType = getMerchantAuthentication();

      // Set up credit card information
      const creditCard = new APIContracts.CreditCardType();
      creditCard.setCardNumber(cardNumber);
      creditCard.setExpirationDate(expirationDate);
      creditCard.setCardCode(cardCode);

      const paymentType = new APIContracts.PaymentType();
      paymentType.setCreditCard(creditCard);

      // Create payment profile
      const paymentProfile = new APIContracts.CustomerPaymentProfileType();
      paymentProfile.setPayment(paymentType);

      // Add billing information if provided
      if (billTo) {
        const customerAddress = new APIContracts.CustomerAddressType();
        if (billTo.firstName) customerAddress.setFirstName(billTo.firstName);
        if (billTo.lastName) customerAddress.setLastName(billTo.lastName);
        if (billTo.address) customerAddress.setAddress(billTo.address);
        if (billTo.city) customerAddress.setCity(billTo.city);
        if (billTo.state) customerAddress.setState(billTo.state);
        if (billTo.zip) customerAddress.setZip(billTo.zip);
        if (billTo.country) customerAddress.setCountry(billTo.country);
        if (billTo.phoneNumber) customerAddress.setPhoneNumber(billTo.phoneNumber);

        paymentProfile.setBillTo(customerAddress);
      }

      // Create the API request and set the parameters
      const createRequest = new APIContracts.CreateCustomerPaymentProfileRequest();
      createRequest.setMerchantAuthentication(merchantAuthenticationType);
      createRequest.setCustomerProfileId(customerProfileId);
      createRequest.setPaymentProfile(paymentProfile);
      createRequest.setValidationMode(APIContracts.ValidationModeEnum.LIVEMODE);

      // Call the service
      const ctrl = new APIControllers.CreateCustomerPaymentProfileController(
        createRequest.getJSON()
      );

      // Set the environment
      if (authorizeNetConfig.environment === "production") {
        ctrl.setEnvironment(Constants.endpoint.production);
      }

      ctrl.execute(() => {
        const apiResponse = ctrl.getResponse();
        const response = new APIContracts.CreateCustomerPaymentProfileResponse(apiResponse);

        if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
          resolve({
            success: true,
            customerPaymentProfileId: response.getCustomerPaymentProfileId(),
            message: "Credit card added successfully",
          });
        } else {
          let errorMessage = "Failed to add credit card";
          const errorMessages = response.getMessages().getMessage();
          if (errorMessages && errorMessages.length > 0) {
            errorMessage = errorMessages[0].getText();
          }
          resolve({
            success: false,
            message: errorMessage,
          });
        }
      });
    } catch (error) {
      resolve({
        success: false,
        message: error instanceof Error ? error.message : "An unknown error occurred",
      });
    }
  });
}
