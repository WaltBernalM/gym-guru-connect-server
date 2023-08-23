const { getAllExercises } = require('../controllers/exercises.controller')
const { selfTraineeOrAllowedTrainer } = require('../middleware/selfTraineeOrAllowedTrainer.middleware')

const router = require('express').Router()

// can accept query parameters (type and muscle). Returns base exercises
router.get('/', getAllExercises)

module.exports = router