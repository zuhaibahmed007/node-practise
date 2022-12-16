const jwt = require('jsonwebtoken');

let sessionAuth = function (req, res, next) {
    let token = req.headers?.authorization;
    token = token.split(' ')[1];

    let noSessionReq = [
        '/api/login',
        '/api/register',
    ];

    if (noSessionReq.indexOf(req.originalUrl) !== -1) {
        console.log('NO SESSION REQ', noSessionReq.indexOf(req.originalUrl));
        next();
    } else if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            // console.log("🚀 ~ file: sessionAuth.js:17 ~ jwt.verify ~ decoded", decoded);
            if (err) {
                return res.status(401).json({ error: 'You Are Uanthorized!' });
            }
            global.user_id = decoded.user_id;
            next();
        })
    }
    else
        return res.status(401).json({ error: 'You Are Uanthorized!' });
};

module.exports = sessionAuth;