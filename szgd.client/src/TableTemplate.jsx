import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Button, Box, Typography } from '@mui/material';
import { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function TableTemplate({ passedResources, description, columns, rowActions }) {
    const [resources, setResources] = useState([]);
    const [selectedResources, setSelectedResources] = useState([]);
    const paginationModel = { page: 0, pageSize: 5 };

    useEffect(() => {
        if (passedResources.length > 0) {
            setResources(passedResources);
        }
    }, [passedResources]);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleActionOnSelected = () => {
        ;
    };

    return (
        <Box sx={{ width: '1000px' }} key={passedResources}>
            <Typography variant="h3">{description}</Typography>
            <Button
                variant="contained"
                color="primary"
                onClick={() => navigate('/create-resource')}
                style={{ marginBottom: 16 }}
            >
                Dodaj
            </Button>
            <Button
                variant="contained"
                color="primary"
                onClick={handleActionOnSelected}
                disabled={selectedResources.length === 0}
                style={{ marginBottom: 16, marginLeft: 16 }}
            >
                Wykonaj akcje na zaznaczonych elementach
            </Button>
            <Paper sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={resources}
                    columns={columns}
                    initialState={{ pagination: { paginationModel } }}
                    pageSizeOptions={[5, 10]}
                    checkboxSelection
                    onRowSelectionModelChange={(newSelection) => {
                        const selectedIds = newSelection;
                        const selectedRows = resources.filter((resource) => selectedIds.includes(resource.id));
                        setSelectedResources(selectedRows);
                        if (selectedRows.length > 0) { ; }
                    }}
                    onRowClick={(params) => {
                        const selectedRow = params.row;
                        ;
}}
                    sx={{ border: 0 }}
                />
            </Paper>
        </Box>
    );
}

export default TableTemplate;
