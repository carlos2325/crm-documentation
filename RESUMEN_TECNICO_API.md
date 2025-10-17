# 📋 RESUMEN TÉCNICO - API DE EVENTOS

## 🎯 **INFORMACIÓN BÁSICA**

**URL Base:** `https://api2.eventosorganizador.com/graphql`  
**Tipo:** GraphQL API  
**Autenticación:** JWT Bearer Token  
**Formato:** JSON  

---

## 🔐 **AUTENTICACIÓN**

### **1. Generar Token JWT:**
```graphql
mutation {
  generateToken(input: {
    uid: "tu-usuario"
    email: "tu-email@ejemplo.com"
    role: "developer"
    development: "bodasdehoy"
  }) {
    success
    token
  }
}
```

### **2. Usar Token en Headers:**
```javascript
const headers = {
  'Content-Type': 'application/json',
  'Authorization': 'Bearer TU_TOKEN_JWT',
  'Origin': 'https://tu-dominio.com'
};
```

---

## 📊 **SISTEMA DE CONTABILIZACIÓN**

### **Precios por Servicio:**
- **Email**: $0.001 por email enviado
- **WhatsApp**: $0.005 por mensaje
- **SMS**: $0.01 por SMS
- **API Calls**: $0.0001 por llamada

### **Planes Disponibles:**
- **Básico**: $29/mes (10K emails, 5K WhatsApp, 2K SMS, 100K API)
- **Profesional**: $79/mes (50K emails, 25K WhatsApp, 10K SMS, 500K API)
- **Empresarial**: $199/mes (200K emails, 100K WhatsApp, 50K SMS, 2M API)

---

## 🚀 **ENDPOINTS PRINCIPALES**

### **1. GESTIÓN DE EVENTOS**

#### **Crear Evento:**
```graphql
mutation {
  createEvent(input: {
    nombre: "Mi Evento"
    fecha: "2025-12-25"
    poblacion: "Madrid"
    tipo: "boda"
    usuario_id: "usuario123"
    usuario_nombre: "Nombre Usuario"
  }) {
    _id
    nombre
    fecha
  }
}
```

#### **Obtener Eventos de Usuario:**
```graphql
query {
  getUserEvents(userId: "usuario123", brandId: "bodasdehoy") {
    id
    nombre
    fecha
    poblacion
    estatus
  }
}
```

### **2. SISTEMA CRM**

#### **Obtener Leads:**
```graphql
query {
  getCRMLeads {
    success
    leads {
      id
      name
      email
      phone
      status
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

#### **Obtener Campañas:**
```graphql
query {
  getCRMCampaigns {
    success
    campaigns {
      id
      name
      type
      status
    }
    errors
  }
}
```

### **3. TRACKING DE USO**

#### **Registrar Uso:**
```graphql
mutation {
  createUsageTracking(input: {
    clientId: "bodasdehoy"
    serviceType: "EMAIL"
    quantity: 100
    cost: 0.1
    metadata: "{\"campaign\": \"test\"}"
  }) {
    success
    id
  }
}
```

#### **Verificar Límites:**
```graphql
query {
  getUsageTrackingStats(clientId: "bodasdehoy") {
    totalUsage
    monthlyCost
    serviceBreakdown {
      serviceType
      quantity
      cost
    }
    remainingLimits {
      serviceType
      remaining
      percentage
    }
  }
}
```

---

## 💻 **EJEMPLO DE IMPLEMENTACIÓN**

```javascript
const axios = require('axios');

class EventosAPI {
  constructor(token) {
    this.apiUrl = 'https://api2.eventosorganizador.com/graphql';
    this.token = token;
  }

  async request(query, variables = {}) {
    const response = await axios.post(this.apiUrl, {
      query,
      variables
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
        'Origin': 'https://tu-dominio.com'
      }
    });
    return response.data;
  }

  // Crear evento
  async createEvent(eventData) {
    const query = `
      mutation {
        createEvent(input: {
          nombre: "${eventData.nombre}"
          fecha: "${eventData.fecha}"
          poblacion: "${eventData.poblacion}"
          tipo: "${eventData.tipo}"
          usuario_id: "${eventData.usuario_id}"
          usuario_nombre: "${eventData.usuario_nombre}"
        }) {
          _id
          nombre
          fecha
        }
      }
    `;
    return await this.request(query);
  }

  // Obtener eventos
  async getUserEvents(userId, brandId = 'bodasdehoy') {
    const query = `
      query {
        getUserEvents(userId: "${userId}", brandId: "${brandId}") {
          id
          nombre
          fecha
          poblacion
        }
      }
    `;
    return await this.request(query);
  }

  // Trackear uso
  async trackUsage(serviceType, quantity, metadata = {}) {
    const cost = quantity * this.getPricing(serviceType);
    const query = `
      mutation {
        createUsageTracking(input: {
          clientId: "bodasdehoy"
          serviceType: "${serviceType}"
          quantity: ${quantity}
          cost: ${cost}
          metadata: "${JSON.stringify(metadata)}"
        }) {
          success
          id
        }
      }
    `;
    return await this.request(query);
  }

  getPricing(serviceType) {
    const pricing = {
      'EMAIL': 0.001,
      'WHATSAPP': 0.005,
      'SMS': 0.01,
      'API_CALL': 0.0001
    };
    return pricing[serviceType] || 0;
  }
}

// Uso
const api = new EventosAPI('TU_TOKEN_JWT');

// Crear evento
const evento = await api.createEvent({
  nombre: 'Mi Boda',
  fecha: '2025-12-25',
  poblacion: 'Madrid',
  tipo: 'boda',
  usuario_id: 'usuario123',
  usuario_nombre: 'Juan Pérez'
});

// Obtener eventos
const eventos = await api.getUserEvents('usuario123');

// Trackear uso
await api.trackUsage('EMAIL', 100, { campaign: 'test' });
```

---

## 📋 **CAMPOS PRINCIPALES**

### **Evento:**
- `_id`: ID único del evento
- `nombre`: Nombre del evento
- `fecha`: Fecha en timestamp
- `poblacion`: Ciudad/ubicación
- `tipo`: Tipo de evento (boda, cumpleaños, etc.)
- `usuario_id`: ID del usuario propietario
- `usuario_nombre`: Nombre del usuario

### **Lead CRM:**
- `id`: ID único del lead
- `name`: Nombre del lead
- `email`: Email del lead
- `phone`: Teléfono del lead
- `status`: Estado del lead

### **Campaña CRM:**
- `id`: ID único de la campaña
- `name`: Nombre de la campaña
- `type`: Tipo de campaña
- `status`: Estado de la campaña

---

## 🚨 **CÓDIGOS DE ERROR COMUNES**

- **"Usuario no autenticado"**: Token JWT inválido o expirado
- **"Límite excedido"**: Se ha superado el límite mensual del plan
- **"Campo requerido"**: Falta un parámetro obligatorio
- **"Formato inválido"**: El formato de los datos no es correcto

---

## 📞 **SOPORTE**

**Email:** soporte@eventosorganizador.com  
**Documentación:** https://carlos2325.github.io/crm-documentation/  
**GitHub:** https://github.com/carlos2325/crm-documentation  

---

**Última actualización:** Octubre 2025  
**Versión API:** 2.0.0  
**Estado:** ✅ 100% Operativa
