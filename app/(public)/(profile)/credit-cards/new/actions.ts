"use server";

import { addCreditCardToCustomerProfile } from "@/lib/authorize-net";

export async function addCreditCard({
  customerProfileId,
  cardNumber,
  expirationYear,
  expirationMonth,
  cvv,
  firstName,
  lastName,
  address,
  city,
  state,
  zip,
  country,
}: {
  customerProfileId: string;
  cardNumber: string;
  expirationYear: string;
  expirationMonth: string;
  cvv: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}) {
  try {
    await addCreditCardToCustomerProfile({
      customerProfileId,
      cardNumber,
      expirationDate: `${expirationMonth}${expirationYear}`,
      cardCode: cvv,
      billTo: {
        firstName,
        lastName,
        address,
        city,
        state,
        zip,
        country,
      },
    });

    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
