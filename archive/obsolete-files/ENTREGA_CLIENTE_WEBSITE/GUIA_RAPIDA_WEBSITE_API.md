# ⚡ GUÍA RÁPIDA: API DE WEBSITES

**Para comenzar en 5 minutos** 🚀

---

## 🎯 CASO DE USO 1: Crear sitio para un evento

```graphql
# 1. Crear el sitio
mutation {
  createCRMWebsite(input: {
    name: "Boda Isabel & Raúl"
    slug: "boda-isabel-raul"
    websiteType: EVENT
    linkedTo: {
      type: "Event"
      id: "EVENT_ID_AQUI"
    }
    domain: {
      type: SUBDOMAIN
      value: "boda-isabel-raul.eventosorganizador.com"
    }
    content: {
      html: """
        <!DOCTYPE html>
        <html>
        <head>
          <title>Boda Isabel & Raúl</title>
        </head>
        <body>
          <h1>¡Nos Casamos!</h1>
          <p>15 de Noviembre de 2025</p>
        </body>
        </html>
      """
    }
    seo: {
      title: "Boda Isabel & Raúl - 15 Nov 2025"
      description: "Celebra con nosotros nuestra boda"
    }
  }) {
    success
    website { id slug }
  }
}

# 2. Publicar
mutation {
  publishCRMWebsite(id: "WEBSITE_ID") {
    success
    website {
      publishedUrl  # → https://boda-isabel-raul.eventosorganizador.com
    }
  }
}
```

**¡Listo!** El sitio está publicado y accesible.

---

## 🏢 CASO DE USO 2: Sitio corporativo con dominio propio

```graphql
# 1. Crear el sitio
mutation {
  createCRMWebsite(input: {
    name: "Sitio Corporativo"
    slug: "bodas-elegantes"
    websiteType: ENTITY
    linkedTo: {
      type: "CRM_Entity"
      id: "ENTITY_ID"
    }
    domain: {
      type: SUBDOMAIN  # Empezamos con subdominio
      value: "bodas-elegantes.eventosorganizador.com"
    }
    content: {
      html: "..."
    }
  }) {
    success
    website { id }
  }
}

# 2. Publicar temporalmente
mutation {
  publishCRMWebsite(id: "WEBSITE_ID") {
    success
  }
}

# 3. Configurar dominio personalizado
mutation {
  setCRMWebsiteCustomDomain(
    id: "WEBSITE_ID"
    domain: "www.bodas-elegantes.com"
    dnsRecords: [
      { type: CNAME, name: "www", value: "bodas-elegantes.eventosorganizador.com" }
    ]
  ) {
    success
    website {
      domain {
        verificationToken  # Copiar este token
        dnsRecords { type name value }
      }
    }
  }
}

# 4. Configurar DNS en GoDaddy/Cloudflare:
#    Tipo: CNAME, Nombre: www, Valor: bodas-elegantes.eventosorganizador.com
#    Tipo: TXT, Nombre: _verify, Valor: [el token de arriba]

# 5. Esperar propagación DNS (1-48h) y verificar:
mutation {
  verifyCRMWebsiteDomain(id: "WEBSITE_ID") {
    verified  # → true ✅
    message
  }
}
```

---

## 📝 CASO DE USO 3: Actualizar contenido del sitio

```graphql
mutation {
  updateCRMWebsiteContent(
    id: "WEBSITE_ID"
    content: {
      html: """
        <!DOCTYPE html>
        <html>
        <head><title>Actualizado</title></head>
        <body><h1>Contenido nuevo</h1></body>
        </html>
      """
      css: "body { background: #f0f0f0; }"
    }
  ) {
    success
  }
}
```

Los cambios se aplican **inmediatamente** si el sitio está publicado.

---

## 📊 CASO DE USO 4: Ver estadísticas

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

**Respuesta:**
```json
{
  "views": 523,
  "uniqueVisitors": 198,
  "topPages": [
    { "path": "/", "views": 350 },
    { "path": "/contacto", "views": 98 },
    { "path": "/servicios", "views": 75 }
  ]
}
```

---

## 👥 CASO DE USO 5: Listar todos mis sitios

```graphql
query {
  getMyCRMWebsites {
    websites {
      id
      name
      slug
      status
      publishedUrl
      analytics { views }
    }
    total
  }
}
```

---

## 🔄 FLUJO COMPLETO EN JAVASCRIPT

```javascript
// Cliente GraphQL
const API_URL = 'https://api2.eventosorganizador.com/graphql';
const DEVELOPMENT = 'bodasdehoy';

async function graphqlRequest(query, variables = {}) {
  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-development': DEVELOPMENT
    },
    body: JSON.stringify({ query, variables })
  });
  
  const { data, errors } = await response.json();
  
  if (errors) {
    throw new Error(errors[0].message);
  }
  
  return data;
}

// 1. Crear sitio
const createMutation = `
  mutation CreateWebsite($input: CRM_CreateWebsiteInput!) {
    createCRMWebsite(input: $input) {
      success
      website { id slug }
      errors
    }
  }
`;

const { createCRMWebsite } = await graphqlRequest(createMutation, {
  input: {
    name: "Mi Sitio",
    slug: "mi-sitio",
    websiteType: "EVENT",
    linkedTo: { type: "Event", id: "event123" },
    domain: { type: "SUBDOMAIN", value: "mi-sitio.eventosorganizador.com" },
    content: { html: "<html>...</html>" }
  }
});

const websiteId = createCRMWebsite.website.id;

// 2. Publicar
const publishMutation = `
  mutation PublishWebsite($id: ID!) {
    publishCRMWebsite(id: $id) {
      success
      website { publishedUrl }
    }
  }
`;

const { publishCRMWebsite } = await graphqlRequest(publishMutation, { id: websiteId });

console.log('✅ Sitio publicado:', publishCRMWebsite.website.publishedUrl);
```

---

## 🎨 INTEGRACIÓN CON TU EDITOR

Si tienes un editor visual de sitios web (frontend), puedes integrarlo así:

```javascript
// 1. Usuario edita en tu editor visual
const htmlContent = editorInstance.getHTML();
const cssContent = editorInstance.getCSS();

// 2. Guardar en la API
await graphqlRequest(`
  mutation {
    updateCRMWebsiteContent(
      id: "${websiteId}"
      content: {
        html: ${JSON.stringify(htmlContent)}
        css: ${JSON.stringify(cssContent)}
      }
    ) {
      success
    }
  }
`);

// 3. Publicar cambios
await graphqlRequest(`
  mutation {
    publishCRMWebsite(id: "${websiteId}") {
      success
      website { publishedUrl }
    }
  }
`);

console.log('✅ Cambios publicados');
```

---

## ⚡ TIPS PRO

### **1. Autoguardar mientras editas**

```javascript
let saveTimeout;

editor.on('change', () => {
  clearTimeout(saveTimeout);
  saveTimeout = setTimeout(() => {
    // Guardar borrador sin publicar
    updateCRMWebsiteContent({ html: editor.getHTML() });
  }, 2000); // 2 segundos después del último cambio
});
```

### **2. Preview antes de publicar**

```javascript
// Generar URL de preview temporal
const previewUrl = `https://preview.eventosorganizador.com/${websiteId}`;

// El backend servirá el HTML desde la BD (status: DRAFT)
```

### **3. Versionado de contenido**

```javascript
// Antes de actualizar, guardar versión anterior en custom_fields
mutation {
  updateCRMWebsite(
    id: "website_id"
    input: {
      content: { html: "..." }
      custom_fields: {
        previousVersions: [
          { html: "...", savedAt: "2025-10-15T10:00:00Z" }
        ]
      }
    }
  ) { success }
}
```

---

## 🛠️ TROUBLESHOOTING RÁPIDO

| Problema | Solución |
|----------|----------|
| Slug ya existe | Cambiar slug o agregar sufijo `-2`, `-3` |
| HTML muy grande | Comprimir, usar CDN para imágenes |
| Dominio no verifica | Esperar propagación DNS, verificar records |
| Sin permisos | Incluir header `x-development` |
| Rate limit | Esperar 1 minuto, implementar retry con backoff |

---

## 📚 DOCUMENTACIÓN COMPLETA

Ver: `DOCUMENTACION_WEBSITE_API_CLIENTE.md`

---

**¡Listo para crear sitios web!** 🚀

