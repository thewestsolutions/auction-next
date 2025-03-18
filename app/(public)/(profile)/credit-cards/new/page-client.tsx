"use client";

import { CreditCardForm, CreditCardFormData } from "@/components/forms/credit-card-form";
import { addCreditCard } from "./actions";
import { redirect } from "next/navigation";
import { toast } from "sonner";

interface PageClientProps {
  customerProfileId?: string;
}

export default function PageClient({ customerProfileId }: PageClientProps) {
  const handleSubmit = async (data: CreditCardFormData) => {
    const response = await addCreditCard({
      customerProfileId: customerProfileId!,
      cardNumber: data.cardNumber,
      expirationMonth: data.expiryMonth,
      expirationYear: data.expiryYear,
      cvv: data.cvc,
      firstName: data.firstName,
      lastName: data.lastName,
      address: data.address,
      city: data.city,
      state: data.state,
      zip: data.zip,
      country: data.country,
    });

    if (response.success) {
      toast.success("Credit card added");
      redirect("/credit-cards");
    } else {
      toast.error(response.error);
    }
  };

  return (
    <div>
      <CreditCardForm onSubmit={handleSubmit} />
    </div>
  );
}
