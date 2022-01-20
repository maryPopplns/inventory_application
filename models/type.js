const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TypesSchema = new Schema({
  name: { type: String, required: true, maxLength: 20 },
  doubleDamageFrom: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
  doubleDamageTo: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
  haldDamageFrom: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
  haldDamageTo: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
  noDamageFrom: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
  noDamageTo: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
});

// Virtual for author's URL
TypesSchema.virtual('url').get(function () {
  return '/type/' + this._id;
});

module.exports = mongoose.model('Types', TypesSchema);
