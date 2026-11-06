"use server";

import { db } from "@/lib/db";
import { ContactInquirySchema } from "@/lib/security";

export type InquiryActionResult = {
  success: boolean;
  message: string;
  errors?: Record<string, string>;
};

export async function submitInquiryAction(
  _prevState: InquiryActionResult | null,
  formData: FormData
): Promise<InquiryActionResult> {
  const rawData = {
    name: formData.get("name")?.toString() || "",
    email: formData.get("email")?.toString() || "",
    phone: formData.get("phone")?.toString() || undefined,
    subject: formData.get("subject")?.toString() || "",
    message: formData.get("message")?.toString() || "",
  };

  const parsed = ContactInquirySchema.safeParse(rawData);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const field = issue.path[0]?.toString();
      if (field && !errors[field]) {
        errors[field] = issue.message;
      }
    }
    return {
      success: false,
      message: "Please correct the highlighted errors in the form.",
      errors,
    };
  }

  const { name, email, phone, subject, message } = parsed.data;

  try {
    const inquiry = db.contactInquiry.create({
      name,
      email,
      phone: phone || undefined,
      subject,
      message,
    });

    db.audit.log({
      action: "CREATE",
      entity: "ContactInquiry",
      entityId: inquiry.id,
      details: `Citizen inquiry received from ${name} (${email}) regarding: ${subject}`,
    });

    return {
      success: true,
      message: "Thank you for reaching out. Your inquiry has been submitted to the Chief Minister's Secretariat. Our team will review and respond promptly.",
    };
  } catch (err) {
    console.error("Inquiry submission error:", err);
    return {
      success: false,
      message: "An internal error occurred while submitting your message. Please try again later.",
    };
  }
}
