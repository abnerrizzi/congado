/*1294696939,169776068*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "Wwxh3" ]);
}

function ads_refresh(k, g, f, h, l, j) {
	if (window.ads_refreshing)
		return;
	if (l === undefined)
		l = 0;
	if (j === undefined)
		j = 0;
	var i = [ 'sidebar_ads', 'home_sponsor_nile', 'ego' ];
	var e = [];
	for ( var d = 0; d < i.length; d++)
		if (ge(i[d])
				|| (i[d] == 'ego' && DOM.scry($('content'), 'div.ego_column').length > 0))
			e.push(i[d]);
	if (e.length == 0)
		return;
	var c = {
		page : g,
		queryId : j,
		tab : k,
		timestamp : (+new Date()),
		locations : e,
		photo_refresh : (h ? 'yes' : 'no'),
		cache : l
	};
	if (e.indexOf('ego') >= 0)
		c.page_url = URI.getRequestURI().toString();
	var b = function(r) {
		window.ads_refreshing = false;
		var m = r.getPayload();
		for ( var q in m) {
			if (q == 'ego') {
				var n = DOM.scry($('content'), 'div.ego_column');
				if (n.length > 0) {
					DOM.replace(n[0], HTML(m[q]));
					for ( var p = 1; p < n.length; ++p)
						DOM.empty(n[p]);
				}
				continue;
			}
			var o = ge(q);
			if (o && m[q].length > 0)
				if (ua.ie() < 7) {
					o.outerHTML = m[q];
				} else
					DOM.replace(o, HTML(m[q]));
		}
		if (f)
			f(r);
	};
	var a = function(m) {
		window.ads_refreshing = false;
	};
	new AsyncRequest().setURI('/ajax/location_refresh.php').setData(c)
			.setOption('bundle', true).setHandler(b).setErrorHandler(a).send();
	window.ads_refreshing = true;
}
var XD = {
	_callbacks : [],
	_opts : {
		autoResize : false,
		allowShrink : true,
		channelUrl : null,
		hideOverflow : false,
		newResizeMethod : false,
		resizeTimeout : 100,
		resizeWidth : false,
		expectResizeAck : false
	},
	init : function(a) {
		this._opts = copy_properties(copy_properties( {}, this._opts), a);
		if (this._opts.autoResize)
			this._startResizeMonitor();
		Arbiter.subscribe('Connect.Unsafe.resize.ack', function() {
			this._opts.gotResizeAck = true;
		}.bind(this), Arbiter.BEHAVIOUR_PERSISTANT);
	},
	send : function(b, a) {
		a = a || this._opts.channelUrl;
		if (!a)
			return;
		if (a.substr(0, 4) != 'http')
			return;
		var h = a + '&' + URI.implodeQuery(b), d = 'f' + (Math.random() * (1 << 30))
				.toString(16).replace('.', ''), c = document.body
				.appendChild(document.createElement('div')), g = false;
		c.style.position = 'absolute';
		c.style.top = '-10000px';
		c.style.width = '1px';
		c.style.height = '1px';
		XD._callbacks[d] = function() {
			if (g) {
				(function() {
					c.parentNode.removeChild(c);
				}).defer(3000);
				delete XD._callbacks[d];
			}
		};
		if (ua.ie()) {
			var e = ('<iframe ' + ' src="' + h + '"'
					+ ' onload="XD._callbacks.' + d + '()"' + '></iframe>');
			c.innerHTML = '<iframe src="javascript:false"></iframe>';
			g = true;
			(function() {
				c.innerHTML = e;
			}).defer();
		} else {
			var f = document.createElement('iframe');
			f.onload = XD._callbacks[d];
			c.appendChild(f);
			g = true;
			f.src = h;
		}
	},
	_computeSize : function() {
		var a = document.body, e = document.documentElement, h = 0, f;
		if (this._opts.newResizeMethod) {
			f = Math.max(
					Math.max(a.offsetHeight, a.scrollHeight) + a.offsetTop,
					Math.max(e.offsetHeight, e.scrollHeight) + e.offsetTop);
		} else {
			if (ua.ie()) {
				f = Math.max(a.offsetHeight, a.scrollHeight) + a.offsetTop;
			} else
				f = e.offsetHeight + e.offsetTop;
			if (window.Dialog)
				f = Math.max(f, Dialog.max_bottom);
		}
		if (this._opts.resizeWidth) {
			if (a.offsetWidth < a.scrollWidth) {
				h = a.scrollWidth + a.offsetLeft;
			} else {
				var d = a.childNodes;
				for ( var g = 0; g < d.length; g++) {
					var b = d[g];
					var c = b.offsetWidth + b.offsetLeft;
					if (c > h)
						h = c;
				}
			}
			if (XD.forced_min_width)
				h = Math.max(h, XD.forced_min_width);
			if (e.clientLeft > 0)
				h += (e.clientLeft * 2);
			if (e.clientTop > 0)
				f += (e.clientTop * 2);
		}
		return {
			width : h,
			height : f
		};
	},
	_startResizeMonitor : function() {
		var b, a = document.documentElement;
		if (this._opts.hideOverflow)
			a.style.overflow = 'hidden';
		(function() {
			var e = this._computeSize();
			if (!b || (this._opts.expectResizeAck && !this._opts.gotResizeAck)
					|| (this._opts.allowShrink && b.width != e.width)
					|| (!this._opts.allowShrink && b.width < e.width)
					|| (this._opts.allowShrink && b.height != e.height)
					|| (!this._opts.allowShrink && b.height < e.height)) {
				b = e;
				var d = {
					type : 'resize',
					height : e.height
				};
				if (e.width && e.width != 0)
					d.width = e.width;
				try {
					if (URI(document.referrer).isFacebookURI()
							&& window.parent != window && window.name
							&& window.parent.location
							&& URI(window.parent.location).isFacebookURI()) {
						var iframes = window.parent.document
								.getElementsByTagName('iframe');
						for ( var i in iframes)
							if (iframes[i].name == window.name) {
								if (this._opts.resizeWidth)
									iframes[i].style.width = d.width + 'px';
								iframes[i].style.height = d.height + 'px';
							}
					}
					this.send(d);
				} catch (c) {
					this.send(d);
				}
			}
		}).bind(this).recur(this._opts.resizeTimeout);
	}
};
var UnverifiedXD = copy_properties( {}, XD);
function adjustImage(e, g) {
	if (!g) {
		var a = e.parentNode;
		while (a.parentNode
				&& (CSS.getStyle(a, 'display') != 'block' || a.offsetWidth == 0))
			a = a.parentNode;
		g = a.offsetWidth;
	}
	var c = e.offsetWidth;
	if (c == 0) {
		var d = e.nextSibling, f = e.parentNode;
		document.body.appendChild(e);
		c = e.offsetWidth;
		if (d) {
			f.insertBefore(e, d);
		} else
			f.appendChild(e);
	}
	if (c > g)
		try {
			if (ua.ie() < 8) {
				var img_div = document.createElement('div');
				img_div.style.filter = 'progid:DXImageTransform.Microsoft.AlphaImageLoader(src="' + e.src
						.replace('"', '%22') + '", sizingMethod="scale")';
				img_div.style.width = g + 'px';
				img_div.style.height = Math
						.floor(((g / e.offsetWidth) * e.offsetHeight)) + 'px';
				if (e.parentNode.tagName == 'A')
					img_div.style.cursor = 'pointer';
				e.parentNode.insertBefore(img_div, e);
				e.parentNode.removeChild(e);
			} else
				throw 1;
		} catch (b) {
			e.style.width = g + 'px';
		}
	CSS.removeClass(e, 'img_loading');
}
function imageConstrainSize(e, b, c, d) {
	var a = new Image();
	a.onload = function() {
		if (a.width > 0 && a.height > 0) {
			var k = a.width;
			var h = a.height;
			if (k > b || h > c) {
				var g = c / b;
				var f = h / k;
				if (f > g) {
					k = k * (c / h);
					h = c;
				} else {
					h = h * (b / k);
					k = b;
				}
			}
			var j = ge(d);
			if (j) {
				var i = document.createElement('img');
				i.src = e;
				i.width = k;
				i.height = h;
				j.parentNode.insertBefore(i, j);
				j.parentNode.removeChild(j);
			}
		}
	};
	a.src = e;
}
function image_has_loaded(a) {
	if (a.naturalWidth !== undefined) {
		return a.complete && a.width != 0;
	} else if (a.height == 20 && a.width == 20 && a.complete) {
		return false;
	} else if (a.complete === undefined && ua.safari() < 500) {
		var b = new Image();
		b.src = a.src;
		return b.complete;
	}
	return a.complete;
}
function image_has_failed(a) {
	if ((a.complete == null && a.width == 20 && a.height == 20)
			|| (a.mimeType != null && a.complete && a.mimeType == '')
			|| (a.naturalHeight != null && a.complete && a.naturalHeight == 0))
		return true;
}
var Base64 = (function() {
	var c = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
	function d(e) {
		e = (e.charCodeAt(0) << 16) | (e.charCodeAt(1) << 8) | e.charCodeAt(2);
		return String.fromCharCode(c.charCodeAt(e >>> 18), c
				.charCodeAt((e >>> 12) & 63), c.charCodeAt((e >>> 6) & 63), c
				.charCodeAt(e & 63));
	}
	var a = '>___?456789:;<=_______' + '\0\1\2\3\4\5\6\7\b\t\n\13\f\r\16\17\20\21\22\23\24\25\26\27\30\31' + '______\32\33\34\35\36\37 !"#$%&\'()*+,-./0123';
	function b(e) {
		e = (a.charCodeAt(e.charCodeAt(0) - 43) << 18)
				| (a.charCodeAt(e.charCodeAt(1) - 43) << 12)
				| (a.charCodeAt(e.charCodeAt(2) - 43) << 6)
				| a.charCodeAt(e.charCodeAt(3) - 43);
		return String.fromCharCode(e >>> 16, (e >>> 8) & 255, e & 255);
	}
	return {
		encode : function(f) {
			f = unescape(encodeURI(f));
			var e = (f.length + 2) % 3;
			f = (f + '\0\0'.slice(e)).replace(/[\s\S]{3}/g, d);
			return f.slice(0, f.length + e - 2) + '=='.slice(e);
		},
		decode : function(g) {
			g = g.replace(/[^A-Za-z0-9+\/]/g, '');
			var f = (g.length + 3) & 3, e;
			g = (g + 'AAA'.slice(f)).replace(/..../g, b);
			g = g.slice(0, g.length + f - 3);
			try {
				return decodeURIComponent(escape(g));
			} catch (e) {
				throw new Error('Not valid UTF-8');
			}
		},
		encodeObject : function(e) {
			return Base64.encode(JSON.encode(e));
		},
		decodeObject : function(e) {
			return JSON.decode(Base64.decode(e));
		},
		encodeNums : function(e) {
			return String.fromCharCode.apply(String, e.map(function(f) {
				return c.charCodeAt((f | -(f > 63)) & -(f > 0) & 63);
			}));
		}
	};
})();
function ContextualDialog(b) {
	var a = new Dialog();
	copy_properties(a, ContextualDialog.prototype);
	a._setFromModel(b);
	return a;
}
ContextualDialog.prototype = {
	setContext : function(a) {
		this._context = a;
		this._dirty();
		return this;
	},
	_buildDialogContent : function() {
		Bootloader.loadComponents('contextual-dialog-css', function() {
			CSS.addClass(this._obj, 'contextual_dialog');
			this._content = this._frame = $N('div', {
				className : 'contextual_dialog_content'
			});
			this._arrow = $N('div', {
				className : 'arrow'
			});
			DOM.setContent(this._popup, [ this._content, this._arrow ]);
		}.bind(this));
	},
	_resetDialogObj : function() {
		if (!this._context)
			return;
		var a = Vector2.getElementPosition(this._context);
		var c = this._context.offsetWidth, b = this._context.offsetHeight;
		var d = a.x, e = a.y + b;
		if (c < 64)
			d += c / 2 - 32;
		new Vector2(d, e, 'document').setElementPosition(this._popup);
	},
	_renderDialog : function(a) {
		if (window != top)
			this._auto_focus = false;
		Dialog.prototype._renderDialog.call(this, a);
	}
};
WidgetArbiter = {
	_findSiblings : function() {
		if (WidgetArbiter._siblings)
			return;
		WidgetArbiter._siblings = [];
		for ( var b = parent.frames.length - 1; b >= 0; b--)
			try {
				if (parent.frames[b] && parent.frames[b].Arbiter
						&& parent.frames[b].Arbiter.inform)
					WidgetArbiter._siblings.push(parent.frames[b].Arbiter);
			} catch (a) {
			}
	},
	inform : function() {
		WidgetArbiter._findSiblings();
		var a = $A(arguments);
		WidgetArbiter._siblings.each(function(b) {
			b.inform.apply(b, a);
		});
	}
};

if (window.Bootloader) {
	Bootloader.done( [ "Wwxh3" ]);
}