# 🔐 Autenticación - Guía Completa

**Aprende cómo autenticarte correctamente con nuestra API**

---

## 🎯 **¿Qué es la Autenticación?**

La autenticación es como mostrar tu **DNI** antes de entrar a un edificio. La API necesita saber quién eres antes de darte acceso a los datos.

### **Proceso Simple:**
1. **Obtienes un token** (como tu DNI digital)
2. **Incluyes el token** en cada petición
3. **La API verifica** que eres quien dices ser
4. **Recibes acceso** a los datos

---

## 🔑 **Tipos de Tokens**

### **1. Token de Desarrollo** 🟢
- Para pruebas y desarrollo
- Duración: 24 horas
- Acceso limitado

### **2. Token de Producción** 🔴
- Para aplicaciones reales
- Duración: configurable
- Acceso completo

---

## 📋 **Paso a Paso: Obtener tu Token**

### **Paso 1: Preparar los Datos**
```javascript
const datosUsuario = {
  uid: "tu-usuario-unico",
  email: "tu-email@ejemplo.com",
  role: "user",  // user, admin, super_admin
  development: "bodasdehoy",  // Opcional
  brand: "bodasdehoy",  // Opcional
  client_id: "bodasdehoy"  // Opcional
};
```

### **Paso 2: Generar el Token**
```javascript
async function obtenerToken() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://tu-dominio.com'  // IMPORTANTE
    },
    body: JSON.stringify({
      query: `
        mutation GenerateToken($input: GenerateTokenInput!) {
          generateToken(input: $input) {
            success
            token
            user {
              uid
              email
              role
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          uid: "tu-usuario-unico",
          email: "tu-email@ejemplo.com",
          role: "user",
          development: "bodasdehoy",
          brand: "bodasdehoy",
          client_id: "bodasdehoy"
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.generateToken.success) {
    console.log('✅ Token generado exitosamente');
    console.log('Token:', data.data.generateToken.token);
    return data.data.generateToken.token;
  } else {
    console.log('❌ Error generando token:', data.data.generateToken.errors);
    return null;
  }
}

// Usar la función
const miToken = await obtenerToken();
```

### **Paso 3: Usar el Token en Peticiones**
```javascript
async function hacerPeticionConToken() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,  // Token aquí
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
  });

  const data = await response.json();
  return data;
}
```

---

## 🛠️ **Ejemplos en Diferentes Lenguajes**

### **JavaScript (Node.js)**
```javascript
const axios = require('axios');

async function autenticacionCompleta() {
  // 1. Generar token
  const tokenResponse = await axios.post('https://api2.eventosorganizador.com/graphql', {
    query: `
      mutation {
        generateToken(input: {
          uid: "usuario123"
          email: "test@ejemplo.com"
          role: "user"
        }) {
          success
          token
          errors
        }
      }
    `
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Origin': 'https://mi-app.com'
    }
  });

  const token = tokenResponse.data.data.generateToken.token;

  // 2. Usar token para obtener datos
  const eventosResponse = await axios.post('https://api2.eventosorganizador.com/graphql', {
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
  }, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Origin': 'https://mi-app.com'
    }
  });

  console.log('Eventos:', eventosResponse.data.data.getUserEvents.events);
}

autenticacionCompleta();
```

### **Python**
```python
import requests
import json

def autenticacion_completa():
    # 1. Generar token
    token_query = {
        "query": """
        mutation {
            generateToken(input: {
                uid: "usuario123"
                email: "test@ejemplo.com"
                role: "user"
            }) {
                success
                token
                errors
            }
        }
        """
    }
    
    token_response = requests.post(
        'https://api2.eventosorganizador.com/graphql',
        headers={
            'Content-Type': 'application/json',
            'Origin': 'https://mi-app.com'
        },
        json=token_query
    )
    
    token_data = token_response.json()
    token = token_data['data']['generateToken']['token']
    print(f"Token obtenido: {token[:20]}...")
    
    # 2. Usar token para obtener datos
    eventos_query = {
        "query": """
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
        """
    }
    
    eventos_response = requests.post(
        'https://api2.eventosorganizador.com/graphql',
        headers={
            'Content-Type': 'application/json',
            'Authorization': f'Bearer {token}',
            'Origin': 'https://mi-app.com'
        },
        json=eventos_query
    )
    
    eventos_data = eventos_response.json()
    print("Eventos obtenidos:", eventos_data['data']['getUserEvents']['events'])

autenticacion_completa()
```

### **PHP**
```php
<?php
function autenticacionCompleta() {
    // 1. Generar token
    $tokenQuery = [
        'query' => '
            mutation {
                generateToken(input: {
                    uid: "usuario123"
                    email: "test@ejemplo.com"
                    role: "user"
                }) {
                    success
                    token
                    errors
                }
            }
        '
    ];
    
    $tokenResponse = http_request('https://api2.eventosorganizador.com/graphql', [
        'method' => 'POST',
        'headers' => [
            'Content-Type: application/json',
            'Origin: https://mi-app.com'
        ],
        'body' => json_encode($tokenQuery)
    ]);
    
    $tokenData = json_decode($tokenResponse, true);
    $token = $tokenData['data']['generateToken']['token'];
    echo "Token obtenido: " . substr($token, 0, 20) . "...\n";
    
    // 2. Usar token para obtener datos
    $eventosQuery = [
        'query' => '
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
        '
    ];
    
    $eventosResponse = http_request('https://api2.eventosorganizador.com/graphql', [
        'method' => 'POST',
        'headers' => [
            'Content-Type: application/json',
            'Authorization: Bearer ' . $token,
            'Origin: https://mi-app.com'
        ],
        'body' => json_encode($eventosQuery)
    ]);
    
    $eventosData = json_decode($eventosResponse, true);
    echo "Eventos obtenidos: " . json_encode($eventosData['data']['getUserEvents']['events']);
}

// Función auxiliar para hacer peticiones HTTP
function http_request($url, $options) {
    $context = stream_context_create([
        'http' => [
            'method' => $options['method'],
            'header' => implode("\r\n", $options['headers']),
            'content' => $options['body']
        ]
    ]);
    
    return file_get_contents($url, false, $context);
}

autenticacionCompleta();
?>
```

---

## 🚨 **Errores Comunes y Soluciones**

### **Error: "Usuario no autenticado"**
```javascript
// ❌ Problema: No incluyes el token
headers: {
  'Content-Type': 'application/json'
}

// ✅ Solución: Incluir el token
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${miToken}`
}
```

### **Error: "Token inválido o expirado"**
```javascript
// ❌ Problema: Token malformado o expirado
const tokenMalformado = "token-que-no-es-jwt";

// ✅ Solución: Generar nuevo token
const nuevoToken = await obtenerToken();
```

### **Error: "Origin header required"**
```javascript
// ❌ Problema: Falta el header Origin
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${miToken}`
}

// ✅ Solución: Agregar Origin
headers: {
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${miToken}`,
  'Origin': 'https://tu-dominio.com'  // IMPORTANTE
}
```

---

## 🔄 **Gestión de Tokens**

### **Renovar Token Automáticamente**
```javascript
class TokenManager {
  constructor() {
    this.token = null;
    this.expiryTime = null;
  }

  async getValidToken() {
    // Si no hay token o está expirado, generar uno nuevo
    if (!this.token || this.isTokenExpired()) {
      await this.generateNewToken();
    }
    return this.token;
  }

  isTokenExpired() {
    if (!this.expiryTime) return true;
    return Date.now() > this.expiryTime;
  }

  async generateNewToken() {
    const response = await fetch('https://api2.eventosorganizador.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Origin': 'https://tu-dominio.com'
      },
      body: JSON.stringify({
        query: `
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
        `
      })
    });

    const data = await response.json();
    if (data.data.generateToken.success) {
      this.token = data.data.generateToken.token;
      this.expiryTime = Date.now() + (23 * 60 * 60 * 1000); // 23 horas
      console.log('✅ Token renovado automáticamente');
    }
  }
}

// Usar el gestor de tokens
const tokenManager = new TokenManager();

async function hacerPeticionAutomatica() {
  const token = await tokenManager.getValidToken();
  
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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
            }
            errors
          }
        }
      `
    })
  });

  return response.json();
}
```

---

## 🛡️ **Seguridad y Mejores Prácticas**

### **1. Nunca Expongas tu Token**
```javascript
// ❌ MALO: Token en código fuente
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";

// ✅ BUENO: Token en variables de entorno
const token = process.env.API_TOKEN;
```

### **2. Usa HTTPS Siempre**
```javascript
// ✅ Correcto: Siempre HTTPS
const apiUrl = "https://api2.eventosorganizador.com/graphql";
```

### **3. Valida Respuestas**
```javascript
async function peticionSegura() {
  try {
    const response = await fetch('https://api2.eventosorganizador.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'Origin': 'https://tu-dominio.com'
      },
      body: JSON.stringify({ query: '...' })
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    
    // Verificar que la respuesta es válida
    if (data.errors) {
      throw new Error(`GraphQL Error: ${JSON.stringify(data.errors)}`);
    }

    return data.data;
  } catch (error) {
    console.error('Error en petición:', error);
    throw error;
  }
}
```

---

## 🧪 **Testing de Autenticación**

### **Script de Prueba Completo**
```javascript
async function testAutenticacion() {
  console.log('🧪 Iniciando test de autenticación...');
  
  try {
    // 1. Test: Generar token
    console.log('1️⃣ Generando token...');
    const token = await obtenerToken();
    if (!token) throw new Error('No se pudo generar token');
    console.log('✅ Token generado correctamente');
    
    // 2. Test: Usar token para obtener datos
    console.log('2️⃣ Probando petición con token...');
    const eventos = await hacerPeticionConToken(token);
    if (eventos.data.getUserEvents.success) {
      console.log('✅ Petición autenticada exitosa');
      console.log(`📊 Eventos encontrados: ${eventos.data.getUserEvents.events.length}`);
    } else {
      throw new Error('Petición autenticada falló');
    }
    
    // 3. Test: Token inválido
    console.log('3️⃣ Probando token inválido...');
    try {
      await hacerPeticionConToken('token-invalido');
      console.log('❌ Error: Token inválido debería fallar');
    } catch (error) {
      console.log('✅ Token inválido rechazado correctamente');
    }
    
    console.log('🎉 Todos los tests de autenticación pasaron');
    
  } catch (error) {
    console.error('❌ Test de autenticación falló:', error.message);
  }
}

// Ejecutar test
testAutenticacion();
```

---

## 🎯 **Próximos Pasos**

### **¿Ya dominas la autenticación?**
👉 **[Ir a Gestión de Eventos](./events-management.md)**

### **¿Quieres aprender sobre CRM?**
👉 **[Ir a Sistema CRM](./crm-system.md)**

### **¿Necesitas ejemplos avanzados?**
👉 **[Ver Código de Ejemplo](./code-examples.md)**

---

## 💡 **Consejos Importantes**

1. **Guarda tu token seguro:** Nunca lo expongas en código público
2. **Renueva automáticamente:** Los tokens expiran cada 24 horas
3. **Usa HTTPS:** Siempre para proteger tus datos
4. **Valida respuestas:** Siempre verifica que las peticiones sean exitosas
5. **Maneja errores:** Prepara tu código para errores de autenticación

---

**¿Necesitas ayuda con la autenticación?** 📧 soporte@eventosorganizador.com
