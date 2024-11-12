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
    Avatar,
    IconButton,
    Box
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { setGospodarstwo } from './features/resourceSlice.jsx';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from './AuthContext';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';

function MyButtons() {
    const { user } = useAuth();
    const [gospodarstwa, setGospodarstwa] = useState([]);
    const [users, setUsers] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newGospodarstwoName, setNewGospodarstwoName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [refresh, setRefresh] = useState(false);
    const dispatch = useDispatch();
    const selectedGospodarstwo = useSelector((state) => state.resource.gospodarstwo);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://localhost:7191/api/Domownik');
                setUsers(response.data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);

    useEffect(() => {
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
    }, [refresh]);

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setNewGospodarstwoName('');
        setSelectedUsers([]);
        setSuccessMessage('');
    };

    const handleCreateGospodarstwo = async (e) => {
        e.preventDefault();
        try {
            const gospodarstwoData = { id: 0, nazwa: newGospodarstwoName };
            const gospodarstwoResponse = await axios.post('https://localhost:7191/api/Gospodarstwo', gospodarstwoData);
            const gospodarstwoId = gospodarstwoResponse.data.id;
            console.log(gospodarstwoId);
            
            const addDomownikPromises = selectedUsers.map((userId) => {
                const domownikData = { domownikId: userId, gospodarstwoId};
                return axios.post('https://localhost:7191/api/DomownikwGospodarstwie/DodajDomownikaDoGospodarstwa', domownikData);
            });

            await Promise.all(addDomownikPromises);
            setSuccessMessage(`Utworzono gospodarstwo: ${newGospodarstwoName}`);
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error('Error during process:', error.response ? error.response.data : error.message);
            setSuccessMessage('Coś poszło nie tak. Spróbuj ponownie!');
        }
    };

    return (
        <div>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={handleOpenModal}>
                    Utwórz gospodarstwo
                </Button>
            </Stack>

            <Modal
                open={isModalOpen}
                onClose={(_, reason) => {
                    if (reason !== "backdropClick") handleCloseModal();
                }}
                BackdropProps={{ style: { pointerEvents: 'none' } }}
            >
                <Box
                    sx={{
                        position: 'relative',
                        backgroundColor: 'white',
                        padding: 2,
                        margin: '100px auto',
                        width: 400,
                        outline: 'none',
                        borderRadius: 1,
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h6" gutterBottom>Utwórz nowe gospodarstwo</Typography>

                    {successMessage && (
                        <Typography variant="body2" color="success.main" gutterBottom>
                            {successMessage}
                        </Typography>
                    )}

                    <TextField
                        label="Nazwa gospodarstwa"
                        value={newGospodarstwoName}
                        onChange={(e) => setNewGospodarstwoName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />

                    <Typography variant="body1">Wybierz członków:</Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="select-users-label">Nazwa domownika</InputLabel>
                        <Select
                            labelId="select-users-label"
                            multiple
                            value={selectedUsers}
                            onChange={(e) => setSelectedUsers(e.target.value)}
                            renderValue={(selected) => selected.map((id) => users.find((u) => u.id === id)?.userName).join(', ')}
                        >
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <MenuItem key={user.id} value={user.id}>
                                        <Checkbox checked={selectedUsers.includes(user.id)} />
                                        <ListItemText primary={user.imie} />
                                    </MenuItem>
                                ))
                            ) : (
                                <MenuItem disabled>Brak dostępnych użytkowników</MenuItem>
                            )}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        color="primary"
                        onClick={handleCreateGospodarstwo}
                        style={{ marginTop: 20 }}
                    >
                        Dodaj
                    </Button>
                </Box>
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
                                    {gospodarstwo.domownikWGospodarstwie.map((member) => (
                                        <ListItem key={member.domownik.id} alignItems="flex-start">
                                            <ListItemAvatar>
                                                <Avatar alt={member.domownik.imie} src={`/path-to-avatars/${member.domownik.id}.jpg`} />
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={`${member.domownik.imie} ${member.domownik.nazwisko}`}
                                                secondary={
                                                    <>
                                                        <Typography component="span" variant="body2" sx={{ color: 'white', display: 'inline' }}>
                                                            Email: {member.domownik.email}
                                                        </Typography>
                                                        <Typography sx={{ color: 'white' }}>
                                                            {"Telefon: " + member.domownik.telefon}
                                                        </Typography>
                                                    </>
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
