import { FEATURE_RULES } from "./featureRules.js";

export function detectCapabilities(files, deps = []) {
  const detected = new Set();

  for (const rule of FEATURE_RULES) {
    let matched = false;

    if (rule.signals.files) {
      matched ||= files.some(f => rule.signals.files.includes(f.name));
    }

    if (rule.signals.paths) {
      matched ||= files.some(f =>
        rule.signals.paths.some(p => f.path?.startsWith(p))
      );
    }

    if (rule.signals.keywords) {
      matched ||= deps.some(d => rule.signals.keywords.includes(d));
    }

    if (matched) detected.add(rule.capability);
  }

  return [...detected];
}
