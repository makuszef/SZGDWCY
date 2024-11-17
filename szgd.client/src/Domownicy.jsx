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
import {useSelector} from "react-redux";
import {selectDomownikWGospodarstwie, selectGospodarstwo} from "@/features/resourceSlice.jsx"; // Import ikony Home


const Domownicy = () => {
    const [domownicy, setDomownicy] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [currentDomownik, setCurrentDomownik] = useState(null);
    const [dialogData, setDialogData] = useState([]);
    const { user } = useAuth(); // Access user data from the auth context
    const domownikWGospodarstwie = useSelector(selectDomownikWGospodarstwie);
    const gospodarstwo = useSelector(selectGospodarstwo);
    const gospodarstwoId = gospodarstwo.id;
    console.log(domownikWGospodarstwie);
    console.log(gospodarstwoId);
    console.log(gospodarstwo);
    const columns = [
        { field: 'imie', headerName: 'Imie', width: 130 },
        { field: 'nazwisko', headerName: 'Nazwisko', width: 130 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'telefon', headerName: 'Telefon', width: 150 },
        { field: 'actions', headerName: 'Akcje', width: 130 },
    ];

    useEffect(() => {
        if (gospodarstwoId) {
            const fetchDomownicy = async () => {
                try {
                    const response = await axios.get(`https://localhost:7191/api/Gospodarstwo/${gospodarstwoId}`);
                    const fetchedDomownicy = response.data.domownikWGospodarstwie.map(item => ({
                        id: item.domownik.id,
                        imie: item.domownik.imie,
                        nazwisko: item.domownik.nazwisko,
                        email: item.domownik.email,
                        telefon: item.domownik.phoneNumber,
                    }));
                    setDomownicy(fetchedDomownicy);
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

    const handleDelete = async (domownikId) => {
        try {
            await axios.delete(`https://localhost:7191/api/Domownik/${domownikId}`);
            setDomownicy(prevDomownicy => prevDomownicy.filter(domownik => domownik.id !== domownikId));
        } catch (error) {
            console.error("Błąd podczas usuwania domownika:", error);
        }
    };

    const handleUpdate = async (updatedDomownik) => {
        try {
            await axios.put(`https://localhost:7191/api/Domownik/${updatedDomownik.id}`, updatedDomownik);
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
        {gospodarstwo && gospodarstwo.id ? (<Box sx={{ width: '100%' }}>
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
                                <TableCell>{domownik.email}</TableCell>
                                <TableCell>{domownik.telefon}</TableCell>
                                {domownikWGospodarstwie?.czyMozeModyfikowacDomownikow && (
                                    <TableCell>
                                        <Button
                                            onClick={() => handleEditOpen(domownik)}
                                            startIcon={<EditIcon />}
                                            variant="outlined"
                                            color="primary"
                                            sx={{ marginRight: 1 }}
                                        >
                                            Edytuj
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
        </Box>) : (<Typography>Wybierz gospodarstwo, żeby zobaczyć domowników</Typography>)}
        </Box>
    );
};

export default Domownicy;
