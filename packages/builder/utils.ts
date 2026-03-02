import ts from 'typescript';

/**
 * Removes 'declare' modifiers from inside 'declare module' or 'declare namespace' blocks
 * because they are already in an ambient context and the extra 'declare' is a TypeScript error.
 */
export function removeDeclareInAmbientContext(code: string): string {
  // Preserve BOM if present
  const hasBOM = code.charCodeAt(0) === 0xfeff;
  if (hasBOM) {
    code = code.slice(1);
  }

  // Split by lines to process line by line
  const lines = code.split(ts.sys.newLine);
  const result: string[] = [];
  let insideAmbientContext = 0;

  for (const line of lines) {
    // Count braces in current line
    const openBraces = (line.match(/\{/g) || []).length;
    const closeBraces = (line.match(/\}/g) || []).length;

    // Check if line declares a TOP-LEVEL ambient context (module or namespace)
    // Only top-level (depth 0) declare module/namespace should keep 'declare'
    const isTopLevelAmbient =
      insideAmbientContext === 0 && /^\s*declare\s+(module|namespace)/.test(line);

    if (isTopLevelAmbient) {
      // This is a top-level ambient declaration - keep 'declare'
      result.push(line);
      insideAmbientContext += openBraces - closeBraces;
    } else if (insideAmbientContext > 0) {
      // Inside ambient context - remove 'declare ' prefix (preserve indentation)
      const cleaned = line.replace(/^(\s*)declare\s+/, '$1');
      result.push(cleaned);
      insideAmbientContext += openBraces - closeBraces;
    } else {
      // Outside ambient context - keep as is
      result.push(line);
      insideAmbientContext += openBraces - closeBraces;
    }

    // Ensure depth doesn't go negative
    if (insideAmbientContext < 0) {
      insideAmbientContext = 0;
    }
  }

  const output = result.join(ts.sys.newLine);
  return hasBOM ? '\ufeff' + output : output;
}
