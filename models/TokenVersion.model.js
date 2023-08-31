const { model, Schema } = require('mongoose')

const tokenVersionSchema = new Schema(
  {
    version: {
      type: Number,
      default: 1,
      required: true
    }
  },
  { timestamps: true}
)

const TokenVersion = model("TokenVersion", tokenVersionSchema)
module.exports = TokenVersion