const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MoveSchema = new Schema({
  name: { type: String, required: true, maxLength: 20 },
  effect: String,
  power: Number,
  PP: Number,
  type: { type: Schema.Types.ObjectId, ref: 'Type', required: true },
});

// Virtual for author's URL
MoveSchema.virtual('url').get(function () {
  return '/move/' + this._id;
});

module.exports = mongoose.model('Move', TypesSchema);
