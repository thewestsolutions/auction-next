import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata = {
  title: "Terms and Conditions | Auction",
  description: "Terms and conditions for using our auction platform",
};

export default function TermsAndConditionsPage() {
  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Terms and Conditions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <section>
            <h2 className="mb-2 text-xl font-semibold">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this auction platform, you accept and agree to be bound by the
              terms and provisions of this agreement. If you do not agree to abide by these terms,
              please do not use this service.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">2. Eligibility</h2>
            <p>
              You must be at least 18 years old and capable of forming legally binding contracts to
              use our services. By using our platform, you represent and warrant that you meet these
              requirements.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">3. Bidding Rules</h2>
            <p>
              All bids are binding. Once you place a bid, you are committed to purchasing the item
              if you are the winning bidder. Bids cannot be retracted once placed. The minimum bid
              increment is $10.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">4. Payment and Fees</h2>
            <p>
              Payment for won items must be made within 48 hours of auction close. We accept major
              credit cards and PayPal. A buyer&apos;s premium of 5% will be added to the final bid
              price.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">5. Shipping and Delivery</h2>
            <p>
              Shipping costs are the responsibility of the buyer. Items will be shipped within 5
              business days after payment is received. International shipping may be subject to
              customs fees.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">6. Returns and Refunds</h2>
            <p>
              All sales are final unless the item received significantly differs from its
              description. Claims must be made within 7 days of receiving the item.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">7. Account Security</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account information
              and password. You agree to notify us immediately of any unauthorized use of your
              account.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">8. Prohibited Activities</h2>
            <p>
              Users are prohibited from engaging in any fraudulent bidding, shill bidding, or any
              activity that manipulates the bidding process. Violation may result in account
              termination.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">9. Limitation of Liability</h2>
            <p>
              We are not responsible for any damages, including but not limited to, direct,
              indirect, incidental, consequential, or punitive damages arising out of your use of
              our platform.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">10. Changes to Terms</h2>
            <p>
              We reserve the right to modify these terms at any time. Changes will be effective
              immediately upon posting. Your continued use of the platform constitutes acceptance of
              the modified terms.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">11. Governing Law</h2>
            <p>
              These terms shall be governed by and construed in accordance with the laws of the
              jurisdiction in which our company is registered, without regard to its conflict of law
              provisions.
            </p>
          </section>

          <section>
            <h2 className="mb-2 text-xl font-semibold">12. Contact Information</h2>
            <p>
              If you have any questions about these Terms and Conditions, please contact us at
              support@auctionplatform.com.
            </p>
          </section>

          <p className="text-muted-foreground mt-8 text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
