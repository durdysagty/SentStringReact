import React, { Suspense } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'
import './i18n'
import Loading from './Loading'

/*var methods = ["log", "debug", "warn", "info"];
for (var i = 0; i < methods.length; i++) {
  console[methods[i]] = function () { };
}*/

ReactDOM.render(
  <React.StrictMode>
    <Suspense fallback={<Loading />}>
      <App />
    </Suspense>
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorker.unregister();
