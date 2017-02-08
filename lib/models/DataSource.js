'use strict';

const mongoose = require('mongoose');

const Service = require('lib/dataSourceService');

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

dataSourceSchema.pre('save',Service.validateDataSource);
dataSourceSchema.post('save',Service.configureDataSource);

var DataSource = mongoose.model('DataSource',dataSourceSchema);

module.exports = DataSource;