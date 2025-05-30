An input text replacement browser extension for linux.

## Dependencies

- Python 3.10+
- pip
- jq
- Chrome or Firefox

See: [Installing Python 3 on Linux](https://docs.python-guide.org/starting/install3/linux/)

## Install

```bash
git clone https://github.com/SpaceMonkey1347/domos.git
chmod +x domos/app/install.bash
./domos/app/install.bash
```

For Firefox:

- Navigate to the URL bar and enter: about:debugging
- Click on "This Firefox" on the left under "Setup"
- Click "Load Temporary Add-on..." and select the manifest.json inside domos/add\_on/

For Chrome:

- Navigate to the URL bar and enter: chrome://extensions/
- Click on "Load unpacked" on the top-left and select the domos/add\_on/ folder

## Uninstall

```bash
cd domos/app
chmod +x uninstall.bash
./uninstall.bash
```
