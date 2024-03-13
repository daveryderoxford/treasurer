import { environment } from '../environments/environment';

const firebaseProdConfig = {
   "projectId": "treasurer-334d9",
   "appId": "1:461603429978:web:6f3fe5e3c8c8dfc1290263",
   "storageBucket": "treasurer-334d9.appspot.com",
   // Note it is Ok to expose Firebase API key here. Firebase API keys are 
   // only used to route requests and are not a security risk
   // see https://firebase.google.com/docs/projects/api-keys
   "apiKey": "AIzaSyDIO2Em8dTwaLVkIcjUw-sln_SmMSE3eQI",
   "authDomain": "treasurer-334d9.firebaseapp.com",
   "messagingSenderId": "461603429978", "measurementId": "G-41G7J2Q961"
};

const firebaseDevelpomentConfig = {
   projectId: "treasurer-development",
   appId: "1:1038440410822:web:1e8278eebf681d295871c7",
   apiKey: "AIzaSyCBvLAuw3rZa4kBE6WzG9b0GOanvqiYuzg",
   authDomain: "treasurer-development.firebaseapp.com",
   storageBucket: "treasurer-development.appspot.com",
   messagingSenderId: "1038440410822",
};

export const firebaseConfig = (environment.production) ? firebaseProdConfig : firebaseDevelpomentConfig;
