/*1294075933,176832697*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "jXGVD" ]);
}

var ChannelRebuildReasons = {
	Unknown : 0,
	AsyncError : 1,
	TooLong : 2,
	Refresh : 3,
	RefreshDelay : 4,
	UIRestart : 5,
	NeedSeq : 6,
	PrevFailed : 7,
	IFrameLoadGiveUp : 8,
	IFrameLoadRetry : 9,
	IFrameLoadRetryWorked : 10,
	PageTransitionRetry : 11,
	IFrameLoadMaxSubdomain : 12,
	ChannelUnknown : 100,
	ChannelNoCUser : 101,
	ChannelInvalidCUser : 102,
	ChannelInvalidChanstr : 103,
	ChannelChDistribTimeout : 104,
	ChannelGetChannelOther : 105,
	ChannelNodeShutdown : 106,
	ChannelTermination : 107,
	ChannelUserMismatch : 108,
	ChannelUserMismatchShady : 109,
	ChannelBadXs : 110,
	ChannelSeqNeg : 111,
	ChannelSeqTooBig : 112,
	ChannelSeqTooSmall : 113,
	ChannelUnexpectedJoin : 114,
	ChannelInvalidXsCookie : 115
};
var CrossDocument = {};
(function() {
	CrossDocument.setListener = function(eventHandler) {
		if (window.postMessage) {
			if (window.addEventListener) {
				window.addEventListener('message', eventHandler, false);
			} else
				window.onmessage = eventHandler;
		} else if (document.postMessage)
			document.addEventListener('message', eventHandler, false);
	};
	CrossDocument.mkPostMessage = function(targetWindow, targetDocument,
			msgHandler) {
		if (window.postMessage) {
			if ("object" == typeof window.postMessage) {
				return function(message, origin) {
					targetWindow.postMessage(message, origin);
				};
			} else
				return bind(targetWindow, targetWindow.postMessage);
		} else if (document.postMessage) {
			return bind(targetDocument, targetDocument.postMessage);
		} else
			return bind(targetWindow, msgHandler);
	};
	CrossDocument.targetOrigin = function(parent) {
		if (window.postMessage || document.postMessage) {
			var parentLoc = parent.location;
			var parentHost = parentLoc.hostname;
			if (parentHost == 'facebook.com'
					|| parentHost.substring(parentHost.length - 13) == '.facebook.com')
				return parentLoc.protocol + '//' + parentLoc.host;
		} else
			return null;
	};
	var _handleMessage = function(msgCallback, msgStr) {
		if (!msgStr || msgStr.charAt(0) != '{')
			return;
		var msg = eval('(' + msgStr + ')');
		return msgCallback(msg);
	};
	CrossDocument.mkEventHandler = function(msgCallback) {
		return function(event) {
			event = event || window.event;
			var domain = (event.domain || event.origin);
			if (domain.substring(domain.length - 13) != '.facebook.com'
					&& domain.substring(domain.length - 15) != '://facebook.com'
					&& domain != 'facebook.com')
				return;
			return _handleMessage(msgCallback, event.data);
		};
	};
	CrossDocument.mkMessageHandler = function(msgCallback) {
		return function(msgStr) {
			return _handleMessage(msgCallback, msgStr);
		};
	};
})();
function rand32() {
	return Math.floor(Math.random() * 4294967295);
}
function verifyNumber(a) {
	if (typeof a == 'undefined' || isNaN(a) || a == Number.POSITIVE_INFINITY
			|| a == Number.NEGATIVE_INFINITY)
		a = 0;
	return a;
}
function LiveMessageReceiver(a) {
	this.eventName = a;
	this.subs = null;
	this.handler = bagofholding;
	this.shutdownHandler = null;
	this.restartHandler = null;
	this.registered = false;
	this.appId = 1;
}
LiveMessageReceiver.prototype.setAppId = function(a) {
	this.appId = a;
	return this;
};
LiveMessageReceiver.prototype.setHandler = function(a) {
	this.handler = a;
	this._dirty();
	return this;
};
LiveMessageReceiver.prototype.setRestartHandler = function(a) {
	this.restartHandler = a.shield();
	this._dirty();
	return this;
};
LiveMessageReceiver.prototype.setShutdownHandler = function(a) {
	this.shutdownHandler = a.shield();
	this._dirty();
	return this;
};
LiveMessageReceiver.prototype._dirty = function() {
	if (this.registered) {
		this.unregister();
		this.register();
	}
};
LiveMessageReceiver.prototype.register = function() {
	var b = function(d, c) {
		return this.handler(c);
	}.bind(this);
	var a = PresenceMessage.getAppMessageType(this.appId, this.eventName);
	this.subs = {};
	this.subs.main = Arbiter.subscribe(a, b);
	if (this.shutdownHandler)
		this.subs.shut = Arbiter.subscribe(PresenceMessage.SHUTDOWN,
				this.shutdownHandler);
	if (this.restartHandler)
		this.subs.restart = Arbiter.subscribe(PresenceMessage.RESTARTED,
				this.restartHandler);
	this.registered = true;
	return this;
};
LiveMessageReceiver.prototype.unregister = function() {
	if (!this.subs)
		return this;
	for ( var a in this.subs)
		if (this.subs[a])
			Arbiter.unsubscribe(this.subs[a]);
	this.subs = null;
	this.registered = false;
	return this;
};
LiveMessageReceiver.route = function(b) {
	var a = function(c) {
		var d = PresenceMessage.getAppMessageType(b.app_id, b.event_name);
		Arbiter.inform(d, c, Arbiter.BEHAVIOR_PERSISTENT);
	};
	if (b.hasCapture) {
		new AsyncRequest().setHandler(function(c) {
			a(c.getPayload());
		}).setAllowCrossPageTransition(true).handleResponse(b.response);
	} else
		a(b.response);
};
function ChannelManager(b, f, e, a, d, c) {
	this.user = f;
	this.iframeLoadMaxRetries = 1;
	this.iframeLoadMaxSubdomain = 6;
	this.expectResponseTimeout = 5000;
	this.retryInterval = e;
	this.channelConfig = a;
	this._init(b, d);
	this.loginErrorGk = c;
}
ChannelManager.prototype = {
	_init : function(c, d) {
		this.channelManagerId = rand32();
		this.channel = {
			name : null,
			iframeHost : null,
			iframePort : null,
			iframePath : null
		};
		this.isActionRequest = true;
		this.isReady = false;
		this.isRebuilding = false;
		this.iframeIsLoaded = false;
		this.iframeEverLoaded = false;
		this.iframeCheckFailedCount = 0;
		this.permaShutdown = false;
		this.shouldClearSubdomain = false;
		this.subframe = c;
		this.postMessage = null;
		var a = presenceCookieManager.getSubCookie('ch');
		if (d) {
			this.iframeSubdomain = null;
		} else {
			this.iframeSubdomain = 0;
			if (a && a.sub) {
				for ( var b = 0; b < a.sub.length; b++)
					if (!a.sub[b]) {
						this.iframeSubdomain = b;
						break;
					}
				if (b == a.sub.length)
					if (b == this.iframeLoadMaxSubdomain && URI().isSecure()) {
						this.iframeSubdomain = null;
						presence
								.error('channel: iframe max subdomains reached');
						this
								._sendDummyReconnect(ChannelRebuildReasons.IFrameLoadMaxSubdomain);
					} else
						this.iframeSubdomain = a.sub.length;
			}
		}
		var e = ua.safari();
		this.pollForMessages = (e > 523 && e < 525);
		this.useRandomSubdomain = !!ua.ie();
		this.useRandomSubdomain = this.useRandomSubdomain && !URI().isSecure();
		this.handleIframeEvent = CrossDocument
				.mkEventHandler(this._handleIframeMessage.bind(this));
		this.handleIframeMessage = CrossDocument
				.mkMessageHandler(this._handleIframeMessage.bind(this));
		CrossDocument.setListener(this.handleIframeEvent.bind(this));
		presenceCookieManager.register('ch', this._getCookieInfo.bind(this));
		if (typeof window.onpageshow != 'undefined') {
			Event.listen(window, 'pagehide', this._onUnload.bind(this));
			Event.listen(window, 'pageshow', this.rebuild.bind(this,
					ChannelRebuildReasons.Refresh));
		} else
			onunloadRegister(this._onUnload.bind(this));
	},
	sendIframeMessage : function(b) {
		if (!this.postMessage)
			return;
		var c = JSON.encode(b);
		try {
			this.postMessage(c, this.targetOrigin);
		} catch (a) {
			presence.error('channel: iframe msg error: ' + 'message "' + c
					+ '" and error ' + a.toString());
		}
	},
	_handleIframeMessage : function(a) {
		if (a.type == 'init') {
			this.iframeLoaded();
		} else if (a.type == 'channelMsg') {
			this.handleChannelMsg(a.channel, a.msg);
		} else if (a.type == 'log')
			window.chatErrorLog && window.chatErrorLog.log(a.msg);
	},
	_onUnload : function() {
		this.shouldClearSubdomain = true;
		presence.doSync(true);
	},
	addChannel : function(a, d, b, f, e, c) {
		if (this.channel.name !== null) {
			presence.error("channel: addChannel called twice");
			return;
		}
		this.channel.name = a;
		this.channel.currentSeq = d;
		this.channel.msgHandler = b;
		this.channel.startHandler = f;
		this.channel.shutdownHandler = e;
		this.channel.restartHandler = c;
	},
	_getCookieInfo : function() {
		var b = {};
		if (this.channel.iframeHost) {
			b.h = this.channel.iframeHost;
			if (this.channel.iframePort)
				b.p = this.channel.iframePort;
			if (null !== this.iframeSubdomain) {
				var a = presenceCookieManager.getSubCookie('ch');
				var e = (a && a.sub) ? a.sub : [];
				var d = e.length;
				if (this.shouldClearSubdomain) {
					e[this.iframeSubdomain] = 0;
				} else {
					e[this.iframeSubdomain] = 1;
					for ( var c = d; c <= this.iframeSubdomain; c++)
						if (!e[c])
							e[c] = 0;
				}
				b.sub = e;
			}
			b[this.channel.name] = this.channel.currentSeq;
		}
		b.ri = this.retryInterval;
		return b;
	},
	getConfig : function(c, b) {
		var a = this.channelConfig;
		return a && (c in a) ? a[c] : b;
	},
	stop : function() {
		this.stopped = true;
		this.setReady(false);
	},
	setReady : function(a) {
		this.isReady = a;
		var b = {
			type : 'isReady',
			isReady : a,
			isActionRequest : this.isActionRequest
		};
		if (a && this.isActionRequest)
			this.isActionRequest = false;
		if (a) {
			b.channelName = this.channel.name;
			b.currentSeq = this.channel.currentSeq;
			b.channelManagerId = this.channelManagerId;
			b.channelConfig = this.channelConfig;
		}
		this.sendIframeMessage(b);
	},
	setActionRequest : function(a) {
		this.sendIframeMessage( {
			type : 'isActionRequest',
			isActionRequest : a
		});
	},
	expectResponse : function() {
		this.sendIframeMessage( {
			type : 'expectResponse',
			newTimeout : this.expectResponseTimeout
		});
	},
	_iframeUrl : function(a, c, b) {
		var d;
		if (null === this.iframeSubdomain) {
			d = '';
		} else {
			d = this.iframeSubdomain;
			if (this.useRandomSubdomain)
				d += '' + rand32();
			d += URI().isSecure() ? '-' : '.';
		}
		return new URI().setDomain(d + a + '.facebook.com').setPort(c).setPath(
				b).setSecure(URI().isSecure()).toString();
	},
	iframeLoad : function(d, b, e, c) {
		this.isReady = c;
		this.iframeIsLoaded = false;
		this.channel.iframePath = d;
		this.channel.iframeHost = b;
		this.channel.iframePort = e;
		var g = this._iframeUrl(b, e, d);
		this._iframeCheck.bind(this).defer(
				this.getConfig('IFRAME_LOAD_TIMEOUT', 30000));
		var f = null;
		if (!ua.ie() || ua.ie() < 8)
			try {
				f = this.subframe.contentDocument;
			} catch (a) {
			}
		if (f) {
			try {
				f.location.replace(g);
			} catch (a) {
				presence.error('channel: error setting location: ' + a
						.toString());
			}
		} else if (this.subframe.contentWindow) {
			this.subframe.src = g;
		} else if (this.subframe.document) {
			this.subframe.src = g;
		} else
			presence.error('channel: error setting subframe url');
		Event.listen(this.subframe, 'load', this._checkProxy.bind(this));
		presence.debug('channel: done with iframeLoad, subframe sent to ' + g);
	},
	_checkProxy : function() {
		if (this.iframeIsLoaded)
			return;
		try {
			this.subframe.contentWindow.document.body.innerHTML;
		} catch (a) {
			presence.error('channel:iframe_loaded_with_error:' + a);
		}
	},
	iframeLoaded : function() {
		if (!this.iframeIsLoaded) {
			this.iframeIsLoaded = true;
			this.postMessage = CrossDocument
					.mkPostMessage(
							this.subframe.contentWindow,
							this.subframe.contentDocument,
							this.subframe.contentWindow.channelUplink.handleParentMessage);
			this.targetOrigin = "*";
			this.setReady(this.isReady);
			if (this.pollForMessages)
				this.msgCheckInterval = setInterval(this.handleChannelMsgCheck
						.bind(this), 100);
			if (this.iframeCheckFailedCount) {
				this.channel.restartHandler(false);
				this
						._sendDummyReconnect(ChannelRebuildReasons.IFrameLoadRetryWorked);
			} else
				this.channel.startHandler();
			this.iframeCheckFailedCount = 0;
			this.iframeEverLoaded = true;
		}
	},
	_iframeCheck : function() {
		if (!this.iframeIsLoaded) {
			this.iframeCheckFailedCount++;
			this.channel.iframeHost = this.channel.iframePort = this.channel.iframePath = 0;
			presenceCookieManager.store();
			if (this.iframeCheckFailedCount <= this.iframeLoadMaxRetries) {
				this.channel.iframePath = null;
				this.rebuild(ChannelRebuildReasons.IFrameLoadRetry);
			} else {
				presence
						.error("channel: uplink iframe never loaded: shutting down ("
								+ this.channel.iframeHost + ")");
				this.channel.shutdownHandler();
				this
						._sendDummyReconnect(ChannelRebuildReasons.IFrameLoadGiveUp);
			}
		} else
			this.retryInterval = 0;
	},
	_sendDummyReconnect : function(b) {
		var a = new AsyncRequest().setURI('/ajax/presence/reconnect.php')
				.setData( {
					reason : b,
					iframe_loaded : this.iframeEverLoaded
				}).setOption('suppressErrorHandlerWarning', true).setOption(
						'retries', 1).setMethod('GET').setReadOnly(true)
				.setAllowCrossPageTransition(true);
		a.specifiesWriteRequiredParams() && a.send();
	},
	_rebuildResponse : function(c) {
		var b = c.getPayload();
		var a = b.user_channel;
		presence.debug('got rebuild response with channel ' + a + ', seq '
				+ b.seq + ', host ' + b.host + ', port ' + b.port);
		this.channel.currentSeq = b.seq;
		this.isRebuilding = false;
		if (b.path != this.channel.iframePath
				|| b.host != this.channel.iframeHost) {
			this.iframeLoad(b.path, b.host, b.port, true);
		} else
			this.setReady(true);
		presenceCookieManager.store();
		if (typeof chatOptions != 'undefined')
			chatOptions.setVisibility(b.visibility);
		this.channel.restartHandler(true);
	},
	_retryRebuild : function(c, a) {
		if (a) {
			this.retryInterval = this.channelConfig.MAX_RETRY_INTERVAL;
		} else if (this.retryInterval == 0) {
			this.retryInterval = this.channelConfig.MIN_RETRY_INTERVAL;
		} else {
			this.retryInterval *= 2;
			if (this.retryInterval >= this.channelConfig.MAX_RETRY_INTERVAL)
				this.retryInterval = this.channelConfig.MAX_RETRY_INTERVAL;
		}
		var b = this.retryInterval * (.75 + Math.random() * .5);
		presence
				.warn('channel: retry: manager trying again in ' + (b * .001) + ' secs');
		setTimeout(this._rebuildSend.bind(this, c), this.retryInterval);
	},
	_rebuildError : function(a, b) {
		this.channel.shutdownHandler(true);
		presence
				.error('channel: got rebuild error: ' + b.getErrorDescription());
		if (presence.checkMaintenanceError(b)) {
			presence.warn('channel: manager not trying again');
		} else if (presence.checkLoginError(b)) {
			if (presence.inPopoutWindow || this.loginErrorGk) {
				this._retryRebuild(ChannelRebuildReasons.PrevFailed, true);
			} else
				presence.warn('channel: manager not trying again');
		} else
			this._retryRebuild(ChannelRebuildReasons.PrevFailed, false);
	},
	_rebuildTransportError : function(a, b) {
		this.channel.shutdownHandler(true);
		presence.error('channel: got rebuild transport error: ' + b
				.getErrorDescription());
		this._retryRebuild(a, false);
	},
	_rebuildSend : function(b) {
		if (!presence.hasUserCookie())
			return;
		if (typeof b != 'number')
			b = ChannelRebuildReasons.Unknown;
		presence.debug('channel: sending rebuild');
		var a = new AsyncRequest().setURI('/ajax/presence/reconnect.php')
				.setData( {
					reason : b,
					iframe_loaded : this.iframeEverLoaded
				}).setHandler(this._rebuildResponse.bind(this))
				.setErrorHandler(this._rebuildError.bind(this, b))
				.setTransportErrorHandler(
						this._rebuildTransportError.bind(this, b)).setOption(
						'suppressErrorAlerts', true).setOption('retries', 1)
				.setMethod('GET').setReadOnly(true)
				.setAllowCrossPageTransition(true);
		return a.specifiesWriteRequiredParams() && a.send();
	},
	rebuild : function(a) {
		if (this.stopped)
			return;
		if (this.isRebuilding) {
			presence.debug('channel: rebuild called, but already rebuilding');
			return;
		}
		this.setReady(false);
		this.isRebuilding = true;
		presence.debug('channel: rebuilding');
		if (a == ChannelRebuildReasons.RefreshDelay)
			this.retryInterval = this.channelConfig.MAX_RETRY_INTERVAL;
		setTimeout(this._rebuildSend.bind(this, a), this.retryInterval);
	},
	handleChannelMsgCheck : function() {
		if (this.pendingMsg) {
			this._handleChannelMsg(this.pendingMsg.channel,
					this.pendingMsg.seq, this.pendingMsg.msg);
			this.pendingMsg = null;
		}
	},
	handleChannelMsg : function(a, b) {
		if (this.pollForMessages) {
			this.pendingMsg = {
				channel : a,
				msg : b
			};
		} else
			this._handleChannelMsg(a, b);
	},
	_handleChannelMsg : function(a, c) {
		if (c.type == 'seq') {
			presence.pauseSync();
			this.channel.currentSeq = c.Seq;
			presence.resumeSync();
		} else if (c.type == 'shutdown' || c.type == 'permaShutdown') {
			if (!window.loaded || this.permaShutdown)
				return;
			if (c.type == 'permaShutdown') {
				presence.error('channel:permaShutdown');
				this.permaShutdown = true;
			} else {
				presence.error('channel:refresh_' + c.reason);
				this.rebuild(c.reason);
			}
			this.channel.shutdownHandler(true);
		} else if (c.type == 'fullReload') {
			presence.error('channel:fullReload');
			presenceCookieManager.clear();
			this._rebuildSend(ChannelRebuildReasons.ChannelSeqTooSmall);
			Arbiter.inform('channel/invalid_history');
		} else
			try {
				this.channel.msgHandler(a, c);
			} catch (b) {
				presence.error('channel: error in channel handlers: '
						+ b.toString() + ', msg: ' + c);
			}
	}
};
function TinyPresence(g, c, b, a, e, d, f) {
	this.user = g;
	this.name = c;
	this.firstName = b;
	this.alias = a;
	this.sitevars = f;
	this.popoutURL = env_get('www_base') + 'presence/popout.php';
	this.updateServerTime(e);
	this.pageLoadTime = this.getTime();
	this._init(d);
}
TinyPresence.prototype = {
	cookiePollTime : 2000,
	popoutHeartbeatTime : 1000,
	popoutHeartbeatAllowance : 4000,
	popoutHeartbeatFirstAllowance : 15000,
	shutdownDelay : 5000,
	restartDelay : 3000,
	POPOUT_TYPE_NONE : 0,
	POPOUT_TYPE_CHAT : 1,
	_init : function(a) {
		this.stateStorers = [];
		this.stateLoaders = [];
		this.windowID = rand32() + 1;
		this.cookiePoller = null;
		this.heartbeat = null;
		this.stateUpdateTime = 0;
		this.loaded = false;
		this.isShutdown = false;
		this.isShuttingDown = false;
		this.isRestarting = false;
		this.isPermaShutdown = false;
		this.shutdownTime = 0;
		this.justPoppedOut = false;
		this.syncPaused = 0;
		this.inPopoutWindow = a == this.POPOUT_TYPE_CHAT;
		this.poppedOut = this.inPopoutWindow;
		presenceCookieManager.register('state', this._getCookieData.bind(this));
		Arbiter.subscribe("page_transition", this.checkRebuild.bind(this));
		this.load();
	},
	updateServerTime : function(a) {
		this.timeSkew = new Date().getTime() - a;
	},
	getTime : function() {
		return new Date().getTime() - this.timeSkew;
	},
	debug : function(a) {
	},
	warn : function(a) {
		this.logError("13003:warning:" + a);
	},
	error : function(a) {
		this.logError("13002:error:" + a);
	},
	logError : function(a) {
		if (window.send_error_signal)
			send_error_signal("presence", a);
	},
	load : function() {
		var b = presenceCookieManager.getSubCookie('state');
		if (!b) {
			this
					.debug('presence: got null state cookie, loading with current state');
			this._load(this._getCookieData());
			return;
		}
		try {
			this._load(b);
		} catch (a) {
			this.error('presence: got load exception: ' + a.toString());
			this._load(this._getCookieData());
		}
	},
	_load : function(b) {
		this.syncPaused++;
		this.stateUpdateTime = verifyNumber(b.ut);
		this.popoutTime = verifyNumber(b.pt);
		this.poppedOut = !!b.p;
		if (this.poppedOut) {
			if (this.inPopoutWindow)
				if (!this.heartbeat)
					this.heartbeat = setInterval(this._popoutHeartbeat
							.bind(this), this.popoutHeartbeatTime);
		} else if (this.inPopoutWindow) {
			if (!this.loaded) {
				this.poppedOut = true;
				this.doSync();
			}
		} else
			this.justPoppedOut = true;
		if (!this.inPopoutWindow && !this.cookiePoller)
			this.cookiePoller = setInterval(this._pollCookie.bind(this),
					this.cookiePollTime);
		this.state = b;
		for ( var a = 0; a < this.stateLoaders.length; a++)
			this.stateLoaders[a](b);
		this.syncPaused--;
		this._loaded();
	},
	_loaded : function() {
		this.loaded = true;
	},
	_pollCookie : function() {
		var e = presenceCookieManager.getSubCookie('state');
		if (!e)
			return;
		var d = this.popoutTime;
		if (e.ut > this.stateUpdateTime) {
			this.load(e);
			return;
		}
		if (this.poppedOut && !this.inPopoutWindow) {
			var a = verifyNumber(e.pt);
			var b = new Date().getTime() - a;
			var c = this.popoutHeartbeatTime + this.popoutHeartbeatAllowance;
			if (this.justPoppedOut)
				if (a == d) {
					c += this.popoutHeartbeatFirstAllowance;
				} else
					this.justPoppedOut = false;
			this.popoutTime = a;
			if (b > c) {
				this.poppedOut = false;
				this.doSync();
			}
		}
	},
	_popoutHeartbeat : function() {
		this._pollCookie();
		if (this.poppedOut)
			presenceCookieManager.store();
	},
	_getCookieData : function() {
		var b = {
			p : this.poppedOut ? 1 : 0,
			ut : this.stateUpdateTime,
			pt : this.inPopoutWindow ? new Date().getTime() : this.popoutTime
		};
		for ( var a = 0; a < this.stateStorers.length; a++)
			b = this.stateStorers[a](b);
		this.state = b;
		return this.state;
	},
	doSync : function(a) {
		if (this.syncPaused)
			return;
		if (a) {
			this._doSync();
		} else
			this._doSync.bind(this).defer();
	},
	_doSync : function() {
		this.stateUpdateTime = new Date().getTime();
		presenceCookieManager.store();
		this._load(this.state);
	},
	pauseSync : function() {
		this.syncPaused++;
	},
	resumeSync : function() {
		this.syncPaused--;
		this.doSync();
	},
	handleMsg : function(a, b) {
		this._handleMsg.bind(this, a, b).defer();
	},
	_handleMsg : function(a, b) {
		if (typeof b == 'string') {
			if (b == 'shutdown') {
				this.connectionShutdown();
			} else if (b == 'restart')
				if (this.isShutdown)
					this.restart();
			return;
		}
		if (this.isShutdown)
			return false;
		if (!b.type)
			return;
		Arbiter.inform(PresenceMessage.getArbiterMessageType(b.type), {
			sender : this,
			channel : a,
			obj : b
		});
	},
	checkRebuild : function() {
		if (this.isShutdown && !this.isPermaShutdown)
			channelManager.rebuild(ChannelRebuildReasons.PageTransitionRetry);
	},
	getErrorDescription : function(a) {
		var c = a.getError();
		var b = a.getErrorDescription();
		if (!b)
			b = _tx("An error occurred.");
		if (c == 1357001)
			b = _tx("Your session has timed out. Please log in.");
		return b;
	},
	checkLoginError : function(a) {
		var b = a.getError();
		if (b == 1357001 || b == 1357004 || b == 1348009) {
			this.loginShutdown();
			return true;
		}
		return false;
	},
	checkMaintenanceError : function(a) {
		if (a.getError() == 1356007) {
			this.maintenanceShutdown();
			return true;
		}
		return false;
	},
	permaShutdown : function() {
		this.isPermaShutdown = true;
		var a = _tx("Facebook {Chat} is experiencing technical problems.", {
			Chat : _tx("Chat")
		});
		this.shutdown(false, a, "perma_shutdown");
	},
	loginShutdown : function() {
		var a = _tx("Your session has timed out. Please log in.");
		this.shutdown(false, a, "login_shutdown");
	},
	connectionShutdown : function(b) {
		var a = _tx("Could not connect to Facebook {Chat} at this time.", {
			Chat : _tx("Chat")
		});
		this.shutdown(b, a, "connection_shutdown");
	},
	maintenanceShutdown : function() {
		var a = _tx("Facebook {Chat} is down for maintenance at this time.", {
			Chat : _tx("Chat")
		});
		this.shutdown(false, a, "maintenance_shutdown");
		channelManager.stop();
	},
	versionShutdown : function() {
		var a = _tx(
				"Please refresh the page to get the latest version of Facebook {Chat}.",
				{
					Chat : _tx("Chat")
				});
		this.shutdown(false, a, "version_shutdown");
		channelManager.stop();
	},
	shutdown : function(d, c, a) {
		this.isRestarting = false;
		this.isShuttingDown = true;
		var b = new Date().getTime();
		this.shutdownTime = b;
		if (!d) {
			this._shutdown(c, 0, a);
		} else
			setTimeout(this._shutdown.bind(this, c, b, a), this.shutdownDelay);
	},
	_shutdown : function(b, c, a) {
		if (!this.isShuttingDown && c == this.shutdownTime)
			return;
		if (c && this.isShutdown)
			return;
		if (typeof b != 'string' || !b)
			b = _tx("Facebook {Chat} is experiencing technical problems.", {
				Chat : _tx("Chat")
			});
		if (typeof a != 'string' || !a)
			a = "undefined";
		this.warn("presence:displaying_shutdown:" + a);
		if (this.isShutdown)
			return;
		this.logError("13001:shutdown:presence:" + a);
		this.isShutdown = true;
		Arbiter.inform(PresenceMessage.SHUTDOWN, {
			sender : this
		});
	},
	restart : function(a) {
		this.isShuttingDown = false;
		this.isRestarting = true;
		if (!a) {
			this._restart(0);
		} else
			this._restart.bind(this, this.shutdownTime)
					.defer(this.restartDelay);
	},
	_restart : function(a) {
		if (!this.isRestarting || (a && a != this.shutdownTime))
			return;
		this.debug("presence: restarting");
		this.isShutdown = false;
		this.load();
		Arbiter.inform(PresenceMessage.RESTARTED, {
			sender : this
		});
	},
	start : function() {
		Arbiter.inform(PresenceMessage.STARTED, {
			sender : this
		});
	},
	registerStateStorer : function(a) {
		this.stateStorers.push(a);
	},
	registerStateLoader : function(a) {
		this.stateLoaders.push(a);
	},
	hasUserCookie : function() {
		var a = this.user == getCookie('c_user');
		if (!a)
			this.permaShutdown();
		return a;
	}
};
function Presence(g, c, b, a, e, d, f) {
	this.parent.construct(this, g, c, b, a, e, d, f);
}
Presence.extend('TinyPresence');
Presence.prototype = {
	minWidth : 100,
	minHeight : 100,
	defWidth : 900,
	defHeight : 650,
	defX : 30,
	defY : 30,
	_init : function(b) {
		if (b !== this.POPOUT_TYPE_CHAT) {
			this.holder = $('fbDockChat');
		} else {
			this.holder = $('presence');
			this.popoutSidebar = ge('presence_popout_sidebar');
		}
		this.parent._init(b);
		this.popoutWidth = this.defWidth;
		this.popoutHeight = this.defHeight;
		this.popoutClicked = false;
		this.popinClicked = false;
		if (this.inPopoutWindow) {
			Util.fallbackErrorHandler = null;
			onbeforeunloadRegister(this.popin.bind(this, false));
			onunloadRegister(this.popin.bind(this, false));
		}
		if (this.inPopoutWindow) {
			Event.listen(window, 'resize', this._windowOnResize.bind(this));
			Event.listen(window, 'keypress', this._documentKeyPress.bind(this));
		}
		var c = ua.safari();
		this.isSafari2 = (c && c < 500);
		this.isOpera = (ua.opera() > 0);
		var a = ua.firefox();
		this.isFF2 = (a && a < 3);
		this.isWindows = ua.windows();
		if (this.inPopoutWindow) {
			this._windowOnResize.bind(this).defer();
			setTimeout(this._windowOnResize.bind(this), 3000);
		}
	},
	_load : function(a) {
		this.parent._load(a);
		if (this.poppedOut) {
			if (!this.inPopoutWindow)
				CSS.addClass(this.holder, 'popped_out');
		} else {
			if (this.inPopoutWindow)
				if (this.loaded)
					if (!this.popinClicked)
						window.close();
			CSS.removeClass(this.holder, 'popped_out');
		}
		if (this.inPopoutWindow) {
			this._handleResize.bind(this, 0, 0).defer();
			setTimeout(this._handleResize.bind(this, 0, 0), 100);
		}
		this.parent._loaded();
	},
	_loaded : bagofholding,
	_handleMsg : function(a, b) {
		this.parent._handleMsg(a, b);
		if (typeof b == 'string' || !b.type)
			return;
		if (this.isShutdown)
			return false;
		if (b.type == 'app_msg')
			if (b.event_name == 'beep_event') {
				Bootloader.loadComponents('beeper', function() {
					Beeper.ensureInitialized();
					LiveMessageReceiver.route(b);
				});
			} else
				LiveMessageReceiver.route(b);
	},
	popout : function() {
		if (this.inPopoutWindow || this.poppedOut) {
			this.popin(true);
			return;
		}
		if (this.popoutClicked)
			return;
		this.popoutClicked = true;
		var a = window.open(this.popoutURL, "fbChatWindow",
				"status=0,toolbar=0,location=0,menubar=0,"
						+ "directories=0,resizable=1,scrollbars=0," + "width="
						+ this.popoutWidth + ",height=" + this.popoutHeight
						+ "," + "left=" + this.defX + ",top=" + this.defY);
		CSS.removeClass(this.holder, 'popped_out');
		this.poppedOut = true;
		this.justPoppedOut = true;
		this.popoutTime = (new Date()).getTime();
		this.doSync();
		this.popoutClicked = false;
	},
	popin : function(a) {
		if (typeof a == 'undefined')
			a = true;
		if (this.inPopoutWindow) {
			if (this.popinClicked)
				return;
			this.popinClicked = true;
		}
		this.poppedOut = false;
		this.doSync();
		if (this.inPopoutWindow && a)
			window.close();
	},
	_windowOnResize : function() {
		if (!this.inPopoutWindow)
			return;
		this.contentResized = {};
		var a = Vector2.getViewportDimensions();
		this._handleResize(a.x - this.virtPopoutWidth, a.y
				- this.virtPopoutHeight);
		if (this.inPopoutWindow)
			this.popoutHeight = a.y;
	},
	_handleResize : function(b, c) {
		var a = this.loaded ? 100 : 10;
		if (this.handleResizeTimer)
			clearTimeout(this.handleResizeTimer);
		this.handleResizeTimer = setTimeout(
				function() {
					this.virtPopoutWidth += b;
					this.virtPopoutHeight += c;
					this.popoutWidth = Math.max(this.virtPopoutWidth,
							this.minWidth);
					this.popoutHeight = Math.max(this.virtPopoutHeight,
							this.minHeight);
					Arbiter.inform(PresenceMessage.WINDOW_RESIZED, {
						sender : this
					});
				}, a);
	},
	_documentKeyPress : function(a) {
		if (!this.inPopoutWindow)
			return;
		a = $E(a);
		var b = a ? a.keyCode : -1;
		if (b == KEYS.ESC)
			Event.kill(a);
	},
	renderLink : function(b, c, a) {
		return '<a href="' + b + '"'
				+ (this.inPopoutWindow ? ' target="_blank"' : '')
				+ (a ? a : '') + '>' + c + '</a>';
	},
	_shutdown : function(c, d, b) {
		this.parent._shutdown(c, d, b);
		if ((!this.isShuttingDown && d === this.shutdownTime)
				|| (d && this.isShutdown))
			return;
		if (!this.inPopoutWindow) {
			if (Chat.isOnline())
				CSS.addClass(this.holder, 'presence_error');
			var a = $('fbChatErrorNub');
			TooltipLink.setTooltipText(DOM.find(a, 'a.fbNubButton'), c);
		} else {
			if (this.shutdownErrorDialog)
				this.shutdownErrorDialog.hide();
			this.shutdownErrorDialog = ErrorDialog.show(
					_tx("Facebook Chat Error"), c);
		}
	},
	_restart : function(a) {
		this.parent._restart(a);
		if (!this.isRestarting || (a && a != this.shutdownTime))
			return;
		if (!this.inPopoutWindow) {
			CSS.removeClass(this.holder, 'presence_error');
		} else if (this.shutdownErrorDialog)
			this.shutdownErrorDialog.hide();
	},
	isOnline : function() {
		return this.state && this.state.vis;
	}
};
function getFirstName(c) {
	var d = c.split(" ");
	var b = d[0];
	var a = b.length;
	if (typeof d[1] != 'undefined'
			&& (a == 1 || (a == 2 && b.indexOf('.') != -1) || (a == 3 && b
					.toLowerCase() == 'the')))
		b += ' ' + d[1];
	return b;
}
function typeaheadpro(a, c, b) {
	if (!typeaheadpro.hacks) {
		typeaheadpro.should_check_missing_events = ua.safari() < 500;
		typeaheadpro.should_simulate_keypress = ua.ie()
				|| (ua.safari() > 500 && ua.safari() < 523 || ua.safari() >= 525);
		if (typeaheadpro.should_use_iframe == undefined)
			typeaheadpro.should_use_iframe = ua.ie() < 7;
		typeaheadpro.should_use_overflow = ua.opera() < 9.5
				|| ua.safari() < 500;
		if (ua.firefox())
			this.activate_poll_on_focus_events = true;
		typeaheadpro.hacks = true;
	}
	typeaheadpro.instances = (typeaheadpro.instances || []);
	typeaheadpro.instances.push(this);
	this.instance = typeaheadpro.instances.length - 1;
	copy_properties(this, b || {});
	this.obj = a;
	this.obj.typeahead = this;
	this.attachEventListeners();
	this.want_icon_list = false;
	this.showing_icon_list = false;
	this.stop_suggestion_select = false;
	if (this.typeahead_icon_class && this.typeahead_icon_get_return) {
		this.typeahead_icon = document.createElement('div');
		CSS.addClass(this.typeahead_icon, 'typeahead_list_icon');
		CSS.addClass(this.typeahead_icon, this.typeahead_icon_class);
		this.typeahead_icon.innerHTML = '&nbsp;';
		this.setup_typeahead_icon();
		setTimeout(function() {
			this.focus();
		}.bind(this), 50);
		this.typeahead_icon.onmousedown = function(event) {
			return this.typeahead_icon_onclick(event || window.event);
		}.bind(this);
	}
	this.focused = this.focused || this.obj.offsetWidth ? true : false;
	this.focused = this.focused && !this.enumerate_on_focus;
	this.anchor = this.setup_anchor();
	this.dropdown = document.createElement('div');
	CSS.addClass(this.dropdown, 'typeahead_list');
	if (!this.focused)
		this.dropdown.style.display = 'none';
	this.anchor_block = this.anchor_block
			|| this.anchor.tagName.toLowerCase() == 'div';
	document.body.appendChild(this.dropdown);
	this.dropdown.className += ' typeahead_list_absolute';
	this.list = $N('div');
	this.dropdown.appendChild(this.list);
	this.dropdown.onmousedown = function(event) {
		return this.dropdown_onmousedown(event || window.event);
	}.bind(this);
	if (typeaheadpro.should_use_iframe && !typeaheadpro.iframe) {
		typeaheadpro.iframe = document.createElement('iframe');
		typeaheadpro.iframe.src = "/common/blank.html";
		CSS.setClass(typeaheadpro.iframe, 'typeahead_iframe');
		typeaheadpro.iframe.style.display = 'none';
		typeaheadpro.iframe.frameBorder = 0;
		document.body.appendChild(typeaheadpro.iframe);
	}
	if (typeaheadpro.should_use_iframe && typeaheadpro.iframe)
		typeaheadpro.iframe.style.zIndex = parseInt(CSS.getStyle(this.dropdown,
				'zIndex')) - 1;
	this.log_data = {
		kt : 0,
		kp : 0,
		sm : null,
		ty : 0,
		f : 1
	};
	this.results_text = '';
	this.last_key_suggestion = 0;
	this.status = typeaheadpro.STATUS_BLOCK_ON_SOURCE_BOOTSTRAP;
	this.clear_placeholder();
	if (c)
		this.set_source(c);
	if (this.source) {
		this.selectedindex = -1;
		if (this.focused) {
			this._onfocus();
			this.show();
			this._onkeyup();
			this.set_class('');
			this.capture_submit();
		}
	} else
		this.hide();
	onleaveRegister(this._onunload.bind(this), true);
}
typeaheadpro.prototype.enumerate = false;
typeaheadpro.prototype.interactive = false;
typeaheadpro.prototype.changed = false;
typeaheadpro.prototype.render_block_size = 50;
typeaheadpro.prototype.typeahead_icon_class = false;
typeaheadpro.prototype.typeahead_icon_get_return = false;
typeaheadpro.prototype.old_value = null;
typeaheadpro.prototype.poll_handle = null;
typeaheadpro.prototype.activate_poll_on_focus_events = false;
typeaheadpro.prototype.suggestion_count = 0;
typeaheadpro.STATUS_IDLE = 0;
typeaheadpro.STATUS_WAITING_ON_SOURCE = 1;
typeaheadpro.STATUS_BLOCK_ON_SOURCE_BOOTSTRAP = 2;
typeaheadpro.prototype.clear_value_on_blur = true;
typeaheadpro.prototype.max_results = 0;
typeaheadpro.prototype.max_display = 10;
typeaheadpro.prototype.allow_placeholders = false;
typeaheadpro.prototype.auto_select = true;
typeaheadpro.prototype.auto_select_exactmatch = false;
typeaheadpro.prototype.enumerate_on_focus = false;
typeaheadpro.dirty_instances = function() {
	if (typeaheadpro.instances)
		typeaheadpro.instances.forEach(function(a) {
			a.update_status(typeaheadpro.STATUS_BLOCK_ON_SOURCE_BOOTSTRAP);
			if (a.source)
				a.source.is_ready = false;
		});
};
typeaheadpro.prototype.set_source = function(a) {
	this.source = a;
	this.source.set_owner(this);
	this.status = typeaheadpro.STATUS_IDLE;
	this.cache = {};
	this.last_search = 0;
	this.suggestions = [];
};
typeaheadpro.prototype.setup_anchor = function() {
	return this.obj;
};
typeaheadpro.prototype.destroy = function() {
	if (this.typeahead_icon) {
		DOM.remove(this.typeahead_icon);
		this.toggle_icon_list = function() {
		};
	}
	this.clear_render_timeouts();
	if (!this.anchor_block
			&& this.anchor.nextSibling.tagName.toLowerCase() == 'br')
		DOM.remove(this.anchor.nextSibling);
	if (this.dropdown)
		DOM.remove(this.dropdown);
	if (this.obj) {
		this.removeEventListeners();
		this.obj.typeahead = null;
		DOM.remove(this.obj);
	}
	this.anchor = this.obj = this.dropdown = null;
	delete typeaheadpro.instances[this.instance];
};
typeaheadpro.prototype.check_value = function() {
	if (this.obj) {
		var a = this.obj.value;
		if (a != this.old_value) {
			this.dirty_results();
			this.old_value = a;
			if (this.old_value === '')
				this._onselect(false);
		}
	}
};
typeaheadpro.prototype._onkeyup = function(a) {
	a = $E(a);
	this.last_key = a ? a.keyCode : -1;
	if (this.key_down == this.last_key)
		this.key_down = 0;
	var b = true;
	switch (this.last_key) {
	case KEYS.ESC:
		this.selectedindex = -1;
		this._onselect(false);
		this.hide();
		a.stop();
		b = false;
		break;
	}
	return b;
};
typeaheadpro.prototype._onkeydown = function(a) {
	a = $E(a);
	this.key_down = this.last_key = a ? a.keyCode : -1;
	this.interactive = true;
	switch (this.last_key) {
	case KEYS.PAGE_UP:
	case KEYS.PAGE_DOWN:
	case KEYS.UP:
	case KEYS.DOWN:
		this.log_data.kt += 1;
		if (typeaheadpro.should_simulate_keypress)
			this._onkeypress( {
				keyCode : this.last_key
			});
		return false;
	case KEYS.TAB:
		this.log_data.kt += 1;
		this.select_suggestion(this.selectedindex);
		if (a.shiftKey) {
			this.reverse_focus();
		} else
			this.advance_focus();
		break;
	case KEYS.RETURN:
		this.log_data.sm = 'key_ret';
		if (this.select_suggestion(this.selectedindex))
			this.hide();
		if (typeof (this.submit_keydown_return) != 'undefined')
			this.submit_keydown_return = this._onsubmit(this
					.get_current_selection());
		return this.submit_keydown_return;
	case 229:
		if (!this.poll_handle)
			this.poll_handle = setInterval(this.check_value.bind(this), 100);
		break;
	default:
		this.log_data.kp += 1;
		setTimeout(bind(this, 'check_value'), this.source.check_limit);
	}
};
typeaheadpro.prototype._onkeypress = function(a) {
	a = $E(a);
	var b = 1;
	this.last_key = a ? Event.getKeyCode(a) : -1;
	this.interactive = true;
	switch (this.last_key) {
	case KEYS.PAGE_UP:
		b = this.max_display;
	case KEYS.UP:
		this.set_suggestion(b > 1 && this.selectedindex > 0
				&& this.selectedindex < b ? 0 : this.selectedindex - b);
		this.last_key_suggestion = (new Date()).getTime();
		return false;
	case KEYS.PAGE_DOWN:
		b = this.max_display;
	case KEYS.DOWN:
		if (trim(this.get_value()) == '' && !this.enumerate) {
			this.enumerate = true;
			this.results_text = null;
			this.dirty_results();
		} else {
			this.set_suggestion(this.suggestions.length <= this.selectedindex
					+ b ? this.suggestions.length - 1 : this.selectedindex + b);
			this.last_key_suggestion = (new Date()).getTime();
		}
		return false;
	case KEYS.RETURN:
		var c = null;
		if (typeof (this.submit_keydown_return) == 'undefined') {
			c = this.submit_keydown_return = this._onsubmit(this
					.get_current_selection());
		} else {
			c = this.submit_keydown_return;
			delete this.submit_keydown_return;
		}
		a.stop();
		return c;
	default:
		setTimeout(bind(this, 'check_value'), this.source.check_limit);
		break;
	}
	return true;
};
typeaheadpro.prototype._onchange = function() {
	this.changed = true;
};
typeaheadpro.prototype._onfound = function(a) {
	return this.onfound ? this.onfound.call(this, a) : true;
};
typeaheadpro.prototype._onsubmit = function(a) {
	if (this.onsubmit) {
		var b = this.onsubmit.call(this, a);
		if (b && this.obj.form) {
			if (!this.obj.form.onsubmit || this.obj.form.onsubmit())
				this.obj.form.submit();
			return false;
		}
		return b;
	} else {
		this.advance_focus();
		return false;
	}
};
typeaheadpro.prototype._onselect = function(c) {
	var b = (function() {
		if (this.onselect)
			this.onselect.call(this, c);
	}).bind(this);
	if (c.no_email) {
		var a = new AsyncRequest().setData( {
			action : 'require',
			require_field : 'email',
			uid : c.i
		}).setMethod('GET').setReadOnly(true).setURI(
				'/friends/ajax/external.php');
		new Dialog().setCloseHandler(function(e) {
			var d = this.getUserData();
			if (d) {
				b();
			} else
				e.set_value('');
		}.bind(null, this)).setAsync(a).show();
	} else
		b();
};
typeaheadpro.prototype._onfocus = function() {
	if (!this.poll_handle && this.activate_poll_on_focus_events)
		this.poll_handle = setInterval(this.check_value.bind(this), 100);
	if (this.source)
		this.source.bootstrap();
	if (this.last_dropdown_mouse > (new Date()).getTime() - 10 || this.focused)
		return;
	if (this.changed)
		this.dirty_results();
	this.focused = true;
	this.changed = false;
	this.clear_placeholder();
	this.results_text = '';
	this.set_class('');
	this.show();
	this.capture_submit();
	if (this.typeahead_icon)
		show(this.typeahead_icon);
	if (this.enumerate_on_focus)
		setTimeout(function() {
			this.enumerate = true;
			this.results_text = null;
			this.dirty_results();
			this.selectedindex = -1;
			return false;
		}.bind(this), 0);
};
typeaheadpro.prototype._onblur = function(event) {
	if (this.last_dropdown_mouse
			&& this.last_dropdown_mouse > (new Date()).getTime() - 10
			&& this.is_showing_suggestions()) {
		Event.kill(event);
		setTimeout(function() {
			this.focus();
		}.bind(this), 0);
		return false;
	}
	if (!this.stop_hiding) {
		if (this.showing_icon_list)
			this.toggle_icon_list(true);
	} else {
		this.focus();
		return false;
	}
	this.focused = false;
	if (this.changed && !this.interactive) {
		this.dirty_results();
		this.changed = false;
		return;
	}
	if (!this.suggestions) {
		this._onselect(false);
	} else if (this.selectedindex >= 0
			&& (this.auto_select || this.auto_select_exactmatch))
		this.select_suggestion(this.selectedindex);
	this.hide();
	this.update_class();
	if (this.clear_value_on_blur && !this.get_value()) {
		var a = this.allow_placeholders ? this.source.gen_noinput() : '';
		this.set_value(a ? a : '');
		this.set_class('DOMControl_placeholder');
	}
	if (this.poll_handle) {
		clearInterval(this.poll_handle);
		this.poll_handle = null;
	}
};
typeaheadpro.prototype._onunload = function() {
	if (typeaheadpro.instances[this.instance])
		this.hide();
};
typeaheadpro.prototype.typeahead_icon_onclick = function(event) {
	this.stop_hiding = true;
	this.focus();
	setTimeout(function() {
		this.toggle_icon_list();
	}.bind(this), 50);
	Event.kill(event);
	return false;
};
typeaheadpro.prototype.dropdown_onmousedown = function(event) {
	this.last_dropdown_mouse = (new Date()).getTime();
};
typeaheadpro.prototype.setup_typeahead_icon = function() {
	this.typeahead_parent = document.createElement('div');
	CSS.addClass(this.typeahead_parent, 'typeahead_parent');
	this.typeahead_parent.appendChild(this.typeahead_icon);
	this.obj.parentNode.insertBefore(this.typeahead_parent, this.obj);
};
typeaheadpro.prototype.mouse_set_suggestion = function(a) {
	if (!this.visible)
		return;
	if ((new Date()).getTime() - this.last_key_suggestion > 50)
		this.set_suggestion(a);
};
typeaheadpro.prototype.capture_submit = function() {
	if (!typeaheadpro.should_check_missing_events)
		return;
	if ((!this.captured_form || this.captured_substitute != this.captured_form.onsubmit)
			&& this.obj.form) {
		this.captured_form = this.obj.form;
		this.captured_event = this.obj.form.onsubmit;
		this.captured_substitute = this.obj.form.onsubmit = function() {
			return ((this.key_down && this.key_down != KEYS.RETURN && this.key_down != KEYS.TAB) ? this.submit_keydown_return
					: (this.captured_event ? this.captured_event.apply(
							arguments, this.captured_form) : true)) ? true
					: false;
		}.bind(this);
	}
};
typeaheadpro.prototype.set_suggestion = function(b) {
	this.stop_suggestion_select = false;
	if (!this.suggestions || this.suggestions.length <= b)
		return;
	var c = this.get_suggestion_node(this.selectedindex);
	this.selectedindex = (b <= -1) ? -1 : b;
	var a = this.get_suggestion_node(this.selectedindex);
	if (c) {
		CSS.removeClass(c, 'typeahead_selected');
		CSS.addClass(c, 'typeahead_not_selected');
	}
	if (a) {
		CSS.removeClass(a, 'typeahead_not_selected');
		CSS.addClass(a, 'typeahead_selected');
	}
	this.recalc_scroll();
	this._onfound(this.get_current_selection());
};
typeaheadpro.prototype.get_suggestion_node = function(a) {
	var b = this.list.childNodes;
	return a == -1 ? null
			: b[Math.floor(a / this.render_block_size)].childNodes[a
					% this.render_block_size];
};
typeaheadpro.prototype.get_current_selection = function() {
	return this.selectedindex == -1 ? false
			: this.suggestions[this.selectedindex];
};
typeaheadpro.prototype.update_class = function() {
	if (this.suggestions
			&& this.selectedindex != -1
			&& typeahead_source.flatten_string(this.get_current_selection().t) == typeahead_source
					.flatten_string(this.get_value())) {
		this.set_class('typeahead_found');
	} else
		this.set_class('');
};
typeaheadpro.prototype.select_suggestion = function(a) {
	if (!this.stop_suggestion_select && this.current_selecting != a)
		this.current_selecting = a;
	var b = true;
	if (!this.suggestions || a == undefined || a === false
			|| this.suggestions.length <= a || a < 0) {
		this._onfound(false);
		this._onselect(false);
		this.selectedindex = -1;
		this.set_class('');
		b = false;
	} else {
		this.selectedindex = a;
		var c = this.suggestions[a].ty;
		if (c != 'web' && c != 'search')
			this.set_value(this.suggestions[a].t);
		this.set_class('typeahead_found');
		this._onfound(this.suggestions[this.selectedindex]);
		this._onselect(this.suggestions[this.selectedindex]);
	}
	if (!this.interactive) {
		this.hide();
		this.blur();
	}
	this.current_selecting = null;
	if (!b && this.ignore_invalid_suggestion)
		return false;
	return true;
};
typeaheadpro.prototype.is_showing_suggestions = function() {
	return (this.suggestions) && (this.suggestions.length > 0);
};
typeaheadpro.prototype.set_value = function(a) {
	this.obj.value = a;
};
typeaheadpro.prototype.get_value = function() {
	if (this.showing_icon_list && this.old_typeahead_value != this.obj.value)
		this.toggle_icon_list();
	if (this.want_icon_list) {
		return this.typeahead_icon_get_return;
	} else if (this.showing_icon_list)
		this.toggle_icon_list();
	return this.obj.value;
};
typeaheadpro.prototype.found_suggestions = function(p, q, e) {
	if (!p)
		p = [];
	this.suggestion_count = p.length;
	if (!e) {
		this.status = typeaheadpro.STATUS_IDLE;
		this.add_cache(q, p);
	}
	this.clear_render_timeouts();
	if (this.get_value() == this.results_text) {
		return;
	} else if (!e) {
		this.results_text = typeahead_source.flatten_string(q);
		if (this.enumerate && trim(this.results_text) != '')
			this.enumerate = false;
	}
	if (this.dedupe_suggestions) {
		var i = DOM.scry(this.tokenizer.obj, 'input.fb_token_hidden_input');
		if (i.length > 0) {
			var d = [];
			var a = [];
			for ( var h = 0; h < i.length; h++)
				a[i[h].value] = true;
			for ( var h = 0, j = p.length; h < j; h++)
				if (p[h] && !a[p[h].i])
					d.push(p[h]);
			p = d;
		}
	}
	var c = -1;
	if (this.selectedindex > 0
			|| (this.selectedindex == 0 && !this.auto_select)) {
		var n = this.suggestions[this.selectedindex].i;
		for ( var h = 0, j = p.length; h < j; h++)
			if (p[h].i == n) {
				c = h;
				break;
			}
	}
	if (c == -1 && this.auto_select && p.length) {
		c = 0;
		this._onfound(p[0]);
	} else if (this.auto_select_exactmatch && p.length)
		if (q.toLowerCase() === p[0].t.toLowerCase()) {
			c = 0;
			this._onfound(p[0]);
		} else
			c = -1;
	this.selectedindex = c;
	this.suggestions = p;
	if (!e)
		this.real_suggestions = p;
	if (p.length) {
		var g = [], b = Math.ceil(p.length / this.render_block_size), k = {}, f, m = null;
		DOM.empty(this.list);
		for ( var h = 0; h < b; h++)
			this.list.appendChild(document.createElement('div'));
		if (c > -1) {
			f = Math.floor(c / this.render_block_size);
			k[f] = true;
			if (c % this.render_block_size > this.render_block_size / 2) {
				k[f + 1] = true;
			} else if (f != 0)
				k[f - 1] = true;
		} else
			k[0] = true;
		for ( var l in k) {
			this.render_block(l);
			sample = this.list.childNodes[l].firstChild;
		}
		this.show();
		if (b) {
			var o = sample.offsetHeight;
			this.render_timeouts = [];
			for ( var h = 1; h < b; h++)
				if (!k[h]) {
					this.list.childNodes[h].style.height = o
							* Math.min(this.render_block_size, p.length - h
									* this.render_block_size) + 'px';
					this.render_timeouts.push(setTimeout(this.render_block
							.bind(this, h), 700 + h * 50));
				}
		}
	} else {
		this.selectedindex = -1;
		this.set_message(this.status == typeaheadpro.STATUS_IDLE ? this.source
				.gen_nomatch() : this.source.gen_loading());
		this._onfound(false);
	}
	this.recalc_scroll();
	if (!e
			&& this.results_text != typeahead_source.flatten_string(this
					.get_value()))
		this.dirty_results();
};
typeaheadpro.prototype.render_block = function(a, h) {
	var i = this.suggestions, g = this.selectedindex, j = this.get_value(), d = this.instance, b = [], f = this.list.childNodes[a];
	for ( var c = a * this.render_block_size, e = Math.min(i.length, (a + 1)
			* this.render_block_size); c < e; c++) {
		b.push('<div class="');
		if (g == c) {
			b.push('typeahead_suggestion typeahead_selected');
		} else
			b.push('typeahead_suggestion typeahead_not_selected');
		if (c > 0 && i[c - 1].o < 0 && i[c].o >= 0)
			b.push(' typeahead_delimiter');
		b.push('" onmouseover="typeaheadpro.instances[', d,
				'].mouse_set_suggestion(', c, ')" ',
				'onmousedown="var instance=typeaheadpro.instances[', d,
				']; instance.select_suggestion(', c,
				');instance.hide();Event.kill(event);">', this.source.gen_html(
						i[c], j), '</div>');
	}
	f.innerHTML = b.join('');
	f.style.height = 'auto';
	CSS.addClass(f, 'typeahead_suggestions');
};
typeaheadpro.prototype.clear_render_timeouts = function() {
	if (this.render_timeouts) {
		for ( var a = 0; a < this.render_timeouts.length; a++)
			clearTimeout(this.render_timeouts[a]);
		this.render_timeouts = null;
	}
};
typeaheadpro.prototype.recalc_scroll = function() {
	var a = this.list.firstChild;
	if (!a)
		return;
	if (a.childNodes.length > this.max_display) {
		var c = a.childNodes[this.max_display - 1];
		var b = c.offsetTop + c.offsetHeight;
		this.dropdown.style.height = b + 'px';
		var e = this.get_suggestion_node(this.selectedindex);
		if (e) {
			var d = this.dropdown.scrollTop;
			if (e.offsetTop < d) {
				this.dropdown.scrollTop = e.offsetTop;
			} else if (e.offsetTop + e.offsetHeight > b + d)
				this.dropdown.scrollTop = e.offsetTop + e.offsetHeight - b;
		}
		if (!typeaheadpro.should_use_overflow) {
			this.dropdown.style.overflowY = 'scroll';
			this.dropdown.style.overflowX = 'hidden';
		}
	} else {
		this.dropdown.style.height = 'auto';
		if (!typeaheadpro.should_use_overflow)
			this.dropdown.style.overflowY = 'hidden';
	}
};
typeaheadpro.prototype.search_cache = function(a) {
	return this.cache[typeahead_source.flatten_string(a)];
};
typeaheadpro.prototype.add_cache = function(b, a) {
	if (this.source.cache_results)
		this.cache[typeahead_source.flatten_string(b)] = a;
};
typeaheadpro.prototype.update_status = function(a) {
	this.status = a;
	this.dirty_results();
};
typeaheadpro.prototype.set_class = function(a) {
	CSS.setClass(this.obj,
			(this.obj.className.replace(/typeahead_[^\s]+/g, '') + ' ' + a)
					.replace(/ {2,}/g, ' '));
};
typeaheadpro.prototype.dirty_results = function() {
	if (!this.enumerate && this.get_value().trim() == '') {
		DOM.empty(this.list);
		this.results_text = '';
		this.set_message(this.source.gen_placeholder());
		this.suggestions = [];
		this.selectedindex = -1;
		return;
	} else if (this.results_text == typeahead_source.flatten_string(this
			.get_value())) {
		return;
	} else if (this.status == typeaheadpro.STATUS_BLOCK_ON_SOURCE_BOOTSTRAP) {
		this.set_message(this.source.gen_loading());
		return;
	}
	var c = (new Date()).getTime();
	var e = false;
	if (this.last_search <= (c - this.source.search_limit)
			&& this.status == typeaheadpro.STATUS_IDLE) {
		e = this.perform_search();
	} else if (this.status == typeaheadpro.STATUS_IDLE)
		if (!this.search_timeout)
			this.search_timeout = setTimeout(function() {
				this.search_timeout = false;
				if (this.status == typeaheadpro.STATUS_IDLE)
					this.dirty_results();
			}.bind(this), this.source.search_limit - (c - this.last_search));
	if (this.source.allow_fake_results && this.real_suggestions && !e) {
		var d = typeahead_source.tokenize(this.get_value()).sort(
				typeahead_source._sort);
		var a = [];
		for ( var b = 0; b < this.real_suggestions.length; b++)
			if (typeahead_source.check_match(d, this.real_suggestions[b].t
					+ ' ' + this.real_suggestions[b].n))
				a.push(this.real_suggestions[b]);
		if (a.length) {
			this.found_suggestions(a, this.get_value(), true);
		} else {
			this.selectedindex = -1;
			this.set_message(this.source.gen_loading());
		}
	}
};
typeaheadpro.prototype.perform_search = function() {
	if (this.get_value() == this.results_text)
		return true;
	var a;
	if ((a = this.search_cache(this.get_value())) === undefined
			&& !(a = this.source.search_value(this.get_value()))) {
		this.status = typeaheadpro.STATUS_WAITING_ON_SOURCE;
		this.last_search = (new Date()).getTime();
		return false;
	}
	this.found_suggestions(a, this.get_value(), false);
	return true;
};
typeaheadpro.prototype.set_message = function(a) {
	this.clear_render_timeouts();
	if (a) {
		this.list.innerHTML = '<div class="typeahead_message">' + a + '</div>';
		this.reset_iframe();
	} else
		this.hide();
	this.recalc_scroll();
};
typeaheadpro.prototype.reset_iframe = function() {
	if (!typeaheadpro.should_use_iframe)
		return;
	typeaheadpro.iframe.style.top = this.dropdown.style.top;
	typeaheadpro.iframe.style.left = this.dropdown.style.left;
	typeaheadpro.iframe.style.width = this.dropdown.offsetWidth + 'px';
	typeaheadpro.iframe.style.height = this.dropdown.offsetHeight + 'px';
	typeaheadpro.iframe.style.display = '';
};
typeaheadpro.prototype.advance_focus = function() {
	return this._move_focus(true);
};
typeaheadpro.prototype.reverse_focus = function() {
	return this._move_focus(false);
};
typeaheadpro.prototype._move_focus = function(c) {
	var b = this.obj.form ? Form.getInputs(this.obj.form) : Form.getInputs();
	var d = [];
	d._insert = c ? d.push : d.unshift;
	var e = !c;
	for ( var a = 0; a < b.length; a++)
		if (!c && b[a] == this.obj) {
			e = false;
		} else if (e && b[a].type != 'hidden' && b[a].tabIndex != -1
				&& b[a].offsetParent) {
			d._insert(b[a]);
		} else if (b[a] == this.obj)
			e = true;
	setTimeout(function() {
		for ( var g = 0; g < this.length; g++)
			try {
				if (this[g].offsetParent) {
					this[g].focus();
					setTimeout(function() {
						try {
							this.focus();
						} catch (h) {
						}
					}.bind(this[g]), 0);
					return;
				}
			} catch (f) {
			}
	}.bind(d ? d : []), 0);
	this.blur();
	this.hide();
};
typeaheadpro.prototype.clear_placeholder = function() {
	if (CSS.hasClass(this.obj, 'DOMControl_placeholder')) {
		this.set_value('');
		CSS.removeClass(this.obj, 'DOMControl_placeholder');
	}
};
typeaheadpro.prototype.clear = function() {
	this.set_value('');
	this.set_class('');
	this.selectedindex = -1;
	this.enumerate = false;
	this.dirty_results();
};
typeaheadpro.prototype.hide = function() {
	if (this.stop_hiding)
		return;
	this.visible = false;
	this.dropdown.style.display = 'none';
	this.clear_render_timeouts();
	if (typeaheadpro.should_use_iframe)
		typeaheadpro.iframe.style.display = 'none';
};
typeaheadpro.prototype.show = function() {
	this.visible = true;
	if (this.focused) {
		this.dropdown.style.top = elementY(this.anchor)
				+ this.anchor.offsetHeight + 'px';
		this.dropdown.style.left = elementX(this.anchor) + 'px';
		this.dropdown.style.width = (this.anchor.offsetWidth - 2) + 'px';
		this.dropdown.style.display = '';
		if (typeaheadpro.should_use_iframe) {
			typeaheadpro.iframe.style.display = '';
			this.reset_iframe();
		}
	}
};
typeaheadpro.prototype.toggle_icon_list = function(a) {
	if (this.showing_icon_list) {
		this.showing_icon_list = false;
		this.source.showing_icon_list = false;
		if (!a)
			this.focus();
		CSS.removeClass(this.typeahead_icon, 'on_selected');
		this.want_icon_list = false;
		this.showing_icon_list = false;
		this.stop_suggestion_select = true;
		if (this.obj)
			this.dirty_results();
	} else {
		this.source.showing_icon_list = true;
		this.old_typeahead_value = this.obj.value;
		this.stop_suggestion_select = true;
		this.want_icon_list = true;
		this.dirty_results();
		this.focus();
		CSS.addClass(this.typeahead_icon, 'on_selected');
		this.show();
		this.set_suggestion(-1);
		this.showing_icon_list = true;
	}
	setTimeout(function() {
		this.stop_hiding = false;
	}.bind(this), 100);
};
typeaheadpro.prototype.focus = function() {
	this.obj.focus();
};
typeaheadpro.prototype.blur = function(a) {
	if (this.obj)
		this.obj.blur(a);
};
typeaheadpro.prototype.attachEventListeners = function() {
	this._eventRefs = Event.listen(this.obj, {
		focus : this._onfocus.bind(this),
		blur : this._onblur.bind(this),
		change : this._onchange.bind(this),
		keyup : this._onkeyup.bind(this),
		keydown : this._onkeydown.bind(this),
		keypress : this._onkeypress.bind(this)
	});
};
typeaheadpro.prototype.removeEventListeners = function() {
	if (this._eventRefs)
		for ( var a in this._eventRefs)
			this._eventRefs[a].remove();
};
typeaheadpro.kill_typeahead = function(a) {
	if (a.typeahead) {
		if (!this.anchor_block)
			a.parentNode.removeChild(a.nextSibling);
		a.parentNode.removeChild(a.nextSibling);
		if (a.typeahead.source)
			a.typeahead.source = a.typeahead.source.owner = null;
		a.typeahead.removeEventListeners();
		a.typeahead = null;
	}
};
function typeahead_source() {
}
typeahead_source.prototype.cache_results = false;
typeahead_source.prototype.enumerable = false;
typeahead_source.prototype.allow_fake_results = false;
typeahead_source.prototype.escape_results = false;
typeahead_source.prototype.search_limit = 10;
typeahead_source.prototype.check_limit = 10;
typeahead_source.prototype.bootstrap = bagofholding;
typeahead_source.check_match = function(f, g) {
	g = typeahead_source.tokenize(g);
	for ( var b = 0, c = f.length; b < c; b++)
		if (f[b].length) {
			var a = false;
			for ( var d = 0, e = g.length; d < e; d++)
				if (g[d].length >= f[b].length
						&& g[d].substring(0, f[b].length) == f[b]) {
					a = true;
					g[d] = '';
					break;
				}
			if (!a)
				return false;
		}
	return true;
};
typeahead_source.tokenize = function(c, a, b) {
	return (b ? c : typeahead_source.flatten_string(c))
			.split(a ? typeahead_source.normalizer_regex_capture
					: typeahead_source.normalizer_regex);
};
typeahead_source.normalizer_regex_str = '(?:(?:^| +)["\'.\\-]+ *)|(?: *[\'".\\-]+(?: +|$)|[@_]| +)';
typeahead_source.normalizer_regex = new RegExp(
		typeahead_source.normalizer_regex_str, 'g');
typeahead_source.normalizer_regex_capture = new RegExp(
		'(' + typeahead_source.normalizer_regex_str + ')', 'g');
typeahead_source.flatten_string = function(b) {
	if (!typeahead_source.accents)
		typeahead_source.accents = {
			a : /\u0430|\u00e0|\u00e1|\u00e2|\u00e3|\u00e4|\u00e5/g,
			b : /\u0431/g,
			c : /\u0446|\u00e7/g,
			d : /\u0434|\u00f0/g,
			e : /\u044d|\u0435|\u00e8|\u00e9|\u00ea|\u00eb/g,
			f : /\u0444/g,
			g : /\u0433/g,
			h : /\u0445/g,
			i : /\u0438|\u00ec|\u00ed|\u00ee|\u00ef/g,
			j : /\u0439/g,
			k : /\u043a/g,
			l : /\u043b/g,
			m : /\u043c/g,
			n : /\u043d|\u00f1/g,
			o : /\u043e|\u00f8|\u00f6|\u00f5|\u00f4|\u00f3|\u00f2/g,
			p : /\u043f/g,
			r : /\u0440/g,
			s : /\u0441/g,
			t : /\u0442/g,
			u : /\u0443|\u044e|\u00fc|\u00fb|\u00fa|\u00f9/g,
			v : /\u0432/g,
			y : /\u044b|\u00ff|\u00fd/g,
			z : /\u0437/g,
			ae : /\u00e6/g,
			oe : /\u0153/g,
			ts : /\u0446/g,
			ch : /\u0447/g,
			sh : /\u0448/g,
			ya : /\u044f/g
		};
	b = b.toLowerCase();
	for ( var a in typeahead_source.accents)
		b = b.replace(typeahead_source.accents[a], a);
	return b;
};
typeahead_source.prototype.set_owner = function(a) {
	this.owner = a;
	if (this.is_ready)
		this.owner.update_status(typeaheadpro.STATUS_IDLE);
};
typeahead_source.prototype.ready = function() {
	if (this.owner && !this.is_ready) {
		this.is_ready = true;
		this.owner.update_status(typeaheadpro.STATUS_IDLE);
	} else
		this.is_ready = true;
};
typeahead_source.highlight_found = function(g, h) {
	var b = [];
	resultv = typeahead_source.tokenize(g, true, true);
	g = typeahead_source.tokenize(g, true);
	h = typeahead_source.tokenize(h);
	h.sort(typeahead_source._sort);
	for ( var c = 0, d = resultv.length; c < d; c++) {
		var a = false;
		for ( var e = 0, f = h.length; e < f; e++)
			if (h[e] && g[c].lastIndexOf(h[e], 0) != -1) {
				b.push('<em>', htmlspecialchars(resultv[c].substring(0,
						h[e].length)), '</em>', htmlspecialchars(resultv[c]
						.substring(h[e].length, resultv[c].length)));
				a = true;
				break;
			}
		if (!a)
			b.push(htmlspecialchars(resultv[c]));
	}
	return b.join('');
};
typeahead_source._sort = function(a, b) {
	return b.length - a.length;
};
typeahead_source.prototype.gen_nomatch = function() {
	return this.text_nomatch != null ? this.text_nomatch
			: _tx("No matches found");
};
typeahead_source.prototype.gen_loading = function() {
	return this.text_loading != null ? this.text_loading : _tx("Loading...");
};
typeahead_source.prototype.gen_placeholder = function() {
	return this.text_placeholder != null ? this.text_placeholder
			: _tx("Start typing...");
};
typeahead_source.prototype.gen_noinput = function() {
	return this.text_noinput != null ? this.text_noinput
			: _tx("Start typing...");
};
typeahead_source.prototype.onselect_not_found = function() {
	if (typeof this.tokenizer._ontokennotfound != 'undefined')
		this.tokenizer._ontokennotfound(this.obj.value);
	if (typeof this.tokenizer.onselect != 'undefined')
		return this.tokenizer.onselect();
};
typeahead_source.prototype.gen_html = function(d, a) {
	var e = d.t || d;
	var b = [ '<div>', typeahead_source.highlight_found(e, a), '</div>' ];
	if (d.s) {
		var c = (this.escape_results ? htmlspecialchars(d.s) : d.s);
		b.push('<div class="sub_result"><small>', c, '</small></div>');
	}
	return b.join('');
};
var PrivacyBaseValue = {
	FACEBOOK_EMPLOYEES : 112,
	CUSTOM : 111,
	OPEN : 100,
	EVERYONE : 80,
	NETWORKS_FRIENDS_OF_FRIENDS : 60,
	NETWORKS_FRIENDS : 55,
	FRIENDS_OF_FRIENDS : 50,
	ALL_FRIENDS : 40,
	SELF : 10,
	NOBODY : 0
};
var PrivacyFriendsValue = {
	EVERYONE : 80,
	NETWORKS_FRIENDS : 55,
	FRIENDS_OF_FRIENDS : 50,
	ALL_FRIENDS : 40,
	SOME_FRIENDS : 30,
	SELF : 10,
	NO_FRIENDS : 0
};
var PrivacySpecialPreset = {
	ONLY_CORP_NETWORK : 200,
	COLLEGE_NETWORK_FRIENDS_OF_FRIENDS : 201,
	COLLEGE_NETWORK_FRIENDS : 202
};
var PrivacyNetworkTypes = {
	TYPE_COLLEGE : 1,
	TYPE_HS : 2,
	TYPE_CORP : 3,
	TYPE_GEO : 4,
	TYPE_MANAGED : 14,
	TYPE_TEST : 50
};
var PrivacyNetworksAll = 1;
copy_properties(PrivacyBaseValue, PrivacySpecialPreset);
function PrivacyModel() {
	this.value = PrivacyBaseValue.ALL_FRIENDS;
	this.friends = PrivacyFriendsValue.NO_FRIENDS;
	this.networks = [];
	this.objects = [];
	this.lists = [];
	this.lists_x = [];
	this.list_anon = 0;
	this.ids_anon = [];
	this.list_x_anon = 0;
	this.ids_x_anon = [];
	this.tdata = {};
	return this;
}
copy_properties(PrivacyModel.prototype,
		{
			init : function(k, a, h, i, f, g, d, b, e, c, j) {
				this.value = k;
				this.friends = a;
				this.networks = h.clone();
				this.objects = i.clone();
				this.lists = f.clone();
				this.lists_x = g.clone();
				this.list_anon = d;
				this.ids_anon = b.clone();
				this.list_x_anon = e;
				this.ids_x_anon = c.clone();
				j = j || {};
				copy_properties(this.tdata, j);
			},
			clone : function() {
				var a = new PrivacyModel();
				a.init(this.value, this.friends, this.networks, this.objects,
						this.lists, this.lists_x, this.list_anon,
						this.ids_anon, this.list_x_anon, this.ids_x_anon,
						this.tdata);
				return a;
			},
			getData : function() {
				var b = [ 'value', 'friends', 'networks', 'objects', 'lists',
						'lists_x', 'list_anon', 'ids_anon', 'list_x_anon',
						'ids_x_anon' ];
				var d = {};
				for ( var c = 0; c < b.length; ++c) {
					var a = b[c];
					d[a] = this[a];
				}
				return d;
			}
		});
function BasePrivacyWidget(a, c, b) {
	this._controllerId = a;
	this._root = $(a);
	this._options = copy_properties(b || {}, c || {});
	this._formDataKey = 'privacy_data';
}
BasePrivacyWidget.mixin('Arbiter', {
	getData : function() {
		return this._model.getData();
	},
	_getPrivacyData : function(a) {
		a = a || this._fbid;
		var b = {};
		b[a] = this.getData();
		return b;
	},
	getRoot : function() {
		return this._root;
	},
	_initSelector : function(a) {
		this._selector = a;
		Selector.listen(a, 'select', function(b) {
			var c = Selector.getOptionValue(b.option);
			this._onMenuSelect(c);
		}.bind(this));
		Event.listen(a, 'click', function() {
			this.inform('menuActivated');
		}.bind(this));
	},
	_isCustomSetting : function(a) {
		return (a == PrivacyBaseValue.CUSTOM);
	},
	_updateSelector : function(a) {
		Selector.setSelected(this._selector, this._model.value);
		if (!this._isCustomSetting(this._model.value))
			return;
		var b = Selector
				.getOption(this._selector, PrivacyBaseValue.CUSTOM + '');
		b.setAttribute('data-label', a || _tx("Custom"));
		Selector.updateSelector(this._selector);
	},
	_onPrivacyChanged : function() {
		this._saveFormData();
		this.inform('privacyChanged', this.getData());
		Arbiter.inform(UIPrivacyWidget.GLOBAL_PRIVACY_CHANGED_EVENT, {
			fbid : this._fbid,
			data : this.getData()
		});
	},
	_saveFormData : function() {
		var b = DOM.find(this._root, 'div.UIPrivacyWidget_Form');
		DOM.empty(b);
		var a = {};
		if (this._options.useLegacyFormData) {
			a[this._formDataKey] = this.getData();
		} else
			a[this._formDataKey] = this._getPrivacyData();
		Form.createHiddenInputs(a, b);
	}
});
function UIPrivacyWidget(a, b, h, c, e, g) {
	var f = {
		autoSave : false,
		saveAsDefaultFbid : 0,
		initialExplanation : '',
		useLegacyFormData : false,
		composerEvents : false
	};
	if (b == '0')
		b = 0;
	this.parent.construct(this, a, g, f);
	this._lists = c;
	this._networks = e;
	this._fbid = b;
	this._row = h;
	this._groups = {};
	for ( var d in e)
		this._groups[e[d].fbid] = d;
	UIPrivacyWidget.instances[this._controllerId] = this;
}
copy_properties(UIPrivacyWidget, {
	GLOBAL_PRIVACY_CHANGED_EVENT : 'UIPrivacyWidget/globalPrivacyChanged',
	instances : {},
	getInstance : function(a) {
		return this.instances[a];
	}
});
UIPrivacyWidget.extend('BasePrivacyWidget');
UIPrivacyWidget
		.mixin(
				'Arbiter',
				{
					init : function(a) {
						this._initSelector(a);
						this.setData(this._row,
								this._options.initialExplanation, true);
						this._saveFormData();
						if (this._options.composerEvents)
							Arbiter.subscribe('composer/publish', this.reset
									.bind(this));
					},
					reset : function() {
						this._model = this._originalModel.clone();
						this._modelClone = this._originalModel.clone();
						this._updateSelector(this._options.initialExplanation);
						this._saveFormData();
						return this;
					},
					revert : function() {
						this._model = this._modelClone.clone();
						this._updateSelector(this._previousDescription);
						this._saveFormData();
						return this;
					},
					getValue : function() {
						return this._model.value;
					},
					getDefaultValue : function() {
						return this._originalModel.value;
					},
					isEveryonePrivacy : function() {
						return this._model.value == PrivacyBaseValue.EVERYONE;
					},
					dialogOpen : function() {
						return this._dialog && this._dialog.getRoot();
					},
					setData : function(b, a, c) {
						this._model = new PrivacyModel();
						this._model.init(b.value, b.friends, b.networks,
								b.objects, b.lists, b.lists_x, b.list_anon,
								b.ids_anon, b.list_x_anon, b.ids_x_anon,
								b.tdata);
						this._modelClone = this._model.clone();
						if (c)
							this._originalModel = this._model.clone();
						this._previousDescription = a;
						this._customModel = null;
						this._updateSelector(a);
					},
					setLists : function(a) {
						this._lists = a;
						return this;
					},
					setNetworks : function(a) {
						this._networks = a;
						return this;
					},
					_isCustomSetting : function(a) {
						return (a == PrivacyBaseValue.CUSTOM
								|| a == PrivacyBaseValue.NETWORKS_FRIENDS_OF_FRIENDS || a == PrivacyBaseValue.SELF);
					},
					_onMenuSelect : function(b) {
						this._modelClone = this._model.clone();
						var a = this._isCustomSetting(this._model.value);
						var c = this._isCustomSetting(b);
						if (a && !c)
							this._customModel = this._model.clone();
						if (!(a && c)) {
							this._model.value = b;
							this._resetModelAuxiliaryData();
						}
						if (b == PrivacyBaseValue.CUSTOM) {
							if (this._customModel) {
								this._model = this._customModel.clone();
							} else if (this._modelClone.value != PrivacyBaseValue.CUSTOM)
								this._model.friends = PrivacyFriendsValue.ALL_FRIENDS;
							this._showDialog();
						} else {
							if (this._groups[b]) {
								this._model = new PrivacyModel();
								this._model.value = PrivacyBaseValue.CUSTOM;
								this._model.objects = [ b ];
							}
							this._onPrivacyChanged();
							if (this._options.autoSave)
								this._saveSetting();
						}
						this._updateSelector();
					},
					_showDialog : function() {
						if (!this._fbid) {
							this._model.list_x_anon = 0;
							this._model.list_anon = 0;
						}
						var a = {
							controller_id : this._controllerId,
							privacy_data : this.getData(),
							fbid : this._fbid,
							save_as_default_fbid : this._options.saveAsDefaultFbid
						};
						this._dialog = new Dialog()
								.setAsync(
										new AsyncRequest(
												'/ajax/privacy/privacy_widget_dialog.php')
												.setData(a)).setModal(true)
								.show();
						return false;
					},
					_resetModelAuxiliaryData : function() {
						if (this._model.value != PrivacyBaseValue.CUSTOM) {
							this._model.lists_x = this._model.lists = this._model.networks = this._model.ids_anon = this._model.ids_x_anon = [];
							this._model.list_x_anon = 0;
							this._model.list_anon = 0;
						}
					},
					_saveSetting : function(a) {
						a = a || this._fbid;
						new AsyncRequest('/ajax/privacy/widget_save.php')
								.setData( {
									privacy_data : this._getPrivacyData(a),
									fbid : a
								}).setHandler(this._handleResponse.bind(this))
								.setErrorHandler(this._handleError.bind(this))
								.send();
					},
					_handleResponse : function(b) {
						var a = b.getPayload();
						this.setData(a.privacy_row, a.explanation);
					},
					_handleError : function(a) {
						AsyncResponse.defaultErrorHandler(a);
						this.revert();
					}
				});
if (typeof deconcept == "undefined")
	var deconcept = {};
if (typeof deconcept.util == "undefined")
	deconcept.util = {};
if (typeof deconcept.SWFObjectUtil == "undefined")
	deconcept.SWFObjectUtil = {};
deconcept.SWFObject = function(h, d, j, c, i, a, f, l, g, b) {
	if (!document.getElementById)
		return;
	this.DETECT_KEY = b ? b : 'detectflash';
	this.skipDetect = deconcept.util.getRequestParameter(this.DETECT_KEY);
	this.params = {};
	this.variables = {};
	this.attributes = [];
	this.fallback_html = '';
	this.fallback_js_fcn = function() {
	};
	if (h)
		this.setAttribute('swf', h);
	if (d)
		this.setAttribute('id', d);
	if (j)
		this.setAttribute('width', j);
	if (c)
		this.setAttribute('height', c);
	this.installedVer = deconcept.SWFObjectUtil.getPlayerVersion();
	if (i) {
		if (!(i instanceof Array))
			i = [ i ];
		var k;
		i.each(function(n) {
			k = new deconcept.PlayerVersion(n.toString().split('.'));
			if (k.major == this.installedVer.major) {
				this.setAttribute('version', k);
				return;
			} else if (!this.getAttribute('version')
					|| k.major < this.getAttribute('version').major)
				this.setAttribute('version', k);
		}.bind(this));
	}
	if (!window.opera && document.all && this.installedVer.major > 7)
		if (!deconcept.unloadSet) {
			deconcept.SWFObjectUtil.prepUnload = function() {
				__flash_unloadHandler = function() {
				};
				__flash_savedUnloadHandler = function() {
				};
				window.attachEvent("onunload",
						deconcept.SWFObjectUtil.cleanupSWFs);
			};
			window.attachEvent("onbeforeunload",
					deconcept.SWFObjectUtil.prepUnload);
			deconcept.unloadSet = true;
		}
	if (a)
		this.addParam('bgcolor', a);
	var e = f ? f : 'high';
	this.addParam('quality', e);
	this.setAttribute('useExpressInstall', false);
	this.setAttribute('doExpressInstall', false);
	var m = (l) ? l : window.location;
	this.setAttribute('xiRedirectUrl', m);
	this.setAttribute('redirectUrl', '');
	if (g)
		this.setAttribute('redirectUrl', g);
};
deconcept.SWFObject.prototype = {
	useExpressInstall : function(a) {
		this.xiSWFPath = !a ? "/swf/expressinstall.swf" : a;
		this.setAttribute('useExpressInstall', true);
	},
	setAttribute : function(a, b) {
		this.attributes[a] = b;
	},
	getAttribute : function(a) {
		return this.attributes[a] || "";
	},
	addParam : function(a, b) {
		this.params[a] = b;
	},
	getParams : function() {
		return this.params;
	},
	addVariable : function(a, b) {
		this.variables[a] = b;
	},
	getVariable : function(a) {
		return this.variables[a] || "";
	},
	getVariables : function() {
		return this.variables;
	},
	getVariablePairs : function() {
		var b = [];
		var a;
		var c = this.getVariables();
		for (a in c)
			b[b.length] = a + "=" + c[a];
		return b;
	},
	getSWFHTML : function() {
		var d = "";
		if (navigator.plugins && navigator.mimeTypes
				&& navigator.mimeTypes.length) {
			if (this.getAttribute("doExpressInstall")) {
				this.addVariable("MMplayerType", "PlugIn");
				this.setAttribute('swf', this.xiSWFPath);
			}
			d = '<embed type="application/x-shockwave-flash" src="'
					+ htmlspecialchars(this.getAttribute('swf')) + '" width="'
					+ htmlspecialchars(this.getAttribute('width'))
					+ '" height="'
					+ htmlspecialchars(this.getAttribute('height'))
					+ '" style="'
					+ htmlspecialchars(this.getAttribute('style') || "") + '"';
			d += ' id="' + htmlspecialchars(this.getAttribute('id'))
					+ '" name="' + htmlspecialchars(this.getAttribute('id'))
					+ '" ';
			var c = this.getParams();
			for ( var a in c)
				d += htmlspecialchars(a) + '="' + htmlspecialchars(c[a]) + '" ';
			var b = this.getVariablePairs().join("&");
			if (b.length > 0)
				d += 'flashvars="' + b + '"';
			d += '/>';
		} else {
			if (this.getAttribute("doExpressInstall")) {
				this.addVariable("MMplayerType", "ActiveX");
				this.setAttribute('swf', this.xiSWFPath);
			}
			d = '<object id="'
					+ this.getAttribute('id')
					+ '" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" width="'
					+ this.getAttribute('width') + '" height="'
					+ this.getAttribute('height') + '" style="'
					+ (this.getAttribute('style') || "") + '">';
			d += '<param name="movie" value="' + this.getAttribute('swf') + '" />';
			var c = this.getParams();
			for ( var a in c)
				d += '<param name="' + a + '" value="' + c[a] + '" />';
			var b = this.getVariablePairs().join("&");
			if (b.length > 0)
				d += '<param name="flashvars" value="' + b + '" />';
			d += "</object>";
		}
		return d;
	},
	write : function(a) {
		if (this.getAttribute('useExpressInstall')) {
			var b = new deconcept.PlayerVersion( [ 6, 0, 65 ]);
			if (this.installedVer.versionIsValid(b)
					&& !this.installedVer.versionIsValid(this
							.getAttribute('version'))) {
				this.setAttribute('doExpressInstall', true);
				this.addVariable("MMredirectURL", escape(this
						.getAttribute('xiRedirectUrl')));
				document.title = document.title.slice(0, 47)
						+ " - Flash Player Installation";
				this.addVariable("MMdoctitle", document.title);
			}
		}
		var c = (typeof a == 'string') ? document.getElementById(a) : a;
		if (this.skipDetect
				|| this.getAttribute('doExpressInstall')
				|| this.installedVer.versionIsValid(this
						.getAttribute('version'))) {
			c.innerHTML = this.getSWFHTML();
			return true;
		} else {
			if (this.getAttribute('redirectUrl') != "")
				document.location.replace(this.getAttribute('redirectUrl'));
			need_version = this.getAttribute('version').major + '.'
					+ this.getAttribute('version').minor + '.'
					+ this.getAttribute('version').rev;
			have_version = this.installedVer.major + '.'
					+ this.installedVer.minor + '.' + this.installedVer.rev;
			this.fallback_js_fcn(have_version, need_version);
			c.innerHTML = this.fallback_html;
		}
		return false;
	}
};
deconcept.SWFObjectUtil.getPlayerVersion = function() {
	var a = new deconcept.PlayerVersion( [ 0, 0, 0 ]);
	if (navigator.plugins && navigator.mimeTypes.length) {
		for ( var f = 0; f < navigator.plugins.length; f++)
			try {
				var x = navigator.plugins[f];
				if (x.name == 'Shockwave Flash') {
					PlayerVersion_tmp = new deconcept.PlayerVersion(
							x.description.replace(/([a-zA-Z]|\s)+/, "")
									.replace(/(\s+r|\s+b[0-9]+)/, ".").split(
											"."));
					if (typeof a == 'undefined'
							|| PlayerVersion_tmp.major > a.major
							|| (PlayerVersion_tmp.major == a.major && (PlayerVersion_tmp.minor > a.minor || (PlayerVersion_tmp.minor == a.minor && PlayerVersion_tmp.rev > a.rev))))
						a = PlayerVersion_tmp;
				}
			} catch (e) {
			}
	} else if (navigator.userAgent
			&& navigator.userAgent.indexOf("Windows CE") >= 0) {
		var b = 1;
		var c = 3;
		while (b)
			try {
				c++;
				b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash." + c);
				a = new deconcept.PlayerVersion( [ c, 0, 0 ]);
			} catch (d) {
				b = null;
			}
	} else {
		try {
			var b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
		} catch (d) {
			try {
				var b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
				a = new deconcept.PlayerVersion( [ 6, 0, 21 ]);
				b.AllowScriptAccess = "always";
			} catch (d) {
				if (a.major == 6)
					return a;
			}
			try {
				b = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
			} catch (d) {
			}
		}
		if (b != null)
			a = new deconcept.PlayerVersion(b.GetVariable("$version")
					.split(" ")[1].split(","));
	}
	return a;
};
deconcept.PlayerVersion = function(a) {
	this.major = a[0] != null ? parseInt(a[0]) : 0;
	this.minor = a[1] != null ? parseInt(a[1]) : 0;
	this.rev = a[2] != null ? parseInt(a[2]) : 0;
};
deconcept.PlayerVersion.prototype.versionIsValid = function(a) {
	if (this.major < a.major)
		return false;
	if (this.major > a.major)
		return true;
	if (this.minor < a.minor)
		return false;
	if (this.minor > a.minor)
		return true;
	if (this.rev < a.rev)
		return false;
	return true;
};
deconcept.util = {
	getRequestParameter : function(c) {
		var d = document.location.search || document.location.hash;
		if (c == null)
			return d;
		if (d) {
			var b = d.substring(1).split("&");
			for ( var a = 0; a < b.length; a++)
				if (b[a].substring(0, b[a].indexOf("=")) == c)
					return b[a].substring((b[a].indexOf("=") + 1));
		}
		return "";
	}
};
deconcept.SWFObjectUtil.cleanupSWFs = function() {
	var b = document.getElementsByTagName("OBJECT");
	for ( var a = b.length - 1; a >= 0; a--) {
		b[a].style.display = 'none';
		for ( var c in b[a])
			if (typeof b[a][c] == 'function')
				b[a][c] = function() {
				};
	}
};
if (!document.getElementById && document.all)
	document.getElementById = function(a) {
		return document.all[a];
	};
var getQueryParamValue = deconcept.util.getRequestParameter;
var FlashObject = deconcept.SWFObject;
var SWFObject = deconcept.SWFObject;
var flash_update_dialog_shown = false;
function spawn_flash_update_dialog(a, b) {
	if (flash_update_dialog_shown)
		return;
	flash_update_dialog_shown = true;
	new AsyncRequest().setURI('/ajax/flash_update_dialog.php').setData( {
		have_version : a,
		need_version : b
	}).setMethod('GET').setReadOnly(true).send();
}
function setFlashFallback(d, g) {
	var b = ge(d);
	var a = deconcept.SWFObjectUtil.getPlayerVersion();
	var e;
	g.each(function(h) {
		h = new deconcept.PlayerVersion(h.toString().split('.'));
		if (h.major == a.major) {
			e = h;
			return;
		} else if (typeof e == 'undefined' || h.major < e.major)
			e = h;
	}.bind(this));
	if (b && a.major > 0) {
		var c = a.major + '.' + a.minor + '.' + a.rev;
		var f = e.major + '.' + e.minor + '.' + e.rev;
		b.innerHTML = _tx(
				"Flash {required-version} is required to view this content. Your current version is {current-version}. Please download the latest Flash Player.",
				{
					'required-version' : f,
					'current-version' : c
				});
	}
}
function getFlashPlayer() {
	goURI('http://get.adobe.com/flashplayer');
	return false;
}
function showFlashErrorDialog(b, a) {
	Bootloader.loadComponents('error-dialog', function() {
		ErrorDialog.show(b, a);
	});
}

if (window.Bootloader) {
	Bootloader.done( [ "jXGVD" ]);
}