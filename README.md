# Latest Chrome User-Agent Getter for Node.
## Using Pushover notifications.

To be runned as a standalone UNIX process.

Add command to run the following script someplace like `sudo crontab -u <USER> -e`:

```sh
#!/bin/bash
export PUSHOVER_USER=<VALUE>
export PUSHOVER_TOKEN=<VALUE>
export UA_GETTER_PROXY="socks5://<user>:<pwd>@<host>:<port>"

cd "$(dirname "$(realpath "$0")")"
node main.js > temp-latest-chrome-ua.txt 2>temperr.txt

case $? in
        0)
                mv temp-latest-chrome-ua.txt latest-chrome-ua.txt
                rm temperr.txt;;
        1)
                cat temperr.txt >> error.log
                rm temperr.txt
                rm temp-latest-chrome-ua.txt;;
esac
```
