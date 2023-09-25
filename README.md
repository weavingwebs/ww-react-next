## Development

Based on https://github.com/TimMikeladze/tsup-react-package-starter

### 💻 Developing

Watch and rebuild code with `tsup` and runs Storybook to preview your UI during development.

```console
yarn dev
```

Run all tests and watch for changes

```console
yarn test
```

### 🏗️ Building

Build package with `tsup` for production.

```console
yarn build
```

### 🖇️ Linking

Often times you want to `link` this package to another project when developing locally, circumventing the need to publish to NPM to consume it.

For this we use [yalc](https://github.com/wclr/yalc) which is a tool for local package development and simulating the publishing and installation of packages.

In a project where you want to consume your package simply run:

```console
npx yalc link my-react-package
```

To update run `yarn build` or `yarn yalc push` from this repository.

Learn more about `yalc` [here](https://github.com/wclr/yalc).

### 📩 Committing

When you are ready to commit simply run the following command to get a well formatted commit message. All staged files will automatically be linted and fixed as well.

```console
yarn commit
```

### 🔖 Releasing, tagging & publishing to NPM

Create a semantic version tag and publish to Github Releases. When a new release is detected a Github Action will automatically build the package and publish it to NPM. Additionally, a Storybook will be published to Github pages.

Learn more about how to use the `release-it` command [here](https://github.com/release-it/release-it).

```console
yarn release
```
