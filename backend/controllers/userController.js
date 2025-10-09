import { createUser, findByEmail } from "../repository/userRepository.js";

export const createAccount = async (req, res) => {
    const { name, email, password } = req.body;
    if(!name || !email || !password){
        return res.status(400).json({message : 'Nama , Email dan password harus di isi!'});
    }
    const newUser = { 
        fullName: name, 
        email: email, 
        password: password
    };
    try {
        const user = await findByEmail(newUser.email);

        if (user){
            return res.status(409).json({message : 'Email sudah digunakan.'});
        }
        const savedUser = await createUser(newUser);
        const {password, ...safeUser } = savedUser.toJSON;
        res.status(200).json({message : 'User berhasil dibuat!', user : safeUser});
    }catch(error){
        console.log("error Buat Akun:", error.message); 
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

