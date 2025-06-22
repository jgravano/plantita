import axios from 'axios';
import Head from 'next/head';
import { useState } from 'react';
import DiagnosisResult from '../components/DiagnosisResult';
import ImageDropzone from '../components/ImageDropzone';

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [userInput, setUserInput] = useState('');
  const [diagnosis, setDiagnosis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

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
      });

      setDiagnosis(response.data);
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
      <Head>
        <title>Plantita - Diagnóstico de Plantas con IA</title>
        <meta
          name="description"
          content="Diagnostica problemas de tus plantas con inteligencia artificial"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

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
