import { siteUrl } from "@/lib/site-config";
import { contactPhone } from "@/lib/site-links";

const NAME = "Paulina \u0141aczma\u0144ska";
const NAME_HTML = "Paulina &#321;aczma&#324;ska";

export const GMAIL_SIGNATURE = {
  name: NAME,
  nameHtml: NAME_HTML,
  title: "CEO",
  siteLabel: "BilingualBoost.online",
  siteUrl,
  phoneDisplay: contactPhone.display,
  phoneTel: "+48515025685",
  photoUrl:
    "https://www.gravatar.com/avatar/f8df55c439bf9562a7402607c0d99c7e14dd69450f20865cf0e172cb53f94cd1?s=160",
} as const;

export const gmailSignaturePlainText = [
  GMAIL_SIGNATURE.name,
  `${GMAIL_SIGNATURE.title}, ${GMAIL_SIGNATURE.siteLabel}`,
  GMAIL_SIGNATURE.phoneDisplay,
].join("\n");

export const gmailSignatureHtml = `
<table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;font-family:Arial,Helvetica,sans-serif;">
  <tr>
    <td valign="middle" style="padding:0 14px 0 0;">
      <a href="${GMAIL_SIGNATURE.siteUrl}" style="text-decoration:none;">
        <img
          src="${GMAIL_SIGNATURE.photoUrl}"
          alt="${GMAIL_SIGNATURE.nameHtml}"
          width="72"
          height="72"
          style="width:72px;height:72px;border-radius:50%;display:block;border:0;"
        >
      </a>
    </td>
    <td valign="middle" width="3" style="width:3px;background-color:#06b6d4;font-size:0;line-height:0;">&nbsp;</td>
    <td valign="middle" style="padding:0 0 0 14px;">
      <table cellpadding="0" cellspacing="0" border="0" role="presentation" style="border-collapse:collapse;">
        <tr>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:20px;font-weight:bold;color:#0f172a;padding:0 0 2px 0;">
            ${GMAIL_SIGNATURE.nameHtml}
          </td>
        </tr>
        <tr>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:18px;color:#64748b;padding:0 0 8px 0;">
            ${GMAIL_SIGNATURE.title}, <a href="${GMAIL_SIGNATURE.siteUrl}" style="color:#8b5cf6;text-decoration:none;">${GMAIL_SIGNATURE.siteLabel}</a>
          </td>
        </tr>
        <tr>
          <td style="font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:20px;color:#334155;">
            <a href="tel:${GMAIL_SIGNATURE.phoneTel}" style="color:#06b6d4;text-decoration:none;">${GMAIL_SIGNATURE.phoneDisplay}</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
`.trim();
