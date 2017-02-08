'use strict';

const mongoose = require('mongoose');

const Service = require('lib/queriesService');

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
  },
  additionalProperties:{
    type: Object,
    required: false
  }
}, {timestamps: {}});

querySchema.pre('save',Service.validateQuery);

var Query = mongoose.model('Query',querySchema);

module.exports = Query;