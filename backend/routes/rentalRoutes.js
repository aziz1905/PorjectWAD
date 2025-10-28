import express from 'express';
import { 
    createRental, 
    getRentalDetails, 
    updateRentalOrderStatus, 
    updateRentalReturnStatus,
    getMyRentals, 
    submitReturnRequest,
    getAllRentals, 
    getRentalSummary 
} from '../controllers/rentalsController.js';import { updateItemReturnDetails } from '../repository/rentalsRepository.js';
import { authenticateToken } from '../middleware/authenticateToken.js';
import { authorizerole } from '../middleware/authorizeRole.js';

const router = express.Router();

router.post('/createRental', authenticateToken, authorizerole('customer'), createRental);
router.get('/my-rentals', authenticateToken, authorizerole('customer'), getMyRentals);
router.post('/:id/submit-return', authenticateToken, authorizerole('customer'), submitReturnRequest); 
router.get('/:id', authenticateToken, getRentalDetails); 
router.get('/', authenticateToken, authorizerole('admin'), getAllRentals);
router.get('/summary', authenticateToken, authorizerole('admin'), getRentalSummary); 
router.put('/:id/order', authenticateToken, authorizerole('admin'), updateRentalOrderStatus);
router.put('/:id/return', authenticateToken, authorizerole('admin') , updateRentalReturnStatus);
router.put('/:rentalId/items/:productId',  authenticateToken, authorizerole('admin') , updateItemReturnDetails);

export default router;