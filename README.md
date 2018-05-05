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

Also, please consider <style type="text/css">.bmc-button img{width: 27px !important;margin-bottom: 1px !important;box-shadow: none !important;border: none !important;vertical-align: middle !important;}.bmc-button{line-height: 36px !important;height:37px !important;text-decoration: none !important;display:inline-flex !important;color:#ffffff !important;background-color:#FF813F !important;border-radius: 3px !important;border: 1px solid transparent !important;padding: 0px 9px !important;font-size: 17px !important;letter-spacing:-0.08px !important;;box-shadow: 0px 1px 2px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;margin: 0 auto !important;font-family:'Lato', sans-serif !important;-webkit-box-sizing: border-box !important;box-sizing: border-box !important;-o-transition: 0.3s all linear !important;-webkit-transition: 0.3s all linear !important;-moz-transition: 0.3s all linear !important;-ms-transition: 0.3s all linear !important;transition: 0.3s all linear !important;}.bmc-button:hover, .bmc-button:active, .bmc-button:focus {-webkit-box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;text-decoration: none !important;box-shadow: 0px 1px 2px 2px rgba(190, 190, 190, 0.5) !important;opacity: 0.85 !important;color:#ffffff !important;}</style><link href="https://fonts.googleapis.com/css?family=Lato&subset=latin,latin-ext" rel="stylesheet"><a class="bmc-button" target="_blank" href="https://www.buymeacoffee.com/mjCsGWDTS"><img src="https://www.buymeacoffee.com/assets/img/BMC-btn-logo.svg" alt="Buy me a tea"><span style="margin-left:5px">Buy me a tea</span></a> I live on black tea basically 😉

## FAQ and Issues

Checkout the Wiki page for FAQ. If you've found a bug, security issue or want to suggest a feature, feel free to post them to the Issues section (please search for existing issues and FAQ before posting new ones 🙂)

## License

MIT