/*1294696705,176832695*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "o9aMR" ]);
}

function BuddyListNub() {
	this.parent.construct(this);
}
BuddyListNub.extend('NubController');
BuddyListNub.prototype = {
	init : function(a) {
		this.parent.init(a);
		Arbiter.subscribe('buddylist/initialized', function(b, c) {
			c
					.subscribe('content-changed', this.flyoutContentChanged
							.bind(this));
		}.bind(this));
		Bootloader.loadComponents('Toggler', function() {
			var b = Toggler.createInstance(a);
			b.setSticky(!!chatOptions.getSetting('sticky_buddylist'));
			Arbiter.subscribe('chat/option-changed', function(c, d) {
				d.name === 'sticky_buddylist' && b.setSticky(!!d.value);
			});
		});
		this.subscribe('show', Chat.openBuddyList);
		this.subscribe('hide', Chat.closeBuddyList);
	}
};
function UISelectList() {
	this._callback = bagofholding;
	this.container = $N('div', {
		className : 'UISelectList clearfix'
	});
	this._mode = UISelectList.MULTI_SELECT_MODE;
	this._inputName = 'UISelectList_name_' + (+new Date());
	this._items = {};
}
copy_properties(UISelectList, {
	MULTI_SELECT_MODE : 1,
	SINGLE_SELECT_MODE : 2,
	MULTI_SELECT_MODE_CHECKED_CLASS_NAME : 'UISelectList_check_Checked',
	SINGLE_SELECT_MODE_CHECKED_CLASS_NAME : 'UISelectList_radio_Checked'
});
UISelectList.prototype = {
	setMode : function(a) {
		if (a != UISelectList.MULTI_SELECT_MODE
				&& a != UISelectList.SINGLE_SELECT_MODE)
			return this;
		if (!is_empty(this._items))
			return this;
		this._mode = a;
		return this;
	},
	setCallback : function(a) {
		this._callback = a;
		return this;
	},
	addItem : function(d, a, c) {
		var b = {
			label : d,
			checked : a,
			key : c
		};
		this._renderItem(b);
		return this;
	},
	addItems : function(b) {
		for ( var a = 0; a < b.length; a++)
			this.addItem(b[a].label, b[a].checked, b[a].key);
		return this;
	},
	clearItems : function() {
		this._items = {};
		DOM.empty(this.container);
		return this;
	},
	setSelected : function(b, c) {
		if (this._items[b]) {
			var a = this._items[b].input;
			a.checked = !c;
			a.click();
		}
		return this;
	},
	getElement : function() {
		return this.container;
	},
	reset : function() {
		for ( var b in this._items) {
			var a = this._items[b].input;
			var c = this._items[b].label;
			a.checked = a.defaultChecked;
			CSS.conditionClass(c, this._getCheckedClass(), a.checked);
		}
	},
	_renderItem : function(b) {
		var a = $N('input', {
			type : this._getInputType(),
			name : this._inputName
		});
		a.checked = b.checked;
		a.defaultChecked = b.checked;
		var c = $N('a', {
			className : 'UISelectList_Label',
			href : '#'
		}, b.label);
		if (b.checked)
			CSS.addClass(c, this._getCheckedClass());
		Event.listen(c, 'click', this._linkClicked.bind(this, a));
		Event.listen(a, 'click', this._clicked.bind(this, a, c, b.key));
		DOM.appendContent(this.container, $N('div', {
			className : 'UISelectList_Item'
		}, [ a, c ]));
		b.input = a;
		b.label = c;
		this._items[b.key] = b;
	},
	_getInputType : function() {
		if (this._mode == UISelectList.MULTI_SELECT_MODE)
			return 'checkbox';
		return 'radio';
	},
	_getCheckedClass : function() {
		if (this._mode == UISelectList.MULTI_SELECT_MODE)
			return UISelectList.MULTI_SELECT_MODE_CHECKED_CLASS_NAME;
		return UISelectList.SINGLE_SELECT_MODE_CHECKED_CLASS_NAME;
	},
	_linkClicked : function(b, a) {
		b.click();
	},
	_clicked : function(d, g, f, c) {
		var b;
		if (this._mode == UISelectList.SINGLE_SELECT_MODE) {
			for ( var e in this._items) {
				var a = d == this._items[e].input;
				CSS.conditionClass(this._items[e].label, this
						._getCheckedClass(), a);
			}
			b = true;
		} else {
			b = d.checked;
			CSS.conditionClass(g, this._getCheckedClass(), d.checked);
		}
		this._callback(b, f);
		$E(c).stop();
	}
};
function ChatBuddyListDisplay(a) {
	this.inDock = !presence.inPopoutWindow;
	this.buddyList = a;
	this.openFlyout = null;
	this.openControl = null;
	if (presence.inPopoutWindow)
		this.init();
	Arbiter.inform('buddylist-display/initialized', this,
			Arbiter.BEHAVIOR_PERSISTENT);
}
ChatBuddyListDisplay.prototype = {
	init : function() {
		this.init = bagofholding;
		if (this.inDock) {
			var b = $('fbDockChatBuddylistNub');
			this.buddyListPanel = DOM.find(b, '.fbChatBuddylistPanel');
			this.flyout = DOM.find(b, '.fbNubFlyout');
		} else
			this.buddyListPanel = $('buddy_list_panel', true);
		var a = this._clickControlPanel.bind(this,
				'buddy_list_panel_lists_control',
				'buddy_list_panel_lists_flyout', this._getListsFlyoutContent
						.bind(this));
		Event.listen(DOM.find(ge('buddy_list_panel_lists_control'), 'a'),
				'click', a);
		var c = this._clickControlPanel.bind(this,
				'buddy_list_panel_settings_control',
				'buddy_list_panel_settings_flyout', this._getChatSettingsNodes
						.bind(this));
		Event.listen(DOM.find(ge('buddy_list_panel_settings_control'), 'a'),
				'click', c);
	},
	open : function() {
		this.init();
		this.buddyList.openTab();
	},
	close : function() {
		this.buddyList.closeTab();
		this.closeOpenFlyout();
	},
	_clickVisibilityToggle : function() {
		chatOptions.toggleVisibility();
		this.closeOpenFlyout();
	},
	_clickReorderLists : function() {
		this.buddyList.enterReorderingFlMode();
		this.closeOpenFlyout();
	},
	_clickPopout : function() {
		presence.popout();
		this.closeOpenFlyout();
	},
	_clickControlPanel : function(a, b, c) {
		if (this.openFlyout) {
			if (this.openFlyout == b) {
				this.closeOpenFlyout();
			} else {
				this.closeOpenFlyout();
				this._openFlyout(a, b, c());
			}
		} else
			this._openFlyout(a, b, c());
		return false;
	},
	_openFlyout : function(c, e, a) {
		DOM.setContent($(e), a);
		CSS.show(e);
		CSS.addClass(c, 'flyout_open');
		if (this.inDock)
			CSS.addClass(this.flyout, 'menuOpened');
		if (!presence.poppedOut) {
			var d = Vector2.getElementDimensions($(e)).y;
			var b = Vector2.getElementDimensions(this.buddyList
					.getContentWrapper()).y;
			if (d > b)
				CSS.addClass(e, 'flyout_reversed');
		}
		this.openFlyout = e;
		this.openControl = c;
	},
	isFlyoutOpen : function() {
		return this.openFlyout;
	},
	closeOpenFlyout : function() {
		if (!this.openFlyout)
			return;
		CSS.hide(this.openFlyout);
		CSS.removeClass(this.openFlyout, 'flyout_reversed');
		CSS.removeClass(this.openControl, 'flyout_open');
		if (this.inDock)
			CSS.removeClass(this.flyout, 'menuOpened');
		this.openFlyout = null;
		this.openControl = null;
	},
	_getListsFlyoutContent : function() {
		var f = $N('input', {
			className : 'inputtext',
			type : 'text'
		});
		Event.listen(f, 'keypress', this.buddyList.keyPressNewListInput
				.bind(this.buddyList));
		new TextInputControl(f).setPlaceholderText(_tx("Type a list name"));
		var e = $N('div', {
			className : 'new_list'
		}, [ $N('span', {}, _tx("Create a new list:")), f ]);
		var d = $N('div', {
			className : 'text'
		}, _tx("Display these lists in Chat:"));
		var b = this.buddyList.getFriendLists();
		var a = new UISelectList();
		a.setCallback(function(h, g) {
			this.closeOpenFlyout();
			this.buddyList.handleFlInChat(h, g);
		}.bind(this));
		for ( var c in b)
			a.addItem(b[c].n, !b[c].h, c);
		return [ d, a.getElement(), e ];
	},
	_renderListSettingToggle : function(c, a, b) {
		return this._renderToggle('list_online_' + c, a, b,
				'list_online_checkbox_' + c, function(d, e) {
					this.closeOpenFlyout();
					this.buddyList.handleFlInChat(c, d);
				}.bind(this));
	},
	_renderChatSettingToggle : function(b, c, a) {
		return this._renderToggle('chat_setting_' + b, c, a,
				'chat_setting_checkbox_' + b, function(d, e) {
					this.sendSettingChange(b, d.checked);
				});
	},
	_renderToggle : function(d, c, e, b, g) {
		var a = $N('input', {
			type : 'checkbox',
			id : b,
			name : b
		});
		a.checked = c;
		a.defaultChecked = c;
		Event.listen(a, 'click', g.bind(this, a));
		var f = $N('label', {}, e);
		f.setAttribute('for', b);
		return $N('div', {
			className : 'chat_setting clearfix',
			id : d
		}, [ $N('div', {
			className : 'input_box'
		}, [ $N('span', {
			className : 'show_loading'
		}, $N('img', {
			src : '/images/loaders/indicator_blue_small.gif'
		})), $N('span', {
			className : 'hide_loading'
		}, a) ]), f ]);
	},
	_getChatSettingsNodes : function() {
		var c = [];
		if (this.buddyListPanel) {
			var d = $N('a', {
				className : 'go_offline_control'
			}, [ $N('div', {
				className : 'menu_icon'
			}), $N('span', {}, _tx("Go Offline")) ]);
			Event.listen(d, 'click', this._clickVisibilityToggle.bind(this));
			var e = $N('div', {
				className : 'options_actions'
			}, d);
			if (this.buddyList._getFriendListsInChat().length > 1) {
				var g = $N('a', {
					className : 'list_reorder_control'
				}, [ $N('div', {
					className : 'menu_icon'
				}), $N('span', {}, _tx("Re-order Lists")) ]);
				Event.listen(g, 'click', this._clickReorderLists.bind(this));
				e.appendChild(g);
			}
			var f = $N('a', {
				className : 'list_popout_control'
			}, [
					$N('div', {
						className : 'menu_icon'
					}),
					$N('span', {}, (presence.poppedOut ? _tx("Pop in Chat")
							: _tx("Pop out Chat"))) ]);
			Event.listen(f, 'click', this._clickPopout.bind(this));
			e.appendChild(f);
			c.push(e);
			c.push($N('hr', {
				className : 'menu_divider'
			}));
		}
		var b = [ {
			name : 'sound',
			label : _tx("Play Sound for New Messages")
		}, {
			name : 'sticky_buddylist',
			label : _tx("Keep Online Friends Window Open")
		}, {
			name : 'compact_buddylist',
			label : _tx("Show Only Names in Online Friends")
		} ];
		for ( var a = 0; a < b.length; a++)
			c.push(this._renderChatSettingToggle(b[a].name, chatOptions
					.getSetting(b[a].name), b[a].label));
		return c;
	},
	_onSettingChangeResponse : function(a, c, b) {
		chatOptions.setSetting(a, c);
		CSS.removeClass($('chat_setting_' + a), 'chat_setting_loading');
		presence.doSync();
	},
	_onSettingChangeError : function(c, d) {
		CSS.removeClass($('chat_setting_' + c), 'chat_setting_loading');
		var b = $('chat_setting_checkbox_' + c);
		b.checked = !b.checked;
		var a = _tx("Chat");
		this.closeOpenFlyout();
		Chat.enterErrorMode(_tx("Unable to save your {Chat} settings", {
			Chat : a
		}));
	},
	sendSettingChange : function(b, c) {
		CSS.addClass($('chat_setting_' + b), 'chat_setting_loading');
		var a = {};
		a[b] = c;
		new AsyncRequest().setHandler(
				this._onSettingChangeResponse.bind(this, b, c))
				.setErrorHandler(this._onSettingChangeError.bind(this, b))
				.setData(a).setURI(chatDisplay.settingsURL)
				.setAllowCrossPageTransition(true).send();
	}
};
function ChatOptions(b, a) {
	this.visibility = b;
	this.settings = a;
	this._init();
	Arbiter.inform('chat-options/initialized', this,
			Arbiter.BEHAVIOR_PERSISTENT);
}
copy_properties(ChatOptions, {
	VISIBILITY_CHANGED : 'chat/visibility-changed'
});
ChatOptions.prototype = {
	_init : function() {
		presence.registerStateStorer(this._storeState.bind(this));
		presence.registerStateLoader(this._loadState.bind(this));
	},
	_storeState : function(a) {
		a.vis = this.visibility;
		a.bls = this.getSetting('sticky_buddylist');
		a.blc = this.getSetting('compact_buddylist');
		a.snd = this.getSetting('sound');
		return a;
	},
	_loadState : function(a) {
		if (a.vis != this.visibility)
			this.setVisibility(a.vis);
		this.setSetting('sticky_buddylist', a.bls);
		this.setSetting('compact_buddylist', a.blc);
		this.setSetting('sound', a.snd);
	},
	setVisibility : function(a) {
		if (a == this.visibility)
			return;
		this.visibility = a;
		if (a) {
			channelManager.isActionRequest = true;
			channelManager.rebuild(ChannelRebuildReasons.UIRestart);
		} else if (!Chat.isFeatureAvailable('always_connect'))
			channelManager.setReady(false);
		Arbiter.inform(ChatOptions.VISIBILITY_CHANGED, {
			sender : this
		});
	},
	_onVisibilityResponse : function(a, b) {
		presence.pauseSync();
		this.setVisibility(a);
		if (!presence.inPopoutWindow && !a)
			chatDisplay.unfocus();
		presence.resumeSync();
		if (presence.poppedOut)
			presence.popout();
	},
	_onVisibilityError : function(b) {
		var a = _tx("Chat");
		Chat.enterErrorMode(_tx("Unable to save your {Chat} settings", {
			Chat : a
		}));
	},
	toggleVisibility : function() {
		this.sendVisibility(!this.visibility);
	},
	sendVisibility : function(c) {
		if (this.visibility == c)
			return;
		var a = {
			visibility : c
		};
		var b = chatDisplay._getIDsToNotifyVisibility(c);
		if (b)
			a.notify_ids = b;
		this.visibilityAsync = new AsyncRequest().setHandler(
				this._onVisibilityResponse.bind(this, c)).setErrorHandler(
				this._onVisibilityError.bind(this)).setData(a).setURI(
				chatDisplay.settingsURL).setAllowCrossPageTransition(true)
				.send();
	},
	getSetting : function(a) {
		return this.settings[a];
	},
	setSetting : function(a, b) {
		if (this.getSetting(a) == b)
			return;
		this.settings[a] = b;
		Arbiter.inform('chat/option-changed', {
			name : a,
			value : b
		});
	}
};
function ChatTabSlider() {
	this.inDock = !presence.inPopoutWindow;
	this.handleWidth = env_get('chat_fe_rewrite') ? 150 : 136;
	this.animationTime = 210;
	this._init();
}
ChatTabSlider.prototype = {
	_init : function() {
		this.org_s = 0;
		this.numToShow = 0;
		this.numShift = 1;
		this.shiftByNumTabs = false;
		this.timer = null;
		this.skipAnimation = false;
		this.chatWidth = null;
		if (this.inDock) {
			var a = $('fbDockChatTabSlider');
			this.chat = ge('fbDockChatTabsWrapper');
			this.chatTabBar = ge('fbDockChatTabs');
			this.nextTab = DOM.find(a, 'div.next');
			Event.listen(this.nextTab, 'click', this.next.bind(this));
			this.prevTab = DOM.find(a, 'div.previous');
			Event.listen(this.prevTab, 'click', this.prev.bind(this));
			this.nextCounter = DOM.find(this.nextTab, 'span.numTabs');
			this.prevCounter = DOM.find(this.prevTab, 'span.numTabs');
			this.numMissedNextCounter = DOM.find(this.nextTab,
					'span.numMessages');
			this.numMissedPrevCounter = DOM.find(this.prevTab,
					'span.numMessages');
			Bootloader.loadComponents('Toggler', function() {
				Toggler.createInstance(this.chatTabBar);
			}.bind(this));
		} else {
			this.chat = ge('chat');
			this.chatTabBar = ge('chat_tab_bar');
			this.nextTab = ge('chat_next_tab');
			this.prevTab = ge('chat_previous_tab');
			this.nextCounter = ge('next_count');
			this.prevCounter = ge('prev_count');
			this.numMissedNextCounter = ge('next_num_missed');
			this.numMissedPrevCounter = ge('prev_num_missed');
		}
		this.numNext = 0;
		this.numPrev = 0;
		this.prevTabs = {};
		this.nextTabs = {};
		presence.registerStateLoader(this._load.bind(this));
		presence.registerStateStorer(this._store.bind(this));
		Event.listen(window, 'resize', this._resize.bind(this, false));
	},
	load : function() {
		this._load(presence.state);
		this._resize(true);
	},
	_load : function(a) {
		var b = 0;
		if (a)
			b = (a.s ? a.s : b);
		this._setPos(b);
	},
	_store : function(a) {
		a.s = this._s;
		return a;
	},
	_calculate : function(a) {
		this._setMaxWidth();
		if (a)
			this.maxWidth -= 16;
		if (presence.poppedOut) {
			this.numToShow = chatDisplay.numTabs;
		} else {
			this.numToShow = parseInt(this.maxWidth / this.handleWidth);
			this.numToShow = this.numToShow > 0 ? this.numToShow : 1;
		}
		if (this.shiftByNumTabs)
			this.numShift = this.numToShow;
		if (this._s != null)
			this._setPos(this._s);
	},
	_setMaxWidth : function() {
		if (this.inDock) {
			var d = document.body.clientWidth;
			var a = Parent.byClass(this.chat, 'fbDock').firstChild;
			for (; a; a = a.nextSibling)
				d -= a.clientWidth;
			d += this.chat.clientWidth;
			this.maxWidth = d - 70;
		} else {
			var d = document.body.offsetWidth;
			if (ChatTabSlider.presenceWidthTest)
				var d = $('presence_ui').offsetWidth;
			var b = [ 'buddy_list_tab', 'presence_notifications_tab' ];
			for ( var c = 0; c < b.length; c++)
				d -= (ge(b[c]) && $(b[c]).clientWidth != undefined) ? ge(b[c]).clientWidth
						: 0;
			this.maxWidth = (presence.poppedOut ? d - 254 : d - 138);
		}
	},
	_setPos : function(a) {
		if (a < 0)
			a = 0;
		this._s = a;
		this._e = this._s + this.numToShow;
	},
	_doSync : function() {
		var a = (this.org_s != this._s);
		this.org_s = 0;
		if (a)
			presence.doSync();
	},
	_build : function() {
		if (presence.poppedOut)
			return;
		var a = (this.numToShow >= chatDisplay.numTabs) ? true : false;
		this.setVisibleTabs(a);
		if (a) {
			this.resetCounters();
		} else
			this.updateCounters();
		this.updateMissedCount();
	},
	_resize : function(a) {
		this.org_s = this._s;
		this._calculate(a);
		this._build();
		this._doSync();
		if (chatDisplay.lastFocused != null)
			this.gotoTab(chatDisplay.lastFocused);
	},
	addTab : function(a) {
		this._build();
	},
	gotoTab : function(a) {
		if (!(a in chatDisplay.tabs))
			return;
		var b = chatDisplay.tabList.indexOf(chatDisplay.tabs[a]);
		if (!this._inRange(b)) {
			var c = (b - this.numToShow) + 1;
			this._setPos(c);
			this._build();
		}
	},
	close : function() {
		this
				._setPos(((this.numPrev > 0 || this.numNext > 0) && this._s > 0) ? this._s - 1
						: 0);
		this._calculate();
		this._build();
	},
	setVisibleTabs : function(a) {
		var d = chatDisplay.tabList;
		for ( var b = 0, c = d.length; b < c; ++b)
			if (this._inRange(b, d[b].id) || a) {
				d[b].show();
			} else
				d[b].hide();
	},
	_inRange : function(c, b) {
		var d, a = false;
		if (c >= this._s) {
			d = true;
			delete this.prevTabs[b];
		} else
			this.prevTabs[b] = b;
		if (c < this._e) {
			a = true;
			delete this.nextTabs[b];
		} else
			this.nextTabs[b] = b;
		return (d && a);
	},
	updateMissedCount : function() {
		var c = 0;
		var b = 0;
		for ( var a in this.prevTabs)
			c += chatDisplay.tabs[a] ? chatDisplay.tabs[a].numMissed : 0;
		this.numMissedPrevCounter.innerHTML = c;
		CSS.conditionClass(this.numMissedPrevCounter, 'hidden_elem', !c);
		for ( var a in this.nextTabs)
			b += chatDisplay.tabs[a] ? chatDisplay.tabs[a].numMissed : 0;
		this.numMissedNextCounter.innerHTML = b;
		CSS.conditionClass(this.numMissedNextCounter, 'hidden_elem', !b);
	},
	updateCounters : function() {
		this.numNext = chatDisplay.numTabs - this._e;
		this.numPrev = this._s;
		if (this.numNext <= 0) {
			this.numNext = 0;
			CSS.addClass(this.nextTab, 'disabled');
		} else
			CSS.removeClass(this.nextTab, 'disabled');
		if (this.numPrev <= 0) {
			this.numPrev = 0;
			CSS.addClass(this.prevTab, 'disabled');
		} else
			CSS.removeClass(this.prevTab, 'disabled');
		if (this.numPrev > 0 || this.numNext > 0) {
			if (this.inDock) {
				CSS.show(this.nextTab);
				CSS.show(this.prevTab);
			} else {
				show('chat_next_tab');
				show('chat_previous_tab');
			}
		} else if (this.inDock) {
			CSS.hide(this.nextTab);
			CSS.hide(this.prevTab);
		} else {
			hide('chat_next_tab');
			hide('chat_previous_tab');
		}
		this.nextCounter.innerHTML = this.numNext;
		this.prevCounter.innerHTML = this.numPrev;
	},
	resetCounters : function() {
		this._setPos(0);
		this.updateCounters();
	},
	shift : function(a) {
		this.org_s = this._s;
		chatDisplay.unfocusNoSync();
		this._shift.bind(this, a).defer();
	},
	_shift : function(a) {
		this._setPos(this._s < 0 ? 0 : this._s + a);
		this._slide(a);
		if (this.timer || this.skipAnimation) {
			this._slideReset();
			this.skipAnimation = true;
			var b = setTimeout(function() {
				this.skipAnimation = false;
			}.bind(this), 500);
		} else
			this.timer = setTimeout(function() {
				this._slideReset();
			}.bind(this), this.animationTime);
	},
	_slide : function(a) {
		this._slideSetup(false);
		this.setVisibleTabs(true);
		this.slideInc = (a * (this.handleWidth));
		this.leftPos = -(a) * (this.numNext * (this.slideInc));
		this.chatTabBar.style.left = this.leftPos + 'px';
		animation(this.chatTabBar).by('left', this.slideInc).duration(
				this.animationTime - 10).go();
	},
	_slideSetup : function(a) {
		this.chat.style.position = a ? '' : 'relative';
		this.chat.style.overflow = a ? 'visible' : 'hidden';
		if (!this.chatWidth)
			this.chatWidth = this.chatTabBar.clientWidth;
		if (a)
			this.chatWidth = null;
		this.chat.style.width = a ? '' : this.chatWidth + 'px';
		this.chatTabBar.style.width = a ? '' : chatDisplay.numTabs
				* this.handleWidth + 'px';
		this.chatTabBar.style.position = a ? '' : 'absolute';
	},
	_slideReset : function() {
		clearTimeout(this.timer);
		this.timer = null;
		this._slideSetup(true);
		this._build();
		var a = chatDisplay.lastFocused;
		if (a) {
			var b = chatDisplay.tabList.indexOf(chatDisplay.tabs[a]);
			if (this._inRange(b)) {
				chatDisplay.refocus();
			} else
				chatDisplay.lastFocused = null;
		}
		this._doSync();
	},
	next : function() {
		this.numNext && this.shift(this.numShift);
		return false;
	},
	prev : function() {
		this.numPrev && this.shift(-this.numShift);
		return false;
	}
};

if (window.Bootloader) {
	Bootloader.done( [ "o9aMR" ]);
}