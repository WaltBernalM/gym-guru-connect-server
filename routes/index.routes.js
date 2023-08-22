const router = require("express").Router()
const { isAuthenticated } = require("../middleware/jwt.middleware")
const trainerRoutes = require('../routes/trainer.routes')

router.get("/", (req, res, next) => {
  res.status(200).json({ message: "Welcome to Gym-Guru-Connect API" })
})


router.use('/trainers', isAuthenticated, trainerRoutes )
module.exports = router;
