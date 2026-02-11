# 🚂 Próxima Estación — Red de Itinerarios Literarios

**Próxima Estación** es una plataforma conceptual para lectores que organiza sus géneros y libros como si fueran líneas de una red de metro. El proyecto aplica una arquitectura desacoplada (Frontend/Backend) con un diseño minimalista y brutalista inspirado en la señalética ferroviaria clásica.

---

## 🏗️ Arquitectura del Proyecto

El sistema está dividido en dos grandes bloques independientes para garantizar un desarrollo escalable y profesional:

- **Frontend**: Desarrollado con **React + Vite + Tailwind CSS**. Gestiona la interfaz de usuario, las animaciones del tren y la navegación fluida (SPA).
- **Backend**: Desarrollado con **Node.js + Express**. Actúa como la central de control, gestionando los datos de las rutas y la lógica del servidor.


## 📂 Estructura de Carpetas

```text
/ (Raíz del proyecto)
├── frontend/             # Aplicación de React (Interfaz)
│   ├── src/components/   # Piezas reutilizables (Tren, Panel, etc.)
│   ├── src/pages/        # Vistas principales (Inicio, Auth, Dashboard)
│   └── package.json      # Dependencias del cliente
├── backend/              # Servidor de Node.js (Datos/API)
│   ├── server.js         # Lógica de la API y rutas
│   └── package.json      # Dependencias del servidor
├── package.json          # CONFIGURACIÓN MAESTRA (Scripts de control)
└── README.md             # Guía de viaje (Instrucciones)
```

---

## 🚀 Instrucciones de Inicio Rápido

Para facilitar la evaluación, se ha configurado un sistema de comandos unificados que permite gestionar ambas aplicaciones desde una sola terminal en la raíz:

1. **Instalación automatizada**: Para instalar los módulos de Node de ambas carpetas simultáneamente:
```bash
npm run install-all
```

2. **Ejecución de la Red**: Para encender el servidor y la interfaz al mismo tiempo:
```bash
npm start
```

---

## 🛠️ Tecnologías Aplicadas
- **Frontend**: React, React Router Dom, Tailwind CSS.
- **Backend**: Express.js, Middlewares de CORS y JSON.
- **Utilidades**: Concurrently (para gestión de procesos paralelos).

