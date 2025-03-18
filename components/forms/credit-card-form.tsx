"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";
import states from "@/assets/data/states.json";

const creditCardSchema = z.object({
  cardNumber: z
    .string()
    .length(16, "Credit card number must be 16 digits")
    .regex(/^\d+$/, "Credit card number must be a number"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  expiryMonth: z
    .string()
    .length(2, "Expiry month must be 2 digits")
    .regex(/^\d+$/, "Expiry month must be a number"),
  expiryYear: z
    .string()
    .length(2, "Expiry year must be 2 digits")
    .regex(/^\d+$/, "Expiry year must be a number"),
  cvc: z.string().length(3, "CVC must be 3 digits").regex(/^\d+$/, "CVC must be a number"),
  country: z.string().min(1, "Country is required"),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  zip: z.string().min(1, "Zip is required"),
  address: z.string().min(1, "Address is required"),
});

export type CreditCardFormData = z.infer<typeof creditCardSchema>;

interface CreditCardFormProps {
  onSubmit: (data: CreditCardFormData) => void;
}

export function CreditCardForm({ onSubmit }: CreditCardFormProps) {
  const form = useForm<CreditCardFormData>({
    defaultValues: {
      cardNumber: "4111111111111111", // Valid Visa card number for testing
      firstName: "John",
      lastName: "Doe",
      expiryMonth: "01",
      expiryYear: "30",
      cvc: "123",
      country: "US",
      state: "CA",
      city: "San Francisco",
      zip: "94101",
      address: "123 Main St",
    },
    resolver: zodResolver(creditCardSchema),
  });

  return (
    <Form {...form}>
      <form className="flex flex-col gap-4" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="grid grid-cols-6 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>First name</FormLabel>
                <Input {...field} placeholder="First name" className="col-span-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Last name</FormLabel>
                <Input {...field} placeholder="Last name" className="col-span-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cardNumber"
            render={({ field }) => (
              <FormItem className="col-span-6">
                <FormLabel>Credit card number</FormLabel>
                <Input {...field} placeholder="Credit card number" className="col-span-3" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiryMonth"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Expiry month</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="01">January</SelectItem>
                    <SelectItem value="02">February</SelectItem>
                    <SelectItem value="03">March</SelectItem>
                    <SelectItem value="04">April</SelectItem>
                    <SelectItem value="05">May</SelectItem>
                    <SelectItem value="06">June</SelectItem>
                    <SelectItem value="07">July</SelectItem>
                    <SelectItem value="08">August</SelectItem>
                    <SelectItem value="09">September</SelectItem>
                    <SelectItem value="10">October</SelectItem>
                    <SelectItem value="11">November</SelectItem>
                    <SelectItem value="12">December</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="expiryYear"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Expiry year</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a year" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 15 }, (_, i) => (
                      <SelectItem
                        key={i}
                        value={`${(new Date().getFullYear() + i).toString().slice(-2)}`}
                      >
                        {new Date().getFullYear() + i}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cvc"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>CVC</FormLabel>
                <Input {...field} placeholder="CVC" />
              </FormItem>
            )}
          />

          {/* Country */}
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Country</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="US">United States</SelectItem>
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>State</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a state" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(states).map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />

          {/* Zip */}
          <FormField
            control={form.control}
            name="zip"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Zip</FormLabel>
                <Input {...field} placeholder="Zip" />
              </FormItem>
            )}
          />

          {/* Address */}
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>Address</FormLabel>
                <Input {...field} placeholder="Address" />
              </FormItem>
            )}
          />

          {/* City */}
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="col-span-3">
                <FormLabel>City</FormLabel>
                <Input {...field} placeholder="City" />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-fit">
          Submit
        </Button>
      </form>
    </Form>
  );
}
