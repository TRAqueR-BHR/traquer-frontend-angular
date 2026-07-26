# Upgrade Notes

Current target: **Angular 21.2.18 + PrimeNG 21.1.9**.

The project was initially migrated all the way to Angular/PrimeNG 22, but was
then intentionally downgraded to v21 because PrimeNG 22 shows a PrimeUI license
banner without a PrimeUI license key. PrimeNG 21 does **not** show that banner.

## Current versions

* `@angular/*` — `^21.2.18`
* `@angular/cdk` — `^21.2.14`
* `@angular/build`, `@angular/cli` — `^21.2.18`
* `typescript` — `~5.9.3` (Angular build 21 requires `>=5.9 <6.0`)
* `rxjs` — `^7.8.2`
* `zone.js` — `~0.15.1`
* `@fortawesome/angular-fontawesome` — `^4.0.0` (Angular 21 peer range)
* `@fortawesome/{fontawesome-svg-core,free-solid-svg-icons}` — `^7.3.1`
* `@fullcalendar/*` + `fullcalendar` — `^6.1.x`
* `primeflex` — `^4.0.0`
* `primeicons` — `^8.0.0`
* `primeng` — `^21.1.9`
* `@primeuix/themes` — `^2.0.3`
* `quill` — `^2.0.3`
* `events` — `^3.3.0`
* `xml2js` — `^0.6.2`

## Why v21 instead of v22?

PrimeNG 22 introduced PrimeUI license verification and displays an
"Invalid PrimeUI License" badge when no license is configured. To keep TRAQUER
on the open/no-banner line, the frontend is pinned to Angular 21 + PrimeNG 21.

## Angular upgrade path used

The Angular upgrade was performed one major at a time following the official
Angular update guide (<https://angular.dev/update-guide>):

```bash
# for each major in 14 15 16 17 18 19 20 21
ng update @angular/cli@$MAJOR @angular/core@$MAJOR --allow-dirty --force
git commit -am "chore: Angular -> $MAJOR via ng update"
```

The temporary 21 → 22 step was later reverted/downgraded for licensing reasons.
Two Angular 22-only changes had to be removed for Angular 21:

* `provideHttpClient(withXhr(), withInterceptorsFromDi())` →
  `provideHttpClient(withInterceptorsFromDi())`
* `ignoreDeprecations: "6.0"` removed from `tsconfig.json` because the project
  is back on TypeScript 5.9.

## PrimeNG 13 → 21 migration notes

The PrimeNG migration keeps most of the v22 compatibility work because PrimeNG
21 already uses the modern package names and runtime theme system.

### Module/package renames kept

| PrimeNG 13                        | PrimeNG 21                |
| --------------------------------- | ------------------------- |
| `primeng/calendar`                | `primeng/datepicker`      |
| `primeng/chips`                   | `primeng/chip`            |
| `primeng/dropdown`                | `primeng/select`          |
| `primeng/inputswitch`             | `primeng/toggleswitch`    |
| `primeng/inputtextarea`           | `primeng/textarea`        |
| `primeng/overlaypanel`            | `primeng/popover`         |
| `primeng/tabview`                 | `primeng/tabs`            |
| `CalendarModule`                  | `DatePickerModule`        |
| `DropdownModule`                  | `SelectModule`            |
| `OverlayPanelModule`              | `PopoverModule`           |
| `InputTextareaModule`             | `TextareaModule`          |
| `InputSwitchModule`               | `ToggleSwitchModule`      |
| `ChipsModule`                     | `ChipModule`              |
| `TabViewModule`                   | `TabsModule`              |
| `PrimeNGConfig` (`primeng/api`)   | `PrimeNG` (`primeng/config`) |

`SidebarModule` was removed from `AppuserModule`; no `<p-sidebar>` usage exists
in templates, and PrimeNG 21 no longer exports `primeng/sidebar`.

### Template selector changes kept

| PrimeNG 13        | PrimeNG 21         |
| ----------------- | ------------------ |
| `<p-calendar>`    | `<p-datepicker>`   |
| `<p-dropdown>`    | `<p-select>`       |
| `<p-tabView>`     | `<p-tabs>`         |
| `<p-overlayPanel>`| `<p-popover>`      |
| `<p-chips>`       | `<p-chip>`         |
| `<p-inputSwitch>` | `<p-toggleswitch>` |
| `<p-inputTextarea>` | `<p-textarea>`   |

Case-sensitive selectors were also lowercased:

* `<p-blockUI>` → `<p-blockui>`
* `<p-multiSelect>` → `<p-multiselect>`
* `<p-confirmPopup>` → `<p-confirmpopup>`
* `<p-splitButton>` → `<p-splitbutton>`

### Theme and styles

PrimeNG 21 uses runtime theme presets instead of the old
`primeng/resources/themes/saga-blue/theme.css` files:

```ts
import Aura from '@primeuix/themes/aura';
import { providePrimeNG } from 'primeng/config';

platformBrowserDynamic().bootstrapModule(AppModule, {
  applicationProviders: [
    provideZoneChangeDetection(),
    providePrimeNG({ theme: { preset: Aura } }),
  ],
});
```

`primeflex/primeflex.css` must remain in `angular.json`; the TRAQUER templates
use many utility classes (`flex`, `hidden`, `surface-section`, `text-900`, etc.).
Without it, the login page and many grids look unstyled.

### Button directive migration

PrimeNG 21/22 `[pButton]` no longer renders old PrimeNG 13 `label="..."` and
`icon="..."` attributes on native `<button pButton>` elements. All such usages
were converted to host content:

```html
<button pButton>
  <span class="pi pi-user" pButtonIcon></span>
  <span pButtonLabel>S'identifier</span>
</button>
```

## Node.js

The repo keeps `.nvmrc` at Node **24.15.0**, which is compatible with Angular 21.
Use:

```bash
nvm use
npm install
```

No `--legacy-peer-deps` is required for the Angular 21 + PrimeNG 21 dependency
set.

## Build / serve / test

```bash
npm install
npm run build
ng build --configuration=development
npm start
ng test --watch=false --browsers=Chrome
```

Verified on this machine after the downgrade:

* `ng build --configuration=development` — **OK**
* `ng build` production — **OK**
* `ng serve --host ::1 --port 4200 --poll 2000` — **OK**
* Headless screenshot of `/` — login page styled correctly and **no PrimeUI
  license badge**

Unit tests compile/run but several specs still have pre-existing runtime mock
provider failures (for example missing `ActivatedRoute` providers). Those are
separate from the Angular/PrimeNG version downgrade.
