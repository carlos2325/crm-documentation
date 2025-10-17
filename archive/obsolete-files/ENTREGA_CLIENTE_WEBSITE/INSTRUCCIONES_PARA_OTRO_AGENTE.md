# 🤖 INSTRUCCIONES PARA OTRO AGENTE IA

**Objetivo:** Validar backend implementado e implementar herramientas MCP para Website Management

---

## 📋 CONTEXTO

Se ha implementado un sistema completo de gestión de sitios web (Website Management) para la API de eventos.

**Backend:** ✅ Completamente implementado  
**MCP:** ❌ Pendiente de implementación

---

## 📄 ARCHIVO PRINCIPAL

**Lee este archivo primero:**

```
ESPECIFICACIONES_COMPLETAS_PARA_AGENTE_IA.md
```

Contiene:
- Especificación completa del servicio
- Modelo MongoDB
- Schema GraphQL (13 queries, 16 mutations)
- Todas las herramientas MCP existentes del sistema
- Propuesta de 12 herramientas MCP para websites
- Checklist de validación
- Tests

---

## ✅ TAREAS A REALIZAR

### **TAREA 1: Validar Backend (30 min)**

Verificar que existen y funcionan:

```bash
# Verificar archivos
ls -la src/db/models/crm/Website.ts
ls -la src/graphql/typeDefs/crm/website.ts
ls -la src/graphql/resolvers/crm/website.ts
ls -la src/services/websiteDomainService.ts
ls -la src/services/websiteAnalyticsService.ts
```

Ejecutar test GraphQL:
```graphql
mutation {
  createCRMWebsite(input: {
    name: "Test Validación"
    slug: "test-agente-ia"
    websiteType: ENTITY
    linkedTo: { type: "CRM_Entity", id: "..." }
    domain: {
      type: SUBDOMAIN
      value: "test-agente-ia.eventosorganizador.com"
    }
    content: {
      html: "<html><body><h1>Test IA</h1></body></html>"
    }
  }) {
    success
    website { id slug }
  }
}
```

### **TAREA 2: Implementar MCP (2-3 horas)**

Crear archivo:
```
src/mcp/tools/websiteTools.ts
```

Implementar 12 herramientas:
1. get_user_websites
2. get_website_details
3. create_website
4. update_website_content
5. publish_website
6. unpublish_website
7. get_website_analytics
8. update_website_seo
9. set_custom_domain
10. verify_domain
11. delete_website
12. duplicate_website

**Referencia:** Ver sección "HERRAMIENTAS MCP WEBSITES (NUEVAS)" en ESPECIFICACIONES_COMPLETAS_PARA_AGENTE_IA.md

### **TAREA 3: Integrar en MCP Server**

Actualizar:
```
src/mcp/server.ts
```

1. Importar websiteTools
2. Agregar herramientas a la lista
3. Agregar handlers

Ejemplo:
```typescript
import websiteTools from './tools/websiteTools';

// En setupMCPHandlers:
tools: [
  ...existingTools,
  ...websiteTools.tools
]

// En CallToolRequestSchema handler:
case 'get_user_websites':
  return await websiteTools.handleGetUserWebsites(request.params.arguments);
// ... resto de casos
```

### **TAREA 4: Testing (30 min)**

Ejecutar los 5 tests del documento:
1. Crear website
2. Publicar website
3. Verificar en navegador
4. Analytics
5. Dominio personalizado

### **TAREA 5: Documentación MCP**

Crear archivo:
```
DOCUMENTACION_MCP_WEBSITES.md
```

Con:
- Lista de las 12 herramientas
- Ejemplos de uso
- Inputs y outputs

---

## 📊 CHECKLIST DE VALIDACIÓN

Marcar cada ítem al completarlo:

### Backend:
- [ ] Existe Website.ts con modelo completo
- [ ] Existe website.ts con schema GraphQL
- [ ] Existe website.ts con resolvers
- [ ] Existen servicios (domain, analytics)
- [ ] Test GraphQL funciona
- [ ] Se puede crear website
- [ ] Se puede publicar website

### MCP:
- [ ] Creado websiteTools.ts
- [ ] Implementadas 12 herramientas
- [ ] Integrado en server.ts
- [ ] Test MCP: get_user_websites funciona
- [ ] Test MCP: create_website funciona
- [ ] Test MCP: publish_website funciona
- [ ] Documentación MCP creada

---

## 🚀 RESULTADO ESPERADO

Al finalizar, deberías poder:

1. ✅ Crear websites desde GraphQL
2. ✅ Crear websites desde MCP
3. ✅ Publicar websites
4. ✅ Ver analytics
5. ✅ Gestionar dominios

---

## 📞 SI ENCUENTRAS PROBLEMAS

1. **Archivo no existe:** Reportar cuál falta
2. **Error en código:** Reportar error exacto
3. **Test falla:** Reportar qué test y error

---

## 💡 RECURSOS ADICIONALES

Documentación del cliente (ya está lista):
- DOCUMENTACION_WEBSITE_API_CLIENTE.md
- GUIA_RAPIDA_WEBSITE_API.md
- RESUMEN_IMPLEMENTACION_WEBSITES.md

Ejemplos de herramientas MCP existentes:
- src/mcp/tools/eventTools.ts
- src/mcp/tools/guestTools.ts
- src/mcp/tools/chatTools.ts

---

## ⏱️ ESTIMACIÓN DE TIEMPO

- Validación backend: 30 min
- Implementar MCP: 2-3 horas
- Testing: 30 min
- Documentación: 30 min

**Total:** ~4 horas

---

## ✅ AL FINALIZAR

Reportar:
1. ✅ Backend validado (sí/no)
2. ✅ MCP implementado (sí/no)
3. ✅ Tests pasados (cuántos de 5)
4. ❌ Problemas encontrados (si los hay)

---

**¡Buena suerte!** 🚀

Si tienes dudas, consulta el archivo:
`ESPECIFICACIONES_COMPLETAS_PARA_AGENTE_IA.md`

