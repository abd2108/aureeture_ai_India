import type { Metadata } from "next"
import PolicyLayout from "@/components/policy-layout"

export const metadata: Metadata = {
  title: "Privacy Policy | AureetureAI",
  description: "Learn how AureetureAI collects, uses, and protects your personal data.",
  openGraph: {
    title: "Privacy Policy | AureetureAI",
    description: "Learn how AureetureAI collects, uses, and protects your personal data.",
    url: "/policies/privacy-policy",
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Privacy Policy | AureetureAI",
    description: "Learn how AureetureAI collects, uses, and protects your personal data.",
  },
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen pt-28 pb-16">
      <PolicyLayout title="Privacy Policy">
        <p className="text-muted-foreground">Last updated: September 20, 2025</p>

        <div className="mt-6">
          <p>
            At Aureeture AI ("we", "us", or "our"), we are committed to safeguarding your privacy. This Privacy Policy outlines how we collect, use, store, share, and protect your personal information when you access or use the Aureeture platform, available at <a href="https://aureeture.in" target="_blank" rel="noreferrer" className="underline">https://aureeture.in</a> (referred to as the “Platform”), including all related services, tools, and interactions.
          </p>

          <h2>1. Information We Collect</h2>
          <p>When you use the Aureeture Platform, we may collect the following categories of information:</p>
          <ul>
            <li><strong>Personal Information:</strong> Information you voluntarily provide while registering or updating your account, such as your name, email address, profile image, educational background, or contact number.</li>
            <li><strong>Usage Data:</strong> Technical information such as device details, IP address, browser type, session activity, referring URLs, and the pages you visit on the Platform.</li>
            <li><strong>Content Input:</strong> Data shared while using our AI Copilots, mentorship features, projects, and community interactions, including text, media, and project files.</li>
            <li><strong>Payment Information:</strong> For users making purchases, we collect transactional details such as product selected, amount, and timestamp via secure third-party payment gateways (we do not store payment credentials).</li>
          </ul>

          <h2>2. How We Use Your Information</h2>
          <ul>
            <li>Provide, personalize, and improve your experience on the Platform</li>
            <li>Facilitate project-building, AI interactions, mentorship feedback, and learning paths</li>
            <li>Deliver transactional emails, service alerts, product updates, and support responses</li>
            <li>Maintain security, detect fraud, prevent abuse, and enforce our Terms & Conditions</li>
            <li>Analyze usage trends and platform engagement to improve performance</li>
          </ul>

          <h2>3. Sharing of Information</h2>
          <p>We do not sell or rent your personal information. However, we may share it in the following circumstances:</p>
          <ul>
            <li><strong>Service Providers:</strong> With third-party vendors offering hosting, analytics, customer support, and payment processing services, under confidentiality agreements</li>
            <li><strong>Legal Obligations:</strong> When required by law, legal processes, court orders, or to defend our legal rights</li>
            <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or restructuring, your data may be transferred as part of that transaction under strict privacy commitments</li>
          </ul>

          <h2>4. Data Security</h2>
          <p>
            We implement industry-standard security protocols to protect your information, including encryption, access controls, and secure servers. While we strive to protect your personal information, no system can be 100% secure. You are also responsible for keeping your credentials safe and confidential.
          </p>

          <h2>5. Data Retention</h2>
          <p>
            We retain your personal data only as long as necessary to fulfill the purposes outlined in this Privacy Policy or to comply with legal obligations. User-generated content and account information may be retained until your account is deleted or upon specific request, subject to applicable laws.
          </p>

          <h2>6. Your Rights and Choices</h2>
          <ul>
            <li>Access, update, or delete your account information via your user dashboard</li>
            <li>Request complete deletion of your personal data by contacting us at <a href="mailto:support@aureeture.com">support@aureeture.com</a></li>
            <li>Opt-out of non-essential communications at any time through provided unsubscribe options</li>
          </ul>
          <p>We will act on your request in accordance with applicable data protection laws and within a reasonable time.</p>

          <h2>7. Cookies and Tracking Technologies</h2>
          <p>
            We use cookies and similar technologies to enhance user experience, analyze site traffic, remember preferences, and provide relevant content. You can manage your cookie preferences via your browser settings.
          </p>

          <h2>8. Third-Party Services</h2>
          <p>
            The Platform may link to or embed services from third-party websites and tools. We are not responsible for their data practices or content. We recommend reviewing the privacy policies of any third-party service you interact with through our Platform.
          </p>

          <h2>9. Children's Privacy</h2>
          <p>
            Our Platform is not intended for individuals under the age of 13. We do not knowingly collect personal information from children. If we become aware that data from a child has been collected, we will take steps to delete it promptly.
          </p>

          <h2>10. Changes to This Policy</h2>
          <p>
            We may update this Privacy Policy from time to time to reflect changes in technology, legal requirements, or our data practices. When we do, we will update the "Effective Date" at the top of this page. Continued use of the Platform indicates your acceptance of the revised policy.
          </p>

          <h2>11. Contact Us</h2>
          <p>
            If you have questions, requests, or concerns regarding this Privacy Policy or our data handling practices, please contact us at:
          </p>
          <ul>
            <li>📩 Email: <a href="mailto:aureeture@gmail.com">aureeture@gmail.com</a></li>
            <li>🕒 Support Hours: Monday to Saturday, 11:00 AM to 8:00 PM IST</li>
          </ul>
        </div>
      </PolicyLayout>
    </main>
  )
}
