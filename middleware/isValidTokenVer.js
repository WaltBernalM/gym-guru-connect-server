const { getCurrentTokenVersion } = require("../controllers/config")


exports.isValidTokenVer = async (req, res, next) => { 
  try {
    console.log('version of client token:', req.payload.version)
    console.log('current Token version' ,getCurrentTokenVersion())
    next()
  } catch (error) { 
    res.status(500).json({ message: 'Intergal Server Error' })
  }
}