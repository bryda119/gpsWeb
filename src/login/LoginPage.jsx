import React, { useEffect, useState } from 'react';
import {
  Button,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Snackbar,
  TextField,
  Typography,
} from '@mui/material';
import makeStyles from '@mui/styles/makeStyles';
import CloseIcon from '@mui/icons-material/Close';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import EmailIcon from '@mui/icons-material/Email';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { sessionActions } from '../store';
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
    background: 'linear-gradient(135deg, #4A5568 0%, #2D3748 100%)',
    color: '#fff',
    fontWeight: 'bold',
    padding: theme.spacing(1.5),
    borderRadius: '8px',
    boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      background: 'linear-gradient(135deg, #2D3748 0%, #4A5568 100%)',
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
      color: '#000',
      fontSize: '0.9rem',
      fontWeight: 'bold',
    },
    '& .MuiFormHelperText-root': {
      color: '#f44336',
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
  extraContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: theme.spacing(3),
  },
  link: {
    cursor: 'pointer',
    color: theme.palette.secondary.main,
    fontWeight: '500',
    textDecoration: 'none',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
}));

const LoginPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [failed, setFailed] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const announcement = useSelector((state) => state.session.server.announcement);

  const handlePasswordLogin = async (event) => {
    event.preventDefault();
    setFailed(false);

    try {
      const response = await fetch('/api/session', {
        method: 'POST',
        body: new URLSearchParams({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        dispatch(sessionActions.updateUser(user));
        navigate('/');
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      setFailed(true);
      setPassword('');
    }
  };

  return (
    <div className={classes.root}>
      <Paper className={classes.paper} elevation={3}>
        <div className={classes.logo}>
          <img src={logoSvg} alt="Logo" className={classes.logoImage} />
        </div>
        <Typography variant="h5" className={classes.title}>
          Login
        </Typography>
        <form className={classes.form} onSubmit={handlePasswordLogin}>
          <TextField
            required
            error={failed}
            label="Email*"
            name="email"
            value={email}
            autoComplete="email"
            onChange={(e) => setEmail(e.target.value)}
            helperText={failed && 'Usuario o contraseña inválida'}
            fullWidth
            variant="outlined"
            className={classes.inputField}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailIcon />
                </InputAdornment>
              ),
            }}
          />
          <TextField
            required
            error={failed}
            label="Password*"
            name="password"
            value={password}
            type="password"
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            className={classes.inputField}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOpenIcon />
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            variant="contained"
            className={classes.button}
            fullWidth
          >
            Login
          </Button>
        </form>
        {/* 
          <div className={classes.extraContainer}>
            <Link
              onClick={() => navigate('/register')}
              className={classes.link}
            >
              Register
            </Link>
            <Link
              onClick={() => navigate('/reset-password')}
              className={classes.link}
            >
              Forgot Password?
            </Link>
          </div>
        */}

      </Paper>
      <Snackbar
        open={!!announcement}
        message={announcement}
        action={
          <IconButton
            size="small"
            color="inherit"
            onClick={() => {}}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      />
    </div>
  );
};

export default LoginPage;
