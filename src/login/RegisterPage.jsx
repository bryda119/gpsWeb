import React, { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Typography,
  Snackbar,
  IconButton,
  Paper,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';
import backgroundImage from '/src/resources/images/bg.jpg';
import logoSvg from '/src/resources/images/logo.svg';

const useStyles = makeStyles((theme) => ({
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'scale(0.95)' },
    '100%': { opacity: 1, transform: 'scale(1)' },
  },
  root: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundImage: `url(${backgroundImage})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    padding: theme.spacing(2),
    backdropFilter: 'blur(10px)',
  },
  paper: {
    padding: theme.spacing(5),
    borderRadius: '16px',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.4)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
    maxWidth: 400,
    width: '100%',
    color: '#fff',
    animation: '$fadeIn 0.8s ease',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(3),
  },
  button: {
    background: 'linear-gradient(135deg, #48BB78 0%, #38A169 100%)',
    color: '#fff',
    fontWeight: 'bold',
    padding: theme.spacing(1.5),
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: 'linear-gradient(135deg, #38A169 0%, #48BB78 100%)',
      transform: 'scale(1.05)',
      boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    },
  },
  inputField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '10px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      color: '#000',
      boxShadow: 'inset 0 2px 5px rgba(0, 0, 0, 0.1)',
      transition: 'box-shadow 0.3s ease, transform 0.2s ease',
      '&:hover': {
        boxShadow: 'inset 0 3px 8px rgba(0, 0, 0, 0.15)',
      },
      '&.Mui-focused': {
        transform: 'scale(1.02)',
        boxShadow: 'inset 0 4px 10px rgba(0, 0, 0, 0.2)',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#fff',
    },
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: theme.spacing(3),
    letterSpacing: '1px',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  logo: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: theme.spacing(3),
  },
  logoImage: {
    width: '150px',
    height: 'auto',
  },
}));

const RegisterPage = () => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Revisar si ya se ha bloqueado el registro
    const registrationDisabled = localStorage.getItem('registrationDisabled');
    if (registrationDisabled === 'true') {
      navigate('/login'); // Redirigir al login si el registro está bloqueado
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Redirigir al login después de un registro exitoso
        navigate('/login');
      } else {
        const errorText = await response.text();
        if (errorText.includes('Registration disabled')) {
          // Bloquear permanentemente el acceso a la página de registro
          localStorage.setItem('registrationDisabled', 'true');
          navigate('/login');
        } else {
          setError(errorText || 'El registro falló. Por favor, inténtalo de nuevo.');
        }
      }
    } catch (error) {
      setError('Ocurrió un error. Por favor, inténtalo de nuevo.');
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <div className={classes.logo}>
          <img src={logoSvg} alt="Logo" className={classes.logoImage} />
        </div>
        <Typography variant="h5" className={classes.title}>
          Registro
        </Typography>
        <form className={classes.form} onSubmit={handleSubmit}>
          <TextField
            required
            label="Nombre"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            variant="outlined"
            className={classes.inputField}
          />
          <TextField
            required
            label="Correo Electrónico"
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            variant="outlined"
            className={classes.inputField}
          />
          <TextField
            required
            label="Contraseña"
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            className={classes.inputField}
          />
          <Button
            type="submit"
            variant="contained"
            className={classes.button}
            disabled={!name || !email || !password}
            fullWidth
          >
            Registrarse
          </Button>
        </form>
        {error && (
          <Typography variant="body2" color="error" style={{ marginTop: 8 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </div>
  );
};

export default RegisterPage;
