# 📚 API de Eventos - Documentación Completa

**Bienvenido a la documentación más completa para gestión de eventos, CRM y automatización**

---

## 🎯 **¿Qué es esta API?**

Nuestra API te permite crear aplicaciones que gestionen:
- **📅 Eventos** (bodas, cumpleaños, corporativos)
- **👥 CRM** (contactos, leads, campañas)
- **💬 Chat y WhatsApp** automatizado
- **📧 Email marketing** avanzado
- **🤖 Integración con IA** (ChatGPT, Claude, etc.)

---

## 🚀 **Empezar Ahora**

### **🟢 ¿Eres nuevo?**
👉 **[Guía para Principiantes](./public/user-guides/getting-started.md)**

### **🟡 ¿Ya tienes experiencia?**
👉 **[Ver Ejemplos de Código](./public/user-guides/code-examples.md)**

### **🔴 ¿Necesitas personalización?**
👉 **[Guía de Personalización](./public/user-guides/customization.md)**

---

## 📖 **Guías Disponibles**

### **🟢 Para Principiantes**
- **[🚀 Empezar desde Cero](./public/user-guides/getting-started.md)** - Tu primera petición
- **[🔐 Autenticación Simple](./public/user-guides/authentication-basic.md)** - Cómo obtener acceso

### **🟡 Para Intermedios**
- **[📅 Gestión de Eventos](./public/user-guides/events-management.md)** - Crear y gestionar eventos
- **[👥 Sistema CRM](./public/user-guides/crm-system.md)** - Contactos y leads
- **[💬 Chat y WhatsApp](./public/user-guides/chat-whatsapp.md)** - Mensajería automatizada

### **🔴 Para Expertos**
- **[🤖 Integración con IA](./public/user-guides/ai-integration.md)** - ChatGPT y Claude
- **[🔧 API Avanzada](./public/user-guides/advanced-api.md)** - Webhooks y optimización
- **[🎨 Personalización](./public/user-guides/customization.md)** - Schemas personalizados

### **📚 Referencias**
- **[💻 Ejemplos de Código](./public/user-guides/code-examples.md)** - JavaScript, Python, PHP, React
- **[📋 Referencia Completa](./public/user-guides/complete-reference.md)** - Todos los endpoints
- **[❓ Preguntas Frecuentes](./public/user-guides/faq.md)** - 50+ preguntas comunes

---

## 🛠️ **Herramientas de Desarrollo**

### **📋 Colección de Postman**
[Descargar aquí](./public/user-guides/postman-collection.json)

### **🧪 Testing**
- **GraphQL Playground:** https://api2.eventosorganizador.com/graphql
- **Sandbox de Pruebas:** https://testapi2.eventosorganizador.com/graphql

### **📞 Soporte**
- **Email:** soporte@eventosorganizador.com
- **Discord:** [Unirse al servidor](https://discord.gg/eventos-api)
- **GitHub:** [Reportar issues](https://github.com/eventosorganizador/api-v2)

---

## 🎯 **Ejemplo Rápido**

```javascript
// 1. Generar token
const token = await fetch('https://api2.eventosorganizador.com/graphql', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', 'Origin': 'https://tu-dominio.com' },
  body: JSON.stringify({
    query: `mutation { generateToken(input: { uid: "usuario", email: "test@ejemplo.com" }) { success token } }`
  })
}).then(r => r.json()).then(d => d.data.generateToken.token);

// 2. Crear evento
const evento = await fetch('https://api2.eventosorganizador.com/graphql', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json', 
    'Authorization': `Bearer ${token}`,
    'Origin': 'https://tu-dominio.com'
  },
  body: JSON.stringify({
    query: `mutation { createEvent(input: { nombre: "Mi Boda", fecha: "2025-12-25" }) { success event { id nombre } } }`
  })
}).then(r => r.json());

console.log('Evento creado:', evento.data.createEvent.event);
```

---

## 📊 **Estadísticas**

- **11 guías especializadas** desde principiante hasta experto
- **Ejemplos en 5 lenguajes** (JavaScript, Python, PHP, React, Curl)
- **Colección de Postman** con todos los endpoints
- **FAQ completo** con 50+ preguntas frecuentes
- **Documentación 100% operativa** y actualizada

---

**Última actualización:** Octubre 2025  
**Versión de la API:** 2.0.0  
**Estado:** ✅ 100% Operativa
