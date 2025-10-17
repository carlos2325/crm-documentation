# 🌐 DOCUMENTACIÓN COMPLETA - CONEXIÓN A LA API

**Fecha de actualización:** 16 de Octubre, 2025  
**Versión:** 2.0.0 - 100% Operativa  
**Estado:** Producción - Estable

---

## 🚀 **RESUMEN EJECUTIVO**

Esta documentación proporciona **instrucciones completas y detalladas** para conectarse a nuestra API GraphQL y MCP, incluyendo autenticación, estructura de datos, ejemplos de uso y mejores prácticas.

---

## 📋 **ÍNDICE**

1. [Información General](#información-general)
2. [Endpoints Disponibles](#endpoints-disponibles)
3. [Autenticación JWT](#autenticación-jwt)
4. [Estructura de Headers](#estructura-de-headers)
5. [Ejemplos de Conexión](#ejemplos-de-conexión)
6. [GraphQL Queries y Mutations](#graphql-queries-y-mutations)
7. [MCP (Model Context Protocol)](#mcp-model-context-protocol)
8. [Manejo de Errores](#manejo-de-errores)
9. [Rate Limiting](#rate-limiting)
10. [Testing y Debugging](#testing-y-debugging)
11. [Ejemplos Completos](#ejemplos-completos)

---

## 🌍 **INFORMACIÓN GENERAL**

### **URLs Base:**
- **API GraphQL (Producción):** `https://api2.eventosorganizador.com/graphql`
- **API GraphQL (Test):** `https://testapi2.eventosorganizador.com/graphql`
- **MCP Server (Producción):** `https://api2.eventosorganizador.com/mcp`
- **MCP Server (Test):** `https://testapi2.eventosorganizador.com/mcp`

### **Puertos Internos:**
- **GraphQL API:** 4000 (Producción), 3000 (Test)
- **MCP Server:** 4001 (Producción), 3001 (Test)

### **Protocolos Soportados:**
- ✅ **GraphQL** (HTTP POST)
- ✅ **MCP/JSON-RPC 2.0** (HTTP POST)
- ✅ **REST** (Endpoints específicos)

---

## 🔗 **ENDPOINTS DISPONIBLES**

### **1. GraphQL API**
```
POST https://api2.eventosorganizador.com/graphql
Content-Type: application/json
```

### **2. MCP Server**
```
POST https://api2.eventosorganizador.com/mcp
Content-Type: application/json
```

### **3. Endpoints de Debug y Monitoreo**
```
GET  https://api2.eventosorganizador.com/health
GET  https://api2.eventosorganizador.com/api/debug/auth
GET  https://api2.eventosorganizador.com/api/debug/mongodb
GET  https://api2.eventosorganizador.com/api/connection-control/stats
```

---

## 🔐 **AUTENTICACIÓN JWT**

### **Método de Autenticación:**
- **Tipo:** JWT (JSON Web Tokens)
- **Duración:** 24 horas por defecto
- **Header:** `Authorization: Bearer <token>`

### **1. Generar Token JWT**

#### **Mutation GraphQL:**
```graphql
mutation GenerateToken($input: GenerateTokenInput!) {
  generateToken(input: $input) {
    success
    token
    tokenType
    expiresAt
    expiresIn
    userInfo {
      id
      uid
      email
      role
      development
      brand
      client_id
      permissions
    }
    errors
  }
}
```

#### **Variables de Entrada:**
```json
{
  "input": {
    "uid": "user123",
    "email": "usuario@ejemplo.com",
    "role": "user",
    "development": "bodasdehoy",
    "brand": "bodasdehoy",
    "client_id": "bodasdehoy",
    "permissions": ["read", "write"],
    "expiresIn": "24h"
  }
}
```

#### **Respuesta Exitosa:**
```json
{
  "data": {
    "generateToken": {
      "success": true,
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "tokenType": "Bearer",
      "expiresAt": "2025-10-17T21:07:01.092Z",
      "expiresIn": 86400,
      "userInfo": {
        "id": "user123",
        "uid": "user123",
        "email": "usuario@ejemplo.com",
        "role": "user",
        "development": "bodasdehoy",
        "brand": "bodasdehoy",
        "client_id": "bodasdehoy",
        "permissions": ["read", "write"]
      },
      "errors": []
    }
  }
}
```

---

## 📋 **ESTRUCTURA DE HEADERS**

### **Headers Requeridos para GraphQL:**
```http
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Origin: https://tu-dominio.com
```

### **Headers Opcionales:**
```http
x-development: bodasdehoy
x-apollo-operation-name: GetEvents
apollo-require-preflight: true
```

### **Headers para MCP:**
```http
Content-Type: application/json
Origin: https://tu-dominio.com
```

---

## 💻 **EJEMPLOS DE CONEXIÓN**

### **1. JavaScript/Node.js**

```javascript
const axios = require('axios');

// Configuración base
const API_URL = 'https://api2.eventosorganizador.com/graphql';
const MCP_URL = 'https://api2.eventosorganizador.com/mcp';

// Función para generar token
async function generateToken() {
  try {
    const response = await axios.post(API_URL, {
      query: `
        mutation GenerateToken($input: GenerateTokenInput!) {
          generateToken(input: $input) {
            success
            token
            tokenType
            expiresAt
            expiresIn
            userInfo {
              id
              uid
              email
              role
              development
              brand
              client_id
              permissions
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          uid: "user123",
          email: "usuario@ejemplo.com",
          role: "user",
          development: "bodasdehoy",
          brand: "bodasdehoy",
          client_id: "bodasdehoy",
          permissions: ["read", "write"],
          expiresIn: "24h"
        }
      }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://tu-dominio.com'
      }
    });

    return response.data.data.generateToken.token;
  } catch (error) {
    console.error('Error generando token:', error.response?.data || error.message);
    throw error;
  }
}

// Función para hacer queries GraphQL
async function queryGraphQL(token, query, variables = {}) {
  try {
    const response = await axios.post(API_URL, {
      query,
      variables
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://tu-dominio.com'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Error en query GraphQL:', error.response?.data || error.message);
    throw error;
  }
}

// Ejemplo de uso
async function main() {
  try {
    // 1. Generar token
    const token = await generateToken();
    console.log('Token generado:', token.substring(0, 50) + '...');

    // 2. Hacer query
    const result = await queryGraphQL(token, `
      query {
        getCRMContacts(pagination: { page: 1, limit: 10 }) {
          success
          contacts {
            id
            name
            email
            phone
            createdAt
          }
          totalCount
          errors
        }
      }
    `);

    console.log('Contactos obtenidos:', result.data.getCRMContacts.contacts);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();
```

### **2. Python**

```python
import requests
import json

# Configuración base
API_URL = "https://api2.eventosorganizador.com/graphql"
MCP_URL = "https://api2.eventosorganizador.com/mcp"

def generate_token():
    """Generar token JWT"""
    query = """
    mutation GenerateToken($input: GenerateTokenInput!) {
      generateToken(input: $input) {
        success
        token
        tokenType
        expiresAt
        expiresIn
        userInfo {
          id
          uid
          email
          role
          development
          brand
          client_id
          permissions
        }
        errors
      }
    }
    """
    
    variables = {
        "input": {
            "uid": "user123",
            "email": "usuario@ejemplo.com",
            "role": "user",
            "development": "bodasdehoy",
            "brand": "bodasdehoy",
            "client_id": "bodasdehoy",
            "permissions": ["read", "write"],
            "expiresIn": "24h"
        }
    }
    
    response = requests.post(API_URL, json={
        "query": query,
        "variables": variables
    }, headers={
        "Content-Type": "application/json",
        "Origin": "https://tu-dominio.com"
    })
    
    if response.status_code == 200:
        data = response.json()
        return data["data"]["generateToken"]["token"]
    else:
        raise Exception(f"Error generando token: {response.text}")

def query_graphql(token, query, variables=None):
    """Hacer query GraphQL"""
    if variables is None:
        variables = {}
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {token}",
        "Origin": "https://tu-dominio.com"
    }
    
    response = requests.post(API_URL, json={
        "query": query,
        "variables": variables
    }, headers=headers)
    
    if response.status_code == 200:
        return response.json()
    else:
        raise Exception(f"Error en query: {response.text}")

# Ejemplo de uso
def main():
    try:
        # 1. Generar token
        token = generate_token()
        print(f"Token generado: {token[:50]}...")
        
        # 2. Hacer query
        query = """
        query {
          getCRMContacts(pagination: { page: 1, limit: 10 }) {
            success
            contacts {
              id
              name
              email
              phone
              createdAt
            }
            totalCount
            errors
          }
        }
        """
        
        result = query_graphql(token, query)
        contacts = result["data"]["getCRMContacts"]["contacts"]
        print(f"Contactos obtenidos: {len(contacts)}")
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
```

### **3. cURL**

```bash
# 1. Generar token
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Origin: https://tu-dominio.com" \
  -d '{
    "query": "mutation GenerateToken($input: GenerateTokenInput!) { generateToken(input: $input) { success token tokenType expiresAt expiresIn userInfo { id uid email role development brand client_id permissions } errors } }",
    "variables": {
      "input": {
        "uid": "user123",
        "email": "usuario@ejemplo.com",
        "role": "user",
        "development": "bodasdehoy",
        "brand": "bodasdehoy",
        "client_id": "bodasdehoy",
        "permissions": ["read", "write"],
        "expiresIn": "24h"
      }
    }
  }'

# 2. Usar token para hacer query
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -H "Origin: https://tu-dominio.com" \
  -d '{
    "query": "query { getCRMContacts(pagination: { page: 1, limit: 10 }) { success contacts { id name email phone createdAt } totalCount errors } }"
  }'
```

---

## 🔍 **GRAPHQL QUERIES Y MUTATIONS**

### **Queries Principales:**

#### **1. Obtener Contactos CRM**
```graphql
query GetContacts($pagination: PaginationInput) {
  getCRMContacts(pagination: $pagination) {
    success
    contacts {
      id
      name
      email
      phone
      company
      position
      status
      createdAt
      updatedAt
    }
    totalCount
    errors
  }
}
```

#### **2. Obtener Leads CRM**
```graphql
query GetLeads($pagination: PaginationInput) {
  getCRMLeads(pagination: $pagination) {
    success
    leads {
      id
      name
      email
      phone
      company
      status
      priority
      value
      stage
      assignedTo
      createdAt
      updatedAt
    }
    totalCount
    errors
  }
}
```

#### **3. Obtener Eventos**
```graphql
query GetEvents($pagination: PaginationInput) {
  getAllUserRelatedEvents(pagination: $pagination) {
    success
    events {
      id
      nombre
      fecha
      ubicacion
      descripcion
      estado
      invitados {
        id
        nombre
        email
        telefono
        confirmado
      }
      createdAt
    }
    totalCount
    errors
  }
}
```

### **Mutations Principales:**

#### **1. Crear Contacto**
```graphql
mutation CreateContact($input: CRM_ContactInput!) {
  createCRMContact(input: $input) {
    success
    contact {
      id
      name
      email
      phone
      company
      position
      createdAt
    }
    errors
  }
}
```

#### **2. Crear Lead**
```graphql
mutation CreateLead($input: CRM_LeadInput!) {
  createCRMLead(input: $input) {
    success
    lead {
      id
      name
      email
      phone
      company
      status
      priority
      value
      stage
      createdAt
    }
    errors
  }
}
```

---

## 🤖 **MCP (MODEL CONTEXT PROTOCOL)**

### **Configuración para Claude Desktop:**

```json
{
  "mcpServers": {
    "eventos-api": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-fetch",
        "https://api2.eventosorganizador.com/mcp"
      ]
    }
  }
}
```

### **Configuración para Lobe Chat:**

```json
{
  "mcp": {
    "servers": {
      "eventos-api": {
        "command": "npx",
        "args": [
          "-y",
          "@modelcontextprotocol/server-fetch",
          "https://api2.eventosorganizador.com/mcp"
        ]
      }
    }
  }
}
```

### **Herramientas MCP Disponibles:**

#### **1. Herramientas Básicas (4)**
- `health_check` - Verificar estado del sistema
- `get_events_by_phone` - Buscar eventos por teléfono
- `get_events_by_email` - Buscar eventos por email
- `query_event` - Consultar evento específico

#### **2. Herramientas CRM (22)**
- `crm_get_leads` - Obtener leads
- `crm_create_lead` - Crear lead
- `crm_update_lead` - Actualizar lead
- `crm_get_contacts` - Obtener contactos
- `crm_create_contact` - Crear contacto
- `crm_update_contact` - Actualizar contacto
- `crm_get_entities` - Obtener entidades
- `crm_create_entity` - Crear entidad
- `crm_get_campaigns` - Obtener campañas
- `crm_create_campaign` - Crear campaña
- Y 12 herramientas más...

### **Ejemplo de Uso MCP:**

```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/call",
  "params": {
    "name": "crm_get_leads",
    "arguments": {
      "pagination": {
        "page": 1,
        "limit": 10
      }
    }
  }
}
```

---

## ⚠️ **MANEJO DE ERRORES**

### **Errores Comunes:**

#### **1. Error de Autenticación**
```json
{
  "error": {
    "code": "UNAUTHENTICATED",
    "message": "Usuario no autenticado"
  }
}
```

#### **2. Error de Validación**
```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Campo requerido: email"
  }
}
```

#### **3. Error de Rate Limiting**
```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Límite de peticiones excedido"
  }
}
```

### **Códigos de Estado HTTP:**
- **200:** Éxito
- **400:** Error de cliente (validación, parámetros)
- **401:** No autenticado
- **403:** No autorizado
- **429:** Rate limit excedido
- **500:** Error interno del servidor

---

## 🚦 **RATE LIMITING**

### **Límites por Cliente:**
- **Por defecto:** 100 peticiones/minuto
- **Clientes premium:** 500 peticiones/minuto
- **Burst limit:** 10 peticiones/segundo

### **Headers de Rate Limiting:**
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

---

## 🧪 **TESTING Y DEBUGGING**

### **1. Verificar Estado del Sistema**
```bash
curl -X GET https://api2.eventosorganizador.com/health
```

### **2. Verificar Autenticación**
```bash
curl -X GET https://api2.eventosorganizador.com/api/debug/auth \
  -H "Authorization: Bearer tu-token-aqui"
```

### **3. Verificar MongoDB**
```bash
curl -X GET https://api2.eventosorganizador.com/api/debug/mongodb
```

### **4. Verificar Conexiones**
```bash
curl -X GET https://api2.eventosorganizador.com/api/connection-control/stats
```

---

## 📚 **EJEMPLOS COMPLETOS**

### **1. Sistema Completo de CRM**

```javascript
class CRMClient {
  constructor(baseURL = 'https://api2.eventosorganizador.com/graphql') {
    this.baseURL = baseURL;
    this.token = null;
  }

  async authenticate(uid, email, role = 'user') {
    const query = `
      mutation GenerateToken($input: GenerateTokenInput!) {
        generateToken(input: $input) {
          success
          token
          tokenType
          expiresAt
          expiresIn
          userInfo {
            id
            uid
            email
            role
            development
            brand
            client_id
            permissions
          }
          errors
        }
      }
    `;

    const variables = {
      input: {
        uid,
        email,
        role,
        development: "bodasdehoy",
        brand: "bodasdehoy",
        client_id: "bodasdehoy",
        permissions: ["read", "write"],
        expiresIn: "24h"
      }
    };

    const response = await this.request(query, variables);
    
    if (response.data.generateToken.success) {
      this.token = response.data.generateToken.token;
      return response.data.generateToken;
    } else {
      throw new Error('Error de autenticación');
    }
  }

  async getContacts(page = 1, limit = 20) {
    const query = `
      query GetContacts($pagination: PaginationInput) {
        getCRMContacts(pagination: $pagination) {
          success
          contacts {
            id
            name
            email
            phone
            company
            position
            status
            createdAt
            updatedAt
          }
          totalCount
          errors
        }
      }
    `;

    const variables = {
      pagination: { page, limit }
    };

    const response = await this.request(query, variables);
    return response.data.getCRMContacts;
  }

  async createContact(contactData) {
    const query = `
      mutation CreateContact($input: CRM_ContactInput!) {
        createCRMContact(input: $input) {
          success
          contact {
            id
            name
            email
            phone
            company
            position
            createdAt
          }
          errors
        }
      }
    `;

    const variables = {
      input: contactData
    };

    const response = await this.request(query, variables);
    return response.data.createCRMContact;
  }

  async request(query, variables = {}) {
    const headers = {
      'Content-Type': 'application/json',
      'Origin': 'https://tu-dominio.com'
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }
}

// Ejemplo de uso
async function ejemplo() {
  const client = new CRMClient();
  
  try {
    // 1. Autenticar
    await client.authenticate('user123', 'usuario@ejemplo.com');
    console.log('✅ Autenticado exitosamente');
    
    // 2. Obtener contactos
    const contacts = await client.getContacts(1, 10);
    console.log(`✅ ${contacts.totalCount} contactos encontrados`);
    
    // 3. Crear nuevo contacto
    const newContact = await client.createContact({
      name: 'Juan Pérez',
      email: 'juan@ejemplo.com',
      phone: '+1234567890',
      company: 'Empresa ABC'
    });
    
    if (newContact.success) {
      console.log('✅ Contacto creado:', newContact.contact.id);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

ejemplo();
```

### **2. Cliente MCP**

```javascript
class MCPClient {
  constructor(baseURL = 'https://api2.eventosorganizador.com/mcp') {
    this.baseURL = baseURL;
    this.requestId = 1;
  }

  async callTool(name, arguments = {}) {
    const request = {
      jsonrpc: "2.0",
      id: this.requestId++,
      method: "tools/call",
      params: {
        name,
        arguments
      }
    };

    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://tu-dominio.com'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    
    if (result.error) {
      throw new Error(`MCP Error: ${result.error.message}`);
    }

    return result.result;
  }

  async getTools() {
    const request = {
      jsonrpc: "2.0",
      id: this.requestId++,
      method: "tools/list"
    };

    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://tu-dominio.com'
      },
      body: JSON.stringify(request)
    });

    const result = await response.json();
    return result.result.tools;
  }

  async getLeads(page = 1, limit = 10) {
    return await this.callTool('crm_get_leads', {
      pagination: { page, limit }
    });
  }

  async createLead(leadData) {
    return await this.callTool('crm_create_lead', leadData);
  }

  async getContacts(page = 1, limit = 10) {
    return await this.callTool('crm_get_contacts', {
      pagination: { page, limit }
    });
  }
}

// Ejemplo de uso MCP
async function ejemploMCP() {
  const mcp = new MCPClient();
  
  try {
    // 1. Listar herramientas disponibles
    const tools = await mcp.getTools();
    console.log(`✅ ${tools.length} herramientas disponibles`);
    
    // 2. Obtener leads
    const leads = await mcp.getLeads(1, 5);
    console.log('✅ Leads obtenidos:', leads);
    
    // 3. Crear nuevo lead
    const newLead = await mcp.createLead({
      name: 'Lead de Prueba',
      email: 'lead@ejemplo.com',
      phone: '+1234567890',
      company: 'Empresa XYZ'
    });
    
    console.log('✅ Lead creado:', newLead);
    
  } catch (error) {
    console.error('❌ Error MCP:', error.message);
  }
}

ejemploMCP();
```

---

## 📞 **SOPORTE Y CONTACTO**

### **Para Soporte Técnico:**
- **Email:** soporte@eventosorganizador.com
- **Documentación:** https://docs.eventosorganizador.com
- **Estado del Sistema:** https://status.eventosorganizador.com

### **Recursos Adicionales:**
- **GitHub:** https://github.com/eventosorganizador/api-v2
- **Postman Collection:** Disponible en la documentación
- **SDKs:** JavaScript, Python, PHP (en desarrollo)

---

**Última actualización:** 16 de Octubre, 2025  
**Versión:** 2.0.0  
**Estado:** ✅ 100% Operativa
