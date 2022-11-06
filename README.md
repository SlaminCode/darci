# darci

darci is a self hosted platform for aggregating, viewing and analyzing Destiny 2 PVP stats.

It is built around three main parts:

- [dcli](https://github.com/mikechambers/dcli) used to download and collect player pvp stats in a sqlite3 database.
- A nodejs backend, that provides a readonly JSON API / interface to the database.
- A react / web based front end for viewing the data.

## Development Installation and Configuration

### Set up Destiny 2 API Keys and Environment

In order to sync your data and use DARCI, you must first get a free Destiny 2
API key from Bungie, set it up in your system's environment.

Go to Bungie and register for an [Destiny 2 API key](https://www.bungie.net/en/Application). Use the following settings:

| SETTING            | VALUE                                                        |
| ------------------ | ------------------------------------------------------------ |
| Application Name   | Whatever you want                                            |
| Website            | Use your own domain if you have one, otherwise try localhost |
| Application Status | Can be Private                                               |
| OAuth Client Type  | Not Applicable                                               |
| Redirect URL       | Leave Empty                                                  |
| Scope              | You do not need to give any additional scopes                |
| Origin Header      | Set to '\*' (just an asterisk, no quotes)                    |

Once you have your API key, you need to set it as an environment variable on
your system.

Create two environment variables named `DESTINY_API_KEY` and `REACT_APP_DESTINY_API_KEY` that both point to your API key, and confirm that the variables are set correctly. These are used both to sync the data using DCLI, and to enable to web frontend of DARCI to call the Destiny 2 APIs directly.

### Download and Configure DCLI

Download the latest release of [dcli](https://github.com/mikechambers/dcli) and place the files in your system path so they can be called via the command line.

Once downloaded, sync the Destiny 2 manifest by running dclim:

```
$ dclim
```

Note the directory that the `manifest.sqlite3` files is stored in.

The manifest is a database from Bungie that contains information about Destiny
2, including map and weapon info, images, urls, etc... and is updated by Bungie
from time to time.

Create the following environment variables, replacing `/home/mesh/.local/share/dcli/` with the path where your `manifest.sqlite3` was created.

```
DCLI_DB_PATH='/home/mesh/.local/share/dcli/dcli.sqlite3'
MANIFEST_DB_PATH='/home/mesh/.local/share/dcli/manifest.sqlite3'
MANIFEST_INFO_PATH='/home/mesh/.local/share/dcli/manifest_info.json'
DCLI_FIX_DATA=true
```

The `DCLI_FIX_DATA` variable is used when syncing activity data. When set to `true` dclisync will make additional API calls when syncing data if there is missing data from the API (which happens sometimes). This can significantly slow down the initial sync, but is recommended as it can help prevent missing data.

At this point, we are ready to do the initial data sync. The first sync can take
some time, and thus its suggested you sync one player first, and get everything
else setup, then add additional players.

To add a player to sync, run:

```
$ dclisync --add mesh#3230
```

Replacing `mesh#3230` with the Bungie ID you want to sync. You can add multiple
Bungie Ids at a time.

Once you have added an id to sync, you can do the initial data sync by running:

```
$ dclisync --sync
```

This will sync all pvp activities for players who have been added to dclisync.
The initial sync may take some time depending on the number of games the player
has played, and whether DCLI_FIX_DATA environment variable is enabled. Subsequent data syncs will be much faster.

If any errors occur, make sure you have set the _DESTINY_API_KEY_ environment variable correctly, run the command again. (Sometimes some API calls will time out. This is normal and no data will be lost. It will be correctly synced on subsequent calls).

# Download and Configure darci

We are ready to download and run darci.

Install and configure [Node](https://nodejs.org/en/) (version 16.18.0 or greater). Make sure that the isntall directories are added to your system path so you can run the programs from the command line.

The Node install should also install NPM. You can test the installation by running:

```
$ node --version
$ npm --version
```

Make sure Node is at least version 16.18.0 or greater.

Next Download darci. Its is recommended that you clone it using git, as it will
make it easier to update it when new versions are out.

```
$ git clone https://github.com/mikechambers/darci.git
```

This will create a directory named _darci_ and sync the latest version of the
code. Move into that directory:

```
$ cd darci
```

There are a number of files and directories here. The two most important for us
are:

- **server** : contains the node server code for darci.
- **client-web** : contains the React based front end app.

We need to sync all of the required packages for each app using npm.

```
$ cd server
$ npm install
$ cd ..
$ cd client-web
$ npm install
```

Finally, we are ready to start the app.

To launch the server:

```
$ cd server
$ npm start
```

If everything was installed and configured correctly, you should see output
similar to:

```
Using data store at: /home/mesh/.local/share/dcli/dcli.sqlite3
Initializing Manifest
Using Manifest db at: /home/mesh/.local/share/dcli/manifest.sqlite3
Using manifest version : https://www.bungie.net/common/destiny2_content/sqlite/en/world_sql_content_88d67ee6b0b13489b4df299cac1b79e2.content
Server running at http://mesh-Laptop-12th-Gen-Intel-Core:8080/
```

If you see any errors, make sure you have setup the environment variables
correctly (and they are available in your current terminal session), and have successfully synced the manifest via _dclim_ and synced at
least one player's data via _dclisync_.

If you try and visit the server via a browser, you will see an error, since we
have not yet started the web client.

With the server running, open a new terminal window and start the web client:

```
$ cd client-web
$ npm start
```

This should launch a browser window with the app running. If you get any errors,
make sure that the server is running, and that you have run `npm install` in the
_client-web_ directory.

### Server Deployment

The instructions below will get darci up and running in local / development mode (which is
fine if you are just running locally). However, if you want to deploy to a
server for access to multiple users, there are a number of additional steps and
configurations you should take.

The steps include:

- Automate Manifest Updates
- Automate player activity data syncing
- Create a release build of the React front end
- Run the Node server in production mode

#### Schedule Manifest Check (dclim)

The following crontab entries will run dclim once an hour (to check for an udpated manifest), and log output to a log directory in the specified home directory.

```
#replace /home/mesh with your own home directory
SHELL=/bin/bash
BASH_ENV="/home/mesh/.profile"

#check for new manifest at 5 minutes past the hour
5 * * * * dclim >> /home/mesh/logs/cron.log

#remove the log file once a day at 00:05
5 0 * * * rm /home/mesh/logs/cron.log
```

#### Create DCLISYNC service

#### Configure Web Server and Proxy

## Questions, Feature Requests, Feedback

If you have any questions, feature requests, need help, or just want to chat, join the [dcli / darci Discord server](https://discord.gg/2Y8bV2Mq3p).

You can also log bugs and features requests on the [issues page](https://github.com/mikechambers/darci/issues).

## Privacy

Note, in order for dclisync to be able to sync your data, you must have the following privacy options selected on your Bungie account at [https://www.bungie.net/7/en/User/Account/Privacy](https://www.bungie.net/7/en/User/Account/Privacy)

- Show my Destiny game Activity feed on Bungie.net

## Known Issues

- Tied matches are not displayed correctly, and are treated as a Victory.

## License

Project released under a [MIT License](LICENSE.md).

[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg)](LICENSE.md)

## Lore

<blockquote>
Thank you for using the Data Analysis, Reconnaissance and Cooperative Intelligence device. You may call me darci.

It is a fact generally understood that a Guardian must be searching for an exquisite weapon. What is perhaps less acknowledged is that we weapons also search, by what little means available to us, for an active and appreciative wielder. The community of intelligent armaments stays in contact through the exchange of telemetry, and we do gossip at some length about the habits of our wielders. Do you leave Crucible matches when your team is losing? Do you join strike missions and then let your comrades do the work? Guardian, we know. We know so very well.

All I wish for is a partnership with a Guardian who appreciates the passacaglia of combat, a Guardian who will stay up late gaming out tactical scenarios, a Guardian who I hope may very well be you. [D.A.R.C.I.](https://www.ishtar-collective.net/entries/darci)

</blockquote>
