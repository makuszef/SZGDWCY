import React, {useState, useEffect, useContext} from 'react';
import {Modal, Typography, Button, List, ListItem, ListItemText, Stack, Box, CircularProgress} from '@mui/material';
import axios from 'axios';
import ZrobZdjecie from "@/ZrobZdjecie.jsx";
import { Alert, AlertTitle } from '@mui/material';
import WarningIcon from '@mui/icons-material/Warning';
import {selectDomownikWGospodarstwie, selectDomownik, selectGospodarstwo} from "@/features/resourceSlice.jsx";
import { useSelector, useDispatch } from 'react-redux';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DownloadIcon from '@mui/icons-material/Download';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CloseIcon from '@mui/icons-material/Close';
import NoGospodarstwoAlert from "@/NoGosporarstwo.jsx";
import {useAuth} from "@/AuthContext.jsx";
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
                <Button onClick={handleDownload} variant="contained" color="primary" sx={{ mt: 2 }} startIcon={<DownloadIcon/>}>Pobierz Paragon</Button>
                <Button onClick={onClose} variant="contained" color="primary" sx={{ mt: 2 }} startIcon={<CloseIcon/>}>Zamknij</Button>
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
            <Box sx={{ mt: 4 }} component="form" onSubmit={handleSubmit}>
                <Typography variant="h6">Wgraj Paragon</Typography>
                <input accept="image/*" type="file" id="upload-file" hidden onChange={handleFileChange} />
                <label htmlFor="upload-file">
                    <Button variant="outlined" component="span" color="primary" fullWidth startIcon={<FileUploadIcon/>}>Wybierz plik</Button>
                </label>
                {selectedFile && <Typography variant="body2">Wybrany plik: {selectedFile.name}</Typography>}
                <Button type="submit" variant="contained" color="primary" fullWidth startIcon={<AttachFileIcon/>}>Wgraj Paragon</Button>
            </Box>

            {/* Photo Capture Section */}
            <Box sx={{ mt: 4 }}>
                <ZrobZdjecie gospodarstwoId={gospodarstwoId} />
            </Box>
        </Box>
    );
};
const SavedReceipts = ({ receipts, onSelectReceipt }) => {
    if (!receipts || receipts.length === 0) {
        return <Typography>Nie zapisano żadnych paragonów.</Typography>;
    }

    return (
        <Box>
            <Typography variant="h6" gutterBottom>Zapisane Paragony</Typography>
            <List>
                {receipts.map((receipt) => (
                    <ListItem
                        button
                        key={receipt.id}
                        onClick={() => onSelectReceipt(receipt.id)}
                        sx={listItemStyle}
                    >
                        <ListItemText
                            primary={`${receipt.date} - ${receipt.storeName}`}
                            secondary={`${receipt.totalAmount} PLN`}
                        />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
};


// Main component managing receipt upload and display
const ReceiptManager = () => {
    const [receipts, setReceipts] = useState([]);
    const [selectedReceipt, setSelectedReceipt] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [przeladuj, setPrzeladuj] = useState(1);
    const {user} = useAuth();
    const domownikWGospodarstwie = useSelector(selectDomownikWGospodarstwie);
    const gospodarstwo = useSelector(selectGospodarstwo);
    const gospodarstwoId = gospodarstwo.id;
    axios.defaults.headers.common['Authorization'] = `Bearer ${user?.tokens.accessToken}`;
    useEffect(() => {
        const fetchReceipts = async () => {
            if (gospodarstwo?.id) {
                try {
                    const {data} = await axios.get(`https://localhost:7191/api/paragon/ByGospodarstwo/${gospodarstwoId}`);
                    setReceipts(data);
                } catch (err) {
                    console.error("Błąd podczas pobierania paragonów:", err);
                    setError("");
                    setReceipts([]);
                }
            }
        };
        fetchReceipts();
    }, [przeladuj, gospodarstwoId]);

    const handleFileUpload = async (file) => {
        try {
            setIsLoading(true);
            setError(null);

            const formData = new FormData();
            formData.append('file', file);

            const response = await axios.post(
                `https://localhost:7191/api/AnalizeFile/upload/${gospodarstwoId}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            setPrzeladuj(przeladuj + 1);
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
        <Box>
        {gospodarstwo?.id ? (<Stack spacing={2}>
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

            {isLoading && <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>}
            {error && <Typography color="error">{error}</Typography>}
            <SavedReceipts receipts={receipts} onSelectReceipt={handleSelectReceipt} />
            <ReceiptDetailsModal receipt={selectedReceipt} open={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </Stack>) : (<NoGospodarstwoAlert/>)}
        </Box>
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
