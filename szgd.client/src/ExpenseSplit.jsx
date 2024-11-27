import React, { useState, useEffect } from 'react';
import { Typography, Box, MenuItem, Select } from '@mui/material';
import { BarChart } from '@mui/x-charts/BarChart';
import axios from 'axios';
import { useAuth } from "@/AuthContext.jsx";
import { useSelector } from "react-redux";
import { selectDomownikWGospodarstwie, selectGospodarstwo } from "@/features/resourceSlice.jsx";
import API_URLS from "@/API_URLS.jsx";
import NoGospodarstwoAlert from "@/NoGosporarstwo.jsx";

const ExpenseSplit = () => {
    const [receipts, setReceipts] = useState([]);
    const [filteredReceipts, setFilteredReceipts] = useState([]);
    const [expenses, setExpenses] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [filter, setFilter] = useState("all"); // Domyślne filtrowanie: wszystko
    const { user } = useAuth();
    const gospodarstwo = useSelector(selectGospodarstwo);
    const gospodarstwoId = gospodarstwo?.id;

    const chartSetting = {
        xAxis: [
            {
                label:"zł"
            },
        ],
        width: 700,
        height: 400,
    };

    axios.defaults.headers.common['Authorization'] = `Bearer ${user?.tokens.accessToken}`;

    useEffect(() => {
        if (!gospodarstwoId) {
            console.error("Brak gospodarstwoId");
            return;
        }
        const fetchReceipts = async () => {
            try {
                const { data } = await axios.get(API_URLS.PARAGON.GET_BY_GOSPODARSTWO_ID(gospodarstwoId));
                setReceipts(data);
            } catch (err) {
                console.error("Błąd podczas pobierania paragonów:", err);
                setReceipts([]);
            }
        };
        fetchReceipts();
    }, [gospodarstwoId]);

    useEffect(() => {
        applyFilter();
    }, [receipts, filter]);

    useEffect(() => {
        calculateExpenses();
        generateChartData();
    }, [filteredReceipts]);

    const applyFilter = () => {
        const now = new Date();
        const filtered = receipts.filter((receipt) => {
            if (!receipt.date) return false;
            const receiptDate = new Date(receipt.date);

            switch (filter) {
                case "week":
                    return receiptDate >= new Date(now.setDate(now.getDate() - 7));
                case "month":
                    return receiptDate >= new Date(now.setMonth(now.getMonth() - 1));
                case "halfYear":
                    return receiptDate >= new Date(now.setMonth(now.getMonth() - 6));
                case "year":
                    return receiptDate >= new Date(now.setFullYear(now.getFullYear() - 1));
                default:
                    return true; // "all" - brak filtra
            }
        });
        setFilteredReceipts(filtered);
    };

    const calculateExpenses = () => {
        const totalExpenses = filteredReceipts.reduce((sum, receipt) => sum + (receipt.totalAmount || 0), 0);
        setExpenses(totalExpenses);
    };

    const generateChartData = () => {
        const groupedData = {};

        filteredReceipts.forEach((receipt) => {
            const receiptDate = new Date(receipt.date);

            let key;
            if (filter === "week" || filter === "month") {
                // Podział na dni
                key = receiptDate.toLocaleDateString("pl-PL");
            } else if (filter === "halfYear" || filter === "year") {
                // Podział na miesiące
                key = `${receiptDate.getFullYear()}-${String(receiptDate.getMonth() + 1).padStart(2, "0")}`;
            } else {
                // "all" - podział na lata
                key = receiptDate.getFullYear().toString();
            }

            if (!groupedData[key]) {
                groupedData[key] = 0;
            }
            groupedData[key] += receipt.totalAmount || 0;
        });

        const chartDataArray = Object.entries(groupedData).map(([key, value]) => ({
            label: key,
            value,
        }));

        setChartData(chartDataArray);
    };

    const formatCurrency = (value) =>
        new Intl.NumberFormat('pl-PL', { style: 'currency', currency: 'PLN' }).format(value);

    return (
        <Box>
            {gospodarstwo?.id ? (
                <Box>
                    <Typography variant="h6" gutterBottom>
                        Wydatki gospodarstwa
                    </Typography>

                    <Typography variant="subtitle1" gutterBottom>
                        Wybierz okres
                    </Typography>
                    <Select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        displayEmpty
                        variant="outlined"
                        style={{ marginBottom: "1rem", minWidth: "200px" }}
                    >
                        <MenuItem value="all">Wszystko</MenuItem>
                        <MenuItem value="week">Ostatni tydzień</MenuItem>
                        <MenuItem value="month">Ostatni miesiąc</MenuItem>
                        <MenuItem value="halfYear">Ostatnie półrocze</MenuItem>
                        <MenuItem value="year">Ostatni rok</MenuItem>
                    </Select>

                    {expenses > 0 ? (
                        <Typography variant="h6" gutterBottom>
                            Suma wydatków: {formatCurrency(expenses)}
                        </Typography>
                    ) : (
                        <Typography variant="body1">Brak danych dla wybranego okresu.</Typography>
                    )}

                    {chartData.length > 0 && (
                        <BarChart
                            dataset={chartData}
                            yAxis={[{ scaleType: 'band', dataKey: 'label' }]}
                            series={[{ dataKey: 'value', label: 'Wydatki (PLN)', valueFormatter: formatCurrency }]}
                            layout="horizontal"
                            {...chartSetting}
                        />
                    )}
                </Box>
            ) : (
                <NoGospodarstwoAlert />
            )}
        </Box>
    );
};

export default ExpenseSplit;
