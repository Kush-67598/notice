const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./backend/models/User');

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        // Check if admin exists
        const adminExists = await User.findOne({ username: 'admin' });

        if (!adminExists) {
            const admin = new User({
                username: 'admin',
                password: 'adminvidhi' // You should change this after login!
            });

            await admin.save();
        } else {
            console.log('Admin user already exists');
        }

        mongoose.connection.close();
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
