const { UserModel } = require("../models");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const me = async (req, res) => {
    try {
        let user = await UserModel.findOne({ _id: global.user_id }).select('-password');
        if (!user) {
            return res.status(401).json({ error: 'No User Found!' });
        }
        return res.status(200).json(user)

    } catch (err) {
        return res.status(500).json({ error: 'SomethingWent Wrong!' })
    }
}

const login = async (req, res) => {
    try {

        const { email, password } = req.body;
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ error: 'Invalid Email and Password!' });
        }

        const result = await bcrypt.compare(password, user.password);

        if (!result)
            return res.status(400).json({
                error: 'Invalid Email and Password'
            });

        const token = await jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

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
        // console.log(err)
        return res.status(500)
            .json({ error: 'Something Went Wrong!' })
    }
}

const register = async (req, res) => {
    try {

        const { first_name, last_name, email, password } = req.body;

        if (!(email && first_name && last_name && password))
            return res.status(404).json({ error: 'All feilds reuired!' });

        const oldUser = await UserModel.findOne({ email });
        if (oldUser)
            return res.status(400).json({ error: 'Email is already in use!' })

        const enrypPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            first_name,
            last_name,
            profile_url: null,
            email: email.toLowerCase(),
            password: enrypPassword
        });

        const token = jwt.sign({ user_id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        return res.status(200).json({
            status: true,
            message: 'User Regiter Successfully!',
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

module.exports = {
    login,
    register,
    me
}