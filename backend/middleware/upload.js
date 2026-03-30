const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || 
      file.originalname.endsWith('.glb') || 
      file.originalname.endsWith('.gltf') ||
      file.originalname.endsWith('.bin')) {
    cb(null, true);
  } else {
    cb(new Error('Only image and 3D model (.glb, .gltf, .bin) files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024 // 50MB limit for 3D models
  }
});

module.exports = upload;