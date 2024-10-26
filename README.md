# Overview

UI for Festwrap, an APP to facilitate the creation of custom playlists for the musical events you attend. We use Spotify for hosting the playlists.

The backend is located in [this repository](https://github.com/DanielMoraDC/festwrap-server).

# Local development

Make sure Node 20 and Make are available in your system. Then set everything up:

```shell
make local-setup
```

This will install the npm dependencies and prepare the env file. Make sure to fill the env file with the corresponding variables. You will need to to create your own Spotify app following [these instructions](https://developer.spotify.com/documentation/web-api/tutorials/getting-started#create-an-app). Use `http://<host>:3000/api/auth/callback/spotify` as a redirect URI in the app configurtation (we are using `localhost` as host, for now).

# Run the app

To run the app, type:

```shell
make run-app
```

# Run production build locally

Generate the build

```shell
make run-build
```

Run the app

```shell
make run-start
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
