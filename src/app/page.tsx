import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">Portal de Reclutamiento Inteligente</h1>
        <p className="text-gray-600 mb-8 text-lg">
          Conectamos el mejor talento con las mejores oportunidades.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/aspirante/login" 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition shadow-md"
          >
            Soy Aspirante
          </Link>
          <Link 
            href="/aspirante/registro" 
            className="px-6 py-3 bg-white text-blue-600 border border-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition shadow-md"
          >
            Registrarme
          </Link>
        </div>
      </div>
    </main>
  );
}