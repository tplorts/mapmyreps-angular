// The Hybrid environment is just like the development environment, but uses the production backend.
// Not a problem for now since this app only reads from the backend.
import { environment as defaultEnvironment } from './environment';

export const environment = {
  ...defaultEnvironment,
};
