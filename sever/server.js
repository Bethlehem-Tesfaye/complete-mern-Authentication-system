import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mogodb.js';
import authRouter from './route/authRoutes.js'
import userRouter from './route/userRoutes.js';

const app = express();
const port = process.env.PORT || 4000;
connectDB();

const allowedOrigins =['http://localhost:5174', 'https://complete-mern-authentication-system-1.onrender.com']//add all the frontend url we will use


app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}));
//so that we can send the cookies in the response from the express app

// api end point
app.get('/', (req, res)=>{
    res.send("hello backend working")
})
app.use('/api/auth', authRouter)
app.use('/api/user', userRouter)



app.listen(port, ()=>{
    console.log(`server running on port:${port}`);
    
})