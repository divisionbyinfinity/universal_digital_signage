exports.cssPresentation=(Mycss)=>{return `
/* Your styles remain unchanged */


.play-btn ,.stop-btn{
  cursor:pointer;
  transition: transform 0.3s ease;
}
.play-btn:hover ,.stop-btn:hover{
  transform: scale(1.9);
  box-shadow: 0 0 10px #000000;
  background-color: rgb(85, 196, 233)  !important;
}
.play-btn{
  color:green !important;
  padding-top: 0.4rem;
}
.stop-btn{
  color:red !important;

}
body {
    margin: 0;
    overflow: hidden;
    cursor: none;
  }
  .play-container {
    cursor: pointer;
    position: relative; 
    
    display: flex;
  }
  .play-container > button:hover {
    background-color: rgb(0, 56, 102)
  }
  .play-container > button{
  border:none;
  padding: 10px ;
  margin:10px;
  background-color: #064f77;
  color: white;
  border-radius: 5px;
  }
  .control-box{
    background-color: #064f77; ;
    color: pink;
    font-size: larger;
    z-index: 999;
    display:flex;
    /* top:1rem; */
  }
  .carousel {
    background-color:  ${Mycss.bgColor};
    width: 100%;
    height: 100vh;
    display: flex;
    overflow: hidden;
    align-items: center;
    flex-direction: column;
    justify-content: space-between;
    position: relative;
  }
  .carousel-container  {
    width: 100%;
    height: 100%;
    background-color: ${Mycss.bgColor};
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }
  


  .carousel img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    border: ${Mycss.imgBorderWidth}px ${Mycss.imgBorderType} ${Mycss.imgBorderColor};
    box-sizing: border-box;
   
  }
  .carousel-caption {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    color: rgb(255, 255, 255);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-align: center;
  }

  .captionTop {
    width: 100%;

    position: absolute; 
   
}

.captionTopFitContent {
  width: fit-content;
 
  position: absolute;

  border-radius: 0.5rem;
}

.captionBottom {

  width: 100%;

  position: absolute;  

}
.captionBottomFitContent {
  width: fit-content;
  position: absolute;
 
  border-radius: 0.5rem;
}

.left-right-head{

}
.control-panel{
  z-index:1;
  position: absolute;
  /* right:; */
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

    .prev, .next {
    cursor:pointer;
    transition: transform 0.3s ease;
    }
    .prev:hover , .next:hover{
      transform: scale(1.5);
      box-shadow: 0 0 10px #000000;
      background-color: rgb(85, 196, 233)  !important;
  }
    .next {
      /* right: 1rem; Adjust the distance from the right as needed */
      border-radius: 3px 0 0 3px;
    }
    .prev {
      /* right: 5rem; Adjust the distance from the right as needed */
      border-radius: 3px 0 0 3px;
      /* margin-right:1rem; */

    }
    .prev:hover ,.next:hover{
      background-color: rgba(51, 102, 0, 1);
    }
    .pageNumber {
      position: absolute;
      /* top: 0; */
      left: 0;
      right: 0;
      font-size: xx-large;
      color: white;
      text-align: center;
      padding: 1rem 0.5rem 1rem 0.5rem;
      display: flex;
      flex-direction: row;
      gap: 0.3rem;
      /* width: max-content */
      /* justify-content: center;
      align-items: center; */
    }
    .pgtop-left{
      top: 0;
    }
    .pgtop-center{
      top:0;
      justify-content: center;
      align-items: center;
    }
    .pgtop-right{
      top: 0;
      justify-content: flex-end;
      align-items: flex-end;
    }
    .pgbottom-left{
      bottom: 0;
      justify-content: flex-start;
      align-items: flex-start;
    }
    .pgbottom-center{
      bottom: 0;
      justify-content: center;
      align-items: center;
    }
    .pgbottom-right{
      bottom: 0;
      justify-content: flex-end;
      align-items: flex-end;
    }

    .pgctop-left{
      top: 0;
      left:0;
    }
    .pgctop-center{
      top:0;
      justify-content: center;
      align-items: center;
    }
    .pgctop-right{
      top: 0;
      right:0;
    }
    .pgcbottom-left{
      bottom: 0;
      left:0;
    }
    .pgcbottom-center{
      bottom: 0;
      justify-content: center;
      align-items: center;
    }
    .pgcbottom-right{
      bottom: 0;
      right:0;
    }
    .pgcright-middle{
      bottom: 45%;
      right:0;
    }
    .pgcleft-middle{
      bottom: 45%;
      left:0;
    }
      .pageNumber a {
      color: black;
      text-decoration: none;
      display: inline-block;

      line-height: 30px;
      background-color: #a0d9f6;
      border-radius: 50%;
      border-color:rgba(0, 0, 0, .25);
      border-style: solid;
      border-width:1.5px;
      margin: 0 5px;
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      }
      .circle{
        width: 30px;
        height:30px;
        border-radius: 50% !important;
      }
      .circlelarge{
        width: 40px;
        height:40px;
        border-radius: 50% !important;
        
      }
      .circlemedium{
        width: 30px !important;
        height:30px !important;
        border-radius: 50% !important;
        
      }
      .circlesmall{
        width: 20px !important;
        height:20px !important;
        border-radius: 50% !important;
        
      }
      .rectanglelarge{
        
        width: 50px !important;
        height:30px !important;
        border-radius: 10% !important;
        
        }
        .rectanglemedium{ 
          width: 30px !important;
          height:20px !important;
          border-radius: 10% !important;
       
        }
        .rectanglesmall{
          width: 20px !important;
          height:10px !important;
          border-radius: 10% !important;
          
        }
        
      .square{
      
      width: 2% !important;
      height:3% !important;
      border-radius: 10% !important;
      }
      .squaresmall{
      
        width: 20px !important;
        height:20px !important;
        border-radius: 10% !important;
      
        }
        .squaremedium{
          width: 30px !important;
          height:30px !important;
          border-radius: 10% !important;
      
        }
        .squarelarge{
          width: 40px !important;
          height:40px !important;
          border-radius: 10% !important;
      
        }
      .rectangle{
        
        width: 30px !important;
        height:20px !important;
        border-radius: 10% !important;
      }
    .pageNumber a.active  {
    background-color: #336699;
    color: white;
    }
  .pageNumber a:hover:not(.active) {
  background-color: #ddd;
  }
  .blankButton{
    cursor:pointer;
    transition: transform 0.3s ease;
  }
  .blankButton:hover{
    transform: scale(1.9);
    box-shadow: 0 0 10px #000000;
    background-color: rgb(85, 196, 233)  !important;
}
 
`
}

exports.presentationJavascript=(slides,hostUrl,style)=>{
    return `
    (function () {
      const slideshow = document.querySelector('.carousel');
      const slidesData = ${JSON.stringify(slides)}; 
      const pgstyle =  ${JSON.stringify(style)};
      const hosturl=  "${hostUrl}";
      const SlideLength = slidesData.length || 0   
      let currentSlideIndex = 0;
      let slideInterval;
      let slideIndex = 0;
      let Tdelay = 4000;
      if(slidesData[0].style.tdelay){
        Tdelay = slidesData[0].style.tdelay;
        Tdelay = Tdelay * 1000;
      }
      if (pgstyle.pageNumber.pageIndicator) {
        console.log ('page indicator on', pgstyle.pageNumber.pageIndicator);
        pgNumOn = true;
        if (pgstyle.pageNumber.pageNumbersOn) {
          console.log ('page numbers on', pgstyle.pageNumber.pageNumbersOn);
          pgNumOn = true;
        }
      }
      function pageIndicatorSize(pgstyle) {
          if (pgstyle.pageNumber.pageIndicatorSize === 'small') {
          return pgstyle.pageNumber.pageIndicatorType+'small';
          } else if (pgstyle.pageNumber.pageIndicatorSize === 'medium') {
            return pgstyle.pageNumber.pageIndicatorType+'medium';
          } else if (pgstyle.pageNumber.pageIndicatorSize === 'large') {
            return pgstyle.pageNumber.pageIndicatorType+'large';
 
      }     
    }
      function applyTransition(transitionType) {
        const imgContainer = document.querySelector('.carousel-container');
        const captionElement = document.querySelector('.carousel-caption');
        switch (transitionType) {
          case 'fade-in':
            // Existing fade-in logic
            imgContainer.style.opacity = 0;
            fadeIn(imgContainer);
            break;
          case 'slide-left':
            // Slide left logic
            slideLeft(imgContainer);
            break;
          case 'slide-right':
            // Slide right logic
            slideRight(imgContainer);
            break;
          // Add more cases for other transition types if needed
          case 'zoom':
            // Zoom logic
            zoom(imgContainer);
            break;
          case 'flip':
            // Flip logic
            flip(imgContainer);
          default:
            // Default to fade-in for unsupported types
            imgContainer.style.opacity = 0;
            fadeIn(imgContainer);
            break;
        }
      }
      
      function fadeIn(element) {
        let opacity = 0;
        const fadeInInterval = setInterval(() => {
          if (opacity < 1) {
            opacity += 0.1;
            element.style.opacity = opacity;
          } else {
            clearInterval(fadeInInterval);
          }
        }, 50);
      }
      
      function slideLeft(element) {
        // Slide left logic
        element.style.transform = 'translateX(-100%)';
        element.style.transition = 'transform 0.5s ease-in-out';
        setTimeout(() => {
          element.style.transform = 'translateX(0)';
        }, 50);
      }
      
      function slideRight(element) {
        // Slide right logic
        element.style.transform = 'translateX(100%)';
        element.style.transition = 'transform 0.5s ease-in-out';
        setTimeout(() => {
          element.style.transform = 'translateX(0)';
        }, 50);
      }

      function zoom(element) {
        // Zoom logic
        element.style.transform = 'scale(0)';
        element.style.transition = 'transform 0.5s ease-in-out';
        setTimeout(() => {
          element.style.transform = 'scale(1)';
        }, 50);
      }
      
      function flip(element) {
        // Flip logic
        element.style.transform = 'rotateY(180deg)';
        element.style.transition = 'transform 0.5s ease-in-out';
        setTimeout(() => {
          element.style.transform = 'rotateY(0deg)';
        }, 50);
      }
      function toggleSlideshow() {
      startSlideshow(currentSlideIndex);
      }
      function startSlideshow(index) {
      slideInterval = setInterval(() => {
      index = (index + 1) % slidesData.length;
      nextSlide(index);
      }, Tdelay);
      }

      function stopSlideShow() {
        clearInterval(slideInterval);
        slideInterval = null;
      }

      function showSlide(index,pgstyle) {
        var pageindicatorsizeclassname;
        currentSlideIndex = index;
        slideIndex = index;
        const currentSlide = slidesData[index];
        const imgContainer = document.createElement('div');
        imgContainer.classList.add('carousel-container');
        imgContainer.style.backgroundColor = currentSlide.style.bgColor;
        // imgContainer.style.fontSize = currentSlide.style.fntSize;
        imgContainer.style.fontFamily = currentSlide.style.fntFam;
        imgContainer.style.color = currentSlide.style.fntColor;
        
        const img = document.createElement('img');
        img.src = hosturl + currentSlide.image;
       
        img.style.paddingLeft = currentSlide.style.imgleftPaddingValue;
        img.style.paddingRight = currentSlide.style.imgrightPaddingValue;
        img.style.paddingTop = currentSlide.style.imgtopPaddingValue;
        img.style.paddingBottom = currentSlide.style.imgbottomPaddingValue;
        img.style.border = currentSlide.style.imgBorderWidth + 'px ' + currentSlide.style.imgBorderType + ' ' + currentSlide.style.imgBorderColor;
        img.alt = currentSlide.captionTop;
        imgContainer.appendChild(img);
        const captionElement = document.createElement('div');
        // if (currentSlide.style.topMargin) {
        //   captionElement.style.bottom = '1rem';
        // } else {
        //   captionElement.style.bottom = '0rem';
        // }
        captionElement.classList.add('carousel-caption');
        if (currentSlide.captionTop && currentSlide.captionTop.length) {
          const captionTop = document.createElement('p');
          captionTop.style.color = currentSlide.style.tfntColor;
          captionTop.style.backgroundColor = currentSlide.style.tfntbgColor;
          captionTop.style.paddingTop = currentSlide.style.tcaptionPaddingTop;
          captionTop.style.paddingRight = currentSlide.style.bcaptionPaddingRight;  
          captionTop.style.paddingBottom = currentSlide.style.tcaptionPaddingBottom;
          captionTop.style.paddingLeft = currentSlide.style.tcaptionPaddingLeft;
          captionTop.style.marginLeft = currentSlide.style.tcaptionMarginLeft;
          captionTop.style.marginRight = currentSlide.style.tcaptionMarginRight;
          captionTop.style.marginTop = currentSlide.style.tcaptionMarginTop;
          captionTop.style.marginBottom = currentSlide.style.tcaptionMarginBottom;
          captionTop.style.textAlign = currentSlide.style.AlgnTop;
          captionTop.style.border = currentSlide.style.topCaptionBorderWidth + 'px ' + currentSlide.style.topCaptionBorderType + ' ' + currentSlide.style.topCaptionBorderColor;
          captionTop.style.fontFamily = currentSlide.style.tfntFam;
          // captionTop.textContent = currentSlide.captionTop;
          captionTop.style.fontSize = currentSlide.style.tfntSize + 'px';
          
          if(!currentSlide.style.tcaptionFullWidth){
            captionTop.classList.add('captionTopFitContent');
          }
          else{
            captionTop.classList.add('captionTop');
          }
          captionTop.textContent = currentSlide.captionTop;

         
          captionElement.appendChild(captionTop);
        }
        if (currentSlide.captionBottom && currentSlide.captionBottom.length) {
          const captionBottom = document.createElement('p');
          captionBottom.style.paddingTop = currentSlide.style.bcaptionPaddingTop;
          captionBottom.style.paddingRight = currentSlide.style.bcaptionPaddingRight;  
          captionBottom.style.paddingBottom = currentSlide.style.bcaptionPaddingBottom;
          captionBottom.style.paddingLeft = currentSlide.style.bcaptionPaddingLeft;
          captionBottom.style.marginLeft = currentSlide.style.bcaptionMarginLeft;
          captionBottom.style.marginRight = currentSlide.style.bcaptionMarginRight;
          captionBottom.style.marginTop = currentSlide.style.bcaptionMarginTop;
          captionBottom.style.marginBottom = currentSlide.style.bcaptionMarginBottom;
          captionBottom.style.color = currentSlide.style.bfntColor;
          captionBottom.style.backgroundColor = currentSlide.style.bfntbgColor;
          captionBottom.style.textAlign = currentSlide.style.AlgnBtm;
          captionBottom.style.marginBottom = currentSlide.style.bottomMarginValue;
          captionBottom.style.bottom = 0;
          captionBottom.style.border = currentSlide.style.bottomCaptionBorderWidth + 'px ' + currentSlide.style.bottomCaptionBorderType + ' ' + currentSlide.style.bottomCaptionBorderColor;
          captionBottom.style.fontFamily = currentSlide.style.bfntFam;
          captionBottom.textContent = currentSlide.captionBottom;
          captionBottom.style.fontSize = currentSlide.style.bfntSize + 'px';
          if(!currentSlide.style.bcaptionFullWidth){
            captionBottom.classList.add('captionBottomFitContent');
          }
          else{
            captionBottom.classList.add('captionBottom');
          }
          
        //  captionBottom.textContent = currentSlide.captionBottom;
       
          captionElement.appendChild(captionBottom);
        }
        slideshow.innerHTML = '';
        slideshow.appendChild(imgContainer);
        slideshow.appendChild(captionElement);
        const controlBox = document.createElement('div');
controlBox.classList.add('control-box');
controlBox.style.border = pgstyle.controlPanel.controlPanelBorderSize + 'px ' + pgstyle.controlPanel.controlPanelBorderType + ' ' + pgstyle.controlPanel.controlPanelBorderColor;
controlBox.classList.add('pgc'+ pgstyle.controlPanel.controlPanelLocation);
// controlBox.style.backgroundColor ='#064f77';
controlBox.style.zIndex = "999";
controlBox.style.position = "absolute";
controlBox.style.backgroundColor = pgstyle.controlPanel.controlPanelBackgroundColor || "#ffffff";
controlBox.style.color = pgstyle.controlPanel.controlPanelColor;

const ButtonLeft = document.createElement('button');

        ButtonLeft.addEventListener('click',prevSlide);
        ButtonLeft.classList.add('prev')
        ButtonLeft.textContent="❮"
        if(pgstyle.controlPanel.controlPanelSize === 'small'){
          ButtonLeft.style.fontSize = "2rem";
        } else if (pgstyle.controlPanel.controlPanelSize === 'medium') {
          ButtonLeft.style.fontSize = "3rem";
        } else if (pgstyle.controlPanel.controlPanelSize === 'large') {
          ButtonLeft.style.fontSize = "4rem";
        } else {
        ButtonLeft.style.fontSize = "2rem";
        }
       
        ButtonLeft.style.backgroundColor = pgstyle.controlPanel.controlPanelBackgroundColor || "#ffffff";
        ButtonLeft.style.color = pgstyle.controlPanel.controlPanelColor;
       
        ButtonLeft.style.border = 'none';


controlBox.appendChild(ButtonLeft);

const PlayButton = document.createElement('button');
PlayButton.textContent = '▶';

   
       
        PlayButton.addEventListener('click',toggleSlideshow);
        
        PlayButton.classList.add('play-btn')
        // PlayButton.textContent="Play"
        if(pgstyle.controlPanel.controlPanelSize === 'small'){
          PlayButton.style.fontSize = "1.5rem";
        } else if (pgstyle.controlPanel.controlPanelSize === 'medium') {
          PlayButton.style.fontSize = "2.3rem";

        } else if (pgstyle.controlPanel.controlPanelSize === 'large') {
          PlayButton.style.fontSize = "3rem";
        } else {
        PlayButton.style.fontSize = "1.5rem";
        }

        PlayButton.style.backgroundColor = pgstyle.controlPanel.controlPanelBackgroundColor || "#ffffff";
        PlayButton.style.color = pgstyle.controlPanel.controlPanelColor;

        PlayButton.style.border = 'none';
controlBox.appendChild(PlayButton);
        const blankButton = document.createElement('button');
        blankButton.classList.add('blankButton');
        blankButton.textContent = 'Blank Slide';
      
        blankButton.onclick = function() {
          stopSlideShow();
          const blankSlide = document.createElement('div');
          blankSlide.style.backgroundColor = 'black';
          blankSlide.style.width = '100%';
          blankSlide.style.height = '100%';
          blankSlide.style.textContent = 'Blank Slide';
          blankSlide.style.color = 'white';
          blankSlide.style.fontSize = '10rem';
          const text_info = document.createElement('p');
          text_info.textContent = 'Press any key or click the mouse to make the slideshow visible';
          text_info.style.color = 'white';
          text_info.style.fontSize = '6rem';
          text_info.style.textAlign = 'center'; 
          blankSlide.appendChild(text_info);  


        slideshow.innerHTML = '';
          slideshow.appendChild(blankSlide);
          //on clicking on blanksceen, remove the diiv 
          blankSlide.onclick = document.onkeydown = function() {
    slideshow.removeChild(blankSlide);
    showSlide(currentSlideIndex,pgstyle);
};

        };
blankButton.textContent = ' ⬚';
blankButton.style.backgroundColor = pgstyle.controlPanel.controlPanelBackgroundColor || "#ffffff";
blankButton.style.color = pgstyle.controlPanel.controlPanelColor;
if(pgstyle.controlPanel.controlPanelSize === 'small'){
  blankButton.style.fontSize = "1.5rem";
} else if (pgstyle.controlPanel.controlPanelSize === 'medium') {
  blankButton.style.fontSize = "2.3rem";

} else if (pgstyle.controlPanel.controlPanelSize === 'large') {
  blankButton.style.fontSize = "3rem";
} else {
  blankButton.style.fontSize = "1.5rem";
}


blankButton.style.alignContent = 'center';
blankButton.style.border = 'none';
controlBox.appendChild(blankButton);

const stopButton = document.createElement('button');


        stopButton.addEventListener('click',stopSlideShow)
        stopButton.classList.add('stop-btn')
        // stopButton.textContent="Stop"
        if(pgstyle.controlPanel.controlPanelSize === 'small'){
          stopButton.style.fontSize = "2rem";
          // stopButton.style.paddingBottom = "1rem";
        } else if (pgstyle.controlPanel.controlPanelSize === 'medium') {
          stopButton.style.fontSize = "3rem";
          // stopButton.style.paddingBottom = "1.6rem";
        } else if (pgstyle.controlPanel.controlPanelSize === 'large') {
          stopButton.style.fontSize = "4rem";
          // stopButton.style.paddingBottom = "1.6rem";
        } else {
        stopButton.style.fontSize = "2rem";}
        stopButton.textContent="■"
        stopButton.style.backgroundColor = pgstyle.controlPanel.controlPanelBackgroundColor || "#ffffff";
        stopButton.style.color = pgstyle.controlPanel.controlPanelColor;
      
        stopButton.style.border = 'none';
controlBox.appendChild(stopButton);

const ButtonRight = document.createElement('button');


        ButtonRight.addEventListener('click',nextSlide)
        ButtonRight.classList.add('next')
        ButtonRight.textContent="❯"
        if(pgstyle.controlPanel.controlPanelSize === 'small'){
          ButtonRight.style.fontSize = "2rem";
        } else if (pgstyle.controlPanel.controlPanelSize === 'medium') {
          ButtonRight.style.fontSize = "3rem";
        } else if (pgstyle.controlPanel.controlPanelSize === 'large') {
          ButtonRight.style.fontSize = "4rem";
        } else {
        ButtonRight.style.fontSize = "2rem";
        }
        ButtonRight.style.backgroundColor = pgstyle.controlPanel.controlPanelBackgroundColor || "#ffffff";
        ButtonRight.style.color = pgstyle.controlPanel.controlPanelColor;
       
        ButtonRight.style.border = 'none';
controlBox.appendChild(ButtonRight);
slideshow.appendChild(controlBox);

        
        const controlPanell=document.createElement('div');
        controlPanell.classList.add('control-panel');
       if(pgstyle.controlPanel.controlPanelLocation === 'bottom-right'){  
        controlPanell.style.right = '0';
        controlPanell.style.bottom = '0';
        }
        else if(pgstyle.controlPanel.controlPanelLocation === 'bottom-left'){
          controlPanell.style.left = '0';
          controlPanell.style.bottom = '0';
        }
        else if(pgstyle.controlPanel.controlPanelLocation === 'top-right'){
          controlPanell.style.right = '0';
          controlPanell.style.top = '0';
        }
        else if(pgstyle.controlPanel.controlPanelLocation === 'top-left'){
          controlPanell.style.left = '0';
          controlPanell.style.top = '0';
        }
        else if(pgstyle.controlPanel.controlPanelLocation === 'top-center'){
          controlPanell.style.left = '50%';
          controlPanell.style.top = '0';
          controlPanell.style.transform = 'translateX(-50%)';
        }
        else if(pgstyle.controlPanel.controlPanelLocation === 'bottom-center'){
          controlPanell.style.left = '50%';
          controlPanell.style.bottom = '0';
          controlPanell.style.transform = 'translateX(-50%)';
        }
        const buttonDiv=document.createElement('div');
        buttonDiv.classList.add("left-right-head");
        // const ButtonLeft=document.createElement('button');
        // ButtonLeft.addEventListener('click',prevSlide);
        // ButtonLeft.classList.add('prev')
        // ButtonLeft.textContent="❮"
        // if(pgstyle.controlPanel.controlPanelSize === 'small'){
        //   ButtonLeft.style.fontSize = "2rem";
        // } else if (pgstyle.controlPanel.controlPanelSize === 'medium') {
        //   ButtonLeft.style.fontSize = "3rem";
        // } else if (pgstyle.controlPanel.controlPanelSize === 'large') {
        //   ButtonLeft.style.fontSize = "4rem";
        // } else {
        // ButtonLeft.style.fontSize = "2rem";
        // }
        // buttonDiv.appendChild(ButtonLeft)

        // const ButtonRight=document.createElement('button');
        // ButtonRight.addEventListener('click',nextSlide)
        // ButtonRight.classList.add('next')
        // ButtonRight.textContent="❯"
        // if(pgstyle.controlPanel.controlPanelSize === 'small'){
        //   ButtonRight.style.fontSize = "2rem";
        // } else if (pgstyle.controlPanel.controlPanelSize === 'medium') {
        //   ButtonRight.style.fontSize = "3rem";
        // } else if (pgstyle.controlPanel.controlPanelSize === 'large') {
        //   ButtonRight.style.fontSize = "4rem";
        // } else {
        // ButtonRight.style.fontSize = "2rem";
        // }
        // buttonDiv.appendChild(ButtonRight)
        // controlPanell.appendChild(buttonDiv)
    
        // const PlayButtonsDiv=document.createElement('div');
        // PlayButtonsDiv.classList.add('play-container');
        // const PlayButton=document.createElement('button');
        // PlayButton.addEventListener('click',toggleSlideshow);
        
        // PlayButton.classList.add('play-btn')
        // // PlayButton.textContent="Play"
        // if(pgstyle.controlPanel.controlPanelSize === 'small'){
        //   PlayButton.style.fontSize = "1.5rem";
        // } else if (pgstyle.controlPanel.controlPanelSize === 'medium') {
        //   PlayButton.style.fontSize = "2.3rem";

        // } else if (pgstyle.controlPanel.controlPanelSize === 'large') {
        //   PlayButton.style.fontSize = "3rem";
        // } else {
        // PlayButton.style.fontSize = "1.5rem";
        // }
        // PlayButton.textContent="▶"
        
        // const stopButton=document.createElement('button');
        // stopButton.addEventListener('click',stopSlideShow)
        // stopButton.classList.add('stop-btn')
        // // stopButton.textContent="Stop"
        // if(pgstyle.controlPanel.controlPanelSize === 'small'){
        //   stopButton.style.fontSize = "2rem";
        //   stopButton.style.paddingBottom = "1rem";
        // } else if (pgstyle.controlPanel.controlPanelSize === 'medium') {
        //   stopButton.style.fontSize = "3rem";
        //   stopButton.style.paddingBottom = "1.6rem";
        // } else if (pgstyle.controlPanel.controlPanelSize === 'large') {
        //   stopButton.style.fontSize = "4rem";
        //   stopButton.style.paddingBottom = "1.6rem";
        // } else {
        // stopButton.style.fontSize = "2rem";}
        // stopButton.textContent="■"
        // PlayButtonsDiv.appendChild(PlayButton)
        // PlayButtonsDiv.appendChild(stopButton)
        //controlPanell.appendChild(PlayButtonsDiv)
        //slideshow.appendChild(controlPanell)
        currentSlideIndex = index;
        applyTransition(currentSlide.style.ttype);

        const pageNumber = document.createElement('div');
        pageNumber.classList.add('pageNumber');
        pageNumber.classList.add('pg'+ pgstyle.pageNumber.pageNumberLocation);
        pageindicatorsizeclassname=pageIndicatorSize(pgstyle);
        // pageNumber.style.backgroundColor = pgstyle.pageNumber.pageNumbersBackgroundColor;

        pageNumber.style.color = pgstyle.pageNumber.pageNumbersColor;
        for (let i = 0; i < SlideLength; i++) {
          const pageLink = document.createElement('a');
          pageLink.classList.add(pgstyle.pageNumber.pageIndicatorType);
          pageLink.style.backgroundColor = pgstyle.pageNumber.pageNumbersBackgroundColor;
          pageLink.style.border = pgstyle.pageNumber.pageIndicatorBorderSize + ' solid ' +pgstyle.pageNumber.pageIndicatorBorderColor;
          
          pageLink.href = '#'+i;
          if(pgstyle.pageNumber.pageNumbersOn){
            pageLink.textContent = i + 1 ;
            pageLink.style.color = pgstyle.pageNumber.pageNumbersColor;
            pageLink.style.textAlign = 'center';
          
            switch(pgstyle.pageNumber.pageIndicatorSize){
              case 'small':
                pageLink.style.fontSize = 'small';
                break;
              case 'medium':
                pageLink.style.fontSize = 'medium';
                break;
              case 'large':
                pageLink.style.fontSize = 'large';
                break;
              default:
                pageLink.style.fontSize = 'medium';
           }
          }
          pageLink.addEventListener('click', createPageLinkClickHandler(i,pgstyle));
          if (i === currentSlideIndex) {
            pageLink.classList.add('active');
            pageLink.style.backgroundColor = pgstyle.pageNumber.pageNumbersColor;
            pageLink.style.color = pgstyle.pageNumber.pageNumbersBackgroundColor;
          }
          pageNumber.appendChild(pageLink);
        }
        if(pgstyle.pageNumber.pageIndicator){
          slideshow.appendChild(pageNumber);
        }

      }

      function createPageLinkClickHandler(index) {
        return function() {
          let nextIndex = index;
          showSlide(nextIndex,pgstyle);
        };
      }
      function nextSlide() {
        let nextIndex = (slideIndex + 1)%slidesData.length;
        showSlide(nextIndex,pgstyle);
      }
      function prevSlide() {
        let nextIndex = (slideIndex - 1) % slidesData.length;
        if (nextIndex < 0) {
            nextIndex = slidesData.length - 1;
        }
        showSlide(nextIndex, pgstyle);
      }

      showSlide(currentSlideIndex,pgstyle); // Start the slideshow
    })();
    `
}