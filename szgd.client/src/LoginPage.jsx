import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate(); // To redirect to another page after login

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Wysłanie zapytania POST do serwera logowania
            const response = await axios.post('https://localhost:7191/login', {
                email,
                password
            });

            // Jeśli logowanie się powiedzie
            console.log('Login successful:', response.status);
            console.log("tokens", response.data);
            setSuccessMessage('Login successl!');
            const userData = { email, tokens: response.data };
            login(userData);

            // Otwórz snackbar z komunikatem
            setOpenSnackbar(true);

            // Przekierowanie na stronę z gospodarstwem (gospodarstwa) po udanym logowaniu
            setTimeout(() => {
                navigate('/gospodarstwa'); // Zmieniamy '/buttons' na '/gospodarstwa'
            }, 2000); // Przekierowanie po 2 sekundach

        } catch (error) {
            // Obsługa błędów
            console.error('Login error:', error.response ? error.response.data : error.message);
            setSuccessMessage('Login failed. Please check your credentials.');
            setOpenSnackbar(true); // Otwórz snackbar przy błędzie logowania
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
            <Typography variant="h4" mb={3}>Login</Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Log In
                </Button>
            </form>

            <Typography mt={2}>
                Don't have an account? <Link to="/register">Register here</Link>
            </Typography>

            {/* Snackbar for login success or failure */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position the snackbar at the top
            >
                <Alert severity={successMessage.includes('failed') ? "error" : "success"} onClose={handleSnackbarClose} sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LoginPage;
