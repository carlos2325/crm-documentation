# 👥 Sistema CRM - Guía Completa

**Gestiona contactos, leads y campañas de marketing como un profesional**

---

## 🎯 **¿Qué es el Sistema CRM?**

Nuestro CRM (Customer Relationship Management) te permite:
- ✅ **Gestionar contactos** y leads de manera organizada
- ✅ **Crear campañas** de email y WhatsApp
- ✅ **Seguir el proceso** de ventas paso a paso
- ✅ **Automatizar comunicaciones** con tus clientes
- ✅ **Analizar resultados** de tus campañas

---

## 🚀 **Empezar con CRM**

### **Conceptos Básicos**
- **Contacto:** Una persona con la que tienes relación
- **Lead:** Un contacto potencial que puede convertirse en cliente
- **Campaña:** Una serie de mensajes enviados a un grupo de contactos
- **Segmento:** Un grupo de contactos con características similares

---

## 👤 **Gestión de Contactos**

### **Crear un Contacto**
```javascript
async function crearContacto() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation CreateContact($input: CreateContactInput!) {
          createContact(input: $input) {
            success
            contact {
              id
              nombre
              apellidos
              email
              telefono
              empresa
              cargo
              estado
              origen
              createdAt
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          nombre: "María",
          apellidos: "García López",
          email: "maria@ejemplo.com",
          telefono: "+34 600 123 456",
          empresa: "Empresa ABC",
          cargo: "Directora de Marketing",
          estado: "activo",
          origen: "web"
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.createContact.success) {
    const contacto = data.data.createContact.contact;
    console.log('✅ Contacto creado exitosamente:');
    console.log(`   ID: ${contacto.id}`);
    console.log(`   Nombre: ${contacto.nombre} ${contacto.apellidos}`);
    console.log(`   Email: ${contacto.email}`);
    console.log(`   Empresa: ${contacto.empresa}`);
    return contacto.id;
  } else {
    console.log('❌ Error creando contacto:', data.data.createContact.errors);
    return null;
  }
}
```

### **Obtener Lista de Contactos**
```javascript
async function obtenerContactos() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query GetContacts {
          getContacts {
            success
            contacts {
              id
              nombre
              apellidos
              email
              telefono
              empresa
              cargo
              estado
              origen
              createdAt
            }
            totalCount
            errors
          }
        }
      `
    })
  });

  const data = await response.json();
  
  if (data.data.getContacts.success) {
    const contactos = data.data.getContacts.contacts;
    console.log(`👥 Tienes ${data.data.getContacts.totalCount} contactos:`);
    contactos.forEach(contacto => {
      console.log(`- ${contacto.nombre} ${contacto.apellidos} (${contacto.empresa})`);
    });
    return contactos;
  } else {
    console.log('❌ Error obteniendo contactos:', data.data.getContacts.errors);
    return [];
  }
}
```

### **Buscar Contactos**
```javascript
async function buscarContactos(termino) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query SearchContacts($termino: String!) {
          searchContacts(termino: $termino) {
            success
            contacts {
              id
              nombre
              apellidos
              email
              telefono
              empresa
            }
            totalCount
            errors
          }
        }
      `,
      variables: {
        termino: termino
      }
    })
  });

  const data = await response.json();
  
  if (data.data.searchContacts.success) {
    const contactos = data.data.searchContacts.contacts;
    console.log(`🔍 Búsqueda "${termino}": ${contactos.length} resultados`);
    contactos.forEach(contacto => {
      console.log(`- ${contacto.nombre} ${contacto.apellidos} - ${contacto.email}`);
    });
    return contactos;
  } else {
    console.log('❌ Error buscando contactos:', data.data.searchContacts.errors);
    return [];
  }
}

// Ejemplos de búsqueda
await buscarContactos("maria");
await buscarContactos("@gmail.com");
await buscarContactos("Empresa ABC");
```

---

## 🎯 **Gestión de Leads**

### **Convertir Contacto en Lead**
```javascript
async function convertirEnLead(contactoId, datosLead) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation ConvertToLead($contactoId: ID!, $input: CreateLeadInput!) {
          convertToLead(contactoId: $contactoId, input: $input) {
            success
            lead {
              id
              contacto {
                id
                nombre
                apellidos
                email
              }
              estado
              prioridad
              valor
              fuente
              notas
              fechaConversion
            }
            errors
          }
        }
      `,
      variables: {
        contactoId: contactoId,
        input: datosLead
      }
    })
  });

  const data = await response.json();
  
  if (data.data.convertToLead.success) {
    const lead = data.data.convertToLead.lead;
    console.log('✅ Contacto convertido en lead exitosamente:');
    console.log(`   Lead ID: ${lead.id}`);
    console.log(`   Contacto: ${lead.contacto.nombre} ${lead.contacto.apellidos}`);
    console.log(`   Estado: ${lead.estado}`);
    console.log(`   Valor: €${lead.valor}`);
    return lead.id;
  } else {
    console.log('❌ Error convirtiendo en lead:', data.data.convertToLead.errors);
    return null;
  }
}

// Ejemplo de uso
await convertirEnLead(contactoId, {
  estado: "nuevo",
  prioridad: "alta",
  valor: 5000,
  fuente: "web",
  notas: "Interesado en boda para diciembre 2025"
});
```

### **Obtener Leads por Estado**
```javascript
async function obtenerLeadsPorEstado(estado) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query GetLeadsByStatus($estado: String!) {
          getLeadsByStatus(estado: $estado) {
            success
            leads {
              id
              contacto {
                id
                nombre
                apellidos
                email
                telefono
              }
              estado
              prioridad
              valor
              fuente
              notas
              fechaConversion
            }
            totalCount
            errors
          }
        }
      `,
      variables: {
        estado: estado
      }
    })
  });

  const data = await response.json();
  
  if (data.data.getLeadsByStatus.success) {
    const leads = data.data.getLeadsByStatus.leads;
    console.log(`🎯 Leads en estado "${estado}": ${leads.length}`);
    leads.forEach(lead => {
      console.log(`- ${lead.contacto.nombre} ${lead.contacto.apellidos} (€${lead.valor})`);
    });
    return leads;
  } else {
    console.log('❌ Error obteniendo leads:', data.data.getLeadsByStatus.errors);
    return [];
  }
}

// Ejemplos de uso
await obtenerLeadsPorEstado("nuevo");
await obtenerLeadsPorEstado("en_proceso");
await obtenerLeadsPorEstado("calificado");
await obtenerLeadsPorEstado("convertido");
```

### **Actualizar Estado de Lead**
```javascript
async function actualizarEstadoLead(leadId, nuevoEstado) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation UpdateLeadStatus($leadId: ID!, $estado: String!) {
          updateLeadStatus(leadId: $leadId, estado: $estado) {
            success
            lead {
              id
              estado
              fechaActualizacion
            }
            errors
          }
        }
      `,
      variables: {
        leadId: leadId,
        estado: nuevoEstado
      }
    })
  });

  const data = await response.json();
  
  if (data.data.updateLeadStatus.success) {
    console.log(`✅ Estado del lead actualizado a: ${nuevoEstado}`);
    return data.data.updateLeadStatus.lead;
  } else {
    console.log('❌ Error actualizando estado:', data.data.updateLeadStatus.errors);
    return null;
  }
}

// Flujo típico de lead
const leadId = await convertirEnLead(contactoId, datosLead);
await actualizarEstadoLead(leadId, "en_proceso");
await actualizarEstadoLead(leadId, "calificado");
await actualizarEstadoLead(leadId, "convertido");
```

---

## 📧 **Campañas de Marketing**

### **Crear Campaña de Email**
```javascript
async function crearCampanaEmail() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation CreateEmailCampaign($input: CreateEmailCampaignInput!) {
          createEmailCampaign(input: $input) {
            success
            campaign {
              id
              nombre
              asunto
              tipo
              estado
              fechaCreacion
              fechaProgramada
              destinatarios {
                total
                segmentos
              }
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          nombre: "Promoción Bodas 2025",
          asunto: "¡Ofertas especiales para tu boda perfecta!",
          tipo: "promocional",
          template: "bodas-2025",
          segmentos: ["leads_nuevos", "contactos_activos"],
          fechaProgramada: "2025-10-20T10:00:00Z"
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.createEmailCampaign.success) {
    const campaña = data.data.createEmailCampaign.campaign;
    console.log('✅ Campaña de email creada exitosamente:');
    console.log(`   ID: ${campaña.id}`);
    console.log(`   Nombre: ${campaña.nombre}`);
    console.log(`   Asunto: ${campaña.asunto}`);
    console.log(`   Destinatarios: ${campaña.destinatarios.total}`);
    return campaña.id;
  } else {
    console.log('❌ Error creando campaña:', data.data.createEmailCampaign.errors);
    return null;
  }
}
```

### **Crear Campaña de WhatsApp**
```javascript
async function crearCampanaWhatsApp() {
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
              tipo
              estado
              fechaCreacion
              fechaProgramada
              destinatarios {
                total
                segmentos
              }
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          nombre: "Recordatorio Eventos",
          mensaje: "Hola {{nombre}}, recordamos que tienes un evento próximo. ¿Necesitas ayuda con algo?",
          tipo: "recordatorio",
          template: "recordatorio-evento",
          segmentos: ["eventos_proximos"],
          fechaProgramada: "2025-10-20T09:00:00Z"
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
    console.log(`   Mensaje: ${campaña.mensaje}`);
    console.log(`   Destinatarios: ${campaña.destinatarios.total}`);
    return campaña.id;
  } else {
    console.log('❌ Error creando campaña WhatsApp:', data.data.createWhatsAppCampaign.errors);
    return null;
  }
}
```

### **Enviar Campaña**
```javascript
async function enviarCampana(campanaId) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation SendCampaign($campanaId: ID!) {
          sendCampaign(campanaId: $campanaId) {
            success
            sentCount
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
  
  if (data.data.sendCampaign.success) {
    console.log(`✅ Campaña enviada exitosamente: ${data.data.sendCampaign.sentCount} mensajes`);
    return data.data.sendCampaign.sentCount;
  } else {
    console.log('❌ Error enviando campaña:', data.data.sendCampaign.errors);
    return 0;
  }
}
```

### **Obtener Estadísticas de Campaña**
```javascript
async function obtenerEstadisticasCampana(campanaId) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query GetCampaignStats($campanaId: ID!) {
          getCampaignStats(campanaId: $campanaId) {
            success
            stats {
              enviados
              entregados
              abiertos
              clicks
              respuestas
              porcentajeApertura
              porcentajeClicks
              porcentajeRespuesta
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
  
  if (data.data.getCampaignStats.success) {
    const stats = data.data.getCampaignStats.stats;
    console.log('📊 Estadísticas de la campaña:');
    console.log(`   📧 Enviados: ${stats.enviados}`);
    console.log(`   ✅ Entregados: ${stats.entregados}`);
    console.log(`   👀 Abiertos: ${stats.abiertos} (${stats.porcentajeApertura}%)`);
    console.log(`   🖱️ Clicks: ${stats.clicks} (${stats.porcentajeClicks}%)`);
    console.log(`   💬 Respuestas: ${stats.respuestas} (${stats.porcentajeRespuesta}%)`);
    return stats;
  } else {
    console.log('❌ Error obteniendo estadísticas:', data.data.getCampaignStats.errors);
    return null;
  }
}
```

---

## 📊 **Segmentación de Contactos**

### **Crear Segmento Personalizado**
```javascript
async function crearSegmento() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation CreateSegment($input: CreateSegmentInput!) {
          createSegment(input: $input) {
            success
            segment {
              id
              nombre
              descripcion
              criterios
              totalContactos
              createdAt
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          nombre: "Clientes VIP",
          descripcion: "Contactos con valor > €5000",
          criterios: {
            valorMinimo: 5000,
            estado: "activo",
            empresa: {
              incluir: ["Empresa ABC", "Corporación XYZ"]
            }
          }
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.createSegment.success) {
    const segmento = data.data.createSegment.segment;
    console.log('✅ Segmento creado exitosamente:');
    console.log(`   ID: ${segmento.id}`);
    console.log(`   Nombre: ${segmento.nombre}`);
    console.log(`   Contactos: ${segmento.totalContactos}`);
    return segmento.id;
  } else {
    console.log('❌ Error creando segmento:', data.data.createSegment.errors);
    return null;
  }
}
```

---

## 🎯 **Ejemplo Completo: Flujo CRM**

```javascript
async function flujoCRMCompleto() {
  console.log('🚀 Iniciando flujo completo de CRM...');
  
  try {
    // 1. Crear contactos
    console.log('1️⃣ Creando contactos...');
    const contactos = [
      { nombre: "Ana", apellidos: "Martín", email: "ana@empresa1.com", empresa: "Empresa 1" },
      { nombre: "Carlos", apellidos: "Ruiz", email: "carlos@empresa2.com", empresa: "Empresa 2" },
      { nombre: "Laura", apellidos: "González", email: "laura@empresa3.com", empresa: "Empresa 3" }
    ];
    
    const contactosIds = [];
    for (const contacto of contactos) {
      const contactoId = await crearContacto(contacto);
      if (contactoId) contactosIds.push(contactoId);
    }
    
    // 2. Convertir en leads
    console.log('2️⃣ Convirtiendo contactos en leads...');
    const leadsIds = [];
    for (const contactoId of contactosIds) {
      const leadId = await convertirEnLead(contactoId, {
        estado: "nuevo",
        prioridad: "media",
        valor: Math.floor(Math.random() * 10000) + 1000,
        fuente: "web",
        notas: "Lead generado automáticamente"
      });
      if (leadId) leadsIds.push(leadId);
    }
    
    // 3. Crear campaña de email
    console.log('3️⃣ Creando campaña de email...');
    const campañaId = await crearCampanaEmail();
    
    // 4. Enviar campaña
    console.log('4️⃣ Enviando campaña...');
    const mensajesEnviados = await enviarCampana(campañaId);
    
    // 5. Obtener estadísticas
    console.log('5️⃣ Obteniendo estadísticas...');
    const stats = await obtenerEstadisticasCampana(campañaId);
    
    // 6. Actualizar leads
    console.log('6️⃣ Actualizando estados de leads...');
    for (const leadId of leadsIds) {
      await actualizarEstadoLead(leadId, "en_proceso");
    }
    
    console.log('🎉 ¡Flujo CRM completado exitosamente!');
    console.log(`   Contactos creados: ${contactosIds.length}`);
    console.log(`   Leads generados: ${leadsIds.length}`);
    console.log(`   Mensajes enviados: ${mensajesEnviados}`);
    
    return {
      contactos: contactosIds.length,
      leads: leadsIds.length,
      mensajes: mensajesEnviados,
      stats: stats
    };
    
  } catch (error) {
    console.error('❌ Error en flujo CRM:', error.message);
    return null;
  }
}

// Ejecutar flujo completo
const resultado = await flujoCRMCompleto();
```

---

## 🎯 **Próximos Pasos**

### **¿Ya dominas el CRM?**
👉 **[Ir a Chat y WhatsApp](./chat-whatsapp.md)**

### **¿Quieres integrar con IA?**
👉 **[Ir a Integración con IA](./ai-integration.md)**

### **¿Necesitas ejemplos avanzados?**
👉 **[Ver Código de Ejemplo](./code-examples.md)**

---

## 💡 **Consejos para CRM**

1. **Organiza tus contactos:** Usa etiquetas y segmentos para mejor organización
2. **Sigue el proceso:** Mantén un flujo consistente de leads
3. **Automatiza campañas:** Programa envíos para momentos óptimos
4. **Analiza resultados:** Revisa estadísticas regularmente
5. **Personaliza mensajes:** Usa variables dinámicas para mayor impacto

---

**¿Necesitas ayuda con CRM?** 📧 soporte@eventosorganizador.com
