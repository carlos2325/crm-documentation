# 💰 SISTEMA DE CONTABILIZACIÓN Y FACTURACIÓN - DOCUMENTACIÓN COMPLETA

**Fecha:** 26 de Septiembre 2025  
**Versión:** 2.0  
**Estado:** ✅ 100% FUNCIONANDO

---

## 🎯 **RESUMEN EJECUTIVO**

El sistema de contabilización y facturación está completamente implementado y funcionando. Incluye tracking de tokens de IA, facturación automática, métricas de uso y reportes detallados.

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **📁 Archivos Implementados:**
- `src/db/utils/usageCalculator.ts` - Calculadora de costos
- `src/db/models/usageTracking.ts` - Modelo de tracking
- `src/graphql/typeDefs/usageTracking.ts` - Tipos GraphQL
- `src/graphql/resolvers/usageTracking.ts` - Resolvers GraphQL
- `src/services/deliveryBillingService.ts` - Servicio de facturación

### **🔧 Componentes Principales:**
1. **Tracking de Tokens IA** - Cálculo automático de costos
2. **Facturación por Uso** - Cobro basado en consumo
3. **Métricas de Rendimiento** - Análisis de uso
4. **Reportes Detallados** - Informes de facturación

---

## 📋 **TIPOS GRAPHQL DISPONIBLES**

### **1. Tipos de Facturación:**
```graphql
type USAGE_BillingItem {
  type: String!
  category: String!
  description: String!
  quantity: Float!
  unit: String!
  unit_cost_usd: Float!
  total_cost_usd: Float!
  metadata: JSON
}

type USAGE_UsageTracking {
  _id: ID!
  session_id: String!
  client_number: String!
  business_number: String!
  chat_id: String!
  message_id: String!
  source: String!
  message_text: String!
  response_text: String!
  billing_items: [USAGE_BillingItem!]!
  total_cost_usd: Float!
  total_processing_time_ms: Float!
  development: String!
  error_occurred: Boolean!
  error_message: String
  createdAt: String!
  updatedAt: String!
}
```

### **2. Tipos de Reportes:**
```graphql
type USAGE_DashboardStats {
  totalCost: Float!
  totalRequests: Int!
  averageCostPerRequest: Float!
  topClients: [USAGE_ClientRanking!]!
  costByCategory: [USAGE_CategoryBreakdown!]!
  costByType: [USAGE_TypeBreakdown!]!
}

type USAGE_ClientBillingSummary {
  clientNumber: String!
  totalCost: Float!
  totalRequests: Int!
  averageCostPerRequest: Float!
  lastActivity: String!
  costBreakdown: [USAGE_CategoryBreakdown!]!
}
```

---

## 🚀 **MUTATIONS DISPONIBLES**

### **1. Tracking de Uso:**
```graphql
# Crear registro de uso
createUsageTracking(
  input: USAGE_UsageTrackingInput!
): USAGE_UsageTracking!

# Marcar como facturado
markAsBilled(
  trackingId: String!
  billingPeriod: String!
): Boolean!

# Procesar facturación de entrega
processDeliveryBilling(
  input: USAGE_DeliveryBillingInput!
): USAGE_DeliveryBillingResponse!
```

### **2. Gestión de Facturación:**
```graphql
# Marcar campaña como facturada
markCampaignAsBilled(
  campaignId: String!
  billingPeriod: String!
): Boolean!
```

---

## 🔍 **QUERIES DISPONIBLES**

### **1. Reportes de Uso:**
```graphql
# Obtener estadísticas del dashboard
getUsageDashboardStats(
  startDate: String
  endDate: String
  clientNumber: String
): USAGE_DashboardStats!

# Obtener resumen de facturación por cliente
getClientBillingSummary(
  clientNumber: String!
  startDate: String
  endDate: String
): USAGE_ClientBillingSummary!

# Obtener métricas de entrega
getDeliveryMetrics(
  startDate: String
  endDate: String
  campaignId: String
): USAGE_DeliveryMetrics!
```

### **2. Reportes de Campañas:**
```graphql
# Obtener facturación de campaña
getCampaignBilling(
  campaignId: String!
  startDate: String
  endDate: String
): USAGE_CampaignBilling!

# Obtener reporte de facturación de entrega
getDeliveryBillingReport(
  input: USAGE_DeliveryBillingInput!
): USAGE_DeliveryBillingReport!
```

---

## 💰 **CÁLCULO DE COSTOS**

### **1. Tokens de IA:**
```typescript
// Configuración de costos por modelo
const COST_CONFIG = {
  ai_models: {
    'llama3.2:3b': { 
      input_token: 0.0001, 
      output_token: 0.0002, 
      memory_base_mb: 512 
    },
    'claude-3-sonnet': { 
      input_token: 0.003, 
      output_token: 0.015, 
      memory_base_mb: 1024 
    },
    'gpt-4': { 
      input_token: 0.03, 
      output_token: 0.06, 
      memory_base_mb: 2048 
    }
  }
};
```

### **2. Cálculo de Memoria:**
```typescript
// Cálculo basado en tiempo de procesamiento
const memoryCost = (processingTimeMs / 1000) * 
  (modelConfig.memory_base_mb / 1024) * 
  COST_CONFIG.infrastructure.memory_per_mb_second;
```

### **3. Herramientas MCP:**
```typescript
// Costo base por herramienta MCP
const mcpToolCost = usageCount * 
  COST_CONFIG.tools.mcp_tool_base_cost;
```

---

## 📊 **EJEMPLOS DE USO**

### **1. Crear Registro de Uso:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "mutation { createUsageTracking(input: {session_id: \"session123\", client_number: \"client456\", business_number: \"business789\", chat_id: \"chat101\", message_id: \"msg202\", source: \"web\", message_text: \"Hello\", response_text: \"Hi there!\", total_cost_usd: 0.05, total_processing_time_ms: 1500, development: \"production\"}) { _id session_id total_cost_usd } }"
  }'
```

### **2. Obtener Estadísticas del Dashboard:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { getUsageDashboardStats(startDate: \"2025-09-01\", endDate: \"2025-09-30\") { totalCost totalRequests averageCostPerRequest topClients { clientNumber totalCost totalRequests } } }"
  }'
```

### **3. Obtener Resumen de Cliente:**
```bash
curl -X POST https://api2.eventosorganizador.com/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { getClientBillingSummary(clientNumber: \"client456\", startDate: \"2025-09-01\", endDate: \"2025-09-30\") { clientNumber totalCost totalRequests averageCostPerRequest lastActivity } }"
  }'
```

---

## 📈 **MÉTRICAS DISPONIBLES**

### **1. Métricas de Costo:**
- **Costo total** - Suma de todos los costos
- **Costo promedio por request** - Costo total / número de requests
- **Costo por categoría** - Desglose por tipo de servicio
- **Costo por tipo** - Desglose por tipo de uso

### **2. Métricas de Uso:**
- **Total de requests** - Número total de solicitudes
- **Requests por cliente** - Uso individual por cliente
- **Requests por período** - Uso por día/semana/mes
- **Tiempo de procesamiento** - Tiempo promedio de respuesta

### **3. Métricas de Rendimiento:**
- **Tasa de éxito** - Porcentaje de requests exitosos
- **Tasa de error** - Porcentaje de requests fallidos
- **Tiempo de respuesta** - Tiempo promedio de procesamiento
- **Throughput** - Requests por minuto/hora

---

## 🔧 **CONFIGURACIÓN AVANZADA**

### **1. Límites de Costo:**
```typescript
// Configuración de límites por cliente
const clientLimits = {
  dailyLimit: 100.0,      // $100 por día
  monthlyLimit: 2000.0,   // $2000 por mes
  requestLimit: 10000     // 10000 requests por mes
};
```

### **2. Alertas de Costo:**
```typescript
// Configuración de alertas
const costAlerts = {
  warningThreshold: 0.8,  // 80% del límite
  criticalThreshold: 0.95, // 95% del límite
  emailNotifications: true,
  webhookNotifications: true
};
```

### **3. Facturación Automática:**
```typescript
// Configuración de facturación
const billingConfig = {
  billingPeriod: 'monthly',  // monthly, weekly, daily
  autoBill: true,
  gracePeriod: 7,           // días de gracia
  lateFeeRate: 0.05         // 5% de recargo
};
```

---

## 📊 **REPORTES DISPONIBLES**

### **1. Reporte de Uso Diario:**
- Resumen de costos del día
- Top 10 clientes por uso
- Análisis de tendencias
- Alertas de límites

### **2. Reporte de Facturación Mensual:**
- Costos totales del mes
- Desglose por cliente
- Comparación con meses anteriores
- Proyecciones de costos

### **3. Reporte de Rendimiento:**
- Métricas de tiempo de respuesta
- Análisis de errores
- Optimizaciones recomendadas
- Capacidad del sistema

---

## 🔄 **INTEGRACIÓN CON N8N**

### **1. Webhook de Facturación:**
```bash
# URL del webhook
https://workflow.eventosorganizador.com/webhook/billing

# Configuración en N8N
- Método: POST
- Headers: Content-Type: application/json
- Body: JSON con datos de facturación
```

### **2. Flujo de Facturación:**
1. **Tracking** - Registro automático de uso
2. **Cálculo** - Cálculo de costos en tiempo real
3. **Acumulación** - Acumulación por período
4. **Facturación** - Generación de factura
5. **Notificación** - Envío de factura al cliente

---

## ✅ **ESTADO ACTUAL**

### **✅ FUNCIONANDO COMPLETAMENTE:**
- **Tracking de tokens IA** - ✅ Implementado
- **Cálculo de costos** - ✅ Implementado
- **Facturación automática** - ✅ Implementado
- **Métricas y reportes** - ✅ Implementado
- **Integración N8N** - ✅ Implementado

### **📊 Datos en Producción:**
- **Registros de uso**: Miles de registros
- **Clientes activos**: Múltiples clientes
- **Costos trackeados**: Cientos de dólares
- **Reportes generados**: Diarios y mensuales

---

## 📞 **SOPORTE**

- **Estado**: 100% Funcionando
- **Documentación**: Completa
- **Soporte**: Disponible 24/7
- **Actualizaciones**: Automáticas

---

**📅 Última actualización:** 26 de Septiembre 2025  
**✅ Estado:** 100% FUNCIONANDO  
**🔧 Acción requerida:** Ninguna - Sistema operativo












