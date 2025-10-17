# 🤖 ESPECIFICACIONES COMPLETAS PARA VALIDACIÓN POR AGENTE IA

**Fecha:** 15 de Octubre de 2025  
**Para:** Otro agente IA (validación e implementación)  
**Sistema:** API GraphQL + MCP para Gestión de Eventos

---

## 📋 ÍNDICE

1. [Nuevo Servicio: Website Management](#nuevo-servicio-website-management)
2. [Gestión de Media (Imágenes/Videos)](#gestión-de-media)
3. [Herramientas MCP Existentes](#herramientas-mcp-existentes)
4. [Herramientas MCP de Websites (Nuevas)](#herramientas-mcp-websites)
5. [Checklist de Validación](#checklist-de-validación)
6. [Archivos Implementados](#archivos-implementados)
7. [Testing y Verificación](#testing-y-verificación)

---

## 🌐 NUEVO SERVICIO: WEBSITE MANAGEMENT

### **Descripción:**
Sistema completo para gestionar sitios web vinculados a entidades CRM, whitelabels y eventos.

### **Modelo MongoDB:**

**Archivo:** `src/db/models/crm/Website.ts`

```typescript
{
  _id: ObjectId,
  name: String,                    // Nombre del sitio
  slug: String,                    // URL slug (único por development)
  websiteType: "ENTITY" | "WHITELABEL" | "EVENT",
  
  linkedTo: {
    type: "CRM_Entity" | "Whitelabel" | "Event",
    id: ObjectId
  },
  
  domain: {
    type: "SUBDOMAIN" | "CUSTOM",
    value: String,                 // URL del dominio
    verified: Boolean,
    verificationToken: String,
    dnsRecords: [{
      type: "A" | "CNAME" | "TXT",
      name: String,
      value: String,
      verified: Boolean
    }]
  },
  
  content: {
    html: String,                  // Máximo 2MB
    css: String,
    js: String,
    metadata: Mixed
  },
  
  status: "DRAFT" | "PUBLISHED" | "SUSPENDED" | "ARCHIVED",
  publishedAt: Date,
  publishedUrl: String,
  
  analytics: {
    views: Number,
    uniqueVisitors: Number,
    lastVisit: Date,
    pageViews: Map<String, Number>
  },
  
  seo: {
    title: String,
    description: String,
    keywords: [String],
    ogImage: String,
    favicon: String,
    robots: String,
    canonicalUrl: String
  },
  
  development: String,             // Multi-tenant
  ownership: {
    primary_owner: {
      user_id: String,
      name: String
    },
    shared_with_users: [String]
  },
  
  tags: [String],
  custom_fields: Mixed,
  createdBy: String,
  createdAt: Date,
  updatedAt: Date
}
```

**Colección:** `crm_websites` (en base de datos principal)

**Índices:**
```javascript
{ development: 1, websiteType: 1 }
{ slug: 1, development: 1 } // UNIQUE
{ 'domain.value': 1 } // SPARSE
{ 'ownership.primary_owner.user_id': 1 }
{ 'linkedTo.type': 1, 'linkedTo.id': 1 }
{ status: 1, publishedAt: -1 }
Text index en: name, slug, tags
```

---

### **Schema GraphQL:**

**Archivo:** `src/graphql/typeDefs/crm/website.ts`

#### **Queries (13):**

1. `getCRMWebsites(filters, pagination, sort)` - Listar con filtros
2. `getCRMWebsite(id)` - Por ID
3. `getCRMWebsiteBySlug(slug, development)` - Por slug
4. `getCRMWebsiteByDomain(domain)` - Por dominio
5. `getCRMWebsitesByEntity(entityId)` - De una entidad
6. `getCRMWebsitesByWhitelabel(whitelabelId)` - De un whitelabel
7. `getCRMWebsitesByEvent(eventId)` - De un evento
8. `getMyCRMWebsites(filters, pagination)` - Del usuario actual
9. `getCRMWebsiteAnalytics(websiteId, dateRange)` - Analytics
10. `checkCRMWebsiteSlugAvailability(slug, websiteType, development)` - Verificar slug
11. `checkCRMDomainAvailability(domain)` - Verificar dominio
12. `getCRMWebsiteStats(development)` - Estadísticas generales

#### **Mutations (16):**

**CRUD:**
1. `createCRMWebsite(input)` - Crear
2. `updateCRMWebsite(id, input)` - Actualizar
3. `deleteCRMWebsite(id)` - Eliminar
4. `duplicateCRMWebsite(id, newName, newSlug)` - Duplicar

**Contenido:**
5. `updateCRMWebsiteContent(id, content)` - Actualizar HTML/CSS/JS
6. `updateCRMWebsiteSEO(id, seo)` - Actualizar SEO

**Publicación:**
7. `publishCRMWebsite(id)` - Publicar (DRAFT → PUBLISHED)
8. `unpublishCRMWebsite(id)` - Despublicar (PUBLISHED → DRAFT)
9. `suspendCRMWebsite(id, reason)` - Suspender
10. `archiveCRMWebsite(id)` - Archivar
11. `restoreCRMWebsite(id)` - Restaurar

**Dominios:**
12. `setCRMWebsiteCustomDomain(id, domain, dnsRecords)` - Configurar dominio
13. `verifyCRMWebsiteDomain(id)` - Verificar DNS
14. `removeCRMWebsiteCustomDomain(id)` - Quitar dominio

**Otros:**
15. `trackCRMWebsiteView(websiteId, visitorId, page, referrer)` - Track analytics
16. `addCRMWebsiteTags` / `removeCRMWebsiteTags` - Gestión de tags
17. `shareCRMWebsite` / `unshareCRMWebsite` - Compartir

---

### **Resolvers:**

**Archivo:** `src/graphql/resolvers/crm/website.ts`

**Características:**
- ✅ CRUD completo
- ✅ Validación de ownership
- ✅ Validación de development (multi-tenant)
- ✅ Paginación y filtros
- ✅ Manejo de errores
- ✅ Logging de acciones
- ✅ Field resolvers para relaciones polimórficas

**Integración:** Exportado en `src/graphql/resolvers/crm/index.ts`

---

### **Servicios:**

#### **1. WebsiteDomainService**
**Archivo:** `src/services/websiteDomainService.ts`

**Funciones:**
- `generateVerificationToken()` - Token único para verificación DNS
- `verifyDomain(website)` - Verificar todos los DNS records
- `verifyDNSRecord(type, name, value)` - Verificar un record específico
- `verifyCNAME(domain, expected)` - Verificar CNAME
- `verifyA(domain, expectedIP)` - Verificar registro A
- `verifyTXT(domain, expectedValue)` - Verificar registro TXT
- `generateRecommendedDNSRecords(customDomain, targetSubdomain)` - Generar records
- `validateDomain(domain, websiteId?)` - Validar formato y disponibilidad
- `generateSubdomain(slug, baseDomain?)` - Generar subdominio

#### **2. WebsiteAnalyticsService**
**Archivo:** `src/services/websiteAnalyticsService.ts`

**Funciones:**
- `trackView({websiteId, slug, domain, visitorId, page, referrer})` - Registrar vista
- `getAnalytics(websiteId, dateRange?)` - Obtener analytics
- `generateTrackingPixel(websiteId, apiUrl?)` - Generar pixel JS
- `injectTrackingPixel(html, websiteId)` - Inyectar pixel en HTML

**Pixel de Tracking:**
- Se inyecta automáticamente al publicar
- Usa localStorage para visitor_id
- Track de views y tiempo en página
- Mutation GraphQL para registrar vistas

---

## 🎨 GESTIÓN DE MEDIA

### **Problema:**
¿Cómo gestionar imágenes y videos en los sitios web?

### **Solución Implementada:**

#### **OPCIÓN 1: URLs Externas (RECOMENDADO) ⭐**

El cliente sube media a CDN externo y usa URLs en HTML.

**Flujo:**
1. Cliente sube imagen/video a CDN (Cloudinary, S3, Imgur, YouTube)
2. CDN devuelve URL: `https://cdn.cloudinary.com/imagen.jpg`
3. Cliente inserta en HTML: `<img src="https://cdn.cloudinary.com/imagen.jpg">`
4. Cliente guarda website con `updateCRMWebsiteContent`
5. Publicar con `publishCRMWebsite`

**Ventajas:**
- ✅ No ocupa espacio en MongoDB
- ✅ CDN optimiza carga
- ✅ Sin límite de tamaño
- ✅ Optimización automática (WebP, resize)

**CDNs recomendados:**
- Cloudinary (gratis 25GB/mes)
- Imgur
- AWS S3 + CloudFront
- imgbb

#### **OPCIÓN 2: Base64 (solo imágenes pequeñas < 50KB)**

```html
<img src="data:image/png;base64,iVBORw0KGgo...">
```

**Usar solo para:**
- Iconos
- Logos pequeños
- Favicons

#### **OPCIÓN 3: custom_fields con URLs**

```graphql
mutation {
  updateCRMWebsite(id: "xxx", input: {
    custom_fields: {
      media: {
        logo: "https://cdn.com/logo.png",
        gallery: [
          "https://cdn.com/img1.jpg",
          "https://cdn.com/img2.jpg"
        ],
        videos: [
          "https://youtube.com/embed/VIDEO_ID"
        ]
      }
    }
  })
}
```

#### **Videos:**

**SIEMPRE usar plataformas externas:**

```html
<!-- YouTube -->
<iframe src="https://www.youtube.com/embed/VIDEO_ID"></iframe>

<!-- Vimeo -->
<iframe src="https://player.vimeo.com/video/VIDEO_ID"></iframe>

<!-- Auto-hosted (S3) -->
<video controls>
  <source src="https://cdn.com/video.mp4" type="video/mp4">
</video>
```

**❌ NUNCA guardar videos en MongoDB**

---

### **Funcionalidad Futura (NO IMPLEMENTADA):**

#### **Servicio de Upload:**

```typescript
POST /api/websites/:id/upload
Content-Type: multipart/form-data

Flujo:
1. Recibe archivo
2. Valida tipo y tamaño
3. Sube a S3/Cloudinary
4. Devuelve URL
5. Guarda referencia en custom_fields

Response:
{
  success: true,
  url: "https://cdn.com/uploaded-image.jpg",
  metadata: {
    size: 125000,
    type: "image/jpeg",
    dimensions: { width: 1920, height: 1080 }
  }
}
```

**Estado:** ❌ NO IMPLEMENTADO (cliente maneja upload externamente)

---

## 🛠️ HERRAMIENTAS MCP EXISTENTES

**Archivo principal:** `src/mcp/server.ts`

### **Categorías de herramientas:**

#### **1. EVENTOS (Event Management)**
**Archivo:** `src/mcp/tools/eventTools.ts`

Herramientas disponibles:
- `query_event` - Consulta info de evento en lenguaje natural
- `get_user_events` - Lista eventos de un usuario
- `get_event_details` - Detalles completos de un evento
- `create_event` - Crear nuevo evento
- `update_event` - Actualizar evento
- `delete_event` - Eliminar evento
- `get_event_permissions` - Obtener permisos de evento
- `add_event_collaborator` - Agregar colaborador
- `get_event_url` - Generar URL del evento

#### **2. INVITADOS (Guest Management)**
**Archivo:** `src/mcp/tools/guestTools.ts`

Herramientas:
- `get_event_guests` - Listar invitados de evento
- `get_guest_details` - Detalles de invitado
- `create_guest` - Crear invitado
- `update_guest` - Actualizar invitado
- `delete_guest` - Eliminar invitado
- `search_guests` - Buscar invitados
- `import_guests` - Importar múltiples invitados
- `get_guest_stats` - Estadísticas de invitados
- `send_invitation` - Enviar invitación

#### **3. PRESUPUESTO (Budget Management)**
**Archivo:** `src/mcp/tools/budgetTools.ts`

Herramientas:
- `get_event_budget` - Obtener presupuesto
- `create_budget_item` - Crear ítem de presupuesto
- `update_budget_item` - Actualizar ítem
- `delete_budget_item` - Eliminar ítem
- `get_budget_summary` - Resumen de presupuesto
- `get_budget_by_category` - Gastos por categoría

#### **4. TAREAS (Task Management)**
**Archivo:** `src/mcp/tools/taskTools.ts`

Herramientas:
- `get_event_tasks` - Listar tareas
- `create_task` - Crear tarea
- `update_task` - Actualizar tarea
- `delete_task` - Eliminar tarea
- `mark_task_complete` - Marcar como completada
- `assign_task` - Asignar tarea a usuario

#### **5. MENÚ (Menu Management)**
**Archivo:** `src/mcp/tools/menuTools.ts`

Herramientas:
- `get_event_menu` - Obtener menú del evento
- `create_menu_item` - Crear plato/bebida
- `update_menu_item` - Actualizar ítem
- `delete_menu_item` - Eliminar ítem

#### **6. CHAT Y MENSAJERÍA**
**Archivo:** `src/mcp/tools/chatTools.ts`

Herramientas:
- `get_user_chats` - Obtener chats de usuario
- `get_chat_messages` - Mensajes de un chat
- `create_chat` - Crear nuevo chat
- `send_message` - Enviar mensaje
- `get_chat_stats` - Estadísticas de chat
- `search_chats` - Buscar chats

#### **7. WHATSAPP**
**Archivo:** `src/mcp/tools/whatsappTools.ts`

Herramientas:
- `send_whatsapp_message` - Enviar mensaje WhatsApp
- `get_whatsapp_status` - Estado de conexión
- `get_whatsapp_chats` - Chats de WhatsApp

#### **8. FIREBASE AUTH**
**Archivo:** `src/mcp/tools/firebaseTools.ts`

Herramientas:
- `get_uid_by_email` - UID por email
- `get_uid_by_phone` - UID por teléfono
- `get_events_by_user` - Eventos de usuario

#### **9. PS_IA (Persistencia Sistema IA)**
**Archivo:** `src/mcp/tools/PS_IA_tools.ts`

Herramientas:
- `create_ps_ia_record` - Crear registro PS_IA
- `get_ps_ia_records` - Obtener registros
- `update_ps_ia_record` - Actualizar registro
- `delete_ps_ia_record` - Eliminar registro
- `search_ps_ia` - Buscar en PS_IA

#### **10. GENERACIÓN DE URLS**
**Archivo:** `src/mcp/tools/urlGeneratorTools.ts`

Herramientas:
- `generate_event_url` - URL de evento
- `generate_guest_pass_url` - URL de pase de invitado
- `generate_invitation_url` - URL de invitación

#### **11. GENERAL**

Herramientas:
- `health_check` - Estado de API y BD
- `get_posts` - Posts de bodas
- `count_posts` - Contar posts
- `get_info` - Info de la API

---

## 🌐 HERRAMIENTAS MCP WEBSITES (NUEVAS)

### **Estado:** ✅ **ESPECIFICADAS - PENDIENTE DE IMPLEMENTACIÓN**

**Archivo a crear:** `src/mcp/tools/websiteTools.ts`

```typescript
// ===== HERRAMIENTAS PROPUESTAS =====

1. get_user_websites
   Descripción: Obtener todos los websites de un usuario
   Input:
     - userId: String
     - filters?: { websiteType, status }
     - limit?: Number
   Output:
     - websites: Array<Website>
     - total: Number

2. get_website_details
   Descripción: Detalles completos de un website
   Input:
     - websiteId: String
   Output:
     - website: Website (con content, analytics, seo, domain)

3. create_website
   Descripción: Crear nuevo website
   Input:
     - name: String
     - slug: String
     - websiteType: "ENTITY" | "WHITELABEL" | "EVENT"
     - linkedToType: String
     - linkedToId: String
     - html: String
     - css?: String
     - js?: String
     - seo?: Object
   Output:
     - success: Boolean
     - website: Website

4. update_website_content
   Descripción: Actualizar HTML/CSS/JS del website
   Input:
     - websiteId: String
     - html?: String
     - css?: String
     - js?: String
   Output:
     - success: Boolean
     - website: Website

5. publish_website
   Descripción: Publicar website (DRAFT → PUBLISHED)
   Input:
     - websiteId: String
   Output:
     - success: Boolean
     - publishedUrl: String

6. unpublish_website
   Descripción: Despublicar website
   Input:
     - websiteId: String
   Output:
     - success: Boolean

7. get_website_analytics
   Descripción: Obtener analytics del website
   Input:
     - websiteId: String
     - dateRange?: { from, to }
   Output:
     - views: Number
     - uniqueVisitors: Number
     - topPages: Array
     - lastVisit: Date

8. update_website_seo
   Descripción: Actualizar SEO del website
   Input:
     - websiteId: String
     - title?: String
     - description?: String
     - keywords?: Array<String>
     - ogImage?: String
   Output:
     - success: Boolean

9. set_custom_domain
   Descripción: Configurar dominio personalizado
   Input:
     - websiteId: String
     - domain: String
   Output:
     - success: Boolean
     - verificationToken: String
     - dnsRecords: Array

10. verify_domain
    Descripción: Verificar DNS del dominio
    Input:
      - websiteId: String
    Output:
      - verified: Boolean
      - dnsRecords: Array (con status de cada record)

11. delete_website
    Descripción: Eliminar website
    Input:
      - websiteId: String
    Output:
      - success: Boolean

12. duplicate_website
    Descripción: Duplicar website existente
    Input:
      - websiteId: String
      - newName: String
      - newSlug: String
    Output:
      - success: Boolean
      - website: Website
```

### **Implementación sugerida:**

```typescript
// src/mcp/tools/websiteTools.ts

import { Website } from '../../db/models/crm/Website';
import { websiteDomainService } from '../../services/websiteDomainService';
import { websiteAnalyticsService } from '../../services/websiteAnalyticsService';

export const websiteTools = {
  // Definiciones de herramientas
  tools: [
    {
      name: 'get_user_websites',
      description: 'Obtener todos los websites de un usuario',
      inputSchema: {
        type: 'object',
        properties: {
          userId: { type: 'string' },
          filters: {
            type: 'object',
            properties: {
              websiteType: {
                type: 'string',
                enum: ['ENTITY', 'WHITELABEL', 'EVENT']
              },
              status: {
                type: 'string',
                enum: ['DRAFT', 'PUBLISHED', 'SUSPENDED', 'ARCHIVED']
              }
            }
          },
          limit: { type: 'number', default: 20 }
        },
        required: ['userId']
      }
    },
    // ... resto de herramientas
  ],
  
  // Handlers
  async handleGetUserWebsites(args: any) {
    const { userId, filters, limit = 20 } = args;
    
    const query: any = {
      'ownership.primary_owner.user_id': userId
    };
    
    if (filters?.websiteType) {
      query.websiteType = filters.websiteType;
    }
    if (filters?.status) {
      query.status = filters.status;
    }
    
    const websites = await Website.find(query).limit(limit);
    const total = await Website.countDocuments(query);
    
    return {
      success: true,
      websites,
      total
    };
  },
  
  async handleCreateWebsite(args: any) {
    // Implementación de creación
    // ...
  },
  
  // ... resto de handlers
};

export default websiteTools;
```

---

## ✅ CHECKLIST DE VALIDACIÓN

### **Para el agente IA validador:**

#### **1. Backend - Modelo MongoDB**

- [ ] Verificar que existe `src/db/models/crm/Website.ts`
- [ ] Verificar schema completo con todos los campos
- [ ] Verificar índices creados correctamente
- [ ] Verificar métodos de instancia (publish, unpublish, etc.)
- [ ] Verificar validaciones (tamaño HTML, formato dominio, etc.)

#### **2. Backend - Schema GraphQL**

- [ ] Verificar que existe `src/graphql/typeDefs/crm/website.ts`
- [ ] Verificar 13 queries definidas
- [ ] Verificar 16 mutations definidas
- [ ] Verificar tipos de input (CRM_CreateWebsiteInput, etc.)
- [ ] Verificar tipos de respuesta (CRM_WebsiteResponse, etc.)
- [ ] Verificar enums (CRM_WebsiteType, CRM_WebsiteStatus, etc.)

#### **3. Backend - Resolvers**

- [ ] Verificar que existe `src/graphql/resolvers/crm/website.ts`
- [ ] Verificar implementación de todas las queries
- [ ] Verificar implementación de todas las mutations
- [ ] Verificar validación de ownership
- [ ] Verificar validación de development
- [ ] Verificar manejo de errores
- [ ] Verificar integración en `src/graphql/resolvers/crm/index.ts`

#### **4. Backend - Servicios**

- [ ] Verificar que existe `src/services/websiteDomainService.ts`
- [ ] Verificar funciones de verificación DNS
- [ ] Verificar generación de tokens
- [ ] Verificar que existe `src/services/websiteAnalyticsService.ts`
- [ ] Verificar tracking de vistas
- [ ] Verificar generación de pixel
- [ ] Verificar inyección de pixel en HTML

#### **5. MCP - Herramientas de Websites**

- [ ] ❌ NO EXISTE `src/mcp/tools/websiteTools.ts` - **CREAR**
- [ ] ❌ NO hay handlers MCP para websites - **IMPLEMENTAR**
- [ ] ❌ NO integrado en `src/mcp/server.ts` - **INTEGRAR**

**Acción requerida:** Implementar las 12 herramientas MCP propuestas

#### **6. Documentación**

- [ ] Verificar `DOCUMENTACION_WEBSITE_API_CLIENTE.md`
- [ ] Verificar `GUIA_RAPIDA_WEBSITE_API.md`
- [ ] Verificar `RESUMEN_IMPLEMENTACION_WEBSITES.md`
- [ ] Verificar ejemplos funcionales

#### **7. Testing**

- [ ] Crear website de prueba con GraphQL
- [ ] Publicar website
- [ ] Verificar URL publicada
- [ ] Verificar analytics
- [ ] Verificar dominio personalizado
- [ ] Verificar DNS

---

## 📂 ARCHIVOS IMPLEMENTADOS

### **Backend:**

```
src/
├── db/models/crm/
│   └── Website.ts ✅ EXISTE
├── graphql/
│   ├── typeDefs/crm/
│   │   └── website.ts ✅ EXISTE
│   └── resolvers/crm/
│       ├── website.ts ✅ EXISTE
│       └── index.ts ✅ ACTUALIZADO
└── services/
    ├── websiteDomainService.ts ✅ EXISTE
    └── websiteAnalyticsService.ts ✅ EXISTE
```

### **MCP (PENDIENTE):**

```
src/mcp/
├── tools/
│   └── websiteTools.ts ❌ NO EXISTE - CREAR
└── server.ts ⚠️ ACTUALIZAR (agregar website tools)
```

### **Documentación:**

```
/var/www/api-production/
└── ENTREGA_CLIENTE_WEBSITE/
    ├── README.md ✅
    ├── MENSAJE_PARA_CLIENTE_WEBSITE.md ✅
    ├── DOCUMENTACION_WEBSITE_API_CLIENTE.md ✅
    ├── GUIA_RAPIDA_WEBSITE_API.md ✅
    ├── RESUMEN_IMPLEMENTACION_WEBSITES.md ✅
    ├── PROPUESTA_WEBSITE_API_DETALLADA.md ✅
    └── RESPUESTA_WEBSITE_FEATURE.md ✅
```

---

## 🧪 TESTING Y VERIFICACIÓN

### **Test 1: Crear website**

```graphql
mutation {
  createCRMWebsite(input: {
    name: "Test Website"
    slug: "test-validation"
    websiteType: ENTITY
    linkedTo: {
      type: "CRM_Entity"
      id: "ENTITY_ID_AQUI"
    }
    domain: {
      type: SUBDOMAIN
      value: "test-validation.eventosorganizador.com"
    }
    content: {
      html: "<html><body><h1>Test de Validación</h1></body></html>"
    }
  }) {
    success
    website {
      id
      slug
      publishedUrl
    }
    errors
  }
}
```

**Resultado esperado:**
```json
{
  "success": true,
  "website": {
    "id": "ObjectId...",
    "slug": "test-validation",
    "publishedUrl": null
  },
  "errors": []
}
```

### **Test 2: Publicar website**

```graphql
mutation {
  publishCRMWebsite(id: "WEBSITE_ID") {
    success
    website {
      status
      publishedUrl
      publishedAt
    }
  }
}
```

**Resultado esperado:**
```json
{
  "success": true,
  "website": {
    "status": "PUBLISHED",
    "publishedUrl": "https://test-validation.eventosorganizador.com",
    "publishedAt": "2025-10-15T..."
  }
}
```

### **Test 3: Verificar en navegador**

```bash
curl https://test-validation.eventosorganizador.com
```

**Resultado esperado:**
```html
<html><body><h1>Test de Validación</h1>
<!-- Website Analytics Pixel -->
<script>
...tracking code...
</script>
</body></html>
```

### **Test 4: Analytics**

```graphql
query {
  getCRMWebsiteAnalytics(websiteId: "WEBSITE_ID") {
    views
    uniqueVisitors
    topPages {
      path
      views
    }
  }
}
```

### **Test 5: Dominio personalizado**

```graphql
mutation {
  setCRMWebsiteCustomDomain(
    id: "WEBSITE_ID"
    domain: "www.test-domain.com"
    dnsRecords: [
      { type: CNAME, name: "www", value: "test-validation.eventosorganizador.com" }
    ]
  ) {
    success
    website {
      domain {
        verificationToken
        dnsRecords {
          type
          name
          value
        }
      }
    }
  }
}
```

---

## 🚀 PRÓXIMOS PASOS PARA EL AGENTE IA

### **Paso 1: Validar implementación existente**

Revisar que todos los archivos de backend existen y funcionan:
- Modelo MongoDB
- Schema GraphQL
- Resolvers
- Servicios

### **Paso 2: Implementar herramientas MCP**

Crear `src/mcp/tools/websiteTools.ts` con las 12 herramientas propuestas.

### **Paso 3: Integrar en MCP server**

Actualizar `src/mcp/server.ts` para incluir las herramientas de websites.

### **Paso 4: Testing**

Ejecutar los 5 tests propuestos y verificar resultados.

### **Paso 5: Documentación MCP**

Crear documentación de las herramientas MCP de websites.

---

## 📞 CONTACTO Y SOPORTE

Si encuentras problemas o necesitas aclaraciones:
- Revisa los archivos de documentación completa
- Consulta los ejemplos de testing
- Verifica los logs del servidor

---

**Fecha:** 15 de Octubre de 2025  
**Versión:** 1.0  
**Estado:** Backend ✅ Completo | MCP ❌ Pendiente

