

function EasyID(domain, clientID) {
    var signUrl = 'https://{{domain}}/sign/text?wa=wsignin1.0&wtrealm={{clientID}}&wreply={{replyUrl}}&wauth={{signMethod}}&signtext={{signText}}&responseStrategy={{strategy}}';

    this._domain = domain;
    this._cientID = clientID;
    this.sign = function (text, options, action) {
        if (typeof action === 'function') {
            if (!options.iframeID) {
                var err = new Error('Callback cannot be used without iframe. Please specify ID of iframe');
                return action(err, null);
            }
            else if (!document.getElementById(options.iframeID)) {
                var err = new Error('Iframe not found.');
                return action(err, null);
            }

            var replyUrl = window.location.protocol + '//' + window.location.host;

            var eventMethod = window.addEventListener ? "addEventListener" : "attachEvent";
            var messageEvent = eventMethod === "attachEvent" ? "onmessage" : "message";
            var eventer = window[eventMethod];
            eventer(messageEvent, signatureReceiver(domain, action));

            var iframe = document.getElementById(options.iframeID);
            iframe.src = signUrl
                .replace('{{domain}}', domain)
                .replace('{{clientID}}', clientID)
                .replace('{{replyUrl}}', replyUrl)
                .replace('{{signMethod}}', options.signMethod)
                .replace('{{signText}}', window.btoa(text))
                .replace('{{strategy}}', 'postMessage');
        }
        else if (typeof action === 'string') {
            // let the server handle it
            var iframe;
            if (options.iframeID) {
                iframe = document.getElementById(options.iframeID);
            }
            var url = signUrl
                .replace('{{domain}}', domain)
                .replace('{{clientID}}', clientID)
                .replace('{{replyUrl}}', action)
                .replace('{{signMethod}}', options.signMethod)
                .replace('{{signText}}', window.btoa(text))
                .replace('{{strategy}}', 'formPost');
            if (iframe) {
                ifrmae.src = url;
            }
            else {
                window.location.href = url;
            }
        }
        else {
            return new Error('Please provide either callback function or URL');
        }
    };
}

function ensureSlashTerminated(s) {
    if (s.endsWith("/")) {
        return s;
    }
    return s + "/";
}

// Listen to message from the iframe and send the user to the desired target URL. 
// For this demo, we stay on the home page, but you could certainly add some more
// refined logic for taking the user to a better place.
function signatureReceiver(domain, done) {
    var callback = done;
    var trustedOrigin = ensureSlashTerminated('https://' + domain);

    return function (e) {
        if (e && e.data) {
            console.log("Received postMessage event with signature (event origin " + e.origin + ")");
            let eventOrigin = ensureSlashTerminated(e.origin);
            if (eventOrigin.toLowerCase() === trustedOrigin.toLowerCase()) {
                console.log("Message is from trusted authority " + trustedOrigin);
                callback(null, e.data.signature);
            }
        }
    }
}

