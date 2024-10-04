import React, { useState } from 'react';
import { Drawer, List, ListItem, ListItemText, ListItemIcon, Toolbar, CssBaseline, IconButton, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import LogoutButton from './LogoutButton';
import DashboardIcon from '@mui/icons-material/Dashboard';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const drawerWidth = 240;

function NavBar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawerContent = (
    <Box
      sx={{ 
        height: '100%',
        display: 'flex', 
        flexDirection: 'column', 
        justifyContent: 'space-between'
      }}
    >
      <div>
        <Toolbar />
        <List>
          <ListItem button component={Link} to="/dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button component={Link} to="/participants">
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="Participants" />
          </ListItem>
        </List>
      </div>

      <List>
        <LogoutButton />
      </List>
    </Box>
  );

  return (
    <>
      <CssBaseline />

      {isMobile && (
        <IconButton
          color="primary"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{
            position: 'fixed',
            top: '16px',
            left: '16px',
            zIndex: theme.zIndex.drawer + 1,
            backgroundColor: 'white',
            border: '1px solid #ddd',
            '&:hover': {
              backgroundColor: '#f5f5f5',
            },
          }}
        >
          <MenuIcon />
        </IconButton>
      )}

      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant={isMobile ? "temporary" : "permanent"}
        open={!isMobile || mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        anchor="left"
      >
        {drawerContent}
      </Drawer>
    </>
  );
}

export default NavBar;
