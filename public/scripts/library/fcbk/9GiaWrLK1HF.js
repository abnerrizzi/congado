/*1294957417,176820666*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "W5uK1" ]);
}

function Poller(b, a) {
	this.setTimePeriod(b);
	this._requestCallback = a;
	this.scheduleRequest();
}
Poller.MIN_TIME_PERIOD = 2000;
copy_properties(Poller.prototype, {
	stop : function() {
		clearTimeout(this._token);
		this._token = null;
		this._cancelRequest();
	},
	scheduleRequest : function() {
		this.stop();
		if (this._timePeriod)
			this._token = this._makeRequest.bind(this).defer(this._timePeriod);
	},
	requestNow : function() {
		this.stop();
		this._makeRequest();
	},
	_timePeriod : null,
	setTimePeriod : function(a) {
		a = a || null;
		if (a && (isNaN(a) || a < Poller.MIN_TIME_PERIOD))
			return;
		this._timePeriod = a;
	},
	_makeRequest : function() {
		this._cancelRequest();
		if (!this._isLoadUser())
			return;
		var b = new AsyncRequest();
		var a = true;
		b.setInitialHandler(function() {
			return a;
		});
		this._cancelRequest = function() {
			a = false;
		};
		b.setFinallyHandler(this.scheduleRequest.bind(this));
		b.setInitialHandler = bagofholding;
		b.setFinallyHandler = bagofholding;
		this._requestCallback(b);
		if (a)
			b.send();
	},
	_isLoadUser : function() {
		return Env.user == getCookie('c_user');
	},
	_cancelRequest : bagofholding,
	getTimePeriod : function() {
		return this._timePeriod;
	}
});
var ChatUserInfos = {};
var FriendLists = {
	get : function(a) {
		var b = FriendLists._map;
		if (!b[a])
			b[a] = [];
		return b[a];
	},
	set : function(a, b) {
		var c = FriendLists.get(a);
		c.length = 0;
		c.push.apply(c, b);
	},
	_map : {}
};
var AvailableList = (function() {
	var a = 5;
	var c = 60000;
	var d = '/ajax/chat/buddy_list.php';
	var b = 5000;
	var x = 0;
	var zc = false;
	var p = 0;
	var u = null;
	var h = null;
	var n = 0;
	var m = false;
	var g = null;
	var v = {};
	var s = {};
	var t = {};
	var o = {
		'0' : 2,
		'1' : 1,
		'-1' : 0
	};
	var y = {
		0 : -1,
		1 : 1,
		2 : 0
	};
	function k() {
		return Chat.isOnline() ? u : null;
	}
	function e(ze, zg, zf) {
		if (ze == Env.user)
			return;
		if (AvailableList.get(ze) == zg)
			return;
		switch (zg) {
		case AvailableList.OFFLINE:
		case AvailableList.IDLE:
		case AvailableList.ACTIVE:
			break;
		default:
			return;
		}
		if (zf) {
			s[ze] = zg;
			t[ze] = presence.getTime() + c;
		} else
			v[ze] = zg;
		x++;
		if (!h)
			h = z.defer();
	}
	function zb(ze) {
		g = ze;
		Arbiter.inform('buddylist/count-changed', ze);
	}
	function za(ze) {
		n = new Date();
		if (presence.isShutdown || !Chat.isOnline()) {
			AvailableList._poller.stop();
			return;
		}
		ze.setHandler(r).setErrorHandler(q).setTransportErrorHandler(q)
				.setOption('suppressErrorAlerts', true).setOption('retries', 1)
				.setData( {
					user : Env.user,
					popped_out : presence.poppedOut,
					available_list : AvailableList.haveFullList ? j() : {},
					force_render : zc
				}).setURI(d).setAllowCrossPageTransition(true);
	}
	function r(zh) {
		var zg = zh.getPayload();
		var ze = zg.buddy_list;
		if (!ze) {
			q(zh);
			return;
		}
		presence.updateServerTime(zg.time);
		AvailableList.updateTime = presence.getTime();
		p = 0;
		if (ze.forcedRender)
			AvailableList.haveFullList = true;
		if (ze.availableCount)
			zb(ze.availableCount);
		var zi = ze.userInfos;
		if (zi)
			copy_properties(ChatUserInfos, zi);
		var zf = ze.nowAvailableList;
		zf && AvailableList.addLegacyAvailableList(zf);
		if (ze.wasAvailableIDs)
			ze.wasAvailableIDs.forEach(function(zj) {
				v[zj] = 0;
			});
		zd();
		Arbiter.inform('buddylist/fl-changed', {
			flMode : ze.flMode,
			flData : ze.flData
		});
		presenceCookieManager.store();
	}
	function q(ze) {
		if (presence.checkMaintenanceError(ze))
			return;
		p++;
		if (p >= a) {
			zb(0);
			Arbiter.inform('buddylist/update-error');
		}
	}
	function j() {
		var ze = {};
		AvailableList.getAvailableIDs().forEach(function(zf) {
			ze[zf] = {
				i : AvailableList.isIdle(zf) ? 1 : 0
			};
		});
		return ze;
	}
	function zd() {
		if (AvailableList.haveFullList)
			Arbiter.inform('buddylist/updated');
	}
	function z() {
		h = null;
		if (AvailableList.haveFullList)
			zb(AvailableList.getAvailableIDs().length);
		Arbiter.inform('buddylist/availability-changed', {
			justCameOnline : m,
			haveFullList : AvailableList.haveFullList
		});
		m = false;
	}
	function f(ze, zg) {
		for ( var zf in ze) {
			var zh;
			if (zg) {
				zh = o[ze[zf].ol];
			} else
				zh = ze[zf] ? (ze[zf].i ? AvailableList.IDLE
						: AvailableList.ACTIVE) : 0;
			e(zf, zh, zg);
			ze[zf] && FriendLists.set(zf, ze[zf].fl);
		}
	}
	function l() {
		AvailableList._poller.setTimePeriod(k());
		if (Chat.isOnline()) {
			m = true;
			AvailableList.update();
		}
	}
	function i() {
		var ze = j();
		var zf = {
			ac : g,
			ut : parseInt(AvailableList.updateTime * .001, 10),
			ud : u * .001,
			lc : 0
		};
		var zg = AvailableList.getLegacyOverlay();
		if (!is_empty(zg))
			zf.uo = zg;
		if (!is_empty(ze))
			zf.al = ze;
		return zf;
	}
	function w() {
		for ( var ze in s)
			if (t[ze] < presence.getTime()) {
				delete s[ze];
				delete t[ze];
			}
	}
	return {
		OFFLINE : 0,
		IDLE : 1,
		ACTIVE : 2,
		haveFullList : false,
		init : function(zj, zg, zi, zh, ze, zf) {
			AvailableList.updateTime = zj;
			AvailableList.haveFullList = zg;
			AvailableList.addLegacyAvailableList(ze);
			AvailableList.addLegacyOverlay(zi);
			u = zh;
			AvailableList._poller = new Poller(k(), za);
			zb(zf);
			Arbiter.subscribe('presence/restarted', AvailableList.update);
			Arbiter.subscribe('chat/visibility-changed', l);
			Arbiter.subscribe('presence-cookie-manager/initialized', function(
					zk, zl) {
				zl.register('bl', i);
			});
			if (AvailableList.haveFullList) {
				n = new Date();
			} else if (zc)
				AvailableList.update();
		},
		get : function(ze) {
			if (ze == Env.user)
				return AvailableList.ACTIVE;
			if (ze in s && presence.getTime() < t[ze])
				return s[ze];
			return v[ze] || AvailableList.OFFLINE;
		},
		set : function(ze, zf) {
			e(ze, zf, true);
		},
		update : function() {
			if (zc && (new Date() - n) < b) {
				zd.defer();
				return;
			}
			zc = true;
			AvailableList._poller && AvailableList._poller.requestNow();
		},
		getRev : function() {
			return x;
		},
		isIdle : function(ze) {
			return AvailableList.get(ze) == AvailableList.IDLE;
		},
		getCount : function() {
			return g;
		},
		getAvailableIDs : function() {
			var ze, zf = [];
			for (ze in v)
				if (AvailableList.get(ze))
					zf.push(ze);
			for (ze in s) {
				if (ze in v)
					continue;
				if (AvailableList.get(ze))
					zf.push(ze);
			}
			return zf;
		},
		getLegacyAvailability : function(zf) {
			var ze = AvailableList.get(zf);
			return ze ? {
				i : ze == AvailableList.IDLE ? 1 : 0
			} : null;
		},
		getLegacyOverlay : function() {
			w();
			var zf = {};
			for ( var ze in s)
				zf[ze] = {
					exp : t[ze],
					fl : FriendLists.get(ze),
					ol : y[s[ze]]
				};
			return zf;
		},
		addLegacyOverlay : function(ze) {
			f(ze, true);
		},
		addLegacyAvailableList : function(ze) {
			f(ze, false);
		}
	};
})();
var Chat = {
	openTab : function(a, b, c) {
		Chat._withComponent('chatDisplay', function(d) {
			d.focusTab(a, true, b, b, c);
		});
	},
	loadTabFragile : function(b, c, a, d) {
		Chat._withComponent('chatDisplay', function(e) {
			e.loadTabFragile(b, c, a, d);
		});
	},
	openBuddyList : function() {
		Chat._withComponent('buddyListDisplay', function(a) {
			a.open();
		});
	},
	closeBuddyList : function() {
		Chat._withComponent('buddyListDisplay', function(a) {
			a.close();
		});
	},
	getAvailability : function(a) {
		return Chat._buddyList && Chat._buddyList.getAvailability(a);
	},
	getAvailableIds : function() {
		return Chat._buddyList ? Chat._buddyList.getAvailableIds() : [];
	},
	goOnline : function(a) {
		Arbiter.subscribe('chat-options/initialized', function(event, b) {
			if (Chat.isOnline()) {
				a && a();
			} else {
				if (a)
					var c = Arbiter.subscribe('chat/visibility-changed',
							function() {
								Arbiter.unsubscribe(c);
								a();
							});
				b.sendVisibility(true);
			}
		});
	},
	isOnline : function() {
		return window.chatOptions && chatOptions.visibility;
	},
	isAvailabilityReady : function() {
		return !!this._buddyList;
	},
	squelchTab : function(a, b) {
		Chat._withComponent('chatDisplay', function(c) {
			b !== false && c.unfocus(a, false);
			c.setSquelchedTab(a, true);
		});
	},
	unsquelchTab : function(a) {
		Chat._withComponent('chatDisplay', function(b) {
			b.setSquelchedTab(a, false);
		});
	},
	enterErrorMode : function(a) {
		Chat._withComponent('buddyList', function(b) {
			b.enterErrorMode(a);
		});
	},
	getActiveChats : function() {
		if (!window.chatDisplay)
			return [];
		return keys(chatDisplay.tabs);
	},
	isFeatureAvailable : function(a) {
		return window.chatDisplay && a in chatDisplay.gatedFeatures
				&& chatDisplay.gatedFeatures[a];
	},
	_componentInitEvents : {
		buddyList : 'buddylist/initialized',
		chatDisplay : 'chat-display/loaded',
		buddyListDisplay : 'buddylist-display/initialized'
	},
	_withComponent : function(b, a) {
		Arbiter.subscribe(Chat._componentInitEvents[b], function(event, c) {
			a(c);
		});
	},
	_buddyListIsInitialized : false
};
Chat._withComponent("buddyList", function(a) {
	Chat._buddyList = a;
});
copy_properties(Chat, {
	debugPrintUpdateOverlay : function() {
		Chat._withComponent('buddyList', function(a) {
			a.debugPrintUpdateOverlay();
		});
	},
	keepCorrectPresenceInfo : function(a) {
		Chat._withComponent('buddyList', function(b) {
			b.forceRetrieveAll(a);
		});
	},
	initBuddyList : function(e, j, a, b, m, i, h, g, l, f, k) {
		if (Chat._buddyListIsInitialized)
			return;
		Chat._buddyListIsInitialized = true;
		var c;
		if (e) {
			c = new ChatBuddyListView();
			c.init(j, h, g);
		} else {
			c = new ChatBuddyList();
			c.init(j, a, b, m, i, h, g, l, f, k);
		}
		var d = new ChatBuddyListDisplay(c);
	},
	updateUserInfo : function(a) {
		Chat._buddyList && Chat._buddyList.updateUserInfos(a);
	},
	setAvailable : function(c, a, b) {
		Chat._withComponent('buddyList', function(d) {
			d.setAvailable(c, a, b);
		});
	},
	setUnavailable : function(a) {
		Chat._withComponent('buddyList', function(b) {
			b.setUnavailable(a);
		});
	},
	updateAvailability : function() {
		Chat._buddyList && Chat._buddyList.updateAvailability();
	},
	setUserInfo : function(b, c, a) {
		ChatUserInfos[b] = c;
		Chat._withComponent('buddyList', function(d) {
			d.updateItemDisplay(b);
			d.setFlids(b, a);
		});
	},
	addOverlayInfo : function(a) {
		Chat._withComponent('buddyList', function(b) {
			b.addOverlayInfo(a);
		});
	}
});
function AsyncLayout() {
}
AsyncLayout.prototype = {
	init : function(b, a, c, d) {
		this.canvas_id = b.id;
		if (a)
			this.auxiliary_id = a.id;
		if (c)
			this.header_id = c.id;
		if (d)
			this.toolbar_id = d.id;
		this.auxEndpoints = {};
		this.waitingForAux = false;
		PageTransitions.registerHandler(this.catchPageTransition.bind(this));
		this.subscription = Arbiter.subscribe(
				NavigationMessage.NAVIGATION_BEGIN, this.onNavigate.bind(this));
		this.auxSubscription = Arbiter.subscribe(
				NavigationMessage.REFRESH_RIGHT_COLUMN, this.refreshRightColumn
						.bind(this));
		return this;
	},
	catchPageTransition : function(a) {
		Arbiter.unsubscribe(this.subscription);
		Arbiter.unsubscribe(this.auxSubscription);
		return false;
	},
	setAuxiliaryEndpoints : function(b) {
		for ( var a in b)
			this.auxEndpoints[a] = b[a];
	},
	onNavigate : function(d, a) {
		var e = a.useAjaxPipe
				&& AjaxPipeRequest.isActiveOnPage(a.params.endpoint);
		a = a.params;
		if (a.endpoint) {
			if (this.request) {
				this.request.setFinallyHandler(bagofholding);
				this.request.abort();
			}
			if (this.sideRequest)
				this.sideRequest.abort();
			if (e) {
				this.request = new AjaxPipeRequest().setURI(a.endpoint)
						.setData(a).setCanvasId(
								a.sidecol ? 'contentCol' : 'contentArea')
						.setFinallyHandler(this.finallyHandler.bind(this))
						.setErrorHandler(this.errorHandler.bind(this)).send();
			} else {
				a.handled = true;
				var b = false;
				if (a.prefetch) {
					b = true;
					delete a.prefetch;
				}
				this.waitingForAux = a.sidecol;
				if (a.sidecol && !b)
					this.refreshRightColumn(d, a);
				var f = !!a.iframe;
				var c = new AsyncRequest().setOption('useIframeTransport', f)
						.setURI(new URI(a.endpoint)).setReadOnly(true)
						.setMethod('GET').setData(a).setPrefetch(b).setHandler(
								this.onResponse.bind(this)).setFinallyHandler(
								this.finallyHandler.bind(this));
				if (!b) {
					c.setErrorHandler(this.errorHandler.bind(this));
					this.request = c;
				}
				c.send();
			}
		}
	},
	refreshRightColumn : function(b, a) {
		if (a.key && this.auxEndpoints[a.endpoint]) {
			this.sideRequest = new AsyncRequest(this.auxEndpoints[a.endpoint])
					.setData( {
						key : a.key
					}).setHandler(this.onSideResponse.bind(this));
			this.sideRequest.send();
		}
	},
	onSideResponse : function(b) {
		var a = b.getPayload();
		if (a && this.auxiliary_id)
			this.receivedAux(a);
	},
	receivedAux : function(a) {
		!this.waitingForAux;
		this.waitingForAux = false;
		DOM.setContent($(this.auxiliary_id), HTML(a));
	},
	onResponse : function(e) {
		var d = e.getPayload();
		if (d.redirect) {
			goURI(d.redirect);
		} else {
			var c = d.html || d;
			DOM.setContent($(this.canvas_id), HTML(c));
			if (d.side_html && this.auxiliary_id)
				this.receivedAux(d.side_html);
			if (this.header_id && !d.keep_header) {
				var b = $(this.header_id);
				DOM.setContent(b, HTML(d.header_html || ''));
				CSS.conditionShow(b, d.header_html);
			}
			if (d.toolbar_html && this.toolbar_id)
				DOM.setContent($(this.toolbar_id), HTML(d.toolbar_html));
			if (d.js)
				(new Function(d.js))();
			CSS.conditionClass('contentCol', 'hasRightCol', this.auxiliary_id
					&& !d.noRightSide);
			var f = ge('rightCol');
			if (f && d.noRightSide)
				DOM.empty(f);
		}
		var a = e.getRequest().getData();
		Arbiter.inform(NavigationMessage.NAVIGATION_COMPLETED, a.key);
	},
	errorHandler : function(a) {
		AsyncResponse.verboseErrorHandler(a);
		Arbiter.inform(NavigationMessage.NAVIGATION_FAILED);
		this.request = null;
	},
	finallyHandler : function(a) {
		this.request = null;
		PageTransitions.transitionComplete();
		Arbiter.inform(NavigationMessage.NAVIGATION_COMPLETED);
	}
};
function SideNav() {
	SideNav.instance = this;
}
SideNav.instance = null;
SideNav.getInstance = function() {
	if (SideNav.instance === null)
		return new SideNav();
	return SideNav.instance;
};
SideNav.prototype = {
	init : function(c, a, b, d, e) {
		this.selectedKey = d;
		this.loadingKey = null;
		this.loadingNode = null;
		this.editNav = {};
		this.path = URI.getRequestURI().getPath();
		this.domain = URI.getRequestURI().getDomain();
		this.navData = {};
		this.root = c;
		this.defaultKey = a;
		this.endpoints = b;
		this.keyParam = 'sk';
		this.useAjaxPipe = e;
		PageTransitions.registerHandler(this.catchPageTransition.bind(this));
		Arbiter.subscribe(NavigationMessage.NAVIGATION_COMPLETED,
				this.navigationComplete.bind(this));
		Arbiter.subscribe(NavigationMessage.NAVIGATION_FAILED,
				this.navigationFailed.bind(this));
		Arbiter.subscribe(NavigationMessage.NAVIGATION_COUNT_UPDATE,
				this.navigationCountUpdate.bind(this));
		Arbiter.subscribe(NavigationMessage.NAVIGATION_SELECT,
				this.navigationSelect.bind(this));
		if (this.selectedKey) {
			Arbiter.inform('SideNav.selectedKey', this.selectedKey,
					Arbiter.BEHAVIOR_STATE);
		} else {
			selected = Arbiter.query('SideNav.selectedKey');
			if (selected) {
				data = {
					asLoading : false
				};
				data[this.keyParam] = selected;
				this.navigationSelect(null, data);
			}
		}
		Event.listen(this.root, 'click', (function(event) {
			var f = event.getTarget();
			if (CSS.hasClass(f, 'uiCloseButton')
					&& f.parentNode.tagName == 'LI') {
				CSS.hide(Parent.byTag(f, 'li'));
				return;
			}
			if (!(CSS.hasClass(f, 'navMoreLess') || CSS.hasClass(f,
					'navEditDone')))
				f = Parent.byTag(f, 'a');
			if (f && CSS.hasClass(f, 'navEditDone'))
				this.toggleSortMode(DOM.find(Parent.byClass(f, 'expandedMode'),
						'ul.uiSideNav'), f.getAttribute('data-endpoint'));
		}).bind(this));
	},
	addEndpoints : function(a) {
		this.endpoints = merge(this.endpoints, a);
	},
	updateCloseButtons : function(b, a) {
		DOM.scry(b, 'span.buttonWrap').each((function(c) {
			Event.listen(c, 'click', (function(event) {
				var d = Parent.byClass(event.getTarget(), 'uiCloseButton');
				if (d) {
					d = DOM.find(d, 'input');
					Form.bootstrap(d.form, d);
					if (a)
						CSS.hide(Parent.byTag(d, 'li'));
				}
				Event.kill(event);
			}).bind(this));
			CSS.show(c);
		}).bind(this));
	},
	getEndpoint : function(a) {
		return this.endpoints ? this.endpoints[a] || this.endpoints : '';
	},
	catchPageTransition : function(c) {
		var b = c.getQueryData(), a = this.resolveKey(b[this.keyParam], c);
		if (a === false)
			return false;
		if (a === undefined)
			a = this.defaultKey;
		this.loadKey(a);
		return this.handlePageTransition(b, a);
	},
	resolveKey : function(a, b) {
		if (this.path != b.getPath() || this.domain != b.getDomain())
			return false;
		return a;
	},
	loadKey : function(b, c) {
		var a = DOM.scry(this.root, 'li.key-' + b);
		this.loadingNode && !c && CSS.removeClass(this.loadingNode, 'loading');
		this.loadingKey = b;
		if (a.length) {
			this.loadingNode = a[0];
			!c && CSS.addClass(this.loadingNode, 'loading');
		} else
			this.loadingNode = null;
		this.refreshRightColumn = this.shouldRefreshRightColumn(
				this.loadingNode, b);
	},
	shouldRefreshRightColumn : function(b, a) {
		return b && this.isTopLevelNode(b);
	},
	handlePageTransition : function(c, b) {
		var a = this.getEndpoint(b);
		if (!(typeof a == 'string'))
			return false;
		copy_properties(c, {
			key : b,
			endpoint : a,
			sidecol : this.refreshRightColumn
		});
		c = {
			params : c
		};
		c.useAjaxPipe = this.useAjaxPipe || c.params.ap;
		Arbiter.inform(NavigationMessage.NAVIGATION_BEGIN, c);
		return true;
	},
	isTopLevelNode : function(a) {
		return (a && a.firstChild && (CSS.hasClass(a.firstChild, 'item') || CSS
				.hasClass(a.firstChild, 'inputsearch')));
	},
	navigationSelect : function(c, a) {
		var b = a[this.keyParam];
		if (b !== undefined) {
			this.loadKey(b);
			if (!a.asLoading)
				this.navigationComplete();
		}
	},
	navigationFailed : function() {
		CSS.removeClass(this.loadingNode, 'loading');
		this.loadingNode = null;
	},
	navigationComplete : function() {
		if (this.loadingKey)
			DOM.scry(this.root, 'li.selectedItem').each(function(c) {
				CSS.removeClass(c, 'selectedItem');
			});
		if (this.loadingNode) {
			CSS.removeClass(this.loadingNode, 'loading');
			var b = null;
			if (this.isTopLevelNode(this.loadingNode)) {
				b = this.loadingNode;
			} else
				b = this.loadingNode.parentNode.parentNode;
			if (!CSS.hasClass(b, 'open')) {
				DOM.scry(this.root, 'li.open').each(function(c) {
					CSS.removeClass(c, 'open');
				});
				CSS.addClass(b, 'open');
			}
			CSS.addClass(this.loadingNode, 'selectedItem');
			var a = CSS.hasClass(this.loadingNode, 'hider');
			DOM.scry(this.root, 'div.navFold').forEach(function(c) {
				CSS.conditionClass(c, 'hideContent', a);
			});
			if (CSS.hasClass(this.loadingNode, 'expander'))
				CSS.addClass(Parent.byClass(this.loadingNode,
						'expandableSideNav'), 'expandedMode');
			this.selectedKey = this.loadingKey;
			Arbiter.inform('SideNav.selectedKey', this.selectedKey,
					Arbiter.BEHAVIOR_STATE);
			this.loadingNode = null;
			this.loadingKey = null;
		}
	},
	navigationCountUpdate : function(f, d) {
		if (!d || !d['key'] || d.count === undefined)
			return;
		var e = DOM.find(this.root, 'li.key-' + d.key);
		var b = DOM.scry(e, 'span.count');
		if (b) {
			var a = b[0];
			var c = DOM.find(e, 'span.countValue');
			if (c) {
				if (d.count < 0) {
					d.count += parseInt(DOM.getText(c), 10);
					d.count = Math.max(d.count, 0);
				}
				DOM.setContent(c, d.count);
			}
			CSS.conditionClass(a, 'hidden_elem', !d['count']);
		}
	},
	toggleSortMode : function(c, a) {
		if (!this.editNav[c]) {
			Bootloader.loadComponents('sortable-side-nav-js',
					this.initializeSortable.bind(this, c, a));
		} else {
			var d = c.parentNode, b = this.editNav[c].inEditMode();
			CSS.conditionClass(d, 'editMode', !b);
			this.editNav[c][(b ? 'endEdit' : 'beginEdit')]();
		}
		return false;
	},
	initializeSortable : function(b, a) {
		this.editNav[b] = new SortableSideNav(b, a);
		this.toggleSortMode(b);
	}
};
function ProfileSideNav() {
	this.parent.construct(this);
}
ProfileSideNav.extend('SideNav');
ProfileSideNav.prototype = {
	keyParam : 'sk',
	altKeyParam : 'v',
	ajaxPipeBlacklistedKeys : [ 'places' ],
	init : function(c, a, b, d) {
		this.parent.init(c, a, b, d, true);
		this.queryData = URI.getRequestURI().getQueryData();
		if (b && this.ajaxLoadKey)
			onloadRegister(this.handlePageTransition.bind(this, this.queryData,
					this.ajaxLoadKey));
	},
	setTabsAndKey : function(b, a) {
		this.FBTabs = b;
		this.ajaxLoadKey = a;
	},
	isFBTab : function(a) {
		return this.FBTabs && this.FBTabs.contains(a);
	},
	handlePageTransition : function(e, d) {
		var b = this.getEndpoint(d)[0];
		if (typeof b != 'string')
			return false;
		var c = !this.isFBTab(d);
		if (c) {
			b = new URI(b).setSubdomain('apps').toString();
			CSS.addClass(document.body, 'thirdParty');
		} else
			CSS.removeClass(document.body, 'thirdParty');
		e[this.keyParam] = d;
		if (this.ajaxPipeBlacklistedKeys.indexOf(d) != -1) {
			var f = URI.getRequestURI();
			f.addQueryData(e);
			go_or_replace(window.location, f, true);
		}
		copy_properties(e, {
			endpoint : b,
			sidecol : false
		});
		var a = {
			params : e,
			useAjaxPipe : true
		};
		Arbiter.inform(NavigationMessage.NAVIGATION_BEGIN, a);
		return true;
	},
	resolveKey : function(a, c) {
		if (a == undefined) {
			var b = c.getQueryData();
			a = b[this.altKeyParam];
		}
		return this.parent.resolveKey(a, c);
	},
	catchPageTransition : function(c) {
		var d = c.getQueryData();
		if (this.queryData && d && this.queryData.id != d.id)
			return false;
		var b = this.queryData && this.queryData.viewas;
		var a = d && d.viewas;
		if (b != a)
			return false;
		return this.parent.catchPageTransition(c);
	}
};
var ft = {
	NF_SOURCE_MINIFEED : 9,
	NF_SOURCE_STREAM : 10,
	NF_SOURCE_HIGHLIGHTS : 11,
	NF_EVENT_SEE_MORE : 28,
	NF_EVENT_HOVERCARD_IMPRESSION : 39,
	enableFeedTracking : function() {
		ft.feedTrackingIsEnabled = true;
		onleaveRegister(function() {
			ft.feedTrackingIsEnabled = false;
		});
	},
	logElemNew : function(a, c) {
		if (!ft.feedTrackingIsEnabled)
			return;
		if (a.context != 'click' && a.context != 'a' && a.context != 'ufi')
			return;
		var b = collect_data_attrib(a.node, 'ft');
		if (count(b)) {
			b.dest = a.href;
			ft.logData(b, c);
		}
	},
	logData : function(a, b) {
		var c = {};
		copy_properties(c, a);
		if (b)
			copy_properties(c, b);
		new AsyncSignal('/ajax/f2.php', {
			link_data : JSON.encode(c)
		}).send();
	}
};
onloadRegister(function() {
	Arbiter.subscribe('user/action', function(b, a) {
		ft.logElemNew(a);
	});
});
function URLScraper(a) {
	this.input = a;
	this.enable();
}
URLScraper.mixin('Arbiter', {
	reset : function() {
		this.lastMatch = null;
	},
	enable : function() {
		if (this.events)
			return;
		var a = function(b) {
			setTimeout(this.check.bind(this, b), 30);
		};
		this.events = Event.listen(this.input, {
			paste : a.bind(this, false),
			keydown : a.bind(this, true)
		});
	},
	disable : function() {
		if (!this.events)
			return;
		for ( var event in this.events)
			this.events[event].remove();
		this.events = null;
	},
	check : function(b) {
		var c = this.input.value;
		if (b && URLScraper.trigger(c))
			return;
		var a = URLScraper.match(c);
		if (a && a != this.lastMatch) {
			this.lastMatch = a;
			this.inform('match', {
				url : a
			});
		}
	}
});
(function() {
	var c = '[a-z][a-z0-9\\-+.]+://', h = 'www\\d{0,3}[.]', b = '[a-z0-9.\\-]+[.][a-z]{2,4}\\/', a = '\\([^\\s()<>]+\\)', f = '[^\\s()<>]+', e = '[^\\s`!()\\[\\]{};:\'".,<>?]';
	var d = new RegExp('\\b(' + '(?:' + c + '|' + h + '|' + b + ')' + '(?:' + a
			+ '|' + f + ')*' + '(?:' + a + '|' + e + ')' + ')', 'im');
	var g = /[\s'"!;,)]/;
	URLScraper.match = function(i) {
		return (d.exec(i) || [])[1] || null;
	};
	URLScraper.trigger = function(i) {
		return !g.test(i.charAt(i.length - 1));
	};
})();
function OnVisible(b, c, f, a, d) {
	d = d || {};
	this.targetY = Vector2.getElementPosition(b).y;
	this.buffer = coalesce(a, 300);
	this.lastY = Vector2.getScrollPosition().y;
	this.lastTime = (+new Date());
	var e = function() {
		var l = Vector2.getScrollPosition().y;
		var j = Vector2.getViewportDimensions().y;
		var k = l + j + this.buffer;
		var i = !f
				|| (Vector2.getScrollPosition().y - this.buffer < (this.targetY + Vector2
						.getElementDimensions(b).y));
		if (i && (k > this.targetY)) {
			this.remove();
			if (d.detect_speed) {
				var g = (l - this.lastY);
				var h = g / ((+new Date()) - this.lastTime + 1);
				if ((h > j / 100)
						|| (k >= Vector2.getDocumentDimensions().y && g > 1000))
					return true;
			}
			c();
		}
		if (d.detect_speed) {
			this.lastY = l;
			this.lastTime = (+new Date());
		}
		return true;
	}.bind(this);
	this.scrollListener = Event.listen(window, 'scroll', e);
	this.resizeListener = Event.listen(window, 'resize', e);
	e();
	onleaveRegister(this.remove.bind(this));
}
copy_properties(OnVisible.prototype, {
	remove : function() {
		if (this.scrollListener) {
			this.scrollListener.remove();
			this.resizeListener.remove();
			this.scrollListener = this.resizeListener = null;
		}
	}
});
Dcode = function() {
	var a, d = {}, b = {
		_ : '%',
		A : '%22%3a',
		B : '%2c%22',
		C : '%2c%22sb%22%3a1%2c%22t%22%3a%7b%7d%2c%22f%22%3anull%2c%22uct%22%3a0%2c%22s%22%3a0%7d%2c%22bl%22%3a%7b%22ac%22%3a',
		D : '%7b%22',
		E : '%2c%22pt%22%3a0%2c%22vis%22%3a1%2c%22bls%22%3a0%2c%22blc%22%3a0%2c%22snd%22%3a1%2c%22blo%22%3a0%2c%22bvt%22%3a',
		F : 'ri%22%3a0%7d%2c%22state%22%3a%7b%22p%22%3a0%2c%22ut%22%3a1',
		G : '%2c%22ch%22%3a%7b%22h%22%3a%22channel',
		H : '%22%2c%22p%22%3a80%2c%22sub%22%3a%5b',
		I : '%7d%7d',
		J : '%7b%22v%22%3a2%2c%22time%22%3a1',
		K : '%2c%22lc%22%3a1%2c%22cvr%22%3a%7b%22r%22%3a1%2c%22ts%22%3a1',
		L : '%5d%2c%22p%5f',
		M : '%22%3a0%2c%22',
		N : '%22%3a%7b%22i%22%3a0%2c%22all%46lids%22%3a%5bnull%5d',
		O : '0000',
		P : '%22%3a1',
		Q : '%7d',
		R : '%2c%22pt%22%3a0%2c%22vis%22%3a0%2c%22bls%22%3a0%2c%22blc%22%3a0%2c%22snd%22%3a1%2c%22blo%22%3a0%2c%22bvt%22%3a0%2c%22ct%22%3a0%2c%22sb%22%3a1%2c%22t%22%3a%7b%7d%2c%22f%22%3anull%2c%22uct%22%3a0%2c%22s%22%3a0%7d%2c2bl%22%3a%7b%22ac%22%3a0%2c%22ut',
		S : '%22%3a%7b%22ol%22%3a%2d1%2c%22exp%22%3a1',
		T : 'fl%22%3a%5b%22%2d1%22%5d%2c%22all%46lids%22%3a%5b%22%2d1%22%5d',
		U : 'ud%22%3a900%2c%22lc%22%3a0%2c%22cvr%22%3a%7b',
		V : '%2c%22ut%22%3a1',
		W : '%2c%22pt%22%3a0%2c%22vis%22%3a1%2c%22bls',
		X : '%2c%22lc%22%3a1%2c%22cvr%22%3a%7b%22r%22%3a0%2e',
		Y : '%22%3a%7b%22n%22%3a%22%',
		Z : '%2c%22ud%22%3a'
	};
	function c() {
		var f = [];
		for ( var e in b) {
			d[b[e]] = e;
			f.push(b[e]);
		}
		f.reverse();
		a = new RegExp(f.join("|"), 'g');
	}
	return {
		encode : function(e) {
			c();
			return encodeURIComponent(e).replace(/([_A-Z])|%../g,
					function(g, f) {
						return f ? '%' + f.charCodeAt(0).toString(16) : g;
					}).toLowerCase().replace(a, function(f) {
				return d[f];
			});
		},
		decode : function(e) {
			return decodeURIComponent(e.replace(/[_A-Z]/g, function(f) {
				return b[f];
			}));
		}
	};
}();
function CookieManager(b, a) {
	this.version = b;
	this.cookieName = 'presence';
	this.dictEncode = a;
	this.storers = {};
	Arbiter.inform('presence-cookie-manager/initialized', this,
			Arbiter.BEHAVIOR_PERSISTENT);
}
CookieManager.prototype = {
	register : function(b, a) {
		this.storers[b] = a;
	},
	store : function() {
		var a = this._getCookie();
		if (a && a.v && this.version < a.v) {
			presence.versionShutdown();
			return;
		}
		var b = {
			v : this.version,
			time : parseInt(presence.getTime() * .001)
		};
		for ( var d in this.storers)
			b[d] = this.storers[d]();
		var c = JSON.encode(b);
		if (this.dictEncode)
			c = 'D' + Dcode.encode(c);
		setCookie(this.cookieName, c, null);
	},
	clear : function() {
		clearCookie(this.cookieName);
	},
	_getCookie : function() {
		try {
			var data = getCookie(this.cookieName);
			if (this.lastD === data) {
				return this.lastV;
			} else {
				this.lastD = data;
				this.lastV = null;
			}
			if (data && data.charAt(0) == 'D')
				data = Dcode.decode(data.substring(1));
			if (data) {
				this.lastV = JSON.decode(data);
				return this.lastV;
			}
		} catch (a) {
		}
		return null;
	},
	getSubCookie : function(b) {
		var a = this._getCookie();
		if (!a)
			return null;
		return a[b];
	}
};
function StreamProfileComposer() {
}
StreamProfileComposer.prototype = {
	init : function(a) {
		var b = $(a);
		Arbiter.subscribe('composer/publish', function(event, c) {
			animation.prependInsert(b, c);
		});
	}
};
function Composer() {
}
(function() {
	var b = 1, a = 2;
	var f = {};
	var e = function() {
		var j = DOM.scry(this.root, 'span.linkAttachment')[0];
		if (!j)
			return;
		var i = Parent.byTag(j, 'form');
		this.scraper = new URLScraper(this.input);
		this.scraper
				.subscribe(
						'match',
						function(k, l) {
							i.action = '/ajax/composer/attachment/link/scraper.php?scrape_url=' + encodeURIComponent(l.url);
							i.xhpc.value = j.id;
							i.xhpc.click();
						}.bind(this));
	};
	var g = function(event, i) {
		i = i || {};
		i.evt = event;
		i.flowID = this.flowID;
		i.context = this.form.xhpc_context.value;
		i.target = this.form.action.split('/').pop();
		i = {
			data : JSON.encode(i)
		};
		new AsyncSignal('/ajax/composer/logging.php', i).send();
	};
	var d = function(i) {
		this.flowID = new Date().getTime().toString() + (rand32() + 1);
		this._logged_short = this._logged_long = false;
		if (i)
			return;
		Event.listen(this.input, 'keypress', function() {
			var j = Input.getValue(this.input).length;
			if (!this._logged_short && j >= 2) {
				g.call(this, 'typing', {
					extra : 'short'
				});
				this._logged_short = true;
				return;
			}
			if (!this._logged_long && j >= 15) {
				g.call(this, 'typing', {
					extra : 'long'
				});
				this._logged_long = true;
			}
		}.bind(this));
	};
	var c = function(i) {
		g.call(this, 'publish');
		if (this.submitHandler)
			return (new Function(this.submitHandler)).apply(this.form);
	};
	var h = function() {
		Input.reset(this.input);
		this.mentionsInput && this.mentionsInput.reset();
		var j = DOM.scry(this.root, '.uiComposerAttachmentSelected')[0];
		var i = DOM.scry(this.root, '.uiComposerAttachment')[0];
		if (j && j !== i) {
			CSS.removeClass(j, 'uiComposerAttachmentSelected');
			CSS.addClass(i, 'uiComposerAttachmentSelected');
		}
		CSS.removeClass(this.root, 'uiComposerInteracted');
		CSS.setClass(this.focus, 'focus_target');
		this.setLoading(false);
		d.call(this, true);
	};
	Composer.prototype = {
		init : function(j, i) {
			f[j.id] = this;
			this.root = j;
			this.focus = DOM.find(j, 'div.focus_target');
			this.form = DOM.find(j, 'form.attachmentForm');
			this.content = DOM.find(j, 'div.attachmentContent');
			this.blurb = DOM.find(j, 'div.uiComposerMessageBox div.textBlurb');
			this.input = DOM.find(j, 'div.uiComposerMessageBox textarea.input');
			this.button = DOM.find(j,
					'div.uiComposerMessageBox label.submitBtn');
			this.privacy = DOM.find(j,
					'div.uiComposerMessageBox li.privacyWidget');
			if (i) {
				i.subscribe('init', function() {
					var k = i.getTypeahead().getView();
					k.subscribe( [ 'reset', 'render' ], function(l) {
						CSS.conditionClass(j, 'uiComposerMention',
								(l == 'render'));
					});
				});
				this.mentionsInput = i;
			}
			Event.listen(this.form, 'submit', c.bind(this));
			e.call(this);
			d.call(this);
			Arbiter.inform('xhpc/init/' + j.id, this, Arbiter.BEHAVIOR_STATE);
		},
		setBlurb : function(i) {
			DOM.setContent(this.blurb, i);
		},
		setEnabled : function(i) {
			Button.setEnabled(this.button, i);
		},
		setLoading : function(i) {
			CSS.conditionClass(this.root, 'async_saving', !!i);
		},
		setContentVisible : function(i) {
			CSS.conditionClass(this.root, 'uiComposerHideContent', !i);
		},
		setMessageBoxVisible : function(i) {
			CSS.conditionClass(this.root, 'uiComposerHideMessageBox', !i);
		},
		setInputVisible : function(i) {
			CSS.conditionClass(this.root, 'uiComposerHideInput', !i);
		},
		reset : function() {
			var i = DOM.scry(this.root, '.uiComposerAttachment')[0];
			var j = Parent.byTag(i, 'form');
			var k = URI(i.getAttribute('data-endpoint'));
			k.addQueryData(Form.serialize(j));
			k.addQueryData( {
				reset : true
			});
			new AsyncRequest(k).setMethod('GET').setReadOnly(true).setHandler(
					function(l) {
						this.reset = this.mutate.bind(this, l.getPayload());
						this.reset();
					}.bind(this)).send();
		},
		mutate : function(j) {
			if (j.reset) {
				h.call(this);
			} else {
				CSS.addClass(this.root, 'uiComposerOpen');
				CSS.addClass(this.root, 'uiComposerInteracted');
			}
			var i = ge(j.xhpc);
			if (i) {
				var k = DOM.scry(this.root, '.uiComposerAttachmentSelected')[0];
				if (k)
					CSS.removeClass(k, 'uiComposerAttachmentSelected');
				CSS.addClass(i, 'uiComposerAttachmentSelected');
				if (!j.disableCache)
					Event.listen(i, 'click', function(l) {
						$E(l).stop();
						this.mutate(j);
					}.bind(this));
			}
			if (j.content) {
				DOM.setContent(this.content, HTML(j.content));
				this.setContentVisible(true);
			} else {
				this.setContentVisible(false);
				DOM.empty(this.content);
			}
			this.setMessageBoxVisible(j.messageBoxVisible);
			this.setInputVisible(j.inputVisible);
			CSS.conditionShow(this.privacy, j.privacyWidgetVisible);
			Input.setPlaceholder(this.input, j.placeholder);
			Button.setLabel(this.button, j.buttonLabel);
			this.setBlurb(HTML(j.blurb));
			CSS.conditionClass(DOM.scry(this.form, '.uiComposerMessageBox')[0],
					'uiCheckinComposer', j.placeVisible);
			if (j.autoscrape) {
				this.scraper && this.scraper.enable();
			} else
				this.scraper && this.scraper.disable();
			this.setEnabled(j.enabled);
			this.form.setAttribute('action', j.endpoint);
			if (j.formType == b) {
				this.form.setAttribute('rel', 'async');
			} else
				this.form.removeAttribute('rel');
			if (j.formType == a) {
				this.form.target = j.iframeName;
				this.form.enctype = this.form.encoding = 'multipart/form-data';
			} else {
				this.form.removeAttribute('target');
				this.form.removeAttribute('enctype');
				this.form.removeAttribute('encoding');
			}
			this.submitHandler = j.submitHandler;
			if (j.messageBoxFocused)
				this.input.focus();
		}
	};
	copy_properties(Composer, {
		publish : function(j, i) {
			Composer.getInstance($(j)).reset();
			Arbiter.inform('composer/publish', HTML(i).getRootNode());
		},
		getInstance : function(i) {
			var j = Parent.byClass($(i), 'uiComposer');
			return j ? f[j.id] : null;
		}
	});
})();
function MentionsInput() {
}
MentionsInput.getInstance = function(a) {
	var b = Parent.byClass(a, 'uiMentionsInput');
	return b ? DataStore.get(b, 'MentionsInput') : null;
};
MentionsInput.mixin('Arbiter', {
	init : function(e, f, b, a, c) {
		this.init = bagofholding;
		this.typeahead = f;
		this.highlighter = b;
		this.hiddenInput = a;
		this.maxMentions = c;
		this.data = f.getData();
		this.input = f.getCore().getElement();
		var d = this.input.name;
		this.input.name = d + '_text';
		this.hiddenInput.name = d;
		this.reset();
		this.initEvents();
		this.initTypeahead();
		this.update();
		DataStore.set(e, 'MentionsInput', this);
		this.initialized = true;
		this.inform('init');
	},
	reset : function() {
		this.removeAllTokens();
		if (this.initialized) {
			this.hiddenInput.value = '';
			DOM.empty(this.highlighter);
		}
	},
	initEvents : function() {
		var a = this.update.bind(this);
		a = a.defer.bind(a, 30);
		Event.listen(this.input, {
			change : a,
			keydown : a,
			keypress : a
		});
	},
	initTypeahead : function() {
		this.typeahead.subscribe('select', function(a, b) {
			var c = b.selected;
			if (!this.maxMentions || this.numMentioned < this.maxMentions)
				this.addToken(c.uid, c.text);
			this.updateValue();
		}.bind(this));
		if (Input.getSubmitOnEnter(this.input))
			this.typeahead.subscribe( [ 'render', 'reset', 'select' ],
					function(event) {
						Input.setSubmitOnEnter(this.input, event != 'render');
					}.bind(this));
	},
	update : function() {
		this.updateTokens();
		this.updateValue();
		this.updateWidth();
	},
	updateTokens : function() {
		var c = Input.getValue(this.input);
		for ( var b in this.mentioned) {
			var a = this.mentioned[b];
			if (!a || c.indexOf(a) == -1)
				this.removeToken(b);
		}
	},
	updateValue : function() {
		var d, b;
		var e = Input.getValue(this.input);
		var c = this.tokens;
		for (d in this.mentioned) {
			b = this.mentioned[d];
			e = e.replace(b, '@[' + d + ':]');
		}
		var a = htmlize(e);
		for (d in this.mentioned) {
			b = this.mentioned[d];
			a = a.replace('@[' + d + ':]', '<b>' + htmlize(b) + '</b>');
		}
		if (ua.ie())
			a = a.replace(/ {2}/g, '&nbsp; ');
		this.hiddenInput.value = e;
		DOM.setContent(this.highlighter, HTML(a));
	},
	updateWidth : function() {
		var a = TextAreaControl.getWidth(this.input);
		if (ua.ie() <= 7) {
			a -= parseInt(CSS.getStyle(this.highlighter, 'paddingLeft'), 10);
			Parent.byClass(this.highlighter, 'highlighter').style.zoom = 1;
		}
		this.highlighter.style.width = a + 'px';
		this.updateWidth = bagofholding;
	},
	addToken : function(a, b) {
		this.mentioned[a] = b;
		this.numMentioned++;
		this.data.setExclusions(keys(this.mentioned));
	},
	removeToken : function(a) {
		delete this.mentioned[a];
		this.numMentioned--;
		this.data.setExclusions(keys(this.mentioned));
	},
	removeAllTokens : function() {
		this.mentioned = {};
		this.numMentioned = 0;
		this.data && this.data.setExclusions( []);
	},
	getTypeahead : function() {
		return this.typeahead;
	}
});
var Menu = function() {
	var i = 'menu:mouseover';
	var a = null;
	function b(k) {
		return Parent.byClass(k, 'uiMenu');
	}
	function c(k) {
		return Parent.byClass(k, 'uiMenuItem');
	}
	function d(k) {
		if (document.activeElement) {
			var l = c(document.activeElement);
			return k.indexOf(l);
		}
		return -1;
	}
	function e(k) {
		return DOM.find(k, 'a.itemAnchor');
	}
	function f(k) {
		return CSS.hasClass(k, 'checked');
	}
	function g(k) {
		return !CSS.hasClass(k, 'disabled');
	}
	function h(event) {
		var k = c(event.getTarget());
		k && Menu.focusItem(k);
	}
	function j(k) {
		Menu.inform(Menu.ITEM_SELECTED, {
			menu : b(k),
			item : k
		});
	}
	onloadRegister(function() {
		var k = {};
		k.click = function(event) {
			var n = c(event.getTarget());
			if (n && g(n)) {
				j(n);
				var l = e(n);
				var m = l.href;
				var o = l.getAttribute('rel');
				return (o && o !== 'ignore')
						|| (m && m.charAt(m.length - 1) !== '#');
			}
		};
		k.keydown = function(event) {
			var u = event.getTarget();
			if (!a || DOM.isNode(u, [ 'input', 'textarea' ]))
				return;
			var q = Event.getKeyCode(event);
			switch (q) {
			case KEYS.UP:
			case KEYS.DOWN:
				var m = Menu.getEnabledItems(a);
				var o = d(m);
				Menu.focusItem(m[o + (q === KEYS.UP ? -1 : 1)]);
				return false;
			case KEYS.SPACE:
				var t = c(u);
				if (t) {
					j(t);
					event.prevent();
				}
				break;
			default:
				var l = String.fromCharCode(q).toLowerCase();
				var p = Menu.getEnabledItems(a);
				var o = d(p);
				var n = o;
				var r = p.length;
				while ((~o && (n = ++n % r) !== o) || (!~o && ++n < r)) {
					var s = Menu.getItemLabel(p[n]);
					if (s && s.charAt(0).toLowerCase() === l) {
						Menu.focusItem(p[n]);
						return false;
					}
				}
			}
		};
		Event.listen(document.body, k);
	});
	return copy_properties(new Arbiter(), {
		ITEM_SELECTED : 'menu/item-selected',
		ITEM_TOGGLED : 'menu/item-toggled',
		focusItem : function(k) {
			if (k) {
				this._removeSelected(b(k));
				CSS.addClass(k, 'selected');
				g(k) && e(k).focus();
			}
		},
		getEnabledItems : function(k) {
			return Menu.getItems(k).filter(g);
		},
		getCheckedItems : function(k) {
			return Menu.getItems(k).filter(f);
		},
		getItems : function(k) {
			return DOM.scry(k, 'li.uiMenuItem');
		},
		getItemLabel : function(k) {
			return k.getAttribute('data-label', 2) || '';
		},
		isItemChecked : function(k) {
			return CSS.hasClass(k, 'checked');
		},
		register : function(k) {
			k = b(k);
			if (!DataStore.get(k, i))
				DataStore.set(k, i, Event.listen(k, 'mouseover', h));
			a = k;
		},
		setItemEnabled : function(l, k) {
			if (!k && !DOM.scry(l, 'span.disabledAnchor')[0])
				DOM.appendContent(l, $N('span', {
					className : 'itemAnchor disabledAnchor'
				}, HTML(e(l).innerHTML)));
			CSS.conditionClass(l, 'disabled', !k);
		},
		toggleItem : function(l) {
			var k = !Menu.isItemChecked(l);
			CSS.conditionClass(l, 'checked', k);
			e(l).setAttribute('aria-checked', k);
			Menu.inform(Menu.ITEM_TOGGLED, {
				menu : b(l),
				item : l,
				checked : k
			});
		},
		unregister : function(l) {
			l = b(l);
			var k = DataStore.remove(l, i);
			k && k.remove();
			a = null;
			this._removeSelected(l);
		},
		_removeSelected : function(k) {
			Menu.getItems(k).filter(function(l) {
				return CSS.hasClass(l, 'selected');
			}).each(function(l) {
				CSS.removeClass(l, 'selected');
			});
		}
	});
}();
var Selector = function() {
	var a;
	var k = false;
	function b(m) {
		return Parent.byClass(m, 'uiSelector');
	}
	function c(m) {
		return Parent.byClass(m, 'uiSelectorButton');
	}
	function d(m) {
		return DOM.find(m, 'a.uiSelectorButton');
	}
	function g(m) {
		return DOM.scry(m, 'select')[0];
	}
	function e(m) {
		return DOM.scry(m, 'ul.uiSelectorMenu')[0];
	}
	function f(m) {
		return DOM.find(m, 'div.uiSelectorMenuWrapper');
	}
	function h() {
		h = bagofholding;
		Menu.subscribe(Menu.ITEM_SELECTED,
				function(m, o) {
					if (!a || !o || o.menu !== e(a))
						return;
					var p = i(a);
					var r = j(o.item);
					if (r) {
						var n = a;
						var s = Selector.inform('select', {
							selector : n,
							option : o.item
						});
						if (s === false)
							return;
						var q = Selector.isOptionSelected(o.item);
						if (p || !q) {
							Selector.setSelected(n, Selector
									.getOptionValue(o.item), !q);
							Selector.inform('toggle', {
								selector : n,
								option : o.item
							});
							Selector.inform('change', {
								selector : n
							});
							if (l(n))
								DataStore.set(n, 'dirty', true);
						}
					}
					if (!p || !r)
						a && Selector.toggle(a);
				});
	}
	function i(m) {
		return !!m.getAttribute('data-multiple');
	}
	function j(m) {
		return CSS.hasClass(m, 'uiSelectorOption');
	}
	function l(m) {
		return !!m.getAttribute('data-autosubmit');
	}
	onloadRegister(function() {
		var m = {};
		m.keydown = function(event) {
			var o = event.getTarget();
			if (DOM.isNode(o, [ 'input', 'textarea' ]))
				return;
			switch (Event.getKeyCode(event)) {
			case KEYS.DOWN:
			case KEYS.SPACE:
			case KEYS.UP:
				k = true;
				if (c(o)) {
					var n = b(o);
					Selector.toggle(n);
					return false;
				}
				break;
			case KEYS.ESC:
				k = true;
				if (a) {
					Selector.toggle(a);
					return false;
				}
				break;
			case KEYS.RETURN:
				k = true;
				break;
			}
		};
		m.keyup = function() {
			!function() {
				k = false;
			}.defer();
		};
		Event.listen(document.body, m);
		Bootloader
				.loadComponents(
						'Toggler',
						function() {
							Toggler
									.subscribe(
											[ 'show', 'hide' ],
											function(v, u) {
												var r = b(u.getActive());
												if (r) {
													h();
													var o = d(r);
													var p = e(r);
													var s = v === 'show';
													if (s) {
														a = r;
														if (CSS
																.hasClass(o,
																		'uiButtonDisabled')) {
															Selector
																	.setEnabled(
																			r,
																			false);
															return false;
														}
														if (!p) {
															var n = o
																	.getAttribute('ajaxify');
															if (n) {
																var w = HTML('<div class="uiSelectorMenuWrapper">'
																		+ '<ul class="uiMenu uiSelectorMenu loading">'
																		+ '<li><span></span></li>'
																		+ '</ul>'
																		+ '</div>');
																DOM
																		.appendContent(
																				o.parentNode,
																				w);
																Bootloader
																		.loadComponents(
																				'async',
																				function() {
																					AsyncRequest
																							.bootstrap(
																									n,
																									o);
																				});
																p = e(r);
															}
														}
														if (p) {
															Menu.register(p);
															if (k) {
																var q = Menu
																		.getCheckedItems(p);
																if (!q.length)
																	q = Menu
																			.getEnabledItems(p);
																Menu
																		.focusItem(q[0]);
															}
														}
													} else {
														a = null;
														p && Menu.unregister(p);
														k && o.focus();
														if (l(r)
																&& DataStore
																		.get(r,
																				'dirty')) {
															var t = DOM
																	.scry(r,
																			'input.submitButton')[0];
															t && t.click();
															DataStore.remove(r,
																	'dirty');
														}
													}
													CSS.conditionClass(d(r),
															'selected', s);
													Selector.inform(s ? 'open'
															: 'close', {
														selector : r
													});
												}
											});
						});
	});
	return copy_properties(new Arbiter(),
			{
				attachMenu : function(q, m, o) {
					q = b(q);
					if (q) {
						a && Menu.unregister(e(a));
						DOM.setContent(f(q), m);
						a && Menu.register(e(q));
						if (o) {
							var p = g(q);
							if (p) {
								DOM.replace(p, o);
							} else
								DOM.insertAfter(q.firstChild, o);
							var n = q.getAttribute('data-name');
							n && g(q).setAttribute('name', n);
						}
						return true;
					}
				},
				getOption : function(o, p) {
					var n = Selector.getOptions(o), m = n.length;
					while (m--)
						if (p === Selector.getOptionValue(n[m]))
							return n[m];
					return null;
				},
				getOptions : function(n) {
					var m = Menu.getItems(e(n));
					return m.filter(j);
				},
				getEnabledOptions : function(n) {
					var m = Menu.getEnabledItems(e(n));
					return m.filter(j);
				},
				getSelectedOptions : function(m) {
					return Menu.getCheckedItems(e(m));
				},
				getOptionText : function(m) {
					return Menu.getItemLabel(m);
				},
				getOptionValue : function(n) {
					var p = b(n);
					var o = g(p);
					var m = Selector.getOptions(p).indexOf(n);
					return m >= 0 ? o.options[m + 1].value : '';
				},
				getValue : function(q) {
					var o = g(q);
					if (!o)
						return null;
					if (!i(q))
						return o.value;
					var r = [];
					var n = o.options;
					for ( var m = 1, p = n.length; m < p; m++)
						if (n[m].selected)
							r.push(n[m].value);
					return r;
				},
				isOptionSelected : function(m) {
					return Menu.isItemChecked(m);
				},
				listen : function(n, o, m) {
					return this.subscribe(o, function(q, p) {
						if (p.selector === n)
							return m(p, q);
					});
				},
				setButtonLabel : function(p, n) {
					var m = d(p);
					var o = parseInt(m.getAttribute('data-length'), 10);
					n = n || m.getAttribute('data-label') || '';
					Button.setLabel(m, n);
					if (typeof n === 'string') {
						CSS.conditionClass(m, 'uiSelectorBigButtonLabel',
								n.length > o);
						if (o && n.length > o) {
							m.setAttribute('title', n);
						} else
							m.removeAttribute('title');
					}
				},
				setButtonTooltip : function(o, n) {
					var m = d(o);
					TooltipLink.setTooltipText(m, n
							|| m.getAttribute('data-tooltip') || '');
				},
				setEnabled : function(n, m) {
					if (!m && a && b(n) === a)
						Selector.toggle(n);
					Button.setEnabled(d(n), m);
				},
				setOptionEnabled : function(n, m) {
					Menu.setItemEnabled(n, m);
				},
				setSelected : function(q, r, o) {
					o = o !== false;
					var n = Selector.getOption(q, r);
					if (!n)
						return;
					var m = Selector.isOptionSelected(n);
					if (o !== m) {
						if (!i(q) && !m) {
							var p = Selector.getSelectedOptions(q)[0];
							p && Menu.toggleItem(p);
						}
						Menu.toggleItem(n);
						Selector.updateSelector(q);
					}
				},
				toggle : function(m) {
					Bootloader.loadComponents('Toggler', function() {
						Toggler.toggle(DOM.scry(b(m), 'div.wrap')[0]);
					});
				},
				updateSelector : function(v) {
					var s = Selector.getOptions(v);
					var u = Selector.getSelectedOptions(v);
					var p = g(v).options;
					var r = [];
					for ( var o = 0, q = s.length; o < q; o++) {
						var t = u.contains(s[o]);
						p[o + 1].selected = t;
						if (t)
							r.push(Selector.getOptionText(s[o]));
					}
					p[0].selected = !u.length;
					var m = CSS.hasClass(v, 'uiSelectorDynamicLabel');
					var n = CSS.hasClass(v, 'uiSelectorDynamicTooltip');
					if (m || n) {
						r = r.join(i(v) ? d(v).getAttribute('data-delimiter')
								: '');
						m && Selector.setButtonLabel(v, r);
						n && Selector.setButtonTooltip(v, r);
					}
				}
			});
}();
var TypeaheadUtil = (function() {
	var c = /[ ]+/g, d = /[^ ]+/g, a = /[^\w ]/g, b = /[-~_\u2010\u2011\u2012\u2013\u2014\u2015\u30fb]+/g;
	var e = new RegExp('(\\' + [ '/', '.', '*', '+', '?', '|', '(', ')', '[',
			']', '{', '}', '\\' ].join('|\\') + ')', 'g');
	var f = {
		"\u0430" : 'a',
		"\u00e0" : 'a',
		"\u00e1" : 'a',
		"\u00e2" : 'a',
		"\u00e3" : 'a',
		"\u00e4" : 'a',
		"\u00e5" : 'a',
		"\u0431" : 'b',
		"\u0446" : 'c',
		"\u00e7" : 'c',
		"\u010d" : 'c',
		"\u0434" : 'd',
		"\u00f0" : 'd',
		"\u010f" : 'd',
		"\u044d" : 'e',
		"\u0435" : 'e',
		"\u00e8" : 'e',
		"\u00e9" : 'e',
		"\u00ea" : 'e',
		"\u00eb" : 'e',
		"\u011b" : 'e',
		"\u0444" : 'f',
		"\u0433" : 'g',
		"\u011f" : 'g',
		"\u0445" : 'h',
		"\u0438" : 'i',
		"\u00ec" : 'i',
		"\u00ed" : 'i',
		"\u00ee" : 'i',
		"\u00ef" : 'i',
		"\u0131" : 'i',
		"\u0439" : 'j',
		"\u043a" : 'k',
		"\u043b" : 'l',
		"\u013e" : 'l',
		"\u013a" : 'l',
		"\u043c" : 'm',
		"\u043d" : 'n',
		"\u00f1" : 'n',
		"\u0148" : 'n',
		"\u043e" : 'o',
		"\u00f8" : 'o',
		"\u00f6" : 'o',
		"\u00f5" : 'o',
		"\u00f4" : 'o',
		"\u00f3" : 'o',
		"\u00f2" : 'o',
		"\u043f" : 'p',
		"\u0440" : 'r',
		"\u0159" : 'r',
		"\u0155" : 'r',
		"\u0441" : 's',
		"\u015f" : 's',
		"\u0161" : 's',
		"\u0442" : 't',
		"\u0165" : 't',
		"\u0443" : 'u',
		"\u044e" : 'u',
		"\u00fc" : 'u',
		"\u00fb" : 'u',
		"\u00fa" : 'u',
		"\u00f9" : 'u',
		"\u016f" : 'u',
		"\u0432" : 'v',
		"\u044b" : 'y',
		"\u00ff" : 'y',
		"\u00fd" : 'y',
		"\u0437" : 'z',
		"\u017e" : 'z',
		"\u00e6" : 'ae',
		"\u0153" : 'oe',
		"\u0446" : 'ts',
		"\u0447" : 'ch',
		"\u0448" : 'sh',
		"\u044f" : 'ya'
	};
	var g = function(l) {
		return l ? l.replace(a, ' ') : '';
	};
	var h = function(l) {
		return l ? l.replace(e, '\\$1') : '';
	};
	var i = function(o) {
		o = ('' + o).toLowerCase();
		var n = '', l = '';
		for ( var m = o.length; m--;) {
			l = o.charAt(m);
			n = (f[l] || l) + n;
		}
		return n.replace(c, ' ');
	};
	var j = function(l) {
		return l ? l.replace(b, ' ') : '';
	};
	var k = function(p) {
		p = p.toLowerCase();
		var m = i(p), l = g(m), o = j(m);
		if (p != m)
			p += ' ' + m;
		if (p != l)
			p += ' ' + l;
		if (p != o)
			p += ' ' + o;
		var q = [], r = {}, n = d.exec(p);
		while (n) {
			n = n[0];
			if (!r[n]) {
				q.push(n);
				r[n] = true;
			}
			n = d.exec(p);
		}
		return q;
	};
	return {
		escape : h,
		flatten : i,
		tokenize : k
	};
})();
function DataSource(a) {
	copy_properties(this, a);
}
DataSource.mixin('Arbiter', {
	events : [ 'activity', 'query', 'respond' ],
	maxResults : 10,
	queryData : {},
	queryEndpoint : '',
	bootstrapData : {},
	bootstrapEndpoint : '',
	indexedFields : [ 'text', 'tokens' ],
	exclusions : [],
	init : function() {
		this.init = bagofholding;
		this.numResults = this.maxResults;
		this.activeQueries = 0;
		this.dirty();
	},
	dirty : function() {
		this.value = this.flatValue = '';
		this.bootstrapped = false;
		this.data = {};
		this.localCache = {};
		this.queryCache = {};
	},
	bootstrap : function() {
		if (this.bootstrapped)
			return;
		this.fetch(this.bootstrapEndpoint, this.bootstrapData);
		this.bootstrapped = true;
	},
	query : function(e, b) {
		this.inform('beforeQuery', {
			value : e
		});
		var a = TypeaheadUtil.flatten(e);
		var d = this.buildUids(a);
		var c = this.respond(e, d).filter(function(f) {
			return f.type != 'calltoaction';
		});
		this.value = e;
		this.flatValue = a;
		this.inform('query', {
			value : e,
			results : c
		});
		if (b || !a || !this.queryEndpoint || a in this.getQueryCache()
				|| !this.shouldFetchMoreResults(c))
			return false;
		this.inform('queryEndpoint', {
			value : e
		});
		this.fetch(this.queryEndpoint, this.getQueryData(e, d), e, a);
		return true;
	},
	shouldFetchMoreResults : function(a) {
		return a.length < this.numResults;
	},
	getQueryData : function(c, b) {
		var a = copy_properties( {
			value : c
		}, this.queryData || {});
		b = b || [];
		if (b.length)
			a.existing_ids = b.join(',');
		return a;
	},
	setQueryData : function(a, b) {
		if (b)
			this.queryData = {};
		copy_properties(this.queryData, a);
		return this;
	},
	getExclusions : function() {
		return this.exclusions;
	},
	setExclusions : function(a) {
		this.exclusions = a || [];
	},
	respond : function(d, c, a) {
		var b = this.buildData(c);
		this.inform('respond', {
			value : d,
			results : b,
			isAsync : a
		});
		return b;
	},
	asyncErrorHandler : bagofholding,
	fetch : function(c, b, e, d) {
		if (!c)
			return;
		var a = new AsyncRequest().setURI(c).setData(b).setMethod('GET')
				.setReadOnly(true).setHandler(function(f) {
					this.fetchHandler(f, e, d);
				}.bind(this)).setFinallyHandler(function() {
					this.activeQueries--;
					if (!this.activeQueries)
						this.inform('activity', {
							activity : false
						});
				}.bind(this));
		a.setErrorHandler(this.asyncErrorHandler);
		a.send();
		if (!this.activeQueries)
			this.inform('activity', {
				activity : true
			});
		this.activeQueries++;
	},
	fetchHandler : function(b, c, a) {
		this.addEntries(b.getPayload().entries, c, a);
		this.inform('fetchComplete', {
			response : b,
			value : c
		});
		this.respond(c, this.buildUids(a), true);
	},
	addEntries : function(b, f, c) {
		var d = this.processEntries($A(b || []), f), a = this.buildUids(c, d);
		if (f) {
			var e = this.getQueryCache();
			e[c] = a;
		} else
			this.fillCache(a);
	},
	processEntries : function(a, b) {
		return a.map(function(d, c) {
			var e = (d.uid = d.uid + '');
			if (this.data[e]) {
				copy_properties(this.data[e], d);
				d = this.data[e];
			} else
				this.data[e] = d;
			if (d.index === undefined)
				d.index = c;
			d.query = b;
			return e;
		}, this);
	},
	getEntry : function(a) {
		return this.data[a] || null;
	},
	fillCache : function(b) {
		var a = this.localCache;
		b.each(function(g) {
			var d = this.data[g];
			if (!d || d.bootstrapped)
				return;
			d.bootstrapped = true;
			var f = this.getTokens(d);
			for ( var c = 0, e = f.length; c < e; ++c) {
				var h = f[c];
				if (!a[h])
					a[h] = [];
				a[h].push(g);
			}
		}, this);
	},
	getTokens : function(e) {
		if (e.preparedTokens)
			return e.preparedTokens;
		var f = [], b = this.indexedFields;
		for ( var d = 0, c = b.length; d < c; ++d) {
			var a = e[b[d]];
			if (a)
				f.push(a.join ? a.join(' ') : a);
		}
		return (e.preparedTokens = TypeaheadUtil.tokenize(f.join(' ')));
	},
	buildUids : function(h, b) {
		if (!h)
			return b || [];
		var e = function(i, j) {
			return this.data[i].index - this.data[j].index;
		}.bind(this);
		var f = TypeaheadUtil.tokenize(h);
		var a = this.buildCacheResults(f, this.localCache).sort(e);
		var d = this.buildQueryResults(h, f);
		var c = a.concat(d, b || []);
		var g = Object.from(this.exclusions);
		return c.filter(function(i) {
			if (i in g)
				return false;
			return (g[i] = true);
		});
	},
	buildData : function(f) {
		var d = [], c = this.numResults;
		for ( var b = 0; b < f.length && c; ++b) {
			var e = f[b];
			var a = this.data[e];
			if (a) {
				d.push(a);
				c--;
			}
		}
		return d;
	},
	findQueryCache : function(e) {
		var b = 0;
		var a = null;
		var d = this.getQueryCache();
		for ( var c in d)
			if (e.indexOf(c) == 0 && c.length > b) {
				b = c.length;
				a = c;
			}
		return d[a] || [];
	},
	buildQueryResults : function(c, b) {
		var a = this.findQueryCache(c);
		if (c in this.getQueryCache())
			return a;
		return this.filterQueryResults(b, a);
	},
	filterQueryResults : function(b, a) {
		return a.filter(function(c) {
			return this.isPrefixMatch(b, this.getTokens(this.data[c]));
		}, this);
	},
	isPrefixMatch : function(f, e) {
		var d = f.length, c = e.length, a;
		for ( var b = 0; b < d; ++b) {
			var g = new RegExp('^' + TypeaheadUtil.escape(f[b]));
			for (a = 0; a < c; ++a)
				if (g.test(e[a]))
					break;
			if (a == c)
				return false;
		}
		return true;
	},
	buildCacheResults : function(m, a) {
		var j = m.length, g = {}, o = {}, h = [];
		for ( var e = 0; e < j; ++e) {
			var l = m[e], k = new RegExp('^' + TypeaheadUtil.escape(l));
			for ( var i in a)
				if (!(i in g) && k.test(i)) {
					g[i] = true;
					var d = a[i];
					for ( var f = 0, c = d.length; f < c; ++f) {
						var n = d[f];
						if (e === 0 || (n in o && o[n] == e))
							o[n] = e + 1;
					}
				}
		}
		for ( var b in o)
			if (o[b] == j)
				h.push(b);
		return h;
	},
	getQueryCache : function() {
		return this.queryCache;
	}
});
add_properties('TypeaheadBehaviors', {
	requireSelection : function(b) {
		var a = b.getCore();
		a.subscribe('blur', function() {
			!a.getHiddenValue() && a.reset();
		});
	},
	showLoadingIndicator : function(a) {
		a.subscribe('activity', function(b, c) {
			CSS.conditionClass(a.getElement(), 'typeaheadLoading', c.activity);
		});
	},
	setPhotoOnSelect : function(e) {
		var c = DOM.scry(e.getElement(), '.photo')[0];
		if (c) {
			if (!DOM.isNode(c, 'img')) {
				var b = DOM.create('img', {
					className : c.className
				});
				DOM.replace(c, b);
				c = b;
			}
			var a = CSS.hide.curry(c);
			var d = CSS.show.curry(c);
			Event.listen(c, {
				load : d,
				error : a,
				abort : a
			});
			e.subscribe('select', function(f, g) {
				var h = g.selected.photo || e.view.fallbackPhoto;
				h ? c.setAttribute('src', h) : a();
			});
		}
	}
});
function Typeahead(b, d, a, c) {
	this.args = {
		data : b,
		view : d,
		core : a
	};
	DataStore.set(c, 'Typeahead', this);
	this.element = c;
}
Typeahead.mixin('Arbiter', {
	init : function(a) {
		this.init = bagofholding;
		this.getCore();
		this.proxyEvents();
		this.initBehaviors(a || []);
		this.inform('init', this);
		this.data.bootstrap();
		this.core.focus();
	},
	getData : function() {
		if (!this.data) {
			var a = this.args.data;
			this.data = a;
			this.data.init();
		}
		return this.data;
	},
	getView : function() {
		if (!this.view) {
			var a = this.args.view;
			this.view = new window[a.ctor](a.node, a.options || {});
			this.view.init();
		}
		return this.view;
	},
	getCore : function() {
		if (!this.core) {
			var a = this.args.core;
			this.core = new window[a.ctor](a.node, a.options || {});
			this.core.init(this.getData(), this.getView(), this.getElement());
		}
		return this.core;
	},
	getElement : function() {
		return this.element;
	},
	swapData : function(a) {
		this.data = null;
		this.args.data = a;
		this.core.data = this.getData();
		this.core.initData();
		this.data.bootstrap();
		return this.data;
	},
	proxyEvents : function() {
		[ this.data, this.view, this.core ].each(function(a) {
			a.subscribe(a.events, this.inform.bind(this));
		}, this);
	},
	initBehaviors : function(a) {
		a.each(function(b) {
			(TypeaheadBehaviors[b] || bagofholding)(this);
		}, this);
	}
});
function TypeaheadCore(a, b) {
	this.element = $(a);
	copy_properties(this, b);
}
TypeaheadCore
		.mixin(
				'Arbiter',
				{
					events : [ 'blur', 'focus', 'reset', 'unselect' ],
					keepFocused : true,
					resetOnSelect : false,
					setValueOnSelect : false,
					queryTimeout : 250,
					init : function(a, c, b) {
						this.init = bagofholding;
						this.data = a;
						this.view = c;
						this.root = b;
						this.inputWrap = DOM.find(b, 'div.wrap');
						this.hiddenInput = DOM.find(b, 'input.hiddenInput');
						this.selectedText = null;
						if (this.setValueOnSelect
								&& CSS.hasClass(this.inputWrap, 'selected'))
							this.selectedText = this.getValue();
						this.initView();
						this.initData();
						this.initEvents();
						this.initToggle();
					},
					initView : function() {
						this.view.subscribe('highlight', function() {
							this.element.focus();
						}.bind(this));
						this.view.subscribe('select', function(a, b) {
							this.select(b.selected);
						}.bind(this));
					},
					initData : function() {
						this.data.subscribe('respond',
								function(a, b) {
									if (b.value == this.getValue())
										this.view.render(b.value, b.results,
												b.isAsync);
								}.bind(this));
						this.data.subscribe('activity', function(a, b) {
							this.fetching = b.activity;
							if (!this.fetching)
								this.nextQuery && this.performQuery();
						}.bind(this));
					},
					initEvents : function() {
						Event.listen(this.view.getElement(), {
							mouseup : this.viewMouseup.bind(this),
							mousedown : this.viewMousedown.bind(this)
						});
						var a = {
							blur : bind(this, 'blur'),
							focus : bind(this, 'focus'),
							keyup : bind(this, 'keyup'),
							keydown : bind(this, 'keydown')
						};
						if (ua.firefox()) {
							a.text = a.keyup;
							a.keypress = a.keydown;
							delete a.keydown;
						}
						Event.listen(this.element, a);
						Event.listen(this.element, 'keypress', this.keypress
								.bind(this));
					},
					initToggle : function() {
						var b = this.root.parentNode, d = CSS.getStyle(b,
								'position') != 'static' ? b : this.root, c = this.view, a = 'uiTypeaheadFocused';
						this.subscribe('focus', function() {
							c.show();
							CSS.addClass(d, a);
						});
						this.subscribe('blur', function() {
							c.hide();
							CSS.removeClass(d, a);
						});
					},
					viewMousedown : function() {
						this.selecting = true;
					},
					viewMouseup : function() {
						this.selecting = false;
					},
					blur : function() {
						if (this.selecting) {
							this.selecting = false;
							return;
						}
						this.inform('blur');
					},
					focus : function() {
						this.checkValue();
						this.inform('focus');
					},
					keyup : function() {
						if (!this.getValue())
							this.view.reset();
						this.checkValue();
					},
					keydown : function(event) {
						if (!this.view.isVisible() || this.view.isEmpty()) {
							this.checkValue.bind(this).defer();
							return;
						}
						switch (Event.getKeyCode(event)) {
						case KEYS.TAB:
							this.handleTab(event);
							return;
						case KEYS.UP:
							this.view.prev();
							break;
						case KEYS.DOWN:
							this.view.next();
							break;
						case KEYS.ESC:
							this.view.reset();
							break;
						default:
							this.checkValue.bind(this).defer();
							return;
						}
						event.kill();
					},
					keypress : function(event) {
						if (this.view.getSelection()
								&& Event.getKeyCode(event) == KEYS.RETURN) {
							this.view.select();
							event.kill();
						}
					},
					handleTab : function(event) {
						this.view.select();
					},
					select : function(a) {
						this.resetOnSelect ? this.reset() : this.view.reset();
						this.keepFocused ? this.element.focus() : this.element
								.blur();
						if (a && this.setValueOnSelect) {
							this.setValue(a.text);
							this.setHiddenValue(a.uid);
							this.selectedText = a.text;
							CSS.addClass(this.inputWrap, 'selected');
						}
					},
					unselect : function() {
						if (this.setValueOnSelect) {
							this.selectedText = null;
							CSS.removeClass(this.inputWrap, 'selected');
						}
						this.setHiddenValue();
						this.inform('unselect', this);
					},
					enable : function() {
						this.element.disabled = false;
						CSS.removeClass(this.root, 'uiTypeaheadDisabled');
					},
					disable : function() {
						this.element.disabled = true;
						CSS.addClass(this.root, 'uiTypeaheadDisabled');
					},
					reset : function() {
						this.unselect();
						this.keepFocused ? this.setValue() : Input
								.reset(this.element);
						this.view.reset();
						this.inform('reset');
					},
					getElement : function() {
						return this.element;
					},
					setValue : function(a) {
						this.value = a || '';
						Input.setValue(this.element, this.value);
					},
					setHiddenValue : function(a) {
						this.hiddenInput.value = (a || a === 0) ? a : '';
						Arbiter.inform('Form/change', {
							node : this.hiddenInput
						});
					},
					getValue : function() {
						return Input.getValue(this.element);
					},
					getHiddenValue : function() {
						return this.hiddenInput.value || '';
					},
					checkValue : function() {
						var c = this.getValue();
						if (c == this.value)
							return;
						if (this.selectedText && this.selectedText != c)
							this.unselect();
						var b = (+new Date()), a = b - this.time;
						this.time = b;
						this.nextQuery = this.value = c;
						this.performQuery(a);
					},
					performQuery : function(a) {
						if (this.selectedText)
							return;
						a = a || 0;
						if (this.fetching && a < this.queryTimeout) {
							this.data.query(this.nextQuery, true);
						} else {
							this.data.query(this.nextQuery);
							this.nextQuery = null;
						}
					}
				});
function TypeaheadAreaCore(a, b) {
	this.parent.construct(this, a, b);
	this.matcher = new RegExp(this.matcher + '$');
}
TypeaheadAreaCore.extend('TypeaheadCore');
TypeaheadAreaCore.prototype = {
	prefix : '',
	suffix : ', ',
	matcher : "\\b[^,]*",
	select : function(a) {
		this.parent.select(a);
		var e = this.element.value, d = this.prefix + a.text + this.suffix, b = e
				.substring(0, this.start), c = e.substring(this.end);
		this.element.value = b + d + c;
		FormControl.setCaretPosition(this.element, b.length + d.length);
	},
	getValue : function() {
		var e = this.parent.getValue();
		if (e == this.value)
			return e;
		var a = FormControl.getCaretPosition(this.element).start || 0;
		e = e.substring(0, a);
		var b = this.matcher.exec(e);
		if (!b)
			return '';
		var c = b[1] || b[0], d = b.index;
		this.start = d;
		this.end = d + b[0].length;
		return c;
	}
};
function TypeaheadView(a, b) {
	this.element = $(a);
	copy_properties(this, b);
}
TypeaheadView.mixin('Arbiter', {
	events : [ 'highlight', 'render', 'reset', 'select' ],
	renderer : 'basic',
	autoSelect : false,
	init : function() {
		this.init = bagofholding;
		this.initializeEvents();
		this.reset();
	},
	initializeEvents : function() {
		Event.listen(this.element, {
			mouseup : this.mouseup.bind(this),
			mouseover : this.mouseover.bind(this)
		});
	},
	getElement : function() {
		return this.element;
	},
	mouseup : function(event) {
		this.select(true);
		event.kill();
	},
	mouseover : function(event) {
		if (this.visible)
			this.highlight(this.getIndex(event));
	},
	reset : function(a) {
		if (!a)
			this.disableAutoSelect = false;
		this.index = -1;
		this.items = [];
		this.results = [];
		this.value = '';
		this.element.innerHTML = '';
		this.inform('reset');
	},
	getIndex : function(event) {
		return this.items.indexOf(Parent.byTag(event.getTarget(), 'li'));
	},
	getSelection : function() {
		var a = this.results[this.index] || null;
		return this.visible ? a : null;
	},
	isEmpty : function() {
		return !this.results.length;
	},
	isVisible : function() {
		return this.visible;
	},
	show : function() {
		CSS.show(this.element);
		this.visible = true;
	},
	hide : function() {
		CSS.hide(this.element);
		this.visible = false;
	},
	render : function(g, d, e) {
		this.value = g;
		if (!d.length) {
			this.reset(true);
			return;
		}
		this.inform('beforeRender', {
			results : d
		});
		var c = this.defaultIndex(d);
		if (this.index > 0) {
			var a = this.results[this.index];
			for ( var b = 0, f = d.length; b < f; ++b)
				if (a.uid == d[b].uid) {
					c = b;
					break;
				}
		}
		this.results = d;
		this.element.innerHTML = this.buildMarkup(d);
		this.items = this.getItems();
		this.highlight(c, false);
		this.inform('render', d);
	},
	getItems : function() {
		return DOM.scry(this.element, 'li');
	},
	buildMarkup : function(c) {
		var b, a = [];
		if (typeof this.renderer == "function") {
			a.push('<ul>');
			b = this.renderer;
		} else {
			a.push('<ul class="' + this.renderer + '">');
			b = TypeaheadRenderers[this.renderer];
		}
		c.each(function(d, e) {
			a = a.concat(b(d, e));
		});
		a.push('</ul>');
		return a.join('');
	},
	defaultIndex : function(b) {
		var a = (this.autoSelect && !this.disableAutoSelect);
		return this.index < 0 && !a ? -1 : 0;
	},
	next : function() {
		this.highlight(this.index + 1);
	},
	prev : function() {
		this.highlight(this.index - 1);
	},
	highlight : function(a, b) {
		this.selected && CSS.removeClass(this.selected, 'selected');
		if (a > this.items.length - 1) {
			a = -1;
		} else if (a < -1)
			a = this.items.length - 1;
		if (a >= 0 && a < this.items.length) {
			this.selected = this.items[a];
			CSS.addClass(this.selected, 'selected');
		}
		this.index = a;
		this.disableAutoSelect = (a == -1);
		if (b !== false)
			this.inform('highlight', {
				index : a,
				selected : this.results[a]
			});
	},
	select : function(a) {
		var b = this.index, c = this.results[b];
		if (c)
			this.inform('select', {
				index : b,
				clicked : !!a,
				selected : c
			});
	}
});
add_properties(
		'TypeaheadRenderers',
		{
			compact : function(c, e) {
				var h = c.markup || htmlize(c.text), g = htmlize(c.subtext), a = htmlize(c.category), f = c.photo, b = '', d = [];
				if (f)
					if (f instanceof Array) {
						d = [ '<span class="splitpics clearfix">',
								'<span class="splitpic leftpic">',
								'<img src="', f[0], '" alt="" />', '</span>',
								'<span class="splitpic">', '<img src="', f[1],
								'" alt="" />', '</span>', '</span>' ];
					} else
						d = [ '<img src="', f, '" alt="" />' ];
				if (c.type)
					b = ' class="' + c.type + '"';
				return [ '<li', b, '>', d.join(''),
						(h ? '<span class="text">' + h + '</span>' : ''),
						'<div class="details"><span class="detailsContents">',
						(a ? a : ''), (g && a ? ' &middot ' : ''),
						(g ? g : ''), '</span></div>', '</li>' ];
			}
		});

if (window.Bootloader) {
	Bootloader.done( [ "W5uK1" ]);
}