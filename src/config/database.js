const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const uri =
            `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}` +
            `@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}` +
            `?authSource=admin`;

        await mongoose.connect(uri);

        console.log('Conectado a MongoDB');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error.message);
        process.exit(1);
    }
};

module.exports = connectDB;