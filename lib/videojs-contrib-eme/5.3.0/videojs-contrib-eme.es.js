/*! @name videojs-contrib-eme @version 5.3.0 @license Apache-2.0 */
import videojs from 'video.js';
import window from 'global/window';
import _extends from '@babel/runtime/helpers/extends';
import document from 'global/document';

const stringToUint16Array = string => {
  // 2 bytes for each char
  const buffer = new ArrayBuffer(string.length * 2);
  const array = new Uint16Array(buffer);

  for (let i = 0; i < string.length; i++) {
    array[i] = string.charCodeAt(i);
  }

  return array;
};
const uint8ArrayToString = array => {
  return String.fromCharCode.apply(null, new Uint8Array(array.buffer || array));
};
const uint16ArrayToString = array => {
  return String.fromCharCode.apply(null, new Uint16Array(array.buffer || array));
};
const getHostnameFromUri = uri => {
  const link = document.createElement('a');
  link.href = uri;
  return link.hostname;
};
const arrayBuffersEqual = (arrayBuffer1, arrayBuffer2) => {
  if (arrayBuffer1 === arrayBuffer2) {
    return true;
  }

  if (arrayBuffer1.byteLength !== arrayBuffer2.byteLength) {
    return false;
  }

  const dataView1 = new DataView(arrayBuffer1);
  const dataView2 = new DataView(arrayBuffer2);

  for (let i = 0; i < dataView1.byteLength; i++) {
    if (dataView1.getUint8(i) !== dataView2.getUint8(i)) {
      return false;
    }
  }

  return true;
};
const arrayBufferFrom = bufferOrTypedArray => {
  if (bufferOrTypedArray instanceof Uint8Array || bufferOrTypedArray instanceof Uint16Array) {
    return bufferOrTypedArray.buffer;
  }

  return bufferOrTypedArray;
}; // Normalize between Video.js 6/7 (videojs.mergeOptions) and 8 (videojs.obj.merge).

const merge = (...args) => {
  const context = videojs.obj || videojs;
  const fn = context.merge || context.mergeOptions;
  return fn.apply(context, args);
};
const mergeAndRemoveNull = (...args) => {
  const result = merge(...args); // Any header whose value is `null` will be removed.

  Object.keys(result).forEach(k => {
    if (result[k] === null) {
      delete result[k];
    }
  });
  return result;
};
/**
 * Transforms the keySystems object into a MediaKeySystemConfiguration Object array.
 *
 * @param {Object} keySystems object from the options.
 * @return {Array} of MediaKeySystemConfiguration objects.
 */

const getMediaKeySystemConfigurations = keySystems => {
  const config = [];
  Object.keys(keySystems).forEach(keySystem => {
    const mediaKeySystemConfig = getSupportedConfigurations(keySystem, keySystems[keySystem])[0];
    config.push(mediaKeySystemConfig);
  });
  return config;
};

let httpResponseHandler = videojs.xhr.httpHandler; // to make sure this doesn't break with older versions of Video.js,
// do a super simple wrapper instead

if (!httpResponseHandler) {
  httpResponseHandler = (callback, decodeResponseBody) => (err, response, responseBody) => {
    if (err) {
      callback(err);
      return;
    } // if the HTTP status code is 4xx or 5xx, the request also failed


    if (response.statusCode >= 400 && response.statusCode <= 599) {
      let cause = responseBody;

      if (decodeResponseBody) {
        cause = String.fromCharCode.apply(null, new Uint8Array(responseBody));
      }

      callback({
        cause
      });
      return;
    } // otherwise, request succeeded


    callback(null, responseBody);
  };
}

/**
 * Parses the EME key message XML to extract HTTP headers and the Challenge element to use
 * in the PlayReady license request.
 *
 * @param {ArrayBuffer} message key message from EME
 * @return {Object} an object containing headers and the message body to use in the
 * license request
 */

const getMessageContents = message => {
  // TODO do we want to support UTF-8?
  const xmlString = String.fromCharCode.apply(null, new Uint16Array(message));
  const xml = new window.DOMParser().parseFromString(xmlString, 'application/xml');
  const headersElement = xml.getElementsByTagName('HttpHeaders')[0];
  let headers = {};

  if (headersElement) {
    const headerNames = headersElement.getElementsByTagName('name');
    const headerValues = headersElement.getElementsByTagName('value');

    for (let i = 0; i < headerNames.length; i++) {
      headers[headerNames[i].childNodes[0].nodeValue] = headerValues[i].childNodes[0].nodeValue;
    }
  }

  const challengeElement = xml.getElementsByTagName('Challenge')[0];
  let challenge;

  if (challengeElement) {
    challenge = window.atob(challengeElement.childNodes[0].nodeValue);
  } // If we failed to parse the xml the soap message might be encoded already.
  // set the message data as the challenge and add generic SOAP headers.


  if (xml.querySelector('parsererror')) {
    headers = {
      'Content-Type': 'text/xml; charset=utf-8',
      'SOAPAction': '"http://schemas.microsoft.com/DRM/2007/03/protocols/AcquireLicense"'
    };
    challenge = message;
  }

  return {
    headers,
    message: challenge
  };
};
const requestPlayreadyLicense = (keySystemOptions, messageBuffer, emeOptions, callback) => {
  const messageContents = getMessageContents(messageBuffer);
  const message = messageContents.message;
  const headers = mergeAndRemoveNull(messageContents.headers, emeOptions.emeHeaders, keySystemOptions.licenseHeaders);
  videojs.xhr({
    uri: keySystemOptions.url,
    method: 'post',
    headers,
    body: message,
    responseType: 'arraybuffer',
    requestType: 'license'
  }, httpResponseHandler(callback, true));
};

const Error$1 = {
  EMEFailedToRequestMediaKeySystemAccess: 'eme-failed-request-media-key-system-access',
  EMEFailedToCreateMediaKeys: 'eme-failed-create-media-keys',
  EMEFailedToAttachMediaKeysToVideoElement: 'eme-failed-attach-media-keys-to-video',
  EMEFailedToCreateMediaKeySession: 'eme-failed-create-media-key-session',
  EMEFailedToSetServerCertificate: 'eme-failed-set-server-certificate',
  EMEFailedToGenerateLicenseRequest: 'eme-failed-generate-license-request',
  EMEFailedToUpdateSessionWithReceivedLicenseKeys: 'eme-failed-update-session',
  EMEFailedToCloseSession: 'eme-failed-close-session',
  EMEFailedToRemoveKeysFromSession: 'eme-failed-remove-keys',
  EMEFailedToLoadSessionBySessionId: 'eme-failed-load-session'
};

/**
 * The W3C Working Draft of 22 October 2013 seems to be the best match for
 * the ms-prefixed API. However, it should only be used as a guide; it is
 * doubtful the spec is 100% implemented as described.
 *
 * @see https://www.w3.org/TR/2013/WD-encrypted-media-20131022
 */
const LEGACY_FAIRPLAY_KEY_SYSTEM = 'com.apple.fps.1_0';

const concatInitDataIdAndCertificate = ({
  initData,
  id,
  cert
}) => {
  if (typeof id === 'string') {
    id = stringToUint16Array(id);
  } // layout:
  //   [initData]
  //   [4 byte: idLength]
  //   [idLength byte: id]
  //   [4 byte:certLength]
  //   [certLength byte: cert]


  let offset = 0;
  const buffer = new ArrayBuffer(initData.byteLength + 4 + id.byteLength + 4 + cert.byteLength);
  const dataView = new DataView(buffer);
  const initDataArray = new Uint8Array(buffer, offset, initData.byteLength);
  initDataArray.set(initData);
  offset += initData.byteLength;
  dataView.setUint32(offset, id.byteLength, true);
  offset += 4;
  const idArray = new Uint16Array(buffer, offset, id.length);
  idArray.set(id);
  offset += idArray.byteLength;
  dataView.setUint32(offset, cert.byteLength, true);
  offset += 4;
  const certArray = new Uint8Array(buffer, offset, cert.byteLength);
  certArray.set(cert);
  return new Uint8Array(buffer, 0, buffer.byteLength);
};

const addKey = ({
  video,
  contentId,
  initData,
  cert,
  options,
  getLicense,
  eventBus,
  emeError
}) => {
  return new Promise((resolve, reject) => {
    if (!video.webkitKeys) {
      try {
        video.webkitSetMediaKeys(new window.WebKitMediaKeys(LEGACY_FAIRPLAY_KEY_SYSTEM));
      } catch (error) {
        const metadata = {
          errorType: Error$1.EMEFailedToCreateMediaKeys,
          keySystem: LEGACY_FAIRPLAY_KEY_SYSTEM
        };
        emeError(error, metadata);
        reject('Could not create MediaKeys');
        return;
      }
    }

    let keySession;

    try {
      keySession = video.webkitKeys.createSession('video/mp4', concatInitDataIdAndCertificate({
        id: contentId,
        initData,
        cert
      }));
    } catch (error) {
      const metadata = {
        errorType: Error$1.EMEFailedToCreateMediaKeySession,
        keySystem: LEGACY_FAIRPLAY_KEY_SYSTEM
      };
      emeError(error, metadata);
      reject('Could not create key session');
      return;
    }

    eventBus.trigger({
      type: 'keysessioncreated',
      keySession
    });
    keySession.contentId = contentId;
    keySession.addEventListener('webkitkeymessage', event => {
      eventBus.trigger({
        type: 'keymessage',
        messageEvent: event
      });
      getLicense(options, contentId, event.message, (err, license) => {
        if (eventBus) {
          eventBus.trigger('licenserequestattempted');
        }

        if (err) {
          const metadata = {
            errortype: Error$1.EMEFailedToGenerateLicenseRequest,
            keySystem: LEGACY_FAIRPLAY_KEY_SYSTEM
          };
          emeError(err, metadata);
          reject(err);
          return;
        }

        keySession.update(new Uint8Array(license));
        eventBus.trigger({
          type: 'keysessionupdated',
          keySession
        });
      });
    });
    keySession.addEventListener('webkitkeyadded', () => {
      resolve();
    }); // for testing purposes, adding webkitkeyerror must be the last item in this method

    keySession.addEventListener('webkitkeyerror', () => {
      const error = keySession.error;
      const metadata = {
        errorType: Error$1.EMEFailedToUpdateSessionWithReceivedLicenseKeys,
        keySystem: LEGACY_FAIRPLAY_KEY_SYSTEM
      };
      emeError(error, metadata);
      reject(`KeySession error: code ${error.code}, systemCode ${error.systemCode}`);
    });
  });
};

const defaultGetCertificate = fairplayOptions => {
  return (emeOptions, callback) => {
    const headers = mergeAndRemoveNull(emeOptions.emeHeaders, fairplayOptions.certificateHeaders);
    videojs.xhr({
      uri: fairplayOptions.certificateUri,
      responseType: 'arraybuffer',
      requestType: 'license',
      headers
    }, httpResponseHandler((err, license) => {
      if (err) {
        callback(err);
        return;
      } // in this case, license is still the raw ArrayBuffer,
      // (we don't want httpResponseHandler to decode it)
      // convert it into Uint8Array as expected


      callback(null, new Uint8Array(license));
    }));
  };
};
const defaultGetContentId = (emeOptions, initDataString) => {
  return getHostnameFromUri(initDataString);
};
const defaultGetLicense$1 = fairplayOptions => {
  return (emeOptions, contentId, keyMessage, callback) => {
    const headers = mergeAndRemoveNull({
      'Content-type': 'application/octet-stream'
    }, emeOptions.emeHeaders, fairplayOptions.licenseHeaders);
    videojs.xhr({
      uri: fairplayOptions.licenseUri,
      method: 'POST',
      responseType: 'arraybuffer',
      requestType: 'license',
      body: keyMessage,
      headers
    }, httpResponseHandler(callback, true));
  };
};

const fairplay = ({
  video,
  initData,
  options,
  eventBus,
  emeError
}) => {
  const fairplayOptions = options.keySystems[LEGACY_FAIRPLAY_KEY_SYSTEM];
  const getCertificate = fairplayOptions.getCertificate || defaultGetCertificate(fairplayOptions);
  const getContentId = fairplayOptions.getContentId || defaultGetContentId;
  const getLicense = fairplayOptions.getLicense || defaultGetLicense$1(fairplayOptions);
  return new Promise((resolve, reject) => {
    getCertificate(options, (err, cert) => {
      if (err) {
        const metadata = {
          errorType: Error$1.EMEFailedToSetServerCertificate,
          keySystem: LEGACY_FAIRPLAY_KEY_SYSTEM
        };
        emeError(err, metadata);
        reject(err);
        return;
      }

      resolve(cert);
    });
  }).then(cert => {
    return addKey({
      video,
      cert,
      initData,
      getLicense,
      options,
      contentId: getContentId(options, uint16ArrayToString(initData)),
      eventBus,
      emeError
    });
  });
};

const isFairplayKeySystem = str => str.startsWith('com.apple.fps');
/**
 * Returns an array of MediaKeySystemConfigurationObjects provided in the keySystem
 * options.
 *
 * @see {@link https://www.w3.org/TR/encrypted-media/#dom-mediakeysystemconfiguration|MediaKeySystemConfigurationObject}
 *
 * @param {Object} keySystemOptions
 *        Options passed into videojs-contrib-eme for a specific keySystem
 * @return {Object[]}
 *         Array of MediaKeySystemConfigurationObjects
 */


const getSupportedConfigurations = (keySystem, keySystemOptions) => {
  if (keySystemOptions.supportedConfigurations) {
    return keySystemOptions.supportedConfigurations;
  }

  const isFairplay = isFairplayKeySystem(keySystem);
  const supportedConfiguration = {};
  const initDataTypes = keySystemOptions.initDataTypes || ( // fairplay requires an explicit initDataTypes
  isFairplay ? ['sinf'] : null);
  const audioContentType = keySystemOptions.audioContentType;
  const audioRobustness = keySystemOptions.audioRobustness;
  const videoContentType = keySystemOptions.videoContentType || ( // fairplay requires an explicit videoCapabilities/videoContentType
  isFairplay ? 'video/mp4' : null);
  const videoRobustness = keySystemOptions.videoRobustness;
  const persistentState = keySystemOptions.persistentState;

  if (audioContentType || audioRobustness) {
    supportedConfiguration.audioCapabilities = [_extends({}, audioContentType ? {
      contentType: audioContentType
    } : {}, audioRobustness ? {
      robustness: audioRobustness
    } : {})];
  }

  if (videoContentType || videoRobustness) {
    supportedConfiguration.videoCapabilities = [_extends({}, videoContentType ? {
      contentType: videoContentType
    } : {}, videoRobustness ? {
      robustness: videoRobustness
    } : {})];
  }

  if (persistentState) {
    supportedConfiguration.persistentState = persistentState;
  }

  if (initDataTypes) {
    supportedConfiguration.initDataTypes = initDataTypes;
  }

  return [supportedConfiguration];
};
const getSupportedKeySystem = keySystems => {
  // As this happens after the src is set on the video, we rely only on the set src (we
  // do not change src based on capabilities of the browser in this plugin).
  let promise;
  Object.keys(keySystems).forEach(keySystem => {
    const supportedConfigurations = getSupportedConfigurations(keySystem, keySystems[keySystem]);

    if (!promise) {
      promise = window.navigator.requestMediaKeySystemAccess(keySystem, supportedConfigurations);
    } else {
      promise = promise.catch(e => window.navigator.requestMediaKeySystemAccess(keySystem, supportedConfigurations));
    }
  });
  return promise;
};
const makeNewRequest = (player, requestOptions) => {
  const {
    mediaKeys,
    initDataType,
    initData,
    options,
    getLicense,
    removeSession,
    eventBus,
    contentId,
    emeError,
    keySystem
  } = requestOptions;

  try {
    const keySession = mediaKeys.createSession();
    eventBus.trigger({
      type: 'keysessioncreated',
      keySession
    });
    player.on('dispose', () => {
      keySession.close().then(() => {
        eventBus.trigger({
          type: 'keysessionclosed',
          keySession
        });
      }).catch(error => {
        const metadata = {
          errorType: Error$1.EMEFailedToCloseSession,
          keySystem
        };
        emeError(error, metadata);
      });
    });
    return new Promise((resolve, reject) => {
      keySession.addEventListener('message', event => {
        eventBus.trigger({
          type: 'keymessage',
          messageEvent: event
        }); // all other types will be handled by keystatuseschange

        if (event.messageType !== 'license-request' && event.messageType !== 'license-renewal') {
          return;
        }

        getLicense(options, event.message, contentId).then(license => {
          resolve(keySession.update(license).then(() => {
            eventBus.trigger({
              type: 'keysessionupdated',
              keySession
            });
          }).catch(error => {
            const metadata = {
              errorType: Error$1.EMEFailedToUpdateSessionWithReceivedLicenseKeys,
              keySystem
            };
            emeError(error, metadata);
          }));
        }).catch(err => {
          reject(err);
        });
      }, false);
      const KEY_STATUSES_CHANGE = 'keystatuseschange';
      keySession.addEventListener(KEY_STATUSES_CHANGE, event => {
        let expired = false; // Re-emit the keystatuseschange event with the entire keyStatusesMap

        eventBus.trigger({
          type: KEY_STATUSES_CHANGE,
          keyStatuses: keySession.keyStatuses
        }); // Keep 'keystatuschange' for backward compatibility.
        // based on https://www.w3.org/TR/encrypted-media/#example-using-all-events

        keySession.keyStatuses.forEach((status, keyId) => {
          // Trigger an event so that outside listeners can take action if appropriate.
          // For instance, the `output-restricted` status should result in an
          // error being thrown.
          eventBus.trigger({
            keyId,
            status,
            target: keySession,
            type: 'keystatuschange'
          });

          switch (status) {
            case 'expired':
              // If one key is expired in a session, all keys are expired. From
              // https://www.w3.org/TR/encrypted-media/#dom-mediakeystatus-expired, "All other
              // keys in the session must have this status."
              expired = true;
              break;

            case 'internal-error':
              const message = 'Key status reported as "internal-error." Leaving the session open since we ' + 'don\'t have enough details to know if this error is fatal.'; // "This value is not actionable by the application."
              // https://www.w3.org/TR/encrypted-media/#dom-mediakeystatus-internal-error

              videojs.log.warn(message, event);
              break;
          }
        });

        if (expired) {
          // Close session and remove it from the session list to ensure that a new
          // session can be created.
          videojs.log.debug('Session expired, closing the session.');
          keySession.close().then(() => {
            eventBus.trigger({
              type: 'keysessionclosed',
              keySession
            });
            removeSession(initData);
            makeNewRequest(player, requestOptions);
          }).catch(error => {
            const metadata = {
              errorType: Error$1.EMEFailedToCloseSession,
              keySystem
            };
            emeError(error, metadata);
          });
        }
      }, false);
      keySession.generateRequest(initDataType, initData).catch(error => {
        const metadata = {
          errorType: Error$1.EMEFailedToGenerateLicenseRequest,
          keySystem
        };
        emeError(error, metadata);
        reject('Unable to create or initialize key session');
      });
    });
  } catch (error) {
    const metadata = {
      errorType: Error$1.EMEFailedToCreateMediaKeySession,
      keySystem
    };
    emeError(error, metadata);
  }
};
/*
 * Creates a new media key session if media keys are available, otherwise queues the
 * session creation for when the media keys are available.
 *
 * @see {@link https://www.w3.org/TR/encrypted-media/#dom-mediakeysession|MediaKeySession}
 * @see {@link https://www.w3.org/TR/encrypted-media/#dom-mediakeys|MediaKeys}
 *
 * @function addSession
 * @param {Object} video
 *        Target video element
 * @param {string} initDataType
 *        The type of init data provided
 * @param {Uint8Array} initData
 *        The media's init data
 * @param {Object} options
 *        Options provided to the plugin for this key system
 * @param {function()} [getLicense]
 *        User provided function to retrieve a license
 * @param {function()} removeSession
 *        Function to remove the persisted session on key expiration so that a new session
 *        may be created
 * @param {Object} eventBus
 *        Event bus for any events pertinent to users
 * @return {Promise}
 *         A resolved promise if session is waiting for media keys, or a promise for the
 *         session creation if media keys are available
 */

const addSession = ({
  player,
  video,
  initDataType,
  initData,
  options,
  getLicense,
  contentId,
  removeSession,
  eventBus,
  emeError
}) => {
  const sessionData = {
    initDataType,
    initData,
    options,
    getLicense,
    removeSession,
    eventBus,
    contentId,
    emeError,
    keySystem: video.keySystem
  };

  if (video.mediaKeysObject) {
    sessionData.mediaKeys = video.mediaKeysObject;
    return makeNewRequest(player, sessionData);
  }

  video.pendingSessionData.push(sessionData);
  return Promise.resolve();
};
/*
 * Given media keys created from a key system access object, check for any session data
 * that was queued and create new sessions for each.
 *
 * @see {@link https://www.w3.org/TR/encrypted-media/#dom-mediakeysystemaccess|MediaKeySystemAccess}
 * @see {@link https://www.w3.org/TR/encrypted-media/#dom-mediakeysession|MediaKeySession}
 * @see {@link https://www.w3.org/TR/encrypted-media/#dom-mediakeys|MediaKeys}
 *
 * @function addPendingSessions
 * @param {Object} video
 *        Target video element
 * @param {string} [certificate]
 *        The server certificate (if used)
 * @param {Object} createdMediaKeys
 *        Media keys to use for session creation
 * @return {Promise}
 *         A promise containing new session creations and setting of media keys on the
 *         video object
 */

const addPendingSessions = ({
  player,
  video,
  certificate,
  createdMediaKeys,
  emeError
}) => {
  // save media keys on the video element to act as a reference for other functions so
  // that they don't recreate the keys
  video.mediaKeysObject = createdMediaKeys;
  const promises = [];

  if (certificate) {
    promises.push(createdMediaKeys.setServerCertificate(certificate).catch(error => {
      const metadata = {
        errorType: Error$1.EMEFailedToSetServerCertificate,
        keySystem: video.keySystem
      };
      emeError(error, metadata);
    }));
  }

  for (let i = 0; i < video.pendingSessionData.length; i++) {
    const data = video.pendingSessionData[i];
    promises.push(makeNewRequest(player, {
      mediaKeys: video.mediaKeysObject,
      initDataType: data.initDataType,
      initData: data.initData,
      options: data.options,
      getLicense: data.getLicense,
      removeSession: data.removeSession,
      eventBus: data.eventBus,
      contentId: data.contentId,
      emeError: data.emeError,
      keySystem: video.keySystem
    }));
  }

  video.pendingSessionData = [];
  promises.push(video.setMediaKeys(createdMediaKeys).catch(error => {
    const metadata = {
      errorType: Error$1.EMEFailedToAttachMediaKeysToVideoElement,
      keySystem: video.keySystem
    };
    emeError(error, metadata);
  }));
  return Promise.all(promises);
};

const defaultPlayreadyGetLicense = keySystemOptions => (emeOptions, keyMessage, callback) => {
  requestPlayreadyLicense(keySystemOptions, keyMessage, emeOptions, callback);
};

const defaultGetLicense = keySystemOptions => (emeOptions, keyMessage, callback) => {
  const headers = mergeAndRemoveNull({
    'Content-type': 'application/octet-stream'
  }, emeOptions.emeHeaders, keySystemOptions.licenseHeaders);
  videojs.xhr({
    uri: keySystemOptions.url,
    method: 'POST',
    responseType: 'arraybuffer',
    requestType: 'license',
    body: keyMessage,
    headers
  }, httpResponseHandler(callback, true));
};

const promisifyGetLicense = (keySystem, getLicenseFn, eventBus) => {
  return (emeOptions, keyMessage, contentId) => {
    return new Promise((resolve, reject) => {
      const callback = function (err, license) {
        if (eventBus) {
          eventBus.trigger('licenserequestattempted');
        }

        if (err) {
          reject(err);
          return;
        }

        resolve(license);
      };

      if (isFairplayKeySystem(keySystem)) {
        getLicenseFn(emeOptions, contentId, new Uint8Array(keyMessage), callback);
      } else {
        getLicenseFn(emeOptions, keyMessage, callback);
      }
    });
  };
};

const standardizeKeySystemOptions = (keySystem, keySystemOptions) => {
  if (typeof keySystemOptions === 'string') {
    keySystemOptions = {
      url: keySystemOptions
    };
  }

  if (!keySystemOptions.url && keySystemOptions.licenseUri) {
    keySystemOptions.url = keySystemOptions.licenseUri;
  }

  if (!keySystemOptions.url && !keySystemOptions.getLicense) {
    throw new Error(`Missing url/licenseUri or getLicense in ${keySystem} keySystem configuration.`);
  }

  const isFairplay = isFairplayKeySystem(keySystem);

  if (isFairplay && keySystemOptions.certificateUri && !keySystemOptions.getCertificate) {
    keySystemOptions.getCertificate = defaultGetCertificate(keySystemOptions);
  }

  if (isFairplay && !keySystemOptions.getCertificate) {
    throw new Error(`Missing getCertificate or certificateUri in ${keySystem} keySystem configuration.`);
  }

  if (isFairplay && !keySystemOptions.getContentId) {
    keySystemOptions.getContentId = defaultGetContentId;
  }

  if (keySystemOptions.url && !keySystemOptions.getLicense) {
    if (keySystem === 'com.microsoft.playready') {
      keySystemOptions.getLicense = defaultPlayreadyGetLicense(keySystemOptions);
    } else if (isFairplay) {
      keySystemOptions.getLicense = defaultGetLicense$1(keySystemOptions);
    } else {
      keySystemOptions.getLicense = defaultGetLicense(keySystemOptions);
    }
  }

  return keySystemOptions;
};

const standard5July2016 = ({
  player,
  video,
  initDataType,
  initData,
  keySystemAccess,
  options,
  removeSession,
  eventBus,
  emeError
}) => {
  let keySystemPromise = Promise.resolve();
  const keySystem = keySystemAccess.keySystem;
  let keySystemOptions; // try catch so that we return a promise rejection

  try {
    keySystemOptions = standardizeKeySystemOptions(keySystem, options.keySystems[keySystem]);
  } catch (e) {
    return Promise.reject(e);
  }

  const contentId = keySystemOptions.getContentId ? keySystemOptions.getContentId(options, uint8ArrayToString(initData)) : null;

  if (typeof video.mediaKeysObject === 'undefined') {
    // Prevent entering this path again.
    video.mediaKeysObject = null; // Will store all initData until the MediaKeys is ready.

    video.pendingSessionData = [];
    let certificate;
    keySystemPromise = new Promise((resolve, reject) => {
      // save key system for adding sessions
      video.keySystem = keySystem;

      if (!keySystemOptions.getCertificate) {
        resolve(keySystemAccess);
        return;
      }

      keySystemOptions.getCertificate(options, (err, cert) => {
        if (err) {
          reject(err);
          return;
        }

        certificate = cert;
        resolve();
      });
    }).then(() => {
      return keySystemAccess.createMediaKeys();
    }).then(createdMediaKeys => {
      eventBus.trigger({
        type: 'keysystemaccesscomplete',
        mediaKeys: createdMediaKeys
      });
      return addPendingSessions({
        player,
        video,
        certificate,
        createdMediaKeys,
        emeError
      });
    }).catch(err => {
      const metadata = {
        errorType: Error$1.EMEFailedToCreateMediaKeys,
        keySystem
      };
      emeError(err, metadata); // if we have a specific error message, use it, otherwise show a more
      // generic one

      if (err) {
        return Promise.reject(err);
      }

      return Promise.reject('Failed to create and initialize a MediaKeys object');
    });
  }

  return keySystemPromise.then(() => {
    // if key system has not been determined then addSession doesn't need getLicense
    const getLicense = video.keySystem ? promisifyGetLicense(keySystem, keySystemOptions.getLicense, eventBus) : null;
    return addSession({
      player,
      video,
      initDataType,
      initData,
      options,
      getLicense,
      contentId,
      removeSession,
      eventBus,
      emeError
    });
  });
};

/**
 * The W3C Working Draft of 22 October 2013 seems to be the best match for
 * the ms-prefixed API. However, it should only be used as a guide; it is
 * doubtful the spec is 100% implemented as described.
 *
 * @see https://www.w3.org/TR/2013/WD-encrypted-media-20131022
 * @see https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/compatibility/mt598601(v=vs.85)
 */
const PLAYREADY_KEY_SYSTEM = 'com.microsoft.playready';
const addKeyToSession = (options, session, event, eventBus, emeError) => {
  let playreadyOptions = options.keySystems[PLAYREADY_KEY_SYSTEM];

  if (typeof playreadyOptions.getKey === 'function') {
    playreadyOptions.getKey(options, event.destinationURL, event.message.buffer, (err, key) => {
      if (err) {
        const metadata = {
          errorType: Error$1.EMEFailedToRequestMediaKeySystemAccess,
          config: getMediaKeySystemConfigurations(options.keySystems)
        };
        emeError(err, metadata);
        eventBus.trigger({
          message: 'Unable to get key: ' + err,
          target: session,
          type: 'mskeyerror'
        });
        return;
      }

      session.update(key);
      eventBus.trigger({
        type: 'keysessionupdated',
        keySession: session
      });
    });
    return;
  }

  if (typeof playreadyOptions === 'string') {
    playreadyOptions = {
      url: playreadyOptions
    };
  } else if (typeof playreadyOptions === 'boolean') {
    playreadyOptions = {};
  }

  if (!playreadyOptions.url) {
    playreadyOptions.url = event.destinationURL;
  }

  const callback = (err, responseBody) => {
    if (eventBus) {
      eventBus.trigger('licenserequestattempted');
    }

    if (err) {
      const metadata = {
        errorType: Error$1.EMEFailedToGenerateLicenseRequest,
        keySystem: PLAYREADY_KEY_SYSTEM
      };
      emeError(err, metadata);
      eventBus.trigger({
        message: 'Unable to request key from url: ' + playreadyOptions.url,
        target: session,
        type: 'mskeyerror'
      });
      return;
    }

    session.update(new Uint8Array(responseBody));
  };

  if (playreadyOptions.getLicense) {
    playreadyOptions.getLicense(options, event.message.buffer, callback);
  } else {
    requestPlayreadyLicense(playreadyOptions, event.message.buffer, options, callback);
  }
};
const createSession = (video, initData, options, eventBus, emeError) => {
  // Note: invalid mime type passed here throws a NotSupportedError
  const session = video.msKeys.createSession('video/mp4', initData);

  if (!session) {
    const error = new Error('Could not create key session.');
    const metadata = {
      errorType: Error$1.EMEFailedToCreateMediaKeySession,
      keySystem: PLAYREADY_KEY_SYSTEM
    };
    emeError(error, metadata);
    throw error;
  }

  eventBus.trigger({
    type: 'keysessioncreated',
    keySession: session
  }); // Note that mskeymessage may not always be called for PlayReady:
  //
  // "If initData contains a PlayReady object that contains an OnDemand header, only a
  // keyAdded event is returned (as opposed to a keyMessage event as described in the
  // Encrypted Media Extension draft). Similarly, if initData contains a PlayReady object
  // that contains a key identifier in the hashed data storage (HDS), only a keyAdded
  // event is returned."
  // eslint-disable-next-line max-len
  // @see [PlayReady License Acquisition]{@link https://msdn.microsoft.com/en-us/library/dn468979.aspx}

  session.addEventListener('mskeymessage', event => {
    eventBus.trigger({
      type: 'keymessage',
      messageEvent: event
    });
    addKeyToSession(options, session, event, eventBus, emeError);
  });
  session.addEventListener('mskeyerror', event => {
    const metadata = {
      errorType: Error$1.EMEFailedToCreateMediaKeySession,
      keySystem: PLAYREADY_KEY_SYSTEM
    };
    emeError(session.error, metadata);
    eventBus.trigger({
      message: 'Unexpected key error from key session with ' + `code: ${session.error.code} and systemCode: ${session.error.systemCode}`,
      target: session,
      type: 'mskeyerror'
    });
  });
  session.addEventListener('mskeyadded', () => {
    eventBus.trigger({
      target: session,
      type: 'mskeyadded'
    });
  });
};
var msPrefixed = (({
  video,
  initData,
  options,
  eventBus,
  emeError
}) => {
  // Although by the standard examples the presence of video.msKeys is checked first to
  // verify that we aren't trying to create a new session when one already exists, here
  // sessions are managed earlier (on the player.eme object), meaning that at this point
  // any existing keys should be cleaned up.
  // TODO: Will this break rotation? Is it safe?
  if (video.msKeys) {
    delete video.msKeys;
  }

  try {
    video.msSetMediaKeys(new window.MSMediaKeys(PLAYREADY_KEY_SYSTEM));
  } catch (e) {
    const metadata = {
      errorType: Error$1.EMEFailedToCreateMediaKeys,
      keySystem: PLAYREADY_KEY_SYSTEM
    };
    emeError(e, metadata);
    throw new Error('Unable to create media keys for PlayReady key system. ' + 'Error: ' + e.message);
  }

  createSession(video, initData, options, eventBus, emeError);
});

const genericConfig = [{
  initDataTypes: ['cenc'],
  audioCapabilities: [{
    contentType: 'audio/mp4;codecs="mp4a.40.2"'
  }],
  videoCapabilities: [{
    contentType: 'video/mp4;codecs="avc1.42E01E"'
  }]
}];
const keySystems = [// Fairplay
// Requires different config than other CDMs
{
  keySystem: 'com.apple.fps',
  supportedConfig: [{
    initDataTypes: ['sinf'],
    videoCapabilities: [{
      contentType: 'video/mp4'
    }]
  }]
}, // Playready
{
  keySystem: 'com.microsoft.playready.recommendation',
  supportedConfig: genericConfig
}, // Widevine
{
  keySystem: 'com.widevine.alpha',
  supportedConfig: genericConfig
}, // Clear
{
  keySystem: 'org.w3.clearkey',
  supportedConfig: genericConfig
}]; // Asynchronously detect the list of supported CDMs by requesting key system access
// when possible, otherwise rely on browser-specific EME API feature detection.

const detectSupportedCDMs = () => {
  const Promise = window.Promise;
  const results = {
    fairplay: Boolean(window.WebKitMediaKeys),
    playready: false,
    widevine: false,
    clearkey: false
  };

  if (!window.MediaKeys || !window.navigator.requestMediaKeySystemAccess) {
    return Promise.resolve(results);
  }

  return Promise.all(keySystems.map(({
    keySystem,
    supportedConfig
  }) => {
    return window.navigator.requestMediaKeySystemAccess(keySystem, supportedConfig).catch(() => {});
  })).then(([fairplay, playready, widevine, clearkey]) => {
    results.fairplay = Boolean(fairplay);
    results.playready = Boolean(playready);
    results.widevine = Boolean(widevine);
    results.clearkey = Boolean(clearkey);
    return results;
  });
};

var version = "5.3.0";

const hasSession = (sessions, initData) => {
  for (let i = 0; i < sessions.length; i++) {
    // Other types of sessions may be in the sessions array that don't store the initData
    // (for instance, PlayReady sessions on IE11).
    if (!sessions[i].initData) {
      continue;
    } // initData should be an ArrayBuffer by the spec:
    // eslint-disable-next-line max-len
    // @see [Media Encrypted Event initData Spec]{@link https://www.w3.org/TR/encrypted-media/#mediaencryptedeventinit}
    //
    // However, on some browsers it may come back with a typed array view of the buffer.
    // This is the case for IE11, however, since IE11 sessions are handled differently
    // (following the msneedkey PlayReady path), this coversion may not be important. It
    // is safe though, and might be a good idea to retain in the short term (until we have
    // catalogued the full range of browsers and their implementations).


    const sessionBuffer = arrayBufferFrom(sessions[i].initData);
    const initDataBuffer = arrayBufferFrom(initData);

    if (arrayBuffersEqual(sessionBuffer, initDataBuffer)) {
      return true;
    }
  }

  return false;
};
const removeSession = (sessions, initData) => {
  for (let i = 0; i < sessions.length; i++) {
    if (sessions[i].initData === initData) {
      sessions.splice(i, 1);
      return;
    }
  }
};
const handleEncryptedEvent = (player, event, options, sessions, eventBus, emeError) => {
  if (!options || !options.keySystems) {
    // return silently since it may be handled by a different system
    return Promise.resolve();
  } // Legacy fairplay is the keysystem 'com.apple.fps.1_0'.
  // If we are using this keysystem we want to use WebkitMediaKeys.
  // This can be initialized manually with initLegacyFairplay().


  if (options.keySystems[LEGACY_FAIRPLAY_KEY_SYSTEM]) {
    videojs.log.debug('eme', `Ignoring \'encrypted\' event, using legacy fairplay keySystem ${LEGACY_FAIRPLAY_KEY_SYSTEM}`);
    return Promise.resolve();
  }

  let initData = event.initData;
  return getSupportedKeySystem(options.keySystems).then(keySystemAccess => {
    const keySystem = keySystemAccess.keySystem; // Use existing init data from options if provided

    if (options.keySystems[keySystem] && options.keySystems[keySystem].pssh) {
      initData = options.keySystems[keySystem].pssh;
    } // "Initialization Data must be a fixed value for a given set of stream(s) or media
    // data. It must only contain information related to the keys required to play a given
    // set of stream(s) or media data."
    // eslint-disable-next-line max-len
    // @see [Initialization Data Spec]{@link https://www.w3.org/TR/encrypted-media/#initialization-data}


    if (hasSession(sessions, initData) || !initData) {
      // TODO convert to videojs.log.debug and add back in
      // https://github.com/videojs/video.js/pull/4780
      // videojs.log('eme',
      //             'Already have a configured session for init data, ignoring event.');
      return Promise.resolve();
    }

    sessions.push({
      initData
    });
    return standard5July2016({
      player,
      video: event.target,
      initDataType: event.initDataType,
      initData,
      keySystemAccess,
      options,
      removeSession: removeSession.bind(null, sessions),
      eventBus,
      emeError
    });
  }).catch(error => {
    const metadata = {
      errorType: Error$1.EMEFailedToRequestMediaKeySystemAccess,
      config: getMediaKeySystemConfigurations(options.keySystems)
    };
    emeError(error, metadata);
  });
};
const handleWebKitNeedKeyEvent = (event, options, eventBus, emeError) => {
  if (!options.keySystems || !options.keySystems[LEGACY_FAIRPLAY_KEY_SYSTEM] || !event.initData) {
    // return silently since it may be handled by a different system
    return Promise.resolve();
  } // From Apple's example Safari FairPlay integration code, webkitneedkey is not repeated
  // for the same content. Unless documentation is found to present the opposite, handle
  // all webkitneedkey events the same (even if they are repeated).


  return fairplay({
    video: event.target,
    initData: event.initData,
    options,
    eventBus,
    emeError
  });
};
const handleMsNeedKeyEvent = (event, options, sessions, eventBus, emeError) => {
  if (!options.keySystems || !options.keySystems[PLAYREADY_KEY_SYSTEM]) {
    // return silently since it may be handled by a different system
    return;
  } // "With PlayReady content protection, your Web app must handle the first needKey event,
  // but it must then ignore any other needKey event that occurs."
  // eslint-disable-next-line max-len
  // @see [PlayReady License Acquisition]{@link https://msdn.microsoft.com/en-us/library/dn468979.aspx}
  //
  // Usually (and as per the example in the link above) this is determined by checking for
  // the existence of video.msKeys. However, since the video element may be reused, it's
  // easier to directly manage the session.


  if (sessions.reduce((acc, session) => acc || session.playready, false)) {
    // TODO convert to videojs.log.debug and add back in
    // https://github.com/videojs/video.js/pull/4780
    // videojs.log('eme',
    //             'An \'msneedkey\' event was receieved earlier, ignoring event.');
    return;
  }

  let initData = event.initData; // Use existing init data from options if provided

  if (options.keySystems[PLAYREADY_KEY_SYSTEM] && options.keySystems[PLAYREADY_KEY_SYSTEM].pssh) {
    initData = options.keySystems[PLAYREADY_KEY_SYSTEM].pssh;
  }

  if (!initData) {
    return;
  }

  sessions.push({
    playready: true,
    initData
  });
  msPrefixed({
    video: event.target,
    initData,
    options,
    eventBus,
    emeError
  });
};
const getOptions = player => {
  return merge(player.currentSource(), player.eme.options);
};
/**
 * Configure a persistent sessions array and activeSrc property to ensure we properly
 * handle each independent source's events. Should be run on any encrypted or needkey
 * style event to ensure that the sessions reflect the active source.
 *
 * @function setupSessions
 * @param    {Player} player
 */

const setupSessions = player => {
  const src = player.src();

  if (src !== player.eme.activeSrc) {
    player.eme.activeSrc = src;
    player.eme.sessions = [];
  }
};
/**
 * Construct a simple function that can be used to dispatch EME errors on the
 * player directly, such as providing it to a `.catch()`.
 *
 * @function emeErrorHandler
 * @param    {Player} player
 * @return   {Function}
 */

const emeErrorHandler = player => {
  return (objOrErr, metadata) => {
    const error = {
      // MEDIA_ERR_ENCRYPTED is code 5
      code: 5
    };

    if (typeof objOrErr === 'string') {
      error.message = objOrErr;
    } else if (objOrErr) {
      if (objOrErr.message) {
        error.message = objOrErr.message;
      }

      if (objOrErr.cause && (objOrErr.cause.length || objOrErr.cause.byteLength)) {
        error.cause = objOrErr.cause;
      }

      if (objOrErr.keySystem) {
        error.keySystem = objOrErr.keySystem;
      } // pass along original error object.


      error.originalError = objOrErr;
    }

    if (metadata) {
      error.metadata = metadata;
    }

    player.error(error);
  };
};
/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Function} emeError
 */

const onPlayerReady = (player, emeError) => {
  if (player.$('.vjs-tech').tagName.toLowerCase() !== 'video') {
    return;
  }

  setupSessions(player);

  if (window.MediaKeys) {
    // Support EME 05 July 2016
    // Chrome 42+, Firefox 47+, Edge, Safari 12.1+ on macOS 10.14+
    player.tech_.el_.addEventListener('encrypted', event => {
      videojs.log.debug('eme', 'Received an \'encrypted\' event');
      setupSessions(player);
      handleEncryptedEvent(player, event, getOptions(player), player.eme.sessions, player.tech_, emeError);
    });
  } else if (window.WebKitMediaKeys) {
    player.eme.initLegacyFairplay();
  } else if (window.MSMediaKeys) {
    // IE11 Windows 8.1+
    // Since IE11 doesn't support promises, we have to use a combination of
    // try/catch blocks and event handling to simulate promise rejection.
    // Functionally speaking, there should be no discernible difference between
    // the behavior of IE11 and those of other browsers.
    player.tech_.el_.addEventListener('msneedkey', event => {
      videojs.log.debug('eme', 'Received an \'msneedkey\' event');
      setupSessions(player);

      try {
        handleMsNeedKeyEvent(event, getOptions(player), player.eme.sessions, player.tech_, emeError);
      } catch (error) {
        emeError(error);
      }
    });

    const msKeyErrorCallback = error => {
      emeError(error);
    };

    player.tech_.on('mskeyerror', msKeyErrorCallback); // TODO: refactor this plugin so it can use a plugin dispose

    player.on('dispose', () => {
      player.tech_.off('mskeyerror', msKeyErrorCallback);
    });
  }
};
/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function eme
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */


const eme = function (options = {}) {
  const player = this;
  const emeError = emeErrorHandler(player);
  player.ready(() => onPlayerReady(player, emeError)); // Plugin API

  player.eme = {
    /**
    * Sets up MediaKeys on demand
    * Works around https://bugs.chromium.org/p/chromium/issues/detail?id=895449
    *
    * @function initializeMediaKeys
    * @param    {Object} [emeOptions={}]
    *           An object of eme plugin options.
    * @param    {Function} [callback=function(){}]
    * @param    {boolean} [suppressErrorIfPossible=false]
    */
    initializeMediaKeys(emeOptions = {}, callback = function () {}, suppressErrorIfPossible = false) {
      // TODO: this should be refactored and renamed to be less tied
      // to encrypted events
      const mergedEmeOptions = merge(player.currentSource(), options, emeOptions); // fake an encrypted event for handleEncryptedEvent

      const mockEncryptedEvent = {
        initDataType: 'cenc',
        initData: null,
        target: player.tech_.el_
      };
      setupSessions(player);

      if (window.MediaKeys) {
        handleEncryptedEvent(player, mockEncryptedEvent, mergedEmeOptions, player.eme.sessions, player.tech_, emeError).then(() => callback()).catch(error => {
          callback(error);

          if (!suppressErrorIfPossible) {
            emeError(error);
          }
        });
      } else if (window.MSMediaKeys) {
        const msKeyHandler = event => {
          player.tech_.off('mskeyadded', msKeyHandler);
          player.tech_.off('mskeyerror', msKeyHandler);

          if (event.type === 'mskeyerror') {
            callback(event.target.error);

            if (!suppressErrorIfPossible) {
              emeError(event.message);
            }
          } else {
            callback();
          }
        };

        player.tech_.one('mskeyadded', msKeyHandler);
        player.tech_.one('mskeyerror', msKeyHandler);

        try {
          handleMsNeedKeyEvent(mockEncryptedEvent, mergedEmeOptions, player.eme.sessions, player.tech_, emeError);
        } catch (error) {
          player.tech_.off('mskeyadded', msKeyHandler);
          player.tech_.off('mskeyerror', msKeyHandler);
          callback(error);

          if (!suppressErrorIfPossible) {
            emeError(error);
          }
        }
      }
    },

    initLegacyFairplay() {
      const handleFn = event => {
        videojs.log.debug('eme', 'Received a \'webkitneedkey\' event'); // TODO it's possible that the video state must be cleared if reusing the same video
        // element between sources

        setupSessions(player);
        handleWebKitNeedKeyEvent(event, getOptions(player), player.tech_).catch(error => {
          emeError(error);
        });
      };

      const webkitNeedKeyEventHandler = event => {
        const firstWebkitneedkeyTimeout = getOptions(player).firstWebkitneedkeyTimeout || 1000;
        const src = player.src(); // on source change or first startup reset webkitneedkey options.

        player.eme.webkitneedkey_ = player.eme.webkitneedkey_ || {}; // if the source changed we need to handle the first event again.
        // track source changes internally.

        if (player.eme.webkitneedkey_.src !== src) {
          player.eme.webkitneedkey_ = {
            handledFirstEvent: false,
            src
          };
        } // It's possible that at the start of playback a rendition switch
        // on a small player in safari's HLS implementation will cause
        // two webkitneedkey events to occur. We want to make sure to cancel
        // our first existing request if we get another within 1 second. This
        // prevents a non-fatal player error from showing up due to a
        // request failure.


        if (!player.eme.webkitneedkey_.handledFirstEvent) {
          // clear the old timeout so that a new one can be created
          // with the new rendition's event data
          player.clearTimeout(player.eme.webkitneedkey_.timeout);
          player.eme.webkitneedkey_.timeout = player.setTimeout(() => {
            player.eme.webkitneedkey_.handledFirstEvent = true;
            player.eme.webkitneedkey_.timeout = null;
            handleFn(event);
          }, firstWebkitneedkeyTimeout); // after we have a verified first request, we will request on
          // every other event like normal.
        } else {
          handleFn(event);
        }
      };

      let videoElement = player.tech_.el_; // Support Safari EME with FairPlay
      // (also used in early Chrome or Chrome with EME disabled flag)

      videoElement.addEventListener('webkitneedkey', webkitNeedKeyEventHandler);

      const cleanup = () => {
        videoElement.removeEventListener('webkitneedkey', webkitNeedKeyEventHandler);
        videoElement = null;
      }; // auto-cleanup:


      player.on('dispose', () => {
        cleanup();
      }); // returning for manual cleanup

      return cleanup;
    },

    detectSupportedCDMs,
    options
  };
}; // Register the plugin with video.js.


videojs.registerPlugin('eme', eme); // contrib-eme specific error const

eme.Error = Error$1; // Include the version number.

eme.VERSION = version;

export { eme as default, emeErrorHandler, getOptions, handleEncryptedEvent, handleMsNeedKeyEvent, handleWebKitNeedKeyEvent, hasSession, removeSession, setupSessions };
