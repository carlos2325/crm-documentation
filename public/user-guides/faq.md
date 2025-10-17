# ❓ Preguntas Frecuentes (FAQ)

**Respuestas a las preguntas más comunes sobre nuestra API**

---

## 🔐 **Autenticación**

### **¿Cómo obtengo un token de acceso?**
Para obtener un token, usa la mutation `generateToken`:

```graphql
mutation {
  generateToken(input: {
    uid: "tu-usuario"
    email: "tu-email@ejemplo.com"
    role: "user"
  }) {
    success
    token
    errors
  }
}
```

### **¿Cuánto tiempo dura un token?**
Los tokens tienen una duración de **24 horas** por defecto. Para aplicaciones de producción, puedes configurar duraciones más largas.

### **¿Qué hago si mi token expira?**
Implementa renovación automática de tokens:

```javascript
async function renovarToken() {
  const nuevoToken = await generarToken();
  // Actualizar token en tu aplicación
  return nuevoToken;
}
```

### **¿Puedo usar el mismo token en múltiples aplicaciones?**
Sí, pero es recomendable usar tokens separados para cada aplicación para mejor control y auditoría.

---

## 📡 **Peticiones HTTP**

### **¿Qué headers son obligatorios?**
Los headers obligatorios son:
- `Content-Type: application/json`
- `Authorization: Bearer <tu-token>`
- `Origin: https://tu-dominio.com`

### **¿Por qué recibo error "Origin header required"?**
El header `Origin` es obligatorio por seguridad. Asegúrate de incluirlo en todas las peticiones:

```javascript
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${token}`,
  'Origin': 'https://tu-dominio.com'  // OBLIGATORIO
}
```

### **¿Qué códigos de estado HTTP devuelve la API?**
- **200**: Petición exitosa
- **400**: Error en la petición (datos inválidos)
- **401**: No autenticado (token inválido/faltante)
- **403**: Sin permisos
- **404**: Recurso no encontrado
- **429**: Rate limit excedido
- **500**: Error interno del servidor

---

## 📊 **Rate Limiting**

### **¿Cuáles son los límites de peticiones?**
Los límites dependen de tu tipo de cuenta:

| Tipo | Requests/Minuto | Requests/Hora | Requests/Día |
|------|----------------|---------------|--------------|
| **Free** | 60 | 1,000 | 10,000 |
| **Pro** | 300 | 10,000 | 100,000 |
| **Enterprise** | 1,000 | 50,000 | 500,000 |

### **¿Qué hago si excedo el rate limit?**
Implementa reintentos con backoff exponencial:

```javascript
async function peticionConReintentos(query, maxReintentos = 3) {
  for (let i = 0; i < maxReintentos; i++) {
    try {
      return await fetch(query);
    } catch (error) {
      if (error.status === 429 && i < maxReintentos - 1) {
        const delay = Math.pow(2, i) * 1000; // Backoff exponencial
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
}
```

### **¿Cómo puedo verificar mi rate limit actual?**
Los headers de respuesta incluyen información sobre el rate limit:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

---

## 📱 **WhatsApp**

### **¿Cómo me conecto a WhatsApp Business API?**
1. Obtén una cuenta de WhatsApp Business API
2. Verifica tu número de teléfono
3. Configura las plantillas aprobadas
4. Usa nuestra API para enviar mensajes

### **¿Qué tipos de mensajes puedo enviar?**
- **Texto**: Mensajes de texto simples
- **Plantillas**: Mensajes pre-aprobados por WhatsApp
- **Multimedia**: Imágenes, videos, documentos, audio

### **¿Por qué mi mensaje no se entrega?**
Verifica:
- El número de teléfono está en formato internacional (+34...)
- El destinatario no ha bloqueado tu número
- Estás usando una plantilla aprobada (para mensajes promocionales)
- Tu cuenta de WhatsApp está activa

### **¿Cómo verifico el estado de WhatsApp?**
Usa la query `getWhatsAppStatus`:

```graphql
query {
  getWhatsAppStatus {
    success
    status {
      conectado
      numeroVerificado
      plantillasAprobadas
      mensajesEnviados
    }
  }
}
```

---

## 📧 **Campañas**

### **¿Cómo creo una campaña de email?**
```graphql
mutation {
  createEmailCampaign(input: {
    nombre: "Mi Campaña"
    asunto: "Asunto del email"
    tipo: "promocional"
    segmentos: ["contactos_activos"]
  }) {
    success
    campaign { id nombre }
  }
}
```

### **¿Puedo programar campañas para el futuro?**
Sí, usa el campo `fechaProgramada`:

```graphql
input: {
  nombre: "Campaña Navidad"
  fechaProgramada: "2025-12-20T10:00:00Z"
  # ... otros campos
}
```

### **¿Cómo veo las estadísticas de mis campañas?**
```graphql
query {
  getCampaignStats(campanaId: "tu-campana-id") {
    success
    stats {
      enviados
      entregados
      abiertos
      clicks
      porcentajeApertura
    }
  }
}
```

---

## 🔍 **Búsquedas y Filtros**

### **¿Cómo busco eventos por fecha?**
```graphql
query {
  searchEvents(termino: "", filtros: {
    fechaDesde: "2025-01-01"
    fechaHasta: "2025-12-31"
  }) {
    success
    events { id nombre fecha }
  }
}
```

### **¿Puedo buscar en múltiples campos a la vez?**
Sí, usa la búsqueda avanzada:

```graphql
query {
  busquedaAvanzada(input: {
    termino: "maria boda"
    tipos: ["eventos", "contactos"]
    limite: 50
  }) {
    success
    resultados {
      eventos { id nombre score }
      contactos { id nombre score }
    }
  }
}
```

### **¿Cómo ordeno los resultados?**
```graphql
query {
  getUserEvents(ordenamiento: {
    campo: "fecha"
    direccion: "DESC"
  }) {
    success
    events { id nombre fecha }
  }
}
```

---

## 📊 **Datos y Estructura**

### **¿Qué formato de fecha debo usar?**
Usa el formato ISO 8601: `YYYY-MM-DD` o `YYYY-MM-DDTHH:mm:ssZ`

Ejemplos:
- `2025-12-25`
- `2025-12-25T18:00:00Z`

### **¿Cómo manejo campos opcionales?**
Los campos opcionales pueden ser `null` o simplemente omitidos:

```javascript
// ✅ Correcto - omitir campos opcionales
{
  nombre: "Mi Evento",
  fecha: "2025-12-25"
  // telefono no incluido
}

// ✅ Correcto - usar null para campos opcionales
{
  nombre: "Mi Evento",
  fecha: "2025-12-25",
  telefono: null
}
```

### **¿Puedo agregar campos personalizados?**
Para campos personalizados, contacta con soporte para configurar un schema personalizado.

---

## 🚨 **Errores Comunes**

### **"Usuario no autenticado"**
- Verifica que incluyes el header `Authorization`
- Asegúrate de que el token sea válido y no haya expirado
- Incluye el header `Origin`

### **"Token inválido"**
- Genera un nuevo token
- Verifica que el token esté completo (no truncado)
- Asegúrate de usar el formato correcto: `Bearer <token>`

### **"Rate limit exceeded"**
- Implementa reintentos con delay
- Considera actualizar tu plan para límites más altos
- Optimiza tus queries para reducir peticiones

### **"GraphQL Error"**
- Verifica la sintaxis de tu query
- Asegúrate de que todos los campos requeridos estén incluidos
- Revisa los tipos de datos (String vs Int, etc.)

---

## 🔧 **Integración**

### **¿Cómo integro la API en mi aplicación web?**
1. **Frontend (JavaScript)**:
```javascript
const response = await fetch('https://api2.eventosorganizador.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
    'Origin': window.location.origin
  },
  body: JSON.stringify({ query, variables })
});
```

2. **Backend (Node.js)**:
```javascript
const axios = require('axios');
const response = await axios.post('https://api2.eventosorganizador.com/graphql', {
  query,
  variables
}, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Origin': 'https://tu-servidor.com'
  }
});
```

### **¿Puedo usar la API con cualquier lenguaje de programación?**
Sí, la API es REST/GraphQL estándar y funciona con cualquier lenguaje que pueda hacer peticiones HTTP.

### **¿Cómo manejo errores de red?**
Implementa manejo robusto de errores:

```javascript
try {
  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }
  const data = await response.json();
  if (data.errors) {
    throw new Error(`GraphQL Error: ${data.errors[0].message}`);
  }
  return data.data;
} catch (error) {
  console.error('Error en API:', error);
  // Manejar error según tu lógica
  throw error;
}
```

---

## 📞 **Soporte**

### **¿Cómo contacto con soporte?**
- **Email**: soporte@eventosorganizador.com
- **Discord**: [Unirse al servidor](https://discord.gg/eventos-api)
- **GitHub**: [Reportar issues](https://github.com/eventosorganizador/api-v2)

### **¿Cuánto tiempo tarda la respuesta de soporte?**
- **Preguntas generales**: 24-48 horas
- **Issues críticos**: 4-8 horas
- **Soporte prioritario**: 1-2 horas (solo planes Pro/Enterprise)

### **¿Ofrecen soporte en español?**
Sí, todo nuestro equipo de soporte habla español y puede ayudarte en tu idioma.

---

## 💡 **Consejos y Mejores Prácticas**

### **Optimización de Queries**
- Usa solo los campos que necesitas
- Implementa cache para reducir peticiones
- Usa paginación para grandes datasets

### **Manejo de Errores**
- Siempre implementa manejo de errores
- Usa logs para debugging
- Implementa fallbacks para servicios críticos

### **Seguridad**
- Nunca expongas tu token en código público
- Usa HTTPS siempre
- Rota tokens regularmente

### **Rendimiento**
- Implementa rate limiting en tu aplicación
- Usa conexiones persistentes
- Optimiza el tamaño de tus queries

---

## 🆕 **Actualizaciones y Novedades**

### **¿Cómo me entero de nuevas funcionalidades?**
- Suscríbete a nuestro newsletter
- Sigue nuestro blog
- Únete a nuestro Discord para anuncios

### **¿Con qué frecuencia actualizan la API?**
- **Actualizaciones menores**: Cada 2 semanas
- **Nuevas funcionalidades**: Cada mes
- **Actualizaciones de seguridad**: Inmediatas

### **¿Las actualizaciones rompen compatibilidad?**
Nos comprometemos a mantener compatibilidad hacia atrás. Las breaking changes se anuncian con 3 meses de anticipación.

---

## 📚 **Recursos Adicionales**

### **Documentación**
- [Guía de Inicio](./getting-started.md)
- [Referencia Completa](./complete-reference.md)
- [Ejemplos de Código](./code-examples.md)

### **Herramientas**
- [Postman Collection](./postman-collection.json)
- [GraphQL Playground](https://api2.eventosorganizador.com/graphql)
- [Sandbox de Pruebas](https://testapi2.eventosorganizador.com/graphql)

### **Comunidad**
- [Discord](https://discord.gg/eventos-api)
- [GitHub](https://github.com/eventosorganizador/api-v2)
- [Blog](https://blog.eventosorganizador.com)

---

**¿No encuentras la respuesta que buscas?** 📧 soporte@eventosorganizador.com
