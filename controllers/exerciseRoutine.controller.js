const ExerciseRoutine = require('../models/ExerciseRoutine.model')
const CustomExercise = require('../models/CustomExercise.model')
const Exercise = require('../models/Exercise.model')
const Trainee = require('../models/Trainee.model')
const Trainer = require('../models/Trainer.model')
const mongoose = require('mongoose')

const postNewExerciseRoutine = async (req, res, next) => { 
  try {
    const { traineeId } = req.params
    const { day } = req.body

    if (!day) {
      res.status(400).json({message: "day is a required field"})
      return
    }
    if (day < 1 || day > 6 || day % 1 !== 0) {
      res.status(400).json({ message: "day must be a integer between 1 and 6" })
      return
    }

    const traineeToUpdate = await Trainee.findById(traineeId).populate('exercisePlan')
    const { exercisePlan } = traineeToUpdate
    let dayTaken = false
    if (exercisePlan.length > 0) {
      exercisePlan.forEach(exerciseRoutine => {
        if (exerciseRoutine.day === day) {
          dayTaken = true
          return
        }
      })
    }
    if (dayTaken) {
      res.status(400).json({message: "An exercise routine for this day already exists"})
      return
    }
    
    const newExerciseRoutine = await ExerciseRoutine.create({ day })
    const updatedTrainee = await Trainee.findByIdAndUpdate(
      traineeId,
      { $push: { exercisePlan: newExerciseRoutine._id } },
      { new: true }
    )
    res.status(201).json({newExerciseRoutine, updatedTrainee})
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({error})
    } else {
      res.status(500).json({message: "Internal Server Error"})
    }
  }
}


module.exports = {
  postNewExerciseRoutine
}