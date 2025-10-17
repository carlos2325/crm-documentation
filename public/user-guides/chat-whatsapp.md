# 💬 Chat y WhatsApp - Guía Completa

**Automatiza mensajería y crea chatbots inteligentes con nuestra API**

---

## 🎯 **¿Qué puedes hacer con Chat y WhatsApp?**

### **Mensajería Automática**
- ✅ **Envío masivo** de mensajes personalizados
- ✅ **Plantillas aprobadas** por WhatsApp Business
- ✅ **Respuestas automáticas** basadas en palabras clave
- ✅ **Seguimiento de entregas** y estados de lectura

### **Chatbots Inteligentes**
- ✅ **Respuestas contextuales** según el tipo de evento
- ✅ **Integración con CRM** para personalizar mensajes
- ✅ **Gestión de flujos** conversacionales complejos
- ✅ **Escalamiento a humanos** cuando sea necesario

---

## 📱 **Configuración de WhatsApp**

### **Requisitos Previos**
1. **Cuenta WhatsApp Business API** activa
2. **Número de teléfono** verificado
3. **Plantillas aprobadas** por WhatsApp
4. **Token de acceso** a nuestra API

### **Verificar Conexión**
```javascript
async function verificarWhatsApp() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query {
          getWhatsAppStatus {
            success
            status {
              conectado
              numeroVerificado
              plantillasAprobadas
              mensajesEnviados
              ultimaActividad
            }
            errors
          }
        }
      `
    })
  });

  const data = await response.json();
  
  if (data.data.getWhatsAppStatus.success) {
    const status = data.data.getWhatsAppStatus.status;
    console.log('📱 Estado de WhatsApp:');
    console.log(`   Conectado: ${status.conectado ? '✅' : '❌'}`);
    console.log(`   Número verificado: ${status.numeroVerificado ? '✅' : '❌'}`);
    console.log(`   Plantillas aprobadas: ${status.plantillasAprobadas}`);
    console.log(`   Mensajes enviados: ${status.mensajesEnviados}`);
    return status;
  } else {
    console.log('❌ Error verificando WhatsApp:', data.data.getWhatsAppStatus.errors);
    return null;
  }
}
```

---

## 📝 **Envío de Mensajes**

### **Enviar Mensaje Simple**
```javascript
async function enviarMensajeWhatsApp(numero, mensaje) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation SendWhatsAppMessage($input: SendWhatsAppMessageInput!) {
          sendWhatsAppMessage(input: $input) {
            success
            messageId
            status
            timestamp
            errors
          }
        }
      `,
      variables: {
        input: {
          numero: numero,
          mensaje: mensaje,
          tipo: "texto"
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.sendWhatsAppMessage.success) {
    const resultado = data.data.sendWhatsAppMessage;
    console.log('✅ Mensaje enviado exitosamente:');
    console.log(`   ID: ${resultado.messageId}`);
    console.log(`   Estado: ${resultado.status}`);
    console.log(`   Timestamp: ${resultado.timestamp}`);
    return resultado.messageId;
  } else {
    console.log('❌ Error enviando mensaje:', data.data.sendWhatsAppMessage.errors);
    return null;
  }
}

// Ejemplo de uso
await enviarMensajeWhatsApp("+34600123456", "¡Hola! Te recordamos que tienes un evento próximo.");
```

### **Enviar Mensaje con Plantilla**
```javascript
async function enviarMensajePlantilla(numero, plantilla, variables) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation SendWhatsAppTemplate($input: SendWhatsAppTemplateInput!) {
          sendWhatsAppTemplate(input: $input) {
            success
            messageId
            status
            timestamp
            errors
          }
        }
      `,
      variables: {
        input: {
          numero: numero,
          plantilla: plantilla,
          variables: variables
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.sendWhatsAppTemplate.success) {
    const resultado = data.data.sendWhatsAppTemplate;
    console.log('✅ Plantilla enviada exitosamente:');
    console.log(`   ID: ${resultado.messageId}`);
    console.log(`   Estado: ${resultado.status}`);
    return resultado.messageId;
  } else {
    console.log('❌ Error enviando plantilla:', data.data.sendWhatsAppTemplate.errors);
    return null;
  }
}

// Ejemplo de uso
await enviarMensajePlantilla("+34600123456", "recordatorio_evento", {
  nombre: "María",
  nombre_evento: "Mi Boda Perfecta",
  fecha: "25 de Diciembre",
  hora: "18:00"
});
```

### **Enviar Mensaje con Multimedia**
```javascript
async function enviarMensajeMultimedia(numero, tipo, url, mensaje) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation SendWhatsAppMedia($input: SendWhatsAppMediaInput!) {
          sendWhatsAppMedia(input: $input) {
            success
            messageId
            status
            timestamp
            errors
          }
        }
      `,
      variables: {
        input: {
          numero: numero,
          tipo: tipo,  // "imagen", "video", "documento", "audio"
          url: url,
          mensaje: mensaje
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.sendWhatsAppMedia.success) {
    const resultado = data.data.sendWhatsAppMedia;
    console.log('✅ Multimedia enviada exitosamente:');
    console.log(`   ID: ${resultado.messageId}`);
    console.log(`   Estado: ${resultado.status}`);
    return resultado.messageId;
  } else {
    console.log('❌ Error enviando multimedia:', data.data.sendWhatsAppMedia.errors);
    return null;
  }
}

// Ejemplos de uso
await enviarMensajeMultimedia("+34600123456", "imagen", "https://ejemplo.com/foto.jpg", "Aquí tienes la foto de tu evento");
await enviarMensajeMultimedia("+34600123456", "documento", "https://ejemplo.com/invitacion.pdf", "Tu invitación personalizada");
```

---

## 🤖 **Chatbots Inteligentes**

### **Crear Chatbot**
```javascript
async function crearChatbot() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation CreateChatbot($input: CreateChatbotInput!) {
          createChatbot(input: $input) {
            success
            chatbot {
              id
              nombre
              descripcion
              estado
              flujos {
                id
                nombre
                palabrasClave
                respuesta
                accion
              }
              createdAt
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          nombre: "Asistente de Bodas",
          descripcion: "Chatbot especializado en consultas sobre bodas y eventos",
          flujos: [
            {
              nombre: "Saludo",
              palabrasClave: ["hola", "buenos días", "buenas tardes"],
              respuesta: "¡Hola! Soy tu asistente de bodas. ¿En qué puedo ayudarte?",
              accion: "continuar"
            },
            {
              nombre: "Consultar Precios",
              palabrasClave: ["precio", "costo", "cuanto cuesta"],
              respuesta: "Te ayudo con información sobre precios. ¿Qué tipo de evento estás planeando?",
              accion: "solicitar_datos"
            },
            {
              nombre: "Consultar Disponibilidad",
              palabrasClave: ["disponible", "fecha", "cuando"],
              respuesta: "Para consultar disponibilidad, necesito saber la fecha aproximada. ¿Qué fecha tienes en mente?",
              accion: "solicitar_fecha"
            }
          ]
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.createChatbot.success) {
    const chatbot = data.data.createChatbot.chatbot;
    console.log('✅ Chatbot creado exitosamente:');
    console.log(`   ID: ${chatbot.id}`);
    console.log(`   Nombre: ${chatbot.nombre}`);
    console.log(`   Flujos: ${chatbot.flujos.length}`);
    return chatbot.id;
  } else {
    console.log('❌ Error creando chatbot:', data.data.createChatbot.errors);
    return null;
  }
}
```

### **Procesar Mensaje de Chatbot**
```javascript
async function procesarMensajeChatbot(numero, mensaje, chatbotId) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation ProcessChatbotMessage($input: ProcessChatbotMessageInput!) {
          processChatbotMessage(input: $input) {
            success
            respuesta {
              mensaje
              tipo
              accion
              datos
            }
            flujo {
              id
              nombre
              estado
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          numero: numero,
          mensaje: mensaje,
          chatbotId: chatbotId
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.processChatbotMessage.success) {
    const resultado = data.data.processChatbotMessage;
    console.log('🤖 Respuesta del chatbot:');
    console.log(`   Mensaje: ${resultado.respuesta.mensaje}`);
    console.log(`   Acción: ${resultado.respuesta.accion}`);
    console.log(`   Flujo: ${resultado.flujo.nombre}`);
    
    // Enviar respuesta automáticamente
    if (resultado.respuesta.mensaje) {
      await enviarMensajeWhatsApp(numero, resultado.respuesta.mensaje);
    }
    
    return resultado;
  } else {
    console.log('❌ Error procesando mensaje:', data.data.processChatbotMessage.errors);
    return null;
  }
}
```

---

## 📊 **Campañas de WhatsApp**

### **Crear Campaña Masiva**
```javascript
async function crearCampanaWhatsAppMasiva() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation CreateWhatsAppCampaign($input: CreateWhatsAppCampaignInput!) {
          createWhatsAppCampaign(input: $input) {
            success
            campaign {
              id
              nombre
              mensaje
              plantilla
              destinatarios {
                total
                segmentos
              }
              programacion {
                fechaEnvio
                horaEnvio
                zonaHoraria
              }
              estado
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          nombre: "Promoción Navidad 2025",
          mensaje: "¡Feliz Navidad! {{nombre}}, tenemos ofertas especiales para tu evento. ¿Te interesa?",
          plantilla: "promocion_navidad",
          segmentos: ["clientes_activos", "leads_calificados"],
          programacion: {
            fechaEnvio: "2025-12-24",
            horaEnvio: "10:00",
            zonaHoraria: "Europe/Madrid"
          }
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.createWhatsAppCampaign.success) {
    const campaña = data.data.createWhatsAppCampaign.campaign;
    console.log('✅ Campaña de WhatsApp creada exitosamente:');
    console.log(`   ID: ${campaña.id}`);
    console.log(`   Nombre: ${campaña.nombre}`);
    console.log(`   Destinatarios: ${campaña.destinatarios.total}`);
    console.log(`   Fecha envío: ${campaña.programacion.fechaEnvio}`);
    return campaña.id;
  } else {
    console.log('❌ Error creando campaña:', data.data.createWhatsAppCampaign.errors);
    return null;
  }
}
```

### **Ejecutar Campaña**
```javascript
async function ejecutarCampanaWhatsApp(campanaId) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation ExecuteWhatsAppCampaign($campanaId: ID!) {
          executeWhatsAppCampaign(campanaId: $campanaId) {
            success
            resultado {
              mensajesEnviados
              mensajesEntregados
              mensajesFallidos
              tiempoEjecucion
            }
            errors
          }
        }
      `,
      variables: {
        campanaId: campanaId
      }
    })
  });

  const data = await response.json();
  
  if (data.data.executeWhatsAppCampaign.success) {
    const resultado = data.data.executeWhatsAppCampaign.resultado;
    console.log('✅ Campaña ejecutada exitosamente:');
    console.log(`   Mensajes enviados: ${resultado.mensajesEnviados}`);
    console.log(`   Mensajes entregados: ${resultado.mensajesEntregados}`);
    console.log(`   Mensajes fallidos: ${resultado.mensajesFallidos}`);
    console.log(`   Tiempo ejecución: ${resultado.tiempoEjecucion}s`);
    return resultado;
  } else {
    console.log('❌ Error ejecutando campaña:', data.data.executeWhatsAppCampaign.errors);
    return null;
  }
}
```

---

## 📈 **Estadísticas y Monitoreo**

### **Obtener Estadísticas de WhatsApp**
```javascript
async function obtenerEstadisticasWhatsApp() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query GetWhatsAppStats {
          getWhatsAppStats {
            success
            stats {
              mensajesEnviados
              mensajesEntregados
              mensajesLeidos
              mensajesFallidos
              porcentajeEntrega
              porcentajeLectura
              tiempoPromedioEntrega
              conversacionesActivas
              chatbotInteracciones
            }
            errors
          }
        }
      `
    })
  });

  const data = await response.json();
  
  if (data.data.getWhatsAppStats.success) {
    const stats = data.data.getWhatsAppStats.stats;
    console.log('📊 Estadísticas de WhatsApp:');
    console.log(`   📤 Mensajes enviados: ${stats.mensajesEnviados}`);
    console.log(`   ✅ Mensajes entregados: ${stats.mensajesEntregados}`);
    console.log(`   👀 Mensajes leídos: ${stats.mensajesLeidos}`);
    console.log(`   ❌ Mensajes fallidos: ${stats.mensajesFallidos}`);
    console.log(`   📈 % Entrega: ${stats.porcentajeEntrega}%`);
    console.log(`   📈 % Lectura: ${stats.porcentajeLectura}%`);
    console.log(`   ⏱️ Tiempo promedio entrega: ${stats.tiempoPromedioEntrega}s`);
    console.log(`   💬 Conversaciones activas: ${stats.conversacionesActivas}`);
    console.log(`   🤖 Interacciones chatbot: ${stats.chatbotInteracciones}`);
    return stats;
  } else {
    console.log('❌ Error obteniendo estadísticas:', data.data.getWhatsAppStats.errors);
    return null;
  }
}
```

### **Obtener Historial de Mensajes**
```javascript
async function obtenerHistorialMensajes(numero, limite = 10) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query GetMessageHistory($numero: String!, $limite: Int!) {
          getMessageHistory(numero: $numero, limite: $limite) {
            success
            mensajes {
              id
              contenido
              tipo
              direccion
              timestamp
              estado
            }
            totalCount
            errors
          }
        }
      `,
      variables: {
        numero: numero,
        limite: limite
      }
    })
  });

  const data = await response.json();
  
  if (data.data.getMessageHistory.success) {
    const mensajes = data.data.getMessageHistory.mensajes;
    console.log(`💬 Historial de mensajes con ${numero}:`);
    mensajes.forEach(mensaje => {
      const direccion = mensaje.direccion === 'saliente' ? '📤' : '📥';
      const estado = mensaje.estado === 'entregado' ? '✅' : 
                    mensaje.estado === 'leido' ? '👀' : '⏳';
      console.log(`   ${direccion} ${mensaje.timestamp}: ${mensaje.contenido} ${estado}`);
    });
    return mensajes;
  } else {
    console.log('❌ Error obteniendo historial:', data.data.getMessageHistory.errors);
    return [];
  }
}
```

---

## 🎯 **Ejemplo Completo: Sistema de Chat Automatizado**

```javascript
async function sistemaChatAutomatizado() {
  console.log('🤖 Iniciando sistema de chat automatizado...');
  
  try {
    // 1. Verificar conexión WhatsApp
    console.log('1️⃣ Verificando conexión WhatsApp...');
    const status = await verificarWhatsApp();
    if (!status || !status.conectado) {
      throw new Error('WhatsApp no está conectado');
    }
    
    // 2. Crear chatbot
    console.log('2️⃣ Creando chatbot...');
    const chatbotId = await crearChatbot();
    if (!chatbotId) throw new Error('No se pudo crear el chatbot');
    
    // 3. Crear campaña promocional
    console.log('3️⃣ Creando campaña promocional...');
    const campañaId = await crearCampanaWhatsAppMasiva();
    if (!campañaId) throw new Error('No se pudo crear la campaña');
    
    // 4. Ejecutar campaña
    console.log('4️⃣ Ejecutando campaña...');
    const resultado = await ejecutarCampanaWhatsApp(campañaId);
    
    // 5. Simular conversaciones con chatbot
    console.log('5️⃣ Simulando conversaciones...');
    const numerosPrueba = ["+34600123456", "+34600789012"];
    
    for (const numero of numerosPrueba) {
      console.log(`   Procesando mensaje de ${numero}...`);
      await procesarMensajeChatbot(numero, "hola", chatbotId);
      await new Promise(resolve => setTimeout(resolve, 1000)); // Pausa 1 segundo
      await procesarMensajeChatbot(numero, "precio", chatbotId);
    }
    
    // 6. Obtener estadísticas finales
    console.log('6️⃣ Obteniendo estadísticas finales...');
    const stats = await obtenerEstadisticasWhatsApp();
    
    console.log('🎉 ¡Sistema de chat automatizado funcionando!');
    console.log(`   Chatbot ID: ${chatbotId}`);
    console.log(`   Campaña ID: ${campañaId}`);
    console.log(`   Mensajes enviados: ${resultado.mensajesEnviados}`);
    console.log(`   Conversaciones activas: ${stats.conversacionesActivas}`);
    
    return {
      chatbot: chatbotId,
      campaña: campañaId,
      mensajes: resultado.mensajesEnviados,
      stats: stats
    };
    
  } catch (error) {
    console.error('❌ Error en sistema automatizado:', error.message);
    return null;
  }
}

// Ejecutar sistema completo
const resultado = await sistemaChatAutomatizado();
```

---

## 🎯 **Próximos Pasos**

### **¿Ya dominas Chat y WhatsApp?**
👉 **[Ir a Integración con IA](./ai-integration.md)**

### **¿Quieres ver ejemplos avanzados?**
👉 **[Ir a API Avanzada](./advanced-api.md)**

### **¿Necesitas personalización?**
👉 **[Ir a Personalización](./customization.md)**

---

## 💡 **Consejos para Chat y WhatsApp**

1. **Respeta los límites:** WhatsApp tiene límites de velocidad de envío
2. **Usa plantillas aprobadas:** Evita que tus mensajes sean bloqueados
3. **Personaliza mensajes:** Usa variables para mayor impacto
4. **Monitorea entregas:** Revisa estadísticas regularmente
5. **Escala a humanos:** Ten un proceso para casos complejos

---

**¿Necesitas ayuda con Chat y WhatsApp?** 📧 soporte@eventosorganizador.com
