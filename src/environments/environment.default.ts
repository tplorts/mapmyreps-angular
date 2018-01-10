// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment: any = {
  production: false,
  version: '(dev)',
  serverUrl: 'https://usa-government-info-backend.herokuapp.com/api',
  // staticDataUrl: 'http://data.mapmyreps.us',
  staticDataUrl: 'http://mapmyreps-data.s3-website-us-east-1.amazonaws.com',
  congressDataDirectory: 'congress',
  geographyDataDirectory: 'geography',
  defaultLanguage: 'en-US',
  supportedLanguages: [
    'en-US',
    // 'es',
  ]
};
