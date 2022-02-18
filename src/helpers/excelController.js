
import cron from 'node-cron'
import mongoose from 'mongoose'
import moment from 'moment'
require('dotenv').config()
import sgMail from '@sendgrid/mail'
import Attendence from '../database/models/attendenceModel'
import sendEmail from '../helpers/sendEmail'

import excel from 'exceljs';
const download =async (req,res) => {
  Attendence.find({where: {
    createdAt: {
      [moment.gte]: moment().subtract(1, 'day').toDate()
    }
  }
}).then((objs) => {
    let Attend = [];

    objs.forEach((obj) => {
     Attend.push({
       owner:obj.owner,
       loggedIn:obj.loggedIn,
       loggedOut:obj.loggedOut,
       hoursWorked:obj.hoursWorked,
        createdAt:obj.createdAt
      });
    });

    let workbook = new excel.Workbook();
    let worksheet = workbook.addWorksheet("Attendences");

    worksheet.columns = [
      { header: "Owner", key: "Owner", width: 25 },
      { header: "LoggedIn", key: "loggedIn", width: 25 },
      { header: "LoggedOut", key: "loggedOut", width: 10 },
      { header: "Hours Worked", key: "hoursWorked", width: 10 },
      { header: "Date", key: "createdAt", width: 10 },
    ];

    // Add Array Rows
    worksheet.addRows(Attend);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=" + "Attend.xlsx"
    );

    return workbook.xlsx.write(res).then(function () {
      res.status(200).end();
    });
  });
};

// new Date(Date.now() - 5 * 24 * 60 * 60 * 1000)>5
const task= cron.schedule("0 15 * * 1",async (res) => {
  const userInfo={
    email:"niyodusengamussa@gmail.com"
  }
  const emailMessage = await sendEmail(userInfo)
  res.send(emailMessage, (err, data) => {
  if (err) {
      console.log("error occurred", err)
  } else {
      console.log("email sent",data)
  }
})
})
task.start()

module.exports={download}
