import React, { createContext, useState, useContext } from 'react';
import {useDispatch} from "react-redux";
import {setGospodarstwo, setDomownik, setDomownikWGospodarstwie} from "@/features/resourceSlice.jsx";
import {useNavigate} from "react-router-dom";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [user, setUser] = useState(() => {
        const savedUser = sessionStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        console.log("logout");
        setUser(null);
        dispatch(setGospodarstwo(null));
        dispatch(setDomownikWGospodarstwie(null));
        dispatch(setDomownik(null));
        sessionStorage.clear();
        sessionStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};
