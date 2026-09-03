import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminPruebasPage() {
  const pruebas = await prisma.prueba.findMany({
    include: {
      preguntas: {
        select: {
          id: true,
          texto: true,
          tipo: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-900 text-white py-6 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Panel de Administración - Pruebas</h1>
          <p className="text-blue-200 mt-1">Gestiona las pruebas psicotécnicas y de selección</p>
        </div>
      </header>

      {/* Contenido */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Banco de Pruebas</h2>
          <Link
            href="/admin/pruebas/crear"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
          >
            <span>+</span> Crear Nueva Prueba
          </Link>
        </div>

        {pruebas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <div className="text-6xl mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No hay pruebas creadas
            </h3>
            <p className="text-gray-500 mb-4">
              Comienza creando tu primera prueba psicotécnica
            </p>
            <Link
              href="/admin/pruebas/crear"
              className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Crear Primera Prueba
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {pruebas.map((prueba) => (
              <div
                key={prueba.id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">
                        {prueba.titulo}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          prueba.activa
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {prueba.activa ? "Activa" : "Inactiva"}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3">{prueba.descripcion}</p>
                    <div className="flex flex-wrap gap-3 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        📋 Tipo: {prueba.tipo}
                      </span>
                      <span className="flex items-center gap-1">
                        ❓ {prueba.preguntas.length} preguntas
                      </span>
                      {prueba.duracionMinutos > 0 && (
                        <span className="flex items-center gap-1">
                          ⏱️ {prueba.duracionMinutos} minutos
                        </span>
                      )}
                      {prueba.puntajeMinimo && (
                        <span className="flex items-center gap-1">
                           Mínimo: {prueba.puntajeMinimo} pts
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/pruebas/${prueba.id}/editar`}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold hover:bg-blue-200 transition"
                    >
                      Editar
                    </Link>
                    <Link
                      href={`/admin/pruebas/${prueba.id}/resultados`}
                      className="bg-green-100 text-green-700 px-4 py-2 rounded-lg font-semibold hover:bg-green-200 transition"
                    >
                      Resultados
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}