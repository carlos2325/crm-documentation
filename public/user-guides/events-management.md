# 📅 Gestión de Eventos - Guía Completa

**Aprende a crear, gestionar y automatizar eventos con nuestra API**

---

## 🎯 **¿Qué puedes hacer con Eventos?**

### **Crear Eventos**
- ✅ Bodas, cumpleaños, corporativos
- ✅ Configurar fechas y ubicaciones
- ✅ Establecer presupuestos y tareas
- ✅ Definir listas de invitados

### **Gestionar Eventos**
- ✅ Modificar detalles
- ✅ Agregar/quitar invitados
- ✅ Actualizar presupuestos
- ✅ Cambiar estados

### **Automatizar Eventos**
- ✅ Envío automático de invitaciones
- ✅ Recordatorios por WhatsApp/Email
- ✅ Seguimiento de confirmaciones
- ✅ Generación de reportes

---

## 🚀 **Crear tu Primer Evento**

### **Estructura Básica de un Evento**
```javascript
const nuevoEvento = {
  nombre: "Mi Boda Perfecta",
  fecha: "2025-12-25",
  hora: "18:00",
  ubicacion: "Hotel Maravilloso",
  direccion: "Calle Principal 123, Madrid",
  descripcion: "Una boda inolvidable",
  tipo: "boda",
  presupuesto: 15000,
  estado: "planificacion"
};
```

### **Ejemplo Completo: Crear Evento**
```javascript
async function crearEvento() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation CreateEvent($input: CreateEventInput!) {
          createEvent(input: $input) {
            success
            event {
              id
              nombre
              fecha
              hora
              ubicacion
              direccion
              descripcion
              tipo
              presupuesto
              estado
              createdAt
              updatedAt
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          nombre: "Mi Boda Perfecta",
          fecha: "2025-12-25",
          hora: "18:00",
          ubicacion: "Hotel Maravilloso",
          direccion: "Calle Principal 123, Madrid",
          descripcion: "Una boda inolvidable",
          tipo: "boda",
          presupuesto: 15000,
          estado: "planificacion"
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.createEvent.success) {
    const evento = data.data.createEvent.event;
    console.log('✅ Evento creado exitosamente:');
    console.log(`   ID: ${evento.id}`);
    console.log(`   Nombre: ${evento.nombre}`);
    console.log(`   Fecha: ${evento.fecha}`);
    console.log(`   Ubicación: ${evento.ubicacion}`);
    return evento.id;
  } else {
    console.log('❌ Error creando evento:', data.data.createEvent.errors);
    return null;
  }
}

// Usar la función
const eventoId = await crearEvento();
```

---

## 📋 **Obtener y Listar Eventos**

### **Obtener Todos tus Eventos**
```javascript
async function obtenerMisEventos() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query GetUserEvents {
          getUserEvents {
            success
            events {
              id
              nombre
              fecha
              hora
              ubicacion
              tipo
              estado
              presupuesto
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
  
  if (data.data.getUserEvents.success) {
    console.log(`📊 Tienes ${data.data.getUserEvents.totalCount} eventos:`);
    data.data.getUserEvents.events.forEach(evento => {
      console.log(`- ${evento.nombre} (${evento.fecha}) - ${evento.estado}`);
    });
    return data.data.getUserEvents.events;
  } else {
    console.log('❌ Error obteniendo eventos:', data.data.getUserEvents.errors);
    return [];
  }
}
```

### **Obtener un Evento Específico**
```javascript
async function obtenerEventoPorId(eventoId) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query GetEventById($id: ID!) {
          getEventById(id: $id) {
            success
            event {
              id
              nombre
              fecha
              hora
              ubicacion
              direccion
              descripcion
              tipo
              presupuesto
              estado
              invitados {
                id
                nombre
                email
                telefono
                confirmado
              }
              tareas {
                id
                titulo
                descripcion
                completada
                fechaLimite
              }
              createdAt
              updatedAt
            }
            errors
          }
        }
      `,
      variables: {
        id: eventoId
      }
    })
  });

  const data = await response.json();
  
  if (data.data.getEventById.success) {
    const evento = data.data.getEventById.event;
    console.log('📅 Evento encontrado:');
    console.log(`   Nombre: ${evento.nombre}`);
    console.log(`   Fecha: ${evento.fecha} a las ${evento.hora}`);
    console.log(`   Ubicación: ${evento.ubicacion}`);
    console.log(`   Invitados: ${evento.invitados.length}`);
    console.log(`   Tareas: ${evento.tareas.length}`);
    return evento;
  } else {
    console.log('❌ Error obteniendo evento:', data.data.getEventById.errors);
    return null;
  }
}
```

---

## ✏️ **Actualizar Eventos**

### **Actualizar Información Básica**
```javascript
async function actualizarEvento(eventoId, cambios) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation UpdateEvent($id: ID!, $input: UpdateEventInput!) {
          updateEvent(id: $id, input: $input) {
            success
            event {
              id
              nombre
              fecha
              hora
              ubicacion
              presupuesto
              estado
              updatedAt
            }
            errors
          }
        }
      `,
      variables: {
        id: eventoId,
        input: cambios
      }
    })
  });

  const data = await response.json();
  
  if (data.data.updateEvent.success) {
    console.log('✅ Evento actualizado exitosamente');
    return data.data.updateEvent.event;
  } else {
    console.log('❌ Error actualizando evento:', data.data.updateEvent.errors);
    return null;
  }
}

// Ejemplos de uso
await actualizarEvento(eventoId, {
  nombre: "Mi Boda Perfecta - Actualizada",
  presupuesto: 18000,
  estado: "confirmado"
});

await actualizarEvento(eventoId, {
  fecha: "2025-12-26",
  hora: "19:00"
});
```

### **Cambiar Estado del Evento**
```javascript
async function cambiarEstadoEvento(eventoId, nuevoEstado) {
  const estadosValidos = [
    'planificacion',
    'confirmado', 
    'en_progreso',
    'completado',
    'cancelado'
  ];
  
  if (!estadosValidos.includes(nuevoEstado)) {
    console.log('❌ Estado inválido. Estados válidos:', estadosValidos);
    return null;
  }
  
  return await actualizarEvento(eventoId, { estado: nuevoEstado });
}

// Ejemplos de uso
await cambiarEstadoEvento(eventoId, 'confirmado');
await cambiarEstadoEvento(eventoId, 'en_progreso');
await cambiarEstadoEvento(eventoId, 'completado');
```

---

## 👥 **Gestión de Invitados**

### **Agregar Invitados a un Evento**
```javascript
async function agregarInvitado(eventoId, datosInvitado) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation AddGuestToEvent($eventId: ID!, $input: AddGuestInput!) {
          addGuestToEvent(eventId: $eventId, input: $input) {
            success
            guest {
              id
              nombre
              email
              telefono
              confirmado
              fechaInvitacion
            }
            errors
          }
        }
      `,
      variables: {
        eventId: eventoId,
        input: datosInvitado
      }
    })
  });

  const data = await response.json();
  
  if (data.data.addGuestToEvent.success) {
    console.log('✅ Invitado agregado exitosamente');
    return data.data.addGuestToEvent.guest;
  } else {
    console.log('❌ Error agregando invitado:', data.data.addGuestToEvent.errors);
    return null;
  }
}

// Ejemplo de uso
await agregarInvitado(eventoId, {
  nombre: "María García",
  email: "maria@ejemplo.com",
  telefono: "+34 600 123 456"
});
```

### **Obtener Lista de Invitados**
```javascript
async function obtenerInvitados(eventoId) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query GetEventGuests($eventId: ID!) {
          getEventGuests(eventId: $eventId) {
            success
            guests {
              id
              nombre
              email
              telefono
              confirmado
              fechaInvitacion
              fechaConfirmacion
            }
            totalCount
            errors
          }
        }
      `,
      variables: {
        eventId: eventoId
      }
    })
  });

  const data = await response.json();
  
  if (data.data.getEventGuests.success) {
    const invitados = data.data.getEventGuests.guests;
    console.log(`👥 Invitados del evento (${invitados.length}):`);
    invitados.forEach(invitado => {
      const estado = invitado.confirmado ? '✅' : '⏳';
      console.log(`   ${estado} ${invitado.nombre} - ${invitado.email}`);
    });
    return invitados;
  } else {
    console.log('❌ Error obteniendo invitados:', data.data.getEventGuests.errors);
    return [];
  }
}
```

### **Confirmar Invitado**
```javascript
async function confirmarInvitado(eventoId, invitadoId) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation ConfirmGuest($eventId: ID!, $guestId: ID!) {
          confirmGuest(eventId: $eventId, guestId: $guestId) {
            success
            guest {
              id
              nombre
              confirmado
              fechaConfirmacion
            }
            errors
          }
        }
      `,
      variables: {
        eventId: eventoId,
        guestId: invitadoId
      }
    })
  });

  const data = await response.json();
  
  if (data.data.confirmGuest.success) {
    console.log('✅ Invitado confirmado exitosamente');
    return data.data.confirmGuest.guest;
  } else {
    console.log('❌ Error confirmando invitado:', data.data.confirmGuest.errors);
    return null;
  }
}
```

---

## 📊 **Reportes y Estadísticas**

### **Estadísticas de Evento**
```javascript
async function obtenerEstadisticasEvento(eventoId) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query GetEventStats($eventId: ID!) {
          getEventStats(eventId: $eventId) {
            success
            stats {
              totalInvitados
              invitadosConfirmados
              invitadosPendientes
              porcentajeConfirmacion
              tareasCompletadas
              tareasPendientes
              presupuestoTotal
              presupuestoGastado
              diasRestantes
            }
            errors
          }
        }
      `,
      variables: {
        eventId: eventoId
      }
    })
  });

  const data = await response.json();
  
  if (data.data.getEventStats.success) {
    const stats = data.data.getEventStats.stats;
    console.log('📊 Estadísticas del evento:');
    console.log(`   👥 Invitados: ${stats.totalInvitados} (${stats.invitadosConfirmados} confirmados)`);
    console.log(`   ✅ Confirmación: ${stats.porcentajeConfirmacion}%`);
    console.log(`   📋 Tareas: ${stats.tareasCompletadas}/${stats.tareasCompletadas + stats.tareasPendientes} completadas`);
    console.log(`   💰 Presupuesto: €${stats.presupuestoGastado}/${stats.presupuestoTotal}`);
    console.log(`   📅 Días restantes: ${stats.diasRestantes}`);
    return stats;
  } else {
    console.log('❌ Error obteniendo estadísticas:', data.data.getEventStats.errors);
    return null;
  }
}
```

---

## 🤖 **Automatización de Eventos**

### **Enviar Invitaciones Automáticamente**
```javascript
async function enviarInvitaciones(eventoId) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation SendEventInvitations($eventId: ID!) {
          sendEventInvitations(eventId: $eventId) {
            success
            sentCount
            errors
          }
        }
      `,
      variables: {
        eventId: eventoId
      }
    })
  });

  const data = await response.json();
  
  if (data.data.sendEventInvitations.success) {
    console.log(`✅ Invitaciones enviadas: ${data.data.sendEventInvitations.sentCount}`);
    return data.data.sendEventInvitations.sentCount;
  } else {
    console.log('❌ Error enviando invitaciones:', data.data.sendEventInvitations.errors);
    return 0;
  }
}
```

### **Programar Recordatorios**
```javascript
async function programarRecordatorio(eventoId, diasAntes) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation ScheduleEventReminder($eventId: ID!, $diasAntes: Int!) {
          scheduleEventReminder(eventId: $eventId, diasAntes: $diasAntes) {
            success
            reminderId
            fechaEnvio
            errors
          }
        }
      `,
      variables: {
        eventId: eventoId,
        diasAntes: diasAntes
      }
    })
  });

  const data = await response.json();
  
  if (data.data.scheduleEventReminder.success) {
    console.log(`✅ Recordatorio programado para ${diasAntes} días antes`);
    console.log(`   ID: ${data.data.scheduleEventReminder.reminderId}`);
    console.log(`   Fecha envío: ${data.data.scheduleEventReminder.fechaEnvio}`);
    return data.data.scheduleEventReminder.reminderId;
  } else {
    console.log('❌ Error programando recordatorio:', data.data.scheduleEventReminder.errors);
    return null;
  }
}

// Ejemplos de uso
await programarRecordatorio(eventoId, 7);  // Recordatorio 7 días antes
await programarRecordatorio(eventoId, 1);  // Recordatorio 1 día antes
```

---

## 🎯 **Ejemplo Completo: Gestión de Boda**

```javascript
async function gestionarBodaCompleta() {
  console.log('💒 Iniciando gestión completa de boda...');
  
  try {
    // 1. Crear el evento de boda
    console.log('1️⃣ Creando evento de boda...');
    const eventoId = await crearEvento();
    if (!eventoId) throw new Error('No se pudo crear el evento');
    
    // 2. Agregar invitados
    console.log('2️⃣ Agregando invitados...');
    const invitados = [
      { nombre: "María García", email: "maria@ejemplo.com", telefono: "+34 600 123 456" },
      { nombre: "Juan Pérez", email: "juan@ejemplo.com", telefono: "+34 600 789 012" },
      { nombre: "Ana López", email: "ana@ejemplo.com", telefono: "+34 600 345 678" }
    ];
    
    for (const invitado of invitados) {
      await agregarInvitado(eventoId, invitado);
    }
    
    // 3. Enviar invitaciones
    console.log('3️⃣ Enviando invitaciones...');
    const invitacionesEnviadas = await enviarInvitaciones(eventoId);
    console.log(`   📧 ${invitacionesEnviadas} invitaciones enviadas`);
    
    // 4. Programar recordatorios
    console.log('4️⃣ Programando recordatorios...');
    await programarRecordatorio(eventoId, 7);
    await programarRecordatorio(eventoId, 1);
    
    // 5. Obtener estadísticas
    console.log('5️⃣ Obteniendo estadísticas...');
    const stats = await obtenerEstadisticasEvento(eventoId);
    
    // 6. Confirmar evento
    console.log('6️⃣ Confirmando evento...');
    await cambiarEstadoEvento(eventoId, 'confirmado');
    
    console.log('🎉 ¡Boda gestionada exitosamente!');
    console.log(`   Evento ID: ${eventoId}`);
    console.log(`   Invitados: ${stats.totalInvitados}`);
    console.log(`   Presupuesto: €${stats.presupuestoTotal}`);
    
    return eventoId;
    
  } catch (error) {
    console.error('❌ Error gestionando boda:', error.message);
    return null;
  }
}

// Ejecutar gestión completa
const bodaId = await gestionarBodaCompleta();
```

---

## 🎯 **Próximos Pasos**

### **¿Ya dominas los eventos?**
👉 **[Ir a Sistema CRM](./crm-system.md)**

### **¿Quieres automatizar con chat?**
👉 **[Ir a Chat y WhatsApp](./chat-whatsapp.md)**

### **¿Necesitas ejemplos avanzados?**
👉 **[Ver Código de Ejemplo](./code-examples.md)**

---

## 💡 **Consejos para Eventos**

1. **Planifica con tiempo:** Crea eventos con suficiente antelación
2. **Organiza invitados:** Usa listas y categorías para mejor gestión
3. **Automatiza recordatorios:** Programa recordatorios automáticos
4. **Monitorea confirmaciones:** Revisa regularmente las confirmaciones
5. **Mantén presupuesto:** Actualiza gastos en tiempo real

---

**¿Necesitas ayuda con eventos?** 📧 soporte@eventosorganizador.com
