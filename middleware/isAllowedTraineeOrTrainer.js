const Trainer = require("../models/Trainer.model")
const Trainee = require("../models/Trainee.model")

exports.isAllowedTraineeOrTrainer = async (req, res, next) => {
  try {
    const { _id, isTrainer } = req.payload
    const { trainerId: trainerIdParams } = req.params

    if (isTrainer) {
      // check if ids from payload and params match
      const trainerIdPayload = _id
      if (trainerIdPayload !== trainerIdParams) {
        res.status(404).json({ messsage: "Trainer credentials not valid" })
        return
      }

      // check if trainerId is in db
      const trainerId = trainerIdPayload
      const trainerInDB = await Trainer.findById(trainerId)
      if (!trainerInDB) {
        res.status(401).json({ message: "Trainer credentials not found in db" })
        return
      }
    } else if (!isTrainer) {
      // checks if traineeId is in trainer
      const traineeId = _id
      const traineeInTrainerList = await Trainer.findOne({
        trainees: traineeId,
      })
      if (!traineeInTrainerList) {
        res
          .status(401)
          .json({ message: "Trainee credentials not found in Trainer's data" })
        return
      }

      // check if traineeId is in db
      const traineeInDB = await Trainee.findById(traineeId)
      if (!traineeInDB) {
        res.status(401).json({ message: "Trainee credentials not found in db" })
        return
      }
    }
  } catch (error) {
    res.status(500).json({ message: "Unexpected middleware error" })
  }

  next()
}
