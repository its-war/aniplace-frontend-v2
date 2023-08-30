const REQUEST_URL = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js';

const REQUEST_CONFIG = {
    method: 'HEAD',
    mode: 'no-cors'
};

export default function checkAdsBlocked(callback){
    fetch(REQUEST_URL, REQUEST_CONFIG)
        .then((response) => {
            callback(response.redirected);
        })
        .catch(() => {
            callback(true);
        });
};
