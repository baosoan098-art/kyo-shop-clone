import crypto from "node:crypto";

type PrimitiveValue = string | number | boolean | null | undefined;

type VnpayCreateInput = {
  amount: number;
  txnRef: string;
  orderInfo: string;
  returnUrl?: string;
  ipAddr?: string;
  locale?: "vn" | "en";
  bankCode?: string;
  orderType?: string;
  createDate?: Date;
  expireDate?: Date;
};

type VerifyResult = {
  isValid: boolean;
  secureHash?: string;
  calculatedHash: string;
  normalizedParams: Record<string, string>;
};

function stripVietnamese(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

function sanitizeTxnRef(value: string) {
  const compact = stripVietnamese(value)
    .replace(/[^A-Za-z0-9]/g, "")
    .slice(0, 100);

  return compact || `KYO${Date.now()}`;
}

function sanitizeOrderInfo(value: string) {
  return stripVietnamese(value)
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 255);
}

function requireEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Thiếu ${name} trong .env.local`);
  }

  return value;
}

export function formatVnpayDate(date = new Date()) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const hour = `${date.getHours()}`.padStart(2, "0");
  const minute = `${date.getMinutes()}`.padStart(2, "0");
  const second = `${date.getSeconds()}`.padStart(2, "0");

  return `${year}${month}${day}${hour}${minute}${second}`;
}

function sortObjectLikeVnpaySample(params: Record<string, PrimitiveValue>) {
  const sortedKeys = Object.keys(params)
    .filter((key) => {
      const value = params[key];
      return value !== undefined && value !== null && String(value) !== "";
    })
    .map((key) => encodeURIComponent(key))
    .sort();

  const sorted: Record<string, string> = {};

  sortedKeys.forEach((encodedKey) => {
    const originalKey = decodeURIComponent(encodedKey);
    sorted[encodedKey] = encodeURIComponent(String(params[originalKey] ?? "")).replace(
      /%20/g,
      "+",
    );
  });

  return sorted;
}

function createSecureHash(signData: string) {
  const hashSecret = requireEnv("VNPAY_HASH_SECRET");

  return crypto
    .createHmac("sha512", hashSecret)
    .update(Buffer.from(signData, "utf-8"))
    .digest("hex");
}

function buildQueryString(params: Record<string, string>) {
  return Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");
}

export function createVnpayPaymentUrl(input: VnpayCreateInput) {
  const tmnCode = requireEnv("VNPAY_TMN_CODE");
  const baseUrl =
    process.env.VNPAY_URL?.trim() ||
    "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  const returnUrl =
    input.returnUrl?.trim() ||
    process.env.VNPAY_RETURN_URL?.trim() ||
    "http://localhost:3000/payment/vnpay/return";
  const createdAt = input.createDate ?? new Date();
  const expiresAt =
    input.expireDate ??
    new Date(createdAt.getTime() + 15 * 60 * 1000);

  const txnRef = sanitizeTxnRef(input.txnRef);
  const orderInfo = sanitizeOrderInfo(input.orderInfo || `Thanh toan don hang ${txnRef}`);

  const rawParams: Record<string, PrimitiveValue> = {
    vnp_Version: "2.1.0",
    vnp_Command: "pay",
    vnp_TmnCode: tmnCode,
    vnp_Locale: input.locale || "vn",
    vnp_CurrCode: "VND",
    vnp_TxnRef: txnRef,
    vnp_OrderInfo: orderInfo,
    vnp_OrderType: input.orderType || "other",
    vnp_Amount: Math.round(Number(input.amount) * 100),
    vnp_ReturnUrl: returnUrl,
    vnp_IpAddr: input.ipAddr || "127.0.0.1",
    vnp_CreateDate: formatVnpayDate(createdAt),
    vnp_ExpireDate: formatVnpayDate(expiresAt),
  };

  if (input.bankCode) {
    rawParams.vnp_BankCode = input.bankCode;
  }

  const normalizedParams = sortObjectLikeVnpaySample(rawParams);
  const signData = buildQueryString(normalizedParams);
  const secureHash = createSecureHash(signData);
  const queryString = buildQueryString({
    ...normalizedParams,
    vnp_SecureHash: secureHash,
  });

  return `${baseUrl}?${queryString}`;
}

function toParamRecord(source: URLSearchParams | Record<string, PrimitiveValue>) {
  if (source instanceof URLSearchParams) {
    return Object.fromEntries(source.entries());
  }

  return Object.entries(source).reduce<Record<string, string>>((result, [key, value]) => {
    if (value === undefined || value === null) {
      return result;
    }

    result[key] = String(value);
    return result;
  }, {});
}

export function verifyVnpayQuery(
  source: URLSearchParams | Record<string, PrimitiveValue>,
): VerifyResult {
  const rawParams = toParamRecord(source);
  const secureHash = rawParams.vnp_SecureHash;

  const paramsToVerify = { ...rawParams };
  delete paramsToVerify.vnp_SecureHash;
  delete paramsToVerify.vnp_SecureHashType;

  const normalizedParams = sortObjectLikeVnpaySample(paramsToVerify);
  const signData = buildQueryString(normalizedParams);
  const calculatedHash = createSecureHash(signData);

  return {
    isValid: Boolean(
      secureHash &&
        secureHash.toUpperCase() === calculatedHash.toUpperCase(),
    ),
    secureHash,
    calculatedHash,
    normalizedParams,
  };
}
