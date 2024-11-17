import React, { useRef, useState, useEffect } from 'react';
import {Box, Button, CircularProgress} from '@mui/material';
import axios from 'axios';
import AddAPhotoIcon from '@mui/icons-material/AddAPhoto';
import CloseIcon from '@mui/icons-material/Close';
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import UndoIcon from '@mui/icons-material/Undo';
import FileUploadIcon from '@mui/icons-material/FileUpload';
const CameraComponent = ({ gospodarstwoId }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);  // State to control camera visibility
    const [isLoading, setIsLoading] = useState(false);
    // Start and stop camera based on isCameraActive state
    useEffect(() => {
        let stream;
        const startCamera = async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' } // Use rear camera (environment)
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error("Error accessing the camera", error);
            }
        };

        if (isCameraActive) {
            startCamera();
        } else if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
        }

        // Clean up when component unmounts
        return () => {
            if (stream) {
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, [isCameraActive]);

    const takePhoto = () => {
        const width = videoRef.current.videoWidth;
        const height = videoRef.current.videoHeight;

        // Set canvas dimensions to match video dimensions
        canvasRef.current.width = width;
        canvasRef.current.height = height;

        // Draw the current video frame to the canvas
        const context = canvasRef.current.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, width, height);

        // Get the image data URL from the canvas
        const dataUrl = canvasRef.current.toDataURL('image/png');
        setPhoto(dataUrl);
        setIsCameraActive(false);  // Stop the camera after taking the photo
    };

    const uploadPhoto = async () => {
        if (!photo) return;
        setIsLoading(true);
        // Convert data URL to a Blob
        const blob = await (await fetch(photo)).blob();

        // Create form data to send as multipart/form-data
        const formData = new FormData();
        formData.append('file', blob, `photo_${gospodarstwoId}.png`); // Name the file with gospodarstwoId

        try {
            const response = await axios.post(
                `https://localhost:7191/api/AnalizeFile/upload/${gospodarstwoId}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            console.log('Upload successful:', response.data);
        } catch (error) {
            console.error('Upload failed:', error);
        }
        finally {
            setIsLoading(false);
        }
    };

    const retakePhoto = () => {
        setPhoto(null); // Clear the current photo
        setIsCameraActive(true); // Restart the camera
    };

    const closeCamera = () => {
        // Stop the camera and hide the video feed
        setIsCameraActive(false); // This will trigger the cleanup and hide the camera
    };

    return (
        <div>
            {/* Show button to start the camera */}
            {!isCameraActive && !photo && (
                <Button variant="contained" color="primary" onClick={() => setIsCameraActive(true)} startIcon={<AddAPhotoIcon/>}>
                    Zrób Zdjęcie
                </Button>
            )}

            {/* Camera and photo capture section */}
            {isCameraActive && !photo && (
                <div>
                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
                    <Button variant="contained" color="primary" onClick={takePhoto} style={{ marginTop: '10px' }} startIcon={<AddAPhotoIcon/>}>
                        Zrób Zdjęcie
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={closeCamera} style={{ marginTop: '10px' }} startIcon={<CloseIcon/>}>
                        Zamknij
                    </Button>
                </div>
            )}

            {/* Display the captured photo */}
            {photo && (
                <div>
                    <img src={photo} alt="Captured" style={{ width: '100%', marginBottom: '10px' }} />
                    <Button variant="outlined" color="primary" onClick={uploadPhoto} startIcon={<FileUploadIcon/>}>
                        Prześlij zdjęcie
                    </Button>
                    <Button variant="contained" color="secondary" onClick={retakePhoto} startIcon={<UndoIcon/>} style={{ marginLeft: '10px' }}>
                        Zrób zdjęcie ponownie
                    </Button>
                </div>
            )}

            {/* Hidden canvas for capturing the photo */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {isLoading && <Box sx={{ display: 'flex' }}>
                <CircularProgress />
            </Box>}
        </div>
    );
};

export default CameraComponent;
