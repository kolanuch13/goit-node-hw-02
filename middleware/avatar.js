const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'tmp')
    },
    filename: (req, file, cb) => {
        const user = req.user
        cb(null, user.email + path.extname(file.originalname))
    }
})

const upload = multer({storage: storage})

module.exports = upload;