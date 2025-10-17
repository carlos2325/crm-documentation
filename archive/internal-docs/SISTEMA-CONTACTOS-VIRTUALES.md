# 🔗 Sistema de Contactos Virtuales - Documentación Completa

## 📋 **RESUMEN EJECUTIVO**

El **Sistema de Contactos Virtuales** permite que los invitados de eventos sean tratados como contactos CRM para campañas de marketing, **sin migrar los datos originales**. Utiliza un sistema de sincronización bidireccional que mantiene la integridad de los datos.

### **✅ BENEFICIOS CLAVE:**
- **Sin migración**: Los invitados permanecen en sus eventos originales
- **Sincronización automática**: Cambios en invitados se reflejan en contactos virtuales
- **Campañas unificadas**: Invitados pueden recibir emails, WhatsApp y SMS
- **Listas mixtas**: Combinar contactos CRM + invitados virtuales
- **Integridad garantizada**: Sistema robusto de validación y reparación

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **1. MODELO DE DATOS**

#### **Contacto Virtual (`VirtualContact`)**
```typescript
interface IVirtualContact {
  // Información básica (sincronizada)
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  
  // Referencias al sistema original
  source: {
    originalEventId: ObjectId;    // Referencia al evento
    originalGuestId: ObjectId;    // Referencia al invitado
    syncStatus: 'synced' | 'pending' | 'error';
  };
  
  // Información del evento
  eventInfo: {
    eventName: string;
    eventType: string;
    groupRelation: string;
    asistencia: 'pendiente' | 'confirmado' | 'rechazado';
    // ... más campos
  };
  
  // Para campañas (como Contact normal)
  communication: {
    emailStatus: 'active' | 'bounced';
    whatsappStatus: 'active' | 'blocked';
    smsStatus: 'active' | 'blocked';
    preferredChannel: 'email' | 'whatsapp' | 'sms';
  };
  
  // Engagement tracking
  engagement: {
    totalEmailsSent: number;
    totalEmailsOpened: number;
    totalWhatsAppSent: number;
    engagementScore: number; // 0-100
  };
}
```

#### **Lista Extendida (`ExtendedContactList`)**
```typescript
interface IExtendedContactList {
  // Contactos normales del CRM
  contactIds: ObjectId[];
  totalContacts: number;
  
  // Contactos virtuales de eventos
  virtualContactIds: ObjectId[];
  totalVirtualContacts: number;
  
  // Total combinado
  totalMembers: number; // totalContacts + totalVirtualContacts
  
  // Criterios dinámicos extendidos
  dynamicCriteria?: {
    enabled: boolean;
    filters: {
      contactFilters?: { tags: string[]; status: string[]; ... };
      virtualContactFilters?: { eventType: string[]; asistencia: string[]; ... };
    };
  };
}
```

### **2. SERVICIOS PRINCIPALES**

#### **VirtualContactSyncService**
- **Sincronización**: Invitados → Contactos Virtuales
- **Sincronización inversa**: Contactos Virtuales → Invitados
- **Limpieza**: Eliminar contactos huérfanos
- **Validación**: Verificar integridad de datos

#### **ExtendedContactListService**
- **Gestión de listas mixtas**: Contactos + Invitados Virtuales
- **Listas dinámicas**: Actualización automática por criterios
- **Estadísticas**: Métricas de listas y miembros

---

## 🚀 **INSTALACIÓN Y CONFIGURACIÓN**

### **1. Archivos Creados**
```
src/db/models/crm/
├── VirtualContact.ts              # Modelo de contacto virtual
└── ExtendedContactList.ts         # Modelo de lista extendida

src/services/
├── VirtualContactSyncService.ts   # Servicio de sincronización
└── ExtendedContactListService.ts  # Servicio de listas extendidas

src/graphql/typeDefs/crm/
├── virtualContact.ts              # Types GraphQL para contactos virtuales
└── extendedContactList.ts         # Types GraphQL para listas extendidas

src/graphql/resolvers/crm/
├── virtualContact.ts              # Resolvers para contactos virtuales
└── extendedContactList.ts         # Resolvers para listas extendidas

src/scripts/
└── syncVirtualContacts.ts         # Comando CLI para sincronización
```

### **2. Modificaciones Existentes**
- **Campaign.ts**: Agregado `extendedRecipientLists` para listas mixtas
- **campaign.ts (GraphQL)**: Agregado soporte para listas extendidas

### **3. Configuración de Base de Datos**
```bash
# Las colecciones se crean automáticamente:
# - virtual_contacts
# - extended_contact_lists
```

---

## 📖 **GUÍA DE USO**

### **1. Sincronización Inicial**

#### **Comando CLI**
```bash
# Sincronizar todos los eventos de un desarrollo
npm run sync-virtual-contacts sync-development --development "mi-desarrollo"

# Sincronizar eventos específicos
npm run sync-virtual-contacts sync-event --event-ids "60f7b3b3b3b3b3b3b3b3b3b3,60f7b3b3b3b3b3b3b3b3b3b4"

# Sincronizar con limpieza y estadísticas
npm run sync-virtual-contacts sync-all --development "mi-desarrollo" --cleanup --stats
```

#### **Programáticamente**
```typescript
import { virtualContactSyncService } from './src/services/VirtualContactSyncService';

// Sincronizar evento específico
const result = await virtualContactSyncService.syncEventGuestsToVirtualContacts(
  '60f7b3b3b3b3b3b3b3b3b3b3',
  { development: 'mi-desarrollo' }
);

// Sincronizar todos los eventos
const result = await virtualContactSyncService.syncAllEventGuests({
  development: 'mi-desarrollo',
  batchSize: 100,
  forceUpdate: false
});
```

### **2. Gestión de Listas Extendidas**

#### **Crear Lista Mixta**
```typescript
import { extendedContactListService } from './src/services/ExtendedContactListService';

// Crear lista normal
const list = await extendedContactListService.createExtendedContactList(
  'Lista Mixta Evento',
  'Contactos CRM + Invitados del evento',
  {
    development: 'mi-desarrollo',
    createdBy: 'user-uid'
  }
);

// Agregar contactos normales
await list.addContacts(['60f7b3b3b3b3b3b3b3b3b3b3', '60f7b3b3b3b3b3b3b3b3b3b4']);

// Agregar contactos virtuales
await list.addVirtualContacts(['60f7b3b3b3b3b3b3b3b3b3b5', '60f7b3b3b3b3b3b3b3b3b3b6']);
```

#### **Crear Lista Dinámica**
```typescript
// Lista que se actualiza automáticamente
const dynamicList = await extendedContactListService.createDynamicExtendedContactList(
  'Invitados Confirmados',
  'Todos los invitados que han confirmado asistencia',
  {
    virtualContactFilters: {
      asistencia: ['confirmado'],
      eventType: ['boda', 'cumpleanos']
    }
  },
  {
    development: 'mi-desarrollo',
    createdBy: 'user-uid'
  }
);
```

### **3. Campañas con Listas Mixtas**

#### **GraphQL Mutation**
```graphql
mutation CreateCampaignWithMixedLists {
  createCRMCampaign(input: {
    name: "Campaña Mixta"
    type: EMAIL
    templateId: "template-id"
    recipientLists: ["60f7b3b3b3b3b3b3b3b3b3b3"]        # Lista normal
    extendedRecipientLists: ["60f7b3b3b3b3b3b3b3b3b3b4"] # Lista extendida
    settings: {
      sendImmediately: false
      trackOpens: true
      trackClicks: true
    }
  }) {
    success
    campaign {
      id
      name
      totalRecipients
    }
  }
}
```

#### **Programáticamente**
```typescript
import { Campaign } from './src/db/models/crm/Campaign';

const campaign = new Campaign({
  name: 'Campaña Mixta',
  type: 'email',
  templateId: 'template-id',
  recipientLists: ['60f7b3b3b3b3b3b3b3b3b3b3'],        // Lista normal
  extendedRecipientLists: ['60f7b3b3b3b3b3b3b3b3b3b4'], // Lista extendida
  // ... más configuración
});

await campaign.save();
```

---

## 🔧 **OPERACIONES DE MANTENIMIENTO**

### **1. Sincronización Automática**

#### **Webhook de Eventos** (Recomendado)
```typescript
// En el webhook que actualiza invitados
import { virtualContactSyncService } from './src/services/VirtualContactSyncService';

app.post('/webhook/event-updated', async (req, res) => {
  const { eventId } = req.body;
  
  // Sincronizar invitados actualizados
  await virtualContactSyncService.syncEventGuestsToVirtualContacts(eventId, {
    development: req.user.development,
    forceUpdate: true
  });
  
  res.json({ success: true });
});
```

#### **Cron Job** (Alternativo)
```typescript
// Ejecutar cada hora
import { virtualContactSyncService } from './src/services/VirtualContactSyncService';

cron.schedule('0 * * * *', async () => {
  console.log('🔄 Ejecutando sincronización automática...');
  
  const result = await virtualContactSyncService.syncAllEventGuests({
    batchSize: 100,
    forceUpdate: false
  });
  
  console.log(`✅ Sincronización completada: ${result.created} creados, ${result.updated} actualizados`);
});
```

### **2. Limpieza y Validación**

#### **Comandos CLI**
```bash
# Limpiar contactos huérfanos
npm run sync-virtual-contacts cleanup --development "mi-desarrollo"

# Validar integridad
npm run sync-virtual-contacts validate

# Reparar totales de listas
npm run sync-virtual-contacts repair --development "mi-desarrollo"

# Mostrar estadísticas
npm run sync-virtual-contacts stats --development "mi-desarrollo"
```

#### **Programáticamente**
```typescript
// Limpiar contactos huérfanos
const cleanupResult = await virtualContactSyncService.cleanupOrphanedVirtualContacts();

// Validar integridad
const validationResult = await virtualContactSyncService.validateSyncIntegrity();

// Reparar listas
const repairResult = await extendedContactListService.repairListTotals('mi-desarrollo');
```

### **3. Monitoreo**

#### **Métricas Importantes**
- **Tasa de sincronización**: Contactos virtuales / Invitados totales
- **Errores de sincronización**: Contactos con `syncStatus: 'error'`
- **Contactos huérfanos**: Contactos virtuales sin invitado original
- **Engagement promedio**: Score de engagement de contactos virtuales

#### **Alertas Recomendadas**
```typescript
// Alertar si hay muchos errores de sincronización
const stats = await virtualContactSyncService.getSyncStats();
if (stats.syncErrors > stats.totalVirtualContacts * 0.05) {
  // Enviar alerta
  console.warn('⚠️ Alta tasa de errores de sincronización');
}

// Alertar si hay contactos huérfanos
const orphanedCount = await VirtualContact.countDocuments({
  'sync.syncStatus': 'error'
});
if (orphanedCount > 100) {
  console.warn('⚠️ Muchos contactos virtuales huérfanos');
}
```

---

## 📊 **QUERIES GRAPHQL DISPONIBLES**

### **Contactos Virtuales**
```graphql
# Obtener contactos virtuales
query GetVirtualContacts {
  getCRMVirtualContacts(
    filters: {
      eventType: ["boda"]
      asistencia: ["confirmado"]
      engagementScore: { min: 50, max: 100 }
    }
    pagination: { page: 1, limit: 20 }
  ) {
    success
    virtualContacts {
      id
      firstName
      lastName
      email
      eventInfo {
        eventName
        eventType
        asistencia
      }
      engagement {
        engagementScore
        totalEmailsOpened
      }
    }
  }
}

# Buscar contactos virtuales
query SearchVirtualContacts {
  searchCRMVirtualContacts(query: "Juan", limit: 10) {
    id
    fullName
    eventInfo {
      eventName
    }
  }
}
```

### **Listas Extendidas**
```graphql
# Obtener listas extendidas
query GetExtendedLists {
  getCRMExtendedContactLists(
    filters: { isDynamic: true }
    pagination: { page: 1, limit: 20 }
  ) {
    success
    extendedContactLists {
      id
      name
      totalMembers
      totalContacts
      totalVirtualContacts
      isDynamic
    }
  }
}

# Crear lista extendida
mutation CreateExtendedList {
  createCRMExtendedContactList(input: {
    name: "Lista Mixta"
    description: "Contactos + Invitados"
    tags: ["evento", "marketing"]
  }) {
    success
    extendedContactList {
      id
      name
      totalMembers
    }
  }
}
```

---

## ⚠️ **CONSIDERACIONES IMPORTANTES**

### **1. Rendimiento**
- **Sincronización masiva**: Usar `batchSize` para controlar carga
- **Índices**: El sistema crea índices automáticamente para optimizar consultas
- **Caché**: Considerar caché para listas dinámicas grandes

### **2. Integridad de Datos**
- **Sincronización bidireccional**: Cambios en invitados se reflejan en contactos virtuales
- **Validación automática**: El sistema valida integridad en cada operación
- **Limpieza periódica**: Ejecutar limpieza de contactos huérfanos regularmente

### **3. Escalabilidad**
- **Desarrollo específico**: Todas las operaciones están limitadas por desarrollo
- **Paginación**: Todas las consultas soportan paginación
- **Filtros avanzados**: Sistema de filtros flexible para consultas específicas

### **4. Seguridad**
- **Autenticación**: Todas las operaciones requieren autenticación
- **Autorización**: Acceso limitado por desarrollo del usuario
- **Validación**: Validación estricta de todos los inputs

---

## 🆘 **SOLUCIÓN DE PROBLEMAS**

### **Problemas Comunes**

#### **1. Contactos Virtuales No Se Sincronizan**
```bash
# Verificar estado de sincronización
npm run sync-virtual-contacts stats --development "mi-desarrollo"

# Forzar sincronización
npm run sync-virtual-contacts sync-development --development "mi-desarrollo" --force-update
```

#### **2. Listas Extendidas con Totales Incorrectos**
```bash
# Reparar totales
npm run sync-virtual-contacts repair --development "mi-desarrollo"
```

#### **3. Contactos Virtuales Huérfanos**
```bash
# Limpiar contactos huérfanos
npm run sync-virtual-contacts cleanup --development "mi-desarrollo"
```

#### **4. Errores de Sincronización**
```bash
# Validar integridad
npm run sync-virtual-contacts validate

# Ver logs detallados
npm run sync-virtual-contacts sync-development --development "mi-desarrollo" --stats
```

### **Logs y Debugging**
- **Logs detallados**: Todos los servicios incluyen logs detallados
- **Estados de sincronización**: `syncStatus` indica el estado de cada contacto
- **Errores específicos**: `syncErrors` array contiene errores detallados

---

## 🎯 **PRÓXIMOS PASOS**

### **Fase 2: Editor de Emails Profesional**
- Editor drag & drop para emails
- Templates profesionales
- Variables dinámicas

### **Fase 3: Automatización Avanzada**
- Workflows automáticos
- Triggers por comportamiento
- Flujos específicos para eventos

### **Fase 4: Analytics Avanzados**
- Dashboard en tiempo real
- Métricas por canal
- Reportes automáticos

---

## 📞 **SOPORTE**

Para soporte técnico o preguntas sobre el sistema:
- **Documentación**: Este archivo y comentarios en el código
- **Logs**: Revisar logs de la aplicación para errores específicos
- **Comandos CLI**: Usar comandos de diagnóstico incluidos

---

**✅ Sistema de Contactos Virtuales - Implementado y Listo para Producción**


