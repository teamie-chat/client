# Teamie Chat

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

- To start the development server, do:

  ```
  gulp
  ```

  Now, navigate to `http://localhost:12044/src/demo/` in your browser to preview.

- To build a new release, do:

  ```
  gulp build
  ```

  Now, navigate to `http://localhost:12045/release/demo/` in your browser to preview.
