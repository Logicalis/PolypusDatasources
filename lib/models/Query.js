'use strict';

const mongoose = require('mongoose');

var querySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index:true,
    unique: true,
    trim: true
  },
  dataSource: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DataSource',
    required: true
  },
  queryProperties:{
    type: Object
  }
}, {timestamps: {}});

var Query = mongoose.model('Query',querySchema);

module.exports = Query;