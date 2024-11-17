import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Person from '@mui/icons-material/Person';
import { Select, MenuItem as MuiMenuItem, InputLabel, FormControl } from '@mui/material';
import { Typography } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import axios from 'axios';
import {setDomownikWGospodarstwie, setGospodarstwo} from "@/features/resourceSlice.jsx";
const pages = [];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];
import { useSelector, useDispatch } from 'react-redux';
import {useEffect} from "react";
const Navbar = () => {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [gospodarstwa, setGospodarstwa] = React.useState([]);
    const [selectedGospodarstwo, setSelectedGospodarstwo] = React.useState("");
    const [avatar, setAvatar] = React.useState(null);
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [refresh, setRefresh] = React.useState(false);
    const dispatch = useDispatch()
    
    // Fetching gospodarstwa for user
    React.useEffect(() => {
        if (user && user.userdata.id) {
            const fetchGospodarstwa = async () => {
                try {
                    const response = await axios.get(`https://localhost:7191/api/Domownik/GetAllGospodarstwa/${user.userdata.id}`);
                    setGospodarstwa(response.data);
                } catch (error) {
                    console.error("Error fetching gospodarstwa:", error);
                }
            };
            fetchGospodarstwa();
        }
    }, [user, refresh]);

    // Fetch selected gospodarstwo from sessionStorage on load
    React.useEffect(() => {
        const storedGospodarstwoId = sessionStorage.getItem('selectedGospodarstwoId');
        if (storedGospodarstwoId) {
            setSelectedGospodarstwo(storedGospodarstwoId); // Set the stored selected gospodarstwo ID
        }
    }, []);

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    // Handle the change of selected gospodarstwo
    const handleGospodarstwoChange = (event) => {
        const selectedGospodarstwoId = event.target.value;

        // Find the selected gospodarstwo from the list
        const selectedGospodarstwo = gospodarstwa.find(g => g.id === selectedGospodarstwoId);
        // Save both the ID and name of the selected gospodarstwo in sessionStorage
        const DomownickwGospodarstwie = selectedGospodarstwo.domownikWGospodarstwie.filter(domownik => domownik.domownikId === user.userdata.id)[0];
        
        if (selectedGospodarstwo) {
            dispatch(setDomownikWGospodarstwie(DomownickwGospodarstwie));
            sessionStorage.setItem('DomownickwGospodarstwie', JSON.stringify(DomownickwGospodarstwie));
            sessionStorage.setItem('selectedGospodarstwoId', selectedGospodarstwo.id);
            sessionStorage.setItem('selectedGospodarstwoName', selectedGospodarstwo.nazwa);
            sessionStorage.setItem('wybraneGospodarstwo', JSON.stringify(selectedGospodarstwo));
            dispatch(setGospodarstwo(selectedGospodarstwo));
            useSelector(state => {console.log(state)});
        }

        // Set the state with the selected gospodarstwo ID
        setSelectedGospodarstwo(selectedGospodarstwoId);

        // Optionally reload the page to reflect changes
        window.location.reload();
        console.log('Selected gospodarstwo:', selectedGospodarstwoId);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAvatarChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileClick = () => {
        navigate('/profile');
    };

    return (
        <AppBar>
            <Container sx={{ width: '100%' }}>
                <Toolbar disableGutters>
                    <Button
                        startIcon={<LoginIcon />}
                        onClick={() => navigate('/login')}
                        sx={{
                            color: 'inherit',
                            mr: 2,
                            '&:hover': { backgroundColor: 'transparent' },
                            display: 'flex',
                            alignItems: 'center',
                            height: 40,
                        }}
                    >
                        <Typography variant="h6">Login</Typography>
                    </Button>

                    <Button
                        startIcon={<HomeIcon />}
                        onClick={() => navigate('/')}  //kafelki '/'
                        sx={{
                            color: 'inherit',
                            '&:hover': { backgroundColor: 'transparent' },
                            display: 'flex',
                            alignItems: 'center',
                            height: 40,
                            mr: 2,
                        }}
                    >
                        <Typography variant="h6">Home</Typography>
                    </Button>

                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0 }}>
                        <GroupIcon sx={{ marginRight: 1, fontSize: 20 }} />
                        <FormControl sx={{ minWidth: 200 }}>
                            <InputLabel
                                id="gospodarstwo-label"
                                sx={{ color: 'white', textAlign: 'center' }}
                            >
                                Gospodarstwo
                            </InputLabel>
                            <Select
                                labelId="gospodarstwo-label"
                                id="gospodarstwo-select"
                                value={selectedGospodarstwo || ""}
                                label="Gospodarstwo"
                                onChange={handleGospodarstwoChange}
                                sx={{
                                    height: 40,
                                    '.MuiSelect-select': {
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: 40,
                                        color: 'white',
                                    },
                                    '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                    '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: 'white' },
                                }}
                            >
                                {gospodarstwa.length === 0 ? (
                                    <MuiMenuItem value="">
                                        <em>Brak gospodarstw do wybrania</em>
                                    </MuiMenuItem>
                                ) : (
                                    gospodarstwa.map((gospodarstwo) => (
                                        <MuiMenuItem key={gospodarstwo.id} value={gospodarstwo.id}>
                                            {gospodarstwo.nazwa}
                                        </MuiMenuItem>
                                    ))
                                )}
                            </Select>
                        </FormControl>
                    </Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}></Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {user ? (
                            <>
                                <Person sx={{ fontSize: 30, marginRight: '1rem' }} />
                                <Typography variant="h6" sx={{ marginRight: '1rem' }}>
                                    Witaj, <strong>{user.userdata.imie}</strong>!
                                </Typography>
                            </>
                        ) : null}

                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="User Avatar" src={avatar || "/static/images/avatar/2.jpg"} />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map((setting) => (
                                    <MenuItem
                                        key={setting}
                                        onClick={() => {
                                            handleCloseUserMenu();
                                            if (setting === 'Logout') {
                                                handleLogout();
                                            } else if (setting === 'Profile') {
                                                handleProfileClick();
                                            } else {
                                                navigate('/profile');
                                            }
                                        }}
                                    >
                                        <Typography sx={{ textAlign: 'center' }}>{setting}</Typography>
                                    </MenuItem>
                                ))}
                                {/* Option for changing avatar */}
                                <MenuItem onClick={() => document.getElementById('avatar-upload').click()}>
                                    <Typography sx={{ textAlign: 'center' }}>Change Avatar</Typography>
                                </MenuItem>
                            </Menu>
                        </Box>
                    </Box>

                    {/* Hidden file input for avatar upload */}
                    <input
                        type="file"
                        id="avatar-upload"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={handleAvatarChange}
                    />
                </Toolbar>
            </Container>
        </AppBar>
    );
}

export default Navbar;
