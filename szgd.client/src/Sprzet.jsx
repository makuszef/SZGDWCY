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

// Define the enum for resource status
const ResourceStatus = {
    IN_REPAIR: 'W naprawie',
    OPERATIONAL: 'Sprawne',
    DAMAGED: 'Uszkodzone',
};

const Sprzet = () => {
    const [resources, setResources] = useState([
        {
            id: 1,
            name: 'Kuchenka',
            type: 'AGD',
            status: ResourceStatus.IN_REPAIR,
            description: 'Uszkodzona plyta grzewcza, wymagana naprawa.',
        },
        {
            id: 2,
            name: 'Lodowka',
            type: 'AGD',
            status: ResourceStatus.OPERATIONAL,
            description: 'Nowa lodowka, brak usterek.',
        },
        {
            id: 3,
            name: 'Odkurzacz',
            type: 'AGD',
            status: ResourceStatus.IN_REPAIR,
            description: 'Nie dziala silnik, wymagana naprawa.',
        },
        {
            id: 4,
            name: 'Pralka',
            type: 'AGD',
            status: ResourceStatus.IN_REPAIR,
            description: 'Nieprawidlowe dzialanie, wymaga przegladu.',
        },
        {
            id: 5,
            name: 'Mikrofalowka',
            type: 'AGD',
            status: ResourceStatus.OPERATIONAL,
            description: 'Dziala bez zarzutu.',
        },
    ]);

    const [editOpen, setEditOpen] = useState(false);
    const [currentResource, setCurrentResource] = useState(null);

    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'name', headerName: 'Nazwa', width: 130 },
        { field: 'type', headerName: 'Typ', width: 130 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'description', headerName: 'Opis', width: 300 },
        {
            field: 'actions',
            headerName: 'Akcje',
            width: 130,
            renderCell: (params) => (
                <RowActions Row={params.row} Actions={rowActions} />
            ),
        },
    ];

    const handleEditOpen = (resource) => {
        setCurrentResource(resource);
        setEditOpen(true);
    };

    const handleDelete = (resourceId) => {
        setResources((prevResources) =>
            prevResources.filter(resource => resource.id !== resourceId)
        );
    };

    const handleUpdate = (updatedResource) => {
        setResources((prevResources) =>
            prevResources.map((res) => (res.id === updatedResource.id ? updatedResource : res))
        );
    };

    const rowActions = [
        {
            title: 'Edytuj',
            icon: <EditIcon />,
            onClick: (row) => handleEditOpen(row),
        },
        {
            title: 'Usuñ',
            icon: <DeleteIcon />,
            onClick: (row) => handleDelete(row.id),
        },
    ];

    // Handle dialog data
    const [dialogData, setDialogData] = useState([]);

    useEffect(() => {
        if (currentResource) {
            setDialogData([
                { label: 'Nazwa', value: currentResource.name, name: 'name' },
                { label: 'Typ', value: currentResource.type, name: 'type' },
                { label: 'Status', value: currentResource.status, name: 'status' },
                { label: 'Opis', value: currentResource.description, name: 'description' },
            ]);
        }
    }, [currentResource]);

    const handleChange = (index, value) => {
        setDialogData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index].value = value; // Update the specific field's value
            return updatedData;
        });
    };

    const handleSubmit = () => {
        const updatedResource = {
            id: currentResource.id, // Ensure to keep the same ID
            name: dialogData[0].value,
            type: dialogData[1].value,
            status: dialogData[2].value,
            description: dialogData[3].value,
        };
        handleUpdate(updatedResource); // Call the update function
        setEditOpen(false); // Close the modal
        setCurrentResource(null); // Reset current resource
    };

    const description = "Zarzqdzanie sprzetem";

    return (
        <Box sx={{ width: '1000px' }}>
            <TableTemplate
                passedResources={resources}
                description={description}
                columns={columns}
                rowActions={rowActions}
            />
            {/* Edit Resource Modal */}
            <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
                <DialogTitle>Edytuj Zasób</DialogTitle>
                <DialogContent>
                    {dialogData.map((data, index) => {
                        if (data.name === 'status') {
                            return (
                                <FormControl fullWidth margin="dense" key={index}>
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={data.value}
                                        onChange={(e) => handleChange(index, e.target.value)}
                                    >
                                        {Object.values(ResourceStatus).map((status) => (
                                            <MenuItem key={status} value={status}>
                                                {status}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            );
                        } else {
                            return (
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
                            );
                        }
                    })}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditOpen(false)} color="primary">Anuluj</Button>
                    <Button onClick={handleSubmit} color="primary">Zapisz</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Sprzet;
