import dotenv from "dotenv";
import twilio from "twilio";
import sgMail from "@sendgrid/mail";

dotenv.config();

import { defineConfig, loadEnv } from "vite";
dotenv.config();

const env = loadEnv("all", process.cwd());

const accountSid = env.VITE_TWILIO_ACCOUNT_SID;
const authToken = env.VITE_TWILIO_AUTH_TOKEN;
const sendGridApiKey = env.VITE_TWILIO_SENDGRID_API_KEY;
const client = twilio(accountSid, authToken);

const WAYNE_PHONE = "+14159945256";
const AUGUSTUS_PHONE = "+16503808229";
const AUGUSTUS_TWILIO_PHONE = "+13129975262";

const CHERO_INFO_EMAIL = "info@c-hero.com";
const AUGUSTUS_PERSONAL_EMAIL = "augustusmb@gmail.com";
const CHERO_TRAINING_INFO_EMAIL = "info@c-herotraining.com";

sgMail.setApiKey(sendGridApiKey);

const informTestResult = (questionsMissed, name, phone, classId) => {
  console.log("Hello in the Texting Body");
  console.log("# of Questions missed: ", questionsMissed);
  console.log("Typeof ", typeof questionsMissed);
  let message = "";
  if (questionsMissed.length !== 0)
    message = `Hi, notifying you that ${name} (${phone}) just attempted and FAILED test ${classId})`;
  else if (questionsMissed.length === 0)
    message = `Hi, notifying you that ${name} (${phone}) just attempted and PASSED test ${classId})`;

  const phoneNumbers = ["+16503808229", "+14159945256"];

  Promise.all(
    phoneNumbers.map((number) =>
      client.messages.create({
        body: message,
        from: AUGUSTUS_TWILIO_PHONE,
        to: number,
      }),
    ),
  )
    .then((messages) =>
      messages.forEach((message, index) =>
        console.log(`Message ${index + 1} status:`, message.status),
      ),
    )
    .catch((error) => console.error("Error sending messages:", error));
};

// Phone and email notifications for new sign-ups
export const notifyCheroAdminsNewUserSignUp = async (
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
) => {
  // Prepare the message content
  const messageContent = `Hello from C-Hero eTraining!\n${firstName} ${lastName} (${phone}) just signed up for C-Hero eTraining.\nCompany: ${company.label}\nVessel: ${vessel.label}\nPort: ${port.label}`;

  // Send SMS
  try {
    const phoneNumbers = [WAYNE_PHONE, AUGUSTUS_PHONE];
    const smsPromises = phoneNumbers.map((phoneNumber) =>
      client.messages.create({
        body: messageContent,
        from: AUGUSTUS_TWILIO_PHONE,
        to: phoneNumber,
      }),
    );

    const smsResults = await Promise.all(smsPromises);
    smsResults.forEach((result, index) => {
      console.log(`SMS Status for ${phoneNumbers[index]}:`, result.status);
    });
  } catch (error) {
    console.error("Error sending SMS:", error);
  }

  // Prepare email content
  const emailData = {
    to: [CHERO_INFO_EMAIL, AUGUSTUS_PERSONAL_EMAIL],
    from: CHERO_TRAINING_INFO_EMAIL, // Must be verified in SendGrid
    subject: "New C-Hero eTraining Sign-up",
    text: messageContent,
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

  // Send email
  try {
    const emailResult = await sgMail.send(emailData);
    console.log("Email Status:", emailResult[0].statusCode);
  } catch (error) {
    console.error("Error sending email:", error);
  }
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

export default informTestResult;
