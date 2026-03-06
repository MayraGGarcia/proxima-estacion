# 🚂 Próxima Estación — Red de Itinerarios Literarios

**Próxima Estación** es una plataforma de curaduría literaria que organiza libros como si fueran líneas de una red de subte. Los usuarios crean itinerarios de lectura (rutas), los comparten con la comunidad y registran su experiencia en una bitácora personal.

El proyecto aplica una arquitectura desacoplada (Frontend/Backend) con un diseño minimalista y brutalista inspirado en la señalética ferroviaria clásica.

---

## 🏗️ Arquitectura

| Capa | Tecnología |
|------|-----------|
| Frontend | React + Vite + Tailwind CSS |
| Backend | Node.js + Express |
| Base de datos | MySQL |
| API de libros | Open Library API |

---

## 🚀 Instalación y ejecución

### Requisitos previos
- Node.js v18 o superior
- MySQL corriendo localmente en el puerto 3306

### 1. Clonar el repositorio
```bash
git clone <url-del-repo>
cd proxima-estacion
```

### 2. Instalar dependencias (frontend + backend)
```bash
npm run install-all
```

### 3. Configurar variables de entorno
Copiar el archivo de ejemplo en la carpeta `frontend`:
```bash
cp frontend/.env.example frontend/.env
```
Por defecto apunta a `http://localhost:3001`. Si el backend corre en otro puerto o servidor, cambiar `VITE_API_URL` en ese archivo.

Crear un archivo `.env` en la carpeta `backend` con los datos de conexión a MySQL:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=tu_usuario
DB_PASSWORD=tu_contraseña
DB_NAME=proxima_estacion
```

### 4. Crear la base de datos
Ejecutar el schema SQL para crear las tablas:
```bash
cd backend
mysql -u tu_usuario -p proxima_estacion < schema.sql
```

### 5. Cargar datos iniciales
Para poblar la base de datos con rutas de ejemplo y usuarios demo:
```bash
cd backend
node seed.js
node seedDesafios.js
node seedUsuarios.js
```

### 6. Iniciar el proyecto
Desde la raíz del proyecto, un solo comando levanta frontend y backend:
```bash
npm start
```

La app queda disponible en `http://localhost:5173`

---

## ✨ Funcionalidades

### Para usuarios
- **Registro e inicio de sesión** con persistencia de sesión
- **Explorar rutas** creadas por otros usuarios con filtros (más votadas, más cortas, recientes)
- **Crear rutas propias** con búsqueda de libros via Open Library, criterio de orden y justificación
- **Sistema de bitácora** — escribir notas por estación mientras leés
- **Historial de rutas completadas** con acceso a bitácoras anteriores
- **Reseñas de libros** — registrar libros leídos con puntuación y texto, independientemente de las rutas
- **Sistema de XP y niveles** — ganás experiencia al completar acciones
- **Logros desbloqueables** — 5 logros con condiciones variadas
- **Desafío semanal** — una ruta destacada que cambia cada semana
- **Muro de registros** — ver las bitácoras de otros usuarios sobre la misma ruta

### Técnicas
- Aislamiento completo de datos por usuario
- API REST con Express y esquema relacional SQL
- Diseño responsive mobile-first
- Variables de entorno para configuración del backend y la base de datos

---

## 📁 Estructura del proyecto

```
proxima-estacion/
├── frontend/
│   ├── src/
│   │   ├── pages/          # Vistas principales
│   │   ├── components/     # Componentes reutilizables
│   │   ├── context/        # Estado global (EstacionContext, PerfilContext)
│   │   └── config.js       # URL del backend (centralizada)
│   └── .env.example
├── backend/
│   ├── controllers/        # Lógica de cada endpoint
│   ├── schema.sql          # Definición de tablas y relaciones
│   ├── server.js           # Punto de entrada del servidor
│   ├── seed.js             # Datos iniciales de rutas
│   ├── seedDesafios.js     # Datos iniciales de desafíos
│   └── seedUsuarios.js     # Usuarios demo precargados
└── package.json            # Scripts unificados
```

---

## 📜 Scripts disponibles

Desde la raíz del proyecto:

| Comando | Descripción |
|---------|-------------|
| `npm start` | Levanta frontend y backend simultáneamente |
| `npm run install-all` | Instala dependencias de ambas carpetas |

---

## 👩‍💻 Autora

**García, Mayra Giselle** — UNAHUR