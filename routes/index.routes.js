const router = require("express").Router()
const { isAuthenticated } = require("../middleware/jwt.middleware")
const trainerRoutes = require('../routes/trainer.routes')
const traineeRoutes = require('../routes/trainee.routes')
const appointmentsRoutes = require('../routes/appointment.routes')

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "Welcome to Gym-Guru-Connect API" })
})


router.use('/trainers', isAuthenticated, trainerRoutes)
router.use('/trainees', isAuthenticated, traineeRoutes)
router.use('/appointments', isAuthenticated, appointmentsRoutes)
module.exports = router