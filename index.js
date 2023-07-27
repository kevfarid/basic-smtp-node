const express = require('express');
const app = express();
app.use(express.json());

const dotenv = require('dotenv');
dotenv.config();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const cors = require('cors');
app.use(cors());

app.get('/', (_, res) => {
  res.send('basic-stmp-server');
});

app.post('/api/send-email', (req, res) => {
  const { subject, text } = req.body;
  const { DESTINATION_EMAIL, SOURCE_EMAIL } = process.env;

  if (!subject || !text) {
    res.status(400).send('Missing required fields: subject and text.');
    return;
  }

  if (!DESTINATION_EMAIL || !SOURCE_EMAIL) {
    console.error('Missing required environment variables.');
    res.status(500).send('Server internal error.');
    return;
  }

  const msg = {
    to: DESTINATION_EMAIL,
    from: SOURCE_EMAIL,
    subject,
    text,
  };

  sgMail
    .send(msg)
    .then(() => {
      res.send('Email sent successfully.');
    })
    .catch((error) => {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email.');
    });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`SMTP server listening`);
});
