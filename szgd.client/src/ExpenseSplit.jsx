import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Box } from '@mui/material';
import axios from 'axios';

const ExpenseSplit = ({ gospodarstwoId }) => {
    const [users, setUsers] = useState([]);
    const [receipts, setReceipts] = useState([]);
    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        // Pobranie użytkowników gospodarstwa
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`/api/Domownik/GetDomownicyGospodarstwa/${gospodarstwoId}`);
                setUsers(response.data);
            } catch (error) {
                console.error("Błąd podczas pobierania użytkowników gospodarstwa:", error);
            }
        };

        // Pobranie paragonów gospodarstwa
        const fetchReceipts = async () => {
            try {
                const response = await axios.get(`/api/Paragon/GetByGospodarstwo/${gospodarstwoId}`);
                setReceipts(response.data);
            } catch (error) {
                console.error("Błąd podczas pobierania paragonów:", error);
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
        // Zsumowanie całkowitych wydatków
        const totalExpenses = receipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0);

        // Podział kosztów na liczbę użytkowników
        const splitAmount = totalExpenses / users.length;

        // Obliczenie salda każdego użytkownika
        const userExpenses = users.map((user) => {
            // Wydatki użytkownika (filtrujemy paragony użytkownika)
            const userReceipts = receipts.filter((receipt) => receipt.userId === user.id);
            const userTotal = userReceipts.reduce((sum, receipt) => sum + receipt.totalAmount, 0);

            return {
                id: user.id,
                name: user.imie,
                paid: userTotal,
                balance: userTotal - splitAmount, // Ujemne: winny, dodatnie: otrzymuje
            };
        });

        setExpenses(userExpenses);
    };

    return (
        <Box>
            <Typography variant="h6" gutterBottom>
                Podział wydatków gospodarstwa
            </Typography>

            {expenses.length > 0 ? (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Użytkownik</TableCell>
                                <TableCell>Zapłacone (PLN)</TableCell>
                                <TableCell>Należność (PLN)</TableCell>
                                <TableCell>Saldo (PLN)</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {expenses.map((expense) => (
                                <TableRow key={expense.id}>
                                    <TableCell>{expense.name}</TableCell>
                                    <TableCell>{expense.paid.toFixed(2)}</TableCell>
                                    <TableCell>{(expense.paid - expense.balance).toFixed(2)}</TableCell>
                                    <TableCell>
                                        {expense.balance.toFixed(2)} {expense.balance < 0 ? '(Winny)' : '(Otrzymuje)'}
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
