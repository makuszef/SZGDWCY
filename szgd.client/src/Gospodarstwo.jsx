import React, { useState, useEffect } from 'react';
import {
    Button,
    Stack,
    List,
    ListItem,
    Typography,
    Modal,
    TextField,
    MenuItem,
    Select,
    Checkbox,
    ListItemText,
    InputLabel,
    FormControl,
    ListItemAvatar,
    Avatar
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setGospodarstwo } from './features/resourceSlice.jsx';
import axios from 'axios';

function MyButtons() {
    const [gospodarstwa, setGospodarstwa] = useState([]);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newGospodarstwoName, setNewGospodarstwoName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const dispatch = useDispatch();

    const selectedGospodarstwo = useSelector((state) => state.resource.gospodarstwo);

    // Fetch users from API on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://localhost:7191/api/Domownik');
                console.log("Response from API /Users/All:", response.data);
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    // Fetch gospodarstwa from API on component mount
    useEffect(() => {
        const fetchGospodarstwa = async () => {
            try {
                const response = await axios.get('https://localhost:7191/api/Gospodarstwo');
                console.log("Response from API /Gospodarstwo:", response.data);
                setGospodarstwa(response.data); // Set fetched gospodarstwa data
            } catch (error) {
                console.error("Error fetching gospodarstwa:", error);
            }
        };
        fetchGospodarstwa();
    }, []);

    // Handle opening the modal
    const handleOpenModal = () => {
        setModalOpen(true);
    };

    // Handle closing the modal
    const handleCloseModal = () => {
        setModalOpen(false);
        setNewGospodarstwoName('');
        setSelectedUsers([]);
    };

    // Handle creating gospodarstwo
    const handleCreateGospodarstwo = async () => {
        const selectedUserData = selectedUsers.map((userId) => {
            const user = users.find((u) => u.id_domownika === userId);
            return {
                id_domownika: user.id_domownika,
                imie: user.imie,
                nazwisko: user.nazwisko,
                email: user.email,
                telefon: user.telefon || "000-000-000",
                nazwa_uzytkownika: user.imie,
            };
        });

        const newGospodarstwo = {
            idGospodarstwa: 0,
            nazwa: newGospodarstwoName,
            czlonkowie: selectedUserData,
        };

        try {
            const response = await axios.post('https://localhost:7191/api/Gospodarstwo', newGospodarstwo);
            if (response.status === 201) {
                setGospodarstwa((prevGospodarstwa) => [...prevGospodarstwa, response.data]);
                handleCloseModal();
            }
        } catch (error) {
            console.error('Error creating gospodarstwo:', error);
        }
    };

    // Handle user selection from dropdown
    const handleUserSelection = (userId) => {
        setSelectedUsers((prevSelected) => {
            if (prevSelected.includes(userId)) {
                return prevSelected.filter((id) => id !== userId);
            } else {
                return [...prevSelected, userId];
            }
        });
    };

    return (
        <div>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={handleOpenModal}>
                    Utwórz gospodarstwo
                </Button>
            </Stack>

            <Modal open={isModalOpen} onClose={handleCloseModal}>
                <div style={{ backgroundColor: 'white', padding: 20, margin: '100px auto', width: 400, outline: 'none' }}>
                    <Typography variant="h6">Utwórz nowe gospodarstwo</Typography>
                    <TextField
                        label="Nazwa gospodarstwa"
                        value={newGospodarstwoName}
                        onChange={(e) => setNewGospodarstwoName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Typography variant="body1">Wybierz członków:</Typography>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Nazwa domownika</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            multiple
                            value={selectedUsers}
                            onChange={(e) => setSelectedUsers(e.target.value)}
                            renderValue={(selected) => selected.map((id) => users.find((u) => u.id_domownika === id)?.userName).join(', ')}
                        >
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <MenuItem key={user.id_domownika} value={user.id_domownika}>
                                        <Checkbox checked={selectedUsers.includes(user.id_domownika)} />
                                        <ListItemText primary={user.imie} />
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>Brak dostępnych użytkowników</MenuItem>
                            )}
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" onClick={handleCreateGospodarstwo} style={{ marginTop: 20 }}>
                        Dodaj
                    </Button>
                </div>
            </Modal>

            <Typography variant="h6" style={{ marginTop: 20 }}>
                Lista Gospodarstw:
            </Typography>
            <List>
                {gospodarstwa.map((gospodarstwo, index) => (
                    <ListItem key={index} alignItems="flex-start">
                        <div>
                            <Typography
                                onClick={() => dispatch(setGospodarstwo(gospodarstwo.nazwa))}
                                style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                            >
                                {gospodarstwo.nazwa}
                            </Typography>
                            <Typography variant="body2" style={{ marginLeft: 20 }}>
                                Członkowie:
                                <List>
                                    {gospodarstwo.czlonkowie.map((member) => (
                                        <ListItem key={member.id_domownika} alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar alt={member.imie} src={`/path-to-avatars/${member.id_domownika}.jpg`} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${member.imie} ${member.nazwisko}`}
                                                secondary={
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            sx={{ color: 'text.primary', display: 'inline' }}
                                                        >
                                                            Email: {member.email}
                                                        </Typography>
                                                        {" — Telefon: " + member.telefon}
                                                    </React.Fragment>
                                                }
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </Typography>
                        </div>
                    </ListItem>
                ))}
            </List>

            {selectedGospodarstwo && (
                <Typography variant="h2" style={{ marginTop: 20 }}>
                    Wybrane gospodarstwo: {selectedGospodarstwo}
                </Typography>
            )}
        </div>
    );
}

export default MyButtons;
