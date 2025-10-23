import jwt from 'jsonwebtoken';
import 'dotenv/config'

const JWT_SECRET = process.env.JWT_SECRET || 'secret_jwt';

const JWT_EXPIRES_IN = '1d';

export const generateAuthToken = (userId, role) => {
    // Definisikan Payload (data yang akan dimasukkan ke dalam token)
    const payload = {
        id: userId,
        role: role,
    };

    // Sign Token
    const token = jwt.sign(
        payload, 
        JWT_SECRET, 
        { expiresIn: JWT_EXPIRES_IN } // Atur waktu kedaluwarsa
    );

    return token;
};