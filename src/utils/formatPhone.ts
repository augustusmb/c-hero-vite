import { parsePhoneNumberFromString } from "libphonenumber-js";

export function formatPhone(phone: string | undefined | null): string {
  if (!phone) return "";
  const parsed = parsePhoneNumberFromString(phone);
  if (!parsed || !parsed.isValid()) return phone;
  return `+${parsed.countryCallingCode} ${parsed.formatNational()}`;
}
