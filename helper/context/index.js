const jwt = require('jsonwebtoken');
const User = require('../../database/models/user');

module.exports.verifyUser = async (req) => {
    console.log("🔥🚀 ===> module.exports.verifyUser= ===> req.email ", req.email);
    try {
        req.email = null;
        req.loggedInUserId = null;
        const bearerHeader = req.headers.authorization;
        if (bearerHeader) {
            const token = bearerHeader.split(' ')[1];
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || 'mysecretkey');
            console.log("🔥🚀 ===> module.exports.verifyUser= ===> payload", payload);
            req.email = payload.email;
            const user = await User.findOne({ email: payload.email });
            req.loggedInUserId = user.id;
        }
        // bad!!!!!!
        // if (!req.email) {
        //     throw new Error('Access denied! Please login!')
        // }
    } catch (error) {
        console.log(error);
        throw error;
    }
}