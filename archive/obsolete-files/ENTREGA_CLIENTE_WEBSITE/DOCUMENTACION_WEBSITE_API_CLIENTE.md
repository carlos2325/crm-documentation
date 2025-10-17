# 🌐 DOCUMENTACIÓN API DE WEBSITES - CLIENTE

**Fecha:** 15 de Octubre de 2025  
**API:** api2.eventosorganizador.com  
**Endpoint GraphQL:** `https://api2.eventosorganizador.com/graphql`

---

## 📋 ÍNDICE

1. [Introducción](#introducción)
2. [Tipos de Websites](#tipos-de-websites)
3. [Queries Disponibles](#queries-disponibles)
4. [Mutations Disponibles](#mutations-disponibles)
5. [Ejemplos Completos](#ejemplos-completos)
6. [Gestión de Dominios](#gestión-de-dominios)
7. [Analytics y Tracking](#analytics-y-tracking)
8. [Límites y Restricciones](#límites-y-restricciones)
9. [Errores Comunes](#errores-comunes)

---

## 🎯 INTRODUCCIÓN

La API de Websites permite gestionar sitios web para:
- **Entidades** (empresas/negocios del CRM)
- **Whitelabels** (marcas blancas)
- **Eventos** (sitios de eventos individuales)

### **Características principales:**

✅ Multi-sitio (1 usuario = N websites)  
✅ Dominios personalizados + Subdominios  
✅ Estados: DRAFT → PUBLISHED → SUSPENDED → ARCHIVED  
✅ Analytics integrado (views, unique visitors)  
✅ Gestión de HTML/CSS/JS  
✅ SEO optimizado  
✅ Verificación DNS automática

---

## 📂 TIPOS DE WEBSITES

### **1. ENTITY (Empresas/Negocios)**
```graphql
websiteType: ENTITY
linkedTo: {
  type: "CRM_Entity"
  id: "entity_id"
}
```
**Ejemplo:** Sitio corporativo de una agencia de bodas

### **2. WHITELABEL (Marcas Blancas)**
```graphql
websiteType: WHITELABEL
linkedTo: {
  type: "Whitelabel"
  id: "whitelabel_id"
}
```
**Ejemplo:** Landing page institucional

### **3. EVENT (Eventos)**
```graphql
websiteType: EVENT
linkedTo: {
  type: "Event"
  id: "event_id"
}
```
**Ejemplo:** Sitio web de una boda

---

## 🔍 QUERIES DISPONIBLES

### **1. Listar mis sitios web**

```graphql
query {
  getMyCRMWebsites(
    filters: {
      websiteType: [ENTITY, EVENT]
      status: [PUBLISHED, DRAFT]
    }
    pagination: { page: 1, limit: 20 }
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
      createdAt
    }
    total
    pagination {
      page
      limit
      hasNext
    }
  }
}
```

### **2. Obtener un sitio específico**

```graphql
query {
  getCRMWebsite(id: "website_id") {
    success
    website {
      id
      name
      slug
      websiteType
      status
      publishedUrl
      
      domain {
        type
        value
        verified
      }
      
      content {
        html
        css
        js
      }
      
      seo {
        title
        description
        keywords
        ogImage
      }
      
      analytics {
        views
        uniqueVisitors
        lastVisit
        topPages {
          path
          views
        }
      }
    }
  }
}
```

### **3. Buscar por slug**

```graphql
query {
  getCRMWebsiteBySlug(
    slug: "boda-maria-juan"
    development: "bodasdehoy"
  ) {
    success
    website {
      id
      name
      publishedUrl
    }
  }
}
```

### **4. Verificar disponibilidad de slug**

```graphql
query {
  checkCRMWebsiteSlugAvailability(
    slug: "mi-nuevo-sitio"
    websiteType: EVENT
    development: "bodasdehoy"
  )
}
# Respuesta: true (disponible) o false (en uso)
```

### **5. Obtener estadísticas generales**

```graphql
query {
  getCRMWebsiteStats(development: "bodasdehoy")
}
# Respuesta:
# {
#   "total": 15,
#   "published": 10,
#   "draft": 5,
#   "byType": [
#     { "type": "ENTITY", "count": 5 },
#     { "type": "EVENT", "count": 10 }
#   ]
# }
```

---

## ✏️ MUTATIONS DISPONIBLES

### **1. Crear un sitio web**

```graphql
mutation {
  createCRMWebsite(input: {
    name: "Sitio Web Bodas Elegantes"
    slug: "bodas-elegantes"
    websiteType: ENTITY
    
    linkedTo: {
      type: "CRM_Entity"
      id: "entity_id_aqui"
    }
    
    domain: {
      type: SUBDOMAIN
      value: "bodas-elegantes.eventosorganizador.com"
    }
    
    content: {
      html: "<html><head><title>Bodas Elegantes</title></head><body><h1>Bienvenidos</h1></body></html>"
      css: "body { font-family: Arial; }"
      js: "console.log('Hola mundo');"
    }
    
    seo: {
      title: "Bodas Elegantes - Wedding Planners"
      description: "Los mejores organizadores de bodas en España"
      keywords: ["bodas", "wedding", "planner", "españa"]
      ogImage: "https://cdn.com/logo.jpg"
    }
    
    tags: ["corporativo", "premium"]
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

### **2. Actualizar contenido**

```graphql
mutation {
  updateCRMWebsiteContent(
    id: "website_id"
    content: {
      html: "<html>...</html>"
      css: "..."
      js: "..."
    }
  ) {
    success
    website {
      id
      content { html }
    }
  }
}
```

### **3. Publicar sitio**

```graphql
mutation {
  publishCRMWebsite(id: "website_id") {
    success
    website {
      id
      status        # → PUBLISHED
      publishedUrl  # → https://slug.eventosorganizador.com
      publishedAt
    }
    errors
  }
}
```

### **4. Despublicar sitio**

```graphql
mutation {
  unpublishCRMWebsite(id: "website_id") {
    success
    website {
      id
      status  # → DRAFT
      publishedUrl  # → null
    }
  }
}
```

### **5. Actualizar SEO**

```graphql
mutation {
  updateCRMWebsiteSEO(
    id: "website_id"
    seo: {
      title: "Nuevo título"
      description: "Nueva descripción"
      keywords: ["palabra1", "palabra2"]
      ogImage: "https://cdn.com/nueva-imagen.jpg"
      robots: "index,follow"
    }
  ) {
    success
    website {
      seo { title description }
    }
  }
}
```

### **6. Eliminar sitio**

```graphql
mutation {
  deleteCRMWebsite(id: "website_id") {
    success
    errors
  }
}
```

---

## 🌍 GESTIÓN DE DOMINIOS

### **Subdominios (por defecto)**

Los subdominios se generan automáticamente:

```
slug: "bodas-elegantes"
→ URL: https://bodas-elegantes.eventosorganizador.com
```

### **Dominios personalizados**

#### **PASO 1: Configurar dominio personalizado**

```graphql
mutation {
  setCRMWebsiteCustomDomain(
    id: "website_id"
    domain: "www.bodas-elegantes.com"
    dnsRecords: [
      {
        type: CNAME
        name: "www"
        value: "bodas-elegantes.eventosorganizador.com"
      }
    ]
  ) {
    success
    website {
      domain {
        type          # CUSTOM
        value         # www.bodas-elegantes.com
        verified      # false (pendiente)
        verificationToken  # "verify-abc123..."
        dnsRecords {
          type        # TXT
          name        # "_verify"
          value       # "verify-abc123..."
          verified    # false
        }
      }
    }
  }
}
```

#### **PASO 2: Configurar DNS en tu proveedor**

En GoDaddy, Cloudflare, etc., agregar:

```
Tipo: CNAME
Nombre: www
Valor: bodas-elegantes.eventosorganizador.com

Tipo: TXT
Nombre: _verify
Valor: verify-abc123...  (el token que te devolvió la API)
```

#### **PASO 3: Verificar dominio**

```graphql
mutation {
  verifyCRMWebsiteDomain(id: "website_id") {
    success
    verified  # true ✅ o false ❌
    message
    dnsRecords {
      type
      name
      verified
    }
    errors
  }
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "verified": true,
  "message": "Dominio verificado correctamente",
  "dnsRecords": [
    {
      "type": "CNAME",
      "name": "www",
      "verified": true
    },
    {
      "type": "TXT",
      "name": "_verify",
      "verified": true
    }
  ],
  "errors": []
}
```

---

## 📊 ANALYTICS Y TRACKING

### **Analytics automático**

Cuando publicas un sitio, se inyecta automáticamente un **pixel de tracking** que registra:

- ✅ Vistas totales
- ✅ Visitantes únicos
- ✅ Última visita
- ✅ Vistas por página

### **Obtener analytics**

```graphql
query {
  getCRMWebsiteAnalytics(
    websiteId: "website_id"
    dateRange: {
      from: "2025-10-01"
      to: "2025-10-31"
    }
  ) {
    views
    uniqueVisitors
    lastVisit
    pageViews  # { "/": 150, "/contacto": 45, "/servicios": 78 }
    topPages {
      path
      views
    }
  }
}
```

### **Tracking manual (si necesario)**

```graphql
mutation {
  trackCRMWebsiteView(
    websiteId: "website_id"
    visitorId: "visitor_12345"
    page: "/contacto"
    referrer: "https://google.com"
  )
}
```

---

## ⚙️ LÍMITES Y RESTRICCIONES

### **Tamaño de contenido:**
- HTML: Máximo **2 MB**
- CSS: Sin límite específico (recomendado < 500 KB)
- JS: Sin límite específico (recomendado < 500 KB)

### **Slugs:**
- Solo letras minúsculas, números y guiones
- Debe ser único por tenant (development)
- Ejemplo válido: `boda-maria-juan-2025`
- Ejemplo inválido: `Boda María & Juan!`

### **Dominios personalizados:**
- No se pueden usar subdominios de `eventosorganizador.com`, `bodasdehoy.com`, etc.
- Debe ser un dominio válido
- Requiere verificación DNS

### **Rate limits:**
- Publicaciones: 30 por minuto
- Queries: 100 por minuto

---

## ❌ ERRORES COMUNES

### **Error: "Slug ya existe"**

```json
{
  "errors": ["El slug ya está en uso"]
}
```

**Solución:** Usar otro slug o agregar sufijo único (ej: `bodas-elegantes-2`)

---

### **Error: "HTML excede tamaño máximo"**

```json
{
  "errors": ["El contenido HTML excede el tamaño máximo permitido (2MB)"]
}
```

**Solución:** Optimizar HTML, comprimir imágenes, usar CDN externo para assets grandes

---

### **Error: "Dominio no verificado"**

```json
{
  "verified": false,
  "errors": ["Registro CNAME no encontrado para www.ejemplo.com"]
}
```

**Solución:** 
1. Verificar configuración DNS en el proveedor
2. Esperar propagación DNS (puede tardar hasta 48h)
3. Volver a verificar con `verifyCRMWebsiteDomain`

---

### **Error: "Usuario no autenticado"**

```json
{
  "errors": ["Usuario no autenticado"]
}
```

**Solución:** Incluir header `x-development` en la petición:

```javascript
fetch('https://api2.eventosorganizador.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'x-development': 'bodasdehoy'  // ← REQUERIDO
  },
  body: JSON.stringify({ query: '...' })
});
```

---

## 📞 SOPORTE

Si encuentras algún problema no documentado:
- Verifica los logs de error en la respuesta GraphQL
- Consulta la documentación técnica completa
- Contacta al equipo de soporte técnico

**Versión de la API:** 2.0  
**Última actualización:** 15 de Octubre de 2025

