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

    const today = new Date(currentDate)
    if (new Date(dateInput) < today.setDate(today.getDate() + 1)) {
      res
        .status(400)
        .json({
          message: "dayInfo cannot be in the past or in within the next 24h",
        })
      return
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
    trainerSchedule.forEach((appointment) => {
      if (appointment.hour === hour && appointment.dayInfo === dateInput) {
        slotTaken = true
        return
      }
    })
    if (slotTaken) {
      res
        .status(409)
        .json({ message: "Appointment slot is already in schedule" })
      return
    }

    const createdAppointment = await Appointment.create({
      dayInfo: dateInput,
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


module.exports = {
  postCreateAppointment
}