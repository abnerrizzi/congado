/*1292874373,176820407*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "hipy9" ]);
}

add_properties('Hovercard', {
	ARROW_LEFT_OFFSET : 32,
	RESERVED_HEIGHT : 237,
	cache : {},
	lastEndpoint : null,
	isShowing : false,
	fetchDelay : 200,
	showDelay : 1250,
	loadingDelay : 1750,
	hideDelay : 250,
	fetchTimer : null,
	showTimer : null,
	loadingTimer : null,
	hideTimer : null,
	build : function() {
		this.build = bagofholding;
		var a = $N('div', {
			className : 'arrow'
		}, $N('i'));
		this.loading = $N('div', {
			className : 'loading'
		}, _tx("Loading..."));
		this.stage = $N('div', {
			className : 'stage'
		}, this.loading);
		this.preload = $N('div', {
			id : 'hovercardPreload'
		});
		this.overlay = $N('div', {
			className : 'HovercardOverlay'
		});
		this.container = $N('div', {
			className : 'hovercard clearfix'
		}, [ this.stage, a ]);
		Event.listen(this.container, 'mouseout', bind(this, 'hide', false));
		Event.listen(this.container, 'mouseover', function() {
			clearTimeout(this.hideTimer);
		}.bind(this));
		Arbiter.subscribe('page_transition', function() {
			this.hide(true);
			this.dirty();
		}.bind(this), Arbiter.SUBSCRIBE_NEW);
		document.body.appendChild(this.preload);
		document.body.insertBefore(this.overlay, document.body.firstChild);
	},
	process : function(b) {
		var d = Event.listen(b, 'mouseout', function() {
			clearTimeout(this.fetchTimer);
			clearTimeout(this.showTimer);
			d.remove();
			this.hide();
		}.bind(this));
		if (!this.active.moveToken)
			this.active.moveToken = Event.listen(b, 'mousemove',
					function(event) {
						this.active.pos = Vector2.getEventPosition(event);
					}.bind(this));
		clearTimeout(this.fetchTimer);
		clearTimeout(this.showTimer);
		clearTimeout(this.hideTimer);
		var a = this.fetchDelay;
		var c = this.isShowing ? this.hideDelay : this.showDelay;
		if (b.getAttribute('data-hovercard-instant'))
			a = c = 100;
		this.fetchTimer = setTimeout(this.fetch.bind(this, b), a);
		this.showTimer = setTimeout(this.show.bind(this, b), c);
	},
	show : function(c, b) {
		this.build();
		if (this.active.node != c)
			return;
		var a;
		if (this.cache[this.active.endpoint]) {
			a = this.cache[this.active.endpoint];
		} else if (b) {
			a = this.loading;
		} else {
			var d = this.isShowing ? this.hideDelay : this.showDelay;
			this.loadingTimer = setTimeout(this.show.bind(this, c, true),
					this.loadingDelay - d);
		}
		a && this.update(a, c);
	},
	hide : function(a) {
		if (a) {
			var b = this.container && this.container.parentNode;
			b && b.removeChild(this.container);
			this.isShowing = false;
		} else
			this.hideTimer = setTimeout(this.hide.bind(this, true),
					this.hideDelay);
	},
	update : function(a) {
		if (this.stage.firstChild)
			this.stage.removeChild(this.stage.firstChild);
		var c = a.getAttribute('data-hovercard-layout');
		if (c)
			this.container.className = 'hovercard ' + c;
		var b = this.active.endpoint;
		var d = this.active.node;
		if (b != this.lastEndpoint)
			(function() {
				new AsyncSignal('/ajax/hovercard/shown.php').send();
				if (window.ft)
					ft.logElemNew(d, {
						evt : ft.NF_EVENT_HOVERCARD_IMPRESSION
					});
			}).defer();
		this.stage.appendChild(a);
		this.position(d);
		this.overlay.appendChild(this.container);
		this.lastEndpoint = b;
		this.isShowing = true;
	},
	position : function(b) {
		var a = this.getBounds(b);
		var c = a.w();
		if (c < 2 * this.ARROW_LEFT_OFFSET)
			a = a.add(c / 2 - this.ARROW_LEFT_OFFSET, 0);
		var d = a.getPositionVector().convertTo('viewport');
		if (d.y < this.RESERVED_HEIGHT) {
			new Vector2(a.l, a.b, 'document')
					.setElementPosition(this.container);
			CSS.setStyle(this.container, 'bottom', 'auto');
			CSS.addClass(this.container, 'HovercardBelow');
		} else {
			CSS.setStyle(this.container, 'left', a.l + 'px');
			CSS.setStyle(this.container, 'top', 'auto');
			CSS.setStyle(this.container, 'bottom', -a.t + 'px');
			CSS.removeClass(this.container, 'HovercardBelow');
		}
	},
	getBounds : function(e) {
		var a = this.active.pos;
		var h = e.getClientRects();
		if (!a || h.length === 0)
			return Rect.getElementBounds(e);
		var b;
		var c = false;
		for ( var d = 0; d < h.length; d++) {
			var g = new Rect(Math.round(h[d].top), Math.round(h[d].right), Math
					.round(h[d].bottom), Math.round(h[d].left), 'viewport')
					.convertTo('document');
			var f = g.getPositionVector();
			var i = f.add(g.getDimensionVector());
			if (!b || (f.x <= b.l && f.y > b.t)) {
				if (c)
					break;
				b = new Rect(f.y, i.x, i.y, f.x, 'document');
			} else {
				b.t = Math.min(b.t, f.y);
				b.b = Math.max(b.b, i.y);
				b.r = i.x;
			}
			if (g.contains(a))
				c = true;
		}
		return b;
	},
	fetch : function(c) {
		if (c.id && this.cache[c.id] != null)
			return;
		var a = this.getEndpoint(c);
		if (this.cache[a] != null)
			return;
		this.setFetchInProgress(a);
		var b = function() {
			this.dirty(a);
			this.hide(true);
			clearTimeout(this.showTimer);
			clearTimeout(this.loadingTimer);
		}.bind(this);
		new AsyncRequest(a).setMethod('GET').setReadOnly(true).setHandler(
				function(e) {
					var d = e.getPayload();
					if (!d) {
						b();
						return;
					}
					this.setCache(a, HTML(d).getRootNode());
				}.bind(this)).setErrorHandler(b).setTransportErrorHandler(b)
				.send();
	},
	setFetchInProgress : function(a) {
		this.cache[a] = false;
	},
	setCache : function(a, b) {
		this.build();
		this.cache[a] = b;
		if (this.active.endpoint == a && this.isShowing) {
			this.update(b);
		} else
			DOM.appendContent(this.preload, b);
	},
	dirty : function(a) {
		if (a) {
			var b = this.cache[a];
			var c = b && b.parentNode;
			c && c.removeChild(b);
			this.cache[a] = null;
		} else {
			$A(this.preload.childNodes).each(DOM.remove);
			this.cache = {};
		}
	}
});
var HovercardLoader = {
	loadAll : function(a) {
		a = $(a || 'content');
		var e = {};
		var g = {};
		var c = DOM.scry(a, 'a[data-hovercard]');
		for ( var f = 0; f < c.length; f++) {
			var d = c[f].getAttribute('data-hovercard');
			if (Hovercard.cache[d] == null) {
				var b = URI(d).getQueryData();
				if (b.id) {
					e[d] = b.id;
					if (b.type)
						g[b.id] = b.type;
				}
			}
		}
		if (!is_empty(e))
			this._multifetch(e, g);
	},
	_multifetch : function(b, e) {
		var f = [];
		var g = {};
		for ( var a in b) {
			var d = b[a];
			f.push(d);
			g[d] = a;
			Hovercard.setFetchInProgress(a);
		}
		var c = function() {
			keys(b).each(Hovercard.dirty.bind(Hovercard));
		};
		new AsyncRequest('/ajax/hovercard/multifetch.php').setData( {
			ids : f,
			id_type_map : e
		}).setHandler(function(j) {
			var i = j.getPayload();
			for ( var h in g)
				if (i[h])
					Hovercard.setCache(g[h], HTML(i[h]).getRootNode());
		}).setErrorHandler(c).setTransportErrorHandler(c).send();
	}
};

if (window.Bootloader) {
	Bootloader.done( [ "hipy9" ]);
}