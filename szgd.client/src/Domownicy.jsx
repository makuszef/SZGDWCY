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
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TableTemplate from './TableTemplate';
import RowActions from './RowActions';
import axios from 'axios';

const Domownicy = () => {
    const [domownicy, setDomownicy] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [currentDomownik, setCurrentDomownik] = useState(null);
    const [dialogData, setDialogData] = useState([]);
    const [gospodarstwoName, setGospodarstwoName] = useState(sessionStorage.getItem('selectedGospodarstwoName'));
    const [gospodarstwoId, setGospodarstwoId] = useState(sessionStorage.getItem('selectedGospodarstwoId'));

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'imie', headerName: 'Imie', width: 130 },
        { field: 'nazwisko', headerName: 'Nazwisko', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'telefon', headerName: 'Telefon', width: 150 },
        {
            field: 'actions',
            headerName: 'Akcje',
            width: 130,
            renderCell: (params) => (
                <RowActions Row={params.row} Actions={rowActions} />
            ),
        },
    ];

    // Pobieranie nazwy gospodarstwa i domowników, gdy ID gospodarstwa jest dostępne
    useEffect(() => {
        console.log(gospodarstwoId);
        if (gospodarstwoId) {
            // Pobierz nazwę gospodarstwa
            const fetchGospodarstwoName = async () => {
                try {
                    const response = await axios.get(`https://localhost:7191/api/Gospodarstwo/${gospodarstwoId}`);
                    setGospodarstwoName(gospodarstwoName);
                    console.log(gospodarstwoName)
                } catch (error) {
                    console.error("Błąd podczas pobierania nazwy gospodarstwa:", error);
                }
            };

            // Pobierz domowników
            const fetchDomownicy = async () => {
                try {
                    const response = await axios.get(`https://localhost:7191/api/Gospodarstwo/${gospodarstwoId}`);
                    const fetchedDomownicy = response.data.domownikWGospodarstwie.map(item => ({
                        id: item.domownik.id,
                        imie: item.domownik.imie,
                        nazwisko: item.domownik.nazwisko,
                        email: item.domownik.email,
                        telefon: item.domownik.phoneNumber,
                        czyWidziInformacjeMedyczneDomownikow: item.czyWidziInformacjeMedyczneDomownikow,
                        czyWidziSprzet: item.czyWidziSprzet,
                        czyWidziDomownikow: item.czyWidziDomownikow,
                        czyMozeModyfikowacDomownikow: item.czyMozeModyfikowacDomownikow,
                        czyMozeModyfikowacGospodarstwo: item.czyMozeModyfikowacGospodarstwo,
                        czyMozePrzesylacPliki: item.czyMozePrzesylacPliki,
                    }));
                    setDomownicy(fetchedDomownicy);
                } catch (error) {
                    console.error("Błąd podczas pobierania danych domowników:", error);
                }
            };

            fetchGospodarstwoName();
            fetchDomownicy();
        }
    }, [gospodarstwoId]); // Zależność od gospodarstwaId

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

    const handleDelete = async (domownikId) => {
        try {
            // Wysyłanie żądania do API usuwającego domownika
            await axios.delete(`https://localhost:7191/api/Domownik/${domownikId}`);

            // Usuwanie z lokalnego stanu
            setDomownicy((prevDomownicy) =>
                prevDomownicy.filter(domownik => domownik.id !== domownikId)
            );
        } catch (error) {
            console.error("Błąd podczas usuwania domownika:", error);
        }
    };

    const handleUpdate = async (updatedDomownik) => {
        try {
            // Wysyłanie zaktualizowanych danych do API
            await axios.put(`https://localhost:7191/api/Domownik/${updatedDomownik.id}`, updatedDomownik);

            // Aktualizowanie stanu po udanej edycji
            setDomownicy((prevDomownicy) =>
                prevDomownicy.map((domownik) =>
                    domownik.id === updatedDomownik.id ? updatedDomownik : domownik
                )
            );
        } catch (error) {
            console.error("Błąd podczas aktualizowania danych domownika:", error);
        }
    };

    const rowActions = [
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
    ];

    const handleChange = (index, value) => {
        setDialogData((prevData) => {
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

    const description = "Zarządzanie domownikami";

    return (
        <Box sx={{ width: '100%' }}>
            {/* Wyświetlanie nazwy gospodarstwa */}
            <Typography variant="h5" sx={{ mb: 2 }}>
                Gospodarstwo: {gospodarstwoName || "Nie wybrano gospodarstwa"}
            </Typography>

            {/* Tabela domowników */}
            <TableTemplate
                passedResources={domownicy}
                description={description}
                columns={columns}
                rowActions={rowActions}
            />

            {/* Modal edycji domownika */}
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
                    <Button onClick={() => setEditOpen(false)} color="primary">Anuluj</Button>
                    <Button onClick={handleSubmit} color="primary">Zapisz</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Domownicy;
