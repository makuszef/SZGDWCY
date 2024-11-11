import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert, Grid } from '@mui/material';
import axios from "axios";
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('https://localhost:7191/register', {
                email,
                password,
                phoneNumber,
                firstName,
                lastName
            });

            setSuccessMessage('Registration successful!');
            setOpenSnackbar(true);

            axios.put(`https://localhost:7191/api/Domownik/${email}`, {
                Imie: firstName,        // Pasuje do 'Imie' w DomownikDTO
                Nazwisko: lastName,     // Pasuje do 'Nazwisko' w DomownikDTO
                PhoneNumber: phoneNumber // Pasuje do 'PhoneNumber' w DomownikDTO
            });


            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setPhoneNumber('');
            setFirstName('');
            setLastName('');

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error.response ? error.response.data : error.message);
            setSuccessMessage('Registration failed. Please try again.');
            setOpenSnackbar(true);
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
            <Typography variant="h4" mb={3}>Register</Typography>
            <form onSubmit={handleRegister}>
                <Grid container spacing={2}>

                    {/* Kolumna lewa */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="First Name"
                            type="text"
                            fullWidth
                            margin="normal"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
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
                    </Grid>

                    {/* Kolumna prawa */}
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Last Name"
                            type="text"
                            fullWidth
                            margin="normal"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                        <TextField
                            label="Phone Number"
                            type="tel"
                            fullWidth
                            margin="normal"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                        <TextField
                            label="Confirm Password"
                            type="password"
                            fullWidth
                            margin="normal"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </Grid>
                </Grid>

                <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }}>
                    Register
                </Button>
            </form>

            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert
                    severity={successMessage.includes('failed') ? "error" : "success"}
                    onClose={handleSnackbarClose}
                    sx={{ width: '100%' }}
                >
                    {successMessage}
                </Alert>
            </Snackbar>
        </Box>
    );
};

export default RegisterPage;
