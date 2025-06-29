'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { supabase } from '../../../lib/supabase.js';

export default function PlantaDetailPage() {
  const { user, isSignedIn } = useUser();
  const params = useParams();
  const plantId = params.id;

  const [plant, setPlant] = useState(null);
  const [diagnoses, setDiagnoses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isSignedIn && user && plantId) {
      fetchPlantDetails();
    }
  }, [isSignedIn, user, plantId]);

  const fetchPlantDetails = async () => {
    try {
      setLoading(true);

      // Obtener la planta
      const { data: plantData, error: plantError } = await supabase
        .from('plants')
        .select('*')
        .eq('id', plantId)
        .eq('user_id', user.id)
        .single();

      if (plantError) {
        console.error('Error fetching plant:', plantError);
        setError('Planta no encontrada');
        return;
      }

      setPlant(plantData);

      // Obtener los diagnósticos
      const { data: diagnosesData, error: diagnosesError } = await supabase
        .from('diagnoses')
        .select('*')
        .eq('plant_id', plantId)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (diagnosesError) {
        console.error('Error fetching diagnoses:', diagnosesError);
        setError('Error al cargar los diagnósticos');
      } else {
        setDiagnoses(diagnosesData || []);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al cargar los datos');
    } finally {
      setLoading(false);
    }
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
                Necesitas iniciar sesión para ver esta planta.
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
            <Link href="/plantas" className="text-plantita-600 hover:text-plantita-700 font-medium">
              ← Volver a Mis Plantas
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-plantita-600 mx-auto"></div>
              <p className="text-plantita-700 mt-4">Cargando planta...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto">
                <p className="text-red-800">{error}</p>
                <Link
                  href="/plantas"
                  className="mt-4 inline-block bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Volver a Mis Plantas
                </Link>
              </div>
            </div>
          ) : plant ? (
            <>
              {/* Información de la planta */}
              <div className="bg-white rounded-lg shadow-md border border-plantita-200 mb-8 overflow-hidden">
                <div className="md:flex">
                  {/* Imagen */}
                  {plant.image_url && (
                    <div className="md:w-1/3 h-64 md:h-auto bg-gray-100">
                      <img
                        src={plant.image_url}
                        alt={plant.species || 'Planta'}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}

                  {/* Información */}
                  <div className="md:w-2/3 p-6">
                    <h1 className="text-2xl font-bold text-plantita-800 mb-2">
                      {plant.name || 'Planta sin nombre'}
                    </h1>
                    {plant.species && (
                      <div className="text-green-700 font-medium mb-2">{plant.species}</div>
                    )}

                    <div className="text-sm text-gray-500 mb-4">
                      Registrada el {formatDate(plant.created_at)}
                    </div>

                    {plant.description && (
                      <div className="mb-4">
                        <h3 className="text-sm font-medium text-plantita-700 mb-1">Descripción:</h3>
                        <p className="text-gray-600">{plant.description}</p>
                      </div>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>
                        {diagnoses.length} diagnóstico{diagnoses.length !== 1 ? 's' : ''}
                      </span>
                      <span>
                        Último: {diagnoses[0] ? formatDate(diagnoses[0].created_at) : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Historial de diagnósticos */}
              <div className="bg-white rounded-lg shadow-md border border-plantita-200">
                <div className="p-6 border-b border-plantita-200">
                  <h2 className="text-xl font-semibold text-plantita-800">
                    Historial de Diagnósticos
                  </h2>
                </div>

                {diagnoses.length === 0 ? (
                  <div className="p-6 text-center">
                    <p className="text-gray-500">
                      No hay diagnósticos registrados para esta planta.
                    </p>
                  </div>
                ) : (
                  <div className="divide-y divide-plantita-100">
                    {diagnoses.map((diagnosis, index) => (
                      <div key={diagnosis.id} className="p-6">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-lg font-medium text-plantita-800">
                            Diagnóstico #{diagnoses.length - index}
                          </h3>
                          <span className="text-sm text-gray-500">
                            {formatDate(diagnosis.created_at)}
                          </span>
                        </div>

                        <div className="bg-plantita-50 rounded-lg p-4">
                          <div className="prose prose-plantita max-w-none">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {diagnosis.diagnosis_text}
                            </ReactMarkdown>
                          </div>
                        </div>

                        {diagnosis.care_suggestions && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                            <h4 className="text-sm font-medium text-blue-800 mb-1">
                              Sugerencias de cuidado:
                            </h4>
                            <p className="text-sm text-blue-700">{diagnosis.care_suggestions}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </main>
    </div>
  );
}
