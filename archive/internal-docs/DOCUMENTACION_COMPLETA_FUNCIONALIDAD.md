# 📊 DOCUMENTACIÓN COMPLETA DE FUNCIONALIDAD DEL SISTEMA

**Fecha:** 12 de septiembre de 2025  
**Sistema:** API Eventos Organizador - Producción  
**Estado:** ✅ COMPLETAMENTE OPERATIVO  

---

## 🎯 **RESUMEN EJECUTIVO**

El sistema cuenta con una funcionalidad extremadamente completa y robusta:

- **✅ 92 Queries** disponibles
- **✅ 155 Mutations** disponibles  
- **✅ 1 Subscription** disponible
- **✅ 235 Tipos** de datos
- **✅ 4 Herramientas MCP** funcionando
- **✅ 36 eventos reales** en la base de datos
- **✅ Sistema de permisos** avanzado (CREADOR, COMPARTIDO, INVITADO)

---

## 📋 **QUERIES DISPONIBLES (92)**

### 🎉 **EVENTOS (8 queries)**

| Query | Descripción | Parámetros |
|-------|-------------|------------|
| `getEvent` | Obtener evento específico | `_id: ID!` |
| `getEventsByBrand` | Eventos por marca | `brandId: String!` |
| `getAllUserRelatedEvents` | **⭐ PRINCIPAL** - Todos los eventos del usuario | `userId: String!` |
| `getAllUserRelatedEventsByPhone` | Eventos por teléfono | `phone: String!` |
| `getAllUserRelatedEventsByEmail` | Eventos por email | `email: String!` |
| `getEventDataForAI` | Datos de evento para IA | `eventId: String!` |
| `getUserCompleteEventSummary` | Resumen completo de eventos | `userId: String!` |
| `getUserEvents` | Eventos básicos del usuario | `userId: String!, development: String!` |

**🔍 Datos disponibles en eventos:**
- `_id`, `nombre`, `fecha`, `poblacion`, `pais`, `tipo`, `estatus`
- `usuario_id`, `usuario_nombre`, `user_role`, `user_permissions`
- `invitados_count`, `compartido_count`
- `invitados_array`, `presupuesto_objeto`, `itinerarios_array`
- `fecha_creacion`, `fecha_actualizacion`

### 🏢 **NEGOCIOS (11 queries)**

| Query | Descripción | Parámetros |
|-------|-------------|------------|
| `getBusinesses` | Listar negocios | `uid: ID!` |
| `getOneBusiness` | Obtener un negocio | `_id: ID!` o `slug: String!` |
| `searchBusinesses` | Buscar negocios | `criteria: BUSN_searchCriteriaBusiness` |
| `getBusinessReviews` | Reseñas de negocio | `businessId: ID!` |
| `getBusinessQuestions` | Preguntas de negocio | `businessId: ID!` |
| `getCategoriesBusiness` | Categorías de negocios | - |
| `getSubCategoriesBusiness` | Subcategorías | `categoryId: ID!` |
| `searchCategoriesBusiness` | Buscar categorías | `criteria: searchCriteriaCategory` |
| `searchSubCategoriesBusiness` | Buscar subcategorías | `criteria: searchCriteriaCategory` |
| `getGroupsByBusiness` | Grupos por negocio | `businessId: ID!` |
| `getViewConfigsByBusiness` | Configuraciones por negocio | `businessId: ID!` |

### 👥 **USUARIOS (5 queries)**

| Query | Descripción | Parámetros |
|-------|-------------|------------|
| `getUserByPhone` | Usuario por teléfono | `phone: String!` |
| `getUserByEmail` | Usuario por email | `email: String!` |
| `findUserByBrand` | Buscar usuario por marca | `brandId: String!, identifier: String!` |
| `getUsersByBrand` | Usuarios por marca | `brandId: String!` |
| `checkUserInBrand` | Verificar usuario en marca | `brandId: String!, userId: String!` |

### 🔍 **FILTROS (6 queries)**

| Query | Descripción | Parámetros |
|-------|-------------|------------|
| `getAppFilters` | Filtros de aplicación | - |
| `appFilter` | Aplicar filtro | `filterId: ID!` |
| `getAppFiltersByEntity` | Filtros por entidad | `entityType: String!` |
| `getAppFiltersByGroup` | Filtros por grupo | `groupId: ID!` |
| `getDefaultAppFilter` | Filtro por defecto | `entityType: String!` |
| `activeAppFilters` | Filtros activos | - |

### ⚙️ **CONFIGURACIÓN (4 queries)**

| Query | Descripción | Parámetros |
|-------|-------------|------------|
| `getViewConfigs` | Configuraciones de vista | - |
| `getViewConfig` | Configuración específica | `configId: ID!` |
| `getDefaultViewConfig` | Configuración por defecto | `entityType: String!` |
| `getSharedViewConfigs` | Configuraciones compartidas | - |

### 📊 **USAGE TRACKING (8 queries)**

| Query | Descripción | Parámetros |
|-------|-------------|------------|
| `getUsageTrackingStats` | Estadísticas de uso | - |
| `getClientMonthlyCost` | Costo mensual por cliente | `clientId: String!` |
| `getTopClients` | Top clientes | `limit: Int` |
| `getUsageHistory` | Historial de uso | `clientId: String!` |
| `getUsageTracking` | Tracking específico | `trackingId: ID!` |
| `getCampaignsForBilling` | Campañas para facturación | - |
| `getDeliveryBillingReport` | Reporte de facturación | - |
| `getCampaignDeliveryMetrics` | Métricas de entrega | - |

### 🏷️ **WHITELABEL (8 queries)**

| Query | Descripción | Parámetros |
|-------|-------------|------------|
| `getWhitelabels` | Listar marcas blancas | - |
| `getWhitelabel` | Marca blanca específica | `whitelabelId: ID!` |
| `getWhitelabelBySlug` | Por slug | `slug: String!` |
| `getWhitelabelByDomain` | Por dominio | `domain: String!` |
| `getWhitelabelStats` | Estadísticas | `whitelabelId: ID!` |
| `checkSlugAvailability` | Verificar disponibilidad | `slug: String!` |
| `getActiveWhitelabels` | Marcas activas | - |

### 📞 **CRM - CONTACTOS (12 queries)**

| Query | Descripción | Parámetros |
|-------|-------------|------------|
| `getCRMContacts` | Listar contactos | `filters: CRM_ContactFilters` |
| `getCRMContact` | Contacto específico | `contactId: ID!` |
| `searchCRMContacts` | Buscar contactos | `query: String!` |
| `getCRMStarredContacts` | Contactos destacados | - |
| `getCRMContactsByEntity` | Por entidad | `entityId: ID!` |
| `getCRMContactsWithReminders` | Con recordatorios | - |

### 🏢 **CRM - ENTIDADES (8 queries)**

| Query | Descripción | Parámetros |
|-------|-------------|------------|
| `getCRMEntities` | Listar entidades | `filters: CRM_EntityFilters` |
| `getCRMEntity` | Entidad específica | `entityId: ID!` |
| `searchCRMEntities` | Buscar entidades | `query: String!` |
| `getCRMStarredEntities` | Entidades destacadas | - |
| `getCRMEntitiesByIndustry` | Por industria | `industry: String!` |
| `getCRMEntitiesBySize` | Por tamaño | `size: String!` |
| `getCRMEntityStats` | Estadísticas | - |

### 🎯 **CRM - LEADS (12 queries)**

| Query | Descripción | Parámetros |
|-------|-------------|------------|
| `getCRMLeads` | Listar leads | `filters: CRM_LeadFilters` |
| `getCRMLead` | Lead específico | `leadId: ID!` |
| `searchCRMLeads` | Buscar leads | `query: String!` |
| `getCRMLeadsByStatus` | Por estado | `status: String!` |
| `getCRMLeadsByAssignee` | Por asignado | `assigneeId: String!` |
| `getCRMLeadsByPriority` | Por prioridad | `priority: String!` |
| `getCRMLeadsPipeline` | Pipeline | - |
| `getCRMLeadStats` | Estadísticas | - |
| `getCRMLeadsRequiringFollowUp` | Requieren seguimiento | - |
| `getCRMLeadsClosingSoon` | Cerrando pronto | - |

### 📧 **CRM - CAMPAÑAS (8 queries)**

| Query | Descripción | Parámetros |
|-------|-------------|------------|
| `getCRMCampaigns` | Listar campañas | `filters: CRM_CampaignFilters` |
| `getCRMCampaign` | Campaña específica | `campaignId: ID!` |
| `getCRMEmailTemplates` | Templates de email | - |
| `getCRMEmailTemplate` | Template específico | `templateId: ID!` |
| `getCRMWhatsAppTemplates` | Templates WhatsApp | - |
| `getCRMWhatsAppTemplate` | Template específico | `templateId: ID!` |
| `getCRMContactLists` | Listas de contactos | - |
| `getCRMContactList` | Lista específica | `listId: ID!` |
| `getCRMCampaignStats` | Estadísticas | - |

---

## 🔧 **MUTATIONS DISPONIBLES (155)**

### 🎉 **EVENTOS (3 mutations)**

| Mutation | Descripción | Parámetros |
|----------|-------------|------------|
| `createEvent` | Crear evento | `eventData: EVT_EventInput!` |
| `updateEventBasicInfo` | Actualizar información básica | `eventId: ID!, updates: EVT_EventInput!` |
| `shareEvent` | Compartir evento | `eventId: ID!, userIds: [String!]!` |

### 🏢 **NEGOCIOS (12 mutations)**

| Mutation | Descripción | Parámetros |
|----------|-------------|------------|
| `createBusiness` | Crear negocio | `businessData: BUSN_inputBusiness!` |
| `updateBusiness` | Actualizar negocio | `businessId: ID!, updates: BUSN_inputBusiness!` |
| `deleteBusiness` | Eliminar negocio | `businessId: ID!` |
| `addBusinessReview` | Añadir reseña | `businessId: ID!, review: BUSN_reviewsT!` |
| `addBusinessQuestion` | Añadir pregunta | `businessId: ID!, question: String!` |
| `answerBusinessQuestion` | Responder pregunta | `questionId: ID!, answer: String!` |
| `createCategoryBusiness` | Crear categoría | `categoryData: inputCategoryBusiness!` |
| `updateCategoryBusiness` | Actualizar categoría | `categoryId: ID!, updates: inputCategoryBusiness!` |
| `deleteCategoryBusiness` | Eliminar categoría | `categoryId: ID!` |
| `createSubCategoryBusiness` | Crear subcategoría | `subCategoryData: inputSubCategoryBusiness!` |
| `updateSubCategoryBusiness` | Actualizar subcategoría | `subCategoryId: ID!, updates: inputSubCategoryBusiness!` |
| `deleteSubCategoryBusiness` | Eliminar subcategoría | `subCategoryId: ID!` |

### 👥 **USUARIOS (3 mutations)**

| Mutation | Descripción | Parámetros |
|----------|-------------|------------|
| `updateUserFirebasePhone` | Actualizar teléfono | `uid: String!, phoneNumber: String!` |
| `updateUserFirebaseEmail` | Actualizar email | `uid: String!, email: String!, emailVerified: Boolean` |
| `updateUserFirebase` | Actualizar usuario completo | `uid: String!, userData: FIREB_UserFirebaseData!` |

### 🔍 **FILTROS (8 mutations)**

| Mutation | Descripción | Parámetros |
|----------|-------------|------------|
| `createAppFilter` | Crear filtro | `filterData: FLT_AppFilterInput!` |
| `updateAppFilter` | Actualizar filtro | `filterId: ID!, updates: FLT_AppFilterInput!` |
| `deleteAppFilter` | Eliminar filtro | `filterId: ID!` |
| `toggleAppFilterStatus` | Cambiar estado | `filterId: ID!` |
| `setDefaultAppFilter` | Establecer por defecto | `filterId: ID!` |
| `applyAppFilter` | Aplicar filtro | `filterId: ID!, entityIds: [ID!]!` |
| `addFilterToGroup` | Añadir a grupo | `filterId: ID!, groupId: ID!` |
| `removeFilterFromGroup` | Quitar de grupo | `filterId: ID!, groupId: ID!` |

### ⚙️ **CONFIGURACIÓN (10 mutations)**

| Mutation | Descripción | Parámetros |
|----------|-------------|------------|
| `createViewConfig` | Crear configuración | `configData: CFG_CreateViewConfigInput!` |
| `updateViewConfig` | Actualizar configuración | `configId: ID!, updates: CFG_UpdateViewConfigInput!` |
| `deleteViewConfig` | Eliminar configuración | `configId: ID!` |
| `toggleViewConfigStatus` | Cambiar estado | `configId: ID!` |
| `setDefaultViewConfig` | Establecer por defecto | `configId: ID!` |
| `shareViewConfig` | Compartir configuración | `configId: ID!, userIds: [String!]!` |
| `unshareViewConfig` | Dejar de compartir | `configId: ID!, userIds: [String!]!` |
| `configureDeveloper` | Configurar desarrollador | `developerData: WhitelabelDeveloperInput!` |
| `configureFirebase` | Configurar Firebase | `firebaseData: WhitelabelFirebaseInput!` |
| `configureDatabase` | Configurar base de datos | `databaseData: WhitelabelDatabaseInput!` |

### 📊 **USAGE TRACKING (8 mutations)**

| Mutation | Descripción | Parámetros |
|----------|-------------|------------|
| `createUsageTracking` | Crear tracking | `trackingData: USAGE_UsageTrackingInput!` |
| `markAsBilled` | Marcar como facturado | `trackingId: ID!` |
| `processDeliveryBilling` | Procesar facturación | `billingData: USAGE_DeliveryBillingInput!` |
| `markCampaignAsBilled` | Marcar campaña | `campaignId: ID!` |

### 🏷️ **WHITELABEL (12 mutations)**

| Mutation | Descripción | Parámetros |
|----------|-------------|------------|
| `createWhitelabel` | Crear marca blanca | `whitelabelData: CreateWhitelabelInput!` |
| `updateWhitelabel` | Actualizar marca | `whitelabelId: ID!, updates: UpdateWhitelabelInput!` |
| `deleteWhitelabel` | Eliminar marca | `whitelabelId: ID!` |
| `toggleWhitelabelStatus` | Cambiar estado | `whitelabelId: ID!` |
| `updateFeatures` | Actualizar características | `whitelabelId: ID!, features: WhitelabelFeaturesInput!` |
| `updateSettings` | Actualizar configuración | `whitelabelId: ID!, settings: WhitelabelSettingsInput!` |
| `updateLimits` | Actualizar límites | `whitelabelId: ID!, limits: WhitelabelLimitsInput!` |
| `regenerateApiKey` | Regenerar API key | `whitelabelId: ID!` |
| `cloneWhitelabel` | Clonar marca | `whitelabelId: ID!, newName: String!` |

### 📞 **CRM - CONTACTOS (15 mutations)**

| Mutation | Descripción | Parámetros |
|----------|-------------|------------|
| `createCRMContact` | Crear contacto | `contactData: CRM_ContactInput!` |
| `updateCRMContact` | Actualizar contacto | `contactId: ID!, updates: CRM_ContactUpdateInput!` |
| `deleteCRMContact` | Eliminar contacto | `contactId: ID!` |
| `addCRMContactNote` | Añadir nota | `contactId: ID!, note: CRM_NoteInput!` |
| `updateCRMContactNote` | Actualizar nota | `noteId: ID!, updates: CRM_NoteInput!` |
| `deleteCRMContactNote` | Eliminar nota | `noteId: ID!` |
| `addCRMContactReminder` | Añadir recordatorio | `contactId: ID!, reminder: CRM_ReminderInput!` |
| `updateCRMContactReminder` | Actualizar recordatorio | `reminderId: ID!, updates: CRM_ReminderInput!` |
| `deleteCRMContactReminder` | Eliminar recordatorio | `reminderId: ID!` |
| `completeCRMContactReminder` | Completar recordatorio | `reminderId: ID!` |
| `addCRMContactTags` | Añadir etiquetas | `contactId: ID!, tags: [String!]!` |
| `removeCRMContactTags` | Quitar etiquetas | `contactId: ID!, tags: [String!]!` |
| `toggleCRMContactStar` | Destacar contacto | `contactId: ID!` |
| `updateCRMContactSentiment` | Actualizar sentimiento | `contactId: ID!, sentiment: String!` |
| `updateCRMContactLastContact` | Actualizar último contacto | `contactId: ID!, lastContact: String!` |
| `shareCRMContact` | Compartir contacto | `contactId: ID!, sharing: CRM_SharingInput!` |
| `unshareCRMContact` | Dejar de compartir | `contactId: ID!, userIds: [String!]!` |
| `importCRMContacts` | Importar contactos | `contacts: [CRM_ContactInput!]!` |

### 🏢 **CRM - ENTIDADES (15 mutations)**

| Mutation | Descripción | Parámetros |
|----------|-------------|------------|
| `createCRMEntity` | Crear entidad | `entityData: CRM_EntityInput!` |
| `updateCRMEntity` | Actualizar entidad | `entityId: ID!, updates: CRM_EntityUpdateInput!` |
| `deleteCRMEntity` | Eliminar entidad | `entityId: ID!` |
| `addCRMEntityContact` | Añadir contacto | `entityId: ID!, contactId: ID!` |
| `removeCRMEntityContact` | Quitar contacto | `entityId: ID!, contactId: ID!` |
| `addCRMEntityNote` | Añadir nota | `entityId: ID!, note: CRM_NoteInput!` |
| `updateCRMEntityNote` | Actualizar nota | `noteId: ID!, updates: CRM_NoteInput!` |
| `deleteCRMEntityNote` | Eliminar nota | `noteId: ID!` |
| `addCRMEntityReminder` | Añadir recordatorio | `entityId: ID!, reminder: CRM_ReminderInput!` |
| `updateCRMEntityReminder` | Actualizar recordatorio | `reminderId: ID!, updates: CRM_ReminderInput!` |
| `deleteCRMEntityReminder` | Eliminar recordatorio | `reminderId: ID!` |
| `completeCRMEntityReminder` | Completar recordatorio | `reminderId: ID!` |
| `addCRMEntityTags` | Añadir etiquetas | `entityId: ID!, tags: [String!]!` |
| `removeCRMEntityTags` | Quitar etiquetas | `entityId: ID!, tags: [String!]!` |
| `toggleCRMEntityStar` | Destacar entidad | `entityId: ID!` |
| `updateCRMEntitySentiment` | Actualizar sentimiento | `entityId: ID!, sentiment: String!` |
| `updateCRMEntityLastContact` | Actualizar último contacto | `entityId: ID!, lastContact: String!` |
| `shareCRMEntity` | Compartir entidad | `entityId: ID!, sharing: CRM_SharingInput!` |
| `unshareCRMEntity` | Dejar de compartir | `entityId: ID!, userIds: [String!]!` |

### 🎯 **CRM - LEADS (20 mutations)**

| Mutation | Descripción | Parámetros |
|----------|-------------|------------|
| `createCRMLead` | Crear lead | `leadData: CRM_LeadInput!` |
| `updateCRMLead` | Actualizar lead | `leadId: ID!, updates: CRM_LeadUpdateInput!` |
| `deleteCRMLead` | Eliminar lead | `leadId: ID!` |
| `moveCRMLeadToNextStage` | Mover a siguiente etapa | `leadId: ID!` |
| `moveCRMLeadToStage` | Mover a etapa específica | `leadId: ID!, stage: String!` |
| `markCRMLeadAsWon` | Marcar como ganado | `leadId: ID!` |
| `markCRMLeadAsLost` | Marcar como perdido | `leadId: ID!` |
| `assignCRMLead` | Asignar lead | `leadId: ID!, assigneeId: String!` |
| `unassignCRMLead` | Desasignar lead | `leadId: ID!` |
| `bulkAssignCRMLeads` | Asignación masiva | `leadIds: [ID!]!, assigneeId: String!` |
| `addCRMLeadNote` | Añadir nota | `leadId: ID!, note: CRM_NoteInput!` |
| `updateCRMLeadNote` | Actualizar nota | `noteId: ID!, updates: CRM_NoteInput!` |
| `deleteCRMLeadNote` | Eliminar nota | `noteId: ID!` |
| `addCRMLeadReminder` | Añadir recordatorio | `leadId: ID!, reminder: CRM_ReminderInput!` |
| `updateCRMLeadReminder` | Actualizar recordatorio | `reminderId: ID!, updates: CRM_ReminderInput!` |
| `deleteCRMLeadReminder` | Eliminar recordatorio | `reminderId: ID!` |
| `completeCRMLeadReminder` | Completar recordatorio | `reminderId: ID!` |
| `addCRMLeadTags` | Añadir etiquetas | `leadId: ID!, tags: [String!]!` |
| `removeCRMLeadTags` | Quitar etiquetas | `leadId: ID!, tags: [String!]!` |
| `updateCRMLeadPriority` | Actualizar prioridad | `leadId: ID!, priority: String!` |
| `updateCRMLeadValue` | Actualizar valor | `leadId: ID!, value: Float!` |
| `updateCRMLeadProbability` | Actualizar probabilidad | `leadId: ID!, probability: Float!` |
| `updateCRMLeadSentiment` | Actualizar sentimiento | `leadId: ID!, sentiment: String!` |
| `updateCRMLeadLastContact` | Actualizar último contacto | `leadId: ID!, lastContact: String!` |
| `shareCRMLead` | Compartir lead | `leadId: ID!, sharing: CRM_SharingInput!` |
| `unshareCRMLead` | Dejar de compartir | `leadId: ID!, userIds: [String!]!` |
| `convertCRMLeadToContact` | Convertir a contacto | `leadId: ID!` |
| `convertCRMLeadToEntity` | Convertir a entidad | `leadId: ID!` |

### 📧 **CRM - CAMPAÑAS (15 mutations)**

| Mutation | Descripción | Parámetros |
|----------|-------------|------------|
| `createCRMCampaign` | Crear campaña | `campaignData: CRM_CampaignInput!` |
| `updateCRMCampaign` | Actualizar campaña | `campaignId: ID!, updates: CRM_CampaignInput!` |
| `deleteCRMCampaign` | Eliminar campaña | `campaignId: ID!` |
| `scheduleCRMCampaign` | Programar campaña | `campaignId: ID!, scheduleDate: String!` |
| `startCRMCampaign` | Iniciar campaña | `campaignId: ID!` |
| `pauseCRMCampaign` | Pausar campaña | `campaignId: ID!` |
| `resumeCRMCampaign` | Reanudar campaña | `campaignId: ID!` |
| `cancelCRMCampaign` | Cancelar campaña | `campaignId: ID!` |
| `createCRMEmailTemplate` | Crear template email | `templateData: CRM_EmailTemplateInput!` |
| `updateCRMEmailTemplate` | Actualizar template | `templateId: ID!, updates: CRM_EmailTemplateInput!` |
| `deleteCRMEmailTemplate` | Eliminar template | `templateId: ID!` |
| `testCRMEmailTemplate` | Probar template | `templateId: ID!, testData: CRM_TemplateTestData!` |
| `createCRMWhatsAppTemplate` | Crear template WhatsApp | `templateData: CRM_WhatsAppTemplateInput!` |
| `updateCRMWhatsAppTemplate` | Actualizar template | `templateId: ID!, updates: CRM_WhatsAppTemplateInput!` |
| `deleteCRMWhatsAppTemplate` | Eliminar template | `templateId: ID!` |
| `createCRMContactList` | Crear lista de contactos | `listData: CRM_ContactListInput!` |
| `updateCRMContactList` | Actualizar lista | `listId: ID!, updates: CRM_ContactListInput!` |
| `deleteCRMContactList` | Eliminar lista | `listId: ID!` |
| `addCRMContactsToList` | Añadir contactos | `listId: ID!, contactIds: [ID!]!` |
| `removeCRMContactsFromList` | Quitar contactos | `listId: ID!, contactIds: [ID!]!` |
| `updateCRMDynamicList` | Actualizar lista dinámica | `listId: ID!, criteria: CRM_DynamicCriteriaInput!` |

---

## 🔧 **HERRAMIENTAS MCP (4 herramientas)**

| Herramienta | Descripción | Parámetros |
|-------------|-------------|------------|
| `health_check` | Verifica el estado del servidor | - |
| `get_events_by_phone` | Obtener eventos por teléfono | `phone: String!, development: String!` |
| `get_events_by_email` | Obtener eventos por email | `email: String!, development: String!` |
| `query_event` | Consultar información específica | `eventId: String!, questions: [String!]!` |

---

## 🎭 **SISTEMA DE PERMISOS AVANZADO**

### **Roles de Usuario:**
- **CREADOR** - Acceso completo (FULL_ACCESS)
- **COMPARTIDO** - Acceso básico con restricciones (BASIC_ACCESS)  
- **INVITADO** - Solo información personal (INVITATION_ONLY)

### **Datos Reales Disponibles:**
- **36 eventos** para el teléfono `+34622440213`
- **34 eventos** para el email `bodasdehoy.com@gmail.com`
- **Incluye eventos como:**
  - "Boda Isabel & Raúl" (42 invitados, 11 compartidos)
  - "Laura Hamburguesas" (4 invitados, 1 compartido)
  - "comunion1" (17 invitados, 4 compartidos)
  - Y muchos más...

---

## 🚀 **ENDPOINTS PÚBLICOS FUNCIONANDO**

### **API GraphQL:**
- **URL:** `https://api2.eventosorganizador.com/graphql`
- **Estado:** ✅ FUNCIONANDO
- **Introspection:** ✅ HABILITADA

### **MCP:**
- **URL:** `http://api2.eventosorganizador.com:4001/mcp`
- **Estado:** ✅ FUNCIONANDO
- **Herramientas:** ✅ 4 disponibles

### **Health Check:**
- **URL:** `https://api2.eventosorganizador.com/health`
- **Estado:** ✅ FUNCIONANDO
- **Brand:** Bodas de Hoy - Juan Carlos Parra

---

## 📊 **ESTADÍSTICAS DEL SISTEMA**

- **Total de funcionalidades:** 247 (92 queries + 155 mutations)
- **Tipos de datos:** 235
- **Módulos principales:** 8 (Eventos, Negocios, Usuarios, CRM, Usage Tracking, Whitelabel, Filtros, Configuración)
- **Eventos en base de datos:** 36+ eventos reales
- **Sistema de permisos:** 3 niveles (CREADOR, COMPARTIDO, INVITADO)
- **Herramientas MCP:** 4 herramientas funcionando

---

## 🎯 **CONCLUSIÓN**

**El sistema API Eventos Organizador es una plataforma extremadamente completa y robusta que incluye:**

✅ **Gestión completa de eventos** con sistema de permisos avanzado  
✅ **Sistema CRM completo** con contactos, entidades, leads y campañas  
✅ **Gestión de negocios** con reseñas, preguntas y categorías  
✅ **Sistema de facturación** con tracking de uso y métricas  
✅ **Marcas blancas** con configuración completa  
✅ **Filtros y configuraciones** personalizables  
✅ **API GraphQL** con 247 funcionalidades  
✅ **MCP** con herramientas especializadas  
✅ **Datos reales** funcionando en producción  

**El sistema está completamente operativo y listo para uso en producción con N8N y cualquier cliente que necesite acceso a esta funcionalidad.**

---

*Documentación generada el 12 de septiembre de 2025 - Sistema completamente operativo*
