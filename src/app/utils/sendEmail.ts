import ejs from 'ejs';
import path from 'path';
import envVars from '../config/env';
import nodeMailerTransporter from '../config/nodemailer.config';

const sendEmail = async (
  to: string,
  subject: string,
  template: string,
  data: Record<string, unknown>,
  cc?: string | string[],
) => {
  const templatePath = path.join(
    process.cwd(),
    'src/app/templates',
    `${template}.ejs`,
  );
  const html: string = await ejs.renderFile(templatePath, data);

  const mailOptions = {
    from: envVars.EMAIL_SENDER.SMTP_FROM,
    to,
    subject,
    html,
    ...(cc && { cc }),
  };

  await nodeMailerTransporter.sendMail(mailOptions);
};

export default sendEmail;
