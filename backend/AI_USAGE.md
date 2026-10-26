# Registro de uso de IA - Nayo González

- **Integrante:** Nayibe González Velásquez (Nayo).
- **Herramienta:** ChatGPT (OpenAI).
- **Tarea:** Desarrollo, revisión y pruebas del módulo de recetas de FreshTrack, correspondiente a la entrega D2 de Programación Web.
- **Propósito:** Utilizar inteligencia artificial como herramienta de apoyo técnico para resolver errores, revisar implementaciones y organizar el código.

- **Descripción de la consulta o prompt:** Se realizaron consultas relacionadas con errores de compilación en NestJS y TypeScript, problemas de configuración de dependencias y Jest, validaciones mediante DTOs y organización de pruebas automatizadas. También se solicitaron recomendaciones y ejemplos de implementación para servicios y pruebas del módulo de recetas.

- **Resultado utilizado:** Se utilizaron explicaciones técnicas, recomendaciones de estructura. La herramienta también permitió identificar posibles causas de errores y facilitar la revisión de configuraciones de desarrollo y testing.

- **Cambios realizados por el equipo:** Nayo desarrolló e integró el módulo de recetas sobre la estructura inicial del proyecto, incorporando y adaptando los cambios pertinentes a las entidades, convenciones y necesidades de FreshTrack. Se organizaron las funcionalidades de creación, consulta y moderación de recetas, las validaciones y las pruebas automatizadas. Los cambios se gestionaron en la rama `feature/recipes` y se integraron a `main` mediante un Pull Request.

- **Forma de verificación:** Se realizaron compilaciones mediante `npm run build` y pruebas automatizadas con Jest, obteniendo **18 pruebas aprobadas distribuidas en 5 suites**, sin fallos en la última ejecución. Se verificaron las reglas de negocio, validaciones, operaciones de servicios y respuestas HTTP mediante pruebas con mocks. Adicionalmente, se revisó la integración de los cambios mediante Git y GitHub.



# Registro de uso de IA — Laura Palacios

- **Integrante:** Laura Palacio Herrera.
- **Herramienta:** Claude (Anthropic).
- **Tarea:** Configuración inicial del backend, modelo de datos, desarrollo del módulo de inventario, pruebas automatizadas y documentación del proyecto FreshTrack.

- **Propósito:** Utilizar IA como apoyo técnico para estructurar el backend con NestJS, Docker, PostgreSQL y TypeORM, implementar el CRUD de inventario y las reglas de vencimiento, resolver errores y organizar las pruebas y la documentación del proyecto.

- **Descripción de la consulta o prompt:** Se solicitaron orientaciones y ejemplos de código para configurar el proyecto, generar entidades a partir del diagrama de datos, desarrollar DTOs, servicios, controladores, reglas de negocio y pruebas con mocks. También se consultaron soluciones a errores de Git, Docker, DBeaver, Jest y módulos ESM, así como recomendaciones para organizar el repositorio, los Pull Requests, el README y las colecciones de Postman.

- **Resultado utilizado:** Configuración del backend (`compose.yaml`, `.env.example`, `app.module.ts`), entidades TypeORM, componentes del módulo de inventario, endpoint de productos próximos a vencer, pruebas automatizadas, configuración de Jest, README, `.gitignore` y colección de Postman.

- **Cambios realizados por el equipo:** Laura adaptó las sugerencias a la arquitectura del proyecto, definió y corrigió el modelo de datos, ajustó imports y configuraciones, modificó el nombre del proyecto Docker Compose, integró la autenticación al inventario, actualizó las pruebas, resolvió conflictos de integración y revisó la documentación y los archivos compartidos.

- **Forma de verificación:** Compilación con `npm run build`, ejecución de `npm test` con **13 suites y 109 pruebas aprobadas**, comprobación de Docker Compose, verificación de siete tablas y relaciones en DBeaver, revisión de datos en PostgreSQL, pruebas exitosas y de error mediante Postman y comprobación de los cambios en GitHub.

## Registro de uso de IA — Francisco Madrid

- Integrante: Francisco Madrid
- Herramienta: ChatGPT (OpenAI)
- Tarea: Desarrollo e integración de donaciones y autenticación.
- Propósito: Implementar la creación y revisión de donaciones, identificar a los usuarios y proteger las acciones que requieren permisos de administrador.
- Descripción de la consulta o prompt: Pedí apoyo para organizar los módulos, implementar validaciones y revisar las reglas de negocio y los permisos. También consulté sobre pruebas con mocks, errores al ejecutar Jest y comandos de Git para subir los cambios.
- Resultado utilizado: Propuestas de código para DTOs, controllers, servicios, autenticación y pruebas, junto con orientaciones para resolver errores del entorno.
- Cambios realizados e integración: Incorporé los archivos siguiendo la estructura del proyecto, instalé las dependencias necesarias, ejecuté las pruebas y subí los cambios a mi rama.
- Forma de verificación: Compilación con npm run build, ejecución de 89 pruebas en 11 suites en esa etapa de integración y confirmación del push en la terminal.