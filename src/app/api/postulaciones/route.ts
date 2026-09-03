import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    console.log(" Session:", session);
    
    if (!session?.user?.id) {
      console.error("❌ No hay sesión de usuario");
      return NextResponse.json({ 
        error: "No autorizado. Debes iniciar sesión." 
      }, { status: 401 });
    }

    const body = await request.json();
    console.log("📦 Body recibido:", body);
    
    const { ofertaId, respuestasEliminatorias } = body;

    if (!ofertaId) {
      return NextResponse.json({ 
        error: "Falta el ID de la oferta" 
      }, { status: 400 });
    }

    // 1. Obtener la oferta y sus preguntas eliminatorias
    const oferta = await prisma.ofertaEmpleo.findUnique({
      where: { id: ofertaId },
    });

    if (!oferta) {
      return NextResponse.json({ 
        error: "Oferta no encontrada" 
      }, { status: 404 });
    }

    console.log("✅ Oferta encontrada:", oferta.titulo);

    // 2. Evaluar respuestas eliminatorias (si existen)
    let rechazado = false;
    if (oferta.preguntasEliminatorias) {
      const preguntas = JSON.parse(oferta.preguntasEliminatorias as string);
      console.log("❓ Preguntas eliminatorias:", preguntas.length);
      
      for (const p of preguntas) {
        const respuestaCandidato = respuestasEliminatorias[p.pregunta];
        console.log(`Pregunta: ${p.pregunta}`);
        console.log(`  Respuesta correcta: ${p.respuestaCorrecta}`);
        console.log(`  Respuesta candidato: ${respuestaCandidato}`);
        
        if (respuestaCandidato !== p.respuestaCorrecta) {
          rechazado = true;
          console.log("❌ Respuesta incorrecta - Candidato rechazado");
          break;
        }
      }
    }

    // 3. Crear la postulación con el estado correspondiente
    const postulacion = await prisma.postulacion.create({
      data: {
        userId: session.user.id,
        ofertaId,
        estadoEmbudo: rechazado ? "RECHAZADO_ELIMINATORIA" : "REVISION_CV",
        respuestasEliminatorias: respuestasEliminatorias || {},
      },
    });

    console.log("✅ Postulación creada:", postulacion.id);

    return NextResponse.json({ 
      success: true, 
      rechazado,
      message: rechazado 
        ? "Lo sentimos, no cumples con los requisitos mínimos para esta vacante." 
        : "¡Postulación exitosa! Tu perfil está en revisión.",
      postulacionId: postulacion.id
    });

  } catch (error) {
    console.error("❌ Error en postulación:", error);
    return NextResponse.json({ 
      error: "Error al procesar la postulación" 
    }, { status: 500 });
  }
}