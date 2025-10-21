import db from '../db/db.js'; 
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema/usersSchema.js';
import { usersBiodataTable } from '../db/schema/usersBiodataSchema.js';

const userReturnAttributes = {
    id: usersTable.id,
    fullName: usersTable.name,
    email: usersTable.email,
    role: usersTable.role, 
};

export const createUser = async (newUser) => {
    console.log("Data yang diterima repository:", newUser);

    try {
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
        
    } catch (error) {
        console.error("Error di createUser repository:", error);
        throw new Error('Gagal menyimpan user ke database.'); 
    }
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
        .limit(1);

        return result.length > 0 ? result[0] : undefined;
    }catch(error){
        console.error("Error findByEmail:", error);
        throw new Error('Gagal mencari user di database.');
    }
};

export const createOrReplaceBiodata = async(userId, data) => {
    const updatePayload = {
        phone: data.phone,
        address: data.address
    }

    // Mencari baris berdasarkan user_id
    const update = await db
        .update(usersBiodataTable)
        .set(updatePayload)
        .where(eq(usersBiodataTable.id, userId))
        .returning();

    if(update.length > 0){
        return update[0];
    }else{
        const created = await db
        .insert(usersBiodataTable)
        .values({... updatePayload, userId :userId})
        .returning();

        return created[0];
    }
};