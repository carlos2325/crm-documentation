# 🚀 Empezar desde Cero - Guía para Principiantes

**¿Nunca has usado una API? ¡No te preocupes! Te guiaremos paso a paso.**

---

## 🤔 **¿Qué es una API?**

Una API (Application Programming Interface) es como un **mesero en un restaurante**:
- Tú (tu aplicación) pides algo al mesero
- El mesero (la API) va a la cocina (el servidor)
- Te trae lo que pediste (los datos)

### **Ejemplo Real:**
```
Tú: "Quiero ver mis eventos"
API: "Aquí tienes la lista de tus eventos"
```

---

## 🌐 **Nuestra API**

### **¿Qué puedes hacer?**
- ✅ Crear eventos (bodas, cumpleaños, etc.)
- ✅ Gestionar invitados
- ✅ Enviar mensajes automáticos
- ✅ Crear campañas de email
- ✅ Integrar con WhatsApp

### **¿Cómo funciona?**
1. **Envías una petición** (como un mensaje)
2. **La API procesa** tu petición
3. **Recibes una respuesta** con los datos

---

## 🔑 **Paso 1: Obtener Acceso**

### **1.1 Crear una Cuenta**
```bash
# Visita nuestro sitio web
https://eventosorganizador.com/registro
```

### **1.2 Obtener tu Token de Acceso**
Un token es como una **llave** que te permite acceder a la API.

```javascript
// Ejemplo de cómo obtener un token
const response = await fetch('https://api2.eventosorganizador.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    query: `
      mutation {
        generateToken(input: {
          uid: "tu-usuario",
          email: "tu-email@ejemplo.com",
          role: "user"
        }) {
          success
          token
        }
      }
    `
  })
});

const data = await response.json();
const token = data.data.generateToken.token;
console.log('Tu token:', token);
```

---

## 📡 **Paso 2: Tu Primera Petición**

### **2.1 Verificar que la API funciona**
```javascript
// Petición simple para verificar conexión
const response = await fetch('https://api2.eventosorganizador.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Origin': 'https://tu-dominio.com'  // IMPORTANTE: Cambia esto por tu dominio
  },
  body: JSON.stringify({
    query: `
      query {
        __schema {
          types {
            name
          }
        }
      }
    `
  })
});

const data = await response.json();
console.log('API funcionando:', data);
```

### **2.2 Obtener información básica**
```javascript
// Obtener información de tu cuenta
const response = await fetch('https://api2.eventosorganizador.com/graphql', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,  // Tu token aquí
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
            ubicacion
          }
          errors
        }
      }
    `
  })
});

const data = await response.json();
console.log('Tus eventos:', data.data.getUserEvents.events);
```

---

## 🛠️ **Paso 3: Herramientas que Necesitas**

### **3.1 Para Principiantes (Fácil)**
- **Postman:** https://www.postman.com/
  - Interfaz gráfica
  - No necesitas programar
  - Prueba peticiones visualmente

### **3.2 Para Desarrolladores**
- **JavaScript/Node.js**
- **Python**
- **PHP**
- **Cualquier lenguaje que haga peticiones HTTP**

---

## 📝 **Ejemplos Prácticos**

### **Ejemplo 1: Ver tus eventos (JavaScript)**
```javascript
async function verMisEventos() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tu_token}`,
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
              ubicacion
              estado
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
    console.log(`Tienes ${data.data.getUserEvents.totalCount} eventos:`);
    data.data.getUserEvents.events.forEach(evento => {
      console.log(`- ${evento.nombre} (${evento.fecha})`);
    });
  } else {
    console.log('Error:', data.data.getUserEvents.errors);
  }
}

// Llamar la función
verMisEventos();
```

### **Ejemplo 2: Crear un evento (Python)**
```python
import requests
import json

def crear_evento():
    url = "https://api2.eventosorganizador.com/graphql"
    
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {tu_token}",
        "Origin": "https://tu-dominio.com"
    }
    
    query = """
    mutation {
      createEvent(input: {
        nombre: "Mi Primera Boda"
        fecha: "2025-12-25"
        ubicacion: "Hotel Maravilloso"
        descripcion: "Una boda increíble"
      }) {
        success
        event {
          id
          nombre
          fecha
          ubicacion
        }
        errors
      }
    }
    """
    
    response = requests.post(url, headers=headers, json={"query": query})
    data = response.json()
    
    if data["data"]["createEvent"]["success"]:
        evento = data["data"]["createEvent"]["event"]
        print(f"✅ Evento creado: {evento['nombre']}")
        print(f"   ID: {evento['id']}")
        print(f"   Fecha: {evento['fecha']}")
    else:
        print("❌ Error:", data["data"]["createEvent"]["errors"])

# Llamar la función
crear_evento()
```

---

## 🚨 **Errores Comunes y Soluciones**

### **Error: "Origin header required"**
```javascript
// ❌ Incorrecto
headers: {
  'Content-Type': 'application/json'
}

// ✅ Correcto
headers: {
  'Content-Type': 'application/json',
  'Origin': 'https://tu-dominio.com'  // Agregar este header
}
```

### **Error: "Usuario no autenticado"**
```javascript
// ❌ Incorrecto
headers: {
  'Content-Type': 'application/json'
}

// ✅ Correcto
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${tu_token}`,  // Agregar este header
  'Origin': 'https://tu-dominio.com'
}
```

### **Error: "Token inválido"**
```javascript
// Verificar que tu token sea correcto
console.log('Mi token:', tu_token);

// Debe empezar con "eyJ" y tener 3 partes separadas por puntos
// Ejemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 🎯 **Próximos Pasos**

### **¿Ya dominas lo básico?**
👉 **[Ir a Autenticación Avanzada](./authentication-basic.md)**

### **¿Quieres crear eventos?**
👉 **[Ir a Gestión de Eventos](./events-management.md)**

### **¿Tienes dudas?**
👉 **[Ver Preguntas Frecuentes](./faq.md)**

---

## 💡 **Consejos para Principiantes**

1. **Empieza simple:** No intentes hacer todo de una vez
2. **Usa Postman:** Es más fácil ver qué está pasando
3. **Lee los errores:** Te dicen exactamente qué está mal
4. **Guarda tu token:** Lo necesitarás para todas las peticiones
5. **Prueba primero:** Usa el entorno de pruebas antes del real

---

**¿Necesitas ayuda?** 📧 soporte@eventosorganizador.com

