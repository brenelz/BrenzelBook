const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API);

export default async (req, res) => {
  const { email, firstName, lastName, message } = req.body;

  const msg = {
    to: "brenleydueck@gmail.com",
    from: "brenelz@gmail.com",
    subject: `BrenzelBook Contact Form (${firstName} ${lastName}) - ${email}`,
    text: message,
    html: message,
  };
  sgMail.send(msg);

  return res.status(200).json({ success: true });
};
