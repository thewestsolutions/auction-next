export const authorizeNetConfig = {
  apiLoginId: process.env.AUTHORIZE_NET_API_LOGIN_ID || "",
  transactionKey: process.env.AUTHORIZE_NET_TRANSACTION_KEY || "",
  environment: process.env.AUTHORIZE_NET_ENVIRONMENT || "sandbox", // 'sandbox' or 'production'
  clientKey: process.env.AUTHORIZE_NET_CLIENT_KEY || "",
};

// Validate configuration
if (!authorizeNetConfig.apiLoginId || !authorizeNetConfig.transactionKey) {
  console.warn("Authorize.net credentials are not properly configured in environment variables.");
}
