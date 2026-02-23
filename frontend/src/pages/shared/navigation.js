export function pickModulesByKey(modules, keys) {
  const keySet = new Set(keys);
  return modules.filter((module) => keySet.has(module.key));
}

export function buildSections(modules, sectionDefs) {
  return sectionDefs
    .map((section) => ({
      title: section.title,
      modules: pickModulesByKey(modules, section.keys)
    }))
    .filter((section) => section.modules.length);
}
