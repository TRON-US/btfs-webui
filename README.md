# BTFS Web UI


> Check on your node stats, explore the IPLD powered merkle forest, see peers around the world and manage your files, without needing to touch the CLI.

## Test the WebUI

After making changes to the WebUI repository, the updated changes can be viewed in the browser using the following steps:

Download the repo

```
git clone https://github.com/TRON-US/btfs-webui
```
CD into the btfs-webui repo. Then with `node` >= 8.12 and `npm` >= 6.4.1 installed, run

```
cd btfs-webui
npm install
```

Open a separate terminal and start the BTFS daemon. This will allow you to see the updated WebUI in your localhost:

```
btfs daemon
```

In your previous terminal, run the dev server:

With `node` >= 10 and `npm` >= 6.4.1 installed, run

```sh
> npm install
```
```
Compiled successfully!

You can now view btfs-webui in the browser.

  Local:            http://localhost:3000/
  On Your Network:  http://10.10.0.77:3000/

Note that the development build is not optimized.
To create a production build, use npm run build.

```
Paste the local host URL into your web browser to view the updated WebUI. 

**When working on the code**, run an btfs daemon, the local [dev server](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-start), the [unit tests](https://facebook.github.io/jest/), and the [storybook](https://storybook.js.org/) component viewer and see the results of your changes as you save files.

In separate shells run the following:

```sh
# Run BTFS
> btfs daemon
```

```sh
# Run the dev server @ http://localhost:3000
> npm start
```

```sh
# Run the unit tests in watch mode
> npm run test:unit:watch
```

```sh
# Run the UI component viewer @ http://localhost:9009
> npm run storybook
```

### Configure BTFS API CORS headers

You must configure your BTFS API at http://127.0.0.1:5001 to allow [cross-origin (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) requests from your dev server at http://localhost:3000

Similarly if you want to try out pre-release versions at https://dev.webui.ipfs.io you need to add that as an allowed domain too.

#### Easy mode

Run the **[cors-config.sh](./cors-config.sh)** script with:

```sh
> ./cors-config.sh
```

#### The manual way

```sh
> btfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000", "https://webui.ipfs.io", "http://127.0.0.1:5001"]'
> btfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["POST"]'
```

#### Reverting

To reset your config back to the default configuration, run the following command.

```sh
> btfs config --json API.HTTPHeaders {}
```

You might also like to copy the `~/.btfs/config` file somewhere with a useful name so you can use `btfs config replace <file>` to switch your node between default and dev mode easily.

## Build

To create an optimized static build of the app, output to the `build` directory:

```sh
# Build out the html, css & jss to ./build
> npm run build
```

## Test

The following command will run all tests: unit one for React and E2E against real HTTP API:

```sh
> npm test
```

## Unit tests

To watch source files and re-run the tests when changes are made:

```sh
> npm run test:unit
```

The WebUI uses Jest to run the isolated unit tests. Unit test files are located next to the component they test and have the same file name, but with the extension `.test.js`

## E2E tests

The end-to-end tests (E2E) test the full app in a headless Chromium browser. They spawn real IPFS node for HTTP API and a static HTTP server to serve the app.
The purpose of those tests is not being comprehensible, but act as a quick regression and integration suite.
Test files are located in `test/e2e/`.

Make sure `npm run build` is run before starting E2E tests:

```sh
> npm run build
> npm run test:e2e # end-to-end smoke tests (fast, headless, use go-ipfs)
```

### Customizing E2E Tests

Default behavior can be tweaked via env variables below.

#### `E2E_IPFSD_TYPE`

Variable named `E2E_IPFSD_TYPE` defines which IPFS backend should be used for end-to-end tests.

CI setup of ipfs-webui repo runs tests against both JS and GO implementations:

```sh
> E2E_IPFSD_TYPE=go npm run test:e2e # 'go' is the default if missing
> E2E_IPFSD_TYPE=js npm run test:e2e
```

It is possible to test against arbitrary versions by tweaking `ipfs` (js-ipfs)
 and `go-ipfs-dep` (go-ipfs) in `devDependencies` section of `package.json` and applying the change via `npm i`

#### `E2E_API_URL`

Instead of spawning a disposable node and repo for tests, one can point the E2E test suite at arbitrary HTTP API running on localhost:

```sh
> E2E_API_URL=http://127.0.0.1:5001 npm run test:e2e
```

**Caveat 1:** HTTP API used in tests needs to run on the local machine for Peers screen to pass (they test manual swarm connect to ephemeral `/ip4/120.0.0.1/..` multiaddr)

**Caveat 2:** CORS requests from `http://localhost:3001` (static server hosting dev version of webui) need to be added to `Access-Control-Allow-Origin` whitelist array in node's config:

```json
"API": {
  "HTTPHeaders": {
    "Access-Control-Allow-Methods": ["POST"],
    "Access-Control-Allow-Origin": [
      "http://localhost:5001",
      "http://localhost:3001"
    ]
  }
}
```

Can be done ad-hoc via command line:

```sh
> ipfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3001", "http://127.0.0.1:5001"]'
> ipfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["POST"]'
```

### Debugging E2E tests

#### Show the browser

By default, the test run headless, so you won't see the browser. To debug test errors, it can be helpful to see the robot clicking around the site.
To disable headless mode and see the browser, set the environment variable `DEBUG=true`:

```sh
> DEBUG=true npm run test:e2e # e2e in slowed down mode in a browser window
```

#### Breakpoints

It is possible to set a "breakpoint" via `await jestPuppeteer.debug()` to stop tests at a specific line:

```js
jest.setTimeout(600000) // increase test suite timeout
await jestPuppeteer.debug() // puppeteer will pause here
```

In a **continuous integration** environment we lint the code, run the unit tests, build the app, start an http server and run the unit e2e tests:

```sh
> npm run lint
> npm test
> npm run build
> npm run test:e2e
```

## Coverage

To do a single run of the tests and generate a coverage report, run the following:

```sh
> npm run test:coverage
```

## Lint

Perform [`standard`](https://standardjs.com/) linting on the code:

```sh
> npm run lint
```

## Analyze

To inspect the built bundle for bundled modules and their size, first `build` the app then:

```sh
# Run bundle
> npm run analyze
```

## Translations

The translations are stored on [./public/locales](./public/locales) and the English version is the source of truth. We use Transifex to help us translate WebUI to another languages.

## Releasing

After all changes have been made and tested, follow the steps below to release a new version of the BTFS WebUI:

1. In the terminal, navigate to the `btfs-webui` directory. Then run `npm run build`. This builds the the WebUI files and places them in a newly created `build` folder.   
2. SSH into a bootstrap node. Then upload the `build` folder by running `btfs add build/`, and obtain the hash value.  
3. Update the hash value at:
   - go-btfs https://github.com/TRON-US/go-btfs/blob/master/core/corehttp/webui.go


## Browser and device testing

[<img src="https://ipfs.io/ipfs/QmbKK6f1cuRfb63dTULVgCvnpGj6Q6T16XyqeC3AXDUH2F/browserstack-logo-600x315.png" width="300px" />](https://www.browserstack.com/)

We would like to thank [BrowserStack](https://www.browserstack.com/) for supporting Open Source and making it possible to test the BTFS Web UI on a wide array of operating systems and devices, improving compatibility for everyone.

## License

[MIT](LICENSE) © TRON Foundation
