import express from 'express';
// import {userAuth} from '../middlewares/auth';
import attendenceController from '../controllers/attendenceController';
const router = express.Router();

router.get('/all', attendenceController.getAllAttendance);
router.get('/daily', attendenceController.getDailyAttendence);
router.get('/downloadReport', attendenceController.downloadDailyReport);
router.get('/own/:id', attendenceController.getOwnAttendance);
router.get('/:date', attendenceController.getAttendanceByDate);
router.delete('/deleteAll', (attendenceController.deleteAll));


module.exports = router;