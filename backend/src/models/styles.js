const mongoose = require('mongoose');
const StyleSchema = new mongoose.Schema({
  globalStyle: {
    type: Object,
    default: null,
    controlPanel: {
      location: { type: String, default: 'bottom-center' },
      size: { type: String, default: 'medium' },
      hide: { type: Boolean, default: false },
      blankSlide:{
        location: { type: String, default: 'bottom-right' },
        locationRight: { type: String, default: '' },
        locationBottom: { type: String, default: '' },
        size: { type: String, default: 'medium' },
        hide: { type: Boolean, default: false },
      },
      color: { type: String, default: '#000000' },
      backgroundColor: { type: String, default: '#ffffff' },
      borderColor: { type: String, default: '#000000' },
      borderType: { 
        type: String, 
        default: 'solid', 
        enum: ['solid', 'dashed', 'dotted'] 
      },
      borderSize: { type: String, default: '4' },
    },
    pageIndicator: {
      isEnable: { type: Boolean, default: true },
      size: { type: String, default: 'medium' ,enum: ['small', 'medium', 'large'] },
      type: { type: String, default: 'circle' ,enum: ['circle', 'square'] },
      borderSize: { type: String, default: '2px' },
      borderColor: { type: String, default: 'black' },
      bgColor: { type: String, default: '#d79d9d' },
      location: { type: String, default: 'bottom-center',enum: ['bottom-center', 'bottom-left', 'bottom-right','top-left','top-right','top-center'] },
    },
    pageNumber: {
      isEnable: { type: Boolean, default: true },
      color: { type: String, default: '#000000' },
      size: { type: String, default: 'medium',enum: ['small', 'medium', 'large'] },
    },
    randomizeSlides: {
      type: Boolean,
      default: false,
    },
  },
  
  slideCss: {
    type: Object,
    default: null,
    bgColor: { type: String, default: '#ffffff' },    
    // Top Caption Styles
    captionT: {
      align: { type: String, default: 'center' },
      fntFam: { type: String, default: 'Open Sans, sans-serif' },
      fntSize: { type: Number, default: 24 },
      color: { type: String, default: '#000000' },
      bgColor: { type: String, default: 'Transparent' },
      
      border: {
        width: { type: Number, default: 1 },
        color: { type: String, default: '#000000' },
        type: { 
          type: String, 
          default: 'solid',
          enum: ['solid', 'dashed', 'dotted','double','groove','ridge','inset','outset','hidden','none'] 

      },
      },
      padding: {
        left: { type: Number, default: 0 },
        right: { type: Number, default: 0 },
        top: { type: Number, default: 0 },
        bottom: { type: Number, default: 0 },
      },
      margin: {
        left: { type: Number, default: 0 },
        right: { type: Number, default: 0 },
        top: { type: Number, default: 0 },
        bottom: { type: Number, default: 0 },
      },
      widthFull: { type: Boolean, default: true },
    },

    // Bottom Caption Styles
    captionB: {
      fntFam: { type: String, default: 'Open Sans, sans-serif' },
      fntSize: { type: Number, default: 24 },
      color: { type: String, default: '#000000' },
      bgColor: { type: String, default: 'Transparent' },
      align: { 
        type: String, default: 'center',
       },
      margin: {
      left: { type: Number, default: 0 },
      right: { type: Number, default: 0 },
      top: { type: Number, default: 0 },
      bottom: { type: Number, default: 0 },
    },
      border: {
        width: { type: Number, default: 1 },
        color: { type: String, default: '#000000' },
        type: { 
          type: String, 
          default: 'solid',
          enum: ['solid', 'dashed', 'dotted','double','groove','ridge','inset','outset','hidden','none'] 

        },
      },
      padding: {
        left: { type: Number, default: 0 },
        right: { type: Number, default: 0 },
        top: { type: Number, default: 0 },
        bottom: { type: Number, default: 0 },
      },
      margin: {
        left: { type: Number, default: 0 },
        right: { type: Number, default: 0 },
        top: { type: Number, default: 0 },
        bottom: { type: Number, default: 0 },
      },
      widthFull: { type: Boolean, default: true },
    },

    // Transition Styles
    transition: {
      delay: { type: Number, default: 8 },
      duration: { type: Number, default: 8 },
      timing: { type: String, default: 'linear' },
      type: { type: String, default: 'none' ,
        enum: ['fade-in', 'slide-left', 'slide-right', 'zoom','flip','none'] ,
      },
    },

    // Image Styles
    image: {
      padding: {
        left: { type: Number, default: 0 },
        right: { type: Number, default: 0 },
        top: { type: Number, default: 0 },
        bottom: { type: Number, default: 0 },
      },
      margin:{
        left: { type: Number, default: 0 },
        right: { type: Number, default: 0 },
        top: { type: Number, default: 0 },
        bottom: { type: Number, default: 0 },
      },
      border: {
        width: { type: Number, default: 1 },
        color: { type: String, default: '#000000' },
        type: { 
          type: String, 
          default: 'solid', 
          enum: ['solid', 'dashed', 'dotted','double','groove','ridge','inset','outset','hidden','none'] 
        },
      },
    },

    
  },
});

module.exports = mongoose.model('Styles', StyleSchema);


