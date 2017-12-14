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
  abbreviation: string;
  name: string;
  type: string;
}
