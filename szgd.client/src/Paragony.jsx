import React, { useState, useEffect } from 'react';
import { Modal, Typography, Button, List, ListItem, ListItemText, Stack, Box } from '@mui/material';
import axios from 'axios';
import ZrobZdjecie from "@/ZrobZdjecie.jsx";
import { Alert, AlertTitle } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import {selectDomownikWGospodarstwie, selectDomownik} from "@/features/resourceSlice.jsx";
import { useSelector, useDispatch } from 'react-redux';
// Modal for displaying receipt details
const ReceiptDetailsModal = ({ receipt, open, onClose }) => {
    if (!receipt) return null;

    const handleDownload = async () => {
        try {
            const { id, nazwaPliku } = receipt;
            if (id) {
                const response = await axios.get(`https://localhost:7191/api/PrzeslanyPlik/${id}`);
                if (response.data?.zawartoscPliku) {
                    const blob = new Blob([Uint8Array.from(atob(response.data.zawartoscPliku), c => c.charCodeAt(0))], {
                        type: 'application/pdf',
                    });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = nazwaPliku || 'paragon.pdf';
                    link.click();
                    URL.revokeObjectURL(link.href);
                } else {
                    alert("Nie znaleziono zawartości pliku.");
                }
            }
        } catch (error) {
            console.error("Błąd podczas pobierania pliku:", error);
            alert("Wystąpił błąd podczas pobierania pliku.");
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Typography variant="h6" gutterBottom>Szczegóły Paragonu</Typography>
                <Typography variant="body1"><strong>Data:</strong> {receipt.date}</Typography>
                <Typography variant="body1"><strong>Sklep:</strong> {receipt.storeName}</Typography>
                <Typography variant="body1"><strong>Kwota:</strong> {receipt.totalAmount} PLN</Typography>
                <Typography variant="body2" sx={{ mt: 2 }}><strong>Zakupy:</strong></Typography>
                <List dense>{receipt.items.map((item, idx) => (
                    <ListItem key={idx}><ListItemText primary={`${item.name} - ${item.price} PLN`} /></ListItem>
                ))}</List>
                <Button onClick={handleDownload} variant="contained" color="secondary" sx={{ mt: 2 }}>Pobierz Paragon</Button>
                <Button onClick={onClose} variant="contained" color="primary" sx={{ mt: 2 }}>Zamknij</Button>
            </Box>
        </Modal>
    );
};

// Component for uploading files
const FileUpload = ({ onFileUpload, gospodarstwoId }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => setSelectedFile(event.target.files[0]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (selectedFile) onFileUpload(selectedFile);
        else alert("Proszę wybrać plik!");
    };

    return (
        <Box >
            {/* File Upload Section */}
            <Box sx={{ mt: 4 }} component="form" onSubmit={handleSubmit} sx={uploadStyle}>
                <Typography variant="h6">Wgraj Paragon</Typography>
                <input accept="image/*" type="file" id="upload-file" hidden onChange={handleFileChange} />
                <label htmlFor="upload-file">
                    <Button variant="outlined" component="span" color="primary" fullWidth>Wybierz plik</Button>
                </label>
                {selectedFile && <Typography variant="body2">Wybrany plik: {selectedFile.name}</Typography>}
                <Button type="submit" variant="contained" color="primary" fullWidth>Wgraj Paragon</Button>
            </Box>

            {/* Photo Capture Section */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6">Zrób Zdjęcie</Typography>
                <ZrobZdjecie gospodarstwoId={gospodarstwoId} />
            </Box>
        </Box>
    );
};

// Component for listing saved receipts
const SavedReceipts = ({ receipts, onSelectReceipt }) => (
    <Box>
        <Typography variant="h6" gutterBottom>Zapisane Paragony</Typography>
        <List>{receipts.map(receipt => (
            <ListItem button key={receipt.id} onClick={() => onSelectReceipt(receipt.id)} sx={listItemStyle}>
                <ListItemText primary={`${receipt.date} - ${receipt.storeName}`} secondary={`${receipt.totalAmount} PLN`} />
            </ListItem>
        ))}</List>
    </Box>
);

// Main component managing receipt upload and display
const ReceiptManager = () => {
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const gospodarstwoId = sessionStorage.getItem('selectedGospodarstwoId');
    const [domownikWGospodarstwie, setDomownikWGospodarstwie] = useState(useSelector(selectDomownikWGospodarstwie));
    console.log(domownikWGospodarstwie);
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchReceipts = async () => {
            try {
                const { data } = await axios.get('https://localhost:7191/api/paragon');
                setReceipts(data);
            } catch (err) {
                console.error("Błąd podczas pobierania paragonów:", err);
                setError("Nie udało się pobrać zapisanych paragonów.");
            }
        };
        fetchReceipts();
    }, []);

    const handleFileUpload = async (file) => {
        try {
            setIsLoading(true);
            setError(null);
            const formData = new FormData();
            formData.append('file', file);

            await axios.post(`https://localhost:7191/api/AnalizeFile/upload/${gospodarstwoId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        } catch (err) {
            console.error("Błąd podczas wysyłania pliku:", err);
            setError("Wystąpił błąd podczas przetwarzania pliku.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSelectReceipt = async (receiptId) => {
        try {
            const { data } = await axios.get(`https://localhost:7191/api/paragon/${receiptId}`);
            setSelectedReceipt(data);
            setIsModalOpen(true);
        } catch (err) {
            console.error("Błąd podczas pobierania szczegółów paragonu:", err);
        }
    };

    return (
        <Stack spacing={2}>
            {domownikWGospodarstwie?.czyMozePrzesylacPliki ? (
                <FileUpload onFileUpload={handleFileUpload} gospodarstwoId={gospodarstwoId} />
            ) : (
                <Alert
                    severity="error"
                    icon={<WarningIcon />}
                    sx={{
                        backgroundColor: 'rgba(255, 0, 0, 0.1)', // Delikatne tło
                        color: 'red',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: 2,
                        borderRadius: '8px',
                    }}
                >
                    <Typography>Nie masz uprawnień do przesyłania plików.</Typography>
                </Alert>
            )}

            {isLoading && <Typography>Ładowanie...</Typography>}
            {error && <Typography color="error">{error}</Typography>}
            <SavedReceipts receipts={receipts} onSelectReceipt={handleSelectReceipt} />
            <ReceiptDetailsModal receipt={selectedReceipt} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Stack>
    );
};

export default ReceiptManager;

// Styles
const modalStyle = {
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
};

const uploadStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 3,
    borderRadius: 2,
    boxShadow: 3,
    width: 500,
    backgroundColor: '#f9f9f9',
    gap: 2,
};

const listItemStyle = {
    border: '1px solid #ddd',
    borderRadius: 2,
    mb: 1,
    cursor: 'pointer',
    '&:hover': { backgroundColor: '#f5f5f5' },
};
