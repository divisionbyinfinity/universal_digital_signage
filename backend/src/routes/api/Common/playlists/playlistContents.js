//new playlist

exports.cssStandardNew = (Mycss) => {
  const borderRadius = "border-radius: 10% !important;";

  return `
    /* Body styling */
    body {
      margin: 0;
      overflow: hidden;
      cursor: none;
    }
  
    /* Carousel styling */
    .carousel {
      background-color: ${Mycss.bgColor};
      width: 100%;
      height: 100vh;
      display: flex;
      overflow: hidden;
      align-items: center;
      justify-content: center;
      position: relative;
    }
  
    .carousel-container {
      width: 100%;
      height: 100%;
      background-color: ${Mycss.bgColor};
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      flex: 1;
    }
  
    /* Image styling */
    .carousel img {
      width: auto;
      height: 100%;
      object-fit: contain;
      border: ${Mycss.image?.border.width}px ${Mycss.image?.border?.type} ${
    Mycss.image?.border?.color
  };
      box-sizing: border-box;
    }
  
    /* Caption container */
.carousel-caption {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  text-align: center;
}

/* Caption positions */
.captionTop, .captionBottom {
  width: 100%; /* Ensure they take full width of the container */
  display: block; /* Ensure they are block elements inside the flex container */
  margin: 0;
}

/* Optional: Fit content for smaller captions */
.captionTopFitContent, .captionBottomFitContent {
  width: fit-content;
  margin: 0 auto; /* Center-align if content is fit */
  border-radius: 10%; /* Optional border-radius styling */
}

    /* Page number styling */
    .pageNumber {
      position: absolute;
      left: 0;
      right: 0;
      font-size: xx-large;
      color: white;
      text-align: center;
      padding: 1rem 0.5rem;
      display: flex;
      flex-direction: row;
      gap: 0.3rem;
    }
  
    /* Position classes for page numbers */
    .pgtop-left { top: 0; }
    .pgtop-center { top: 0; justify-content: center; }
    .pgtop-right { top: 0; justify-content: flex-end; }
    .pgbottom-left { bottom: 0; justify-content: flex-start; }
    .pgbottom-center { bottom: 0; justify-content: center; }
    .pgbottom-right { bottom: 0; justify-content: flex-end; }
  
    /* Link styles */
    .pageNumber a {
      color: black;
      text-decoration: none;
      background-color: #a0d9f6;
      border: 1.5px solid rgba(0, 0, 0, 0.7);
      border-radius: 50%;
      margin: 0 5px;
      display: flex;
      justify-content: center;
      align-items: center;
      line-height: 30px;
    }
  
    .pageNumber a:hover:not(.active) {
      background-color: #ddd;
    }
  
    /* Shape styling */
    .circle {
      width: 2rem;
      height: 2rem;
      border-radius: 50%;
    }
  
    .square { 
      width: 2rem; 
      height: 2rem;     
    }
    ${["circle", "square"]
      .map(
        (shape) => `  
      .${shape}.small {width: 1.25rem; height: 1.25rem; }
      .${shape}.medium {width: 1.875rem; height: 1.875rem; }
      .${shape}.large {width: 2.5rem; height: 2.5rem; }
    `
      )
      .join("")}    
    .rectangle {
      width: 2rem;
      height: 1.5rem;
    }
    .rectangle.small {width: 1.25rem; height: 0.938rem; }
    .rectangle.medium {width: 1.875rem; height: 1.406rem; }
    .rectangle.large {width: 2.5rem; height: 1.875rem; }
    `;
};

exports.javascriptPartNew = (slides, hostUrl, style) => {
  const boilerplatecode = `  function parseDate(dateTimeStr) {

                if (!dateTimeStr) return null;
                // Check if the dateTimeStr is in the format "YYYY-MM-DDTHH:MM"
                if (dateTimeStr.includes('T')) {
                    let [datePart, timePart] = dateTimeStr.split('T');
                    if (!timePart) return null; // Ensure both date and time are present

                    let [year, month, day] = datePart.split('-').map(num => parseInt(num, 10));
                    let [hours, minutes] = timePart.split(':').map(num => parseInt(num, 10));

                    let date = new Date(year, month - 1, day, hours, minutes);

                    return isNaN(date.getTime()) ? null : date;
                }
                return null; // Return null if the format is incorrect
                
            }

  // Helper Function: Check if Slide is Within Scheduled Time
  function isSlideWithinScheduledTime(slide) {
    if (!slide.schedule.sDate) return true; // Always show slides without scheduled times

    let now = new Date();

    let startDate = parseDate(slide.schedule.sDate);
    let endDate = parseDate(slide.schedule.eDate);

    if (!startDate || !endDate) return false;

    if (endDate < startDate) {
      if (now < startDate) {
        endDate.setFullYear(endDate.getFullYear() + 1);
      } else {
        startDate.setFullYear(startDate.getFullYear() - 1);
      }
    }

    return now >= startDate && now <= endDate;
  }


  // Helper Function: Apply Transition Effects

function applyTransition(element, transitionType, duration) {
  console.log('Applying transition:', transitionType, duration);

  switch (transitionType) {
    case 'fade-in':
      element.style.opacity = 0;
      element.style.transition = \`opacity \${duration}s ease-in-out\`;
      setTimeout(() => {
        element.style.opacity = 1;
      }, 50);
      break;

    case 'slide-left':
      element.style.transform = 'translateX(100%)';
      element.style.transition = \`transform \${duration}s ease-in-out\`;
      setTimeout(() => {
        element.style.transform = 'translateX(0)';
      }, 50);
      break;

    case 'slide-right':
      element.style.transform = 'translateX(-100%)';
      element.style.transition = \`transform \${duration}s ease-in-out\`;
      setTimeout(() => {
        element.style.transform = 'translateX(0)';
      }, 50);
      break;

    case 'zoom':
      element.style.transform = 'scale(0)';
      element.style.transition = \`transform \${duration}s ease-in-out\`;
      setTimeout(() => {
        element.style.transform = 'scale(1)';
      }, 50);
      break;

    case 'flip':
      element.style.transform = 'rotateY(180deg)';
      element.style.transition = \`transform \${duration}s ease-in-out\`;
      setTimeout(() => {
        element.style.transform = 'rotateY(0deg)';
      }, 50);
      break;

    default:
      console.warn('Unknown transition type:', transitionType);
  }



    
  }



  class GetRandomIndex {
    constructor(maxNum) {
      this.maxNum = maxNum;
      this.remainingIndex = Array.from({ length: maxNum }, (_, i) => i);
    }

    getNewIndex() {
      if (this.remainingIndex.length === 0) {
        this.remainingIndex = Array.from({ length: this.maxNum }, (_, i) => i);
      }
      const randint = Math.floor(Math.random() * this.remainingIndex.length);
      const index = this.remainingIndex[randint];
      this.remainingIndex.splice(randint, 1);
      return index;
    }
  }
  `;
  const slideDataCode = `// Carousel Data & Initial Variables
  const slideshow = document.querySelector('.carousel');
  const slidesData = ${JSON.stringify(slides)};
  const hosturl = "${hostUrl}";
  const isRandomSlide = false;
  var pgstyle = ${JSON.stringify(style)};
  const SlidesLength = slidesData.length || 0;
  const getRandomIndexInstance = new GetRandomIndex(SlidesLength);
  let currentSlideIndex = isRandomSlide ? getRandomIndexInstance.getNewIndex() : 0;
  let slideInterval;
  let slideIndex = 0;
  let Tdelay = 8000; // Main Function to Show Slide
  const paginationEnum = {
    1: 'circle',
    2: 'square',
  };
  `;

  const slideshowCode = ` // Main Function to Show Slide
  function showSlide(index) {
    slideshow.innerHTML = ''; // Clear the slideshow
    let validSlideFound = false;
    let originalIndex = index;
    let attemptedSlides = 0;
    var validSlides = [];

    // Filter out slides that are not within the scheduled time
    for (let i = 0; i < slidesData.length; i++) {
      if (isSlideWithinScheduledTime(slidesData[i])) {
        validSlides.push(i);
      }
    }

    if (validSlides.length === 0) {
      // Handle case when no valid slides are found
      return;
    }

    // Ensure the index is within valid slide range
    index = index % validSlides.length;
    const slideToShow = validSlides[index];
    
    // Show the slide (creating elements for the carousel)
    const currentSlide = slidesData[slideToShow];
    const mediaContainer = createMediaContainer(currentSlide);
    const captionElement = createCaption(currentSlide);

    // Appending elements to the carousel
    mediaContainer.appendChild(captionElement);
    slideshow.appendChild(mediaContainer);
    if(pgstyle.pageIndicator.isEnable){
      const pagination= createPagination(pgstyle,validSlides,currentSlide,index);

      slideshow.appendChild(pagination);
    }
    // Apply the transition to the slide
    applyTransition(mediaContainer,currentSlide.style.transition?.type,currentSlide.style.transition?.duration);
    // Set up the next slide after mediaDuration
    // clear any existing timeout
    if (slideInterval) {
    clearTimeout(slideInterval);
  }
    slideInterval = setTimeout(function() {
      showSlide((index + 1) % validSlides.length);
      
        if (index == validSlides.length - 1) {
                // console.log("playlist finished");
          window.parent.postMessage({ type: 'playlistFinished' }, '*');
        }

    }, currentSlide.schedule?.duration*1000); 
  }

  // Create Media Container (Image/Video)
  function createMediaContainer(currentSlide) {
    const mediaContainer = document.createElement('div');
    mediaContainer.classList.add('carousel-container');
    mediaContainer.style.backgroundColor = currentSlide.style.bgColor;

    let media;
    if (currentSlide.mediaType === '1') {
      media = document.createElement('img');
      media.src = hosturl + currentSlide.media;
    } else if (currentSlide.mediaType === '2') {
      media = document.createElement('video');
      media.src = hosturl + currentSlide.media;
      media.autoplay = true;
      media.loop = false;
      media.onended = () => {
        clearTimeout(slideInterval)
        showSlide((index + 1) % validSlides.length)
      }
      media.muted = false;
    }

    mediaContainer.appendChild(media);
    return mediaContainer;
  }

   // Create Caption
   function createCaption(currentSlide) {
    const captionElement = document.createElement('div');
    captionElement.classList.add('carousel-caption');
    if (currentSlide.captionT && currentSlide.captionT.length) {
            const captionTop = document.createElement('p');
            captionTop.style.color = currentSlide.style.captionT.color;
            captionTop.style.backgroundColor = currentSlide.style.captionT.bgColor;
            captionTop.style.fontFamily = currentSlide.style.captionT.fntFam;
            captionTop.style.fontSize = currentSlide.style.captionT.fntSize + 'px';
            captionTop.style.textAlign = currentSlide.style.captionT.align.horizontal;
            captionTop.style.marginTop = currentSlide.style.captionT.margin.top + 'px';
            captionTop.style.marginBottom = currentSlide.style.captionT.margin.bottom + 'px';
            captionTop.style.marginLeft = currentSlide.style.captionT.margin.left + 'px';
            captionTop.style.marginRight = currentSlide.style.captionT.margin.right + 'px';
            captionTop.style.paddingTop = currentSlide.style.captionT.padding.top + 'px';
            captionTop.style.paddingBottom = currentSlide.style.captionT.padding.bottom + 'px';
            captionTop.style.paddingLeft = currentSlide.style.captionT.padding.left + 'px';
            captionTop.style.paddingRight = currentSlide.style.captionT.padding.right + 'px';
            captionTop.style.border = currentSlide.style.captionT.border.width + 'px '+currentSlide.style.captionT.border.type + currentSlide.style.captionT.border.color;            
            if(!currentSlide.style.captionT.widthFull){
              captionTop.classList.add('captionTopFitContent');
            }
            else{
              captionTop.classList.add('captionTop');
            }
            captionTop.textContent = currentSlide.captionT;
  
            captionElement.appendChild(captionTop);
          }
          if (currentSlide.captionB && currentSlide.captionB.length) {
            const captionBottom = document.createElement('p');
            captionBottom.style.color = currentSlide.style.captionB.color;
            captionBottom.style.backgroundColor = currentSlide.style.captionB.bgColor;
            captionBottom.textContent = currentSlide.captionB;
            captionBottom.style.fontFamily = currentSlide.style.captionB.fntFam;
            captionBottom.style.fontSize = currentSlide.style.captionB.fntSize + 'px';
            captionBottom.style.textAlign = currentSlide.style.captionB.align.horizontal;
            captionBottom.style.marginTop = currentSlide.style.captionB.margin.top + 'px';
            captionBottom.style.marginBottom = currentSlide.style.captionB.margin.bottom + 'px';
            captionBottom.style.marginLeft = currentSlide.style.captionB.margin.left + 'px';
            captionBottom.style.marginRight = currentSlide.style.captionB.margin.right + 'px';
            captionBottom.style.paddingTop = currentSlide.style.captionB.padding.top + 'px';
            captionBottom.style.paddingBottom = currentSlide.style.captionB.padding.bottom + 'px';
            captionBottom.style.paddingLeft = currentSlide.style.captionB.padding.left + 'px';
            captionBottom.style.paddingRight = currentSlide.style.captionB.padding.right + 'px';
            captionBottom.style.border = currentSlide.style.captionB.border.width + 'px '+currentSlide.style.captionB.border.type  + currentSlide.style.captionB.border.color;


            if(!currentSlide.style.captionB.widthFull){
              captionBottom.classList.add('captionBottomFitContent');
            }
            else{
              captionBottom.classList.add('captionBottom');
            }
            captionElement.appendChild(captionBottom);
          }
    return captionElement;
  }
  function createPagination(pgstyle,validSlides,currentSlide,index){
  const pageNumber = document.createElement('div');
          pageNumber.classList.add('pageNumber');
        
          pageNumber.classList.add('pg'+ pgstyle.pageIndicator.location);
          pageNumber.style.color = pgstyle.pageNumber.color;
          for (let i = 0; i <  validSlides.length; i++) {
            const pageLink = document.createElement('a');
            
          pageLink.classList.add(paginationEnum[pgstyle.pageIndicator.type]);
            pageLink.style.backgroundColor = pgstyle.pageIndicator.bgColor;
            pageLink.style.border = pgstyle.pageIndicator.borderSize + ' solid ' + pgstyle.pageIndicator.borderColor;
            pageLink.href = '#'+ i;
            if(pgstyle.pageNumber.isEnable){
              pageLink.textContent = i + 1 ;
              pageLink.style.color = pgstyle.pageNumber.color;
              pageLink.style.textAlign = 'center';
            
             switch(pgstyle.pageIndicator.size){
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
            if (i === index) {
              pageLink.classList.add('active');
              pageLink.style.backgroundColor = pgstyle.pageNumber.pageNumbersColor;
              pageLink.style.color = pgstyle.pageNumber.pageNumbersBackgroundColor;
            }
            pageNumber.appendChild(pageLink);
          }
          return pageNumber;
}
function createPageLinkClickHandler(index) {
          return function() {
            let nextIndex = index;
            clearTimeout(slideInterval);
            showSlide(nextIndex );  
          };
        }
 

  // Run Initial Carousel Setup
  showSlide(currentSlideIndex);
`;
  return boilerplatecode + slideDataCode + slideshowCode;
};
