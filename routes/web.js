const express = require('express');
const webRouter = express.Router();
const webSession = require('../src/middleware/webSession');
const multer = require('multer');

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

const {
  register,
  login,
  me,
  logout
} = require('../src/controllers/authController');

const {
  updateUser
} = require('../src/controllers/usersController');

const {
  registerRequest,
  loginRequest
} = require('../src/requests/authRequest');

webRouter.use(webSession);

// Dashboard
webRouter.get('/', me);
// User
webRouter.post('/update', upload.single('profile_url'), updateUser)


// Auth 
webRouter.get('/logout', logout);
webRouter.get('/login', (req, res) => {
  res.render('login');
});
webRouter.get('/register', (req, res) => {
  res.render('register');
});
webRouter.post('/register', registerRequest, register);
webRouter.post('/login', loginRequest, login);


/* GET users listing. */
webRouter.get('/error', function (req, res) {
  res.render('error.hbs');
});

module.exports = webRouter;
