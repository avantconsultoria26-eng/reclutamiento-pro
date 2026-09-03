import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { respuestas } = body; // { "preguntaId": "opcionId" }

    const prueba = await prisma.prueba.findUnique({
      where: { id: params.id },
      include: { preguntas: { include: { opciones: true } } },
    });

    if (!prueba) return NextResponse.json({ error: "Prueba no encontrada" }, { status: 404 });

    let puntajeObtenido = 0;
    let puntajeTotal = 0;

    // Calificar
    const respuestasParaGuardar = [];
    for (const pregunta of prueba.preguntas) {
      puntajeTotal += pregunta.puntaje;
      const opcionIdSeleccionada = respuestas[pregunta.id];
      const opcionSeleccionada = pregunta.opciones.find((op: any) => op.id === opcionIdSeleccionada);
      
      const esCorrecta = opcionSeleccionada?.esCorrecta || false;
      const puntajePregunta = esCorrecta ? pregunta.puntaje : 0;
      
      if (esCorrecta) puntajeObtenido += puntajePregunta;

      respuestasParaGuardar.push({
        preguntaId: pregunta.id,
        opcionId: opcionIdSeleccionada,
        esCorrecta,
        puntajeObtenido: puntajePregunta,
        tiempoRespuesta: 0, // Se puede mejorar con tracking de tiempo real
      });
    }

    const porcentaje = puntajeTotal > 0 ? (puntajeObtenido / puntajeTotal) * 100 : 0;
    const estado = prueba.puntajeMinimo && porcentaje >= (prueba.puntajeMinimo / puntajeTotal) * 100 
      ? "APROBADA" 
      : (puntajeObtenido > 0 ? "COMPLETADA" : "REPROBADA");

    // Guardar resultado
    const resultado = await prisma.resultadoPrueba.create({
      data: {
        pruebaId: params.id,
        // postulacionId: "PENDIENTE_DE_VINCULAR", // Se vinculará cuando el aspirante se postule
        puntajeObtenido,
        puntajeTotal,
        porcentaje,
        estado,
        completadoEn: new Date(),
        respuestas: {
          create: respuestasParaGuardar,
        },
      },
    });

    return NextResponse.json({
      success: true,
      puntajeObtenido,
      puntajeTotal,
      porcentaje: porcentaje.toFixed(1),
      estado,
    });
  } catch (error) {
    console.error("Error calificando:", error);
    return NextResponse.json({ error: "Error al calificar la prueba" }, { status: 500 });
  }
}