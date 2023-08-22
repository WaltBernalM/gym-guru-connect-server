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
    let trainerInDB = await Trainer.findById(trainerId).select("-password")
    if (!trainerInDB) {
      res.status(404).json({ message: "Trainer credentials not found" })
      return
    }

    if (trainerInDB.schedule.length > 0) {      
      trainerInDB = await trainerInDB.populate("schedule")
    }

    const isTrainer = req.payload._id === trainerId
    if (isTrainer) {
      if (trainerInDB.trainees.length > 0) { 
        res.status(200).json(await trainerInDB.populate("trainees"))
      } else {
        res.status(200).json(trainerInDB)
      }
    } else {
      res.status(200).json(trainerInDB)
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
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

const putAddTrainee = async (req, res, next) => { 
  try {
    const { trainerId } = req.params
    const { _id: traineeId } = req.payload

    const traineeInTrainer = await Trainer.findOne({trainees: traineeId})
    
    if (!traineeInTrainer) {
      const updatedTrainer = await Trainer.findByIdAndUpdate(
        trainerId,
        { $push: { trainees: traineeId } },
        { new: true }
      )
    } else if (traineeInTrainer) {
      res.status(409).json({ message: "Trainee already exists in Trainer's trainees list" })
      return
    }
    
    res.status(200).json({ message: "Trainee added to Trainer's trainee list" })

  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}

module.exports = { getAllTrainers, getTrainer, putUpdateTrainer, putAddTrainee}