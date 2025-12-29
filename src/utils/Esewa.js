import crypto from "crypto-js";

export const generateRandomString = (length = 25) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

export const generateSignature = (message, secret) => {
    const hash = crypto.HmacSHA256(message, secret);
    return crypto.enc.Base64.stringify(hash);
};

// Generate eSewa form (sandbox)
export const generateEsewaForm = ({ amount, transactionId, successUrl, failureUrl }) => {
    return `
    <form action="https://rc.esewa.com.np/epay/main" method="POST">
      <input type="text" name="tAmt" value="${amount}" />
      <input type="text" name="amt" value="${amount}" />
      <input type="text" name="txAmt" value="0" />
      <input type="text" name="psc" value="0" />
      <input type="text" name="pdc" value="0" />
      <input type="text" name="scd" value="EPAYTEST" />
      <input type="text" name="pid" value="${transactionId}" />
      <input type="text" name="su" value="${successUrl}" />
      <input type="text" name="fu" value="${failureUrl}" />
      <input type="submit" value="Pay with eSewa" />
    </form>
  `;
};

   