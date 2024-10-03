import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';

function TopBar() {
  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Typography variant="h2" component="div" sx={{ marginLeft: '44px' }}>
          Eventy
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
