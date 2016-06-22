/*************************
 *  Why this demo app?
 *  To Explain how easy some of the "hard" parts of building an app can be combining
 *  the simplicity of Tabris.js with Backendless
 *
 *  1. User Management - Register, Login, Persist session, Personal data, Social login (TODO)
 *  2. Data CRUD - Create, Read, Update, Delete assets.
 *  3. File management - Upload images taken on the device. Scale on Server (TODO).
 *  4. Realtime communication between clients via Pubsub
 *  5. Push notifications? (TODO)
 * *
 *  Note: while this app conveys some security rules - for instance only you can delete your posts (not other users),
 *  You also have to enforce security permissions in Backendless
 *
 */
import MainPage from './pages/MainPage';
new MainPage().open();

