import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const DiagnosisResult = ({ diagnosis, isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 border border-plantita-200">
        <div className="flex items-center space-x-3">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-plantita-600"></div>
          <p className="text-plantita-700 font-medium">Analizando tu planta...</p>
        </div>
        <p className="text-sm text-gray-500 mt-2">Esto puede tomar unos segundos</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
            <svg className="w-4 h-4 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <p className="text-red-800 font-medium">Error en el diagnóstico</p>
        </div>
        <p className="text-red-700 mt-2">{error}</p>
      </div>
    );
  }

  if (!diagnosis) {
    return null;
  }

  // Extraer el texto del diagnóstico de la nueva estructura { diagnosis: reply }
  const diagnosisText = diagnosis.diagnosis || diagnosis;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-plantita-200">
      <div className="flex items-center space-x-3 mb-4">
        <div className="w-8 h-8 bg-plantita-100 rounded-full flex items-center justify-center">
          <svg className="w-5 h-5 text-plantita-600" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-plantita-800">Diagnóstico de tu planta</h3>
      </div>

      <div className="bg-plantita-50 rounded-lg p-4">
        <article className="prose prose-plantita max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{diagnosisText}</ReactMarkdown>
        </article>
      </div>

      <div className="mt-6 pt-4 border-t border-plantita-200">
        <p className="text-xs text-gray-500 text-center">
          💡 Este diagnóstico es informativo. Para casos graves, consulta con un especialista.
        </p>
      </div>
    </div>
  );
};

export default DiagnosisResult;
