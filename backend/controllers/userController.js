import { createUser, findByEmail } from "../repository/userRepository.js";

export const createAccount = async (req, res) => {
    const newUser = req.body;
    if(!newUser || !newUser.email || !newUser.password){
        return res.status(400).json({message : 'Email dan password harus di isi!'});
    }
    try {
        const user = await createUser(newUser.email);

        if (user){
            return res.status(409).json({message : 'Email sudah digunakan.'});
        }
        const savedUser = await createUser(newUser);
        const {password, ...safeUser } = savedUser;
        res.status(200).json({message : 'User berhasil dibuat!', user : safeUser});
    }catch(error){
        console.log("error Login:", error);
        return res.status(500).json({message : 'Gagal Buat Akun!'});
    }
};

export const loginAccount = async (req, res) => {
    const {email , password} = req.body;
    try{
        const user = await findByEmail(email);

        if(user && user.password === password){
            const {password: pw, ...safeUser} = user;
            return res.status(200).json({message : 'Login berhasil!', user : safeUser});
        } else {
            return res.status(401).json({message : 'Email atau password salah!'});
        }
    }catch(error){
        console.log("error Login:", error);
        return res.status(500).json({message : 'Gagal Login!'});
    }
};



