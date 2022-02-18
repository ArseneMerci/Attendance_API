import jwt from 'jsonwebtoken'
import Attendence from '../database/models/attendenceModel'
require("dotenv").config();
import {checkDate} from '../helpers/calculateHours'
import cron from 'node-cron'
import excel from "exceljs";


exports.getAllAttendance=async(req,res)=>{
    try {
        const allAttendence = await Attendence.find().populate('owner', 'fullname');
        
        const attendence = allAttendence.filter(attendenc => attendenc.hoursWorked)
        
        return res.status(200).send(attendence)
    } catch (error) {
        return res.status(404).send(error.message)
    }
}
exports.deleteAll=async(req,res)=>{
    try {
        await Attendence.deleteMany()
        
        return res.status(200).send({message:'delete successfuly'})
    } catch (error) {
        return res.status(404).send(error.message)
    }
}
exports.getAttendanceByDate=async(req,res)=>{
    try {
        //remember to check if january is 0 or 1 or 00
        const { date:specificDate } = req.params
        const attendences = await Attendence.find().find().populate('owner', 'fullname');
        const specificAttendences = attendences.filter(attendence=>{
        return checkDate(attendence.createAt,specificDate)
        })
        return res.status(200).send(specificAttendences)
    } catch (error) {
        return res.status(404).send(error.message)
    }
}
exports.getOwnAttendance=async(req,res)=>{
    try {
        const { id:user_id } = req.params;
        const attendence = await Attendence.find({ owner: user_id }).find().populate('owner', 'fullname');;
        return res.status(200).send(attendence)
    } catch (error) {
        return res.status(404).send(error.message)
    }
}
exports.getDailyAttendence=async(req,res)=>{
    try {
        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth();
        let year = today.getFullYear();
        const date =`${year}-${month}-${day}`

        const attendences = await Attendence.find()
        const dailyAttendences = attendences.filter(attendence=>{
        return checkDate(attendence.createAt,date)
        })
        return res.status(200).send(dailyAttendences)
    } catch (error) {
        return res.status(404).send(error.message)
    }
}
exports.downloadDailyReport=async(req,res)=>{
    try {

        let today = new Date();
        let day = today.getDate();
        let month = today.getMonth();
        let year = today.getFullYear();
        const date =`${year}-${month}-${day}`
        const attendences = await Attendence.find().populate('owner', 'fullname');
        const dailyAttendences = attendences.filter(attendence=>{
            return checkDate(attendence.createAt,date)
        })
        let report = [];
        dailyAttendences.forEach((attendence) =>{
            report.push({
                loggedIn:attendence.createAt||'-',
                owner:attendence.owner.fullname||'-',
                hoursWorked:attendence.hoursWorked||'-',
                loggedOut:attendence.loggedOut||'-'
            });
        });
        let workbook = new excel.Workbook();
        let worksheet = workbook.addWorksheet("Daily Report");
    
        worksheet.columns = [
            { header: "owner", key: "owner", width: 25 },
            { header: "hours Worked", key: "hoursWorked", width: 25 },
            { header: "logged In", key: "loggedIn", width: 25 },
            { header: "logged Out", key: "loggedOut", width: 25 },
        ];
        worksheet.addRows(report);
    
        res.setHeader(
          "Content-Type",
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        );
        res.setHeader(
          "Content-Disposition",
          "attachment; filename=" + `Attendence${date}.xlsx`
        );
    
        return workbook.xlsx.write(res).then(function () {
          res.status(200).end();
        });
    } catch (error) {
        return res.status(404).send(error.message)
    }
}

