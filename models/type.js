const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TypesSchema = new Schema({
  name: { type: String, required: true, maxLength: 20 },
  doubleDamageFrom: [{ type: Schema.Types.ObjectId, ref: 'Types' }],
  doubleDamageTo: [{ type: Schema.Types.ObjectId, ref: 'Types' }],
  halfDamageFrom: [{ type: Schema.Types.ObjectId, ref: 'Types' }],
  halfDamageTo: [{ type: Schema.Types.ObjectId, ref: 'Types' }],
  noDamageFrom: [{ type: Schema.Types.ObjectId, ref: 'Types' }],
  noDamageTo: [{ type: Schema.Types.ObjectId, ref: 'Types' }],
});

// Virtual for author's URL
TypesSchema.virtual('url').get(function () {
  return '/type/' + this._id;
});

module.exports = mongoose.model('Types', TypesSchema);
