// Footer.jsx
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import {Info, Mail } from '@mui/icons-material'; // Importing icons

const Footer = () => {
    return (
        <AppBar color="primary" sx={{ top: 'auto', bottom: 0 }}>
            <Container>
                <Toolbar>
                    <Typography variant="body1" sx={{ flexGrow: 1 }}>
                        &copy; {new Date().getFullYear()} System wspomagania zarzadzeniem gospodarstwem domowym.
                    </Typography>
                    <Button color="inherit" href="/about" startIcon={<Info />}>
                        About
                    </Button>
                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default Footer;
