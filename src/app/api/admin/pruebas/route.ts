import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { titulo, descripcion, tipo, duracionMinutos, puntajeMinimo } = body;

    const prueba = await prisma.prueba.create({
      data: {
        titulo,
        descripcion,
        tipo,
        duracionMinutos: duracionMinutos || 0,
        puntajeMinimo: puntajeMinimo || null,
        activa: true,
      },
    });

    return NextResponse.json(prueba, { status: 201 });
  } catch (error) {
    console.error("Error creando prueba:", error);
    return NextResponse.json(
      { error: "Error al crear la prueba" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const pruebas = await prisma.prueba.findMany({
      include: {
        _count: {
          select: {
            preguntas: true,
            resultados: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(pruebas);
  } catch (error) {
    console.error("Error obteniendo pruebas:", error);
    return NextResponse.json(
      { error: "Error al obtener las pruebas" },
      { status: 500 }
    );
  }
}