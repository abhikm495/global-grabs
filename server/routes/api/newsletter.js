const express = require('express');
const router = express.Router();

const brevoSubs = require('../../services/brevoSubs');
const brevoMail = require('../../services/brevoMail');

router.post('/subscribe', async (req, res) => {
  const email = req.body.email;

  if (!email) {
    return res.status(400).json({ error: 'You must enter an email address.' });
  }

  const result = await brevoSubs.subscribeToNewsletter(email);

  if (result.status === 400) {
    return res.status(400).json({ error: result.title });
  }

  await brevoMail.sendEmail(email, 'newsletter-subscription');

  res.status(200).json({
    success: true,
    message: 'You have successfully subscribed to the newsletter'
  });
});

module.exports = router;
