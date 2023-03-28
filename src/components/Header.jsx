import MenuIcon from '@mui/icons-material/Menu';
import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from '@mui/material';
import Chip from '@mui/material/Chip';
import React from 'react';
import { ReadyState } from 'react-use-websocket';

function Header({ status, readyState, onClick }) {
  return (
    <header>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Estado de la conexion con el WebSocket:
              <Chip
                sx={{ marginLeft: 1 }}
                label={status}
                color={readyState === ReadyState.OPEN ? 'success' : 'error'}
              />
            </Typography>
            <Button
              type="submit"
              color={readyState !== ReadyState.OPEN ? 'success' : 'error'}
              variant="contained"
              // sx={{ width: 1 }}
              onClick={onClick}
            >
              {readyState === ReadyState.OPEN ? 'Cerrar ws' : 'Abrir ws'}
            </Button>
          </Toolbar>
        </AppBar>
      </Box>
    </header>
  );
}

export default Header;
