# 🚂 Próxima Estación — Red de Itinerarios Literarios

**Próxima Estación** es una plataforma conceptual para lectores que organiza sus géneros y libros como si fueran líneas de una red de metro. El proyecto aplica una arquitectura desacoplada (Frontend/Backend) con un diseño minimalista y brutalista inspirado en la señalética ferroviaria clásica.

---

## 🏗️ Arquitectura del Proyecto

El sistema está dividido en dos grandes bloques independientes para garantizar un desarrollo escalable y profesional:

- **Frontend**: Desarrollado con **React + Vite + Tailwind CSS**. Gestiona la interfaz de usuario, las animaciones del tren y la navegación fluida (SPA).
- **Backend**: Desarrollado con **Node.js + Express**. Actúa como la central de control, gestionando los datos de las rutas y la lógica del servidor.

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

