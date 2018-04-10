// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  audioStorageStorageURL: "https://firebasestorage.googleapis.com/v0/b/fq-server-capstone.appspot.com/o/samples",
  uploadsStorageURL: "http://localhost:3000/music",
  firebase: {
    apiKey: "AIzaSyDg_lKU3tDABcZv1_F-MfrUlrbhbw3Pvkc",
    authDomain: "fq-server-capstone.firebaseapp.com",
    databaseURL: "https://fq-server-capstone.firebaseio.com",
    projectId: "fq-server-capstone",
    storageBucket: "fq-server-capstone.appspot.com",
    messagingSenderId: "956652339816"
  }
};
