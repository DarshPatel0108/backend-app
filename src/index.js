import dotenv from 'dotenv';
import connectDB from './db/index.js';

dotenv.config({ path: './.env' });

connectDB();





















// ;(async ()=>{
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     console.log('Connected to MongoDB');
    
//   } catch (error) {
//     console.error('Error connecting to MongoDB:', error);
//   }
// })