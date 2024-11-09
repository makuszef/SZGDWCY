import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage"; // Musisz mieć ten hook w swoim projekcie

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    // Stan użytkownika zapisany w localStorage
    const [user, setUser] = useLocalStorage("user", null);
    const navigate = useNavigate();

    // Funkcja logowania
    const login = async (data) => {
        setUser(data);  // Zapisz dane użytkownika w localStorage
        navigate("/profile");  // Przekieruj użytkownika na stronę profilu
    };

    // Funkcja wylogowania
    const logout = () => {
        setUser(null);  // Usuń dane użytkownika
        navigate("/", { replace: true });  // Przekieruj na stronę główną
    };

    // Udostępnienie funkcji i stanu użytkownika przez kontekst
    const value = useMemo(() => ({
        user,
        login,
        logout,
    }), [user]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook do uzyskiwania dostępu do kontekstu
export const useAuth = () => {
    return useContext(AuthContext);
};
