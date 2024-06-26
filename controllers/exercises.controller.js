"use strict"

const CustomExercise = require("../models/CustomExercise.model")
const Exercise = require("../models/Exercise.model")
const ExerciseRoutine = require("../models/ExerciseRoutine.model")
const Trainee = require("../models/Trainee.model")
const SetType = require("../models/SetType.model")
const mongoose = require("mongoose")
const { populateExerciseDB } = require("../utils/populateExerciseDB")

const User = require("../models/User.model")
const { MessageConstants } = require("../utils/MessageConstants")

const getAllExercises = async (req, res, next) => {
  try {
    const { query } = req
    if (query) {
      const { type } = query
      const { muscle } = query
      const types = [
        "cardio",
        "omympic_weightlifting",
        "polymetrics",
        "powerlifting",
        "strength",
        "stretching",
        "strongman",
      ]
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
        "triceps",
      ]

      if (type && !types.includes(type)) {
        res.status(400).json({ message: "Invalid query parameter" })
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
    res.status(500).json({ message: "Internal Server Error" })
  }
}

const postCustomExerciseToTraineePlan = async (req, res, next) => {
  try {
    const { reps, intensity, exerciseRoutineId, series, setTypeId } = req.body
    const { exerciseId, traineeId } = req.params
    if (!reps || !intensity || !exerciseRoutineId || !series) {
      res.status(400).json({ message: "series, reps, intensity are required" })
      return
    }
    if (series < 1 || series > 20 || series % 1 !== 0) {
      res
        .status(400)
        .json({ message: "reps must be a integer number between 1 and 20" })
    }
    if (reps < 1 || (reps > 300 && reps % 1 !== 0)) {
      res
        .status(400)
        .json({ message: "reps must be a integer number between 1 and 300" })
      return
    }
    if (intensity < 0.3 || intensity > 1) {
      res.status(400).json({ message: "intensity must be between 0.3 and 1" })
      return
    }

    // verifies if the base exercise is in database
    const exerciseInDB = await Exercise.findById(exerciseId)
    if (!exerciseInDB) {
      res.status(404).json({ message: "exerciseId not found in DB" })
      return
    }

    // Verifies if the routine to update is in database
    const exerciseRoutineInDB = await ExerciseRoutine.findById(
      exerciseRoutineId
    )
    if (!exerciseRoutineInDB) {
      res.status(404).json({ message: "exerciseRoutineId not found in DB" })
      return
    }

    // Verifies if the setType passed is in database
    if (setTypeId !== null) {
      const setTypeInDB = await SetType.findById(setTypeId)
      if (!setTypeInDB) {
        res.status(404).json({ message: "setTypeId not found in DB" })
        return
      }
    }

    // Verifies if routine to update is in trainee
    const routineInTrainee = await Trainee.findOne({
      exercisePlan: exerciseRoutineInDB._id,
    })
    if (!routineInTrainee) {
      res
        .status(404)
        .json({ message: "exerciseRoutineId not found in Trainee data" })
      return
    }

    // Creates a new custom exercise
    const newCustomExercise = await (await CustomExercise.create({
      reps,
      series,
      intensity,
      exerciseData: exerciseId,
      setType: setTypeId
    }))
      .populate("exerciseData")
      .populate("setType")

    // adds the new custom exercise to the routine of the trainee
    const updatedExerciseRoutine = await ExerciseRoutine.findByIdAndUpdate(
      exerciseRoutineId,
      { $push: { exerciseList: newCustomExercise._id } },
      { new: true }
    )

    const updatedTrainee = await Trainee.findById(traineeId)
      .select("-password")
      .populate({
        path: "exercisePlan",
        populate: {
          path: "exerciseList",
          populate: [
            { path: "exerciseData" },
            { path: 'setType' }
          ]
        }
      })

    const updatedExercisePlan = updatedTrainee.exercisePlan.sort(
      (a, b) => a.day - b.day
    )

    res.status(201).json({ updatedExercisePlan })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const getCustomExercise = async (req, res, next) => {
  try {
    const { customExerciseId, traineeId } = req.params

    const customExerciseInDB = await CustomExercise.findById(
      customExerciseId
    ).populate("exerciseData")
    .populate("setType")

    if (!customExerciseInDB) {
      return res
        .status(404)
        .json({ message: "custom exercise not found in DB" })
    }

    const exerciseRoutineInDB = await ExerciseRoutine.findOne({
      exerciseList: customExerciseId,
    })
    if (!exerciseRoutineInDB) {
      return res
        .status(404)
        .json({
          message: "exercise is not found in any exercise routine in DB",
        })
    }

    const traineeInDB = await Trainee.findOne({
      _id: traineeId,
      exercisePlan: exerciseRoutineInDB._id,
    })
    if (!traineeInDB) {
      return res
        .status(404)
        .json({ message: "exercise not found in trainee info" })
    }

    res.status(200).json({ exercise: customExerciseInDB })
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" })
  }
}

const putUpdateCustomExercise = async (req, res) => {
  try {
    const { customExerciseId, traineeId } = req.params
    const {
      series: seriesBody,
      intensity: intensityBody,
      reps: repsBody,
      exerciseId: exerciseIdBody,
      setTypeId
    } = req.body

    if (Object.keys(req.body).length === 0) {
      res
        .status(400)
        .json({
          message:
            "There must be at least one parameter to update: intensity, reps or base exerciseId(exerciseData)",
        })
      return
    }

    const customExerciseInDB = await CustomExercise.findById(customExerciseId)
    if (!customExerciseInDB) {
      res.status(404).json({ message: "Custom Exercise not found in DB" })
      return
    }

    const data = {
      intensity: intensityBody ? intensityBody : customExerciseInDB.intensity,
      reps: repsBody ? repsBody : customExerciseInDB.reps,
      series: seriesBody ? seriesBody : customExerciseInDB.series,
      exerciseData: exerciseIdBody
        ? exerciseIdBody
        : customExerciseInDB.exerciseData,
    }

    if (data.reps < 1 || data.reps > 300 || data.reps % 1 !== 0) {
      res.status(400).json({ message: MessageConstants.EXERCISE_REPS_RANGE_ERROR })
      return
    }
    if (data.intensity < 0.3 || data.intensity > 1) {
      res.status(400).json({ message: MessageConstants.EXERCISE_INTENSITY_RANGE_ERROR })
      return
    }

    const validExercise = await Exercise.findById(data.exerciseData)
    if (!validExercise) {
      res.status(404).json({ message: MessageConstants.BASE_EXERCISE_NOT_FOUND_ERROR })
      return
    }

    const customExerciseInRoutine = await ExerciseRoutine.find({
      exerciseList: customExerciseId,
    })
    if (!customExerciseInRoutine) {
      res.status(404).json({ message: MessageConstants.CUSTOM_EXERCISE_NOT_FOUND_IN_TRAINEE_ERROR })
      return
    }

    const routineInTrainee = await Trainee.find({ _id: traineeId, exercisePlan: customExerciseInRoutine._id })
    if (!routineInTrainee) {
      res.status(404).json({ message: MessageConstants.CUSTOM_EXERCISE_NOT_FOUND_IN_TRAINEE_ERROR })
      return
    }

    if (setTypeId !== null) {
      const setTypeInDB = SetType.findById(setTypeId)
      if (!setTypeInDB) {
        res.status(404).json({ message: MessageConstants.SET_TYPE_NOT_FOUND_IN_DB })
        return
      }
    }

    const udpatedCustomExercise = await CustomExercise.findByIdAndUpdate(
      customExerciseId,
      { ...data },
      { new: true }
    )
      .populate("exerciseData")
      .populate("setType")

    const updatedTrainee = await Trainee.findById(traineeId)
      .select("-password")
      .populate({
        path: "exercisePlan",
        populate: {
          path: "exerciseList",
          populate: [
            { path: "exerciseData" },
            { path: "setType" }
          ]
        }
      })

    res.status(200).json({ updatedExercise: udpatedCustomExercise })
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error })
    } else {
      res.status(500).json({ message: MessageConstants.INTERNAL_SERVER_ERROR })
    }
  }
}

const deleteCustomExerciseAndRemoveInTraineePlan = async (req, res, next) => {
  try {
    const { customExerciseId, traineeId } = req.params
    const customExerciseInDB = await CustomExercise.findById(customExerciseId)
    if (!customExerciseInDB) {
      res.status(404).json({ message: "Custom Exercise not found in DB" })
      return
    }

    const customExerciseInRoutine = await ExerciseRoutine.findOne({
      exerciseList: customExerciseId,
    })
    if (!customExerciseInRoutine) {
      res.status(404)
        .json({ message: "Custom Exercise not found in Exercise Routine" })
      return
    }

    const customExerciseInTrainee = await Trainee.findOne({
      _id: traineeId,
      exercisePlan: customExerciseInRoutine._id,
    })
    if (!customExerciseInTrainee) {
      res.status(404).json({ message: "Custom Exercise not found in Trainee" })
      return
    }

    const deletedCustomExercise = await CustomExercise.findByIdAndDelete(
      customExerciseId
    )
    const updatedExerciseRoutine = await ExerciseRoutine.findByIdAndUpdate(
      customExerciseInRoutine._id,
      { $pull: { exerciseList: deletedCustomExercise._id } },
      { new: true }
    )
    const updatedTrainee = await Trainee.findById(traineeId)
      .select("-password")
      .populate({
        path: "exercisePlan",
        populate: {
          path: "exerciseList",
          populate: [
            { path: "exerciseData" },
            { path: "setType" }
          ]
        }
      })

    const updatedExercisePlan = updatedTrainee.exercisePlan.sort(
      (a, b) => a.day - b.day
    )

    res.status(200).json({ updatedExercisePlan })
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error })
    } else {
      res.status(500).json({ message: "Internal Server Error" })
    }
  }
}

const postCustomExerciseToUserPlan = async (req, res, next) => {
  try {
    const { reps, intensity, exerciseRoutineId, series, setTypeId } = req.body
    const { exerciseId, userId } = req.params
    if (!reps || !intensity || !exerciseRoutineId || !series) {
      res.status(400).json({ message: "series, reps, intensity are required" })
      return
    }
    if (series < 1 || series > 20 || series % 1 !== 0) {
      res.status(400)
        .json({ message: "reps must be a integer number between 1 and 20" })
    }
    if (reps < 1 || (reps > 300 && reps % 1 !== 0)) {
      res
        .status(400)
        .json({ message: "reps must be a integer number between 1 and 300" })
      return
    }
    if (intensity < 0.3 || intensity > 1) {
      res.status(400).json({ message: "intensity must be between 0.3 and 1" })
      return
    }

    // verifies if the base exercise is in database
    const exerciseInDB = await Exercise.findById(exerciseId)
    if (!exerciseInDB) {
      res.status(404).json({ message: "exerciseId not found in DB" })
      return
    }

    // Verifies if the routine to update is in database
    const exerciseRoutineInDB = await ExerciseRoutine.findById(
      exerciseRoutineId
    )
    if (!exerciseRoutineInDB) {
      res.status(404).json({ message: "exerciseRoutineId not found in DB" })
      return
    }

    // Verifies if the set type is in database
    if (setTypeId) {
      const setTypeInDB = await SetType.findById(setTypeId)
      if (!setTypeInDB) {
        res.status(404).json({ message: MessageConstants.SET_TYPE_NOT_FOUND_IN_DB_ERROR })
        return
      }
    }

    // Verifies if routine to update is in User
    const routineInUser = await User.findOne({
      exercisePlan: exerciseRoutineInDB._id,
    })
    if (!routineInUser) {
      res.status(404).json({ message: "exerciseRoutineId not found in Trainee data" })
      return
    }

    // Creates a new custom exercise
    const newCustomExercise = await (
      await CustomExercise.create({
        reps,
        series,
        intensity,
        exerciseData: exerciseId,
        setType: setTypeId
      })
    )
      .populate("exerciseData")
      .populate("setType")

    // adds the new custom exercise to the routine of the user
    const updatedExerciseRoutine = await ExerciseRoutine.findByIdAndUpdate(
      exerciseRoutineId,
      { $push: { exerciseList: newCustomExercise._id } },
      { new: true }
    )

    const updatedUser = await User.findById(userId)
      .select("-password")
      .populate({
        path: "exercisePlan",
        populate: {
          path: "exerciseList",
          populate: [
            { path: "exerciseData" },
            { path: "setType" }
          ]
        }
      })

    // Sorts the exercise plan
    const updatedExercisePlan = updatedUser.exercisePlan.sort(
      (a, b) => a.day - b.day
    )

    res.status(201).json({ updatedExercisePlan })
  } catch (error) {
    res.status(500).json({ error })
  }
}

const patchUserCustomExercise = async (req, res) => {
  try {
    const { customExerciseId, userId } = req.params
    const {
      series: seriesBody,
      intensity: intensityBody,
      reps: repsBody,
      exerciseId: exerciseIdBody,
      setTypeId
    } = req.body

    if (Object.keys(req.body).length === 0) {
      res.status(400).json({
        message:
          "There must be at least one parameter to update: intensity, reps or base exerciseId(exerciseData)",
      })
      return
    }

    const customExerciseInDB = await CustomExercise.findById(customExerciseId)
    if (!customExerciseInDB) {
      res.status(404).json({ message: "Custom Exercise not found in DB" })
      return
    }

    if (setTypeId) {
      const setTypeInDB = SetType.findById(setTypeId)
      if (!setTypeInDB) {
        res.status(400).json({ message: MessageConstants.SET_TYPE_NOT_FOUND_IN_DB_ERROR })
        return
      }
    }

    const data = {
      intensity: intensityBody ? intensityBody : customExerciseInDB.intensity,
      reps: repsBody ? repsBody : customExerciseInDB.reps,
      series: seriesBody ? seriesBody : customExerciseInDB.series,
      exerciseData: exerciseIdBody
        ? exerciseIdBody
        : customExerciseInDB.exerciseData,
    }

    if (data.reps < 1 || data.reps > 300 || data.reps % 1 !== 0) {
      res.status(400).json({
        message: "reps must be a integer number between 1 and 300",
      })
      return
    }
    if (data.intensity < 0.3 || data.intensity > 1) {
      res.status(400).json({ message: "intensity must be between 0.3 and 1" })
      return
    }

    const validExercise = await Exercise.findById(data.exerciseData)
    if (!validExercise) {
      res.status(404).json({ message: "Base exercise not found in DB" })
      return
    }

    const customExerciseInRoutine = await ExerciseRoutine.find({
      exerciseList: customExerciseId,
    })
    if (!customExerciseInRoutine) {
      res.status(404).json({
        message: "Custom Exercise not found in any Exercise Routine in DB",
      })
      return
    }

    const routineInUser = await User.find({
      _id: userId,
      exercisePlan: customExerciseInRoutine._id,
    })
    if (!routineInUser) {
      res.status(404).json({
        message: "Custom Exercise not found in any Exercise Routine of User",
      })
      return
    }

    const udpatedCustomExercise = await CustomExercise.findByIdAndUpdate(
      customExerciseId,
      { ...data },
      { new: true }
    )
      .populate("exerciseData")
      .populate("setType")

    const updatedUser = await User.findById(userId)
      .select("-password")
      .populate({
        path: "exercisePlan",
        populate: {
          path: "exerciseList",
          populate: [
            { path: "exerciseData" },
            { path: "setType" }
          ]
        }
      })

    res.status(200).json({ updatedExercise: udpatedCustomExercise })
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error })
    } else {
      res.status(500).json({ message: "Internal Server Error" })
    }
  }
}

const deleteCustomExercise = async (req, res) => { 
  try {
    const { customExerciseId, userId } = req.params
    const customExerciseInDB = await CustomExercise.findById(customExerciseId)
    if (!customExerciseInDB) {
      res.status(404).json({ message: "Custom Exercise not found in DB" })
      return
    }

    const customExerciseInRoutine = await ExerciseRoutine.findOne({
      exerciseList: customExerciseId,
    })
    if (!customExerciseInRoutine) {
      res
        .status(404)
        .json({ message: "Custom Exercise not found in Exercise Routine" })
      return
    }

    const customExerciseInUser = await User.findOne({
      _id: userId,
      exercisePlan: customExerciseInRoutine._id,
    })
    if (!customExerciseInUser) {
      res.status(404).json({ message: "Custom Exercise not found in User" })
      return
    }

    const deletedCustomExercise = await CustomExercise.findByIdAndDelete(
      customExerciseId
    )
    const updatedExerciseRoutine = await ExerciseRoutine.findByIdAndUpdate(
      customExerciseInRoutine._id,
      { $pull: { exerciseList: deletedCustomExercise._id } },
      { new: true }
    )
    const updatedUser = await User.findById(userId)
      .select("-password")
      .populate({
        path: "exercisePlan",
        populate: {
          path: "exerciseList",
          populate: [
            { path: "exerciseData" },
            { path: "setType" }
          ]
        }
      })

    const updatedExercisePlan = updatedUser.exercisePlan
      .sort((a, b) => a.day - b.day)

    res.status(200).json({ updatedExercisePlan })
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error })
    } else {
      res.status(500).json({ message: "Internal Server Error" })
    }
  }
}

module.exports = {
  getAllExercises,
  postCustomExerciseToTraineePlan,
  getCustomExercise,
  putUpdateCustomExercise,
  deleteCustomExerciseAndRemoveInTraineePlan,
  postCustomExerciseToUserPlan,
  patchUserCustomExercise,
  deleteCustomExercise,
}
