import './App.css';
import { Route, Routes } from 'react-router-dom';
import Footer from './Footer';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AppLayout from './AppLayout';
import MainMenu from './MainMenu';
import SprzatanieIcon from '@mui/icons-material/CleaningServices';  // Ikona sprz�tania
import ReceiptIcon from '@mui/icons-material/Receipt';               // Ikona paragon�w
import BuildIcon from '@mui/icons-material/Build';                   // Ikona sprz�tu
import PollIcon from '@mui/icons-material/Poll';                     // Ikona ankiet
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'; // Ikona zdrowia
import InventoryIcon from '@mui/icons-material/Inventory';            // Ikona zapas�w
import WindowIcon from '@mui/icons-material/Window';                 // Ikona kontroli okien
import HomeIcon from '@mui/icons-material/Home';                     // Ikona domownik�w
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';      // Ikona Wydatki
import PeopleIcon from '@mui/icons-material/People';
import Sprzet from './Sprzet'
import Domownicy from './Domownicy';
import Paragony from './Paragony.jsx';
import LoginPage from './LoginPage';
import Gospodarstwo from "./Gospodarstwo";
import RegisterPage from './RegisterPage';
import About from "@/About.jsx";
import {AuthProvider} from "@/AuthContext.jsx";
import Profile from "@/Profile.jsx";
import store from "@/store.jsx";
import {useEffect} from "react";
import { Provider } from 'react-redux';
import axios from 'axios'
import ExpenseSplit from "./ExpenseSplit.jsx";
// Karty g��wne z przypisanymi ikonami i trasami
const MainCards = [
    { title: 'Harmonogram sprzatania', icon: <SprzatanieIcon />, route: "/sprzatanie", component: <div>Harmonogram sprzatania</div> },
    { title: 'Paragony i gwarancje', icon: <ReceiptIcon />, route: "/paragony", component: <Paragony /> },
    { title: 'Sprzet', icon: <BuildIcon />, route: "/sprzet", component: <Sprzet/> },
    { title: 'Ankiety', icon: <PollIcon />, route: "/ankiety", component: <div>Ankiety</div>},
    {title: 'Informacje zdrowotne', icon: <MedicalServicesIcon />, route: "/zdrowie", component: <div>Informacje zdrowotne</div> },
    { title: 'Zapasy', icon: <InventoryIcon />, route: "/zapasy", component: <div>Zapasy</div> },
    { title: 'Kontrola okien', icon: <WindowIcon />, route: "/kontrola-okien", component: <div>Kontrola okien</div> },
    { title: 'Domownicy', icon: <PeopleIcon />, route: "/domownicy", component: <Domownicy gospodarstwoId={1}/>},
    { title: 'Gospodarstwa', icon: <HomeIcon />, route: "/gospodarstwa", component: <Gospodarstwo/>},
    { title: 'Wydatki', icon: <AttachMoneyIcon />, route: "/wydatki", component: <ExpenseSplit/>},
];
const userinfo = localStorage.getItem('user');
const files = 3;
function App() {
    return (
        <Provider store={store}>
            <AuthProvider>
                <Routes>
                    {/* Trasa g��wna - renderowanie menu z kartami */}
                    <Route path="/" element={<AppLayout Content={<MainMenu cards={MainCards} />} Cards={MainCards} />} />
                    <Route path="/gospodarstwa" element={<AppLayout Content={<Gospodarstwo/>}/>} />
                    <Route path="/login" element={<AppLayout Content={<LoginPage/>}/>} />
                    <Route path="/about" element={<AppLayout Content={<About/>}/>} />
                    <Route path="/register" element={<AppLayout Content={<RegisterPage />} />} />
                    <Route path="/profile" element={<AppLayout Content={<Profile/>}/>} />
                    <Route path="/wydatki" element={<AppLayout Content={<ExpenseSplit/>}/>} />
                    
        
                    {/* Dynamiczne mapowanie tras */}
                    {MainCards.map(card => (
                        <Route
                            key={card.route}
                            path={card.route}
                            element={<AppLayout Content={card.component} Cards={MainCards} />}
                        />
                    ))}
                    <Route path="*" element={<AppLayout Content={<LoginPage/>}/>} />
                </Routes>
            </AuthProvider>
        </Provider>
    );
}

export default App;


