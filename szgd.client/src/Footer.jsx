// Footer.jsx
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import {Info, Mail } from '@mui/icons-material'; // Importing icons
/**
 * Footer component for the application.
 * Displays copyright information and a navigation link to the "About" page.
 *
 * @returns {JSX.Element} React component for the application footer.
 */

/**
 * Renders the application footer using Material-UI's AppBar and Toolbar components.
 * Includes a copyright notice and an "About" button with an icon.
 *
 * @function Footer
 */

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
