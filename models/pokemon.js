const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const PokemonSchema = new Schema({
  name: { type: String, required: true, maxLength: 20 },
  pokeid: Number,
  height: Number,
  weight: Number,
  moves: [{ type: Schema.Types.ObjectId, ref: 'Move' }],
  stats: {
    hp: Number,
    attack: Number,
    defence: Number,
    'special-attack': Number,
    'special-defense': Number,
    speed: Number,
  },
  types: [{ type: Schema.Types.ObjectId, ref: 'Type' }],
  images: { back: String, front: String, animation: String, large: String },
  // TODO url validation
});

// [ ROUTE URL ]
PokemonSchema.virtual('url').get(function () {
  return '/pokemon/' + this._id;
});

module.exports = mongoose.model('Pokemon', PokemonSchema);
