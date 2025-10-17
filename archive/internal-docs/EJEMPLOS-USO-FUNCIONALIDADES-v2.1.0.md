# 🚀 EJEMPLOS DE USO - FUNCIONALIDADES v2.1.0

## 📋 **RESUMEN**
Este documento contiene ejemplos prácticos y completos de uso de las nuevas funcionalidades implementadas en la versión 2.1.0 del sistema CRM avanzado.

**Versión:** 2.1.0  
**Fecha:** 16 de septiembre de 2025  
**Funcionalidades:** Contactos Virtuales, Listas Extendidas, Integración Eventos-CRM

---

## 🔗 **SISTEMA DE CONTACTOS VIRTUALES**

### **1. Sincronizar Invitados de Evento a Contactos Virtuales**

#### **Caso de Uso:** Tienes un evento de boda con 50 invitados y quieres sincronizarlos para crear campañas de marketing.

```bash
# Sincronizar todos los invitados de un evento específico
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation SyncCRMEventGuestsToVirtualContacts($eventId: ID!) { syncCRMEventGuestsToVirtualContacts(eventId: $eventId) { success result { created updated totalProcessed errors } } }",
    "variables": {
      "eventId": "652a8b2e9c1d4e001f8e6a7b"
    }
  }'
```

#### **Respuesta Esperada:**
```json
{
  "data": {
    "syncCRMEventGuestsToVirtualContacts": {
      "success": true,
      "result": {
        "created": 45,
        "updated": 5,
        "totalProcessed": 50,
        "errors": []
      }
    }
  }
}
```

### **2. Obtener Contactos Virtuales con Filtros**

#### **Caso de Uso:** Quieres ver todos los contactos virtuales que asistieron a eventos en los últimos 30 días.

```bash
# Obtener contactos virtuales con filtros específicos
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query GetCRMVirtualContacts($filters: CRM_VirtualContactFilters, $pagination: CRM_PaginationInput) { getCRMVirtualContacts(filters: $filters, pagination: $pagination) { virtualContacts { id fullName email eventInfo { eventName eventDate asistencia } engagement { score lastInteraction } } pagination { total page limit } } }",
    "variables": {
      "filters": {
        "eventInfo": {
          "eventDate": {
            "gte": "2025-08-16T00:00:00Z"
          }
        },
        "engagement": {
          "score": {
            "gte": 50
          }
        }
      },
      "pagination": {
        "page": 1,
        "limit": 20
      }
    }
  }'
```

### **3. Actualizar Engagement de Contacto Virtual**

#### **Caso de Uso:** Un invitado abrió un email de campaña y quieres actualizar su score de engagement.

```bash
# Actualizar engagement de contacto virtual
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation UpdateCRMVirtualContact($id: ID!, $input: CRM_VirtualContactUpdateInput!) { updateCRMVirtualContact(id: $id, input: $input) { success virtualContact { id fullName engagement { score lastInteraction totalInteractions } } } }",
    "variables": {
      "id": "virtual_contact_123",
      "input": {
        "engagement": {
          "score": 75,
          "lastInteraction": "2025-09-16T10:30:00Z",
          "totalInteractions": 3
        }
      }
    }
  }'
```

---

## 📋 **LISTAS EXTENDIDAS**

### **4. Crear Lista Extendida Mixta**

#### **Caso de Uso:** Quieres crear una lista que combine contactos CRM existentes con invitados de eventos (contactos virtuales).

```bash
# Crear lista extendida con contactos CRM y virtuales
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMExtendedContactList($input: CRM_ExtendedContactListInput!) { createCRMExtendedContactList(input: $input) { success extendedContactList { id name description totalMembers contactDetails { id fullName type } virtualContactDetails { id fullName eventInfo { eventName } } } } }",
    "variables": {
      "input": {
        "name": "Lista Mixta - Boda María y Juan",
        "description": "Lista que combina clientes CRM con invitados de la boda",
        "contactIds": ["contact_1", "contact_2", "contact_3"],
        "virtualContactIds": ["virtual_1", "virtual_2", "virtual_3"],
        "tags": ["boda", "evento", "mixta"],
        "dynamicCriteria": {
          "enabled": false,
          "filters": {}
        }
      }
    }
  }'
```

#### **Respuesta Esperada:**
```json
{
  "data": {
    "createCRMExtendedContactList": {
      "success": true,
      "extendedContactList": {
        "id": "extended_list_123",
        "name": "Lista Mixta - Boda María y Juan",
        "description": "Lista que combina clientes CRM con invitados de la boda",
        "totalMembers": 6,
        "contactDetails": [
          {
            "id": "contact_1",
            "fullName": "Ana García",
            "type": "CRM_CONTACT"
          }
        ],
        "virtualContactDetails": [
          {
            "id": "virtual_1",
            "fullName": "Carlos López",
            "eventInfo": {
              "eventName": "Boda María y Juan"
            }
          }
        ]
      }
    }
  }
}
```

### **5. Crear Lista Extendida Dinámica**

#### **Caso de Uso:** Quieres una lista que se actualice automáticamente con todos los invitados de eventos que tienen un score de engagement mayor a 70.

```bash
# Crear lista extendida con criterios dinámicos
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMExtendedContactList($input: CRM_ExtendedContactListInput!) { createCRMExtendedContactList(input: $input) { success extendedContactList { id name dynamicCriteria { enabled filters } } } }",
    "variables": {
      "input": {
        "name": "Invitados Altamente Comprometidos",
        "description": "Lista automática de invitados con engagement alto",
        "tags": ["dinamica", "engagement", "alto"],
        "dynamicCriteria": {
          "enabled": true,
          "filters": {
            "type": "VIRTUAL_CONTACT",
            "engagement": {
              "score": {
                "gte": 70
              }
            },
            "communication": {
              "emailStatus": "ACTIVE"
            }
          }
        }
      }
    }
  }'
```

### **6. Agregar Miembros a Lista Extendida**

#### **Caso de Uso:** Tienes una lista existente y quieres agregar más contactos virtuales.

```bash
# Agregar miembros a lista extendida existente
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation AddCRMExtendedContactListMembers($id: ID!, $contactIds: [ID!], $virtualContactIds: [ID!]) { addCRMExtendedContactListMembers(id: $id, contactIds: $contactIds, virtualContactIds: $virtualContactIds) { success extendedContactList { id totalMembers } } }",
    "variables": {
      "id": "extended_list_123",
      "contactIds": [],
      "virtualContactIds": ["virtual_4", "virtual_5", "virtual_6"]
    }
  }'
```

---

## 📧 **INTEGRACIÓN EVENTOS-CRM**

### **7. Crear Lista Automática para Evento**

#### **Caso de Uso:** Quieres crear automáticamente una lista extendida con todos los invitados de un evento específico.

```bash
# Crear lista extendida automática para evento
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMEventExtendedContactList($eventId: ID!, $name: String!, $description: String, $tags: [String!]) { createCRMEventExtendedContactList(eventId: $eventId, name: $name, description: $description, tags: $tags) { success extendedContactList { id name totalMembers virtualContactDetails { id fullName } } } }",
    "variables": {
      "eventId": "652a8b2e9c1d4e001f8e6a7b",
      "name": "Invitados Boda María y Juan - Septiembre 2025",
      "description": "Lista automática de todos los invitados de la boda",
      "tags": ["boda", "maria-juan", "septiembre-2025", "automatica"]
    }
  }'
```

### **8. Crear Campaña para Evento**

#### **Caso de Uso:** Quieres crear una campaña de email específica para todos los invitados de un evento.

```bash
# Crear campaña específica para evento
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMEventCampaign($eventId: ID!, $campaignInput: CRM_CampaignInput!) { createCRMEventCampaign(eventId: $eventId, campaignInput: $campaignInput) { success campaign { id name type extendedRecipientLists { id name totalMembers } settings { trackOpens trackClicks } } } }",
    "variables": {
      "eventId": "652a8b2e9c1d4e001f8e6a7b",
      "campaignInput": {
        "name": "Recordatorio Boda - Últimos Detalles",
        "type": "EMAIL",
        "templateId": "template_boda_recordatorio",
        "settings": {
          "trackOpens": true,
          "trackClicks": true,
          "sendAt": "2025-09-20T10:00:00Z"
        },
        "whatsappConfig": {
          "templateName": "boda_recordatorio",
          "languageCode": "es"
        }
      }
    }
  }'
```

### **9. Obtener Estadísticas de Mensajería por Evento**

#### **Caso de Uso:** Quieres ver el rendimiento de todas las campañas enviadas para un evento específico.

```bash
# Obtener estadísticas de mensajería por evento
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query GetCRMEventMessagingStats($eventId: ID!) { getCRMEventMessagingStats(eventId: $eventId) { eventId eventName totalCampaigns totalMessagesSent emailSent emailOpened emailClicked whatsappSent whatsappRead smsSent lastCampaignDate } }",
    "variables": {
      "eventId": "652a8b2e9c1d4e001f8e6a7b"
    }
  }'
```

#### **Respuesta Esperada:**
```json
{
  "data": {
    "getCRMEventMessagingStats": {
      "eventId": "652a8b2e9c1d4e001f8e6a7b",
      "eventName": "Boda María y Juan",
      "totalCampaigns": 3,
      "totalMessagesSent": 150,
      "emailSent": 120,
      "emailOpened": 95,
      "emailClicked": 45,
      "whatsappSent": 30,
      "whatsappRead": 28,
      "smsSent": 0,
      "lastCampaignDate": "2025-09-15T14:30:00Z"
    }
  }
}
```

### **10. Obtener Evento con Contactos Virtuales**

#### **Caso de Uso:** Quieres ver un evento específico con todos sus contactos virtuales asociados.

```bash
# Obtener evento con contactos virtuales
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query GetCRMEventWithVirtualContacts($eventId: ID!) { getCRMEventWithVirtualContacts(eventId: $eventId) { id nombre fecha totalVirtualContacts virtualContacts { id fullName email eventInfo { asistencia grupo } engagement { score lastInteraction } } } }",
    "variables": {
      "eventId": "652a8b2e9c1d4e001f8e6a7b"
    }
  }'
```

---

## 🛠️ **HERRAMIENTAS CLI Y SCRIPTS**

### **11. Sincronización Masiva de Eventos**

#### **Caso de Uso:** Quieres sincronizar todos los invitados de todos los eventos de un desarrollo específico.

```bash
# Usar script CLI para sincronización masiva
npm run sync-virtual-contacts sync-all \
  --development "mi-desarrollo" \
  --cleanup \
  --stats
```

#### **Salida Esperada:**
```
🚀 Iniciando sincronización masiva de contactos virtuales...
📊 Desarrollo: mi-desarrollo
📁 Eventos encontrados: 15
👥 Total invitados: 750

✅ Procesando evento: Boda María y Juan (50 invitados)
✅ Procesando evento: Cumpleaños Ana (30 invitados)
✅ Procesando evento: Graduación Carlos (45 invitados)
...

📊 RESUMEN FINAL:
================
✅ Contactos virtuales creados: 720
✅ Contactos virtuales actualizados: 30
✅ Contactos huérfanos limpiados: 5
✅ Errores: 0
⏱️ Tiempo total: 2m 30s

🎉 ¡Sincronización completada exitosamente!
```

### **12. Validación de Integridad**

#### **Caso de Uso:** Quieres verificar que todos los contactos virtuales están correctamente sincronizados.

```bash
# Validar integridad de sincronización
npm run sync-virtual-contacts validate \
  --development "mi-desarrollo" \
  --detailed
```

#### **Salida Esperada:**
```
🔍 Validando integridad de contactos virtuales...
📊 Desarrollo: mi-desarrollo

✅ Verificando contactos virtuales: 750/750 OK
✅ Verificando eventos asociados: 15/15 OK
✅ Verificando invitados sincronizados: 750/750 OK
✅ Verificando engagement scores: 750/750 OK

📊 ESTADÍSTICAS:
================
📈 Score promedio: 65.4
📈 Score máximo: 95
📈 Score mínimo: 15
📈 Contactos con engagement alto (>70): 340
📈 Contactos con engagement medio (40-70): 280
📈 Contactos con engagement bajo (<40): 130

🎯 ¡Validación completada sin errores!
```

---

## 📊 **EJEMPLOS DE RESPUESTAS COMPLETAS**

### **13. Flujo Completo: Evento → Contactos Virtuales → Lista → Campaña**

#### **Paso 1: Sincronizar invitados**
```bash
# Resultado: 50 contactos virtuales creados
```

#### **Paso 2: Crear lista extendida**
```bash
# Resultado: Lista con 50 miembros
```

#### **Paso 3: Crear campaña**
```bash
# Resultado: Campaña creada y programada
```

#### **Paso 4: Verificar estadísticas**
```bash
# Resultado: 95% delivery rate, 78% open rate, 32% click rate
```

### **14. Casos de Uso Avanzados**

#### **A. Segmentación por Engagement**
```graphql
# Obtener contactos virtuales con engagement alto
query GetHighEngagementVirtualContacts {
  getCRMVirtualContacts(
    filters: {
      engagement: { score: { gte: 80 } }
    }
  ) {
    virtualContacts {
      id
      fullName
      engagement {
        score
        lastInteraction
      }
      eventInfo {
        eventName
      }
    }
  }
}
```

#### **B. Campañas por Tipo de Evento**
```graphql
# Crear campaña específica para bodas
mutation CreateWeddingCampaign {
  createCRMEventCampaign(
    eventId: "boda_123"
    campaignInput: {
      name: "Recordatorio Boda - Última Semana"
      type: EMAIL
      templateId: "template_boda_final"
      settings: {
        trackOpens: true
        trackClicks: true
      }
    }
  ) {
    success
    campaign {
      id
      name
    }
  }
}
```

#### **C. Análisis de Rendimiento**
```graphql
# Comparar rendimiento entre diferentes eventos
query CompareEventPerformance {
  getCRMEventsWithVirtualContacts(
    filters: {
      fecha: { gte: "2025-08-01T00:00:00Z" }
    }
  ) {
    id
    nombre
    fecha
    totalVirtualContacts
    virtualContacts {
      engagement {
        score
      }
    }
  }
}
```

---

## 🎯 **MEJORES PRÁCTICAS**

### **1. Sincronización Regular**
- Ejecutar sincronización diaria para mantener datos actualizados
- Usar validación semanal para verificar integridad
- Limpiar contactos huérfanos mensualmente

### **2. Segmentación Efectiva**
- Crear listas dinámicas basadas en engagement
- Usar tags descriptivos para organización
- Separar contactos por tipo de evento

### **3. Campañas Optimizadas**
- Programar envíos en horarios óptimos
- Personalizar contenido según el evento
- Hacer seguimiento de métricas de rendimiento

### **4. Monitoreo Continuo**
- Verificar estadísticas semanalmente
- Ajustar estrategias según resultados
- Mantener base de datos limpia y actualizada

---

## 📞 **SOPORTE Y RECURSOS**

### **Documentación Completa:**
- `SISTEMA-CONTACTOS-VIRTUALES.md` - Guía completa del sistema
- `API_DOCUMENTATION.md` - Documentación de la API
- `CONSULTAS_RAPIDAS_MCP.md` - Comandos rápidos MCP

### **Scripts Disponibles:**
- `src/scripts/syncVirtualContacts.ts` - Sincronización CLI
- `test-completo-integracion-eventos-crm.js` - Testing completo
- `optimize-eventos-crm-database.js` - Optimización de BD

### **Contacto:**
- **Email:** carlos.carrillo@recargaexpress.com
- **Proyecto:** API Eventos Organizador v2.1.0

---

**🚀 ¡Ejemplos completos y listos para usar en producción!**

*Documentación generada el 16 de septiembre de 2025*
*Versión del sistema: 2.1.0*
*Última actualización: Sistema 100% operativo con ejemplos prácticos*
