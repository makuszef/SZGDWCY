import React, { useState, useEffect } from 'react';
import {
    Alert,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { Home } from '@mui/icons-material';
import {useAuth} from "@/AuthContext.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectDomownikWGospodarstwie, selectGospodarstwo} from "@/features/resourceSlice.jsx";
import NoGospodarstwoAlert from "@/NoGosporarstwo.jsx"; // Import ikony Home
import EmailIcon from '@mui/icons-material/Email';
import Tooltip from '@mui/material/Tooltip';
import PhoneIcon from '@mui/icons-material/Phone';
import ZmienUprawnieniaDomownikaModal from "@/ZmienUprawnieniaDomownika.jsx";
import API_URLS from "@/API_URLS.jsx";
import WarningIcon from '@mui/icons-material/Warning';
/**
 * Component for managing household members ("Domownicy") within a selected "Gospodarstwo" (household).
 * Allows viewing, editing, and deleting members.
 *
 * @returns {JSX.Element} React component for managing household members.
 */

/**
 * Fetches and sets the list of household members for the selected "Gospodarstwo".
 * Triggered when `gospodarstwoId` changes.
 *
 * @function fetchDomownicy
 */

/**
 * Opens the edit dialog for a specific household member.
 * Populates the dialog with member details for editing.
 *
 * @param {Object} domownik - The household member to edit.
 * @function handleEditOpen
 */

/**
 * Deletes a specific household member from the list.
 * Sends a delete request to the API and updates the state.
 *
 * @param {string} domownikId - The ID of the household member to delete.
 * @function handleDelete
 */

/**
 * Updates a specific household member's details.
 * Sends an update request to the API and updates the state.
 *
 * @param {Object} updatedDomownik - The updated household member details.
 * @function handleUpdate
 */

/**
 * Updates the dialog data when a field value changes.
 * Used for managing input fields in the edit dialog.
 *
 * @param {number} index - The index of the dialog data field to update.
 * @param {string} value - The new value for the field.
 * @function handleChange
 */

/**
 * Submits the updated details of a household member.
 * Sends the changes to the server and closes the edit dialog.
 *
 * @function handleSubmit
 */

/**
 * Renders a table displaying the list of household members for the current "Gospodarstwo".
 * Includes actions for editing and deleting members if permissions allow.
 *
 * @component HouseholdMemberTable
 */

const Domownicy = () => {
    const [domownicy, setDomownicy] = useState([]);
    const [domownicywGospodarstwie, setDomownicywGospodarstwie] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [currentDomownik, setCurrentDomownik] = useState(null);
    const [dialogData, setDialogData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [zmienUprawnieniaDomownik, setZmienUprawnieniaDomownik] = useState(null);
    const { user } = useAuth(); // Access user data from the auth context
    const domownikWGospodarstwie = useSelector(selectDomownikWGospodarstwie);
    console.log(domownikWGospodarstwie);
    const gospodarstwo = useSelector(selectGospodarstwo);
    const gospodarstwoId = gospodarstwo.id;
    const dispatch = useDispatch();
    axios.defaults.headers.common['Authorization'] = `Bearer ${user?.tokens.accessToken}`;
    const columns = [
        { field: 'imie', headerName: 'Imie', width: 130 },
        { field: 'nazwisko', headerName: 'Nazwisko', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'telefon', headerName: 'Telefon', width: 150 },
        { field: 'actions', headerName: 'Akcje', width: 130 },
    ];

    if (!domownikWGospodarstwie?.czyWidziDomownikow) {
        return (
            <Alert
                severity="error"
                icon={<WarningIcon />}
                sx={{
                    backgroundColor: 'rgba(255, 0, 0, 0.1)',
                    color: 'red',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: 2,
                    borderRadius: '8px',
                }}
            >
                <Typography>Nie masz uprawnień do przeglądania domowników.</Typography>
            </Alert>
        );
    }

    useEffect(() => {
        if (gospodarstwoId) {
            const fetchDomownicy = async () => {
                try {
                    const response = await axios.get(API_URLS.GOSPODARSTWO.GET_BY_ID(gospodarstwoId));
                    const fetchedDomownicy = response.data.domownikWGospodarstwie.map(item => ({
                        id: item.domownik.id,
                        imie: item.domownik.imie,
                        nazwisko: item.domownik.nazwisko,
                        email: item.domownik.email,
                        telefon: item.domownik.phoneNumber,
                    }));
                    setDomownicy(fetchedDomownicy);
                    setDomownicywGospodarstwie(response.data.domownikWGospodarstwie);
                    console.log(domownicywGospodarstwie);
                } catch (error) {
                    console.error("Błąd podczas pobierania danych domowników:", error);
                }
            };
            
            fetchDomownicy();
        }
    }, [gospodarstwoId]);

    const handleEditOpen = (domownik) => {
        setCurrentDomownik(domownik);
        setDialogData([
            { label: 'Imie', value: domownik.imie, name: 'imie' },
            { label: 'Nazwisko', value: domownik.nazwisko, name: 'nazwisko' },
            { label: 'Email', value: domownik.email, name: 'email' },
            { label: 'Telefon', value: domownik.telefon, name: 'telefon' },
        ]);
        setEditOpen(true);
    };
    const handleEditOpenZmienUprawnienia = (domownik) => {
        
        const uprawnieniaDomownika = domownicywGospodarstwie.find(item => item.domownik.id === domownik.id);
        console.log(uprawnieniaDomownika);
        setZmienUprawnieniaDomownik(uprawnieniaDomownika);
        
        setModalOpen(true);
    };
    const handleDelete = async (domownikId) => {
        try {
            await axios.delete(API_URLS.DOMOWNIK.DELETE(domownikId));
            setDomownicy(prevDomownicy => prevDomownicy.filter(domownik => domownik.id !== domownikId));
        } catch (error) {
            console.error("Błąd podczas usuwania domownika:", error);
        }
    };

    const handleUpdate = async (updatedDomownik) => {
        try {
            await axios.put(API_URLS.DOMOWNIK.UPDATE(updatedDomownik.id), updatedDomownik);
            setDomownicy(prevDomownicy => prevDomownicy.map(domownik => domownik.id === updatedDomownik.id ? updatedDomownik : domownik));
        } catch (error) {
            console.error("Błąd podczas aktualizowania danych domownika:", error);
        }
    };

    const handleChange = (index, value) => {
        setDialogData(prevData => {
            const updatedData = [...prevData];
            updatedData[index].value = value;
            return updatedData;
        });
    };

    const handleSubmit = () => {
        const updatedDomownik = {
            id: currentDomownik.id,
            imie: dialogData[0].value,
            nazwisko: dialogData[1].value,
            email: dialogData[2].value,
            telefon: dialogData[3].value,
        };
        handleUpdate(updatedDomownik);
        setEditOpen(false);
        setCurrentDomownik(null);
    };

    return (
        <Box>
        {user && gospodarstwo && gospodarstwo.id ? (<Box sx={{ width: '100%' }}>
            {/*<Home sx={{ marginRight: 2 }} /> /!* Ikona domu *!/*/}
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold' }}>
                {/*Gospodarstwo: {gospodarstwoName || "Nie wybrano gospodarstwa"}*/}
                Zarządzanie domownikami w gospodarstwie {gospodarstwo?.nazwa}
            </Typography>
            <br/>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns.map((column) => (
                                <TableCell
                                    key={column.field}
                                    style={{
                                        width: column.width,           // Zachowanie szerokości kolumny
                                        fontWeight: 'bold',            // Pogrubienie tekstu
                                        backgroundColor: '#f4f4f4',   // Jasne tło nagłówka
                                        color: '#333',                 // Ciemny kolor tekstu
                                        borderBottom: '2px solid #ddd', // Dodanie dolnej ramki
                                        padding: '10px',               // Dodanie trochę paddingu, by zachować proporcje
                                        textAlign: column.align || 'left', // Zachowanie oryginalnego wyrównania (lewe, środkowe itp.)
                                    }}
                                >
                                    {column.headerName}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {domownicy.map((domownik) => (
                            <TableRow key={domownik.id}>
                                <TableCell>{domownik.imie}</TableCell>
                                <TableCell>{domownik.nazwisko}</TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {domownik.email}
                                        {domownik?.email && <Tooltip title="Wyślij e-mail">
                                            <EmailIcon
                                                sx={{marginLeft: 1, cursor: 'pointer'}}
                                                onClick={() => window.location.href = `mailto:${domownik.email}`}
                                            />
                                        </Tooltip>}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                        {domownik.telefon}
                                        {domownik?.telefon && <Tooltip title="Zadzwoń">
                                            <PhoneIcon
                                                sx={{marginLeft: 1, cursor: 'pointer'}}
                                                onClick={() => window.location.href = `tel:48${domownik.telefon}`}
                                            />
                                        </Tooltip>}
                                    </Box>
                                </TableCell>
                                {domownikWGospodarstwie?.czyMozeModyfikowacDomownikow && (
                                    <TableCell>
                                        {domownik.id === user.userdata.id && <Box><Button
                                            onClick={() => handleEditOpen(domownik)}
                                            startIcon={<EditIcon/>}
                                            variant="outlined"
                                            color="primary"
                                            sx={{marginRight: 1}}
                                        >
                                            Edytuj
                                        </Button>
                                            </Box>}
                                        <Button
                                            onClick={() => handleEditOpenZmienUprawnienia(domownik)}
                                            startIcon={<EditIcon/>}
                                            variant="outlined"
                                            color="primary"
                                            sx={{marginRight: 1}}
                                        >
                                            Zmien Uprawnienia
                                        </Button>
                                        <Button
                                            onClick={() => handleDelete(domownik.id)}
                                            startIcon={<DeleteIcon />}
                                            variant="outlined"
                                            color="secondary"
                                        >
                                            Usuń
                                        </Button>
                                    </TableCell>
                                )}


                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edytuj Domownika</DialogTitle>
                <DialogContent>
                    {dialogData.map((data, index) => (
                        <TextField
                            key={index}
                            autoFocus
                            margin="dense"
                            name={data.name}
                            label={data.label}
                            type="text"
                            fullWidth
                            variant="outlined"
                            value={data.value}
                            onChange={(e) => handleChange(index, e.target.value)}
                        />
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="primary">
                        Anuluj
                    </Button>
                    <Button onClick={handleSubmit} color="primary">
                        Zapisz
                    </Button>
                </DialogActions>
            </Dialog>
            <ZmienUprawnieniaDomownikaModal data={zmienUprawnieniaDomownik} onClose={() => setModalOpen(false)}
                                             isOpen={isModalOpen}/>
        </Box>) : (<NoGospodarstwoAlert/>)}
        </Box>
    );
};

export default Domownicy;
