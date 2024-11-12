import React from 'react';
import { Avatar, Button, Typography } from '@mui/material';

const Profile = ({ avatar, onAvatarChange }) => {
    return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h4">Your Profile</Typography>
            <Avatar
                alt="User Avatar"
                src={avatar || "/static/images/avatar/2.jpg"}
                sx={{ width: 150, height: 150, margin: '20px auto' }}
            />
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
        </div>
    );
};

export default Profile;
