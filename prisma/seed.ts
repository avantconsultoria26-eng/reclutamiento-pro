import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Iniciando seed de datos...");

  // ============================================
  // 1. CREAR LA VACANTE: ASESOR DE VENTAS TELEFONÍA
  // ============================================
  const oferta = await prisma.ofertaEmpleo.create({
    data: {
      titulo: "Asesor de Ventas - Telefonía y Call Center",
      descripcion: `Buscamos una persona con excelente actitud de servicio, orientación al cliente, organización y compromiso, capaz de desenvolverse en un ambiente dinámico y orientado al cumplimiento de resultados.

PRINCIPALES RESPONSABILIDADES:
• Brindar una excelente atención y asesoría a los clientes.
• Realizar el cierre de ventas y cumplir con las metas comerciales.
• Administrar de manera responsable el inventario y la caja.
• Mantener el punto de venta organizado y ofrecer una experiencia de servicio de calidad.

PERFIL QUE BUSCAMOS:
• Persona con experiencia en ventas de telefonía y Call Center.
• Persona organizada, disciplinada y responsable.
• Honestidad y alto sentido de compromiso.
• Excelente actitud de servicio y tolerancia para atender altos flujos de clientes.
• Orientación al logro y trabajo en equipo.

CONDICIONES LABORALES:
• Ciudad: Medellín.
• Tipo de contrato: Término fijo.
• Salario: Salario mínimo legal vigente + comisiones por cierre de ventas.
• Las comisiones son variables de acuerdo con el número de ventas y los indicadores de cartera vigentes.
• Horario: Lunes a sábado de 9:30 a. m. a 6:00 p. m.
• No se laboran domingos ni festivos.

IMPORTANTE: Esta vacante corresponde a una empresa cliente de Avant Consultoría de Talento Humano. El proceso de reclutamiento y selección es realizado por Avant, pero la contratación será directamente con la empresa cliente.`,
      ubicacion: "Medellín",
      salario: "$1.750.905 + comisiones variables",
      salarioMin: 1750905,
      salarioMax: 2500000,
      modalidad: "Presencial",
      nivelJerarquico: "OPERATIVO_BASE",
      estado: true,
      
      // 🔴 PREGUNTAS ELIMINATORIAS (FILTRO CERO)
      preguntasEliminatorias: JSON.stringify([
        {
          id: "q1",
          pregunta: "¿Cuenta con experiencia en ventas de telefonía o Call Center?",
          opciones: ["Sí, tengo experiencia", "Tengo experiencia en ventas pero no en telefonía", "No tengo experiencia"],
          respuestaCorrecta: "Sí, tengo experiencia",
          esEliminatoria: true,
          justificacion: "Requisito indispensable del cargo"
        },
        {
          id: "q2",
          pregunta: "¿Su pretensión salarial está entre $1.750.905 y $2.500.000 COP?",
          opciones: ["Sí, está en ese rango", "No, es menor", "No, es mayor"],
          respuestaCorrecta: "Sí, está en ese rango",
          esEliminatoria: true,
          justificacion: "Presupuesto de la vacante"
        },
        {
          id: "q3",
          pregunta: "¿Tiene disponibilidad para trabajar de lunes a sábado de 9:30 a.m. a 6:00 p.m.?",
          opciones: ["Sí, tengo disponibilidad completa", "Tengo disponibilidad parcial", "No tengo disponibilidad"],
          respuestaCorrecta: "Sí, tengo disponibilidad completa",
          esEliminatoria: true,
          justificacion: "Horario fijo del cargo"
        },
        {
          id: "q4",
          pregunta: "¿Reside en Medellín o tiene disponibilidad para trabajar presencial en esta ciudad?",
          opciones: ["Sí, resido en Medellín", "No resido en Medellín pero puedo trasladarme", "No puedo trabajar en Medellín"],
          respuestaCorrecta: "Sí, resido en Medellín",
          esEliminatoria: true,
          justificacion: "El cargo es 100% presencial en Medellín"
        },
        {
          id: "q5",
          pregunta: "¿Cuenta con bachillerato completo o título tecnológico?",
          opciones: ["Sí, bachillerato completo", "Sí, título tecnológico o superior", "No, no he terminado el bachillerato"],
          respuestaCorrecta: "Sí, título tecnológico o superior",
          esEliminatoria: true,
          justificacion: "Requisito educativo mínimo"
        }
      ]),
    },
  });

  console.log(`✅ Vacante creada: "${oferta.titulo}" (ID: ${oferta.id})`);

  // ============================================
  // 2. CREAR PRUEBAS PSICOMÉTRICAS PARA NIVEL OPERATIVO BASE
  // ============================================
  
  // Prueba 1: Atención y Concentración
  const pruebaAtencion = await prisma.prueba.create({
    data: {
      titulo: "Test de Atención y Concentración (d2 Adaptado)",
      descripcion: "Evalúa la capacidad de concentración, velocidad de procesamiento y precisión en tareas rutinarias. Fundamental para roles operativos que requieren manejo de caja e inventario.",
      tipo: "PSICOTECNICA",
      duracionMinutos: 15,
      puntajeMinimo: 60,
      activa: true,
      preguntas: {
        create: [
          {
            texto: "En la siguiente serie de caracteres, ¿cuántas letras 'd' con DOS rayitas (arriba y abajo) hay? d' d'' d' d'' d' d'' d' d'' d' d''",
            tipo: "OPCION_MULTIPLE",
            orden: 1,
            puntaje: 1,
            opciones: {
              create: [
                { texto: "3", esCorrecta: false, valor: 0, orden: 1 },
                { texto: "5", esCorrecta: true, valor: 1, orden: 2 },
                { texto: "7", esCorrecta: false, valor: 0, orden: 3 },
                { texto: "4", esCorrecta: false, valor: 0, orden: 4 },
              ],
            },
          },
          {
            texto: "Si debe revisar 120 productos en 30 minutos y ya revisó 45 en 10 minutos, ¿va al ritmo correcto?",
            tipo: "OPCION_MULTIPLE",
            orden: 2,
            puntaje: 1,
            opciones: {
              create: [
                { texto: "Sí, voy bien", esCorrecta: false, valor: 0, orden: 1 },
                { texto: "No, voy más lento de lo requerido", esCorrecta: true, valor: 1, orden: 2 },
                { texto: "No, voy más rápido", esCorrecta: false, valor: 0, orden: 3 },
              ],
            },
          },
          {
            texto: "Un cliente le entrega un billete de $50.000 por una compra de $37.500. ¿Cuánto debe devolver?",
            tipo: "OPCION_MULTIPLE",
            orden: 3,
            puntaje: 1,
            opciones: {
              create: [
                { texto: "$12.500", esCorrecta: true, valor: 1, orden: 1 },
                { texto: "$13.500", esCorrecta: false, valor: 0, orden: 2 },
                { texto: "$11.500", esCorrecta: false, valor: 0, orden: 3 },
                { texto: "$12.000", esCorrecta: false, valor: 0, orden: 4 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Prueba creada: "${pruebaAtencion.titulo}" (ID: ${pruebaAtencion.id})`);

  // Prueba 2: Personalidad - Big Five (adaptada)
  const pruebaPersonalidad = await prisma.prueba.create({
    data: {
      titulo: "Inventario de Personalidad - Big Five (Versión Corta)",
      descripcion: "Evalúa los 5 grandes rasgos de personalidad: Apertura, Responsabilidad, Extraversión, Amabilidad y Estabilidad Emocional. Importante para evaluar ajuste al rol de atención al cliente.",
      tipo: "PERSONALIDAD",
      duracionMinutos: 10,
      puntajeMinimo: null, // No hay mínimo, es descriptiva
      activa: true,
      preguntas: {
        create: [
          {
            texto: "Me siento cómodo(a) interactuando con muchas personas durante todo el día.",
            tipo: "ESCALA_LIKERT",
            orden: 1,
            puntaje: 1,
            opciones: {
              create: [
                { texto: "Totalmente en desacuerdo", esCorrecta: false, valor: 1, orden: 1 },
                { texto: "En desacuerdo", esCorrecta: false, valor: 2, orden: 2 },
                { texto: "Neutral", esCorrecta: false, valor: 3, orden: 3 },
                { texto: "De acuerdo", esCorrecta: true, valor: 4, orden: 4 },
                { texto: "Totalmente de acuerdo", esCorrecta: true, valor: 5, orden: 5 },
              ],
            },
          },
          {
            texto: "Soy una persona organizada y cumplo con mis responsabilidades puntualmente.",
            tipo: "ESCALA_LIKERT",
            orden: 2,
            puntaje: 1,
            opciones: {
              create: [
                { texto: "Totalmente en desacuerdo", esCorrecta: false, valor: 1, orden: 1 },
                { texto: "En desacuerdo", esCorrecta: false, valor: 2, orden: 2 },
                { texto: "Neutral", esCorrecta: false, valor: 3, orden: 3 },
                { texto: "De acuerdo", esCorrecta: true, valor: 4, orden: 4 },
                { texto: "Totalmente de acuerdo", esCorrecta: true, valor: 5, orden: 5 },
              ],
            },
          },
          {
            texto: "Mantengo la calma incluso cuando hay muchos clientes esperando.",
            tipo: "ESCALA_LIKERT",
            orden: 3,
            puntaje: 1,
            opciones: {
              create: [
                { texto: "Totalmente en desacuerdo", esCorrecta: false, valor: 1, orden: 1 },
                { texto: "En desacuerdo", esCorrecta: false, valor: 2, orden: 2 },
                { texto: "Neutral", esCorrecta: false, valor: 3, orden: 3 },
                { texto: "De acuerdo", esCorrecta: true, valor: 4, orden: 4 },
                { texto: "Totalmente de acuerdo", esCorrecta: true, valor: 5, orden: 5 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Prueba creada: "${pruebaPersonalidad.titulo}" (ID: ${pruebaPersonalidad.id})`);

  // Prueba 3: Razonamiento Numérico Básico
  const pruebaNumerica = await prisma.prueba.create({
    data: {
      titulo: "Test de Razonamiento Numérico Básico",
      descripcion: "Evalúa habilidades matemáticas básicas necesarias para el manejo de caja, inventario y cálculos comerciales.",
      tipo: "CONOCIMIENTOS",
      duracionMinutos: 10,
      puntajeMinimo: 50,
      activa: true,
      preguntas: {
        create: [
          {
            texto: "Si un producto cuesta $25.000 y tiene un descuento del 20%, ¿cuál es el precio final?",
            tipo: "OPCION_MULTIPLE",
            orden: 1,
            puntaje: 1,
            opciones: {
              create: [
                { texto: "$20.000", esCorrecta: true, valor: 1, orden: 1 },
                { texto: "$22.500", esCorrecta: false, valor: 0, orden: 2 },
                { texto: "$18.000", esCorrecta: false, valor: 0, orden: 3 },
                { texto: "$23.000", esCorrecta: false, valor: 0, orden: 4 },
              ],
            },
          },
          {
            texto: "Un cliente compra 3 productos a $15.000 cada uno y paga con $50.000. ¿Cuánto cambio recibe?",
            tipo: "OPCION_MULTIPLE",
            orden: 2,
            puntaje: 1,
            opciones: {
              create: [
                { texto: "$5.000", esCorrecta: true, valor: 1, orden: 1 },
                { texto: "$4.500", esCorrecta: false, valor: 0, orden: 2 },
                { texto: "$6.000", esCorrecta: false, valor: 0, orden: 3 },
                { texto: "$3.500", esCorrecta: false, valor: 0, orden: 4 },
              ],
            },
          },
        ],
      },
    },
  });

  console.log(`✅ Prueba creada: "${pruebaNumerica.titulo}" (ID: ${pruebaNumerica.id})`);

  console.log("\n Seed completado exitosamente!");
  console.log("📊 Resumen:");
  console.log(`   - 1 vacante: ${oferta.titulo}`);
  console.log(`   - 3 pruebas psicométricas para Nivel Operativo Base`);
  console.log(`   - 5 preguntas eliminatorias configuradas`);
}

main()
  .catch((e) => {
    console.error(" Error en el seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });