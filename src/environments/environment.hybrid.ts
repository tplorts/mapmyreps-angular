// The Hybrid environment is just like the development environment, but uses the production backend.
// Not a problem for now since this app only reads from the backend.

export const environment = {
  production: false,
  version: '(dev)',
  serverUrl: 'https://usa-government-info-backend.herokuapp.com/api',
  defaultLanguage: 'en-US',
  supportedLanguages: [
    'en-US',
    'fr-FR'
  ]
};
