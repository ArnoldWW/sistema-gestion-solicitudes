# Sistema de Gestión de Solicitudes

Este proyecto es una aplicación web para la gestión de solicitudes de soporte
técnico. Incluye autenticación de usuarios, roles diferenciados (cliente,
soporte, administrador), dashboards personalizados y funcionalidades para crear,
gestionar y responder solicitudes.

## Tecnologías Usadas

- **Next.js 15**: Framework de React con App Router para el frontend y backend.
- **TypeScript**: Para tipado estático y mejor desarrollo.
- **Tailwind CSS**: Para estilos y diseño responsivo.
- **Turso/SQLite**: Base de datos para almacenar usuarios y solicitudes.
- **JWT**: Para autenticación y manejo de sesiones.
- **bcrypt**: Para encriptación de contraseñas.
- **Chart.js / react-chartjs-2**: Para gráficos estadísticos.
- **React Hot Toast**: Para notificaciones en la interfaz.

## Instalación en Local

1. Clona el repositorio:

   ```bash
   git clone https://github.com/ArnoldWW/sistema-gestion-solicitudes.git
   cd sistema-gestion-solicitudes
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Configura las variables de entorno:

   - Copia `env.example` a `.env.local` y completa las variables necesarias
     (como la URL de la base de datos Turso, JWT secret, etc.).

4. Ejecuta las migraciones de la base de datos (si es necesario):

   - Usa el archivo `tables.sql` para crear las tablas en Turso/SQLite.

5. Inicia el servidor de desarrollo:

   ```bash
   npm run dev
   ```

6. Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

## La aplicacion va a estar deplegada en vercel

`https://sistema-gestion-solicitudes.vercel.app`

## Cómo Probar la Aplicación

- **En local**: Sigue los pasos de instalación y accede a la aplicación en
  `http://localhost:3000`.
- **Desplegada**: La aplicación estará disponible en la URL proporcionada por
  Vercel (por ejemplo, `https://sistema-gestion-solicitudes.vercel.app`).

Para probar:

- Regístrate como usuario (cliente por defecto).
- Inicia sesión y crea solicitudes desde el dashboard de cliente.
- Como administrador, revisa usuarios y solicitudes en `/dashboard/admin`, y
  banear/desbanear usuarios desde la lista de usuarios.
- Como soporte, responde a solicitudes asignadas en `/dashboard/support`.
- Los usuarios baneados no podrán iniciar sesión.

## Funcionalidades Implementadas

- **Autenticación**: Registro, login y logout con JWT.
- **Roles de usuario**: Cliente (crea solicitudes), Soporte (responde
  solicitudes), Administrador (gestiona usuarios, ve estadísticas y puede
  banear/desbanear usuarios).
- **Dashboards**: Páginas personalizadas según el rol, con navegación por
  sidebar.
- **Gestión de solicitudes**: Crear, listar, filtrar y responder solicitudes.
- **Estadísticas**: Gráficos de barras y pie para usuarios por rol y solicitudes
  por estado.
- **Formularios**: Validación en cliente y servidor, con notificaciones de
  toast.
- **Responsive**: Diseño adaptativo con Tailwind CSS.

## Estructura de Carpetas

```
/
├── app/                            # Páginas y layouts de Next.js (App Router)
│   ├── actions/                    # Server actions para formularios
│   ├── api/                        # Rutas API
│   ├── dashboard/                  # Dashboards por rol
│   │   ├── admin/                  # Páginas de admin
│   │   ├── customer/               # Páginas de cliente
│   │   └── support/                # Páginas de soporte
│   └──page.tsx (login), register/  # Páginas de auth
├── components/                     # Componentes reutilizables
├── lib/                            # Utilidades (DB, auth)
├── public/                         # Archivos estáticos
├── scripts/                        # Scripts auxiliares
├── types/                          # Definiciones de tipos TypeScript
└── tables.sql                      # Esquema de la base de datos
```

## Decisiones técnicas

Se eligió Next.js junto con Turso (SQLite) por su integración sencilla,
desarrollo ágil y compatibilidad nativa con el despliegue en Vercel. Esta
combinación permite crear aplicaciones fullstack modernas, con backend y
frontend en un solo proyecto, y facilita la gestión de la base de datos sin
complicaciones adicionales.
