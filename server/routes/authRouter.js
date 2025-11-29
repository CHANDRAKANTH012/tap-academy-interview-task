import express from 'express';
import loginController from '../controllers/authController.js';
import registerController from '../controllers/authController.js';

const authRouter = express.Router();


authRouter.post('/login',loginController);
authRouter.post('/signup',registerController);


export default authRouter;