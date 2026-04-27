import { Resend } from "resend";
import { render } from "@react-email/render";

export async function sendEmail({ to, subject, react }) {
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const html = await render(react);

    const { data, error } = await resend.emails.send({
      from: "Sajilo <onboarding@resend.dev>",
      to: "",
      subject,
      html,
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    console.log("Email sent:", data);
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
