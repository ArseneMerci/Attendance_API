import cron from 'node-cron'
import sendEmail from '../helpers/sendEmail'

export default ()=>{
  cron.schedule("*/5 * * * *",()=>{
    sendEmail('','report').then(()=>{
        console.log('Email sent successfully')
    }).catch((err)=>{
        console.log(err)
    })
})
}