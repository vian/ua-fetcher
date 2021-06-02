const { curly } = require('node-libcurl');
const cheerio = require('cheerio');
const Push = require('pushover-notifications');

const fs = require('fs');
const path = require('path');
const tls = require('tls');

// important steps
const certFilePath = path.join(__dirname, 'cert.pem')
const tlsData = tls.rootCertificates.join('\n')
fs.writeFileSync(certFilePath, tlsData)

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
                    proxy: process.env['UA_GETTER_PROXY'],
                    caInfo: certFilePath,
                    verbose: true,
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
