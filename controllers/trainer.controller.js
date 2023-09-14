const Trainee = require("../models/Trainee.model")
const Trainer = require("../models/Trainer.model")

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

    const clonedTrainer = JSON.parse(JSON.stringify(trainerInDB))
    clonedTrainer.schedule = clonedTrainer.schedule.sort(
      (a, b) =>
        new Date(a.dayInfo).setHours(a.hour) -
        new Date(b.dayInfo).setHours(b.hour)
    )

    const isTrainer = req.payload._id === trainerId
    if (isTrainer) { 
      const updatedTrainer = await trainerInDB.populate('trainees')
      const clone = JSON.parse(JSON.stringify(updatedTrainer))
      clone.schedule = clone.schedule.sort(
        (a, b) =>
          new Date(a.dayInfo).setHours(a.hour) -
          new Date(b.dayInfo).setHours(b.hour)
      )
      res.status(200).json(clone)
    } else {
      res.status(200).json(clonedTrainer)
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
    const { trainerId, traineeId } = req.params

    const currentTrainer = await Trainer.findOne({
      trainees: traineeId,
    }).populate("schedule")

    let currentTrainerId
    if (currentTrainer) {
      currentTrainerId = currentTrainer._id
    }

    if (currentTrainerId && JSON.parse(JSON.stringify(currentTrainerId)) === trainerId) {
      res.status(400).json({ message: 'Trainee already asigned to this Trainer' })
      return
    }

    const options = {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }
    const currentDate = new Date().toLocaleString("en-US", options)
    const currentTrainerSchedule = currentTrainer?.schedule.filter(
      (appointment) => {
        fixedTraineeId = JSON.parse(JSON.stringify(appointment.traineeId))
        if (appointment.dayInfo >= currentDate) {
          console.log('dayInfo:', appointment.dayInfo, 'currentDate', currentDate)
          console.log('dayInfoDate:', new Date(appointment.dayInfo), 'currentDateDate', new Date(currentDate))
        }
          return (
            !appointment.isAvailable &&
            appointment.dayInfo >= currentDate &&
            fixedTraineeId === traineeId
          )
      }
    )
    
    if (currentTrainer && currentTrainerSchedule.length > 0) { 
      console.log(currentTrainerSchedule)
      res.status(400)
        .json({ message: "Cannot reasign because of remaining appointments with current Trainer" })
      return
    }
    
    let previusTrainer
    if (currentTrainer) {
      previusTrainer = await Trainer.findByIdAndUpdate(
        currentTrainer._id,
        { $pull: { trainees: traineeId } },
        { new: true }
      )
    }

    const newTrainer = await Trainer.findByIdAndUpdate(
      trainerId,
      { $push: { trainees: traineeId } },
      { new: true }
    )

    const updatedTrainee = await Trainee.findByIdAndUpdate(
      traineeId,
      { trainerId },
      { new: true}
    )
    
    if (currentTrainer) {
      res.status(200).json({ message: `Reasignment was successful`, prevTrainer: currentTrainer._id, newTrainer: newTrainer._id })
    } else {
      res.status(200).json({ message: `Trainee added to a Trainer`, newTrainer})
    }
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}

module.exports = {
  getAllTrainers,
  getTrainer,
  putUpdateTrainer,
  putAddTrainee,
}