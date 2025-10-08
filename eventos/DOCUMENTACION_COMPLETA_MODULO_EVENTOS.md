# 📚 DOCUMENTACIÓN COMPLETA - MÓDULO DE EVENTOS

**Para:** Cliente Frontend / Desarrolladores de API  
**Fecha:** 07 de Octubre 2025, 01:30  
**Versión:** 3.0 ⚠️ CON FUNCIONALIDADES FALTANTES IDENTIFICADAS

---

## 🚨 ACTUALIZACIÓN IMPORTANTE

**Se han descubierto 25+ campos que los usuarios ESTÁN usando pero NO están accesibles por GraphQL.**

📄 **Documentos complementarios CRÍTICOS:**
- **`600_PREGUNTAS_COMPLETAS_DATOS_REALES.md`** - 600+ preguntas basadas en análisis de 50+ eventos reales
- **`ANALISIS_FUNCIONALIDADES_FALTANTES_CRITICAS.md`** - Top 10 funcionalidades faltantes (26 días desarrollo)

**Campos descubiertos en producción:**
- **Invitados:** `chairs`, `chats_array`, `father`, `fecha_invitacion`, `emailId`, `pais`, `poblacion`, `passesQuantity`
- **Tareas:** `prioridad`, `tags`, `comments`, `attachments`, `tips`, `icon`, `horaActiva`, `linkages`, `spectatorView`
- **Eventos:** `temporada`, `estilo`, `tematica`, `timeZone`, `imgInvitacion`, `showChildrenGuest`
- **Mesas:** ❌ SISTEMA COMPLETO SIN API

**Este documento describe las funcionalidades ACTUALES. Para ver qué falta, revisa los documentos complementarios.**

---

## 📋 ÍNDICE

1. [Queries disponibles](#queries)
2. [Mutations disponibles](#mutations)
3. [MCP Tools para eventos](#mcp-tools)
4. [Generador de URLs](#url-generator)
5. [Permisos granulares](#permisos)
6. [300 Preguntas IA - Cobertura](#300-preguntas)
7. [Ejemplos completos](#ejemplos)
8. [Funcionalidades pendientes](#pendientes)

---

## 🔍 QUERIES DISPONIBLES {#queries}

### **1. getAllUserRelatedEventsByEmail** ⭐ PRINCIPAL
```graphql
query GetEventsByEmail {
  getAllUserRelatedEventsByEmail(
    email: "usuario@example.com"
    development: "bodasdehoy"  # Obligatorio
  ) {
    # Datos básicos
    _id
    nombre
    fecha
    tipo                    # boda, cumpleaños, bautizo, comunión, etc.
    estatus                 # pendiente, confirmado, archivado, borrado
    poblacion
    pais
    development
    
    # Usuario
    usuario_id
    usuario_nombre
    compartido_array
    detalles_compartidos_array
    
    # Datos complejos
    invitados_array {
      _id
      nombre
      correo
      telefono
      asistencia         # confirmado, pendiente, rechazado
      alergenos
      grupo_relacion     # familia, amigos, trabajo
      nombre_mesa
      puesto
      usuario_id
    }
    
    presupuesto_objeto {
      coste_estimado
      coste_final
      pagado
      currency
      categorias_array {
        nombre
        coste_estimado
        coste_final
        pagado
        gastos_array {
          nombre
          coste_final
          pagado
          estatus
          pagos_array
        }
      }
    }
    
    itinerarios_array {
      _id
      title
      tipo
      estatus
      tasks {
        _id
        fecha
        hora
        descripcion
        responsable
        duracion
        estatus
      }
    }
    
    # Otros
    planSpace
    planSpaceSelect
    mesas_array
    menus_array
    grupos_array
    
    # Permisos y roles
    user_role           # CREADOR, COMPARTIDO, INVITADO, SIN_ACCESO
    user_permissions    # Array de permisos
    invitados_count     # Total de invitados
    compartido_count    # Total de usuarios con acceso
    
    # Timestamps
    fecha_creacion
    fecha_actualizacion
  }
}
```

**Uso:**
- ✅ Devuelve TODOS los eventos del usuario (propios, compartidos, como invitado)
- ✅ Filtra automáticamente por development (aislamiento por marca)
- ✅ Incluye roles y permisos calculados
- ✅ Busca en Firebase para obtener UID y luego en MongoDB

**Roles devueltos:**
- **CREADOR:** Eventos propios (acceso completo)
- **COMPARTIDO:** Eventos compartidos por otros
- **INVITADO:** Eventos donde solo es invitado
- **SIN_ACCESO:** Eventos legacy sin permisos

---

### **2. getAllUserRelatedEventsByPhone**
```graphql
query GetEventsByPhone {
  getAllUserRelatedEventsByPhone(
    phoneNumber: "+34622440213"
    development: "bodasdehoy"
  ) {
    # Mismos campos que getAllUserRelatedEventsByEmail
    _id
    nombre
    fecha
    ...
  }
}
```

**Uso:**
- ✅ Igual que por email pero busca por teléfono
- ✅ Busca en Firebase por phone
- ✅ Busca en invitados_array.telefono

---

### **3. getEventPublic** ⭐ NUEVA
```graphql
query GetPublicEvent {
  getEventPublic(eventId: "66a9042dec5c58aa734bca44") {
    _id
    nombre
    fecha
    tipo
    poblacion
    # Sin datos privados (presupuesto, invitados)
  }
}
```

**Uso:**
- ✅ Versión pública sin autenticación
- ✅ Solo datos básicos
- ✅ Útil para páginas de compartir

---

### **4. getEventGuests** ⭐ NUEVA
```graphql
query GetGuests {
  getEventGuests(eventId: "66a9042dec5c58aa734bca44") {
    _id
    nombre
    correo
    telefono
    asistencia
    alergenos
    grupo_relacion
    nombre_mesa
    puesto
  }
}
```

**Uso:**
- ✅ Solo invitados del evento
- ✅ Más rápido si solo necesitas invitados
- ✅ Requiere permisos

---

### **5. getUserCompleteEventSummary** ⭐ MCP/IA OPTIMIZADO
```graphql
query GetEventSummary {
  getUserCompleteEventSummary(
    userIdentifier: "bodasdehoy.com@gmail.com"  # Email o phone
  ) {
    userInfo {
      identifier
      firebaseUID
      email
      phone
      userType      # FIREBASE_USER, EMAIL_ONLY, PHONE_ONLY
    }
    
    eventsSummary {
      totalEvents
      eventsByRole {
        creator       # Eventos propios
        shared        # Compartidos
        invited       # Como invitado
      }
      eventsByType {
        type          # boda, cumpleaños, etc.
        count
      }
      recentEvents {
        _id
        nombre
        tipo
        fecha
        estatus
        user_role
        canViewBudget
        canViewGuests
      }
      upcomingEvents {
        # Próximos eventos
        ...
      }
    }
    
    permissionsSummary {
      hasBudgetAccess
      hasItineraryAccess
      hasGuestAccess
      hasEditAccess
      totalPermissions
      permissionDetails {
        eventId
        eventName
        role
        permissions
        specificPermissions {
          canViewBudget
          canEditEvent
          canInviteGuests
          canViewConversations
          canEditConversations
          canViewChat
          canEditChat
          canViewDocuments
          canEditDocuments
          canManageDocuments
          canViewServices
          canEditServices
          canManageServices
          canViewAnalytics
          canExportData
          canViewItinerary
          canEditItinerary
          canManageItinerary
          canViewPlanning
          canEditPlanning
          canManagePlanning
        }
      }
    }
    
    recommendations    # Array de recomendaciones para el usuario
  }
}
```

**Uso:**
- ✅ **UNA SOLA QUERY** para obtener todo
- ✅ Optimizado para IA/MCP
- ✅ Resumen completo del usuario
- ✅ Permisos granulares por evento
- ✅ Estadísticas incluidas

---

### **6. getEventFromUserEvents** ⭐ MCP OPTIMIZADO
```graphql
query GetSpecificEvent {
  getEventFromUserEvents(
    phoneNumber: "+34622440213"
    eventId: "66a9042dec5c58aa734bca44"
  ) {
    # Mismo schema que EVT_Event
    ...
  }
}
```

**Uso:**
- ✅ Obtener UN evento específico
- ✅ Más rápido que getAllUserRelatedEvents
- ✅ Valida que el usuario tiene acceso

---

## 🔧 MUTATIONS DISPONIBLES {#mutations}

### **1. createEvent**
```graphql
mutation CreateEvent {
  createEvent(input: {
    nombre: "Mi Boda"
    tipo: "boda"
    fecha: "2025-12-25T00:00:00Z"
    poblacion: "Madrid"
    pais: "España"
    usuario_id: "firebase_uid"
    usuario_nombre: "Juan Pérez"
    color: ["#FF5733"]
  }) {
    _id
    nombre
    fecha
    tipo
  }
}
```

---

### **2. updateEventBasicInfo**
```graphql
mutation UpdateEvent {
  updateEventBasicInfo(
    eventId: "66a9042dec5c58aa734bca44"
    input: {
      nombre: "Nuevo Nombre"
      tipo: "boda"
      fecha: "2025-12-31T00:00:00Z"
      poblacion: "Barcelona"
      pais: "España"
      usuario_id: "firebase_uid"
      usuario_nombre: "Juan Pérez"
    }
  ) {
    _id
    nombre
    fecha
  }
}
```

---

### **3. shareEvent**
```graphql
mutation ShareEvent {
  shareEvent(
    eventId: "66a9042dec5c58aa734bca44"
    userId: "otro_uid_123"
    permissions: {
      canEdit: true
      canViewBudget: true
      canViewGuests: true
    }
  )
}
```

---

### **4. addGuest** ⭐ INVITADOS
```graphql
mutation AddGuest {
  addGuest(
    eventId: "66a9042dec5c58aa734bca44"
    nombre: "María García"
    correo: "maria@example.com"
    telefono: "+34600000000"
  ) {
    _id
    nombre
    correo
    telefono
  }
}
```

---

### **5. updateGuestAttendance**
```graphql
mutation UpdateAttendance {
  updateGuestAttendance(
    eventId: "66a9042dec5c58aa734bca44"
    guestId: "guest_id_123"
    asistencia: "confirmado"  # confirmado, pendiente, rechazado
  ) {
    _id
    nombre
    asistencia
  }
}
```

---

### **6. addBudgetCategory** ⭐ PRESUPUESTO
```graphql
mutation AddBudgetCategory {
  addBudgetCategory(
    eventId: "66a9042dec5c58aa734bca44"
    nombre: "Catering"
    coste_estimado: 5000.00
  ) {
    _id
    nombre
    coste_estimado
  }
}
```

---

### **7. addExpense**
```graphql
mutation AddExpense {
  addExpense(
    eventId: "66a9042dec5c58aa734bca44"
    categoryId: "category_id_123"
    nombre: "Menú por persona"
    coste_estimado: 75.00
  ) {
    _id
    nombre
    coste_estimado
  }
}
```

---

## 🤖 MCP TOOLS PARA EVENTOS {#mcp-tools}

### **Tools disponibles:**

| Tool | Descripción | Estado |
|------|-------------|--------|
| `get_event_details` | Obtener detalles completos de un evento | ✅ Disponible |
| `get_events_by_user` | Obtener todos los eventos de un usuario | ✅ Disponible |
| `create_event` | Crear nuevo evento | ✅ Disponible |
| `update_event` | Actualizar evento | ✅ Disponible |
| `add_guest` | Agregar invitado | ✅ Disponible |
| `update_guest` | Actualizar invitado | ✅ Disponible |
| `get_event_link` | Generar URL al evento | ✅ Disponible |

**Archivo:** `src/mcp/tools/eventTools.ts`

---

## 🌐 GENERADOR DE URLs {#url-generator}

### **EventUrlGenerator - Módulo completo** ✅

**Archivo:** `src/mcp/tools/eventUrlGenerator.ts`

**Secciones disponibles:**
1. ✅ **DASHBOARD** - Vista principal
2. ✅ **INVITADOS** - Gestión de invitados
3. ✅ **PRESUPUESTO** - Finanzas del evento
4. ✅ **TAREAS** - Checklist y tareas
5. ✅ **ITINERARIO** - Cronograma
6. ✅ **SERVICIOS** - Proveedores
7. ✅ **MENUS** - Menús y catering
8. ✅ **MESAS** - Distribución de mesas
9. ✅ **CHAT** - Chat del evento
10. ✅ **NOTIFICACIONES** - Alertas
11. ✅ **CONFIGURACION** - Ajustes
12. ✅ **MAPA** - Ubicaciones
13. ✅ **COMPARTIR** - Compartir con usuarios
14. ✅ **COLABORADORES** - Gestión de accesos
15. ✅ **ANALYTICS** - Estadísticas
16. ✅ **REPORTES** - Informes
17. ✅ **DOCUMENTOS** - Archivos
18. ✅ **REGALOS** - Lista de regalos

### **Ejemplos de uso:**

```typescript
import { EventUrlBuilder } from './eventUrlGenerator';

const urlBuilder = new EventUrlBuilder('bodasdehoy');

// Dashboard
urlBuilder.dashboard('66a9042dec5c58aa734bca44');
// → https://organizador.bodasdehoy.com/?event=66a9042dec5c58aa734bca44

// Invitados
urlBuilder.guests('66a9042dec5c58aa734bca44', { view: 'rsvp' });
// → https://organizador.bodasdehoy.com/invitados?event=66a9042dec5c58aa734bca44&view=rsvp

// Presupuesto
urlBuilder.budget('66a9042dec5c58aa734bca44', { view: 'categories' });
// → https://organizador.bodasdehoy.com/presupuesto?event=66a9042dec5c58aa734bca44&view=categories

// Tareas pendientes
urlBuilder.tasks('66a9042dec5c58aa734bca44', { view: 'pending', priority: 'high' });
// → https://organizador.bodasdehoy.com/tareas?event=66a9042dec5c58aa734bca44&view=pending&priority=high

// Chat con IA
urlBuilder.chat('66a9042dec5c58aa734bca44', { mode: 'ai' });
// → https://organizador.bodasdehoy.com/chat?event=66a9042dec5c58aa734bca44&mode=ai

// Analytics
urlBuilder.analytics('66a9042dec5c58aa734bca44', { view: 'guests' });
// → https://organizador.bodasdehoy.com/analytics?event=66a9042dec5c58aa734bca44&view=guests
```

### **Interpretación en lenguaje natural:** ✅

```typescript
import { interpretNaturalLanguageTarget } from './eventUrlGenerator';

// "Mostrar invitados pendientes"
interpretNaturalLanguageTarget('66a90...', 'invitados pendientes');
// → { url: '.../invitados?event=...&view=pending', description: '...' }

// "Ver presupuesto"
interpretNaturalLanguageTarget('66a90...', 'presupuesto');
// → { url: '.../presupuesto?event=...', description: '...' }

// "Tareas urgentes"
interpretNaturalLanguageTarget('66a90...', 'tareas urgentes');
// → { url: '.../tareas?event=...&priority=high', description: '...' }
```

---

## 🔒 PERMISOS GRANULARES {#permisos}

### **Sistema de permisos implementado:** ✅

**Archivo:** `src/services/enhancedEventPermissionService.ts`

### **Permisos básicos:**
- ✅ `canViewBudget` - Ver presupuesto
- ✅ `canEditEvent` - Editar evento
- ✅ `canInviteGuests` - Invitar personas

### **Permisos granulares completos:** ✅

#### **Conversaciones:**
- ✅ `canViewConversations` - Ver conversaciones
- ✅ `canEditConversations` - Editar conversaciones

#### **Chat:**
- ✅ `canViewChat` - Ver chat
- ✅ `canEditChat` - Escribir en chat

#### **Documentos:**
- ✅ `canViewDocuments` - Ver documentos
- ✅ `canEditDocuments` - Editar documentos
- ✅ `canManageDocuments` - Gestionar (subir/eliminar)

#### **Servicios:**
- ✅ `canViewServices` - Ver servicios
- ✅ `canEditServices` - Editar servicios
- ✅ `canManageServices` - Gestionar servicios

#### **Analytics:**
- ✅ `canViewAnalytics` - Ver estadísticas
- ✅ `canExportData` - Exportar datos

#### **Itinerario:**
- ✅ `canViewItinerary` - Ver itinerario
- ✅ `canEditItinerary` - Editar itinerario
- ✅ `canManageItinerary` - Gestionar itinerario

#### **Planificación:**
- ✅ `canViewPlanning` - Ver planificación
- ✅ `canEditPlanning` - Editar planificación
- ✅ `canManagePlanning` - Gestionar planificación

**Total:** 18 permisos granulares + 3 básicos = **21 permisos**

---

## 📊 300 PREGUNTAS IA - COBERTURA {#300-preguntas}

### **Documento:** `docs_backup_20250929/ANALISIS_300_PREGUNTAS_IA.md`

### **Resumen de cobertura:**

| Categoría | Total Preguntas | Implementado | Pendiente | % Completo |
|-----------|----------------|--------------|-----------|------------|
| **Invitados y confirmaciones** | 50 | 45 | 5 | 90% |
| **Menús y alergias** | 40 | 30 | 10 | 75% |
| **Asientos y mesas** | 35 | 21 | 14 | 60% |
| **Tareas y servicios** | 45 | 32 | 13 | 71% |
| **Itinerario del evento** | 35 | 35 | 0 | 100% |
| **Presupuesto y pagos** | 50 | 30 | 20 | 60% |
| **Servicios contratados** | 45 | 18 | 27 | 40% |
| **TOTAL** | **300** | **211** | **89** | **70%** |

### **Funcionalidades implementadas:**

✅ **100% Implementado (35 preguntas):**
- Itinerario y cronograma completo
- Timeline de eventos
- Gestión de actividades
- Horarios y responsables

✅ **90% Implementado (45 preguntas):**
- Invitados y confirmaciones
- RSVP system
- Gestión de grupos
- Búsqueda de invitados
- Análisis de confirmaciones

✅ **75% Implementado (30 preguntas):**
- Menús y alergias
- Restricciones alimentarias
- Conteo por tipo de menú

✅ **71% Implementado (32 preguntas):**
- Tareas y checklist
- Estado de tareas
- Asignación de responsables

✅ **60% Implementado:**
- Presupuesto y pagos (30/50)
- Asientos y mesas (21/35)

⚠️ **40% Implementado:**
- Servicios contratados (18/45)
- Necesita expansión de CRM

---

## 📝 EJEMPLOS COMPLETOS {#ejemplos}

### **Ejemplo 1: Obtener eventos del usuario con invitados**

```graphql
query GetMyEventsWithGuests {
  getAllUserRelatedEventsByEmail(
    email: "bodasdehoy.com@gmail.com"
    development: "bodasdehoy"
  ) {
    _id
    nombre
    fecha
    tipo
    user_role
    invitados_array {
      nombre
      correo
      asistencia
      alergenos
    }
    invitados_count
  }
}
```

**Respuesta:**
```json
{
  "data": {
    "getAllUserRelatedEventsByEmail": [
      {
        "_id": "66a9042dec5c58aa734bca44",
        "nombre": "Boda Isabel & Raúl",
        "fecha": "2025-12-30T00:00:00.000Z",
        "tipo": "boda",
        "user_role": "CREADOR",
        "invitados_array": [
          {
            "nombre": "María López",
            "correo": "maria@example.com",
            "asistencia": "confirmado",
            "alergenos": ["gluten", "lactosa"]
          },
          ...
        ],
        "invitados_count": 150
      }
    ]
  }
}
```

---

### **Ejemplo 2: Obtener presupuesto del evento**

```graphql
query GetEventBudget {
  getAllUserRelatedEventsByEmail(
    email: "bodasdehoy.com@gmail.com"
    development: "bodasdehoy"
  ) {
    _id
    nombre
    presupuesto_objeto {
      coste_estimado
      coste_final
      pagado
      currency
      categorias_array {
        nombre
        coste_estimado
        coste_final
        pagado
        gastos_array {
          nombre
          coste_final
          pagado
          estatus
        }
      }
    }
  }
}
```

---

### **Ejemplo 3: Generar URL para sección específica (MCP/IA)**

```typescript
// En tu código MCP/IA
import { EventUrlBuilder } from './eventUrlGenerator';

const urlBuilder = new EventUrlBuilder('bodasdehoy');

// Usuario pregunta: "Muéstrame los invitados pendientes de mi boda"
const url = urlBuilder.guests('66a9042dec5c58aa734bca44', {
  view: 'pending'
});

// Devolver al usuario:
// "Aquí está el enlace a tus invitados pendientes: {url}"
```

---

### **Ejemplo 4: Resumen completo para IA**

```graphql
query AIEventSummary {
  getUserCompleteEventSummary(
    userIdentifier: "bodasdehoy.com@gmail.com"
  ) {
    userInfo {
      firebaseUID
      email
    }
    eventsSummary {
      totalEvents
      eventsByRole {
        creator
        shared
        invited
      }
      recentEvents {
        _id
        nombre
        fecha
        tipo
        user_role
      }
    }
    permissionsSummary {
      hasBudgetAccess
      hasGuestAccess
      totalPermissions
    }
    recommendations
  }
}
```

**Uso en IA:**
```
Usuario: "¿Cuántos eventos tengo?"
IA consulta: getUserCompleteEventSummary
IA responde: "Tienes 21 eventos en total: 13 como creador, 7 compartidos contigo, y 1 como invitado."
```

---

## ❌ FUNCIONALIDADES PENDIENTES {#pendientes}

### **Del análisis de 300 preguntas (30% faltante):**

#### **1. Generación y reportes (89 preguntas pendientes):**
- ❌ Generar códigos QR para invitados
- ❌ Generar etiquetas de mesa
- ❌ Exportar PDF de presupuesto
- ❌ Exportar CSV de invitados
- ❌ Reportes de confirmaciones
- ❌ Análisis financiero avanzado

#### **2. Layout y distribución (14 preguntas pendientes):**
- ❌ Vista visual de mesas
- ❌ Drag & drop de invitados a mesas
- ❌ Optimización automática de distribución
- ❌ Generación de planos

#### **3. Servicios contratados (27 preguntas pendientes):**
- ❌ Gestión avanzada de vendors
- ❌ Contratos digitales
- ❌ Pagos a proveedores
- ❌ Tracking de servicios
- ❌ Integración con CRM de proveedores

#### **4. Otras funcionalidades:**
- ❌ Notificaciones automáticas por email/SMS
- ❌ Webhooks para integraciones
- ❌ Export masivo de datos
- ❌ Templates de eventos
- ❌ Duplicación de eventos
- ❌ Versionado de cambios

---

## 🎯 FUNCIONALIDADES IMPLEMENTADAS Y LISTAS

### **✅ Completamente funcional:**

1. **Gestión de eventos:**
   - Crear, actualizar eventos
   - Compartir con usuarios
   - Roles y permisos
   - Filtrado por development

2. **Invitados:**
   - Agregar, editar invitados
   - Actualizar asistencia (RSVP)
   - Alergias y restricciones
   - Grupos y mesas
   - Búsqueda por email/teléfono

3. **Presupuesto:**
   - Categorías de gastos
   - Gastos individuales
   - Pagos y tracking
   - Cálculo automático de totales
   - Proporción por categoría

4. **Itinerario:**
   - Cronograma completo
   - Tareas con responsables
   - Estado de actividades
   - Horarios y duraciones

5. **Permisos:**
   - 21 permisos granulares
   - Roles jerárquicos
   - Validación automática
   - Acceso basado en rol

6. **URLs dinámicas:**
   - Generador completo
   - 18 secciones soportadas
   - Interpretación lenguaje natural
   - Parámetros personalizables

7. **MCP Integration:**
   - 7 tools disponibles
   - Optimizado para IA
   - Query unificada para resumen completo

---

## 🚀 GUÍA RÁPIDA PARA FRONTEND

### **Query principal para listar eventos:**
```graphql
query ListEvents($email: String!, $dev: String!) {
  getAllUserRelatedEventsByEmail(email: $email, development: $dev) {
    _id
    nombre
    fecha
    tipo
    estatus
    user_role
    invitados_count
    presupuesto_objeto {
      coste_final
      pagado
    }
  }
}
```

### **Query para detalles de un evento:**
```graphql
query EventDetails($email: String!, $dev: String!) {
  getAllUserRelatedEventsByEmail(email: $email, development: $dev) {
    _id
    nombre
    fecha
    tipo
    estatus
    poblacion
    pais
    
    # Invitados completos
    invitados_array {
      nombre
      correo
      telefono
      asistencia
      alergenos
      nombre_mesa
    }
    
    # Presupuesto completo
    presupuesto_objeto {
      coste_estimado
      coste_final
      pagado
      categorias_array {
        nombre
        coste_final
        pagado
      }
    }
    
    # Itinerarios
    itinerarios_array {
      title
      tasks {
        descripcion
        fecha
        estatus
      }
    }
    
    # Permisos
    user_role
    user_permissions
  }
}
```

---

## 📊 ESTRUCTURA DE DATOS COMPLETA

### **Evento (EVT_Event):**
```typescript
{
  // Identificación
  _id: "66a9042dec5c58aa734bca44",
  development: "bodasdehoy",
  
  // Básico
  nombre: "Mi Boda",
  fecha: "2025-12-25T00:00:00Z",
  tipo: "boda",  // boda, cumpleaños, bautizo, comunión, babyshower, graduación, aniversario
  estatus: "pendiente",  // pendiente, confirmado, archivado, borrado
  poblacion: "Madrid",
  pais: "España",
  color: ["#FF5733"],
  
  // Usuario
  usuario_id: "firebase_uid",
  usuario_nombre: "Juan Pérez",
  compartido_array: ["uid1", "uid2"],
  detalles_compartidos_array: [{...}],
  
  // Invitados
  invitados_array: [
    {
      _id: "inv1",
      nombre: "María López",
      correo: "maria@example.com",
      telefono: "+34600000000",
      asistencia: "confirmado",  // confirmado, pendiente, rechazado
      alergenos: ["gluten", "lactosa"],
      grupo_relacion: "familia",  // familia, amigos, trabajo
      nombre_mesa: "Mesa 1",
      puesto: 1,
      usuario_id: "uid_si_es_usuario"
    }
  ],
  invitados_count: 150,
  
  // Presupuesto
  presupuesto_objeto: {
    coste_estimado: 20000.00,
    coste_final: 18500.00,
    pagado: 12000.00,
    currency: "EUR",
    totalStimatedGuests: {
      adults: 100,
      children: 20
    },
    categorias_array: [
      {
        _id: "cat1",
        nombre: "Catering",
        coste_estimado: 10000.00,
        coste_final: 9500.00,
        pagado: 5000.00,
        gastos_array: [
          {
            _id: "gasto1",
            nombre: "Menú por persona",
            coste_estimado: 75.00,
            coste_final: 70.00,
            pagado: 70.00,
            estatus: true,
            pagos_array: [{...}]
          }
        ]
      }
    ]
  },
  
  // Itinerarios
  itinerarios_array: [
    {
      _id: "itin1",
      title: "Día de la boda",
      tipo: "ceremonia",
      estatus: true,
      tasks: [
        {
          _id: "task1",
          fecha: "2025-12-25",
          hora: "18:00",
          descripcion: "Ceremonia religiosa",
          responsable: ["uid1", "uid2"],
          duracion: 60,
          estatus: false
        }
      ]
    }
  ],
  
  // Mesas y menús
  mesas_array: [{...}],
  menus_array: [
    {
      nombre_menu: "adultos",
      _id: "menu1"
    }
  ],
  
  // Otros
  planSpace: [{...}],
  planSpaceSelect: "plan_id",
  grupos_array: ["familia", "amigos"],
  
  // Permisos calculados
  user_role: "CREADOR",
  user_permissions: ["FULL_ACCESS"],
  
  // Timestamps
  fecha_creacion: "2025-01-15T10:00:00Z",
  fecha_actualizacion: "2025-10-06T22:00:00Z"
}
```

---

## 🔥 FUNCIONALIDADES DISPONIBLES PERO NO APLICADAS

### **Del análisis encontré:**

#### **1. EventUrlGenerator** ✅ COMPLETO
**Estado:** Implementado pero posiblemente no usado en frontend

**Funcionalidades:**
- Generación de URLs para 18 secciones
- Interpretación de lenguaje natural
- Parámetros personalizables
- Validación con Zod

**Uso potencial:**
```typescript
// IA puede generar enlaces directos
"¿Cómo veo mis invitados?" 
→ IA: "Aquí está el enlace: {url_invitados}"
```

---

#### **2. Permisos granulares (21 permisos)** ✅ IMPLEMENTADO
**Estado:** Schema definido, pero puede que frontend no los use todos

**Permisos disponibles pero posiblemente no aplicados:**
- `canViewConversations` / `canEditConversations`
- `canViewDocuments` / `canEditDocuments` / `canManageDocuments`
- `canViewServices` / `canEditServices` / `canManageServices`
- `canViewAnalytics` / `canExportData`
- `canViewItinerary` / `canEditItinerary` / `canManageItinerary`
- `canViewPlanning` / `canEditPlanning` / `canManagePlanning`

**Recomendación:** Frontend debería verificar estos permisos antes de mostrar opciones.

---

#### **3. getUserCompleteEventSummary** ✅ DISPONIBLE
**Estado:** Query poderosa implementada pero posiblemente no usada

**Ventaja:**
- **UNA SOLA QUERY** en lugar de múltiples
- Incluye resumen completo
- Estadísticas calculadas
- Permisos por evento
- Recomendaciones

**Ejemplo de uso:**
```typescript
// En lugar de hacer 5 queries separadas:
// 1. getAllUserRelatedEventsByEmail
// 2. Contar eventos
// 3. Calcular estadísticas
// 4. Verificar permisos
// 5. Generar recomendaciones

// Hacer UNA SOLA:
getUserCompleteEventSummary(userIdentifier: email)
```

---

## 🎯 RECOMENDACIONES PARA FRONTEND

### **1. Usar queries optimizadas:**
- ✅ `getUserCompleteEventSummary` para dashboard
- ✅ `getAllUserRelatedEventsByEmail` para listados
- ✅ `getEventGuests` para solo invitados

### **2. Implementar EventUrlGenerator:**
```typescript
// Cuando usuario click en "Ver invitados"
const url = eventUrlBuilder.guests(eventId, { view: 'rsvp' });
router.push(url);
```

### **3. Validar permisos granulares:**
```typescript
// Antes de mostrar botón "Exportar"
if (event.user_permissions.includes('canExportData')) {
  showExportButton();
}
```

### **4. Aprovechar filtros de URL:**
```typescript
// Soporte para URLs con parámetros
// /invitados?event=123&view=pending&filter=family
```

---

## 📚 DOCUMENTOS RELACIONADOS

1. **ANALISIS_300_PREGUNTAS_IA.md** - Análisis de cobertura completo
2. **eventUrlGenerator.ts** - Generador de URLs
3. **eventTools.ts** - MCP tools disponibles
4. **enhancedEventPermissionService.ts** - Sistema de permisos
5. **event.ts** - Schema y resolvers completos

---

## ✅ CONCLUSIÓN

**Módulo de eventos:**
- ✅ 70% de funcionalidades implementadas (211/300 preguntas)
- ✅ Queries potentes disponibles
- ✅ MCP tools completos
- ✅ Generador de URLs implementado
- ✅ 21 permisos granulares
- ✅ Sistema de roles funcionando

**Pendiente (30%):**
- Generación de reportes PDF/CSV
- Layout visual de mesas
- Servicios contratados avanzados
- Webhooks y notificaciones automáticas

**Listo para usar:**
✅ Todo lo core está implementado y funcionando
✅ Frontend puede desarrollar con la API actual
✅ MCPs disponibles para IA

---

**¿Necesitas detalles de alguna funcionalidad específica?** 🚀

