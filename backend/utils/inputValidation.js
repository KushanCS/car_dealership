function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function normalizePhoneNumber(phone) {
  return String(phone || "").replace(/\D/g, "");
}

function isValidEmailAddress(email) {
  const value = normalizeEmail(email);
  if (!value || value.includes(" ")) return false;

  const parts = value.split("@");
  if (parts.length !== 2) return false;

  const [localPart, domainPart] = parts;
  if (!localPart || !domainPart || !domainPart.includes(".")) return false;
  if (localPart.startsWith(".") || localPart.endsWith(".") || localPart.includes("..")) return false;

  const labels = domainPart.split(".");
  if (labels.length < 2) return false;

  const hasInvalidLabel = labels.some(
    (label) => !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label)
  );
  if (hasInvalidLabel) return false;

  const topLevelDomain = labels[labels.length - 1];
  return /^[a-z]{2,}$/i.test(topLevelDomain);
}

function isValidPhoneNumber(phone) {
  return /^\d{10}$/.test(normalizePhoneNumber(phone));
}

function validateEmailAddress(email) {
  if (!normalizeEmail(email)) return "Email is required";
  if (!isValidEmailAddress(email)) {
    return "Please enter a valid email address with a real domain like gmail.com, yahoo.com, or outlook.com";
  }
  return "";
}

function validatePhoneNumber(phone, label = "Phone number") {
  const normalizedPhone = normalizePhoneNumber(phone);
  if (!normalizedPhone) return `${label} is required`;
  if (!/^\d{10}$/.test(normalizedPhone)) return `${label} must contain exactly 10 digits`;
  return "";
}

module.exports = {
  isValidEmailAddress,
  isValidPhoneNumber,
  normalizeEmail,
  normalizePhoneNumber,
  validateEmailAddress,
  validatePhoneNumber,
};
