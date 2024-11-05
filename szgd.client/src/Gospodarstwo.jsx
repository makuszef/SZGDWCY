import React, { useState } from 'react';
import { Button, Stack, List, ListItem, Typography, IconButton, TextField, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setGospodarstwo } from './features/resourceSlice.jsx';

// Lista użytkowników na sztywno
const users = [
    {
        id: "61d0c250-5678-456f-91f1-d0a0f2f4f4ca",
        userName: "Dsahu2.mak@gmail.com",
    },
    {
        id: "c0a39e3a-be76-49b4-a047-1c96e34b18b2",
        userName: "Dsahu3.mak@gmail.com",
    },
    {
        id: "3180b27d-defa-4f12-992f-a1e987fac9e0",
        userName: "Dsahu5.mak@gmail.com",
    }
];

function MyButtons() {
    const [gospodarstwa, setGospodarstwa] = useState([]);
    const [openModal, setOpenModal] = useState(false); // Kontroluje otwarcie modalnego okna
    const [newGospodarstwo, setNewGospodarstwo] = useState(''); // Nazwa gospodarstwa
    const [selectedUsers, setSelectedUsers] = useState([]); // Wybrani członkowie (wielokrotny wybór)

    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Pobierz wybrane gospodarstwo z reduxowego stanu
    const selectedGospodarstwo = useSelector((state) => state.resource.gospodarstwo);

    const handleOpenModal = () => setOpenModal(true); // Otwiera modalne okno
    const handleCloseModal = () => {
        setOpenModal(false); // Zamyka modalne okno
        setNewGospodarstwo(''); // Resetuje nazwę gospodarstwa
        setSelectedUsers([]); // Resetuje listę wybranych użytkowników
    };

    const handleCreateGospodarstwo = () => {
        // Sprawdź, czy nazwa gospodarstwa i członkowie zostali wybrani
        if (newGospodarstwo && selectedUsers.length > 0) {
            // Dodaj gospodarstwo do lokalnego stanu
            setGospodarstwa((prevGospodarstwa) => [
                ...prevGospodarstwa,
                { name: newGospodarstwo, members: selectedUsers }
            ]);

            console.log('Gospodarstwo utworzone:', newGospodarstwo, 'z członkami:', selectedUsers);

            // Zamyka modalne okno po utworzeniu gospodarstwa
            handleCloseModal();
        } else {
            console.log('Proszę podać nazwę gospodarstwa i wybrać członków.');
        }
    };

    const handleDeleteClick = (indexToDelete) => {
        setGospodarstwa((prevGospodarstwa) =>
            prevGospodarstwa.filter((_, index) => index !== indexToDelete)
        );
    };

    const handleGospodarstwoClick = (gospodarstwo) => {
        dispatch(setGospodarstwo(gospodarstwo.name)); // Zapisz gospodarstwo do slice
    };

    return (
        <div>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={handleOpenModal}>
                    Utwórz Gospodarstwo
                </Button>
                <Button variant="outlined" color="secondary">
                    Dołącz
                </Button>
            </Stack>

            <Typography variant="h6" style={{ marginTop: 20 }}>
                Lista Gospodarstw:
            </Typography>

            <List>
                {gospodarstwa.map((gospodarstwo, index) => (
                    <ListItem
                        key={index}
                        secondaryAction={
                            <IconButton edge="end" onClick={() => handleDeleteClick(index)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <Typography
                            onClick={() => handleGospodarstwoClick(gospodarstwo)}
                            style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                        >
                            {gospodarstwo.name} - {gospodarstwo.members.join(', ')}
                        </Typography>
                    </ListItem>
                ))}
            </List>

            {/* Wyświetl wybrane gospodarstwo, jeśli istnieje */}
            {selectedGospodarstwo && (
                <Typography variant="h2" style={{ marginTop: 20 }}>
                    Wybrane gospodarstwo: {selectedGospodarstwo}
                </Typography>
            )}

            {/* Modalne okno do tworzenia gospodarstwa */}
            <Dialog open={openModal} onClose={handleCloseModal}>
                <DialogTitle>Utwórz Gospodarstwo</DialogTitle>
                <DialogContent>
                    {/* Pole tekstowe dla nazwy gospodarstwa */}
                    <TextField
                        label="Nazwa Gospodarstwa"
                        value={newGospodarstwo}
                        onChange={(e) => setNewGospodarstwo(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />

                    {/* Lista rozwijana z wielokrotnym wyborem do wyboru członków */}
                    <Select
                        label="Wybierz członków"
                        multiple
                        value={selectedUsers}
                        onChange={(e) => setSelectedUsers(e.target.value)}
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    >
                        {users.map((user) => (
                            <MenuItem key={user.id} value={user.userName}>
                                {user.userName}
                            </MenuItem>
                        ))}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseModal} color="secondary">
                        Anuluj
                    </Button>
                    <Button onClick={handleCreateGospodarstwo} color="primary">
                        Utwórz
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default MyButtons;
