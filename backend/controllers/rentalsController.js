import {
    createRentalTransaction,
    getRentalDetailsById,
    updateItemReturnDetails,
    updateOrderStatus,
    updateReturnStatus,
    findAllRentals,
    getAdminRentalSummary
} from "../repository/rentalsRepository.js";


export const createRental = async (req, res) => {
    try {
        const result = await createRentalTransaction(req.body);
        return res.status(201).json(result);
    } catch (error) {
        console.error("Error createRental:", error);
        return res.status(500).json({ message: 'Gagal membuat rental.' });
    }
};

export const getMyRentals = async (req, res) => {
    try {
        return res.status(501).json({ message: 'Not implemented.' });
    } catch (error) {
        console.error("Error getMyRentals:", error);
        return res.status(500).json({ message: 'Gagal mengambil rentals pengguna.' });
    }
};

export const submitReturnRequest = async (req, res) => {
    try {
        return res.status(501).json({ message: 'Not implemented.' });
    } catch (error) {
        console.error("Error submitReturnRequest:", error);
        return res.status(500).json({ message: 'Gagal mengajukan permintaan pengembalian.' });
    }
};



export const getAllRentals = async (req, res) => {
    try {
        const rentals = await findAllRentals();
        if (!rentals || rentals.length === 0) {
            return res.status(200).json([]);
        }
        return res.status(200).json(rentals);
    } catch (error) {
        console.error("Error getAllRentals (Admin):", error);
        return res.status(500).json({ message: 'Gagal mengambil semua data rental.' });
    }
};

export const getRentalSummary = async (req, res) => {
    try {
        const summary = await getAdminRentalSummary();
        return res.status(200).json(summary);
    } catch (error) {
        console.error("Error getRentalSummary (Admin):", error);
        return res.status(500).json({ message: 'Gagal mengambil ringkasan data.' });
    }
};

// GET /rentals/:id
export const getRentalDetails = async (req, res) => {
    const rentalId = req.params.id;

    try {
        const rentalDetails = await getRentalDetailsById(rentalId);

        if (!rentalDetails) {
            return res.status(404).json({ message: `Rental dengan ID ${rentalId} tidak ditemukan.` });
        }

        return res.status(200).json(rentalDetails);
    } catch (error) {
        console.error("Error getRentalDetails:", error);
        return res.status(500).json({ message: 'Gagal mengambil detail rental.' });
    }
};


export const updateRentalOrderStatus = async (req, res) => {
    const rentalId = req.params.id;
    // Asumsi: Admin mengirim status baru di body
    const { newStatus } = req.body; 

    // Validasi status
    if (!newStatus) {
        return res.status(400).json({ message: 'Status pesanan baru wajib diisi.' });
    }

    try {
        const updatedRental = await updateOrderStatus(rentalId, newStatus);

        if (updatedRental.length === 0) {
            return res.status(404).json({ message: `Rental dengan ID ${rentalId} tidak ditemukan.` });
        }

        return res.status(200).json({
            message: `Status pesanan berhasil diperbarui menjadi ${newStatus}.`,
            data: updatedRental[0], // Ambil elemen pertama dari array
        });
    } catch (error) {
        console.error("Error updateRentalOrderStatus:", error);
        return res.status(500).json({ message: 'Gagal memperbarui status pesanan.' });
    }
};


// PUT /rentals/:id/updateStatus
export const updateRentalReturnStatus = async (req, res) => {
    const rentalId = req.params.id;
    const { newStatus } = req.body;
    
    // Validasi status 
    if (!newStatus) {
        return res.status(400).json({ message: 'Status baru wajib diisi.' });
    }

    try {
        const updatedRental = await updateReturnStatus(rentalId, newStatus);

        if (updatedRental.length === 0) {
            return res.status(404).json({ message: `Rental dengan ID ${rentalId} tidak ditemukan.` });
        }

        return res.status(200).json({
            message: `Status pengembalian berhasil diperbarui menjadi ${newStatus}.`,
            data: updatedRental[0], // Ambil elemen pertama
        });
    } catch (error) {
        console.error("Error updateRentalReturnStatus:", error);
        return res.status(500).json({ message: 'Gagal memperbarui status pengembalian.' });
    }
};

// PUT /rentals/:rentalId/items/:productId 
export const updateRentalItemDetailsController = async (req, res) => {
    const { rentalId, productId } = req.params; 
    const { condition, fineAmount } = req.body; 

    // Validasi input
    if (!condition || typeof fineAmount === 'undefined') {
        return res.status(400).json({ message: 'Kondisi dan Denda wajib diisi.' });
    }
    
    try {
        // Panggil repository untuk update item
        const updatedItem = await updateItemReturnDetails(rentalId, productId, condition, fineAmount);

        if (updatedItem.length === 0) {
            return res.status(404).json({ message: 'Item pesanan tidak ditemukan atau ID tidak valid.' });
        }

        return res.status(200).json({
            message: 'Kondisi dan denda item berhasil dicatat.',
            data: updatedItem[0], // Ambil elemen pertama
        });

    } catch (error) {
        console.error("Error updateRentalItemDetailsController:", error);
        return res.status(500).json({ message: error.message || 'Gagal memproses pengembalian item.' });
    }
};