import React, { useState, useEffect } from 'react';
import {
    Button,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Modal,
    TextField,
    MenuItem,
    Select,
    Checkbox,
    ListItemText,
    InputLabel,
    FormControl,
    IconButton,
    Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import CloseIcon from '@mui/icons-material/Close';
import { useAuth } from './AuthContext';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import Tooltip from "@mui/material/Tooltip";
import EmailIcon from "@mui/icons-material/Email";
import HomeIcon from '@mui/icons-material/Home';
import ContactsIcon from '@mui/icons-material/Contacts';

/**
 * Renders the main buttons for managing "Gospodarstwa" (households).
 * Provides modals for creating households and adding members.
 *
 * @returns {JSX.Element} React component for household management.
 */

/**
 * Fetches and sets the list of users.
 * Triggered on component mount.
 *
 * @function fetchUsers
 */

/**
 * Fetches and sets the list of "Gospodarstwa" (households) associated with the logged-in user.
 * Triggered when user data changes.
 *
 * @function fetchGospodarstwa
 */

/**
 * Creates a new "Gospodarstwo" (household) and assigns selected users to it.
 * Handles both the creation of the household and adding members.
 *
 * @param {Event} e - Form submission event.
 * @function handleCreateGospodarstwo
 */

/**
 * Selects a specific "Gospodarstwo" (household) by its ID.
 * Updates the state for the selected household.
 *
 * @param {string} gospodarstwoId - ID of the selected household.
 * @function handleSelectGospodarstwo
 */

/**
 * Adds selected users to the currently selected "Gospodarstwo" (household).
 * Handles API calls for assigning users to the household.
 *
 * @function handleAddDomownikToGospodarstwo
 */

/**
 * Opens the modal for creating a new "Gospodarstwo".
 * Updates the state to display the modal.
 *
 * @function handleOpenCreateGospodarstwoModal
 */

/**
 * Closes the modal for creating a new "Gospodarstwo".
 * Resets the modal state.
 *
 * @function handleCloseCreateGospodarstwoModal
 */

/**
 * Opens the modal for adding users to a "Gospodarstwo".
 * Updates the state to display the modal.
 *
 * @function handleOpenAddUsersModal
 */

/**
 * Closes the modal for adding users to a "Gospodarstwo".
 * Resets the modal state.
 *
 * @function handleCloseAddUsersModal
 */

/**
 * Filters the "Gospodarstwa" (households) to display only those where the user is an owner.
 *
 * @constant {Array} filteredGospodarstwa - Filtered list of households.
 */

/**
 * Renders the list of "Gospodarstwa" (households) the user belongs to.
 * Includes options to manage each household.
 *
 * @component HouseholdList
 */

/**
 * Renders the details of a selected "Gospodarstwo".
 * Displays the list of members in the household.
 *
 * @component GospodarstwoDetails
 */

function MyButtons() {
    const { user } = useAuth();
    const [gospodarstwa, setGospodarstwa] = useState([]);
    const [users, setUsers] = useState([]);
    const [assignedUsers, setAssignedUsers] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [newGospodarstwoName, setNewGospodarstwoName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedGospodarstwoId, setSelectedGospodarstwoId] = useState('');
    const [successMessage1, setSuccessMessage1] = useState('');
    const [successMessage2, setSuccessMessage2] = useState('');
    const [gospodarstwoDetails, setGospodarstwoDetails] = useState(null); // Nowy stan dla szczegółów gospodarstwa
    const [selectedGospodarstwo, setSelectedGospodarstwo] = useState(null); // Stan lokalny do przechowywania wybranego gospodarstwa
    const navigate = useNavigate();
    const dispatch = useDispatch();
    axios.defaults.headers.common['Authorization'] = `Bearer ${user?.tokens.accessToken}`;
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

    const fetchGospodarstwa = async () => {
        try {
            const response = await axios.get(`https://localhost:7191/api/Domownik/GetAllGospodarstwa/${user.userdata.id}`);
            setGospodarstwa(response.data);
        } catch (error) {
            console.error("Error fetching gospodarstwa:", error);
        }
    };
    
    useEffect(() => {
        if (user && user.userdata.id) {
            fetchGospodarstwa();
        }
    }, [user]);

    const handleCreateGospodarstwo = async (e) => {
        e.preventDefault();
        try {
            const gospodarstwoData = { id: 0, nazwa: newGospodarstwoName };
            const gospodarstwoResponse = await axios.post('https://localhost:7191/api/Gospodarstwo', gospodarstwoData);
            const gospodarstwoId = gospodarstwoResponse.data.id;

            const addDomownikPromises = selectedUsers.map((userId) => {
                const domownikData = { domownikId: userId, gospodarstwoId, CzyWlasciciel:false };
                if(domownikData.domownikId == user.userdata.id) {domownikData.CzyWlasciciel=true}
                console.log(domownikData);
                return axios.post('https://localhost:7191/api/DomownikwGospodarstwie/DodajDomownikaDoGospodarstwa', domownikData);
            });

            await Promise.all(addDomownikPromises);
            setSuccessMessage1(`Utworzono gospodarstwo: ${newGospodarstwoName}`);
            setNewGospodarstwoName('');
            setSelectedUsers([]);

            // Odśwież listę gospodarstw
            if (user && user.userdata.id) {
                await fetchGospodarstwa(); // Wywołanie funkcji pobierającej gospodarstwa
            }

            // Zamknięcie modala po sukcesie
            handleCloseCreateGospodarstwoModal();
            
        } catch (error) {
            console.error('Error during process:', error.response ? error.response.data : error.message);
            setSuccessMessage1('Coś poszło nie tak. Spróbuj ponownie!');
        }
    };

    const handleSelectGospodarstwo = async (gospodarstwoId) => {
        setSelectedGospodarstwoId(gospodarstwoId); // Zapamiętaj wybrane gospodarstwo
        setSelectedGospodarstwo(gospodarstwa.find(g => g.id === gospodarstwoId)); // Ustaw wybrane gospodarstwo

        // try {
        //     // const response = await axios.get(`https://localhost:7191/api/Domownik/GetDomownicyGospodarstwa/${gospodarstwoId}`);
        //     const response = await axios.get(`https://localhost:7191/api/Domownik/GetAllGospodarstwa/${gospodarstwoId}`);
        //     setGospodarstwoDetails(response.data); // Zapisz szczegóły gospodarstwa w stanie
        // } catch (error) {
        //     console.error("Error fetching assigned users:", error);
        // }
    };

    const unassignedUsers = users.filter((user) => !assignedUsers.some((assigned) => assigned.id === user.id));

    const handleAddDomownikToGospodarstwo = async () => {
        try {
            const addDomownikPromises = selectedUsers.map((userId) => {
                const domownikData = { domownikId: userId, gospodarstwoId: selectedGospodarstwoId, CzyWlasciciel: false };
                return axios.post('https://localhost:7191/api/DomownikwGospodarstwie/DodajDomownikaDoGospodarstwa', domownikData);
            });

            await Promise.all(addDomownikPromises);
            setSuccessMessage2('Pomyślnie dodano domowników do gospodarstwa.');

            // Odśwież listę gospodarstw
            await fetchGospodarstwa();

            // Zamknij modal po sukcesie
            handleCloseAddUsersModal();
            
        } catch (error) {
            console.error('Błąd podczas dodawania domowników:', error.response ? error.response.data : error.message);
            setSuccessMessage2('Coś poszło nie tak przy dodawaniu domowników. Spróbuj ponownie!');
        }
    };

    const [isCreateGospodarstwoModalOpen, setCreateGospodarstwoModalOpen] = useState(false);
    const [isAddUsersModalOpen, setAddUsersModalOpen] = useState(false);

    const handleOpenCreateGospodarstwoModal = () => {
        setCreateGospodarstwoModalOpen(true);
        setSelectedUsers([user.userdata.id]); // Dodaj aktualnie zalogowanego użytkownika
    };

    const handleCloseCreateGospodarstwoModal = () => {
        setCreateGospodarstwoModalOpen(false);
        setNewGospodarstwoName('');
        setSelectedUsers([]);
        setSuccessMessage1('');
    };

    const handleOpenAddUsersModal = () => {
        setAddUsersModalOpen(true);
    };

    const handleCloseAddUsersModal = () => {
        setAddUsersModalOpen(false);
        setSelectedGospodarstwoId('');
        setSelectedUsers([]);
        setSuccessMessage2('');
    };

    const filteredGospodarstwa = gospodarstwa.filter(gospodarstwo =>
        gospodarstwo.domownikWGospodarstwie.some(domownik =>
            domownik.czyWlasciciel === true && domownik.domownikId === user.userdata.id
        )
    );
    
    return (
        <div>

            <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={handleOpenCreateGospodarstwoModal} startIcon={<AddIcon/>}>
                    Utwórz gospodarstwo
                </Button>
                <Button variant="contained" color="secondary" onClick={handleOpenAddUsersModal} startIcon={<PersonAddIcon/>}>
                    Dodaj domownika do gospodarstwa
                </Button>
            </Stack>
            
            {/* Modal for creating gospodarstwo */}
            <Modal
                open={isCreateGospodarstwoModalOpen}
                onClose={handleCloseCreateGospodarstwoModal}
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
                        onClick={handleCloseCreateGospodarstwoModal}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h6" gutterBottom>Tworzenie gospodarstwa</Typography>

                    {successMessage1 && (
                        <Typography variant="body2" color="success.main" gutterBottom>
                            {successMessage1}
                        </Typography>
                    )}

                    {/* Wybór nazwy nowego gospodarstwa */}
                    <Typography variant="body1">Podaj nazwę nowego gospodarstwa:</Typography>
                    <TextField
                        fullWidth
                        margin="normal"
                        label="Nazwa gospodarstwa"
                        value={newGospodarstwoName}
                        onChange={(e) => setNewGospodarstwoName(e.target.value)}
                    />

                    {/* Wybór członków gospodarstwa */}
                    <Typography variant="body1">Wybierz członków:</Typography>
                    <FormControl fullWidth margin="normal">
                        <Select
                            labelId="select-users-label"
                            multiple
                            value={selectedUsers}
                            onChange={(e) => {
                                const selected = e.target.value;
                                // Upewnij się, że aktualny użytkownik pozostaje na liście
                                if (!selected.includes(user.userdata.id)) {
                                    setSelectedUsers([user.userdata.id, ...selected.filter((id) => id !== user.userdata.id)]);
                                } else {
                                    setSelectedUsers(selected);
                                }
                            }}
                            renderValue={(selected) =>
                                selected
                                    .map((id) => users.find((u) => u.id === id)?.userName || '')
                                    .join(', ')
                            }
                        >
                            {users.length > 0 ? (
                                users.map((userItem) => (
                                    <MenuItem key={userItem.id} value={userItem.id} disabled={userItem.id === user.userdata.id}>
                                        {userItem.id === user.userdata.id ? (
                                            <ListItemText primary={`${userItem.imie} (Zalogowany)`} />
                                        ) : (
                                            <>
                                                <Checkbox checked={selectedUsers.includes(userItem.id)} />
                                                <ListItemText primary={userItem.imie} />
                                            </>
                                        )}
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
                        Utwórz gospodarstwo
                    </Button>
                </Box>
            </Modal>

            {/* Modal for adding users to an existing gospodarstwo */}
            <Modal
                open={isAddUsersModalOpen}
                onClose={handleCloseAddUsersModal}
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
                        onClick={handleCloseAddUsersModal}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>

                    <Typography variant="h6" gutterBottom>Dodaj domowników do gospodarstwa</Typography>

                    {successMessage2 && (
                        <Typography variant="body2" color="success.main" gutterBottom>
                            {successMessage2}
                        </Typography>
                    )}

                    {/* Wybór istniejącego gospodarstwa */}
                    <Typography variant="body1">Wybierz gospodarstwo do dodania domownika:</Typography>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="select-gospodarstwo-label">Wybierz gospodarstwo</InputLabel>
                        <Select
                            labelId="select-gospodarstwo-label"
                            value={selectedGospodarstwoId}
                            onChange={(e) => handleSelectGospodarstwo(e.target.value)}
                        >
                            {filteredGospodarstwa.map((gospodarstwo) => (
                                <MenuItem key={gospodarstwo.id} value={gospodarstwo.id}>
                                    {gospodarstwo.nazwa}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Wybór użytkowników do dodania do gospodarstwa */}
                    <Typography variant="body1" style={{ marginTop: 20 }}>
                        Dodaj domowników do gospodarstwa:
                    </Typography>
                    <FormControl fullWidth margin="normal">
                        <Select
                            multiple
                            value={selectedUsers}
                            onChange={(e) => setSelectedUsers(e.target.value)}
                            renderValue={(selected) => selected.map((id) => users.find((u) => u.id === id)?.userName).join(', ')}
                        >
                            {unassignedUsers.map((user) => (
                                <MenuItem key={user.id} value={user.id}>
                                    <Checkbox checked={selectedUsers.includes(user.id)} />
                                    <ListItemText primary={user.imie} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleAddDomownikToGospodarstwo}
                        style={{ marginTop: 20 }}
                    >
                        Dodaj
                    </Button>
                </Box>
            </Modal>
            
            {/* Lista gospodarstw */}
            <Typography variant="h6" style={{ marginTop: 20 }}>
                Lista Gospodarstw, do których należysz:
            </Typography>
            <TableContainer sx={{ marginTop: 2 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Gospodarstwo <HomeIcon sx={{ marginLeft: 1 }} />
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                    Liczba członków <ContactsIcon sx={{ marginLeft: 1 }} />
                                </Box>
                            </TableCell>
                            <TableCell>
                                Akcje
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {gospodarstwa.map((gospodarstwo) => (
                            <TableRow key={gospodarstwo.id}>
                                <TableCell>
                                    <Typography
                                        onClick={() => handleSelectGospodarstwo(gospodarstwo.id)}
                                        style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                                    >
                                        {gospodarstwo.nazwa}
                                    </Typography>
                                </TableCell>
                                <TableCell>{gospodarstwo.domownikWGospodarstwie.length}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => navigate('/domownicy')}
                                        startIcon={<EditIcon/>}
                                    >
                                        Zarządzaj
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Wyświetlanie szczegółów gospodarstwa */}
            {gospodarstwoDetails && (
                <div style={{ marginTop: 20 }}>
                    <Typography variant="h6">Członkowie gospodarstwa:</Typography>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Imię</TableCell>
                                    <TableCell>Wiek</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {gospodarstwoDetails.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.imie}</TableCell>
                                        <TableCell>{user.wiek}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            )}
        </div>
    );
}

export default MyButtons;
