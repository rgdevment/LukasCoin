# Implementación V1 – Token "Lukas"

## Descripción General

La implementación V1 del token "Lukas" es un contrato upgradeable basado en el patrón UUPS. Este token es de tipo ERC20 con funcionalidad adicional para permitir a los usuarios:

- Emitir (mint) nuevos tokens, siempre respetando un límite máximo definido.
- Quemar (burn) sus tokens de forma individual.
- Detener y reanudar todas las transferencias mediante funciones de pausa (pausable).

## Funcionalidades Principales

- **Token ERC20 Básico:**

  - Se basa en la especificación ERC20 y cuenta con 18 decimales.
  - Se define un suministro inicial de 1,000,000 tokens y un suministro máximo de 12,000,000 tokens.

- **Funcionalidad Burnable:**

  - Los usuarios pueden destruir sus tokens, reduciendo su balance de forma irreversible.

- **Funcionalidad Pausable:**

  - Se implementan funciones para pausar y reanudar las operaciones de transferencia. Esto permite detener la actividad del token en situaciones de emergencia o durante procesos de mantenimiento.

- **Control de Roles Mediante AccessControl:**

  - Se asignan roles específicos para controlar operaciones críticas:
    - **MINTER_ROLE:** Autoriza la emisión de nuevos tokens.
    - **PAUSER_ROLE:** Autoriza la pausa y despausa de las transferencias.
    - **UPGRADER_ROLE:** Define quién puede actualizar la lógica del contrato.
  - El rol de administrador por defecto también se asigna al inicializador para garantizar el control global.

- **Upgradeabilidad con UUPS:**
  - La arquitectura upgradeable permite actualizar la lógica del contrato sin perder el estado almacenado.
  - Se emplea el patrón UUPS, restringiendo la capacidad de upgrade mediante la verificación de roles.

## Aspectos Técnicos Destacados

- **Inicialización Segura:**

  - La función de inicialización se encarga de configurar todas las dependencias y asignar roles, además de emitir el suministro inicial de tokens.

- **Storage Gap:**

  - Se reserva un espacio de almacenamiento (50 slots) para futuras actualizaciones. Esto garantiza que las actualizaciones no afecten la estructura interna (layout) del almacenamiento, manteniendo la compatibilidad a lo largo de las versiones.

- **Verificación en el Explorador:**
  - La implementación ha sido verificada públicamente en Polygonscan, lo que permite a la comunidad y otros desarrolladores revisar el código fuente y confirmar la integridad del despliegue.

## Beneficios y Consideraciones

- **Transparencia y Seguridad:**
  - Gracias a la verificación en Polygonscan y al uso de estándares ampliamente auditados, la implementación V1 ofrece un alto grado de confianza y seguridad.
- **Flexibilidad para Futuras Actualizaciones:**
  - La arquitectura upgradeable permite incorporar nuevas funcionalidades (por ejemplo, mecanismos de gobernanza, aprobaciones off-chain, etc.) sin afectar el estado actual del token.
- **Costos Económicos en Polygon:**
  - El despliegue en Polygon es muy económico en términos de tarifas de gas, lo que facilita la adopción y escalabilidad del token.

Esta implementación V1 sienta las bases para un token robusto, seguro y flexible, preparado para evolucionar en futuras versiones sin comprometer la integridad y seguridad del sistema.
