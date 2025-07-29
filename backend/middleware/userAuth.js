import jwt from "jsonwebtoken";

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.json({ success: false, message: "Unauthorized user" });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    req.body.userId = tokenDecode.id;
    next();
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default userAuth;
