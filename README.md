# AI Wellbeing Journal

AI Wellbeing Journal es una aplicación de diario personal potenciada por inteligencia artificial diseñada para ayudarte a rastrear y mejorar tu bienestar mental. Registra tu estado de ánimo, calidad de sueño, enfoque y batería social diariamente, y recibe diagnósticos y recomendaciones semanales generados por IA.

## Características Principales

- **Registro Diario (Daily Journaling):** Interfaz intuitiva para registrar mood, sueño, enfoque y nivel de energía social.
- **Análisis con IA:** Generación automática de "Diagnósticos Semanales" basados en tus entradas diarias.
- **Seguimiento de Progreso:** Visualización de tus tendencias emocionales y de comportamiento a lo largo del tiempo.
- **Privacidad y Seguridad:** Tus datos son tuyos. (Añadir detalles de seguridad si aplica).
- **Arquitectura Moderna:** Construido con tecnologías web de última generación para rendimiento y escalabilidad.

## Tecnologías Utilizadas

- **Frontend:** [Next.js 16](https://nextjs.org/) (React)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) & [Radix UI](https://www.radix-ui.com/)
- **Base de Datos:** [PostgreSQL](https://www.postgresql.org/)
- **ORM:** [Prisma](https://www.prisma.io/)
- **Autenticación:** [NextAuth.js](https://next-auth.js.org/)
- **Inteligencia Artificial:** [OpenAI API](https://openai.com/)

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- [Node.js](https://nodejs.org/) (Versión LTS recomendada) o [Bun](https://bun.sh/)
- [Docker](https://www.docker.com/) (para la base de datos PostgreSQL local)

## Instalación y Configuración

1.  **Clonar el repositorio:**

    ```bash
    git clone https://github.com/tu-usuario/ai-wellbeing-journal.git
    cd ai-wellbeing-journal
    ```

2.  **Instalar dependencias:**

    ```bash
    bun install
    # o si usas npm
    npm install
    ```

3.  **Configurar variables de entorno:**

    Copia el archivo de ejemplo y configura tus credenciales:

    ```bash
    cp .env.EXAMPLE .env
    ```

    Abre el archivo `.env` y rellena las variables necesarias (DATABASE_URL, OPENAI_API_KEY, NEXTAUTH_SECRET, etc.).

4.  **Levantar la base de datos (Docker):**

    ```bash
    docker-compose up -d
    ```

5.  **Ejecutar migraciones de Prisma:**

    ```bash
    bunx prisma migrate dev
    ```

6.  **Iniciar el servidor de desarrollo:**

    ```bash
    bun dev
    ```

    La aplicación estará disponible en `http://localhost:3000`.

## Scripts Disponibles

- `bun dev`: Inicia el entorno de desarrollo.
- `bun run build`: Construye la aplicación para producción.
- `bun start`: Inicia el servidor de producción.
- `bun run lint`: Ejecuta el linter para mantener la calidad del código.

## Contribuir

¡Las contribuciones son bienvenidas! Por favor, abre un issue o envía un pull request para mejoras y correcciones.
