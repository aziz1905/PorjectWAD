import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_key';

export const authenticateToken = (req, res, next) => {
    // Dapatkan token dari header Otorisasi 
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
        return res.status(401).json({ message: 'Akses ditolak. Token tidak ditemukan.' });
    }

    // Verifikasi token
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if(err){
            return res.status(403).json({ message: 'Token tidak valid atau sudah kadaluwarsa.' });
        }

        //Jika valid, simpan payload user (id, role) ke objek request
        req.user = user;

        next();
    });
};