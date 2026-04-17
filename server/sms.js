import dotenv from "dotenv";
import twilio from "twilio";
import sgMail from "@sendgrid/mail";

dotenv.config();

const accountSid = process.env.VITE_TWILIO_ACCOUNT_SID;
const authToken = process.env.VITE_TWILIO_AUTH_TOKEN;
const sendGridApiKey = process.env.VITE_TWILIO_SENDGRID_API_KEY;
const client = twilio(accountSid, authToken);

console.log("Evironment: ", process.env.VITE_NODE_ENV);

// Phone numbers
const WAYNE_PHONE = "+14159945256";
const AUGUSTUS_PHONE = "+16503808229";
const AUGUSTUS_TWILIO_PHONE = "+13129975262";

// Email addresses
const CHERO_INFO_EMAIL = "info@c-hero.com";
const AUGUSTUS_PERSONAL_EMAIL = "augustusmb@gmail.com";
const CHERO_TRAINING_INFO_EMAIL = "info@c-herotraining.com";
const SHANE_EMAIL = "shanechero@gmail.com";

// Environment-based recipients
// In production: send to all admins
// In local/dev: only send to Augustus
const isProduction = process.env.VITE_NODE_ENV === "production";

const ADMIN_PHONE_NUMBERS = isProduction
  ? [WAYNE_PHONE, AUGUSTUS_PHONE]
  : [AUGUSTUS_PHONE];

const ADMIN_EMAIL_ADDRESSES = isProduction
  ? [CHERO_INFO_EMAIL, AUGUSTUS_PERSONAL_EMAIL, SHANE_EMAIL]
  : [AUGUSTUS_PERSONAL_EMAIL];

sgMail.setApiKey(sendGridApiKey);

/**
 * Helper function to send SMS to admin phone numbers
 */
const sendAdminSms = async (message) => {
  try {
    const results = await Promise.all(
      ADMIN_PHONE_NUMBERS.map((number) =>
        client.messages.create({
          body: message,
          from: AUGUSTUS_TWILIO_PHONE,
          to: number,
        }),
      ),
    );
    results.forEach((result, index) => {
      console.log(`SMS to ${ADMIN_PHONE_NUMBERS[index]}: ${result.status}`);
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
  }
};

const informAssessmentResult = async (
  questionsMissed,
  firstName,
  lastName,
  phone,
  classId,
) => {
  const passed = questionsMissed.length === 0;
  const status = passed ? "PASSED" : "FAILED";
  const message = `Hi, notifying you that ${firstName} ${lastName} (${phone}) just attempted and ${status} assessment ${classId}`;

  await sendAdminSms(message);
};

// Phone and email notifications for new sign-ups
export const notifyAdminsNewSignUp = async ({
  firstName,
  lastName,
  phone,
  email,
  company,
  vessel,
  port,
  position,
  rescuePole,
  rescueDavit,
  rescueDavitMount,
}) => {
  const smsContent = `Hello from C-Hero eTraining!\n${firstName} ${lastName} (${phone}) just signed up for C-Hero eTraining.\nCompany: ${company.label}\nVessel: ${vessel.label}\nPort: ${port.label}`;

  const emailData = {
    to: ADMIN_EMAIL_ADDRESSES,
    from: CHERO_TRAINING_INFO_EMAIL,
    subject: "New C-Hero eTraining Sign-up",
    text: smsContent,
    html: `
      <h2>New C-Hero eTraining Sign-up</h2>
      <p>A new user has signed up for C-Hero eTraining:</p>

      <h3>User Information</h3>
      <ul>
        <li><strong>Name:</strong> ${firstName} ${lastName}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone}</li>
      </ul>

      <h3>Company Information</h3>
      <ul>
        <li><strong>Position:</strong> ${position.label}</li>
        <li><strong>Company:</strong> ${company.label}</li>
        <li><strong>Vessel:</strong> ${vessel.label}</li>
        <li><strong>Port:</strong> ${port.label}</li>
      </ul>

      <h3>Equipment Configuration</h3>
      <ul>
        <li><strong>Rescue Davit:</strong> ${rescueDavit}</li>
        <li><strong>Davit Mounting:</strong> ${rescueDavitMount}</li>
        <li><strong>Rescue Pole:</strong> ${rescuePole}</li>
      </ul>
    `,
  };

  const sendEmail = async () => {
    try {
      const result = await sgMail.send(emailData);
      console.log("Email Status:", result[0].statusCode);
    } catch (error) {
      console.error("Error sending email:", error);
    }
  };

  // Send SMS and email in parallel
  await Promise.all([sendAdminSms(smsContent), sendEmail()]);
};

// not in use currently
export const signUpSmsToUser = (phone) => {
  let message =
    "Welcome aboard! C-Hero eTraining will help you become more familiar and proficient with your gear. You will receive texts from this number with a 4 digit code when logging into c-herotraining.com.";

  client.messages
    .create({
      body: message,
      from: AUGUSTUS_TWILIO_PHONE,
      to: phone,
    })
    .then((message) => console.log("1", message.status));
};

export default informAssessmentResult;
