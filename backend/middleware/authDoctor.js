import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
    try {
        // Safe Header extraction (dtoken or dToken)
        const dtoken = req.headers.dtoken || req.headers.dToken;

        if (!dtoken) {
            return res.json({ 
                success: false, 
                message: "Token Not Found. Login Again." 
            });
        }

        // Token Decode
        const token_decode = jwt.verify(dtoken, process.env.JWT_SECRET);
        
        // Body verification & initialization
        if (!req.body) {
            req.body = {};
        }

        // Handle both 'id' or '_id' payloads safely
        req.body.docId = token_decode.id || token_decode._id;

        if (!req.body.docId) {
             return res.json({ 
                 success: false, 
                 message: "Invalid Token Payload. Login Again." 
             });
        }

        next();

    } catch (error) {
        console.log("Doctor Auth Error:", error.message);
        return res.json({ 
            success: false, 
            message: "Not Authorized. Login Again." 
        });
    }
}

export default authDoctor;