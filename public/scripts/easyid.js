
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
                .replace('{{signText}}', Base64Encode(text))
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
                .replace('{{signText}}', Base64Encode(text))
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
            var eventOrigin = ensureSlashTerminated(e.origin);
            if (eventOrigin.toLowerCase() === trustedOrigin.toLowerCase()) {
                console.log("Message is from trusted authority " + trustedOrigin);
                callback(null, e.data.signature);
            }
        }
    }
}

function Base64Encode(str, encoding = 'utf-8') {
    var bytes = new (TextEncoder || TextEncoderLite)(encoding).encode(str);        
    return base64js.fromByteArray(bytes);
}

function Base64Decode(str, encoding = 'utf-8') {
    var bytes = base64js.toByteArray(str);
    return new (TextDecoder || TextDecoderLite)(encoding).decode(bytes);
}

(function(r){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=r()}else if(typeof define==="function"&&define.amd){define([],r)}else{var e;if(typeof window!=="undefined"){e=window}else if(typeof global!=="undefined"){e=global}else if(typeof self!=="undefined"){e=self}else{e=this}e.base64js=r()}})(function(){var r,e,n;return function(){function r(e,n,t){function o(f,i){if(!n[f]){if(!e[f]){var u="function"==typeof require&&require;if(!i&&u)return u(f,!0);if(a)return a(f,!0);var v=new Error("Cannot find module '"+f+"'");throw v.code="MODULE_NOT_FOUND",v}var d=n[f]={exports:{}};e[f][0].call(d.exports,function(r){var n=e[f][1][r];return o(n||r)},d,d.exports,r,e,n,t)}return n[f].exports}for(var a="function"==typeof require&&require,f=0;f<t.length;f++)o(t[f]);return o}return r}()({"/":[function(r,e,n){"use strict";n.byteLength=d;n.toByteArray=h;n.fromByteArray=p;var t=[];var o=[];var a=typeof Uint8Array!=="undefined"?Uint8Array:Array;var f="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var i=0,u=f.length;i<u;++i){t[i]=f[i];o[f.charCodeAt(i)]=i}o["-".charCodeAt(0)]=62;o["_".charCodeAt(0)]=63;function v(r){var e=r.length;if(e%4>0){throw new Error("Invalid string. Length must be a multiple of 4")}var n=r.indexOf("=");if(n===-1)n=e;var t=n===e?0:4-n%4;return[n,t]}function d(r){var e=v(r);var n=e[0];var t=e[1];return(n+t)*3/4-t}function c(r,e,n){return(e+n)*3/4-n}function h(r){var e;var n=v(r);var t=n[0];var f=n[1];var i=new a(c(r,t,f));var u=0;var d=f>0?t-4:t;for(var h=0;h<d;h+=4){e=o[r.charCodeAt(h)]<<18|o[r.charCodeAt(h+1)]<<12|o[r.charCodeAt(h+2)]<<6|o[r.charCodeAt(h+3)];i[u++]=e>>16&255;i[u++]=e>>8&255;i[u++]=e&255}if(f===2){e=o[r.charCodeAt(h)]<<2|o[r.charCodeAt(h+1)]>>4;i[u++]=e&255}if(f===1){e=o[r.charCodeAt(h)]<<10|o[r.charCodeAt(h+1)]<<4|o[r.charCodeAt(h+2)]>>2;i[u++]=e>>8&255;i[u++]=e&255}return i}function s(r){return t[r>>18&63]+t[r>>12&63]+t[r>>6&63]+t[r&63]}function l(r,e,n){var t;var o=[];for(var a=e;a<n;a+=3){t=(r[a]<<16&16711680)+(r[a+1]<<8&65280)+(r[a+2]&255);o.push(s(t))}return o.join("")}function p(r){var e;var n=r.length;var o=n%3;var a=[];var f=16383;for(var i=0,u=n-o;i<u;i+=f){a.push(l(r,i,i+f>u?u:i+f))}if(o===1){e=r[n-1];a.push(t[e>>2]+t[e<<4&63]+"==")}else if(o===2){e=(r[n-2]<<8)+r[n-1];a.push(t[e>>10]+t[e>>4&63]+t[e<<2&63]+"=")}return a.join("")}},{}]},{},[])("/")});
