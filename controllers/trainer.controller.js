const Trainer = require("../models/Trainer.model")
const Trainee = require("../models/Trainee.model")
const Appointment = require("../models/Appointment.model")

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

const postCreateAppointment = async (req, res, next) => {
  try {
    const { trainerId } = req.params
    const { dayInfo, hour } = req.body

    if (!dayInfo || !hour) {
      res.status(400).json({ message: "dayInfo and hour are required fields" })
      return
    }

    if (isNaN(Date.parse(dayInfo))) {
      res.status(400).json({ message: "dayInfo must be a valid Date type (YYYY/MM/DD)" })
      return
    }

    const options = {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }
    const currentDate = new Date().toLocaleString("en-US", options)
    const dateInput = new Date(dayInfo).toLocaleString("en-US", options)

    const today = new Date(currentDate)
    if (new Date(dateInput) < today.setDate(today.getDate() + 1)) {
      res.status(400).json({ message: "dayInfo cannot be in the past or in within the next 24h" })
      return
    }

    if (hour < 7 || hour > 22 || hour % 1 !== 0) {
      res.status(400).json({ message: "Hour must be an integer between 7 and 22" })
      return
    }

    const trainer = await Trainer.findById(trainerId).populate('schedule')
    const { schedule: trainerSchedule } = trainer
    let slotTaken = false
    trainerSchedule.forEach(appointment => {
      if (appointment.hour === hour && appointment.dayInfo === dateInput) {
        slotTaken = true
        return
      }
    })
    if (slotTaken) {
      res.status(409).json({ message: "Appointment slot is already in schedule" })
      return
    }

    const createdAppointment = await Appointment.create({dayInfo: dateInput, hour})
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      trainerId,
      { $push: { schedule: createdAppointment._id } },
      { new: true }
    ).populate('schedule').select('-password')

    res.status(201).json({ message: "Appointment added to trainer", updatedTrainer })
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}


module.exports = {
  getAllTrainers,
  getTrainer,
  putUpdateTrainer,
  putAddTrainee,
  postCreateAppointment,
}