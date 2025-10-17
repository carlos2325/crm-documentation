# 🌐 Verificación de Servicios Públicos - API Eventos Organizador

**Fecha:** 12 de septiembre de 2025  
**Cliente:** Servicio N8N - Eventos Organizador  
**Entornos:** Producción y Test  

---

## 📋 Resumen Ejecutivo

Este documento contiene las instrucciones para verificar el funcionamiento de los servicios API GraphQL y MCP desde las URLs públicas, específicamente para el cliente que maneja el servicio N8N.

### 🎯 Objetivo
Verificar que los servicios estén funcionando correctamente desde las URLs públicas:
- **Producción:** `https://api2.eventosorganizador.com`
- **Test:** `https://testapi2.eventosorganizador.com`

---

## 🔗 Endpoints Públicos

### 🌐 Producción (api2.eventosorganizador.com)

#### API GraphQL
- **URL:** `https://api2.eventosorganizador.com/graphql`
- **Método:** POST
- **Headers:** `Content-Type: application/json`

#### Servicio MCP
- **URL:** `https://api2.eventosorganizador.com:4001/tools/call`
- **Método:** POST
- **Headers:** `Content-Type: application/json`

#### Health Checks
- **API Health:** `https://api2.eventosorganizador.com/health`
- **MCP Health:** `https://api2.eventosorganizador.com:4001/health`

### 🧪 Test (testapi2.eventosorganizador.com)

#### API GraphQL
- **URL:** `https://testapi2.eventosorganizador.com/graphql`
- **Método:** POST
- **Headers:** `Content-Type: application/json`

#### Servicio MCP
- **URL:** `https://testapi2.eventosorganizador.com:3001/tools/call`
- **Método:** POST
- **Headers:** `Content-Type: application/json`

#### Health Checks
- **API Health:** `https://testapi2.eventosorganizador.com/health`
- **MCP Health:** `https://testapi2.eventosorganizador.com:3001/health`

---

## 🧪 Scripts de Verificación

### 1. Script de Verificación Rápida

```bash
#!/bin/bash
# verificar-servicios-publicos.sh

echo "🔍 VERIFICACIÓN DE SERVICIOS PÚBLICOS"
echo "====================================="

# Colores
GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Función para verificar endpoint
check_endpoint() {
    local url=$1
    local name=$2
    
    if curl -s --max-time 10 "$url" > /dev/null 2>&1; then
        echo -e "${GREEN}✅ $name: RESPONDE${NC}"
        return 0
    else
        echo -e "${RED}❌ $name: NO RESPONDE${NC}"
        return 1
    fi
}

# Verificar Producción
echo -e "\n${BLUE}🌐 VERIFICANDO PRODUCCIÓN:${NC}"
check_endpoint "https://api2.eventosorganizador.com/health" "API Health - Producción"
check_endpoint "https://api2.eventosorganizador.com:4001/health" "MCP Health - Producción"

# Verificar Test
echo -e "\n${BLUE}🧪 VERIFICANDO TEST:${NC}"
check_endpoint "https://testapi2.eventosorganizador.com/health" "API Health - Test"
check_endpoint "https://testapi2.eventosorganizador.com:3001/health" "MCP Health - Test"
```

### 2. Script de Pruebas GraphQL

```bash
#!/bin/bash
# test-graphql-publico.sh

echo "🔍 PRUEBAS GRAPHQL PÚBLICAS"
echo "==========================="

# Producción
echo -e "\n🌐 PRODUCCIÓN:"
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name } } }"}' \
  --max-time 10

# Test
echo -e "\n🧪 TEST:"
curl -X POST https://testapi2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ __schema { types { name } } }"}' \
  --max-time 10
```

### 3. Script de Pruebas MCP

```bash
#!/bin/bash
# test-mcp-publico.sh

echo "🔍 PRUEBAS MCP PÚBLICAS"
echo "======================="

# Producción
echo -e "\n🌐 PRODUCCIÓN:"
curl -X POST https://api2.eventosorganizador.com:4001/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "health_check", "arguments": {}}' \
  --max-time 10

# Test
echo -e "\n🧪 TEST:"
curl -X POST https://testapi2.eventosorganizador.com:3001/tools/call \
  -H "Content-Type: application/json" \
  -d '{"name": "health_check", "arguments": {}}' \
  --max-time 10
```

---

## 📊 Consultas de Prueba Específicas

### 1. Consulta de Eventos por Email (Producción)

```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUserEvents($userId: String!, $development: String!) { getUserEvents(userId: $userId, development: $development) { events { _id nombre fecha poblacion pais tipo } totalCount } }",
    "variables": {
      "userId": "bodasdehoy.com@gmail.com",
      "development": "bodasdehoy.com"
    }
  }'
```

### 2. Consulta de Eventos por Teléfono (Producción)

```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query GetUserEvents($userId: String!, $development: String!) { getUserEvents(userId: $userId, development: $development) { events { _id nombre fecha poblacion pais tipo } totalCount } }",
    "variables": {
      "userId": "+34622440213",
      "development": "bodasdehoy.com"
    }
  }'
```

### 3. Consulta de Chat (MCP Producción)

```bash
curl -X POST https://api2.eventosorganizador.com:4001/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "get_user_chats",
    "arguments": {
      "userId": "bodasdehoy.com@gmail.com",
      "limit": 10
    }
  }'
```

### 4. Consulta de Eventos por Email (MCP Producción)

```bash
curl -X POST https://api2.eventosorganizador.com:4001/tools/call \
  -H "Content-Type: application/json" \
  -d '{
    "name": "get_events_by_email",
    "arguments": {
      "email": "bodasdehoy.com@gmail.com"
    }
  }'
```

---

## 🔧 Herramientas MCP de Prueba

### 1. Health Check
```json
{
  "name": "health_check",
  "arguments": {}
}
```

### 2. Información del Sistema
```json
{
  "name": "get_info",
  "arguments": {
    "type": "system"
  }
}
```

### 3. Información de Base de Datos
```json
{
  "name": "get_info",
  "arguments": {
    "type": "database"
  }
}
```

### 4. Eventos por Email
```json
{
  "name": "get_events_by_email",
  "arguments": {
    "email": "bodasdehoy.com@gmail.com"
  }
}
```

### 5. Eventos por Teléfono
```json
{
  "name": "get_events_by_phone",
  "arguments": {
    "phoneNumber": "+34622440213"
  }
}
```

### 6. Chats de Usuario
```json
{
  "name": "get_user_chats",
  "arguments": {
    "userId": "bodasdehoy.com@gmail.com",
    "limit": 10
  }
}
```

### 7. Estadísticas de Chat
```json
{
  "name": "get_chat_stats",
  "arguments": {
    "userId": "bodasdehoy.com@gmail.com"
  }
}
```

---

## 🚨 Solución de Problemas

### 1. Error de Conexión
- Verificar que el servidor esté funcionando
- Verificar configuración de Nginx
- Verificar certificados SSL

### 2. Error 502 Bad Gateway
- Servicio no está corriendo
- Error de configuración de proxy
- Verificar logs de Nginx

### 3. Error 503 Service Unavailable
- Servicio sobrecargado
- Error de base de datos
- Verificar logs de aplicación

### 4. Timeout
- Servicio lento
- Problemas de red
- Verificar logs de aplicación

---

## 📈 Monitoreo Continuo

### 1. Verificación Automática
```bash
# Ejecutar cada 5 minutos
*/5 * * * * /path/to/verificar-servicios-publicos.sh
```

### 2. Alertas por Email
```bash
# Enviar alerta si falla
if ! curl -s --max-time 10 "https://api2.eventosorganizador.com/health" > /dev/null; then
    echo "ALERTA: API Producción no responde" | mail -s "Alerta API" admin@eventosorganizador.com
fi
```

### 3. Logs de Monitoreo
```bash
# Ver logs de Nginx
tail -f /var/log/nginx/api2.error.log
tail -f /var/log/nginx/api2.access.log

# Ver logs de aplicación
tail -f /var/www/api-production/api.log
tail -f /var/www/api-production/mcp.log
```

---

## 🔍 Verificación desde N8N

### 1. Nodo HTTP Request - Health Check
- **URL:** `https://api2.eventosorganizador.com/health`
- **Método:** GET
- **Timeout:** 10000ms

### 2. Nodo HTTP Request - GraphQL Query
- **URL:** `https://api2.eventosorganizador.com/graphql`
- **Método:** POST
- **Headers:** `Content-Type: application/json`
- **Body:** JSON con query GraphQL

### 3. Nodo HTTP Request - MCP Tool
- **URL:** `https://api2.eventosorganizador.com:4001/tools/call`
- **Método:** POST
- **Headers:** `Content-Type: application/json`
- **Body:** JSON con nombre de herramienta y argumentos

---

## ✅ Checklist de Verificación

### Producción (api2.eventosorganizador.com)
- [ ] Health Check API responde
- [ ] Health Check MCP responde
- [ ] GraphQL Schema accesible
- [ ] Consultas de eventos funcionan
- [ ] Herramientas MCP funcionan
- [ ] Certificados SSL válidos
- [ ] Tiempo de respuesta < 5 segundos

### Test (testapi2.eventosorganizador.com)
- [ ] Health Check API responde
- [ ] Health Check MCP responde
- [ ] GraphQL Schema accesible
- [ ] Consultas de eventos funcionan
- [ ] Herramientas MCP funcionan
- [ ] Certificados SSL válidos
- [ ] Tiempo de respuesta < 5 segundos

---

## 📞 Contacto y Soporte

- **Proyecto:** API Eventos Organizador
- **Cliente:** Servicio N8N
- **Entornos:** Producción y Test
- **Documentación:** Este archivo
- **Logs:** Disponibles en el servidor

---

## 🔄 Próximos Pasos

1. **Ejecutar scripts de verificación**
2. **Verificar endpoints desde N8N**
3. **Configurar monitoreo automático**
4. **Establecer alertas de fallo**
5. **Documentar resultados de pruebas**

---

*Documento generado el 12 de septiembre de 2025 para el cliente N8N*
