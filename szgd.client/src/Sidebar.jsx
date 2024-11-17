import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAuth } from './AuthContext';

export default function Sidebar({ ListItems }) {
    const [open, setOpen] = React.useState(false);
    const [buttonItems, setButtonItems] = React.useState(ListItems);
    const navigate = useNavigate();
    const { user } = useAuth();  // Access user data from the auth context
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|Windows Phone/i.test(navigator.userAgent);
        setIsMobile(checkMobile);
        console.log(isMobile);
        console.log(navigator.userAgent);
    }, []);
    useEffect(() => {
        setButtonItems(ListItems);
    }, [ListItems]);

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleNavigation = (path) => {
        navigate(path);
    };

    // Jeśli użytkownik nie jest zalogowany, nie renderuj sidebaru ani pustego div
    if (!user) {
        return null;  // Zwraca null, co sprawia, że komponent jest całkowicie niewidoczny
    }

    return (
        <List
            sx={{ width: '100%', maxWidth: 240 }} // Szerokość sidebaru
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            {buttonItems.map((item) => (
                <ListItemButton key={item.route} onClick={() => handleNavigation(item.route)}>
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    {!isMobile ? <ListItemText primary={item.title} /> : <div></div>}
                </ListItemButton>
            ))}
        </List>
    );
}
