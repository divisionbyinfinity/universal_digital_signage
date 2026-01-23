const HostUrl=process.env.CDN_URL
const getScript = (slides) => {

    const js=`
    function handleLinkRedirect(link) {
        // Open the link in a new window
        window.open(link, '_blank');
    }
    const slides=${JSON.stringify(slides)};
    const images=slides.map(slide=>slide.image.mediaUrl);
    const bottomSection=document.getElementById("bottomSection");
    const slideshow=document.getElementById("slideshow");
    const slideNumber=document.querySelector('.slideNumber');
    const heading=document.getElementById('heading');
    const bullet=document.getElementById('bullets');
    const paragraph=document.getElementById('paragraph');
    const captionText=document.getElementById('captionText');
    const icons=document.querySelector('.icons');

    const hostUrl="${HostUrl}";
    let TempImages='';
    let slideshowImages='';
    let subTitles=[];
    let headings=[];
    let bullets=[];
    let paragraphs=[];
    let captions=[];
    let iconsList=[];

    images.forEach((image,index)=>{
        TempImages+=\`<div><img src="\${hostUrl+image}" alt="image" class="bottomImg \${index==0?'bottomActive':''}"/></div>\`
        slideshowImages+=\`<img src="\${hostUrl+image}" alt="image"  class="mainImage \${index==0?'active':''}" >\`
    })
    slides.forEach(slide=>{
        currBullets=slide.bullets.map(bult=>\`<p>\${bult}</p>\`).join('');
        currHeading=\`\${slide.heading}\`;
        currParagraph=\`<p>\${slide.paragraph}</p>\`;
        subTitles.push(slide.subtitle);
        headings.push(currHeading);
        bullets.push(currBullets);
        paragraphs.push(currParagraph);
        captions.push(slide.caption);
        let tempIcon = '';
        slide.sociallinks.forEach(icon => {
            tempIcon += \`<img src="\${hostUrl}assests/icons/\${icon.name}.svg" alt="icon" class="icon" onClick="handleLinkRedirect('\${icon.link}')"/>\`;
        });
        iconsList.push(tempIcon);
    })
    bottomSection.innerHTML=TempImages;
    slideshow.innerHTML=slideshowImages;
    heading.innerHTML=\`<h1>\${headings[0]}</h1><h2>\${subTitles[0]}</h2>\`
    bullet.innerHTML=bullets[0];
    paragraph.innerHTML=paragraphs[0];
    captionText.innerHTML=captions[0];
    icons.innerHTML=iconsList[0];
    slideNumber.innerHTML=\`1 / \${images.length}\`
    var TopImagess = document.querySelectorAll('#slideshow img');
    var bottomImg = document.querySelectorAll('#bottomSection img');
    var currentImage = 0;
    function showNextImage() {
    TopImagess[currentImage].classList.remove('active');
    bottomImg[currentImage].classList.remove('bottomActive');
    currentImage = (currentImage + 1) % TopImagess.length;
    slideNumber.innerHTML=\`\${currentImage+1} / \${TopImagess.length}\`
    TopImagess[currentImage].classList.add('active');
    bottomImg[currentImage].classList.add('bottomActive');
    heading.innerHTML=\`<h1>\${headings[currentImage]}</h1><h2>\${subTitles[currentImage]}</h2>\`;
    bullet.innerHTML=bullets[currentImage];
    paragraph.innerHTML=paragraphs[currentImage];
    captionText.innerHTML=captions[currentImage];
    icons.innerHTML=iconsList[currentImage];
    }
    setInterval(showNextImage, 3000);`
    return js;
}   

const getCss = (style) => {
    let cssRoot = `:root {\n`;
    // Define default values for CSS variables
    const defaultValues = {
        bgColor: 'blue',
        paddingX: '10px',
        paddingY: '10px',
        topGap:'2rem',
        imgContbgColor: '#f7f6f6e0',
        slideNobgColor: 'rgb(15, 114, 207)',
        slideNoTextColor: 'rgb(255, 255, 255)',
        textContGap: '10px',
        captionGap: '10px',
        captionAlign: 'center',
        captionTextColor: 'pink',
        captionFont: '\'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif',
        captionFontSize: '1em',
        captionBorderColor: '#000000e5',
        captionBorderRadius: '5px',
        textContentBgColor: 'rgb(255, 255, 255)',
        headingFontSize: '2.0em',
        headingTextColor: 'rgb(255, 255, 255)',
        headingBoxShadow: '#ffffffe5',
        headingFont: '\'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif',
        subtitleTextColor: 'rgb(255, 255, 255)',
        subtitleFont: '\'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif',
        subtitleFontSize: '1em',
        bulletTextColor:'#000000',
        bulletFont: '\'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif',
        bulletFontSize:'1rem',
        paragraphTextColor: 'rgb(255, 255, 255)',
        paragraphFont: '\'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif',
        paragraphFontSize: '1em',
        bottomActiveShadow: 'rgb(255, 255, 255)',
        iconsColor:'white',
        iconsSize:'50px',
        bottomImageAlign: 'center',
        bottomImgbgColor:'transaparent',
        bulletGap:'4px',
    };

    // Iterate over the properties of the style object
    for (const prop in defaultValues) {
        // If the property exists in the style object, use its value, otherwise use the default value
        const value = style && style[prop] ? style[prop] : defaultValues[prop];
        cssRoot += `    --${prop}: ${value};\n`;
    }

    cssRoot += `}`;

    return `${cssRoot}
        html, body {
        width: 100vw; /* 100% of the viewport width */
        height: 100vh; /* 100% of the viewport height */
        margin: 0;
        padding: 0;
        overflow: hidden; /* Prevents scrollbars, be cautious as it might hide content */
        cursor:none;
        }
        
        html {
        font-family: Open Sans, sans-serif; 
        background-color: var(--bgColor); 
        color: var(--textColor);
        }
       
        .main{
            width:100wh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            height: 100vh;
            align-items: center;
            padding:var(--paddingX) var(--paddingY);
        }
       
        .topSection{
            width:100%;
            display:flex;
            gap:var(--topGap);
            height: 60vh;
            text-align: center; 
        }
       
        
        #bottomSection{
            padding:0px 15px ;
            display: flex;
            width:100%;
            height:40%;
            gap:20px;
            align-items: center;
            justify-content: var(--bottomImageAlign);
        }
        #bottomSection div{
        background-color: var(--bottomImgbgColor);
        height:10rem;
        padding:2rem 0 ;
        display: flex;
        align-items: center;
        }
        #bottomSection div img{
            aspect-ratio: 16/9;
            max-width: 18rem;
            transition: transform 1s, opacity 1s;
        }
        
        .topSectionLeft{
            width:100%;
            display: flex;
            flex-direction: column;
            justify-content: start;
            align-items: center;
            border-radius: 10px;
            gap:10px;
            padding:10px 10px;
            background-color: var(--imgContbgColor);
        }
        #slideshow {
            width:100%;
            height:100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }
    
        #slideshow img {
            max-width: 90%;
            max-height: 90%;
            position: absolute;
            top: 0;
            opacity: 0;
            transition: transform 1s, opacity 1s;
        }
    
        #slideshow img.active {
        opacity: 1;
        transform: scale(1.2);
        }
        
        .topSectionRight{
            width:100%;
            background-color: var(--textContentBgColor);
            border-radius: 10px;
            padding: 10px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            align-items: center;
            gap:var(--textContGap)
        }
        
        .caption{
            width:100%;
            display: flex;
            justify-content: var(--captionAlign);
            padding: 5px;
            gap:var(--captionGap);
            align-items: center;
        }
        .slideNumber{
            background-color: var(--slideNobgColor);
            color: var(--slideNoTextColor);
            padding: 5px;
            border-radius: 5px;
            width: 50px;
        }
        #captionText{
            color: var(--captionTextColor);
            padding: 5px;
            border-radius: var(--captionBorderRadius);
            text-align: center;
            min-width: 20%;
            width: auto;
            font-family: var(--captionFont);
            font-size:var(--captionFontSize);
            border : 1px solid var(--captionBorderColor);
        }
        #heading{
            width:90%;
            font-weight: bolder;
            padding: 5px;
            border-radius: 5px;
            box-shadow: var(--headingBoxShadow) 0 0 10px 1px;
            font-family: var(--headingFont)
        }
        #heading >h1{
            margin: 0px;
            font-size: var(--headingFontSize);
            color: var(--headingTextColor);
        }
        #heading >h2{
            margin: 0px;
            font-size: var(--subtitleFontSize);
            color: var(--subtitleTextColor);
        }
        #bullets{
            width:90%;
            display: flex;
            flex-direction: column;
            gap:var(--bulletGap);
            padding-left: 4rem;
        }
        #bullets >p{
            margin: 0px;
            color: var(--bulletTextColor);
            text-align: left;
            font-family: var(--bulletFont);
            font-size: var(--bulletFontSize);
        }
        #paragraph{
            width:90%;
        }
        #paragraph >p{
            margin: 0px;
            color: var(--paragraphTextColor);
            text-align: left;
            font-family: var(--paragraphFont);
            font-size: var(--paragraphFontSize);
        }
       .bottomActive{
        box-shadow: var(--bottomActiveShadow) 0 0 10px 1px;
       }
       .icons{
           display: flex;
           gap:10px;
       }
       .icon{
        max-width: var(--iconsSize);
        max-height: var(--iconsSize);
        object-fit: contain;
         border-radius: 10px;
         background-color: var(--iconsColor);
     }
        `;
}

const getHtml = (style,slides) => {
    return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Slideshow</title>
        <style>
            ${getCss(style)}
        </style>
    </head>
    <body>
    <div class="main">
    <div class="topSection">
        <div class="topSectionLeft">
            <div class="caption">
                <div class="slideNumber"></div>
                <div id="captionText"></div>
            </div>
            <div id="slideshow"></div>   
        </div>
        <div class="topSectionRight">
            <div id="heading"></div>
            <div id="bullets"></div>
            <div id="paragraph"></div>
            <div class="icons"></div>
        </div>
    </div>
    <div id="bottomSection"></div>
</div>
<script>
${getScript(slides)}
</script>
    </body>
    </html>`;
}
const style = {
    bgColor: 'red',
    imgContbgColor: 'yellow',
    slideNobgColor: 'rgb(50, 168, 82)',
    slideNoTextColor: 'rgb(0, 0, 0)',
    textContGap: '20px',
    captionGap: '15px',
    captionAlign: 'left',
    captionTextColor: 'blue',
    captionFont: '\'Arial\', sans-serif',
    captionFontSize: '0.9em',
    captionBorderColor: '#ccc',
    captionBorderRadius: '5px',
    headingFontSize: '2.5em',
    headingTextColor: 'rgb(255, 255, 255)',
    headingBoxShadow: '#333',
    headingFont: '\'Helvetica\', sans-serif',
    subtitleTextColor: 'rgb(100, 100, 100)',
    subtitleFont: '\'Roboto\', sans-serif',
    subtitleFontSize: '1em',
    paragraphTextColor: 'rgb(50, 50, 50)',
    paragraphFont: '\'Times New Roman\', serif',
    paragraphFontSize: '1.1em',
    bottomActiveShadow: 'rgba(0, 0, 0, 0.5)',
    iconsImgWidth: '60px',
    iconsImgheight: '60px'
};
// const slides=[{"image":"https://api.signage.example.edu/imagelibrary/25b4a6ef-1827-43d4-8fe0-001df56e2da6.jpeg","caption":"caption TEXT 1","subTitle":["title 1","title 2","title 3"],"heading":"heading heading","paragraph":"hello world lorem epsum 1"},{"id":123,"image":"https://api.signage.example.edu/imagelibrary/0b5309a2-e581-47c7-a4e9-0169ced47c31.jpeg","caption":"caption TEXT TEXT  2","subTitle":["title 4","title 5","title 6"],"heading":"heading heading","paragraph":"hello world lorem epsum 2"},{"id":123,"image":"https://api.signage.example.edu/imagelibrary/69173222-0474-409e-a0db-dd530e8ce250.jpeg","caption":"caption TEXT TEXt 3","subTitle":["title 7","title 8","title 9"],"heading":"heading heading","paragraph":"hello world lorem epsum 3"}]
module.exports = {getHtml,getCss,getScript};
