// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  audioStorageStorageURL: "https://firebasestorage.googleapis.com/v0/b/fq-server-capstone.appspot.com/o/samples",
  uploadsStorageURL: "http://localhost:3000/music",
  firebase: {
    apiKey: "AIzaSyAc3-o0GAVMoCsyfgH_gQ1-nvsiy4SUsRI",
    authDomain: "fa-16a3c.firebaseapp.com",
    databaseURL: "https://fa-16a3c.firebaseio.com",
    projectId: "fa-16a3c",
    storageBucket: "",
    messagingSenderId: "357804882774"
  }

};
