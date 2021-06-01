import { curly } from 'node-libcurl';
import cheerio from 'cheerio';
import Push from 'pushover-notifications';

const p = new Push( {
  user: process.env['PUSHOVER_USER'],
  token: process.env['PUSHOVER_TOKEN'],
  // httpOptions: {
  //   proxy: process.env['http_proxy'],
  //},
  // onerror: function(error) {},
  // update_sounds: true // update the list of sounds every day - will
  // prevent app from exiting.
});

const sendErrorNotification = (err) => {
    p.send({
        message: err.message,
        title: 'ua-latest-getter',
    }, (err, result) => {
        if (err) {
            throw err;
        }

        console.log(result);
    });
};

(async () => {
    try {
        const { statusCode, data } =
            await curly
            .get('https://www.whatismybrowser.com/guides/the-latest-user-agent/chrome',
                {
                    proxy: process.env['UA_GETTER_PROXY']
                });
        if (statusCode !== 200) {
            throw new Error(`HTTP error: ${statusCode}.`);
        }

        const $ = cheerio.load(data);
        const target = $('.code');
        if (target.length < 1) {
            throw new Error('Source page read error. Check DOM.');
        }

        console.log(target.eq(0).text().trim());
    }
    catch (e) {
        sendErrorNotification(e);
        process.exitCode = 1;
    }
})();
