import { createRentalTransaction, getRentalDetailsById, updateItemReturnDetails, updateOrderStatus, updateReturnStatus } from "../repository/rentalsRepository.js";



import { 
    createRentalTransaction, 
    getRentalDetailsById, 
    updateItemReturnDetails, 
    updateOrderStatus, 
    updateReturnStatus,
    findRentalsByUserId,
    findAllRentals, // <-- TAMBAHKAN INI
    getAdminRentalSummary // <-- TAMBAHKAN INI
} from "../repository/rentalsRepository.js";


// ... (Controller customer tetap sama) ...
export const createRental = async (req, res) => { /* ... */ };
export const getRentalDetails = async (req, res) => { /* ... */ };
export const getMyRentals = async (req, res) => { /* ... */ };
export const submitReturnRequest = async (req, res) => { /* ... */ };


// --- CONTROLLER BARU UNTUK ADMIN ---

// GET /rentals (Admin)
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

// GET /rentals/summary (Admin)
export const getRentalSummary = async (req, res) => {
    try {
        const summary = await getAdminRentalSummary();
        return res.status(200).json(summary);
    } catch (error) {
        console.error("Error getRentalSummary (Admin):", error);
        return res.status(500).json({ message: 'Gagal mengambil ringkasan data.' });
    }
};

// POST /rentals/createRental 
export const createRental = async (req, res) => {
    const userId = req.user.id;
    const { totalProduct, shippingCost, totalPayment, shippingAddress, paymentMethod, details } = req.body;

    // Tambahkan Pengecekan Duplikasi di Controller
    const productIds = details.map(item => item.productId);
    const uniqueIds = new Set(productIds);
    
    if (uniqueIds.size !== productIds.length) {
        return res.status(400).json({ message: 'Product ID dalam daftar pesanan tidak boleh ada duplikasi.' });
    }

    // Menggunakan nama field yang sama dengan repository untuk kejelasan
    const rentalData = { totalProduct, shippingCost, totalPayment, shippingAddress, paymentMethod };
    
    try {
        const newTransaction = await createRentalTransaction(userId, rentalData, details);
        
        // ambil elemen pertama
        const newRental = newTransaction.rental[0];
        
        return res.status(201).json({
            message: 'Pesanan sewa berhasil dibuat. Stok produk dikurangi.',
            rentalId: newRental.id,
            totalPayment: newRental.totalPayment,
            status: newRental.orderStatus
        });
    } catch (error) {
        console.error("Error createRental:", error);
        return res.status(500).json({ message: 'Gagal membuat pesanan.' });
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