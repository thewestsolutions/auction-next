"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User } from "@supabase/supabase-js";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FormMessage } from "@/components/ui/form";
import { useState } from "react";
import { createClient } from "@/src/lib/supabase-browser";
import { toast } from "sonner";

interface Props {
  user: User | null;
}

type FormData = {
  email: string;
  phone: string;
};

const schema = z.object({
  email: z.string().email(),
  phone: z.string().min(10).max(15),
});

export default function ProfileForm({ user }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const supabase = createClient();

  const form = useForm<FormData>({
    defaultValues: {
      email: user?.email,
      phone: user?.phone,
    },
    resolver: zodResolver(schema),
  });

  async function handleSubmit(data: FormData) {
    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({
      phone: data.phone,
    });

    if (error) {
      console.error(error);
    }

    toast.success("Profile updated");
    setIsLoading(false);
  }

  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <Card>
          <CardContent>
            <div className="grid grid-cols-[1fr_2fr] gap-x-4 gap-y-8">
              <p>Newletter</p>

              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <label
                  htmlFor="terms"
                  className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Accept terms and conditions
                </label>
              </div>

              <p>Contract Information</p>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <Label>Name</Label>
                  <Input
                    defaultValue={user?.email}
                    disabled
                    {...form.register("email")}
                    className={`${form.formState.errors.email ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input
                    id="phone"
                    {...form.register("phone")}
                    className={`${form.formState.errors.phone ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                  />
                  <FormMessage>{form.formState.errors.phone?.message}</FormMessage>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save"}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </FormProvider>
  );
}
