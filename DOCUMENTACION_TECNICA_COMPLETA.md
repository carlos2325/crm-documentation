# 🚀 API DE EVENTOS - DOCUMENTACIÓN TÉCNICA COMPLETA

## 📋 **ÍNDICE GENERAL**

1. [Información Básica](#información-básica)
2. [Autenticación y Seguridad](#autenticación-y-seguridad)
3. [Arquitectura del Sistema](#arquitectura-del-sistema)
4. [Endpoints y Queries](#endpoints-y-queries)
5. [Sistema de Contabilización](#sistema-de-contabilización)
6. [Gestión de Eventos](#gestión-de-eventos)
7. [Sistema CRM](#sistema-crm)
8. [Chat y WhatsApp](#chat-y-whatsapp)
9. [Email Marketing](#email-marketing)
10. [Integración con IA](#integración-con-ia)
11. [Ejemplos de Código](#ejemplos-de-código)
12. [Troubleshooting](#troubleshooting)
13. [Mejores Prácticas](#mejores-prácticas)

---

## 📊 **INFORMACIÓN BÁSICA**

### **🔗 URLs del Sistema**
- **API Principal**: `https://api2.eventosorganizador.com/graphql`
- **API de Pruebas**: `https://testapi2.eventosorganizador.com/graphql`
- **Documentación**: `https://carlos2325.github.io/crm-documentation/`
- **GitHub**: `https://github.com/carlos2325/crm-documentation`

### **📋 Especificaciones Técnicas**
- **Tipo**: GraphQL API
- **Formato**: JSON
- **Autenticación**: JWT Bearer Token
- **Rate Limiting**: 1000 requests/minuto (plan básico)
- **Timeout**: 30 segundos por request
- **CORS**: Configurado para dominios autorizados

### **🎯 Servicios Disponibles**
- **Eventos**: Gestión completa de eventos (bodas, cumpleaños, corporativos)
- **CRM**: Contactos, leads, campañas, entidades
- **Comunicación**: Email, WhatsApp, SMS, Chat
- **IA**: Integración con ChatGPT, Claude, automatización
- **Contabilización**: Control de tokens, facturación automática

---

## 🔐 **AUTENTICACIÓN Y SEGURIDAD**

### **1. Generación de Tokens JWT**

```graphql
mutation GenerateToken($input: TokenInput!) {
  generateToken(input: $input) {
    success
    token
    expiresAt
    user {
      id
      email
      role
      development
    }
  }
}
```

**Variables:**
```json
{
  "input": {
    "uid": "usuario123",
    "email": "usuario@ejemplo.com",
    "role": "developer",
    "development": "bodasdehoy",
    "brand": "bodasdehoy",
    "client_id": "bodasdehoy",
    "permissions": ["read", "write", "admin"]
  }
}
```

### **2. Headers Requeridos**

```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer TU_TOKEN_JWT',
  'Origin': 'https://tu-dominio.com',
  'Referer': 'https://tu-dominio.com',
  'User-Agent': 'TuApp/1.0.0'
};
```

### **3. Roles y Permisos**

| Rol | Permisos | Descripción |
|-----|----------|-------------|
| `admin` | `["read", "write", "admin", "billing"]` | Acceso completo |
| `developer` | `["read", "write"]` | Desarrollo y testing |
| `user` | `["read"]` | Solo lectura |
| `client` | `["read"]` | Cliente final |

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **📊 Diagrama de Componentes**

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   📱 CLIENTE    │    │   🔌 API        │    │   🗄️ DATABASE   │
│   APLICACIÓN    │───▶│   GATEWAY       │───▶│   MONGODB       │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       ▼                       │
         │              ┌─────────────────┐              │
         │              │   📊 TRACKING   │              │
         │              │   SERVICE       │              │
         │              └─────────────────┘              │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   💰 BILLING    │    │   🚨 ALERTS     │    │   📈 ANALYTICS  │
│   SYSTEM        │    │   SYSTEM        │    │   DASHBOARD     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **🔄 Flujo de Datos**

1. **Request** → Cliente envía petición con token JWT
2. **Auth** → API valida token y permisos
3. **Process** → Procesa la petición y ejecuta lógica
4. **Track** → Registra uso para contabilización
5. **Response** → Devuelve resultado al cliente
6. **Alert** → Verifica límites y envía alertas si es necesario

---

## 🔍 **ENDPOINTS Y QUERIES**

### **📅 GESTIÓN DE EVENTOS**

#### **Crear Evento**
```graphql
mutation CreateEvent($input: EVT_EventInput!) {
  createEvent(input: $input) {
    _id
    nombre
    fecha
    poblacion
    tipo
    usuario_id
    usuario_nombre
    estatus
    created_at
  }
}
```

**Variables:**
```json
{
  "input": {
    "nombre": "Boda de María y Juan",
    "fecha": "2025-12-25",
    "poblacion": "Madrid",
    "tipo": "boda",
    "usuario_id": "usuario123",
    "usuario_nombre": "María García"
  }
}
```

#### **Obtener Eventos de Usuario**
```graphql
query GetUserEvents($userId: String!, $brandId: String!) {
  getUserEvents(userId: $userId, brandId: $brandId) {
    id
    nombre
    fecha
    poblacion
    estatus
    tipo
    created_at
  }
}
```

#### **Obtener Eventos por Email**
```graphql
query GetEventsByEmail($email: String!, $development: String!) {
  getAllUserRelatedEventsByEmail(email: $email, development: $development) {
    _id
    nombre
    fecha
    poblacion
    development
    estatus
  }
}
```

### **👥 SISTEMA CRM**

#### **Obtener Leads**
```graphql
query GetCRMLeads {
  getCRMLeads {
    success
    leads {
      id
      name
      email
      phone
      status
      priority
      value
      created_at
      updated_at
    }
    pagination {
      page
      limit
      total
    }
    errors
  }
}
```

#### **Obtener Campañas**
```graphql
query GetCRMCampaigns {
  getCRMCampaigns {
    success
    campaigns {
      id
      name
      type
      status
      scheduled_at
      created_at
      template_id
    }
    errors
  }
}
```

#### **Obtener Contactos**
```graphql
query GetCRMContacts {
  getCRMContacts {
    success
    contacts {
      id
      name
      email
      phone
      company
      tags
      last_contact
      created_at
    }
    pagination {
      page
      limit
      total
    }
    errors
  }
}
```

---

## 💰 **SISTEMA DE CONTABILIZACIÓN**

### **📊 Precios por Servicio**

| Servicio | Precio Unitario | Límite Básico | Límite Profesional | Límite Empresarial |
|----------|----------------|---------------|-------------------|-------------------|
| **Email** | $0.001 | 10,000/mes | 50,000/mes | 200,000/mes |
| **WhatsApp** | $0.005 | 5,000/mes | 25,000/mes | 100,000/mes |
| **SMS** | $0.01 | 2,000/mes | 10,000/mes | 50,000/mes |
| **API Calls** | $0.0001 | 100,000/mes | 500,000/mes | 2,000,000/mes |

### **🎯 Tracking de Uso**

#### **Registrar Uso de Servicio**
```graphql
mutation TrackUsage($input: UsageTrackingInput!) {
  createUsageTracking(input: $input) {
    success
    id
    message
  }
}
```

**Variables:**
```json
{
  "input": {
    "clientId": "bodasdehoy",
    "serviceType": "EMAIL",
    "quantity": 100,
    "cost": 0.1,
    "metadata": "{\"campaign\": \"welcome\", \"template\": \"welcome_template\"}"
  }
}
```

#### **Verificar Límites y Estadísticas**
```graphql
query GetUsageStats($clientId: String!) {
  getUsageTrackingStats(clientId: $clientId) {
    totalUsage
    monthlyCost
    serviceBreakdown {
      serviceType
      quantity
      cost
      percentage
    }
    remainingLimits {
      serviceType
      remaining
      percentage
      limit
    }
    alerts {
      type
      message
      level
    }
  }
}
```

### **🚨 Sistema de Alertas**

| Porcentaje | Tipo | Acción |
|------------|------|--------|
| 0-79% | Normal | Ninguna |
| 80-94% | Advertencia | Email de notificación |
| 95-99% | Crítico | Email + SMS |
| 100%+ | Bloqueado | Bloqueo automático |

---

## 📅 **GESTIÓN DE EVENTOS**

### **📋 Tipos de Eventos**

| Tipo | Descripción | Campos Específicos |
|------|-------------|-------------------|
| `boda` | Bodas y ceremonias | `novios`, `ceremonia`, `banquete` |
| `cumpleanos` | Cumpleaños | `edad`, `tema`, `invitados` |
| `corporativo` | Eventos empresariales | `empresa`, `tipo_evento`, `asistentes` |
| `comunion` | Comuniones | `comulgante`, `iglesia`, `fiesta` |
| `graduacion` | Graduaciones | `estudiante`, `carrera`, `universidad` |

### **🔧 Operaciones CRUD**

#### **Crear Evento**
```javascript
const createEvent = async (eventData) => {
  const mutation = `
    mutation CreateEvent($input: EVT_EventInput!) {
      createEvent(input: $input) {
        _id
        nombre
        fecha
        poblacion
        tipo
        estatus
      }
    }
  `;
  
  return await api.request(mutation, { input: eventData });
};
```

#### **Actualizar Evento**
```graphql
mutation UpdateEvent($id: String!, $input: EVT_EventUpdateInput!) {
  updateEvent(id: $id, input: $input) {
    success
    event {
      _id
      nombre
      fecha
      poblacion
    }
    errors
  }
}
```

#### **Eliminar Evento**
```graphql
mutation DeleteEvent($id: String!) {
  deleteEvent(id: $id) {
    success
    message
  }
}
```

---

## 👥 **SISTEMA CRM**

### **📊 Entidades Principales**

#### **Leads (Prospectos)**
```graphql
type CRM_Lead {
  id: String!
  name: String!
  email: String!
  phone: String
  company: String
  status: LeadStatus!
  priority: Priority!
  value: Float
  source: String
  assigned_to: String
  created_at: String!
  updated_at: String!
  last_contact: String
  notes: [String!]
  tags: [String!]
}
```

#### **Contactos**
```graphql
type CRM_Contact {
  id: String!
  name: String!
  email: String!
  phone: String
  company: String
  position: String
  status: ContactStatus!
  tags: [String!]
  created_at: String!
  updated_at: String!
  last_contact: String
  notes: [String!]
  reminders: [Reminder!]
}
```

#### **Campañas**
```graphql
type CRM_Campaign {
  id: String!
  name: String!
  type: CampaignType!
  status: CampaignStatus!
  template_id: String
  scheduled_at: String
  created_at: String!
  updated_at: String!
  metrics: CampaignMetrics
}
```

### **🔍 Queries Avanzadas**

#### **Buscar Leads por Estado**
```graphql
query GetLeadsByStatus($status: LeadStatus!) {
  getCRMLeadsByStatus(status: $status) {
    success
    leads {
      id
      name
      email
      status
      priority
      value
    }
    pagination {
      page
      limit
      total
    }
  }
}
```

#### **Obtener Leads Asignados**
```graphql
query GetLeadsByAssignee($assigneeId: String!) {
  getCRMLeadsByAssignee(assigneeId: $assigneeId) {
    success
    leads {
      id
      name
      email
      status
      priority
    }
  }
}
```

---

## 💬 **CHAT Y WHATSAPP**

### **📱 Configuración de WhatsApp**

```javascript
const whatsappConfig = {
  apiUrl: 'https://api2.eventosorganizador.com/graphql',
  phoneNumberId: 'TU_PHONE_NUMBER_ID',
  accessToken: 'TU_ACCESS_TOKEN',
  webhookVerifyToken: 'TU_WEBHOOK_VERIFY_TOKEN'
};
```

### **📤 Enviar Mensaje WhatsApp**

```graphql
mutation SendWhatsApp($input: WhatsAppMessageInput!) {
  sendWhatsApp(input: $input) {
    success
    message_id
    status
    cost
  }
}
```

**Variables:**
```json
{
  "input": {
    "to": "+34600000000",
    "template": "welcome_template",
    "language": "es",
    "components": [
      {
        "type": "body",
        "parameters": [
          {
            "type": "text",
            "text": "Juan"
          }
        ]
      }
    ]
  }
}
```

### **📊 Tracking de Mensajes**

```graphql
query GetWhatsAppStats($campaignId: String!) {
  getWhatsAppStats(campaignId: $campaignId) {
    sent
    delivered
    read
    failed
    cost
    delivery_rate
    read_rate
  }
}
```

---

## 📧 **EMAIL MARKETING**

### **📨 Enviar Email**

```graphql
mutation SendEmail($input: EmailInput!) {
  sendEmail(input: $input) {
    success
    message_id
    status
    cost
  }
}
```

**Variables:**
```json
{
  "input": {
    "to": "usuario@ejemplo.com",
    "subject": "Bienvenido a nuestro evento",
    "template": "welcome_template",
    "variables": {
      "nombre": "Juan",
      "evento": "Boda de María y Juan"
    },
    "tracking": true
  }
}
```

### **📊 Estadísticas de Email**

```graphql
query GetEmailStats($campaignId: String!) {
  getEmailStats(campaignId: $campaignId) {
    sent
    delivered
    opened
    clicked
    bounced
    unsubscribed
    cost
    open_rate
    click_rate
  }
}
```

---

## 🤖 **INTEGRACIÓN CON IA**

### **🔗 Configuración de IA**

```javascript
const aiConfig = {
  openai: {
    apiKey: 'TU_OPENAI_API_KEY',
    model: 'gpt-4',
    temperature: 0.7
  },
  claude: {
    apiKey: 'TU_CLAUDE_API_KEY',
    model: 'claude-3-sonnet-20240229'
  }
};
```

### **💬 Chat con IA**

```graphql
mutation ChatWithAI($input: AIChatInput!) {
  chatWithAI(input: $input) {
    success
    response
    tokens_used
    cost
    model
  }
}
```

**Variables:**
```json
{
  "input": {
    "message": "Ayúdame a crear una invitación para una boda",
    "context": "evento",
    "model": "gpt-4",
    "temperature": 0.7
  }
}
```

---

## 💻 **EJEMPLOS DE CÓDIGO**

### **🔧 Clase Principal de la API**

```javascript
class EventosAPI {
  constructor(config) {
    this.apiUrl = config.apiUrl || 'https://api2.eventosorganizador.com/graphql';
    this.token = config.token;
    this.clientId = config.clientId || 'bodasdehoy';
    this.axios = axios.create({
      baseURL: this.apiUrl,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'Origin': config.origin || 'https://tu-dominio.com'
      }
    });
  }

  async request(query, variables = {}) {
    try {
      const response = await this.axios.post('', {
        query,
        variables
      });
      
      if (response.data.errors) {
        throw new Error(response.data.errors[0].message);
      }
      
      return response.data.data;
    } catch (error) {
      console.error('API Error:', error.message);
      throw error;
    }
  }

  // Eventos
  async createEvent(eventData) {
    const query = `
      mutation CreateEvent($input: EVT_EventInput!) {
        createEvent(input: $input) {
          _id
          nombre
          fecha
          poblacion
          tipo
          estatus
        }
      }
    `;
    return await this.request(query, { input: eventData });
  }

  async getUserEvents(userId, brandId = 'bodasdehoy') {
    const query = `
      query GetUserEvents($userId: String!, $brandId: String!) {
        getUserEvents(userId: $userId, brandId: $brandId) {
          id
          nombre
          fecha
          poblacion
          estatus
        }
      }
    `;
    return await this.request(query, { userId, brandId });
  }

  // CRM
  async getCRMLeads() {
    const query = `
      query GetCRMLeads {
        getCRMLeads {
          success
          leads {
            id
            name
            email
            phone
            status
            priority
            value
          }
          pagination {
            page
            limit
            total
          }
          errors
        }
      }
    `;
    return await this.request(query);
  }

  // Contabilización
  async trackUsage(serviceType, quantity, metadata = {}) {
    const pricing = {
      'EMAIL': 0.001,
      'WHATSAPP': 0.005,
      'SMS': 0.01,
      'API_CALL': 0.0001
    };
    
    const cost = quantity * (pricing[serviceType] || 0);
    
    const query = `
      mutation TrackUsage($input: UsageTrackingInput!) {
        createUsageTracking(input: $input) {
          success
          id
          message
        }
      }
    `;
    
    return await this.request(query, {
      input: {
        clientId: this.clientId,
        serviceType,
        quantity,
        cost,
        metadata: JSON.stringify(metadata)
      }
    });
  }

  async getUsageStats() {
    const query = `
      query GetUsageStats($clientId: String!) {
        getUsageTrackingStats(clientId: $clientId) {
          totalUsage
          monthlyCost
          serviceBreakdown {
            serviceType
            quantity
            cost
            percentage
          }
          remainingLimits {
            serviceType
            remaining
            percentage
            limit
          }
        }
      }
    `;
    return await this.request(query, { clientId: this.clientId });
  }
}

// Uso
const api = new EventosAPI({
  token: 'TU_TOKEN_JWT',
  clientId: 'bodasdehoy',
  origin: 'https://tu-dominio.com'
});

// Ejemplos de uso
const evento = await api.createEvent({
  nombre: 'Mi Boda',
  fecha: '2025-12-25',
  poblacion: 'Madrid',
  tipo: 'boda',
  usuario_id: 'usuario123',
  usuario_nombre: 'Juan Pérez'
});

const eventos = await api.getUserEvents('usuario123');
const leads = await api.getCRMLeads();
await api.trackUsage('EMAIL', 100, { campaign: 'test' });
const stats = await api.getUsageStats();
```

### **🐍 Implementación en Python**

```python
import requests
import json
from typing import Dict, Any, Optional

class EventosAPI:
    def __init__(self, token: str, client_id: str = 'bodasdehoy', origin: str = 'https://tu-dominio.com'):
        self.api_url = 'https://api2.eventosorganizador.com/graphql'
        self.token = token
        self.client_id = client_id
        self.origin = origin
        self.headers = {
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}',
            'Origin': origin
        }
    
    def request(self, query: str, variables: Dict[str, Any] = None) -> Dict[str, Any]:
        try:
            response = requests.post(
                self.api_url,
                headers=self.headers,
                json={'query': query, 'variables': variables or {}}
            )
            response.raise_for_status()
            data = response.json()
            
            if 'errors' in data:
                raise Exception(data['errors'][0]['message'])
            
            return data['data']
        except Exception as e:
            print(f'API Error: {e}')
            raise e
    
    def create_event(self, event_data: Dict[str, Any]) -> Dict[str, Any]:
        query = """
        mutation CreateEvent($input: EVT_EventInput!) {
            createEvent(input: $input) {
                _id
                nombre
                fecha
                poblacion
                tipo
                estatus
            }
        }
        """
        return self.request(query, {'input': event_data})
    
    def get_user_events(self, user_id: str, brand_id: str = 'bodasdehoy') -> Dict[str, Any]:
        query = """
        query GetUserEvents($userId: String!, $brandId: String!) {
            getUserEvents(userId: $userId, brandId: $brandId) {
                id
                nombre
                fecha
                poblacion
                estatus
            }
        }
        """
        return self.request(query, {'userId': user_id, 'brandId': brand_id})
    
    def track_usage(self, service_type: str, quantity: int, metadata: Dict[str, Any] = None) -> Dict[str, Any]:
        pricing = {
            'EMAIL': 0.001,
            'WHATSAPP': 0.005,
            'SMS': 0.01,
            'API_CALL': 0.0001
        }
        
        cost = quantity * pricing.get(service_type, 0)
        
        query = """
        mutation TrackUsage($input: UsageTrackingInput!) {
            createUsageTracking(input: $input) {
                success
                id
                message
            }
        }
        """
        
        return self.request(query, {
            'input': {
                'clientId': self.client_id,
                'serviceType': service_type,
                'quantity': quantity,
                'cost': cost,
                'metadata': json.dumps(metadata or {})
            }
        })

# Uso
api = EventosAPI(token='TU_TOKEN_JWT')

evento = api.create_event({
    'nombre': 'Mi Boda',
    'fecha': '2025-12-25',
    'poblacion': 'Madrid',
    'tipo': 'boda',
    'usuario_id': 'usuario123',
    'usuario_nombre': 'Juan Pérez'
})

eventos = api.get_user_events('usuario123')
api.track_usage('EMAIL', 100, {'campaign': 'test'})
```

---

## 🔧 **TROUBLESHOOTING**

### **❌ Errores Comunes y Soluciones**

#### **1. "Usuario no autenticado"**
```javascript
// ❌ Problema: Token inválido o expirado
// ✅ Solución: Regenerar token
const newToken = await generateToken({
  uid: 'usuario123',
  email: 'usuario@ejemplo.com',
  role: 'developer'
});
```

#### **2. "Límite excedido"**
```javascript
// ❌ Problema: Se superó el límite mensual
// ✅ Solución: Verificar límites antes de usar
const limits = await api.getUsageStats();
if (limits.remainingLimits.EMAIL.remaining < quantity) {
  throw new Error('Límite de emails excedido');
}
```

#### **3. "Campo requerido"**
```javascript
// ❌ Problema: Falta parámetro obligatorio
// ✅ Solución: Incluir todos los campos requeridos
const eventData = {
  nombre: 'Mi Evento',        // ✅ Requerido
  fecha: '2025-12-25',        // ✅ Requerido
  poblacion: 'Madrid',        // ✅ Requerido
  tipo: 'boda',               // ✅ Requerido
  usuario_id: 'usuario123',   // ✅ Requerido
  usuario_nombre: 'Juan'      // ✅ Requerido
};
```

#### **4. "Formato inválido"**
```javascript
// ❌ Problema: Formato de fecha incorrecto
// ✅ Solución: Usar timestamp o formato ISO
const fecha = new Date('2025-12-25').getTime(); // Timestamp
// o
const fecha = '2025-12-25T00:00:00.000Z'; // ISO string
```

### **🔍 Debugging**

#### **1. Logging de Requests**
```javascript
const api = new EventosAPI({
  token: 'TU_TOKEN',
  debug: true // Habilita logging
});

// Los requests se loguean automáticamente
```

#### **2. Verificar Estado de la API**
```graphql
query HealthCheck {
  healthCheck {
    status
    timestamp
    version
    uptime
  }
}
```

#### **3. Verificar Límites en Tiempo Real**
```javascript
const checkLimits = async () => {
  const stats = await api.getUsageStats();
  console.log('Límites actuales:', stats.remainingLimits);
  
  // Verificar si algún servicio está cerca del límite
  stats.remainingLimits.forEach(limit => {
    if (limit.percentage > 90) {
      console.warn(`⚠️ ${limit.serviceType} al ${limit.percentage}% del límite`);
    }
  });
};
```

---

## 📋 **MEJORES PRÁCTICAS**

### **🔒 Seguridad**

1. **Nunca hardcodear tokens** en el código
2. **Usar variables de entorno** para credenciales
3. **Implementar rotación de tokens** regularmente
4. **Validar inputs** antes de enviar a la API
5. **Usar HTTPS** siempre

```javascript
// ✅ Correcto
const token = process.env.EVENTOS_API_TOKEN;

// ❌ Incorrecto
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### **⚡ Rendimiento**

1. **Implementar cache** para datos que no cambian frecuentemente
2. **Usar paginación** para listas grandes
3. **Implementar retry logic** para requests fallidos
4. **Monitorear rate limits** y respetarlos

```javascript
// Cache simple
const cache = new Map();

const getCachedData = async (key, fetcher) => {
  if (cache.has(key)) {
    return cache.get(key);
  }
  
  const data = await fetcher();
  cache.set(key, data);
  return data;
};
```

### **🔄 Manejo de Errores**

1. **Implementar retry automático** para errores temporales
2. **Logging detallado** para debugging
3. **Fallbacks** para servicios críticos
4. **Alertas** para errores importantes

```javascript
const retryRequest = async (fn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
};
```

### **📊 Monitoreo**

1. **Trackear métricas** de uso de la API
2. **Monitorear costos** en tiempo real
3. **Alertas proactivas** para límites
4. **Reportes regulares** de uso

```javascript
const monitorUsage = async () => {
  const stats = await api.getUsageStats();
  
  // Enviar alerta si se supera el 80% del límite
  stats.remainingLimits.forEach(limit => {
    if (limit.percentage > 80) {
      sendAlert(`Uso alto de ${limit.serviceType}: ${limit.percentage}%`);
    }
  });
};
```

---

## 📞 **SOPORTE Y RECURSOS**

### **📧 Contacto**
- **Email**: soporte@eventosorganizador.com
- **Documentación**: https://carlos2325.github.io/crm-documentation/
- **GitHub**: https://github.com/carlos2325/crm-documentation

### **📚 Recursos Adicionales**
- **GraphQL Playground**: https://api2.eventosorganizador.com/graphql
- **Postman Collection**: Disponible en el repositorio
- **Ejemplos de Código**: Múltiples lenguajes disponibles
- **FAQ**: Preguntas frecuentes y soluciones

### **🔄 Actualizaciones**
- **Versión Actual**: 2.0.0
- **Última Actualización**: Octubre 2025
- **Estado**: ✅ 100% Operativa
- **Próximas Features**: Webhooks, más integraciones IA

---

**Esta documentación es tu fuente de referencia completa para implementar y usar la API de Eventos de manera profesional y eficiente.** 🚀
