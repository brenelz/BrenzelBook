const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API);

export default async (req, res) => {
  const { email, firstName, lastName, message } = req.body;

  try {
    const msg = {
      to: "brenleydueck@gmail.com",
      from: "brenelz@gmail.com",
      subject: `BrenzelBook Contact Form (${firstName} ${lastName}) - ${email}`,
      text: message,
    };
    await sgMail.send(msg);
  } catch (error) {
    return res.status(error.statusCode || 500).json({ error: error.message });
  }

  return res.status(200).json({ success: true, error: "" });
};
