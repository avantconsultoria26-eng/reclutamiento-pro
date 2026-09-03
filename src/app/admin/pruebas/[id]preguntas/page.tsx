"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AgregarPreguntasPage() {
  const router = useRouter();
  const params = useParams();
  const pruebaId = params.id as string;

  const [preguntas, setPreguntas] = useState<any[]>([
    { texto: "", tipo: "OPCION_MULTIPLE", puntaje: 1, opciones: [{ texto: "", esCorrecta: false }, { texto: "", esCorrecta: false }] }
  ]);
  const [loading, setLoading] = useState(false);

  const agregarPregunta = () => {
    setPreguntas([
      ...preguntas,
      { texto: "", tipo: "OPCION_MULTIPLE", puntaje: 1, opciones: [{ texto: "", esCorrecta: false }, { texto: "", esCorrecta: false }] }
    ]);
  };

  const agregarOpcion = (indexPregunta: number) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[indexPregunta].opciones.push({ texto: "", esCorrecta: false });
    setPreguntas(nuevasPreguntas);
  };

  const actualizarPregunta = (index: number, campo: string, valor: any) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index][campo] = valor;
    setPreguntas(nuevasPreguntas);
  };

  const actualizarOpcion = (indexPregunta: number, indexOpcion: number, campo: string, valor: any) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[indexPregunta].opciones[indexOpcion][campo] = valor;
    
    // Si es opción múltiple, solo una puede ser correcta
    if (campo === "esCorrecta" && valor === true && nuevasPreguntas[indexPregunta].tipo === "OPCION_MULTIPLE") {
      nuevasPreguntas[indexPregunta].opciones.forEach((op: any, i: number) => {
        if (i !== indexOpcion) op.esCorrecta = false;
      });
    }
    setPreguntas(nuevasPreguntas);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/admin/pruebas/${pruebaId}/preguntas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preguntas }),
      });

      if (response.ok) {
        alert("✅ Preguntas guardadas exitosamente");
        router.push("/admin/pruebas");
      } else {
        alert("❌ Error al guardar las preguntas");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error de conexión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-md p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Agregar Preguntas a la Prueba</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {preguntas.map((pregunta, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-6 bg-gray-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-700">Pregunta {idx + 1}</h3>
                  <select
                    value={pregunta.tipo}
                    onChange={(e) => actualizarPregunta(idx, "tipo", e.target.value)}
                    className="text-sm border border-gray-300 rounded px-2 py-1"
                  >
                    <option value="OPCION_MULTIPLE">Opción Múltiple</option>
                    <option value="ESCALA_LIKERT">Escala Likert (1-5)</option>
                    <option value="VERDADERO_FALSO">Verdadero / Falso</option>
                  </select>
                </div>

                <input
                  type="text"
                  placeholder="Escribe la pregunta aquí..."
                  value={pregunta.texto}
                  onChange={(e) => actualizarPregunta(idx, "texto", e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />

                <div className="space-y-2">
                  {pregunta.opciones.map((opcion: any, opIdx: number) => (
                    <div key={opIdx} className="flex items-center gap-2">
                      <input
                        type={pregunta.tipo === "OPCION_MULTIPLE" || pregunta.tipo === "VERDADERO_FALSO" ? "radio" : "number"}
                        name={`correcta-${idx}`}
                        checked={opcion.esCorrecta}
                        onChange={(e) => {
                          if (pregunta.tipo === "ESCALA_LIKERT") {
                            actualizarOpcion(idx, opIdx, "valor", parseInt(e.target.value));
                          } else {
                            actualizarOpcion(idx, opIdx, "esCorrecta", true);
                          }
                        }}
                        className="w-4 h-4 text-blue-600"
                      />
                      <input
                        type="text"
                        placeholder={`Opción ${opIdx + 1}`}
                        value={opcion.texto}
                        onChange={(e) => actualizarOpcion(idx, opIdx, "texto", e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => agregarOpcion(idx)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  + Agregar otra opción
                </button>
              </div>
            ))}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={agregarPregunta}
                className="flex-1 border-2 border-dashed border-gray-300 text-gray-600 py-3 rounded-lg font-semibold hover:border-blue-500 hover:text-blue-600 transition"
              >
                + Agregar Otra Pregunta
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-400"
              >
                {loading ? "Guardando..." : "Guardar Todas las Preguntas"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}