# 📧 DOCUMENTACIÓN COMPLETA - CASO DE USO: INTEGRACIÓN INVITACIONES-CAMPANAS

## 🎯 **RESUMEN EJECUTIVO**

Este documento detalla **paso a paso** el caso de uso completo de cómo integrar el **sistema de envío de invitaciones de eventos** con el **sistema de contactos y campañas** (email, SMS, WhatsApp) para crear un flujo unificado de comunicación con invitados.

**Versión:** 2.1.0  
**Fecha:** 16 de septiembre de 2025  
**Caso de Uso:** Invitaciones de eventos → Contactos Virtuales → Campañas → Plantillas → Envío

---

## 🏗️ **ARQUITECTURA DEL CASO DE USO**

### **🔄 Flujo Completo:**
```
EVENTO (con invitados) 
    ↓ [Sincronización automática]
CONTACTOS VIRTUALES 
    ↓ [Creación de listas]
LISTAS EXTENDIDAS 
    ↓ [Gestión de plantillas]
PLANTILLAS (Email/SMS/WhatsApp) 
    ↓ [Creación de campañas]
CAMPAÑAS UNIFICADAS 
    ↓ [Envío masivo]
MENSAJES ENVIADOS 
    ↓ [Tracking y métricas]
ESTADÍSTICAS Y REPORTES
```

---

## 📋 **PASO A PASO: CASO DE USO COMPLETO**

### **PASO 1: EVENTO CON INVITADOS**

#### **🎉 Escenario Inicial:**
Tienes un evento de boda con 100 invitados registrados en el sistema de eventos.

#### **📊 Datos del Evento:**
```json
{
  "evento": {
    "id": "boda_maria_juan_2025",
    "nombre": "Boda de María y Juan",
    "fecha": "2025-12-15T16:00:00Z",
    "tipo": "boda",
    "invitados_array": [
      {
        "id": "invitado_1",
        "nombre": "Ana García",
        "correo": "ana.garcia@email.com",
        "telefono": "+34612345678",
        "asistencia": "confirmada",
        "grupo": "familia_novia"
      },
      {
        "id": "invitado_2", 
        "nombre": "Carlos López",
        "correo": "carlos.lopez@email.com",
        "telefono": "+34687654321",
        "asistencia": "pendiente",
        "grupo": "amigos_novio"
      }
      // ... 98 invitados más
    ]
  }
}
```

#### **🔍 Verificar Evento:**
```bash
# Obtener evento con invitados
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query GetEvent($id: ID!) { getEvent(_id: $id) { _id nombre fecha invitados_array { nombre correo telefono asistencia grupo } } }",
    "variables": {
      "id": "boda_maria_juan_2025"
    }
  }'
```

---

### **PASO 2: SINCRONIZACIÓN A CONTACTOS VIRTUALES**

#### **🔄 Proceso de Sincronización:**
Los invitados del evento se sincronizan automáticamente a contactos virtuales en el CRM.

#### **📤 Comando de Sincronización:**
```bash
# Sincronizar todos los invitados del evento
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation SyncCRMEventGuestsToVirtualContacts($eventId: ID!) { syncCRMEventGuestsToVirtualContacts(eventId: $eventId) { success result { created updated totalProcessed errors } } }",
    "variables": {
      "eventId": "boda_maria_juan_2025"
    }
  }'
```

#### **✅ Resultado Esperado:**
```json
{
  "data": {
    "syncCRMEventGuestsToVirtualContacts": {
      "success": true,
      "result": {
        "created": 95,
        "updated": 5,
        "totalProcessed": 100,
        "errors": []
      }
    }
  }
}
```

#### **📊 Contactos Virtuales Creados:**
```json
{
  "contactosVirtuales": [
    {
      "id": "virtual_contact_1",
      "firstName": "Ana",
      "lastName": "García", 
      "fullName": "Ana García",
      "email": "ana.garcia@email.com",
      "phone": "+34612345678",
      "source": {
        "originalEventId": "boda_maria_juan_2025",
        "originalGuestId": "invitado_1",
        "syncDate": "2025-09-16T19:45:00Z"
      },
      "eventInfo": {
        "eventName": "Boda de María y Juan",
        "eventDate": "2025-12-15T16:00:00Z",
        "asistencia": "confirmada",
        "grupo": "familia_novia"
      },
      "communication": {
        "emailStatus": "ACTIVE",
        "whatsappStatus": "ACTIVE",
        "lastContact": null
      },
      "engagement": {
        "score": 0,
        "lastInteraction": null,
        "totalInteractions": 0
      },
      "tags": ["boda", "maria-juan", "familia-novia", "confirmada"],
      "customFields": {
        "grupo": "familia_novia",
        "tipo_evento": "boda"
      }
    }
    // ... 99 contactos virtuales más
  ]
}
```

---

### **PASO 3: CREACIÓN DE LISTAS EXTENDIDAS**

#### **📋 Crear Lista Extendida para el Evento:**
```bash
# Crear lista extendida automática con todos los invitados
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMEventExtendedContactList($eventId: ID!, $name: String!, $description: String, $tags: [String!]) { createCRMEventExtendedContactList(eventId: $eventId, name: $name, description: $description, tags: $tags) { success extendedContactList { id name totalMembers virtualContactDetails { id fullName eventInfo { asistencia grupo } } } } }",
    "variables": {
      "eventId": "boda_maria_juan_2025",
      "name": "Invitados Boda María y Juan - Diciembre 2025",
      "description": "Lista automática de todos los invitados de la boda",
      "tags": ["boda", "maria-juan", "diciembre-2025", "automatica"]
    }
  }'
```

#### **✅ Lista Extendida Creada:**
```json
{
  "data": {
    "createCRMEventExtendedContactList": {
      "success": true,
      "extendedContactList": {
        "id": "extended_list_boda_maria_juan",
        "name": "Invitados Boda María y Juan - Diciembre 2025",
        "totalMembers": 100,
        "virtualContactDetails": [
          {
            "id": "virtual_contact_1",
            "fullName": "Ana García",
            "eventInfo": {
              "asistencia": "confirmada",
              "grupo": "familia_novia"
            }
          }
          // ... 99 contactos virtuales más
        ]
      }
    }
  }
}
```

---

### **PASO 4: GESTIÓN DE PLANTILLAS**

#### **📧 Crear Plantilla de Email:**
```bash
# Crear plantilla de email para invitación
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMEmailTemplate($input: CRM_EmailTemplateInput!) { createCRMEmailTemplate(input: $input) { success emailTemplate { id name subject htmlContent variables } } }",
    "variables": {
      "input": {
        "name": "Invitación Boda - Recordatorio Final",
        "subject": "¡Últimos detalles para la boda de María y Juan!",
        "htmlContent": "<!DOCTYPE html><html><head><meta charset=\"utf-8\"><title>Invitación Boda</title></head><body style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;\"><div style=\"background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%); padding: 30px; border-radius: 10px; text-align: center;\"><h1 style=\"color: #2c3e50; margin-bottom: 20px;\">¡Hola {{nombre_invitado}}!</h1><p style=\"font-size: 18px; color: #34495e; line-height: 1.6;\">Te recordamos que la boda de <strong>María y Juan</strong> se celebrará el próximo:</p><div style=\"background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 10px rgba(0,0,0,0.1);\"><h2 style=\"color: #e74c3c; margin: 0;\">{{fecha_evento}}</h2><p style=\"margin: 10px 0; color: #7f8c8d;\">{{hora_evento}}</p><p style=\"margin: 10px 0; color: #7f8c8d;\">{{lugar_evento}}</p></div><p style=\"color: #34495e;\">Tu asistencia está: <strong style=\"color: {{color_estado}}\">{{estado_asistencia}}</strong></p><div style=\"margin: 30px 0;\"><a href=\"{{enlace_confirmacion}}\" style=\"background: #3498db; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;\">Confirmar Asistencia</a></div><p style=\"color: #7f8c8d; font-size: 14px;\">Si tienes alguna pregunta, no dudes en contactarnos.</p><p style=\"color: #7f8c8d; font-size: 14px; margin-top: 30px;\">Con cariño,<br>María y Juan</p></div></body></html>",
        "variables": [
          "nombre_invitado",
          "fecha_evento", 
          "hora_evento",
          "lugar_evento",
          "estado_asistencia",
          "color_estado",
          "enlace_confirmacion"
        ]
      }
    }
  }'
```

#### **📱 Crear Plantilla de WhatsApp:**
```bash
# Crear plantilla de WhatsApp para invitación
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMWhatsAppTemplate($input: CRM_WhatsAppTemplateInput!) { createCRMWhatsAppTemplate(input: $input) { success whatsappTemplate { id name content languageCode components } } }",
    "variables": {
      "input": {
        "name": "Invitación Boda WhatsApp",
        "content": "¡Hola {{nombre_invitado}}! 👋\n\n🎉 Te recordamos que la boda de *María y Juan* se celebrará el próximo:\n\n📅 *{{fecha_evento}}*\n🕐 {{hora_evento}}\n📍 {{lugar_evento}}\n\nTu asistencia está: *{{estado_asistencia}}*\n\n💌 Si necesitas confirmar o cambiar algo, responde a este mensaje.\n\n¡Esperamos verte en nuestro día especial! 💕\n\nMaría y Juan 💑",
        "languageCode": "es",
        "components": [
          {
            "type": "BODY",
            "text": "¡Hola {{nombre_invitado}}! 👋\n\n🎉 Te recordamos que la boda de *María y Juan* se celebrará el próximo:\n\n📅 *{{fecha_evento}}*\n🕐 {{hora_evento}}\n📍 {{lugar_evento}}\n\nTu asistencia está: *{{estado_asistencia}}*\n\n💌 Si necesitas confirmar o cambiar algo, responde a este mensaje.\n\n¡Esperamos verte en nuestro día especial! 💕\n\nMaría y Juan 💑"
          }
        ]
      }
    }
  }'
```

#### **📲 Crear Plantilla de SMS:**
```bash
# Crear plantilla de SMS para invitación
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMSmsTemplate($input: CRM_SmsTemplateInput!) { createCRMSmsTemplate(input: $input) { success smsTemplate { id name content maxLength } } }",
    "variables": {
      "input": {
        "name": "Recordatorio Boda SMS",
        "content": "Hola {{nombre_invitado}}! Recordatorio: Boda María y Juan el {{fecha_evento}} a las {{hora_evento}} en {{lugar_evento}}. Tu asistencia: {{estado_asistencia}}. Para confirmar: {{enlace_confirmacion}}",
        "maxLength": 160
      }
    }
  }'
```

---

### **PASO 5: CREACIÓN DE CAMPAÑAS UNIFICADAS**

#### **📧 Campaña de Email:**
```bash
# Crear campaña de email para invitados
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMEventCampaign($eventId: ID!, $campaignInput: CRM_CampaignInput!) { createCRMEventCampaign(eventId: $eventId, campaignInput: $campaignInput) { success campaign { id name type templateId extendedRecipientLists { id name totalMembers } settings { trackOpens trackClicks sendAt } } } }",
    "variables": {
      "eventId": "boda_maria_juan_2025",
      "campaignInput": {
        "name": "Recordatorio Final - Boda María y Juan",
        "type": "EMAIL",
        "templateId": "template_invitacion_boda_recordatorio",
        "settings": {
          "trackOpens": true,
          "trackClicks": true,
          "sendAt": "2025-12-10T10:00:00Z"
        },
        "whatsappConfig": {
          "templateName": "Invitación Boda WhatsApp",
          "languageCode": "es"
        }
      }
    }
  }'
```

#### **📱 Campaña de WhatsApp:**
```bash
# Crear campaña de WhatsApp para invitados
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMCampaign($input: CRM_CampaignInput!) { createCRMCampaign(input: $input) { success campaign { id name type templateId extendedRecipientLists { id name totalMembers } settings { trackOpens trackClicks sendAt } whatsappConfig { templateName languageCode } } } }",
    "variables": {
      "input": {
        "name": "WhatsApp Recordatorio Boda",
        "type": "WHATSAPP",
        "templateId": "template_whatsapp_boda",
        "extendedRecipientLists": ["extended_list_boda_maria_juan"],
        "settings": {
          "trackOpens": true,
          "trackClicks": true,
          "sendAt": "2025-12-12T14:00:00Z"
        },
        "whatsappConfig": {
          "templateName": "Invitación Boda WhatsApp",
          "languageCode": "es"
        }
      }
    }
  }'
```

#### **📲 Campaña de SMS:**
```bash
# Crear campaña de SMS para invitados
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMCampaign($input: CRM_CampaignInput!) { createCRMCampaign(input: $input) { success campaign { id name type templateId extendedRecipientLists { id name totalMembers } settings { trackOpens trackClicks sendAt } } } }",
    "variables": {
      "input": {
        "name": "SMS Recordatorio Boda",
        "type": "SMS",
        "templateId": "template_sms_boda",
        "extendedRecipientLists": ["extended_list_boda_maria_juan"],
        "settings": {
          "trackOpens": false,
          "trackClicks": true,
          "sendAt": "2025-12-13T09:00:00Z"
        }
      }
    }
  }'
```

---

### **PASO 6: PERSONALIZACIÓN DE VARIABLES**

#### **🔄 Proceso de Personalización:**
Cada mensaje se personaliza automáticamente con los datos del invitado:

```json
{
  "personalizacion": {
    "invitado_1": {
      "nombre_invitado": "Ana García",
      "fecha_evento": "15 de Diciembre, 2025",
      "hora_evento": "4:00 PM",
      "lugar_evento": "Hotel Palace, Madrid",
      "estado_asistencia": "Confirmada",
      "color_estado": "#27ae60",
      "enlace_confirmacion": "https://eventosorganizador.com/confirmar/boda_maria_juan_2025/invitado_1"
    },
    "invitado_2": {
      "nombre_invitado": "Carlos López",
      "fecha_evento": "15 de Diciembre, 2025", 
      "hora_evento": "4:00 PM",
      "lugar_evento": "Hotel Palace, Madrid",
      "estado_asistencia": "Pendiente",
      "color_estado": "#f39c12",
      "enlace_confirmacion": "https://eventosorganizador.com/confirmar/boda_maria_juan_2025/invitado_2"
    }
  }
}
```

---

### **PASO 7: ENVÍO MASIVO Y TRACKING**

#### **📤 Iniciar Campaña de Email:**
```bash
# Iniciar envío de campaña de email
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation StartCRMCampaign($id: ID!) { startCRMCampaign(id: $id) { success campaign { id name status sentAt } } }",
    "variables": {
      "id": "campaign_email_recordatorio_boda"
    }
  }'
```

#### **📱 Iniciar Campaña de WhatsApp:**
```bash
# Iniciar envío de campaña de WhatsApp
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation StartCRMCampaign($id: ID!) { startCRMCampaign(id: $id) { success campaign { id name status sentAt } } }",
    "variables": {
      "id": "campaign_whatsapp_recordatorio_boda"
    }
  }'
```

#### **📲 Iniciar Campaña de SMS:**
```bash
# Iniciar envío de campaña de SMS
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation StartCRMCampaign($id: ID!) { startCRMCampaign(id: $id) { success campaign { id name status sentAt } } }",
    "variables": {
      "id": "campaign_sms_recordatorio_boda"
    }
  }'
```

---

### **PASO 8: TRACKING Y MÉTRICAS EN TIEMPO REAL**

#### **📊 Verificar Estado de Envío:**
```bash
# Verificar estado de todas las campañas
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query GetCRMCampaigns($filters: CRM_CampaignFilters) { getCRMCampaigns(filters: $filters) { campaigns { id name type status sentAt stats { totalSent delivered opened clicked whatsappDelivered whatsappRead } } } }",
    "variables": {
      "filters": {
        "name": "Recordatorio"
      }
    }
  }'
```

#### **📈 Resultado del Tracking:**
```json
{
  "data": {
    "getCRMCampaigns": {
      "campaigns": [
        {
          "id": "campaign_email_recordatorio_boda",
          "name": "Recordatorio Final - Boda María y Juan",
          "type": "EMAIL",
          "status": "COMPLETED",
          "sentAt": "2025-12-10T10:00:00Z",
          "stats": {
            "totalSent": 100,
            "delivered": 98,
            "opened": 85,
            "clicked": 42,
            "whatsappDelivered": 0,
            "whatsappRead": 0
          }
        },
        {
          "id": "campaign_whatsapp_recordatorio_boda",
          "name": "WhatsApp Recordatorio Boda",
          "type": "WHATSAPP",
          "status": "COMPLETED",
          "sentAt": "2025-12-12T14:00:00Z",
          "stats": {
            "totalSent": 95,
            "delivered": 95,
            "opened": 0,
            "clicked": 0,
            "whatsappDelivered": 95,
            "whatsappRead": 89
          }
        },
        {
          "id": "campaign_sms_recordatorio_boda",
          "name": "SMS Recordatorio Boda",
          "type": "SMS",
          "status": "COMPLETED",
          "sentAt": "2025-12-13T09:00:00Z",
          "stats": {
            "totalSent": 80,
            "delivered": 78,
            "opened": 0,
            "clicked": 15,
            "whatsappDelivered": 0,
            "whatsappRead": 0
          }
        }
      ]
    }
  }
}
```

---

### **PASO 9: ESTADÍSTICAS CONSOLIDADAS DEL EVENTO**

#### **📊 Estadísticas Completas del Evento:**
```bash
# Obtener estadísticas consolidadas del evento
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query GetCRMEventMessagingStats($eventId: ID!) { getCRMEventMessagingStats(eventId: $eventId) { eventId eventName totalCampaigns totalMessagesSent emailSent emailOpened emailClicked whatsappSent whatsappRead smsSent lastCampaignDate } }",
    "variables": {
      "eventId": "boda_maria_juan_2025"
    }
  }'
```

#### **📈 Estadísticas Consolidadas:**
```json
{
  "data": {
    "getCRMEventMessagingStats": {
      "eventId": "boda_maria_juan_2025",
      "eventName": "Boda de María y Juan",
      "totalCampaigns": 3,
      "totalMessagesSent": 275,
      "emailSent": 100,
      "emailOpened": 85,
      "emailClicked": 42,
      "whatsappSent": 95,
      "whatsappRead": 89,
      "smsSent": 80,
      "lastCampaignDate": "2025-12-13T09:00:00Z"
    }
  }
}
```

---

### **PASO 10: ACTUALIZACIÓN DE ENGAGEMENT**

#### **🔄 Actualización Automática de Engagement:**
Cuando los invitados interactúan con los mensajes, su engagement se actualiza automáticamente:

```bash
# Actualizar engagement de contacto virtual
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation UpdateCRMVirtualContact($id: ID!, $input: CRM_VirtualContactUpdateInput!) { updateCRMVirtualContact(id: $id, input: $input) { success virtualContact { id fullName engagement { score lastInteraction totalInteractions } } } }",
    "variables": {
      "id": "virtual_contact_1",
      "input": {
        "engagement": {
          "score": 85,
          "lastInteraction": "2025-12-10T10:15:00Z",
          "totalInteractions": 3
        }
      }
    }
  }'
```

---

## 🎯 **CASOS DE USO AVANZADOS**

### **Caso 1: Segmentación por Grupo**

#### **🎭 Crear Campaña Solo para Familia:**
```bash
# Crear lista dinámica solo para familia de la novia
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMExtendedContactList($input: CRM_ExtendedContactListInput!) { createCRMExtendedContactList(input: $input) { success extendedContactList { id name totalMembers } } }",
    "variables": {
      "input": {
        "name": "Familia de la Novia - Boda María y Juan",
        "description": "Lista dinámica solo para familia de la novia",
        "dynamicCriteria": {
          "enabled": true,
          "filters": {
            "type": "VIRTUAL_CONTACT",
            "eventInfo": {
              "eventName": "Boda de María y Juan",
              "grupo": "familia_novia"
            }
          }
        },
        "tags": ["boda", "familia", "novia"]
      }
    }
  }'
```

### **Caso 2: Campaña de Recordatorio por Estado**

#### **⏰ Recordatorio para Asistencia Pendiente:**
```bash
# Crear campaña solo para invitados con asistencia pendiente
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMCampaign($input: CRM_CampaignInput!) { createCRMCampaign(input: $input) { success campaign { id name type } } }",
    "variables": {
      "input": {
        "name": "Recordatorio Urgente - Asistencia Pendiente",
        "type": "WHATSAPP",
        "templateId": "template_whatsapp_urgente",
        "extendedRecipientLists": ["lista_asistencia_pendiente"],
        "settings": {
          "trackOpens": true,
          "trackClicks": true,
          "sendAt": "2025-12-14T16:00:00Z"
        },
        "whatsappConfig": {
          "templateName": "Recordatorio Urgente WhatsApp",
          "languageCode": "es"
        }
      }
    }
  }'
```

### **Caso 3: Campaña de Agradecimiento Post-Evento**

#### **🙏 Agradecimiento Después del Evento:**
```bash
# Crear campaña de agradecimiento después del evento
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "mutation CreateCRMCampaign($input: CRM_CampaignInput!) { createCRMCampaign(input: $input) { success campaign { id name type } } }",
    "variables": {
      "input": {
        "name": "Agradecimiento Post-Boda",
        "type": "EMAIL",
        "templateId": "template_agradecimiento_post_boda",
        "extendedRecipientLists": ["extended_list_boda_maria_juan"],
        "settings": {
          "trackOpens": true,
          "trackClicks": true,
          "sendAt": "2025-12-16T10:00:00Z"
        }
      }
    }
  }'
```

---

## 🔧 **CONFIGURACIÓN DE PROVEEDORES**

### **📧 Configuración SendGrid (Email):**
```json
{
  "sendgrid": {
    "apiKey": "SG.your-api-key-here",
    "senderEmail": "bodas@eventosorganizador.com",
    "senderName": "Eventos Organizador",
    "trackingEnabled": true,
    "clickTrackingEnabled": true
  }
}
```

### **📱 Configuración WhatsApp Business API:**
```json
{
  "whatsapp": {
    "accessToken": "your-access-token",
    "phoneNumberId": "your-phone-number-id",
    "businessAccountId": "your-business-account-id",
    "webhookUrl": "https://api2.eventosorganizador.com/webhook/whatsapp"
  }
}
```

### **📲 Configuración Twilio (SMS):**
```json
{
  "twilio": {
    "accountSid": "your-account-sid",
    "authToken": "your-auth-token",
    "phoneNumber": "+1234567890",
    "trackingEnabled": true
  }
}
```

---

## 📊 **DASHBOARD DE MÉTRICAS**

### **📈 Métricas en Tiempo Real:**
```bash
# Obtener dashboard completo de métricas
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "query": "query GetCRMEventDashboard($eventId: ID!) { getCRMEventMessagingStats(eventId: $eventId) { eventId eventName totalCampaigns totalMessagesSent emailSent emailOpened emailClicked whatsappSent whatsappRead smsSent lastCampaignDate } }",
    "variables": {
      "eventId": "boda_maria_juan_2025"
    }
  }'
```

### **📊 Dashboard Visual:**
```
┌─────────────────────────────────────────────────────────────┐
│                    DASHBOARD BODA MARÍA Y JUAN             │
├─────────────────────────────────────────────────────────────┤
│ 📊 RESUMEN GENERAL                                          │
│ • Total Campañas: 3                                        │
│ • Total Mensajes: 275                                      │
│ • Última Campaña: 13 Dic 2025, 09:00                      │
├─────────────────────────────────────────────────────────────┤
│ 📧 EMAIL                                                    │
│ • Enviados: 100 (100%)                                     │
│ • Entregados: 98 (98%)                                     │
│ • Abiertos: 85 (85%)                                       │
│ • Clickeados: 42 (42%)                                     │
├─────────────────────────────────────────────────────────────┤
│ 📱 WHATSAPP                                                 │
│ • Enviados: 95 (95%)                                       │
│ • Entregados: 95 (100%)                                    │
│ • Leídos: 89 (94%)                                         │
├─────────────────────────────────────────────────────────────┤
│ 📲 SMS                                                      │
│ • Enviados: 80 (80%)                                       │
│ • Entregados: 78 (98%)                                     │
│ • Clickeados: 15 (19%)                                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 🚀 **AUTOMATIZACIÓN AVANZADA**

### **⏰ Campañas Programadas Automáticas:**

#### **📅 Cronograma de Campañas:**
```json
{
  "cronograma": {
    "30_dias_antes": {
      "tipo": "email",
      "plantilla": "save_the_date",
      "objetivo": "Todos los invitados"
    },
    "15_dias_antes": {
      "tipo": "whatsapp",
      "plantilla": "recordatorio_15_dias",
      "objetivo": "Todos los invitados"
    },
    "7_dias_antes": {
      "tipo": "email",
      "plantilla": "recordatorio_7_dias",
      "objetivo": "Todos los invitados"
    },
    "3_dias_antes": {
      "tipo": "whatsapp",
      "plantilla": "recordatorio_3_dias",
      "objetivo": "Asistencia pendiente"
    },
    "1_dia_antes": {
      "tipo": "sms",
      "plantilla": "recordatorio_1_dia",
      "objetivo": "Asistencia pendiente"
    },
    "dia_del_evento": {
      "tipo": "whatsapp",
      "plantilla": "bienvenida_evento",
      "objetivo": "Asistencia confirmada"
    },
    "dia_despues": {
      "tipo": "email",
      "plantilla": "agradecimiento",
      "objetivo": "Todos los asistentes"
    }
  }
}
```

---

## 🔄 **FLUJO COMPLETO AUTOMATIZADO**

### **🤖 Automatización con N8N:**

#### **Workflow de Invitaciones Automáticas:**
```json
{
  "workflow": {
    "name": "Invitaciones Automáticas Boda",
    "triggers": [
      {
        "type": "schedule",
        "config": {
          "cron": "0 10 * * *",
          "timezone": "Europe/Madrid"
        }
      }
    ],
    "steps": [
      {
        "id": "sync_guests",
        "type": "graphql",
        "config": {
          "query": "syncCRMEventGuestsToVirtualContacts",
          "eventId": "{{eventId}}"
        }
      },
      {
        "id": "check_campaign_schedule",
        "type": "if",
        "config": {
          "condition": "{{daysUntilEvent}} <= 7"
        }
      },
      {
        "id": "create_campaign",
        "type": "graphql",
        "config": {
          "query": "createCRMCampaign",
          "template": "{{selectedTemplate}}"
        }
      },
      {
        "id": "send_campaign",
        "type": "graphql",
        "config": {
          "query": "startCRMCampaign"
        }
      },
      {
        "id": "update_engagement",
        "type": "graphql",
        "config": {
          "query": "updateCRMVirtualContactEngagement"
        }
      }
    ]
  }
}
```

---

## 📋 **CHECKLIST DE IMPLEMENTACIÓN**

### **✅ Pasos de Implementación:**

#### **Fase 1: Preparación**
- [ ] Evento creado con invitados
- [ ] Plantillas de email creadas
- [ ] Plantillas de WhatsApp creadas
- [ ] Plantillas de SMS creadas
- [ ] Proveedores configurados

#### **Fase 2: Sincronización**
- [ ] Invitados sincronizados a contactos virtuales
- [ ] Listas extendidas creadas
- [ ] Validación de datos completada

#### **Fase 3: Campañas**
- [ ] Campañas de email creadas
- [ ] Campañas de WhatsApp creadas
- [ ] Campañas de SMS creadas
- [ ] Programación de envíos configurada

#### **Fase 4: Envío**
- [ ] Campañas iniciadas
- [ ] Tracking habilitado
- [ ] Monitoreo en tiempo real

#### **Fase 5: Análisis**
- [ ] Estadísticas recopiladas
- [ ] Engagement actualizado
- [ ] Reportes generados

---

## 🎯 **BENEFICIOS DEL SISTEMA INTEGRADO**

### **✅ Ventajas del Flujo Unificado:**

#### **🚀 Eficiencia:**
- **Sincronización automática** entre eventos y CRM
- **Plantillas reutilizables** para múltiples eventos
- **Envío masivo** a través de múltiples canales
- **Tracking unificado** de todas las interacciones

#### **📊 Análisis:**
- **Métricas consolidadas** por evento
- **Engagement scoring** automático
- **Segmentación avanzada** por grupos
- **Reportes detallados** de rendimiento

#### **🎯 Personalización:**
- **Variables dinámicas** por invitado
- **Contenido adaptado** por canal
- **Timing optimizado** por tipo de mensaje
- **Segmentación inteligente** por comportamiento

#### **🔧 Automatización:**
- **Workflows programados** automáticamente
- **Respuestas automáticas** a interacciones
- **Actualización de engagement** en tiempo real
- **Limpieza automática** de datos

---

## 📞 **SOPORTE Y RECURSOS**

### **📚 Documentación Relacionada:**
- `SISTEMA-CONTACTOS-VIRTUALES.md` - Sistema de contactos virtuales
- `API_DOCUMENTATION.md` - Documentación completa de la API
- `EJEMPLOS-USO-FUNCIONALIDADES-v2.1.0.md` - Ejemplos prácticos
- `CONSULTAS_RAPIDAS_MCP.md` - Comandos rápidos

### **🔧 Scripts y Herramientas:**
- `src/scripts/syncVirtualContacts.ts` - Sincronización CLI
- `test-completo-integracion-eventos-crm.js` - Testing completo
- `optimize-eventos-crm-database.js` - Optimización de BD

### **📞 Contacto:**
- **Email:** carlos.carrillo@recargaexpress.com
- **Proyecto:** API Eventos Organizador v2.1.0

---

**🚀 ¡Sistema de invitaciones y campañas completamente integrado y documentado!**

*Documentación generada el 16 de septiembre de 2025*
*Versión del sistema: 2.1.0*
*Caso de uso: Integración completa invitaciones-campañas*
