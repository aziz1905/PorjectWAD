import db from '../db/db.js'; 
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema/userSchema.js';

const userReturnAttributes = {
    id: usersTable.id,
    fullName: usersTable.name,
    email: usersTable.email,
    role: usersTable.role, 
};

export const createUser = async (newUser) => {
    console.log("Data yang diterima repository:", newUser);


    const result = await db
        .insert(usersTable)
        .values({
            name: newUser.fullName, 
            email: newUser.email,
            password: newUser.password,
            role: newUser.role || 'customer'
        })
        .returning(userReturnAttributes);

    return result[0];
};

export const findByEmail = async (email) => {
    try{
        const result = await db
        .select({
            id: usersTable.id,
        fullName: usersTable.name,
        email: usersTable.email,
        password: usersTable.password,
        role: usersTable.role
        })
        .from(usersTable)
        .where(eq(usersTable.email, email))
        .limit[1];

        return result.lenght > 0 ? result[0] : undefined;
    }catch(error){
        console.error("Error findByEmail:", error);
        throw new Error('Gagal mencari user di database.');
    }
};