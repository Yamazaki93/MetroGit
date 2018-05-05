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

## Getting Started

### Downlading and Installation
#### Github Releases

To start using this app, go to Releases, download and run the latest setup.exe and off you go.

#### Building

This app is built on: NodeJS 8.10

To build this from the scratch, first install `electron-builder` and `ng` as global dependencies, then follow the following steps (Windows only):
 
  1. Clone this repo
  2. `cd` into this repo, `yarn install`
  3. `cd app/frontend`
  4. `yarn install`
  5. `.\build.ps1`

## Support this app

Hi there, if you like this app, find it useful or just like this subway map, I'd loved to hear your feedback and experiences. 

Also, please consider <a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/mjCsGWDTS"><img src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt="Buy me a tea"><span style="margin-left:5px">Buy me a tea</span></a>, I live on black tea basically 😉

## FAQ and Issues

Checkout the Wiki page for FAQ. If you've found a bug, security issue or want to suggest a feature, feel free to post them to the Issues section (please search for existing issues and FAQ before posting new ones 🙂)

## License

MIT