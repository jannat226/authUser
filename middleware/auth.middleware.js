import jwt from "jsonwebtoken";
export const isLoggedIn = async (req, res, next) => {
  try {
    console.log(req.cookies);
    const token = req.cookies?.token;
    console.log("token found", token ? "YES" : "NO");

    if (!token) {
      console.log("No token found");
      return res.status(401).json({
        success: false,
        message: "Authentication failed",
      });
    }
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    console.log("decoded data", decodedToken);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.log("Auth middleware failure ");
    return res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};
