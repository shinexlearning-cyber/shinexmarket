# SHINEX Version 1 — WhatsApp-first marketplace

This version intentionally exposes no cart, checkout, order, or purchase flow in the user frontend.

Customer flow:
Browse/search -> product details -> seller information -> Contact Seller on WhatsApp.

The backend and admin frontend were inspected and are unchanged. Seller WhatsApp uses the existing profile `whatsapp` value, with the existing `phone` value as a fallback; no seller number is hardcoded.

Future cart/checkout functionality can be reintroduced later without changing the current marketplace discovery flow.
