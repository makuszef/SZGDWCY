// import React, { useState } from 'react';
// import { TextField, Button, Box, Typography } from '@mui/material';
// import { Link } from 'react-router-dom';
// import axios from 'axios';
// import { useDispatch, useSelector } from 'react-redux';
// import { setDomownik, clearDomownik, selectDomownik } from './features/resourceSlice.jsx'; // Zmień ścieżkę na właściwą
//
// const LoginPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const dispatch = useDispatch();
//     const [token, setToken] = useState(false);
//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             // Wysłanie zapytania POST do lokalnego serwera (np. localhost:5000/api/login)
//             const response = await axios.post('https://localhost:7191/login', {
//                 email,
//                 password
//             });
//
//             // Jeśli logowanie się powiedzie, wykonaj odpowiednie kroki
//             console.log('Login successful:', response.status);
//             // Możesz np. przekierować użytkownika lub zapisać token
//             // localStorage.setItem('token', response.data.token);
//             setToken(true);
//             dispatch(setDomownik(email));
//         } catch (error) {
//             // Obsługa błędów
//             console.error('Login error:', error.response ? error.response.data : error.message);
//             setToken(false);
//         }
//     };
//
//
//     return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
//             <Typography variant="h4" mb={3}>Login</Typography>
//             <form onSubmit={handleLogin}>
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
//                 <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
//                     Log In
//                 </Button>
//             </form>
//             <Typography mt={2}>
//                 Don't have an account? <Link to="/register">Register here</Link>
//                 {token ? <p>success</p> : <p>wrong password</p>}
//             </Typography>
//         </Box>
//     );
// };

// export default LoginPage;


// import React, { useState } from 'react';
// import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
// import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate for redirect
// import axios from 'axios';
// import { useDispatch } from 'react-redux';
// import { setDomownik } from './features/resourceSlice.jsx'; // Zmień ścieżkę na właściwą
//
// const LoginPage = () => {
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [token, setToken] = useState(false);
//     const [openSnackbar, setOpenSnackbar] = useState(false);
//     const [successMessage, setSuccessMessage] = useState('');
//     const dispatch = useDispatch();
//     const navigate = useNavigate(); // To redirect to another page after login
//
//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             // Wysłanie zapytania POST do serwera logowania
//             const response = await axios.post('https://localhost:7191/login', {
//                 email,
//                 password
//             });
//
//             // Jeśli logowanie się powiedzie, ustaw successMessage
//             console.log('Login successful:', response.status);
//             setToken(true);
//             setSuccessMessage('Login successful!');
//             dispatch(setDomownik(email));
//
//             // Otwórz snackbar z komunikatem
//             setOpenSnackbar(true);
//
//             // Przekierowanie na stronę z gospodarstwem (gospodarstwo) po udanym logowaniu
//             setTimeout(() => {
//                 navigate('/gospodarstwa'); // Zmieniamy '/buttons' na '/gospodarstwo'
//             }, 2000); // Przekierowanie po 2 sekundach
//
//         } catch (error) {
//             // Obsługa błędów
//             console.error('Login error:', error.response ? error.response.data : error.message);
//             setToken(false);
//             setSuccessMessage('Login failed. Please check your credentials.');
//         }
//     };
//
//     const handleSnackbarClose = () => {
//         setOpenSnackbar(false);
//     };
//
//     return (
//         <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 5 }}>
//             <Typography variant="h4" mb={3}>Login</Typography>
//             <form onSubmit={handleLogin}>
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
//                 <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
//                     Log In
//                 </Button>
//             </form>
//
//             <Typography mt={2}>
//                 Don't have an account? <Link to="/register">Register here</Link>
//             </Typography>
//
//             {/* Snackbar for login success or failure */}
//             <Snackbar
//                 open={openSnackbar}
//                 autoHideDuration={6000}
//                 onClose={handleSnackbarClose}
//                 anchorOrigin={{ vertical: 'top', horizontal: 'center' }} // Position the snackbar at the top
//             >
//                 <Alert severity={token ? "success" : "error"} onClose={handleSnackbarClose} sx={{ width: '100%' }}>
//                     {successMessage}
//                     {token && (
//                         <Link to="/gospodarstwa" style={{ color: 'black', textDecoration: 'underline', marginLeft: '10px' }}>
//                             Go to Home
//                         </Link>
//                     )}
//                 </Alert>
//             </Snackbar>
//         </Box>
//     );
// };

// export default LoginPage;

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, Snackbar, Alert } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setDomownik } from './features/resourceSlice.jsx';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const dispatch = useDispatch();
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
            setSuccessMessage('Login successful!');
            dispatch(setDomownik(email));

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
