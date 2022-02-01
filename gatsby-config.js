module.exports = {
  plugins: [
    `gatsby-plugin-material-ui`,
    {
      resolve: `gatsby-plugin-react-redux`,
      options: { 
        pathToCreateStoreModule: "./src/state/createStore",
        // [optional] - options passed to `serialize-javascript`
        // info: https://github.com/yahoo/serialize-javascript#options
        // will be merged with these defaults:
        serialize: {
          space: 0,
          // if `isJSON` is set to `false`, `eval` is used to deserialize redux state,
          // otherwise `JSON.parse` is used
          isJSON: true,
          unsafe: false,
          ignoreFunction: true,
        },
        // [optional] - if true will clean up after itself on the client, default:
        cleanupOnClient: true,
        // [optional] - name of key on `window` where serialized state will be stored, default:
        windowKey: "__PRELOADED_STATE__",
      },
    },
    {
      resolve: "gatsby-plugin-firebase",
      options: {
        credentials: {
          apiKey: "AIzaSyC2cuV8yTDY_KLWSF6DY7crPTWnlUrQw9U",
          authDomain: "football-dashboard-488e1.firebaseapp.com",
          projectId: "football-dashboard-488e1",
          storageBucket: "football-dashboard-488e1.appspot.com",
          messagingSenderId: "321068336527",
          appId: "1:321068336527:web:7eb3ea81261fd6091637fa",
          measurementId: "G-54JD715SLD",
        },
      },
    },
  ],
};
