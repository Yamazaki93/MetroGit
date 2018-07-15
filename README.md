
<img src="./app/visual/Icon-48.png">
[![Build Status](https://travis-ci.com/Yamazaki93/MetroGit.svg?branch=master)](https://travis-ci.com/Yamazaki93/MetroGit)

# Metro themed Git UI

MetroGit is a native desktop git app with JIRA, AppVeyor and other tools integrated into one consistent UI. So no more switching windows and jumping between browser tabs 🤓. More integration and feature still yet to come...

![alt text](https://github.com/Yamazaki93/MetroGit/raw/master/misc/metrogit.gif "Preview")

## Feature Highlight

 - Subway map style git visualization with commit details
 - Basic repo operations (pull, push, commit, stash, pop, create branch)
 - JIRA integration with native UI
 - Map integrated AppVeyor build status with periodic update and on-demand log download
 - Credential caching with Windows Credential Manager (through keytar)
 - Repository specific settings

## Built On
This app is built with some really awsome frameworks, including:

<a href="https://electronjs.org/"><img src="https://camo.githubusercontent.com/627c774e3070482b180c3abd858ef2145d46303b/68747470733a2f2f656c656374726f6e6a732e6f72672f696d616765732f656c656374726f6e2d6c6f676f2e737667" width="250"></a>
<a href="https://angular.io/"><img src="https://angular.io/assets/images/logos/angular/angular.svg" width="150"></a>

<a href="http://www.nodegit.org/"><img src="https://www.nodegit.org/img/nodegit.svg" width="150"></a>

<a href="https://feathericons.com/"><img src="https://raw.githubusercontent.com/feathericons/feather/master/icons/feather.svg?sanitize=true"> Feathericons</a>

## Getting Started

### Downlading and Installation

#### Github Releases

To start using this app, go to Releases, download and run the latest setup.exe or dmg and off you go.

#### Building

This app is built on: NodeJS 8.10

To build this from the scratch, global dependencies `electron-builder` and `@angular/cli` is needed. 

  - You can install global dependencies via `npm install -g electron-builder @angular/cli`

After installing correct dependencies, do the following.
 
  1. Clone this repo
  2. `cd` into this repo, `yarn install`
  3. `cd app/frontend`
  4. `yarn install`
  5. `cd ../..` back to project root directory
  6. `.\build.ps1` (for windows) or `.\build.sh` (for Mac)
  7. The output is in `dist` folder

## Support this app

Hi there, if you like this app, find it useful or just like this subway map, I'd loved to hear your feedback and experiences, you can share them with `admin@rhodiumcode.com`

Also, please consider <a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/mjCsGWDTS"><img src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt="Buy me a tea"><span style="margin-left:5px">Buy me a tea</span></a>, I live on black tea basically 😉

## FAQ and Issues

Checkout the Wiki [FAQ Page](https://github.com/Yamazaki93/MetroGit/wiki/FAQ) for frequently asked questions. If you've found a bug, security issue or want to suggest a feature, feel free to post them to the Issues section (please search for existing issues and FAQ before posting new ones 🙂)

## Contributing

Interested in contributing? Please read our [Contributing Guide](https://github.com/Yamazaki93/MetroGit/wiki/Contributing) and [Code of Conduct](https://github.com/Yamazaki93/MetroGit/blob/master/CODE_OF_CONDUCT.md)

## License

MIT © Ming-Hung (Michael) Lu
