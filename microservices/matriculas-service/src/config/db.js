import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`[${process.env.SERVICE_NAME}] MongoDB conectado: ${conn.connection.host}`);
        console.log(`[${process.env.SERVICE_NAME}] Base de datos: ${conn.connection.name}`);

        mongoose.connection.on('error', (err) => {
            console.error(`[${process.env.SERVICE_NAME}] Error de MongoDB:`, err);
        });

        mongoose.connection.on('disconnected', () => {
            console.log(`[${process.env.SERVICE_NAME}] MongoDB desconectado`);
        });

    } catch (error) {
        console.error(`[${process.env.SERVICE_NAME}] Error al conectar a MongoDB:`, error.message);
        process.exit(1);
    }
};

export default connectDB;
