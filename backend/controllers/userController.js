import { createOrReplaceBiodata, createUser, findByEmail } from "../repository/userRepository.js";
import bcrypt from 'bcrypt'; 
import { generateAuthToken } from "../service/authService.js";

export const createAccount = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Nama, Email dan password harus di isi!' });
    }

    try {
        // Cek dulu apakah email sudah ada
        const existingUser = await findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'Email sudah digunakan.' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Buat objek user baru
        const newUser = { 
            fullName: name,
            email: email, 
            password: hashedPassword, // Simpan password yang sudah di-hash
            role: 'customer' 
        };
        
        // Panggil repository
        const savedUser = await createUser(newUser);
        
        // Hapus password hash
        const { password: pw, ...safeUser } = savedUser; 
        res.status(201).json({ message: 'User berhasil dibuat!', user: safeUser });

    } catch(error) {
        console.log("error Buat Akun:", error.message); 
        return res.status(500).json({ message: 'Gagal Buat Akun!' });
    }
};

export const loginAccount = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await findByEmail(email);

        //  Cek jika user tidak ada
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah!' });
        }

        //  Gunakan bcrypt.compare untuk membandingkan password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // Hapus password hash
            const { password: pw, ...safeUser } = user;

            // Buat JWT dengan ID dan Role untuk otentikasi sesi
            const token = generateAuthToken(user.id, user.role);
            
            return res.status(200).json({ 
            message: 'Login berhasil!', 
            token: token, 
            user: safeUser 
        });
        } else {
            return res.status(401).json({ message: 'Email atau password salah!' });
        }
    } catch (error) {
        console.log("error Login:", error);
        return res.status(500).json({ message: 'Gagal Login!' });
    }
};

export const updateBiodata = async (req, res) => {
    const userId = req.user.id;
    const {phone, address} = req.body;
    
    const biodataToUpdate = {
        userId: userId,
        phone: phone,
        address: address
    };

    try{
        let UpdateBiodata = null;
        if(phone || address){
            updateBiodata = await createOrReplaceBiodata(userId, biodataToUpdate);
        }

        const finalResponse = {
            message: 'Biodata berhasil diperbarui!',
            biodata: updateBiodata
        }

        return res.status(200).json(finalResponse);
    }catch (error) {
        console.log("error Update Biodata:", error);
        return res.status(500).json({ message: 'Gagal Update Data!' });
    }  
};