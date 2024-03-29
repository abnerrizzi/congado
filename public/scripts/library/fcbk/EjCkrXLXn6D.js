/*1292454534,169775813*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "0ZgLV" ]);
}

function ChannelUplink() {
	this.init();
}
(function() {
	var e = function() {
	};
	var f = e;
	var i = e;
	var g = function(j) {
		((window.console && (window.console.debug || window.console.log)) || e)
				("iframex: " + j);
	};
	var h = function(j) {
		((window.console && (window.console.error || window.console.log)) || e)
				("iframex: " + j);
	};
	var a = 60000, d = 100, b = 1000, c = 5000;
	copy_properties(
			ChannelUplink.prototype,
			{
				_waits : {},
				init : function() {
					this.state = 'start';
					this.enableLogging();
					this.request = null;
					this.requestNum = 0;
					this.requestTimer = null;
					this.baseURL = document.location.protocol + '//'
							+ document.location.host;
					this.isActionRequest = false;
					this.channelName = null;
					this.currentSeq = null;
					this.handleParentEvent = CrossDocument
							.mkEventHandler(this._handleParentMessage
									.bind(this));
					this.handleParentMessage = CrossDocument
							.mkMessageHandler(this._handleParentMessage
									.bind(this));
					CrossDocument
							.setListener(this.handleParentEvent.bind(this));
					this.postMessage = CrossDocument.mkPostMessage(
							window.parent, window.parent.document,
							window.parent.channelManager.handleIframeMessage);
					this.targetOrigin = CrossDocument
							.targetOrigin(window.parent);
					this.transition('parent_wait');
				},
				logToParent : function(j) {
					this.sendParentMessage( {
						type : 'log',
						msg : j
					});
				},
				enableLogging : function() {
					f = this.logToParent.bind(this);
					i = this.logToParent.bind(this);
				},
				disableLogging : function() {
					f = e;
					i = e;
				},
				transition : function(k, j) {
					var m;
					var l = this.state;
					this.state = k;
					f("transition: " + l + " -> " + k);
					if (this.request !== null)
						this.request.abandon();
					if (k == 'parent_wait') {
						this.sendParentInit.bind(this).defer(d);
						this.checkParentInit.bind(this).defer(b);
					} else if (k == 'ready') {
						this.sendRequest();
					} else if (k == 'ping') {
						this.ping();
					} else if (k == 'reconnect') {
						m = ChannelRebuildReasons.ChannelUnknown;
						if (typeof j == "object") {
							r = parseInt(j.reason);
							if (!isNaN(r))
								m = r;
						}
						this.reconnect(m);
					} else if (k == 'full_reload') {
						this.sendParentMessage( {
							type : 'channelMsg',
							channel : 'all',
							msg : {
								type : 'fullReload'
							}
						});
					} else if (!(k == 'idle')) {
						i("bogus transition " + l + " -> " + k
								+ " ... going to ready");
						this.transition('ready');
					}
				},
				wait : function(j, k) {
					if (k) {
						delete this._waits[j];
						return;
					}
					var l = this._waits[j];
					if (!l) {
						l = this.getConfig('MIN_RETRY_INTERVAL', 10000);
					} else
						l *= navigator.onLine ? Math.SQRT2 : 1;
					this._waits[j] = l;
					return (l * (.75 + Math.random() * .5)) | 0;
				},
				getConfig : function(l, k) {
					var j = this.channelConfig;
					return j && (l in j) ? j[l] : k;
				},
				sendParentMessage : function(j) {
					if (this.targetOrigin) {
						this.postMessage(JSON.encode(j), this.targetOrigin);
					} else
						this.postMessage(JSON.encode(j));
				},
				_handleParentMessage : function(j) {
					if (j.type == 'isReady') {
						this.isActionRequest = j.isActionRequest;
						if (j.channelName === null) {
							this.channelName = null;
							i("got no channels or invalid isReady message from parent; not sending a request");
							this.transition('idle');
						} else if (j.isReady) {
							this.channelName = j.channelName;
							this.currentSeq = j.currentSeq;
							this.channelManagerId = j.channelManagerId;
							this.channelConfig = j.channelConfig;
							f("parent isReady");
							this.transition('ready');
						}
					} else if (j.type == 'isActionRequest') {
						this.isActionRequest = j.isActionRequest;
					} else if (j.type == 'expectResponse')
						if (this.request === null) {
							f("expectResponse received but no request open");
						} else if (this.state != 'ping'
								&& this.state != 'ready') {
							f("expectResponse received but we're in state "
									+ this.state);
						} else {
							f("expectResponse resetting timeout to "
									+ j.newTimeout);
							this.request.resetTimeout(j.newTimeout);
						}
				},
				requestIsValid : function(j) {
					return (j == this.requestNum);
				},
				sendParentInit : function() {
					this.sendParentMessage( {
						type : 'init'
					});
				},
				checkParentInit : function() {
					if (this.state == 'parent_wait')
						this.transition('parent_wait');
				},
				sendRequest : function() {
					var l = this.baseURL + '/x/' + rand32() + '/'
							+ this.channelManagerId;
					if (this.isActionRequest) {
						l += '/true/';
						this.isActionRequest = false;
					} else
						l += '/false/';
					var j = {};
					j[encodeURIComponent(this.channelName)] = this.currentSeq;
					l += URI.implodeQuery(j);
					this.requestNum += 1;
					var k = document.location.host.match('xyzzy') ? {
						ka : '1'
					} : {};
					this.request = new AsyncRequest();
					this.request.setHandler(
							this.onRequestSuccess.bind(this, this.requestNum))
							.setErrorHandler(
									this.onRequestError.bind(this,
											this.requestNum))
							.setTransportErrorHandler(
									this.onRequestTransportError.bind(this,
											this.requestNum))
							.setTimeoutHandler(
									a,
									this.onRequestTimeout.bind(this,
											this.requestNum)).setData(k)
							.setMethod('GET').setReadOnly(true).setOption(
									'retries', 0).setOption(
									'suppressErrorAlerts', true).setURI(l)
							.setOption('tfbEndpoint', false)
							.setAllowCrossPageTransition(true).send();
				},
				onRequestSuccess : function(m, n) {
					this.wait('/x', true);
					if (!this.requestIsValid(m)) {
						i("old x request success");
						return;
					}
					var j = n.getPayload();
					if (j.t == 'refresh' || j.t == 'refreshDelay') {
						i("got refresh or refreshDelay from channel");
						this.transition('reconnect', j);
					} else if (j.t == 'fullReload') {
						this.transition('full_reload');
					} else if (j.t == 'continue') {
						this.transition('ready');
					} else if (j.t == 'msg') {
						var o = j.s - j.ms.length;
						for ( var k = 0; k < j.ms.length; k++) {
							var l = o + k;
							if (l >= this.currentSeq)
								this.sendParentMessage( {
									type : 'channelMsg',
									channel : this.channelName,
									msg : j.ms[k]
								});
						}
						this.currentSeq = j.s;
						this.sendParentMessage( {
							type : 'channelMsg',
							channel : this.channelName,
							msg : {
								type : 'seq',
								seq : this.currentSeq
							}
						});
						this.transition('ready');
					} else {
						i("got unexpected response type `" + j.t
								+ "' from channel");
						this.transition('ready');
					}
				},
				onRequestError : function(j, k) {
					if (!this.requestIsValid(j)) {
						f("old x request error");
						return;
					}
					i("x request error: " + k.getErrorDescription());
					this.transition.bind(this, 'ping').defer(this.wait('/x'));
				},
				onRequestTransportError : function(j, k) {
					if (!this.requestIsValid(j)) {
						f("old x transport error");
						return;
					}
					i("x transport error: " + k.getErrorDescription());
					this.transition.bind(this, 'ping').defer(this.wait('/x'));
				},
				onRequestTimeout : function(j) {
					if (!this.requestIsValid(j)) {
						f("old x request timeout");
						return;
					}
					i("x request timed out");
					this.transition('ping');
				},
				ping : function() {
					var j = this.baseURL + '/p';
					f("pinging " + j);
					this.requestNum += 1;
					this.request = new AsyncRequest();
					this.request.setHandler(
							this.onPingSuccess.bind(this, this.requestNum))
							.setErrorHandler(
									this.onPingError
											.bind(this, this.requestNum))
							.setTransportErrorHandler(
									this.onPingTransportError.bind(this,
											this.requestNum))
							.setTimeoutHandler(
									c,
									this.onPingTimeout.bind(this,
											this.requestNum)).setMethod('GET')
							.setReadOnly(true).setURI(j)
							.setOption('retries', 0).setOption('tfbEndpoint',
									false).setAllowCrossPageTransition(true)
							.send();
				},
				onPingSuccess : function(j, k) {
					this.wait('/p', true);
					if (!this.requestIsValid(j)) {
						i("old ping success");
						return;
					}
					f("successful ping");
					this.transition('ready');
				},
				onPingError : function(j, k) {
					if (!this.requestIsValid(j)) {
						f("old ping request error");
						return;
					}
					i("ping error: " + k.getErrorDescription());
					this.transition.bind(this, 'ping').defer(this.wait('/p'));
				},
				onPingTransportError : function(j, k) {
					if (!this.requestIsValid(j)) {
						f("old ping transport error");
						return;
					}
					i("ping transport error: " + k.getErrorDescription());
					this.transition.bind(this, 'ping').defer(this.wait('/p'));
				},
				onPingTimeout : function(j) {
					if (!this.requestIsValid(j)) {
						f("old ping timeout");
						return;
					}
					f("ping timeout");
					this.transition('ping');
				},
				reconnect : function(k) {
					i("reconnecting");
					var j = {
						type : 'shutdown',
						reason : k
					};
					this.sendParentMessage( {
						type : 'channelMsg',
						channel : 'all',
						msg : j
					});
				}
			});
	onloadRegister(function() {
		if (window.location.pathname.startsWith("/iframe/")) {
			f("constructing iframe");
			document.domain = 'facebook.com';
			window.channelUplink = new ChannelUplink();
		} else
			i("please don't require the `channel-iframe' for normal pages like "
					+ window.location);
	});
})();

if (window.Bootloader) {
	Bootloader.done( [ "0ZgLV" ]);
}