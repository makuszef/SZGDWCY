import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from '@mui/material';
import axios from 'axios';

const ExpenseSplit = ({ gospodarstwoId }) => {
    const [users, setUsers] = useState([]);
    const [receipts, setReceipts] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!gospodarstwoId) {
            console.error("Brak gospodarstwoId");
            return;
        }

        // Pobranie użytkowników gospodarstwa
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`/api/Domownik/GetDomownicyGospodarstwa/${gospodarstwoId}`);
                console.log("Użytkownicy:", response.data);
                setUsers(response.data);
            } catch (error) {
                console.error("Błąd podczas pobierania użytkowników gospodarstwa:", error);
                setError("Nie udało się załadować użytkowników.");
            }
        };

        // Pobranie paragonów gospodarstwa
        const fetchReceipts = async () => {
            try {
                const response = await axios.get(`/api/Paragon/ByGospodarstwo/${gospodarstwoId}`);
                console.log("Paragony:", response.data);
                setReceipts(response.data);
            } catch (error) {
                console.error("Błąd podczas pobierania paragonów:", error);
                setError("Nie udało się załadować paragonów.");
            }
        };

        fetchUsers();
        fetchReceipts();
    }, [gospodarstwoId]);

    useEffect(() => {
        if (users.length > 0 && receipts.length > 0) {
            calculateExpenses();
        }
    }, [users, receipts]);

    // Funkcja do obliczania wydatków
    const calculateExpenses = () => {
        if (users.length === 0 || receipts.length === 0) {
            setExpenses([]);
            return;
        }

        // Całkowite wydatki gospodarstwa
        const totalExpenses = receipts.reduce((sum, receipt) => sum + (receipt.totalAmount || 0), 0);

        // Podział wydatków na liczbę użytkowników
        const splitAmount = users.length > 0 ? totalExpenses / users.length : 0;

        // Obliczenie salda każdego użytkownika
        const userExpenses = users.map((user) => {
            // Filtrujemy paragony przypisane do użytkownika
            const userReceipts = receipts.filter((receipt) => receipt.domownikId === user.id);
            const userTotal = userReceipts.reduce((sum, receipt) => sum + (receipt.totalAmount || 0), 0);

            return {
                id: user.id,
                name: user.imie,
                paid: userTotal,
                balance: userTotal - splitAmount, // Ujemne: winny, dodatnie: otrzymuje
            };
        });

        setExpenses(userExpenses);
    };

    // Formatowanie waluty
    const formatCurrency = (value) =>
        new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value);

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Podział wydatków gospodarstwa
            </Typography>
            {error && <Typography color="error">{error}</Typography>}
            {expenses.length > 0 ? (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Użytkownik</TableCell>
                                <TableCell>Zapłacone</TableCell>
                                <TableCell>Należność</TableCell>
                                <TableCell>Saldo</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>{expense.name}</TableCell>
                                    <TableCell>{formatCurrency(expense.paid)}</TableCell>
                                    <TableCell>{formatCurrency(expense.paid - expense.balance)}</TableCell>
                                    <TableCell>
                                        {formatCurrency(expense.balance)} {expense.balance < 0 ? '(Winny)' : '(Otrzymuje)'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            ) : (
                <Typography variant="body1">Brak danych do podziału wydatków.</Typography>
            )}
        </Box>
    );
};

export default ExpenseSplit;
