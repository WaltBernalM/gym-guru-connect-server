const { getCurrentTokenVersion } = require("../controllers/config")
const { default: TokenVersion } = require("../models/TokenVersion.model")


exports.isValidTokenVer = async (req, res, next) => { 
  try {
    const isAnyTokenInDB = await TokenVersion.find()
    if (!isAnyTokenInDB) {
      await TokenVersion.create({ version: 1 })
    }

    const currentTokenVersionInDB = await TokenVersion.find()
    console.log('dbTokenVer:', currentTokenVersionInDB)

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