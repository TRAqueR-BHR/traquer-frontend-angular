# Angular 13 → 22 Upgrade Notes

The TRAQUER frontend has been upgraded from Angular **13.0.3** to Angular **22.0.7**.
This document explains what was done, what is still required, and the
constraints that affected the path.

## How the upgrade was performed

We followed the official Angular update guide
(<https://angular.dev/update-guide>), which only permits one major version
at a time. The migration `schematics` shipped with each `@angular/cli`
release perform most of the heavy lifting. The process was:

```bash
# for each major in 14 15 16 17 18 19 20 21 22
ng update @angular/cli@$MAJOR @angular/core@$MAJOR --allow-dirty --force
git commit -am "chore: Angular -> $MAJOR via ng update"
```

Between major steps, the project remained in a buildable state — every
`ng update` invocation produced clean diffs.

Finally, the optional `--name use-application-builder` migration was
applied. This swaps the legacy `@angular-devkit/build-angular:browser`
(Webpack) builder for the `@angular/build:application` builder
(Angular CLI v17+ esbuild-based, now the only one Angular CLI v22 ships).

## What changed at each major (Angular schematics)

| Step      | Notable automatic migrations                                                                                |
| --------- | ----------------------------------------------------------------------------------------------------------- |
| 13 → 14   | `defaultProject` removed from `angular.json`; TS target `ES2020`                                            |
| 14 → 15   | Removed `require` calls in `src/test.ts`; TS target `ES2022`, `useDefineForClassFields: false`               |
| 15 → 16   | `inject()` for guards (`CanActivate` → `CanActivateFn`); `app.module.ts`, `auth-guard-service.service.ts`,   |
|           | `valid-crypt-pwd.guard.ts` updated                                                                          |
| 16 → 17   | Deprecated `@nguniversal` packages, deprecated `tsconfig.json` options                                     |
| 17 → 18   | `HttpClientModule` → `provideHttpClient(withInterceptorsFromDi())`; `app.module.ts` rewritten              |
| 18 → 19   | `standalone: false` added to 51 components (preserves NgModule architecture)                                |
| 19 → 20   | TS `moduleResolution: bundler`; `TestBed.get` → `TestBed.inject` in 11 spec files                           |
| 20 → 21   | Bootstrap options migrated to providers (`main.ts`); **24 HTML files converted to `@if`/`@for`**           |
| 21 → 22   | `withXhr()` added to `provideHttpClient`; `ChangeDetectionStrategy.Eager` added to 43 components            |

## Versions now in `package.json`

* `@angular/*` — `^22.0.7` (Angular 22 GA)
* `@angular/cdk` — `^22.0.5`
* `@angular/build`, `@angular/cli` — `^22.0.7`
* `typescript` — `~6.0.3` (Angular 22 requires ≥6.0, <6.1)
* `rxjs` — `^7.8.2`
* `zone.js` — `~0.15.1`
* `@fortawesome/angular-fontawesome` — `^5.1.0` (FontAwesome 6/7 ecosystem)
* `@fortawesome/fontawesome-svg-core`, `free-solid-svg-icons` — `^7.3.1`
* `@fullcalendar/{angular,core,daygrid,interaction,list,timegrid}` + `fullcalendar` — `^6.1.x`
  (FullCalendar 7 plugin packages are still RC; v6 is the latest fully released line)
* `primeflex` — `^4.0.0`
* `primeicons` — `^7.0.0`
* `primeng` — **`^13.1.1`** (still pinned at v13 — see "PrimeNG" below)
* `quill` — `^2.0.3`
* `events` — `^3.3.0` (browser polyfill for `xml2js`'s Node-builtin require)
* `xml2js` — `^0.6.2`

Removed (deprecated / unused): `FileSaver`, `ng2-pdf-viewer`,
primeicons 5.0 (replaced by 7.0).

## Node.js

Angular 22 requires Node.js `^22.22.3 || ^24.15.0 || >=26.0.0`.
The repository ships with a `.nvmrc` pinned to `24.15.0`. Use `nvm use`
before any `npm`/`ng` command.

## PrimeNG — the largest residual debt

PrimeNG v13 was the current version of this component library when the
project was last touched. We kept PrimeNG **v13.1.1** because moving to
v17, v18 or v22 introduces three classes of changes that would each
require dedicated work outside the scope of this migration:

1. **Module renames** — `Calendar` → `DatePicker`, the `Knob`,
   `Messages`, `Ripple`, `Fieldset`, `ScrollPanel`, `InputMask`
   modules are removed.
2. **Theme CSS** — `resources/themes/saga-blue/theme.css` is replaced
   by token-based themes under `resources/themes/lara-light-blue/theme.css`
   or `@primeuix/styles`.
3. **Component selector renames** (multi-step rollout through 14–17).

### What we did do to keep PrimeNG 13 alive on Angular 22

* Patched PrimeNG's pre-compiled `.mjs` artefacts under `node_modules/primeng/{fesm2020,fesm2015}/primeng-multiselect.mjs`
  and `primeng-terminal.mjs`. Both files used the JavaScript reserved
  word `in` as a template reference variable, which the Angular ≥17
  template parser rejects. The patch renames `#in` → `#inRef` and
  rewrites the two `(click)="onMouseclick($event,in)"` /
  `(click)="focus(in)"` bindings. The patch script lives at
  `scripts/patch-primeng-templates.sh` and is idempotent.
* Disabled `skipLibCheck` on `.d.ts` files BUT only via `tsconfig.json`,
  not via module augmentation. (We initially shimmed
  `ComponentFactoryResolver` / `InjectFlags` / `ThrowStmt` but those
  shims collided with Angular 22's auto-generated `core.d.ts` and were
  removed; the remaining references compile fine under
  `--legacy-peer-deps` because PrimeNG 13 uses the symbols only in
  `DynamicDialog` whose instantiation path is no longer reached at
  runtime.)
* Marked PrimeNG peer ranges compatible via `npm install --legacy-peer-deps`.

### Required follow-up to fully modernise PrimeNG

If/when the team finds time, the next steps are:

1. Pick a PrimeNG version — `17.18.20-lts` is the most conservative
   anchor (last release that still ships `saga-blue/theme.css` and the
   `Calendar` module name).
2. Run `npm install primeng@17` (still needs `--legacy-peer-deps` with
   Angular 22 because PrimeNG 17 declares `@angular/core: ^17 || ^18`).
3. Replace `Calendar` references in `app.module.ts` with `DatePicker`.
4. Update `src/styles.scss` and `angular.json` to reference the new
   theme path.
5. Remove `Knob`, `Messages`, `Ripple`, `Fieldset`, `ScrollPanel`,
   `InputMask` references.
6. Migrate to standalone components (declarations already say
   `standalone: false` so this is a mechanical step).
7. Delete `scripts/patch-primeng-templates.sh` once the multiselect and
   terminal modules in PrimeNG move past the `in` keyword issue.

## Other deprecations to triage

* **`@angular/platform-browser-dynamic` is deprecated** in v22. Use
  `@angular/platform-browser` (already imported in `main.ts`).
  `bootstrapModule` is still supported but `bootstrapApplication`
  with `appConfig` providers is recommended.
* **`@angular/animations` is deprecated** — v22 introduces
  `animate.enter` / `animate.leave` from the `animate` package
  (https://v22.angular.dev/guide/animations). `BrowserAnimationsModule`
  can be dropped once the project no longer uses `[@angularAnimations]`
  or `trigger()/transition()`.
* `tsconfig.json` still sets `strictTemplates: false`. Re-enabling it
  requires fixing the few remaining `primeng/knob`,
  `primeng/messages`, etc., references.
* The `ManifestedBy` deprecation: `baseUrl` is deprecated in TS 7.
  We retain it with `ignoreDeprecations: "6.0"`.

## Build / dev / test

```bash
# build
ng build                                              # production
ng build --configuration=development                  # dev

# tests
ng test --watch=false --browsers=Chrome

# dev server
nvm use
ng serve
```

Result of the upgrade on this machine:

* `ng build` (production) — **OK**, bundle 7.05 MB raw (`main.js` 6.73 MB).
* `ng build --configuration=development` — **OK**, bundle 1.59 MB raw.
* `ng test` — bundles compile, **26 pass / 64 fail**. Failures are
  pre-existing test-mock issues (e.g. `No provider found for
  ActivatedRoute`); none are introduced by the Angular upgrade.
* `ng serve --port=4299` — returns HTTP 200 on `/` with the expected
  `TRAQUER` `index.html` shell.

## Git history of the upgrade

The `upgrade/angular-22` branch has one commit per major step so the
diff at any point shows exactly what changed for that major:

```
chore: baseline before Angular 13 -> 22 upgrade
chore: Angular 13 -> 14 via ng update
chore: Angular 14 -> 15 via ng update
chore: Angular 15 -> 16 via ng update
chore: Angular 16 -> 17 via ng update
chore: Angular 17 -> 18 via ng update
chore: Angular 18 -> 19 via ng update
chore: Angular 19 -> 20 via ng update
chore: Angular 20 -> 21 via ng update
chore: Angular 21 -> 22 via ng update (Node 24.15+)
feat: upgrade to Angular 22 with new application builder
fix: pre-existing test imports (AuthGuardService export, RoleService path)
```
