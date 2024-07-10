import multer from "multer";
import path from "path";
import File from "../models/file.model.js"

// Multer for file storage ---
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage }).single('file');

export const uploadFile = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) return res.status(500).send('File upload error');
        const newFile = new File({ filename: req.file.filename, user: req.user.id });
        await newFile.save();
        res.status(200).json({ filename: req.file.filename });
    });
};

export const transferFile = async (req, res) => {
    const { filename, recipient } = req.body;
    io.to(recipient).emit('fileTransfer', { filename });
    res.status(200).send('File transfer initiated');
};
