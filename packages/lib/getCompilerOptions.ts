import ts from 'typescript';
import path from 'node:path';

export const getCompilerOptions = (
  pathToTSConfig?: string,
  override: ts.CompilerOptions = {},
): ts.CompilerOptions => {
  try {
    if (!pathToTSConfig) throw new Error('No tsconfig path provided');

    const basePath = path.dirname(pathToTSConfig);

    const { config } = ts.readConfigFile(pathToTSConfig, ts.sys.readFile);

    const parsedConfig = ts.parseJsonConfigFileContent(config, ts.sys, basePath);

    return {
      ...parsedConfig.options,
      ...override,
    };
  } catch (e) {
    throw new Error(
      `ts-remote: [ERROR] Error reading tsconfig.json. Check the specified path or the validity of the file.`,
    );
  }
};
