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
import { useAuth } from './AuthContext';  // Import AuthContext
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIcon from '@mui/icons-material/Phone';

function MyButtons() {
    const { user } = useAuth(); // Get the current logged-in user
    const [gospodarstwa, setGospodarstwa] = useState([]);
    const [users, setUsers] = useState([]);  // State to store all users
    const [isModalOpen, setModalOpen] = useState(false);
    const [newGospodarstwoName, setNewGospodarstwoName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const dispatch = useDispatch();

    const selectedGospodarstwo = useSelector((state) => state.resource.gospodarstwo);

    // Fetch all domownicy (users)
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('https://localhost:7191/api/Domownik');
                console.log("Response from API /Domownik:", response.data);
                setUsers(response.data);  // Set fetched users data
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };
        fetchUsers();
    }, []);
    // Fetch gospodarstwa for the logged-in user based on their domownikId
    useEffect(() => {
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
    }, [refresh]); // Fetch when the user changes or component mounts

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

    // Handle creating a new gospodarstwo
    const handleCreateGospodarstwo = async (e) => {
        e.preventDefault();

        try {
            // 1. Utwórz nowe gospodarstwo (wysyłanie POST na api/Gospodarstwo)
            const gospodarstwoData = {
                id: 0, // Może to być jakiekolwiek id, ale API zwróci prawidłowe id
                nazwa: newGospodarstwoName
            };
            console.log(gospodarstwoData);
            const gospodarstwoResponse = await axios.post('https://localhost:7191/api/Gospodarstwo', gospodarstwoData);
            console.log('Gospodarstwo created:', gospodarstwoResponse.data);

            const gospodarstwoId = gospodarstwoResponse.data.id; // Pobierz id gospodarstwa

            // 2. Dodaj domownika do gospodarstwa (wysyłanie POST na api/DomownikwGospodarstwie/DodajDomownikaDoGospodarstwa)
            const domownikData = {
                domownikId: user.userdata.id, // Załóżmy, że user jest dostępny w kontekście
                gospodarstwoId: gospodarstwoId, // Używamy id z odpowiedzi poprzedniego zapytania
                rola: 0 // Przykładowa rola, może to być coś, co ustalisz
            };

            const addDomownikResponse = await axios.post('https://localhost:7191/api/DomownikwGospodarstwie/DodajDomownikaDoGospodarstwa', domownikData);
            console.log('Domownik added to Gospodarstwo:', addDomownikResponse.data);
            const addDomownikPromises = selectedUsers.map((userId) => {
                const domownikData = {
                    domownikId: userId, // Użyjemy id każdego domownika z selectedUsers
                    gospodarstwoId: gospodarstwoId, // Używamy id z odpowiedzi poprzedniego zapytania
                    rola: 0 // Przykładowa rola, może być dostosowana
                };

                return axios.post('https://localhost:7191/api/DomownikwGospodarstwie/DodajDomownikaDoGospodarstwa', domownikData);
            });

            // Czekaj, aż wszystkie zapytania POST zakończą się
            await Promise.all(addDomownikPromises);
            console.log('All selected users added to Gospodarstwo');
            // Po udanym dodaniu, pokazujemy komunikat o sukcesie
            setSuccessMessage('Gospodarstwo zostało utworzone, a domownik dodany!');
            setOpenSnackbar(true);
            setRefresh(true);
            setRefresh(false);
        } catch (error) {
            // Obsługa błędów
            console.error('Error during process:', error.response ? error.response.data : error.message);
            setSuccessMessage('Coś poszło nie tak. Spróbuj ponownie!');
            setOpenSnackbar(true); // Wyświetlamy snackbar w przypadku błędu
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
                                {console.log(gospodarstwo)}
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
                                                    <React.Fragment>
                                                        <Typography
                                                            component="span"
                                                            variant="body2"
                                                            sx={{ color: 'white', display: 'inline' }}
                                                        >
                                                            Email: {member.domownik.email}
                                                        </Typography>
                                                        <Typography sx={{ color: 'white'}}>
                                                            {"Telefon: " + member.domownik.telefon}
                                                        </Typography>
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
