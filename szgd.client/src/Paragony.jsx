import React, { useState } from 'react';
import axios from 'axios';

// Komponent do uploadu pliku
const FileUpload = ({ onFileUpload }) => {
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];

        if (file && !allowedTypes.includes(file.type)) {
            alert('Proszę wybrać plik o odpowiednim formacie (JPEG, PNG, PDF)');
            return;
        }

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
            <button type="submit">Wgraj Paragon</button>
        </form>
    );
};

// Komponent do wyświetlania danych paragonu
const ParagonDetails = ({ paragon }) => {
    return (
        <div>
            <h2>Podsumowanie Paragonu:</h2>
            <p><strong>Data:</strong> {paragon.date}</p>
            <p><strong>Sklep:</strong> {paragon.storeName}</p>
            <p><strong>Kwota:</strong> {paragon.totalAmount} PLN</p>
            <h3>Zakupy:</h3>
            <ul>
                {paragon.items.map((item, index) => (
                    <li key={index}>{item.name}: {item.price} PLN</li>
                ))}
            </ul>
        </div>
    );
};

// Główny komponent zarządzający uploadem pliku i wyświetlaniem paragonu
const ReceiptManager = () => {
    const [paragonData, setParagonData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Funkcja do uploadu pliku i otrzymywania paragonu
    const handleFileUpload = async (file) => {
        try {
            setIsLoading(true);  // Ustawiamy stan ładowania
            setError(null);  // Resetujemy ewentualny błąd

            // Upload pliku do API (PrzeslanyPlikController)
            const formData = new FormData();
            formData.append('file', file);

            const fileUploadResponse = await axios.post('https://localhost:7191/api/Paragon', formData, {
                headers: {
                    //'Content-Type': 'multipart/form-data',
                },
            });

            console.log('Plik został wysłany:', fileUploadResponse.data);

            // Teraz pobieramy przetworzony paragon (zakładając, że API zwróci ID paragonu)
            const receiptId = fileUploadResponse.data.receiptId;  // Zależy od struktury odpowiedzi API

            // Pobieranie danych paragonu z ParagonController
            const receiptResponse = await axios.get(`https://localhost:7191/api/Paragon/${receiptId}`);
            setParagonData(receiptResponse.data);
        } catch (error) {
            console.error('Błąd podczas wysyłania pliku lub pobierania paragonu:', error);
            setError('Wystąpił błąd podczas przetwarzania pliku.');
        } finally {
            setIsLoading(false);  // Kończymy ładowanie
        }
    };

    return (
        <div>
            <h1>Paragony i gwarancje</h1>

            {/* Formularz do uploadu pliku */}
            <FileUpload onFileUpload={handleFileUpload} />

            {/* Wyświetlanie stanu ładowania */}
            {isLoading && <p>Ładowanie...</p>}

            {/* Wyświetlanie błędów */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Wyświetlanie szczegółów paragonu */}
            {paragonData && <ParagonDetails paragon={paragonData} />}
        </div>
    );
};

export default ReceiptManager;
