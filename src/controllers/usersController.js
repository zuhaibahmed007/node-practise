const { UserModel } = require("../models");

const createUser = (req, res) => {
    console.log("create user");
    res.send("success 1");
}

const getFiles = (req, res) => {
    console.log("getting id: ", req.body.surname, req.file);
    res.send("succes");
}

const updateUser = async (req, res) => {
    console.log('in func')
    try {
        const { _id, first_name, last_name } = req.body;
        let profile_url = req.file;
        if (!_id) {
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
                    return res.status(401).json({ error: 'No User found!' });
                }
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