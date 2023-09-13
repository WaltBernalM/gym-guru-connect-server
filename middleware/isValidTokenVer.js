const TokenVersion = require("../models/TokenVersion.model")

exports.isValidTokenVer = async (req, res, next) => { 
  try {
    const tokenVersionId =
      process.env.NODE_ENV === "production"
        ? process.env.TOKENVERSION_ID
        : "64efeb57ac2584d6eacadce1"
    
    const tokenInDB = await TokenVersion.findById(tokenVersionId)
    const tokenVersion = req.payload.version
    const currentTokenVersion = tokenInDB.version
    
    if (tokenVersion !== currentTokenVersion) {
      return res.status(401).json({ message: "Unauthorized (invalid Token version)" })
    }
    next()
  } catch (error) { 
    res.status(500).json({ message: 'Internal Server Error' })
  }
}