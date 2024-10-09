const multer=require('multer')
const uuid4 = require('uuid4');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
      	filename(req, file, done) {
            const randomID = uuid4();
            const ext = file.mimetype.split("/")[1];
            const filename = randomID +"."+ ext;
            done(null, filename);
        },
		destination(req, file, done) {
		    
            done(null, "./uploads");
	    },
    }),
    //file size
    limits: { fileSize: 0 * 0 },
});

const uploadMiddleware = upload.single('file');


module.exports.uploadMiddleware=uploadMiddleware