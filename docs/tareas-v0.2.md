# Tareas Detalladas – Roadmap Plantita v0.2 "Pro"

## Hito 1: Autenticación de Usuarios

1. [ ] Investigar e instalar Clerk.dev (o Auth0) en el proyecto.
2. [ ] Configurar claves y callback URLs en el dashboard de Clerk/Auth0 y en Vercel.
3. [ ] Crear página de login/registro.
4. [ ] Implementar login con Google y email/password.
5. [ ] Proteger rutas: solo usuarios autenticados pueden acceder a la app.
6. [ ] Mostrar estado de usuario (avatar, nombre, logout) en la UI.

---

## Hito 2: Modelo de Plantas por Usuario

1. [ ] Instalar y configurar Supabase en el proyecto.
2. [ ] Crear tabla "plants" en Supabase (campos: id, user_id, nombre, especie, foto, fecha_creación).
3. [ ] Crear UI para añadir nueva planta (formulario).
4. [ ] Listar plantas del usuario en el dashboard.
5. [ ] Permitir editar/eliminar plantas.
6. [ ] Subir foto de la planta (opcional) y guardarla en Supabase Storage.

---

## Hito 3: Diagnóstico Asociado a Planta

1. [ ] Modificar el flujo de diagnóstico para que el usuario seleccione una planta antes de enviar la imagen.
2. [ ] Guardar cada diagnóstico en una tabla "diagnoses" (campos: id, plant_id, user_id, fecha, imagen, resultado_ia).
3. [ ] Relacionar cada diagnóstico con la planta correspondiente en la base de datos.
4. [ ] Actualizar la API para guardar el diagnóstico después de recibir la respuesta de OpenAI.

---

## Hito 4: Historial de Diagnósticos

1. [ ] Crear vista de "ficha" para cada planta.
2. [ ] Mostrar lista de diagnósticos históricos (fecha, imagen, resultado) para cada planta.
3. [ ] Permitir ver detalles de cada diagnóstico (respuesta completa de la IA, imagen, fecha).
4. [ ] (Opcional) Mostrar evolución visual (timeline o gráfico simple).

---

## Hito 5: Seguridad y Sincronización

1. [ ] Configurar reglas de seguridad en Supabase para que cada usuario solo acceda a sus datos.
2. [ ] Probar sincronización en tiempo real (opcional).
3. [ ] Testear flujos de usuario: registro, login, agregar planta, diagnóstico, historial.

---

## Hito 6: Convivencia entre modo anónimo y modo Pro

1. [ ] Permitir el uso del formulario de diagnóstico sin autenticación.
2. [ ] Ocultar opciones de historial, lista de plantas y perfil si el usuario no está autenticado.
3. [ ] Proteger rutas privadas (`/plantas`, `/historial`, etc.) para solo usuarios autenticados.
4. [ ] Modificar la API para que, si el usuario no está autenticado, procese la imagen y devuelva el resultado sin guardar nada.
5. [ ] Si el usuario está autenticado, guardar el diagnóstico en la base de datos asociado a su usuario y planta.
6. [ ] Mostrar una llamada a la acción (CTA) después de un diagnóstico anónimo: "¿Querés guardar este diagnóstico y hacerle seguimiento a esta planta? [Crear cuenta gratis]".
7. [ ] Testear ambos flujos (anónimo y autenticado) para asegurar la experiencia correcta.

---

## Hito 7: Reconocimiento automático de especie

1. [ ] Actualizar el prompt enviado a GPT-4o para solicitar identificación de especie junto con el diagnóstico.
2. [ ] Procesar la respuesta de la IA para extraer la especie sugerida.
3. [ ] Prellenar el campo "especie" en el formulario de planta con el valor detectado por IA (editable por el usuario).
4. [ ] Si la IA no puede identificar la especie, dejar el campo vacío y editable.
5. [ ] Mostrar la especie en la ficha de cada planta.
6. [ ] (Opcional futuro) Investigar integración con Plant.id API o Pl@ntNet para mejorar la precisión.
7. [ ] (Opcional futuro) Implementar flujo de confirmación de especie sugerida por IA.

---

## Hito 8: Base de Datos y Seguridad (Supabase)

1. [ ] Crear las tablas `plants` y `diagnoses` en Supabase usando los scripts SQL provistos.
2. [ ] Activar Row-Level Security (RLS) en ambas tablas.
3. [ ] Crear políticas RLS para que cada usuario solo pueda acceder a sus propios registros.
4. [ ] Probar que los datos de un usuario no sean accesibles por otros usuarios.
5. [ ] Implementar guardado de imágenes en Supabase Storage o Cloudinary y almacenar la URL en la base de datos.
6. [ ] Asegurar que el campo `species` se pueda autocompletar desde la IA y editar manualmente.
7. [ ] Documentar la estructura y las políticas en el repositorio.

---

## Hito 9: Plantita Pro – Monetización y Acceso

1. [ ] Agregar el campo `pro` a la tabla `users` en Supabase.
2. [ ] Crear endpoint `/api/create-checkout-session` protegido para iniciar el pago con Stripe Checkout.
3. [ ] Configurar Stripe y obtener las claves necesarias.
4. [ ] Implementar el flujo de pago único (3 USD) con Stripe Checkout.
5. [ ] Al completar el pago, actualizar el campo `pro` del usuario en la base de datos.
6. [ ] Redirigir al usuario a `/gracias` tras el pago exitoso.
7. [ ] Mostrar el estado de cuenta en el menú/perfil (“Pro activado ✅” o “Versión gratuita 🚫”).
8. [ ] Implementar visual gating: bloquear funcionalidades Pro para usuarios no Pro y mostrar CTA para actualizar.
9. [ ] Testear el flujo completo: upgrade, acceso, visual gating y fallback a versión gratuita.
