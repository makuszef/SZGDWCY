import React from 'react';
import Navbar from './Navbar'; // Assuming you have Navbar component
import Sidebar from './Sidebar';
import Footer from './Footer'; // Assuming you have Footer component
import { Box } from '@mui/material'; // Use Box and useTheme for accessing theme
import SprzatanieIcon from '@mui/icons-material/CleaningServices'; // Icon for cleaning schedule
import ReceiptIcon from '@mui/icons-material/Receipt'; // Icon for receipts
import BuildIcon from '@mui/icons-material/Build'; // Icon for equipment
import PollIcon from '@mui/icons-material/Poll'; // Icon for surveys
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'; // Icon for health information
import InventoryIcon from '@mui/icons-material/Inventory'; // Icon for inventory
import PeopleIcon from '@mui/icons-material/People';
import WindowIcon from '@mui/icons-material/Window'; // Icon for window control
import HomeIcon from '@mui/icons-material/Home';
import { useAuth } from './AuthContext';
import Gospodarstwo from "@/Gospodarstwo.jsx";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ExpenseSplit from "@/ExpenseSplit.jsx";

const MainCards = [
    { title: 'Harmonogram sprzątania', icon: <SprzatanieIcon />, route: "/sprzatanie", component: <div>Harmonogram sprzątania</div> },
    { title: 'Paragony i gwarancje', icon: <ReceiptIcon />, route: "/paragony", component: <div>Paragony i gwarancje</div> },
    { title: 'Sprzęt', icon: <BuildIcon />, route: "/sprzet", component: <div>Sprzęt</div> },
    { title: 'Ankiety', icon: <PollIcon />, route: "/ankiety", component: <div>Ankiety</div> },
    { title: 'Informacje zdrowotne', icon: <MedicalServicesIcon />, route: "/zdrowie", component: <div>Informacje zdrowotne</div> },
    { title: 'Zapasy', icon: <InventoryIcon />, route: "/zapasy", component: <div>Zapasy</div> },
    { title: 'Kontrola okien', icon: <WindowIcon />, route: "/kontrola-okien", component: <div>Kontrola okien</div> },
    { title: 'Domownicy', icon: <PeopleIcon />, route: "/domownicy", component: <div>Domownicy</div> },
    { title: 'Gospodarstwa', icon: <HomeIcon />, route: "/gospodarstwa", component: <div>Gospodarstwa</div>},
    { title: 'Wydatki', icon: <AttachMoneyIcon />, route: "/wydatki", component: <ExpenseSplit/>},

];

const AppLayout = ({ Content, Cards }) => {
    const navbarHeight = 64; // Adjust this height based on your Navbar's actual height
    const { user } = useAuth(); // Access user data from the auth context

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
                {/* Conditional Sidebar on the left */}
                {user && ( // Only render Sidebar if the user is logged in
                    <Box
                        sx={{
                            bgcolor: (theme) => theme.palette.primary.main, // Sidebar background color using primary theme color
                            height: `100%`, // Sidebar height minus the Navbar height
                            position: 'fixed',
                            top: `${navbarHeight}px`, // Position the sidebar below the navbar
                            left: 0,
                            zIndex: 1000,
                            overflow: 'auto', // Allow scrolling if the content overflows
                        }}
                    >
                        <Sidebar ListItems={MainCards} />
                    </Box>
                )}

                {/* ResourceTable (with padding to accommodate the fixed sidebar if user is logged in) */}
                <Box
                    sx={{
                        flexGrow: 1,
                        ml: user ? '200px' : 0, // Adjust left margin based on user login status
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
