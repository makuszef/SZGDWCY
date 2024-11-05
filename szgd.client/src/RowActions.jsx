// RowActions.jsx
import React from 'react';
import { Tooltip } from '@mui/material'; // Ensure Tooltip is imported
import EditIcon from '@mui/icons-material/Edit'; // Import the icons you need
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';

export default function RowActions({ Actions, Row }) {
    return (
        <div>
            {Actions.map((action, index) => (
                <Tooltip key={index} title={action.title} arrow>
                    <span
                        onClick={() => action.onClick(Row)} // Correctly passing Row to onClick
                        style={{ cursor: 'pointer', marginRight: 8 }}
                    >
                        {action.icon}
                    </span>
                </Tooltip>
            ))}
        </div>
    );
}
