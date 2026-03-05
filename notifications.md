# Notifications Overview

All notification logic lives in `server/sms.js`. SMS is sent via **Twilio**, email via **SendGrid**.

**Environment behavior:** In production, notifications go to all admins. In dev/local, only Augustus receives them.

---

## New User Sign-Up

Triggered when a user completes the sign-up form (`signUpUserNew` in `server/routes/SignUp.js`).

### 1. SMS to Admins

| Detail     | Value                                      |
| ---------- | ------------------------------------------ |
| Channel    | SMS (Twilio)                               |
| Recipients | Wayne (+1415...), Augustus (+1650...)       |
| Content    | Name, phone, company, vessel, port         |

**Example message:**
> Hello from C-Hero eTraining!
> John Doe (+15551234567) just signed up for C-Hero eTraining.
> Company: Acme Corp
> Vessel: SS Marine
> Port: Oakland

### 2. Email to Admins

Sent in parallel with the SMS above.

| Detail     | Value                                                          |
| ---------- | -------------------------------------------------------------- |
| Channel    | Email (SendGrid)                                               |
| From       | info@c-herotraining.com                                        |
| Recipients | info@c-hero.com, augustusmb@gmail.com, shanechero@gmail.com   |
| Format     | HTML                                                           |

**Email includes:**
- **User info:** name, email, phone
- **Company info:** position, company, vessel, port
- **Equipment config:** rescue davit, davit mounting, rescue pole

### 3. Welcome SMS to User

| Detail    | Value                            |
| --------- | -------------------------------- |
| Channel   | SMS (Twilio)                     |
| Recipient | The new user's phone number      |

**Message:**
> Welcome aboard! C-Hero eTraining will help you become more familiar and proficient with your gear. You will receive texts from this number with a 4 digit code when logging into c-herotraining.com.

---

## Test Submission

Triggered when a user submits a test (`submitTest` in `server/routes/SubmitTest.js`).

### 4. SMS to Admins (Test Result)

| Detail     | Value                                      |
| ---------- | ------------------------------------------ |
| Channel    | SMS (Twilio)                               |
| Recipients | Wayne (+1415...), Augustus (+1650...)       |
| Content    | Name, phone, class ID, PASSED/FAILED       |

**Example message:**
> Hi, notifying you that John Doe (+15551234567) just attempted and PASSED test BASIC-101

---

## Quick Reference

| #  | Event           | Channel | Recipient(s) | Source File              |
| -- | --------------- | ------- | ------------- | ------------------------ |
| 1  | New sign-up     | SMS     | Admins        | `server/sms.js`          |
| 2  | New sign-up     | Email   | Admins        | `server/sms.js`          |
| 3  | New sign-up     | SMS     | New user      | `server/sms.js`          |
| 4  | Test submission | SMS     | Admins        | `server/sms.js`          |
