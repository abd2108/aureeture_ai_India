import type { Metadata } from "next"
import PolicyLayout from "../../../components/policy-layout"

export const metadata: Metadata = {
  title: "Return Policy | AureetureAI",
  description: "Read about AureetureAI's return policy for physical products (if applicable).",
  openGraph: {
    title: "Return Policy | AureetureAI",
    description: "Read about AureetureAI's return policy for physical products (if applicable).",
    url: "/policies/return-policy",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Return Policy | AureetureAI",
    description: "Read about AureetureAI's return policy for physical products (if applicable).",
  },
}

export default function ReturnPolicyPage() {
  return (
    <main className="min-h-screen pt-28 pb-16">
      <PolicyLayout title="Return Policy">
        <p className="text-muted-foreground">Last updated: September 20, 2025</p>

        <div className="mt-6">
          <h2>1. Digital Products Only</h2>
          <p>Aureeture AI provides access to:</p>
          <ul>
            <li>AI Copilots and smart mentorship tools</li>
            <li>Collaborative project environments</li>
            <li>Personalized dashboards and learning content</li>
            <li>Digital assets and educational resources</li>
          </ul>
          <p>Because these are <strong>intangible, instantly accessible services</strong>, traditional returns do not apply.</p>

          <h2>2. Refund Eligibility</h2>
          <p>
            While returns are not possible for digital services, you may be eligible for a <strong>refund</strong> under specific circumstances, as outlined in our <a href="/refund-cancellation" className="underline">Cancellation &amp; Refund Policy</a>:
          </p>
          <ul>
            <li>Accidental or duplicate purchases</li>
            <li>Critical technical issues that prevent access (and cannot be resolved by our support team)</li>
            <li>Requests made within the eligible timeframe and usage limits</li>
          </ul>
          <p>Refunds are not provided for dissatisfaction after substantial usage, or for content already consumed.</p>

          <h2>3. Non-Returnable Scenarios</h2>
          <ul>
            <li>You’ve accessed a significant portion of the platform or tools</li>
            <li>Your subscription converted from a free trial</li>
            <li>Your reason relates to change of mind or general dissatisfaction after usage</li>
            <li>The request falls outside the eligible refund window</li>
          </ul>

          <h2>4. Subscriptions and Billing</h2>
          <p>
            All subscriptions can be managed directly via your account settings, App Store, or Google Play (depending on the platform used for sign-up). Cancellation stops future billing but does <strong>not</strong> trigger a refund for the current billing cycle. You will retain access until the end of the subscription period.
          </p>

          <h2>5. Need Help?</h2>
          <p>If you have questions or concerns regarding your purchase, our team is happy to assist.</p>
          <ul>
            <li>📩 Email us at: <a href="mailto:support@aureeture.com">support@aureeture.com</a></li>
            <li>🕒 Support Hours: Monday to Saturday, 11:00 AM – 8:00 PM IST</li>
          </ul>
        </div>
      </PolicyLayout>
    </main>
  )
}
