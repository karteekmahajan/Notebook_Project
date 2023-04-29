const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Good Boy';

const fetchuser = (req, res, next) => {
    console.log('fetchuser()')
    //  Get the user from the jwt token and add id to req object

    const token = req.header('auth-token');
    // console.log("req.header('auth-token'):", req.header('auth-token'))

    if (!token) {
        res.status(401).send({ error: "please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, JWT_SECRET)
        req.user = data.user
        next()
    } catch (error) {
        res.status(401).send({ error: "Token varification failed." })
    }

}

module.exports = fetchuser;