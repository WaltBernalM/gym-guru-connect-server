const router = require("express").Router()

const {
  postCreateAppointment,
} = require("../controllers/appointment.controller")
const { isTrainee } = require("../middleware/isTrainee.middleware")
const { isAllowedTrainer } = require("../middleware/isAllowedTrainer.middleware")

// Create available Appointment and add it to Trainer (creation of appointments from 24 hours)
router.post("/trainer/:trainerId", isAllowedTrainer, postCreateAppointment)

// Updated Appointment from trainer's list to add a trainee (only before 48 hours)
router.put("/:appointmentId/trainer/trainer:id/trainee/:traineeId", isTrainee)

// Remove appointment from Trainer list by trainee ( only before 48 hours)
router.delete(
  "/:appointmentId/trainer/trainer:id/trainee/:traineeId",
  isTrainee
)

// Delete Appointment from Trainer's appointment list (only if not booked already and before 24h)
router.delete("/:appointmentId/trainer/:trainerId", isAllowedTrainer)

module.exports = router
