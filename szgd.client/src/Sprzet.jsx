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
    FormControlLabel
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import ReportIcon from '@mui/icons-material/ReportProblem';
import TableTemplate from './TableTemplate';
import RowActions from './RowActions';
import axios from 'axios';

const Sprzet = () => {
    const [resources, setResources] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [currentResource, setCurrentResource] = useState(null);
    const [gospodarstwoId, setGospodarstwoId] = useState(sessionStorage.getItem('selectedGospodarstwoId'));
    const [historyOpen, setHistoryOpen] = useState(false);
    const [historyData, setHistoryData] = useState([]);
    const [reportOpen, setReportOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [czyWystapilaAwaria, setCzyWystapilaAwaria] = useState(false);
    const [komentarzDoAwarii, setKomentarzDoAwarii] = useState('');

    const [newNazwa, setNewNazwa] = useState('');
    const [newTyp, setNewTyp] = useState('');

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
        axios.get(`https://localhost:7191/api/sprzet/GetAllSprzet/${gospodarstwoId}`)
            .then(response => setResources(response.data))
            .catch(error => console.error(error));
    }, [gospodarstwoId]);

    const handleEditOpen = (resource) => {
        setCurrentResource(resource);
        setEditOpen(true);
    };

    const handleDelete = async (resourceId) => {
        try {
            await axios.delete(`https://localhost:7191/api/Sprzet/${resourceId}`);
            setResources(prevResources => prevResources.filter(resource => resource.id !== resourceId));
        } catch (error) {
            console.error("Error deleting equipment:", error);
        }
    };

    const handleHistory = async (resourceId) => {
        try {
            const response = await axios.get(`https://localhost:7191/api/Sprzet/${resourceId}/Historia`);
            const sortedData = response.data.sort((a, b) => new Date(b.dataUzycia) - new Date(a.dataUzycia));
            setHistoryData(sortedData);
            setHistoryOpen(true);
        } catch (error) {
            console.error("Error fetching history data:", error);
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
                gospodarstwoId: "1",
                nazwa: currentResource.nazwa,
                typ: currentResource.typ,
                status: newStatus,
                opis: "brak"
            };
            await axios.put(`https://localhost:7191/api/Sprzet/${currentResource.id}`, updateRequestBody);

            // Wywołanie POST do historii użycia sprzętu
            const historyRequestBody = {
                id: 0,
                sprzetId: currentResource.id,
                domownikId: "1",
                gospodarstwoId: "1",
                dataUzycia: new Date().toISOString(),
                czyWystapilaAwaria: czyWystapilaAwaria,
                komentarzDoAwarii: komentarzDoAwarii
            };
            await axios.post("https://localhost:7191/api/HistoriaUzyciaSprzetu", historyRequestBody);

            setReportOpen(false);
            window.location.reload();
    };

    const handleAddResource = async () => {
        const newResource = {
            id: 0,
            gospodarstwoId: gospodarstwoId,
            nazwa: newNazwa,
            typ: newTyp,
            status: 0, // Ustawienie statusu na 0 (Dostepny)
            opis: ""
        };
        try {
            const response = await axios.post("https://localhost:7191/api/Sprzet", newResource);
            setResources([...resources, response.data]);
            setAddOpen(false);
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
        <Box sx={{ width: '1000px' }}>
            <TableTemplate
                passedResources={resources}
                description="Zarządzanie sprzętem"
                columns={columns}
                rowActions={rowActions}
            />
            <Box mt={2}>
                <Button variant="contained" color="primary" onClick={() => setAddOpen(true)}>
                    Dodaj sprzęt
                </Button>
            </Box>

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
                            <MenuItem value="W Naprawie">WNaprawie</MenuItem>
                            <MenuItem value="Zajety">Zajety</MenuItem>
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
        </Box>
    );
};

export default Sprzet;
