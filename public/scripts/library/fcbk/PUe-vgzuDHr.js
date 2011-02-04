/*1294871791,169775811*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "JPZvx" ]);
}

var NotificationCounter = (function() {
	var a = {
		messages : 0,
		notifications : 0,
		requests : 0
	};
	return {
		init : function() {
			Arbiter.subscribe('update_title', this._handleUpdate.bind(this));
			Arbiter.subscribe( [ 'jewel/messages-updated',
					'jewel/requests-updated', 'jewel/notifications-updated' ],
					this._handleCountUpdate.bind(this));
		},
		getCount : function() {
			return a.requests + a.messages + a.notifications;
		},
		updateTitle : function() {
			var b = DocumentTitle.get();
			var c = this.getCount();
			DocumentTitle.set(c ? b + ' (' + c + ')' : b, true);
		},
		_handleCountUpdate : function(c, b) {
			a[b.jewel] = b.count;
			this.updateTitle();
		},
		_handleUpdate : function(c, b) {
			this.updateTitle();
		}
	};
})();
function RenderManager(a) {
	copy_properties(this, {
		_isDirty : false,
		_obj : a
	});
}
copy_properties(RenderManager.prototype, {
	dirty : function() {
		if (!this._isDirty) {
			this._isDirty = true;
			bind(this, this.doPaint).defer();
		}
	},
	doPaint : function() {
		this._isDirty = false;
		this._obj.paint();
	}
});
function CounterDisplay(a, g, h, e, d, b) {
	copy_properties(this, {
		_name : a,
		_valueNode : $(g),
		_wrapperNode : $(h) || null,
		_statusClass : d,
		_rm : new RenderManager(this),
		_arbiterSubscription : null,
		_count : 0
	});
	var c = this._valueNode.firstChild;
	if (c) {
		var f = parseInt(c.nodeValue, 10);
		if (!isNaN(f))
			this._count = f;
	}
	this._statusNode = e ? $(e) : null;
	this._subscribeAll();
	CounterDisplay.instances.push(this);
	if (!b)
		onleaveRegister(this._destroy.bind(this), true);
}
copy_properties(CounterDisplay, {
	EVENT_TYPE_ADJUST : 'CounterDisplay/adjust',
	EVENT_TYPE_UPDATE : 'CounterDisplay/update',
	instances : [],
	adjustCount : function(a, b) {
		Arbiter.inform(CounterDisplay.EVENT_TYPE_ADJUST + '/' + a, b);
	},
	setCount : function(a, b) {
		Arbiter.inform(CounterDisplay.EVENT_TYPE_UPDATE + '/' + a, b);
	}
});
CounterDisplay.mixin( {
	_destroy : function() {
		delete this._valueNode;
		delete this._wrapperNode;
		if (this._arbiterSubscription) {
			Arbiter.unsubscribe(this._arbiterSubscription);
			delete this._arbiterSubscription;
		}
		CounterDisplay.instances.remove(this);
	},
	adjustCount : function(a) {
		this._count = Math.max(0, this._count + a);
		this._rm.dirty();
		return this;
	},
	setCount : function(a) {
		this._count = Math.max(0, a);
		this._rm.dirty();
		return this;
	},
	paint : function() {
		DOM.setContent(this._valueNode, this._count);
		if (this._wrapperNode)
			CSS.conditionClass(this._wrapperNode, 'hidden_elem',
					this._count <= 0);
		if (this._statusClass && this._statusNode)
			CSS.conditionClass(this._statusNode, this._statusClass,
					this._count > 0);
	},
	_subscribeAll : function() {
		var a = [ CounterDisplay.EVENT_TYPE_ADJUST + '/' + this._name,
				CounterDisplay.EVENT_TYPE_UPDATE + '/' + this._name ];
		this._arbiterSubscription = Arbiter.subscribe(a, this._onInform
				.bind(this), Arbiter.SUBSCRIBE_NEW);
	},
	_onInform : function(a, b) {
		b = parseInt(b);
		if (isNaN(b))
			return;
		if (a.indexOf(CounterDisplay.EVENT_TYPE_ADJUST) != -1) {
			this.adjustCount(b);
		} else if (a.indexOf(CounterDisplay.EVENT_TYPE_UPDATE) != -1) {
			this.setCount(b);
		} else
			return;
		return;
	}
});
function MenubarMessageController(b, a) {
}
copy_properties(MenubarMessageController, {
	ensureInitialized : function(c, b, a) {
		if (MenubarMessageController.initialized || !ge(b))
			return false;
		var d = new MenubarMessageController(c, b);
		MenubarMessageController.instance = d;
		d.ensureInitialized(c, b, a);
		MenubarMessageController.initialized = true;
	}
});
copy_properties(MenubarMessageController.prototype, {
	ensureInitialized : function(c, b, a) {
		this.menu = ge(b);
		var d = [ CounterDisplay.EVENT_TYPE_ADJUST + '/messages_unread',
				CounterDisplay.EVENT_TYPE_UPDATE + '/messages_unread' ];
		Arbiter.subscribe(d, this.onCounterUpdate.bind(this),
				Arbiter.SUBSCRIBE_NEW);
		Arbiter.subscribe(PresenceMessage
				.getArbiterMessageType('messages_seen'), function() {
			CSS.removeClass($('mailWrapper'), 'jewelNew');
			Arbiter.inform('jewel/messages-updated', {
				jewel : 'messages',
				count : 0
			}, Arbiter.BEHAVIOR_STATE);
		});
		this._dirty = a;
		this.mouseOverListener = Event.listen($(c), 'mouseover', this.doRefetch
				.bind(this));
	},
	doRefetch : function() {
		if (this._dirty) {
			this._dirty = false;
			this._fetch();
		}
	},
	_fetch : function() {
		new AsyncRequest().setURI('/ajax/gigaboxx/endpoint/ListThreads.php')
				.setMethod('GET').setReadOnly(true).setHandler(
						this.onFetchComplete.bind(this)).setData( {
					folder : '[fb]messages',
					start : 0,
					limit : 5,
					previews : true
				}).send();
	},
	onFetchComplete : function(a) {
		if (this.menu)
			DOM.setContent(this.menu, HTML(a.payload));
	},
	onCounterUpdate : function() {
		this._dirty = true;
	}
});
var Jewel = {
	markSeen : function(b, c, a) {
		if (c) {
			CSS.removeClass(a, 'jewelNew');
			if (b == '[fb]messages') {
				MenubarMessageController.instance.doRefetch();
				Arbiter.inform('jewel/messages-updated', {
					jewel : 'messages',
					count : 0
				}, Arbiter.BEHAVIOR_STATE);
			} else if (b == '[fb]requests')
				Arbiter.inform('jewel/requests-updated', {
					jewel : 'requests',
					count : 0
				}, Arbiter.BEHAVIOR_STATE);
			new AsyncSignal('/ajax/gigaboxx/endpoint/UpdateLastSeenTime.php', {
				folder : b
			}).send();
		} else if (/requests/.test(b))
			DOM.scry(a, 'li.jewelItemNew').each(function(d) {
				CSS.removeClass(d, 'jewelItemNew');
			});
	}
};
function ChatNotificationList() {
	this.alertIds = [];
	this.alertsObj = {};
	this.contentRoot = null;
	this.noItemsElement = null;
	this.ITEM_UNREAD_CLASS = 'jewelItemNew';
	this.ITEM_TAG = 'li';
	this.ITEM_CLASS = 'notification';
	this.NO_ITEMS_ID = 'jewelNoNotifications';
	this.NO_ITEMS_CLASS = 'empty';
}
ChatNotificationList.prototype = {
	setUnreadItemClass : function(a) {
		this.ITEM_UNREAD_CLASS = a;
	},
	setItemTag : function(a) {
		this.ITEM_TAG = a;
	},
	setItemClass : function(a) {
		this.ITEM_CLASS = a;
	},
	setNoItemsClass : function(a) {
		this.NO_ITEMS_CLASS = a;
	},
	getAlertIds : function() {
		return this.alertIds;
	},
	fromDom : function(b) {
		this.contentRoot = b;
		var f = this.ITEM_TAG;
		if (this.ITEM_CLASS)
			f += '.' + this.ITEM_CLASS;
		var d = DOM.scry(this.contentRoot, f);
		for ( var e = 0; e < d.length; e++) {
			var c = d[e];
			var a = parseInt(c.getAttribute('id').replace('notification_', ''),
					10);
			this.alertIds.push(a);
			this.alertsObj[a] = c;
		}
		this.alertIds.sort(function(g, h) {
			return h - g;
		});
	},
	insert : function(a, b, c) {
		a = parseInt(a, 10);
		if (this.alertsObj[a])
			if (!c) {
				return false;
			} else
				this.remove(a);
		DOM.prependContent(this.contentRoot, HTML(b));
		this.alertIds.unshift(a);
		this.alertsObj[a] = $('notification_' + a);
		if (1 == this.size())
			hide(this.NO_ITEMS_ID);
		return true;
	},
	showNoNotifications : function() {
		if (null == this.noItemsElement)
			this.noItemsElement = ge(this.NO_ITEMS_ID);
		if (null == this.noItemsElement) {
			this.noItemsElement = $N(this.ITEM_TAG, {
				id : this.NO_ITEMS_ID,
				className : this.NO_ITEMS_CLASS
			}, _tx("No new notifications."));
			DOM.appendContent(this.contentRoot, this.noItemsElement);
		}
		CSS.show(this.NO_ITEMS_ID);
	},
	remove : function(b) {
		var a = this.alertsObj[b];
		if (!this.alertsObj[b])
			return false;
		DOM.remove(a);
		delete this.alertsObj[b];
		this.alertIds.splice(this.alertIds.indexOf(b), 1);
		if (this.isEmpty())
			this.showNoNotifications();
		return true;
	},
	getUnreadIds : function(a) {
		var c = [];
		a = a || this.alertIds;
		for ( var b = 0; b < a.length; b++)
			if (this.isUnreadId(a[b]))
				c.push(a[b]);
		return c;
	},
	isUnreadId : function(a) {
		var b = this.alertsObj[a];
		return (b && CSS.hasClass(b, this.ITEM_UNREAD_CLASS));
	},
	markRead : function(a) {
		for ( var c = 0; c < a.length; c++) {
			var b = this.alertsObj[a[c]];
			animation(b).duration(1500).checkpoint().to('backgroundColor',
					'#FFFFFF').duration(2250).ondone(
					CSS.removeClass.bind(null, b, this.ITEM_UNREAD_CLASS)).go();
		}
		return 0 != a.length;
	},
	markReadNow : function() {
		for ( var a in this.alertsObj)
			CSS.removeClass(this.alertsObj[a], this.ITEM_UNREAD_CLASS);
	},
	insertMany : function(d, e) {
		var f = 0;
		if ('object' == typeof d && !is_empty(d)) {
			if (is_empty(e)) {
				e = [];
				for ( var b in d)
					e.push(b);
				e.sort(function(g, h) {
					return h - g;
				});
			}
			for ( var a = e.length - 1; a >= 0; --a) {
				var c = e[a];
				if (this.insert(c, d[c], true))
					f++;
			}
		}
		if (0 === f && this.isEmpty()) {
			this.showNoNotifications();
		} else
			hide(this.NO_ITEMS_ID);
		return f;
	},
	isEmpty : function() {
		return 0 == this.size();
	},
	size : function() {
		return this.alertIds.length;
	}
};
function ChatNotifications(b, c, f, d, e, g, a) {
	this.count = b;
	this.countNew = c;
	this.updateTime = f;
	this.user = Env.user;
	this.cache_version = a;
	this.latest_notif_time = d;
	this.latest_read_notif_time = e;
	this.update_period = g;
	this.wrapperID = 'notificationsWrapper';
	this.contentID = 'jewelNotifs';
	this.timeElement = 'small.time';
	this.alertList = new ChatNotificationList();
	this._init();
}
ChatNotifications.BEEPS_EXPIRED = 'beeper/beeps_expired';
ChatNotifications.prototype = {
	_init : function() {
		this.cookieName = 'notifications_' + this.user;
		this.beepsExpiredToken = null;
		this.updateCheckCount = 0;
		this.wrapper = ge(this.wrapperID);
		this.content = ge(this.contentID);
		this.countSpan = ge('presence_notifications_count');
		this.alertList.fromDom(this.content);
		this._updateCount();
		this.initializeEvents();
		Arbiter.subscribe(
				PresenceMessage.getArbiterMessageType('notification'),
				this._handleNotificationMsg.bind(this));
		Arbiter.subscribe(PresenceMessage.getArbiterMessageType('inbox'),
				this._handleInboxMsg.bind(this));
		Arbiter.subscribe(PresenceMessage
				.getArbiterMessageType('notifications_read'),
				this._handleNotificationsReadMsg.bind(this));
		this._poller = new Poller(this.update_period, this._update.bind(this));
		if (this.wrapper) {
			this.countSpan = DOM.find(this.wrapper, 'span.jewelCount span');
			if (this.isTabOpen())
				this.loadTab();
		}
		this._inboxUpdateTimeout = null;
		Arbiter.subscribe('messaging/mark-as-read', function() {
			clearTimeout(this._inboxUpdateTimeout);
		}.bind(this));
	},
	initializeEvents : function() {
		var a = null;
		Event.listen(this.content, {
			mouseover : function(event) {
				var b = event.getTarget();
				a = Parent.byTag(b, 'li');
				if (a)
					CSS.addClass(a, 'selected');
			},
			mouseout : function(event) {
				a && CSS.removeClass(a, 'selected');
				a = null;
			}
		});
	},
	notifyAndMarkRead : function(e, a, d, c) {
		if (!e) {
			c = c || false;
			var b = null;
			if (a) {
				d = d || null;
				b = {
					alert_ids : a,
					post_form_id : d,
					render : 0
				};
			}
			AsyncRequest.pingURI('/ajax/presence/notifications_read.php', b, c);
		}
		if (a)
			this.alertList.markRead(a);
	},
	markRead : function(c, a, b) {
		if (this.countNew === 0)
			return;
		a = a || this.alertList.getUnreadIds();
		this.countNew = b ? b : 0;
		this.notifyAndMarkRead(c, a);
		this._updateCount();
	},
	_updateURI : '/ajax/presence/update.php',
	_update : function(a) {
		a.setHandler(this._handleUpdate.bind(this)).setOption(
				'suppressErrorAlerts', true).setData( {
			user : this.user,
			notif_latest : this.latest_notif_time,
			notif_latest_read : this.latest_read_notif_time
		}).setURI(this._updateURI).setAllowCrossPageTransition(true);
	},
	_updateInboxMarkup : function(a, c) {
		this._updateInboxUnreadCount(a);
		var b = ge('fb_menu_inbox_dropdown');
		if (b && c)
			DOM.setContent(b, HTML(c));
	},
	_updateInboxOtherUnseenCount : function(a) {
		CounterDisplay.setCount('other_unseen', a);
	},
	_updateInboxUnreadCount : function(a) {
		CounterDisplay.setCount('messages_unread', a);
	},
	_updateInboxUnseenCount : function(a) {
		CounterDisplay.setCount('messages_unseen', a);
		Arbiter.inform('jewel/messages-updated', {
			jewel : 'messages',
			count : a
		}, Arbiter.BEHAVIOR_STATE);
	},
	_handleUpdate : function(b) {
		var a = b.payload.notifications;
		if (!a.no_change) {
			if (this.count != a.count)
				this.count = a.count;
			this.updateTime = b.payload.time;
			this.latest_notif_time = a.latest_notif;
			this.latest_read_notif_time = a.latest_read_notif;
			this.countNew = a.countNew;
			this._updateDisplayDelayed();
			this.alertList.insertMany(a.markup_map, a.order);
			Arbiter.inform(Arbiter.NEW_NOTIFICATIONS, a);
		}
	},
	_updateDisplayDelayed : function() {
		if (typeof Beeper != 'undefined') {
			this.beepsExpiredToken = Arbiter.subscribe(
					ChatNotifications.BEEPS_EXPIRED, this._updateDisplay
							.bind(this));
		} else
			this._updateDisplay();
	},
	_updateDisplay : function() {
		if (!this.content)
			return;
		this._updateCount();
		if (this.beepsExpiredToken)
			Arbiter.unsubscribe(this.beepsExpiredToken);
	},
	_updateCount : function() {
		if (this.countSpan)
			DOM.setContent(this.countSpan, this.countNew);
		Arbiter.inform('jewel/notifications-updated', {
			jewel : 'notifications',
			count : this.countNew
		}, Arbiter.BEHAVIOR_STATE);
		CSS.conditionClass(this.wrapper, 'jewelNew', (this.countNew > 0));
	},
	loadTab : function() {
		if (!this.fetch())
			this.markRead();
	},
	fetch : function() {
		var a = URI('/ajax/presence/notifications_read.php');
		a.setQueryData( {
			time : this.latest_notif_time,
			user : this.user,
			version : this.cache_version,
			render : 1
		});
		var b = ge('presence_notifications_loading');
		new AsyncRequest().setURI(a).setStatusElement(b).setMethod('GET')
				.setReadOnly(true).setHandler(this.fetchHandler.bind(this))
				.setAllowCrossPageTransition(true).send();
		return true;
	},
	fetchHandler : function(d) {
		var c = d.getPayload();
		this.alertList.insertMany(c.markup_map, c.order);
		var b = ge('presence_notifications_loading');
		b && DOM.remove(b);
		var e = c.generated;
		var a = Math.round((new Date()).getTime() / 1000);
		if (a - e > 15) {
			e = a;
			this.alertList.markReadNow();
		}
		Bootloader.loadComponents('live-timer', function() {
			LiveTimer.restart(e);
			LiveTimer.startLoop(0);
		});
		this.markRead(true);
		this.fetch = bagofholding;
	},
	_mergeNotification : function(b, c, d) {
		var a = !this.alertList.isUnreadId(b);
		this.alertList.insert(b, c, true);
		this.latest_notif_time = 0;
		if (a) {
			this.count++;
			if (d)
				this.countNew++;
			this._updateCount();
		}
		if (this.isTabOpen())
			this._merged_mouseover_handler = Event.listen(this.content,
					'mouseover', (function() {
						this._merged_mouseover_handler.remove();
						this.markRead();
					}).bind(this));
		var e = this.alertList.alertsObj[b];
		if (e)
			Bootloader.loadComponents('live-timer', function() {
				LiveTimer.addTimeStamps(e);
			});
	},
	_handleInboxMsg : function(c, a) {
		var b = a.obj;
		if (b) {
			this._updateInboxUnreadCount(b.unread);
			this._updateInboxOtherUnseenCount(b.other_unseen);
			clearTimeout(this._inboxUpdateTimeout);
			this._inboxUpdateTimeout = this._updateInboxUnseenCount.bind(this,
					b.unseen).defer(10);
		}
	},
	_handleNotificationMsg : function(c, a) {
		var b = a.obj;
		if (b.markup) {
			this._mergeNotification(b.alert_id, b.markup, b.unread);
		} else
			this._poller.requestNow();
	},
	_handleNotificationsReadMsg : function(c, a) {
		var b = a.obj;
		if (typeof Beeper != 'undefined')
			Beeper.getInstance().markRead(true, b.alert_ids);
		this.markRead(true, b.alert_ids, b.num_unread);
	},
	isTabOpen : function() {
		return this.wrapper && CSS.hasClass(this.wrapper, 'jewelOn');
	}
};
function SearchDataSource(a) {
	this.parent.construct(this, a);
}
SearchDataSource.extend('DataSource');
SearchDataSource.prototype = {
	minResults : 3,
	maxResults : 8,
	leanPayload : null,
	bootstrapRequestsPending : 0,
	windowHeight : null,
	init : function() {
		this.parent.init();
		this.updateMaxResults();
		Event.listen(window, 'resize', this.updateMaxResults.bind(this));
		if (this.alwaysRespond)
			this.inform('ready', {});
	},
	dirty : function() {
		this.parent.dirty();
		this.tokensByField = {};
		this.fetchedLean = false;
		this.bootstrapFinished = false;
	},
	asyncErrorHandler : function(a) {
		if (window.Dialog && Dialog.getCurrent() == null
				&& a.getError() == 1400003)
			AsyncResponse.verboseErrorHandler(a);
	},
	fetchHandler : function(e, f, b) {
		var c = e.getPayload();
		var d = e.getRequest().getData();
		if (c.fetcht == 2) {
			this.leanPayload = e.payload;
		} else {
			if ((!f || !this.alwaysRespond)
					&& this.bootstrapRequestsPending > 0)
				--this.bootstrapRequestsPending;
			this.parent.fetchHandler(e, f, b);
		}
		if (e.getPayload().stale) {
			var a = copy_properties( {}, d);
			a.stale_ok = 0;
			this.fetch(this.bootstrapEndpoint, a);
		}
		if (this.bootstrapRequestsPending === 0) {
			if (!this.bootstrapFinished) {
				this.bootstrapFinished = true;
				this.bootstrapPostProcess();
				if (!this.alwaysRespond) {
					this.inform('ready', {});
					this.query(this.value);
				}
				this.inform('bootstrapped', {});
			}
			if (this.leanPayload) {
				this.processUidReSort(this.leanPayload.entries);
				this.leanPayload = null;
			}
		}
	},
	bootstrapPostProcess : function() {
	},
	processUidReSort : function(a) {
		for ( var b in a)
			if (b in this.data)
				this.data[b].index = a[b];
	},
	getFieldTokens : function(c, b) {
		if (!(c in this.tokensByField))
			this.tokensByField[c] = {};
		if (!(b in this.tokensByField[c])) {
			var a = this.data[c][b];
			this.tokensByField[c][b] = a ? TypeaheadUtil.tokenize(a.join ? a
					.join(' ') : a) : [];
		}
		return this.tokensByField[c][b];
	},
	updateMaxResults : function() {
		var a = Math.min(
				(window.innerHeight || document.documentElement.clientHeight),
				706), c = this.variableHeight ? 28 : 56, b = Math
				.ceil(2 + ((a - 370) / c));
		this.maxResults = this.variableHeight ? 14 : 8;
		this.numResults = Math.max(this.minResults, Math
				.min(this.maxResults, b));
		this.windowHeight = a;
		this.respond(this.value, this.buildUids(this.flatValue));
	},
	respond : function(c, b, a) {
		if (!this.alwaysRespond && this.bootstrapRequestsPending > 0)
			b = [];
		return this.parent.respond(c, b, a);
	},
	buildUids : function(k, c) {
		c = c || [];
		if (!k)
			return c;
		var i = TypeaheadUtil.tokenize(k);
		var a = this.buildCacheResults(i, this.localCache);
		var f = this.buildQueryResults(k, i);
		var h = function(l, m) {
			var n = this.data[l];
			var o = this.data[m];
			if ((n.extended_match || false) !== (o.extended_match || false))
				return n.extended_match ? 1 : -1;
			if (n.index !== o.index)
				return n.index - o.index;
			if (n.text.length !== o.text.length)
				return n.text.length - o.text.length;
			if (n.text !== o.text)
				return n.text < o.text ? -1 : 1;
			return n.uid < o.uid ? -1 : 1;
		}.bind(this);
		this.checkExtendedMatch(i, a);
		this.checkExtendedMatch(i, f);
		var d = a.sort(h);
		var g = f.concat(c);
		if (f.length > 0 && c.length > 0) {
			var e = (this.data[f[0]].priority || 0) + '';
			var b = (this.data[c[0]].priority || 0) + '';
			if (parseInt(e, 10) < parseInt(b, 10))
				g.sort(h);
		}
		var j = Object.from(this.exclusions);
		return d.concat(g).filter(function(l) {
			if (l in j)
				return false;
			return (j[l] = true);
		});
	},
	checkExtendedMatch : function(c, d) {
		for ( var a = 0; a < d.length; ++a) {
			var b = this.data[d[a]];
			b.extended_match = b.tokens
					&& !this.isPrefixMatch(c, this
							.getFieldTokens(b.uid, 'text'));
		}
	},
	buildData : function(b) {
		var a = this.parent.buildData(b);
		return this.bucketedData ? this.groupResults(a) : a;
	},
	shouldFetchMoreResults : function(c) {
		if (!this.variableHeight)
			return this.parent.shouldFetchMoreResults(c);
		var a = [ {
			uid : 'fake',
			type : 'question'
		} ];
		var b = c.concat(a);
		return this.numResultsToShow(b) == b.length;
	},
	numResultsToShow : function(f) {
		var g = this.windowHeight - 370;
		var c = 2;
		var b = f.length;
		for (; c < b; ++c) {
			var a = f[c];
			var e = a.render_type || a.type;
			var d = (e == 'question' ? 28 : 56);
			if (g <= 0 && c >= this.minResults)
				break;
			g -= d;
		}
		return Math.min(c, b);
	},
	groupResults : function(g) {
		var c = [];
		var h = {};
		var e = this.numResultsToShow(g);
		for ( var d = 0; d < e; ++d) {
			var b = g[d], f = b.render_type || b.type;
			if (!h[f]) {
				h[f] = [];
				c.push(f);
			}
			b.classNames = f;
			b.bucketStyle = this.bucketStyle;
			h[f].push(b);
		}
		var a = [];
		c.each(function(i, j) {
			var l = h[i], k = l.length;
			l[0].classNames += ' first';
			l[k - 1].classNames += ' last';
			l.each(function(m, n) {
				m.groupIndex = j;
				m.indexInGroup = n;
				a.push(m);
			});
		});
		return a;
	},
	multifetch : function(b, d, f) {
		for ( var e = 0; e < d.length; ++e) {
			var c = {
				filter : d[e],
				no_cache : f,
				stale_ok : 1
			};
			var a = copy_properties(c, b);
			this.fetch(this.bootstrapEndpoint, a);
			++this.bootstrapRequestsPending;
		}
	},
	fetchLean : function() {
		if (this.fetchedLean)
			return;
		var a = copy_properties( {
			filter : [ 'user' ],
			no_cache : 1
		}, this.bootstrapData);
		a.options = $A(a.options);
		a.options.push('lean');
		this.fetch(this.bootstrapEndpoint, a);
		this.fetchedLean = true;
	},
	bootstrap : function() {
		if (this.bootstrapped)
			return;
		this.inform('bootstrap', {});
		if (this.bootstrapData.filter) {
			this.fetch(this.bootstrapEndpoint, this.bootstrapData);
		} else {
			var a = [ [ 'event' ] ];
			this.multifetch(this.bootstrapData, a, 1);
			var b = [ [ 'user' ], [ 'app', 'page', 'group', 'photo' ] ];
			this.multifetch(this.bootstrapData, b, 0);
		}
		this.bootstrapped = true;
		if (this.bootstrapData.lfe)
			this.fetchLean();
	}
};
function SearchTypeaheadCore(a, b) {
	this.parent.construct(this, a, b);
}
SearchTypeaheadCore.extend('TypeaheadCore');
SearchTypeaheadCore.prototype = {
	init : function(a, f, d) {
		this.parent.init(a, f, d);
		var b = Parent.byTag(d, 'form'), c = this.reset.bind(this);
		if (b) {
			var e = DOM.find(b, 'input.search_sid_input');
			Event.listen(b, 'submit', function() {
				if (this.data && this.data.queryData)
					e.value = this.data.queryData.sid;
				c.defer();
			}.bind(this), Event.Priority.URGENT);
		}
	},
	select : function() {
		this.reset();
		this.element.focus();
		(function() {
			this.element.blur();
		}).bind(this).defer();
	},
	handleTab : function(event) {
		var a = this.view.getQuerySuggestion(this.value);
		if (a) {
			Input.setValue(this.element, a);
			this.checkValue();
			event.kill();
		} else
			this.parent.handleTab(event);
	}
};
add_properties('TypeaheadBehaviors', {
	searchRecorderBasic : function(a) {
		a.subscribe('init', function(b, c) {
			new SearchTypeaheadRecorder(a);
		});
	}
});
function SearchTypeaheadRecorder(a) {
	this.init(a);
	this._reset();
	this.initEvents();
}
SearchTypeaheadRecorder.prototype = {
	stats : {},
	avgStats : {},
	queryTimes : {},
	initTime : 0,
	readyTime : 0,
	bootstrapStartTime : 0,
	bootstrapEndTime : 0,
	init : function(a) {
		this.core = a.getCore();
		this.data = a.getData();
		this.view = a.getView();
		this.element = this.core.getElement();
		this.initTime = this.time();
	},
	_reset : function() {
		this.stats = {};
		this.avgStats = {};
		this.queryTimes = {};
		var a = Math.random();
		this.data.setQueryData( {
			sid : a
		});
		this.view.setSid(a);
		this.recordStat('sid', a);
	},
	initEvents : function() {
		this.core.subscribe('focus', function(event) {
			if (!this.stats['session_start_time'])
				this.recordStat('session_start_time', this.time());
		}.bind(this));
		this.core.subscribe('blur', function(event) {
			this.recordStat('session_end_time', this.time());
			this.submit();
		}.bind(this));
		this.view.subscribe('select', function(a, b) {
			this.recordSelectInfo(b);
		}.bind(this));
		this.view.subscribe('render', function(a, b) {
			this.recordRender(b);
		}.bind(this));
		this.data.subscribe('bootstrap', function(a, b) {
			this.bootstrapStartTime = this.time();
		}.bind(this));
		this.data.subscribe('bootstrapped', function(a, b) {
			this.bootstrapEndTime = this.time();
			this.recordStat('g_bootstrap_ms', this.bootstrapEndTime
					- this.bootstrapStartTime);
		}.bind(this));
		this.data.subscribe('ready', function(a, b) {
			this.readyTime = this.time();
		}.bind(this));
		this.data.subscribe('activity', function(a, b) {
			this.recordStat('pending_request', b.activity);
		}.bind(this));
		this.data.subscribe('beforeQuery', function(a, b) {
			if (!b.value)
				return;
			if (!this.query)
				this.recordStat('first_query_time', this.time());
			this.query = b.value;
			this.recordCountStat('num_queries');
		}.bind(this));
		this.data.subscribe('queryEndpoint', function(a, b) {
			this.recordCountStat('num_search_ajax_requests');
			this.recordAvgStat('endpoint_query_length', b.value.length);
			this.queryTimes[b.value] = this.time();
		}.bind(this));
		this.data.subscribe('fetchComplete', function(a, c) {
			if (!c.value || !this.queryTimes[c.value])
				return;
			var b = this.time() - this.queryTimes[c.value];
			this.recordAvgStat('search_endpoint_ms_from_js', b);
			this.queryTimes[c.value] = 0;
		}.bind(this));
		this.data.subscribe('query', function(a, b) {
			this.recordAvgStat('num_results_from_cache', b.results.length);
		}.bind(this));
		Event.listen(this.element, 'keydown', function(event) {
			if (Event.getKeyCode(event) == KEYS.BACKSPACE)
				this.recordCountStat('backspace_count');
		}.bind(this));
	},
	recordStat : function(a, b) {
		this.stats[a] = b;
	},
	recordCountStat : function(a) {
		var b = this.stats[a];
		this.stats[a] = b ? b + 1 : 1;
	},
	recordAvgStat : function(a, b) {
		if (this.avgStats[a]) {
			this.avgStats[a][0] += b;
			++this.avgStats[a][1];
		} else
			this.avgStats[a] = [ b, 1 ];
	},
	recordRender : function(a) {
		this.results = a.filter(function(b) {
			return b.type != 'calltoaction';
		});
	},
	recordSelectInfo : function(a) {
		var c = a.selected;
		if (c.uid == 'search') {
			this.recordStat('selected_search', 1);
		} else {
			var d = c.rankType || c.render_type || c.type;
			var b = (d == 'friend' ? 'user' : d);
			this.recordStat('selected_' + b, 1);
			this.recordStat('selected_position', a.index);
			this.recordStat('selected_type', d);
			this.recordStat('selected_name_length', c.text.length);
			this.recordStat('selected_id', c.uid);
			this.recordStat('selected_degree', c.bootstrapped ? 1 : 2);
			this.recordStat('selected_extended_match', c.extended_match);
		}
		this.recordStat('selected_with_mouse', a.clicked ? 1 : 0);
	},
	_dataToSubmit : function() {
		this.recordStat('candidate_results', this.buildResults());
		this.recordStat('query', this.query);
		this.recordStat('init_time', this.initTime);
		this.recordStat('bootstrapped', this.bootstrapEndTime ? 1 : 0);
		this.recordStat('bootstrap_time', this.bootstrapEndTime);
		this.recordStat('ready', this.readyTime ? 1 : 0);
		this.recordStat('ready_time', this.readyTime);
		var a = this.stats;
		for ( var c in this.avgStats) {
			var b = this.avgStats[c];
			a[c] = b[0] / b[1];
		}
		return a;
	},
	buildResults : function() {
		var a = (this.results || []).map(function(d, c) {
			var e = d.rankType || d.render_type || d.type;
			var b = d.bootstrapped ? 1 : 0;
			if (typeof d.groupIndex == 'number')
				return [ d.groupIndex, d.indexInGroup, d.uid, e, b ];
			return [ 0, c, d.uid, e, b ];
		});
		return JSON.stringify(a);
	},
	submit : function() {
		var a = this._dataToSubmit();
		if (count(a) > 0)
			new AsyncRequest().setURI('/ajax/typeahead/record_metrics.php')
					.setMethod('POST').setData( {
						stats : a
					}).send();
		this._reset();
	},
	time : function() {
		return (new Date()).getTime();
	}
};
function SearchTypeaheadView(a, b) {
	this.parent.construct(this, a, b);
}
SearchTypeaheadView.extend('TypeaheadView');
SearchTypeaheadView.prototype = {
	queryData : {
		init : 'quick'
	},
	render : function(g, d, e, a) {
		var c = this.countResults(d);
		var b = '<span class="seeMore">' + (c > 0 ? _tx(
				"See more results for {query}", {
					query : htmlize(g)
				}) : _tx("See results for {query}", {
			query : htmlize(g)
		})) + '<span class="arrow"></span></span>';
		if (c > 0)
			b += '<span class="subtext">' + (c == 1 ? _tx("Displaying top result")
					: _tx("Displaying top {number} results", {
						number : c
					})) + '</span>';
		if (g && !a) {
			var f = URI('/search.php')
					.addQueryData(this.searchPageQueryData(g)) + '';
			d.push( {
				uid : 'search',
				text : g,
				type : 'calltoaction',
				path : f,
				markup : b
			});
		}
		return this.parent.render(g, d, e);
	},
	searchPageQueryData : function(b) {
		var a = copy_properties( {
			q : b
		}, this.queryData || {});
		return a;
	},
	countResults : function(a) {
		return a.length;
	},
	select : function(b) {
		var d = this.index, c = this.items[d], a = DOM.find(c, 'a');
		this.parent.select(b);
		if (a && a.href)
			if (a.target == '_blank') {
				window.open(a.href);
			} else
				goURI(a.href);
	},
	buildMarkup : function(d) {
		var c = d[0];
		var a = c ? c.bucketStyle : '';
		var b = this.parent.buildMarkup(d);
		if (a)
			b = '<div class="' + a + '">' + b + '</div>';
		return b;
	},
	setSid : function(a) {
		this.queryData.tas = a;
	},
	getQuerySuggestion : function(c) {
		var a = this.results[this.index];
		var b = a && a.type != 'filter' ? a.text.toLowerCase() : '';
		return b == c.toLowerCase() ? '' : b;
	}
};
add_properties(
		'TypeaheadRenderers',
		{
			search : function(c, i) {
				var p = c.markup || htmlize(c.text), n = htmlize(c.subtext), a = htmlize(c.category), l = c.photo, e = c.is_external, h = '', o = '', b = '', m = c.classNames
						|| c.type, k = (c.bucketStyle === 'bucketed nomenu'), j = (c.bucketStyle === 'bucketed menu'), d = k
						|| j, g = (c.bucketStyle === 'group_results'), f = c.type == 'filter' ? c.uid + '_filter'
						: '', q = '';
				if (c.tooltip && c.groupIndex === 0 && c.indexInGroup === 0)
					q = '<span class="tophitTipWrap">'
							+ '<span class="tophitTipText">' + c.tooltip
							+ '</span>' + '</span>';
				if (m)
					b = ' class="' + m + '"';
				if (c.path) {
					var r = c.path;
					if (!(/^https?\:\/\//).test(r))
						r = Env.www_base + r.substr(1);
					r += (r.indexOf('?') > 0 ? '&' : '?') + 'ref=ts';
					h = ' href="' + r + '"';
				}
				if (e)
					o = ' target="_blank"';
				if (a && e)
					a += '<span class="arrow"></span>';
				return [
						'<li',
						b,
						'>',
						q,
						(j ? '<i>&nbsp;</i>' : ''),
						(d ? '<span class="bucket_divider">' : ''),
						f ? '<span class="' + f + '">' : '',
						f ? '<i>&nbsp;</i>' : '',
						'<span class="result_info">',
						'<a',
						h,
						o,
						' rel="ignore">',
						((k || g) ? '<i>&nbsp;</i>' : ''),
						(l ? ('<img src="' + l + '" alt="" class="photo"/>')
								: ''),
						(p ? ('<span class="text">' + p + '</span>') : ''),
						(a ? ('<span class="category">' + a + '</span>') : ''),
						(n ? ('<span class="subtext">' + n + '</span>') : ''),
						'</a>', '</span>', f ? '</span>' : '',
						(d ? '</span>' : ''), '</li>' ];
			}
		});

if (window.Bootloader) {
	Bootloader.done( [ "JPZvx" ]);
}