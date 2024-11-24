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
import API_URLS from "@/API_URLS.jsx";
import {useAuth} from "@/AuthContext.jsx";
import {useDispatch, useSelector} from "react-redux";
import {selectGospodarstwo, setDomownikWGospodarstwie} from "@/features/resourceSlice.jsx";

const ZmienUprawnieniaDomownikaModal = ({ isOpen, onClose, data }) => {
    const [permissions, setPermissions] = useState({});
    const { user } = useAuth(); // Access user data from the auth context
    const gospodarstwo = useSelector(selectGospodarstwo);
    const gospodarstwoId = gospodarstwo.id;
    const dispatch = useDispatch();
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
            await axios.put(API_URLS.DOMOWNIKWGOSPODARSTWIE.PUT, permissions);
            console.log('Uprawnienia zaktualizowane.');
            axios.get(API_URLS.DOMOWNIKWGOSPODARSTWIE.GET_BY_KEYS(user.userdata.id, gospodarstwoId))
                .then(response => {
                    const updatowanyDomownikWGospodarstwie = response.data;
                    dispatch(setDomownikWGospodarstwie(updatowanyDomownikWGospodarstwie));
                    console.log(updatowanyDomownikWGospodarstwie);
                })
                .catch(error => {
                    console.error("Error fetching data:", error);
                });
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
