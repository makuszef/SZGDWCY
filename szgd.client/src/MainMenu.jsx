
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import React from 'react';
import {
    Card,
    CardContent,
    Typography,
    Grid,
    IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import Gospodarstwo from './Gospodarstwo';
const MainMenu = ({ cards }) => {

    const selectedGospodarstwo = useSelector((state) => state.resource.gospodarstwo);

    const navigate = useNavigate();  // Create navigate function
    const handleNavigation = (path) => {
        navigate(path);  // Use navigate to change the route
    };
    const StyledCard = styled(Card)(({ theme }) => ({
        backgroundColor: '#F0E68C',
        textAlign: 'center',
        transition: 'transform 0.3s, box-shadow 0.3s',
        cursor: 'pointer',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        width: '100%',
        '&:hover': {
            transform: 'scale(1.05)',
            boxShadow: theme.shadows[5],
        },
    }));

    return (
        <div>
                <Grid container spacing={2} style={{ padding: 16 }}>
                {cards.map((card, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <StyledCard
                            onClick={() => handleNavigation(card.route)}
                            onMouseEnter={e => e.currentTarget.style.opacity = 1}
                            onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                            <CardContent>
                                <Typography variant="h5">{card.title}</Typography>
                                <IconButton disableRipple style={{ fontSize: '90px'}}>
                                    {React.cloneElement(card.icon, { fontSize: 'inherit'})}
                                </IconButton>
                            </CardContent>
                        </StyledCard>
                    </Grid>
                ))}
            </Grid> 
        </div>
        
    );
};

export default MainMenu;
