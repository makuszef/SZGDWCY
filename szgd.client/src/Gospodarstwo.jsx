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
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper} from '@mui/material';
function MyButtons() {
    const { user } = useAuth();
    const [gospodarstwa, setGospodarstwa] = useState([]);
    const [users, setUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newGospodarstwoName, setNewGospodarstwoName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedGospodarstwoId, setSelectedGospodarstwoId] = useState('');
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
        setSelectedGospodarstwoId('');
        setAssignedUsers([]);
        setSuccessMessage('');
    };

    const handleCreateGospodarstwo = async (e) => {
        e.preventDefault();
        try {
            const gospodarstwoData = { id: 0, nazwa: newGospodarstwoName };
            const gospodarstwoResponse = await axios.post('https://localhost:7191/api/Gospodarstwo', gospodarstwoData);
            const gospodarstwoId = gospodarstwoResponse.data.id;

            const addDomownikPromises = selectedUsers.map((userId) => {
                const domownikData = { domownikId: userId, gospodarstwoId };
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

    const handleAddDomownikToGospodarstwo = async (e) => {
        e.preventDefault();
        try {
            const addDomownikPromises = selectedUsers.map((userId) => {
                const domownikData = { domownikId: userId, gospodarstwoId: selectedGospodarstwoId };
                return axios.post('https://localhost:7191/api/DomownikwGospodarstwie/DodajDomownikaDoGospodarstwa', domownikData);
            });

            await Promise.all(addDomownikPromises);
            setSuccessMessage('Domownicy zostali dodani do gospodarstwa');
            setRefresh((prev) => !prev);
        } catch (error) {
            console.error('Error during process:', error.response ? error.response.data : error.message);
            setSuccessMessage('Coś poszło nie tak. Spróbuj ponownie!');
        }
    };

    const handleSelectGospodarstwo = async (gospodarstwoId) => {
        setSelectedGospodarstwoId(gospodarstwoId);
        try {
            const response = await axios.get(`https://localhost:7191/api/Domownik/GetDomownicyGospodarstwa/${gospodarstwoId}`);
            setAssignedUsers(response.data); // List of users already assigned to this gospodarstwo
        } catch (error) {
            console.error("Error fetching assigned users:", error);
        }
    };

    // Filtering out users already assigned to the selected gospodarstwo
    const unassignedUsers = users.filter((user) => !assignedUsers.some((assigned) => assigned.id === user.id));

    return (
        <div>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={handleOpenModal}>
                    Utwórz gospodarstwo
                </Button>
                <Button variant="contained" color="secondary" onClick={handleOpenModal}>
                    Dodaj domownika do gospodarstwa
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

                    <Typography variant="h6" gutterBottom>Dodaj domownika do gospodarstwa</Typography>

                    {successMessage && (
                        <Typography variant="body2" color="success.main" gutterBottom>
                            {successMessage}
                        </Typography>
                    )}

                    {/* Wybór istniejącego gospodarstwa */}
                    <Typography variant="body1">Wybierz gospodarstwo:</Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="select-gospodarstwo-label">Nazwa gospodarstwa</InputLabel>
                        <Select
                            labelId="select-gospodarstwo-label"
                            value={selectedGospodarstwoId}
                            onChange={(e) => handleSelectGospodarstwo(e.target.value)}
                        >
                            {gospodarstwa.map((gospodarstwo) => (
                                <MenuItem key={gospodarstwo.id} value={gospodarstwo.id}>
                                    {gospodarstwo.nazwa}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Wybór członków */}
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
                            {unassignedUsers.length > 0 ? (
                                unassignedUsers.map((user) => (
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
                        onClick={handleAddDomownikToGospodarstwo}
                        style={{ marginTop: 20 }}
                    >
                        Dodaj
                    </Button>
                </Box>
            </Modal>

            {/*<Typography variant="h6" style={{ marginTop: 20 }}>*/}
            {/*    Lista Gospodarstw:*/}
            {/*</Typography>*/}
            {/*<List>*/}
            {/*    {gospodarstwa.map((gospodarstwo, index) => (*/}
            {/*        <ListItem key={index} alignItems="flex-start">*/}
            {/*            <div>*/}
            {/*                <Typography*/}
            {/*                    onClick={() => dispatch(setGospodarstwo(gospodarstwo.nazwa))}*/}
            {/*                    style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}*/}
            {/*                >*/}
            {/*                    {gospodarstwo.nazwa}*/}
            {/*                </Typography>*/}
            {/*                <Typography variant="body2" style={{ marginLeft: 20 }}>*/}
            {/*                    Członkowie:*/}
            {/*                    <List>*/}
            {/*                        {gospodarstwo.domownikWGospodarstwie.map((member) => (*/}
            {/*                            <ListItem key={member.domownik.id} alignItems="flex-start">*/}
            {/*                                <ListItemAvatar>*/}
            {/*                                    <Avatar alt={member.domownik.imie} src={`/path-to-avatars/${member.domownik.id}.jpg`} />*/}
            {/*                                </ListItemAvatar>*/}
            {/*                                <ListItemText*/}
            {/*                                    primary={`${member.domownik.imie} ${member.domownik.nazwisko}`}*/}
            {/*                                />*/}
            {/*                            </ListItem>*/}
            {/*                        ))}*/}
            {/*                    </List>*/}
            {/*                </Typography>*/}
            {/*            </div>*/}
            {/*        </ListItem>*/}
            {/*    ))}*/}
            {/*</List>*/}

            <Typography variant="h6" style={{ marginTop: 20 }}>
                Lista Gospodarstw:
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell><strong>Gospodarstwo</strong></TableCell>
                            <TableCell><strong>Członkowie</strong></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {gospodarstwa.map((gospodarstwo, index) => (
                            <TableRow key={index}>
                                <TableCell
                                    component="th"
                                    scope="row"
                                    onClick={() => dispatch(setGospodarstwo(gospodarstwo.nazwa))}
                                    style={{ cursor: 'pointer', color: 'inherit' }}
                                >
                                    {gospodarstwo.nazwa}
                                </TableCell>
                                <TableCell>
                                    <List>
                                        {gospodarstwo.domownikWGospodarstwie.map((member) => (
                                            <TableRow key={member.domownik.id}>
                                                <TableCell>
                                                    <Avatar alt={member.domownik.imie} src={`/path-to-avatars/${member.domownik.id}.jpg`} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2">
                                                        {member.domownik.imie} {member.domownik.nazwisko}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {member.domownik.email}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary">
                                                        {member.domownik.numerTelefonu}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </List>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            
            {selectedGospodarstwo && (
                <Typography variant="h2" style={{ marginTop: 20 }}>
                    Wybrane gospodarstwo: {selectedGospodarstwo}
                </Typography>
            )}
        </div>
    );
}

export default MyButtons;
