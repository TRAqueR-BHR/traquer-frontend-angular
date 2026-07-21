import { enableProdMode, provideZoneChangeDetection } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import Aura from '@primeuix/themes/aura';

import { providePrimeNG } from 'primeng/config';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

// `applicationProviders` are forwarded into ApplicationConfig.providers when the
// platform bootstraps an NgModule. providePrimeNG takes the place of PrimeNG 13's
// `primeng/resources/themes/*.css` file AND the old `PrimeNGConfig` runtime service.
// Aura is the same theme family the prior saga-blue palette is derived from.
platformBrowserDynamic().bootstrapModule(AppModule, {
  applicationProviders: [
    provideZoneChangeDetection(),
    providePrimeNG({ theme: { preset: Aura } }),
  ],
}).catch(err => console.error(err));
