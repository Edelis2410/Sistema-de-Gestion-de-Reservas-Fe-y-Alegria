Descripción
Sistema de información desarrollado para la U.E. Colegio Fe y Alegría Puerto Ordaz con el objetivo de gestionar de manera eficiente las reservas de espacios educativos (CERPA, Capilla, Salón Múltiple, Sacramento, etc.). La aplicación permite a los docentes solicitar espacios y a los administradores aprobar, rechazar o modificar dichas solicitudes, evitando conflictos de horarios y optimizando el uso de los recursos institucionales.

Tecnologías Utilizadas
Frontend
React 18 con Vite
React Router DOM para enrutamiento
Tailwind CSS para estilos
Lucide React para iconos
jsPDF + jspdf-autotable para generación de reportes PDF
Context API para gestión de estado (autenticación)

Backend
Node.js con Express
Prisma ORM para interacción con la base de datos
PostgreSQL como base de datos relacional
JWT (JSON Web Tokens) para autenticación
Bcryptjs para hashing de contraseñas
Nodemailer para envío de correos

Estrutura del proyecto.

sistema-reservas/
│
├── backend/                      # Servidor Node.js + Express
│   ├── prisma/                   # Esquema de base de datos y migraciones
│   ├── scripts/                  # Scripts auxiliares (crear admin)
│   ├── src/                      # Código fuente del backend
│   │   ├── controllers/          # Lógica de negocio (reservas, usuarios, etc.)
│   │   ├── middlewares/          # Middlewares (autenticación, validación)
│   │   ├── routes/               # Definición de rutas de la API
│   │   ├── services/             # Servicios (notificaciones, etc.)
│   │   ├── utils/                 # Utilidades (mailer, etc.)
│   │   └── server.js              # Archivo principal que inicia el servidor y monta las rutas.
│   ├── .env                       # Variables de entorno
│   └── package.json
│
├── frontend/                     # Cliente React + Vite
│   ├── public/                    # Archivos públicos (favicon, etc.)
│   └── src/
│       ├── assets/                # Imágenes, videos, recursos estáticos
│       ├── components/            # Componentes reutilizables
│       │   ├── common/            # Componentes genéricos (Calendar, UI, etc.)
│       │   └── layout/            # Componentes de estructura (Header, Sidebar)
│       ├── config/                 # Configuración (ej. variables de entorno)
│       ├── contexts/               # Contextos de React (ej. AuthContext)
│       ├── dashboard/              # Vistas específicas por rol
│       │   ├── admin/              # Vistas y componentes del administrador
│       │   ├── docente/            # Vistas del docente
│       │   └── shared/             # Vistas compartidas (perfil, ayuda, etc.)
│       ├── hooks/                   # Custom hooks
│       ├── layouts/                 # Layouts principales (DashboardLayout)
│       ├── pages/                   # Páginas (login, etc.)
│       ├── services/                 # Llamadas a la API
│       ├── utils/                    # Funciones auxiliares
│       ├── App.jsx                   # Rutas
│       ├── main.jsx
│
└── README.md                     
