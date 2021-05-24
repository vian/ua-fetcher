# Latest Chrome User-Agent Getter for Node.
_Using Pushover notifications._

To be runned as a standalone UNIX process.

Add someplace like /etc/cron.daily:

```sh
#!/bin/sh

if [ ! -x /usr/bin/node ]; then
    /usr/bin/logger -t ua-fetcher "ALERT Node.js executable is not found [$EXITVALUE]"
    exit -1
fi

if [ ! -r $UA_FETCHER_HOMEDIR/main.js ]; then
    /usr/bin/logger -t ua-fetcher "ALERT source file does not exist [$EXITVALUE]"
    exit -1
fi

/usr/bin/node $UA_FETCHER_HOMEDIR/main.js > $UA_FETCHER_HOMEDIR/latest-chrome-ua.txt
EXITVALUE=$?
if [ $EXITVALUE != 0 ]; then
    /usr/bin/logger -t ua-fetcher "ALERT exited abnormally with [$EXITVALUE]"
fi
exit $EXITVALUE
```
