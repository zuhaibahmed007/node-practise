const { UserModel } = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { isWeb } = require("../routeHelpers");

const me = async (req, res) => {
    try {
        let user = await UserModel.findOne({ _id: global.user_id }).select('-password');
        if (!user) {
            if (isWeb(req)) {
                return res.redirect('/web/login');
            } else {
                return res.status(401).json({ error: 'No User Found!' });
            }
        }
        // if (isWeb(req)) {
            return res.status(200)
                .render('index', {
                    user: {
                        _id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        email: user.email,
                    }
                })
        // } else {
        //     return res.status(200).json(user)
        // }

    } catch (err) {
        console.log("🚀 ~ file: authController.js:14 ~ me ~ err", err)
        return res.status(500).json({ error: 'Something Went Wrong!' })
    }
}

const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            if (isWeb(req))
                return res.status(400).render('login', { error: 'Invalid Email and Password!', form: req.body })
            else
                return res.status(400).json({ error: 'Invalid Email and Password!' });
        }

        const result = await bcrypt.compare(password, user.password);

        if (!result)
            if (isWeb(req))
                return res.status(400).render('login', { error: 'Invalid Email and Password!', form: req.body })
            else
                return res.status(400).json({
                    error: 'Invalid Email and Password'
                });

        const token = await jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        if (isWeb(req)) {
            req.session.access_token = token;
            return res.redirect('/web');
        }
        else
            return res.status(200).json({
                status: true,
                message: 'Login Successfully!',
                detail: user,
                token_detail: {
                    access_token: token,
                    token_type: 'Bearer'
                }
            });

    } catch (err) {
        console.log('ERRRR', err)
        return res.status(500)
            .json({ error: 'Something Went Wrong!' })
    }
}

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;

        if (!(email && first_name && last_name && password))
            if (isWeb(req))
                return res.render('register', { status: 404, error: 'All feilds required!' });
            else
                return res.status(404).json({ error: 'All feilds required!' });

        const oldUser = await UserModel.findOne({ email });
        if (oldUser)
            if (isWeb(req))
                return res.status(400).render('register', { error: 'Email is already in use!', form: req.body });
            else
                return res.status(400).json({ error: 'Email is already in use!' });

        const enrypPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            first_name,
            last_name,
            profile_url: null,
            email: email.toLowerCase(),
            password: enrypPassword
        });

        const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        if (isWeb(req)) {
            req.session.access_token = token;
            return res.redirect('/web');
        }
        else
            return res.status(200).json({
                status: true,
                message: 'User Register Successfully!',
                detail: user,
                token_detail: {
                    access_token: token,
                    token_type: 'Bearer'
                }
            });

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

const logout = async (req, res) => {
    try {
        if (isWeb(req)) {
            req.session.destroy((err) => {
                if (err) {
                    res.render('index', { error: 'Something went wrong' });
                } else {
                    res.redirect('/web/login');
                }
            });
        }
    } catch (err) {
        res.status(500).send('Something went wrong!')
    }
}

module.exports = {
    login,
    register,
    me,
    logout
}