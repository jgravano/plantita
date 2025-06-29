# Especificación Técnica – Plantita v0.2 "Pro" (Usuarios + Histórico)

## Objetivo General

Permitir a los usuarios registrarse/iniciar sesión, asociar diagnósticos a plantas específicas y consultar un historial de diagnósticos por planta.

---

### 1. Autenticación de Usuarios

- **Requisito:** Permitir login/registro con Google y email/password usando Clerk.dev (o Auth0).
- **Flujo:**
  - Usuario puede crear cuenta o iniciar sesión.
  - El estado de autenticación se mantiene en toda la app.
  - Solo usuarios autenticados pueden acceder a la funcionalidad de diagnóstico y al historial.

### 2. Modelo de Plantas por Usuario

- **Requisito:** Cada usuario puede crear y gestionar una o más "plantas".
- **Flujo:**
  - El usuario puede añadir una planta (nombre, especie, foto opcional).
  - Puede ver la lista de sus plantas y seleccionar una para ver detalles.

### 3. Diagnóstico Asociado a Planta

- **Requisito:** Cada diagnóstico se asocia a una planta específica.
- **Flujo:**
  - Al subir una imagen, el usuario debe seleccionar a qué planta corresponde.
  - El diagnóstico se guarda junto con la planta, la fecha, la imagen y la respuesta de la IA.

### 4. Historial de Diagnósticos

- **Requisito:** Mostrar el historial de diagnósticos de cada planta.
- **Flujo:**
  - El usuario puede ver una "ficha" de cada planta con todos los diagnósticos realizados (fecha, imagen, resultado).
  - Permitir ver la evolución de la planta a lo largo del tiempo.

### 5. Base de Datos y Backend

- **Requisito:** Usar Supabase para almacenar usuarios, plantas y diagnósticos.
- **Flujo:**
  - Sincronizar datos en tiempo real.
  - Seguridad: cada usuario solo puede ver y modificar sus propios datos.

### 6. Convivencia entre modo anónimo y modo Pro

#### Objetivo:

Permitir que cualquier usuario pueda obtener un diagnóstico sin necesidad de registrarse, manteniendo una experiencia simple y rápida, pero ofreciendo funcionalidades adicionales si decide iniciar sesión.

#### Reglas y comportamiento:

- El usuario puede acceder a la app sin autenticarse y utilizar el formulario de diagnóstico:

  - Sube una imagen.
  - Escribe (opcionalmente) una descripción.
  - Obtiene un diagnóstico.
  - **No se guarda ningún dato.**

- Si el usuario **está logueado**, el flujo se expande:

  - Puede seleccionar una de sus plantas registradas o crear una nueva.
  - El diagnóstico se asocia a esa planta y se guarda.
  - Puede consultar el historial y evolución.

- Después de mostrar un diagnóstico en modo anónimo:
  - Se muestra una llamada a la acción (CTA):
    > "¿Querés guardar este diagnóstico y hacerle seguimiento a esta planta? [Crear cuenta gratis]"

#### UI/UX:

- El formulario de diagnóstico debe estar disponible sin login.
- Las opciones de historial, lista de plantas y perfil solo deben mostrarse si el usuario está autenticado.
- Usar rutas protegidas para secciones privadas (`/plantas`, `/historial`, etc.).

#### Backend:

- Si el usuario no está autenticado:
  - La API procesa la imagen y devuelve el resultado directamente sin guardar nada.
- Si el usuario está autenticado:
  - La API guarda el diagnóstico en la base de datos, asociado a su usuario y planta.

### 7. Reconocimiento automático de especie

#### Objetivo:

Mejorar la experiencia del usuario evitando que tenga que identificar manualmente la especie de su planta, usando IA para sugerirla automáticamente.

#### Comportamiento esperado:

- Cuando el usuario sube una imagen para diagnóstico:
  - Se le solicita a la IA (GPT-4o) que también intente identificar la especie o tipo de planta representada.
  - La especie sugerida por la IA se precompleta en el formulario o metadata asociada al diagnóstico.

#### Prompt actualizado para GPT-4o:

> "Esta es una imagen de una planta con un posible problema. El usuario dice: '[descripción]'.
>
> 1. Indicá qué tipo o especie de planta creés que es (si podés identificarla).
> 2. Brindá un diagnóstico tentativo, posibles causas y sugerencias de cuidado."

#### Ejemplo de respuesta de IA (esperado):

Parece ser un ficus elastica.

Diagnóstico: manchas negras en las hojas posiblemente causadas por exceso de riego.

Sugerencias:

Reducir frecuencia de riego.

Asegurar buen drenaje.

#### UX/UI:

- El campo "especie" se completa automáticamente con el valor detectado por IA, pero es editable por el usuario.
- Si la IA no puede identificar la especie, el campo queda vacío y editable.
- En la vista de planta, se muestra la especie como parte de la ficha.

#### Consideraciones futuras:

- En versiones futuras se puede integrar un modelo especializado como [Plant.id API](https://web.plant.id/plant-identification-api/) o [Pl@ntNet](https://my.plantnet.org/) para mejorar precisión.
- También podría implementarse un flujo de "confirmación":
  - > "Parece ser un potus. ¿Confirmás?" ✅ / ❌

### 8. Base de Datos y Seguridad (Supabase)

#### Objetivo:

Persistir los datos de usuarios, plantas y diagnósticos de forma segura. Cada usuario solo puede acceder a sus propios registros.

#### Estructura de tablas (PostgreSQL en Supabase):

##### `plants`

```sql
create table plants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  species text,
  image_url text,
  note text,
  created_at timestamp with time zone default now()
);
```

##### `diagnoses`

```sql
create table diagnoses (
  id uuid primary key default gen_random_uuid(),
  plant_id uuid not null references plants(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  image_url text not null,
  user_input text,
  diagnosis_text text not null,
  created_at timestamp with time zone default now()
);
```

> Nota: aunque diagnoses se vincula con plant_id, también guarda user_id para facilitar consultas rápidas y aplicar RLS sin JOINs.

#### Row-Level Security (RLS)

Activar RLS

```sql
alter table plants enable row level security;
alter table diagnoses enable row level security;
```

Políticas para plants

```sql
create policy "Users can manage their own plants"
on plants
for all
using (auth.uid() = user_id);
```

Políticas para diagnoses

```sql
create policy "Users can manage their own diagnoses"
on diagnoses
for all
using (auth.uid() = user_id);
```

#### Consideraciones:

- Los diagnósticos se asocian directamente tanto al plant_id como al user_id.
- La seguridad se refuerza mediante RLS para que ningún usuario pueda acceder a los datos de otro.
- El campo species se autocompleta desde la IA pero puede ser editado por el usuario.
- Las imágenes pueden almacenarse en Supabase Storage o Cloudinary, y referenciarse con image_url.

### 9. Plantita Pro – Monetización y Acceso

#### Objetivo:

Permitir a los usuarios desbloquear funcionalidades avanzadas mediante un único pago. Mantener la versión gratuita sin fricción y ofrecer upgrade opcional de forma clara y accesible.

#### Modelo de pricing:

- Versión gratuita:

  - Diagnóstico instantáneo.
  - Sin registro obligatorio.
  - Sin historial ni seguimiento.

- Versión Pro (único pago de 3 USD):
  - Requiere login.
  - Guardado de diagnósticos.
  - Gestión de múltiples plantas.
  - Historial completo por planta.
  - Seguimiento personalizado.
  - (A futuro) alertas por email.

#### Comportamiento:

- El usuario puede utilizar la app sin pagar.
- Al intentar acceder a funcionalidades Pro (guardar, ver historial, etc.), si no es Pro, se le muestra una invitación:

  > "¿Querés guardar tus diagnósticos y seguir la evolución de tus plantas? Desbloqueá Plantita Pro por un único pago de 3 USD."

- Una vez realizado el pago:
  - Se actualiza el campo `users.pro = true` en Supabase.
  - El frontend permite el acceso total a las funcionalidades.

#### Integración con Stripe:

- Usar **Stripe Checkout** para manejar el pago único.
- Crear un endpoint protegido `/api/create-checkout-session` que genere la sesión de pago.
- Luego del pago exitoso, redirigir al usuario a `/gracias` y actualizar su estado en la DB.

#### Base de datos:

Agregar a la tabla `users` (en Supabase o gestionada internamente):

```sql
alter table users add column pro boolean default false;
```

#### UI/UX:

- Mostrar el estado de cuenta en el menú o perfil:
  - "Pro activado ✅" o "Versión gratuita 🚫".
- Las opciones Pro (historial, seguimiento, etc.) deben tener visual gating si no están disponibles.
- CTA clara para actualizar: botón "Desbloquear Plantita Pro".
