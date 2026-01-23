import React from 'react';
export default function PageIndication({ alignment, pageNumberValue, PageNumberColor, PageNumberBackgroundColor, PageIndicatorBorderSize, PageIndicatorBorderColor ,shape,location,size} ) {
  let borderRadius = 10;
  let widthHeightClass;
  let positionClasses = "";
  switch(shape) {
    case 'circle':
      if (size === 'small') {
        widthHeightClass = 'w-6 h-6 rounded-full ';
      } 
      else if (size === 'medium') 
      {
        widthHeightClass =  'w-9 h-9 rounded-full' ;
        }  
      else if (size === 'large') 
      {
        widthHeightClass = 'w-12 h-12 rounded-full' ;
        }
        // default:
        // widthHeightClass = 'w-7 h-7 rounded-full';
        // break;
 
      break;
    case 'square':
      if (size === 'small') {
        widthHeightClass = 'w-7 h-7 rounded';
      }
      else if (size === 'medium') {
        widthHeightClass = 'w-10 h-8 rounded-md';
      }
      else if (size === 'large') {
        widthHeightClass = 'w-12 h-12 rounded-md';
      }
      //widthHeightClass = `w-7 h-7 rounded`;
      break;
    case 'rectangle':
      widthHeightClass = 'w-10 h-8 rounded-md';
      break;
    default:
      widthHeightClass = 'w-7 h-7 rounded-full';
  }

  switch(location) {
    case 'top-left':
      positionClasses = "top-0 left-0";
      break;
    case 'top-right':
      positionClasses = "top-0 right-0";
      break;
    case 'bottom-right':
      positionClasses = "bottom-0 right-0";
      break;
    case 'bottom-left':
      positionClasses = "bottom-0 left-0";
      break;
    case 'top-center':
      positionClasses = "top-0 left-1/2 right-1/2 ";
      break;
    case 'bottom-center':
      positionClasses = "bottom-0 left-1/2 right-1/2 mx-auto";
      break;
    default:
      positionClasses = "top-0 left-0";
  }

  return (
    // <div className={`h-full w-full flex absolute ${positionClasses}`} style={{ textAlign: alignment }}>
      <div className={` h-10  absolute ${positionClasses} `} sx={{
        fontFamily:"Open Sans, sans-serif",
        zIndex: 10000000000,
      }}>
      <a className={` 
        no-underline
        inline-block 
        ${widthHeightClass}
        flex items-center justify-center
        text-center
        bg-gray-300 
        border border-gray-700 border-solid border-2 
        hover:bg-red-200
        p-2
        mr-2
      `}
      style={{ color: PageNumberColor, backgroundColor: PageNumberBackgroundColor, borderWidth:PageIndicatorBorderSize ,borderStyle:'solid',borderColor:PageIndicatorBorderColor}}
      sx={{
        fontFamily:"Open Sans, sans-serif",
        zIndex: 1000000,
      }}>
        {pageNumberValue}
      </a>
    </div>
  );
}