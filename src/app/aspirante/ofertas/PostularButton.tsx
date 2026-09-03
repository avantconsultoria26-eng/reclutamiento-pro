"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PostularButton({ oferta }: { oferta: any }) {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [respuestas, setRespuestas] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState("");
  const router = useRouter();

  const preguntas = oferta.preguntasEliminatorias ? JSON.parse(oferta.preguntasEliminatorias) : [];

  const handlePostular = async () => {
    setLoading(true);
    setMensaje("");

    try {
      console.log("📤 Enviando postulación...");
      console.log("  ofertaId:", oferta.id);
      console.log("  respuestas:", respuestas);
      
      const res = await fetch("/api/aspirante/postulaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ofertaId: oferta.id,
          respuestasEliminatorias: respuestas,
        }),
      });

      console.log("📥 Respuesta recibida, status:", res.status);
      
      const data = await res.json();
      console.log("📦 Data completa recibida del servidor:", data);

      if (!res.ok) {
        throw new Error(data.error || "Error en la respuesta del servidor");
      }

      if (data.rechazado) {
        setMensaje("❌ " + data.message);
        setTimeout(() => {
          setMostrarModal(false);
          router.refresh();
        }, 3000);
      } else {
        setMensaje("✅ " + data.message);
        console.log("🔍 postulacionId recibido:", data.postulacionId);
        
        setTimeout(() => {
          setMostrarModal(false);
          if (data.postulacionId) {
            console.log("🚀 Redirigiendo a pruebas con ID:", data.postulacionId);
            router.push(`/aspirante/pruebas/${data.postulacionId}`);
          } else {
            console.error("❌ No se recibió postulacionId del servidor");
            router.push("/aspirante/ofertas");
          }
        }, 2000);
      }
    } catch (error: any) {
      console.error("❌ Error al postular:", error);
      setMensaje("❌ " + (error.message || "Error al procesar la postulación."));
    } finally {
      setLoading(false);
    }
  };

  // Si no se muestra el modal, mostrar solo el botón
  if (!mostrarModal) {
    return (
      <button 
        onClick={() => setMostrarModal(true)}
        style={{
          backgroundColor: '#2563eb',
          color: 'white',
          padding: '8px 24px',
          borderRadius: '8px',
          fontWeight: '600',
          border: 'none',
          cursor: 'pointer'
        }}
      >
        Postularme
      </button>
    );
  }

  // Modal con estilos inline garantizados
  return (
    <div 
      onClick={() => setMostrarModal(false)}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        padding: '16px'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '24px',
          maxWidth: '500px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
            Requisitos para postularte
          </h3>
          <button 
            onClick={() => setMostrarModal(false)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              color: '#6b7280',
              padding: '0',
              lineHeight: 1
            }}
          >
            ×
          </button>
        </div>
        
        {mensaje ? (
          <div style={{
            padding: '16px',
            borderRadius: '8px',
            textAlign: 'center',
            fontWeight: '600',
            backgroundColor: mensaje.includes('❌') ? '#fee2e2' : '#d1fae5',
            color: mensaje.includes('❌') ? '#dc2626' : '#059669'
          }}>
            {mensaje}
          </div>
        ) : (
          <>
            <p style={{ color: '#4b5563', marginBottom: '16px', fontSize: '14px' }}>
              Responde estas preguntas para continuar. Si no cumples con los requisitos, el sistema no podrá procesar tu postulación.
            </p>
            
            <div style={{ marginBottom: '24px' }}>
              {preguntas.length > 0 ? (
                preguntas.map((p: any, idx: number) => (
                  <div key={idx} style={{ marginBottom: '16px' }}>
                    <p style={{ fontWeight: '500', color: '#374151', marginBottom: '8px', fontSize: '14px' }}>
                      {p.pregunta}
                    </p>
                    <select 
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: '8px',
                        fontSize: '14px',
                        cursor: 'pointer'
                      }}
                      onChange={(e) => setRespuestas({ ...respuestas, [p.pregunta]: e.target.value })}
                      required
                      value={respuestas[p.pregunta] || ""}
                    >
                      <option value="">Selecciona una opción</option>
                      {p.opciones.map((op: string, i: number) => (
                        <option key={i} value={op}>{op}</option>
                      ))}
                    </select>
                  </div>
                ))
              ) : (
                <p style={{ color: '#6b7280', fontStyle: 'italic' }}>No hay preguntas eliminatorias para esta vacante.</p>
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => setMostrarModal(false)}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handlePostular}
                disabled={loading || (preguntas.length > 0 && Object.keys(respuestas).length < preguntas.length)}
                style={{
                  flex: 1,
                  padding: '8px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: loading || (preguntas.length > 0 && Object.keys(respuestas).length < preguntas.length) ? '#9ca3af' : '#2563eb',
                  color: 'white',
                  fontWeight: '600',
                  cursor: loading || (preguntas.length > 0 && Object.keys(respuestas).length < preguntas.length) ? 'not-allowed' : 'pointer'
                }}
              >
                {loading ? "Evaluando..." : "Enviar Postulación"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}