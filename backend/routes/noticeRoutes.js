const express = require('express');
const multer = require('multer');
const path = require('path');
const { getNotices, createNotice, updateNotice, deleteNotice } = require('../controllers/noticeController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Multer Setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './backend/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|pdf|doc|docx/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb('Error: Images/PDF/Docs only!');
        }
    }
});

// Routes
router.route('/')
    .get(getNotices)
    .post(protect, upload.single('attachment'), createNotice);

router.route('/:id')
    .put(protect, upload.single('attachment'), updateNotice)
    .delete(protect, deleteNotice);

module.exports = router;
