import {
  Box,
  IconButton,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import logo from '../../assets/images/logo.png';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';


const Header = () => {
  const {logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <img
            src={logo}
            alt="Logo Xyloquest"
            style={{
              maxWidth: '220px',
              filter: 'drop-shadow(0 0 16px #9146FF)',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/dashboard')}
          />
          <IconButton onClick={handleLogout} sx={{ color: '#9146FF' }}>
            <LogoutIcon />
          </IconButton>
        </Box>
  );
};

export default Header;
