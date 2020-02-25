# <img src="/electron_logo.svg" width="30px"> Electron Neofetch Look-alike


## Description

I wanted to try and make a small Electron Application. This mimics the neofetch CLI programs way of printing out computer specs for screenshots.

It's currently only have full support for Manjaro and Mint distrubutions that is use frequently myself, but will run on all with some broken features.

Will only run on Linux as I've had to use make use of spawn and exect in nodeJS to run bash script commands to get some of the systems information as it was not available in the libraries APIs.

## Technologies Used

- ElectronJS
- NodeJS APIs
- SysteminformationJS APIs (https://systeminformation.io/)

## Limitations

To add full support for more distubutions requires;

- Additional images for each distrubution.
- More options to be added to the window manager array.
- If statments for multiple package managers.
