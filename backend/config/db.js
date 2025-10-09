import { Sequelize } from "sequelize";
import User from '../model/userModel.js';

const sequelize = new Sequelize(
    process.env.DB_NAME, 
    process.env.DB_USER, 
    process.env.DB_PASSWORD, 
    {
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT, 10),
        dialect: 'postgres',
        logging: false,
    }
);


sequelize.authenticate()
    .then(async () => {
        console.log('✅ Koneksi PostgreSQL berhasil!');
        await User.sync({ alter: true }); 
        console.log('✅ Model User berhasil disinkronkan dengan database.');
    })
    .catch(err => {
        console.error('❌ GAGAL terhubung ke database:', err.message);
        process.exit(1); 
    });

export default sequelize;