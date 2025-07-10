# hospital-frontend-go

Esta es la parte del proyecto frontend del Sistema de Citas y Reportes, que se desarrolla con Angular 19 y PrimeNG. 

Actualmente se implementan las vistas de:

- Login  
- Registro  

Solo se han desarrollan los componentes visuales, sin conexión al backend en esta etapa.

---

## Tecnologías Utilizadas

- **Angular 19**
- **PrimeNG**
- **CSS**

---

##  Instrucciones de Instalación y Ejecución

### Requisitos:

- Tener instalado Node.js versión 20.x o superior.
- Tener configurado Angular CLI versión 19:

```bash

npm install -g @angular/cli@19

```

## Pasos para ejecutar el proyecto 

Clonar el repositorio 

- git clone https://github.com/ImanolCE/hospital-frontend-go.git

Accdeder a las carpetas 

- cd hospital-frontend-go
- cd frontend-hospital

Para instalar dependencias e ejecutar el proyecto 

- npm install
- ng serve

---

## Notas 

L os formularios de Login y Registro usan PrimeNG para los estilos y componentes. Ademas  el sistema de rutas permite navegar entre Login y Registro.

No se incluye lógica de conexión al backend para esta primera entrega.

## Estructura de archivos actual 

```
└── 📁frontend-hospital
    └── 📁.angular
        └── 📁cache
            └── 📁19.2.15
                └── 📁frontend-hospital
                    └── 📁vite
                        └── 📁deps
                            ├── _metadata.json
                            ├── @angular_core.js
                            ├── @angular_core.js.map
                            ├── @angular_forms.js
                            ├── @angular_forms.js.map
                            ├── @angular_platform-browser.js
                            ├── @angular_platform-browser.js.map
                            ├── @angular_router.js
                            ├── @angular_router.js.map
                            ├── chunk-3TSB3RCJ.js
                            ├── chunk-3TSB3RCJ.js.map
                            ├── chunk-4MW2T37N.js
                            ├── chunk-4MW2T37N.js.map
                            ├── chunk-FR34QEIP.js
                            ├── chunk-FR34QEIP.js.map
                            ├── chunk-LKBYGJ3F.js
                            ├── chunk-LKBYGJ3F.js.map
                            ├── chunk-LNNAVXAM.js
                            ├── chunk-LNNAVXAM.js.map
                            ├── chunk-YEGXJTMJ.js
                            ├── chunk-YEGXJTMJ.js.map
                            ├── package.json
                            ├── primeng_api.js
                            ├── primeng_api.js.map
                            ├── primeng_button.js
                            ├── primeng_button.js.map
                            ├── primeng_inputtext.js
                            ├── primeng_inputtext.js.map
                        └── 📁deps_ssr
                            ├── _metadata.json
                            ├── package.json
                    ├── .tsbuildinfo
    └── 📁.vscode
        ├── extensions.json
        ├── launch.json
        ├── tasks.json
    └── 📁public
        ├── favicon.ico
    └── 📁src
        └── 📁app
            └── 📁pages
                └── 📁views
                    └── 📁auth
                        └── 📁login
                            ├── login.component.css
                            ├── login.component.html
                            ├── login.component.ts
                        └── 📁register
                            ├── register.component.css
                            ├── register.component.html
                            ├── register.component.ts
                    └── 📁consultas
                    └── 📁dashboard
            ├── app.component.html
            ├── app.component.scss
            ├── app.component.spec.ts
            ├── app.component.ts
            ├── app.config.ts
            ├── app.routes.ts
        ├── index.html
        ├── main.ts
        ├── styles.scss
    ├── .editorconfig
    ├── .gitignore
    ├── angular.json
    ├── package-lock.json
    ├── package.json
    ├── README.md
    ├── tsconfig.app.json
    ├── tsconfig.json
    └── tsconfig.spec.json
```