import type { Metadata } from "next"
import PolicyLayout from "../../../components/policy-layout"

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy | AureetureAI",
  description: "Understand AureetureAI's refund and cancellation terms for purchases and subscriptions.",
  openGraph: {
    title: "Refund & Cancellation Policy | AureetureAI",
    description: "Understand AureetureAI's refund and cancellation terms for purchases and subscriptions.",
    url: "/policies/refund-cancellation",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund & Cancellation Policy | AureetureAI",
    description: "Understand AureetureAI's refund and cancellation terms for purchases and subscriptions.",
  },
}

export default function RefundCancellationPage() {
  return (
    <main className="min-h-screen pt-28 pb-16">
      <PolicyLayout title="Refund & Cancellation Policy">
        <p className="text-muted-foreground">Last updated: September 20, 2025</p>

        <div className="mt-6">
          <p>
            At Aureeture AI, we strive to deliver the best experience in project-building, AI mentorship, and upskilling for students and professionals. We understand that plans can change, so please review our cancellation and refund policy below.
          </p>

          <h2>1. Refund Policy</h2>
          <ul>
            <li>You may request a refund within <strong>24 hours</strong> of your <strong>initial purchase</strong> for both monthly and annual subscription plans.</li>
            <li>Refunds are only issued if the platform was used for <strong>less than 30 minutes</strong> during that 24-hour period.</li>
            <li>Refunds are applicable only in cases of:
              <ul>
                <li>Accidental purchases</li>
                <li>Technical errors that prevent access to platform features or services as described</li>
              </ul>
            </li>
          </ul>

          <h2>2. Non-Refundable Circumstances</h2>
          <ul>
            <li>Requests made after 24 hours from the initial purchase</li>
            <li>Platform usage of 30 minutes or more during the refund eligibility period</li>
            <li>Subscriptions that began as free trial conversions</li>
            <li>Dissatisfaction with content, learning experience, or expectations</li>
            <li>Violation of our Terms & Conditions</li>
            <li>Attempted misuse of the refund system</li>
          </ul>

          <h2>3. How to Request a Refund</h2>
          <ul>
            <li>Email us at <a href="mailto:support@aureeture.com">support@aureeture.com</a></li>
            <li>Use the subject line: <strong>Refund Request – [Your Registered Email]</strong></li>
            <li>Include your account email address, date of purchase, and a brief explanation of the issue</li>
          </ul>
          <p>Our team will review your request and respond within <strong>2 business days</strong>.</p>

          <h2>4. Refund Processing Time</h2>
          <ul>
            <li>If approved, refunds will be processed within <strong>2 business days</strong></li>
            <li>Funds will be returned to the original payment method</li>
            <li>Depending on your payment provider, it may take <strong>3–10 business days</strong> for the refund to appear in your account</li>
            <li>If refund is provided, it will be credited within <strong>7 days</strong></li>
          </ul>

          <h2>5. Subscription Cancellation</h2>
          <p>You may cancel your subscription at any time:</p>
          <ul>
            <li><strong>iOS Users:</strong> Visit your App Store settings &gt; Subscriptions</li>
            <li><strong>Android Users:</strong> Open Google Play Store &gt; Subscriptions</li>
            <li><strong>Web Users:</strong> Log into your dashboard and manage billing settings</li>
          </ul>
          <p><em>Note:</em> Cancellation prevents future charges but does <strong>not</strong> generate a refund. Your access to Aureeture will remain active until the end of the current billing cycle.</p>

          <h2>6. Free Trial Conversions</h2>
          <ul>
            <li>Subscriptions that auto-renew after a free trial are <strong>not eligible</strong> for refunds</li>
            <li>You must cancel at least <strong>24 hours</strong> before your trial ends to avoid being charged</li>
          </ul>

          <h2>7. Need Help?</h2>
          <p>If you have questions about cancellation or refund eligibility, reach out to us:</p>
          <ul>
            <li>📩 Email: <a href="mailto:support@aureeture.com">support@aureeture.com</a></li>
            <li>🕒 Support Hours: Monday to Saturday, 11:00 AM – 8:00 PM IST</li>
          </ul>
        </div>
      </PolicyLayout>
    </main>
  )
}
