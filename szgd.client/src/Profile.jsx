import React, { useState, useEffect } from 'react';
import { Avatar, Button, Typography, Box } from '@mui/material';
import axios from 'axios';
import { useAuth } from './AuthContext'; // Zakładam, że masz AuthContext

const Profile = ({ avatar, onAvatarChange }) => {
    const [userInfo, setUserInfo] = useState({});
    const { user } = useAuth();  // Pobieramy dane użytkownika z AuthContext
    axios.defaults.headers.common['Authorization'] = `Bearer ${user?.tokens.accessToken}`;
    useEffect(() => {
        if (user && user.id) {
            // Zapytanie do API po dane użytkownika
            axios
                .get(`/api/user/details/${user.id}`)  // Zakładając, że masz endpoint do pobrania danych
                .then((response) => {
                    setUserInfo(response.data);  // Ustawienie pobranych danych w stanie
                })
                .catch((error) => {
                    console.error('Error fetching user details:', error);
                });
        }
    }, [user]);  // Efekt uruchamiany po załadowaniu komponentu oraz zmianie użytkownika

    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h4">Your Profile</Typography>

            {/* Avatar */}
            <Avatar
                alt="User Avatar"
                src={avatar || "/static/images/avatar/2.jpg"}
                sx={{ width: 150, height: 150, margin: '20px auto' }}
            />

            {/* Avatar change functionality */}
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={onAvatarChange} // Wywołanie zmiany avatara
                id="avatar-upload"
            />
            <Button
                variant="contained"
                onClick={() => document.getElementById('avatar-upload').click()}
                sx={{ marginTop: 2 }}
            >
                Change Avatar
            </Button>

            {/* User info */}
            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h6" sx={{ textDecoration: 'underline' }}>
                    Personal Information
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                    <strong>First Name:</strong> {user.userdata.imie || 'Not Provided'}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                    <strong>Last Name:</strong> {user.userdata.nazwisko || 'Not Provided'}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                    <strong>Email:</strong> {user.userdata.email || 'Not Provided'}
                </Typography>
                <Typography variant="body1" sx={{ marginBottom: 1 }}>
                    <strong>Phone:</strong> {user.userdata.phoneNumber || 'Not Provided'}
                </Typography>
            </Box>
        </div>
    );
};

export default Profile;
