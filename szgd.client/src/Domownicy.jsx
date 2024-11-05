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
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import TableTemplate from './TableTemplate'; // Ensure this is your custom TableTemplate
import RowActions from './RowActions'; // Ensure this is your custom row actions component

const Domownicy = () => {
    const [domownicy, setDomownicy] = useState([
        {
            id: 1,
            imie: 'Anna',
            nazwisko: 'Kowalska',
            email: 'anna.k@example.com',
            telefon: '444555666',
        },
        {
            id: 2,
            imie: 'Marek',
            nazwisko: 'Nowak',
            email: 'marek.n@example.com',
            telefon: '555666777',
        },
        {
            id: 3,
            imie: 'Tomasz',
            nazwisko: 'Wisniewski',
            email: 'tomasz.w@example.com',
            telefon: '666777888',
        },
        {
            id: 4,
            imie: 'Kasia',
            nazwisko: 'Wojcik',
            email: 'kasia.w@example.com',
            telefon: '777888999',
        },
    ]);

    const [editOpen, setEditOpen] = useState(false);
    const [currentDomownik, setCurrentDomownik] = useState(null);

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

    const handleEditOpen = (domownik) => {
        setCurrentDomownik(domownik);
        setEditOpen(true);
    };

    const handleDelete = (domownikId) => {
        setDomownicy((prevDomownicy) =>
            prevDomownicy.filter(domownik => domownik.id !== domownikId)
        );
    };

    const handleUpdate = (updatedDomownik) => {
        setDomownicy((prevDomownicy) =>
            prevDomownicy.map((domownik) =>
                domownik.id === updatedDomownik.id ? updatedDomownik : domownik
            )
        );
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

    // Handle dialog data
    const [dialogData, setDialogData] = useState([]);

    useEffect(() => {
        if (currentDomownik) {
            setDialogData([
                { label: 'Imie', value: currentDomownik.imie, name: 'imie' },
                { label: 'Nazwisko', value: currentDomownik.nazwisko, name: 'nazwisko' },
                { label: 'Email', value: currentDomownik.email, name: 'email' },
                { label: 'Telefon', value: currentDomownik.telefon, name: 'telefon' },
            ]);
        }
    }, [currentDomownik]);

    const handleChange = (index, value) => {
        setDialogData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index].value = value; // Update the specific field's value
            return updatedData;
        });
    };

    const handleSubmit = () => {
        const updatedDomownik = {
            id: currentDomownik.id, // Ensure to keep the same ID
            imie: dialogData[0].value,
            nazwisko: dialogData[1].value,
            email: dialogData[2].value,
            telefon: dialogData[3].value,
        };
        handleUpdate(updatedDomownik); // Call the update function
        setEditOpen(false); // Close the modal
        setCurrentDomownik(null); // Reset current domownik
    };

    const description = "Zarzadzanie domownikami";

    return (
        <Box sx={{ width: '1000px' }}>
            <TableTemplate
                passedResources={domownicy}
                description={description}
                columns={columns}
                rowActions={rowActions}
            />
            {/* Edit Domownik Modal */}
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
}

export default Domownicy;
