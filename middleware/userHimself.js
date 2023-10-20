const User = require('../models/User.model')

exports.userHimself = async (req, res, next) => {
  try {
    const { userId } = req.params

    if (!req.payload) {
      return res.status(400).json({ message: 'Invalid payload parameters'})
    }

    const { _id: idPayload } = req.payload 
      
    console.log('idPayload:', idPayload)
    if (userId !== idPayload) { 
      return res.status(403).json({message: 'Unauthorized access to authenticated user'})
    }
    next()
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error (middleware)" })
  }
}