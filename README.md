# 🚀 Despliegue: La Llave de tu Potencial

Guía rápida para desplegar el prototipo en un VPS con **Ubuntu 24.04** usando **Docker** y **EasyPanel**.

---

## 🛠️ Paso 1: Subir el código a GitHub

1. **Crea un repositorio** en tu cuenta de GitHub (ej: `la-llave-app`).
2. **Inicializa y sube los archivos** desde tu carpeta local:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Prototipo La Llave de tu Potencial"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

---

## 🎛️ Paso 2: Instalar EasyPanel en tu VPS

Conéctate a tu servidor Ubuntu 24.04 vía SSH y ejecuta el script oficial de instalación. Esto instalará Docker y el panel automáticamente.

```bash
# Actualizar sistema e instalar EasyPanel
curl -sSL https://get.easypanel.io | sh
```

Una vez finalizado, accede a:
`http://LA_IP_DE_TU_VPS:3000`

*Crea tu usuario y contraseña de administrador al entrar por primera vez.*

---

## 🚢 Paso 3: Desplegar desde GitHub

1. **Crear Proyecto**: En el dashboard de EasyPanel, haz clic en **"Create Project"** y nómbralo `la-llave`.
2. **Crear Servicio**: Dentro del proyecto, selecciona **"App"** y nómbrala `frontend`.
3. **Configurar GitHub**:
   - En la pestaña **"Source"**, selecciona **"GitHub"**.
   - Conecta tu cuenta de GitHub y selecciona el repositorio que creaste en el Paso 1.
   - Asegúrate de que la rama sea `main`.
4. **Desplegar**: Haz clic en el botón **"Deploy"**. 
   - EasyPanel detectará el `Dockerfile` automáticamente y servirá la app.
5. **Configurar Dominio (Opcional)**:
   - Ve a la pestaña **"Domains"** para asignar un subdominio gratuito de EasyPanel o vincular tu propio dominio apuntando a la IP del VPS.

---

## 📝 Notas del Prototipo
- **Persistencia**: Los datos se guardan en el `localStorage` del navegador.
- **Dockerfile**: El archivo incluido utiliza Nginx Alpine para un rendimiento ligero y rápido.
- **Seguridad**: EasyPanel gestiona automáticamente los certificados SSL (HTTPS) si configuras un dominio.