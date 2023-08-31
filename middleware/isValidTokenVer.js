const { getCurrentTokenVersion } = require("../controllers/config")
const TokenVersion = require("../models/TokenVersion.model")


exports.isValidTokenVer = async (req, res, next) => { 
  try {
    const tokenInDB = await TokenVersion.find()
    console.log('tokenInDB', tokenInDB)
    
    const tokenVersion = req.payload.version
    const currentTokenVersion = getCurrentTokenVersion()
    if (tokenVersion !== currentTokenVersion) {
      return res.status(401).json({ message: "Unauthorized (invalid Token version)" })
    }
    next()
  } catch (error) { 
    res.status(500).json({ message: 'Intergal Server Error' })
  }
}