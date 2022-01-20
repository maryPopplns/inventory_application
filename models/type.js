const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TypesSchema = new Schema({
  _id: Schema.Types.ObjectId,
  name: { type: String, required: true, maxLength: 20 },
  doubleDamageFrom: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
  doubleDamageTo: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
  halfDamageFrom: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
  halfDamageTo: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
  noDamageFrom: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
  noDamageTo: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
  new: String,
});

// Virtual for author's URL
TypesSchema.virtual('url').get(function () {
  return '/type/' + this._id;
});

module.exports = mongoose.model('Types', TypesSchema);
