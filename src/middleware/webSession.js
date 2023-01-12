const jwt = require('jsonwebtoken');

let webSession = async function (req, res, next) {
    let token = req.session.access_token;

    let noSessionReq = [
        '/web/login',
        '/web/register',
    ];

    if (noSessionReq.indexOf(req.originalUrl) !== -1) {
        console.log('NO SESSION REQ', noSessionReq.indexOf(req.originalUrl));
        if (req.session.access_token) {
            return res.redirect('/web');
        }
        next();
    } else if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) {
                return res.status(401).json({ error: 'You Are Unthorized!' });
            }
            global.user_id = decoded.user_id;
            next();
        })
    }
    else {
        return res.redirect('/web/login');
    }
}

module.exports = webSession;