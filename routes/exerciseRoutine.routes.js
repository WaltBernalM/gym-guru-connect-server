const router = require('express').Router()

const { postNewExerciseRoutine } = require('../controllers/exerciseRoutine.controller')
const { selfTraineeOrAllowedTrainer } = require('../middleware/selfTraineeOrAllowedTrainer.middleware')

// Adds a new routine to trainee, can be done by trainee or trainer
router.post('/trainee/:traineeId', selfTraineeOrAllowedTrainer, postNewExerciseRoutine)

module.exports = router