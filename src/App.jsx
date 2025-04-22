import "./App.css";
import { useState } from 'react'
import PhotoPreview from './components/PhotoPreview';
import PhotoBooth from "./components/PhotoBooth";

function App() {
  const [capturedImages, setCapturedImages] = useState([]);
  const [isBoothOpen, setIsBoothOpen] = useState(false);
  const [photoRows, setPhotoRows] = useState(0);

  const resetBooth = () => {
    setIsBoothOpen(false);
    setCapturedImages([]);
    setPhotoRows(0);
  };

  return (
    <div className="flex flex-1 flex-col min-h-screen lg:max-h-screen lg:justify-center bg-pink-50">
      <div className="w-full fixed z-10 top-0 px-10 py-3">
        <div className="flex flex-grow items-center justify-center">
          <div className="flex items-start gap-1 navbrand ml-3">
            <div className="reenie-beanie-regular text-3xl cursor-pointer text-shadow" onClick={resetBooth}>Photooboth nya Lulu</div>
            <div className="text-xs navbrand-sup">❤︎</div>
          </div>
        </div>
      </div>
      {isBoothOpen ? (
        <>
        {photoRows === 0 ? (
          <div className="flex flex-col h-screen lg:h-full justify-center items-center gap-3 px-3 lg:px-0">
            <div className="shadows-into-light-regular text-4xl">Pick your layout!</div>
            <div className="shadows-into-light-regular text-lg">How many pictures do you wanna take?</div>
            <div className="flex gap-3">
              <div className="flex justify-center items-center w-20 aspect-square border border-black shadows-into-light-regular text-lg cursor-pointer hover:bg-white" onClick={() => setPhotoRows(3)}>3 rows</div>
              <div className="flex justify-center items-center  w-20 aspect-square border border-black shadows-into-light-regular text-lg cursor-pointer hover:bg-white" onClick={() => setPhotoRows(4)}>4 rows</div>
            </div>
          </div>
        ) : (
          <>
            {capturedImages.length === photoRows ? (
              <PhotoPreview capturedImages={capturedImages} photoRows={photoRows} />
            ) : (
              <PhotoBooth setCapturedImages={setCapturedImages} photoRows={photoRows} />
            )}
          </>
        ) }
        </>
      ) : (
        <div className="flex flex-col h-screen lg:h-full justify-center items-center gap-3 px-3 lg:px-0">
          <div className="flex flex-col text-center">
            <div className="shadows-into-light-regular text-4xl mb-3">Hai Lu!</div>
            <div className="shadows-into-light-regular text-lg">This photobooth captures <b>3 or 4 pictures</b> in a session, so strike your best pose and have fun!</div>
            <div className="shadows-into-light-regular text-lg">You have 3 seconds for each shot – no retakes!</div>
          </div>
          <button className="dm-sans font-light text-xl border border-black px-5 py-2 hover:bg-white" onClick={() => setIsBoothOpen(true)}>Start</button>
        </div>
      )}
      <div className={`w-full px-10 pb-5 ${isBoothOpen && capturedImages.length !== 0 && capturedImages.length === photoRows  ? '' : 'fixed z-10 bottom-0'}`}>
        <div className="flex justify-center items-center">
          <span className="reenie-beanie-regular text-lg">copyright 2025, made with love</span>
        </div>
      </div>
    </div>
  )
}

export default App
