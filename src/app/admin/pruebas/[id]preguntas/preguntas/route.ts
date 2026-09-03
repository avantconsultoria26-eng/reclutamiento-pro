import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { preguntas } = body; // Array de preguntas con sus opciones

    // Crear todas las preguntas y sus opciones en una transacción
    const resultado = await prisma.$transaction(
      preguntas.map((p: any) =>
        prisma.pregunta.create({
          data: {
            pruebaId: params.id,
            texto: p.texto,
            tipo: p.tipo,
            orden: p.orden,
            puntaje: p.puntaje,
            opciones: {
              create: p.opciones.map((op: any, index: number) => ({
                texto: op.texto,
                esCorrecta: op.esCorrecta,
                valor: op.valor || 0,
                orden: index,
              })),
            },
          },
        })
      )
    );

    return NextResponse.json({ success: true, data: resultado }, { status: 201 });
  } catch (error) {
    console.error("Error creando preguntas:", error);
    return NextResponse.json(
      { error: "Error al crear las preguntas" },
      { status: 500 }
    );
  }
}