import React, {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { useAuth } from './AuthContext';
/**
 * Sidebar component to render a sidebar navigation with dynamic list items.
 * Uses Material UI List and ListItem components for navigation.
 *
 * @component
 * @param {Array} ListItems - An array of objects representing the navigation items. Each item should contain `route`, `title`, and `icon`.
 * @returns {JSX.Element} The rendered Sidebar component.
 */

/**
 * Effect hook to check if the current device is a mobile device.
 * Sets `isMobile` state to true if the user is on a mobile device.
 *
 * @function useEffect
 */

/**
 * Effect hook to update the sidebar items when the ListItems prop changes.
 * This ensures that the `buttonItems` state is always updated based on the new ListItems prop.
 *
 * @function useEffect
 */

/**
 * Toggle the state of the sidebar (open or closed).
 * This function is triggered when the sidebar's toggle button is clicked.
 *
 * @function handleToggle
 */

/**
 * Handle the navigation action by changing the route to the provided path.
 * This function uses the `useNavigate` hook from `react-router-dom` to navigate to the given path.
 *
 * @param {string} path - The path to navigate to.
 * @function handleNavigation
 */

/**
 * If the user is not logged in, do not render the sidebar.
 * Returns `null` when the user is not authenticated, making the sidebar invisible.
 *
 * @returns {JSX.Element|null} Returns null if the user is not authenticated.
 */

/**
 * Renders the list of navigation items in the sidebar.
 * Each item is rendered as a button that navigates to the specified route when clicked.
 * The sidebar only renders item text on non-mobile devices.
 *
 * @component List
 * @returns {JSX.Element} A list of navigation items as Material UI `ListItemButton` components.
 */
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

    // Ukrywanie SideBar, gdy użytkownik jest w MainMenu
    if (location.pathname === '/') { // Ścieżka odpowiadająca MainMenu
        return null;
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
