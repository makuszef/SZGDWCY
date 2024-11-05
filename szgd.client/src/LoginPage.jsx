import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setDomownik, clearDomownik, selectDomownik } from './features/resourceSlice.jsx'; // Zmień ścieżkę na właściwą

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const [token, setToken] = useState(false);
    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Wysłanie zapytania POST do lokalnego serwera (np. localhost:5000/api/login)
            const response = await axios.post('https://localhost:7191/login', {
                email,
                password
            });
            
            // Jeśli logowanie się powiedzie, wykonaj odpowiednie kroki
            console.log('Login successful:', response.status);
            // Możesz np. przekierować użytkownika lub zapisać token
            // localStorage.setItem('token', response.data.token);
            setToken(true);
            dispatch(setDomownik(email));
        } catch (error) {
            // Obsługa błędów
            console.error('Login error:', error.response ? error.response.data : error.message);
            setToken(false);
        }
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
                {token ? <p>zalogowano</p> : <p>zle haslo</p>}
            </Typography>
        </Box>
    );
};

export default LoginPage;
