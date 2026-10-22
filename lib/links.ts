import { SITE } from "./site";

// The static, form-free build (npm run build:static) sets NEXT_PUBLIC_FORMS=off;
// Apply and Partner links then open an email instead of the form pages.
export const FORMS_ON = process.env.NEXT_PUBLIC_FORMS !== "off";

const mail = (subject: string) => `mailto:${SITE.email}?subject=${encodeURIComponent(subject)}`;

export const APPLY_HREF = FORMS_ON ? "/apply" : mail("Founder application");
export const PARTNER_HREF = FORMS_ON ? "/partner" : mail("Partnering with Ryse");
