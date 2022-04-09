
# jobs-auth-service
 Servicio de Atenticacion para Proyecto de Busqueda de Empleos con tecnicas de webscraping
 
 Auth Nodejs Jwt


 # Getting Started
 Tener instalado instalado: 
 npm

 nodejs

 git
  
 mongodb y robo3t para bd local de mongodb
1. Clonar el repositoiro 
2. npm i
3. Run script:


 # Ejecutar
 en el consola
```
  npm run dev 
```

Crear un archivo .env en la raiz - tomar como ejemplo .env.example
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017
DB_NAME=auth_jobs_db
ACCESS_TOKEN_SECRET=[CODIGO_RANDOM_HEX]
REFRESH_TOKEN_SECRET=[CODIGO_RANDOM_HEX]
FROM_GMAIL=[CORREOGMAIL]
PASSWORD_GMAIL=[PASSWORD]

```
Version utilado de NodeJS

npm 6.14.14

node v14.17.5


[✔] Registro nuevo usuario

[✔] Validacion por correo

[✔] Inicio de Sesion

# Entorno Local
En el Editor Visual Studio Code:
instalar la extension `REST Client [humao.rest-client]`

Ejemplos
en el archivo rest.http


1. Register Usuario = Obtener 2 Tokens

    Respuesta

    ```
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDg1NzE3MjMsImV4cCI6MTY0ODU3MTc0MiwiYXVkIjoiNjI0MzM1NGI0OTI5ODkxZjAwOGQ2MmJlIiwiaXNzIjoicm9nZXJnY2NAZ21haWwuY29tIn0.l9yNR0LiTeT01VNsb9OjJiQMQketreZ_a8uWsVP-_L0",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDg1NzE3MjMsImV4cCI6MTY0ODY1ODEyMywiYXVkIjoiNjI0MzM1NGI0OTI5ODkxZjAwOGQ2MmJlIiwiaXNzIjoicm9nZXJnY2NAZ21haWwuY29tIn0.vNpFs0ABS0XRICgfMMwqQ124GSPFYOU_CMxhA7LPT7I"
    }
    ```
- el 1ro para acceder a las rutas(con tiempo de expiracion)
- el 2do para obtener tokens nuevos

2. Login obtiene.

    Respuesta
- el 1ro para acceder a las rutas(con tiempo de expiracion)
- el 2do para obtener tokens nuevos

  ```
    {
      "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDg1NzE3MjMsImV4cCI6MTY0ODU3MTc0MiwiYXVkIjoiNjI0MzM1NGI0OTI5ODkxZjAwOGQ2MmJlIiwiaXNzIjoicm9nZXJnY2NAZ21haWwuY29tIn0.l9yNR0LiTeT01VNsb9OjJiQMQketreZ_a8uWsVP-_L0",
      "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2NDg1NzE3MjMsImV4cCI6MTY0ODY1ODEyMywiYXVkIjoiNjI0MzM1NGI0OTI5ODkxZjAwOGQ2MmJlIiwiaXNzIjoicm9nZXJnY2NAZ21haWwuY29tIn0.vNpFs0ABS0XRICgfMMwqQ124GSPFYOU_CMxhA7LPT7I"
    }
    ```
