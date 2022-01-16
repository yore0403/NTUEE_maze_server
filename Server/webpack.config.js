module.exports = {
  entry: "./app.js",

  output: {
    path: './',
    filename: "build.js"
  },
    resolve: {
        fallback: {
            "fs": false
        },
    }
    target:'node' // NOTE 要加這個 
}