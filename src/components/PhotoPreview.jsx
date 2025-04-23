import React, { useEffect, useRef, useState, useCallback } from "react";
import { IoAddSharp, IoDownloadSharp } from "react-icons/io5";

/* Frame Drawing Function */
const drawFrame = (ctx, canvas, frameSrc) => {
    if (!frameSrc) return;
    const frameImg = new Image();
    frameImg.src = frameSrc;
    frameImg.onload = () => {
        ctx.drawImage(frameImg, 0, 0, canvas.width, canvas.height);
    };
};

const frames = {
    none: null,
    firstSticker: "/sticker-1.png",
    secondSticker: "/sticker-2.png",
    thirdSticker: "/sticker-3.png",
};

const PhotoPreview = ({ capturedImages, photoRows }) => {
    const stripCanvasRef = useRef(null);
    const [stripColor, setStripColor] = useState("white");
    const [selectedFrame, setSelectedFrame] = useState("none");
    const [timestamp, setTimestamp] = useState(false);
    const [showPopup, setShowPopup] = useState(false);

    const generatePhotoStrip = useCallback(() => {
        const canvas = stripCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");

        /* Canvas properties */
        const imgWidth = 440;
        const paddingX = 40;
        let imgHeight, paddingTop, paddingBottom, photoSpacing;

        if (photoRows === 3) {
            imgHeight = 330;
            paddingTop = 120;
            paddingBottom = 50;
            photoSpacing = 80;
        } else {
            imgHeight = 270;
            paddingTop = 70;
            paddingBottom = 50;
            photoSpacing = 40;
        }

        canvas.width = 533;
        canvas.height = 1600;

        ctx.fillStyle = stripColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const drawText = () => {
            const now = new Date();
            const dateString = now.toLocaleString("en-US", {
                month: "2-digit",
                day: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
            });

            ctx.fillStyle = stripColor === "black" || stripColor === "#800000" ? "#FFFFFF" : "#000000";
            ctx.font = "60px Reenie Beanie";
            ctx.textAlign = "center";
            ctx.fillText("Photobooth nya Lulu", canvas.width / 2, canvas.height - paddingBottom * 2);
            if (timestamp) {
                ctx.font = "20px DM Sans";
                ctx.textAlign = "center";
                ctx.fillText(dateString, canvas.width / 2, canvas.height - paddingBottom * 1.25);
            }
        };

        /* Draw Captured Images */
        capturedImages.forEach((image, index) => {
            const img = new Image();
            img.src = image;
            img.onload = () => {
                const yOffset = paddingTop + (imgHeight + photoSpacing) * index;
                const xOffset = (canvas.width - imgWidth) / 2;

                // Object-cover logic
                const imgRatio = img.width / img.height;
                const targetRatio = imgWidth / imgHeight;

                let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;

                if (imgRatio > targetRatio) {
                    // Jika gambar lebih lebar dari target
                    sourceWidth = img.height * targetRatio;
                    sourceX = (img.width - sourceWidth) / 2;
                } else {
                    // Jika gambar lebih tinggi dari target
                    sourceHeight = img.width / targetRatio;
                    sourceY = (img.height - sourceHeight) / 2;
                }

                // Menggambar gambar dengan cropping
                ctx.drawImage(
                    img,
                    sourceX, sourceY, sourceWidth, sourceHeight, // Cropped source
                    xOffset, yOffset, imgWidth, imgHeight       // Destination size
                );

                /* Add White Border */
                ctx.lineWidth = 5;
                ctx.strokeStyle = "#FFFFFF";
                ctx.strokeRect(xOffset, yOffset, imgWidth, imgHeight);

                if (index === capturedImages.length - 1) {
                    drawFrame(ctx, canvas, frames[selectedFrame]);
                    setTimeout(() => {
                        drawText();
                    }, 50);
                }
            };
        });

        if (capturedImages.length === 0) {
            drawText();
        }
    }, [capturedImages, stripColor, selectedFrame, timestamp]);

    useEffect(() => {
        if (capturedImages.length === photoRows) {
            setTimeout(() => {
                generatePhotoStrip();
            }, 100);
        }
    }, [capturedImages, stripColor, selectedFrame, timestamp, generatePhotoStrip]);

    const downloadPhotoStrip = () => {
        const link = document.createElement("a");
        link.download = "photostrip.png";
        link.href = stripCanvasRef.current.toDataURL("image/png");
        link.click();
    };

    return (
        <div className="flex flex-col lg:flex-row items-center w-full h-full lg:h-screen py-5 xl:px-5">
            <div className="flex basis-1/2 justify-center gap-3 h-full p-5">
                <canvas ref={stripCanvasRef} className="w-auto h-screen lg:h-full rounded-md shadow-lg hover:shadow-2xl hover:scale-[1.01] transition ease-in-out cursor-pointer" />
            </div>
            <div className="flex flex-col basis-1/2 justify-center gap-5 h-full p-5">
                <div className="flex flex-col gap-3">
                    <h2>Color</h2>
                    <div className="flex flex-wrap gap-3">
                        <button onClick={() => setStripColor("white")} className={`dm-sans font-light border border-black px-3 py-2 hover:bg-white ${stripColor === "white" ? "bg-white" : ""}`}>White</button>
                        <button onClick={() => setStripColor("black")} className={`dm-sans font-light border border-black px-3 py-2 hover:bg-white ${stripColor === "black" ? "bg-white" : ""}`}>Black</button>
                        <button onClick={() => setStripColor("#f6d5da")} className={`dm-sans font-light border border-black px-3 py-2 hover:bg-white ${stripColor === "#f6d5da" ? "bg-white" : ""}`}>Pink</button>
                        <button onClick={() => setStripColor("#dde6d5")} className={`dm-sans font-light border border-black px-3 py-2 hover:bg-white ${stripColor === "#dde6d5" ? "bg-white" : ""}`}>Green</button>
                        <button onClick={() => setStripColor("#adc3e5")} className={`dm-sans font-light border border-black px-3 py-2 hover:bg-white ${stripColor === "#adc3e5" ? "bg-white" : ""}`}>Blue</button>
                        <button onClick={() => setStripColor("#fff2cc")} className={`dm-sans font-light border border-black px-3 py-2 hover:bg-white ${stripColor === "#fff2cc" ? "bg-white" : ""}`}>Yellow</button>
                        <button onClick={() => setStripColor("#dbcfff")} className={`dm-sans font-light border border-black px-3 py-2 hover:bg-white ${stripColor === "#dbcfff" ? "bg-white" : ""}`}>Purple</button>
                        <button onClick={() => setStripColor("#800000")} className={`dm-sans font-light border border-black px-3 py-2 hover:bg-white ${stripColor === "#800000" ? "bg-white" : ""}`}>Maroon</button>
                        <button onClick={() => setStripColor("#845050")} className={`dm-sans font-light border border-black px-3 py-2 hover:bg-white ${stripColor === "#845050" ? "bg-white" : ""}`}>Burgundy</button>
                    </div>
                </div>
                <div className="flex flex-col gap-3">
                    <h2>Sticker</h2>
                    <div className="flex gap-3">
                        <button onClick={() => setSelectedFrame("none")} className={`dm-sans font-light border border-black px-3 py-2 hover:bg-white ${selectedFrame === "none" ? "bg-white" : ""}`}>No Stickers</button>
                        <button onClick={() => setSelectedFrame("firstSticker")} className={`dm-sans font-light border border-black px-3 py-2 hover:bg-white ${selectedFrame === "firstSticker" ? "bg-white" : ""}`}>Sticker 1</button>
                        <button onClick={() => setSelectedFrame("secondSticker")} className={`dm-sans font-light border border-black px-3 py-2 hover:bg-white ${selectedFrame === "secondSticker" ? "bg-white" : ""}`}>Sticker 2</button>
                        <button onClick={() => setSelectedFrame("thirdSticker")} className={`dm-sans font-light border border-black px-3 py-2 hover:bg-white ${selectedFrame === "thirdSticker" ? "bg-white" : ""}`}>Sticker 3</button>
                        <button onClick={() => setShowPopup(true)} className={`flex items-center gap-1 dm-sans font-light border border-black px-3 py-2 hover:bg-white`}><IoAddSharp /> Add your own</button>
                    </div>
                </div>
                <div className="flex flex-col mt-8">
                    <div className="flex gap-3">
                        <button onClick={downloadPhotoStrip} className="flex items-center gap-1 dm-sans font-light border border-black px-3 py-2 hover:bg-white"><IoDownloadSharp /> Download Photo Strip</button>
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                    <input
                        type="checkbox"
                        id="timestamp"
                        checked={timestamp}
                        onChange={() => setTimestamp(!timestamp)}
                    />
                    <label htmlFor="timestamp" className="dm-sans text-sm">Timestamp</label>
                </div>
                <div className="shadows-into-light-regular text-xs text-center lg:text-start">
                We do not track, collect, or store any personal data. All photos taken are processed locally on your device and are not uploaded or saved to any external server.
                </div>

                {showPopup && (
                <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 shadow-md">
                    <p className="shadows-into-light-regular text-lg">Oops! We're still working on this feature.</p>
                    <button onClick={() => setShowPopup(false)} className="mt-4 border border-black px-3 py-2 text-black shadows-into-light-regular hover:bg-slate-50">Close</button>
                    </div>
                </div>
                )}


            </div>

        </div>

    );

}

export default PhotoPreview;