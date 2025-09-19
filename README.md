# Overview

UI for Festwrap, an APP to facilitate the creation of custom playlists for the musical events you attend. We use Spotify for hosting the playlists.

The backend is located in [this repository](https://github.com/DanielMoraDC/festwrap-server).

# Local development

Make sure Node 20+ and Make are available in your system. Then set everything up:

```shell
make local-setup
```

This will install the npm dependencies and prepare the env file (i.e. `.env.`). Make sure to fill the `NEXTAUTH_SECRET` with the output of:

```shell
openssl rand -base64 32
```

# Run the app

To run the development verison of the app, type:

```shell
make run-dev
```

You can run the production build by typing:

```shell
make run
```

# Recommendations for a great experience using TailwindCSS 🧙🏼‍♂️

### Add TailwindCSS Intellisense

Check the link: [TailwindCSS Intellisense](https://marketplace.visualstudio.com/items?itemName=bradlc.vscode-tailwindcss)

### Add these settings in VSCode

To work properly with intellisense when the classes are in constants or variables, depending on how you name the variables:

```shell
"tailwindCSS.classAttributes": [
    "class",
    "className",
    "ngClass",
    ".*Styles.*",
    ".*Classes.*",
    ".*CLASSES.*",
    "Classes",
    "classNames",
],
```

To avoid long strings in VSCode and allow see all classes in multiple lines

```shell
"editor.wordWrap": "on",
```
