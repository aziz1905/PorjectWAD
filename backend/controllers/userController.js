const users = [
    {
    id: 1,
    fullName: 'Farhan Fathur',
    email: 'farhan@example.com',
    password: 'hashed_password_1' // Kata sandi harus selalu di-hash!
    },
    {
    id: 2,
    fullName: 'Aziz R.',
    email: 'aziz@example.com',
    password: 'hashed_password_2'
    }
];

export const getAlluser = ('/', (req, res) => {
    const safeUsers = users.map(u => {
        const { password, ...safeUser } = u;
        return safeUser; 
    });
    res.status(200).json(safeUsers);
});

export const GetUserById = (req, res) => {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);

    if (user) {
        const { password, ...safeUser } = user;
        res.status(200).json(safeUser);
    } else {
        res.status(404).json({ message: `User dengan ID ${userId} tidak ditemukan.` });
    }
};

export const createAccount = (req, res) => {
    users.push(newUser);
    res.status(201).json({message : 'User Berhasil dibuat!', user : newUser});
};

export const loginAccount = (req, res) => {
    const {email , password} = req.body;
    const user = users.find( u => u.email === email);

    if(user && user.password === password){
    res.status(200).json({message : 'User Ditemukan!', user : user});
    } else {
    res.status(401).json({message : 'Email atau password salah!'});
    }
};