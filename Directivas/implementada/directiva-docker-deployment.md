# Directiva: Despliegue con Docker
## Proyecto: La Llave de tu Potencial

### 0. Idea fuerza
Esta directiva existe para que cualquier desarrollador pueda: **"construir y desplegar la aplicación en cualquier entorno con un solo comando"**.

---

### 1. Misión
Proporcionar una configuración de Docker optimizada, reproducible y lista para producción que:
- Construya la aplicación React/Vite de forma eficiente
- Sirva los assets estáticos con Nginx optimizado
- Sea fácil de mantener y actualizar

---

### 2. Responsabilidad Única
**Empaquetar y servir** la aplicación web de forma consistente en cualquier entorno (desarrollo, staging, producción).

---

### 3. Arquitectura del Build

#### 3.1 Multi-stage Build
```
Stage 1 (builder): Node.js Alpine
  ├─ Instalar dependencias
  ├─ Copiar código fuente
  └─ Ejecutar build de Vite

Stage 2 (production): Nginx Alpine
  ├─ Copiar dist/ desde builder
  ├─ Configurar Nginx
  └─ Exponer puerto 80
```

#### 3.2 Estructura de Archivos Copiados
```
/app
├── package*.json          # Dependencias
├── tsconfig.json          # Config TypeScript
├── vite.config.ts         # Config Vite
├── index.html             # HTML principal
├── src/                   # Código fuente
│   ├── App.tsx
│   ├── index.tsx
│   ├── components/
│   ├── views/
│   ├── services/
│   ├── constants/
│   ├── types/
│   └── utils/
├── public/                # Assets estáticos
└── views/                 # Views legacy (compatibilidad)
```

---

### 4. Configuración de Nginx

#### 4.1 Características Principales
- **SPA Routing**: `try_files $uri $uri/ /index.html`
- **Cache de Assets**: 1 año para JS/CSS/imágenes
- **No-cache HTML**: Siempre servir última versión
- **Gzip**: Compresión para texto/JSON/JS/CSS
- **Error Handling**: 404 → index.html (client-side routing)

#### 4.2 Optimizaciones
```nginx
# Cache agresivo para assets con hash
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# No cache para HTML (siempre fresh)
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-store, no-cache, must-revalidate";
}

# Gzip para reducir tamaño de transferencia
gzip on;
gzip_types text/plain text/css application/json application/javascript;
```

---

### 5. .dockerignore

Excluir archivos innecesarios para optimizar el contexto de build:
```
node_modules/
dist/
.git/
*.log
.env*
Directivas/
README.md
```

**Beneficio**: Reduce tiempo de build y tamaño de imagen.

---

### 6. Comandos de Docker

#### 6.1 Build
```bash
docker build -t la-llave-potencial:latest .
```

#### 6.2 Run (desarrollo local)
```bash
docker run -p 8080:80 la-llave-potencial:latest
```

#### 6.3 Run (producción con variables de entorno)
```bash
docker run -p 80:80 \
  -e NODE_ENV=production \
  la-llave-potencial:latest
```

#### 6.4 Docker Compose (opcional)
```yaml
version: '3.8'
services:
  web:
    build: .
    ports:
      - "80:80"
    restart: unless-stopped
```

---

### 7. Reglas de Oro

1. **Multi-stage siempre**: Separar build de runtime reduce tamaño final
2. **Alpine images**: Usar `-alpine` para imágenes más ligeras
3. **Cache layers**: Copiar `package*.json` primero para aprovechar cache de npm
4. **No secrets en imagen**: Nunca incluir `.env` o credenciales
5. **Health checks**: Agregar `HEALTHCHECK` en producción
6. **Permisos correctos**: `chmod -R 755` para assets servidos por Nginx

---

### 8. Dependencias

- **Node.js 20 Alpine**: Para build stage
- **Nginx Stable Alpine**: Para production stage
- **Vite**: Build tool (configurado en `vite.config.ts`)
- **npm**: Package manager

---

### 9. Casos Borde

#### 9.1 Build falla por memoria
```dockerfile
# Aumentar memoria de Node.js
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

#### 9.2 Assets no se cargan (CORS)
```nginx
# Agregar headers CORS si es necesario
add_header Access-Control-Allow-Origin "*";
```

#### 9.3 Rutas de SPA no funcionan
```nginx
# Asegurar try_files correcto
try_files $uri $uri/ /index.html;
```

---

### 10. Métricas de Éxito

- **Tamaño de imagen final**: < 50 MB
- **Tiempo de build**: < 3 minutos
- **Tiempo de inicio**: < 2 segundos
- **Lighthouse Performance**: > 90

---

### 11. Integración con CI/CD

#### 11.1 GitHub Actions (ejemplo)
```yaml
- name: Build Docker image
  run: docker build -t ${{ secrets.REGISTRY }}/la-llave:${{ github.sha }} .

- name: Push to registry
  run: docker push ${{ secrets.REGISTRY }}/la-llave:${{ github.sha }}
```

#### 11.2 Tags recomendados
- `latest`: Última versión estable
- `v1.0.0`: Versión específica
- `sha-abc123`: Commit específico

---

### 12. Checklist Pre-deploy

- [ ] Dockerfile actualizado con estructura `src/`
- [ ] `.dockerignore` incluye `node_modules/` y `dist/`
- [ ] `nginx.conf` configurado para SPA routing
- [ ] Build local exitoso: `docker build -t test .`
- [ ] Run local exitoso: `docker run -p 8080:80 test`
- [ ] Verificar assets se cargan correctamente
- [ ] Verificar rutas de SPA funcionan (refresh en `/rituales`)

---

### 13. Registro de Aprendizaje

- Si el build es lento, revisar cache de layers (copiar `package.json` antes que código)
- Si la imagen es grande, verificar que `.dockerignore` excluye `node_modules/`
- Si las rutas no funcionan, verificar `try_files` en nginx.conf
- Si los assets no se cachean, verificar headers `Cache-Control`

---

### 14. Próximos Pasos (Futuro)

- [ ] Agregar `HEALTHCHECK` para monitoreo
- [ ] Implementar multi-arch builds (ARM64 + AMD64)
- [ ] Configurar SSL/TLS con Let's Encrypt
- [ ] Agregar logging estructurado
- [ ] Implementar rate limiting en Nginx
