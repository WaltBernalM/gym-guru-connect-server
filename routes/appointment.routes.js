const router = require("express").Router()

const {
  postCreateAppointment, putAddTrainee,
} = require("../controllers/appointment.controller")

// Verifies that is a Trainee is in DB
const { isTrainee } = require("../middleware/isTrainee.middleware")

// Verifies that Trainer payload data and params data match, and that Trainer is in Db
const { isAllowedTrainer } = require("../middleware/isAllowedTrainer.middleware")

// Verifies that Trainee payload data and params data match, and that Trainee is in Db
const { isAllowedTrainee } = require("../middleware/isAllowedTrainee.middleware")
const { appointmentAvailable } = require("../middleware/appointmentAvailable.middleware")



// Create available Appointment and add it to Trainer (creation of appointments from 24 hours)
router.post("/trainer/:trainerId", isAllowedTrainer, postCreateAppointment)

// Updated Appointment from trainer's list to add a trainee (only before 48 hours)
router.put(
  "/:appointmentId/trainer/:trainerId/trainee/:traineeId",
  isAllowedTrainee,
  appointmentAvailable,
  putAddTrainee
)

// Remove appointment from Trainer list by trainee ( only before 48 hours)
router.delete(
  "/:appointmentId/trainer/trainer:id/trainee/:traineeId",
  isTrainee
)

// Delete Appointment from Trainer's appointment list (only if not booked already and before 24h)
router.delete("/:appointmentId/trainer/:trainerId", isAllowedTrainer)

module.exports = router
