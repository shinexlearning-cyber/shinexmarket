import React from "react";
import { LegalPage } from "./LegalPage";

export function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      slug="privacy"
      sections={[
        { heading: "Information we collect", text: "We collect the information you provide when creating an account, such as your name, email, phone number, and listing details, along with basic usage data to keep the platform secure." },
        { heading: "How we use your information", text: "Your information is used to operate your account, connect you with buyers and sellers, process advertisement payments, and improve the marketplace experience." },
        { heading: "Sharing your information", text: "We only share the contact details you choose to make public on your profile (such as your WhatsApp number) with buyers who view your shop. We do not sell your data to third parties." },
        { heading: "Your choices", text: "You can update or delete your profile information at any time from your account settings, or contact our support team for help." },
      ]}
    />
  );
}
