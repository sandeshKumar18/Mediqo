import jwt from "jsonwebtoken";

// Middleware: verifies dToken and injects docId into req.body
const authDoctor = async (req, res, next) => {
  try {
    const { dtoken } = req.headers;

    if (!dtoken) {
      return res.json({
        success: false,
        message: "Not authorized. Login again.",
      });
    }

    const decoded = jwt.verify(dtoken, process.env.JWT_SECRET);

    req.body = req.body || {};
    req.body.docId = decoded.id;

    next();
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export default authDoctor;
