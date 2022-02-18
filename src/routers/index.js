import express from 'express'
const router = express.Router();
import userRouter from './userRouter.js';
import adminRouter from './adminRouter.js';
import attendenceRouter from './attendenceRouter.js';

router.use('/user',userRouter)
router.use('/admin',adminRouter)
router.use('/attendence',attendenceRouter)
module.exports=router;