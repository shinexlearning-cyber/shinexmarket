import React from "react";
import { LegalPage } from "./LegalPage";

export function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      slug="terms"
      sections={[
        { heading: "Using SHINEX", text: "By creating an account, you agree to list only items you're authorized to sell and to represent them accurately, including condition, price, and location." },
        { heading: "Prohibited listings", text: "Illegal goods, counterfeit items, and content that violates the law or infringes on others' rights are not permitted and will be removed." },
        { heading: "Payments and advertising", text: "Advertisement fees are processed securely through Paystack. Fees are non-refundable once an ad has started running." },
        { heading: "Account suspension", text: "SHINEX may suspend or remove accounts that violate these terms, receive repeated valid reports, or engage in fraudulent activity." },
      ]}
    />
  );
}
