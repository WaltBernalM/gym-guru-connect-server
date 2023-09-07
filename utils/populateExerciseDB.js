const Exercise = require('../models/Exercise.model')
const axios = require('axios')
const { NINJA_API_URL } = require("./constants")
const exercisesSeeds = require('../seeds/exercises.json')

const populateExerciseDB = async () => {
  const baseUrl = NINJA_API_URL
  const apiHeaders = {
    "X-Api-Key": process.env.NINJA_API_KEY,
  }

  if (process.env.NODE_ENV !== 'production') {
    const exercisesToSave = []

    for (let offset = 0; offset < 200; offset++) {
      const { data: exercisesFromApi } = await axios.get(
        `${baseUrl}/exercises?offset=${offset}`,
        { headers: apiHeaders }
      )
      exercisesToSave.push(...exercisesFromApi)
    }

    for (exercise of exercisesToSave) {
      const { name, type, muscle, equipment, instructions } = exercise
      const isCreated = await Exercise.findOne({ name })
      if (!isCreated) {
        const createdExercise = await Exercise.create({
          name,
          type,
          muscle,
          equipment,
          instructions,
        })
      }
    }
  } else if(process.env.NODE_ENV === 'production') {
    for (exercise of exercisesSeeds) {
      const { name, type, muscle, equipment, instructions } = exercise
      const isCreated = await Exercise.findOne({ name })
      console.log(exercise)
      if (!isCreated) {
        const createdExercise = await Exercise.create({
          name,
          type,
          muscle,
          equipment,
          instructions,
        })
      }
    }
  }
}

module.exports = {populateExerciseDB}