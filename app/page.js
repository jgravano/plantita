'use client';

import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from '@clerk/nextjs';
import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import DiagnosisResult from '../components/DiagnosisResult';
import ImageDropzone from '../components/ImageDropzone';

export default function HomePage() {
  const { user, isSignedIn } = useUser();
  const [selectedImage, setSelectedImage] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlant, setSelectedPlant] = useState(null);

  // Verificar si hay una planta seleccionada para diagnóstico
  useEffect(() => {
    const savedPlant = localStorage.getItem('selectedPlantForDiagnosis');
    if (savedPlant) {
      try {
        const plant = JSON.parse(savedPlant);
        setSelectedPlant(plant);
        // Limpiar el localStorage después de usarlo
        localStorage.removeItem('selectedPlantForDiagnosis');
      } catch (err) {
        console.error('Error parsing saved plant:', err);
        localStorage.removeItem('selectedPlantForDiagnosis');
      }
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedImage) {
      setError('Por favor, selecciona una imagen de tu planta');
      return;
    }

    setIsLoading(true);
    setError(null);
    setDiagnosis(null);

    try {
      const response = await axios.post('/api/diagnose', {
        base64Image: selectedImage,
        userInput: userInput.trim(),
        userId: isSignedIn ? user.id : null,
        plantId: selectedPlant?.id || null, // Incluir el ID de la planta si está seleccionada
      });

      setDiagnosis(response.data);
      // Limpiar la planta seleccionada después del diagnóstico
      setSelectedPlant(null);
    } catch (err) {
      console.error('Error al diagnosticar:', err);
      setError(
        err.response?.data?.error ||
          err.response?.data?.details ||
          'Error al procesar la imagen. Intenta de nuevo.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (imageData) => {
    setSelectedImage(imageData);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-plantita-50 to-plantita-100">
      {/* Header con autenticación */}
      <header className="bg-white shadow-sm border-b border-plantita-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-plantita-500 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-plantita-800">Plantita</h1>
          </div>

          <div className="flex items-center space-x-4">
            <SignedOut>
              <SignInButton mode="modal">
                <button className="text-plantita-600 hover:text-plantita-700 font-medium">
                  Iniciar sesión
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="bg-plantita-600 text-white px-4 py-2 rounded-md hover:bg-plantita-700 font-medium">
                  Registrarse
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn>
              <Link
                href="/plantas"
                className="text-plantita-600 hover:text-plantita-700 font-medium"
              >
                Mis Plantas
              </Link>
              <UserButton />
            </SignedIn>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-plantita-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-plantita-800">Plantita</h1>
          </div>
          <p className="text-lg text-plantita-600 max-w-2xl mx-auto">
            Sube una foto de tu planta y obtén un diagnóstico inteligente con sugerencias de cuidado
            personalizadas
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:items-start">
            {/* Formulario */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 border border-plantita-200">
                <h2 className="text-xl font-semibold text-plantita-800 mb-4">
                  Diagnostica tu planta
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Indicador de planta seleccionada */}
                  {selectedPlant && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-green-600"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-green-800 font-medium">
                              Diagnóstico para: {selectedPlant.name}
                            </p>
                            <p className="text-green-600 text-sm">
                              El nuevo diagnóstico se agregará al historial de esta planta
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSelectedPlant(null)}
                          className="text-green-600 hover:text-green-700"
                          title="Cancelar selección"
                        >
                          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Selector de imagen */}
                  <div>
                    <label className="block text-sm font-medium text-plantita-700 mb-2">
                      Foto de tu planta *
                    </label>
                    <ImageDropzone
                      onImageSelect={handleImageSelect}
                      selectedImage={selectedImage}
                    />
                  </div>

                  {/* Descripción opcional */}
                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-plantita-700 mb-2"
                    >
                      Descripción del problema (opcional)
                    </label>
                    <textarea
                      id="description"
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="Describe los síntomas que has notado, cambios recientes, etc..."
                      className="w-full px-3 py-2 border border-plantita-300 rounded-md focus:outline-none focus:ring-2 focus:ring-plantita-500 focus:border-transparent resize-none"
                      rows={4}
                    />
                  </div>

                  {/* Botón de enviar */}
                  <button
                    type="submit"
                    disabled={!selectedImage || isLoading}
                    className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
                      !selectedImage || isLoading
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-plantita-600 text-white hover:bg-plantita-700 focus:outline-none focus:ring-2 focus:ring-plantita-500 focus:ring-offset-2'
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Analizando...</span>
                      </div>
                    ) : (
                      'Obtener diagnóstico'
                    )}
                  </button>
                </form>

                {/* Información adicional */}
                <div className="mt-6 pt-4 border-t border-plantita-200">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg
                        className="w-4 h-4 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">
                        Consejos para mejores resultados:
                      </p>
                      <ul className="text-sm text-blue-700 mt-1 space-y-1">
                        <li>• Toma la foto con buena iluminación</li>
                        <li>• Enfoca en las hojas o áreas problemáticas</li>
                        <li>• Incluye una descripción detallada si es posible</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resultado del diagnóstico */}
            <div className="space-y-6">
              <DiagnosisResult diagnosis={diagnosis} isLoading={isLoading} error={error} />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-plantita-200 bg-white">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-gray-600">
            🌱 Plantita - Diagnóstico inteligente de plantas con IA
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Este diagnóstico es informativo. Para casos graves, consulta con un especialista.
          </p>
        </div>
      </footer>
    </div>
  );
}
