import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

export default function Sidebar({ ListItems }) {
    const [open, setOpen] = React.useState(false);
    const [buttonItems, setButtonItems] = React.useState(ListItems);
    const navigate = useNavigate();  // Create navigate function

    useEffect(() => {
        setButtonItems(ListItems);
    }, [ListItems]); // Tablica zale¿noœci

    const handleToggle = () => {
        setOpen(!open);
    };

    const handleNavigation = (path) => {
        navigate(path);  // Use navigate to change the route
    };

    return (
        <List
            sx={{ width: '100%', maxWidth: 360 }}
            component="nav"
            aria-labelledby="nested-list-subheader"
        >
            {buttonItems.map((item) => (
                <ListItemButton key={item.route} onClick={() => handleNavigation(item.route)}>
                    <ListItemIcon>
                        {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.title} />
                </ListItemButton>
            ))}
        </List>
    );
}
