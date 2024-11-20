import React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Box, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
/**
 * TableTemplate
 * A reusable table component that uses Material-UI's DataGrid to display data with customizable columns and actions.
 *
 * @param {Object} props - Component properties.
 * @param {Array} props.passedResources - Array of row data to be displayed in the table.
 * @param {string} props.description - Description or title for the table.
 * @param {Array} props.columns - Array of column definitions for the DataGrid.
 * @param {Function} props.rowActions - Callback for handling row-specific actions (optional).
 * @returns {JSX.Element} The TableTemplate component.
 */

/**
 * Handles the click event on a row in the DataGrid. Logs the selected row's ID.
 *
 * @param {Object} params - Parameters containing row information.
 * @param {Object} params.row - The data of the clicked row.
 * @returns {void}
 */

function TableTemplate({ passedResources, description, columns, rowActions }) {
    const navigate = useNavigate();

    // Zaktualizowane kolumny z ukrytą kolumną `ID`
    const updatedColumns = columns.map(column =>
        column.field === 'id' ? { ...column, hide: true } : column
    );

    return (
        <Box sx={{ width: '1000px' }} key={passedResources}>
            <Typography variant="h3">{description}</Typography>
            <Paper sx={{ height: '100%', width: '100%' }}>
                <DataGrid
                    rows={passedResources}
                    columns={updatedColumns}
                    initialState={{ pagination: { paginationModel: { page: 0, pageSize: 5 } } }}
                    pageSizeOptions={[5, 10]}
                    onRowClick={(params) => {
                        const selectedRow = params.row;
                        // Aplikacja nadal ma dostęp do ID, chociaż jest ukryte w interfejsie
                        console.log("ID wybranego wiersza:", selectedRow.id);
                    }}
                    sx={{ border: 0 }}
                />
            </Paper>
        </Box>
    );
}

export default TableTemplate;
