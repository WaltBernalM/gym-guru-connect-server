const SetType = require('../models/SetType.model')
const setTypeSeeds = require('../seeds/setTypes.json')

async function populateSetTypeDB() {
  for (setType of setTypeSeeds) {
    console.log('setType', setType)
    const { name, description, keycode } = setType
    const isCreated = await SetType.findOne({ name })
    if (!isCreated) {
      await SetType.create({ name, description, keycode })
    }
  }
}

module.exports = { populateSetTypeDB }