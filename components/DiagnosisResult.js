import { SignUpButton, SignedOut } from '@clerk/nextjs';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DiagnosisResult = ({ diagnosis, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-plantita-200 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-plantita-600 mx-auto"></div>
          <p className="text-plantita-700 font-medium mt-4">Analizando tu planta...</p>
          <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-red-800 font-medium mt-4">Error en el diagnóstico</p>
          <p className="text-red-700 mt-2">{error}</p>
        </div>
      </div>
    );
  }

  if (diagnosis) {
    const diagnosisText = diagnosis.diagnosis || diagnosis;
    const isAuthenticated = diagnosis.isAuthenticated;
    const detectedSpecies = diagnosis.detectedSpecies;

    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-plantita-200">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-plantita-100 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-plantita-600" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM9 12a1 1 0 112 0 1 1 0 01-2 0zM9 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-plantita-800">Diagnóstico de tu planta</h3>
        </div>

        {/* Especie detectada */}
        {detectedSpecies && detectedSpecies !== 'No identificada' && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-green-800 font-medium">
                Especie detectada: {detectedSpecies}
              </span>
            </div>
          </div>
        )}

        <div className="bg-plantita-50 rounded-lg p-4">
          <article className="prose prose-plantita max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{diagnosisText}</ReactMarkdown>
          </article>
        </div>

        {/* CTA para usuarios anónimos */}
        <SignedOut>
          <div className="mt-6 p-4 bg-gradient-to-r from-plantita-50 to-plantita-100 rounded-lg border border-plantita-200">
            <div className="text-center">
              <p className="text-plantita-800 font-medium mb-3">
                ¿Querés guardar este diagnóstico y hacerle seguimiento a esta planta?
              </p>
              <SignUpButton mode="modal">
                <button className="bg-plantita-600 text-white px-6 py-2 rounded-md hover:bg-plantita-700 font-medium transition-colors">
                  Crear cuenta gratis
                </button>
              </SignUpButton>
              <p className="text-xs text-plantita-600 mt-2">
                Guardá tus diagnósticos, seguí la evolución de tus plantas y más
              </p>
            </div>
          </div>
        </SignedOut>

        <div className="mt-6 pt-4 border-t border-plantita-200">
          <p className="text-xs text-gray-500 text-center">
            💡 Este diagnóstico es informativo. Para casos graves, consulta con un especialista.
          </p>
        </div>
      </div>
    );
  }

  // Estado inicial / Placeholder
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-dashed border-plantita-200 h-full flex items-center justify-center">
      <div className="text-center">
        <div className="mx-auto w-16 h-16 bg-plantita-50 rounded-full flex items-center justify-center">
          <svg
            className="w-8 h-8 text-plantita-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M11.35 3.836c-.463.066-.92.183-1.374.368-1.584.64-2.986 1.95-3.896 3.634a12.016 12.016 0 00-1.424 5.344c.023.18.044.358.067.535l.003.022c.032.223.065.445.1.666.088.55.215 1.09.382 1.615.17.535.378 1.06.622 1.572.247.518.532.998.854 1.442a11.964 11.964 0 009.96-6.136c.12-.27.23-.545.33-.822.1-.28.19-.564.28-.85.09-.285.17-.572.25-.862.08-.29.15-.58.22-.87.07-.29.14-.578.2-  .868.06-.29.12-.58.17-.87.05-.29.1-.578.14-.868.04-.29.08-.578.11-.868l.02-.13.01-.065c.01-.07.01-.14.02-.21l.01-.07.01-.07.01-.065.01-.07.01-.065c0-.02-.01-.04-.01-.06 0-.02 0-.04-.01-.06 0-.02 0-.04-.01-.06 0-.02 0-.04-.01-.06 0-.02 0-.04-.01-.06l-.01-.07c-.01-.07-.01-.14-.02-.21l-.01-.07-.01-.07-.01-.065c-.01-.07-.02-.14-.03-.21l-.02-.13-.02-.13c-.03-.2-.07-.4-.11-.598-.04-.2-.08-.398-.13-.598-.05-.2-.1-.4-.16-.598-.06-.2-.12-.4-.19-.598-.07-.2-.14-.4-.22-.598a12.002 12.002 0 00-10.45-6.136zM12 14.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 14.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-medium text-plantita-700">Esperando diagnóstico</h3>
        <p className="mt-1 text-sm text-gray-500">Los resultados del análisis aparecerán aquí.</p>
      </div>
    </div>
  );
};

export default DiagnosisResult;
