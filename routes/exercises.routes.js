"use strict"
const {
  getAllExercises,
  postCustomExerciseToTraineePlan,
  getCustomExercise,
  putUpdateCustomExercise,
  deleteCustomExerciseAndRemoveInTraineePlan,
  postCustomExerciseToUserPlan,
  patchUserCustomExercise,
} = require("../controllers/exercises.controller")
const {
  selfTraineeOrAllowedTrainer,
} = require("../middleware/selfTraineeOrAllowedTrainer.middleware")

const router = require("express").Router()

// can accept query parameters (type and muscle). Returns base exercises
router.get("/", getAllExercises)

// Creates custom exercise from exercise database and adds to exercise routine of Trainee
router.post(
  "/:exerciseId/trainee/:traineeId",
  selfTraineeOrAllowedTrainer,
  postCustomExerciseToTraineePlan
)

router.get(
  "/:customExerciseId/trainee/:traineeId",
  selfTraineeOrAllowedTrainer,
  getCustomExercise
)

router.put(
  "/:customExerciseId/trainee/:traineeId",
  selfTraineeOrAllowedTrainer,
  putUpdateCustomExercise
)

// deletes existing custom exercise from db, and from exercise routine of Trainee
router.delete(
  "/:customExerciseId/trainee/:traineeId",
  selfTraineeOrAllowedTrainer,
  deleteCustomExerciseAndRemoveInTraineePlan
)

// Creates custom exercise from exercise database and adds to exercise routine of User
router.post("/:exerciseId/user/:userId", postCustomExerciseToUserPlan)
router.patch("/:customExerciseId/user/:userId", patchUserCustomExercise)
module.exports = router
