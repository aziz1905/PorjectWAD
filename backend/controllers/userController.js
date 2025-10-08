const users = [
    {
    id: 1,
    name: 'Farhan Fathur',
    email: 'farhan@example.com',
    password: 'hashed_password_1' 
    },
    {
    id: 2,
    name: 'Aziz R.',
    email: 'aziz@example.com',
    password: 'hashed_password_2'
    }
];

export const getAlluser =  (req, res) => {
    const safeUsers = users.map(u => {
        const { password, ...safeUser } = u;
        return safeUser; 
    });
    res.status(200).json(safeUsers);
};
    
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
    const newUser = req.body;
    if(!newUser || !newUser.email || !newUser.password){
        return res.status(400).json({message : 'Email dan password harus di isi!'});
    }
    if (users.find(u => u.email === newUser.email)){
        return res.status(409).json({message : 'Email sudah digunakan.'});
    }

    newUser.id = users.length + 1;
    newUser.imageUrl = 'https://via.placeholder.com/150/cccccc/ffffff?text=New';
    users.push(newUser);

    const {password, ...safeUser } = newUser;
    res.status(200).json({message : 'User berhasil dibuat!', user : safeUser});
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