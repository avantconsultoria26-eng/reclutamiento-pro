import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("🔍 DEBUG - Session:", session);
    
    if (!session?.user?.email) {
      console.error("❌ DEBUG - No hay email en sesión");
      return NextResponse.json({ 
        error: "No autorizado. Debes iniciar sesión." 
      }, { status: 401 });
    }

    const body = await request.json();
    console.log("📦 DEBUG - Body:", body);
    
    const { ofertaId, respuestasEliminatorias } = body;

    if (!ofertaId) {
      return NextResponse.json({ 
        error: "Falta el ID de la oferta" 
      }, { status: 400 });
    }

    // Buscar usuario por email
    let user = null;
    
    if (session.user.email) {
      console.log("🔍 Buscando usuario por email:", session.user.email);
      user = await prisma.user.findUnique({
        where: { email: session.user.email },
      });
    }

    if (!user) {
      console.log("⚠️ Buscando primer usuario ASPIRANTE");
      user = await prisma.user.findFirst({
        where: { rol: "ASPIRANTE" },
      });
    }

    if (!user) {
      console.error("❌ No hay usuarios ASPIRANTE");
      return NextResponse.json({ 
        error: "Usuario no encontrado" 
      }, { status: 404 });
    }

    console.log("✅ Usuario encontrado:", user.email);

    // Obtener la oferta
    const oferta = await prisma.ofertaEmpleo.findUnique({
      where: { id: ofertaId },
    });

    if (!oferta) {
      return NextResponse.json({ 
        error: "Oferta no encontrada" 
      }, { status: 404 });
    }

    // Evaluar respuestas eliminatorias
    let rechazado = false;
    if (oferta.preguntasEliminatorias) {
      const preguntas = JSON.parse(oferta.preguntasEliminatorias as string);
      
      for (const p of preguntas) {
        const respuestaCandidato = respuestasEliminatorias?.[p.pregunta];
        
        if (respuestaCandidato !== p.respuestaCorrecta) {
          rechazado = true;
          break;
        }
      }
    }

    // Crear la postulación
    const postulacion = await prisma.postulacion.create({
      data: {
        userId: user.id,
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
        ? "Lo sentimos, no cumples con los requisitos mínimos." 
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