const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    text: { type: String, required: true, trim: true, maxlength: 500 }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Message', messageSchema);
