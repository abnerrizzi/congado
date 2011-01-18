/*1294159658,169776065*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "0WQsj" ]);
}

var FriendsEditDash = {
	init : function() {
		var a = Arbiter.LIST_EDITOR_LISTS_CHANGED;
		Arbiter.subscribe(a, function(c, b) {
			if (c == a)
				if (b.is_new_list)
					goURI('/friends/edit/?sk=fl_' + b.list_info.list_id, true);
		}.bind(this), Arbiter.SUBSCRIBE_NEW);
	}
};
var EditableFriendListPane = {
	_starred : {},
	_memberships : {},
	_listNames : {},
	init : function(b, a, c) {
		this._pane = b;
		this._selector = c;
		this._flid = a;
		this._friendID = null;
		this._activeItem = null;
		if (!this._loaded)
			this.loadData();
		if (c && !this._subscribed) {
			Selector.subscribe('toggle', this.onListSelectorEvent.bind(this));
			Selector.subscribe('open', this.onListSelectorEvent.bind(this));
			Selector.subscribe('close', this.onListSelectorEvent.bind(this));
			this._subscribed = true;
		}
		Event.listen(this._pane, 'mouseover', this.onMouseover.bind(this));
		if (!this._arbiterToken)
			this._arbiterToken = Arbiter.subscribe('friends/star_changed',
					function(e, d) {
						if (e == 'friends/star_changed')
							if (d.add) {
								this._starred[d.uid] = 1;
							} else if (d.remove)
								delete this._starred[d.uid];
					}.bind(this), Arbiter.SUBSCRIBE_NEW);
	},
	isStarred : function(a) {
		return this._starred[a];
	},
	onMouseover : function(event) {
		if (this._editing || !this._selector)
			return;
		var a = Parent.byTag(event.getTarget(), 'li');
		if (!a || (a == this._activeItem))
			return;
		this.bootstrapListEditor(a);
	},
	loadData : function() {
		this._loaded = false;
		new AsyncRequest('/friends/edit/ajax/list_memberships.php')
				.setReadOnly(true).setMethod('GET').setHandler(function(a) {
					this._starred = a.getPayload().starred;
					this._memberships = a.getPayload().memberships;
					this._listNames = a.getPayload().listNames;
					this._loaded = true;
					if (this._activeItem && !this._editing)
						this.bootstrapListEditor(this._activeItem);
				}.bind(this)).send();
	},
	bootstrapListEditor : function(d) {
		this._activeItem = d;
		this._friendID = d.getAttribute('data-id');
		CSS.hide(this._selector);
		if (!this._loaded || !this._friendID)
			return;
		this._bootstrapping = true;
		var a = Selector.getEnabledOptions(this._selector);
		for ( var c = 0; c < a.length; ++c)
			Selector.setSelected(this._selector, Selector.getOptionValue(a[c]),
					false);
		var e = this._memberships[this._friendID];
		if (e)
			for ( var b in e)
				Selector.setSelected(this._selector, b, true);
		this.updateSelectorTooltip(this._friendID);
		DOM.setContent(DOM.find(this._activeItem, 'div.listSelectorTarget'),
				this._selector);
		CSS.show(this._selector);
		this._bootstrapping = false;
	},
	updateSelectorTooltip : function(a) {
		var c = [];
		if (this._memberships[a])
			for ( var b in this._memberships[a])
				c.push(htmlize(this._listNames[b]));
		CSS.conditionClass(
				DOM.find(this._activeItem, 'div.listSelectorTarget'),
				'listSelectorNoLists', c.length === 0);
		Selector.setButtonTooltip(this._selector, c.join('<br />'));
	},
	onListSelectorEvent : function(g, a) {
		if (DOM.contains(this._pane, a.selector))
			switch (g) {
			case 'open':
			case 'close':
				this._editing = (g == 'open');
				return;
			case 'toggle':
				if (this._bootstrapping)
					return false;
				var c = this._friendID;
				var b = Selector.getOptionValue(a.option);
				var f = Selector.isOptionSelected(a.option);
				var d = {
					flid : b,
					id : c,
					quick : true
				};
				if (f) {
					d.add = 1;
					if (!this._memberships[c])
						this._memberships[c] = {};
					this._memberships[c][b] = 1;
				} else {
					d.remove = 1;
					delete this._memberships[c][b];
				}
				this.updateSelectorTooltip(c);
				if (b == this._flid) {
					var e = $('editFriend_' + c);
					CSS.conditionClass(DOM.find(e, 'a.UIImageBlock_Image'),
							'aero', !f);
					CSS.conditionClass(DOM.find(e, 'div.UIImageBlock_Content'),
							'aero', !f);
				}
				new AsyncRequest('/friends/ajax/lists.php').setData(d).send();
				return;
			}
	}
};
function Pager(b, a) {
	this._pagerEle = b;
	this._options = a;
}
Pager.prototype = {
	_createSummaryText : function() {
		var e = this._options.total;
		var b = this._options.perpage;
		var a = this._options.offset;
		if (!e)
			return '';
		if (e <= b || !this._options.showtotal) {
			if (e == 1) {
				return _tx("1 result");
			} else
				return _tx("{number_of_results} results", {
					number_of_results : e
				});
		} else {
			var c = Math.min(a + b, e);
			var d;
			if (e > 500 && !this._options.alwaysshowtotal) {
				d = _tx(
						"{starting_offset}-{ending_offset} of over {number_of_results} results",
						{
							starting_offset : (a + 1),
							ending_offset : c,
							number_of_results : 500
						});
			} else
				d = _tx(
						"{starting_offset}-{ending_offset} of {number_of_results} results",
						{
							starting_offset : (a + 1),
							ending_offset : c,
							number_of_results : e
						});
			return d;
		}
	},
	_render : function() {
		var a = this._options;
		if (a.includesummary)
			this.setSummary(this._createSummaryText());
		Button.setEnabled(this.getPrevButton(), a.offset > 0);
		Button.setEnabled(this.getNextButton(), a.offset + a.perpage < a.total);
	},
	setOffset : function(a) {
		var b = this._options;
		a = Math.max(0, Math.min(a, b.total - 1));
		if (a != b.offset) {
			b.offset = a;
			this._render();
		}
	},
	getOffset : function() {
		return this._options.offset;
	},
	setSummary : function(a) {
		DOM.setContent(DOM.find(this._pagerEle, 'div.summary'), a);
	},
	getRoot : function() {
		return this._pagerEle;
	},
	getPrevButton : function() {
		return DOM.find(this._pagerEle, 'a.prev');
	},
	getNextButton : function() {
		return DOM.find(this._pagerEle, 'a.next');
	},
	getPerpage : function() {
		return this._options.perpage;
	},
	setTotal : function(b) {
		var a = this._options;
		if (a.total != b) {
			a.total = b;
			this._render();
		}
	},
	getTotal : function() {
		return this._options.total;
	}
};
var FriendSearchPane = {
	_starredIsLive : false,
	init : function(f, a, b, e, d, g, h) {
		if (!this._dataSource) {
			this._data = null;
			this._dataSorted = null;
			this._dataSource = a;
			this._dataSource.init();
			this._dataSource.bootstrap();
			this._dataSource.subscribe('respond', this.onResults.bind(this));
		}
		this._stars = g;
		this._starredIsLive = h;
		this._hubs = d;
		for ( var c in d)
			d[c].subscribe('select', this.onHubSelect.bind(this, c));
		this._searchInput = f;
		Event.listen(f, 'keyup', this.onSearch.bind(this));
		this._filter = b;
		Selector.listen(b, 'change', this.onFilter.bind(this));
		this._pager = e;
		Event.listen(e.getPrevButton(), 'click', this._onPage.bind(this, -e
				.getPerpage()));
		Event.listen(e.getNextButton(), 'click', this._onPage.bind(this, e
				.getPerpage()));
	},
	onHubSelect : function(a, event, b) {
		if ((event == 'select') && b.selected)
			this._onFilter(a + '_' + b.selected.uid);
	},
	onFilter : function(a) {
		delete this._scheduleAll;
		if (a.selector == this._filter) {
			var b = Selector.getValue(a.selector);
			if (b == 'location' || b == 'currentcity' || b == 'hometown'
					|| b == 'school' || b == 'workplace' || b == 'interest') {
				this._activeHubFilter && CSS.hide(this._activeHubFilter);
				this._activeHubFilter = 'editFriendsHubsTypeahead_' + b;
				CSS.hide('editFriendsSearchTypeahead');
				this._hubs[b].getCore().reset();
				CSS.show(this._activeHubFilter);
				return;
			}
			this._activeHubFilter && CSS.hide(this._activeHubFilter);
			CSS.show('editFriendsSearchTypeahead');
			if (b == 'recent') {
				this.restoreResults();
				return;
			}
			if (b == 'all') {
				this.onAll(0);
				return;
			}
			this._onFilter(b);
		}
	},
	_onFilter : function(a) {
		new AsyncRequest('/friends/edit/ajax/filter_friends.php').setMethod(
				'GET').setReadOnly(true).setData( {
			filter : a
		}).setStatusElement(this._filter.parentNode).setStatusClass('aero')
				.setHandler(this._onFilterResponse.bind(this, a)).send();
	},
	_onFilterResponse : function(b, f) {
		var a = '';
		var e = f.getPayload();
		var d = e.ids;
		var g = [];
		for ( var c = 0; c < d.length; ++c)
			g.push(this._data[d[c]]);
		if (g.length === 0)
			a = '<li class="phm fsl fcg">' + e.empty_message + '</li>';
		this.replaceResults(g, a, e.should_sort, e.summary_markup);
	},
	_onPage : function(a) {
		this.onAll(this._pager.getOffset() + a);
		return false;
	},
	onSearch : function(a) {
		delete this._scheduleAll;
		Selector.setSelected(this._filter, 'all', true);
		if (!this._searchInput.value) {
			this.onAll(0);
		} else
			this._dataSource.query(this._searchInput.value);
	},
	onAll : function(e, g) {
		if (g)
			Selector.setSelected(this._filter, 'all', true);
		if (this._dataSorted === null) {
			if (this._data === null) {
				this._scheduleAll = true;
				return;
			}
			var b = Object.from(this._dataSource.getExclusions());
			var h = [];
			var f = this._data;
			for ( var c in f)
				if (!(c in b))
					h.push( {
						name : f[c].text.toLocaleLowerCase(),
						res : f[c]
					});
			h = h.sort(function(j, k) {
				return j.name.localeCompare(k.name);
			});
			this._dataSorted = [];
			for (c = 0; c < h.length; ++c)
				this._dataSorted.push(h[c].res);
		}
		var i = this._dataSorted.length;
		var a = Math.min(e + this._pager.getPerpage(), i);
		this._pager.setTotal(i);
		this._pager.setOffset(e);
		var d = {
			starting_offset : e + 1,
			ending_offset : a,
			number_of_friends : this._pager.getTotal()
		};
		this._pager
				.setSummary(_tx(
						"{starting_offset}-{ending_offset} of {number_of_friends} friends",
						d));
		this.replaceResults(this._dataSorted.slice(e, a));
		CSS.show(this._pager.getRoot());
	},
	onResults : function(a, b) {
		if (b.value === undefined) {
			if (this._data === null)
				this._data = this._dataSource.data;
			if (this._scheduleAll) {
				delete this._scheduleAll;
				this.onAll(0);
			}
		} else {
			if (b.results.length == 0)
				var c = '<li class="phm fsl fcg">' + _tx(
						"You have no friends whose name contains \"{search_term}\".",
						{
							search_term : htmlize(b.value)
						}) + '</li>';
			this.replaceResults(b.results, c, true);
		}
	},
	restoreResults : function() {
		Selector.setSelected(this._filter, 'recent', true);
		CSS.hide('editFriendsSummaryMessage');
		CSS.hide('editFriendsSearchResults');
		CSS.show('editFriendsSearchList');
		CSS.show('editFriendsSearchFooter');
		CSS.hide(this._pager.getRoot());
	},
	replaceResults : function(d, a, e, g) {
		var b;
		if (e) {
			var f = [];
			for (b = 0; b < d.length; ++b)
				f.push( {
					name : d[b].text.toLocaleLowerCase(),
					res : d[b]
				});
			f = f.sort(function(h, i) {
				return h.name.localeCompare(i.name);
			});
			d = [];
			for (b = 0; b < f.length; ++b)
				d.push(f[b].res);
		}
		var c = [];
		for (b = 0; b < d.length; ++b)
			c.push(this.renderResult(d[b], b === 0));
		if (c.length == 0)
			c.push(a);
		CSS.hide('editFriendsSearchList');
		if (g) {
			DOM.setContent($('editFriendsSummaryMessage'), g);
			CSS.show('editFriendsSummaryMessage');
		} else
			CSS.hide('editFriendsSummaryMessage');
		DOM.setContent($('editFriendsSearchResults'), HTML(c.join('')));
		CSS.show('editFriendsSearchResults');
		CSS.hide('editFriendsSearchFooter');
		CSS.hide(this._pager.getRoot());
	},
	renderStar : function(f) {
		if (!this._starredIsLive)
			return '';
		var c, e;
		if (EditableFriendListPane.isStarred(f)) {
			c = 'remove';
			e = this._stars.on;
		} else {
			c = 'add';
			e = this._stars.off + this._stars.hover + this._stars.saving;
		}
		var d = {
			star : 1,
			redux : 1,
			id : f
		};
		d[c] = 1;
		var a = URI('/friends/ajax/lists.php').setQueryData(d).toString();
		var b = '<div class="mtl mrm lfloat">'
				+ '<a class="stat_elem friendStar" rel="async-post" ajaxify="'
				+ a + '">' + e + '</a>' + '</div>';
		return b;
	},
	renderResult : function(h, b) {
		var g = '/friends/edit/ajax/remove_friend_dialog.php?id=' + h.uid;
		var d = '';
		var c = 'UIImageBlock clearfix UIImageBlock_Entity';
		if (this._starredIsLive)
			if (h.type == 'user') {
				d = this.renderStar(h.uid);
			} else
				c = c + ' editFriendsNoStar';
		var f = b ? 'pbs' : 'pvs';
		var a = h.category ? '<div class="uiTextSubtitle">' + h.category + '</div>'
				: '';
		var e = '<li id="editFriendResult_'
				+ h.uid
				+ '" '
				+ 'class="'
				+ f
				+ ' uiListItem uiListLight uiListVerticalItemBorder" '
				+ 'data-id="'
				+ h.uid
				+ '">'
				+ '<div class="'
				+ c
				+ '">'
				+ d
				+ '<a href="'
				+ h.path
				+ '">'
				+ '<img class="uiProfilePhoto UIImageBlock_Image UIImageBlock_ENT_Image '
				+ 'uiProfilePhotoLarge img" src="' + h.photo + '" />' + '</a>'
				+ '<div class="UIImageBlock_Ext">'
				+ '<div class="mls editFriendsRemoveButton">'
				+ '<a class="uiCloseButton" rel="dialog" ' + 'href="' + g
				+ '" title="' + _tx("Remove Friend") + '" >' + '</a>'
				+ '</div>' + '<div class="lfloat listSelectorTarget"></div>'
				+ '</div>'
				+ '<div class="UIImageBlock_Content UIImageBlock_ENT_Content">'
				+ '<div class="fsl fwb fcb">' + '<a href="' + h.path + '">'
				+ htmlize(h.text) + '</a>' + '</div>' + a + '</div>' + '</div>'
				+ '</li>';
		return e;
	},
	removeFriend : function(c) {
		var a = ge('editFriend_' + c);
		var b = ge('editFriendResult_' + c);
		a && CSS.addClass(a, 'aero');
		b && CSS.addClass(b, 'aero');
		new AsyncRequest('/friends/ajax/lists.php').setData( {
			remove_friend : 1,
			id : c,
			redux : 1
		}).setHandler(
				function() {
					a && DOM.remove(a);
					b && DOM.remove(b);
					this._dataSource.setExclusions( [ c ]
							.concat(this._dataSource.getExclusions()));
					this._dataSorted = null;
				}.bind(this)).send();
	}
};

if (window.Bootloader) {
	Bootloader.done( [ "0WQsj" ]);
}