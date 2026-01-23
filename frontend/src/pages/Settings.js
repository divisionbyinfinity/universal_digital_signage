import React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import { ThemeProvider } from '@mui/material/styles'; // Import ThemeProvider
import globalTheme from './globalTheme';
import { Typography } from '@mui/material';

const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

function Settings() {
  // Use the global theme as the theme for this component
  return (
    <ThemeProvider theme={globalTheme}>
      <div>
        <Typography variant="h4" color="primary">Delete content</Typography> {/* Use the h4 variant for your heading */}
        <div>
          <div>
            <Checkbox {...label} defaultChecked /> Playlists
          </div>
          <div>
            <Checkbox {...label} /> Images
          </div>
          <Box sx={{ m: 2 }}>
            <Button variant="contained" color="primary">Delete</Button> {/* Use the primary color */}
          </Box>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default Settings;
