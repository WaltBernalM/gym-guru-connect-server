const Trainer = require("../models/Trainer.model")
const Trainee = require("../models/Trainee.model")
const Appointment = require("../models/Appointment.model")

const postCreateAppointment = async (req, res, next) => {
  try {
    const { trainerId } = req.params
    const { dayInfo, hour } = req.body

    if (!dayInfo || !hour) {
      res.status(400).json({ message: "dayInfo and hour are required fields" })
      return
    }

    if (isNaN(Date.parse(dayInfo))) {
      res
        .status(400)
        .json({ message: "dayInfo must be a valid Date type (YYYY/MM/DD)" })
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

    const input = new Date(dateInput)
    const fix = input.setDate(input.getDate() + 2)
    const fixedInput = new Date(fix).toLocaleString("en-US", options)
    const fixedInputDate = new Date(fixedInput)
    
    const today = new Date(currentDate)
    const todayAddTwo = new Date(today.setDate(today.getDate() + 2))
    const todayPlusTwo = new Date(todayAddTwo)
    
    if (process.env.NODE_ENV === 'production') {
      if (fixedInputDate < todayPlusTwo) {
        res.status(400).json({message: "Cannot create dates before the next 48 hours",})
        return
      }
    } else {
      if (new Date(dateInput) < todayPlusTwo) {
        res.status(400).json({
          message: "Cannot create dates before the next 48 hours",
        })
        return
      }
    }

    if (hour < 7 || hour > 22 || hour % 1 !== 0) {
      res
        .status(400)
        .json({ message: "Hour must be an integer between 7 and 22" })
      return
    }

    const trainer = await Trainer.findById(trainerId).populate("schedule")
    const { schedule: trainerSchedule } = trainer
    let slotTaken = false

    if (process.env.NODE_ENV === 'production') { 
      trainerSchedule.forEach((appointment) => {
        if (appointment.hour === hour && appointment.dayInfo === fixedInput) {
          slotTaken = true
          return
        }
      })
    } else {
      trainerSchedule.forEach((appointment) => {
        if (appointment.hour === hour && appointment.dayInfo === dateInput) {
          slotTaken = true
          return
        }
      })
    }

    if (slotTaken) {
      res
        .status(409)
        .json({ message: `${dayInfo} @ ${hour}:00 is already in schedule` })
      return
    }

    const createdAppointment = await Appointment.create({
      dayInfo: process.env.NODE_ENV === 'production' ? fixedInput : dateInput,
      hour,
    })
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      trainerId,
      { $push: { schedule: createdAppointment._id } },
      { new: true }
    )
      .populate("schedule")
      .select("-password")

    res
      .status(201)
      .json({ message: "Appointment added to trainer", updatedTrainer })
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}

const getAllAppointmentsByTrainer = async (req, res, next) => {
  try {
    const { trainerId } = req.params
    const { isTrainer } = req.payload
    let trainerInDB
    
    if (isTrainer) {
      trainerInDB = await Trainer.findById(trainerId)
        .populate({
          path: "schedule",
          populate: {
            path: "traineeId",
            select: '-password'
          },
        })
    } else {
      trainerInDB = await Trainer.findById(trainerId).populate({
        path: "schedule",
      })
    }
    
    const { schedule } = trainerInDB
    const sortedSchedule = schedule.sort(
      (a, b) =>
        new Date(a.dayInfo).setHours(a.hour) -
        new Date(b.dayInfo).setHours(b.hour)
    )

    res.status(200).json({ schedule: sortedSchedule })
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}

const getAllAppointmentsForTrainee = async (req, res, next) => {
  try {
    const { traineeId } = req.params
    const appointmentsInDB = await Appointment.find({ traineeId })

    const sortedAppointments = JSON.parse(JSON.stringify(appointmentsInDB))
      .sort((a, b) => new Date(a.dayInfo).setHours(a.hour) - new Date(b.dayInfo).setHours(b.hour))

    res.status(200).json(sortedAppointments)
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}

const putAddTrainee = async (req, res, next) => {
  try {
    const { appointmentId, traineeId } = req.params

    const appointmentInDB = await Appointment.findById(appointmentId)
    const traineeInDB = await Trainee.findById(traineeId)
    
    if (!appointmentInDB.isAvailable && JSON.stringify(traineeInDB._id)  !== JSON.stringify(appointmentInDB.traineeId)) {
      res.status(423).json({ message: "Locked Appointment: It has a booking already for a different Trainee" })
      return
    }

    if (!appointmentInDB.isAvailable && JSON.stringify(traineeInDB._id) === JSON.stringify(appointmentInDB.traineeId)) { 
      res.status(423).json({ message: "Locked Appointment: It has a booking already for this Trainee" })
      return
    }
    
    const { dayInfo } = appointmentInDB

    const options = {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }
    const currentDate = new Date().toLocaleString("en-US", options)
    const dateInput = new Date(dayInfo).toLocaleString("en-US", options)

    const input = new Date(dateInput)
    const fix = input.setDate(input.getDate() + 2)
    const fixedInput = new Date(fix).toLocaleString("en-US", options)
    const fixedInputDate = new Date(fixedInput)

    const today = new Date(currentDate)
    const todayAddTwo = new Date(today.setDate(today.getDate() + 2))
    const todayPlusTwo = new Date(todayAddTwo)
    
    if (process.env.NODE_ENV === "production") {
      if (fixedInputDate < todayPlusTwo) {
        res
          .status(400)
          .json({ message: "Cannot book prior to 48h" })
        return
      }
    } else {
      if (new Date(dateInput) < todayPlusTwo) {
        res.status(400).json({
          message: "Cannot book prior to 48 hours",
        })
        return
      }
    }

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      appointmentId,
      { traineeId, isAvailable: false },
      { new: true }
    )
    
    res.status(200).json({
      message: `${updatedAppointment.dayInfo} @ ${updatedAppointment.hour}:00 booked`, updatedAppointment
    })
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}

const patchRemoveTrainee = async (req, res, next) => { 
  try {
    const traineeInDB = await Trainee.findById(req.params.traineeId)
    const { _id: traineeId } = traineeInDB
    const appointmentInDB = await Appointment.findById(req.params.appointmentId)

    if (JSON.stringify(appointmentInDB.traineeId) !== JSON.stringify(traineeId)) {
      res.status(400).json({
        message:"Target Appointment does not contain the TraineeId to be removed.",
      })
      return
    }

    const { dayInfo } = appointmentInDB

    const options = {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }
    const currentDate = new Date().toLocaleString("en-US", options)
    const dateInput = new Date(dayInfo).toLocaleString("en-US", options)

    const input = new Date(dateInput)
    const fix = input.setDate(input.getDate() + 2)
    const fixedInput = new Date(fix).toLocaleString("en-US", options)
    const fixedInputDate = new Date(fixedInput)

    const today = new Date(currentDate)
    const todayAddTwo = new Date(today.setDate(today.getDate() + 2))
    const todayPlusTwo = new Date(todayAddTwo)

    if (process.env.NODE_ENV === "production") {
      if (fixedInputDate < todayPlusTwo) {
        res
          .status(400)
          .json({ message: "Cannot remove appointment prior to 48 hours" })
        return
      }
    } else {
      if (new Date(dateInput) < todayPlusTwo) {
        res.status(400).json({
          message: "Cannot remove appointment prior to 48 hours",
        })
        return
      }
    }

    const { traineeId: traineeIdParams} = req.params
    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.appointmentId,
      { $unset: { traineeId: traineeIdParams, isAvailable: true } },
      { new: true }
    )

    res.status(200).json({message: "Removed traineeId", updatedAppointment})
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}

const deleteAppointment = async (req, res, next) => {
  try {
    const { appointmentId, trainerId } = req.params
    
    const { dayInfo } = await Appointment.findById(appointmentId)
    const options = {
      timeZone: "America/Los_Angeles",
      year: "numeric",
      month: "numeric",
      day: "numeric",
    }
    const currentDate = new Date().toLocaleString("en-US", options)
    const dateInAppointment = new Date(dayInfo).toLocaleString("en-US", options)
    const today = new Date(currentDate)
    if (new Date(dateInAppointment) < today.setDate(today.getDate() + 1)) {
      res.status(400).json({
        message: "Cannot delete prior to 24 hours",
      })
      return
    }
    
    const deletedAppointment = await Appointment.findByIdAndDelete(
      appointmentId
    )
    const updatedTrainer = await Trainer.findByIdAndUpdate(
      trainerId,
      { $pull: { schedule: appointmentId } },
      { new: true }
    )
      .select("-password")
      .select("-trainees")
      .populate({
        path: "schedule",
        populate: {
          path: 'traineeId',
          select: '-password'
        }
      })
    
    const sortedSchedule = updatedTrainer.schedule.sort(
      (a, b) =>
        new Date(a.dayInfo).setHours(a.hour) -
        new Date(b.dayInfo).setHours(b.hour)
    )

    res
      .status(200)
      .json({
        message: "Appointment deleted",
        deletedAppointment,
        schedule: sortedSchedule,
      })
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}


module.exports = {
  postCreateAppointment,
  getAllAppointmentsByTrainer,
  getAllAppointmentsForTrainee,
  putAddTrainee,
  patchRemoveTrainee,
  deleteAppointment,
}