const Trainee = require("../models/Trainee.model")

const getTrainee = async (req, res, next) => {
  try {
    const { traineeId } = req.params

    const traineeInDB = await Trainee.findById(traineeId).select("-password")
    res.status(200).json(traineeInDB)
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error })
  }
}

const putUpdateTrainee = async (req, res, next) => { 
  try {
    const { traineeId } = req.params

    if (!req.body.name || !req.body.personalInfo) {
      res.status(400).json({ message: "name and personalInfo are required values" })
      return
    }

    const {
      name: { firstName: bodyFirstName, lastName: bodyLastName },
      personalInfo: { age: bodyAge, height: bodyHeight, weight: bodyWeight, goal: bodyGoal },
    } = req.body
    
    const {
      name: { firstName: dBFirstName, lastName: dBLastName },
      personalInfo: {
        age: dBAge,
        height: dBHeight,
        weight: dBWeight,
        goal: dBGoal,
      },
    } = await Trainee.findById(traineeId)

    const data = {
      name: {
        firstName: bodyFirstName ? bodyFirstName : dBFirstName,
        lastName: bodyLastName ? bodyLastName : dBLastName
      },
      personalInfo: {
        age: bodyAge ? bodyAge : dBAge,
        height: bodyHeight ? bodyHeight : dBHeight,
        weight: bodyWeight ? bodyWeight : dBWeight,
        goal: bodyGoal ? bodyGoal : dBGoal
      }
    }

    const updatedTrainee = await Trainee.findByIdAndUpdate(
      traineeId,
      data,
      { new: true }
    ).select("-password")

    res.status(201).json(updatedTrainee)
  } catch (error) {
    res.status(500).json({ message: "Internal server error" })
  }
}


module.exports = {
  getTrainee,
  putUpdateTrainee,
}