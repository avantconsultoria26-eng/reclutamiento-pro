"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type TipoPrueba = 
  | "PSICOTECNICA"
  | "PERSONALIDAD"
  | "TECNICA"
  | "COMPETENCIAS"
  | "CONOCIMIENTOS"
  | "ACTITUDINAL";

export default function CrearPruebaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    titulo: "",
    descripcion: "",
    tipo: "PSICOTECNICA" as TipoPrueba,
    duracionMinutos: 0,
    puntajeMinimo: 0,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/admin/pruebas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        router.push(`/admin/pruebas/${data.id}/agregar-preguntas`);
      } else {
        alert("Error al crear la prueba");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al crear la prueba");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Crear Nueva Prueba
          </h1>
          <p className="text-gray-600 mb-6">
            Configura los datos generales de la prueba psicotécnica
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Título de la Prueba *
              </label>
              <input
                type="text"
                required
                value={formData.titulo}
                onChange={(e) =>
                  setFormData({ ...formData, titulo: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Ej: Test de Personalidad Big Five"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción *
              </label>
              <textarea
                required
                rows={4}
                value={formData.descripcion}
                onChange={(e) =>
                  setFormData({ ...formData, descripcion: e.target.value })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder="Describe el objetivo y características de la prueba..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Prueba *
              </label>
              <select
                value={formData.tipo}
                onChange={(e) =>
                  setFormData({ ...formData, tipo: e.target.value as TipoPrueba })
                }
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              >
                <option value="PSICOTECNICA">Psicotécnica</option>
                <option value="PERSONALIDAD">Personalidad</option>
                <option value="TECNICA">Técnica / Conocimientos</option>
                <option value="COMPETENCIAS">Competencias</option>
                <option value="CONOCIMIENTOS">Conocimientos Generales</option>
                <option value="ACTITUDINAL">Actitudinal</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duración (minutos)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.duracionMinutos}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      duracionMinutos: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="0 = Sin límite"
                />
                <p className="text-xs text-gray-500 mt-1">
                  0 = Sin límite de tiempo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Puntaje Mínimo
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.puntajeMinimo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      puntajeMinimo: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Opcional"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Déjalo en 0 si no hay mínimo
                </p>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {loading ? "Creando..." : "Crear Prueba y Agregar Preguntas"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}