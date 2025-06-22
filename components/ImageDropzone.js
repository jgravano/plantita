import { useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';

const ImageDropzone = ({ onImageSelect, selectedImage }) => {
  const cameraInputRef = useRef(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          onImageSelect(reader.result);
        };
        reader.readAsDataURL(file);
      }
    },
    [onImageSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp'],
    },
    multiple: false,
    noClick: true, // Desactivamos el click para manejarlo nosotros
  });

  // Maneja la captura desde la cámara
  const handleCameraCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        onImageSelect(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const openCamera = () => {
    cameraInputRef.current.click();
  };

  return (
    <div className="w-full space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-plantita-400 bg-plantita-50'
            : 'border-plantita-300 hover:border-plantita-400 hover:bg-plantita-50'
        }`}
      >
        <input {...getInputProps()} />
        <input
          type="file"
          accept="image/*"
          capture="environment"
          style={{ display: 'none' }}
          ref={cameraInputRef}
          onChange={handleCameraCapture}
        />

        {selectedImage ? (
          <div className="space-y-4">
            <img
              src={selectedImage}
              alt="Planta seleccionada"
              className="mx-auto max-h-64 rounded-lg shadow-md"
            />
            <p className="text-plantita-600 font-medium">Imagen seleccionada ✓</p>
            <p className="text-sm text-gray-500">
              Arrastra otra imagen o usa los botones para cambiar
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="mx-auto w-16 h-16 bg-plantita-100 rounded-full flex items-center justify-center">
              <svg
                className="w-8 h-8 text-plantita-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <p className="text-lg font-medium text-plantita-700">
                {isDragActive ? 'Suelta la imagen aquí' : 'Arrastra una foto de tu planta'}
              </p>
              <p className="text-sm text-gray-500 mt-1">o usa los botones de abajo</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-4">
        <button
          type="button"
          onClick={openCamera}
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-plantita-600 hover:bg-plantita-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-plantita-500"
        >
          <svg className="w-5 h-5 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm4 5a3 3 0 106 0 3 3 0 00-6 0z" />
            <path d="M2 6a2 2 0 012-2h12a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
          </svg>
          Tomar Foto
        </button>
        <p className="text-sm text-gray-500">o</p>
        <button
          type="button"
          onClick={useDropzone().open} // Re-obtenemos `open` para el botón
          className="flex-1 inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-plantita-500"
        >
          <svg className="w-5 h-5 mr-2 -ml-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
          Elegir Archivo
        </button>
      </div>
    </div>
  );
};

export default ImageDropzone;
