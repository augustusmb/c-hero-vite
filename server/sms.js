import dotenv from "dotenv";
import twilio from "twilio";
dotenv.config();

import { defineConfig, loadEnv } from "vite";
dotenv.config();

const env = loadEnv("all", process.cwd());

const accountSid = env.VITE_TWILIO_ACCOUNT_SID;
const authToken = env.VITE_TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

// client.messages
//   .create({
//      body: 'Welcome aboard! C-Hero ETraining will help you become part of the C-Hero Rescue Crew. \nClick the following link to head to the C-Hero web app. \nhttps://c-hero-app.herokuapp.com/',
//      from: '+13129975262',
//      to: '+15104060877'
//    })
//   .then(message => console.log('1', message.status));

const informTestResult = (questionsMissed, name, phone, classId) => {
  console.log("Hello in the Texting Body");
  console.log("# of Questions missed: ", questionsMissed);
  console.log("Typeof ", typeof questionsMissed);
  let message = "";
  if (questionsMissed.length !== 0)
    message = `Hi, notifying you that ${name} (${phone}) just attempted and FAILED test ${classId})`;
  else if (questionsMissed.length === 0)
    message = `Hi, notifying you that ${name} (${phone}) just attempted and PASSED test ${classId})`;

  client.messages
    .create({
      body: message,
      from: "+13129975262",
      to: "+16503808229",
      // to: '+14159945256'
    })
    .then((message) => console.log("1", message.status));
};

export const newUserSignUpToWayne = (
  firstName,
  lastName,
  phone,
  company,
  vessel,
  port,
) => {
  let message = `Hello from C-Hero eTraining!\n${firstName} ${lastName} (${phone}) just signed up for C-Hero eTraining.\nCompany: ${company.label}\nVessel: ${vessel.label}\nPort: ${port.label}`;
  client.messages
    .create({
      body: message,
      from: "+13129975262",
      to: "+14159945256",
    })
    .then((message) => console.log("1", message.status));
};

export const signUpMessage = (phone) => {
  let message =
    "Welcome aboard! C-Hero eTraining will help you become more familiar and proficient with your gear. Go to C-Hero.com, select Login under the eTraining drop down menu and follow the prompts.";

  client.messages
    .create({
      body: message,
      from: "+13129975262",
      to: phone,
    })
    .then((message) => console.log("1", message.status));
};

export default informTestResult;
