const uploadImage = require('../utils/fileUpload');

// Usage inside a controller (assuming multer used to upload to /tmp)
const image = await uploadImage(req.file.path);
tile.imageUrl = image.url;
