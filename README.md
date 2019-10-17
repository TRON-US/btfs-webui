# BTFS Web UI


> Check on your node stats, explore the IPLD powered merkle forest, see peers around the world and manage your files, without needing to touch the CLI.

![Screenshot of the status page](docs/screenshots/ipfs-webui-status.png)

| Files | Explore | Peers | Settings |
|-------|---------|-------|----------|
| ![Screenshot of the file browser page](docs/screenshots/ipfs-webui-files.png) | ![Screenshot of the IPLD explorer page](docs/screenshots/ipfs-webui-explore.png) | ![Screenshot of the swarm peers map](docs/screenshots/ipfs-webui-peers.png) | ![Screenshot of the settings page](docs/screenshots/ipfs-webui-settings.png) |



The app uses [`ipfs-http-client`](https://github.com/ipfs/js-ipfs-http-client) to communicate with your local BTFS node.

The app is built with [`create-react-app`](https://github.com/facebook/create-react-app). Please read the [docs](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#table-of-contents).

## Build WebUI

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

In your previous terminal, run the dev server @ http://localhost:3000

```
npm start
```

The final output should be as such:

```
Compiled successfully!

You can now view btfs-webui in the browser.

  Local:            http://localhost:3000/
  On Your Network:  http://10.10.0.77:3000/

Note that the development build is not optimized.
To create a production build, use npm run build.

```
Paste the local host URL into your web browser to view the WebUI. 


## Usage

**When working on the code**, run a btfs daemon, the local [dev server](https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/template/README.md#npm-start), the [unit tests](https://facebook.github.io/jest/), and the [storybook](https://storybook.js.org/) component viewer and see the results of your changes as you save files. For **debugging** follow this [post](https://hackernoon.com/debugging-react-like-a-champ-with-vscode-66281760037)

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
# Run the unit tests
> npm test
```

```sh
# Run the UI component viewer @ http://localhost:9009
> npm run storybook
```

### Configure BTFS API CORS headers

You must configure your BTFS API at http://0.0.0.0:5001  to allow [cross-origin (CORS)](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS) requests from your dev server at http://localhost:3000

#### Easy mode

Run the **[cors-config.sh](./cors-config.sh)** script with:

```console
> ./cors-config.sh
```

#### The manual way

```console
> btfs config --json API.HTTPHeaders.Access-Control-Allow-Origin '["http://localhost:3000"]'
> btfs config --json API.HTTPHeaders.Access-Control-Allow-Methods '["PUT", "GET", "POST"]'
```

#### Reverting

To reset your config back to the default configuration, run the following command.

```console
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

The following command will run the app tests, watch source files and re-run the tests when changes are made:

```sh
> npm test
```

The WebUI uses Jest to run the isolated unit tests. Unit test files are located next to the component they test and have the same file name, but with the extension `.test.js`

## End-to-end tests

The end-to-end tests (e2e) test the full app in a headless Chromium browser. They require an http server to be running to serve the app.

In dev, run `npm start` in another shell before starting the tests

```
# Run the end-to-end tests
> npm run test:e2e
```

By default the test run headless, so you won't see the the browser. To debug test errors, it can be helpful to see the robot clicking around the site. To disable headless mode and see the browser, set the environment variable `DEBUG=true`

```
# See the end-to-end tests in a browser
> DEBUG=true npm run test:e2e
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

<!---
TODO: Do we allow contributions?
--> 



## Releasing a new version of the WebUI.
1. retrieve files from build folder
1. Add to bootstrap nodes
1. Update the hash at:
   - go-btfs https://github.com/TRON-US/go-btfs/blob/master/core/corehttp/webui.go



## License

[MIT](LICENSE) © Protocol Labs
