const nodemailer = require("nodemailer");

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

const makeANiceEmail = (name, context) => `
  <div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: Arial;
    line-height: 2;
    font-size: 16px;
  ">
    <h2>Hi ${name}</h2>
    <p>${context}</p>
    <p>Note: This reset link is available only in 1 hour.</p>
    <p>Nice day!</p>
    <p>Tada.</p>
  </div>
`;

exports.transport = transport;
exports.makeANiceEmail = makeANiceEmail;
