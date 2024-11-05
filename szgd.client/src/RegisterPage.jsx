import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';
import axios from "axios";

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            console.log('Login attempt:', { email, password });

            // Wysłanie zapytania POST do lokalnego serwera (np. localhost:5000/api/login)
            const response = await axios.post('https://localhost:7191/register', {
                email,
                password
            });

            // Jeśli logowanie się powiedzie, wykonaj odpowiednie kroki
            console.log('Login successful:', response.data);

            // Możesz np. przekierować użytkownika lub zapisać token
            // localStorage.setItem('token', response.data.token);

        } catch (error) {
            // Obsługa błędów
            console.error('Login error:', error.response ? error.response.data : error.message);
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
            <Typography variant="h4" mb={3}>Register</Typography>
            <form onSubmit={handleRegister}>
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
                <TextField
                    label="Confirm Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
                    Register
                </Button>
            </form>
        </Box>
    );
};

export default RegisterPage;
