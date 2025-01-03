// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  prefillLoginForm: true,
  displayProcessesInfo: true,
  debugBlockUnblockUI:true,
  apiURL: "http://localhost:8093/api",
  apiURLForFiles: "http://localhost:8093/api",
  numberOfSecondsBetweenRefreshOfMessages: 120,
  numberOfSecondsBetweenChecksOfVersion: 120,
  numberOfSecondsBetweenCheckIfAnyPendingTask: 30,
  numberOfSecondsBetweenExecutionOfPendingTasks: 30,
  frontEndVersion:"2020-11-11.02",
  jwt_name: "traquer_jwt",
  cryptPwdHttpHeaderKey: "crypt_pwd",
  cryptPwdLocalStorageKey: "traquer_crypt_pwd",
  datetime_format:"dd/MM/yyyy HH:mm",
  date_format:"dd/MM/yyyy",
  defaultNumberOfResults:50,
  numberOfResultsForDeals: 50,
  numberOfResultsForDesigns: 25,
  numberOfResultsForForumMessages: 40,
  numberOfResultsForDashboard:10,
  hideTrademarksModule:true,
  hideSalesReportsModule:false,
  maxFileSizeInMByteForRasterImages:1,
  maxFileSizeInMByteForOtherFiles:1,
  ignoreForceReloadIfDifferentVersionFromDB:false,
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
