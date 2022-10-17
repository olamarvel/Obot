const mongoose = require('mongoose')
const { Schema } = mongoose

//  name: String,
const _USER = new Schema({
 join: { type: Date, default: Date.now },
 ads: Number,
 paid: Boolean,
 number: Number,
 level: Number,
})

module.exports = _USER
// 08161329040 victoria
