import React, {useEffect, useState} from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControlLabel,
    Checkbox,
    Button,
} from '@mui/material';
import axios from 'axios';

const ZmienUprawnieniaDomownikaModal = ({ isOpen, onClose, data }) => {
    const [permissions, setPermissions] = useState({});
    useEffect(() => {
        setPermissions(data);
    }, [data]);
    // Obsługa zmiany checkboxów
    const handleCheckboxChange = (key) => {
        setPermissions((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Funkcja zapisująca zmiany
    const saveChanges = async () => {
        try {
            await axios.put(`https://localhost:7191/api/DomownikWGospodarstwie`, permissions);
            console.log('Uprawnienia zaktualizowane.');
            onClose(); // Zamknięcie dialogu
        } catch (error) {
            console.error('Błąd podczas zapisywania zmian:', error);
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
            <DialogTitle>Zmień uprawnienia domownika</DialogTitle>
            <DialogContent>
                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={permissions.czyMozeModyfikowacDomownikow}
                                onChange={() => handleCheckboxChange('czyMozeModyfikowacDomownikow')}
                            />
                        }
                        label="Może modyfikować domowników"
                    />
                </div>
                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={permissions.czyMozeModyfikowacGospodarstwo}
                                onChange={() => handleCheckboxChange('czyMozeModyfikowacGospodarstwo')}
                            />
                        }
                        label="Może modyfikować gospodarstwo"
                    />
                </div>
                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={permissions.czyMozePrzesylacPliki}
                                onChange={() => handleCheckboxChange('czyMozePrzesylacPliki')}
                            />
                        }
                        label="Może przesyłać pliki"
                    />
                </div>
                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={permissions.czyWidziDomownikow}
                                onChange={() => handleCheckboxChange('czyWidziDomownikow')}
                            />
                        }
                        label="Widzi domowników"
                    />
                </div>
                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={permissions.czyWidziInformacjeMedyczneDomownikow}
                                onChange={() => handleCheckboxChange('czyWidziInformacjeMedyczneDomownikow')}
                            />
                        }
                        label="Widzi informacje medyczne domowników"
                    />
                </div>
                <div>
                    <FormControlLabel
                        control={
                            <Checkbox
                                checked={permissions.czyWidziSprzet}
                                onChange={() => handleCheckboxChange('czyWidziSprzet')}
                            />
                        }
                        label="Widzi sprzęt"
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">
                    Anuluj
                </Button>
                <Button onClick={saveChanges} color="primary">
                    Zapisz
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default ZmienUprawnieniaDomownikaModal;
