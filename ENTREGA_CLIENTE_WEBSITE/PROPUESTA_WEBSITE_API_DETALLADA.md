# 🌐 PROPUESTA DETALLADA: API de Gestión de Sitios Web

**Fecha:** 14 de Octubre de 2025  
**API:** api2.eventosorganizador.com  
**Versión:** 2.0 - Análisis Detallado

---

## 🎯 CONTEXTO ACTUALIZADO

**Lo que necesitan:**
- ✅ API para gestionar sitios web (NOSOTROS)
- ✅ Editor visual de sitios (ELLOS - Frontend)
- ✅ Gestión de dominios
- ✅ Sistema de publicación
- ✅ Multi-tenant (1 usuario = N sitios web)
- ✅ 3 tipos de webs: Entity, Whitelabel, Event

**Lo que NO necesitamos:**
- ❌ Editor de sitios (lo hace el cliente)
- ❌ Generación con IA (opcional, cliente decide)
- ❌ Templates visuales (frontend del cliente)

---

## 📊 TIPOS DE SITIOS WEB

### 1️⃣ **Website para Entidades (CRM)**
Un negocio/empresa puede tener su sitio web.

**Ejemplo:**
- Entidad: "Bodas Elegantes S.L."
- Website: `bodas-elegantes.com`
- Contenido: Página corporativa

### 2️⃣ **Website para Whitelabel**
Cada marca blanca puede tener su sitio web institucional.

**Ejemplo:**
- Whitelabel: "Bodas de Hoy"
- Website: `bodasdehoy.com`
- Contenido: Landing page del whitelabel

### 3️⃣ **Website para Eventos**
Cada evento puede tener su sitio web único.

**Ejemplo:**
- Evento: "Boda Isabel & Raúl - 15 Nov 2025"
- Website: `boda-isabel-raul.eventosorganizador.com`
- Contenido: Info del evento, confirmaciones, galería

---

## 🏗️ ARQUITECTURA PROPUESTA

### **Modelo Unificado con Polimorfismo**

```typescript
interface IWebsite {
  _id: ObjectId;
  
  // Identificación
  name: string;
  slug: string;  // bodas-elegantes, boda-isabel-raul
  
  // Tipo y relación polimórfica
  websiteType: 'ENTITY' | 'WHITELABEL' | 'EVENT';
  linkedTo: {
    type: 'CRM_Entity' | 'Whitelabel' | 'Event';
    id: ObjectId;
  };
  
  // Dominio
  domain: {
    type: 'SUBDOMAIN' | 'CUSTOM';
    value: string;  // boda-isabel.eventosorganizador.com o bodas-elegantes.com
    verified: boolean;
    verificationToken?: string;
    dnsRecords?: {
      type: 'A' | 'CNAME' | 'TXT';
      name: string;
      value: string;
      verified: boolean;
    }[];
  };
  
  // Contenido (guardado por el editor del cliente)
  content: {
    html: string;
    css?: string;
    js?: string;
    metadata?: any;  // SEO, OG tags, etc.
  };
  
  // Publicación
  status: 'DRAFT' | 'PUBLISHED' | 'SUSPENDED' | 'ARCHIVED';
  publishedAt?: Date;
  publishedUrl?: string;
  
  // Deployment
  deployment: {
    provider: 'NETLIFY' | 'VERCEL' | 'GITHUB_PAGES' | 'CUSTOM';
    url?: string;
    deployId?: string;
    lastDeployedAt?: Date;
    config?: any;
  };
  
  // Analytics
  analytics: {
    views: number;
    uniqueVisitors: number;
    lastVisit?: Date;
    pageViews: Map<string, number>;  // { "/": 100, "/contacto": 50 }
  };
  
  // SEO
  seo: {
    title?: string;
    description?: string;
    keywords?: string[];
    ogImage?: string;
    favicon?: string;
    robots?: 'index,follow' | 'noindex,nofollow';
  };
  
  // Multi-tenant
  development: string;
  ownership: {
    primary_owner: {
      user_id: string;
      name: string;
    };
    shared_with_users: string[];
    shared_with_groups: ObjectId[];
  };
  
  // Metadata
  tags: string[];
  custom_fields?: any;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔧 SCHEMA GRAPHQL COMPLETO

```graphql
# ========================================
# ENUMS
# ========================================

enum CRM_WebsiteType {
  ENTITY      # Sitio de una empresa/negocio
  WHITELABEL  # Sitio de la marca blanca
  EVENT       # Sitio de un evento
}

enum CRM_WebsiteStatus {
  DRAFT       # En edición
  PUBLISHED   # Publicado y visible
  SUSPENDED   # Suspendido temporalmente
  ARCHIVED    # Archivado
}

enum CRM_DomainType {
  SUBDOMAIN   # evento.eventosorganizador.com
  CUSTOM      # www.miboda.com
}

enum CRM_DeploymentProvider {
  NETLIFY
  VERCEL
  GITHUB_PAGES
  CUSTOM
}

# ========================================
# TIPOS DE RELACIÓN
# ========================================

type CRM_WebsiteLinkedTo {
  type: String!  # "CRM_Entity" | "Whitelabel" | "Event"
  id: ID!
  
  # Campos poblados según el tipo
  entity: CRM_Entity
  whitelabel: Whitelabel
  event: Event
}

# ========================================
# DOMINIO
# ========================================

type CRM_DNSRecord {
  type: String!  # A, CNAME, TXT
  name: String!
  value: String!
  verified: Boolean!
  verifiedAt: DateTime
}

type CRM_WebsiteDomain {
  type: CRM_DomainType!
  value: String!
  verified: Boolean!
  verificationToken: String
  dnsRecords: [CRM_DNSRecord!]!
}

# ========================================
# CONTENIDO
# ========================================

type CRM_WebsiteContent {
  html: String!
  css: String
  js: String
  metadata: JSON  # Cualquier metadata del editor
}

# ========================================
# DEPLOYMENT
# ========================================

type CRM_WebsiteDeployment {
  provider: CRM_DeploymentProvider!
  url: String
  deployId: String
  lastDeployedAt: DateTime
  status: String  # "deploying", "success", "failed"
  logs: [String!]
  config: JSON
}

# ========================================
# ANALYTICS
# ========================================

type CRM_WebsiteAnalytics {
  views: Int!
  uniqueVisitors: Int!
  lastVisit: DateTime
  pageViews: JSON  # { "/": 100, "/contacto": 50 }
  topPages: [CRM_PageStats!]!
  dailyViews: [CRM_DailyStats!]!
}

type CRM_PageStats {
  path: String!
  views: Int!
  uniqueVisitors: Int!
  avgTimeOnPage: Float
  bounceRate: Float
}

type CRM_DailyStats {
  date: String!
  views: Int!
  uniqueVisitors: Int!
}

# ========================================
# SEO
# ========================================

type CRM_WebsiteSEO {
  title: String
  description: String
  keywords: [String!]
  ogImage: String
  favicon: String
  robots: String
  canonicalUrl: String
}

# ========================================
# TIPO PRINCIPAL
# ========================================

type CRM_Website {
  id: ID!
  
  # Identificación
  name: String!
  slug: String!
  
  # Tipo y relación
  websiteType: CRM_WebsiteType!
  linkedTo: CRM_WebsiteLinkedTo!
  
  # Dominio
  domain: CRM_WebsiteDomain!
  
  # Contenido
  content: CRM_WebsiteContent!
  
  # Estado
  status: CRM_WebsiteStatus!
  publishedAt: DateTime
  publishedUrl: String
  
  # Deployment
  deployment: CRM_WebsiteDeployment
  
  # Analytics
  analytics: CRM_WebsiteAnalytics!
  
  # SEO
  seo: CRM_WebsiteSEO
  
  # Multi-tenant
  development: String!
  ownership: CRM_Ownership!
  
  # Metadata
  tags: [String!]!
  custom_fields: JSON
  createdBy: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

# ========================================
# INPUTS
# ========================================

input CRM_WebsiteLinkedToInput {
  type: String!  # "CRM_Entity" | "Whitelabel" | "Event"
  id: ID!
}

input CRM_DNSRecordInput {
  type: String!
  name: String!
  value: String!
}

input CRM_WebsiteDomainInput {
  type: CRM_DomainType!
  value: String!
  dnsRecords: [CRM_DNSRecordInput!]
}

input CRM_WebsiteContentInput {
  html: String!
  css: String
  js: String
  metadata: JSON
}

input CRM_WebsiteSEOInput {
  title: String
  description: String
  keywords: [String!]
  ogImage: String
  favicon: String
  robots: String
  canonicalUrl: String
}

input CRM_WebsiteDeploymentConfigInput {
  provider: CRM_DeploymentProvider!
  config: JSON
}

input CRM_CreateWebsiteInput {
  name: String!
  slug: String!
  websiteType: CRM_WebsiteType!
  linkedTo: CRM_WebsiteLinkedToInput!
  domain: CRM_WebsiteDomainInput!
  content: CRM_WebsiteContentInput!
  seo: CRM_WebsiteSEOInput
  tags: [String!]
  custom_fields: JSON
}

input CRM_UpdateWebsiteInput {
  name: String
  slug: String
  domain: CRM_WebsiteDomainInput
  content: CRM_WebsiteContentInput
  seo: CRM_WebsiteSEOInput
  tags: [String!]
  custom_fields: JSON
}

input CRM_WebsiteFilters {
  websiteType: [CRM_WebsiteType!]
  status: [CRM_WebsiteStatus!]
  linkedToType: String  # "CRM_Entity" | "Whitelabel" | "Event"
  linkedToId: ID
  userId: String  # Filtrar por owner
  development: String
  search: String
  tags: [String!]
  hasCustomDomain: Boolean
  isPublished: Boolean
}

# ========================================
# RESPONSES
# ========================================

type CRM_WebsiteResponse implements CRM_BaseResponse {
  success: Boolean!
  website: CRM_Website
  errors: [String!]!
}

type CRM_WebsitesResponse implements CRM_BaseResponse {
  success: Boolean!
  websites: [CRM_Website!]!
  total: Int!
  pagination: CRM_PaginationInfo!
  errors: [String!]!
}

type CRM_DomainVerificationResponse {
  success: Boolean!
  verified: Boolean!
  dnsRecords: [CRM_DNSRecord!]!
  message: String
  errors: [String!]!
}

type CRM_DeploymentResponse {
  success: Boolean!
  deploymentUrl: String
  deployId: String
  status: String
  logs: [String!]
  errors: [String!]!
}

# ========================================
# QUERIES
# ========================================

extend type Query {
  # Listar sitios web con filtros
  getCRMWebsites(
    filters: CRM_WebsiteFilters
    pagination: CRM_PaginationInput
    sort: CRM_SortInput
  ): CRM_WebsitesResponse!
  
  # Obtener un sitio específico
  getCRMWebsite(id: ID!): CRM_WebsiteResponse!
  
  # Obtener por slug
  getCRMWebsiteBySlug(slug: String!, development: String): CRM_WebsiteResponse!
  
  # Obtener por dominio
  getCRMWebsiteByDomain(domain: String!): CRM_WebsiteResponse!
  
  # Obtener sitios de una entidad
  getCRMWebsitesByEntity(entityId: ID!): CRM_WebsitesResponse!
  
  # Obtener sitios de un whitelabel
  getCRMWebsitesByWhitelabel(whitelabelId: ID!): CRM_WebsitesResponse!
  
  # Obtener sitios de un evento
  getCRMWebsitesByEvent(eventId: ID!): CRM_WebsitesResponse!
  
  # Obtener sitios del usuario actual
  getMyCRMWebsites(
    filters: CRM_WebsiteFilters
    pagination: CRM_PaginationInput
  ): CRM_WebsitesResponse!
  
  # Analytics
  getCRMWebsiteAnalytics(
    websiteId: ID!
    dateRange: CRM_DateRangeFilter
  ): CRM_WebsiteAnalytics!
  
  # Verificar disponibilidad de slug
  checkCRMWebsiteSlugAvailability(
    slug: String!
    websiteType: CRM_WebsiteType!
  ): Boolean!
  
  # Verificar disponibilidad de dominio
  checkCRMDomainAvailability(domain: String!): Boolean!
  
  # Estadísticas generales
  getCRMWebsiteStats(development: String): JSON!
}

# ========================================
# MUTATIONS
# ========================================

extend type Mutation {
  # ===== CRUD =====
  
  createCRMWebsite(input: CRM_CreateWebsiteInput!): CRM_WebsiteResponse!
  updateCRMWebsite(id: ID!, input: CRM_UpdateWebsiteInput!): CRM_WebsiteResponse!
  deleteCRMWebsite(id: ID!): CRM_WebsiteResponse!
  duplicateCRMWebsite(id: ID!, newName: String!, newSlug: String!): CRM_WebsiteResponse!
  
  # ===== CONTENIDO =====
  
  # Actualizar solo el contenido HTML/CSS/JS
  updateCRMWebsiteContent(
    id: ID!
    content: CRM_WebsiteContentInput!
  ): CRM_WebsiteResponse!
  
  # Actualizar solo SEO
  updateCRMWebsiteSEO(
    id: ID!
    seo: CRM_WebsiteSEOInput!
  ): CRM_WebsiteResponse!
  
  # ===== PUBLICACIÓN =====
  
  # Publicar sitio
  publishCRMWebsite(id: ID!): CRM_WebsiteResponse!
  
  # Despublicar sitio
  unpublishCRMWebsite(id: ID!): CRM_WebsiteResponse!
  
  # Suspender sitio
  suspendCRMWebsite(id: ID!, reason: String): CRM_WebsiteResponse!
  
  # Archivar sitio
  archiveCRMWebsite(id: ID!): CRM_WebsiteResponse!
  
  # Restaurar sitio archivado
  restoreCRMWebsite(id: ID!): CRM_WebsiteResponse!
  
  # ===== DOMINIO =====
  
  # Configurar dominio personalizado
  setCRMWebsiteCustomDomain(
    id: ID!
    domain: String!
    dnsRecords: [CRM_DNSRecordInput!]
  ): CRM_WebsiteResponse!
  
  # Verificar dominio
  verifyCRMWebsiteDomain(id: ID!): CRM_DomainVerificationResponse!
  
  # Remover dominio personalizado (volver a subdominio)
  removeCRMWebsiteCustomDomain(id: ID!): CRM_WebsiteResponse!
  
  # ===== DEPLOYMENT =====
  
  # Desplegar a provider (Netlify, Vercel, etc.)
  deployCRMWebsite(
    id: ID!
    config: CRM_WebsiteDeploymentConfigInput
  ): CRM_DeploymentResponse!
  
  # Re-desplegar (rebuild)
  redeployCRMWebsite(id: ID!): CRM_DeploymentResponse!
  
  # ===== ANALYTICS =====
  
  # Registrar vista (llamado desde el sitio publicado)
  trackCRMWebsiteView(
    websiteId: ID
    slug: String
    domain: String
    visitorId: String
    page: String
    referrer: String
  ): Boolean!
  
  # ===== TAGS =====
  
  addCRMWebsiteTags(id: ID!, tags: [String!]!): CRM_WebsiteResponse!
  removeCRMWebsiteTags(id: ID!, tags: [String!]!): CRM_WebsiteResponse!
  
  # ===== COMPARTICIÓN =====
  
  shareCRMWebsite(
    websiteId: ID!
    sharing: CRM_SharingInput!
  ): CRM_WebsiteResponse!
  
  unshareCRMWebsite(
    websiteId: ID!
    userIds: [String!]!
  ): CRM_WebsiteResponse!
}
```

---

## 💼 CASOS DE USO DETALLADOS

### **Caso 1: Usuario crea sitio para su empresa**

```graphql
# 1. Usuario crea entidad
mutation {
  createCRMEntity(input: {
    name: "Bodas Elegantes S.L."
    type: COMPANY
    industry: "Wedding Planning"
  }) {
    success
    entity { id }
  }
}

# 2. Usuario crea sitio web para la entidad
mutation {
  createCRMWebsite(input: {
    name: "Sitio Web Corporativo"
    slug: "bodas-elegantes"
    websiteType: ENTITY
    linkedTo: {
      type: "CRM_Entity"
      id: "ENTITY_ID_DEL_PASO_1"
    }
    domain: {
      type: SUBDOMAIN
      value: "bodas-elegantes.eventosorganizador.com"
    }
    content: {
      html: "<html>...</html>"  # Generado por SU editor
      css: "body { ... }"
      js: "console.log('hola');"
    }
    seo: {
      title: "Bodas Elegantes - Wedding Planners"
      description: "Los mejores organizadores de bodas"
      keywords: ["bodas", "wedding", "planner"]
    }
  }) {
    success
    website {
      id
      publishedUrl
    }
  }
}

# 3. Usuario publica el sitio
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

**Resultado:**
- Sitio disponible en: `https://bodas-elegantes.eventosorganizador.com`
- Estado: `PUBLISHED`
- Usuario: Puede editarlo desde su editor

---

### **Caso 2: Usuario configura dominio personalizado**

```graphql
# 1. Usuario quiere usar su propio dominio
mutation {
  setCRMWebsiteCustomDomain(
    id: "WEBSITE_ID"
    domain: "www.bodas-elegantes.com"
    dnsRecords: [
      {
        type: "CNAME"
        name: "www"
        value: "bodas-elegantes.eventosorganizador.com"
      }
    ]
  ) {
    success
    website {
      domain {
        type
        value
        verified
        verificationToken
        dnsRecords {
          type
          name
          value
          verified
        }
      }
    }
  }
}

# 2. Sistema devuelve instrucciones DNS
# {
#   "domain": {
#     "type": "CUSTOM",
#     "value": "www.bodas-elegantes.com",
#     "verified": false,
#     "verificationToken": "verify-abc123",
#     "dnsRecords": [
#       {
#         "type": "CNAME",
#         "name": "www",
#         "value": "bodas-elegantes.eventosorganizador.com",
#         "verified": false
#       },
#       {
#         "type": "TXT",
#         "name": "_verify",
#         "value": "verify-abc123",
#         "verified": false
#       }
#     ]
#   }
# }

# 3. Usuario configura DNS en su proveedor (GoDaddy, Cloudflare, etc.)
# Espera propagación DNS (puede tardar 24-48h)

# 4. Usuario verifica el dominio
mutation {
  verifyCRMWebsiteDomain(id: "WEBSITE_ID") {
    success
    verified
    dnsRecords {
      type
      name
      verified
    }
    message
  }
}

# 5. Si verificado, el sitio ahora está en:
# www.bodas-elegantes.com (en lugar del subdominio)
```

---

### **Caso 3: Evento con sitio web**

```graphql
# 1. Usuario crea evento
mutation {
  createEvent(input: {
    nombre: "Boda Isabel & Raúl"
    fecha_evento: "2025-11-15"
    tipo: "Boda"
  }) {
    success
    event { _id }
  }
}

# 2. Usuario crea sitio para el evento
mutation {
  createCRMWebsite(input: {
    name: "Sitio Boda Isabel & Raúl"
    slug: "boda-isabel-raul"
    websiteType: EVENT
    linkedTo: {
      type: "Event"
      id: "EVENT_ID"
    }
    domain: {
      type: SUBDOMAIN
      value: "boda-isabel-raul.eventosorganizador.com"
    }
    content: {
      html: "..."  # Página del evento con confirmaciones
    }
    seo: {
      title: "Boda Isabel & Raúl - 15 Noviembre 2025"
      ogImage: "https://cdn.com/foto-pareja.jpg"
    }
  }) {
    success
    website { id publishedUrl }
  }
}

# 3. Publicar
mutation {
  publishCRMWebsite(id: "WEBSITE_ID") {
    success
  }
}

# Ahora los invitados pueden acceder a:
# https://boda-isabel-raul.eventosorganizador.com
```

---

### **Caso 4: Usuario tiene múltiples sitios**

```graphql
# Listar todos mis sitios
query {
  getMyCRMWebsites(
    pagination: { page: 1, limit: 10 }
  ) {
    success
    websites {
      id
      name
      slug
      websiteType
      status
      publishedUrl
      linkedTo {
        type
        entity { name }
        event { nombre }
      }
      analytics {
        views
        uniqueVisitors
      }
    }
    total
  }
}

# Respuesta:
# {
#   "websites": [
#     {
#       "id": "1",
#       "name": "Sitio Corporativo",
#       "slug": "bodas-elegantes",
#       "websiteType": "ENTITY",
#       "status": "PUBLISHED",
#       "publishedUrl": "https://bodas-elegantes.eventosorganizador.com",
#       "linkedTo": {
#         "type": "CRM_Entity",
#         "entity": { "name": "Bodas Elegantes S.L." }
#       },
#       "analytics": { "views": 1523, "uniqueVisitors": 892 }
#     },
#     {
#       "id": "2",
#       "name": "Boda Isabel & Raúl",
#       "slug": "boda-isabel-raul",
#       "websiteType": "EVENT",
#       "status": "PUBLISHED",
#       "publishedUrl": "https://boda-isabel-raul.eventosorganizador.com",
#       "linkedTo": {
#         "type": "Event",
#         "event": { "nombre": "Boda Isabel & Raúl" }
#       },
#       "analytics": { "views": 234, "uniqueVisitors": 156 }
#     },
#     {
#       "id": "3",
#       "name": "Boda María & Juan",
#       "slug": "boda-maria-juan",
#       "websiteType": "EVENT",
#       "status": "DRAFT",
#       "publishedUrl": null,
#       "analytics": { "views": 0, "uniqueVisitors": 0 }
#     }
#   ],
#   "total": 3
# }
```

---

## 🔐 GESTIÓN DE DOMINIOS

### **Flujo completo:**

```
1. Usuario solicita dominio personalizado
   ↓
2. API valida que el dominio no esté usado
   ↓
3. API genera token de verificación
   ↓
4. API devuelve registros DNS requeridos:
   - CNAME: www → sitio.eventosorganizador.com
   - TXT: _verify → token-abc123
   ↓
5. Usuario configura DNS en su proveedor
   ↓
6. Usuario llama a verifyCRMWebsiteDomain()
   ↓
7. API verifica DNS:
   - Hace lookup DNS del dominio
   - Comprueba CNAME apunta a nuestro servidor
   - Comprueba TXT contiene el token
   ↓
8. Si OK: domain.verified = true
   ↓
9. Sitio accesible en dominio personalizado
```

### **Implementación backend:**

```typescript
// src/services/domainVerificationService.ts
import dns from 'dns/promises';

export class DomainVerificationService {
  async verifyDomain(website: IWebsite): Promise<{
    verified: boolean;
    dnsRecords: any[];
    errors: string[];
  }> {
    const errors = [];
    const results = [];
    
    // Verificar cada registro DNS
    for (const record of website.domain.dnsRecords) {
      try {
        if (record.type === 'CNAME') {
          const result = await dns.resolveCname(record.name);
          const verified = result.includes(record.value);
          results.push({ ...record, verified });
          
          if (!verified) {
            errors.push(`CNAME ${record.name} no apunta a ${record.value}`);
          }
        }
        
        if (record.type === 'TXT') {
          const result = await dns.resolveTxt(record.name);
          const flat = result.flat();
          const verified = flat.includes(record.value);
          results.push({ ...record, verified });
          
          if (!verified) {
            errors.push(`TXT ${record.name} no contiene ${record.value}`);
          }
        }
        
        if (record.type === 'A') {
          const result = await dns.resolve4(record.name);
          const verified = result.includes(record.value);
          results.push({ ...record, verified });
          
          if (!verified) {
            errors.push(`A ${record.name} no apunta a ${record.value}`);
          }
        }
      } catch (error) {
        errors.push(`Error verificando ${record.type} ${record.name}: ${error.message}`);
        results.push({ ...record, verified: false });
      }
    }
    
    const allVerified = results.every(r => r.verified);
    
    // Actualizar en BD
    if (allVerified) {
      await Website.findByIdAndUpdate(website._id, {
        'domain.verified': true,
        'domain.dnsRecords': results
      });
    }
    
    return {
      verified: allVerified,
      dnsRecords: results,
      errors
    };
  }
  
  generateVerificationToken(): string {
    return `verify-${crypto.randomBytes(16).toString('hex')}`;
  }
}
```

---

## 🚀 DEPLOYMENT Y PUBLICACIÓN

### **Flujo de publicación:**

```
1. Usuario edita sitio en DRAFT
   ↓
2. Usuario llama publishCRMWebsite()
   ↓
3. API actualiza status = PUBLISHED
   ↓
4. API inicia deployment:
   a) Si tiene Netlify/Vercel configurado:
      - Sube HTML/CSS/JS al provider
      - Espera deployment
      - Guarda deployment URL
   b) Si es subdominio propio:
      - Guarda contenido en storage (S3)
      - Configura Nginx/CDN para servir
   ↓
5. Sitio disponible en URL pública
   ↓
6. API devuelve publishedUrl
```

### **Servicio de deployment:**

```typescript
// src/services/websiteDeploymentService.ts
import { NetlifyAPI } from 'netlify';
import { VercelClient } from '@vercel/client';

export class WebsiteDeploymentService {
  
  async deployToNetlify(website: IWebsite): Promise<{
    url: string;
    deployId: string;
  }> {
    const netlify = new NetlifyAPI(process.env.NETLIFY_TOKEN);
    
    // Crear archivo ZIP con el contenido
    const zip = await this.createZip({
      'index.html': website.content.html,
      'styles.css': website.content.css || '',
      'script.js': website.content.js || '',
    });
    
    // Subir a Netlify
    const site = await netlify.createSite({
      name: website.slug,
      custom_domain: website.domain.type === 'CUSTOM' ? website.domain.value : undefined
    });
    
    const deploy = await netlify.deploy(site.id, zip);
    
    return {
      url: deploy.deploy_ssl_url,
      deployId: deploy.id
    };
  }
  
  async deployToVercel(website: IWebsite): Promise<{
    url: string;
    deployId: string;
  }> {
    const vercel = new VercelClient({ token: process.env.VERCEL_TOKEN });
    
    const deployment = await vercel.createDeployment({
      name: website.slug,
      files: [
        {
          file: 'index.html',
          data: website.content.html
        },
        {
          file: 'styles.css',
          data: website.content.css || ''
        }
      ],
      target: 'production'
    });
    
    return {
      url: `https://${deployment.url}`,
      deployId: deployment.id
    };
  }
  
  async deployToS3(website: IWebsite): Promise<{
    url: string;
  }> {
    // Para subdominios propios
    const s3 = new S3Client({ region: 'us-east-1' });
    
    const key = `websites/${website.development}/${website.slug}/index.html`;
    
    await s3.send(new PutObjectCommand({
      Bucket: process.env.WEBSITES_BUCKET,
      Key: key,
      Body: website.content.html,
      ContentType: 'text/html',
      CacheControl: 'max-age=3600'
    }));
    
    // También subir CSS y JS
    // ...
    
    const url = `https://${website.slug}.${website.development}.eventosorganizador.com`;
    
    return { url };
  }
}
```

---

## 📊 ANALYTICS

### **Pixel de tracking:**

Cuando el sitio se publica, la API inyecta un pixel de tracking:

```html
<!-- Inyectado automáticamente en <head> -->
<script>
(function() {
  const websiteId = 'WEBSITE_ID';
  const apiUrl = 'https://api2.eventosorganizador.com/graphql';
  
  // Generar visitor ID único
  let visitorId = localStorage.getItem('visitor_id');
  if (!visitorId) {
    visitorId = 'v_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('visitor_id', visitorId);
  }
  
  // Trackear vista
  fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `
        mutation {
          trackCRMWebsiteView(
            websiteId: "${websiteId}"
            visitorId: "${visitorId}"
            page: "${window.location.pathname}"
            referrer: "${document.referrer}"
          )
        }
      `
    })
  });
  
  // Trackear tiempo en página
  window.addEventListener('beforeunload', function() {
    const timeOnPage = Date.now() - performance.timing.navigationStart;
    // Enviar analytics...
  });
})();
</script>
```

### **Mutation de tracking:**

```typescript
// Resolver
trackCRMWebsiteView: async (_, args, context) => {
  const { websiteId, visitorId, page, referrer } = args;
  
  // Incrementar views
  await Website.findByIdAndUpdate(websiteId, {
    $inc: { 'analytics.views': 1 },
    'analytics.lastVisit': new Date()
  });
  
  // Unique visitors (usar Redis para tracking)
  const redis = getRedisClient();
  const key = `website:${websiteId}:visitors`;
  const isNew = await redis.sadd(key, visitorId);
  
  if (isNew) {
    await Website.findByIdAndUpdate(websiteId, {
      $inc: { 'analytics.uniqueVisitors': 1 }
    });
  }
  
  // Trackear página específica
  await Website.findByIdAndUpdate(websiteId, {
    $inc: { [`analytics.pageViews.${page}`]: 1 }
  });
  
  // Guardar en log detallado (opcional)
  await WebsiteViewLog.create({
    websiteId,
    visitorId,
    page,
    referrer,
    timestamp: new Date(),
    userAgent: context.req.headers['user-agent']
  });
  
  return true;
}
```

---

## 🔒 SEGURIDAD

### **1. Validación de HTML**

```typescript
import DOMPurify from 'isomorphic-dompurify';

export class WebsiteSecurityService {
  sanitizeHTML(html: string): string {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['html', 'head', 'body', 'div', 'p', 'a', 'img', ...],
      ALLOWED_ATTR: ['href', 'src', 'class', 'id', 'style', ...],
      ALLOW_DATA_ATTR: true,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      SAFE_FOR_TEMPLATES: true
    });
  }
  
  validateHTML(html: string): { valid: boolean; errors: string[] } {
    const errors = [];
    
    // Verificar tamaño
    if (html.length > 2 * 1024 * 1024) {  // 2MB
      errors.push('HTML excede el tamaño máximo permitido (2MB)');
    }
    
    // Verificar scripts maliciosos
    if (/<script[^>]*src=["']https?:\/\/(?!cdn\.trusted\.com)/i.test(html)) {
      errors.push('Scripts externos no permitidos');
    }
    
    // Verificar iframes sospechosos
    if (/<iframe[^>]*src=["'](?!https:\/\/(www\.)?youtube\.com|vimeo\.com)/i.test(html)) {
      errors.push('iframes no permitidos excepto YouTube/Vimeo');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}
```

---

### **2. Rate Limiting**

```typescript
// Límites específicos para websites
export const websiteLimiter = createRateLimit(
  1 * 60 * 1000,  // 1 minuto
  30,  // máximo 30 publicaciones por minuto
  'Límite de publicaciones excedido'
);

export const deploymentLimiter = createRateLimit(
  5 * 60 * 1000,  // 5 minutos
  10,  // máximo 10 deployments cada 5 minutos
  'Demasiados deployments, espera 5 minutos'
);
```

---

### **3. Ownership validation**

```typescript
// Middleware para verificar ownership
async function validateWebsiteOwnership(
  websiteId: string,
  userId: string
): Promise<boolean> {
  const website = await Website.findById(websiteId);
  
  if (!website) {
    throw new Error('Sitio web no encontrado');
  }
  
  // Verificar si es owner principal
  if (website.ownership.primary_owner.user_id === userId) {
    return true;
  }
  
  // Verificar si está compartido
  if (website.ownership.shared_with_users.includes(userId)) {
    return true;
  }
  
  throw new Error('No tienes permisos para editar este sitio web');
}
```

---

## 💰 COSTOS ESTIMADOS

### **Desarrollo:**

| Componente | Días | Costo/día | Total |
|-----------|------|-----------|-------|
| Modelo MongoDB | 2 | - | - |
| Schema GraphQL | 2 | - | - |
| Resolvers CRUD | 4 | - | - |
| Gestión de dominios | 5 | - | - |
| Sistema deployment | 7 | - | - |
| Analytics + Pixel | 4 | - | - |
| Seguridad + Validación | 3 | - | - |
| Tests | 4 | - | - |
| Documentación | 2 | - | - |
| **TOTAL** | **33 días** | - | **A determinar** |

---

### **Infraestructura mensual:**

| Servicio | Uso estimado | Costo/mes |
|----------|--------------|-----------|
| **MongoDB storage** | 100 websites × 200KB | Incluido |
| **S3 storage** | 100 websites × 500KB | $1 |
| **Netlify/Vercel** | Plan Pro | $19-99 |
| **CDN (CloudFlare)** | 1TB bandwidth | Gratis |
| **Redis (Analytics)** | 1GB | $5 |
| **DNS management** | 1000 dominios | $10 |
| **SSL certs** | Let's Encrypt | Gratis |
| **TOTAL** | | **$35-115/mes** |

---

## 🎯 ROADMAP AJUSTADO

### **Fase 1: Core (3 semanas) ✅**
- ✅ Modelo MongoDB
- ✅ Schema GraphQL básico
- ✅ CRUD completo
- ✅ Estados (DRAFT/PUBLISHED)
- ✅ Relación polimórfica (Entity/Whitelabel/Event)
- ✅ Subdominios

### **Fase 2: Dominios (2 semanas) 🔧**
- ✅ Gestión de dominios personalizados
- ✅ Verificación DNS
- ✅ Configuración CNAME/A/TXT
- ✅ SSL automático

### **Fase 3: Deployment (2 semanas) 🚀**
- ✅ Integración Netlify
- ✅ Integración Vercel
- ✅ S3 + CloudFront para subdominios
- ✅ Sistema de redeploy

### **Fase 4: Analytics (1.5 semanas) 📊**
- ✅ Pixel de tracking
- ✅ Views y unique visitors
- ✅ Stats por página
- ✅ Dashboard de analytics

### **Fase 5: Seguridad (1 semana) 🔒**
- ✅ Sanitización HTML
- ✅ Validación de contenido
- ✅ Rate limiting
- ✅ Ownership validation

### **Fase 6: Testing y Docs (1.5 semanas) 🧪**
- ✅ Tests unitarios
- ✅ Tests de integración
- ✅ Documentación API
- ✅ Ejemplos de uso

**TOTAL: ~11 semanas (2.5 meses)**

---

## ❓ PREGUNTAS PARA EL CLIENTE

### **1. Alcance**
- [ ] ¿Cuántos tipos de websites necesitan? (Entity/Whitelabel/Event/Otros)
- [ ] ¿Cuántos websites esperan tener en total? (<1K / 1K-10K / >10K)
- [ ] ¿Límite de websites por usuario? (Ilimitado / 5 / 10 / Otro)

### **2. Dominios**
- [ ] ¿Todos los usuarios podrán usar dominios personalizados?
- [ ] ¿Habrá un costo adicional por dominio personalizado?
- [ ] ¿Qué subdominios permitirán? (*.eventosorganizador.com)

### **3. Deployment**
- [ ] ¿Prefieren Netlify, Vercel o infraestructura propia?
- [ ] ¿Necesitan CDN global o solo región Europa?
- [ ] ¿SSL incluido para todos o solo premium?

### **4. Analytics**
- [ ] ¿Nivel de analytics? (Básico: views / Avanzado: heatmaps, A/B)
- [ ] ¿GDPR compliance necesario? (cookies, banners)
- [ ] ¿Integración con Google Analytics?

### **5. Límites**
- [ ] ¿Tamaño máximo de HTML? (Recomendado: 2MB)
- [ ] ¿Bandwidth límite por sitio? (Ej: 10GB/mes)
- [ ] ¿Rate limit para deployments? (Ej: 100/día)

### **6. Monetización**
- [ ] ¿Plan gratuito incluye websites?
- [ ] ¿Límites por plan? (Free: 1 web, Pro: 5, Business: ∞)
- [ ] ¿Costo por website adicional?

---

## 📊 TABLA COMPARATIVA: IMPLEMENTACIÓN

| Característica | Sin Website API | Con Website API |
|----------------|----------------|-----------------|
| **Gestión de contenido** | Usar `custom_fields` | Schema tipado ✅ |
| **Dominios** | Manual externo | Verificación automática ✅ |
| **Publicación** | Sin estados | DRAFT/PUBLISHED ✅ |
| **Analytics** | Sin tracking | Views/Visitors ✅ |
| **Multi-web** | Complicado | 1 user = N webs ✅ |
| **SEO** | Manual | Campos dedicados ✅ |
| **Deployment** | Manual | Automatizado ✅ |
| **Seguridad** | Sin validación | HTML sanitizado ✅ |

---

## ✅ CONCLUSIÓN

**Recomendación:**  
✅ **IMPLEMENTAR** la API de Websites

**Por qué:**
1. ✅ Valor agregado significativo
2. ✅ Diferenciador competitivo
3. ✅ Escalable (1 user = N webs)
4. ✅ Monetizable (planes premium)
5. ✅ Bien arquitecturado (polimórfico)

**Inversión:**
- ⏱️ **11 semanas** de desarrollo
- 💰 **Costo desarrollo:** A determinar
- 💰 **Costo mensual:** $35-115/mes infra

**ROI:**
- 🎯 Aumento de retención de usuarios
- 🎯 Nuevo revenue stream
- 🎯 Diferenciación en el mercado

---

## 📞 PRÓXIMOS PASOS

1. ✅ **Aprobar propuesta** (sí/no/ajustes)
2. ✅ **Responder preguntas** (sección anterior)
3. ✅ **Definir presupuesto**
4. ✅ **Acordar timeline**
5. ✅ **Iniciar Fase 1**

---

**¿Procedemos con la implementación?**

