const { Schema, model } = require("mongoose")

const setTypeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is a rqeuired property"],
    },
    description: {
      type: String,
      required: [true, "description is a required property"]
    },
    keycode: {
      type: String,
      required: [true, "keycode is a required property"]
    }
  },
  { timestamps: true }
)

const SetType = model("SetTypeSchema", setTypeSchema)
module.exports = SetType