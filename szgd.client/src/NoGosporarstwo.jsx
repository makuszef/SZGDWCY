import React, {useEffect} from 'react';
import {Alert, AlertTitle, Box} from '@mui/material';
import {useAuth} from "@/AuthContext.jsx";
import { useNavigate } from 'react-router-dom';
const NoGospodarstwoAlert = () => {
    const { user } = useAuth(); // Access user data from the auth context
    console.log(user);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.userdata) {
            // Redirect the user if the condition is met
            navigate('/login');
        }
    }, [user]);
    return (
        <Box>
            {!user?.userdata ? 
                (<Alert severity="warning" sx={{ margin: 2 }}>
                <AlertTitle>Nie zalogowano</AlertTitle>
                Zaloguj się, aby kontynować.
            </Alert>) : 
                <Alert severity="warning" sx={{ margin: 2 }}>
                <AlertTitle>Brak wybranego gospodarstwa</AlertTitle>
                Wybierz gospodarstwo, aby kontynuować.
            </Alert>}
        </Box>
        
    );
};

export default NoGospodarstwoAlert;
