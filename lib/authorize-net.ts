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

export async function createCustomerProfile({
  email,
  description,
}: {
  email: string;
  description?: string;
}) {
  return new Promise<string>((resolve, reject) => {
    try {
      const merchantAuthenticationType = getMerchantAuthentication();

      // Create customer profile
      const customerProfile = new APIContracts.CustomerProfileType();
      customerProfile.setEmail(email);
      customerProfile.setDescription(description || `Customer profile for ${email}`);

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
          resolve(response.getCustomerProfileId());
        } else {
          const errorMessages = response.getMessages().getMessage();
          const errorMessage =
            errorMessages && errorMessages.length > 0
              ? errorMessages[0].getText()
              : "Failed to create customer profile";

          reject(new Error(errorMessage));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

// Add this helper function to lookup existing profiles
export async function getCustomerProfileIdByEmail(email: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const merchantAuthenticationType = getMerchantAuthentication();

    // Create request to get customer profile IDs
    const getRequest = new APIContracts.GetCustomerProfileIdsRequest();
    getRequest.setMerchantAuthentication(merchantAuthenticationType);

    const ctrl = new APIControllers.GetCustomerProfileIdsController(getRequest.getJSON());

    if (authorizeNetConfig.environment === "production") {
      ctrl.setEnvironment(Constants.endpoint.production);
    }

    ctrl.execute(() => {
      const response = new APIContracts.GetCustomerProfileIdsResponse(ctrl.getResponse());

      if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
        const profileIds = response.getIds().getNumericString();

        if (!profileIds || profileIds.length === 0) {
          reject(new Error("No customer profiles found"));
          return;
        }

        // Now we need to check each profile to find the one with matching email
        findProfileWithEmail(profileIds, email)
          .then((matchingProfileId) => resolve(matchingProfileId))
          .catch((err) => reject(err));
      } else {
        reject(new Error("Failed to retrieve customer profile IDs"));
      }
    });
  });
}

async function findProfileWithEmail(profileIds: string[], email: string): Promise<string> {
  // This checks each profile ID until it finds the one with the matching email
  for (const profileId of profileIds) {
    const profile = await getCustomerProfile(profileId);
    if (profile.email === email) {
      return profileId;
    }
  }

  throw new Error(`No profile found with email: ${email}`);
}

async function getCustomerProfile(profileId: string): Promise<{ email: string }> {
  return new Promise((resolve, reject) => {
    const merchantAuthenticationType = getMerchantAuthentication();

    const getRequest = new APIContracts.GetCustomerProfileRequest();
    getRequest.setMerchantAuthentication(merchantAuthenticationType);
    getRequest.setCustomerProfileId(profileId);

    const ctrl = new APIControllers.GetCustomerProfileController(getRequest.getJSON());

    if (authorizeNetConfig.environment === "production") {
      ctrl.setEnvironment(Constants.endpoint.production);
    }

    ctrl.execute(() => {
      const response = new APIContracts.GetCustomerProfileResponse(ctrl.getResponse());

      if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
        const profile = response.getProfile();
        resolve({
          email: profile.getEmail(),
        });
      } else {
        reject(new Error("Failed to retrieve customer profile"));
      }
    });
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
  return new Promise<string>((resolve, reject) => {
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
          resolve(response.getCustomerPaymentProfileId());
        } else {
          let errorMessage = "Failed to add credit card";
          const errorMessages = response.getMessages().getMessage();
          if (errorMessages && errorMessages.length > 0) {
            errorMessage = errorMessages[0].getText();
          }
          reject(new Error(errorMessage));
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}

export async function getCustomerPaymentProfiles(customerProfileId: string) {
  return new Promise<APIContracts.CustomerPaymentProfileMaskedType[]>((resolve, reject) => {
    const merchantAuthenticationType = getMerchantAuthentication();

    // Use GetCustomerProfileRequest instead
    const getRequest = new APIContracts.GetCustomerProfileRequest();
    getRequest.setMerchantAuthentication(merchantAuthenticationType);
    getRequest.setCustomerProfileId(customerProfileId);

    const ctrl = new APIControllers.GetCustomerProfileController(getRequest.getJSON());

    if (authorizeNetConfig.environment === "production") {
      ctrl.setEnvironment(Constants.endpoint.production);
    }

    ctrl.execute(() => {
      const response = new APIContracts.GetCustomerProfileResponse(ctrl.getResponse());

      if (response.getMessages().getResultCode() === APIContracts.MessageTypeEnum.OK) {
        const profile = response.getProfile();
        const paymentProfiles = profile.getPaymentProfiles();
        resolve(paymentProfiles || []);
      } else {
        reject(new Error("Failed to retrieve customer payment profiles"));
      }
    });
  });
}
