import sgMail from '@sendgrid/mail'
// import ejs from 'ejs';
// import path from 'path';
require ('dotenv').config();

sgMail.setApiKey(process.env.ATTEND_KEY_SENDGRIND)

const sendEmail = async (userInfo,action) =>{  
  let template;
  let subject;
  let emailto;
  let data;
  switch (action) {
    case 'signup':
      template = './signUp.ejs';
      subject = 'Welcome to Attendence Management System';
      data = `<p>Dear User, your info are, email: ${userInfo.email} Password:${userInfo.password}</p>`
      emailto = userInfo.email;
      break;
    case 'report':
      template = './dailyReport.ejs';
      subject = 'Daily Report';
      data = `<a href="https://attendence-solvit.herokuapp.com/attendence/downloadReport">Download Report</a>`
      emailto = 'niyodusengamussa@gmail.com';
      break;
    case 'forgotPassword':
      template = './forgotPassword.ejs';
      subject = 'Change Password';
      data = `<p>Dear User, Click here to reset password <a href="https://attendence-solvit.herokuapp.com/api/user/resetPassword/${userInfo.token}">Reset Password</a></p>`
      emailto = userInfo.email;
      break;
    default:
      template = '';
  }

// const data = await ejs.renderFile(path.join(__dirname, template),userInfo);
  
  const mailOptions = {
    from: `"Attendence Management"<${process.env.EMAIL}>`,
    to: emailto,
    subject,
    html: data
  };
  try {
    const sendmail = sgMail.send(mailOptions);
    return sendmail;
  }
  catch(err){
     return err;;
  }
}
export default sendEmail;