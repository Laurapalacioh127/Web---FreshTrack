# Autenticación de FreshTrack

## Qué incluye

`POST /api/auth/register`, `POST /api/auth/login` y `GET /api/auth/me`.
Registro con nombre, correo y contraseña (8 a 128 caracteres). Guarda un hash scrypt con sal aleatoria; nunca devuelve la contraseña ni su hash. El token JWT dura una hora. El guard global exige token salvo en registro, login y la ruta de saludo `/api`.

Donaciones toma el donante y el administrador del token. El usuario ve sus ofertas; el administrador puede consultar todas y aprobar o rechazar. Inventario usa el usuario del token en todas las operaciones. Los nuevos controladores también quedan protegidos por el guard global; deben implementar además sus permisos de negocio.

## Copiar al repositorio

Crea una rama `feature/auth` desde una versión que ya contenga donaciones. Si donaciones todavía no se ha unido a main, coordina esa dependencia antes del PR.

Consulta `ARCHIVOS_AUTH.txt`: contiene la lista exacta de archivos nuevos y modificados. Copia esos archivos conservando las rutas dentro de `backend`. No reemplaces tu carpeta `.git`. El ZIP no incluye dependencias, credenciales ni compilados.

Se cambian archivos compartidos: entidad User, AppModule, AppController, package.json, package-lock.json, jest.config.ts y .env.example. Inventario también cambia para impedir acceso a datos de otros usuarios. Recetas conserva sus reglas y servicios; su controlador usa el autor y el administrador autenticados. Coordina los cambios con Laura y con quien lleva recetas antes de integrar.

## Instalar y arrancar (terminal dentro de backend)

Usa Node 24.9 o superior de la rama 24 para las dependencias y las pruebas de este proyecto.

```bash
npm ci --legacy-peer-deps
```

Conserva tu `.env` actual. Si no tienes uno, copia `.env.example` a `.env` y configura Postgres según `compose.yaml` (en esta base, usuario y contraseña `postgres`). Genera el secreto:

```bash
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

Pega el resultado en tu `.env`:

```dotenv
JWT_SECRET=pega_aqui_el_resultado_generado
```

No subas `.env` a Git. Reinicia Nest después de cambiarlo. El servidor falla al iniciar si falta el secreto o tiene menos de 32 bytes.

```bash
docker compose up -d
npm run start:dev
```

Se conserva `synchronize: true` de la base académica: al iniciar añade `users.password_hash`, nullable para no borrar usuarios existentes. Los usuarios del seed no tienen contraseña y no pueden entrar. No se puede registrar de nuevo un correo existente para apropiarse de su cuenta. Para esta práctica crea cuentas nuevas. En una aplicación desplegada se debe usar una migración y un flujo seguro de recuperación.

## Primera cuenta de administrador

1. Con el backend encendido, haz en Postman `POST http://localhost:3000/api/auth/register`, Body → raw → JSON:

```json
{
  "fullName": "Administrador de prueba",
  "email": "admin.auth@example.com",
  "password": "elige-una-clave-propia-de-al-menos-8-caracteres"
}
```

2. Cambia la contraseña del ejemplo antes de enviar. Guarda ese correo y contraseña para el login. La cuenta se crea como `user`.
3. Desde la terminal local, con acceso autorizado a la base de datos, asigna el rol:

```bash
docker compose exec postgres psql -U postgres -d freshtrack -c "UPDATE users SET role = 'admin' WHERE email = 'admin.auth@example.com';"
```

Debe aparecer `UPDATE 1`. Si aparece `UPDATE 0`, verifica el correo usado al registrar. No hay endpoint público que conceda el rol admin.

4. Inicia sesión con `POST /api/auth/login` y el correo y contraseña registrados. Copia `accessToken` de la respuesta. En las peticiones protegidas usa Authorization → Bearer Token → pega el token, sin añadir la palabra Bearer. Para cerrar sesión en el cliente, elimina el token; seguirá siendo válido hasta vencer (no hay revocación ni refresh token).

## Postman

Importa `src/auth/postman/auth.postman_collection.json` y ejecútala en orden con Run. Crea un usuario nuevo y guarda el token automáticamente. Comprueba registro, login, perfil, falta de token, contraseña incorrecta y rechazo del campo role.

Para probar donaciones importa de nuevo `src/common/postman/donations.postman_collection.json`. En Variables configura `adminEmail` y `adminPassword` con la cuenta del paso anterior. `masterProductId` debe ser un producto existente del catálogo. Puedes cargar el seed desde Git Bash:

```bash
docker compose exec -T postgres psql -U postgres -d freshtrack < scripts/seed.sql
```

Confirma el ID del producto en tu base; el valor inicial de la colección es 1. Ejecuta toda la colección: primero registra un donante y hace los dos logins, luego prueba donaciones. Usa una base de prueba: crea registros y descuenta inventario. No exportes la colección con contraseñas o tokens reales.

La colección de inventario en `postman/` también usa Bearer `{{userToken}}`: pega un token de usuario en esa variable. Conserva sus datos de prueba originales; revisa IDs y fechas antes de ejecutarla.

Los cuerpos de donaciones ya NO llevan `donorId` ni `adminId`. El body de inventario ya NO lleva `userId`. Esos campos causan 400 porque se prohíben propiedades extra. Para listar inventario basta `GET /api/inventory`; el filtro userId no cambia el propietario autenticado.

## Recetas actualizadas

Se conservaron el módulo, los servicios, las reglas, los DTOs y las pruebas que llegaron en el ZIP actualizado. `POST /api/recipes` toma el autor del token; `PATCH /api/recipes/:id/moderation` requiere rol admin y toma su ID del token. `GET /api/recipes` requiere sesión y conserva la consulta de recetas aprobadas. Ya no debes enviar `authorId` ni `adminId` en la URL; si llegan, no cambian la identidad del token.

Importa `src/common/postman/Recipes.postman_collection.json`. Configura `adminEmail`, `adminPassword` y `masterProductId`, igual que en donaciones. Ejecuta toda la colección: registra un usuario de prueba, inicia ambas sesiones, crea una receta, comprueba que un usuario no puede moderarla, la aprueba como administrador y verifica que aparece en la lista. La variable `baseUrl` ahora es `http://localhost:3000/api`, igual que en las otras colecciones.

## Pruebas automáticas

```bash
npm test
npm run test:auth
npm run build
npm run lint
```

Las pruebas de auth hacen peticiones HTTP al servidor Nest con el guard, validación, hash y JWT reales. Repositorios y servicios de negocio se simulan con mocks. Las pruebas originales de reglas y servicios de donaciones se conservan. Se ajustó el Jest compartido para TypeScript 6; no hace falta añadir otro archivo Jest para auth.

La validación automatizada no reemplaza la ejecución de Postman con tu Postgres. No se ha probado una base real en el entorno de entrega. Esta implementación no incluye recuperación de contraseña, verificación del correo ni limitación de intentos de login; esos pasos quedan pendientes antes de exponerla como servicio público.

Referencia de la integración JWT: https://github.com/nestjs/jwt
