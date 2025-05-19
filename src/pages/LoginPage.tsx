import { useState } from 'react';
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Paper,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/images/logo.png';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('fred@example.com');
  const [password, setPassword] = useState('password');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Identifiants invalides. Veuillez réessayer.');
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: '#1e1e1e',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        {/* Logo */}
    <Box sx={{ textAlign: 'center', mb: 2 }}>
  <img
    src={logo}
    alt="Logo Xyloquest"
    style={{
      maxWidth: '400px',
      height: 'auto',
      filter: 'drop-shadow(0 0 12px #9146FF)',
      transition: 'transform 0.3s ease',
    }}
    onMouseOver={(e) =>
      (e.currentTarget.style.transform = 'scale(1.05)')
    }
    onMouseOut={(e) =>
      (e.currentTarget.style.transform = 'scale(1)')
    }
  />
</Box>



        <Paper
          elevation={6}
          sx={{
            p: 4,
            borderRadius: 3,
            backgroundColor: '#2a2a2a',
            color: '#fff',
          }}
        >
          <Typography
            variant="h5"
            align="center"
            gutterBottom
            sx={{ mb: 2, color: '#fff' }}
          >
            Connexion
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{
                style: { color: '#fff', borderColor: '#9146FF' },
              }}
            />
            <TextField
              label="Mot de passe"
              type="password"
              fullWidth
              required
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputLabelProps={{ style: { color: '#ccc' } }}
              InputProps={{
                style: { color: '#fff', borderColor: '#9146FF' },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                backgroundColor: '#9146FF',
                '&:hover': {
                  backgroundColor: '#7c3fe4',
                },
              }}
            >
              Se connecter
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
