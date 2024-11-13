import React, { useRef, useState, useEffect } from 'react';
import { Button } from '@mui/material';
import axios from 'axios';

const CameraComponent = ({ gospodarstwoId }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [photo, setPhoto] = useState(null);
    const [isCameraActive, setIsCameraActive] = useState(false);  // State to control camera visibility

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

        // Convert data URL to a Blob
        const blob = await (await fetch(photo)).blob();

        // Create form data to send as multipart/form-data
        const formData = new FormData();
        formData.append('file', blob, `photo_${gospodarstwoId}.png`); // Name the file with gospodarstwoId

        try {
            const response = await axios.post(
                `https://192.168.0.20:7191/api/AnalizeFile/upload/${gospodarstwoId}`,
                formData,
                {
                    headers: { 'Content-Type': 'multipart/form-data' },
                }
            );
            console.log('Upload successful:', response.data);
        } catch (error) {
            console.error('Upload failed:', error);
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
                <Button variant="contained" color="primary" onClick={() => setIsCameraActive(true)}>
                    Zrób Zdjęcie
                </Button>
            )}

            {/* Camera and photo capture section */}
            {isCameraActive && !photo && (
                <div>
                    <video ref={videoRef} autoPlay playsInline style={{ width: '100%' }} />
                    <Button variant="contained" color="primary" onClick={takePhoto} style={{ marginTop: '10px' }}>
                        Take Photo
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={closeCamera} style={{ marginTop: '10px' }}>
                        Zamknij
                    </Button>
                </div>
            )}

            {/* Display the captured photo */}
            {photo && (
                <div>
                    <img src={photo} alt="Captured" style={{ width: '100%', marginBottom: '10px' }} />
                    <Button variant="outlined" color="primary" onClick={uploadPhoto}>
                        Upload Photo
                    </Button>
                    <Button variant="contained" color="secondary" onClick={retakePhoto} style={{ marginLeft: '10px' }}>
                        Retake Photo
                    </Button>
                </div>
            )}

            {/* Hidden canvas for capturing the photo */}
            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default CameraComponent;
