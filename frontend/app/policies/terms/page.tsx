import type { Metadata } from "next"
import PolicyLayout from "../../../components/policy-layout"

export const metadata: Metadata = {
  title: "Terms & Conditions | AureetureAI",
  description: "Read the terms and conditions for using AureetureAI's services.",
  openGraph: {
    title: "Terms & Conditions | AureetureAI",
    description: "Read the terms and conditions for using AureetureAI's services.",
    url: "/policies/terms",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms & Conditions | AureetureAI",
    description: "Read the terms and conditions for using AureetureAI's services.",
  },
}

export default function TermsPage() {
  return (
    <main className="min-h-screen pt-28 pb-16">
      <PolicyLayout title="Terms & Conditions">
        <p className="text-muted-foreground">Last updated: September 20, 2025</p>

        <div className="mt-6">
          <p><strong>Platform:</strong> <a href="https://aureeture.in" target="_blank" rel="noreferrer" className="underline">https://aureeture.in</a></p>

          <h2>Introduction</h2>
          <p>
            Welcome to Aureeture! These Terms of Service (“Terms”) govern your use of the Aureeture web application and services (“Platform”) provided by Aureeture AI. By accessing or using our Platform, you agree to be bound by these Terms. If you do not agree with any part of these Terms, please refrain from using our Platform.
          </p>

          <h2>Eligibility</h2>
          <p>
            You must be at least <strong>13 years old</strong> to use our Platform. By accessing or using our services, you represent and warrant that you are at least 13 years of age and legally capable of entering into a binding agreement.
          </p>

          <h2>Accounts and User Responsibility</h2>
          <p>
            To access certain features, you may need to register and create an account. You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.
          </p>
          <p>
            You agree to notify us immediately of any unauthorized use or breach of security. Aureeture is not liable for any loss or damage resulting from your failure to comply with this responsibility.
          </p>

          <h2>License and Usage Restrictions</h2>
          <p>
            Subject to these Terms, Aureeture AI grants you a limited, non-exclusive, non-transferable, and revocable license to use the Platform for personal, educational, or professional purposes.
          </p>
          <p>You agree not to:</p>
          <ul>
            <li>Reverse-engineer, decompile, or disassemble any part of the Platform.</li>
            <li>Use bots, scrapers, or other automated tools to access or use the Platform.</li>
            <li>Exploit or distribute the Platform for commercial purposes without written consent.</li>
            <li>Upload or distribute malicious code, spam, or offensive content.</li>
            <li>Interfere with or disrupt the integrity of the Platform or any user’s experience.</li>
          </ul>

          <h2>In-App Features and Subscriptions</h2>
          <p>
            Aureeture may offer both free and premium (paid) services, including mentorship, AI tools, and project collaboration resources. By subscribing or purchasing any paid features, you agree to:
          </p>
          <ul>
            <li>Pay all applicable fees through authorized payment channels.</li>
            <li>Understand that fees are generally non-refundable unless required by law.</li>
            <li>Manage your subscription renewals or cancellations via the appropriate interface or app store.</li>
          </ul>
          <p>
            Aureeture reserves the right to modify pricing, features, and availability of its services at any time.
          </p>

          <h2>Intellectual Property</h2>
          <p>
            All rights, title, and interest in the Platform—including but not limited to design, UI, content, code, trademarks, and branding—remain the property of <strong>Aureeture AI</strong> and its licensors.
          </p>
          <p>
            You are not granted any ownership or intellectual property rights by using the Platform, except for the limited license mentioned above.
          </p>

          <h2>User Content</h2>
          <p>
            You may create, upload, or share content (such as project ideas, feedback, or messages) through the Platform. You retain ownership of your content but grant Aureeture a <strong>non-exclusive, royalty-free, worldwide license</strong> to use, display, reproduce, and promote it for service enhancement and marketing purposes.
          </p>
          <p>You confirm that your content:</p>
          <ul>
            <li>Is your original creation or properly licensed.</li>
            <li>Does not infringe on intellectual property, privacy, or rights of others.</li>
            <li>Does not violate any law, regulation, or community standard.</li>
          </ul>

          <h2>Termination</h2>
          <p>
            Aureeture reserves the right to suspend or terminate your account or access to the Platform at its sole discretion if:
          </p>
          <ul>
            <li>You breach any of these Terms.</li>
            <li>You misuse or disrupt the platform.</li>
            <li>We are required to do so by law.</li>
          </ul>
          <p>
            Upon termination, you must cease all use and delete any copies of the Platform from your devices.
          </p>

          <h2>Disclaimers</h2>
          <p>
            The Platform is provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind, whether express or implied.
          </p>
          <p>We do not guarantee:</p>
          <ul>
            <li>The Platform will be error-free or always available.</li>
            <li>Results from using AI suggestions will be accurate or suited to your needs.</li>
            <li>That user experience will be uninterrupted or secure.</li>
          </ul>

          <h2>Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by law, Aureeture AI and its affiliates shall not be liable for:
          </p>
          <ul>
            <li>Any indirect, incidental, special, or consequential damages.</li>
            <li>Any loss of profits, data, reputation, or business interruption.</li>
            <li>Any unauthorized access or use of your data.</li>
          </ul>
          <p>
            In no case shall our liability exceed the amount paid by you (if any) in the twelve months prior to the claim.
          </p>

          <h2>Indemnification</h2>
          <p>
            You agree to indemnify, defend, and hold harmless Aureeture AI, its team, and partners from any claims, liabilities, damages, costs, or losses arising from:
          </p>
          <ul>
            <li>Your violation of these Terms.</li>
            <li>Your content infringing on third-party rights.</li>
            <li>Misuse of the Platform.</li>
          </ul>

          <h2>Governing Law and Jurisdiction</h2>
          <p>
            These Terms are governed by the laws of <strong>India</strong>. Any disputes arising from these Terms or use of the Platform shall be subject to the exclusive jurisdiction of the courts located in <strong>Jaunpur, Uttar Pradesh</strong>.
          </p>

          <h2>Modifications to Terms</h2>
          <p>
            We may update these Terms from time to time. Changes will be posted on this page, and the “Effective Date” at the top will be updated accordingly. Continued use of the Platform after any changes implies acceptance of the revised Terms.
          </p>

          <h2>Contact Information</h2>
          <p>
            If you have any questions, concerns, or need assistance related to these Terms, please reach out to us:
          </p>
          <ul>
            <li>📧 Email: <a href="mailto:support@aureeture.com">support@aureeture.com</a></li>
            <li>🕒 Support Hours: Monday – Saturday, 11:00 AM – 8:00 PM IST</li>
          </ul>
        </div>
      </PolicyLayout>
    </main>
  )
}
