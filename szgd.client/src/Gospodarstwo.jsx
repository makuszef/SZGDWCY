import React, { useState } from 'react';
import { Button, Stack, List, ListItem, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setGospodarstwo } from './features/resourceSlice.jsx';
import axios from 'axios';

function MyButtons() {
    const [gospodarstwa, setGospodarstwa] = useState([]);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    // Pobierz wybrane gospodarstwo z reduxowego stanu
    const selectedGospodarstwo = useSelector((state) => state.resource.gospodarstwo);

    const handleCreateClick = async () => {
        const newGospodarstwo = `Gospodarstwo ${gospodarstwa.length + 1}`;

        try {
            // Wysłanie żądania POST na serwer z nowym gospodarstwem
            const response = await axios.post('https://localhost:44311/gospodarstwo', {
                name: newGospodarstwo,
            });

            if (response.status === 201) {
                // Dodaj gospodarstwo do lokalnego stanu, jeśli odpowiedź jest pozytywna
                setGospodarstwa((prevGospodarstwa) => [
                    ...prevGospodarstwa,
                    response.data.name, // Zakładamy, że serwer zwraca nazwę w response.data.name
                ]);
                console.log('Gospodarstwo utworzone:', response.data);
            }
        } catch (error) {
            console.error('Błąd podczas tworzenia gospodarstwa:', error);
            // Obsługa błędu – np. wyświetlenie użytkownikowi komunikatu o błędzie
        }
    };

    const handleJoinClick = () => {
        console.log("Dołącz clicked");
    };

    const handleDeleteClick = (indexToDelete) => {
        setGospodarstwa((prevGospodarstwa) =>
            prevGospodarstwa.filter((_, index) => index !== indexToDelete)
        );
    };

    const handleGospodarstwoClick = (gospodarstwo) => {
        dispatch(setGospodarstwo(gospodarstwo)); // Zapisz gospodarstwo do slice
    };

    return (
        <div>
            <Stack direction="row" spacing={2}>
                <Button variant="contained" color="primary" onClick={handleCreateClick}>
                    Utwórz
                </Button>
                <Button variant="outlined" color="secondary" onClick={handleJoinClick}>
                    Dołącz
                </Button>
            </Stack>

            <Typography variant="h6" style={{ marginTop: 20 }}>
                Lista Gospodarstw:
            </Typography>

            <List>
                {gospodarstwa.map((gospodarstwo, index) => (
                    <ListItem
                        key={index}
                        secondaryAction={
                            <IconButton edge="end" onClick={() => handleDeleteClick(index)}>
                                <DeleteIcon />
                            </IconButton>
                        }
                    >
                        <Typography
                            onClick={() => handleGospodarstwoClick(gospodarstwo)}
                            style={{ cursor: 'pointer', textDecoration: 'none', color: 'inherit' }}
                        >
                            {gospodarstwo}
                        </Typography>
                    </ListItem>
                ))}
            </List>

            {/* Wyświetl wybrane gospodarstwo, jeśli istnieje */}
            {selectedGospodarstwo && (
                <Typography variant="h2" style={{ marginTop: 20 }}>
                    Wybrane gospodarstwo: {selectedGospodarstwo}
                </Typography>
            )}
        </div>
    );
}

export default MyButtons;