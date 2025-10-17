# 💬 DOCUMENTACIÓN COMPLETA - SISTEMA DE CHAT Y MENSAJERÍA

**Versión:** 4.0.0  
**Fecha:** 13 de Octubre 2025  
**Estado:** ✅ 100% Operativo con Integración Lobe Chat  

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Arquitectura](#arquitectura)
3. [Tipos de Chat](#tipos-chat)
4. [Estructura de Mensajes](#mensajes)
5. [Queries GraphQL](#queries)
6. [Mutations GraphQL](#mutations)
7. [Subscriptions (Tiempo Real)](#subscriptions)
8. [Integración Lobe Chat](#lobe-chat)
9. [Tracking de Tokens IA](#tracking-ia)
10. [Identificar Origen (WhatsApp/Chat/API)](#origen)
11. [Ejemplos de Uso](#ejemplos)
12. [Mejores Prácticas](#mejores-practicas)

---

## 🎯 RESUMEN EJECUTIVO {#resumen-ejecutivo}

Sistema completo de chat en tiempo real con soporte para:

### **Funcionalidades:**
- ✅ **Chat individual** entre dos usuarios
- ✅ **Chat grupal** con múltiples participantes
- ✅ **Chat de eventos** vinculado a eventos específicos
- ✅ **Mensajes multimedia** (texto, imagen, audio, video, documentos)
- ✅ **Mensajes de IA** con tracking de tokens y costos
- ✅ **Tiempo real** con WebSockets y Subscriptions
- ✅ **Cursor pagination** optimizado para Lobe Chat
- ✅ **Aislamiento por development** (bodasdehoy, eventosorganizador, etc.)
- ✅ **Identificación de origen** (WhatsApp 💬, Chat 💭, API 🔌)
- ✅ **Tracking completo** de usage (tokens, costo, modelo IA)

### **Estadísticas:**
- ✅ **8 Queries GraphQL** disponibles
- ✅ **8 Mutations GraphQL** disponibles
- ✅ **4 Subscriptions** para tiempo real
- ✅ **100 req/min** rate limit (ajustable)
- ✅ **Compatible** con Lobe Chat, Claude Desktop, ChatGPT

---

## 🏗️ ARQUITECTURA {#arquitectura}

```
┌─────────────────────────────────────────────────────────────┐
│                CLIENTES (Múltiples Plataformas)              │
├─────────────────────────────────────────────────────────────┤
│ • Web App (React/Vue)                                        │
│ • Mobile App (React Native)                                  │
│ • Lobe Chat Harbor                                           │
│ • Claude Desktop                                             │
│ • ChatGPT Integration                                        │
└────────────────────┬────────────────────────────────────────┘
                     │ HTTPS / WebSocket
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              API GraphQL + Subscriptions                     │
│         https://api2.eventosorganizador.com/graphql          │
├─────────────────────────────────────────────────────────────┤
│ • Queries: 8 (CHAT_*)                                        │
│ • Mutations: 8 (CHAT_*)                                      │
│ • Subscriptions: 4 (CHAT_*)                                  │
│ • Rate Limit: 100 req/min                                    │
│ • Auth: Firebase UID                                         │
└────────────────────┬────────────────────────────────────────┘
                     │
        ┌────────────┴──────────────────┐
        │                               │
        ▼                               ▼
┌───────────────┐          ┌────────────────────────┐
│   MongoDB     │          │   usage_tracking       │
│   chats       │          │   (Facturación IA)     │
│               │          │                        │
│ • Chats       │          │ • source (origin)      │
│ • Mensajes    │          │ • tokens               │
│ • Metadata    │          │ • cost                 │
│               │          │ • aiModel              │
└───────────────┘          │ • chat_id              │
                           │ • client_number        │
                           └────────────────────────┘
```

### **Flujo de Mensajes:**

1. Cliente envía mensaje via `CHAT_sendMessage`
2. Backend valida permisos (participante del chat)
3. Mensaje se guarda en MongoDB
4. Si incluye `tokens/cost/aiModel`, se crea registro en `usage_tracking`
5. Subscription `CHAT_newMessage` notifica a participantes
6. Clientes reciben mensaje en tiempo real

---

## 💭 TIPOS DE CHAT {#tipos-chat}

### **1. Chat Individual**

```graphql
type CHAT_Chat {
  tipo: CHAT_ChatType!  # "individual"
  participantes: [String!]!  # Exactamente 2 UIDs
}
```

**Uso:**
- Chat privado entre dos usuarios
- Auto-creado al enviar primer mensaje
- No puede agregar más participantes

### **2. Chat Grupal**

```graphql
type CHAT_Chat {
  tipo: CHAT_ChatType!  # "grupo"
  participantes: [String!]!  # 3+ UIDs
  titulo: String  # Nombre del grupo
}
```

**Uso:**
- Chat con múltiples usuarios
- Puede agregar/remover participantes
- Configurable (notificaciones, tema)

### **3. Chat de Evento**

```graphql
type CHAT_Chat {
  tipo: CHAT_ChatType!  # "evento"
  participantes: [String!]!
  metadata: {
    evento_id: String!  # ID del evento vinculado
  }
}
```

**Uso:**
- Vinculado a un evento específico
- Participantes son: creador + compartidos del evento
- Se actualiza automáticamente al compartir evento

---

## 📩 ESTRUCTURA DE MENSAJES {#mensajes}

### **Tipo Completo de Mensaje:**

```typescript
interface CHAT_Message {
  // ══════════════════════════════════════
  // IDENTIFICACIÓN
  // ══════════════════════════════════════
  _id: string;
  id: string;  // Alias para compatibilidad
  messageId?: string;  // UUID v4 único (Lobe Chat)
  
  // ══════════════════════════════════════
  // CONTENIDO
  // ══════════════════════════════════════
  tipo: 'texto' | 'imagen' | 'sticker' | 'audio' | 'video' | 'documento';
  mensaje: string;
  content: string;  // Alias para compatibilidad (Lobe Chat usa content)
  url?: string;  // URL si es multimedia
  
  // ══════════════════════════════════════
  // PARTICIPANTES
  // ══════════════════════════════════════
  emisor: string;  // Firebase UID quien envía
  receptor: string;  // Firebase UID quien recibe
  
  // ══════════════════════════════════════
  // ESTADO
  // ══════════════════════════════════════
  estatus: 'activo' | 'borrado' | 'editado';
  status: 'activo' | 'borrado' | 'editado';  // Alias
  
  // ══════════════════════════════════════
  // TIMESTAMPS
  // ══════════════════════════════════════
  fecha_creacion: Date;
  timestamp: Date;  // Alias para fecha_creacion (Lobe Chat)
  fecha_recibido?: Date;
  fecha_visto?: Date;
  
  // ══════════════════════════════════════
  // METADATA (Archivos)
  // ══════════════════════════════════════
  metadata?: {
    fileSize?: number;
    fileName?: string;
    mimeType?: string;
    duration?: number;  // Para audio/video
  };
  
  // ══════════════════════════════════════
  // CAMPOS PARA IA (Lobe Chat)
  // ══════════════════════════════════════
  role?: 'user' | 'assistant' | 'system';
  tokens?: number;  // Tokens consumidos
  cost?: number;  // Costo en USD
  aiProvider?: string;  // "openai" | "anthropic" | "ollama"
  aiModel?: string;  // "gpt-4" | "claude-3" | "llama3.2"
}
```

### **Campos IA Explicados:**

| Campo | Tipo | Descripción | Ejemplo |
|-------|------|-------------|---------|
| `role` | string | Rol del mensaje | `"user"`, `"assistant"`, `"system"` |
| `tokens` | number | Tokens consumidos | `1500` |
| `cost` | number | Costo en USD | `0.045` |
| `aiProvider` | string | Proveedor de IA | `"openai"`, `"anthropic"`, `"ollama"` |
| `aiModel` | string | Modelo específico | `"gpt-4"`, `"claude-3-sonnet"`, `"llama3.2"` |

---

## 📊 QUERIES GRAPHQL {#queries}

### **1. OBTENER CHATS DEL USUARIO** ⭐ LOBE CHAT

```graphql
query GetUserChats {
  CHAT_getUserChatsCursor(
    userId: "firebase_uid_123"
    development: "bodasdehoy"  # Requerido
    limit: 20
    cursor: "cursor_abc123"  # Opcional (pagination)
  ) {
    chats {
      _id
      titulo
      tipo  # individual, grupo, evento
      participantes
      development
      unreadCount  # Mensajes no leídos
      lastMessageAt  # Último mensaje
      
      # Último mensaje preview:
      mensajes {
        _id
        mensaje
        emisor
        fecha_creacion
      }
      
      metadata {
        evento_id
        creado_por
        fecha_creacion
        fecha_ultima_actividad
        activo
      }
      
      configuracion {
        notificaciones
        tema
        idioma
      }
      
      createdAt
      updatedAt
    }
    nextCursor  # Para siguiente página
    hasMore  # ¿Hay más chats?
  }
}
```

**Uso:**
- ✅ Devuelve chats del usuario con cursor pagination
- ✅ Optimizado para Lobe Chat
- ✅ Incluye contador de no leídos
- ✅ Filtrado por `development` automático

---

### **2. OBTENER MENSAJES DE UN CHAT** ⭐ LOBE CHAT

```graphql
query GetChatMessages {
  CHAT_getChatMessagesCursor(
    chatId: "chat_456"
    development: "bodasdehoy"
    limit: 50
    cursor: "cursor_xyz789"  # Opcional
  ) {
    messages {
      _id
      id
      messageId
      tipo
      mensaje
      content  # Alias
      url
      emisor
      receptor
      fecha_creacion
      timestamp  # Alias
      fecha_recibido
      fecha_visto
      estatus
      status  # Alias
      metadata {
        fileSize
        fileName
        mimeType
        duration
      }
      
      # ✅ Campos IA:
      role
      tokens
      cost
      aiProvider
      aiModel
    }
    nextCursor
    hasMore
  }
}
```

**Uso:**
- ✅ Paginación eficiente con cursor
- ✅ Incluye aliases para compatibilidad
- ✅ Campos IA para tracking

---

### **3. OBTENER CHAT POR ID**

```graphql
query GetChatById {
  CHAT_getChatById(
    chatId: "chat_456"
    development: "bodasdehoy"
  ) {
    _id
    titulo
    tipo
    participantes
    mensajes {
      _id
      mensaje
      emisor
      fecha_creacion
    }
    metadata {
      evento_id
      activo
    }
  }
}
```

---

### **4. OBTENER CHAT INDIVIDUAL ENTRE DOS USUARIOS**

```graphql
query GetIndividualChat {
  CHAT_getIndividualChat(
    user1Id: "uid_123"
    user2Id: "uid_456"
    development: "bodasdehoy"
  ) {
    _id
    participantes
    mensajes {
      _id
      mensaje
      emisor
    }
  }
}
```

**Uso:**
- ✅ Busca chat existente entre dos usuarios
- ✅ Retorna `null` si no existe
- ✅ Útil antes de crear chat nuevo

---

### **5. OBTENER CHATS DE UN EVENTO**

```graphql
query GetEventChats {
  CHAT_getEventChats(
    eventoId: "evt_789"
    development: "bodasdehoy"
    limit: 20
  ) {
    total
    chats {
      _id
      titulo
      tipo
      participantes
      metadata {
        evento_id
      }
    }
    hasNextPage
  }
}
```

---

### **6. BUSCAR CHATS**

```graphql
query SearchChats {
  CHAT_searchChats(
    query: "catering"
    userId: "uid_123"
    limit: 20
  ) {
    total
    chats {
      _id
      titulo
      mensajes {
        mensaje
      }
    }
  }
}
```

**Uso:**
- ✅ Búsqueda en títulos y contenido de mensajes
- ✅ Full-text search

---

### **7. ESTADÍSTICAS DE CHAT**

```graphql
query GetChatStats {
  CHAT_getChatStats(
    userId: "uid_123"
    development: "bodasdehoy"
  ) {
    totalChats
    totalMensajes
    mensajesNoLeidos
    chatsActivos
    activeChats  # Alias
    ultimaActividad
    lastActivity  # Alias
  }
}
```

---

## 🔧 MUTATIONS GRAPHQL {#mutations}

### **1. CREAR CHAT**

```graphql
mutation CreateChat {
  CHAT_createChat(
    input: {
      titulo: "Chat Catering Boda"
      tipo: grupo
      participantes: ["uid_123", "uid_456", "uid_789"]
      evento_id: "evt_001"
      development: "bodasdehoy"
      
      # Opcional - Lobe Chat:
      metadata: {
        source: "lobechat"
        aiProvider: "openai"
        aiModel: "gpt-4"
      }
      
      configuracion: {
        notificaciones: true
        tema: "light"
        idioma: "es"
      }
    }
    creadoPor: "uid_123"
  ) {
    _id
    titulo
    tipo
    participantes
    development
  }
}
```

---

### **2. ENVIAR MENSAJE** ⭐ CON TRACKING IA

```graphql
mutation SendMessage {
  CHAT_sendMessage(
    chatId: "chat_456"
    input: {
      tipo: texto
      receptor: "uid_456"
      mensaje: "¿Cuántos invitados confirmados tenemos?"
      content: "¿Cuántos invitados confirmados tenemos?"  # Alias
      
      # ✅ CAMPOS IA (si es respuesta de IA):
      role: "assistant"
      tokens: 1200
      cost: 0.036
      aiProvider: "openai"
      aiModel: "gpt-4"
      messageId: "uuid-v4-12345"
      timestamp: "2025-10-13T10:30:00Z"
    }
    emisorId: "uid_123"
  ) {
    _id
    id
    messageId
    mensaje
    content
    fecha_creacion
    timestamp
    
    # Campos IA:
    role
    tokens
    cost
    aiProvider
    aiModel
  }
}
```

**⚠️ IMPORTANTE:**  
Si incluyes `tokens`, `cost`, `aiModel`, se creará automáticamente un registro en `usage_tracking` para facturación.

---

### **3. ACTUALIZAR MENSAJE**

```graphql
mutation UpdateMessage {
  CHAT_updateMessage(
    chatId: "chat_456"
    messageId: "msg_789"
    input: {
      mensaje: "Mensaje editado"
      estatus: editado
    }
  ) {
    _id
    mensaje
    estatus
  }
}
```

---

### **4. ELIMINAR MENSAJE**

```graphql
mutation DeleteMessage {
  CHAT_deleteMessage(
    chatId: "chat_456"
    messageId: "msg_789"
  )  # Retorna Boolean
}
```

---

### **5. MARCAR MENSAJES COMO LEÍDOS**

```graphql
mutation MarkMessagesAsRead {
  CHAT_markMessagesAsRead(
    input: {
      chatId: "chat_456"
      messageIds: ["msg_001", "msg_002", "msg_003"]
    }
  )  # Retorna Boolean
}
```

---

### **6. AGREGAR PARTICIPANTE (Grupo)**

```graphql
mutation AddParticipant {
  CHAT_addParticipant(
    chatId: "chat_456"
    userId: "uid_999"
  ) {
    _id
    participantes
  }
}
```

---

### **7. REMOVER PARTICIPANTE (Grupo)**

```graphql
mutation RemoveParticipant {
  CHAT_removeParticipant(
    chatId: "chat_456"
    userId: "uid_999"
  ) {
    _id
    participantes
  }
}
```

---

### **8. ACTUALIZAR CONFIGURACIÓN**

```graphql
mutation UpdateChatConfig {
  CHAT_updateChatConfig(
    chatId: "chat_456"
    config: {
      notificaciones: false
      tema: "dark"
      idioma: "en"
    }
  ) {
    _id
    configuracion {
      notificaciones
      tema
      idioma
    }
  }
}
```

---

## 🔔 SUBSCRIPTIONS (TIEMPO REAL) {#subscriptions}

### **1. NUEVO MENSAJE**

```graphql
subscription {
  CHAT_newMessage(chatId: "chat_456") {
    _id
    mensaje
    emisor
    fecha_creacion
    role
    tokens
  }
}
```

**Uso:**
- ✅ Se dispara cuando llega un nuevo mensaje
- ✅ Actualiza UI en tiempo real

---

### **2. CHAT ACTUALIZADO**

```graphql
subscription {
  CHAT_chatUpdated(chatId: "chat_456") {
    _id
    titulo
    participantes
    updatedAt
  }
}
```

**Uso:**
- ✅ Se dispara al agregar/remover participantes
- ✅ Se dispara al cambiar configuración

---

### **3. MENSAJE ACTUALIZADO**

```graphql
subscription {
  CHAT_messageUpdated(chatId: "chat_456") {
    _id
    mensaje
    estatus
    fecha_visto
  }
}
```

**Uso:**
- ✅ Se dispara al editar mensaje
- ✅ Se dispara al marcar como leído

---

### **4. ESTADO DE USUARIO**

```graphql
subscription {
  CHAT_userStatusChanged(userId: "uid_123") {
    userId
    online
    lastSeen
  }
}
```

**Uso:**
- ✅ Indica si el usuario está online/offline
- ✅ Muestra última conexión

---

## 🤖 INTEGRACIÓN LOBE CHAT {#lobe-chat}

### **Configuración de Lobe Chat Harbor:**

```json
{
  "graphqlEndpoint": "https://api2.eventosorganizador.com/graphql",
  "development": "bodasdehoy",
  "userAuth": {
    "firebaseToken": "YOUR_FIREBASE_JWT"
  },
  "aiConfig": {
    "provider": "openai",
    "model": "gpt-4",
    "trackUsage": true
  }
}
```

### **Flujo de Mensajes en Lobe Chat:**

1. Usuario escribe: "¿Cuántos invitados confirmados?"
2. Lobe Chat envía mensaje con `role: "user"`
3. IA procesa y genera respuesta
4. Lobe Chat envía respuesta con:
   - `role: "assistant"`
   - `tokens: 1200`
   - `cost: 0.036`
   - `aiModel: "gpt-4"`
5. Backend guarda mensaje + crea registro en `usage_tracking`
6. Subscription notifica a frontend
7. UI muestra respuesta en tiempo real

### **Queries Específicas de Lobe Chat:**

```graphql
# ✅ NUEVO: Paginación con cursor (más eficiente)
CHAT_getUserChatsCursor
CHAT_getChatMessagesCursor

# ✅ LEGACY: Offset pagination (mantener compatibilidad)
CHAT_getUserChats
CHAT_getChatMessages
```

---

## 📊 TRACKING DE TOKENS IA {#tracking-ia}

### **Colección: `usage_tracking`**

Cada vez que envías un mensaje con campos IA (`tokens`, `cost`, `aiModel`), se crea automáticamente un registro:

```typescript
interface UsageTracking {
  _id: string;
  chat_id: string;
  message_id: string;
  
  // Usuario y evento:
  user_id: string;  // Firebase UID
  event_id?: string;
  
  // Proveedor IA:
  ai_provider: string;  // "openai", "anthropic", "ollama"
  ai_model: string;  // "gpt-4", "claude-3", etc.
  
  // Tokens y costo:
  input_tokens: number;
  output_tokens: number;
  total_tokens: number;
  cost: number;  // USD
  
  // Origen:
  source: 'whatsapp' | 'chat' | 'api';  // ⭐ IDENTIFICAR ORIGEN
  client_number?: string;  // Si es WhatsApp
  
  // Aislamiento:
  development: string;  // bodasdehoy, eventosorganizador, etc.
  
  // Timestamps:
  created_at: Date;
  billed: boolean;  // ¿Ya facturado?
}
```

### **Query para Obtener Estadísticas de Uso:**

```graphql
query GetUsageStats {
  getUsageTrackingStats(
    userId: "uid_123"
    dateFrom: "2025-10-01"
    dateTo: "2025-10-31"
  ) {
    totalTokens
    totalCost
    byProvider {
      provider
      tokens
      cost
    }
    bySource {
      source  # whatsapp, chat, api
      tokens
      cost
    }
  }
}
```

---

## 🌐 IDENTIFICAR ORIGEN (WhatsApp/Chat/API) {#origen}

### **Campo: `source` en `usage_tracking`**

| Source | Icono | Descripción | Color |
|--------|-------|-------------|-------|
| `whatsapp` | 💬 | Mensaje de WhatsApp | Verde #25D366 |
| `chat` | 💭 | Chat interno de la app | Azul #0084FF |
| `api` | 🔌 | Integración API externa | Gris #6B7280 |

### **Cómo se Determina el Origen:**

1. **WhatsApp:** Si incluye `client_number` (número de teléfono)
2. **Chat:** Si se envía desde frontend web/mobile sin `client_number`
3. **API:** Si se envía desde integración externa (Lobe Chat, MCP, etc.)

### **Ejemplo en UI:**

```tsx
// React Component
function MessageItem({ message, usage }) {
  const getSourceIcon = () => {
    if (usage.source === 'whatsapp') return '💬';
    if (usage.source === 'chat') return '💭';
    if (usage.source === 'api') return '🔌';
  };
  
  return (
    <div className="message">
      <span className="source-icon">{getSourceIcon()}</span>
      <p>{message.content}</p>
      {usage.tokens && (
        <small>
          {usage.tokens} tokens · ${usage.cost.toFixed(4)}
        </small>
      )}
    </div>
  );
}
```

---

## 💡 EJEMPLOS DE USO {#ejemplos}

### **Ejemplo 1: Chat WhatsApp Estilo Interface**

```tsx
// Lista de conversaciones (izquierda)
const { data: chatsData } = useQuery(GET_USER_CHATS, {
  variables: {
    userId: currentUser.uid,
    development: "bodasdehoy",
    limit: 20
  }
});

// Mensajes del chat seleccionado (centro)
const { data: messagesData } = useQuery(GET_CHAT_MESSAGES, {
  variables: {
    chatId: selectedChatId,
    development: "bodasdehoy",
    limit: 50
  }
});

// Subscription para nuevos mensajes
useSubscription(NEW_MESSAGE_SUBSCRIPTION, {
  variables: { chatId: selectedChatId },
  onData: ({ data }) => {
    // Agregar mensaje a la lista
    setMessages(prev => [...prev, data.CHAT_newMessage]);
  }
});
```

---

### **Ejemplo 2: Enviar Mensaje con Tracking IA**

```typescript
// Frontend - Usuario envía mensaje
const sendUserMessage = async (text: string) => {
  await sendMessage({
    variables: {
      chatId: selectedChatId,
      input: {
        tipo: 'texto',
        receptor: otherUserId,
        mensaje: text,
        content: text,
        role: 'user'
      },
      emisorId: currentUser.uid
    }
  });
};

// Backend - IA responde
const sendAIResponse = async (response: string, tokens: number) => {
  await sendMessage({
    variables: {
      chatId: selectedChatId,
      input: {
        tipo: 'texto',
        receptor: currentUser.uid,
        mensaje: response,
        content: response,
        role: 'assistant',
        tokens: tokens,
        cost: (tokens / 1000) * 0.03,  // $0.03 por 1K tokens
        aiProvider: 'openai',
        aiModel: 'gpt-4',
        messageId: generateUUID()
      },
      emisorId: 'ai_assistant'
    }
  });
};
```

---

### **Ejemplo 3: Interfaz Lobe Chat Compatible**

```typescript
// Lobe Chat envía mensaje
const sendLobeMessage = async (userMessage: string) => {
  // 1. Enviar mensaje del usuario
  await CHAT_sendMessage({
    chatId: lobeChatId,
    input: {
      tipo: 'texto',
      receptor: 'ai_assistant',
      mensaje: userMessage,
      content: userMessage,
      role: 'user',
      timestamp: new Date().toISOString()
    },
    emisorId: userId
  });
  
  // 2. IA procesa...
  const aiResponse = await processWithAI(userMessage);
  
  // 3. Enviar respuesta de IA con tracking
  await CHAT_sendMessage({
    chatId: lobeChatId,
    input: {
      tipo: 'texto',
      receptor: userId,
      mensaje: aiResponse.text,
      content: aiResponse.text,
      role: 'assistant',
      tokens: aiResponse.usage.total_tokens,
      cost: aiResponse.usage.total_tokens * 0.00003,
      aiProvider: 'openai',
      aiModel: 'gpt-4',
      messageId: generateUUID(),
      timestamp: new Date().toISOString()
    },
    emisorId: 'ai_assistant'
  });
};
```

---

## 🎯 MEJORES PRÁCTICAS {#mejores-practicas}

### **1. Performance:**
- ✅ Usar cursor pagination (`CHAT_getUserChatsCursor`) para listas grandes
- ✅ Limitar mensajes cargados inicialmente (50 últimos)
- ✅ Implementar lazy loading al scroll
- ✅ Usar Subscriptions solo para chats activos

### **2. Seguridad:**
- ✅ Validar que usuario sea participante antes de enviar mensaje
- ✅ No exponer `_id` de MongoDB en URLs
- ✅ Usar Firebase UID para identificación
- ✅ Rate limiting (100 req/min)

### **3. UX:**
- ✅ Mostrar indicador de "escribiendo..."
- ✅ Marcar mensajes como leídos al abrir chat
- ✅ Notificaciones push para nuevos mensajes
- ✅ Sincronización offline (service workers)

### **4. Tracking IA:**
- ✅ Siempre incluir `tokens`, `cost`, `aiModel` para facturación correcta
- ✅ Usar `messageId` único (UUID v4)
- ✅ Incluir `source` para identificar origen
- ✅ Monitorear costos en tiempo real

### **5. Aislamiento:**
- ✅ Siempre especificar `development` en todas las queries
- ✅ Validar `development` en backend
- ✅ No mezclar chats de diferentes developments

---

## 📞 ENDPOINTS

**Producción:**
```
https://api2.eventosorganizador.com/graphql
WebSocket: wss://api2.eventosorganizador.com/graphql
```

**Test:**
```
https://testapi2.eventosorganizador.com/graphql
WebSocket: wss://testapi2.eventosorganizador.com/graphql
```

**Rate Limits:**
- ✅ GraphQL: 100 requests/minuto
- ✅ Subscriptions: Sin límite (pero validado por autenticación)

---

## ✅ SCHEMA GRAPHQL COMPLETO

```graphql
# ══════════════════════════════════════════════
# ENUMS
# ══════════════════════════════════════════════
enum CHAT_MessageType {
  texto
  imagen
  sticker
  audio
  video
  documento
}

enum CHAT_MessageStatus {
  activo
  borrado
  editado
}

enum CHAT_ChatType {
  individual
  grupo
  evento
}

# ══════════════════════════════════════════════
# TYPES
# ══════════════════════════════════════════════
type CHAT_Message {
  _id: ID!
  id: ID!
  tipo: CHAT_MessageType!
  fecha_creacion: String!
  timestamp: String!
  fecha_recibido: String
  fecha_visto: String
  emisor: String!
  receptor: String!
  mensaje: String!
  content: String!
  url: String
  estatus: CHAT_MessageStatus!
  status: CHAT_MessageStatus!
  metadata: CHAT_FileMetadata
  
  # IA Fields:
  role: String
  tokens: Int
  cost: Float
  aiProvider: String
  aiModel: String
  messageId: ID
}

type CHAT_Chat {
  _id: ID!
  titulo: String
  tipo: CHAT_ChatType!
  participantes: [String!]!
  mensajes: [CHAT_Message!]!
  configuracion: CHAT_ChatConfig
  metadata: CHAT_ChatMetadata!
  development: String
  unreadCount: Int
  lastMessageAt: String
  createdAt: String!
  updatedAt: String!
}

# ══════════════════════════════════════════════
# QUERIES
# ══════════════════════════════════════════════
type Query {
  # Cursor pagination (Lobe Chat):
  CHAT_getUserChatsCursor(
    userId: String!
    development: String!
    limit: Int = 20
    cursor: String
  ): CHAT_UserChatsResult!
  
  CHAT_getChatMessagesCursor(
    chatId: String!
    development: String!
    limit: Int = 50
    cursor: String
  ): CHAT_ChatMessagesResult!
  
  # Legacy (compatibilidad):
  CHAT_getChatById(chatId: String!, development: String): CHAT_Chat
  CHAT_getIndividualChat(user1Id: String!, user2Id: String!, development: String): CHAT_Chat
  CHAT_getChatStats(userId: String!, development: String): CHAT_ChatStats!
}

# ══════════════════════════════════════════════
# MUTATIONS
# ══════════════════════════════════════════════
type Mutation {
  CHAT_createChat(input: CHAT_CreateChatInput!, creadoPor: String!): CHAT_Chat!
  CHAT_sendMessage(chatId: String!, input: CHAT_CreateMessageInput!, emisorId: String!): CHAT_Message!
  CHAT_updateMessage(chatId: String!, messageId: String!, input: CHAT_UpdateMessageInput!): CHAT_Message!
  CHAT_deleteMessage(chatId: String!, messageId: String!): Boolean!
  CHAT_markMessagesAsRead(input: CHAT_MarkAsReadInput!): Boolean!
  CHAT_addParticipant(chatId: String!, userId: String!): CHAT_Chat!
  CHAT_removeParticipant(chatId: String!, userId: String!): CHAT_Chat!
}

# ══════════════════════════════════════════════
# SUBSCRIPTIONS
# ══════════════════════════════════════════════
type Subscription {
  CHAT_newMessage(chatId: String!): CHAT_Message!
  CHAT_chatUpdated(chatId: String!): CHAT_Chat!
  CHAT_messageUpdated(chatId: String!): CHAT_Message!
  CHAT_userStatusChanged(userId: String!): CHAT_UserStatus!
}
```

---

## ✅ CONCLUSIÓN

El sistema de chat está **100% operativo** con:

- ✅ 8 Queries GraphQL
- ✅ 8 Mutations GraphQL
- ✅ 4 Subscriptions en tiempo real
- ✅ Integración completa con Lobe Chat
- ✅ Tracking de tokens y costos IA
- ✅ Identificación de origen (WhatsApp/Chat/API)
- ✅ Cursor pagination optimizada
- ✅ Aislamiento por development

**🚀 Sistema listo para producción con IA!**

---

*Documentación actualizada el 13 de Octubre 2025*  
*Versión 4.0.0*

