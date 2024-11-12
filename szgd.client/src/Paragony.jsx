import React, { useState, useEffect } from 'react';
import { Modal, Typography, Button, List, ListItem, ListItemText, Stack, Box } from '@mui/material';
import axios from 'axios';

// Komponent do wyświetlania szczegółów konkretnego paragonu w oknie modalnym
const ReceiptDetailsModal = ({ receipt, open, onClose }) => {
    if (!receipt) return null;

    // Funkcja do pobierania pliku
    const handleDownload = async () => {
        try {
            if (receipt.id) {
                // Wywołanie zapytania do API w celu pobrania danych pliku
                const response = await axios.get(`https://localhost:7191/api/PrzeslanyPlik/${receipt.id}`);

                // Sprawdzamy czy zawartość pliku jest dostępna
                if (response.data && response.data.zawartoscPliku) {
                    // Dekodowanie zawartości Base64 na binarną postać pliku
                    const byteCharacters = atob(response.data.zawartoscPliku);
                    const byteArrays = [];

                    // Zamiana Base64 na tablicę bajtów
                    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
                        const slice = byteCharacters.slice(offset, offset + 1024);
                        const byteNumbers = new Array(slice.length);
                        for (let i = 0; i < slice.length; i++) {
                            byteNumbers[i] = slice.charCodeAt(i);
                        }
                        byteArrays.push(new Uint8Array(byteNumbers));
                    }

                    // Utworzenie pliku (np. PDF)
                    const blob = new Blob(byteArrays, { type: 'application/pdf' });

                    // Utworzenie URL dla pliku
                    const fileUrl = URL.createObjectURL(blob);

                    // Stworzenie linku do pobrania
                    const link = document.createElement('a');
                    link.href = fileUrl;
                    link.download = response.data.nazwaPliku || 'paragon.pdf'; // Użycie nazwy pliku z odpowiedzi lub domyślnej
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link); // Usunięcie linku po kliknięciu
                } else {
                    alert("Nie znaleziono zawartości pliku.");
                }
            } else {
                alert("Nie znaleziono pliku do pobrania.");
            }
        } catch (error) {
            console.error('Błąd podczas pobierania pliku:', error);
            alert("Wystąpił błąd podczas pobierania pliku.");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 24,
                    p: 4,
                    maxWidth: 400,
                    width: '90%',
                }}
            >
                <Typography variant="h6" gutterBottom>
                    Szczegóły Paragonu
                </Typography>
                <Typography variant="body1">
                    <strong>Data:</strong> {receipt.date}
                </Typography>
                <Typography variant="body1">
                    <strong>Sklep:</strong> {receipt.storeName}
                </Typography>
                <Typography variant="body1">
                    <strong>Kwota:</strong> {receipt.totalAmount} PLN
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                    <strong>Zakupy:</strong>
                </Typography>
                <List dense>
                    {receipt.items.map((item, index) => (
                        <ListItem key={index}>
                            <ListItemText primary={`${item.name} - ${item.price} PLN`} />
                        </ListItem>
                    ))}
                </List>

                {/* Dodaj przycisk do pobrania pliku */}
                <Button onClick={handleDownload} variant="contained" color="secondary" sx={{ mt: 2 }}>
                    Pobierz Paragon
                </Button>

                <Button onClick={onClose} variant="contained" color="primary" sx={{ mt: 2 }}>
                    Zamknij
                </Button>
            </Box>
        </Modal>
    );
};

// Komponent do uploadu pliku
const FileUpload = ({ onFileUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        if (selectedFile) {
            onFileUpload(selectedFile);
        } else {
            alert("Proszę wybrać plik!");
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="file" onChange={handleFileChange} />
            <Button type="submit" variant="contained" color="primary">Wgraj Paragon</Button>
        </form>
    );
};

// Komponent do wyświetlania listy zapisanych paragonów
const SavedReceipts = ({ receipts, onSelectReceipt }) => (
    <div>
        <Typography variant="h6" gutterBottom>
            Zapisane Paragony
        </Typography>
        <List>
            {receipts.map((receipt) => (
                <ListItem
                    button
                    key={receipt.id}
                    onClick={() => onSelectReceipt(receipt.id)}
                    sx={{
                        border: '1px solid #ddd',
                        borderRadius: 2,
                        mb: 1,
                        cursor: 'pointer',
                        '&:hover': {
                            backgroundColor: '#f5f5f5',
                        },
                    }}
                >
                    <ListItemText
                        primary={`${receipt.date} - ${receipt.storeName}`}
                        secondary={`${receipt.totalAmount} PLN`}
                    />
                </ListItem>
            ))}
        </List>
    </div>
);

// Główny komponent zarządzający uploadem pliku i wyświetlaniem paragonów
const ReceiptManager = () => {
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const response = await axios.get('https://localhost:7191/api/paragon');
                setReceipts(response.data);
            } catch (error) {
                console.error('Błąd podczas pobierania paragonów:', error);
                setError('Nie udało się pobrać zapisanych paragonów.');
            }
        };
        fetchReceipts();
    }, []);

    // Funkcja do uploadu pliku i otrzymywania paragonu
    const handleFileUpload = async (file) => {
        try {
            setIsLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('file', file);
            const gospodarstwoId = 1;
            // Change the URL to the correct endpoint
            const fileUploadResponse = await axios.post(`https://localhost:7191/api/AnalizeFile/upload/${gospodarstwoId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
        } catch (error) {
            console.error('Błąd podczas wysyłania pliku lub pobierania paragonu:', error);
            setError('Wystąpił błąd podczas przetwarzania pliku.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleSelectReceipt = async (receiptId) => {
        try {
            const response = await axios.get(`https://localhost:7191/api/paragon/${receiptId}`);
            setSelectedReceipt(response.data);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Błąd podczas pobierania szczegółów paragonu:', error);
        }
    };

    return (
        <Stack spacing={2}>

            {/* Formularz do uploadu pliku */}
            <FileUpload onFileUpload={handleFileUpload} />

            {/* Wyświetlanie stanu ładowania */}
            {isLoading && <Typography>Ładowanie...</Typography>}

            {/* Wyświetlanie błędów */}
            {error && <Typography color="error">{error}</Typography>}

            {/* Lista zapisanych paragonów */}
            <SavedReceipts receipts={receipts} onSelectReceipt={handleSelectReceipt} />

            {/* Modal do wyświetlania szczegółów paragonu */}
            <ReceiptDetailsModal
                receipt={selectedReceipt}
                open={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </Stack>
    );
};

export default ReceiptManager;
