const jwt = require('jsonwebtoken');
const User = require('../../database/models/user');

module.exports.verifyUser = async (req) => {
    // console.log("🔥🚀 ===> module.exports.verifyUser= ===> req.email ", req.email);
    // console.log("🔥🚀 ===> module.exports.verifyUser= ===> req.loggedInUserId", req.loggedInUserId);
    try {
        req.email = null;
        req.loggedInUserId = null;
        const bearerHeader = req.headers.authorization;
        if (bearerHeader) {
            const token = bearerHeader.split(' ')[1];
            const payload = jwt.verify(token, process.env.JWT_SECRET_KEY || 'mysecretkey');
            req.email = payload.email;

            // https://www.udemy.com/course/graphql-apollo-server-api-nodejs-mongodb/learn/lecture/16355610#notes
            const user = await User.findOne({ email: payload.email });
            console.log("🔥🚀 ===> module.exports.verifyUser= ===> user", user);
            req.loggedInUserId = user.id;
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
}