/*
 * Extra typings definitions
 */

// Allow .json files imports
declare module '*.json';

// SystemJS module definition
declare var module: NodeModule;
interface NodeModule {
  id: string;
}

interface UsaRegion {
  name: string;
  status: string;
  fipsCode: number;
  abbreviation?: string;
}
