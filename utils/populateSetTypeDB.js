const SetType = require('../models/SetType.model')
const exerciseTypeSeeds = require('../seeds/exerciseTypes.json')

async function populateSetTypeDB() {
  for (exerciseType of exerciseTypeSeeds) {
    const { name, description, keycode } = exerciseType
    const isCreated = await SetType.findOne({ name })
    if (!isCreated) {
      await SetType.create({ name, description, keycode })
    }
  }
}

exports.module = { populateSetTypeDB }