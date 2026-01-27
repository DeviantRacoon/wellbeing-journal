import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error("DATABASE_URL no está definida en las variables de entorno");
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = "jesushellerque@gmail.com";

  console.log(`Start seeding for user ${email}...`);

  // Asegurar que el usuario existe
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error("User not found");
  }

  // Limpiar entradas existentes para tener un caso de prueba limpio
  await prisma.dailyEntry.deleteMany({
    where: { userId: user.id },
  });
  await prisma.weeklyDiagnosis.deleteMany({
    where: { userId: user.id },
  });
  console.log("Deleted existing entries and diagnoses.");

  // Array de reflexiones simulando una ruptura reciente y síntomas depresivos
  // Ordenado desde el día más reciente (índice 0) hacia atrás (lo más antiguo)
  const entriesData = [
    {
      content:
        "Hoy apenas pude levantarme de la cama. Fue una lucha física, como si la gravedad fuera más fuerte en mi habitación que en el resto del mundo. Todo me recuerda a ella. Fui al baño y vi su cepillo de dientes, que todavía no he tenido el valor de tirar, y me eché a llorar ahí mismo, sentado en el suelo frío. No tengo hambre, mi estómago se siente cerrado, como un nudo apretado que no deja pasar nada. Pasé la mayor parte del día mirando el techo, contando las grietas para no pensar.",
      mood: 1,
      sleep: 4,
      socialBattery: 1,
      focus: 1,
    },
    {
      content:
        "Intenté trabajar un rato hoy, abrir la laptop y contestar correos, pero mi mente está completamente en blanco. Es como si hubiera una niebla espesa que no me deja conectar ideas. Terminé revisando nuestro chat antiguo una y otra vez, leyendo mensajes de hace meses cuando todo parecía perfecto. Me odio por hacerlo, sé que me hace daño, pero no puedo evitarlo. Me siento patético y débil.",
      mood: 2,
      sleep: 5,
      socialBattery: 1,
      focus: 2,
    },
    {
      content:
        "Salí a caminar para despejarme porque las paredes de la casa se sentían como si se cerraran sobre mí. Fue un error. Vi una pareja feliz en el parque, riéndose y compartiendo un helado, y sentí una punzada física en el pecho. Me sentí peor que antes. ¿Por qué todos parecen estar bien menos yo? ¿Por qué el mundo sigue girando como si nada hubiera pasado mientras mi vida se ha detenido por completo?",
      mood: 1,
      sleep: 3,
      socialBattery: 0,
      focus: 1,
    },
    {
      content:
        "Hablé con mi mamá un poco por teléfono. Me preguntó cómo estaba y le mentí. Le dije que estoy 'bien', que mejorando poco a poco. No quiero preocupar a nadie y tampoco tengo la energía para explicar cómo me siento realmente, porque ni yo lo entiendo del todo. Me siento muy solo, incluso cuando estoy hablando con alguien. Es una soledad que viene de adentro.",
      mood: 2,
      sleep: 5,
      socialBattery: 3,
      focus: 2,
    },
    {
      content:
        "Otra noche de insomnio. Son las 4 de la mañana y sigo dando vueltas en la cama, repasando cada discusión, cada momento silencio. Pienso en qué hice mal, en qué podría haber dicho diferente. Si tan solo hubiera sido más atento, o más cariñoso, o menos terco. La culpa me carcome y no me deja cerrar los ojos.",
      mood: 1,
      sleep: 3,
      socialBattery: 1,
      focus: 1,
    },
    {
      content:
        "Pedí comida rápida otra vez. No tengo energía ni motivación para cocinar algo decente. La cocina está llena de platos sucios y la casa está hecha un desastre, ropa tirada por todas partes, pero sinceramente no me importa. Me da igual si todo se viene abajo, total, ya se siente así por dentro.",
      mood: 2,
      sleep: 6,
      socialBattery: 2,
      focus: 2,
    },
    {
      content:
        "Hoy fue un día gris, tanto el clima como mi estado de ánimo. Literalmente y metafóricamente no salió el sol. No encuentro sentido ni disfrute en las cosas que antes me gustaban. Intenté jugar videojuegos, ver una serie, escuchar música, pero todo me parece insípido, sin color. Es como si hubiera perdido la capacidad de sentir placer.",
      mood: 2,
      sleep: 5,
      socialBattery: 1,
      focus: 2,
    },
    {
      content:
        "Un amigo del trabajo, Carlos, me invitó a salir por unas cervezas. Le inventé una excusa, le dije que tenía fiebre o algo así. La verdad es que no soporto la idea de tener que socializar, de tener que fingir una sonrisa y actuar como si fuera una persona funcional cuando por dentro me estoy desmoronando.",
      mood: 1,
      sleep: 4,
      socialBattery: 0,
      focus: 1,
    },
    {
      content:
        "Soñé con ella anoche. Fue un sueño tan vívido... estábamos viajando juntos, riendo, felices. En el sueño todo estaba bien, no habíamos terminado. Despertar y darme cuenta de la realidad, ver el lado vacío de la cama, fue como recibir un golpe físico en el estómago. Me tomó horas levantarse.",
      mood: 1,
      sleep: 4,
      socialBattery: 1,
      focus: 1,
    },
    {
      content:
        "Cometí el error de poner mi playlist en aleatorio y sonó 'nuestra' canción, esa que bailamos en el aniversario. Fue instantáneo, las lágrimas empezaron a brotar sin control. Pasé la tarde llorando en el sofá, abrazado a una almohada, sintiéndome como un niño pequeño y perdido.",
      mood: 1,
      sleep: 3,
      socialBattery: 1,
      focus: 1,
    },
    {
      content:
        "Traté de leer un libro para distraerme, uno que tenía pendiente hace tiempo. Leí la misma página diez veces y no retuve ni una sola palabra. Mi concentración es nula, mi cerebro no procesa información nueva, solo recicla dolor y recuerdos.",
      mood: 2,
      sleep: 5,
      socialBattery: 2,
      focus: 1,
    },
    {
      content:
        "Me siento atrapado en un bucle temporal. Cada día es igual de pesado y gris que el anterior. Me pregunto si esto va a terminar alguna vez. ¿Cuándo dejará de doler? La gente dice que 'el tiempo lo cura todo', pero ahora mismo el tiempo parece ser mi enemigo, pasando lento y doloroso.",
      mood: 2,
      sleep: 4,
      socialBattery: 1,
      focus: 2,
    },
    {
      content:
        "Hoy tuve un momento de ira repentina. Se me cayó un vaso de agua y lo vi romperse, y en lugar de limpiarlo, grité y pateé la mesa. Me asusté de mi propia reacción. Estoy muy inestable, mis emociones están a flor de piel y cualquier cosa pequeña me detona.",
      mood: 1,
      sleep: 5,
      socialBattery: 2,
      focus: 1,
    },
    {
      content:
        "No sé quién soy sin ella. Durante años fuimos un equipo, 'nosotros'. Todo mi futuro estaba planeado a su lado: los viajes, la casa, todo. Ahora miro hacia adelante y solo veo niebla espesa. He perdido mi brújula y mi mapa.",
      mood: 2,
      sleep: 4,
      socialBattery: 1,
      focus: 2,
    },
    {
      content:
        "Me forcé a ducharme y afeitarme hoy. Es el primer logro 'real' que tengo en días. El agua caliente ayudó un poco a relajar la tensión de mis hombros. Me sentí un poco mejor, o menos peor, por unos 5 minutos antes de que la realidad volviera a asentarse.",
      mood: 3,
      sleep: 6,
      socialBattery: 3,
      focus: 3,
    },
    {
      content:
        "Revisé sus redes sociales, sabía que no debía hacerlo. Instagram me mostró que salió con sus amigas. Se veía... bien. Parece que ella ya siguió adelante, que no le duele tanto como a mí. Eso me destrozó, me siento reemplazable y olvidado.",
      mood: 1,
      sleep: 3,
      socialBattery: 0,
      focus: 1,
    },
    {
      content:
        "La ansiedad en el pecho no se va. Es como un peso constante, un elefante sentado sobre mis costillas que no me deja respirar profundo. Tengo taquicardia a ratos sin razón aparente, solo por existir.",
      mood: 2,
      sleep: 4,
      socialBattery: 1,
      focus: 2,
    },
    {
      content:
        "Fui a la oficina hoy, pero fui un zombi. Me senté frente a la pantalla y moví el mouse para parecer ocupado. Mi jefe me preguntó si estaba bien porque me veía pálido. Le dije que 'solo un poco cansado'. No quiero que me tengan lástima en el trabajo.",
      mood: 2,
      sleep: 5,
      socialBattery: 2,
      focus: 2,
    },
    {
      content:
        "Extraño su risa. Es estúpido y cliché, pero extraño cómo arrugaba la nariz cuando se reía de verdad. Extraño hasta sus manías que antes me molestaban, como dejar las luces prendidas. Daría lo que fuera por apagar una luz detrás de ella una vez más.",
      mood: 2,
      sleep: 4,
      socialBattery: 1,
      focus: 1,
    },
    {
      content:
        "El primer día 'oficial' sin ella. Se siente irreal, como si estuviera actuando en una película mala. Sigo esperando que suene mi teléfono con un mensaje suyo diciendo que fue un error, o que abra la puerta. La negación es fuerte hoy.",
      mood: 1,
      sleep: 2,
      socialBattery: 0,
      focus: 0,
    },
  ];

  for (let i = 0; i < entriesData.length; i++) {
    const entry = entriesData[i];
    const date = new Date();
    date.setDate(date.getDate() - i);
    // Variar las horas para que no sean todas iguales, simulando tarde/noche
    date.setHours(
      Math.floor(Math.random() * 4) + 18, // Entre 18:00 y 22:00
      Math.floor(Math.random() * 60),
    );

    await prisma.dailyEntry.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
        content: entry.content,
        mood: entry.mood,
        sleep: entry.sleep,
        socialBattery: entry.socialBattery,
        focus: entry.focus,
        createdAt: date,
      },
    });
  }

  console.log("Seeding finished.");

  // Reset sequence for User id to avoid unique constraint errors
  try {
    await prisma.$executeRawUnsafe(
      `SELECT setval(pg_get_serial_sequence('"User"', 'id'), coalesce(max(id)+1, 1), false) FROM "User";`,
    );
    console.log("User sequence reset.");
  } catch (error) {
    console.warn(
      "Could not reset sequence (might not be needed if not using Postgres):",
      error,
    );
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
