// Footer.jsx
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import { Info, Mail } from '@mui/icons-material'; // Importing icons
import {Grid } from '@mui/material';
const About = () => {
    return (
        <div>
            <Grid container spacing={2}>
                {/* Wyświetlanie zdjęć */}
                <Grid item xs={12} sm={6} md={3}>
                    <img src="/Luki.jpeg" alt="Image 1" style={{ width: '100%', borderRadius: '8px' }} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <img src="/Luki2.jpeg" alt="Image 2" style={{ width: '100%', borderRadius: '8px' }} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <img src="/Luki3.jpeg" alt="Image 3" style={{ width: '100%', borderRadius: '8px' }} />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <img src="/Luki4.jpeg" alt="Image 4" style={{ width: '100%', borderRadius: '8px' }} />
                </Grid>
            </Grid>
        </div>
    );
};

export default About;
