/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({origin: true});
const sgMail = require("@sendgrid/mail");

admin.initializeApp();

require("dotenv").config(); 

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.sendBulkEmail = functions.https.onRequest((req, res) => {
  cors(req, res, () => {
    const {emails, subject, message, attachment} = req.body;

    if (!emails || emails.length === 0) {
      return res.status(400).send("No email addresses provided");
    }

    const messages = emails.map((email) => ({
      to: email,
      from: "yuzhongzhao107@gmail.com",
      subject: subject,
      text: message,
      attachments: attachment ? [attachment] : [],
    }));

    sgMail
        .send(messages, {isMultiple: true})
        .then(() => {
          res.status(200).json({
            success: true,
            message: "Bulk email sent successfully"});
        })
        .catch((error) => {
          console.error("Error sending bulk email:", error);
          res.status(500).json({
            success: false,
            error: "Failed to send bulk email"});
        });
  });
});


// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
