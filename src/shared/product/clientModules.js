import { CLIENT_OPTIONAL, migrateClientModules } from './roles.js';

// Only module names and opaque command receipts leave the client's document.
export function moduleCommandRevisions(value) {
  const result = {};
  if (!value || typeof value !== 'object' || Array.isArray(value)) return result;
  for (const module of CLIENT_OPTIONAL) {
    const revision = value[module];
    if (typeof revision === 'string' && /^[a-zA-Z0-9-]{1,80}$/.test(revision)) result[module] = revision;
  }
  return result;
}

export function applyClientModuleCommands(coll, commands, baselineRevisions) {
  if (!coll || !Array.isArray(commands)) return coll;
  let next = coll;
  for (const command of commands) {
    const { module, enabled, revision } = command || {};
    if (!CLIENT_OPTIONAL.includes(module) || typeof enabled !== 'boolean' ||
        moduleCommandRevisions({ [module]: revision })[module] !== revision || !revision ||
        (baselineRevisions && next.moduleCommandRevisions?.[module] !== baselineRevisions[module]) ||
        command.applied === true || next.moduleCommandRevisions?.[module] === revision) continue;
    const modules = migrateClientModules(next.modules) || [];
    next = { ...next,
      modules: enabled ? [...new Set([...modules, module])] : modules.filter(key => key !== module),
      moduleCommandRevisions: { ...moduleCommandRevisions(next.moduleCommandRevisions), [module]: revision },
    };
    // A new coach addition should be reachable. Once delivered, the client's
    // later sidebar/dock choice is never overwritten by polling or another device.
    if (enabled) {
      const navigation = next.ui?.navigation || {};
      next.ui = { ...next.ui, navigation: { ...navigation, rooms: { ...navigation.rooms,
        [module]: { ...navigation.rooms?.[module], hidden: false, sidebar: true },
      } } };
    }
  }
  return next;
}
