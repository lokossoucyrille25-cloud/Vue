import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not defined. Email would have been sent to:", to);
    console.warn("Subject:", subject);
    console.warn("Content:", html);
    return { success: true, simulated: true };
  }

  try {
    const data = await resend.emails.send({
      from: 'Boostify <contact@boostify.com>', // Mettez votre domaine vérifié ici
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}
