/*1294696729,176820666*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "jRact" ]);
}

function BuddyListDataSource(a) {
	this.parent.construct(this, a);
}
BuddyListDataSource.extend('DataSource');
BuddyListDataSource.prototype = {
	init : function() {
		this.parent.init();
		var a = Arbiter.subscribe(ChatBuddyList.AVAILABILITY_CHANGED,
				this._availableListChanged.bind(this));
		onleaveRegister(function() {
			Arbiter.unsubscribe(a);
		});
	},
	_availableListChanged : function() {
		var b = this.value, a = this.flatValue;
		this.dirty();
		this.addEntries(Chat.getAvailableIds().map(function(c) {
			return {
				uid : c,
				text : ChatUserInfos[c].name,
				photo : ChatUserInfos[c].thumbSrc,
				type : Chat.getAvailability(c).i ? 'idle' : 'active'
			};
		}));
		if (b)
			this.respond(b, this.buildUids(a), true);
	},
	refreshData : function() {
		Chat.updateAvailability();
	},
	onunloadRegister : function() {
		Chat.updateAvailability();
	},
	fetch : bagofholding
};
add_properties('TypeaheadRenderers', {
	buddylist : function(b, d) {
		var f = htmlize(b.text), e = b.photo, a = '', c = [];
		if (e)
			c = [ '<img src="', e, '" alt="" />' ];
		if (b.type)
			a = ' class="' + b.type + '"';
		return [ '<li', a, '>', c.join(''),
				'<span class="text">' + f + '</span>',
				'<i class="' + b.type + '">', '</i>', '</li>' ];
	}
});
var ChatOnlineFriends = {
	chatFriends : {},
	chatStatuses : [ 'chatOnline', 'chatIdle', 'chatOffline' ],
	init : function(e, a, f, b, d, c) {
		this._initShared(e, f, b, c);
		this.facepile = d.firstChild;
		this.dynCounter = 0;
		this.chatFriends = a;
		this.initToken = Arbiter.subscribe(
				ChatBuddyList.BUDDY_LIST_INITIALIZED, this.buddyListInitialized
						.bind(this));
		this._subscribe(ChatBuddyList.AVAILABILITY_CHANGED, function(h, g) {
			if (g.haveFullList)
				this.availableListChanged();
		}.bind(this));
		this._subscribe(ChatOptions.VISIBILITY_CHANGED, this.visibilityChanged
				.bind(this));
		Event.listen(d, 'click', this.clickHandler.bind(this));
	},
	_subscribe : function(event, a) {
		this._tokens.push(Arbiter.subscribe(event, a));
	},
	clickHandler : function(event) {
		var c = event.getTarget();
		var b = Parent.byClass(c, 'uiListItem');
		if (b) {
			var a = this.chatFriends[b.id];
			if (Chat.isOnline()) {
				Chat.openTab(a.user_id, a.name, 'friend');
			} else
				goURI(a.uri);
			return false;
		}
	},
	onunload : function() {
		this._tokens.forEach(function(a) {
			Arbiter.unsubscribe(a);
		});
		Chat.keepCorrectPresenceInfo(false);
	},
	buddyListInitialized : function() {
		Chat.keepCorrectPresenceInfo(true);
	},
	visibilityChanged : function() {
		var a = ge('chatFriendsOnline');
		if (a)
			CSS.conditionClass(a, 'isOffline', !Chat.isOnline());
		this.availableListChanged();
	},
	availableListChanged : function() {
		var d = 0;
		var b = {};
		for ( var e in this.chatFriends) {
			var l = this.chatFriends[e].user_id;
			var f = ge(e);
			if (f) {
				var k, c;
				c = Chat.getAvailability(l);
				if (c && Chat.isOnline() && d < this.maxElements) {
					k = c.i ? 'chatIdle' : 'chatOnline';
					b[l] = k;
					d++;
				} else
					k = 'chatOffline';
				this._setStatus(f, k);
			}
		}
		if (d < this.maxElements && Chat.isOnline()) {
			all_ids = Chat.getAvailableIds();
			for ( var j = 0; d < this.maxElements && j < all_ids.length; j++)
				if (!b[all_ids[j]] && ChatUserInfos[all_ids[j]]) {
					availability = Chat.getAvailability(all_ids[j]);
					var g = this._faceTmpl.render();
					g.id = "chat_facepile_extra_" + this.dynCounter;
					var a = XHPTemplate.getNode(g, 'anchor');
					CSS.addClass(a, availability.i ? 'chatIdle' : 'chatOnline');
					var i = ChatUserInfos[all_ids[j]];
					var h = XHPTemplate.getNode(g, 'img');
					h.setAttribute('src', i.thumbSrc);
					TooltipLink.setTooltipText(a, i.name);
					this.dynCounter++;
					this.chatFriends[g.id] = {
						user_id : all_ids[j]
					};
					this.facepile.appendChild(g);
					d++;
				}
		}
	},
	_setStatus : function(a, b) {
		if (CSS.hasClass(a, b))
			return;
		this.chatStatuses.forEach(function(c) {
			CSS.conditionClass(a, c, c == b);
		});
	},
	initTypeahead : function(c, a, b) {
		c.subscribe('focus', function() {
			c.getData().refreshData();
		});
		c.subscribe('reset', function() {
			CSS.show(a);
			CSS.hide(b);
		});
		c.subscribe('query', function(d, e) {
			if (e.value) {
				CSS.hide(a);
				e.results.length ? CSS.hide(b) : CSS.show(b);
			} else
				CSS.show(a);
		});
		c.subscribe('select', function(d, e) {
			chatDisplay.focusTab(e.selected.uid, true);
		});
	},
	initClientRendering : function(d, e, f, a, c, b) {
		this._initShared(d, f, a, b);
		this._orderedFriends = e;
		this._facepile = c.firstChild;
		this._faceFutures = [];
		this._subscribe(ChatBuddyList.AVAILABILITY_CHANGED, this.update
				.bind(this));
		this._subscribe(ChatOptions.VISIBILITY_CHANGED, this.update.bind(this));
		Event.listen(c, 'click', this.clickHandlerClientRendering.bind(this));
		AvailableList.update();
	},
	_initShared : function(c, d, a, b) {
		this.maxElements = c;
		this._faceTmpl = b;
		this._tokens = [];
		onleaveRegister(this.onunload.bind(this));
		this.initTypeahead(d, DOM.find(a, 'div.fbFriendsOnlineFacepile'), DOM
				.find(a, 'div.chatTypeaheadNoResults'));
	},
	update : function() {
		var b = 0;
		for ( var e = 0; e < this._orderedFriends.length; e++) {
			var d = this._orderedFriends[e];
			var a = AvailableList.get(d);
			var c = this._faceFutures[e];
			var f = b < this.maxElements;
			if (a && f) {
				if (!c) {
					c = this._makeFace(e);
					this._faceFutures[e] = c;
				}
				b++;
			}
			this._updateFace(c, f, this._mapChatStatus(a));
		}
	},
	_mapChatStatus : function(a) {
		switch (a) {
		case AvailableList.OFFLINE:
			return 'chatOffline';
		case AvailableList.IDLE:
			return 'chatIdle';
		case AvailableList.ACTIVE:
			return 'chatOnline';
		}
	},
	_updateFace : function(b, c, a) {
		b && b(function(d) {
			this._setStatus(d, a);
			CSS.conditionShow(d, c);
		}.bind(this));
	},
	_makeFace : function(c) {
		var d = null;
		var a = null;
		var b = this._orderedFriends[c];
		ChatUserInfoManager.get(b, function(j) {
			a = this._faceTmpl.render();
			DataStore.set(a, 'friendID', b);
			var i = XHPTemplate.getNode(a, 'img');
			var k = i.cloneNode(false);
			k.setAttribute('src', j.thumbSrc);
			DOM.replace(i, k);
			var e = XHPTemplate.getNode(a, 'anchor');
			TooltipLink.setTooltipText(e, j.name);
			d && d(a);
			var f = false;
			for ( var h = c + 1; h < this._orderedFriends.length && !f; h++) {
				var g = this._faceFutures[h];
				var l = g && g();
				if (l) {
					this._facepile.insertBefore(a, l);
					f = true;
				}
			}
			if (!f)
				this._facepile.appendChild(a);
		}.bind(this));
		return function faceFuture(e) {
			if (e)
				if (a) {
					e(a);
				} else
					d = e;
			return a;
		};
	},
	clickHandlerClientRendering : function(event) {
		var c = event.getTarget();
		var a = Parent.byClass(c, 'uiFacepileItem');
		if (a) {
			var b = DataStore.get(a, 'friendID');
			if (b && Chat.isOnline()) {
				ChatUserInfoManager.get(b, function(d) {
					Chat.openTab(b, d.name, 'friend');
				});
				return false;
			}
		}
	}
};
onloadRegister(function() {
	Event.listen(document.documentElement, 'submit', function(b) {
		var a = b.getTarget().getElementsByTagName('*');
		for ( var c = 0; c < a.length; c++)
			if (a[c].getAttribute('required') && Input.isEmpty(a[c])) {
				a[c].focus();
				return false;
			}
	}, Event.Priority.URGENT);
});
var HubsTypeaheadView = function(a, b) {
	this.parent.construct(this, a, b);
};
HubsTypeaheadView.extend('TypeaheadView');
HubsTypeaheadView.prototype = {
	render : function(g, e, f) {
		if (this.alwaysRender && g !== '') {
			var c = g.toLowerCase().trim(), a = false;
			for ( var b = 0; b < e.length; b++)
				if (c == e[b].text.toLowerCase()) {
					a = true;
					break;
				}
			var d = _tx("Add \"{hub-text}\"", {
				'hub-text' : htmlize(g)
			}) + '<span class="arrow"></span>';
			if (!a)
				e.push( {
					text : g,
					type : 'calltoaction',
					markup : d
				});
		}
		return this.parent.render(g, e, f);
	}
};
add_properties('TypeaheadRenderers', {
	basic : function(b, d) {
		var f = b.markup || htmlize(b.text);
		var e = htmlize(b.subtext);
		var c = b.icon;
		var a = '';
		if (b.type)
			a = ' class="' + b.type + '"';
		return [ '<li', a, '>', (c ? '<img src="' + c + '" alt=""/>' : ''),
				(f ? '<span class="text">' + f + '</span>' : ''),
				(e ? '<span class="subtext">' + e + '</span>' : ''), '</li>' ];
	}
});

if (window.Bootloader) {
	Bootloader.done( [ "jRact" ]);
}