"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function RealizarPruebaPage() {
  const router = useRouter();
  const params = useParams();
  const pruebaId = params.id as string;

  const [prueba, setPrueba] = useState<any>(null);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState(0);

  useEffect(() => {
    const fetchPrueba = async () => {
      const res = await fetch(`/api/aspirante/pruebas/${pruebaId}`);
      const data = await res.json();
      setPrueba(data);
      if (data.duracionMinutos > 0) {
        setTiempoRestante(data.duracionMinutos * 60);
      }
      setLoading(false);
    };
    fetchPrueba();
  }, [pruebaId]);

  // Temporizador
  useEffect(() => {
    if (tiempoRestante > 0) {
      const timer = setTimeout(() => setTiempoRestante(tiempoRestante - 1), 1000);
      return () => clearTimeout(timer);
    } else if (tiempoRestante === 0 && prueba) {
      handleSubmit(new Event("submit") as any);
    }
  }, [tiempoRestante, prueba]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleSeleccion = (preguntaId: string, opcionId: string) => {
    setRespuestas({ ...respuestas, [preguntaId]: opcionId });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);

    try {
      const response = await fetch(`/api/aspirante/pruebas/${pruebaId}/responder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuestas }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`✅ Prueba completada. Tu puntaje: ${data.puntajeObtenido}/${data.puntajeTotal} (${data.porcentaje}%)`);
        router.push("/aspirante/ofertas"); // Redirigir al dashboard
      } else {
        alert("❌ Error al enviar las respuestas");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Error de conexión");
    } finally {
      setEnviando(false);
    }
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center">Cargando prueba...</div>;
  if (!prueba) return <div className="min-h-screen flex items-center justify-center">Prueba no encontrada</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header de la prueba */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6 sticky top-4 z-10 border-l-4 border-blue-600">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">{prueba.titulo}</h1>
              <p className="text-gray-600 text-sm mt-1">{prueba.descripcion}</p>
            </div>
            {prueba.duracionMinutos > 0 && (
              <div className={`text-xl font-bold px-4 py-2 rounded-lg ${tiempoRestante < 60 ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                ⏱️ {formatTime(tiempoRestante)}
              </div>
            )}
          </div>
        </div>

        {/* Formulario de preguntas */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {prueba.preguntas.map((pregunta: any, idx: number) => (
            <div key={pregunta.id} className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                {idx + 1}. {pregunta.texto}
              </h3>
              <div className="space-y-3">
                {pregunta.opciones.map((opcion: any) => (
                  <label
                    key={opcion.id}
                    className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition"
                  >
                    <input
                      type="radio"
                      name={`pregunta-${pregunta.id}`}
                      value={opcion.id}
                      checked={respuestas[pregunta.id] === opcion.id}
                      onChange={() => handleSeleccion(pregunta.id, opcion.id)}
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      required
                    />
                    <span className="text-gray-700">{opcion.texto}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}

          <div className="sticky bottom-4 bg-white p-4 rounded-xl shadow-lg border border-gray-200 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Respondidas: {Object.keys(respuestas).length} de {prueba.preguntas.length}
            </p>
            <button
              type="submit"
              disabled={enviando || Object.keys(respuestas).length < prueba.preguntas.length}
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {enviando ? "Calificando..." : "Finalizar y Enviar Prueba"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}