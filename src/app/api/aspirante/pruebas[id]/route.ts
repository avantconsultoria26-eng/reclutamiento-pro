import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const prueba = await prisma.prueba.findUnique({
      where: { id: params.id, activa: true },
      include: {
        preguntas: {
          include: {
            opciones: true,
          },
          orderBy: { orden: "asc" },
        },
      },
    });

    if (!prueba) {
      return NextResponse.json({ error: "Prueba no encontrada" }, { status: 404 });
    }

    // No enviamos "esCorrecta" al frontend por seguridad, pero para este prototipo lo dejaremos
    // En producción, la calificación debe ser 100% del lado del servidor.
    return NextResponse.json(prueba);
  } catch (error) {
    return NextResponse.json({ error: "Error al obtener la prueba" }, { status: 500 });
  }
}