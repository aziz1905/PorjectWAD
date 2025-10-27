import db from '../db/db.js'; 
import { eq } from 'drizzle-orm';
import { usersTable } from '../db/schema/usersSchema.js';
import { usersBiodataTable } from '../db/schema/usersBiodataSchema.js';

const userReturnAttributes = {
    id: usersTable.id,
    fullName: usersTable.name,
    email: usersTable.email,
    role: usersTable.role
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

export const findById = async (userId) => {
    const id = parseInt(userId);
    if (isNaN(id)) {
        return undefined; 
    }

    try {
        const result = await db
            .select({
                id: usersTable.id,
                fullName: usersTable.name,
                email: usersTable.email,
                password: usersTable.password,
                role: usersTable.role,
                phone: usersBiodataTable.phone,
                address: usersBiodataTable.address,
                profileImageUrl: usersBiodataTable.profileImageUrl
            })
            .from(usersTable)
            .leftJoin(usersBiodataTable, eq(usersBiodataTable.userId, usersTable.id))
            .where(eq(usersTable.id, id))
            .limit(1);

        return result.length > 0 ? result[0] : undefined;

    } catch (error) {
        console.error(`Error findById for user ${id}:`, error);
        throw new Error('Gagal mencari user di database.');
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
        role: usersTable.role,
        phone: usersBiodataTable.phone,
        address: usersBiodataTable.address
            })
            .from(usersTable)
            // Gunakan LEFT JOIN agar user tetap ditemukan walau biodata belum ada
            .leftJoin(usersBiodataTable, eq(usersTable.id, usersBiodataTable.userId))
            .where(eq(usersTable.email, email))
            .limit(1);

        return result.length > 0 ? result[0] : undefined;
    }catch(error){
        console.error("Error findByEmail:", error);
        throw new Error('Gagal mencari user di database.');
    }
};

export const updatePassword = async (userId, newHashedPassword) => {
    try {
        const result = await db
            .update(usersTable)
            .set({ password: newHashedPassword })
            .where(eq(usersTable.id, userId))
            .returning({ id: usersTable.id, email: usersTable.email });
            
        return result[0] || null;
    } catch (error) {
        console.error("Drizzle Error Update Password:", error);
        throw new Error("Gagal memperbarui password di database.");
    }
};

export const createOrReplaceBiodata = async (userId, data) => {
    const updatePayload = {};

    if (data.phone !== undefined) updatePayload.phone = data.phone ?? '';
    if (data.address !== undefined) updatePayload.address = data.address ?? '';
    if (data.profileImageUrl !== undefined) updatePayload.profileImageUrl = data.profileImageUrl ?? '';

    try {

        // 1UPDATE berdasarkan userId
        const updated = await db
            .update(usersBiodataTable)
            .set(updatePayload)
            .where(eq(usersBiodataTable.userId, userId))
            .returning();

        if (updated.length > 0) {
            return updated[0]; // Baris ditemukan dan diupdate
        }

        // Jika tidak ditemukan, lakukan INSERT baru
        const createdPayload = {
            userId,
            phone: data.phone ?? '',
            address: data.address ?? '',
            profileImageUrl: data.profileImageUrl ?? '',
        };

        console.log("Insert Payload:", createdPayload);

        const created = await db
            .insert(usersBiodataTable)
            .values(createdPayload)
            .returning();

        console.log("Biodata created:", created[0]);
        return created[0];
    } catch (error) {
        console.error("Drizzle Error in createOrReplaceBiodata:", error);
        throw new Error("Gagal create/replace biodata.");
    }
};