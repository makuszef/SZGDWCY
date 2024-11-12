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
import axios from 'axios'; // Upewnij się, że masz zainstalowany axios

const pages = [];
const settings = ['Profile', 'Account', 'Dashboard', 'Logout'];

function Navbar() {
    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);
    const [gospodarstwa, setGospodarstwa] = React.useState([]);
    const [selectedGospodarstwo, setSelectedGospodarstwo] = React.useState("");
    const [avatar, setAvatar] = React.useState(null); // State to handle avatar change
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [refresh, setRefresh] = React.useState(false); // To trigger refetching

    React.useEffect(() => {
        if (user && user.id) {
            console.log('Fetching gospodarstwa for user ID:', user.id);

            fetch(`/api/Domownik/GetAllGospodarstwa/${user.id}`)
                .then((response) => {
                    console.log('Response from API:', response);
                    if (!response.ok) {
                        throw new Error(`API responded with ${response.status} - ${response.statusText}`);
                    }
                    return response.text();
                })
                .then((text) => {
                    try {
                        const data = JSON.parse(text);
                        setGospodarstwa(data);
                    } catch (error) {
                        console.error('Failed to parse JSON response:', error, text);
                    }
                })
                .catch((error) => {
                    console.error('Error fetching gospodarstwa:', error);
                });
        } else {
            console.log('User or user.id is not available');
        }
    }, [user]);

    React.useEffect(() => {
        if (user && user.userdata.id) {
            const fetchGospodarstwa = async () => {
                try {
                    const response = await axios.get(`https://localhost:7191/api/Domownik/GetAllGospodarstwa/${user.userdata.id}`);
                    console.log("Response from API /Domownik/GetAllGospodarstwa:", response.data);
                    setGospodarstwa(response.data); // Set fetched gospodarstwa data
                } catch (error) {
                    console.error("Error fetching gospodarstwa:", error);
                }
            };
            fetchGospodarstwa();
        }
    }, [user, refresh]); // Fetch when the user changes or component mounts

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

    const handleGospodarstwoChange = (event) => {
        setSelectedGospodarstwo(event.target.value);
        console.log('Selected gospodarstwo:', event.target.value);
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
                setAvatar(reader.result); // Save base64 image data
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProfileClick = () => {
        // Redirect to profile page
        navigate('/profile');
    }

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
                        onClick={() => navigate('/')}
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

                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={handleCloseNavMenu}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

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
                                                handleLogout(); // Log out
                                            } else if (setting === 'Profile') {
                                                handleProfileClick(); // Profile click
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
