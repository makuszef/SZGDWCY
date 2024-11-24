// API_URLS.jsx

const BASE_URL = "https://localhost:7191"; // Bazowy URL API

const API_URLS = {
    AUTH: {
        LOGIN: `${BASE_URL}/login`,
        REGISTER: `${BASE_URL}/register`,
        REFRESH_TOKEN: `${BASE_URL}/refresh`,
    },
    DOMOWNIK: {
        GET_ALL: `${BASE_URL}/api/Domownik`,
        GET_BY_ID: (userId) => `${BASE_URL}/api/Domownik/${userId}`,
        GET_BY_EMAIL: (email) => `${BASE_URL}/api/Domownik/GetDomownikByEmail/${email}`,
        GET_ALL_GOSPODARSTWA_BY_ID: (userId) => `${BASE_URL}/api/Domownik/GetAllGospodarstwa/${userId}`,
        UPDATE_BY_EMAIL: (email) => `${BASE_URL}/api/Domownik/${email}`,
        DELETE: (userId) => `${BASE_URL}/api/Domownik/${userId}`,
    },
    DOMOWNIKWGOSPODARSTWIE: {
        GET_ALL: `${BASE_URL}/households`,
        GET_BY_KEYS:(userId, gospodarstwoId) => `${BASE_URL}/api/DomownikWGospodarstwie/${userId}/${gospodarstwoId}`,
        ADD_MEMBER: `${BASE_URL}/api/DomownikWGospodarstwie/DodajDomownikaDoGospodarstwa`,
        PUT: `${BASE_URL}/api/DomownikWGospodarstwie`,
    },
    GOSPODARSTWO: {
        GET_BY_ID: (id) => `${BASE_URL}/api/Gospodarstwo/${id}`,
        POST: `${BASE_URL}/api/Gospodarstwo`,
    },
    HISTORIA_UZYCIA_SPRZETU: {
        POST: `${BASE_URL}/api/HistoriaUzyciaSprzetu`,
        GET_BY_ID: (fileId) => `${BASE_URL}/files/${fileId}`,
        DELETE: (fileId) => `${BASE_URL}/files/${fileId}`,
    },
    PARAGON: {
        GET_ALL: `${BASE_URL}/surveys`,
        GET_BY_GOSPODARSTWO_ID: (gospodarstwoId) => `${BASE_URL}/api/paragon/ByGospodarstwo/${gospodarstwoId}`,
        SUBMIT_RESPONSE: `${BASE_URL}/surveys/submit`,
    },
    POZYCJAPARAGONU: {
        GET_ALL: `${BASE_URL}/surveys`,
        GET_BY_ID: (id) => `${BASE_URL}/api/Paragon/${id}`,
        SUBMIT_RESPONSE: `${BASE_URL}/surveys/submit`,
    },
    PLIK: {
        GET_ALL: `${BASE_URL}/api/PrzeslanyPlik`,
        GET_BY_ID: (id) => `${BASE_URL}/api/PrzeslanyPlik/${id}`,
        SUBMIT_RESPONSE: `${BASE_URL}/api/PrzeslanyPlik`,
    },
    SPRZET: {
        PUT: `${BASE_URL}/api/Sprzet`,
        POST: `${BASE_URL}/api/Sprzet`,
        GET_ALL_BY_GOSPODARSTWO_ID: (gospodarstwoId) => `${BASE_URL}/api/sprzet/GetAllSprzet/${gospodarstwoId}`,
        GET_HISTORIA_SPRZETU_BY_SPRZET_ID: (sprzetId) => `${BASE_URL}/api/Sprzet/${sprzetId}/Historia`,
        DELETE_BY_ID: (id) => `${BASE_URL}/api/sprzet/${id}`,
    },
    ANALIZE_FILE: {
        POST:(gospodarstwoId) => `${BASE_URL}/api/AnalizeFile/upload/${gospodarstwoId}`,
    },
};

export default API_URLS;
