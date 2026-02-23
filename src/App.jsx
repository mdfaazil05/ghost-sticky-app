import React, { useEffect, useState } from 'react';
import { Paper, Box, IconButton, InputBase, Typography, Tooltip, Slider } from '@mui/material';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import CloseIcon from '@mui/icons-material/Close';
import { ArrowBack, Settings } from '@mui/icons-material';

const getContrastColor = (hexColor) => {
  // Remove the hash if it exists
  const hex = hexColor.replace('#', '');
  
  // Convert to RGB
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  
  // Calculate YIQ brightness (industry standard formula)
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  
  // If brightness is > 128, the color is light, so return black. Otherwise white.
  return (yiq >= 128) ? '#000000' : '#ffffff';
};

const App = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Appearance States
  const [bgColor, setBgColor] = useState('#fff9c4');
  const [opacity, setOpacity] = useState(0.5);

  const [note, setNote] = useState("");
  useEffect(() => {
    // Load saved note from localStorage on mount
    const savedNote = localStorage.getItem('stickyNoteContent');
    const savedBgColor = localStorage.getItem('stickyNoteBgColor');
    const savedOpacity = localStorage.getItem('stickyNoteOpacity');

    if (savedBgColor) setBgColor(savedBgColor);
    if (savedOpacity) setOpacity(parseFloat(savedOpacity));
    if (savedNote) {
      setNote(savedNote);
    }
  }, []);

  return (
    // Paper gives it that nice "card" feel with elevation
   <div style={{ 
      background: bgColor, 
      height: '90vh', 
      opacity:opacity,
      boxSizing: 'border-box',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
      display: 'flex',
      flexDirection: 'column',
      cursor: 'default',
    }}> 
      {/* Draggable Header */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        p: 1, 
        borderRadius: '10px 10px 0 0',
        backgroundColor: '#f4eb91',
        WebkitAppRegion: 'drag', // Make sure this is draggable
        cursor: 'grab'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <VisibilityOffIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
          <Typography variant="caption" sx={{ fontWeight: 'bold' }}>{isSettingsOpen ? 'SETTINGS' : 'GHOST NOTE'}</Typography>
          <Tooltip 
           title="Ghost Mode Active" 
          // arrow
          /* Remove TransitionComponent={Zoom} for a moment to test */
          disableInteractive // This helps performance in Electron
          enterNextDelay={100}
          >
            <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>(Why not invisible?)</Typography>
          </Tooltip>
        </Box>
        
        {/* Buttons MUST be 'no-drag' to be clickable */}
        <Box sx={{ WebkitAppRegion: 'no-drag' }}>
          <IconButton size="small" sx={{ WebkitAppRegion: 'no-drag',cursor: 'default' }} onClick={() => setIsSettingsOpen(!isSettingsOpen)}>
          {isSettingsOpen ? <ArrowBack fontSize="small" /> : <Settings fontSize="small" />}
        </IconButton>

          <IconButton size="small" sx={{cursor: 'default'}} onClick={() => window.close()}>
            <CloseIcon fontSize="inherit" />
          </IconButton>
        </Box>
      </Box>

      {/* Note Content */}
      <Box sx={{ flex: 1, p: 2,overflowY: 'auto', WebkitAppRegion: 'no-drag',cursor:'default',
        '&::-webkit-scrollbar': {
      width: '4px', // Makes the scrollbar very thin
    },
    '&::-webkit-scrollbar-track': {
      background: 'transparent', // Keeps the track invisible
    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)', // A subtle, semi-transparent grey
      borderRadius: '10px', // Rounds the edges of the scrollbar thumb
    },
    '&::-webkit-scrollbar-thumb:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.4)', // Darkens slightly when you hover over it
    }

       }}>
       {isSettingsOpen?
      ( <Box sx={{width:"98%",color: getContrastColor(bgColor)}}>
            <Box>
              <Typography variant="caption">Background Color</Typography>
              <input 
                type="color" 
                value={bgColor} 
                onChange={(e) => {setBgColor(e.target.value); localStorage.setItem('stickyNoteBgColor', e.target.value);}} 
                style={{ width: '100%', height: '30px', cursor: 'pointer' }}
              />
            </Box>

            <Box sx={{mt:"10px"}}>
              <Typography variant="caption">Window Opacity ({Math.round(opacity * 100)}%)</Typography>
              <Slider 
                value={opacity} 
                min={0.2} 
                max={1} 
                step={0.01} 
                onChange={(_, val) => {setOpacity(val); localStorage.setItem('stickyNoteOpacity', val);}} 
              />
            </Box>
          
        </Box>): (<InputBase
          multiline
          fullWidth
          placeholder="Type private notes here..."
          value={note}
          onChange={(e) => {setNote(e.target.value); localStorage.setItem('stickyNoteContent', e.target.value);}}
          sx={{ fontSize: '16px', alignItems: 'flex-start','& .MuiInputBase-input': {
      cursor: 'default',
    }, color: getContrastColor(bgColor) }}
        />)}
      </Box>
    </div>
  );
};

export default App;