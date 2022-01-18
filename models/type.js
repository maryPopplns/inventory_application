const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TypesSchema = new Schema({
  name: { type: String, required: true, maxLength: 20 },
});

// Virtual for author's URL
TypesSchema.virtual('url').get(function () {
  return '/type/' + this._id;
});

module.exports = mongoose.model('Types', TypesSchema);
