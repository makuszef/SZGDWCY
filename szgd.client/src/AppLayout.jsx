import React from 'react';
import Navbar from './Navbar'; // Assuming you have Navbar component
import Sidebar from './Sidebar'; 
import Footer from './Footer'; // Assuming you have Footer component
import { Box } from '@mui/material'; // Use Box and useTheme for accessing theme
import SprzatanieIcon from '@mui/icons-material/CleaningServices';  // Ikona sprz�tania
import ReceiptIcon from '@mui/icons-material/Receipt';               // Ikona paragon�w
import BuildIcon from '@mui/icons-material/Build';                   // Ikona sprz�tu
import PollIcon from '@mui/icons-material/Poll';                     // Ikona ankiet
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'; // Ikona zdrowia
import InventoryIcon from '@mui/icons-material/Inventory';            // Ikona zapas�w
import WindowIcon from '@mui/icons-material/Window';                 // Ikona kontroli okien
import HomeIcon from '@mui/icons-material/Home';
const MainCards = [
    { title: 'Harmonogram sprzatania', icon: <SprzatanieIcon />, route: "/sprzatanie", component: <div>Harmonogram sprzatania</div> },
    { title: 'Paragony i gwarancje', icon: <ReceiptIcon />, route: "/paragony", component: <div>Paragony i gwarancje</div> },
    { title: 'Sprzet', icon: <BuildIcon />, route: "/sprzet", component: <div>Sprzet</div> },
    { title: 'Ankiety', icon: <PollIcon />, route: "/ankiety", component: <div>Ankiety</div> },
    { title: 'Informacje zdrowotne', icon: <MedicalServicesIcon />, route: "/zdrowie", component: <div>Informacje zdrowotne</div> },
    { title: 'Zapasy', icon: <InventoryIcon />, route: "/zapasy", component: <div>Zapasy</div> },
    { title: 'Kontrola okien', icon: <WindowIcon />, route: "/kontrola-okien", component: <div>Kontrola okien</div> },
    { title: 'Domownicy', icon: <HomeIcon />, route: "/domownicy", component: <div>Domownicy</div> },
];
const AppLayout = ({ Content, Cards }) => {
    const navbarHeight = 64; // Adjust this height based on your Navbar's actual height

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Navbar */}
            <Navbar />

            {/* Main Content: Sidebar on the left, ResourceTable on the right */}
            <Box
                sx={{
                    display: 'flex',
                    flexGrow: 1,
                    width: '100%',
                    mt: `${navbarHeight}px`,
                }}
            >
                {/* Sidebar on the left */}
                <Box
                    sx={{
                        minWidth: '200px', // Set a minimum width for the sidebar
                        bgcolor: (theme) => theme.palette.primary.main, // Sidebar background color using primary theme color
                        height: `calc(100vh - ${navbarHeight}px)`, // Sidebar height minus the Navbar height
                        position: 'fixed',
                        top: `${navbarHeight}px`, // Position the sidebar below the navbar
                        left: 0,
                        zIndex: 1000,
                        overflow: 'auto', // Allow scrolling if the content overflows
                    }}
                >
                    {/* Render the Sidebar passed as a parameter */}
                    <Sidebar ListItems={MainCards} />
                </Box>

                {/* ResourceTable (with padding to accommodate the fixed sidebar) */}
                <Box
                    sx={{
                        flexGrow: 1,
                        ml: { xs: 0, md: '200px' }, // Push content to the right by the minimum width of the sidebar for medium and larger screens
                        p: 2,
                        transition: 'margin-left 0.3s', // Smooth transition for margin-left
                    }}
                >
                    {Content}
                </Box>
            </Box>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default AppLayout;
