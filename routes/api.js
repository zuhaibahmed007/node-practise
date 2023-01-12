var express = require('express');
var apiRouter = express.Router();
const sessionAuth = require('../src/middleware/sessionAuth');
const multer = require('multer');
// const upload = multer({ dest: 'uploads/' });

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split("/")[1];
        cb(null, `/${file.fieldname}-${Date.now()}.${ext}`);
    }
});

const upload = multer({ storage: storage });

// Auth Controller
const {
    login,
    register,
    me
} = require('../src/controllers/authController');

// User Controller
const {
    createUser,
    getFiles,
    updateUser,
    deleteUser
} = require('../src/controllers/usersController');

// Auth Request
const {
    loginRequest,
    registerRequest
} = require('../src/requests/authRequest');

apiRouter.use(sessionAuth);

// Practise Route
apiRouter.post('/upload-files', upload.single('file'), getFiles);

// User
apiRouter.post('/update', upload.single('profile_url'), updateUser);
apiRouter.post('/delete', deleteUser);

// Jade 
apiRouter.get('/', (req, res) => {
    res.render("index")
});

// Auth
apiRouter.get('/me', me);
apiRouter.post('/login', loginRequest, login);
apiRouter.post('/register', registerRequest, register);


module.exports = apiRouter;
