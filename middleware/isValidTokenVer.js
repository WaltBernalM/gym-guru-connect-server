const { getCurrentTokenVersion } = require("../controllers/config")


exports.isValidTokenVer = async (req, res, next) => { 
  try {
    const tokenVersion = req.payload.version
    const currentTokenVersion = getCurrentTokenVersion()
    console.log('token versions: ', currentTokenVersion, tokenVersion)
    if (tokenVersion !== currentTokenVersion) {
      return res.status(401).json({ message: "Unauthorized (invalid Token version)" })
    }
    next()
  } catch (error) { 
    res.status(500).json({ message: 'Intergal Server Error' })
  }
}