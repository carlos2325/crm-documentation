# 🔧 Personalización - Guía para Expertos

**Personaliza y extiende la API según tus necesidades específicas**

---

## 🎯 **Opciones de Personalización**

### **Configuraciones Avanzadas**
- ✅ **Schemas personalizados** para tipos de eventos únicos
- ✅ **Campos adicionales** en entidades existentes
- ✅ **Validaciones personalizadas** para reglas de negocio
- ✅ **Integraciones externas** con sistemas propios

### **Extensiones Empresariales**
- ✅ **Múltiples organizaciones** con datos aislados
- ✅ **Roles y permisos** granulares
- ✅ **Auditoría completa** de cambios
- ✅ **APIs privadas** para funcionalidades específicas

---

## 🏗️ **Schemas Personalizados**

### **Definir Schema Personalizado**
```javascript
async function definirSchemaPersonalizado() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation DefineCustomSchema($input: DefineCustomSchemaInput!) {
          defineCustomSchema(input: $input) {
            success
            schema {
              id
              nombre
              version
              entidades {
                nombre
                campos {
                  nombre
                  tipo
                  requerido
                  validaciones
                }
                relaciones
              }
              createdAt
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          nombre: "Eventos Corporativos",
          version: "1.0",
          descripcion: "Schema personalizado para eventos corporativos",
          entidades: [
            {
              nombre: "EventoCorporativo",
              extends: "Evento", // Extiende el tipo Evento base
              campos: [
                {
                  nombre: "departamento",
                  tipo: "String",
                  requerido: true,
                  validaciones: {
                    enum: ["IT", "Marketing", "Ventas", "RRHH", "Finanzas"]
                  }
                },
                {
                  nombre: "presupuestoAprobado",
                  tipo: "Boolean",
                  requerido: true
                },
                {
                  nombre: "numeroEmpleados",
                  tipo: "Int",
                  requerido: false,
                  validaciones: {
                    min: 1,
                    max: 1000
                  }
                },
                {
                  nombre: "tipoEventoCorp",
                  tipo: "String",
                  requerido: true,
                  validaciones: {
                    enum: ["conferencia", "team_building", "lanzamiento", "reunion", "capacitacion"]
                  }
                },
                {
                  nombre: "sponsors",
                  tipo: "[String]",
                  requerido: false
                },
                {
                  nombre: "requerimientosEspeciales",
                  tipo: "String",
                  requerido: false,
                  validaciones: {
                    maxLength: 500
                  }
                }
              ],
              relaciones: [
                {
                  tipo: "many-to-many",
                  entidad: "Empleado",
                  campo: "participantes"
                },
                {
                  tipo: "one-to-many",
                  entidad: "DocumentoCorporativo",
                  campo: "documentos"
                }
              ]
            },
            {
              nombre: "Empleado",
              campos: [
                {
                  nombre: "numeroEmpleado",
                  tipo: "String",
                  requerido: true,
                  validaciones: {
                    pattern: "^EMP-[0-9]{4}$"
                  }
                },
                {
                  nombre: "departamento",
                  tipo: "String",
                  requerido: true
                },
                {
                  nombre: "nivelJerarquico",
                  tipo: "String",
                  requerido: true,
                  validaciones: {
                    enum: ["junior", "senior", "manager", "director", "ejecutivo"]
                  }
                },
                {
                  nombre: "fechaContratacion",
                  tipo: "Date",
                  requerido: true
                }
              ]
            }
          ]
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.defineCustomSchema.success) {
    const schema = data.data.defineCustomSchema.schema;
    console.log('✅ Schema personalizado definido exitosamente:');
    console.log(`   ID: ${schema.id}`);
    console.log(`   Nombre: ${schema.nombre}`);
    console.log(`   Version: ${schema.version}`);
    console.log(`   Entidades: ${schema.entidades.length}`);
    
    schema.entidades.forEach(entidad => {
      console.log(`   - ${entidad.nombre}: ${entidad.campos.length} campos`);
    });
    
    return schema.id;
  } else {
    console.log('❌ Error definiendo schema:', data.data.defineCustomSchema.errors);
    return null;
  }
}
```

### **Usar Schema Personalizado**
```javascript
async function crearEventoCorporativo() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation CreateEventoCorporativo($input: CreateEventoCorporativoInput!) {
          createEventoCorporativo(input: $input) {
            success
            evento {
              id
              nombre
              fecha
              ubicacion
              departamento
              presupuestoAprobado
              numeroEmpleados
              tipoEventoCorp
              sponsors
              requerimientosEspeciales
              participantes {
                id
                nombre
                numeroEmpleado
                departamento
              }
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          // Campos del evento base
          nombre: "Conferencia Anual de Tecnología 2025",
          fecha: "2025-11-15",
          hora: "09:00",
          ubicacion: "Centro de Convenciones Madrid",
          direccion: "Av. Principal 456, Madrid",
          descripcion: "Conferencia anual para empleados del departamento de IT",
          presupuesto: 25000,
          
          // Campos personalizados
          departamento: "IT",
          presupuestoAprobado: true,
          numeroEmpleados: 150,
          tipoEventoCorp: "conferencia",
          sponsors: ["Microsoft", "Google", "Amazon"],
          requerimientosEspeciales: "Necesitamos conexión de alta velocidad y equipos de presentación",
          
          // Relaciones
          participantes: [
            {
              numeroEmpleado: "EMP-0001",
              nombre: "Juan Pérez",
              email: "juan.perez@empresa.com",
              departamento: "IT",
              nivelJerarquico: "senior",
              fechaContratacion: "2020-01-15"
            },
            {
              numeroEmpleado: "EMP-0002",
              nombre: "María García",
              email: "maria.garcia@empresa.com",
              departamento: "IT",
              nivelJerarquico: "manager",
              fechaContratacion: "2019-03-10"
            }
          ]
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.createEventoCorporativo.success) {
    const evento = data.data.createEventoCorporativo.evento;
    console.log('✅ Evento corporativo creado exitosamente:');
    console.log(`   Nombre: ${evento.nombre}`);
    console.log(`   Departamento: ${evento.departamento}`);
    console.log(`   Tipo: ${evento.tipoEventoCorp}`);
    console.log(`   Empleados: ${evento.numeroEmpleados}`);
    console.log(`   Participantes: ${evento.participantes.length}`);
    console.log(`   Sponsors: ${evento.sponsors.join(', ')}`);
    return evento.id;
  } else {
    console.log('❌ Error creando evento corporativo:', data.data.createEventoCorporativo.errors);
    return null;
  }
}
```

---

## 🔐 **Sistema de Roles y Permisos**

### **Definir Roles Personalizados**
```javascript
async function definirRolesPersonalizados() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation DefineCustomRoles($input: DefineCustomRolesInput!) {
          defineCustomRoles(input: $input) {
            success
            roles {
              id
              nombre
              descripcion
              permisos {
                recurso
                acciones
                condiciones
              }
              jerarquia
              createdAt
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          organizacion: "EmpresaCorp",
          roles: [
            {
              nombre: "CoordinadorEventos",
              descripcion: "Coordinador especializado en eventos corporativos",
              permisos: [
                {
                  recurso: "eventos_corporativos",
                  acciones: ["crear", "leer", "actualizar", "eliminar"],
                  condiciones: {
                    departamento: "{{usuario.departamento}}"
                  }
                },
                {
                  recurso: "empleados",
                  acciones: ["leer"],
                  condiciones: {
                    departamento: "{{usuario.departamento}}"
                  }
                },
                {
                  recurso: "reportes",
                  acciones: ["leer"],
                  condiciones: {
                    tipo: "corporativo"
                  }
                }
              ],
              jerarquia: 3
            },
            {
              nombre: "GerenteDepartamento",
              descripcion: "Gerente con acceso completo a su departamento",
              permisos: [
                {
                  recurso: "*",
                  acciones: ["crear", "leer", "actualizar", "eliminar"],
                  condiciones: {
                    departamento: "{{usuario.departamento}}"
                  }
                },
                {
                  recurso: "reportes",
                  acciones: ["crear", "leer"],
                  condiciones: {}
                }
              ],
              jerarquia: 4
            },
            {
              nombre: "AuditorInterno",
              descripcion: "Auditor con acceso de solo lectura a todos los datos",
              permisos: [
                {
                  recurso: "*",
                  acciones: ["leer"],
                  condiciones: {}
                },
                {
                  recurso: "auditoria",
                  acciones: ["crear", "leer"],
                  condiciones: {}
                }
              ],
              jerarquia: 5
            }
          ]
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.defineCustomRoles.success) {
    const roles = data.data.defineCustomRoles.roles;
    console.log('✅ Roles personalizados definidos exitosamente:');
    
    roles.forEach(role => {
      console.log(`   ${role.nombre} (Nivel ${role.jerarquia}):`);
      role.permisos.forEach(permiso => {
        console.log(`     - ${permiso.recurso}: ${permiso.acciones.join(', ')}`);
      });
    });
    
    return roles.map(role => role.id);
  } else {
    console.log('❌ Error definiendo roles:', data.data.defineCustomRoles.errors);
    return null;
  }
}
```

### **Asignar Roles a Usuarios**
```javascript
async function asignarRolUsuario(usuarioId, rolId, condiciones = {}) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation AssignRoleToUser($input: AssignRoleInput!) {
          assignRoleToUser(input: $input) {
            success
            asignacion {
              id
              usuario {
                id
                nombre
                email
              }
              rol {
                id
                nombre
                descripcion
              }
              condiciones
              fechaAsignacion
              activo
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          usuarioId: usuarioId,
          rolId: rolId,
          condiciones: condiciones,
          activo: true,
          fechaExpiracion: null // Sin expiración
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.assignRoleToUser.success) {
    const asignacion = data.data.assignRoleToUser.asignacion;
    console.log('✅ Rol asignado exitosamente:');
    console.log(`   Usuario: ${asignacion.usuario.nombre} (${asignacion.usuario.email})`);
    console.log(`   Rol: ${asignacion.rol.nombre}`);
    console.log(`   Condiciones: ${JSON.stringify(asignacion.condiciones)}`);
    return asignacion.id;
  } else {
    console.log('❌ Error asignando rol:', data.data.assignRoleToUser.errors);
    return null;
  }
}
```

---

## 📊 **Auditoría y Logging**

### **Configurar Auditoría Completa**
```javascript
async function configurarAuditoria() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation ConfigureAudit($input: ConfigureAuditInput!) {
          configureAudit(input: $input) {
            success
            configuracion {
              id
              entidadesAuditadas
              eventosAuditados
              retencionDias
              encriptacion
              notificaciones {
                email
                webhook
              }
              createdAt
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          organizacion: "EmpresaCorp",
          entidadesAuditadas: [
            "eventos",
            "contactos",
            "leads",
            "campañas",
            "usuarios",
            "eventos_corporativos",
            "empleados"
          ],
          eventosAuditados: [
            "crear",
            "actualizar",
            "eliminar",
            "asignar_rol",
            "cambiar_permisos",
            "acceso_datos_sensibles"
          ],
          retencionDias: 2555, // 7 años
          encriptacion: {
            algoritmo: "AES-256",
            claveRotacion: 90 // días
          },
          notificaciones: {
            email: {
              activo: true,
              destinatarios: ["auditoria@empresa.com", "compliance@empresa.com"],
              eventosCriticos: ["eliminar", "cambiar_permisos"]
            },
            webhook: {
              activo: true,
              url: "https://empresa.com/webhook/auditoria",
              eventos: ["todos"]
            }
          }
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.configureAudit.success) {
    const config = data.data.configureAudit.configuracion;
    console.log('✅ Auditoría configurada exitosamente:');
    console.log(`   ID: ${config.id}`);
    console.log(`   Entidades auditadas: ${config.entidadesAuditadas.length}`);
    console.log(`   Eventos auditados: ${config.eventosAuditados.length}`);
    console.log(`   Retención: ${config.retencionDias} días`);
    console.log(`   Encriptación: ${config.encriptacion.algoritmo}`);
    return config.id;
  } else {
    console.log('❌ Error configurando auditoría:', data.data.configureAudit.errors);
    return null;
  }
}
```

### **Consultar Logs de Auditoría**
```javascript
async function consultarLogsAuditoria(filtros = {}) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        query GetAuditLogs($filtros: AuditLogFilters!) {
          getAuditLogs(filtros: $filtros) {
            success
            logs {
              id
              timestamp
              usuario {
                id
                nombre
                email
              }
              accion
              entidad
              entidadId
              cambios {
                campo
                valorAnterior
                valorNuevo
              }
              metadata {
                ip
                userAgent
                sesionId
              }
              nivel
            }
            paginacion {
              total
              pagina
              limite
              totalPaginas
            }
            errors
          }
        }
      `,
      variables: {
        filtros: {
          fechaDesde: filtros.fechaDesde || "2025-01-01",
          fechaHasta: filtros.fechaHasta || new Date().toISOString().split('T')[0],
          entidades: filtros.entidades || [],
          acciones: filtros.acciones || [],
          usuarios: filtros.usuarios || [],
          nivel: filtros.nivel || "INFO",
          pagina: filtros.pagina || 1,
          limite: filtros.limite || 50
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.getAuditLogs.success) {
    const logs = data.data.getAuditLogs.logs;
    const paginacion = data.data.getAuditLogs.paginacion;
    
    console.log(`📊 Logs de auditoría encontrados: ${paginacion.total}`);
    console.log(`   Página ${paginacion.pagina} de ${paginacion.totalPaginas}`);
    
    logs.forEach(log => {
      console.log(`   ${log.timestamp}: ${log.usuario.nombre} ${log.accion} ${log.entidad}`);
      if (log.cambios && log.cambios.length > 0) {
        log.cambios.forEach(cambio => {
          console.log(`     - ${cambio.campo}: "${cambio.valorAnterior}" → "${cambio.valorNuevo}"`);
        });
      }
    });
    
    return { logs, paginacion };
  } else {
    console.log('❌ Error consultando logs:', data.data.getAuditLogs.errors);
    return null;
  }
}

// Ejemplos de uso
await consultarLogsAuditoria({
  entidades: ["eventos_corporativos"],
  acciones: ["crear", "actualizar"],
  fechaDesde: "2025-10-01"
});

await consultarLogsAuditoria({
  usuarios: ["usuario123"],
  nivel: "WARNING"
});
```

---

## 🔗 **Integraciones Externas**

### **Configurar Integración Externa**
```javascript
async function configurarIntegracionExterna() {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation ConfigureExternalIntegration($input: ConfigureExternalIntegrationInput!) {
          configureExternalIntegration(input: $input) {
            success
            integracion {
              id
              nombre
              tipo
              configuracion {
                endpoint
                autenticacion
                mapeoCampos
                transformaciones
              }
              estado
              ultimaSincronizacion
              createdAt
            }
            errors
          }
        }
      `,
      variables: {
        input: {
          nombre: "Sistema RRHH Empresa",
          tipo: "HR_SYSTEM",
          descripcion: "Integración con sistema de recursos humanos interno",
          configuracion: {
            endpoint: "https://rrhh.empresa.com/api/v1",
            autenticacion: {
              tipo: "API_KEY",
              apiKey: "hr_api_key_secret",
              headers: {
                "X-API-Key": "{{apiKey}}",
                "Content-Type": "application/json"
              }
            },
            mapeoCampos: {
              "empleado.numeroEmpleado": "employee_id",
              "empleado.nombre": "first_name",
              "empleado.apellidos": "last_name",
              "empleado.email": "email",
              "empleado.departamento": "department",
              "empleado.nivelJerarquico": "position_level",
              "empleado.fechaContratacion": "hire_date"
            },
            transformaciones: {
              "nivelJerarquico": {
                "junior": "entry_level",
                "senior": "senior_level",
                "manager": "management",
                "director": "director",
                "ejecutivo": "executive"
              }
            }
          },
          eventos: [
            {
              tipo: "empleado.creado",
              accion: "CREATE_EMPLOYEE",
              endpoint: "/employees"
            },
            {
              tipo: "empleado.actualizado",
              accion: "UPDATE_EMPLOYEE",
              endpoint: "/employees/{id}"
            },
            {
              tipo: "empleado.eliminado",
              accion: "DELETE_EMPLOYEE",
              endpoint: "/employees/{id}",
              metodo: "DELETE"
            }
          ]
        }
      }
    })
  });

  const data = await response.json();
  
  if (data.data.configureExternalIntegration.success) {
    const integracion = data.data.configureExternalIntegration.integracion;
    console.log('✅ Integración externa configurada exitosamente:');
    console.log(`   ID: ${integracion.id}`);
    console.log(`   Nombre: ${integracion.nombre}`);
    console.log(`   Tipo: ${integracion.tipo}`);
    console.log(`   Estado: ${integracion.estado}`);
    console.log(`   Eventos configurados: ${integracion.configuracion.eventos.length}`);
    return integracion.id;
  } else {
    console.log('❌ Error configurando integración:', data.data.configureExternalIntegration.errors);
    return null;
  }
}
```

### **Sincronizar Datos Externos**
```javascript
async function sincronizarDatosExternos(integracionId) {
  const response = await fetch('https://api2.eventosorganizador.com/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${miToken}`,
      'Origin': 'https://tu-dominio.com'
    },
    body: JSON.stringify({
      query: `
        mutation SyncExternalData($integracionId: ID!) {
          syncExternalData(integracionId: $integracionId) {
            success
            resultado {
              sincronizacionId
              registrosProcesados
              registrosCreados
              registrosActualizados
              registrosEliminados
              errores {
                registro
                error
              }
              tiempoEjecucion
              fechaSincronizacion
            }
            errors
          }
        }
      `,
      variables: {
        integracionId: integracionId
      }
    })
  });

  const data = await response.json();
  
  if (data.data.syncExternalData.success) {
    const resultado = data.data.syncExternalData.resultado;
    console.log('✅ Sincronización completada exitosamente:');
    console.log(`   ID Sincronización: ${resultado.sincronizacionId}`);
    console.log(`   Registros procesados: ${resultado.registrosProcesados}`);
    console.log(`   Creados: ${resultado.registrosCreados}`);
    console.log(`   Actualizados: ${resultado.registrosActualizados}`);
    console.log(`   Eliminados: ${resultado.registrosEliminados}`);
    console.log(`   Errores: ${resultado.errores.length}`);
    console.log(`   Tiempo: ${resultado.tiempoEjecucion}s`);
    
    if (resultado.errores.length > 0) {
      console.log('   Detalles de errores:');
      resultado.errores.forEach(error => {
        console.log(`     - ${error.registro}: ${error.error}`);
      });
    }
    
    return resultado;
  } else {
    console.log('❌ Error en sincronización:', data.data.syncExternalData.errors);
    return null;
  }
}
```

---

## 🎯 **Ejemplo Completo: Sistema Empresarial**

```javascript
class SistemaEmpresarialPersonalizado {
  constructor(token, organizacion) {
    this.token = token;
    this.organizacion = organizacion;
    this.schemaId = null;
    this.rolesIds = [];
    this.auditoriaId = null;
    this.integracionesIds = [];
  }

  async inicializarSistemaCompleto() {
    console.log('🏢 Inicializando sistema empresarial personalizado...');
    
    try {
      // 1. Definir schema personalizado
      console.log('1️⃣ Definiendo schema personalizado...');
      this.schemaId = await this.definirSchemaPersonalizado();
      
      // 2. Configurar roles y permisos
      console.log('2️⃣ Configurando roles y permisos...');
      this.rolesIds = await this.definirRolesPersonalizados();
      
      // 3. Configurar auditoría
      console.log('3️⃣ Configurando auditoría...');
      this.auditoriaId = await this.configurarAuditoria();
      
      // 4. Configurar integraciones externas
      console.log('4️⃣ Configurando integraciones externas...');
      const integracionId = await this.configurarIntegracionExterna();
      this.integracionesIds.push(integracionId);
      
      // 5. Crear datos de ejemplo
      console.log('5️⃣ Creando datos de ejemplo...');
      await this.crearDatosEjemplo();
      
      // 6. Ejecutar sincronización inicial
      console.log('6️⃣ Ejecutando sincronización inicial...');
      await this.sincronizarDatosExternos(integracionId);
      
      console.log('🎉 Sistema empresarial personalizado inicializado correctamente');
      
      return {
        schema: this.schemaId,
        roles: this.rolesIds,
        auditoria: this.auditoriaId,
        integraciones: this.integracionesIds
      };
      
    } catch (error) {
      console.error('❌ Error inicializando sistema:', error);
      throw error;
    }
  }

  async crearDatosEjemplo() {
    // Crear empleados de ejemplo
    const empleados = [
      {
        numeroEmpleado: "EMP-0001",
        nombre: "Juan",
        apellidos: "Pérez García",
        email: "juan.perez@empresa.com",
        departamento: "IT",
        nivelJerarquico: "senior",
        fechaContratacion: "2020-01-15"
      },
      {
        numeroEmpleado: "EMP-0002",
        nombre: "María",
        apellidos: "García López",
        email: "maria.garcia@empresa.com",
        departamento: "IT",
        nivelJerarquico: "manager",
        fechaContratacion: "2019-03-10"
      },
      {
        numeroEmpleado: "EMP-0003",
        nombre: "Carlos",
        apellidos: "Ruiz Martín",
        email: "carlos.ruiz@empresa.com",
        departamento: "Marketing",
        nivelJerarquico: "director",
        fechaContratacion: "2018-06-01"
      }
    ];

    // Crear eventos corporativos de ejemplo
    const eventos = [
      {
        nombre: "Conferencia Anual de Tecnología 2025",
        fecha: "2025-11-15",
        departamento: "IT",
        tipoEventoCorp: "conferencia",
        numeroEmpleados: 150,
        presupuestoAprobado: true,
        participantes: empleados.slice(0, 2).map(emp => ({ ...emp, id: null }))
      },
      {
        nombre: "Team Building Marketing",
        fecha: "2025-12-01",
        departamento: "Marketing",
        tipoEventoCorp: "team_building",
        numeroEmpleados: 25,
        presupuestoAprobado: true,
        participantes: empleados.slice(2, 3).map(emp => ({ ...emp, id: null }))
      }
    ];

    for (const evento of eventos) {
      const eventoId = await this.crearEventoCorporativo(evento);
      if (eventoId) {
        console.log(`✅ Evento creado: ${evento.nombre}`);
      }
    }
  }

  async generarReportePersonalizado() {
    console.log('📊 Generando reporte personalizado...');
    
    // Consultar logs de auditoría
    const logs = await this.consultarLogsAuditoria({
      fechaDesde: "2025-10-01",
      entidades: ["eventos_corporativos", "empleados"]
    });
    
    // Generar estadísticas
    const estadisticas = {
      totalEventos: logs.logs.filter(log => log.entidad === "eventos_corporativos").length,
      totalEmpleados: logs.logs.filter(log => log.entidad === "empleados").length,
      actividadesPorUsuario: {},
      cambiosRecientes: logs.logs.slice(0, 10)
    };
    
    // Contar actividades por usuario
    logs.logs.forEach(log => {
      const usuario = log.usuario.email;
      estadisticas.actividadesPorUsuario[usuario] = 
        (estadisticas.actividadesPorUsuario[usuario] || 0) + 1;
    });
    
    console.log('📈 Estadísticas del reporte:');
    console.log(`   Total eventos: ${estadisticas.totalEventos}`);
    console.log(`   Total empleados: ${estadisticas.totalEmpleados}`);
    console.log(`   Actividades por usuario:`);
    Object.entries(estadisticas.actividadesPorUsuario).forEach(([usuario, count]) => {
      console.log(`     ${usuario}: ${count} actividades`);
    });
    
    return estadisticas;
  }

  // Métodos auxiliares (implementaciones anteriores)
  async definirSchemaPersonalizado() {
    // Implementación anterior...
  }

  async definirRolesPersonalizados() {
    // Implementación anterior...
  }

  async configurarAuditoria() {
    // Implementación anterior...
  }

  async configurarIntegracionExterna() {
    // Implementación anterior...
  }

  async crearEventoCorporativo(datos) {
    // Implementación anterior...
  }

  async sincronizarDatosExternos(integracionId) {
    // Implementación anterior...
  }

  async consultarLogsAuditoria(filtros) {
    // Implementación anterior...
  }
}

// Usar el sistema empresarial
const sistema = new SistemaEmpresarialPersonalizado(miToken, "EmpresaCorp");
const resultado = await sistema.inicializarSistemaCompleto();

console.log('Sistema empresarial configurado:', resultado);

// Generar reporte después de un tiempo
setTimeout(async () => {
  const reporte = await sistema.generarReportePersonalizado();
  console.log('Reporte generado:', reporte);
}, 60000); // 1 minuto después
```

---

## 🎯 **Próximos Pasos**

### **¿Ya tienes tu sistema personalizado?**
👉 **[Ver Documentación Completa](./complete-reference.md)**

### **¿Necesitas soporte técnico?**
👉 **[Contactar Soporte](mailto:soporte@eventosorganizador.com)**

### **¿Quieres ver más ejemplos?**
👉 **[Ver Código de Ejemplo](./code-examples.md)**

---

## 💡 **Consejos de Personalización**

1. **Planifica el schema:** Diseña cuidadosamente tu estructura de datos
2. **Prueba incrementalmente:** Implementa y prueba cada componente por separado
3. **Documenta cambios:** Mantén registro de todas las personalizaciones
4. **Considera rendimiento:** Optimiza queries y cache para grandes volúmenes
5. **Mantén seguridad:** Revisa permisos y auditoría regularmente

---

**¿Necesitas ayuda con personalización?** 📧 soporte@eventosorganizador.com
