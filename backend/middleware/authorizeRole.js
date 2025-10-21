export const authorizerole = (requireRole) => {
    return (req, res, next) =>{
        const userRole = req.user.role; // Dapatkan role dari data user yang sudah diverifikasi

        if(userRole !== requireRole){
            return res.status(403).json({ message: `Akses Ditolak: Hanya pengguna dengan role ${requireRole} yang diizinkan.` });
        }

        next();
    };
};