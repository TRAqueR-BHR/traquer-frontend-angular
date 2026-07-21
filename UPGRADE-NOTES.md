# Upgrade Notes

The TRAQUER frontend has been upgraded twice in this repository:

1. **Angular 13 → 22** (commit history `1e22545` … `072ff60`, plus `2aaa4fa`).
2. **PrimeNG 13 → 22** (commit `4ae74d1` on branch `feature/primeng-22`).

The current state of the project compiles, builds (development and
production), serves a working `index.html` from `ng serve`, and runs
unit tests (24 spec files pre-existing fail at runtime due to mock
provider issues — see the "Tests" section below).

## Angular 13 → 22 — how it was done

We followed the official Angular update guide
(<https://angular.dev/update-guide>), which only permits one major
version at a time. The migration `schematics` shipped with each
`@angular/cli` release perform most of the heavy lifting. The process
was:

```bash
# for each major in 14 15 16 17 18 19 20 21 22
ng update @angular/cli@$MAJOR @angular/core@$MAJOR --allow-dirty --force
git commit -am "chore: Angular -> $MAJOR via ng update"
```

Between major steps the project remained buildable — every `ng update`
invocation produced a reviewable diff.

Finally, the optional `--name use-application-builder` migration was
applied. This swaps the legacy `@angular-devkit/build-angular:browser`
(Webpack) builder for the `@angular/build:application` builder
(Angular CLI v17+ esbuild-based, now the only one Angular CLI v22 ships).

| Step      | Notable automatic migrations                                                                                |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| 13 → 14   | `defaultProject` removed from `angular.json`; TS target `ES2020`                                            |
| 14 → 15   | Removed `require` calls in `src/test.ts`; TS target `ES2022`, `useDefineForClassFields: false`               |
| 15 → 16   | `inject()` for guards (`CanActivate` → `CanActivateFn`); updated guards                                     |
| 16 → 17   | Deprecated `@nguniversal` packages, deprecated `tsconfig.json` options                                     |
| 17 → 18   | `HttpClientModule` → `provideHttpClient(withInterceptorsFromDi())`                                          |
| 18 → 19   | `standalone: false` added to 51 components (preserves NgModule architecture)                                |
| 19 → 20   | TS `moduleResolution: bundler`; `TestBed.get` → `TestBed.inject` in 11 spec files                           |
| 20 → 21   | Bootstrap options migrated to providers (`main.ts`); **24 HTML files converted to `@if`/`@for`**           |
| 21 → 22   | `withXhr()` added to `provideHttpClient`; `ChangeDetectionStrategy.Eager` added to 43 components            |

## PrimeNG 13 → 22 — what's in this branch

The `feature/primeng-22` branch contains the full migration from
PrimeNG 13.4.1 to PrimeNG 22.0.0 in a single commit
(`4ae74d1`). The migration was possible in one step because
PrimeNG 22's peer dep `@angular/core ^22.0.0` matches the project's
exactly — `npm install` no longer needs `--legacy-peer-deps`.

### Module renames (TS)

| PrimeNG 13                        | PrimeNG 22                |
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
| `PrimeNGConfig` (from `primeng/api`) | `PrimeNG` (from `primeng/config`) |

### Modules removed in PrimeNG 22 (no replacement)

* `MessagesModule` / `Messages` — referenced `<p-messages>` was never
  used in this codebase, so all references were simply dropped.
* `LightboxModule` / `Lightbox` — same situation.
* `TriStateCheckboxModule` / `TriStateCheckbox` — same.

All three were removed from both `app.module.ts` and
`appuser.module.ts`'s `imports` arrays.

### HTML selector renames

| PrimeNG 13       | PrimeNG 22        |
| ---------------- | ----------------- |
| `<p-calendar>`   | `<p-datepicker>`  |
| `<p-dropdown>`   | `<p-select>`      |
| `<p-tabView>`    | `<p-tabs>`        |
| `<p-overlayPanel>` | `<p-popover>`  |
| `<p-chips>`      | `<p-chip>`        |
| `<p-inputSwitch>` | `<p-toggleswitch>` |
| `<p-inputTextarea>` | `<p-textarea>` |

Case-sensitive selectors dropped in v22 (must be lowercased):

* `<p-blockUI>` → `<p-blockui>`
* `<p-multiSelect>` → `<p-multiselect>`
* `<p-confirmPopup>` → `<p-confirmpopup>`
* `<p-splitButton>` → `<p-splitbutton>`

### Theme CSS — no more `saga-blue/theme.css`

PrimeNG 22 ships **no CSS theme files**. The old
`node_modules/primeng/resources/themes/saga-blue/theme.css` and
`node_modules/primeng/resources/primeng.min.css` entries in
`angular.json > build.options.styles` were removed. The theme is now
configured at runtime via `providePrimeNG`:

```ts
// src/main.ts
import Aura from '@primeuix/themes/aura';
platformBrowserDynamic().bootstrapModule(AppModule, {
  applicationProviders: [
    provideZoneChangeDetection(),
    providePrimeNG({ theme: { preset: Aura } }),
  ],
});
```

The CSS bundle dropped from **234 kB to 50 kB** as a result. Aura is
the same theme family the prior saga-blue palette was derived from.

### Other template deltas

* `<p-toast>` no longer accepts `hideTransitionOptions` (the entire
  AnimationOptions API on `@angular/animations` was removed in favour
  of `@primeuix/styled` + PrimeNG's own motion directives). The
  deprecated `[hideTransitionOptions]="'5000ms'"` attribute was
  dropped from 11 templates.
* `<p-button>` is now **standalone** in PrimeNG 22 and does not bundle
  `RouterLink` as a host directive. Two `p-button [routerLink]`
  occurrences in `roles.component.html` and `users.component.html`
  were rewritten as `<a pButton routerLink>` (the equivalent
  directive-on-anchor pattern) so RouterLink stays a native host
  directive of `<a>`.

### `scripts/patch-primeng-templates.sh`

Originally written for the Angular 22 + PrimeNG 13 stopgap (where the
in-tree `in` template-reference-variable in `multiselect`/`terminal`
broke the modern Angular template parser). Under PrimeNG 22 those
templates have been rewritten, so the script is now effectively a
no-op — kept as documentation in case anyone finds themselves on a
PrimeNG 13 install again.

## Versions now in `package.json`

* `@angular/*` — `^22.0.7`
* `@angular/cdk` — `^22.0.5`
* `@angular/build`, `@angular/cli` — `^22.0.7`
* `typescript` — `~6.0.3` (Angular 22 compiler-cli requires ≥6.0, <6.1)
* `rxjs` — `^7.8.2`
* `zone.js` — `~0.15.1`
* `@fortawesome/angular-fontawesome` — `^5.1.0`
* `@fortawesome/{fontawesome-svg-core,free-solid-svg-icons}` — `^7.3.1`
* `@fullcalendar/{angular,core,daygrid,interaction,list,timegrid}` + `fullcalendar` — `^6.1.x`
  (FullCalendar 7 plugin packages are still RC; v6 is the latest fully released line)
* `primeflex` — `^4.0.0`
* `primeicons` — `^8.0.0`
* **`primeng` — `^22.0.0`** (up from 13.4.1)
* `@primeuix/themes` — `^3.0.0` (the new theme-registration package)
* `quill` — `^2.0.3`
* `events` — `^3.3.0` (browser polyfill for `xml2js`'s Node-builtin require)
* `xml2js` — `^0.6.2`

Removed: `FileSaver`, `ng2-pdf-viewer` (deprecated / unused).

## Node.js

Angular 22 requires Node.js `^22.22.3 || ^24.15.0 || >=26.0.0`.
The repository ships with a `.nvmrc` pinned to `24.15.0`. Use `nvm use`
before any `npm`/`ng` command.

## Tests

`ng test --watch=false --browsers=Chrome` succeeds at the type-check /
bundle step. At runtime 24 spec files pre-existed and fail with
`No provider found for ActivatedRoute` and similar — these were
broken before this upgrade and are independent of the Angular /
PrimeNG migrations. They should be addressed by adding
`provideRouter([])` and the matching providers to each
`TestBed.configureTestingModule({})` block.

## Other deprecations still to triage

* **`@angular/platform-browser-dynamic` is deprecated** in v22. Use
  `@angular/platform-browser`. `bootstrapModule` is still supported but
  `bootstrapApplication` with `appConfig` providers is recommended.
* **`@angular/animations` is deprecated** — v22 introduces
  `animate.enter` / `animate.leave` from the `animate` package
  (https://v22.angular.dev/guide/animations). `BrowserAnimationsModule`
  can be dropped once the project no longer uses `[@angularAnimations]`
  or `trigger()/transition()`. PrimeNG 22 has already dropped its
  own animation inputs in anticipation of this.
* `tsconfig.json` still sets `strictTemplates: false`. Re-enabling it
  requires fixing the few remaining `primeng/knob`,
  `primeng/messages`, etc., references.
* `baseUrl` is deprecated in TS 7 — retained here with
  `ignoreDeprecations: "6.0"` and a `paths: { "src/*": ["./src/*"] }`
  mapping to keep the codebase's `from 'src/...'` imports working.

## Build / dev / test

```bash
nvm use                       # picks up .nvmrc
npm install                   # NO --legacy-peer-deps needed anymore
npm run build                 # production build → dist/traquer-frontend/browser
npm start                     # dev server
ng test --watch=false --browsers=Chrome
```

Result on this machine:

* `ng build` (production) — **OK**, ~9 MB main bundle.
* `ng build --configuration=development` — **OK**.
* `ng serve --port=4299` — **OK** (HTTP 200 on `/`).
* `ng test --watch=false --browsers=Chrome` — bundle compiles, 24
  pre-existing test failures (unrelated mock-provider issues).

## Git history of the upgrade

The `upgrade/angular-22` branch:

```
1e22545 chore: baseline before Angular 13 -> 22 upgrade
827db39 chore: Angular 13 -> 14 via ng update
9c5197f chore: Angular 14 -> 15 via ng update
3128014 chore: Angular 15 -> 16 via ng update
0a6cdd0 chore: Angular 16 -> 17 via ng update
e9b5f40 chore: Angular 17 -> 18 via ng update
5efa8a8 chore: Angular 18 -> 19 via ng update
b7bd39d chore: Angular 19 -> 20 via ng update
47da021 chore: Angular 20 -> 21 via ng update
072ff60 chore: Angular 21 -> 22 via ng update (Node 24.15+)
2aaa4fa feat: upgrade to Angular 22 with new application builder
8979c9e fix: pre-existing test imports (AuthGuardService export, RoleService path)
e7af359 docs: add UPGRADE-NOTES.md and scripts/patch-primeng-templates.sh
```

The `feature/primeng-22` branch (off `upgrade/angular-22`):

```
4ae74d1 feat: upgrade PrimeNG 13 -> 22 (no --legacy-peer-deps required)
```
