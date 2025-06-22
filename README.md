# 🌱 Plantita – Diagnóstico inteligente de plantas

**Plantita** es una web app que usa inteligencia artificial para ayudarte a diagnosticar problemas en tus plantas a partir de una imagen y una breve descripción. El objetivo es que cualquier persona pueda detectar enfermedades, plagas o deficiencias sin conocimientos técnicos.

---

## ✅ MVP (actualmente funcionando)

- [x] Subida de imagen vía formulario
- [x] Descripción opcional del problema
- [x] Diagnóstico generado por GPT-4o con visión
- [x] Respuesta amigable con nombre del problema, causas y sugerencias

---

## 🧭 Roadmap – Próximas iteraciones

### 🧪 v0.2 – Plantita Pro (usuarios + histórico)

- [ ] Registro / login con Google o email (Clerk/Auth0)
- [ ] Modelo de "plantas" por usuario
- [ ] Asociar cada diagnóstico a una planta específica
- [ ] Historial de diagnósticos por planta (con fecha e imagen)
- [ ] Vista tipo ficha médica con evolución

### 🧠 v0.3 – Personalización y seguimiento

- [ ] Notificaciones: "¿cómo sigue tu planta?"
- [ ] Etiquetas comunes: hongos, exceso de riego, etc.
- [ ] Calificación del diagnóstico (feedback del usuario)
- [ ] Exportar historial (PDF o CSV)

### 🚀 v1.0 – Producción

- [ ] Dominio y hosting público
- [ ] Política de privacidad + Términos básicos
- [ ] Sistema de límites por usuario (para evitar abuso de IA)
- [ ] Opción de upgrade a "Plan Pro" (más consultas, seguimiento intensivo, tips personalizados)

---

## 🛠️ Stack Técnico

| Capa     | Tecnología                                                |
| -------- | --------------------------------------------------------- |
| Frontend | Next.js (JavaScript) + TailwindCSS                        |
| Backend  | API Routes en Next.js                                     |
| IA       | OpenAI GPT-4o (Vision API)                                |
| Auth     | [Clerk.dev](https://clerk.dev) o Auth0                    |
| DB       | Supabase (PostgreSQL + Auth + Storage)                    |
| Imagenes | Base64 en MVP, Cloudinary o Supabase Storage en v0.2      |
| Hosting  | Vercel (web + API), dominio con Namecheap/Porkbun         |
| Logs     | Vercel + consola personalizada (opcional Posthog, Sentry) |

---

## 💡 Ideas futuras (no urgentes)

- 🧬 Entrenamiento con dataset propio de imágenes de plantas reales
- 🗺️ Mapa de plantas registradas por región
- 👨‍🌾 Comunidad estilo foro o Q&A
- 📷 App mobile (Expo + PWA)
- 🪴 Marketplace de productos para el cuidado de plantas

---

## 📦 Instalación (local)

```bash
git clone https://github.com/tu-usuario/plantita.git
cd plantita
npm install
npm run dev
```

## 🚀 Características

- **Diagnóstico con IA**: Analiza fotos de plantas usando GPT-4o con visión
- **Interfaz intuitiva**: Drag & drop para subir imágenes
- **Descripción opcional**: Añade contexto adicional sobre el problema
- **Resultados estructurados**: Diagnóstico, causas y sugerencias de cuidado
- **Diseño responsive**: Funciona en desktop y móvil
- **Colores temáticos**: Paleta verde inspirada en plantas

## 🛠️ Tecnologías

- **Frontend**: Next.js, React, JavaScript
- **Estilos**: Tailwind CSS
- **IA**: OpenAI GPT-4o
- **Upload**: react-dropzone
- **HTTP**: axios

## 🔑 Configuración de OpenAI

1. Ve a [OpenAI Platform](https://platform.openai.com/)
2. Crea una cuenta o inicia sesión
3. Ve a "API Keys" y genera una nueva clave
4. Copia la clave y pégala en tu archivo `.env.local`

## 📁 Estructura del Proyecto

```
plantita/
├── components/
│   ├── ImageDropzone.js     # Componente para subir imágenes
│   └── DiagnosisResult.js   # Muestra resultados del diagnóstico
├── pages/
│   ├── api/
│   │   └── diagnose.js      # API route para OpenAI
│   ├── _app.js              # Configuración de la app
│   ├── _document.js         # HTML base
│   └── index.js             # Página principal
├── styles/
│   └── globals.css          # Estilos globales con Tailwind
├── .env.local               # Variables de entorno (crear)
├── package.json             # Dependencias
├── tailwind.config.js       # Configuración de Tailwind
└── README.md                # Este archivo
```

## 🎯 Cómo usar

1. **Sube una foto**: Arrastra y suelta una imagen de tu planta o haz clic para seleccionar
2. **Añade descripción** (opcional): Describe los síntomas o cambios que has notado
3. **Obtén diagnóstico**: Haz clic en "Obtener diagnóstico" y espera el análisis
4. **Revisa resultados**: Lee el diagnóstico, causas y sugerencias de cuidado

## 🎨 Personalización

### Colores

Los colores están definidos en `tailwind.config.js` bajo la paleta `plantita`:

- Verde claro: `plantita-50` a `plantita-300`
- Verde medio: `plantita-400` a `plantita-600`
- Verde oscuro: `plantita-700` a `plantita-900`

### Prompt de OpenAI

El prompt se puede modificar en `pages/api/diagnose.js` en la variable `prompt`.

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Añade la variable de entorno `OPENAI_API_KEY`
3. ¡Listo!

### Otros proveedores

- **Netlify**: Configura las variables de entorno en el dashboard
- **Railway**: Añade la variable en la configuración del proyecto
- **Heroku**: Usa `heroku config:set OPENAI_API_KEY=tu-clave`

## 🔧 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Linter de código

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## ⚠️ Disclaimer

Este diagnóstico es informativo y no reemplaza la consulta con un especialista. Para casos graves, siempre consulta con un profesional.

## 🐛 Problemas Comunes

### Error de API Key

- Verifica que tu clave de OpenAI sea válida
- Asegúrate de que el archivo `.env.local` esté en la raíz del proyecto

### Error de CORS

- Este proyecto no debería tener problemas de CORS ya que usa API routes de Next.js

### Imagen no se sube

- Verifica que el formato sea compatible (JPEG, PNG, GIF, WebP)
- Asegúrate de que la imagen no sea muy grande

---

🌱 **Plantita** - Haciendo el cuidado de plantas más inteligente
