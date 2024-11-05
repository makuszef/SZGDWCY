// import React, { useState } from 'react';
// import { TextField, Button, Box, Typography } from '@mui/material';
// import axios from "axios";
//
// const RegisterPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [confirmPassword, setConfirmPassword] = useState('');
//
//     const handleRegister = async (e) => {
//         e.preventDefault();
//         try {
//             console.log('Login attempt:', { email, password });
//
//             // Wysłanie zapytania POST do lokalnego serwera (np. localhost:5000/api/login)
//             const response = await axios.post('https://localhost:7191/register', {
//                 email,
//                 password
//             });
//
//             // Jeśli logowanie się powiedzie, wykonaj odpowiednie kroki
//             console.log('Login successful:', response.data);
//
//             // Możesz np. przekierować użytkownika lub zapisać token
//             // localStorage.setItem('token', response.data.token);
//
//         } catch (error) {
//             // Obsługa błędów
//             console.error('Login error:', error.response ? error.response.data : error.message);
//         }
//     };
//
//     return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
//             <Typography variant="h4" mb={3}>Register</Typography>
//             <form onSubmit={handleRegister}>
//                 <TextField
//                     label="Email"
//                     type="email"
//                     fullWidth
//                     margin="normal"
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                 />
//                 <TextField
//                     label="Password"
//                     type="password"
//                     fullWidth
//                     margin="normal"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <TextField
//                     label="Confirm Password"
//                     type="password"
//                     fullWidth
//                     margin="normal"
//                     value={confirmPassword}
//                     onChange={(e) => setConfirmPassword(e.target.value)}
//                 />
//                 <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
//                     Register
//                 </Button>
//             </form>
//         </Box>
//     );
// };
//
// export default RegisterPage;

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirect

const RegisterPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const navigate = useNavigate(); // Initialize useNavigate

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            console.log('Registration attempt:', { email, password });

            const response = await axios.post('https://localhost:7191/register', {
                email,
                password
            });

            console.log('Registration successful:', response.data);
            setSuccessMessage('Registration successful!'); // Set success message
            setOpenSnackbar(true); // Open Snackbar

            // Reset form fields
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            // Automatically redirect to login page after successful registration
            setTimeout(() => {
                navigate('/login'); // Redirect to the login page
            }, 2000); // Redirect after 2 seconds

        } catch (error) {
            console.error('Registration error:', error.response ? error.response.data : error.message);
            setSuccessMessage('Registration failed. Please try again.'); // Set error message
            setOpenSnackbar(true); // Open Snackbar on error
        }
    };

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
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

            {/* Snackbar for success message */}
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // This moves the Snackbar to the top
            >
                <Alert
                    severity={successMessage.includes('failed') ? "error" : "success"} // Set severity based on message
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
