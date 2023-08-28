const { getCurrentTokenVersion } = require("../controllers/config")


exports.isValidTokenVer = async (req, res, next) => { 
  try {
    const tokenVersion = req.payload.version
    const currentTokenVersion = getCurrentTokenVersion()
    console.log('version of client token:', tokenVersion)
    console.log('current Token version', currentTokenVersion)
    if (tokenVersion !== currentTokenVersion) {
      console.log('token version mismatch')
      return res.status(401).json({ message: "Unauthorized (invalid Token version" })
    }
    next()
  } catch (error) { 
    res.status(500).json({ message: 'Intergal Server Error' })
  }
}