const Trainee = require('../models/Trainee.model')

exports.isAllowedTrainee = async (req, res, next) => {
  try {
    const { _id: idPayload } = req.payload
    const { traineeId } = req.params

    if (idPayload !== traineeId) {
      res
        .status(401)
        .json({
          message:
            "Unauthorized access, Trainee Id does not match as expected",
        })
      return
    }
    
    const traineeInDB = await Trainee.findById(traineeId)
    if (!traineeInDB) {
      res.status(404).json({ message: "Trainee account not found in DB" })
      return
    }
    
    next()
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" })
  }
}