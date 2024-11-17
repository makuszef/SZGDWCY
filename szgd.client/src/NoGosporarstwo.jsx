import React from 'react';
import {Alert, AlertTitle, Box} from '@mui/material';
import {useAuth} from "@/AuthContext.jsx";

const NoGospodarstwoAlert = () => {
    const { user } = useAuth(); // Access user data from the auth context
    console.log(user);
    return (
        <Box>
            {!user?.userdata ? 
                (<Alert severity="warning" sx={{ margin: 2 }}>
                <AlertTitle>Nie zalogowano</AlertTitle>
                Zaloguj się, aby kontynować.
            </Alert>) : 
                <Alert severity="warning" sx={{ margin: 2 }}>
                <AlertTitle>Brak wybranego gospodarstwa</AlertTitle>
                Wybierz gospodarstwo, aby kontynuować. Jeśli nie wybrałeś gospodarstwa.
            </Alert>}
        </Box>
        
    );
};

export default NoGospodarstwoAlert;
