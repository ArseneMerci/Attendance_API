import express from 'express';
import {adminAuth} from '../middlewares/auth';
import adminController from '../controllers/adminController';
import userController from '../controllers/userController';
const router = express.Router();

router.post('/signup', adminAuth, adminController.createUser);
router.post('/logout', adminAuth, userController.logout);
router.post('/location/add', adminAuth, adminController.createLocation);
router.get('/users', adminAuth,adminController.getUser);
router.get('/all-locations', adminAuth,adminController.getLocations);
router.delete('/users/:id', adminAuth,adminController.deleteUser);
router.delete('/deleteLocation/:id', adminAuth,adminController.deleteLocation);

module.exports = router;