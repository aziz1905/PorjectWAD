import { createOrReplaceBiodata, createUser, findByEmail, findById, updatePassword } from "../repository/userRepository.js";
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



export const getUserById = async (req, res) => {
    const userId = req.user?.id; 

    if (!userId) {
        // fallback jika middleware gagal, tapi user terotentikasi.
        return res.status(401).json({ message: "Otentikasi gagal: User ID tidak ditemukan." });
    }

    try {
        // Ambil data user lengkap dari database
        const user = await findById(userId); 

        if (!user) {
            return res.status(404).json({ message: "Profil pengguna tidak ditemukan." });
        }

        // hapus password sebelum dikirim ke client
        // mengekstrak 'password' dan menempatkan sisanya ke 'safeUser'
        const { password, ...safeUser } = user;
        
        // Kirim data profil yang aman
        return res.status(200).json({ 
            message: "Data profil berhasil diambil.",
            user: safeUser
        });

    } catch (error) {
        console.error("Error Get User Profile:", error);
        return res.status(500).json({ message: "Gagal mengambil data profil." });
    }
};



export const loginAccount = async (req, res) => {
    const { email, password } = req.body;
    
    // Log incoming data
    console.log("Login attempt for email:", email); 
    if (!password) {
        console.error("Password missing from request body!");
        return res.status(400).json({ message: 'Password harus diisi.' });
    }

    try {
        const user = await findByEmail(email);

        if (!user) {
            console.log(`User not found for email: ${email}`);
            return res.status(401).json({ message: 'Email atau password salah!' });
        }

        // Check if user object has a password property (should exist if user was found)
        if (!user.password) {
            console.error(`User ${email} found, but has no password hash in the database!`);
            return res.status(500).json({ message: 'Kesalahan internal server.' });
        }

        // Now it's safe to compare
        console.log("Comparing provided password with stored hash...");
        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
            console.log(`Password match for ${email}`);
            const { password: pw, ...safeUser } = user;
            const token = generateAuthToken(user.id, user.role); // Assuming generateAuthToken exists
            
            return res.status(200).json({ 
                message: 'Login berhasil!', 
                token: token, 
                user: safeUser 
            });
        } else {
            console.log(`Password mismatch for ${email}`);
            return res.status(401).json({ message: 'Email atau password salah!' });
        }
    } catch (error) {
        console.error("Error during login process:", error); 
        return res.status(500).json({ message: 'Gagal Login!' });
    }
};




export const updateUserPassword = async (req, res) => {
    // Ambil ID Pengguna dari token
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;

    if (!userId) {
        return res.status(401).json({ message: "Otentikasi gagal: User ID tidak ditemukan." });
    }

    // Validasi Input
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: "Password lama dan password baru wajib diisi." });
    }

    if (newPassword.length <= 8) {
        return res.status(400).json({ message: "Password baru harus minimal 8 karakter." });
    }

    try {
        // Ambil data user dari database 
        const user = await findById(userId); 

        if (!user) {
            return res.status(404).json({ message: "Pengguna tidak ditemukan." });
        }

        // Verifikasi Password Lama
        const isMatch = await bcrypt.compare(oldPassword, user.password);

        if (!isMatch) {
            return res.status(403).json({ message: "Password lama salah. Gagal memperbarui password." });
        }

        // Hash Password Baru
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        // Update Password di Database
        const updatedUser = await updatePassword(userId, newHashedPassword);

        return res.status(200).json({ 
            message: "Password berhasil diperbarui!",
            user: { id: updatedUser.id, email: updatedUser.email }
        });

    } catch (error) {
        console.error("Error Update Password:", error);
        return res.status(500).json({ message: "Gagal memperbarui password." });
    }
};


export const updateBiodata = async (req, res) => {
    const userId = req.user?.id;
    const { phone, address, profileImageUrl } = req.body;

    if (!userId) {
        return res.status(400).json({ message: "User ID tidak ditemukan di token." });
    }

    const biodataToUpdate = {};

    if (phone !== undefined) biodataToUpdate.phone = phone ?? '';
    if (address !== undefined) biodataToUpdate.address = address ?? '';
    if (profileImageUrl !== undefined) biodataToUpdate.profileImageUrl = profileImageUrl ?? '';

    try {
        let updatedBiodata = null;

        if (Object.keys(biodataToUpdate).length > 0) {
            updatedBiodata = await createOrReplaceBiodata(userId, biodataToUpdate);
        } else {
            return res.status(400).json({ message: "Tidak ada data biodata yang dikirim." });
        }

        const finalResponse = {
            message: "Biodata berhasil diperbarui!",
            biodata: updatedBiodata,
        };

        return res.status(200).json(finalResponse);
    } catch (error) {
        console.error("Error Update Biodata:", error);
        return res.status(500).json({ message: "Gagal Update Data!" });
    }
};