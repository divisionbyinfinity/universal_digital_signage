// globalTheme.js
import { createTheme } from '@mui/material/styles';

const globalTheme = createTheme({
  typography: {
   //fontFamily: '"Oswald", sans-serif', // Default font stack for the entire application
    h1: {
      fontFamily: '"Oswald", sans-serif', // Apply Oswald font to h1
      // You can also set other typography properties here, such as fontSize, fontWeight, etc.
    },
    h2: {
      //fontFamily: '"Roboto Slab", serif', // Apply Roboto Slab font to body text
     fontFamily: '"Oswald", sans-serif', // Apply Oswald font to h2
    },
    h3: {
      fontFamily: '"Oswald", sans-serif', // Apply Oswald font to h3
    },
    h4: {
      fontFamily: '"Oswald", sans-serif', // Apply Oswald font to h4
    },
    h5: {
      fontFamily: '"Source Sans Pro", sans-serif', // Apply Source Sans Pro font to h5
    },
    h6: {
      fontFamily: '"Source Sans Pro", sans-serif', // Apply Source Sans Pro font to h6
    },
    body1: {
      fontFamily: '"Roboto Slab", serif', // Apply Roboto Slab font to body text
    },
    bold:{
      fontWeightBold: 'bold',
      fontFamily: '"Oswald", sans-serif' // Set the default font weight for bold text
    },
    // You can customize other typography elements as needed
  },
  palette: {
    primary: {
      main: '#276436', // green
    },
    secondary: {
      main: '#bbd236', // yellow
    },
    text: {
      primary: '#333333', // dark gray
      secondary: '#595959', // medium gray
    },
  },
  fontThemes: {
    fontTheme1: {
      typography: {
        oswald: {
          fontFamily: '"Oswald", sans-serif',
        },
        arial: {
          fontFamily: '"Arial", sans-serif',
        },
        // Add other typography configurations as needed
      },
    },
    fontTheme2: {
      typography: {
        h1: {
          fontFamily: '"Arial", sans-serif',
        },
        h2: {
          fontFamily: '"Arial", sans-serif',
        },
        // Add other typography configurations as needed
      },
    },}

  
});

export default globalTheme;
