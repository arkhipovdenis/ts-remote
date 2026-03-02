import ts from 'typescript';
import { ConfigError } from '../shared/errors';
import { RemoteMap, TsRemotePluginConfig } from './contract-public';

/**
 * Read the ts-remote plugin configuration from a tsconfig.json file.
 *
 * Looks for an entry in `compilerOptions.plugins` where `name === "ts-remote"`.
 * Throws `ConfigError` if the tsconfig cannot be read or the plugin is not configured.
 */
export function readPluginConfig(tsconfigPath: string): TsRemotePluginConfig {
  let config: Record<string, unknown>;

  try {
    const result = ts.readConfigFile(tsconfigPath, ts.sys.readFile);

    if (result.error) {
      throw new ConfigError(
        `Failed to read tsconfig at ${tsconfigPath}: ${ts.flattenDiagnosticMessageText(
          result.error.messageText,
          '\n',
        )}`,
      );
    }

    config = result.config as Record<string, unknown>;
  } catch (err) {
    if (err instanceof ConfigError) throw err;
    throw new ConfigError(`Failed to read tsconfig at ${tsconfigPath}`, { cause: err });
  }

  const compilerOptions = config['compilerOptions'] as Record<string, unknown> | undefined;

  if (!compilerOptions?.['plugins'] || !Array.isArray(compilerOptions['plugins'])) {
    throw new ConfigError(
      'No plugins configured in tsconfig.json. Add ts-remote to compilerOptions.plugins.',
    );
  }

  const pluginEntry = (compilerOptions['plugins'] as Array<Record<string, unknown>>).find(
    (p) => p['name'] === 'ts-remote',
  );

  if (!pluginEntry) {
    throw new ConfigError(
      'ts-remote plugin not found in tsconfig.json compilerOptions.plugins. ' +
        'Add { "name": "ts-remote", "remotes": { ... } } to the plugins array.',
    );
  }

  if (!pluginEntry['remotes'] || typeof pluginEntry['remotes'] !== 'object') {
    throw new ConfigError(
      'ts-remote plugin is missing the "remotes" field. ' +
        'Add a remotes object mapping module names to URLs.',
    );
  }

  const remotes = pluginEntry['remotes'] as RemoteMap;

  validateRemotes(remotes);

  return {
    name: 'ts-remote',
    remotes,
    cacheDir: typeof pluginEntry['cacheDir'] === 'string' ? pluginEntry['cacheDir'] : undefined,
    cacheTTL: typeof pluginEntry['cacheTTL'] === 'number' ? pluginEntry['cacheTTL'] : undefined,
  };
}

/**
 * Validate the remotes map: ensure all keys are non-empty strings
 * and all values are valid HTTP(S) URLs.
 */
export function validateRemotes(remotes: RemoteMap): void {
  const entries = Object.entries(remotes);

  if (entries.length === 0) {
    throw new ConfigError('The "remotes" object is empty. Add at least one remote entry.');
  }

  for (const [name, url] of entries) {
    if (!name || typeof name !== 'string') {
      throw new ConfigError(
        `Invalid remote name: "${name}". Module names must be non-empty strings.`,
      );
    }

    if (!url || typeof url !== 'string') {
      throw new ConfigError(`Invalid URL for remote "${name}": URL must be a non-empty string.`);
    }

    try {
      const parsed = new URL(url);

      if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        throw new ConfigError(
          `Invalid URL for remote "${name}": "${url}". Only http:// and https:// URLs are supported.`,
        );
      }
    } catch (err) {
      if (err instanceof ConfigError) throw err;
      throw new ConfigError(`Invalid URL for remote "${name}": "${url}". Must be a valid URL.`);
    }
  }
}
