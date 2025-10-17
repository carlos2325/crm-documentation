# 🔧 API Avanzada - Guía para Expertos

**Funciones avanzadas, optimización de rendimiento y mejores prácticas**

---

## 🎯 **Funciones Avanzadas**

### **Webhooks y Eventos en Tiempo Real**
- ✅ **Suscripciones GraphQL** para actualizaciones en vivo
- ✅ **Webhooks HTTP** para integraciones externas
- ✅ **Eventos de sistema** para monitoreo
- ✅ **Notificaciones push** personalizadas

### **Optimización y Rendimiento**
- ✅ **Cache inteligente** con invalidación automática
- ✅ **Paginación avanzada** para grandes datasets
- ✅ **Filtros complejos** y búsquedas optimizadas
- ✅ **Rate limiting** y control de tráfico

---

## 🔗 **Webhooks**

### **Configurar Webhook**
```javascript
async function configurarWebhook() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation CreateWebhook($input: CreateWebhookInput!) {
          createWebhook(input: $input) {
            success
            webhook {
              id
              url
              eventos
              secret
              estado
              ultimaActividad
              createdAt
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          url: "https://tu-servidor.com/webhook",
          eventos: [
            "evento.creado",
            "evento.actualizado",
            "contacto.creado",
            "lead.convertido",
            "mensaje.enviado"
          ],
          configuracion: {
            reintentos: 3,
            timeout: 30,
            incluirHeaders: true,
            verificarSSL: true
          }
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.createWebhook.success) {
    const webhook = data.data.createWebhook.webhook;
    console.log('✅ Webhook configurado exitosamente:');
    console.log(`   ID: ${webhook.id}`);
    console.log(`   URL: ${webhook.url}`);
    console.log(`   Eventos: ${webhook.eventos.join(', ')}`);
    console.log(`   Secret: ${webhook.secret}`);
    return webhook.id;
  } else {
    console.log('❌ Error configurando webhook:', data.data.createWebhook.errors);
    return null;
  }
}
```

### **Procesar Webhook en tu Servidor**
```javascript
// Ejemplo de servidor Node.js para recibir webhooks
const express = require('express');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Middleware para verificar firma del webhook
function verificarWebhook(req, res, next) {
  const signature = req.headers['x-webhook-signature'];
  const payload = JSON.stringify(req.body);
  const secret = process.env.WEBHOOK_SECRET;
  
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  if (signature !== expectedSignature) {
    return res.status(401).json({ error: 'Firma inválida' });
  }
  
  next();
}

app.post('/webhook', verificarWebhook, (req, res) => {
  const { evento, datos, timestamp } = req.body;
  
  console.log(`📨 Webhook recibido: ${evento}`);
  console.log('Datos:', datos);
  
  // Procesar según el tipo de evento
  switch (evento) {
    case 'evento.creado':
      console.log('Nuevo evento creado:', datos.evento);
      // Lógica para nuevo evento
      break;
      
    case 'contacto.creado':
      console.log('Nuevo contacto:', datos.contacto);
      // Lógica para nuevo contacto
      break;
      
    case 'lead.convertido':
      console.log('Lead convertido:', datos.lead);
      // Lógica para lead convertido
      break;
      
    default:
      console.log('Evento no manejado:', evento);
  }
  
  res.json({ success: true, mensaje: 'Webhook procesado' });
});

app.listen(3000, () => {
  console.log('Servidor webhook escuchando en puerto 3000');
});
```

---

## 📡 **Suscripciones GraphQL**

### **Suscripción en Tiempo Real**
```javascript
// Usando Apollo Client para suscripciones
import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { createHttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';

// Configuración de cliente Apollo
const httpLink = createHttpLink({
  uri: 'https://api2.eventosorganizador.com/graphql',
  headers: {
    'Authorization': `Bearer ${miToken}`,
    'Origin': 'https://tu-dominio.com'
  }
});

const wsLink = new WebSocketLink({
  uri: 'wss://api2.eventosorganizador.com/graphql',
  options: {
    reconnect: true,
    connectionParams: {
      authorization: `Bearer ${miToken}`
    }
  }
});

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return definition.kind === 'OperationDefinition' && 
           definition.operation === 'subscription';
  },
  wsLink,
  httpLink
);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

// Suscripción a eventos en tiempo real
const EVENTOS_SUBSCRIPTION = gql`
  subscription EventosEnTiempoReal {
    eventosEnTiempoReal {
      tipo
      evento {
        id
        nombre
        fecha
        estado
      }
      timestamp
    }
  }
`;

// Usar la suscripción
client.subscribe({
  query: EVENTOS_SUBSCRIPTION
}).subscribe({
  next: (data) => {
    console.log('📡 Evento en tiempo real:', data.data.eventosEnTiempoReal);
    
    // Actualizar UI en tiempo real
    actualizarUI(data.data.eventosEnTiempoReal);
  },
  error: (error) => {
    console.error('❌ Error en suscripción:', error);
  }
});
```

### **Suscripción a Mensajes**
```javascript
const MENSAJES_SUBSCRIPTION = gql`
  subscription MensajesEnTiempoReal {
    mensajesEnTiempoReal {
      tipo
      mensaje {
        id
        contenido
        numero
        estado
        timestamp
      }
      timestamp
    }
  }
`;

client.subscribe({
  query: MENSAJES_SUBSCRIPTION
}).subscribe({
  next: (data) => {
    const mensaje = data.data.mensajesEnTiempoReal;
    
    if (mensaje.tipo === 'mensaje.recibido') {
      console.log('📱 Nuevo mensaje recibido:', mensaje.mensaje);
      // Mostrar notificación
      mostrarNotificacion(mensaje.mensaje);
    } else if (mensaje.tipo === 'mensaje.entregado') {
      console.log('✅ Mensaje entregado:', mensaje.mensaje.id);
      // Actualizar estado en UI
      actualizarEstadoMensaje(mensaje.mensaje.id, 'entregado');
    }
  }
});
```

---

## 🚀 **Optimización de Rendimiento**

### **Cache Inteligente**
```javascript
// Configuración de cache personalizado
const cacheConfig = {
  typePolicies: {
    Event: {
      fields: {
        invitados: {
          merge(existing = [], incoming) {
            // Merge inteligente de invitados
            const merged = [...existing];
            incoming.forEach(invitado => {
              const index = merged.findIndex(i => i.id === invitado.id);
              if (index >= 0) {
                merged[index] = { ...merged[index], ...invitado };
              } else {
                merged.push(invitado);
              }
            });
            return merged;
          }
        }
      }
    },
    Contact: {
      fields: {
        eventos: {
          merge: false // No hacer merge, reemplazar completamente
        }
      }
    }
  }
};

const client = new ApolloClient({
  uri: 'https://api2.eventosorganizador.com/graphql',
  cache: new InMemoryCache(cacheConfig),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all'
    }
  }
});
```

### **Paginación Avanzada**
```javascript
// Query con paginación cursor-based
const EVENTOS_PAGINADOS = gql`
  query EventosPaginados($first: Int, $after: String, $filtros: FiltrosEvento) {
    eventos(first: $first, after: $after, filtros: $filtros) {
      edges {
        node {
          id
          nombre
          fecha
          estado
        }
        cursor
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
      totalCount
    }
  }
`;

// Función para cargar más eventos
async function cargarMasEventos(cursor) {
  const { data } = await client.query({
    query: EVENTOS_PAGINADOS,
    variables: {
      first: 20,
      after: cursor,
      filtros: {
        estado: 'activo',
        fechaDesde: '2025-01-01'
      }
    }
  });
  
  return data.eventos;
}

// Implementación de scroll infinito
let currentCursor = null;
let loading = false;

async function cargarSiguientePagina() {
  if (loading) return;
  
  loading = true;
  try {
    const resultado = await cargarMasEventos(currentCursor);
    
    // Agregar eventos a la lista
    agregarEventosALista(resultado.edges.map(edge => edge.node));
    
    // Actualizar cursor
    currentCursor = resultado.pageInfo.endCursor;
    
    // Verificar si hay más páginas
    if (!resultado.pageInfo.hasNextPage) {
      console.log('No hay más eventos para cargar');
    }
  } catch (error) {
    console.error('Error cargando eventos:', error);
  } finally {
    loading = false;
  }
}
```

### **Filtros y Búsquedas Avanzadas**
```javascript
// Query con filtros complejos
const BUSQUEDA_AVANZADA = gql`
  query BusquedaAvanzada($input: BusquedaAvanzadaInput!) {
    busquedaAvanzada(input: $input) {
      success
      resultados {
        eventos {
          id
          nombre
          fecha
          ubicacion
          estado
          score
        }
        contactos {
          id
          nombre
          apellidos
          email
          empresa
          score
        }
        leads {
          id
          contacto {
            nombre
            apellidos
          }
          estado
          valor
          score
        }
      }
      metadata {
        totalResultados
        tiempoBusqueda
        filtrosAplicados
      }
      errors
    }
  }
`;

// Función de búsqueda avanzada
async function busquedaAvanzada(termino, filtros = {}) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: BUSQUEDA_AVANZADA.loc.source.body,
      variables: {
        input: {
          termino: termino,
          tipos: ['eventos', 'contactos', 'leads'],
          filtros: {
            fechaDesde: filtros.fechaDesde,
            fechaHasta: filtros.fechaHasta,
            estado: filtros.estado,
            ubicacion: filtros.ubicacion,
            presupuestoMin: filtros.presupuestoMin,
            presupuestoMax: filtros.presupuestoMax
          },
          ordenamiento: {
            campo: 'fecha',
            direccion: 'DESC'
          },
          limite: 50
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.busquedaAvanzada.success) {
    const resultados = data.data.busquedaAvanzada.resultados;
    console.log('🔍 Resultados de búsqueda avanzada:');
    console.log(`   Eventos: ${resultados.eventos.length}`);
    console.log(`   Contactos: ${resultados.contactos.length}`);
    console.log(`   Leads: ${resultados.leads.length}`);
    console.log(`   Tiempo: ${data.data.busquedaAvanzada.metadata.tiempoBusqueda}ms`);
    return resultados;
  } else {
    console.log('❌ Error en búsqueda:', data.data.busquedaAvanzada.errors);
    return null;
  }
}

// Ejemplo de uso
const resultados = await busquedaAvanzada("boda madrid", {
  fechaDesde: "2025-06-01",
  fechaHasta: "2025-12-31",
  presupuestoMin: 10000,
  presupuestoMax: 50000
});
```

---

## ⚡ **Rate Limiting y Control de Tráfico**

### **Configurar Rate Limiting**
```javascript
class RateLimiter {
  constructor() {
    this.requests = new Map();
    this.limits = {
      default: { requests: 100, window: 60000 }, // 100 req/min
      heavy: { requests: 10, window: 60000 },    // 10 req/min
      light: { requests: 1000, window: 60000 }   // 1000 req/min
    };
  }

  canMakeRequest(endpoint, tier = 'default') {
    const now = Date.now();
    const key = `${endpoint}_${tier}`;
    const limit = this.limits[tier];
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    const requests = this.requests.get(key);
    
    // Limpiar requests antiguos
    const cutoff = now - limit.window;
    const recentRequests = requests.filter(timestamp => timestamp > cutoff);
    this.requests.set(key, recentRequests);
    
    return recentRequests.length < limit.requests;
  }

  recordRequest(endpoint, tier = 'default') {
    const key = `${endpoint}_${tier}`;
    const now = Date.now();
    
    if (!this.requests.has(key)) {
      this.requests.set(key, []);
    }
    
    this.requests.get(key).push(now);
  }

  async makeRequest(endpoint, requestFn, tier = 'default') {
    if (!this.canMakeRequest(endpoint, tier)) {
      throw new Error(`Rate limit exceeded for ${endpoint}`);
    }
    
    try {
      const result = await requestFn();
      this.recordRequest(endpoint, tier);
      return result;
    } catch (error) {
      if (error.message.includes('rate limit')) {
        // Esperar y reintentar
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.makeRequest(endpoint, requestFn, tier);
      }
      throw error;
    }
  }
}

const rateLimiter = new RateLimiter();

// Usar rate limiter
async function peticionConRateLimit() {
  return rateLimiter.makeRequest(
    'eventos',
    () => fetch('https://api2.eventosorganizador.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${miToken}`,
        'Origin': 'https://tu-dominio.com'
      },
      body: JSON.stringify({
        query: `
          query {
            getUserEvents {
              success
              events {
                id
                nombre
                fecha
              }
              errors
            }
          }
        `
      })
    }),
    'light'
  );
}
```

---

## 🔍 **Monitoreo y Debugging**

### **Logging Avanzado**
```javascript
class APILogger {
  constructor() {
    this.logs = [];
    this.maxLogs = 1000;
  }

  log(level, message, data = null) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      data,
      requestId: this.generateRequestId()
    };
    
    this.logs.push(logEntry);
    
    // Mantener solo los últimos logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
    
    // Console log según nivel
    switch (level) {
      case 'error':
        console.error(`❌ ${message}`, data);
        break;
      case 'warn':
        console.warn(`⚠️ ${message}`, data);
        break;
      case 'info':
        console.info(`ℹ️ ${message}`, data);
        break;
      case 'debug':
        console.debug(`🐛 ${message}`, data);
        break;
    }
  }

  generateRequestId() {
    return Math.random().toString(36).substr(2, 9);
  }

  getLogs(level = null, limit = 100) {
    let filteredLogs = this.logs;
    
    if (level) {
      filteredLogs = this.logs.filter(log => log.level === level);
    }
    
    return filteredLogs.slice(-limit);
  }

  exportLogs() {
    return {
      timestamp: new Date().toISOString(),
      totalLogs: this.logs.length,
      logs: this.logs
    };
  }
}

const logger = new APILogger();

// Wrapper para requests con logging
async function apiRequest(query, variables = {}, options = {}) {
  const startTime = Date.now();
  const requestId = logger.generateRequestId();
  
  logger.log('info', 'Iniciando petición API', {
    requestId,
    query: query.substring(0, 100) + '...',
    variables
  });
  
  try {
    const response = await fetch('https://api2.eventosorganizador.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${miToken}`,
        'Origin': 'https://tu-dominio.com',
        'X-Request-ID': requestId
      },
      body: JSON.stringify({ query, variables })
    });
    
    const data = await response.json();
    const duration = Date.now() - startTime;
    
    if (data.errors) {
      logger.log('error', 'Error en petición API', {
        requestId,
        errors: data.errors,
        duration
      });
      throw new Error(`API Error: ${data.errors[0].message}`);
    }
    
    logger.log('info', 'Petición API exitosa', {
      requestId,
      duration,
      dataSize: JSON.stringify(data).length
    });
    
    return data;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.log('error', 'Error de red en petición API', {
      requestId,
      error: error.message,
      duration
    });
    throw error;
  }
}
```

---

## 🎯 **Ejemplo Completo: Sistema Avanzado**

```javascript
class SistemaAvanzadoAPI {
  constructor(token) {
    this.token = token;
    this.logger = new APILogger();
    this.rateLimiter = new RateLimiter();
    this.cache = new Map();
    this.subscriptions = new Map();
  }

  async inicializar() {
    console.log('🚀 Inicializando sistema avanzado...');
    
    try {
      // 1. Configurar webhook
      console.log('1️⃣ Configurando webhook...');
      const webhookId = await this.configurarWebhook();
      
      // 2. Configurar suscripciones
      console.log('2️⃣ Configurando suscripciones...');
      await this.configurarSuscripciones();
      
      // 3. Configurar cache
      console.log('3️⃣ Configurando cache...');
      await this.configurarCache();
      
      // 4. Iniciar monitoreo
      console.log('4️⃣ Iniciando monitoreo...');
      this.iniciarMonitoreo();
      
      console.log('✅ Sistema avanzado inicializado correctamente');
      
      return {
        webhook: webhookId,
        suscripciones: this.subscriptions.size,
        cache: this.cache.size
      };
      
    } catch (error) {
      this.logger.log('error', 'Error inicializando sistema', error);
      throw error;
    }
  }

  async configurarWebhook() {
    return this.rateLimiter.makeRequest(
      'webhook',
      () => this.apiRequest(`
        mutation {
          createWebhook(input: {
            url: "https://tu-servidor.com/webhook"
            eventos: ["evento.creado", "contacto.creado", "lead.convertido"]
          }) {
            success
            webhook { id url }
            errors
          }
        }
      `),
      'light'
    );
  }

  async configurarSuscripciones() {
    // Configurar suscripción a eventos
    const eventosSubscription = this.client.subscribe({
      query: `
        subscription {
          eventosEnTiempoReal {
            tipo
            evento { id nombre fecha estado }
          }
        }
      `
    });

    eventosSubscription.subscribe({
      next: (data) => {
        this.logger.log('info', 'Evento en tiempo real recibido', data);
        this.actualizarCache('eventos', data.data.eventosEnTiempoReal.evento);
      },
      error: (error) => {
        this.logger.log('error', 'Error en suscripción de eventos', error);
      }
    });

    this.subscriptions.set('eventos', eventosSubscription);
  }

  async configurarCache() {
    // Precargar datos frecuentes
    const datosFrecuentes = ['eventos', 'contactos', 'leads'];
    
    for (const tipo of datosFrecuentes) {
      try {
        const data = await this.rateLimiter.makeRequest(
          tipo,
          () => this.apiRequest(`
            query {
              get${tipo.charAt(0).toUpperCase() + tipo.slice(1)} {
                success
                ${tipo} { id nombre }
                errors
              }
            }
          `),
          'light'
        );
        
        if (data.data[`get${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`].success) {
          this.cache.set(tipo, data.data[`get${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`][tipo]);
          this.logger.log('info', `Cache precargado para ${tipo}`, { count: data.data[`get${tipo.charAt(0).toUpperCase() + tipo.slice(1)}`][tipo].length });
        }
      } catch (error) {
        this.logger.log('warn', `Error precargando cache para ${tipo}`, error);
      }
    }
  }

  iniciarMonitoreo() {
    // Monitoreo de rendimiento cada 5 minutos
    setInterval(() => {
      const stats = {
        cache: this.cache.size,
        suscripciones: this.subscriptions.size,
        logs: this.logger.logs.length,
        memoria: process.memoryUsage(),
        uptime: process.uptime()
      };
      
      this.logger.log('info', 'Estadísticas del sistema', stats);
    }, 5 * 60 * 1000);
  }

  actualizarCache(tipo, datos) {
    if (this.cache.has(tipo)) {
      const cacheActual = this.cache.get(tipo);
      // Lógica de actualización inteligente
      this.cache.set(tipo, { ...cacheActual, ...datos });
    }
  }

  async apiRequest(query, variables = {}) {
    return apiRequest(query, variables, { token: this.token });
  }

  obtenerLogs() {
    return this.logger.exportLogs();
  }

  limpiarCache() {
    this.cache.clear();
    this.logger.log('info', 'Cache limpiado');
  }

  desconectar() {
    // Desconectar todas las suscripciones
    this.subscriptions.forEach((subscription, key) => {
      subscription.unsubscribe();
      this.logger.log('info', `Suscripción ${key} desconectada`);
    });
    
    this.subscriptions.clear();
    this.logger.log('info', 'Sistema desconectado');
  }
}

// Usar el sistema avanzado
const sistema = new SistemaAvanzadoAPI(miToken);
const resultado = await sistema.inicializar();

console.log('Sistema avanzado configurado:', resultado);
```

---

## 🎯 **Próximos Pasos**

### **¿Ya dominas la API avanzada?**
👉 **[Ir a Personalización](./customization.md)**

### **¿Necesitas ejemplos específicos?**
👉 **[Ver Código de Ejemplo](./code-examples.md)**

### **¿Quieres integración completa?**
👉 **[Ver Documentación Completa](./complete-reference.md)**

---

## 💡 **Consejos Avanzados**

1. **Optimiza queries:** Usa solo los campos que necesitas
2. **Implementa cache:** Reduce llamadas innecesarias a la API
3. **Maneja errores:** Siempre ten fallbacks para errores de red
4. **Monitorea rendimiento:** Usa herramientas de profiling
5. **Documenta integraciones:** Mantén registro de cambios y configuraciones

---

**¿Necesitas ayuda con funciones avanzadas?** 📧 soporte@eventosorganizador.com
