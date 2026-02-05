# 🔑 La Llave de tu Potencial - MVP Fase 1

**Progressive Web App (PWA)** para desarrollo de hábitos productivos mediante rituales guiados: P.I.T., C.A.F.É. y L.I.F.E.

## 🏗️ Arquitectura Actual

- **Frontend**: React 18 + TypeScript + Vite
- **Estilos**: Tailwind CSS (configuración personalizada)
- **Estado**: LocalStorage (persistencia local)
- **PWA**: Service Worker + Manifest
- **Audio**: Web Audio API
- **Despliegue**: Docker + Nginx

## 📁 Estructura del Proyecto

```
/
├── Directivas/                    # Documentación técnica y directivas
│   ├── Directiva_identidad_visual.md
│   ├── directiva-mvp-hibrido-fase1.md
│   ├── directiva_ux_experiencia_usuario.md
│   └── ...
├── public/
│   ├── manifest.json              # Configuración PWA
│   ├── service-worker.js          # Cache offline-first
│   └── assets/
│       ├── icons/                 # Iconos PWA (192x192, 512x512)
│       └── audio/rituals/         # Audios guiados por ritual
├── src/
│   ├── components/
│   │   ├── ui/                    # Componentes UI reutilizables
│   │   └── ritual/                # Componentes específicos de rituales
│   ├── views/                     # Vistas principales
│   │   ├── DashboardView.tsx
│   │   ├── RitualView.tsx
│   │   ├── DiagnosticView.tsx
│   │   └── ...
│   ├── services/
│   │   ├── StorageService.ts      # Abstracción de LocalStorage
│   │   └── AudioService.ts        # Gestión de audio
│   ├── hooks/                     # Custom React hooks
│   ├── utils/                     # Utilidades
│   ├── types/                     # Definiciones TypeScript
│   ├── constants/
│   │   ├── theme.ts               # Colores, tipografía, espaciado
│   │   └── data.ts                # Datos mock (rituales, usuarios)
│   ├── App.tsx
│   └── index.tsx
├── Dockerfile                     # Configuración Docker + Nginx
├── nginx.conf                     # Configuración Nginx
├── package.json
└── vite.config.ts
```

## 🚀 Despliegue en VPS Ubuntu 24.04

### 📋 Requisitos Previos

- VPS con **Ubuntu 24.04 LTS**
- Acceso SSH al servidor
- Dominio o subdominio apuntando a la IP del VPS (recomendado para HTTPS)

---

### 🎛️ Paso 1: Instalación de EasyPanel

EasyPanel simplifica el despliegue de aplicaciones Docker con interfaz web.

```bash
# Conectar al VPS por SSH
ssh root@TU_IP_DEL_VPS

# Instalar EasyPanel
curl -sSL https://get.easypanel.io | sh
```

**Acceso al panel**: `http://TU_IP_DEL_VPS:3000`

Sigue las instrucciones en pantalla para crear tu cuenta de administrador.

---

### 🚢 Paso 2: Despliegue de la Aplicación

#### Opción A: Desde GitHub (Recomendado)

1. **Crear Proyecto en EasyPanel**:
   - Nombre: `la-llave-potencial`

2. **Crear Servicio**:
   - Tipo: **App**
   - Nombre: `frontend`

3. **Configurar Source**:
   - Conecta tu cuenta de GitHub
   - Selecciona el repositorio
   - Branch: `main` o `master`
   - Build Command: `npm run build`
   - Start Command: (automático, usa Dockerfile)

4. **Configurar Dominio**:
   - En la pestaña "Domains", agrega tu dominio
   - EasyPanel configurará automáticamente SSL con Let's Encrypt

5. **Deploy**: Haz clic en "Deploy"

#### Opción B: Instalación Manual con Docker

```bash
# 1. Instalar Docker (si no está instalado)
sudo apt update
sudo apt install -y docker.io docker-compose
sudo systemctl enable docker
sudo systemctl start docker

# 2. Clonar el repositorio
git clone https://github.com/TU_USUARIO/la-llave-potencial.git
cd la-llave-potencial

# 3. Construir la imagen Docker
docker build -t la-llave-app .

# 4. Ejecutar el contenedor
docker run -d \
  --name la-llave-frontend \
  -p 80:80 \
  --restart unless-stopped \
  la-llave-app

# 5. Verificar que está corriendo
docker ps
```

**Acceso**: `http://TU_IP_DEL_VPS`

---

### 🔒 Paso 3: Configurar HTTPS (Obligatorio para PWA)

Las PWA requieren HTTPS para funcionar (excepto en localhost).

#### Con EasyPanel:
- EasyPanel configura automáticamente SSL con Let's Encrypt al agregar un dominio.

#### Manual con Certbot:

```bash
# 1. Instalar Certbot
sudo apt install -y certbot python3-certbot-nginx

# 2. Obtener certificado SSL
sudo certbot --nginx -d tudominio.com -d www.tudominio.com

# 3. Renovación automática (ya configurada por Certbot)
sudo certbot renew --dry-run
```

---

### 🛡️ Paso 4: Configurar Firewall

```bash
# Permitir SSH, HTTP, HTTPS y EasyPanel
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow 3000/tcp
sudo ufw enable
sudo ufw status
```

---

## 🧪 Desarrollo Local

```bash
# 1. Instalar dependencias
npm install

# 2. Ejecutar en modo desarrollo
npm run dev

# 3. Construir para producción
npm run build

# 4. Previsualizar build de producción
npm run preview
```

**Acceso local**: `http://localhost:5173`

---

## ✅ Validación PWA

### 1. Probar Instalación PWA

- Abrir la app en Chrome/Edge
- Buscar el ícono de instalación en la barra de direcciones
- Instalar y verificar que funciona como app nativa

### 2. Auditoría con Lighthouse

```bash
# En Chrome DevTools
1. F12 > Lighthouse
2. Seleccionar: PWA, Performance, Accessibility
3. Generate report
```

**Objetivos**:
- PWA: ≥ 90
- Performance: ≥ 80
- Accessibility: ≥ 90

### 3. Probar Modo Offline

```bash
# En Chrome DevTools
1. F12 > Network
2. Seleccionar "Offline"
3. Recargar la página
4. Verificar que la app funciona sin conexión
```

---

## 📝 Características del MVP

### Rituales Implementados

- **P.I.T.** (Pausa · Intención · Tracción): Ritual de rescate de 3-5 min
- **C.A.F.É.** (Concentración, Acción, Flujo, Energía): Ritual de productividad de 25 min
- **L.I.F.E.** (Liberación, Integración, Futuro, Energía): Ritual de cierre de 20 min

### Funcionalidades

- ✅ **PWA Instalable**: Funciona offline, se instala como app nativa
- ✅ **Audios Guiados**: Cada paso incluye audio de guía (modo asistido)
- ✅ **Modo Manual/Asistido**: El usuario elige cómo realizar el ritual
- ✅ **Checklists Interactivas**: Seguimiento de progreso por paso
- ✅ **Persistencia Local**: LocalStorage para datos del usuario
- ✅ **Identidad Visual**: Colores y tipografía según directiva
- ✅ **Responsive**: Optimizado para móvil (mobile-first)
- ✅ **Diagnóstico Inicial**: Evaluación del nivel del usuario

### Limitaciones Conocidas (Fase 1)

- ⚠️ **Sin Backend**: Datos solo en LocalStorage (no sincroniza entre dispositivos)
- ⚠️ **Sin Autenticación**: No hay login/registro
- ⚠️ **Sin Notificaciones Push**: Solo notificaciones locales del navegador
- ⚠️ **Límite de Almacenamiento**: LocalStorage tiene límite de ~5-10MB

---

## 🔮 Roadmap Fase 2

- [ ] Backend PHP/Laravel con API REST
- [ ] Autenticación JWT
- [ ] Base de datos MySQL
- [ ] Sincronización multi-dispositivo
- [ ] Notificaciones push reales
- [ ] Análisis de progreso con gráficas
- [ ] Gamificación avanzada

---

## 📚 Documentación Técnica

Consulta la carpeta `Directivas/` para documentación detallada:

- `directiva-mvp-hibrido-fase1.md`: Arquitectura y plan de implementación
- `Directiva_identidad_visual.md`: Guía de diseño y colores
- `directiva_ux_experiencia_usuario.md`: Principios de UX
- `directiva_modos_ritual.md`: Lógica de rituales
- `requerimientos.md`: Requerimientos completos del sistema

---

## 🐛 Troubleshooting

### Service Worker no se actualiza

```bash
# En Chrome DevTools
1. F12 > Application > Service Workers
2. Click en "Unregister"
3. Recargar la página con Ctrl+Shift+R
```

### Audio no reproduce en iOS

- iOS requiere interacción del usuario antes de reproducir audio
- El botón "Iniciar Ritual" activa el contexto de audio

### App no se instala como PWA

- Verificar que estás en HTTPS (no HTTP)
- Verificar que `manifest.json` y `service-worker.js` están accesibles
- Revisar consola del navegador para errores

---

## 📞 Soporte

Para reportar bugs o solicitar features, contacta al equipo de desarrollo.

**Versión**: 1.0.0 (MVP Fase 1)
**Última actualización**: Febrero 2026
