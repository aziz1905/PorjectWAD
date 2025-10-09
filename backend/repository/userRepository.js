import User from '../model/userModel.js';

export const createUser = async (newUser) => {
    const user = await User.create(newUser);
    console.log("Data yang diterima repository:", newUser);
    return user;
}

export const findByEmail = async (email) => {
    try{
        const user = await User.findOne({
            where: {email: email},
            attributes: ['id', 'fullName', 'email','password'] 
        });
        return user ? user.toJSON() : undefined;
    }catch(error){
        console.error("Error findByEmail:", error);
        throw new Error('Gagal mencari user di database.');
    }
};