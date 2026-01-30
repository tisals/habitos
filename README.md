
# 🚀 Despliegue: La Llave de tu Potencial

Este documento detalla los pasos para instalar y desplegar el prototipo de **La Llave de tu Potencial** en un VPS con **Ubuntu 24.04** utilizando **Docker** y el panel de control **EasyPanel**.

## 📋 Requisitos Previos

- Un VPS con Ubuntu 24.04 (LTS).
- Acceso SSH al servidor.
- Un dominio o subdominio apuntando a la IP de tu VPS (opcional, pero recomendado).

---
## 🎛️ Paso 1: Instalación de EasyPanel

EasyPanel es un panel de control moderno que simplifica el despliegue de aplicaciones Docker.

```bash
# Ejecutar script de instalación oficial de EasyPanel
curl -sSL https://get.easypanel.io | sh
```

Una vez finalizada la instalación, podrás acceder al panel desde tu navegador:
`http://TU_IP_DEL_VPS:3000`

*Sigue las instrucciones en pantalla para crear tu cuenta de administrador.*

---

## 🚢 Paso 2: Despliegue de la Aplicación

1.  **Entra en EasyPanel**: Inicia sesión en tu panel.
2.  **Crea un Proyecto**: Haz clic en "Create Project" y nómbralo `la-llave`.
3.  **Crea un Servicio**: 
    - Elige "App".
    - Nombre del servicio: `frontend`.
4.  **Configura el Origen (Source)**:
    - Si tienes el código en GitHub: Conecta tu cuenta y selecciona el repositorio.
    - Si usas Docker directamente: EasyPanel detectará automáticamente el archivo `Dockerfile` en la raíz del proyecto.
5.  **Dominios**:
    - EasyPanel te asignará una URL interna o puedes configurar tu propio dominio en la pestaña "Domains".
6.  **Desplegar**: Haz clic en el botón "Deploy".

---

## ⚙️ Estructura del Proyecto para Producción

Para que el despliegue funcione correctamente, asegúrate de que tu repositorio contenga:

- `index.html`: Punto de entrada.
- `index.tsx` y archivos de vista: Código fuente.
- `Dockerfile`: Incluido en este repositorio para configurar Nginx.
- `metadata.json`: Para permisos específicos del navegador.

---

## 🛡️ Seguridad Recomendada

Se recomienda configurar un firewall básico en Ubuntu:

```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
```

---

## 📝 Notas del Prototipo

- **Rituales Actualizados**: Los rituales C.A.F.É., A.R.A y L.I.F.E. han sido actualizados con pasos detallados, duración y checklists que guían al usuario.
- **Audios Guiados**: Cada paso de los rituales ahora incluye un audioPath para proporcionar una experiencia guiada (disponible en `/public/assets/audio/rituals`).
- **Checklists Interactivas**: Se han implementado checklists para cada paso del ritual, permitiendo a los usuarios marcar su progreso.
- **Lógica de Avance Flexible**: El avance entre pasos se adapta al modo: manual (50% del tiempo y todos los checkpoints marcados) o audio (el botón se habilita al finalizar el audio).
- **Datos**: Esta versión utiliza `localStorage` para persistencia local en el navegador (Datos Dummy). No requiere base de datos externa en esta fase.
- **Micrófono**: La aplicación solicita permisos de micrófono para futuras integraciones de IA (configurado en `metadata.json`).
