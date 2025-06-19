import mongoose, { mongo } from "mongoose";
const connectDB = async ()=>{
    mongoose.connection.on('connected',()=>{
        console.log('database connected');
        
    })
    await mongoose.connect(`${process.env.MONGODB_URL}/mern-auht`)
}

export default connectDB