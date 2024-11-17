import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Używamy kontekstu do sprawdzania stanu użytkownika
import CorrectIcon from '@mui/icons-material/CheckCircle';


const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const { login, user } = useAuth(); // Uzyskujemy dane użytkownika z kontekstu
    const navigate = useNavigate();

    // Jeśli użytkownik jest już zalogowany, przekieruj na stronę główną
    if (user) {
        return (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
                <CorrectIcon sx={{ fontSize: 40, color: 'green', marginBottom: 2 }} />

                <Typography variant="h4" mb={3}>Jesteś już zalogowany!</Typography>
                <Typography variant="h6" mb={3}>Zalogowano pomyślnie jako {user.userdata.imie}.</Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/gospodarstwa')}>
                    Przejdź do gospodarstw
                </Button>
            </Box>
        );
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('https://localhost:7191/login', {
                email,
                password
            });

            console.log('Login successful:', response.status);
            console.log("tokens", response.data);
            setSuccessMessage('Login successful!');
            axios.defaults.headers.common['Authorization'] = `Bearer ${response?.data.accessToken}`;
            try {
                const userResponse = await axios.get(`https://localhost:7191/api/Domownik/GetDomownikByEmail/${email}`);
                console.log('User data:', userResponse.data);
                const userData = { userdata: userResponse.data, tokens: response.data };
                login(userData); // Logowanie użytkownika

                setOpenSnackbar(true);
                // setTimeout(() => {
                //     navigate('/gospodarstwa');
                // }, 2000);

            } catch (error) {
                console.error('Error fetching user data:', error.response ? error.response.data : error.message);
            }
        } catch (error) {
            console.error('Login error:', error.response ? error.response.data : error.message);
            setSuccessMessage('Login failed. Please check your credentials.');
            setOpenSnackbar(true);
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

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity={successMessage.includes('failed') ? "error" : "success"} onClose={handleSnackbarClose} sx={{ width: '100%' }}>
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default LoginPage;
