import express from 'express';
import {userAuth} from '../middlewares/auth';
import userController from '../controllers/userController';
const router = express.Router();

router.post('/login', userController.loginUser);
router.post('/logout', userAuth, userController.logout);
router.post('/forgotPassword', userController.forgetPassword);
router.post('/resetPassword', userController.resetPassword);

//verify user location
router.post('/verifyUserLocation', userController.verifyUserLocation);

module.exports = router;