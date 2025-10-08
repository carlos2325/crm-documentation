# 📱 **DOCUMENTACIÓN COMPLETA - FUNCIONALIDAD DE CHAT**

## 🎯 **RESUMEN EJECUTIVO**

El sistema de chat de bodasdehoy.com es una funcionalidad completa que permite comunicación en tiempo real entre usuarios, con soporte para mensajes multimedia, gestión de conversaciones grupales y tracking detallado de uso y costos. La información se almacena en MongoDB con un sistema robusto de tracking de tokens y facturación.

---

## 🏗️ **ARQUITECTURA DEL SISTEMA DE CHAT**

### **1. ESTRUCTURA DE DATOS**

#### **📊 Base de Datos Principal: `api-directorio-bodas`**
- **Colección**: `chats`
- **Propósito**: Almacenamiento de conversaciones y mensajes
- **Índices**: Optimizados para consultas por participantes, eventos y fechas

#### **📊 Base de Datos de Eventos: `prueba1`**
- **Colección**: `chats`
- **Propósito**: Chats específicos relacionados con eventos
- **Colección**: `messages`
- **Propósito**: Mensajes individuales (estructura alternativa)

#### **📊 Base de Datos de Tracking: `api-directorio-bodas`**
- **Colección**: `usage_tracking`
- **Propósito**: Tracking detallado de tokens, costos y uso de IA

---

## 📋 **MODELOS DE DATOS**

### **1. MODELO PRINCIPAL DE CHAT (`IChat`)**

```typescript
interface IChat {
  _id: string;
  titulo?: string;
  tipo: 'individual' | 'grupo' | 'evento';
  participantes: string[]; // Array de UIDs de Firebase
  mensajes: IChatMessage[];
  configuracion?: {
    notificaciones: boolean;
    tema?: string;
    idioma?: string;
  };
  metadata?: {
    evento_id?: string; // Si está relacionado con un evento
    creado_por: string;
    fecha_creacion: Date;
    fecha_ultima_actividad: Date;
    activo: boolean;
  };
}
```

### **2. MODELO DE MENSAJE (`IChatMessage`)**

```typescript
interface IChatMessage {
  tipo: 'texto' | 'imagen' | 'sticker' | 'audio' | 'video' | 'documento';
  fecha_creacion: Date;
  fecha_recibido?: Date;
  fecha_visto?: Date;
  emisor: string; // UID de Firebase del emisor
  receptor: string; // UID de Firebase del receptor
  mensaje: string;
  url?: string; // URL para archivos multimedia
  estatus: 'activo' | 'borrado' | 'editado';
  metadata?: {
    fileSize?: number;
    fileName?: string;
    mimeType?: string;
    duration?: number; // Para audio/video
  };
}
```

### **3. MODELO DE TRACKING DE USO (`IUsageTracking`)**

```typescript
interface IUsageTracking {
  session_id: string;
  client_number: string;
  business_number?: string;
  chat_id?: string;
  message_id: string;
  source: 'whatsapp' | 'chat' | 'api';
  message_text?: string;
  response_text?: string;
  billing_items: IBillingItem[];
  total_cost_usd: number;
  total_processing_time_ms: number;
  development: 'development' | 'production';
  error_occurred: boolean;
  error_message?: string;
  billing_period: string;
  billed: boolean;
  billed_at?: Date;
}
```

---

## 🔧 **FUNCIONALIDADES IMPLEMENTADAS**

### **1. QUERIES GRAPHQL DISPONIBLES**

#### **📥 Consultas de Chat**
- `CHAT_getChatById(chatId: String!)`: Obtener chat por ID
- `CHAT_getUserChats(userId: String!, skip: Int, limit: Int, filters: CHAT_ChatFilters)`: Obtener chats del usuario
- `CHAT_getChatMessages(chatId: String!, skip: Int, limit: Int, filters: CHAT_MessageFilters)`: Obtener mensajes de un chat
- `CHAT_searchChats(query: String!, userId: String!, skip: Int, limit: Int)`: Buscar chats
- `CHAT_getIndividualChat(user1Id: String!, user2Id: String!)`: Obtener chat individual entre dos usuarios
- `CHAT_getEventChats(eventoId: String!, skip: Int, limit: Int)`: Obtener chats de un evento
- `CHAT_getChatStats(userId: String!)`: Obtener estadísticas de chat

#### **📤 Mutaciones de Chat**
- `CHAT_createChat(input: CHAT_CreateChatInput!, creadoPor: String!)`: Crear nuevo chat
- `CHAT_updateChat(chatId: String!, input: CHAT_UpdateChatInput!)`: Actualizar chat
- `CHAT_deleteChat(chatId: String!)`: Eliminar chat (marcar como inactivo)
- `CHAT_sendMessage(chatId: String!, input: CHAT_CreateMessageInput!, emisorId: String!)`: Enviar mensaje
- `CHAT_updateMessage(chatId: String!, messageId: String!, input: CHAT_UpdateMessageInput!)`: Actualizar mensaje
- `CHAT_deleteMessage(chatId: String!, messageId: String!)`: Eliminar mensaje
- `CHAT_markMessagesAsRead(input: CHAT_MarkAsReadInput!)`: Marcar mensajes como leídos
- `CHAT_addParticipant(chatId: String!, userId: String!)`: Agregar participante a chat grupal
- `CHAT_removeParticipant(chatId: String!, userId: String!)`: Remover participante de chat grupal
- `CHAT_updateChatConfig(chatId: String!, config: CHAT_ChatConfigInput!)`: Actualizar configuración del chat

#### **🔄 Subscripciones en Tiempo Real**
- `CHAT_newMessage(chatId: String!)`: Nuevo mensaje en chat
- `CHAT_chatUpdated(chatId: String!)`: Chat actualizado
- `CHAT_messageUpdated(chatId: String!)`: Mensaje actualizado
- `CHAT_userStatusChanged(userId: String!)`: Usuario conectado/desconectado

### **2. HERRAMIENTAS MCP DISPONIBLES**

#### **📱 Funciones de Chat**
- `getUserChats(userId: string, limit: number)`: Obtener chats del usuario
- `getChatMessages(chatId: string, limit: number)`: Obtener mensajes de un chat
- `createChat(userId: string, title: string)`: Crear nuevo chat
- `sendMessage(chatId: string, userId: string, content: string, role: 'user' | 'assistant')`: Enviar mensaje
- `getChatStats()`: Obtener estadísticas de chats
- `searchChats(query: string, userId?: string, limit: number)`: Buscar chats

---

## 💰 **SISTEMA DE TRACKING DE TOKENS Y COSTOS**

### **1. CONFIGURACIÓN DE COSTOS**

```typescript
export const COST_CONFIG = {
  ai_models: {
    'llama3.2:3b': { 
      input_token: 0.0001, 
      output_token: 0.0002, 
      memory_base_mb: 512 
    },
    'claude-3-sonnet': { 
      input_token: 0.003, 
      output_token: 0.015, 
      memory_base_mb: 1024 
    },
    'gpt-4': { 
      input_token: 0.03, 
      output_token: 0.06, 
      memory_base_mb: 2048 
    },
    'gpt-3.5-turbo': {
      input_token: 0.0015,
      output_token: 0.002,
      memory_base_mb: 512
    }
  },
  infrastructure: {
    memory_per_mb_second: 0.0001,
    storage_per_gb_month: 0.023,
    compute_per_hour: 0.10,
    bandwidth_per_gb: 0.09
  },
  tools: {
    mcp_tool_base_cost: 0.001
  }
};
```

### **2. TIPOS DE TRACKING**

#### **🤖 Tokens de IA**
- **Input Tokens**: Tokens de entrada procesados por el modelo
- **Output Tokens**: Tokens de salida generados por el modelo
- **Total Tokens**: Suma de input + output tokens
- **Costo por Token**: Variable según el modelo utilizado

#### **💾 Uso de Memoria**
- **Memoria Base**: MB base requeridos por el modelo
- **Tiempo de Procesamiento**: Segundos de uso de memoria
- **Costo por MB/segundo**: $0.0001 por MB/segundo

#### **🔧 Herramientas MCP**
- **Costo Base**: $0.001 por uso de herramienta
- **Tracking por Herramienta**: Conteo individual de cada herramienta utilizada

### **3. ESTRUCTURA DE FACTURACIÓN**

```typescript
interface IBillingItem {
  type: 'ai_tokens' | 'memory' | 'mcp_tool' | 'storage' | 'compute' | 'bandwidth';
  category: 'ai' | 'infrastructure' | 'storage';
  description: string;
  quantity: number;
  unit: 'tokens' | 'mb_seconds' | 'requests' | 'gb' | 'hours';
  unit_cost_usd: number;
  total_cost_usd: number;
  metadata: {
    model?: string;
    input_tokens?: number;
    output_tokens?: number;
    tool_name?: string;
    usage_count?: number;
    // ... otros metadatos específicos
  };
}
```

---

## 🗄️ **ALMACENAMIENTO DE INFORMACIÓN**

### **1. UBICACIÓN DE DATOS**

#### **📊 Base de Datos Principal (`api-directorio-bodas`)**
```
MongoDB Atlas Cluster: cluster0.dhikg.mongodb.net
Base de Datos: api-directorio-bodas
Colecciones:
├── chats (conversaciones principales)
├── usage_tracking (tracking de tokens y costos)
├── developmentmessages (mensajes de desarrollo)
└── logmessages (logs del sistema)
```

#### **📊 Base de Datos de Eventos (`prueba1`)**
```
MongoDB Atlas Cluster: cluster0.dhikg.mongodb.net
Base de Datos: prueba1
Colecciones:
├── chats (chats relacionados con eventos)
├── messages (mensajes individuales)
└── eventos (eventos principales)
```

### **2. ESTRUCTURA DE ALMACENAMIENTO**

#### **💬 Conversaciones**
- **Ubicación**: Colección `chats` en ambas bases de datos
- **Estructura**: Documentos anidados con array de mensajes
- **Índices**: Optimizados para consultas por participantes y fechas
- **Retención**: Permanente (sin límite de tiempo)

#### **🔢 Tokens y Costos**
- **Ubicación**: Colección `usage_tracking` en base principal
- **Estructura**: Documentos individuales por interacción
- **Índices**: Por cliente, período de facturación y fecha
- **Retención**: Permanente para facturación

#### **📱 Mensajes Multimedia**
- **Almacenamiento**: URLs en campo `url` del mensaje
- **Metadata**: Información de archivo en campo `metadata`
- **Tipos Soportados**: Imagen, audio, video, documento, sticker

---

## 🔐 **SEGURIDAD Y PERMISOS**

### **1. AUTENTICACIÓN**
- **Firebase Auth**: UIDs de Firebase como identificadores
- **Contexto GraphQL**: Usuario autenticado en cada request
- **Validación**: Verificación de permisos por chat

### **2. PERMISOS DE CHAT**
```typescript
interface ChatPermissions {
  canViewConversations: boolean;
  canSendMessages: boolean;
  canManageParticipants: boolean;
  canDeleteMessages: boolean;
  canUpdateChatConfig: boolean;
}
```

### **3. VALIDACIONES**
- **Acceso a Chat**: Verificación de participación
- **Envío de Mensajes**: Validación de permisos de escritura
- **Gestión de Participantes**: Solo creadores y administradores
- **Eliminación**: Soft delete (marcar como inactivo)

---

## 📈 **ESTADÍSTICAS Y MÉTRICAS**

### **1. ESTADÍSTICAS DE CHAT**
```typescript
interface ChatStats {
  totalChats: number;
  totalMensajes: number;
  mensajesNoLeidos: number;
  chatsActivos: number;
  ultimaActividad: string;
}
```

### **2. MÉTRICAS DE COSTOS**
- **Costo Total por Período**: Suma de todos los billing items
- **Costo por Categoría**: AI, Infrastructure, Storage
- **Costo por Tipo**: Tokens, Memoria, Herramientas
- **Tendencias**: Análisis de costos a lo largo del tiempo

---

## 🚀 **INTEGRACIÓN CON N8N**

### **1. WORKFLOW DE CHAT**
- **Trigger**: Mensajes entrantes desde WhatsApp/Chat
- **Procesamiento**: Análisis con IA y generación de respuestas
- **Tracking**: Registro automático de tokens y costos
- **Respuesta**: Envío de respuesta al usuario

### **2. TRACKING AUTOMÁTICO**
- **Captura de Datos**: Automática en cada interacción
- **Cálculo de Costos**: En tiempo real
- **Almacenamiento**: Envío a API GraphQL
- **Facturación**: Por períodos mensuales

---

## 🔧 **CONFIGURACIÓN Y DEPLOYMENT**

### **1. VARIABLES DE ENTORNO**
```bash
# MongoDB
MONGODB_URI=mongodb+srv://admin:password@cluster0.dhikg.mongodb.net/api-directorio-bodas
MONGODB_DBEVENT_URI=mongodb+srv://admin:password@cluster0.dhikg.mongodb.net/prueba1

# Firebase
FIREBASE_PROJECT_ID=bodasdehoy-1063
FIREBASE_PRIVATE_KEY=-----BEGIN PRIVATE KEY-----
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-9tuuo@bodasdehoy-1063.iam.gserviceaccount.com

# N8N Integration
N8N_WEBHOOK_URL=https://workflow.eventosorganizador.com/webhook/chat
```

### **2. DOCKER CONFIGURATION**
```yaml
# docker-compose.yml
services:
  api-prod:
    environment:
      NODE_ENV: production
      PORT: 2000
      MONGODB_URI: ${MONGODB_URI}
      MONGODB_DBEVENT_URI: ${MONGODB_DBEVENT_URI}
    ports:
      - "4000:2000"
```

---

## 📚 **EJEMPLOS DE USO**

### **1. CREAR CHAT INDIVIDUAL**
```graphql
mutation {
  CHAT_createChat(
    input: {
      tipo: INDIVIDUAL
      participantes: ["user1_uid", "user2_uid"]
      titulo: "Chat entre usuarios"
    }
    creadoPor: "user1_uid"
  ) {
    _id
    titulo
    tipo
    participantes
    metadata {
      fecha_creacion
      creado_por
    }
  }
}
```

### **2. ENVIAR MENSAJE**
```graphql
mutation {
  CHAT_sendMessage(
    chatId: "chat_id_here"
    input: {
      tipo: TEXTO
      receptor: "user2_uid"
      mensaje: "Hola, ¿cómo estás?"
    }
    emisorId: "user1_uid"
  ) {
    _id
    mensaje
    fecha_creacion
    emisor
    receptor
  }
}
```

### **3. OBTENER CHATS DEL USUARIO**
```graphql
query {
  CHAT_getUserChats(
    userId: "user_uid_here"
    limit: 10
    skip: 0
  ) {
    total
    chats {
      _id
      titulo
      tipo
      metadata {
        fecha_ultima_actividad
      }
      mensajes {
        mensaje
        fecha_creacion
        emisor
      }
    }
    hasNextPage
  }
}
```

---

## 🎯 **CONCLUSIONES**

### **✅ FUNCIONALIDADES IMPLEMENTADAS**
1. **Sistema de Chat Completo**: Individual, grupal y por eventos
2. **Mensajes Multimedia**: Soporte para texto, imágenes, audio, video, documentos
3. **Tiempo Real**: Subscripciones GraphQL para actualizaciones instantáneas
4. **Tracking de Tokens**: Sistema completo de facturación y costos
5. **Seguridad**: Autenticación Firebase y validación de permisos
6. **Integración N8N**: Workflow automatizado para procesamiento de mensajes

### **📊 ALMACENAMIENTO CONFIRMADO**
- **Conversaciones**: MongoDB Atlas (colección `chats`)
- **Tokens**: MongoDB Atlas (colección `usage_tracking`)
- **Multimedia**: URLs almacenadas en mensajes
- **Configuración**: Variables de entorno y Docker

### **🔧 HERRAMIENTAS DISPONIBLES**
- **GraphQL API**: 15+ queries y mutations
- **MCP Tools**: 6 funciones para gestión de chat
- **N8N Integration**: Workflow automatizado
- **Tracking System**: Cálculo automático de costos

---

## 📞 **CONTACTO Y SOPORTE**

Para más información sobre la funcionalidad de chat:
- **Documentación Técnica**: Este documento
- **API GraphQL**: Disponible en `/graphql`
- **MCP Tools**: Integradas en el servidor MCP
- **Base de Datos**: MongoDB Atlas con índices optimizados

---

*Documentación generada el: $(date)*
*Versión del sistema: 2.0*
*Última actualización: Análisis completo de funcionalidad de chat*


