'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../../lib/supabase.js';

export default function PlantasPage() {
  const { user, isSignedIn } = useUser();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPlant, setEditingPlant] = useState(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (isSignedIn && user) {
      fetchPlants();
    }
  }, [isSignedIn, user]);

  const fetchPlants = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('plants')
        .select(
          `
          *,
          diagnoses (
            id,
            diagnosis_text,
            created_at
          )
        `,
        )
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching plants:', error);
        setError('Error al cargar tus plantas');
      } else {
        setPlants(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar tus plantas');
    } finally {
      setLoading(false);
    }
  };

  const handleEditName = (plant) => {
    setEditingPlant(plant.id);
    setEditName(plant.name || plant.species || '');
  };

  const handleSaveName = async (plantId) => {
    try {
      const { error } = await supabase
        .from('plants')
        .update({ name: editName.trim() })
        .eq('id', plantId)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error updating plant name:', error);
        alert('Error al actualizar el nombre de la planta');
      } else {
        // Actualizar el estado local
        setPlants(
          plants.map((plant) =>
            plant.id === plantId ? { ...plant, name: editName.trim() } : plant,
          ),
        );
        setEditingPlant(null);
        setEditName('');
      }
    } catch (err) {
      console.error('Error:', err);
      alert('Error al actualizar el nombre de la planta');
    }
  };

  const handleCancelEdit = () => {
    setEditingPlant(null);
    setEditName('');
  };

  const handleNewDiagnosis = (plant) => {
    // Guardar la planta seleccionada en localStorage para que la página principal la use
    localStorage.setItem(
      'selectedPlantForDiagnosis',
      JSON.stringify({
        id: plant.id,
        name: plant.name || plant.species || 'Planta sin nombre',
        species: plant.species,
      }),
    );
    // Redirigir a la página principal
    window.location.href = '/';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-plantita-50 to-plantita-100">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-md p-8">
              <h1 className="text-2xl font-bold text-plantita-800 mb-4">Acceso restringido</h1>
              <p className="text-plantita-600 mb-6">
                Necesitas iniciar sesión para ver tu historial de plantas.
              </p>
              <Link
                href="/"
                className="bg-plantita-600 text-white px-6 py-2 rounded-md hover:bg-plantita-700 font-medium"
              >
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-plantita-50 to-plantita-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-plantita-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/" className="flex items-center space-x-3">
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
              </Link>
            </div>
            <Link href="/" className="text-plantita-600 hover:text-plantita-700 font-medium">
              ← Volver al diagnóstico
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-plantita-800 mb-2">Mis Plantas</h1>
            <p className="text-plantita-600">
              Historial de diagnósticos y seguimiento de tus plantas
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plantita-600 mx-auto"></div>
              <p className="text-plantita-700 mt-4">Cargando tus plantas...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800">{error}</p>
                <button
                  onClick={fetchPlants}
                  className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Reintentar
                </button>
              </div>
            </div>
          ) : plants.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-white rounded-lg shadow-md p-8 max-w-md mx-auto">
                <div className="w-16 h-16 bg-plantita-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-plantita-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 12a1 1 0 112 0 1 1 0 01-2 0zM9 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-plantita-700 mb-2">
                  No tienes plantas registradas
                </h3>
                <p className="text-gray-500 mb-6">
                  Realiza tu primer diagnóstico para comenzar a seguir tus plantas.
                </p>
                <Link
                  href="/"
                  className="bg-plantita-600 text-white px-6 py-2 rounded-md hover:bg-plantita-700 font-medium"
                >
                  Hacer diagnóstico
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {plants.map((plant) => (
                <div
                  key={plant.id}
                  className="bg-white rounded-lg shadow-md border border-plantita-200 overflow-hidden"
                >
                  {/* Imagen de la planta */}
                  {plant.image_url && (
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <img
                        src={plant.image_url}
                        alt={plant.name || plant.species || 'Planta'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Información de la planta */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      {editingPlant === plant.id ? (
                        <div className="flex-1 mr-2">
                          <input
                            type="text"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="w-full px-2 py-1 border border-plantita-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-plantita-500"
                            placeholder="Nombre de la planta"
                          />
                        </div>
                      ) : (
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-plantita-800">
                            {plant.name || 'Planta sin nombre'}
                          </h3>
                          {plant.species && (
                            <span className="text-xs text-green-700 block font-medium mt-1">
                              {plant.species}
                            </span>
                          )}
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        {editingPlant === plant.id ? (
                          <>
                            <button
                              onClick={() => handleSaveName(plant.id)}
                              className="text-green-600 hover:text-green-700"
                              title="Guardar"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                            <button
                              onClick={handleCancelEdit}
                              className="text-red-600 hover:text-red-700"
                              title="Cancelar"
                            >
                              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          </>
                        ) : (
                          <button
                            onClick={() => handleEditName(plant)}
                            className="text-gray-400 hover:text-plantita-600"
                            title="Editar nombre"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>

                    <span className="text-xs text-gray-500 block mb-3">
                      {formatDate(plant.created_at)}
                    </span>

                    {plant.description && (
                      <p className="text-gray-600 text-sm mb-4">{plant.description}</p>
                    )}

                    {/* Estadísticas */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <span>
                        {plant.diagnoses?.length || 0} diagnóstico
                        {plant.diagnoses?.length !== 1 ? 's' : ''}
                      </span>
                      <span>
                        Último:{' '}
                        {plant.diagnoses?.[0] ? formatDate(plant.diagnoses[0].created_at) : 'N/A'}
                      </span>
                    </div>

                    {/* Último diagnóstico */}
                    {plant.diagnoses?.[0] && (
                      <div className="bg-plantita-50 rounded-lg p-3 mb-4">
                        <p className="text-sm text-plantita-800 font-medium mb-1">
                          Último diagnóstico:
                        </p>
                        <div className="text-sm text-plantita-700 line-clamp-3">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {plant.diagnoses[0].diagnosis_text.substring(0, 300)}
                          </ReactMarkdown>
                        </div>
                      </div>
                    )}

                    {/* Botones de acción */}
                    <div className="space-y-2">
                      <Link
                        href={`/plantas/${plant.id}`}
                        className="w-full bg-plantita-600 text-white py-2 px-4 rounded-md hover:bg-plantita-700 font-medium text-sm text-center block"
                      >
                        Ver historial completo
                      </Link>
                      <button
                        onClick={() => handleNewDiagnosis(plant)}
                        className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 font-medium text-sm"
                      >
                        Nuevo diagnóstico
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
