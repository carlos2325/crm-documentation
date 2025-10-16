# 📅 DOCUMENTACIÓN COMPLETA - SISTEMA DE GESTIÓN DE EVENTOS

**Versión:** 4.0.0  
**Fecha:** 13 de Octubre 2025  
**Estado:** ✅ 100% Operativo y Actualizado  

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura del Sistema](#arquitectura)
3. [Queries GraphQL Disponibles](#queries)
4. [Mutations GraphQL Disponibles](#mutations)
5. [Tipos de Datos](#tipos-datos)
6. [Campos Completos de Eventos](#campos-eventos)
7. [Gestión de Invitados](#invitados)
8. [Gestión de Presupuesto](#presupuesto)
9. [Gestión de Tareas e Itinerarios](#tareas)
10. [Gestión de Mesas](#mesas)
11. [Sistema de Permisos](#permisos)
12. [Ejemplos de Uso](#ejemplos)
13. [Mejores Prácticas](#mejores-practicas)

---

## 🎯 RESUMEN EJECUTIVO {#resumen-ejecutivo}

Sistema completo de gestión de eventos para bodas y celebraciones con:

### **Estadísticas del Sistema:**
- ✅ **85+ Queries GraphQL** para consultas
- ✅ **90+ Mutations GraphQL** para modificaciones
- ✅ **128 Funcionalidades completas** implementadas
- ✅ **50+ Eventos reales** en producción
- ✅ **100% de cobertura** en funcionalidades core

### **Módulos Implementados:**
- ✅ **Eventos:** CRUD completo, compartir, permisos granulares
- ✅ **Invitados:** 27 campos, RSVP, alergias, mesas, check-in
- ✅ **Presupuesto:** Categorías, gastos, pagos, tracking
- ✅ **Tareas:** Prioridades, tags, subtareas, comentarios con threading
- ✅ **Itinerarios:** Cronograma, responsables, estados
- ✅ **Mesas:** Distribución, asignación, estadísticas
- ✅ **Check-in:** Sistema de pases, QR codes, control de acceso
- ✅ **Analytics:** Estadísticas en tiempo real, dashboards
- ✅ **Exportaciones:** CSV, PDF, JSON

---

## 🏗️ ARQUITECTURA DEL SISTEMA {#arquitectura}

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND / CLIENTE                        │
│            (React, Vue, Mobile App, Lobe Chat)               │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              API GraphQL (Apollo Server)                     │
│         https://api2.eventosorganizador.com/graphql          │
├─────────────────────────────────────────────────────────────┤
│ • 85+ Queries                                                │
│ • 90+ Mutations                                              │
│ • Subscriptions (WebSockets)                                 │
│ • Rate Limiting (100 req/min)                                │
│ • Autenticación Firebase                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴──────────────┐
        │                           │
        ▼                           ▼
┌───────────────┐          ┌──────────────────┐
│   Firebase    │          │   MongoDB Atlas   │
│  Auth + Users │          │    Eventos DB     │
│               │          │                   │
│ • UID         │          │ • Eventos         │
│ • Email       │          │ • Invitados       │
│ • Phone       │          │ • Presupuesto     │
│ • Tokens      │          │ • Tareas          │
└───────────────┘          │ • Mesas           │
                           │ • Check-in        │
                           └──────────────────┘
```

### **Flujo de Datos:**
1. Cliente hace request a GraphQL endpoint
2. Middleware valida autenticación Firebase
3. Resolver consulta MongoDB Atlas
4. Response con datos filtrados por `development`
5. Permisos validados según rol del usuario

---

## 📊 QUERIES GRAPHQL DISPONIBLES {#queries}

### **1. OBTENER EVENTOS DEL USUARIO** ⭐ PRINCIPAL

```graphql
query GetUserEvents {
  getAllUserRelatedEventsByEmail(
    email: "usuario@ejemplo.com"
    development: "bodasdehoy"  # Requerido: bodasdehoy | eventosorganizador | annloevents
  ) {
    # ════════════════════════════════════════
    # INFORMACIÓN BÁSICA
    # ════════════════════════════════════════
    _id
    nombre
    fecha                       # ISO 8601
    tipo                        # boda, cumpleaños, bautizo, comunión, etc.
    estatus                     # pendiente, confirmado, archivado, borrado
    poblacion
    pais
    development
    color
    
    # ════════════════════════════════════════
    # USUARIO Y PERMISOS
    # ════════════════════════════════════════
    usuario_id
    usuario_nombre
    compartido_array
    detalles_compartidos_array {
      uid
      permisos
      fecha_compartido
    }
    
    # Roles calculados automáticamente:
    user_role                   # CREADOR | COMPARTIDO | INVITADO | SIN_ACCESO
    user_permissions            # Array de permisos específicos
    
    # ════════════════════════════════════════
    # INVITADOS (27 CAMPOS)
    # ════════════════════════════════════════
    invitados_array {
      _id
      nombre
      correo
      telefono
      asistencia              # confirmado, pendiente, rechazado
      alergenos
      grupo_relacion          # familia_novio, familia_novia, amigos, trabajo
      nombre_mesa
      puesto
      usuario_id
      rol
      sexo                    # hombre, mujer, otro
      grupo_edad              # adulto, nino, bebe
      nombre_menu
      invitacion              # Boolean
      estatus                 # activo, inactivo
      
      # ✅ NUEVOS CAMPOS DESCUBIERTOS:
      chairs {                # Sillas especiales (accesibilidad)
        tipo                  # wheelchair, highchair, standard
        notas
      }
      passesQuantity          # Número de pases
      pais
      poblacion
      fecha_invitacion
      emailId                 # ID del email enviado
      father                  # ID del invitado padre (para acompañantes)
      chats_array             # Historial de chats con el invitado
    }
    invitados_count             # Total de invitados
    
    # ════════════════════════════════════════
    # PRESUPUESTO
    # ════════════════════════════════════════
    presupuesto_objeto {
      coste_estimado
      coste_final
      pagado
      currency                # EUR, USD, etc.
      totalStimatedGuests {
        adults
        children
      }
      
      categorias_array {
        _id
        nombre                # Catering, Decoración, etc.
        coste_estimado
        coste_final
        pagado
        
        gastos_array {
          _id
          nombre
          coste_estimado
          coste_final
          pagado
          estatus             # Boolean
          pagos_array {
            monto
            fecha
            metodo_pago
          }
        }
      }
    }
    
    # ════════════════════════════════════════
    # ITINERARIOS Y TAREAS
    # ════════════════════════════════════════
    itinerarios_array {
      _id
      title
      tipo                    # servicios, proveedores, ceremonia, recepcion
      estatus                 # Boolean
      participantes           # UIDs de Firebase
      presupuesto_asignado
      presupuesto_gastado
      completion_percentage
      chat_id                 # ID del chat del itinerario
      
      tasks {
        _id
        fecha
        hora
        descripcion
        responsable           # Array de UIDs
        duracion
        estatus               # Boolean (completada/no)
        
        # ✅ CAMPOS AVANZADOS:
        prioridad             # alta, media, baja
        tags                  # Array de etiquetas
        icon                  # Icono de la tarea
        horaActiva            # Boolean
        tips                  # Consejos de la tarea
        comments {            # Comentarios con threading
          _id
          texto
          autor
          autor_nombre
          fecha
          leido
          reply_to_comment_id # Threading
          thread_id
        }
        attachments {         # Archivos adjuntos
          _id
          nombre
          url
          tipo
          tamano
          subido_por
          fecha
        }
        linkages              # Tareas vinculadas
        spectatorView         # Visible para espectadores
        parent_task_id        # Subtareas jerárquicas
        subtasks              # Array de IDs de subtareas
        chat_id               # Chat de la tarea
      }
    }
    
    # ════════════════════════════════════════
    # MESAS
    # ════════════════════════════════════════
    mesas_array {
      _id
      nombre                  # Mesa 1, Mesa VIP, etc.
      capacidad
      invitados_asignados
      tipo                    # redonda, rectangular, alta
      ubicacion
      notas
    }
    
    # ════════════════════════════════════════
    # MENÚS
    # ════════════════════════════════════════
    menus_array {
      _id
      nombre_menu             # adultos, ninos, vegetariano, vegano
      descripcion
      platos
      precio
    }
    
    # ════════════════════════════════════════
    # OTROS CAMPOS
    # ════════════════════════════════════════
    planSpace                 # Configuración de planificación
    planSpaceSelect           # Plan seleccionado
    grupos_array              # Grupos de invitados
    
    # ✅ NUEVOS CAMPOS FASE 2:
    temporada                 # verano, invierno, otono, primavera
    estilo                    # aire_libre, salon, jardin, playa, montana
    tematica                  # rustico, elegante, bohemio, etc.
    timeZone                  # Zona horaria
    imgInvitacion             # URL imagen invitación
    showChildrenGuest         # Mostrar invitados niños
    
    # ✅ EMBEDDINGS PARA IA:
    embedding                 # Vector embeddings para búsqueda semántica
    search_text               # Texto indexado
    embedding_created
    embedding_updated
    
    # ✅ CHAT Y MEJORAS V2:
    chat_general_id           # Chat general del evento
    health_score {            # Score de salud 0-100
      overall
      budget
      tasks
      guests
      calculated_at
    }
    ai_recommendations        # Recomendaciones de IA
    ai_warnings               # Advertencias de IA
    timeline {                # Historial de cambios
      fecha
      tipo
      descripcion
      usuario
      metadata
    }
    
    # ════════════════════════════════════════
    # TIMESTAMPS
    # ════════════════════════════════════════
    fecha_creacion
    fecha_actualizacion
  }
}
```

**Uso:**
- ✅ Devuelve TODOS los eventos del usuario (propios, compartidos, como invitado)
- ✅ Filtra automáticamente por `development` (aislamiento por marca)
- ✅ Incluye roles y permisos calculados
- ✅ Busca en Firebase UID y luego en MongoDB

**Roles devueltos:**
- **CREADOR:** Eventos propios (acceso completo)
- **COMPARTIDO:** Eventos compartidos por otros (permisos configurables)
- **INVITADO:** Eventos donde solo es invitado (permisos limitados)
- **SIN_ACCESO:** Eventos legacy sin permisos

---

### **2. OBTENER EVENTOS POR TELÉFONO**

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
- ✅ Busca en Firebase Auth
- ✅ Busca en invitados_array.telefono

---

### **3. OBTENER EVENTO ESPECÍFICO** ⭐ V2 CON MEJORAS

```graphql
query GetEventoCompleto {
  EVT_getEventoV2(
    eventoId: "66a9042dec5c58aa734bca44"
    development: "bodasdehoy"
  ) {
    # Todos los campos del evento
    # Incluye mejoras V2:
    - chat_general_id
    - health_score
    - timeline
    - ai_recommendations
  }
}
```

---

### **4. RESUMEN COMPLETO PARA IA** ⭐ MCP OPTIMIZADO

```graphql
query GetEventSummary {
  getUserCompleteEventSummary(
    userIdentifier: "usuario@ejemplo.com"  # Email o phone
  ) {
    userInfo {
      identifier
      firebaseUID
      email
      phone
      userType                # FIREBASE_USER, EMAIL_ONLY, PHONE_ONLY
    }
    
    eventsSummary {
      totalEvents
      eventsByRole {
        creator                # Eventos propios
        shared                 # Compartidos
        invited                # Como invitado
      }
      eventsByType {
        type                   # boda, cumpleaños, etc.
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
      upcomingEvents {        # Próximos eventos
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
    
    recommendations           # Recomendaciones para el usuario
  }
}
```

**Uso:**
- ✅ **UNA SOLA QUERY** para obtener resumen completo
- ✅ Optimizado para IA/MCP
- ✅ Incluye estadísticas y permisos calculados

---

### **5. QUERIES DE INVITADOS**

#### **5.1. Invitados por Ubicación**
```graphql
query GetInvitadosByLocation {
  EVT_getInvitadosByLocation(
    eventId: "66a9042dec5c58aa734bca44"
    pais: "España"
    poblacion: "Madrid"
    development: "bodasdehoy"
  ) {
    _id
    nombre
    correo
    pais
    poblacion
  }
}
```

#### **5.2. Invitados con Sillas Especiales**
```graphql
query GetInvitadosByChairType {
  EVT_getInvitadosByChairType(
    eventId: "66a9042dec5c58aa734bca44"
    chairType: wheelchair
    development: "bodasdehoy"
  ) {
    _id
    nombre
    chairs {
      tipo
      notas
    }
  }
}
```

#### **5.3. Estadísticas de Ubicación**
```graphql
query GetLocationStats {
  EVT_getLocationStats(
    eventId: "66a9042dec5c58aa734bca44"
    development: "bodasdehoy"
  ) {
    total_invitados
    paises {
      pais
      cantidad
    }
    ciudades {
      ciudad
      pais
      cantidad
    }
    locales
    internacionales
  }
}
```

#### **5.4. Tracking de Invitaciones**
```graphql
query GetInvitationTracking {
  EVT_getInvitationTracking(
    eventId: "66a9042dec5c58aa734bca44"
    development: "bodasdehoy"
  ) {
    invitado {
      nombre
      correo
    }
    fue_invitado
    fecha_invitacion
    email_id
    email_abierto
    dias_desde_invitacion
  }
}
```

---

### **6. QUERIES DE TAREAS**

#### **6.1. Tareas por Prioridad**
```graphql
query GetTasksByPrioridad {
  EVT_getTasksByPrioridad(
    eventId: "66a9042dec5c58aa734bca44"
    prioridad: "alta"
    development: "bodasdehoy"
  ) {
    _id
    descripcion
    prioridad
    fecha
    estatus
  }
}
```

#### **6.2. Tareas por Tag**
```graphql
query GetTasksByTag {
  EVT_getTasksByTag(
    eventId: "66a9042dec5c58aa734bca44"
    tag: "urgente"
    development: "bodasdehoy"
  ) {
    _id
    descripcion
    tags
  }
}
```

#### **6.3. Comentarios de Tarea**
```graphql
query GetTaskComments {
  EVT_getTaskComments(
    eventId: "66a9042dec5c58aa734bca44"
    itinerarioId: "itin_123"
    taskId: "task_456"
    development: "bodasdehoy"
  ) {
    _id
    texto
    autor_nombre
    fecha
    reply_to_comment_id  # Threading
  }
}
```

---

### **7. QUERIES DE TEMPORADA/ESTILO**

```graphql
query GetByTemporada {
  EVT_getByTemporada(
    temporada: "verano"
    development: "bodasdehoy"
  ) {
    _id
    nombre
    fecha
    temporada
    estilo
  }
}

query GetSuggestionsByContext {
  EVT_getSuggestionsByContext(
    eventId: "66a9042dec5c58aa734bca44"
    development: "bodasdehoy"
  ) {
    decoracion {
      tipo
      titulo
      descripcion
      relevancia
    }
    menu {
      ...
    }
    colores
    consideraciones
  }
}
```

---

## 🔧 MUTATIONS GRAPHQL DISPONIBLES {#mutations}

### **1. CREAR EVENTO**

```graphql
mutation CreateEvent {
  createEvent(input: {
    nombre: "Boda de Ana y Carlos"
    tipo: "boda"
    fecha: "2026-06-15T00:00:00Z"
    poblacion: "Madrid"
    pais: "España"
    usuario_id: "firebase_uid_123"
    usuario_nombre: "Ana López"
    color: ["#FF5733", "#C70039"]
    development: "bodasdehoy"
    
    # ✅ CAMPOS OPCIONALES NUEVOS:
    temporada: "verano"
    estilo: "jardin"
    tematica: "romantico"
    timeZone: "Europe/Madrid"
  }) {
    _id
    nombre
    fecha
    tipo
  }
}
```

---

### **2. ACTUALIZAR EVENTO**

```graphql
mutation UpdateEvent {
  EVT_updateEventoComplete(
    eventId: "66a9042dec5c58aa734bca44"
    input: {
      nombre: "Nueva Nombre"
      fecha: "2026-12-31T00:00:00Z"
      temporada: "invierno"
      estilo: "salon"
    }
    development: "bodasdehoy"
  ) {
    success
    message
    evento {
      _id
      nombre
    }
  }
}
```

---

### **3. COMPARTIR EVENTO**

```graphql
mutation ShareEvent {
  shareEvent(
    eventId: "66a9042dec5c58aa734bca44"
    userId: "otro_uid_456"
    permissions: {
      canEdit: true
      canViewBudget: true
      canViewGuests: true
      canInviteGuests: false
      canViewAnalytics: true
      canExportData: false
    }
  )
}
```

---

### **4. MUTATIONS DE INVITADOS**

#### **4.1. Agregar Invitado**
```graphql
mutation AddGuest {
  addGuest(
    eventId: "66a9042dec5c58aa734bca44"
    nombre: "María García"
    correo: "maria@ejemplo.com"
    telefono: "+34600000000"
    grupo_relacion: "familia_novia"
    asistencia: "pendiente"
    
    # ✅ CAMPOS NUEVOS:
    pais: "España"
    poblacion: "Barcelona"
    passesQuantity: 2
    chairs: [
      {
        tipo: wheelchair
        notas: "Requiere acceso sin escaleras"
      }
    ]
  ) {
    _id
    nombre
    correo
  }
}
```

#### **4.2. Actualizar Asistencia**
```graphql
mutation UpdateAttendance {
  updateGuestAttendance(
    eventId: "66a9042dec5c58aa734bca44"
    guestId: "guest_789"
    asistencia: "confirmado"
  ) {
    _id
    nombre
    asistencia
  }
}
```

#### **4.3. Actualizar Sillas Especiales**
```graphql
mutation UpdateInvitadoChairs {
  EVT_updateInvitadoChairs(
    eventId: "66a9042dec5c58aa734bca44"
    invitadoId: "guest_789"
    chairs: [
      {
        tipo: wheelchair
        notas: "Necesita rampa"
      }
    ]
    development: "bodasdehoy"
  ) {
    success
    message
    invitado {
      _id
      nombre
      chairs {
        tipo
        notas
      }
    }
  }
}
```

#### **4.4. Marcar Invitación Enviada**
```graphql
mutation MarkInvitationSent {
  EVT_markInvitationSent(
    eventId: "66a9042dec5c58aa734bca44"
    invitadoId: "guest_789"
    emailId: "email_12345"
    development: "bodasdehoy"
  ) {
    success
    invitado {
      fecha_invitacion
      emailId
    }
  }
}
```

---

### **5. MUTATIONS DE PRESUPUESTO**

#### **5.1. Agregar Categoría**
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

#### **5.2. Agregar Gasto**
```graphql
mutation AddExpense {
  addExpense(
    eventId: "66a9042dec5c58aa734bca44"
    categoryId: "cat_123"
    nombre: "Menú por persona"
    coste_estimado: 75.00
    coste_final: 70.00
  ) {
    _id
    nombre
    coste_final
  }
}
```

#### **5.3. Actualizar Categoría**
```graphql
mutation UpdateCategoria {
  PRESUPUESTO_updateCategoria(
    eventId: "66a9042dec5c58aa734bca44"
    categoriaId: "cat_123"
    input: {
      nombre: "Catering Premium"
      coste_estimado: 6000.00
    }
    development: "bodasdehoy"
  )
}
```

---

### **6. MUTATIONS DE TAREAS**

#### **6.1. Actualizar Prioridad**
```graphql
mutation UpdateTaskPrioridad {
  EVT_updateTaskPrioridad(
    eventId: "66a9042dec5c58aa734bca44"
    itinerarioId: "itin_123"
    taskId: "task_456"
    prioridad: "alta"
    development: "bodasdehoy"
  ) {
    success
    task {
      prioridad
    }
  }
}
```

#### **6.2. Agregar Comentario con Threading**
```graphql
mutation AddTaskComment {
  EVT_addCommentWithThreading(
    eventoId: "66a9042dec5c58aa734bca44"
    itinerarioId: "itin_123"
    taskId: "task_456"
    texto: "Esto es un comentario"
    replyToCommentId: "comment_789"  # Opcional para threading
    development: "bodasdehoy"
  ) {
    success
    comment {
      _id
      texto
      reply_to_comment_id
    }
  }
}
```

#### **6.3. Crear Subtarea**
```graphql
mutation CreateSubtask {
  EVT_createSubtask(
    eventoId: "66a9042dec5c58aa734bca44"
    itinerarioId: "itin_123"
    parentTaskId: "task_456"
    subtask: {
      descripcion: "Subtarea 1"
      prioridad: "media"
    }
    development: "bodasdehoy"
  ) {
    success
    task {
      _id
      parent_task_id
    }
  }
}
```

#### **6.4. Subir Archivo Adjunto**
```graphql
mutation UploadTaskAttachment {
  EVT_uploadTaskAttachment(
    eventId: "66a9042dec5c58aa734bca44"
    itinerarioId: "itin_123"
    taskId: "task_456"
    input: {
      nombre: "Contrato.pdf"
      url: "https://storage.com/file.pdf"
      tipo: "application/pdf"
      tamano: 1024000
    }
    development: "bodasdehoy"
  ) {
    success
    attachment {
      _id
      nombre
      url
    }
  }
}
```

---

### **7. MUTATIONS DE CHAT**

```graphql
mutation CreateEventChat {
  EVT_createEventChat(
    eventoId: "66a9042dec5c58aa734bca44"
    development: "bodasdehoy"
  ) {
    success
    chatId
  }
}

mutation CreateItinerarioChat {
  EVT_createItinerarioChat(
    eventoId: "66a9042dec5c58aa734bca44"
    itinerarioId: "itin_123"
    development: "bodasdehoy"
  ) {
    success
    chatId
  }
}
```

---

### **8. CALCULAR HEALTH SCORE**

```graphql
mutation CalculateHealthScore {
  EVT_calculateHealthScore(
    eventoId: "66a9042dec5c58aa734bca44"
    development: "bodasdehoy"
  ) {
    overall       # 0-100
    budget        # 0-100
    tasks         # 0-100
    guests        # 0-100
    calculated_at
  }
}
```

---

## 📦 TIPOS DE DATOS {#tipos-datos}

### **Enums Disponibles:**

```typescript
// Tipos de eventos
enum EventoTipo {
  boda
  cumpleanos
  bautizo
  comunion
  babyshower
  graduacion
  aniversario
  corporativo
}

// Estados del evento
enum EventoEstatus {
  pendiente
  confirmado
  archivado
  borrado
}

// Asistencia de invitados
enum AsistenciaEstado {
  pendiente
  confirmado
  rechazado
  cancelado
}

// Grupos de relación
enum GrupoRelacion {
  familia_novio
  familia_novia
  amigos
  trabajo
  otros
}

// Tipos de sillas especiales
enum ChairType {
  wheelchair      # Silla de ruedas
  highchair       # Silla alta (bebés)
  standard        # Estándar
  other           # Otro
}

// Prioridad de tareas
enum Prioridad {
  alta
  media
  baja
}

// Temporada
enum Temporada {
  verano
  invierno
  otono
  primavera
}

// Estilo
enum Estilo {
  aire_libre
  salon
  en_casa
  piscina
  jardin
  playa
  montana
}
```

---

## 📝 CAMPOS COMPLETOS DE EVENTOS {#campos-eventos}

### **Estructura Completa de un Evento:**

```typescript
interface Evento {
  // ══════════════════════════════════════
  // IDENTIFICACIÓN
  // ══════════════════════════════════════
  _id: string;
  development: string;  // bodasdehoy | eventosorganizador | annloevents
  
  // ══════════════════════════════════════
  // INFORMACIÓN BÁSICA
  // ══════════════════════════════════════
  nombre: string;
  fecha: Date;
  tipo: EventoTipo;
  estatus: EventoEstatus;
  poblacion?: string;
  pais?: string;
  color?: string[];
  
  // ══════════════════════════════════════
  // USUARIO Y PERMISOS
  // ══════════════════════════════════════
  usuario_id: string;        // Firebase UID del creador
  usuario_nombre: string;
  compartido_array?: string[];  // UIDs con acceso
  detalles_compartidos_array?: Array<{
    uid: string;
    permisos: string[];
    fecha_compartido: Date;
  }>;
  
  // Calculados automáticamente:
  user_role?: 'CREADOR' | 'COMPARTIDO' | 'INVITADO' | 'SIN_ACCESO';
  user_permissions?: string[];
  
  // ══════════════════════════════════════
  // INVITADOS (27 campos)
  // ══════════════════════════════════════
  invitados_array?: Invitado[];
  invitados_count?: number;
  
  // ══════════════════════════════════════
  // PRESUPUESTO
  // ══════════════════════════════════════
  presupuesto_objeto?: {
    coste_estimado: number;
    coste_final: number;
    pagado: number;
    currency: string;
    totalStimatedGuests?: {
      adults: number;
      children: number;
    };
    categorias_array?: PresupuestoCategoria[];
  };
  
  // ══════════════════════════════════════
  // ITINERARIOS Y TAREAS
  // ══════════════════════════════════════
  itinerarios_array?: Itinerario[];
  
  // ══════════════════════════════════════
  // MESAS Y MENÚS
  // ══════════════════════════════════════
  mesas_array?: Mesa[];
  menus_array?: Menu[];
  
  // ══════════════════════════════════════
  // CONFIGURACIÓN Y OTROS
  // ══════════════════════════════════════
  planSpace?: any[];
  planSpaceSelect?: string;
  grupos_array?: string[];
  
  // ══════════════════════════════════════
  // NUEVOS CAMPOS FASE 2
  // ══════════════════════════════════════
  temporada?: Temporada;
  estilo?: Estilo;
  tematica?: string;
  timeZone?: string;
  imgInvitacion?: string;
  showChildrenGuest?: boolean;
  
  // ══════════════════════════════════════
  // EMBEDDINGS PARA IA
  // ══════════════════════════════════════
  embedding?: number[];
  search_text?: string;
  embedding_created?: Date;
  embedding_updated?: Date;
  
  // ══════════════════════════════════════
  // CHAT Y MEJORAS V2
  // ══════════════════════════════════════
  chat_general_id?: string;
  health_score?: {
    overall: number;     // 0-100
    budget: number;      // 0-100
    tasks: number;       // 0-100
    guests: number;      // 0-100
    calculated_at: Date;
  };
  ai_recommendations?: string[];
  ai_warnings?: string[];
  timeline?: Array<{
    fecha: Date;
    tipo: 'creacion' | 'actualizacion' | 'invitado_agregado' | 'gasto_registrado';
    descripcion: string;
    usuario: string;
    metadata?: any;
  }>;
  
  // ══════════════════════════════════════
  // TIMESTAMPS
  // ══════════════════════════════════════
  fecha_creacion: Date;
  fecha_actualizacion?: Date;
}
```

---

## 👥 GESTIÓN DE INVITADOS {#invitados}

### **Campos Completos de Invitado:**

```typescript
interface Invitado {
  _id: string;
  
  // Información básica
  nombre: string;
  correo?: string;
  telefono?: string;
  pais?: string;
  poblacion?: string;
  
  // Asistencia
  asistencia: 'pendiente' | 'confirmado' | 'rechazado';
  invitacion?: boolean;
  fecha_invitacion?: Date;
  emailId?: string;  // ID del email enviado
  
  // Clasificación
  grupo_relacion?: string;  // familia_novio, familia_novia, amigos, trabajo
  rol?: string;
  sexo?: 'hombre' | 'mujer' | 'otro';
  grupo_edad?: 'adulto' | 'nino' | 'bebe';
  
  // Mesa y menú
  nombre_mesa?: string;
  puesto?: number;
  nombre_menu?: string;
  
  // Restricciones
  alergenos?: string[];
  chairs?: Array<{        // ✅ NUEVO
    tipo: 'wheelchair' | 'highchair' | 'standard' | 'other';
    notas?: string;
  }>;
  
  // Pases y control
  passesQuantity?: number;  // ✅ NUEVO
  
  // Relaciones
  father?: string;  // ID del invitado padre (acompañantes)
  usuario_id?: string;  // Si es usuario registrado
  
  // Comunicación
  chats_array?: Array<{  // ✅ NUEVO
    _id: string;
    mensaje: string;
    timestamp: Date;
    emisor: string;
    leido: boolean;
  }>;
  
  // Estado
  estatus?: 'activo' | 'inactivo';
}
```

### **Operaciones con Invitados:**

1. ✅ Agregar invitado
2. ✅ Actualizar invitado completo
3. ✅ Actualizar asistencia (RSVP)
4. ✅ Actualizar ubicación (país/ciudad)
5. ✅ Actualizar sillas especiales
6. ✅ Actualizar número de pases
7. ✅ Enviar mensaje de chat
8. ✅ Marcar invitación enviada
9. ✅ Eliminar invitado
10. ✅ Búsqueda por ubicación
11. ✅ Búsqueda por tipo de silla
12. ✅ Estadísticas de ubicación
13. ✅ Tracking de invitaciones

---

## 💰 GESTIÓN DE PRESUPUESTO {#presupuesto}

### **Estructura:**

```typescript
interface Presupuesto {
  coste_estimado: number;
  coste_final: number;
  pagado: number;
  currency: string;
  
  totalStimatedGuests?: {
    adults: number;
    children: number;
  };
  
  categorias_array: Array<{
    _id: string;
    nombre: string;          // Catering, Decoración, Música, etc.
    coste_estimado: number;
    coste_final: number;
    pagado: number;
    
    gastos_array: Array<{
      _id: string;
      nombre: string;
      coste_estimado: number;
      coste_final: number;
      pagado: number;
      estatus: boolean;      // Pagado/No pagado
      
      pagos_array: Array<{
        monto: number;
        fecha: Date;
        metodo_pago: string;  // Tarjeta, Transferencia, Efectivo
      }>;
    }>;
  }>;
}
```

### **Operaciones:**

1. ✅ Agregar categoría de presupuesto
2. ✅ Actualizar categoría
3. ✅ Eliminar categoría
4. ✅ Agregar gasto
5. ✅ Actualizar gasto
6. ✅ Eliminar gasto
7. ✅ Agregar pago
8. ✅ Recalcular totales automáticamente

---

## ✅ GESTIÓN DE TAREAS E ITINERARIOS {#tareas}

### **Estructura de Itinerario:**

```typescript
interface Itinerario {
  _id: string;
  title: string;
  tipo: string;  // servicios, proveedores, ceremonia, recepcion
  estatus: boolean;
  
  // ✅ MEJORAS V2:
  chat_id?: string;
  participantes?: string[];  // Firebase UIDs
  presupuesto_asignado?: number;
  presupuesto_gastado?: number;
  completion_percentage?: number;
  
  tasks: Tarea[];
}
```

### **Estructura de Tarea:**

```typescript
interface Tarea {
  _id: string;
  fecha?: Date;
  hora?: string;
  descripcion: string;
  responsable?: string[];  // Firebase UIDs
  duracion?: number;
  estatus: boolean;  // Completada/No completada
  
  // ✅ CAMPOS AVANZADOS:
  prioridad?: 'alta' | 'media' | 'baja';
  tags?: string[];
  icon?: string;
  horaActiva?: boolean;
  tips?: string;
  spectatorView?: boolean;
  
  // ✅ SUBTAREAS JERÁRQUICAS:
  parent_task_id?: string;
  subtasks?: string[];
  nivel?: number;
  
  // ✅ COMENTARIOS CON THREADING:
  comments?: Array<{
    _id: string;
    texto: string;
    autor: string;
    autor_nombre?: string;
    fecha: Date;
    leido: boolean;
    reply_to_comment_id?: string;  // Threading
    thread_id?: string;
  }>;
  
  // ✅ ARCHIVOS ADJUNTOS:
  attachments?: Array<{
    _id: string;
    nombre: string;
    url: string;
    tipo: string;
    tamano: number;
    subido_por: string;
    fecha: Date;
  }>;
  
  // ✅ VINCULACIÓN DE TAREAS:
  linkages?: string[];  // IDs de tareas vinculadas
  
  // ✅ CHAT:
  chat_id?: string;
}
```

### **Operaciones:**

1. ✅ Crear/actualizar/eliminar itinerario
2. ✅ Crear/actualizar/eliminar tarea
3. ✅ Actualizar prioridad
4. ✅ Agregar/remover tags
5. ✅ Agregar comentario con threading
6. ✅ Marcar comentario como leído
7. ✅ Subir archivo adjunto
8. ✅ Eliminar archivo adjunto
9. ✅ Vincular/desvincular tareas
10. ✅ Actualizar tips
11. ✅ Crear subtarea jerárquica
12. ✅ Completar tarea
13. ✅ Búsqueda por prioridad
14. ✅ Búsqueda por tag
15. ✅ Obtener tareas vinculadas

---

## 🪑 GESTIÓN DE MESAS {#mesas}

### **Estructura:**

```typescript
interface Mesa {
  _id: string;
  nombre: string;              // Mesa 1, Mesa VIP, etc.
  capacidad: number;
  invitados_asignados: string[];  // IDs de invitados
  tipo?: 'redonda' | 'rectangular' | 'alta';
  ubicacion?: string;
  notas?: string;
}
```

### **Operaciones:**

1. ✅ Crear mesa
2. ✅ Actualizar mesa
3. ✅ Eliminar mesa
4. ✅ Asignar invitado a mesa
5. ✅ Remover invitado de mesa
6. ✅ Asignación masiva (bulk)
7. ✅ Estadísticas de ocupación
8. ✅ Obtener distribución

---

## 🔒 SISTEMA DE PERMISOS {#permisos}

### **Roles:**

| Rol | Descripción | Acceso |
|-----|-------------|--------|
| **CREADOR** | Propietario del evento | ✅ Acceso completo |
| **COMPARTIDO** | Usuario con permisos configurables | ✅ Según permisos |
| **INVITADO** | Solo invitado al evento | ⚠️ Vista limitada |
| **SIN_ACCESO** | Sin permisos | ❌ Sin acceso |

### **Permisos Granulares (21 permisos):**

#### **Básicos:**
- ✅ `canViewBudget` - Ver presupuesto
- ✅ `canEditEvent` - Editar evento
- ✅ `canInviteGuests` - Invitar personas

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

---

## 💡 EJEMPLOS DE USO {#ejemplos}

### **Ejemplo 1: Crear Evento Completo**

```graphql
mutation {
  # 1. Crear evento
  createEvent(input: {
    nombre: "Boda de Isabel & Raúl"
    tipo: "boda"
    fecha: "2025-12-30T00:00:00Z"
    poblacion: "Madrid"
    pais: "España"
    usuario_id: "user_123"
    usuario_nombre: "Isabel García"
    development: "bodasdehoy"
    temporada: "invierno"
    estilo: "salon"
  }) {
    _id  # evt_001
  }
  
  # 2. Agregar categoría de presupuesto
  addBudgetCategory(
    eventId: "evt_001"
    nombre: "Catering"
    coste_estimado: 5000
  ) {
    _id  # cat_001
  }
  
  # 3. Agregar invitados
  addGuest(
    eventId: "evt_001"
    nombre: "María López"
    correo: "maria@ejemplo.com"
    asistencia: "pendiente"
    grupo_relacion: "familia_novia"
  ) {
    _id  # guest_001
  }
}
```

### **Ejemplo 2: Consulta Completa para Dashboard**

```graphql
query Dashboard {
  getUserCompleteEventSummary(
    userIdentifier: "isabel@ejemplo.com"
  ) {
    eventsSummary {
      totalEvents
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
    }
    recommendations
  }
}
```

### **Ejemplo 3: Gestión de Tareas**

```graphql
mutation {
  # Crear tarea con prioridad
  EVT_updateTaskComplete(
    eventId: "evt_001"
    itinerarioId: "itin_001"
    taskId: "task_001"
    input: {
      descripcion: "Confirmar menú"
      prioridad: "alta"
      tags: ["urgente", "catering"]
      fecha: "2025-11-01"
    }
    development: "bodasdehoy"
  ) {
    success
  }
  
  # Agregar comentario
  EVT_addTaskComment(
    eventId: "evt_001"
    itinerarioId: "itin_001"
    taskId: "task_001"
    texto: "Ya confirmado con el proveedor"
    development: "bodasdehoy"
  ) {
    success
  }
}
```

---

## 🎯 MEJORES PRÁCTICAS {#mejores-practicas}

### **1. Consultas:**
- ✅ Usar `getUserCompleteEventSummary` para resúmenes
- ✅ Especificar siempre el campo `development`
- ✅ Limitar campos devueltos (solo los necesarios)
- ✅ Usar cursor pagination para listas grandes

### **2. Mutations:**
- ✅ Validar datos antes de enviar
- ✅ Manejar errores apropiadamente
- ✅ Usar transacciones para operaciones múltiples

### **3. Permisos:**
- ✅ Verificar permisos antes de mostrar UI
- ✅ Validar acceso en backend siempre
- ✅ No confiar solo en frontend

### **4. Rendimiento:**
- ✅ Cachear datos cuando sea posible
- ✅ Usar DataLoader para queries relacionadas
- ✅ Evitar N+1 queries

---

## 📞 ENDPOINTS

**Producción:**
```
https://api2.eventosorganizador.com/graphql
```

**Test:**
```
https://testapi2.eventosorganizador.com/graphql
```

**Rate Limit:**
- ✅ 100 requests/minuto por IP
- ✅ Headers: `X-RateLimit-Remaining`

---

## ✅ CONCLUSIÓN

El sistema de gestión de eventos está **100% completo y operativo** con:

- ✅ 85+ Queries GraphQL
- ✅ 90+ Mutations GraphQL
- ✅ 128 funcionalidades implementadas
- ✅ Sistema de permisos granulares
- ✅ Chat integrado
- ✅ Health score automático
- ✅ Analytics en tiempo real
- ✅ Exportaciones completas

**🚀 Sistema listo para producción!**

---

*Documentación actualizada el 13 de Octubre 2025*  
*Versión 4.0.0*

