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
import Sprzet from './Sprzet'
import Domownicy from './Domownicy';
import LoginPage from './LoginPage';
import Gospodarstwo from "@/Gospodarstwo.jsx";
import RegisterPage from './RegisterPage';
import About from "@/About.jsx";
import {AuthProvider} from "@/AuthContext.jsx";

// Karty g��wne z przypisanymi ikonami i trasami
const MainCards = [
    { title: 'Harmonogram sprzatania', icon: <SprzatanieIcon />, route: "/sprzatanie", component: <div>Harmonogram sprzatania</div> },
    { title: 'Paragony i gwarancje', icon: <ReceiptIcon />, route: "/paragony", component: <div>Paragony i gwarancje</div> },
    {
        title: 'Sprzet', icon: <BuildIcon />, route: "/sprzet", component: <Sprzet/> },
    { title: 'Ankiety', icon: <PollIcon />, route: "/ankiety", component: <div>Ankiety</div> },
    { title: 'Informacje zdrowotne', icon: <MedicalServicesIcon />, route: "/zdrowie", component: <div>Informacje zdrowotne</div> },
    { title: 'Zapasy', icon: <InventoryIcon />, route: "/zapasy", component: <div>Zapasy</div> },
    { title: 'Kontrola okien', icon: <WindowIcon />, route: "/kontrola-okien", component: <div>Kontrola okien</div> },
    {
        title: 'Domownicy', icon: <HomeIcon />, route: "/domownicy", component: <Domownicy />
    },
];

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Trasa g��wna - renderowanie menu z kartami */}
                <Route path="/" element={<AppLayout Content={<MainMenu cards={MainCards} />} Cards={MainCards} />} />
                <Route path="/gospodarstwa" element={<AppLayout Content={<Gospodarstwo/>}/>} />
                <Route path="/login" element={<AppLayout Content={<LoginPage/>}/>} />
                <Route path="/about" element={<AppLayout Content={<About/>}/>} />
                <Route path="/register" element={<AppLayout Content={<RegisterPage />} />} />
    
                {/* Dynamiczne mapowanie tras */}
                {MainCards.map(card => (
                    <Route
                        key={card.route}
                        path={card.route}
                        element={<AppLayout Content={card.component} Cards={MainCards} />}
                    />
                ))}
            </Routes>
        </AuthProvider>
    );
}

export default App;
