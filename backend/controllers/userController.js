import { createUser, findByEmail } from "../repository/userRepository.js";
import bcrypt from 'bcrypt'; // 1. Import bcrypt

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

        // 2. Hash password-nya!
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Buat objek user baru
        const newUser = { 
            fullName: name, // Perbaikan: Gunakan 'name'
            email: email, 
            password: hashedPassword, // Simpan password yang sudah di-hash
            role: 'customer' 
        };
        
        // Panggil repository
        const savedUser = await createUser(newUser);
        
        // 4. Perbaikan: Langsung destructure, tidak perlu .toJSON
        const { password: pw, ...safeUser } = savedUser; 

        // 5. Perbaikan: Gunakan status 201 (Created)
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

        // 6. Cek jika user tidak ada
        if (!user) {
            return res.status(401).json({ message: 'Email atau password salah!' });
        }

        // 7. Gunakan bcrypt.compare untuk membandingkan password
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            // 8. Perbaikan: Langsung destructure
            const { password: pw, ...safeUser } = user;
            return res.status(200).json({ message: 'Login berhasil!', user: safeUser });
        } else {
            return res.status(401).json({ message: 'Email atau password salah!' });
        }
    } catch (error) {
        console.log("error Login:", error);
        return res.status(500).json({ message: 'Gagal Login!' });
    }
};