import mongoose from 'mongoose';

export const connectMongoDB = async () => {
    try {
        const uri = process.env.MONGODB_URI

        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log(' MongoDB connected successfully');
    } catch (error) {
        console.error(' MongoDB connection failed:', error.message);
        process.exit(1); // Stop app if Mongo fails
    }
};
