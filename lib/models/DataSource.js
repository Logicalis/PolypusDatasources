'use strict';

const mongoose = require('mongoose');

var dataSourceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index:true,
    unique: true,
    trim: true
  },
  adapter: {
    type: String,
    required: true,
    trim: true
  },
  dataSourceProperties:{
    type: Object
  },
  additionalProperties:{
    type: Object,
    required: false
  }
}, {timestamps: {}});

var DataSource = mongoose.model('DataSource',dataSourceSchema);

module.exports = DataSource;