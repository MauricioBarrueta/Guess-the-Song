🇲🇽 Sitio web desarrollado con Angular y TypeScript, SCSS y principalmente Tailwind CSS, publicado con Firebase Hosting e integrado con Deezer API y LRCLIB API, utilizando Cloudflare Workers como proxy para Deezer.

🇺🇸 Website developed with Angular and TypeScript, using SCSS and primarily Tailwind CSS, deployed on Firebase Hosting and integrated with Deezer API and LRCLIB API, using Cloudflare Workers as a proxy for Deezer.

🔗https://guess-the-song-74c9e.web.app/

<img width="1366" height="635" alt="guess-the-song" src="https://github.com/user-attachments/assets/f208190e-4c23-4449-bdfe-8ae20470ce09" />


# GuessTheSong

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.12.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Vitest](https://vitest.dev/) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



## Notas

### Proxy para desarrollo

Durante el desarrollo local se utiliza un proxy de Angular (`proxy.conf.json`) para redirigir las peticiones a Deezer y evitar las restricciones CORS del navegador.

De esta forma, la aplicación utiliza rutas como `/deezer/...` en lugar de acceder directamente a `https://api.deezer.com`.

Este proxy únicamente funciona con el servidor de desarrollo de Angular y no forma parte del despliegue de la aplicación.

### Proxy para producción

En producción, debido a las restricciones CORS de Deezer, las peticiones se realizan mediante este Cloudflare Worker, que funciona como intermediario entre Guess The Song y la API de Deezer.

```text
Desarrollo:
Guess The Song → proxy.conf.json → Deezer API

Producción:
Guess The Song → Cloudflare Worker → Deezer API
```


# Deezer Proxy

Proxy desarrollado con **Cloudflare Workers** para permitir que [Guess The Song](https://github.com/MauricioBarrueta/Guess-the-Song.git) consuma la API de Deezer desde producción.

## ¿Por qué se necesita?

La API de Deezer no incluye la cabecera CORS necesaria para permitir que una aplicación web realice solicitudes directamente desde el navegador.

Por ejemplo, una solicitud directa desde Guess The Song:

```text
Guess The Song → https://api.deezer.com/genre
```

es bloqueada por el navegador debido a CORS, aunque Deezer responda correctamente con un código `200`.

## Solución

El proyecto utiliza un **Cloudflare Worker como proxy** entre Guess The Song y Deezer:

```text
Guess The Song
      ↓
Cloudflare Worker
      ↓
Deezer API
```

El navegador realiza la solicitud al Worker y este se encarga de solicitar los datos a Deezer. Al devolver la respuesta, el Worker agrega la cabecera CORS necesaria para que Guess The Song pueda leerla.

## Desarrollo y producción

Guess The Song utiliza diferentes mecanismos dependiendo del entorno.

### Desarrollo

En localhost se utiliza el proxy de Angular definido en `proxy.conf.json`:

```text
Angular
   ↓
/deezer
   ↓
proxy.conf.json
   ↓
Deezer API
```

### Producción

En Firebase Hosting se utiliza el Worker de Cloudflare:

```text
Angular
   ↓
Cloudflare Worker
   ↓
Deezer API
```

La URL del Worker se configura mediante `environment.ts`, mientras que `environment.development.ts` continúa utilizando `/deezer` para el proxy local.

## Estructura

```text
deezer-proxy/
├── src/
│   └── index.ts
├── package.json
├── package-lock.json
└── wrangler.jsonc
```

## Ejecución local

Instalar las dependencias:

```bash
npm install
```

Iniciar el Worker en modo desarrollo:

```bash
npm run dev
```

El Worker estará disponible en:

```text
http://localhost:8787
```

Por ejemplo:

```text
http://localhost:8787/deezer/genre
```

debe devolver la respuesta del endpoint `genre` de Deezer.

## Deploy

Para publicar el Worker en Cloudflare:

```bash
npm run deploy
```

Después del despliegue, Cloudflare proporcionará la URL pública del Worker.

## Tecnologías

* Cloudflare Workers
* TypeScript
* Wrangler
* Deezer API

