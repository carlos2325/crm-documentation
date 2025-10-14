# ❌ RESPUESTA: Funcionalidad de Sitios Web NO EXISTE

**Fecha:** 14 de Octubre de 2025  
**API:** api2.eventosorganizador.com  
**Solicitante:** Cliente  
**Estado:** **FUNCIONALIDAD NO IMPLEMENTADA** 🚫

---

## 📋 RESUMEN EJECUTIVO

La funcionalidad de gestión de sitios web (`CRM_Website`) que solicitan **NO EXISTE** actualmente en nuestra API.

| Componente Solicitado | Estado | Notas |
|----------------------|--------|-------|
| `CRM_Website` type | ❌ **NO EXISTE** | Tipo GraphQL no implementado |
| `getCRMWebsites` query | ❌ **NO EXISTE** | Query no disponible |
| `createCRMWebsite` mutation | ❌ **NO EXISTE** | Mutation no disponible |
| Analytics de sitios | ❌ **NO EXISTE** | Sistema de tracking no implementado |
| Gestión de HTML | ❌ **NO EXISTE** | Almacenamiento de contenido no implementado |

---

## 🔍 LO QUE SÍ EXISTE (Funcionalidad Limitada)

### 1️⃣ Campo `website` en `CRM_Entity`

Existe **solo un campo básico** para almacenar la URL del sitio web de una entidad (empresa/organización):

**Schema GraphQL:**
```graphql
type CRM_Entity {
  id: ID!
  name: String!
  website: String  # ← SOLO esto existe
  email: String
  phone: String
  # ... otros campos
}
```

**Ejemplo de uso:**
```graphql
mutation {
  createCRMEntity(input: {
    name: "Bodas Elegantes"
    type: COMPANY
    website: "https://bodas-elegantes.com"  # ← Solo URL externa
  }) {
    success
    entity {
      id
      website
    }
  }
}
```

**Limitaciones:**
- ✅ Solo almacena URL (string)
- ❌ NO guarda HTML
- ❌ NO tiene analytics
- ❌ NO tiene estados (DRAFT/PUBLISHED)
- ❌ NO tiene tracking de visitas
- ❌ NO puede almacenar contenido generado por IA

---

### 2️⃣ Campo `source: 'website'` en `CRM_Lead`

Existe un enum para indicar que un lead provino de un sitio web:

**Schema:**
```graphql
type CRM_Lead {
  source: String!  # 'website' | 'referral' | 'social' | 'event' | ...
}
```

**Ejemplo:**
```graphql
mutation {
  createCRMLead(input: {
    firstName: "María"
    lastName: "García"
    source: "website"  # ← Indica que vino del sitio web
  }) {
    success
  }
}
```

**Limitaciones:**
- ✅ Solo marca la fuente del lead
- ❌ NO tiene relación con gestión de sitios
- ❌ NO almacena información del sitio

---

### 3️⃣ Campo `websiteEngagement` en Analytics

Existe un campo para medir engagement de sitios web:

**Modelo:**
```typescript
// src/db/models/analytics.ts
interface Analytics {
  websiteEngagement: number;
  // ...
}
```

**Limitaciones:**
- ✅ Solo un número (score)
- ❌ NO tiene detalles de visitas
- ❌ NO está relacionado con gestión de sitios
- ❌ NO tiene timestamps ni historial

---

## 🚨 LO QUE NO EXISTE

### ❌ Tipo `CRM_Website` completo

**Solicitado:**
```graphql
type CRM_Website {
  id: ID!
  businessId: ID!
  name: String!
  url: String!
  status: WebsiteStatus!
  template: String
  aiGenerated: Boolean
  aiProvider: String
  htmlContent: String  # ← NO existe
  deployedAt: String
  analytics: WebsiteAnalytics  # ← NO existe
  createdAt: String!
  updatedAt: String!
}
```

**Estado:** ❌ Ninguno de estos campos existe en ningún modelo

---

### ❌ Queries para sitios web

**Solicitadas:**
```graphql
getCRMWebsites(businessId: ID!)
getCRMWebsite(id: ID!)
```

**Estado:** ❌ No implementadas. Solo existe:
```graphql
# Lo único disponible:
getCRMEntity(id: ID!) {
  entity {
    website  # ← Solo URL string
  }
}
```

---

### ❌ Mutations para sitios web

**Solicitadas:**
```graphql
createCRMWebsite
updateCRMWebsite
deleteCRMWebsite
toggleCRMWebsiteStatus
```

**Estado:** ❌ Ninguna existe

---

### ❌ Sistema de Analytics

**Solicitado:**
```graphql
type WebsiteAnalytics {
  views: Int
  uniqueVisitors: Int
  lastVisit: String
}
```

**Estado:** ❌ No implementado

---

## 💡 ALTERNATIVA ACTUAL (Workaround)

Si necesitan almacenar información de sitios web **ahora**, pueden usar:

### Opción 1: Campo `website` + `custom_fields`

```graphql
mutation {
  createCRMEntity(input: {
    name: "Sitio Web de Bodas Elegantes"
    type: COMPANY
    website: "https://bodas-elegantes.netlify.app"
    customFields: {
      # Almacenar metadata en JSON
      websiteTemplate: "wedding_planner"
      aiGenerated: true
      aiProvider: "anthropic"
      htmlPreview: "<html>..."  # ⚠️ Máx 16MB total en MongoDB
      deployedAt: "2025-10-14T12:00:00Z"
      analytics: {
        views: 0
        uniqueVisitors: 0
      }
    }
  }) {
    success
    entity {
      id
      website
      custom_fields
    }
  }
}
```

**Limitaciones del workaround:**
- ⚠️ `custom_fields` es JSON sin estructura definida
- ⚠️ No hay validación de datos
- ⚠️ No hay queries optimizadas
- ⚠️ Límite de tamaño: ~16MB por documento MongoDB
- ⚠️ No hay índices para búsquedas rápidas
- ⚠️ No hay tipos GraphQL específicos

---

### Opción 2: Usar notas para HTML pequeño

```graphql
mutation {
  createCRMEntity(input: {
    name: "Sitio Bodas Elegantes"
    website: "https://bodas-elegantes.netlify.app"
  }) {
    success
    entity { id }
  }
}

# Luego agregar HTML como nota
mutation {
  addCRMEntityNote(
    entityId: "ENTITY_ID"
    note: {
      content: "<html>...</html>"
      type: NOTE
      sentiment: NEUTRAL
      tags: ["website", "html"]
    }
  ) {
    success
  }
}
```

**Limitaciones:**
- ⚠️ Notas no están diseñadas para HTML
- ⚠️ No hay sintaxis highlighting
- ⚠️ No hay validación de HTML
- ⚠️ Difícil de consultar/actualizar

---

## 🚀 PROPUESTA DE IMPLEMENTACIÓN

Para implementar la funcionalidad solicitada, necesitaríamos:

### 1️⃣ **Nuevo modelo de base de datos**

```typescript
// src/db/models/crm/Website.ts
interface ICRMWebsite {
  _id: ObjectId;
  businessId: ObjectId;
  name: string;
  url?: string;
  status: 'DRAFT' | 'PUBLISHED' | 'SUSPENDED';
  template?: string;
  
  // Contenido
  htmlContent: string;  // Puede ser grande (50-100KB)
  cssContent?: string;
  jsContent?: string;
  
  // IA
  aiGenerated: boolean;
  aiProvider?: string;
  aiModel?: string;
  aiPrompt?: string;
  aiCost?: number;
  
  // Analytics
  analytics: {
    views: number;
    uniqueVisitors: number;
    lastVisit?: Date;
    avgTimeOnPage?: number;
    bounceRate?: number;
  };
  
  // Deployment
  deployedAt?: Date;
  deployedUrl?: string;
  deploymentProvider?: 'netlify' | 'github-pages' | 'vercel' | 'custom';
  
  // Multi-tenant
  development: string;
  ownership: Ownership;
  
  // Metadata
  metadata?: any;
  tags: string[];
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

### 2️⃣ **Schema GraphQL completo**

```graphql
# src/graphql/typeDefs/crm/website.ts
type CRM_Website {
  id: ID!
  businessId: ID!
  business: CRM_Entity  # ← Relación poblada
  name: String!
  url: String
  status: CRM_WebsiteStatus!
  template: String
  
  # Contenido
  htmlContent: String!
  cssContent: String
  jsContent: String
  
  # IA
  aiGenerated: Boolean!
  aiProvider: String
  aiModel: String
  aiPrompt: String
  aiCost: Float
  
  # Analytics
  analytics: CRM_WebsiteAnalytics!
  
  # Deployment
  deployedAt: DateTime
  deployedUrl: String
  deploymentProvider: CRM_DeploymentProvider
  
  # Multi-tenant
  development: String!
  ownership: CRM_Ownership!
  
  # Metadata
  metadata: JSON
  tags: [String!]!
  createdBy: String!
  createdAt: DateTime!
  updatedAt: DateTime!
}

enum CRM_WebsiteStatus {
  DRAFT
  PUBLISHED
  SUSPENDED
  ARCHIVED
}

enum CRM_DeploymentProvider {
  NETLIFY
  GITHUB_PAGES
  VERCEL
  CUSTOM
}

type CRM_WebsiteAnalytics {
  views: Int!
  uniqueVisitors: Int!
  lastVisit: DateTime
  avgTimeOnPage: Float
  bounceRate: Float
  topPages: [CRM_PageAnalytics!]!
}

type CRM_PageAnalytics {
  path: String!
  views: Int!
  avgTime: Float
}

input CRM_WebsiteInput {
  businessId: ID!
  name: String!
  url: String
  template: String
  htmlContent: String!
  cssContent: String
  jsContent: String
  aiGenerated: Boolean
  aiProvider: String
  aiModel: String
  aiPrompt: String
  metadata: JSON
  tags: [String!]
}

input CRM_WebsiteUpdateInput {
  name: String
  url: String
  htmlContent: String
  cssContent: String
  jsContent: String
  status: CRM_WebsiteStatus
  metadata: JSON
  tags: [String!]
}

input CRM_WebsiteFilters {
  businessId: ID
  status: [CRM_WebsiteStatus!]
  aiGenerated: Boolean
  search: String
  tags: [String!]
  development: String
}

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

extend type Query {
  getCRMWebsites(
    filters: CRM_WebsiteFilters
    pagination: CRM_PaginationInput
    sort: CRM_SortInput
  ): CRM_WebsitesResponse!
  
  getCRMWebsite(id: ID!): CRM_WebsiteResponse!
  
  searchCRMWebsites(
    query: String!
    businessId: ID
    limit: Int
  ): [CRM_Website!]!
  
  getCRMWebsiteAnalytics(
    websiteId: ID!
    dateRange: CRM_DateRangeFilter
  ): CRM_WebsiteAnalytics!
  
  getCRMWebsitesByBusiness(
    businessId: ID!
    pagination: CRM_PaginationInput
  ): CRM_WebsitesResponse!
}

extend type Mutation {
  # CRUD
  createCRMWebsite(input: CRM_WebsiteInput!): CRM_WebsiteResponse!
  updateCRMWebsite(id: ID!, input: CRM_WebsiteUpdateInput!): CRM_WebsiteResponse!
  deleteCRMWebsite(id: ID!): CRM_WebsiteResponse!
  
  # Estados
  publishCRMWebsite(id: ID!): CRM_WebsiteResponse!
  unpublishCRMWebsite(id: ID!): CRM_WebsiteResponse!
  suspendCRMWebsite(id: ID!): CRM_WebsiteResponse!
  archiveCRMWebsite(id: ID!): CRM_WebsiteResponse!
  
  # Deployment
  deployCRMWebsite(
    id: ID!
    provider: CRM_DeploymentProvider!
    config: JSON
  ): CRM_WebsiteResponse!
  
  # Analytics
  trackCRMWebsiteView(
    websiteId: ID!
    visitorId: String
    page: String
  ): Boolean!
  
  # Tags
  addCRMWebsiteTags(id: ID!, tags: [String!]!): CRM_WebsiteResponse!
  removeCRMWebsiteTags(id: ID!, tags: [String!]!): CRM_WebsiteResponse!
  
  # Duplicación
  duplicateCRMWebsite(
    id: ID!
    newName: String!
  ): CRM_WebsiteResponse!
  
  # IA
  generateCRMWebsiteWithAI(
    businessId: ID!
    name: String!
    prompt: String!
    template: String
    provider: String
    model: String
  ): CRM_WebsiteResponse!
  
  regenerateCRMWebsiteSection(
    websiteId: ID!
    section: String!
    prompt: String!
  ): CRM_WebsiteResponse!
}
```

---

### 3️⃣ **Resolvers**

```typescript
// src/graphql/resolvers/crm/website.ts
import { Website } from '../../../db/models/crm/Website';
import { Entity } from '../../../db/models/crm/Entity';

export const crmWebsiteResolvers = {
  Query: {
    getCRMWebsites: async (_, { filters, pagination, sort }, context) => {
      // Implementación
    },
    
    getCRMWebsite: async (_, { id }, context) => {
      // Implementación
    },
    
    // ...
  },
  
  Mutation: {
    createCRMWebsite: async (_, { input }, context) => {
      // Validar autenticación
      if (!context.user) {
        throw new Error('Usuario no autenticado');
      }
      
      // Crear sitio web
      const website = new Website({
        ...input,
        development: context.user.development,
        ownership: {
          primary_owner: {
            user_id: context.user.uid,
            name: context.user.email
          },
          shared_with_users: [],
          shared_with_groups: []
        },
        analytics: {
          views: 0,
          uniqueVisitors: 0
        }
      });
      
      await website.save();
      
      return {
        success: true,
        website,
        errors: []
      };
    },
    
    // ...
  },
  
  CRM_Website: {
    // Resolver para poblar business
    business: async (parent, _, context) => {
      return await Entity.findById(parent.businessId);
    }
  }
};
```

---

### 4️⃣ **Service para IA**

```typescript
// src/services/crmWebsiteGeneratorService.ts
import OpenAI from 'openai';
import Anthropic from '@anthropic-ai/sdk';

export class CRMWebsiteGeneratorService {
  async generateWebsite(options: {
    businessName: string;
    template: string;
    prompt: string;
    provider: 'openai' | 'anthropic';
    model: string;
  }): Promise<{ html: string; css: string; cost: number }> {
    // Implementación con IA
  }
  
  async regenerateSection(options: {
    currentHtml: string;
    section: string;
    prompt: string;
  }): Promise<{ html: string }> {
    // Implementación
  }
}
```

---

### 5️⃣ **Service para Deployment**

```typescript
// src/services/crmWebsiteDeploymentService.ts
export class CRMWebsiteDeploymentService {
  async deployToNetlify(html: string, siteName: string): Promise<string> {
    // API de Netlify
  }
  
  async deployToVercel(html: string, siteName: string): Promise<string> {
    // API de Vercel
  }
  
  async deployToGitHubPages(html: string, repo: string): Promise<string> {
    // API de GitHub
  }
}
```

---

### 6️⃣ **Service para Analytics**

```typescript
// src/services/crmWebsiteAnalyticsService.ts
export class CRMWebsiteAnalyticsService {
  async trackView(websiteId: string, visitorId?: string, page?: string) {
    // Incrementar contador
    await Website.findByIdAndUpdate(websiteId, {
      $inc: { 'analytics.views': 1 },
      'analytics.lastVisit': new Date()
    });
    
    // Unique visitors (usar Redis/cache)
    // ...
  }
  
  async getAnalytics(websiteId: string, dateRange?: any) {
    // Obtener estadísticas
  }
}
```

---

## 📊 ESTIMACIÓN DE ESFUERZO

| Tarea | Estimación | Complejidad |
|-------|------------|-------------|
| **Modelo MongoDB** | 2-3 días | Media |
| **Schema GraphQL** | 1-2 días | Baja |
| **Resolvers básicos (CRUD)** | 3-4 días | Media |
| **Servicio de IA** | 4-5 días | Alta |
| **Servicio de Deployment** | 5-7 días | Alta |
| **Servicio de Analytics** | 3-4 días | Media |
| **Tests** | 3-4 días | Media |
| **Documentación** | 1-2 días | Baja |
| **Total estimado** | **22-31 días** | **Alta** |

---

## ⚠️ CONSIDERACIONES TÉCNICAS

### **1. Almacenamiento de HTML**

**Problema:** HTML puede ser grande (50-100KB o más)

**Soluciones:**
- ✅ **MongoDB GridFS** para archivos > 16MB
- ✅ **Compresión gzip** del HTML antes de guardar
- ✅ **S3/Storage externo** para archivos grandes
- ✅ **Límite de tamaño**: Máx 500KB por sitio

**Recomendación:** Usar campo normal de MongoDB si < 100KB, GridFS si es mayor.

---

### **2. Analytics**

**Problema:** Tracking de visitas puede saturar la BD

**Soluciones:**
- ✅ **Redis** para contadores en tiempo real
- ✅ **Batch updates** cada 5 minutos a MongoDB
- ✅ **Agregación diaria** para historial
- ✅ **Pixel de tracking** embebido en HTML

**Recomendación:** Usar Redis + cronjob para sincronizar a MongoDB.

---

### **3. Deployment**

**Problema:** Necesitamos hosting externo

**Opciones:**
1. **Netlify** (recomendado)
   - API simple
   - Despliegue automático
   - SSL gratis
   - CDN global
   
2. **Vercel**
   - Similar a Netlify
   - Buena para Next.js
   
3. **GitHub Pages**
   - Gratis
   - Requiere repo
   
4. **Propio subdominio**
   - Ej: `cliente.tusitio.com`
   - Requiere configuración DNS
   - Requiere servidor propio

**Recomendación:** Netlify API + subdominios propios.

---

### **4. Seguridad**

**Problema:** HTML puede contener XSS

**Soluciones:**
- ✅ **Sanitización** con `DOMPurify` o similar
- ✅ **CSP headers** al servir HTML
- ✅ **Validación** de scripts
- ✅ **Sandbox** para preview

**Recomendación:** Sanitizar todo HTML antes de guardar.

---

### **5. Rate Limiting**

**Problema:** Generación con IA es costosa

**Soluciones:**
- ✅ Límite: 10 generaciones/día por tenant
- ✅ Límite: 100 regeneraciones de sección/día
- ✅ Cola de trabajos para generación masiva
- ✅ Costo calculado y facturado

---

## 💰 COSTOS ESTIMADOS

### **Por generación de sitio con IA:**

| Provider | Modelo | Tokens | Costo aprox |
|----------|--------|--------|-------------|
| OpenAI | GPT-4 | ~2000 | $0.06 |
| Anthropic | Claude 3.5 Sonnet | ~2000 | $0.006 |
| OpenAI | GPT-3.5 Turbo | ~2000 | $0.002 |

**Recomendación:** Usar Claude 3.5 Sonnet (mejor calidad/precio)

---

### **Hosting (Netlify):**

| Plan | Sitios | Bandwidth | Costo |
|------|--------|-----------|-------|
| Free | 1 | 100GB/mes | $0 |
| Pro | Ilimitados | 1TB/mes | $19/mes |
| Business | Ilimitados | 2TB/mes | $99/mes |

**Recomendación:** Plan Pro si < 1000 sitios, Business si más.

---

## 🎯 ROADMAP PROPUESTO

### **Fase 1: MVP (2-3 semanas)**
- ✅ Modelo básico de Website
- ✅ CRUD completo (GraphQL)
- ✅ Almacenamiento de HTML
- ✅ Estados (DRAFT/PUBLISHED)
- ✅ Asociación con Entity (business)

### **Fase 2: IA (2-3 semanas)**
- ✅ Generación de sitios con Claude/GPT
- ✅ Templates predefinidos
- ✅ Regeneración de secciones
- ✅ Tracking de costos

### **Fase 3: Deployment (1-2 semanas)**
- ✅ Integración con Netlify
- ✅ URLs personalizadas
- ✅ SSL automático
- ✅ Subdominios propios

### **Fase 4: Analytics (1-2 semanas)**
- ✅ Tracking básico (views)
- ✅ Unique visitors
- ✅ Pixel embebido
- ✅ Dashboard de stats

### **Fase 5: Avanzado (2-3 semanas)**
- ✅ Editor visual
- ✅ A/B testing
- ✅ SEO optimization
- ✅ Forms integration

---

## 📞 DECISIÓN REQUERIDA

**¿Quieren que implementemos esta funcionalidad?**

### **Opción A: Implementación completa**
- ✅ Todas las fases
- ⏱️ 8-12 semanas
- 💰 Costo: A determinar

### **Opción B: MVP primero**
- ✅ Solo Fase 1
- ⏱️ 2-3 semanas
- 💰 Costo reducido

### **Opción C: No implementar ahora**
- ✅ Usar workaround con `custom_fields`
- ⏱️ Inmediato
- 💰 Sin costo adicional

---

## 📋 PREGUNTAS PARA EL CLIENTE

1. **¿Qué tan prioritaria es esta funcionalidad?**
   - Alta (necesaria para lanzamiento)
   - Media (nice to have)
   - Baja (puede esperar)

2. **¿Cuántos sitios esperan generar/mes?**
   - < 100
   - 100-1000
   - > 1000

3. **¿Prefieren hosting incluido o externo?**
   - Incluido (Netlify/Vercel)
   - Externo (ellos manejan)
   - Ambas opciones

4. **¿Límite de tamaño de HTML?**
   - < 100KB (simple)
   - 100KB - 1MB (medio)
   - > 1MB (complejo)

5. **¿Qué nivel de analytics necesitan?**
   - Básico (views)
   - Intermedio (+ unique visitors)
   - Avanzado (+ heatmaps, A/B testing)

6. **¿Presupuesto disponible?**
   - A discutir
   - Definido: $_______
   - Sin presupuesto

---

## ✅ CONCLUSIÓN

La funcionalidad de gestión de sitios web **NO EXISTE** actualmente.

**Para avanzar, necesitamos:**
1. ✅ Confirmación de que quieren esta feature
2. ✅ Definir alcance (MVP vs completo)
3. ✅ Acordar timeline
4. ✅ Definir presupuesto
5. ✅ Responder preguntas técnicas arriba

**Mientras tanto, pueden usar:**
- ⚠️ Campo `website` + `custom_fields` (limitado)
- ⚠️ Servicio externo (no integrado)

---

**📧 Contacto:**  
Si deciden implementar, por favor respondan las preguntas de este documento y confirmamos timeline + costos.

