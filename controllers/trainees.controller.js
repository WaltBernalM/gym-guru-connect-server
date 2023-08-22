const Trainee = require("../models/Trainee.model")

const getTrainee = async (req, res, next) => {
  try {
    const { traineeId } = req.params
    const traineeInDB = await Trainee.findById(traineeId).select("-password")
    res.status(200).json(traineeInDB)
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error })
  }
}

const putUpdateTrainee = async (req, res, next) => { 
  try {
    const { traineeId } = req.params

    const updatedTrainee = await Trainer.findByIdAndUpdate(
      traineeId,
      req.body,
      { new: true }
    ).select("-password")

    res.status(201).json(updatedTrainee)
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}


module.exports = {
  getTrainee,
  putUpdateTrainee,
}