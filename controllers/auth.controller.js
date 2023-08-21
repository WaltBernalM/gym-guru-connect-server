const Trainer = require('../models/Trainer.model')
const Trainee = require('../models/Trainee.model')
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

exports.postSignupController = async (req, res, next) => { 
  try {
    const { name, password, email, isTrainer } = req.body

    if (!email || !password || !name) {
      res.status(400).json({ message: "all fields required (name, password, email)" })
      return
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "email format invalid" })
      return
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message: `The password is as weak as Yamcha.
      Must have at least 5 chars, must use uppercased, 
      and lowercased letters and have at least a number`,
      })
      return
    }

    if (isTrainer) {
      const trainerFound = await Trainer.findOne({ email })
      if (trainerFound) {
        res.status(400).json({ message: "Trainer account already exists" })
        return
      }
    } else if (!isTrainer) { 
      const traineeFound = await Trainee.findOne({ email })
      if (traineeFound) {
        res.status(400).json({ message: "Trainee account already exists" })
        return
      }
    }

    const salt = bcrypt.genSaltSync(12)
    const hashPassword = bcrypt.hashSync(password, salt)

    if (isTrainer) {
      const createdTrainer = await Trainer.create({
        email,
        name,
        password: hashPassword,
      })
      const { email: savedEmail, name: savedName, _id: trainerId } = createdTrainer
      res.status(201).json({ trainer: { savedEmail, savedName, trainerId } })
    } else if (!isTrainer) {
      const createdTrainee = await Trainee.create({
        email,
        name,
        password: hashPassword,
      })
      const { email: savedEmail, name: savedName, _id: traineeId } = createdTrainee
      res.status(201).json({ trainee: { savedEmail, savedName, traineeId } })
    }

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" })
  }
}

exports.postLoginController = async (req, res, next) => { 
  try {
    const { password, email, isTrainer } = req.body

    if (!email || !password) {
      res
        .status(400)
        .json({ message: "all fields required (password & email)" })
      return
    }

    let trainerInDB, traineeInDB
    if (isTrainer) {
      trainerInDB = await Trainer.findOne({ email })
      if (!trainerInDB) {
        res.status(401).json({ message: "Trainer account not found" })
        return
      }
    } else if (!isTrainer) {
      traineeInDB = await Trainee.findOne({ email })
      if (!traineeInDB) {
        res.status(401).json({ message: "Trainee account not found" })
        return
      }
    }

    if (trainerInDB) {
      const isPasswordCorrect = bcrypt.compareSync(password, trainerInDB.password)
      if (!isPasswordCorrect) {
        res.status(400).json({ message: "Password not valid" })
        return
      }
      const authToken = jwt.sign(
        { _id: trainerInDB._id, email: trainerInDB.email, name: trainerInDB.name }, // payload
        process.env.SECRET_KEY, // secret key
        { algorithm: "HS256", expiresIn: "15m" }
      )
      // res.status(200).json({ data: { authToken } })
      res.cookie("authToken", authToken, {
          httpOnly: true,
          maxAge: 54000,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .json({ message: "Trainer accoun login successfully" })
    } else if (traineeInDB) {
      const isPasswordCorrect = bcrypt.compareSync(
        password,
        traineeInDB.password
      )
      if (!isPasswordCorrect) {
        res.status(400).json({ message: "Password not valid" })
        return
      }
      const authToken = jwt.sign(
        {
          _id: traineeInDB._id,
          email: traineeInDB.email,
          name: traineeInDB.name,
        }, // payload
        process.env.SECRET_KEY, // secret key
        { algorithm: "HS256", expiresIn: "15m" }
      )
      // res.status(200).json({ data: { authToken } })
      res.cookie("authToken", authToken,{
          httpOnly: true,
          maxAge: 54000,
          secure: process.env.NODE_ENV === "production",
          sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        })
        .json({ message: "Trainee accoun login successfully" })
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" })
  }
}