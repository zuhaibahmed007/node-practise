const { UserModel } = require("../models");
const { isWeb } = require("../routeHelpers");

const createUser = (req, res) => {
    console.log("create user");
    res.send("success 1");
}

const getFiles = (req, res) => {
    console.log("getting id: ", req.body.surname, req.file);
    res.send("succes");
}

const updateUser = async (req, res) => {
    try {
        const { _id, first_name, last_name, email } = req.body;
        console.log("🚀 ~ file: usersController.js:17 ~ updateUser ~ _id", _id)
        let profile_url = req.file;
        if (!_id) {
            if (isWeb(req))
                return res.status(401).render('index', {
                    error: 'No User found!',
                    detail: {
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        _id: _id
                    }
                })
            else
                return res.status(401).json({ error: 'No User found!' });
        }

        UserModel.findOneAndUpdate(
            { _id: _id },
            {
                ...(first_name && { first_name: first_name }),
                ...(last_name && { last_name: last_name }),
                ...(profile_url && { profile_url: profile_url.filename })
            },
            (err, user) => {
                console.log('USERS =>>', user?.profile_url);
                if (err) {
                    if (isWeb(req))
                        return res.status(401).render('index', { error: 'No User found!' })
                    else
                        return res.status(401).json({ error: 'No User found!' });
                }
                if (isWeb(req))
                    return res.status(200).render('index', {
                        detail: {
                            first_name: user.first_name,
                            last_name: user.last_name,
                            email: user.email,
                            _id: user._id
                        },
                        message: 'User Updated Successfully!'
                    })
                else
                    return res.json({ user })

            }
        );
    } catch (err) {
        console.log("🚀 ~ file: usersController.js:17 ~ updateUser ~ err", err)
        return res.status(500).json({ error: 'Something Went Wrong!' });
    }
}

const deleteUser = async (req, res) => {
    try {
        const { _id } = req.body;
        UserModel.remove({ _id: _id }, function (err) {
            if (err) {
                console.log("🚀 ~ file: usersController.js:49 ~ err", err)
                return res.status(401).json({ error: 'No User Found!' });
            } else {
                return res.status(200).json({ error: 'User Delete Successfully!' });
            }
        });
    } catch (err) {
        console.log("🚀 ~ file: usersController.js:17 ~ updateUser ~ err", err)
        return res.status(500).json({ error: 'Something Went Wrong!' });
    }
}

module.exports = {
    createUser,
    getFiles,
    updateUser,
    deleteUser
}