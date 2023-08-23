const CustomExercise = require('../models/CustomExercise.model')
const Exercise = require('../models/Exercise.model')
const { populateExerciseDB } = require('../utils/populateExerciseDB')

const getAllExercises = async (req, res, next) => { 
  try {
    const { query } = req
    if (query) {
      const { type } = query
      const { muscle } = query
      const types = ['cardio', 'omympic_weightlifting', 'polymetrics', 'powerlifting', 'strength', 'stretching', 'strongman']
      const muscles = [
        "abdominals",
        "abductors",
        "adductors",
        "biceps",
        "calves",
        "chest",
        "forearms",
        "glutes",
        "hamstrings",
        "lats",
        "lower_back",
        "middle_back",
        "neck",
        "quadriceps",
        "traps",
        "triceps"
      ]

      if ( type && !types.includes(type) ) {
        res.status(400).json({ message: 'Invalid query parameter' })
        return
      } else if (muscle && !muscles.includes(muscle)) {
        res.status(400).json({ message: "Invalid query parameter" })
        return
      }
    }

    const allExercisesInDB = await Exercise.find()
    if (allExercisesInDB.length === 0) {
      await populateExerciseDB()
    }

    const allExercises = await Exercise.find(query)

    res.status(200).json({ allExercises })
  } catch (error) {
    res.status(500).json({message: "Internal Server Error"})
  }
}

const postCustomExerciseInRoutine = async (req, res, next) => {
  const { reps, intensity, day, routineId } = req.body
  const { exerciseId, traineeId } = req.params
  if (!reps || !intensity || !day) { 
    res.status(400).json({ message: "reps, intensity and day are required" })
    return
  }
  if ((reps < 1 || reps > 300 && reps % 1 !== 0) ) {
    res.status(400).json({ message: "reps must be a integer number between 1 and 300" })
    return
  }
  if (intensity < 0.3 || intensity > 1) {
    res.status(400).json({ message: "intensity must be between 0.3 and 1" })
    return
  }
  if ((day < 1 || day > 6) && day % 1 !== 0) {
    res.status(400).json({ message: "day must be a integer number between 1 and 6" })
    return
  }

  const newCustomExercise = await CustomExercise.create({ reps, intensity, exerciseId })
}

module.exports = {
  getAllExercises,
  postCustomExerciseInRoutine,
}