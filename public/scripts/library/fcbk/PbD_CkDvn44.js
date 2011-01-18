/*1292451067,176820662*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "b34IU" ]);
}

function Toggler() {
	this.init();
}
(function() {
	var d = [];
	var b;
	function c() {
		c = bagofholding;
		Event.listen(document.documentElement, 'click', function(event) {
			var e = event.getTarget();
			d.each(function(f) {
				f.active && !f.sticky && !DOM.contains(f.getActive(), e)
						&& f.hide();
			});
		}, Event.Priority.URGENT);
	}
	function a(e) {
		if (e instanceof Toggler)
			return e;
		return Toggler.getInstance();
	}
	Toggler.mixin('Arbiter', {
		init : function() {
			this.active = null;
			this.togglers = {};
			this.setSticky(false);
			d.push(this);
			this.subscribe( [ 'show', 'hide' ], Toggler.inform.bind(Toggler));
			c();
		},
		show : function(f) {
			var e = a(this);
			var g = e.active;
			if (f !== g) {
				g && e.hide();
				e.active = f;
				CSS.addClass(f, 'openToggler');
				DOM.appendContent(f, e.getToggler('next'));
				DOM.prependContent(f, e.getToggler('prev'));
				e.inform('show', e);
			}
		},
		hide : function() {
			var f = a(this);
			var e = f.active;
			if (e) {
				CSS.removeClass(e, 'openToggler');
				values(f.togglers).each(DOM.remove);
				f.inform('hide', f);
				f.active = null;
			}
		},
		toggle : function(f) {
			var e = a(this);
			if (e.active === f) {
				e.hide();
			} else
				e.show(f);
		},
		getActive : function() {
			return a(this).active;
		},
		getToggler : function(f) {
			var e = a(this);
			if (!e.togglers[f])
				e.togglers[f] = $N('button', {
					className : 'hideToggler',
					onfocus : function() {
						var g = DOM.scry(e.active, '[rel="toggle"]')[0];
						g && g.focus();
						e.hide();
					}
				});
			return this.togglers[f];
		},
		setSticky : function(f) {
			var e = a(this);
			f = f !== false;
			if (f !== e.sticky) {
				e.sticky = f;
				if (f) {
					e._pt && Arbiter.unsubscribe(e._pt);
				} else
					e._pt = Arbiter
							.subscribe('page_transition', e.hide.bind(e));
			}
			return e;
		}
	});
	copy_properties(Toggler, Toggler.prototype);
	copy_properties(Toggler, {
		bootstrap : function(e) {
			var f = e.parentNode;
			Toggler.getInstance(f).toggle(f);
		},
		createInstance : function(f) {
			var e = new Toggler().setSticky(true);
			DataStore.set(f, 'toggler', e);
			return e;
		},
		getInstance : function(f) {
			while (f) {
				var e = DataStore.get(f, 'toggler');
				if (e)
					return e;
				f = f.parentNode;
			}
			return (b = b || new Toggler());
		},
		listen : function(g, f, e) {
			return Toggler.subscribe($A(g), function(i, h) {
				if (h.getActive() === f)
					return e(i, h);
			});
		},
		subscribe : (function(e) {
			return function(g, f) {
				g = $A(g);
				if (g.contains('show'))
					d.each(function(h) {
						if (h.getActive())
							f.curry('show', h).defer();
					});
				return e(g, f);
			};
		})(Toggler.subscribe.bind(Toggler))
	});
})();

if (window.Bootloader) {
	Bootloader.done( [ "b34IU" ]);
}