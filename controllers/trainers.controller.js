const Trainer = require("../models/Trainer.model")
const Trainee = require("../models/Trainee.model")

const getAllTrainers = async (req, res, next) => {
  try {
    const allTrainers = await Trainer.find().select("-password")
    res.status(200).json(allTrainers)
  } catch (error) {
    res.status(500).json({message: "Internal server error"})
  }
}

const getTrainer = async (req, res, next) => { 
  try {
    const { trainerId } = req.params
    const trainerInDB = await Trainer.findById(trainerId).select("-password")
    if (!trainerInDB) {
      res.status(404).json({ message: "Trainer credentials not found" })
      return
    }
    res.status(200).json(trainerInDB)
  } catch (error) {
  }
}

const putUpdateTrainer = async (req, res, next) => { 
  try {
    const { trainerId } = req.params

    const updatedTrainer = await Trainer.findByIdAndUpdate(
      trainerId,
      req.body,
      { new: true }
    ).select("-password")
    
    res.status(201).json(updatedTrainer)
  } catch (error) {
    res.status(500).json({message: "Internal server error"})
  }
}

module.exports = { getAllTrainers, getTrainer, putUpdateTrainer }