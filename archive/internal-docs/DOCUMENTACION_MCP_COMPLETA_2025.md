# 🤖 DOCUMENTACIÓN COMPLETA - SISTEMA MCP (MODEL CONTEXT PROTOCOL)

**Versión:** 4.0.0  
**Fecha:** 13 de Octubre 2025  
**Estado:** ✅ 100% Operativo - 35+ Herramientas Disponibles  

---

## 📋 ÍNDICE

1. [¿Qué es MCP?](#que-es-mcp)
2. [Arquitectura](#arquitectura)
3. [Herramientas Disponibles](#herramientas)
4. [Gestión de Invitados (Guest Tools)](#guest-tools)
5. [Gestión de Eventos (Event Tools)](#event-tools)
6. [Gestión de Mesas (Menu/Table Tools)](#mesa-tools)
7. [Gestión de Tareas (Task Tools)](#task-tools)
8. [Gestión de Presupuesto (Budget Tools)](#budget-tools)
9. [Chat y WhatsApp Tools](#chat-tools)
10. [Configuración para IA](#configuracion)
11. [Ejemplos de Uso](#ejemplos)
12. [Testing y Debugging](#testing)

---

## 🎯 ¿QUÉ ES MCP? {#que-es-mcp}

**Model Context Protocol (MCP)** es un protocolo estándar JSON-RPC 2.0 que permite a modelos de IA (Claude, GPT, Llama, etc.) interactuar con APIs externas de forma estructurada.

### **Ventajas:**

- ✅ **Estandarizado:** Compatible con Claude Desktop, Lobe Chat, ChatGPT
- ✅ **Auto-documentado:** Las herramientas se describen a sí mismas
- ✅ **Type-safe:** Validación automática de parámetros
- ✅ **Modular:** 35+ herramientas organizadas por categorías
- ✅ **Extensible:** Fácil agregar nuevas herramientas

### **Casos de Uso:**

1. **Asistente de Eventos:** "Muéstrame los invitados confirmados de mi boda"
2. **Análisis de Datos:** "¿Cuánto hemos gastado en catering?"
3. **Gestión de Tareas:** "Crea una tarea urgente para confirmar el menú"
4. **Check-in:** "Registra la entrada de María López"
5. **Reportes:** "Genera un reporte de invitados por mesa"

---

## 🏗️ ARQUITECTURA {#arquitectura}

```
┌─────────────────────────────────────────────────────────────┐
│                    CLIENTES IA                               │
├─────────────────────────────────────────────────────────────┤
│ • Claude Desktop                                             │
│ • Lobe Chat Harbor                                           │
│ • ChatGPT Custom Actions                                     │
│ • Cursor AI                                                  │
│ • Custom AI Applications                                     │
└────────────────────┬────────────────────────────────────────┘
                     │ JSON-RPC 2.0
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              MCP SERVER (Express + Stdio)                    │
│         https://api2.eventosorganizador.com/mcp              │
├─────────────────────────────────────────────────────────────┤
│ • Protocol: JSON-RPC 2.0                                     │
│ • Methods: tools/list, tools/call                            │
│ • Tools: 35+ herramientas                                    │
│ • Port: 4001 (Producción), 3001 (Test)                      │
└────────────────────┬────────────────────────────────────────┘
                     │ GraphQL
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              BACKEND API GRAPHQL                             │
│         https://api2.eventosorganizador.com/graphql          │
├─────────────────────────────────────────────────────────────┤
│ • 305 Queries                                                │
│ • 456 Mutations                                              │
│ • Autenticación Firebase                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
                ┌──────────────┐
                │   MongoDB    │
                │   Atlas      │
                └──────────────┘
```

### **Flujo de Llamada:**

1. IA/Cliente envía petición JSON-RPC: `{ "method": "tools/call", "params": { "name": "get_event_guests", ... } }`
2. MCP Server valida parámetros
3. MCP Server ejecuta query GraphQL correspondiente
4. Backend consulta MongoDB
5. MCP Server formatea respuesta
6. IA/Cliente recibe datos estructurados

---

## 🛠️ HERRAMIENTAS DISPONIBLES {#herramientas}

### **Resumen por Categorías:**

| Categoría | Cantidad | Descripción |
|-----------|----------|-------------|
| **Eventos** | 7 tools | CRUD de eventos, compartir, estadísticas |
| **Invitados** | 9 tools | Gestión completa de invitados, check-in, pases |
| **Mesas** | 6 tools | Distribución, asignación, estadísticas |
| **Menús** | 3 tools | Gestión de menús y restricciones alimentarias |
| **Tareas** | 4 tools | Crear, actualizar, completar tareas |
| **Presupuesto** | 4 tools | Categorías, gastos, análisis |
| **Chat** | 5 tools | Mensajería, historial, estadísticas |
| **WhatsApp** | 3 tools | Integración WhatsApp Business |
| **Check-in** | 5 tools | Control de acceso, QR, registro |
| **Analytics** | 4 tools | Reportes, insights, recomendaciones IA |
| **Utilidades** | 2 tools | Health check, generador de URLs |

**Total:** **52 herramientas MCP** disponibles

---

## 👥 GESTIÓN DE INVITADOS (GUEST TOOLS) {#guest-tools}

### **1. get_event_guests**

**Descripción:** Obtener lista completa de invitados de un evento con filtros.

**Parámetros:**
```typescript
{
  eventId: string;           // Requerido
  userId?: string;           // Firebase UID (opcional)
  status?: 'confirmado' | 'pendiente' | 'declinado' | 'todos';  // Default: 'todos'
  group?: 'familia_novio' | 'familia_novia' | 'amigos' | 'trabajo' | 'todos';  // Default: 'todos'
  hasAllergies?: boolean;    // Filtrar por alergias
  hasSpecialNeeds?: boolean; // Filtrar por necesidades especiales
  limit?: number;            // Default: 100, Max: 500
}
```

**Respuesta:**
```json
{
  "success": true,
  "guests": [
    {
      "_id": "guest_001",
      "nombre": "María López",
      "correo": "maria@ejemplo.com",
      "telefono": "+34600000000",
      "asistencia": "confirmado",
      "grupo_relacion": "familia_novia",
      "alergenos": ["gluten", "lactosa"],
      "nombre_mesa": "Mesa 1",
      "puesto": 3,
      "chairs": [
        {
          "tipo": "wheelchair",
          "notas": "Necesita rampa de acceso"
        }
      ],
      "passesQuantity": 2,
      "pais": "España",
      "poblacion": "Madrid"
    }
  ],
  "total": 150,
  "confirmed": 120,
  "pending": 25,
  "declined": 5
}
```

---

### **2. add_guest**

**Descripción:** Agregar un nuevo invitado al evento.

**Parámetros:**
```typescript
{
  eventId: string;
  nombre: string;            // Requerido
  correo?: string;
  telefono?: string;
  grupo_relacion?: string;   // familia_novio, familia_novia, amigos, trabajo
  asistencia?: string;       // Default: 'pendiente'
  nombre_mesa?: string;
  pais?: string;
  poblacion?: string;
  alergenos?: string[];
  passesQuantity?: number;
  chairs?: Array<{
    tipo: 'wheelchair' | 'highchair' | 'standard' | 'other';
    notas?: string;
  }>;
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Invitado agregado correctamente",
  "guest": {
    "_id": "guest_002",
    "nombre": "Juan Pérez",
    ...
  }
}
```

---

### **3. update_guest**

**Descripción:** Actualizar información de un invitado.

**Parámetros:**
```typescript
{
  eventId: string;
  guestId: string;
  updates: {
    nombre?: string;
    correo?: string;
    telefono?: string;
    asistencia?: 'confirmado' | 'pendiente' | 'rechazado';
    grupo_relacion?: string;
    nombre_mesa?: string;
    alergenos?: string[];
    chairs?: Array<{ tipo: string; notas?: string }>;
    passesQuantity?: number;
  };
}
```

---

### **4. delete_guest**

**Descripción:** Eliminar un invitado del evento.

**Parámetros:**
```typescript
{
  eventId: string;
  guestId: string;
}
```

---

### **5. get_guest_statistics**

**Descripción:** Obtener estadísticas detalladas de invitados.

**Parámetros:**
```typescript
{
  eventId: string;
  includeAllergies?: boolean;     // Default: true
  includeLocations?: boolean;     // Default: true
  includeGroups?: boolean;        // Default: true
}
```

**Respuesta:**
```json
{
  "total": 150,
  "confirmed": 120,
  "pending": 25,
  "declined": 5,
  "byGroup": {
    "familia_novio": 40,
    "familia_novia": 38,
    "amigos": 50,
    "trabajo": 22
  },
  "byLocation": {
    "locales": 120,
    "internacionales": 30,
    "paises": [
      { "pais": "España", "cantidad": 120 },
      { "pais": "Francia", "cantidad": 20 },
      { "pais": "Portugal", "cantidad": 10 }
    ]
  },
  "withAllergies": 15,
  "withSpecialNeeds": 5,
  "totalPasses": 180
}
```

---

### **6. check_in_guest**

**Descripción:** Registrar check-in de un invitado.

**Parámetros:**
```typescript
{
  eventId: string;
  guestId: string;
  checkInTime?: string;          // ISO 8601, Default: now
  passesUsed?: number;           // Número de pases utilizados
  notes?: string;
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Check-in registrado correctamente",
  "checkIn": {
    "guestId": "guest_001",
    "nombre": "María López",
    "checkInTime": "2025-12-30T18:45:00Z",
    "passesUsed": 2,
    "totalPassesForGuest": 2
  }
}
```

---

### **7. generate_guest_name_tags**

**Descripción:** Generar etiquetas de nombres para invitados.

**Parámetros:**
```typescript
{
  eventId: string;
  guestIds?: string[];           // Opcional: IDs específicos
  template?: 'classic' | 'modern' | 'elegant' | 'minimal';  // Default: 'classic'
  includeTable?: boolean;        // Default: true
  includeQR?: boolean;           // Default: false
}
```

**Respuesta:**
```json
{
  "success": true,
  "nameTags": [
    {
      "guestId": "guest_001",
      "nombre": "María López",
      "mesa": "Mesa 1",
      "qrCode": "data:image/png;base64,iVBOR...",  // Si includeQR: true
      "pdfUrl": "https://storage.com/nametag_001.pdf"
    }
  ]
}
```

---

### **8. bulk_update_guests**

**Descripción:** Actualización masiva de múltiples invitados.

**Parámetros:**
```typescript
{
  eventId: string;
  updates: Array<{
    guestId: string;
    field: string;               // nombre, asistencia, mesa, etc.
    value: any;
  }>;
}
```

**Ejemplo:**
```json
{
  "eventId": "evt_001",
  "updates": [
    { "guestId": "guest_001", "field": "asistencia", "value": "confirmado" },
    { "guestId": "guest_002", "field": "asistencia", "value": "confirmado" },
    { "guestId": "guest_003", "field": "nombre_mesa", "value": "Mesa 5" }
  ]
}
```

---

### **9. import_guests_csv**

**Descripción:** Importar invitados desde archivo CSV.

**Parámetros:**
```typescript
{
  eventId: string;
  csvData: string;               // Contenido CSV en base64 o string
  mapping?: {
    nombre: string;              // Columna del CSV para nombre
    correo: string;              // Columna del CSV para correo
    telefono: string;            // etc.
  };
  skipErrors?: boolean;          // Default: false
}
```

**Formato CSV esperado:**
```csv
nombre,correo,telefono,grupo_relacion,asistencia
María López,maria@ejemplo.com,+34600000000,familia_novia,pendiente
Juan Pérez,juan@ejemplo.com,+34600000001,amigos,confirmado
```

---

## 🎉 GESTIÓN DE EVENTOS (EVENT TOOLS) {#event-tools}

### **1. get_event_details**

**Descripción:** Obtener detalles completos de un evento.

**Parámetros:**
```typescript
{
  eventId: string;
  includeGuests?: boolean;        // Default: true
  includeBudget?: boolean;        // Default: true
  includeItinerary?: boolean;     // Default: true
}
```

**Respuesta:** Evento completo con todos los datos (ver documentación de eventos).

---

### **2. get_events_by_user**

**Descripción:** Obtener todos los eventos de un usuario.

**Parámetros:**
```typescript
{
  userId?: string;                // Firebase UID
  email?: string;                 // O email
  phone?: string;                 // O teléfono
  status?: 'pendiente' | 'confirmado' | 'cancelado' | 'completado';
  eventType?: 'boda' | 'cumpleanos' | 'aniversario' | 'corporativo' | 'otro';
  limit?: number;                 // Default: 20, Max: 100
}
```

---

### **3. create_event**

**Descripción:** Crear un nuevo evento.

**Parámetros:**
```typescript
{
  nombre: string;
  tipo: string;                   // boda, cumpleanos, etc.
  fecha: string;                  // ISO 8601
  poblacion?: string;
  pais?: string;
  usuario_id: string;
  usuario_nombre: string;
  color?: string[];
  temporada?: 'verano' | 'invierno' | 'otono' | 'primavera';
  estilo?: 'aire_libre' | 'salon' | 'jardin' | 'playa' | 'montana';
}
```

---

### **4. update_event**

**Descripción:** Actualizar información del evento.

---

### **5. delete_event**

**Descripción:** Eliminar un evento.

---

### **6. share_event**

**Descripción:** Compartir evento con otro usuario.

**Parámetros:**
```typescript
{
  eventId: string;
  userId: string;                 // Firebase UID
  permissions?: {
    canView?: boolean;
    canEdit?: boolean;
    canInvite?: boolean;
    canViewBudget?: boolean;
    canEditBudget?: boolean;
  };
}
```

---

### **7. get_event_statistics**

**Descripción:** Obtener estadísticas completas del evento.

**Respuesta:**
```json
{
  "eventId": "evt_001",
  "nombre": "Boda Isabel & Raúl",
  "fecha": "2025-12-30",
  "guests": {
    "total": 150,
    "confirmed": 120,
    "pending": 25,
    "declined": 5
  },
  "budget": {
    "estimado": 20000,
    "actual": 18500,
    "pagado": 15000,
    "pendiente": 3500,
    "porcentaje_gastado": 92.5
  },
  "tasks": {
    "total": 45,
    "completed": 38,
    "pending": 7,
    "porcentaje_completado": 84.4
  },
  "healthScore": {
    "overall": 85,
    "budget": 70,
    "tasks": 95,
    "guests": 90
  }
}
```

---

## 🪑 GESTIÓN DE MESAS (MENU/TABLE TOOLS) {#mesa-tools}

### **1. get_event_menus**

**Descripción:** Obtener menús del evento.

**Parámetros:**
```typescript
{
  eventId: string;
  includeAllergies?: boolean;     // Default: true
  includeGuestCount?: boolean;    // Default: true
}
```

**Respuesta:**
```json
{
  "menus": [
    {
      "_id": "menu_001",
      "nombre_menu": "adultos",
      "descripcion": "Menú completo para adultos",
      "platos": [
        "Entrada: Ensalada de la casa",
        "Principal: Solomillo con patatas",
        "Postre: Tarta nupcial"
      ],
      "precio": 75.00,
      "guestsCount": 120
    },
    {
      "_id": "menu_002",
      "nombre_menu": "vegetariano",
      "descripcion": "Menú vegetariano",
      "guestsCount": 15
    },
    {
      "_id": "menu_003",
      "nombre_menu": "ninos",
      "descripcion": "Menú infantil",
      "guestsCount": 15
    }
  ],
  "allergies": {
    "gluten": 8,
    "lactosa": 5,
    "frutos_secos": 3
  }
}
```

---

### **2. get_tables**

**Descripción:** Obtener distribución de mesas.

**Parámetros:**
```typescript
{
  eventId: string;
  includeGuests?: boolean;        // Default: true
  includeOccupancy?: boolean;     // Default: true
}
```

**Respuesta:**
```json
{
  "tables": [
    {
      "_id": "mesa_001",
      "nombre": "Mesa 1",
      "capacidad": 10,
      "invitados_asignados": [
        "guest_001",
        "guest_002",
        "guest_003"
      ],
      "ocupacion": 3,
      "disponible": 7,
      "porcentaje_ocupacion": 30,
      "tipo": "redonda",
      "ubicacion": "Salón Principal"
    }
  ],
  "statistics": {
    "totalTables": 15,
    "totalCapacity": 150,
    "totalAssigned": 120,
    "totalAvailable": 30,
    "averageOccupancy": 80
  }
}
```

---

### **3. create_table**

**Descripción:** Crear una nueva mesa.

**Parámetros:**
```typescript
{
  eventId: string;
  nombre: string;                 // "Mesa 1", "Mesa VIP", etc.
  capacidad: number;
  tipo?: 'redonda' | 'rectangular' | 'alta';
  ubicacion?: string;
  notas?: string;
}
```

---

### **4. assign_guest_to_table**

**Descripción:** Asignar invitado a una mesa.

**Parámetros:**
```typescript
{
  eventId: string;
  guestId: string;
  tableId: string;
  seatNumber?: number;            // Número de puesto
}
```

---

### **5. bulk_assign_guests_to_tables**

**Descripción:** Asignación masiva de invitados a mesas.

**Parámetros:**
```typescript
{
  eventId: string;
  assignments: Array<{
    guestId: string;
    tableId: string;
    seatNumber?: number;
  }>;
}
```

---

### **6. get_table_statistics**

**Descripción:** Estadísticas de mesas.

**Respuesta:**
```json
{
  "totalTables": 15,
  "totalCapacity": 150,
  "totalAssigned": 120,
  "totalAvailable": 30,
  "averageOccupancy": 80,
  "distribution": [
    {
      "tableId": "mesa_001",
      "nombre": "Mesa 1",
      "ocupacion": 10,
      "disponible": 0,
      "porcentaje": 100
    }
  ]
}
```

---

## ✅ GESTIÓN DE TAREAS (TASK TOOLS) {#task-tools}

### **1. create_task**

**Descripción:** Crear una nueva tarea.

**Parámetros:**
```typescript
{
  eventId: string;
  itinerarioId?: string;          // Opcional: ID del itinerario
  descripcion: string;
  fecha?: string;                 // ISO 8601
  hora?: string;                  // HH:mm
  responsable?: string[];         // Firebase UIDs
  prioridad?: 'alta' | 'media' | 'baja';
  tags?: string[];
  tips?: string;
}
```

---

### **2. update_task**

**Descripción:** Actualizar tarea existente.

---

### **3. complete_task**

**Descripción:** Marcar tarea como completada.

**Parámetros:**
```typescript
{
  eventId: string;
  itinerarioId: string;
  taskId: string;
  completedBy?: string;           // Firebase UID
  completionNotes?: string;
}
```

---

### **4. get_tasks_by_priority**

**Descripción:** Obtener tareas filtradas por prioridad.

**Parámetros:**
```typescript
{
  eventId: string;
  prioridad: 'alta' | 'media' | 'baja';
  includeCompleted?: boolean;     // Default: false
}
```

---

## 💰 GESTIÓN DE PRESUPUESTO (BUDGET TOOLS) {#budget-tools}

### **1. get_budget**

**Descripción:** Obtener presupuesto completo del evento.

---

### **2. add_budget_category**

**Descripción:** Agregar categoría de presupuesto.

---

### **3. add_expense**

**Descripción:** Agregar gasto a una categoría.

---

### **4. get_budget_analysis**

**Descripción:** Análisis detallado del presupuesto.

**Respuesta:**
```json
{
  "total_estimado": 20000,
  "total_actual": 18500,
  "total_pagado": 15000,
  "pendiente_pago": 3500,
  "porcentaje_gastado": 92.5,
  "porcentaje_pagado": 75,
  "categories": [
    {
      "nombre": "Catering",
      "estimado": 8000,
      "actual": 7500,
      "pagado": 7500,
      "porcentaje": 37.5
    }
  ],
  "warnings": [
    "Categoría 'Decoración' excede el presupuesto en 500€"
  ],
  "recommendations": [
    "Considera ajustar el presupuesto de flores"
  ]
}
```

---

## 💬 CHAT Y WHATSAPP TOOLS {#chat-tools}

### **Chat Tools (5):**

1. **get_user_chats** - Obtener chats del usuario
2. **get_chat_messages** - Obtener mensajes de un chat
3. **send_message** - Enviar mensaje
4. **search_chats** - Buscar en chats
5. **get_chat_statistics** - Estadísticas de chats

### **WhatsApp Tools (3):**

1. **send_whatsapp_message** - Enviar mensaje WhatsApp
2. **get_whatsapp_templates** - Obtener plantillas WhatsApp
3. **track_whatsapp_delivery** - Seguimiento de entrega

---

## ⚙️ CONFIGURACIÓN PARA IA {#configuracion}

### **Claude Desktop:**

Archivo: `~/Library/Application Support/Claude/claude_desktop_config.json`

```json
{
  "mcpServers": {
    "eventos-organizador": {
      "command": "node",
      "args": [
        "/var/www/api-production/mcp/evento-mcp-server.js"
      ],
      "env": {
        "GRAPHQL_ENDPOINT": "https://api2.eventosorganizador.com/graphql",
        "DEFAULT_DEVELOPMENT": "bodasdehoy",
        "FIREBASE_TOKEN": "YOUR_FIREBASE_JWT"
      }
    }
  }
}
```

---

### **Lobe Chat:**

```json
{
  "mcpEndpoint": "https://api2.eventosorganizador.com/mcp",
  "development": "bodasdehoy",
  "auth": {
    "type": "bearer",
    "token": "YOUR_JWT_TOKEN"
  }
}
```

---

### **Solicitud HTTP Directa:**

```bash
curl -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
      "name": "get_event_guests",
      "arguments": {
        "eventId": "evt_001",
        "status": "confirmado"
      }
    },
    "id": 1
  }'
```

---

## 💡 EJEMPLOS DE USO {#ejemplos}

### **Ejemplo 1: Obtener Invitados Confirmados**

**Pregunta a la IA:**
```
"Muéstrame los invitados confirmados de mi boda"
```

**IA ejecuta:**
```javascript
tool: get_event_guests
params: {
  eventId: "evt_001",
  status: "confirmado"
}
```

**Respuesta IA:**
```
Tienes 120 invitados confirmados para tu boda:
- Familia novia: 40 personas
- Familia novio: 38 personas
- Amigos: 32 personas
- Trabajo: 10 personas

Invitados con necesidades especiales:
- María López: Silla de ruedas
- Carlos Ruiz: Alergia a gluten
```

---

### **Ejemplo 2: Crear Tarea Urgente**

**Pregunta a la IA:**
```
"Crea una tarea urgente para confirmar el menú con el catering antes del 15 de noviembre"
```

**IA ejecuta:**
```javascript
tool: create_task
params: {
  eventId: "evt_001",
  descripcion: "Confirmar menú final con el catering",
  fecha: "2025-11-15",
  prioridad: "alta",
  tags: ["urgente", "catering"],
  responsable: ["user_uid_123"]
}
```

**Respuesta IA:**
```
✅ Tarea creada correctamente:
- Descripción: Confirmar menú final con el catering
- Fecha límite: 15 de noviembre 2025
- Prioridad: Alta 🔴
- Responsable: Tú

Te enviaré un recordatorio 3 días antes.
```

---

### **Ejemplo 3: Análisis de Presupuesto**

**Pregunta a la IA:**
```
"¿Cómo va el presupuesto? ¿Nos pasamos?"
```

**IA ejecuta:**
```javascript
tool: get_budget_analysis
params: {
  eventId: "evt_001"
}
```

**Respuesta IA:**
```
📊 Análisis del presupuesto:

Presupuesto total: 20.000€
Gastado: 18.500€ (92.5%)
Pagado: 15.000€ (75%)
Pendiente: 3.500€

Desglose por categorías:
1. Catering: 7.500€ (37.5%) ✅
2. Decoración: 3.500€ (18.9%) ⚠️ +500€ sobre presupuesto
3. Música: 2.000€ (10.8%) ✅
4. Fotografía: 2.500€ (13.5%) ✅

⚠️ Advertencia: La categoría de Decoración excede el presupuesto en 500€.

💡 Recomendación: Considera ajustar el presupuesto de flores o negociar con el proveedor.
```

---

### **Ejemplo 4: Check-in de Invitados**

**Pregunta a la IA:**
```
"Registra la entrada de María López"
```

**IA ejecuta:**
```javascript
tool: check_in_guest
params: {
  eventId: "evt_001",
  guestId: "guest_001",
  passesUsed: 2
}
```

**Respuesta IA:**
```
✅ Check-in registrado:
- Invitado: María López
- Hora: 18:45
- Pases utilizados: 2 de 2
- Mesa: Mesa 1, Puesto 3

Han llegado 45 de 120 invitados confirmados (37.5%)
```

---

## 🧪 TESTING Y DEBUGGING {#testing}

### **1. Listar Herramientas Disponibles:**

```bash
curl -X POST https://api2.eventosorganizador.com/mcp \
  -H "Content-Type: application/json" \
  -d '{
    "jsonrpc": "2.0",
    "method": "tools/list",
    "id": 1
  }'
```

**Respuesta:**
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "result": {
    "tools": [
      {
        "name": "get_event_guests",
        "description": "Obtener lista de invitados de un evento",
        "inputSchema": {
          "type": "object",
          "properties": {
            "eventId": {
              "type": "string",
              "description": "ID del evento"
            }
          },
          "required": ["eventId"]
        }
      }
    ]
  }
}
```

---

### **2. Health Check:**

```bash
curl https://api2.eventosorganizador.com/mcp/health
```

**Respuesta:**
```json
{
  "status": "ok",
  "service": "MCP Server",
  "version": "4.0.0",
  "tools": 52,
  "timestamp": "2025-10-13T10:30:00Z"
}
```

---

### **3. Ver Logs:**

```bash
# Producción
pm2 logs mcp-server

# Test local
tail -f /var/log/mcp-server.log
```

---

## 📚 RECURSOS ADICIONALES

### **Documentación Relacionada:**
- 📄 `DOCUMENTACION_EVENTOS_COMPLETA_2025.md` - Gestión de eventos
- 📄 `DOCUMENTACION_CHAT_COMPLETA_2025.md` - Chat y mensajería
- 📄 `README_MCP.md` - Guía técnica MCP

### **Repositorio:**
```
https://github.com/marketingsoluciones/api-v2
```

### **Endpoints:**
- **Producción MCP:** `https://api2.eventosorganizador.com/mcp`
- **Test MCP:** `https://testapi2.eventosorganizador.com/mcp`
- **Puerto Producción:** `4001`
- **Puerto Test:** `3001`

---

## ✅ CONCLUSIÓN

El sistema MCP está **100% operativo** con:

- ✅ **52 herramientas** disponibles
- ✅ **JSON-RPC 2.0** estándar
- ✅ **Auto-documentado** y type-safe
- ✅ **Compatible** con Claude, Lobe Chat, ChatGPT
- ✅ **35+ herramientas** para gestión de eventos
- ✅ **9 herramientas** específicas para invitados
- ✅ **6 herramientas** para gestión de mesas
- ✅ **4 herramientas** para análisis de presupuesto

**🚀 Sistema MCP listo para IA en producción!**

---

*Documentación actualizada el 13 de Octubre 2025*  
*Versión 4.0.0*

