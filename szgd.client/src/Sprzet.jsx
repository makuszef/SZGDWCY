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
import TableTemplate from './TableTemplate'; // Custom TableTemplate component
import RowActions from './RowActions'; // Custom RowActions component
import axios from 'axios'; // Import axios for API requests

// Define the enum for resource status
const ResourceStatus = {
    IN_REPAIR: 'W naprawie',
    OPERATIONAL: 'Sprawne',
    DAMAGED: 'Uszkodzone',
};

const Sprzet = () => { // Add gospodarstwoId prop
    const [resources, setResources] = useState([]);
    const [editOpen, setEditOpen] = useState(false);
    const [currentResource, setCurrentResource] = useState(null);
    const [gospodarstwoId, setGospodarstwoId] = useState(1);
    const columns = [
        { field: 'id', headerName: 'ID', width: 70 },
        { field: 'nazwa', headerName: 'Nazwa', width: 130 },
        { field: 'typ', headerName: 'Typ', width: 130 },
        { field: 'status', headerName: 'Status', width: 130 },
        { field: 'opis', headerName: 'Opis', width: 300 },
        {
            field: 'actions',
            headerName: 'Akcje',
            width: 130,
            renderCell: (params) => (
                <RowActions Row={params.row} Actions={rowActions} />
            ),
        },
    ];

    // Fetch resources data from API based on GospodarstwoId
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await axios.get(`https://localhost:7191/api/sprzet/GetAllSprzet/${gospodarstwoId}`);
                setResources(response.data);
                console.log(response.data);
            } catch (error) {
                console.error("Error fetching equipment data:", error);
            }
        };

        if (gospodarstwoId) {
            fetchResources();
        }
    }, [gospodarstwoId]);

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
            title: 'Usuń',
            icon: <DeleteIcon />,
            onClick: (row) => handleDelete(row.id),
        },
    ];

    const [dialogData, setDialogData] = useState([]);

    useEffect(() => {
        if (currentResource) {
            setDialogData([
                { label: 'Nazwa', value: currentResource.nazwa, name: 'nazwa' },
                { label: 'Typ', value: currentResource.typ, name: 'typ' },
                { label: 'Status', value: currentResource.status, name: 'status' },
                { label: 'Opis', value: currentResource.opis, name: 'opis' },
            ]);
        }
    }, [currentResource]);

    const handleChange = (index, value) => {
        setDialogData((prevData) => {
            const updatedData = [...prevData];
            updatedData[index].value = value;
            return updatedData;
        });
    };

    const handleSubmit = () => {
        const updatedResource = {
            id: currentResource.id,
            nazwa: dialogData[0].value,
            typ: dialogData[1].value,
            status: dialogData[2].value,
            opis: dialogData[3].value,
        };
        handleUpdate(updatedResource);
        setEditOpen(false);
        setCurrentResource(null);
    };

    const description = "Zarządzanie sprzętem";

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
