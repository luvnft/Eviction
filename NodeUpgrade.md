### Upgrade Errors and Resolutions

```
npm outdated
npm update
npx npm-check-updates -u
```

#### could not resolve dependency: npm err! peer react@"^16.0.0 || ^17.0.0" from...

- `npm install [package name] --legacy-peer-deps`

#### DB Connection ERROR: MongoParseError: option useFindAndModify is not supported

- REMOVE: useFindAndModify from mongoose connect object on server.js

#### upgrade render method for React v18

- In client/src/index.js
- REMOVE: import ReactDOM from 'react-dom'
- ADD: import { createRoot } from 'react-dom/client
- const root = createRoot(document.getElementById('root'))
- root.render(Your application component(s))

#### export 'Switch' (imported as 'Switch') was not found in 'react-router-dom'

- Replaced `Switch` with `Routes`

#### export 'Loader' (imported as 'Loader') was not found in 'react-loader-spinner'

- Replaced `Loader` with `Grid` or `ThreeDots`

#### export 'Map' (imported as 'LeafletMap') was not found in 'react-leaflet'

- Import is now MapContainer and not Map
