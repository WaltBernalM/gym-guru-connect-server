"use strict"

const SetType = require("../models/SetType.model")
const { populateSetTypeDB } = require("../utils/populateSetTypeDB")
const mongoose = require("mongoose")

const getAllSetTypes = async (req, res, next) => {
  try {
    const allSetTypes = await SetType.find()

    if (allSetTypes.length === 0) {
      await populateSetTypeDB()
    }

    res.status(200).json({ allSetTypes })
  } catch (err) {
    if (error instanceof mongoose.Error.validationError) {
      res.status(400).json({ error })
    }
    res.status(500).json({ message: "Internal Server Error", error: err })
  }
}

module.exports = { getAllSetTypes }