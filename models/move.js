const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MoveSchema = new Schema({
  name: { type: String, required: true, maxLength: 20 },
  effect: String,
  power: Number,
  pp: Number,
  type: { type: Schema.Types.ObjectId, ref: 'Type' },
});

MoveSchema.virtual('url').get(function () {
  return '/moves/' + this._id;
});

module.exports = mongoose.model('Move', MoveSchema);
