import express from 'express'
import { getUserDate } from '../controllers/userController.js';
import userAuth from '../middleware/userAuth.js';

const userRouter = express.Router();

userRouter.get('/data', userAuth, getUserDate);

export default userRouter