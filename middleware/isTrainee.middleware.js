const Trainee = require('../models/Trainee.model')

exports.isTrainee = async (req, res, next) => { 
  const { _id: traineeId } = req.payload
  const traineeInDB = await Trainee.findById(traineeId)

  if (!traineeInDB) { 
    res.status(404).json({ message: "Trainee credentials not found in db" })
    return
  }
  next()
}