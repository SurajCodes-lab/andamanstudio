// Payment gateway seam — CCAvenue will be wired here later.
//
// To integrate CCAvenue: implement createPaymentLink() to build the encrypted
// request + redirect URL (CCAvenue uses an AES-encrypted `encRequest` posted to
// their transaction URL), and add a webhook/return handler at /api/pay/callback
// that decrypts the response and calls markQuotePaid(). Until then this returns
// null and the UI falls back to "arrange payment on WhatsApp".

export type PayLinkInput = {
  token: string;
  amount: number; // rupees
  clientName: string;
  email?: string | null;
  phone?: string | null;
};

/** Returns a hosted payment URL, or null if no gateway is configured yet. */
export async function createPaymentLink(_input: PayLinkInput): Promise<string | null> {
  // CCAvenue not configured yet — return null so callers fall back gracefully.
  return null;
}

export const gatewayConfigured = false;
