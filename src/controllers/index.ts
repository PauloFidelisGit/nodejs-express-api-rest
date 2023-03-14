// @index(['./*','!./*test.ts'], f => `export * as ${f.name} from '${f.path}';`)
export * as admin from './admin';
export * as shared from './shared';
export * as user from './user';
// @endindex
