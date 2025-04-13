# Próximas Versiones y Mejoras del Token

## Versión 1 – Implementación Inicial (Legacy)

- **Funcionalidad Básica:**
  - Token ERC20 básico con capacidad de _mint_ y _burn_ (quema).
- **Control de Roles:**
  - Asignación de roles: DEFAULT_ADMIN, MINTER y UPGRADER.
- **Upgradeabilidad:**
  - Uso del patrón UUPS para permitir actualizaciones futuras.
- **Storage Gap:**
  - Espacio reservado para futuras variables sin romper la compatibilidad.

## Versión 2 – Funcionalidades Avanzadas (V1)

- **Pausabilidad:**
  - Implementar la función de pausar y reanudar transferencias para situaciones críticas.
- **Permisos Off-Chain:**
  - Integración de ERC20Permit para aprobaciones mediante firma (reduce costos de gas).
- **Gobernanza y Delegación:**
  - Incorporar ERC20Votes para que los tokens puedan participar en votaciones y procesos de gobernanza.
- **Funcionalidades Adicionales:**
  - Posibles mecanismos de comisiones o límites anti-whale en transferencias.
  - Otras mejoras según necesidades y feedback de la comunidad.
- **Documentación y Auditoría:**
  - Actualización de la documentación y realización de auditorías internas/exteriores en cada upgrade.

## Proceso de Despliegue y Upgrade

- **Despliegue Inicial (V1):**
  - Uso de `upgrades.deployProxy()` con parámetros adecuados (por ejemplo, admin address y supply inicial).
  - Guardar la información clave (proxy, implementación y admin) para futuras verificaciones.
- **Actualizaciones (Upgrade a V2):**
  - Uso de `upgrades.upgradeProxy()` para migrar la lógica sin afectar el estado.
  - Ejecutar funciones de reinitializer si es necesario (por ejemplo, `initializeV2()`).
- **Integración con Herramientas:**
  - Utilizar Hardhat-Viem para optimizar interacciones con la red.
  - Configuración adecuada de RPC, gas y variables de entorno.
- **Monitoreo y Seguridad:**
  - Realización de pruebas unitarias e integración exhaustivas.
  - Auditorías y revisiones periódicas antes de pasar a producción.
