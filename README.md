# OCKGpsTracker

#### iOS

1. `npm install`
2. `cordova platform add ios`
3. `ionic build ios --prod`
4. Connect your iOS device and run the application, either by
  1. Opening up the relevant `.xcodeproj` on `Xcode` and clicking the run button (making sure your device is selected)
  2. Running `ionic run ios --device` on your CLI - this requires that the npm package `ios-deploy` is installed globally (`npm install -g ios-deploy`)

### Android

1. `npm install`
2. `cordova platform add android`
3. `ionic build android --prod`
4. Connect your Android device and run the application with `ionic run android` (make sure USB debugging is enabled on your device)