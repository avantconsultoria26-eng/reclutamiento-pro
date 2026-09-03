import { prisma } from "@/lib/prisma";
import Link from "next/link";
import PostularButton from "./PostularButton";

export default async function OfertasPage() {
  const ofertas = await prisma.ofertaEmpleo.findMany({
    where: { estado: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-blue-900 text-white py-6 shadow-md">
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Portal de Aspirantes</h1>
            <p className="text-blue-200 mt-1">Encuentra el trabajo que deseas</p>
          </div>
          <Link href="/aspirante/login" className="bg-white text-blue-900 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition">
            Cerrar Sesión
          </Link>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Ofertas de Empleo Disponibles</h2>

        {ofertas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-500">No hay ofertas disponibles en este momento.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {ofertas.map((oferta) => (
              <div key={oferta.id} className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-600">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{oferta.titulo}</h3>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        {oferta.nivelJerarquico.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-3">
                      <span>📍 {oferta.ubicacion} {oferta.modalidad && `(${oferta.modalidad})`}</span>
                      {oferta.salario && <span>💰 {oferta.salario}</span>}
                    </div>
                    <div className="text-gray-700 text-sm leading-relaxed">
                      {oferta.descripcion.split('\n').map((parrafo: string, index: number) => (parrafo.trim() && <p key={index} className="mb-2">{parrafo}</p>))}
                    </div>
                  </div>
                  
                  {/* Aquí usamos el componente cliente que creamos */}
                  <PostularButton oferta={oferta} />
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}