import jwt from 'jsonwebtoken'

const authUser = async (req, res, next) => {
    try {
        // Headers se token nikalo
        const { token } = req.headers;

        if (!token) {
            return res.json({ success: false, message: "Token Not Found. Login Again." });
        }

        // Token ko decode karo 
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        
        // 🛠️ FIX 2: Agar body exist karti hai toh usme userId add karo, nahi toh create karo safely
        if (!req.body) {
            req.body = {};
        }

        req.body.userId = token_decode.id;

        next(); // Safe controller dispatch

    } catch (error) {
        console.log("User Auth Error:", error);
        return res.json({ success: false, message: "Not Authorized. Login Again." });
    }
}

export default authUser;