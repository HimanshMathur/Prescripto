import jwt from "jsonwebtoken";

const authAdmin = async (req, res, next) => {
  try {
    const { atoken } = req.headers;

    if (!atoken) {
      return res.json({
        success: false,
        message: "Token Not Found",
      });
    }

    const decoded = jwt.verify(atoken, process.env.JWT_SECRET);

    if (decoded.email !== process.env.ADMIN_EMAIL) {
      return res.json({
        success: false,
        message: "Invalid Token",
      });
    }

    next();
  } catch (error) {
    console.log(error);

    return res.json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export default authAdmin;