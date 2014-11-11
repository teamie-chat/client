# Teamie Chat

[Demo](http://teamie-chat.github.io/client/release/demo/)

## Contribute

>You need to have `node` and `npm` installed.

### Development Environment

```
npm install -g bower
git clone git@github.com:teamie-chat/client.git && cd client/
bower install
npm install
```

### Workflow

>We use the [Gulp](http://gulpjs.com/) build tool.

- To start the development environment, do:

  ```
  gulp
  ```

  It starts a development web server with livereload support. Runs `jshint` and `jscs` on your source every time you save a file in `src/`.

- To just start the development web server, do:

  ```
  gulp serve
  ```

- To build a new release, do:

  ```
  gulp build
  ```

- You can access the release version of the Demo from [here](http://localhost:12044/release/demo/index.html) and the development version from [here](http://localhost:12044/src/demo/index.html).