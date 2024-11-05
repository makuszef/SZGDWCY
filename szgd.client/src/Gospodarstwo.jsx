import React, { useState, useEffect } from 'react';
import { Button, Stack, List, ListItem, Typography, IconButton, Modal, TextField, MenuItem, Select, Checkbox, ListItemText } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
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

    // Pobranie listy użytkowników z API przy montowaniu komponentu
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://localhost:7191/api/Users/All');
                console.log("Odpowiedź z API /Users/All:", response.data); // Logujemy odpowiedź dla debugowania
                setUsers(response.data);
            } catch (error) {
                console.error("Błąd podczas pobierania użytkowników:", error);
            }
        };
        fetchUsers();
    }, []);

    // Obsługa otwarcia modala
    const handleOpenModal = () => {
        setModalOpen(true);
    };

    // Obsługa zamknięcia modala
    const handleCloseModal = () => {
        setModalOpen(false);
        setNewGospodarstwoName('');
        setSelectedUsers([]);
    };

    // Obsługa utworzenia gospodarstwa
    const handleCreateGospodarstwo = async () => {
        const newGospodarstwo = {
            idGospodarstwa: 0,
            nazwa: newGospodarstwoName,
            czlonkowie: selectedUsers.map((userId) => {
                const user = users.find((u) => u.id === userId);
                return {
                    id_domownika: user.id,
                    imie: user.userName.split('@')[0], // Placeholder imienia
                    nazwisko: "Test", // Placeholder nazwiska
                    email: user.email,
                    telefon: "000-000-000", // Placeholder telefonu
                    nazwa_uzytkownika: user.userName,
                };
            }),
        };

        try {
            const response = await axios.post('https://localhost:7191/api/Gospodarstwo', newGospodarstwo);
            if (response.status === 201) {
                setGospodarstwa((prevGospodarstwa) => [...prevGospodarstwa, response.data]);
                console.log('Gospodarstwo utworzone:', response.data);
                handleCloseModal();
            }
        } catch (error) {
            console.error('Błąd podczas tworzenia gospodarstwa:', error);
        }
    };

    // Obsługa wyboru członków z dropdown
    const handleUserSelection = (event) => {
        setSelectedUsers(event.target.value);
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
                    <Select
                        multiple
                        value={selectedUsers}
                        onChange={handleUserSelection}
                        renderValue={(selected) => selected.map((id) => users.find((u) => u.id === id)?.userName).join(', ')}
                        fullWidth
                    >
                        {users.length > 0 ? (
                            users.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    <Checkbox checked={selectedUsers.indexOf(user.id) > -1} />
                                    <ListItemText primary={user.userName} />
                                </MenuItem>
                            ))
                        ) : (
                            <MenuItem disabled>Brak dostępnych użytkowników</MenuItem>
                        )}
                    </Select>
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
                    <ListItem key={index}>
                        <Typography
                            onClick={() => dispatch(setGospodarstwo(gospodarstwo.nazwa))}
                            style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                        >
                            {gospodarstwo.nazwa}
                        </Typography>
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
