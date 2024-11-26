import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormControlLabel, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import ReportIcon from '@mui/icons-material/ReportProblem';
import TableTemplate from './TableTemplate';
import RowActions from './RowActions';
import axios from 'axios';
import { useSelector } from "react-redux";
import {selectDomownikWGospodarstwie, selectGospodarstwo} from "@/features/resourceSlice.jsx";
import {useAuth} from "@/AuthContext.jsx";
import AddIcon from '@mui/icons-material/Add';
import NoGospodarstwoAlert from "@/NoGosporarstwo.jsx";
import API_URLS from "@/API_URLS.jsx";
import WarningIcon from '@mui/icons-material/Warning';

/**
 * Komponent Sprzet zarządza sprzętem w gospodarstwie, umożliwia dodawanie, edytowanie, usuwanie i przeglądanie historii sprzętu.
 * Używa komponentów Material-UI oraz integracji z API.
 *
 * @component
 * @returns {JSX.Element} Komponent renderujący tabelę sprzętu z funkcjonalnością dodawania, edytowania, usuwania oraz przeglądania historii.
 */

/**
 * Hook uruchamiany po zmianie ID gospodarstwa. Pobiera dane o sprzęcie i aktualizuje stan komponentu.
 *
 * @function useEffect
 */

/**
 * Funkcja obsługująca otwieranie okna edycji sprzętu.
 * Ustawia wartości aktualnego sprzętu w stanach lokalnych.
 *
 * @function handleEditOpen
 * @param {Object} resource - Obiekt reprezentujący wybrany sprzęt do edycji.
 */

/**
 * Funkcja obsługująca wysyłanie danych edytowanego sprzętu do API w celu zapisania zmian.
 * W przypadku powodzenia aktualizuje dane w stanie komponentu.
 *
 * @function handleEditSubmit
 */

/**
 * Funkcja obsługująca usuwanie sprzętu.
 * Usuwa sprzęt z bazy danych oraz aktualizuje stan komponentu.
 *
 * @function handleDelete
 * @param {number} resourceId - ID sprzętu do usunięcia.
 */

/**
 * Funkcja obsługująca wyświetlanie historii użycia sprzętu.
 * Pobiera dane historii i ustawia je w stanie komponentu.
 *
 * @function handleHistory
 * @param {number} resourceId - ID sprzętu, dla którego ma zostać wyświetlona historia.
 */

/**
 * Funkcja otwierająca formularz zgłaszania użycia sprzętu, umożliwia określenie statusu i awarii.
 *
 * @function openReportDialog
 * @param {Object} resource - Obiekt reprezentujący sprzęt, dla którego zgłaszane jest użycie.
 */

/**
 * Funkcja obsługująca wysyłanie raportu o użyciu sprzętu, w tym aktualizację statusu sprzętu oraz zapis do historii użycia.
 *
 * @function handleReportSubmit
 */

/**
 * Funkcja obsługująca dodawanie nowego sprzętu.
 * Wysyła dane nowego sprzętu do API i aktualizuje stan komponentu.
 *
 * @function handleAddResource
 */

/**
 * Zestaw akcji dla wierszy w tabeli, umożliwia wywołanie funkcji edycji, usuwania, zgłaszania użycia oraz historii.
 *
 * @constant
 * @type {Array<Object>}
 * @property {string} title - Tytuł akcji.
 * @property {JSX.Element} icon - Ikona reprezentująca akcję.
 * @property {Function} onClick - Funkcja wywoływana po kliknięciu akcji.
 */

/**
 * Renderuje komponent z tabelą sprzętu, umożliwia zarządzanie sprzętem oraz wyświetlanie formularzy.
 *
 * @returns {JSX.Element} Zwraca JSX z tabelą sprzętu oraz formularzami do dodawania, edytowania, raportowania i przeglądania historii.
 */

/**
 * Komponent wyświetlający komunikat o braku gospodarstwa.
 * Wykorzystywany, gdy użytkownik nie jest przypisany do żadnego gospodarstwa.
 *
 * @returns {JSX.Element} Komunikat o braku gospodarstwa.
 */
const Sprzet = () => {
    const [resources, setResources] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [currentResource, setCurrentResource] = useState(null);
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [reportOpen, setReportOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [czyWystapilaAwaria, setCzyWystapilaAwaria] = useState(false);
    const [komentarzDoAwarii, setKomentarzDoAwarii] = useState('');
    const [newNazwa, setNewNazwa] = useState('');
    const [newTyp, setNewTyp] = useState('');
    const [newOpis, setNewOpis] = useState('');
    const gospodarstwo = useSelector(selectGospodarstwo);
    const domownikWGospodarstwie = useSelector(selectDomownikWGospodarstwie);
    const gospodarstwoId = gospodarstwo.id;
    const { user, logout } = useAuth();
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState('error');
    axios.defaults.headers.common['Authorization'] = `Bearer ${user?.tokens.accessToken}`;
    const columns = [
        { field: 'nazwa', headerName: 'Nazwa', width: 130 },
        { field: 'typ', headerName: 'Typ', width: 130 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'opis', headerName: 'Opis', width: 300 },
        {
            field: 'actions',
            headerName: 'Akcje',
            width: 160,
            renderCell: (params) => (
                <RowActions Row={params.row} Actions={rowActions} />
            ),
        },
    ];
    

    useEffect(() => {
        if (gospodarstwo?.id) {
            axios.get(API_URLS.SPRZET.GET_ALL_BY_GOSPODARSTWO_ID(gospodarstwoId))
                .then(response => {
                    setResources(response.data);  // Ustawienie danych, jeśli zapytanie się uda
                })
                .catch(error => {
                    console.error(error);  // Logowanie błędu do konsoli
                    setResources([]);  // Ustawienie pustej tablicy w przypadku błędu
                });
        }
    }, [gospodarstwoId]);  // Hook uruchamiany po zmianie gospodarstwoId


    const handleEditOpen = (resource) => {
        setCurrentResource(resource);
        setNewNazwa(resource.nazwa);
        setNewTyp(resource.typ);
        setNewOpis(resource.opis);
        setEditOpen(true);
    };

    const handleEditSubmit = async () => {
        const updatedResource = {
            ...currentResource,
            nazwa: newNazwa,
            typ: newTyp,
            opis: newOpis,
        };

        try {
            await axios.put(API_URLS.SPRZET.PUT, updatedResource);
            setResources(resources.map(resource =>
                resource.id === currentResource.id ? updatedResource : resource
            ));
            setSnackbarMessage('Sprzęt zaktualizowany');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
            setEditOpen(false);
        } catch (error) {
            console.error("Error updating equipment:", error);
            setSnackbarMessage('Błąd podczas aktualizacji sprzętu');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
    };

    const handleDelete = async (resourceId) => {
        try {
            await axios.delete(API_URLS.SPRZET.DELETE_BY_ID(resourceId));
            setResources(prevResources => prevResources.filter(resource => resource.id !== resourceId));
        } catch (error) {
            console.error("Error deleting equipment:", error);
        }
    };

    const handleHistory = async (resourceId) => {
        try {
            const response = await axios.get(API_URLS.SPRZET.GET_HISTORIA_SPRZETU_BY_SPRZET_ID(resourceId));
            const sortedData = response.data.sort((a, b) => new Date(b.dataUzycia) - new Date(a.dataUzycia));
            setHistoryData(sortedData);
            setHistoryOpen(true);
        } catch (error) {
            console.error("Error fetching history data:", error);
            setSnackbarMessage('Nie odnotowano uzycia sprzetu');
            setSnackbarSeverity('error');  // Określamy, że jest to błąd
            setOpenSnackbar(true);  // Otwarcie Snackbar
        }
    };


    const openReportDialog = (resource) => {
        setCurrentResource(resource);
        setNewStatus(''); // Resetowanie statusu
        setCzyWystapilaAwaria(false); // Resetowanie awarii
        setKomentarzDoAwarii(''); // Resetowanie komentarza
        setReportOpen(true);
    };

    const handleReportSubmit = async () => {
        // Wywołanie PUT do aktualizacji statusu
        const updateRequestBody = {
            id: currentResource.id,
            gospodarstwoId: gospodarstwoId,
            nazwa: currentResource.nazwa,
            typ: currentResource.typ,
            status: newStatus,
            opis: currentResource.opis
        };
        if (updateRequestBody.status = "W Naprawie") {
            updateRequestBody.status = "WNaprawie";
        }
        console.log(updateRequestBody);
        await axios.put(API_URLS.SPRZET.PUT, updateRequestBody);

        // Wywołanie POST do historii użycia sprzętu
        const historyRequestBody = {
            id: 0,
            sprzetId: currentResource.id,
            domownikId: user.userdata.id,
            gospodarstwoId: gospodarstwoId,
            dataUzycia: new Date().toISOString(),
            czyWystapilaAwaria: czyWystapilaAwaria,
            komentarzDoAwarii: komentarzDoAwarii
        };
        try {
            const response = await axios.post(API_URLS.HISTORIA_UZYCIA_SPRZETU.POST, historyRequestBody);
            setSnackbarMessage('Operacja powiodła się');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        }
        catch (e) {
            setSnackbarMessage('Operacja nie powiodła się');
            setSnackbarSeverity('error');
            setOpenSnackbar(true);
        }
        setReportOpen(false);
    };

    const handleAddResource = async () => {
        const newResource = {
            id: 0, // Zakładamy, że serwer generuje ID
            gospodarstwoId: gospodarstwoId, // Pobierane z Redux Store
            nazwa: newNazwa,
            typ: newTyp, // Typ jako string
            status: "Dostepny", // Domyślnie ustawiamy "Dostepny"
            opis: newOpis
        };

        try {
            const response = await axios.post(API_URLS.SPRZET.POST, newResource);
            setResources([...resources, response.data]); // Dodanie nowego sprzętu do stanu
            setAddOpen(false); // Zamknięcie dialogu
            setSnackbarMessage('Operacja powiodła się');
            setSnackbarSeverity('success');
            setOpenSnackbar(true);
        } catch (error) {
            console.error("Error adding new equipment:", error);
        }
    };

    const rowActions = [
        {
            title: 'Zgłoś użycie',
            icon: <ReportIcon />,
            onClick: (row) => openReportDialog(row),
        },
        {
            title: 'Edytuj',
            icon: <EditIcon />,
            onClick: (row) => handleEditOpen(row),
        },
        {
            title: 'Usuń',
            icon: <DeleteIcon />,
            onClick: (row) => handleDelete(row.id),
        },
        {
            title: 'Historia',
            icon: <HistoryIcon />,
            onClick: (row) => handleHistory(row.id),
        },
    ];

    return (
        <Box>
        {!domownikWGospodarstwie.czyWidziSprzet ? <Alert
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
            <Typography>Nie masz uprawnień do przeglądania sprzętu.</Typography>
        </Alert> : gospodarstwo?.id ? (<Box sx={{ width: '1000px' }}>
            {resources != null && resources.length > 0 ? (
                <TableTemplate
                    passedResources={resources}
                    description="Zarządzanie sprzętem"
                    columns={columns}
                    rowActions={rowActions}
                />
            ) : (
                <div></div>
            )}


            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={() => setAddOpen(true)} startIcon={<AddIcon/>}>
                    Dodaj sprzęt
                </Button>
            </Box>

            {/* Dialog do dodawania nowego sprzętu */}
            <Dialog open={addOpen} onClose={() => setAddOpen(false)}>
                <DialogTitle>Dodaj nowy sprzęt</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nazwa"
                        fullWidth
                        margin="dense"
                        value={newNazwa}
                        onChange={(e) => setNewNazwa(e.target.value)}
                    />
                    <TextField
                        label="Typ"
                        fullWidth
                        margin="dense"
                        value={newTyp}
                        onChange={(e) => setNewTyp(e.target.value)} // Typ jako string
                    />
                    <TextField
                        label="Opis"
                        fullWidth
                        margin="dense"
                        value={newOpis}
                        onChange={(e) => setNewOpis(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAddOpen(false)} color="primary">Anuluj</Button>
                    <Button onClick={handleAddResource} color="primary">Dodaj</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog for editing resource */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edytuj sprzęt</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Nazwa"
                        fullWidth
                        margin="dense"
                        value={newNazwa}
                        onChange={(e) => setNewNazwa(e.target.value)}
                    />
                    <TextField
                        label="Typ"
                        fullWidth
                        margin="dense"
                        value={newTyp}
                        onChange={(e) => setNewTyp(e.target.value)}
                    />
                    <TextField
                        label="Opis"
                        fullWidth
                        margin="dense"
                        value={newOpis}
                        onChange={(e) => setNewOpis(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="primary">Anuluj</Button>
                    <Button onClick={handleEditSubmit} color="primary">Zapisz zmiany</Button>
                </DialogActions>
            </Dialog>
            {/* Dialog do zgłoszenia użycia */}
            <Dialog open={reportOpen} onClose={() => setReportOpen(false)}>
                <DialogTitle>Zgłoś użycie sprzętu</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Status</InputLabel>
                        <Select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            label="Status"
                        >
                            <MenuItem value="Dostepny">Dostepny</MenuItem>
                            <MenuItem value="W Naprawie">W Naprawie</MenuItem>
                            <MenuItem value="Zajety">Zajęty</MenuItem>
                            <MenuItem value="Wycofany">Wycofany</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={czyWystapilaAwaria}
                                onChange={(e) => setCzyWystapilaAwaria(e.target.checked)}
                            />
                        }
                        label="Czy wystąpiła awaria?"
                    />
                    <TextField
                        label="Komentarz do awarii"
                        fullWidth
                        margin="dense"
                        value={komentarzDoAwarii}
                        onChange={(e) => setKomentarzDoAwarii(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setReportOpen(false)} color="primary">Anuluj</Button>
                    <Button onClick={handleReportSubmit} color="primary">Zgłoś</Button>
                </DialogActions>
            </Dialog>

            {/* Dialog "Historia" */}
            <Dialog open={historyOpen} onClose={() => setHistoryOpen(false)}>
                <DialogTitle>Historia Sprzętu</DialogTitle>
                <DialogContent>
                    {historyData.length > 0 ? (
                        historyData.map((entry, index) => (
                            <Box key={index} mb={2}>
                                <Typography>Imię Domownika: {entry.imieDomownika}</Typography>
                                <Typography>Nazwisko Domownika: {entry.nazwiskoDomownika}</Typography>
                                <Typography>Data użycia: {new Date(entry.dataUzycia).toLocaleString()}</Typography>
                                <Typography>Czy wystąpiła awaria: {entry.czyWystapilaAwaria ? "Tak" : "Nie"}</Typography>
                                <Typography>Komentarz do awarii: {entry.komentarzDoAwarii || "Brak"}</Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography>Brak danych historii dla tego sprzętu.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setHistoryOpen(false)} color="primary">Zamknij</Button>
                </DialogActions>
            </Dialog>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={6000}
                onClose={() => setOpenSnackbar(false)}
            >
                <Alert
                    onClose={() => setOpenSnackbar(false)}
                    severity={snackbarSeverity}
                    sx={{ width: '100%' }}
                >
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </Box>) : (<NoGospodarstwoAlert/>)}
        </Box>
        
    );
};

export default Sprzet;
