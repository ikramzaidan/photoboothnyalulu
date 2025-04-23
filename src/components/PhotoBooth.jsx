import { useEffect, useRef, useState } from 'react'

const PhotoBooth = ({ setCapturedImages, photoRows }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);

    const [capturedImages, setImages] = useState([]);
    const [filter, setFilter] = useState("none");
    const [countdown, setCountdown] = useState(null);
    const [capturing, setCapturing] = useState(false);
    const [countdownTime, setCountdownTime] = useState(3);
    // const [stream, setStream] = useState(null);

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    useEffect(() => {
        startCamera();

        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = async () => {
        try {
            if (streamRef.current) {
                console.log("Camera already started.");
                return;
            }

            const constraints = {
                video: {
                    facingMode: { ideal: "user" },
                    width: { ideal: isMobile ? 1280 : 1280 },
                    height: { ideal: isMobile ? 720 : 720 },
                    frameRate: { ideal: 30 }
                }
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;

                videoRef.current.onloadedmetadata = async () => {
                    try {
                        await videoRef.current.play();
                    } catch (err) {
                        console.error("Error playing video:", err);
                    }
                };
            }

            console.log("Camera started.");
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert("Could not access your camera. Please ensure camera permissions are granted in your browser settings.");
        }
    };


    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => {
                track.stop();
            });
            streamRef.current = null;
            console.log("Camera stream stopped.");
        }

        if (videoRef.current) {
            videoRef.current.srcObject = null;
        }
    };


    // Countdown to take 4 pictures automatically
    const startCountdown = () => {
        if (capturing) return;
        setCapturing(true);

        setImages([]);

        let photosTaken = 0;
        const newCapturedImages = [];

        const captureSequence = async () => {
            if (photosTaken >= photoRows) {
                setCountdown(null);
                setCapturing(false);

                try {
                    setCapturedImages([...newCapturedImages]);
                } catch (error) {
                    console.error("Error navigating to preview:", error);
                    // If navigation fails, at least display the images
                    setImages([...newCapturedImages]);
                }

                return;
            }

            let timeLeft = countdownTime;
            setCountdown(timeLeft);

            const timer = setInterval(() => {
                timeLeft -= 1;
                setCountdown(timeLeft);

                if (timeLeft === 0) {
                    clearInterval(timer);
                    const imageUrl = capturePhoto();
                    if (imageUrl) {
                        newCapturedImages.push(imageUrl);
                        setImages((prevImages) => [...prevImages, imageUrl]);
                    }
                    photosTaken += 1;
                    setTimeout(captureSequence, 1000);
                }
            }, 1000);
        };

        captureSequence();
    };

    // 
    const capturePhoto = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (video && canvas) {
            const context = canvas.getContext("2d");

            const targetWidth = 1280;
            const targetHeight = 720;

            canvas.width = targetWidth;
            canvas.height = targetHeight;

            const videoRatio = video.videoWidth / video.videoHeight;
            const targetRatio = targetWidth / targetHeight;

            let drawWidth = video.videoWidth;
            let drawHeight = video.videoHeight;
            let startX = 0;
            let startY = 0;

            if (videoRatio > targetRatio) {
                drawWidth = drawHeight * targetRatio;
                startX = (video.videoWidth - drawWidth) / 2;
            } else {
                drawHeight = drawWidth / targetRatio;
                startY = (video.videoHeight - drawHeight) / 2;
            }

            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = targetWidth;
            tempCanvas.height = targetHeight;
            const tempCtx = tempCanvas.getContext('2d');

            // Draw the original image first
            tempCtx.save();
            tempCtx.translate(tempCanvas.width, 0);
            tempCtx.scale(-1, 1);
            tempCtx.drawImage(
                video,
                startX, startY, drawWidth, drawHeight,
                0, 0, targetWidth, targetHeight
            );
            tempCtx.restore();

            // Flip canvas for mirroring
            context.save();

            if (filter !== 'none') {
                applyFilterToCanvas(tempCanvas, filter);
            }

            // Draw the processed image to the main canvas
            context.drawImage(tempCanvas, 0, 0);

            return canvas.toDataURL("image/png");
        }
    };

    return (
        <div className="flex flex-col w-full px-2">
            <div className="flex flex-col lg:flex-row justify-center items-center gap-5 w-full">
                <div className="flex justify-end h-full py-5">
                    <div className="relative w-full max-w-[800px] border border-black">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            muted
                            disablePictureInPicture
                            disableRemotePlayback
                            style={{
                                filter,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                        <canvas ref={canvasRef} className="hidden" />
                        {countdown !== null && (
                            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                                <div className="relative w-32 h-32 animate-blink">
                                    <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current drop-shadow-md">
                                        <path d="M50 5 
                                            L58 37 
                                            L95 32 
                                            L65 55 
                                            L78 92 
                                            L50 70 
                                            L20 90 
                                            L35 55 
                                            L5 35 
                                            L42 37 
                                            Z"
                                            stroke="black"
                                            strokeWidth="1"
                                            fill="currentColor"
                                        />
                                    </svg>
                                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black text-3xl font-bold shadows-into-light-regular">
                                        {countdown}
                                    </div>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col justify-center items-start max-w-64 gap-5 w-full p-5">
                    {capturedImages.map((image, index) => (
                        <img
                            key={index}
                            src={image}
                            alt={`Captured ${index + 1}`}
                            className="max-w-48 object-cover border border-black"
                        />
                    ))}
                </div>
            </div>
            <div className="flex justify-center gap-3 w-full py-5">
                <select onChange={(e) => setCountdownTime(parseInt(e.target.value))} value={countdownTime} disabled={capturing} className="dm-sans border border-black py-2 px-1">
                    <option value={3}>3s</option>
                    <option value={5}>5s</option>
                    <option value={10}>10s</option>
                </select>
                <button onClick={startCountdown} disabled={capturing} className="dm-sans bg-white border border-black py-2 px-3">
                    {capturing ? "Capturing..." : "Start Capture"}
                </button>
            </div>
        </div>
    )
}

export default PhotoBooth;