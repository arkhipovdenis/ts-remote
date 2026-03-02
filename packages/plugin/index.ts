import ts from 'typescript';
import { TsRemotePlugin } from './plugin';

/**
 * TypeScript Language Service Plugin factory.
 *
 * Called by the TypeScript server when the plugin is loaded.
 * Configured via `compilerOptions.plugins` in `tsconfig.json`:
 *
 * ```json
 * {
 *   "compilerOptions": {
 *     "plugins": [{
 *       "name": "ts-remote",
 *       "remotes": {
 *         "my-app": "https://cdn.example.com/types.d.ts"
 *       }
 *     }]
 *   }
 * }
 * ```
 */
function init(modules: { typescript: typeof ts }) {
  const tsModule = modules.typescript;

  function create(info: ts.server.PluginCreateInfo): ts.LanguageService {
    const plugin = new TsRemotePlugin(tsModule, info);
    return plugin.decorate(info.languageService);
  }

  function getExternalFiles(project: ts.server.Project): string[] {
    return TsRemotePlugin.getExternalFilesForProject(project);
  }

  return { create, getExternalFiles };
}

export = init;
