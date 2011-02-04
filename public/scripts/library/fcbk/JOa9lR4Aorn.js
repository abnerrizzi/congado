/*1294957406,176833977*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "\/nipc" ]);
}

function object(b) {
	var a = new Function();
	a.prototype = b;
	return new a();
}
function is_scalar(a) {
	return /string|number|boolean/.test(typeof a);
}
function keys(c) {
	if (hasArrayNature(c))
		throw new TypeError('keys() was passed an array.');
	var b = [];
	for ( var a in c)
		b.push(a);
	return b;
}
function values(b) {
	if (hasArrayNature(b))
		throw new TypeError('values() was passed an array; use $A().');
	var c = [];
	for ( var a in b)
		c.push(b[a]);
	return c;
}
function count(c) {
	if (hasArrayNature(c))
		throw new TypeError('count() was passed an array.');
	var a = 0;
	for ( var b in c)
		a++;
	return a;
}
function are_equal(a, b) {
	return JSON.encode(a) == JSON.encode(b);
}
function merge() {
	var b = {};
	for ( var a = 0; a < arguments.length; a++)
		copy_properties(b, arguments[a]);
	return b;
}
function head(b) {
	for ( var a in b)
		return b[a];
	return null;
}
Object.from = function(c, e) {
	if (!hasArrayNature(c))
		throw new TypeError('Must pass an array of keys.');
	var d = {};
	var b = hasArrayNature(e);
	if (typeof e == 'undefined')
		e = true;
	for ( var a = c.length; a--;)
		d[c[a]] = b ? e[a] : e;
	return d;
};
function coalesce() {
	for ( var a = 0; a < arguments.length; ++a)
		if (arguments[a] != null)
			return arguments[a];
	return null;
}
!function() {
	function a(b) {
		return function() {
			if (this === window)
				throw new TypeError();
			return b.apply(this, arguments);
		};
	}
	copy_properties(Array.prototype, {
		map : function(c, b) {
			if (this === window || typeof c != 'function')
				throw new TypeError();
			var d;
			var e = this.length;
			var f = new Array(e);
			for (d = 0; d < e; ++d)
				if (d in this)
					f[d] = c.call(b, this[d], d, this);
			return f;
		},
		forEach : function(c, b) {
			this.map(c, b);
			return this;
		},
		filter : function(c, b) {
			c = c || function(h) {
				return h;
			};
			if (this === window || typeof c != 'function')
				throw new TypeError();
			var d, g, e = this.length, f = [];
			for (d = 0; d < e; ++d)
				if (d in this) {
					g = this[d];
					if (c.call(b, g, d, this))
						f.push(g);
				}
			return f;
		},
		every : function(d, c) {
			var b = this.filter(function() {
				return 1;
			});
			return (this.filter(d, c).length == b.length);
		},
		some : function(c, b) {
			return (this.filter(c, b).length > 0);
		},
		reduce : null,
		reduceRight : null,
		sort : a(Array.prototype.sort),
		reverse : a(Array.prototype.reverse),
		concat : a(Array.prototype.concat),
		slice : a(Array.prototype.slice),
		indexOf : a(Array.prototype.indexOf || function(d, b) {
			var c = this.length;
			b |= 0;
			if (b < 0)
				b += c;
			for (; b < c; b++)
				if (b in this && this[b] === d)
					return b;
			return -1;
		}),
		contains : function(b) {
			return this.indexOf(b) != -1;
		},
		remove : function(c) {
			var b = this.indexOf(c);
			if (b != -1)
				this.splice(b, 1);
		}
	});
	Array.prototype.each = Array.prototype.forEach;
	Array.prototype.clone = Array.prototype.slice;
}();
function muffinize(d) {
	var c = 'a';
	var b = 'd';
	var a = [ c, b ].join('');
	return d.replace(/muffin/g, a);
}
window.Util = window.Util || {
	warn : bagofholding,
	error : bagofholding,
	info : bagofholding,
	log : bagofholding,
	stack : bagofholding
};
if (typeof console == 'undefined')
	console = {
		log : bagofholding
	};
window.onloadRegister = function(a) {
	window.loaded ? _runHook(a) : _addHook('onloadhooks', a);
};
function onafterloadRegister(a) {
	window.afterloaded ? setTimeout(function() {
		_runHook(a);
	}, 0) : _addHook('onafterloadhooks', a);
}
function _onloadHook() {
	!window.loaded && window.CavalryLogger
			&& CavalryLogger.getInstance().setTimeStamp('t_prehooks');
	_runHooks('onloadhooks');
	!window.loaded && window.CavalryLogger
			&& CavalryLogger.getInstance().setTimeStamp('t_hooks');
	window.loaded = true;
	Arbiter.inform('uipage_onload', true, Arbiter.BEHAVIOR_STATE);
}
function _onafterloadHook() {
	_runHooks('onafterloadhooks');
	window.afterloaded = true;
}
function _runHook(b) {
	try {
		b();
	} catch (a) {
	}
}
function _runHooks(c) {
	var e = c == 'onbeforeleavehooks' || c == 'onbeforeunloadhooks';
	var f = null;
	do {
		var b = window[c];
		if (!e)
			window[c] = null;
		if (!b)
			break;
		for ( var d = 0; d < b.length; d++)
			try {
				if (e) {
					f = f || b[d]();
				} else
					b[d]();
			} catch (a) {
			}
		if (e)
			break;
	} while (window[c]);
	if (e && f)
		return f;
}
function keep_window_set_as_loaded() {
	if (window.loaded == false) {
		window.loaded = true;
		_runHooks('onloadhooks');
	}
	if (window.afterloaded == false) {
		window.afterloaded = true;
		_runHooks('onafterloadhooks');
	}
}
Arbiter.registerCallback(_onloadHook, [ OnloadEvent.ONLOAD_DOMCONTENT_CALLBACK,
		InitialJSLoader.INITIAL_JS_READY ]);
Arbiter.registerCallback(_onafterloadHook, [
		OnloadEvent.ONLOAD_DOMCONTENT_CALLBACK, OnloadEvent.ONLOAD_CALLBACK,
		InitialJSLoader.INITIAL_JS_READY ]);
Arbiter.subscribe(OnloadEvent.ONBEFOREUNLOAD, function(b, a) {
	a.warn = _runHooks('onbeforeleavehooks')
			|| _runHooks('onbeforeunloadhooks');
	if (!a.warn) {
		window.loaded = false;
		window.afterloaded = false;
	}
}, Arbiter.SUBSCRIBE_NEW);
Arbiter.subscribe(OnloadEvent.ONUNLOAD, function(b, a) {
	_runHooks('onunloadhooks');
}, Arbiter.SUBSCRIBE_NEW);
function chain(d, e) {
	var b, a = [];
	for ( var c = 0; c < arguments.length; c++)
		a.push(arguments[c]);
	b = function(event) {
		event = event || window.event;
		for ( var f = 0; f < a.length; f++)
			if (a[f] && a[f].apply(this, arguments) === false) {
				return false;
			} else if (event && event.cancelBubble)
				return true;
		return true;
	};
	b.toString = function() {
		return chain._toString(a);
	};
	return b;
}
if (!chain._toString)
	chain._toString = function(b) {
		var d = 'chained fns', a = b.filter();
		for ( var c = 0; c < b.length; c++)
			d += '\n' + b[c].toString();
		return d;
	};
void (0);
function AsyncSignal(b, a) {
	this.data = a || {};
	if (window.Env && Env.tracking_domain && b.charAt(0) == '/')
		b = Env.tracking_domain + b;
	this.uri = b;
	this.handler = null;
}
AsyncSignal.prototype.setHandler = function(a) {
	this.handler = a;
	return this;
};
AsyncSignal.prototype.send = function() {
	var c = this.handler, b = this.data, g = this.uri, f = [], d = new Image(), a = document
			.getElementById('post_form_id');
	b.asyncSignal = Math.floor(Math.random() * 10000) + 1;
	if (a)
		b.post_form_id = a.value;
	for ( var e in b)
		f.push(encodeURIComponent(e) + '=' + encodeURIComponent(b[e]));
	if (g.indexOf('?') == -1)
		g += '?';
	g += f.join('&');
	if (c)
		d.onload = d.onerror = (function(i, h) {
			return function() {
				h((i.height == 1));
			};
		})(d, c);
	d.src = g;
	return this;
};
function setCookie(a, b, d, e) {
	if (d) {
		var f = new Date();
		var c = new Date();
		c.setTime(f.getTime() + d);
	}
	document.cookie = a + "=" + encodeURIComponent(b) + "; "
			+ (d ? "expires=" + c.toGMTString() + "; " : "") + "path="
			+ (e || '/') + "; domain="
			+ window.location.hostname.replace(/^.*(\.facebook\..*)$/i, '$1');
}
function clearCookie(a) {
	document.cookie = a + "=; expires=Sat, 01 Jan 2000 00:00:00 GMT; "
			+ "path=/; domain="
			+ window.location.hostname.replace(/^.*(\.facebook\..*)$/i, '$1');
}
function getCookie(d) {
	var e = d + "=";
	var b = document.cookie.split(';');
	for ( var c = 0; c < b.length; c++) {
		var a = b[c];
		while (a.charAt(0) == ' ')
			a = a.substring(1, a.length);
		if (a.indexOf(e) == 0)
			return decodeURIComponent(a.substring(e.length, a.length));
	}
	return null;
}
function URI(a) {
	if (a === window)
		return;
	if (this === window)
		return new URI(a || window.location.href);
	this.parse(a || '');
}
copy_properties(
		URI,
		{
			getRequestURI : function(a, b) {
				a = a === undefined || a;
				if (a && window.PageTransitions
						&& PageTransitions.isInitialized()) {
					return PageTransitions.getCurrentURI(!!b).getQualifiedURI();
				} else
					return new URI(window.location.href);
			},
			getMostRecentURI : function() {
				if (window.PageTransitions && PageTransitions.isInitialized()) {
					return PageTransitions.getMostRecentURI().getQualifiedURI();
				} else
					return new URI(window.location.href);
			},
			expression : /(((\w+):\/\/)([^\/:]*)(:(\d+))?)?([^#?]*)(\?([^#]*))?(#(.*))?/,
			arrayQueryExpression : /^(\w+)((?:\[\w*\])+)=?(.*)/,
			explodeQuery : function(g) {
				if (!g)
					return {};
				var h = {};
				g = g.replace(/%5B/ig, '[').replace(/%5D/ig, ']');
				g = g.split('&');
				for ( var b = 0, d = g.length; b < d; b++) {
					var e = g[b].match(URI.arrayQueryExpression);
					if (!e) {
						var j = g[b].split('=');
						h[URI.decodeComponent(j[0])] = j[1] === undefined ? null
								: URI.decodeComponent(j[1]);
					} else {
						var c = e[2].split(/\]\[|\[|\]/).slice(0, -1);
						var f = e[1];
						var k = URI.decodeComponent(e[3] || '');
						c[0] = f;
						var i = h;
						for ( var a = 0; a < c.length - 1; a++)
							if (c[a]) {
								if (i[c[a]] === undefined)
									if (c[a + 1] && !c[a + 1].match(/\d+$/)) {
										i[c[a]] = {};
									} else
										i[c[a]] = [];
								i = i[c[a]];
							} else {
								if (c[a + 1] && !c[a + 1].match(/\d+$/)) {
									i.push( {});
								} else
									i.push( []);
								i = i[i.length - 1];
							}
						if (i instanceof Array && c[c.length - 1] == '') {
							i.push(k);
						} else
							i[c[c.length - 1]] = k;
					}
				}
				return h;
			},
			implodeQuery : function(f, e, a) {
				e = e || '';
				if (a === undefined)
					a = true;
				var g = [];
				if (f === null || f === undefined) {
					g.push(a ? URI.encodeComponent(e) : e);
				} else if (f instanceof Array) {
					for ( var c = 0; c < f.length; ++c)
						try {
							if (f[c] !== undefined)
								g.push(URI.implodeQuery(f[c],
										e ? (e + '[' + c + ']') : c));
						} catch (b) {
						}
				} else if (typeof (f) == 'object') {
					if (DOM.isNode(f)) {
						g.push('{node}');
					} else
						for ( var d in f)
							try {
								if (f[d] !== undefined)
									g.push(URI.implodeQuery(f[d], e ? (e + '['
											+ d + ']') : d));
							} catch (b) {
							}
				} else if (a) {
					g.push(URI.encodeComponent(e) + '='
							+ URI.encodeComponent(f));
				} else
					g.push(e + '=' + f);
				return g.join('&');
			},
			encodeComponent : function(d) {
				var c = String(d).split(/([\[\]])/);
				for ( var a = 0, b = c.length; a < b; a += 2)
					c[a] = window.encodeURIComponent(c[a]);
				return c.join('');
			},
			decodeComponent : function(a) {
				return window.decodeURIComponent(a.replace(/\+/g, ' '));
			}
		});
copy_properties(URI.prototype, {
	parse : function(b) {
		var a = b.toString().match(URI.expression);
		copy_properties(this, {
			protocol : a[3] || '',
			domain : a[4] || '',
			port : a[6] || '',
			path : a[7] || '',
			query_s : a[9] || '',
			fragment : a[11] || ''
		});
		return this;
	},
	setProtocol : function(a) {
		this.protocol = a;
		return this;
	},
	getProtocol : function() {
		return this.protocol;
	},
	setQueryData : function(a) {
		this.query_s = URI.implodeQuery(a);
		return this;
	},
	addQueryData : function(a) {
		return this.setQueryData(copy_properties(this.getQueryData(), a));
	},
	removeQueryData : function(b) {
		if (!(b instanceof Array))
			b = [ b ];
		var d = this.getQueryData();
		for ( var a = 0, c = b.length; a < c; ++a)
			delete d[b[a]];
		return this.setQueryData(d);
	},
	getQueryData : function() {
		return URI.explodeQuery(this.query_s);
	},
	setFragment : function(a) {
		this.fragment = a;
		return this;
	},
	getFragment : function() {
		return this.fragment;
	},
	setDomain : function(a) {
		this.domain = a;
		return this;
	},
	getDomain : function() {
		return this.domain;
	},
	setPort : function(a) {
		this.port = a;
		return this;
	},
	getPort : function() {
		return this.port;
	},
	setPath : function(a) {
		this.path = a;
		return this;
	},
	getPath : function() {
		return this.path.replace(/^\/+/, '/');
	},
	toString : function() {
		var a = '';
		this.protocol && (a += this.protocol + '://');
		this.domain && (a += this.domain);
		this.port && (a += ':' + this.port);
		if (this.domain && !this.path)
			a += '/';
		this.path && (a += this.path);
		this.query_s && (a += '?' + this.query_s);
		this.fragment && (a += '#' + this.fragment);
		return a;
	},
	valueOf : function() {
		return this.toString();
	},
	isFacebookURI : function() {
		if (!URI._facebookURIRegex)
			URI._facebookURIRegex = new RegExp('(^|\.)facebook\.(' + env_get(
					'tlds').join('|') + ')([^.]*)$', 'i');
		return (!this.domain || URI._facebookURIRegex.test(this.domain));
	},
	isQuicklingEnabled : function() {
		return window.Quickling && Quickling.isActive()
				&& Quickling.isPageActive(this);
	},
	getRegisteredDomain : function() {
		if (!this.domain)
			return '';
		if (!this.isFacebookURI())
			return null;
		var b = this.domain.split('.');
		var a = b.indexOf('facebook');
		return b.slice(a).join('.');
	},
	getTld : function(f) {
		if (!this.domain)
			return '';
		var d = this.domain.split('.');
		var e = d[d.length - 1];
		if (f)
			return e;
		var c = env_get('tlds');
		if (c.indexOf(e) == -1)
			for ( var a = 0; a < c.length; ++a) {
				var b = c[a];
				if (new RegExp(b + '$').test(this.domain)) {
					e = b;
					break;
				}
			}
		return e;
	},
	getUnqualifiedURI : function() {
		return new URI(this).setProtocol(null).setDomain(null).setPort(null);
	},
	getQualifiedURI : function() {
		var b = new URI(this);
		if (!b.getDomain()) {
			var a = URI();
			b.setProtocol(a.getProtocol()).setDomain(a.getDomain()).setPort(
					a.getPort());
		}
		return b;
	},
	isSameOrigin : function(a) {
		var b = a || window.location.href;
		if (!(b instanceof URI))
			b = new URI(b.toString());
		if (this.getProtocol() && this.getProtocol() != b.getProtocol())
			return false;
		if (this.getDomain() && this.getDomain() != b.getDomain())
			return false;
		return true;
	},
	go : function(a) {
		goURI(this, a);
	},
	setSubdomain : function(b) {
		var c = new URI(this).getQualifiedURI();
		var a = c.getDomain().split('.');
		if (a.length <= 2) {
			a.unshift(b);
		} else
			a[0] = b;
		return c.setDomain(a.join('.'));
	},
	getSubdomain : function() {
		if (!this.getDomain())
			return '';
		var a = this.getDomain().split('.');
		if (a.length <= 2) {
			return '';
		} else
			return a[0];
	},
	setSecure : function(a) {
		return this.setProtocol(a ? 'https' : 'http');
	},
	isSecure : function() {
		return this.getProtocol() == 'https';
	}
});
function detect_broken_proxy_cache(d, a) {
	var b = getCookie(a);
	if ((b != d) && (b != null) && (d != '0')) {
		var c = {
			c : 'si_detect_broken_proxy_cache',
			m : a + ' ' + d + ' ' + b
		};
		var e = new URI('/common/scribe_endpoint.php').getQualifiedURI()
				.toString();
		new AsyncSignal(e, c).send();
	}
}
var NavigationMessage = {
	NAVIGATION_BEGIN : 'NavigationMessage/navigationBegin',
	NAVIGATION_SELECT : 'NavigationMessage/navigationSelect',
	NAVIGATION_COMPLETED : 'NavigationMessage/navigationCompleted',
	NAVIGATION_FAILED : 'NavigationMessage/navigationFailed',
	NAVIGATION_COUNT_UPDATE : 'NavigationMessage/navigationCount',
	REFRESH_RIGHT_COLUMN : 'NavigationMessage/refreshRightColumn',
	PREFETCH : 'NavigationMessage/prefetch',
	INTERNAL_LOADING_BEGIN : 'NavigationMessage/internalLoadingBegin',
	INTERNAL_LOADING_COMPLETED : 'NavigationMessage/internalLoadingCompleted'
};
DataStore = window.DataStore
		|| {
			_storage : {},
			_elements : {},
			_tokenCounter : 1,
			_NOT_IN_DOM_CONST : 1,
			_getStorage : function(a) {
				var b;
				if (typeof a == 'string') {
					b = 'str_' + a;
				} else {
					b = 'elem_' + (a.__FB_TOKEN || (a.__FB_TOKEN = [ DataStore._tokenCounter++ ]))[0];
					DataStore._elements[b] = a;
				}
				return DataStore._storage[b] || (DataStore._storage[b] = {});
			},
			_shouldDeleteData : function(a) {
				if (!a.nodeName)
					return false;
				try {
					if (null != a.offsetParent)
						return false;
				} catch (b) {
				}
				if (document.documentElement.contains) {
					return !document.documentElement.contains(a);
				} else
					return (document.documentElement.compareDocumentPosition(a) & DataStore._NOT_IN_DOM_CONST);
			},
			set : function(c, b, d) {
				var a = DataStore._getStorage(c);
				a[b] = d;
				return c;
			},
			get : function(e, d, c) {
				var b = DataStore._getStorage(e), f = b[d];
				if (typeof f === 'undefined' && e.getAttribute) {
					var a = e.getAttribute('data-' + d);
					f = (null === a) ? undefined : a;
				}
				if ((c !== undefined) && (f === undefined))
					f = b[d] = c;
				return f;
			},
			remove : function(c, b) {
				var a = DataStore._getStorage(c), d = a[b];
				delete a[b];
				return d;
			},
			cleanup : function() {
				var b, a;
				for (b in DataStore._elements) {
					a = DataStore._elements[b];
					if (DataStore._shouldDeleteData(a)) {
						delete DataStore._storage[b];
						delete DataStore._elements[b];
					}
				}
			}
		};
Event.DATASTORE_KEY = 'Event.listeners';
if (!Event.prototype)
	Event.prototype = {};
function $E(a) {
	a = a || window.event || {};
	if (!a._inherits_from_prototype)
		for ( var c in Event.prototype)
			try {
				a[c] = Event.prototype[c];
			} catch (b) {
			}
	return a;
}
(function() {
	copy_properties(Event.prototype, {
		_inherits_from_prototype : true,
		stop : function() {
			this.cancelBubble = true;
			this.stopPropagation && this.stopPropagation();
			return this;
		},
		prevent : function() {
			this.returnValue = false;
			this.preventDefault && this.preventDefault();
			return this;
		},
		kill : function() {
			this.stop().prevent();
			return false;
		},
		getTarget : function() {
			var g = this.target || this.srcElement;
			return g ? $(g) : null;
		},
		getRelatedTarget : function() {
			var g = this.relatedTarget || this.fromElement;
			return g ? $(g) : null;
		},
		getModifiers : function() {
			var g = {
				control : !!this.ctrlKey,
				shift : !!this.shiftKey,
				alt : !!this.altKey,
				meta : !!this.metaKey
			};
			g.access = ua.osx() ? g.control : g.alt;
			g.any = g.control || g.shift || g.alt || g.meta;
			return g;
		}
	});
	copy_properties(Event, {
		listen : function(h, p, j, m) {
			if (typeof h == 'string')
				h = $(h);
			if (typeof m == 'undefined')
				m = Event.Priority.NORMAL;
			if (typeof p == 'object') {
				var i = {};
				for ( var o in p)
					i[o] = Event.listen(h, o, p[o], m);
				return i;
			}
			if (p.match(/^on/i))
				throw new TypeError("Bad event name `" + event
						+ "': use `click', not `onclick'.");
			p = p.toLowerCase();
			var k = DataStore.get(h, b, {});
			if (f[p]) {
				var g = f[p];
				p = g.base;
				j = g.wrap(j);
			}
			a(h, p);
			var q = k[p];
			if (!(m in q))
				q[m] = [];
			var l = q[m].length, n = new EventHandlerRef(j, q[m], l);
			q[m].push(n);
			return n;
		},
		stop : function(g) {
			return $E(g).stop();
		},
		prevent : function(g) {
			return $E(g).prevent();
		},
		kill : function(g) {
			return $E(g).kill();
		},
		getKeyCode : function(event) {
			event = $E(event);
			if (!event)
				return false;
			switch (event.keyCode) {
			case 63232:
				return 38;
			case 63233:
				return 40;
			case 63234:
				return 37;
			case 63235:
				return 39;
			case 63272:
			case 63273:
			case 63275:
				return null;
			case 63276:
				return 33;
			case 63277:
				return 34;
			}
			if (event.shiftKey)
				switch (event.keyCode) {
				case 33:
				case 34:
				case 37:
				case 38:
				case 39:
				case 40:
					return null;
				}
			return event.keyCode;
		},
		getPriorities : function() {
			if (!e) {
				var g = values(Event.Priority);
				g.sort(function(h, i) {
					return h - i;
				});
				e = g;
			}
			return e;
		},
		__fire : function(g, i, event) {
			var h = Event.__getHandler(g, i);
			if (h)
				return h($E(event));
		},
		__getHandler : function(g, h) {
			return DataStore.get(g, Event.DATASTORE_KEY + h);
		}
	});
	var e = null, b = Event.DATASTORE_KEY;
	var c = function(g) {
		return function(h) {
			if (!DOM.contains(this, h.getRelatedTarget()))
				return g.call(this, h);
		};
	};
	var f = {
		mouseenter : {
			base : 'mouseover',
			wrap : c
		},
		mouseleave : {
			base : 'mouseout',
			wrap : c
		}
	};
	var a = function(g, l) {
		var h = 'on' + l;
		var k = d.bind(g);
		var j = DataStore.get(g, b);
		if (l in j)
			return;
		j[l] = {};
		if (g.addEventListener) {
			g.addEventListener(l, k, false);
		} else if (g.attachEvent)
			g.attachEvent(h, k);
		DataStore.set(g, b + l, k);
		if (g[h]) {
			var i = g[h];
			g[h] = null;
			Event.listen(g, l, i, Event.Priority.TRADITIONAL);
		}
		if (g.nodeName === 'FORM' && l === 'submit')
			Event.listen(g, l, Event.__bubbleSubmit.curry(g),
					Event.Priority._BUBBLE);
	};
	var d = function(event) {
		event = $E(event);
		var n = event.type;
		if (!DataStore.get(this, b))
			throw new Error("Bad listenHandler context.");
		var o = DataStore.get(this, b)[n];
		if (!o)
			throw new Error("No registered handlers for `" + n + "'.");
		if (n == 'click') {
			var i = Parent.byTag(event.getTarget(), 'a');
			user_action(i, n, event);
		}
		var k = Event.getPriorities();
		for ( var j = 0; j < k.length; j++) {
			var l = k[j];
			if (l in o) {
				var g = o[l];
				for ( var h = 0; h < g.length; h++) {
					if (!g[h])
						continue;
					var m = g[h].fire(this, event);
					if (m === false) {
						return event.kill();
					} else if (event.cancelBubble)
						return event.stop();
				}
			}
		}
		return event.returnValue;
	};
})();
Event.Priority = {
	URGENT : -20,
	TRADITIONAL : -10,
	NORMAL : 0,
	_BUBBLE : 1000
};
function EventHandlerRef(b, a, c) {
	this._handler = b;
	this._container = a;
	this._index = c;
}
EventHandlerRef.prototype = {
	remove : function() {
		delete this._handler;
		delete this._container[this._index];
	},
	fire : function(a, event) {
		return this._handler.call(a, event);
	}
};
add_properties('Hovercard', {
	active : {},
	init : function() {
		if (ua.ie() < 7)
			return;
		Event.listen(document.documentElement, 'mouseover', this.handle
				.bind(this));
	},
	handle : function(event) {
		var a = Parent.byTag(event.getTarget(), 'a');
		if (this.setActive(a)) {
			(this.process || this.bootload).call(this, a);
			event.stop();
		}
	},
	bootload : function(a) {
		this.bootload = bagofholding;
		Bootloader.loadComponents( [ 'hovercard-core' ], function() {
			if (a == this.active.node)
				this.process(a);
		}.bind(this));
	},
	getEndpoint : function(a) {
		return a.getAttribute('data-hovercard');
	},
	setActive : function(b) {
		var a;
		if (!b || !(a = this.getEndpoint(b))) {
			this.active = {};
			return false;
		}
		if (this.active.node != b) {
			this.active.moveToken && this.active.moveToken.remove();
			this.active = {
				node : b,
				endpoint : a,
				pos : null
			};
		}
		return true;
	}
});
onloadRegister(Hovercard.init.bind(Hovercard));
function HTML(a) {
	if (a && a.__html)
		a = a.__html;
	if (this === window) {
		if (a instanceof HTML)
			return a;
		return new HTML(a);
	}
	this._content = a;
	this._defer = false;
	this._extra_action = '';
	this._nodes = null;
	this._inline_js = bagofholding;
	this._has_option_elements = false;
	return this;
}
HTML.isHTML = function(a) {
	return a && (a instanceof HTML || a.__html !== undefined);
};
HTML.replaceJSONWrapper = function(a) {
	return a && a.__html !== undefined ? new HTML(a.__html) : a;
};
copy_properties(
		HTML.prototype,
		{
			toString : function() {
				var a = this._content || '';
				if (this._extra_action)
					a += '<script type="text/javascript">' + this._extra_action + '</scr' + 'ipt>';
				return a;
			},
			setAction : function(a) {
				this._extra_action = a;
				return this;
			},
			getAction : function() {
				this._fillCache();
				var a = function() {
					this._inline_js();
					eval_global(this._extra_action);
				}.bind(this);
				if (this.getDeferred()) {
					return a.defer.bind(a);
				} else
					return a;
			},
			setDeferred : function(a) {
				this._defer = !!a;
				return this;
			},
			getDeferred : function() {
				return this._defer;
			},
			getContent : function() {
				return this._content;
			},
			getNodes : function() {
				this._fillCache();
				return this._nodes;
			},
			getRootNode : function() {
				return this.getNodes()[0];
			},
			hasOptionElements : function() {
				this._fillCache();
				return this._has_option_elements;
			},
			_fillCache : function() {
				if (null !== this._nodes)
					return;
				var d = this._content;
				if (!d) {
					this._nodes = [];
					return;
				}
				d = d
						.replace(
								/(<(\w+)[^>]*?)\/>/g,
								function(l, m, n) {
									return n
											.match(/^(abbr|br|col|img|input|link|meta|param|hr|area|embed)$/i) ? l
											: m + '></' + n + '>';
								});
				var h = d.trim().toLowerCase(), k = document
						.createElement('div'), b = false;
				var j = (!h.indexOf('<opt') && [ 1,
						'<select multiple="multiple" class="__WRAPPER">',
						'</select>' ])
						|| (!h.indexOf('<leg') && [ 1,
								'<fieldset class="__WRAPPER">', '</fieldset>' ])
						|| (h.match(/^<(thead|tbody|tfoot|colg|cap)/) && [ 1,
								'<table class="__WRAPPER">', '</table>' ])
						|| (!h.indexOf('<tr') && [ 2,
								'<table><tbody class="__WRAPPER">',
								'</tbody></table>' ])
						|| ((!h.indexOf('<td') || !h.indexOf('<th')) && [ 3,
								'<table><tbody><tr class="__WRAPPER">',
								'</tr></tbody></table>' ])
						|| (!h.indexOf('<col') && [
								2,
								'<table><tbody></tbody><colgroup class="__WRAPPER">',
								'</colgroup></table>' ]) || null;
				if (null === j) {
					k.className = '__WRAPPER';
					if (ua.ie()) {
						j = [ 0, '<span style="display:none">&nbsp;</span>', '' ];
						b = true;
					} else
						j = [ 0, '', '' ];
				}
				k.innerHTML = j[1] + d + j[2];
				while (j[0]--)
					k = k.lastChild;
				if (b)
					k.removeChild(k.firstChild);
				k.className != '__WRAPPER';
				if (0 != k.getElementsByTagName('option').length)
					this._has_option_elements = true;
				if (ua.ie()) {
					var i;
					if (!h.indexOf('<table') && -1 == h.indexOf('<tbody')) {
						i = k.firstChild && k.firstChild.childNodes;
					} else if (j[1] == '<table>' && -1 == h.indexOf('<tbody')) {
						i = k.childNodes;
					} else
						i = [];
					for ( var f = i.length - 1; f >= 0; --f)
						if (i[f].nodeName
								&& i[f].nodeName.toLowerCase() == 'tbody'
								&& i[f].childNodes.length == 0)
							i[f].parentNode.removeChild(i[f]);
				}
				var g = k.getElementsByTagName('script');
				var a = [];
				for ( var e = 0; e < g.length; e++)
					if (g[e].src) {
						a.push(Bootloader.requestResource.bind(Bootloader,
								'js', g[e].src));
					} else
						a.push(eval_global.bind(null, g[e].innerHTML));
				for ( var e = g.length - 1; e >= 0; e--)
					g[e].parentNode.removeChild(g[e]);
				var c = function() {
					for ( var l = 0; l < a.length; l++)
						a[l]();
				};
				this._nodes = $A(k.childNodes);
				this._inline_js = c;
			}
		});
var DOM = {
	find : function(a, c) {
		var b = DOM.scry(a, c);
		return b[0];
	},
	scry : function(j, v) {
		if (!j)
			return [];
		var w = v.split(' ');
		var d = [ j ];
		var i = j === document;
		for ( var m = 0; m < w.length; m++) {
			if (d.length == 0)
				break;
			if (w[m] == '')
				continue;
			var u = w[m];
			var s = [];
			var zd = false;
			if (u.charAt(0) == '^')
				if (m == 0) {
					zd = true;
					u = u.slice(1);
				} else
					return;
			u = u.replace(/\./g, ' .');
			u = u.replace(/\#/g, ' #');
			u = u.replace(/\[/g, ' [');
			var z = u.split(' ');
			var za = z[0] || '*';
			var n = z[1] && z[1].charAt(0) == '#';
			if (n) {
				var h = ge(z[1].slice(1), true);
				if (h && ('*' == za || h.tagName.toLowerCase() == za))
					for ( var q = 0; q < d.length; q++)
						if (zd && DOM.contains(h, d[q])) {
							s = [ h ];
							break;
						} else if (document == d[q] || DOM.contains(d[q], h)) {
							s = [ h ];
							break;
						}
			} else {
				var zc = [];
				var c = d.length;
				for ( var o = 0; o < c; o++) {
					if (zd) {
						var k = [];
						var g = d[o].parentNode;
						var a = za == '*';
						while (DOM.isNode(g, DOM.NODE_TYPES.ELEMENT)) {
							if (a || g.tagName.toLowerCase() == za)
								k.push(g);
							g = g.parentNode;
						}
					} else
						var k = d[o].getElementsByTagName(za);
					var l = k.length;
					for ( var r = 0; r < l; r++)
						zc.push(k[r]);
				}
				for ( var x = 1; x < z.length; x++) {
					var y = z[x];
					var p = y.charAt(0) == '.';
					var e = y.substring(1);
					for ( var o = 0; o < zc.length; o++) {
						var zb = zc[o];
						if (!zb)
							continue;
						if (p) {
							if (!CSS.hasClass(zb, e))
								delete zc[o];
							continue;
						} else {
							var f = y.slice(1, y.length - 1);
							if (f.indexOf('=') == -1) {
								if (zb.getAttribute(f) === null) {
									delete zc[o];
									continue;
								}
							} else {
								var t = f.split('=');
								var b = t[0];
								var ze = t[1];
								ze = ze.slice(1, ze.length - 1);
								if (zb.getAttribute(b) != ze) {
									delete zc[o];
									continue;
								}
							}
						}
					}
				}
				for ( var o = 0; o < zc.length; o++)
					if (zc[o]) {
						s.push(zc[o]);
						if (zd)
							break;
					}
			}
			d = s;
		}
		return d;
	},
	getText : (function() {
		var a = document.createElement('div'), b = a.innerText == null ? 'textContent'
				: 'innerText';
		return function(c) {
			if (!c) {
				return '';
			} else if (DOM.isNode(c, DOM.NODE_TYPES.TEXT)) {
				return c.data;
			} else
				return c[b];
		};
	})(),
	getSelection : function() {
		var b = window.getSelection, a = document.selection;
		if (b) {
			return b() + '';
		} else if (a)
			return a.createRange().text;
		return null;
	},
	create : function(c, a, b) {
		c = document.createElement(c);
		if (a) {
			a = copy_properties( {}, a);
			if (a.style) {
				copy_properties(c.style, a.style);
				delete a.style;
			}
			for ( var d in a)
				if (d.toLowerCase().indexOf('on') == 0) {
					if (!(typeof a[d] != 'function'))
						if (window.Event && Event.listen) {
							Event.listen(c, d.substr(2), a[d]);
						} else
							c[d] = a[d];
					delete a[d];
				}
			copy_properties(c, a);
		}
		if (b != undefined)
			DOM.setContent(c, b);
		return c;
	},
	prependContent : function(c, b) {
		if (!DOM.isNode(c))
			throw new Error(
					'DOM.prependContent: reference element is not a node');
		var a = function(d) {
			if (c.firstChild) {
				c.insertBefore(d, c.firstChild);
			} else
				c.appendChild(d);
		};
		return DOM._addContent(b, a, c);
	},
	insertAfter : function(c, b) {
		if (!DOM.isNode(c) || !c.parentNode)
			throw new Error('DOM.insertAfter: reference element is not a node');
		var a = function(d) {
			if (c.nextSibling) {
				c.parentNode.insertBefore(d, c.nextSibling);
			} else
				c.parentNode.appendChild(d);
		};
		return DOM._addContent(b, a, c.parentNode);
	},
	insertBefore : function(b, c) {
		if (!DOM.isNode(c) || !c.parentNode)
			throw new Error(
					'DOM.insertBefore: reference element is not a node or ' + 'does not have a parent.');
		var a = function(d) {
			c.parentNode.insertBefore(d, c);
		};
		return DOM._addContent(b, a, c.parentNode);
	},
	setContent : function(b, a) {
		if (!DOM.isNode(b))
			throw new Error('DOM.setContent: reference element is not a node');
		DOM.empty(b);
		return DOM.appendContent(b, a);
	},
	appendContent : function(c, b) {
		if (!DOM.isNode(c))
			throw new Error(
					'DOM.appendContent: reference element is not a node');
		var a = function(d) {
			c.appendChild(d);
		};
		return DOM._addContent(b, a, c);
	},
	replace : function(c, b) {
		if (!DOM.isNode(c) || !c.parentNode)
			throw new Error(
					'DOM.replace: reference element must be a node with a' + ' parent');
		var a = function(d) {
			c.parentNode.replaceChild(d, c);
		};
		return DOM._addContent(b, a, c.parentNode);
	},
	remove : function(a) {
		a = $(a);
		if (a.parentNode)
			a.parentNode.removeChild(a);
	},
	empty : function(a) {
		a = $(a);
		while (a.firstChild)
			DOM.remove(a.firstChild);
	},
	contains : function(b, a) {
		b = ge(b);
		a = ge(a);
		if (!b || !a) {
			return false;
		} else if (b === a) {
			return true;
		} else if (DOM.isNode(b, '#text')) {
			return false;
		} else if (DOM.isNode(a, '#text')) {
			return DOM.contains(b, a.parentNode);
		} else if (b.contains) {
			return b.contains(a);
		} else if (b.compareDocumentPosition) {
			return !!(b.compareDocumentPosition(a) & 16);
		} else
			return false;
	},
	getRootElement : function() {
		var a = null;
		if (window.Quickling && Quickling.isActive())
			a = ge('content');
		return a || document.body;
	},
	isNode : function(d, e) {
		if (typeof (Node) == 'undefined')
			Node = null;
		try {
			if (!d || !((Node != undefined && d instanceof Node) || d.nodeName))
				return false;
		} catch (a) {
			return false;
		}
		if (typeof (e) !== 'undefined') {
			e = $A(e).map(function(g) {
				return (g + '').toUpperCase();
			});
			var c, f;
			try {
				c = new String(d.nodeName).toUpperCase();
				f = d.nodeType;
			} catch (a) {
				return false;
			}
			for ( var b = 0; b < e.length; b++)
				try {
					if (c == e[b] || f == e[b])
						return true;
				} catch (a) {
				}
			return false;
		}
		return true;
	},
	NODE_TYPES : {
		ELEMENT : 1,
		ATTRIBUTE : 2,
		TEXT : 3,
		CDATA_SECTION : 4,
		ENTITY_REFERENCE : 5,
		ENTITY : 6,
		PROCESSING_INSTRUCTION : 7,
		COMMENT : 8,
		DOCUMENT : 9,
		DOCUMENT_TYPE : 10,
		DOCUMENT_FRAGMENT : 11,
		NOTATION_NODE : 12
	},
	_addContent : function(d, a, l) {
		d = HTML.replaceJSONWrapper(d);
		if (d instanceof HTML && -1 == d.toString().indexOf('<scr' + 'ipt')
				&& '' == l.innerHTML) {
			var g = ua.ie();
			if (!g
					|| (g > 7 && !DOM.isNode(l, [ 'table', 'tbody', 'thead',
							'tfoot', 'tr', 'select', 'fieldset' ]))) {
				l.innerHTML = d;
				return $A(l.childNodes);
			}
		} else if (DOM.isNode(l, DOM.NODE_TYPES.TEXT)) {
			l.data = d;
			return [ d ];
		}
		var i, e = [], b = [];
		var f = document.createDocumentFragment();
		if (!(d instanceof Array))
			d = [ d ];
		for ( var h = 0; h < d.length; h++) {
			i = HTML.replaceJSONWrapper(d[h]);
			if (i instanceof HTML) {
				b.push(i.getAction());
				var k = i.getNodes(), c;
				for ( var j = 0; j < k.length; j++) {
					c = (ua.safari() || (ua.ie() && i.hasOptionElements())) ? k[j]
							: k[j].cloneNode(true);
					e.push(c);
					f.appendChild(c);
				}
			} else if (is_scalar(i)) {
				var m = document.createTextNode(i);
				e.push(m);
				f.appendChild(m);
			} else if (DOM.isNode(i)) {
				e.push(i);
				f.appendChild(i);
			} else if (!(i instanceof Array))
				i !== null;
		}
		a(f);
		for ( var h = 0; h < b.length; h++)
			b[h]();
		return e;
	}
};
function $N(c, a, b) {
	if (typeof a != 'object' || DOM.isNode(a) || a instanceof Array
			|| HTML.isHTML(a)) {
		b = a;
		a = null;
	}
	return DOM.create(c, a, b);
}
var $$ = function _$$(a) {
	return DOM.scry.apply(null, [ document ].concat($A(arguments)));
};
String.prototype.trim = function() {
	if (this == window)
		return null;
	return this.replace(/^\s*|\s*$/g, '');
};
function trim(b) {
	try {
		return String(b.toString()).trim();
	} catch (a) {
		return '';
	}
}
String.prototype.startsWith = function(a) {
	if (this == window)
		return null;
	return this.substring(0, a.length) == a;
};
String.prototype.endsWith = function(a) {
	if (this == window)
		return null;
	return this.length >= a.length
			&& this.substring(this.length - a.length) == a;
};
String.prototype.split = (function(a) {
	return function(h, e) {
		var b = "";
		if (h === null || e === null) {
			return [];
		} else if (typeof h == 'string') {
			return a.call(this, h, e);
		} else if (h === undefined) {
			return [ this.toString() ];
		} else if (h instanceof RegExp) {
			if (!h._2 || !h._1) {
				b = h.toString().replace(/^[\S\s]+\//, "");
				if (!h._1)
					if (!h.global) {
						h._1 = new RegExp(h.source, "g" + b);
					} else
						h._1 = 1;
			}
			separator1 = h._1 === 1 ? h : h._1;
			var i = (h._2 ? h._2 : h._2 = new RegExp("^" + separator1.source
					+ "$", b));
			if (e === undefined || e < 0) {
				e = false;
			} else {
				e = Math.floor(e);
				if (!e)
					return [];
			}
			var f, g = [], d = 0, c = 0;
			while ((e ? c++ <= e : true) && (f = separator1.exec(this))) {
				if ((f[0].length === 0) && (separator1.lastIndex > f.index))
					separator1.lastIndex--;
				if (separator1.lastIndex > d) {
					if (f.length > 1)
						f[0].replace(i, function() {
							for ( var j = 1; j < arguments.length - 2; j++)
								if (arguments[j] === undefined)
									f[j] = undefined;
						});
					g = g.concat(this.substring(d, f.index),
							(f.index === this.length ? [] : f.slice(1)));
					d = separator1.lastIndex;
				}
				if (f[0].length === 0)
					separator1.lastIndex++;
			}
			return (d === this.length) ? (separator1.test("") ? g : g
					.concat("")) : (e ? g : g.concat(this.substring(d)));
		} else
			return a.call(this, h, e);
	};
})(String.prototype.split);
add_properties('CSS', {
	shown : function(a) {
		return !CSS.hasClass(a, 'hidden_elem');
	},
	toggle : function(a) {
		CSS.conditionShow(a, !CSS.shown(a));
	},
	setClass : function(b, a) {
		$(b).className = a || '';
		return b;
	},
	setStyle : function(a, b, d) {
		switch (b) {
		case 'opacity':
			var c = (d == 1);
			a.style.opacity = c ? '' : '' + d;
			a.style.filter = c ? '' : 'alpha(opacity=' + d * 100 + ')';
			break;
		case 'float':
			a.style.cssFloat = a.style.styleFloat = d;
			break;
		default:
			b = b.replace(/-(.)/g, function(e, f) {
				return f.toUpperCase();
			});
			a.style[b] = d;
		}
		return a;
	},
	getStyle : function(b, d) {
		b = $(b);
		function c(e) {
			return e.replace(/([A-Z])/g, '-$1').toLowerCase();
		}
		if (window.getComputedStyle) {
			var a = window.getComputedStyle(b, null);
			if (a)
				return a.getPropertyValue(c(d));
		}
		if (document.defaultView && document.defaultView.getComputedStyle) {
			var a = document.defaultView.getComputedStyle(b, null);
			if (a)
				return a.getPropertyValue(c(d));
			if (d == "display")
				return "none";
		}
		if (b.currentStyle)
			return b.currentStyle[d];
		return b.style[d];
	},
	getOpacity : function(a) {
		a = $(a);
		var b = CSS.getStyle(a, 'filter');
		var c = null;
		if (b && (c = /(\d+(?:\.\d+)?)/.exec(b))) {
			return parseFloat(c.pop()) / 100;
		} else if (b = CSS.getStyle(a, 'opacity')) {
			return parseFloat(b);
		} else
			return 1;
	}
});
function intl_locale_is_rtl() {
	return ('rtl' == CSS.getStyle(document.body, 'direction'));
}
function Vector2(b, c, a) {
	copy_properties(this, {
		x : parseFloat(b),
		y : parseFloat(c),
		domain : a || 'pure'
	});
}
copy_properties(Vector2.prototype, {
	toString : function() {
		return '(' + this.x + ', ' + this.y + ')';
	},
	add : function(c, d) {
		if (arguments.length == 1) {
			if (c.domain != 'pure')
				c = c.convertTo(this.domain);
			return this.add(c.x, c.y);
		}
		var a = parseFloat(c);
		var b = parseFloat(d);
		return new Vector2(this.x + a, this.y + b, this.domain);
	},
	mul : function(a, b) {
		if (typeof (b) == "undefined")
			b = a;
		return new Vector2(this.x * a, this.y * b, this.domain);
	},
	sub : function(a, b) {
		if (arguments.length == 1) {
			return this.add(a.mul(-1));
		} else
			return this.add(-a, -b);
	},
	distanceTo : function(a) {
		return this.sub(a).magnitude();
	},
	magnitude : function() {
		return Math.sqrt((this.x * this.x) + (this.y * this.y));
	},
	convertTo : function(a) {
		if (a != 'pure' && a != 'viewport' && a != 'document')
			return new Vector2(0, 0);
		if (a == this.domain)
			return new Vector2(this.x, this.y, this.domain);
		if (a == 'pure')
			return new Vector2(this.x, this.y);
		if (this.domain == 'pure')
			return new Vector2(0, 0);
		var b = Vector2.getScrollPosition('document');
		var c = this.x, d = this.y;
		if (this.domain == 'document') {
			c -= b.x;
			d -= b.y;
		} else {
			c += b.x;
			d += b.y;
		}
		return new Vector2(c, d, a);
	},
	setElementPosition : function(a) {
		var b = this.convertTo('document');
		a.style.left = parseInt(b.x) + 'px';
		a.style.top = parseInt(b.y) + 'px';
		return this;
	},
	setElementDimensions : function(a) {
		return this.setElementWidth(a).setElementHeight(a);
	},
	setElementWidth : function(a) {
		a.style.width = parseInt(this.x, 10) + 'px';
		return this;
	},
	setElementHeight : function(a) {
		a.style.height = parseInt(this.y, 10) + 'px';
		return this;
	},
	scrollElementBy : function(a) {
		if (a == document.body) {
			window.scrollBy(this.x, this.y);
		} else {
			a.scrollLeft += this.x;
			a.scrollTop += this.y;
		}
		return this;
	}
});
copy_properties(
		Vector2,
		{
			getEventPosition : function(b, a) {
				a = a || 'document';
				b = $E(b);
				var d = b.pageX
						|| (b.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft));
				var e = b.pageY
						|| (b.clientY + (document.documentElement.scrollTop || document.body.scrollTop));
				var c = new Vector2(d, e, 'document');
				return c.convertTo(a);
			},
			getScrollPosition : function(a) {
				a = a || 'document';
				var b = document.body.scrollLeft
						|| document.documentElement.scrollLeft;
				var c = document.body.scrollTop
						|| document.documentElement.scrollTop;
				return new Vector2(b, c, 'document').convertTo(a);
			},
			getElementPosition : function(c, b) {
				b = b || 'document';
				if (!c)
					return;
				if (!('getBoundingClientRect' in c))
					return new Vector2(0, 0, 'document');
				var e = c.getBoundingClientRect(), a = document.documentElement, d = Math
						.round(e.left)
						- a.clientLeft, f = Math.round(e.top) - a.clientTop;
				return new Vector2(d, f, 'viewport').convertTo(b);
			},
			getElementDimensions : function(a) {
				return new Vector2(a.offsetWidth || 0, a.offsetHeight || 0);
			},
			getViewportDimensions : function() {
				var a = (window && window.innerWidth)
						|| (document && document.documentElement && document.documentElement.clientWidth)
						|| (document && document.body && document.body.clientWidth)
						|| 0;
				var b = (window && window.innerHeight)
						|| (document && document.documentElement && document.documentElement.clientHeight)
						|| (document && document.body && document.body.clientHeight)
						|| 0;
				return new Vector2(a, b, 'viewport');
			},
			getDocumentDimensions : function() {
				var a = (document && document.documentElement && document.documentElement.scrollWidth)
						|| (document && document.body && document.body.scrollWidth)
						|| 0;
				var b = (document && document.documentElement && document.documentElement.scrollHeight)
						|| (document && document.body && document.body.scrollHeight)
						|| 0;
				return new Vector2(a, b, 'document');
			},
			scrollIntoView : function(a) {
				var b = a.offsetParent;
				var d = Rect(a);
				var c = d.boundWithin(Rect(b)).getPositionVector();
				d.getPositionVector().sub(c).scrollElementBy(b);
			}
		});
var operaIgnoreScroll = {
	table : true,
	'inline-table' : true,
	inline : true
};
function elementX(a) {
	return Vector2.getElementPosition(a, 'document').x;
}
function elementY(a) {
	return Vector2.getElementPosition(a, 'document').y;
}
function KeyEventController() {
	this.handlers = {};
	document.onkeyup = this.onkeyevent.bind(this, 'onkeyup');
	document.onkeydown = this.onkeyevent.bind(this, 'onkeydown');
	document.onkeypress = this.onkeyevent.bind(this, 'onkeypress');
}
copy_properties(
		KeyEventController,
		{
			instance : null,
			getInstance : function() {
				return KeyEventController.instance
						|| (KeyEventController.instance = new KeyEventController());
			},
			defaultFilter : function(event, a) {
				event = $E(event);
				return KeyEventController.filterEventTypes(event, a)
						&& KeyEventController.filterEventTargets(event, a)
						&& KeyEventController.filterEventModifiers(event, a);
			},
			filterEventTypes : function(event, a) {
				if (a === 'onkeydown')
					return true;
				return false;
			},
			filterEventTargets : function(event, b) {
				var a = $E(event).getTarget();
				if (DOM.isNode(a, [ 'input', 'select', 'textarea', 'object',
						'embed' ]))
					if (a.type != 'checkbox' && a.type != 'radio'
							&& a.type != 'submit')
						return false;
				return a.getAttribute('contentEditable') != 'true';
			},
			filterEventModifiers : function(event, a) {
				if (event.ctrlKey || event.altKey || event.metaKey
						|| event.repeat)
					return false;
				return true;
			},
			registerKey : function(f, a, d, g) {
				if (d === undefined)
					d = KeyEventController.defaultFilter;
				var b = KeyEventController.getInstance();
				var c = b.mapKey(f);
				if (is_empty(b.handlers))
					onleaveRegister(b.resetHandlers.bind(b));
				for ( var e = 0; e < c.length; e++) {
					f = c[e];
					if (!b.handlers[f] || g)
						b.handlers[f] = [];
					b.handlers[f].push( {
						callback : a,
						filter : d
					});
				}
			},
			keyCodeMap : {
				BACKSPACE : [ 8 ],
				TAB : [ 9 ],
				RETURN : [ 13 ],
				ESCAPE : [ 27 ],
				LEFT : [ 37, 63234 ],
				UP : [ 38, 63232 ],
				RIGHT : [ 39, 63235 ],
				DOWN : [ 40, 63233 ],
				DELETE : [ 46 ],
				COMMA : [ 188 ],
				PERIOD : [ 190 ],
				'`' : [ 192 ],
				'[' : [ 219 ],
				']' : [ 221 ]
			}
		});
copy_properties(KeyEventController.prototype, {
	mapKey : function(a) {
		if (typeof (a) == 'number')
			return [ 48 + a, 96 + a ];
		var b = KeyEventController.keyCodeMap[a.toUpperCase()];
		if (b)
			return b;
		return [ a.toUpperCase().charCodeAt(0) ];
	},
	onkeyevent : function(i, c) {
		c = $E(c);
		var d = null;
		var g = this.handlers[c.keyCode];
		var b, f, a;
		if (g)
			for ( var h = 0; h < g.length; h++) {
				b = g[h].callback;
				f = g[h].filter;
				try {
					if (!f || f(c, i)) {
						var node = null;
						if (window.Parent && Parent.byTag && c.getTarget)
							node = Parent.byTag(c.getTarget(), 'a');
						user_action(node, 'key', c);
						a = b(c, i);
						if (a === false)
							return Event.kill(c);
					}
				} catch (e) {
				}
			}
		return true;
	},
	resetHandlers : function() {
		this.handlers = {};
	}
});
function collect_data_attrib(d, g) {
	var f = {};
	var c = 'data-' + g;
	while (d) {
		if (d.getAttribute) {
			var b = d.getAttribute(c);
			if (b) {
				var a = JSON.decode(b);
				for ( var e in a)
					if (f[e] === undefined)
						f[e] = a[e];
			}
		}
		d = d.parentNode;
	}
	return f;
}
function DOMControl(a) {
	this.root = a && $(a);
	this.updating = false;
	if (this.root)
		this.root.getControl = bagof(this);
}
DOMControl.prototype = {
	getRoot : function() {
		return this.root;
	},
	beginUpdate : function() {
		if (this.updating)
			return false;
		this.updating = true;
		return true;
	},
	endUpdate : function() {
		this.updating = false;
	},
	update : function(a) {
		if (!this.beginUpdate())
			return this;
		this.onupdate(a);
		this.endUpdate();
	}
};
var FormControl = {
	_gettingCaretPosition : false,
	getCaretPosition : function(a) {
		a = $(a);
		if (!DOM.isNode(a, [ 'input', 'textarea' ]))
			return {
				start : undefined,
				end : undefined
			};
		if (!document.selection)
			return {
				start : a.selectionStart,
				end : a.selectionEnd
			};
		if (DOM.isNode(a, 'input')) {
			var c = document.selection.createRange();
			return {
				start : -c.moveStart('character', -a.value.length),
				end : -c.moveEnd('character', -a.value.length)
			};
		} else {
			if (!this._gettingCaretPosition) {
				this._gettingCaretPosition = true;
				a.focus();
				this._gettingCaretPosition = false;
			}
			var c = document.selection.createRange();
			var d = c.duplicate();
			d.moveToElementText(a);
			d.setEndPoint('StartToEnd', c);
			var b = a.value.length - d.text.length;
			d.setEndPoint('StartToStart', c);
			return {
				start : a.value.length - d.text.length,
				end : b
			};
		}
	},
	setCaretPosition : function(c, f, a) {
		c = $(c);
		if (document.selection) {
			if (c.tagName == 'TEXTAREA') {
				var b = c.value.indexOf("\r", 0);
				while (b != -1 && b < a) {
					a--;
					if (b < f)
						f--;
					b = c.value.indexOf("\r", b + 1);
				}
			}
			var d = c.createTextRange();
			d.collapse(true);
			d.moveStart('character', f);
			if (a != undefined)
				d.moveEnd('character', a - f);
			d.select();
		} else {
			c.selectionStart = f;
			var e = a == undefined ? f : a;
			c.selectionEnd = Math.min(e, c.value.length);
			c.focus();
		}
	}
};
add_properties('Input', {
	isEmpty : function(a) {
		return !(/\S/).test(a.value || '')
				|| CSS.hasClass(a, 'DOMControl_placeholder');
	},
	getValue : function(a) {
		return Input.isEmpty(a) ? '' : a.value;
	},
	setValue : function(a, b) {
		CSS.removeClass(a, 'DOMControl_placeholder');
		a.value = b;
	},
	setPlaceholder : function(a, b) {
		a.setAttribute('title', b);
		a.setAttribute('placeholder', b);
		if (Input.isEmpty(a)) {
			CSS.addClass(a, 'DOMControl_placeholder');
			a.value = b;
		}
	},
	reset : function(a) {
		Input.setValue(a, '');
		var b = a.getAttribute('placeholder');
		b && Input.setPlaceholder(a, b);
		a.style.height = '';
	},
	setSubmitOnEnter : function(a, b) {
		CSS.conditionClass(a, 'enter_submit', b);
	},
	getSubmitOnEnter : function(a) {
		return CSS.hasClass(a, 'enter_submit');
	}
});
function TextInputControl(b) {
	this.parent.construct(this, b);
	var a = this.getRoot();
	this.maxLength = a.maxLength || null;
	var c = function() {
		this.update.bind(this).defer();
	}.bind(this);
	Event.listen(a, {
		keydown : c,
		paste : c
	});
}
TextInputControl.extend('DOMControl');
TextInputControl.prototype = {
	setMaxLength : function(a) {
		var b = this.getRoot();
		this.maxLength = a;
		if (a) {
			b.maxLength = a;
		} else
			b.removeAttribute('maxlength');
		return this;
	},
	getValue : function() {
		return Input.getValue(this.getRoot());
	},
	isEmpty : function() {
		return Input.isEmpty(this.getRoot());
	},
	setValue : function(a) {
		this.getRoot().value = a;
		this.update();
		return this;
	},
	clear : function() {
		return this.setValue('');
	},
	setPlaceholderText : function(a) {
		Input.setPlaceholder(this.getRoot(), a);
	},
	onupdate : function() {
		var d = this.getRoot();
		if (this.maxLength > 0)
			if (d.value.length > this.maxLength) {
				var e = d.value;
				var c = e.length - this.maxLength;
				var a = FormControl.getCaretPosition(d);
				var b = a.end || e.length;
				d.value = e.substring(0, b - c) + e.substring(b);
				if (typeof a.start != 'undefined')
					FormControl.setCaretPosition(d, a.start - c, Math.max(
							a.start, a.end)
							- c);
			}
	}
};
function TextAreaControl(a) {
	this.autogrow = false;
	this.parent.construct(this, a);
	this.width = null;
}
TextAreaControl.extend('TextInputControl');
TextAreaControl.getWidth = function(b) {
	var a = function(d) {
		return parseInt(CSS.getStyle(b, d), 10);
	};
	var c = b.offsetWidth - a('paddingLeft') - a('paddingRight')
			- a('borderLeftWidth') - a('borderRightWidth');
	if (ua.firefox())
		c -= 2;
	return Math.max(c, 0);
};
TextAreaControl.prototype = {
	setAutogrow : function(a) {
		this.autogrow = a;
		return this;
	},
	resizeCallback : bagofholding,
	setResizeCallback : function(a) {
		this.resizeCallback = a;
	},
	onupdate : function() {
		this.parent.onupdate();
		if (this.autogrow) {
			var b = this.getRoot();
			var c = this.getShadow(b);
			if (!c)
				return;
			CSS.setStyle(c, 'width', this._getWidth() + 'px');
			DOM.setContent(c, HTML(htmlize(b.value) + '...'));
			var a = Math.max(this.minHeight, c.offsetHeight);
			if (a != this.height) {
				CSS.setStyle(b, 'height', this.isEmpty() ? '' : a + 'px');
				this.resizeCallback(a, this.height);
				this.height = a;
			}
		} else if (this.shadow) {
			DOM.remove(this.shadow);
			this.shadow = null;
		}
	},
	_getWidth : function() {
		if (this.width === null)
			this.width = TextAreaControl.getWidth(this.getRoot());
		return this.width;
	},
	getShadow : function(c) {
		if (!this.shadow) {
			var a = CSS.getStyle(c, 'fontSize');
			if (!a)
				return false;
			var b = parseInt(CSS.getStyle(c, 'height'), 10);
			this.minHeight = b > 0 ? b : c.offsetHeight - 8;
			this.shadow = $N('div', {
				className : 'DOMControl_shadow',
				style : {
					wordWrap : 'break-word',
					fontSize : a,
					fontFamily : CSS.getStyle(c, 'fontFamily')
				}
			});
			DOM.getRootElement().appendChild(this.shadow);
		}
		return this.shadow;
	}
};
add_properties('CSS', {
	supportsBorderRadius : function() {
		var c = [ 'KhtmlBorderRadius', 'OBorderRadius', 'MozBorderRadius',
				'WebkitBorderRadius', 'msBorderRadius', 'borderRadius' ];
		var d = false, a = document.createElement('div');
		for ( var b = c.length; b >= 0; b--)
			if (d = a.style[c[b]] !== undefined)
				break;
		CSS.supportsBorderRadius = bagof(d);
		return d;
	}
});
function animation(a) {
	if (a == undefined)
		return;
	if (this == window) {
		return new animation(a);
	} else {
		this.obj = a;
		this._reset_state();
		this.queue = [];
		this.last_attr = null;
	}
}
animation.resolution = 20;
animation.offset = 0;
animation.prototype._reset_state = function() {
	this.state = {
		attrs : {},
		duration : 500
	};
};
animation.prototype.stop = function() {
	this._reset_state();
	this.queue = [];
	return this;
};
animation.prototype._build_container = function() {
	if (this.container_div) {
		this._refresh_container();
		return;
	}
	if (this.obj.firstChild && this.obj.firstChild.__animation_refs) {
		this.container_div = this.obj.firstChild;
		this.container_div.__animation_refs++;
		this._refresh_container();
		return;
	}
	var b = document.createElement('div');
	b.style.padding = '0px';
	b.style.margin = '0px';
	b.style.border = '0px';
	b.__animation_refs = 1;
	var a = this.obj.childNodes;
	while (a.length)
		b.appendChild(a[0]);
	this.obj.appendChild(b);
	this._orig_overflow = this.obj.style.overflow;
	this.obj.style.overflow = 'hidden';
	this.container_div = b;
	this._refresh_container();
};
animation.prototype._refresh_container = function() {
	this.container_div.style.height = 'auto';
	this.container_div.style.width = 'auto';
	this.container_div.style.height = this.container_div.offsetHeight + 'px';
	this.container_div.style.width = this.container_div.offsetWidth + 'px';
};
animation.prototype._destroy_container = function() {
	if (!this.container_div)
		return;
	if (!--this.container_div.__animation_refs) {
		var a = this.container_div.childNodes;
		while (a.length)
			this.obj.appendChild(a[0]);
		this.obj.removeChild(this.container_div);
	}
	this.container_div = null;
	this.obj.style.overflow = this._orig_overflow;
};
animation.ATTR_TO = 1;
animation.ATTR_BY = 2;
animation.ATTR_FROM = 3;
animation.prototype._attr = function(a, d, c) {
	a = a.replace(/-[a-z]/gi, function(e) {
		return e.substring(1).toUpperCase();
	});
	var b = false;
	switch (a) {
	case 'background':
		this._attr('backgroundColor', d, c);
		return this;
	case 'margin':
		d = animation.parse_group(d);
		this._attr('marginBottom', d[0], c);
		this._attr('marginLeft', d[1], c);
		this._attr('marginRight', d[2], c);
		this._attr('marginTop', d[3], c);
		return this;
	case 'padding':
		d = animation.parse_group(d);
		this._attr('paddingBottom', d[0], c);
		this._attr('paddingLeft', d[1], c);
		this._attr('paddingRight', d[2], c);
		this._attr('paddingTop', d[3], c);
		return this;
	case 'backgroundColor':
	case 'borderColor':
	case 'color':
		d = animation.parse_color(d);
		break;
	case 'opacity':
		d = parseFloat(d, 10);
		break;
	case 'height':
	case 'width':
		if (d == 'auto') {
			b = true;
		} else
			d = parseInt(d, 10);
		break;
	case 'borderWidth':
	case 'lineHeight':
	case 'fontSize':
	case 'marginBottom':
	case 'marginLeft':
	case 'marginRight':
	case 'marginTop':
	case 'paddingBottom':
	case 'paddingLeft':
	case 'paddingRight':
	case 'paddingTop':
	case 'bottom':
	case 'left':
	case 'right':
	case 'top':
	case 'scrollTop':
	case 'scrollLeft':
		d = parseInt(d, 10);
		break;
	default:
		throw new Error(a + ' is not a supported attribute!');
	}
	if (this.state.attrs[a] === undefined)
		this.state.attrs[a] = {};
	if (b)
		this.state.attrs[a].auto = true;
	switch (c) {
	case animation.ATTR_FROM:
		this.state.attrs[a].start = d;
		break;
	case animation.ATTR_BY:
		this.state.attrs[a].by = true;
	case animation.ATTR_TO:
		this.state.attrs[a].value = d;
		break;
	}
};
animation._get_box_width = function(c) {
	var d = parseInt(CSS.getStyle(c, 'paddingLeft'), 10), e = parseInt(CSS
			.getStyle(c, 'paddingRight'), 10), a = parseInt(CSS.getStyle(c,
			'borderLeftWidth'), 10), b = parseInt(CSS.getStyle(c,
			'borderRightWidth'), 10);
	return c.offsetWidth - (d ? d : 0) - (e ? e : 0) - (a ? a : 0)
			- (b ? b : 0);
};
animation._get_box_height = function(c) {
	var e = parseInt(CSS.getStyle(c, 'paddingTop'), 10), d = parseInt(CSS
			.getStyle(c, 'paddingBottom'), 10), a = parseInt(CSS.getStyle(c,
			'borderTopWidth'), 10), b = parseInt(CSS.getStyle(c,
			'borderBottomWidth'), 10);
	return c.offsetHeight - (e ? e : 0) - (d ? d : 0) - (a ? a : 0)
			- (b ? b : 0);
};
animation.prototype.to = function(a, b) {
	if (b === undefined) {
		this._attr(this.last_attr, a, animation.ATTR_TO);
	} else {
		this._attr(a, b, animation.ATTR_TO);
		this.last_attr = a;
	}
	return this;
};
animation.prototype.by = function(a, b) {
	if (b === undefined) {
		this._attr(this.last_attr, a, animation.ATTR_BY);
	} else {
		this._attr(a, b, animation.ATTR_BY);
		this.last_attr = a;
	}
	return this;
};
animation.prototype.from = function(a, b) {
	if (b === undefined) {
		this._attr(this.last_attr, a, animation.ATTR_FROM);
	} else {
		this._attr(a, b, animation.ATTR_FROM);
		this.last_attr = a;
	}
	return this;
};
animation.prototype.duration = function(a) {
	this.state.duration = a ? a : 0;
	return this;
};
animation.prototype.checkpoint = function(b, a) {
	if (b === undefined)
		b = 1;
	this.state.checkpoint = b;
	this.queue.push(this.state);
	this._reset_state();
	this.state.checkpointcb = a;
	return this;
};
animation.prototype.blind = function() {
	this.state.blind = true;
	return this;
};
animation.prototype.hide = function() {
	this.state.hide = true;
	return this;
};
animation.prototype.show = function() {
	this.state.show = true;
	return this;
};
animation.prototype.ease = function(a) {
	this.state.ease = a;
	return this;
};
animation.prototype.go = function() {
	var b = (new Date()).getTime();
	this.queue.push(this.state);
	for ( var a = 0; a < this.queue.length; a++) {
		this.queue[a].start = b - animation.offset;
		if (this.queue[a].checkpoint)
			b += this.queue[a].checkpoint * this.queue[a].duration;
	}
	animation.push(this);
	return this;
};
animation.prototype._show = function() {
	CSS.show(this.obj);
};
animation.prototype._hide = function() {
	CSS.hide(this.obj);
};
animation.prototype._frame = function(l) {
	var d = true;
	var k = false;
	var n = false;
	for ( var e = 0; e < this.queue.length; e++) {
		var b = this.queue[e];
		if (b.start > l) {
			d = false;
			continue;
		}
		if (b.checkpointcb) {
			this._callback(b.checkpointcb, l - b.start);
			b.checkpointcb = null;
		}
		if (b.started === undefined) {
			if (b.show)
				this._show();
			for ( var a in b.attrs) {
				if (b.attrs[a].start !== undefined)
					continue;
				switch (a) {
				case 'backgroundColor':
				case 'borderColor':
				case 'color':
					var m = animation.parse_color(CSS.getStyle(this.obj,
							a == 'borderColor' ? 'borderLeftColor' : a));
					if (b.attrs[a].by) {
						b.attrs[a].value[0] = Math.min(255, Math.max(0,
								b.attrs[a].value[0] + m[0]));
						b.attrs[a].value[1] = Math.min(255, Math.max(0,
								b.attrs[a].value[1] + m[1]));
						b.attrs[a].value[2] = Math.min(255, Math.max(0,
								b.attrs[a].value[2] + m[2]));
					}
					break;
				case 'opacity':
					var m = CSS.getOpacity(this.obj);
					if (b.attrs[a].by)
						b.attrs[a].value = Math.min(1, Math.max(0,
								b.attrs[a].value + m));
					break;
				case 'height':
					var m = animation._get_box_height(this.obj);
					if (b.attrs[a].by)
						b.attrs[a].value += m;
					break;
				case 'width':
					var m = animation._get_box_width(this.obj);
					if (b.attrs[a].by)
						b.attrs[a].value += m;
					break;
				case 'scrollLeft':
				case 'scrollTop':
					var m = (this.obj == document.body) ? (document.documentElement[a] || document.body[a])
							: this.obj[a];
					if (b.attrs[a].by)
						b.attrs[a].value += m;
					b['last' + a] = m;
					break;
				default:
					var m = parseInt(CSS.getStyle(this.obj, a), 10) || 0;
					if (b.attrs[a].by)
						b.attrs[a].value += m;
					break;
				}
				b.attrs[a].start = m;
			}
			if ((b.attrs.height && b.attrs.height.auto)
					|| (b.attrs.width && b.attrs.width.auto)) {
				if (ua.firefox() < 3)
					n = true;
				this._destroy_container();
				for ( var a in {
					height : 1,
					width : 1,
					fontSize : 1,
					borderLeftWidth : 1,
					borderRightWidth : 1,
					borderTopWidth : 1,
					borderBottomWidth : 1,
					paddingLeft : 1,
					paddingRight : 1,
					paddingTop : 1,
					paddingBottom : 1
				})
					if (b.attrs[a])
						this.obj.style[a] = b.attrs[a].value
								+ (typeof b.attrs[a].value == 'number' ? 'px'
										: '');
				if (b.attrs.height && b.attrs.height.auto)
					b.attrs.height.value = animation._get_box_height(this.obj);
				if (b.attrs.width && b.attrs.width.auto)
					b.attrs.width.value = animation._get_box_width(this.obj);
			}
			b.started = true;
			if (b.blind)
				this._build_container();
		}
		var h = (l - b.start) / b.duration;
		if (h >= 1) {
			h = 1;
			if (b.hide)
				this._hide();
		} else
			d = false;
		var j = b.ease ? b.ease(h) : h;
		if (!k && h != 1 && b.blind)
			k = true;
		if (n && this.obj.parentNode) {
			var i = this.obj.parentNode;
			var g = this.obj.nextSibling;
			i.removeChild(this.obj);
		}
		for ( var a in b.attrs)
			switch (a) {
			case 'backgroundColor':
			case 'borderColor':
			case 'color':
				this.obj.style[a] = 'rgb('
						+ animation.calc_tween(j, b.attrs[a].start[0],
								b.attrs[a].value[0], true)
						+ ','
						+ animation.calc_tween(j, b.attrs[a].start[1],
								b.attrs[a].value[1], true)
						+ ','
						+ animation.calc_tween(j, b.attrs[a].start[2],
								b.attrs[a].value[2], true) + ')';
				break;
			case 'opacity':
				CSS.setStyle(this.obj, 'opacity', animation.calc_tween(j,
						b.attrs[a].start, b.attrs[a].value));
				break;
			case 'height':
			case 'width':
				this.obj.style[a] = j == 1 && b.attrs[a].auto ? 'auto'
						: animation.calc_tween(j, b.attrs[a].start,
								b.attrs[a].value, true) + 'px';
				break;
			case 'scrollLeft':
			case 'scrollTop':
				var f = this.obj == document.body;
				var m = (f) ? (document.documentElement[a] || document.body[a])
						: this.obj[a];
				if (b['last' + a] != m) {
					delete b.attrs[a];
				} else {
					var c = animation.calc_tween(j, b.attrs[a].start,
							b.attrs[a].value, true)
							- m;
					if (!f) {
						this.obj[a] = c + m;
					} else if (a == 'scrollLeft') {
						window.scrollBy(c, 0);
					} else
						window.scrollBy(0, c);
					b['last' + a] = c + m;
				}
				break;
			default:
				this.obj.style[a] = animation.calc_tween(j, b.attrs[a].start,
						b.attrs[a].value, true) + 'px';
				break;
			}
		if (h == 1) {
			this.queue.splice(e--, 1);
			this._callback(b.ondone, l - b.start - b.duration);
		}
	}
	if (n)
		i[g ? 'insertBefore' : 'appendChild'](this.obj, g);
	if (!k && this.container_div)
		this._destroy_container();
	return !d;
};
animation.prototype.ondone = function(a) {
	this.state.ondone = a;
	return this;
};
animation.prototype._callback = function(a, b) {
	if (a) {
		animation.offset = b;
		a.call(this);
		animation.offset = 0;
	}
};
animation.calc_tween = function(a, b, c, d) {
	return (d ? parseInt : parseFloat)((c - b) * a + b, 10);
};
animation.parse_color = function(a) {
	var b = /^#([a-f0-9]{1,2})([a-f0-9]{1,2})([a-f0-9]{1,2})$/i.exec(a);
	if (b) {
		return [ parseInt(b[1].length == 1 ? b[1] + b[1] : b[1], 16),
				parseInt(b[2].length == 1 ? b[2] + b[2] : b[2], 16),
				parseInt(b[3].length == 1 ? b[3] + b[3] : b[3], 16) ];
	} else {
		var c = /^rgba? *\(([0-9]+), *([0-9]+), *([0-9]+)(?:, *([0-9]+))?\)$/
				.exec(a);
		if (c) {
			if (c[4] === '0') {
				return [ 255, 255, 255 ];
			} else
				return [ parseInt(c[1], 10), parseInt(c[2], 10),
						parseInt(c[3], 10) ];
		} else if (a == 'transparent') {
			return [ 255, 255, 255 ];
		} else
			throw 'Named color attributes are not supported.';
	}
};
animation.parse_group = function(a) {
	var a = trim(a).split(/ +/);
	if (a.length == 4) {
		return a;
	} else if (a.length == 3) {
		return [ a[0], a[1], a[2], a[1] ];
	} else if (a.length == 2) {
		return [ a[0], a[1], a[0], a[1] ];
	} else
		return [ a[0], a[0], a[0], a[0] ];
};
animation.push = function(a) {
	if (!animation.active)
		animation.active = [];
	animation.active.push(a);
	if (!animation.timeout)
		animation.timeout = setInterval(animation.animate.bind(animation),
				animation.resolution, false);
	animation.animate(true);
};
animation.animate = function(c) {
	var d = (new Date()).getTime();
	for ( var b = c === true ? animation.active.length - 1 : 0; b < animation.active.length; b++)
		try {
			if (!animation.active[b]._frame(d))
				animation.active.splice(b--, 1);
		} catch (a) {
			animation.active.splice(b--, 1);
		}
	if (animation.active.length == 0) {
		clearInterval(animation.timeout);
		animation.timeout = null;
	}
};
animation.ease = {};
animation.ease.begin = function(a) {
	return Math.sin(Math.PI / 2 * (a - 1)) + 1;
};
animation.ease.end = function(a) {
	return Math.sin(.5 * Math.PI * a);
};
animation.ease.both = function(a) {
	return .5 * Math.sin(Math.PI * (a - .5)) + .5;
};
animation.prependInsert = function(b, a) {
	animation.insert(b, a, DOM.prependContent);
};
animation.appendInsert = function(b, a) {
	animation.insert(b, a, DOM.appendContent);
};
animation.insert = function(c, a, b) {
	CSS.setStyle(a, 'opacity', 0);
	b(c, a);
	animation(a).from('opacity', 0).to('opacity', 1).duration(400).go();
};
function show() {
	for ( var b = 0; b < arguments.length; b++) {
		var a = ge(arguments[b]);
		if (a && a.style)
			a.style.display = '';
	}
	return false;
}
function hide() {
	for ( var b = 0; b < arguments.length; b++) {
		var a = ge(arguments[b]);
		if (a && a.style)
			a.style.display = 'none';
	}
	return false;
}
function shown(a) {
	a = ge(a);
	return (a.style.display != 'none' && !(a.style.display == '' && a.offsetWidth == 0));
}
function toggle() {
	for ( var b = 0; b < arguments.length; b++) {
		var a = $(arguments[b]);
		a.style.display = CSS.getStyle(a, "display") == 'block' ? 'none'
				: 'block';
	}
	return false;
}
function toggleDisplayNone() {
	for ( var b = 0; b < arguments.length; b++) {
		var a = $(arguments[b]);
		if (shown(a)) {
			hide(a);
		} else
			show(a);
	}
	return false;
}
var KEYS = {
	BACKSPACE : 8,
	TAB : 9,
	RETURN : 13,
	ESC : 27,
	SPACE : 32,
	PAGE_UP : 33,
	PAGE_DOWN : 34,
	LEFT : 37,
	UP : 38,
	RIGHT : 39,
	DOWN : 40,
	DELETE : 46,
	COMMA : 188
};
var ErrorDialog = {
	showAsyncError : function(b) {
		try {
			return ErrorDialog.show(b.getErrorSummary(), b
					.getErrorDescription());
		} catch (a) {
			alert(b);
		}
	},
	show : function(c, b, a) {
		return (new Dialog()).setTitle(c).setBody(b).setButtons( [ Dialog.OK ])
				.setStackable(true).setClassName('errorDialog').setModal(true)
				.setHandler(a || bagofholding).show();
	}
};
add_properties(
		'Form',
		{
			getInputs : function(a) {
				a = a || document;
				return [].concat($A(DOM.scry(a, 'input')), $A(DOM.scry(a,
						'select')), $A(DOM.scry(a, 'textarea')), $A(DOM.scry(a,
						'button')));
			},
			getSelectValue : function(a) {
				return a.options[a.selectedIndex].value;
			},
			setSelectValue : function(b, c) {
				for ( var a = 0; a < b.options.length; ++a)
					if (b.options[a].value == c) {
						b.selectedIndex = a;
						break;
					}
			},
			getRadioValue : function(b) {
				for ( var a = 0; a < b.length; a++)
					if (b[a].checked)
						return b[a].value;
				return null;
			},
			getElements : function(a) {
				return $A(a.tagName == 'FORM' ? a.elements : Form.getInputs(a));
			},
			getAttribute : function(b, a) {
				return (b.getAttributeNode(a) || {}).value || null;
			},
			setDisabled : function(b, a) {
				Form.getElements(b).forEach(
						function(c) {
							if (c.disabled != undefined) {
								var d = DataStore.get(c, 'origDisabledState');
								if (a) {
									if (d === undefined)
										DataStore.set(c, 'origDisabledState',
												c.disabled);
									c.disabled = a;
								} else {
									if (d !== true)
										c.disabled = false;
									DataStore.remove(c, 'origDisabledState');
								}
							}
						});
			},
			bootstrap : function(c, d) {
				var e = (Form.getAttribute(c, 'method') || 'GET').toUpperCase();
				d = Parent.byTag(d, 'button') || d;
				var f = DOMPath.findNodePath(c);
				var h = Parent.byClass(d, 'stat_elem') || c;
				if (CSS.hasClass(h, 'async_saving'))
					return;
				var b = Form.serialize(c, d);
				Form.setDisabled(c, true);
				var a = Form.getAttribute(c, 'ajaxify')
						|| Form.getAttribute(c, 'action');
				var g = new AsyncRequest(a);
				g.setData(b).setNectarModuleDataSafe(c).setReadOnly(e == 'GET')
						.setMethod(e).setRelativeTo(c).setStatusElement(h)
						.setHandler(function(i) {
							if (i.isReplay())
								g.setRelativeTo(DOMPath.resolveNodePath(f));
						}).setFinallyHandler(
								Form.setDisabled.bind(null, c, false)).send();
			},
			serialize : function(b, c) {
				var a = {};
				Form
						.getElements(b)
						.forEach(
								function(d) {
									if (d.name && !d.disabled
											&& d.type != 'submit')
										if (!d.type
												|| ((d.type == 'radio' || d.type == 'checkbox') && d.checked)
												|| d.type == 'text'
												|| d.type == 'password'
												|| d.type == 'hidden'
												|| d.tagName == 'TEXTAREA') {
											Form._serializeHelper(a, d.name,
													Input.getValue(d));
										} else if (d.tagName == 'SELECT')
											for ( var e = 0, f = d.options.length; e < f; ++e) {
												var g = d.options[e];
												if (g.selected)
													Form._serializeHelper(a,
															d.name, g.value);
											}
								});
				if (c && c.name && 'submit' == c.type && DOM.contains(b, c)
						&& DOM.isNode(c, [ 'input', 'button' ]))
					Form._serializeHelper(a, c.name, c.value);
				return Form._serializeFix(a);
			},
			_serializeHelper : function(a, d, e) {
				var c = /([^\]]+)\[([^\]]*)\](.*)/.exec(d);
				if (c) {
					a[c[1]] = a[c[1]] || {};
					if (c[2] == '') {
						var b = 0;
						while (a[c[1]][b] != undefined)
							b++;
					} else
						b = c[2];
					if (c[3] == '') {
						a[c[1]][b] = e;
					} else
						Form._serializeHelper(a[c[1]], b.concat(c[3]), e);
				} else
					a[d] = e;
			},
			_serializeFix : function(a) {
				var e = [];
				for ( var b in a) {
					if (a instanceof Object)
						a[b] = Form._serializeFix(a[b]);
					e.push(b);
				}
				var d = 0, c = true;
				e.sort().each(function(g) {
					if (g != d++)
						c = false;
				});
				if (c) {
					var f = {};
					e.each(function(g) {
						f[g] = a[g];
					});
					return f;
				} else
					return a;
			},
			post : function(d, b, c) {
				var a = document.createElement('form');
				a.action = d.toString();
				a.method = 'POST';
				a.style.display = 'none';
				if (c)
					a.target = c;
				if (ge('post_form_id'))
					b.post_form_id = $('post_form_id').value;
				b.fb_dtsg = Env.fb_dtsg;
				b.post_form_id_source = 'dynamic_post';
				b.next = htmlspecialchars(document.location.href);
				Form.createHiddenInputs(b, a);
				DOM.getRootElement().appendChild(a);
				a.submit();
				return false;
			},
			createHiddenInputs : function(g, a, d, f) {
				d = d || {};
				var c;
				var h = URI.implodeQuery(g, '', false);
				var i = h.split('&');
				for ( var b = 0; b < i.length; b++)
					if (i[b]) {
						var j = i[b].split('=');
						var e = j[0];
						var k = j[1];
						if (e === undefined || k === undefined)
							continue;
						k = URI.decodeComponent(k);
						if (d[e] && f) {
							d[e].value = k;
						} else {
							c = $N('input', {
								type : 'hidden',
								name : e,
								value : k
							});
							d[e] = c;
							a.appendChild(c);
						}
					}
				return d;
			},
			getFirstElement : function(b) {
				var f = [ 'input[type="text"]', 'textarea',
						'input[type="password"]', 'input[type="button"]',
						'input[type="submit"]' ];
				var e = [];
				for ( var c = 0; c < f.length && e.length == 0; c++)
					e = DOM.scry(b, f[c]);
				if (e.length > 0) {
					var d = e[0];
					try {
						if (elementY(d) > 0 && elementX(d) > 0)
							return d;
					} catch (a) {
					}
				}
				return null;
			},
			focusFirst : function(b) {
				var a = Form.getFirstElement(b);
				if (a) {
					a.focus();
					return true;
				}
				return false;
			}
		});
var DOMPath = {
	findNodePath : function(c, e) {
		e = e || [];
		if (c.id || !DOM.isNode(c.parentNode))
			return {
				id : c.id,
				path : e.reverse()
			};
		var d = c.parentNode;
		var b = d.childNodes;
		for ( var a = 0; a < b.length; ++a)
			if (b[a] === c) {
				e.push(a);
				return DOMPath.findNodePath(d, e);
			}
		return null;
	},
	resolveNodePath : function(a) {
		var b = ge(a.id) || document.documentElement;
		return DOMPath._resolveNodePathChildren(a.path, b, 0);
	},
	_resolveNodePathChildren : function(c, d, b) {
		if (b === c.length)
			return d;
		var a = d.childNodes[c[b]];
		if (!a)
			return null;
		return DOMPath._resolveNodePathChildren(c, a, b + 1);
	}
};
function Dialog(a) {
	this._show_loading = true;
	this._loading_text = null;
	this._loading_was_shown = false;
	this._auto_focus = true;
	this._fade_enabled = true;
	this._onload_handlers = [];
	this._top = 125;
	this._content = null;
	this._obj = null;
	this._popup = null;
	this._overlay = null;
	this._hidden_objects = [];
	if (a)
		this._setFromModel(a);
}
Metaprototype.makeFinal(Dialog);
copy_properties(Dialog, {
	OK : {
		name : 'ok',
		label : _tx("Okay")
	},
	CANCEL : {
		name : 'cancel',
		label : _tx("Cancel"),
		className : 'inputaux'
	},
	CLOSE : {
		name : 'close',
		label : _tx("Close")
	},
	NEXT : {
		name : 'next',
		label : _tx("Next")
	},
	SAVE : {
		name : 'save',
		label : _tx("Save")
	},
	SUBMIT : {
		name : 'submit',
		label : _tx("Submit")
	},
	CONFIRM : {
		name : 'confirm',
		label : _tx("Confirm")
	},
	DELETE : {
		name : 'delete',
		label : _tx("Delete")
	},
	_bottoms : [ 0 ],
	max_bottom : 0,
	_updateMaxBottom : function() {
		Dialog.max_bottom = Math.max.apply(Math, Dialog._bottoms);
	}
});
copy_properties(Dialog, {
	OK_AND_CANCEL : [ Dialog.OK, Dialog.CANCEL ],
	_STANDARD_BUTTONS : [ Dialog.OK, Dialog.CANCEL, Dialog.CLOSE, Dialog.SAVE,
			Dialog.SUBMIT, Dialog.CONFIRM, Dialog.DELETE ],
	SHOULD_HIDE_OBJECTS : !ua.windows(),
	_useCSSBorders : CSS.supportsBorderRadius() || ua.ie() <= 6,
	SIZE : {
		WIDE : 555,
		STANDARD : 445
	},
	_HALO_WIDTH : 10,
	_BORDER_WIDTH : 1,
	_PADDING_WIDTH : 10,
	MODALITY : {
		DARK : 'dark',
		WHITE : 'white'
	},
	dialogStack : null,
	newButton : function(e, d, b, c) {
		var a = {
			name : e,
			label : d
		};
		if (b)
			a.className = b;
		if (c)
			a.handler = c;
		return a;
	},
	getCurrent : function() {
		var a = Dialog.dialogStack;
		if (!a || !a.length)
			return null;
		return a[a.length - 1];
	},
	bootstrap : function(f, a, e, c, d) {
		a = a || {};
		copy_properties(a, new URI(f).getQueryData());
		c = c || (e ? 'GET' : 'POST');
		var b = new Dialog(d).setAsync(new AsyncRequest().setURI(f).setData(a)
				.setReadOnly(!!e).setMethod(c));
		b.show();
		return false;
	},
	_basicMutator : function(a) {
		return function(b) {
			this[a] = b;
			this._dirty();
			return this;
		};
	},
	_findButton : function(a, c) {
		if (a)
			for ( var b = 0; b < a.length; ++b)
				if (a[b].name == c)
					return a[b];
		return null;
	},
	_keyDownFilter : function(event, a) {
		return a == 'onkeydown'
				&& KeyEventController.filterEventModifiers(event, a);
	},
	_tearDown : function() {
		Dialog._hideAll();
		Dialog.dialogStack = null;
	},
	_hideAll : function() {
		if (Dialog.dialogStack !== null && Dialog.dialogStack.length) {
			var b = Dialog.dialogStack.clone();
			Dialog.dialogStack = null;
			for ( var a = b.length - 1; a >= 0; a--)
				b[a].hide();
		}
	},
	_handleEscapeKey : function(event, a) {
		Dialog._escape();
	},
	_escape : function() {
		var d = Dialog.getCurrent();
		if (!d)
			return true;
		var e = d._semi_modal;
		var b = d._buttons;
		if (!b && !e)
			return true;
		if (e && !b) {
			d.hide();
			return false;
		}
		var a;
		var c = Dialog._findButton(b, 'cancel');
		if (d._cancelHandler) {
			d.cancel();
			return false;
		} else if (c) {
			a = c;
		} else if (b.length == 1) {
			a = b[0];
		} else
			return true;
		d._handleButton(a);
		return false;
	},
	call_or_eval : function(obj, func, args) {
		if (!func)
			return undefined;
		args = args || {};
		if (typeof (func) == 'string') {
			var params = keys(args).join(', ');
			func = eval('({f: function(' + params + ') { ' + func + '}})').f;
		}
		return func.apply(obj, values(args));
	}
});
copy_properties(
		Dialog.prototype,
		{
			show : function(a) {
				this._showing = true;
				if (a) {
					if (this._overlay)
						this._overlay.style.display = '';
					if (this._fade_enabled)
						CSS.setStyle(this._obj, 'opacity', 1);
					this._obj.style.display = '';
				} else
					this._dirty();
				return this;
			},
			showLoading : function() {
				this._loading_was_shown = true;
				this._renderDialog($N('div', {
					className : 'dialog_loading'
				}, this._loading_text || _tx("Loading...")));
				return this;
			},
			hide : function(a) {
				if (!this._showing)
					return this;
				this._showing = false;
				if (this._autohide_timeout) {
					clearTimeout(this._autohide_timeout);
					this._autohide_timeout = null;
				}
				if (this._fade_enabled
						&& (!Dialog.dialogStack || Dialog.dialogStack.length <= 1)) {
					this._fadeOut(a);
				} else
					this._hide(a);
				return this;
			},
			cancel : function() {
				if (!this._cancelHandler || this._cancelHandler() !== false)
					this.hide();
			},
			getRoot : function() {
				return this._obj;
			},
			getBody : function() {
				return DOM.scry(this._obj, 'div.dialog_body')[0];
			},
			getButtonElement : function(a) {
				if (typeof a == 'string')
					a = Dialog._findButton(this._buttons, a);
				if (!a || !a.name)
					return null;
				var b = DOM.scry(this._popup, 'input');
				var c = function(d) {
					return d.name == a.name;
				};
				return b.filter(c)[0] || null;
			},
			getContentNode : function() {
				var a = DOM.scry(this._content, 'div.dialog_content');
				a.length != 1;
				return a[0];
			},
			getFormData : function() {
				return Form.serialize(this.getContentNode());
			},
			setShowing : function() {
				this.show();
				return this;
			},
			setHiding : function() {
				this.hide();
				return this;
			},
			setTitle : Dialog._basicMutator('_title'),
			setBody : Dialog._basicMutator('_body'),
			setExtraData : Dialog._basicMutator('_extra_data'),
			setReturnData : Dialog._basicMutator('_return_data'),
			setShowLoading : Dialog._basicMutator('_show_loading'),
			setLoadingText : Dialog._basicMutator('_loading_text'),
			setFullBleed : Dialog._basicMutator('_full_bleed'),
			setImmediateRendering : function(a) {
				this._immediate_rendering = a;
				return this;
			},
			setUserData : Dialog._basicMutator('_user_data'),
			getUserData : function() {
				return this._user_data;
			},
			setAutohide : function(a) {
				if (a) {
					if (this._showing) {
						this._autohide_timeout = setTimeout(this.hide
								.shield(this), a);
					} else
						this._autohide = a;
				} else {
					this._autohide = null;
					if (this._autohide_timeout) {
						clearTimeout(this._autohide_timeout);
						this._autohide_timeout = null;
					}
				}
				return this;
			},
			setSummary : Dialog._basicMutator('_summary'),
			setButtons : function(a) {
				var c;
				if (!(a instanceof Array)) {
					c = $A(arguments);
				} else
					c = a;
				for ( var d = 0; d < c.length; ++d)
					if (typeof c[d] == 'string') {
						var b = Dialog._findButton(Dialog._STANDARD_BUTTONS,
								c[d]);
						!b;
						c[d] = b;
					}
				this._buttons = c;
				this._updateButtons();
				return this;
			},
			setButtonsMessage : Dialog._basicMutator('_buttons_message'),
			setClickButtonOnEnter : function(b, a) {
				this._clickButtonOnEnter = a;
				this._clickButtonOnEnterInputName = b;
				return this;
			},
			setStackable : function(b, a) {
				this._is_stackable = b;
				this._shown_while_stacked = b && a;
				return this;
			},
			setHandler : function(a) {
				this._handler = a;
				return this;
			},
			setCancelHandler : function(a) {
				this._cancelHandler = Dialog.call_or_eval.bind(null, this, a);
				return this;
			},
			setCloseHandler : function(a) {
				this._close_handler = Dialog.call_or_eval.bind(null, this, a);
				return this;
			},
			clearHandler : function() {
				return this.setHandler(null);
			},
			setPostURI : function(b, a) {
				if (a === undefined)
					a = true;
				if (a) {
					this.setHandler(this._submitForm.bind(this, 'POST', b));
				} else
					this.setHandler(function() {
						Form.post(b, this.getFormData());
						this.hide();
					}.bind(this));
				return this;
			},
			setGetURI : function(a) {
				this.setHandler(this._submitForm.bind(this, 'GET', a));
				return this;
			},
			setModal : function(a, b) {
				if (a === undefined)
					a = true;
				this._showing && this._modal && !a;
				if (a && b)
					switch (b) {
					case Dialog.MODALITY.DARK:
						this._modal_class = 'dark_dialog_overlay';
						break;
					case Dialog.MODALITY.WHITE:
						this._modal_class = 'light_dialog_overlay';
						break;
					}
				this._modal = a;
				return this;
			},
			setSemiModal : function(a) {
				if (a === undefined)
					a = true;
				if (a)
					this.setModal(true, Dialog.MODALITY.DARK);
				this._semi_modal = a;
				return this;
			},
			setWideDialog : Dialog._basicMutator('_wide_dialog'),
			setContentWidth : Dialog._basicMutator('_content_width'),
			setTitleLoading : function(b) {
				if (b === undefined)
					b = true;
				var a = DOM.find(this._popup, 'h2.dialog_title');
				if (a)
					CSS.conditionClass(a, 'loading', b);
				return this;
			},
			setSecure : Dialog._basicMutator('_secure'),
			setClassName : Dialog._basicMutator('_class_name'),
			setFading : Dialog._basicMutator('_fade_enabled'),
			setFooter : Dialog._basicMutator('_footer'),
			setAutoFocus : Dialog._basicMutator('_auto_focus'),
			setTop : Dialog._basicMutator('_top'),
			onloadRegister : function(a) {
				$A(a).forEach(function(b) {
					if (typeof b == 'string')
						b = new Function(b);
					this._onload_handlers.push(b.bind(this));
				}.bind(this));
				return this;
			},
			setAsyncURL : function(a) {
				return this.setAsync(new AsyncRequest(a));
			},
			setAsync : function(a) {
				var c = function(f) {
					if (this._async_request != a)
						return;
					this._async_request = null;
					var e = f.getPayload();
					if (typeof e == 'string') {
						this.setBody(e);
					} else
						this._setFromModel(e);
					this._update(true);
				}.bind(this);
				var b = a.getData();
				b.__d = 1;
				a.setData(b);
				var d = bind(this, 'hide');
				a.setHandler(chain(a.getHandler(), c)).setErrorHandler(
						chain(d, a.getErrorHandler()))
						.setTransportErrorHandler(
								chain(d, a.getTransportErrorHandler())).send();
				this._async_request = a;
				this._dirty();
				return this;
			},
			_dirty : function() {
				if (!this._is_dirty) {
					this._is_dirty = true;
					if (this._immediate_rendering) {
						this._update();
					} else
						bind(this, '_update', false).defer();
				}
			},
			_format : function(a) {
				if (typeof a == 'string')
					return HTML(a).setDeferred(true);
				return a;
			},
			_update : function(d) {
				if (!this._is_dirty && d !== true)
					return;
				this._is_dirty = false;
				if (!this._showing)
					return;
				if (this._autohide && !this._async_request
						&& !this._autohide_timeout)
					this._autohide_timeout = setTimeout(bind(this, 'hide'),
							this._autohide);
				if (!this._async_request || !this._show_loading) {
					if (this._loading_was_shown === true) {
						this._hide(true);
						this._loading_was_shown = false;
					}
					var b = [];
					if (this._summary)
						b.push($N('div', {
							className : 'dialog_summary'
						}, this._format(this._summary)));
					b.push($N('div', {
						className : 'dialog_body'
					}, this._format(this._body)));
					var a = this._getButtonContent();
					if (a.length)
						b.push($N('div', {
							className : 'dialog_buttons clearfix'
						}, a));
					if (this._footer)
						b.push($N('div', {
							className : 'dialog_footer'
						}, this._format(this._footer)));
					b = $N('div', {
						className : 'dialog_content'
					}, b);
					if (this._title) {
						var g = $N('span', this._format(this._title));
						var h = $N('h2', {
							className : 'dialog_title'
						}, g);
						CSS.conditionClass(h, 'secure', this._secure);
						b = [ h, b ];
					} else
						b = [ b ];
					this._renderDialog(b);
					CSS.conditionClass(this.getRoot(), 'omitDialogFooter',
							!a.length);
					if (this._clickButtonOnEnterInputName
							&& this._clickButtonOnEnter
							&& ge(this._clickButtonOnEnterInputName))
						Event
								.listen(
										ge(this._clickButtonOnEnterInputName),
										'keypress',
										function(i) {
											if (Event.getKeyCode(i) == KEYS.RETURN)
												this
														._handleButton(this._clickButtonOnEnter);
											return true;
										}.bind(this));
					for ( var f = 0; f < this._onload_handlers.length; ++f)
						try {
							this._onload_handlers[f]();
						} catch (e) {
						}
					this._onload_handlers = [];
				} else
					this.showLoading();
				var c = 2 * Dialog._BORDER_WIDTH;
				if (Dialog._useCSSBorders)
					c += 2 * Dialog._HALO_WIDTH;
				if (this._content_width) {
					c += this._content_width;
					if (!this._full_bleed)
						c += 2 * Dialog._PADDING_WIDTH;
				} else if (this._wide_dialog) {
					c += Dialog.SIZE.WIDE;
				} else
					c += Dialog.SIZE.STANDARD;
				this._popup.style.width = c + 'px';
			},
			_updateButtons : function() {
				if (!this._showing)
					return;
				var b = this._getButtonContent();
				var c = null;
				if (!this.getRoot())
					this._buildDialog();
				CSS.conditionClass(this.getRoot(), 'omitDialogFooter',
						!b.length);
				if (b.length)
					c = $N('div', {
						className : 'dialog_buttons clearfix'
					}, b);
				var d = DOM.scry(this._content, 'div.dialog_buttons')[0]
						|| null;
				if (!d) {
					if (!c)
						return;
					var a = this.getBody();
					if (a)
						DOM.insertAfter(a, c);
				} else if (c) {
					DOM.replace(d, c);
				} else
					DOM.remove(d);
			},
			_getButtonContent : function() {
				var b = [];
				if ((this._buttons && this._buttons.length > 0)
						|| this._buttons_message) {
					if (this._buttons_message)
						b.push($N('div', {
							className : 'dialog_buttons_msg'
						}, this._format(this._buttons_message)));
					if (this._buttons)
						for ( var d = 0; d < this._buttons.length; d++) {
							var a = this._buttons[d];
							var c = $N(
									'label',
									{
										className : 'uiButton uiButtonLarge uiButtonConfirm'
									}, $N('input', {
										type : 'button',
										name : a.name || '',
										value : a.label
									}));
							if (a.className) {
								a.className.split(/\s+/).each(function(e) {
									CSS.addClass(c, e);
								});
								if (CSS.hasClass(c, 'inputaux')) {
									CSS.removeClass(c, 'inputaux');
									CSS.removeClass(c, 'uiButtonConfirm');
								}
							}
							Event.listen(c.firstChild, 'click',
									this._handleButton.bind(this, a.name));
							b.push(c);
						}
				}
				return b;
			},
			_renderDialog : function(b) {
				if (Dialog.dialogStack === null) {
					KeyEventController.registerKey('ESCAPE',
							Dialog._handleEscapeKey, Dialog._keyDownFilter);
					onleaveRegister(Dialog._tearDown);
					Arbiter.subscribe('page_transition', Dialog._tearDown);
				}
				if (!this._obj)
					this._buildDialog();
				if (this._class_name)
					CSS.addClass(this._obj, this._class_name);
				CSS.conditionClass(this._obj, 'full_bleed', this._full_bleed);
				if (typeof b == 'string')
					b = HTML(b).setDeferred(this._immediate_rendering !== true);
				DOM.setContent(this._content, b);
				this._showDialog();
				if (this._auto_focus)
					Form.focusFirst.bind(this, this._content).defer();
				var a = Vector2.getElementDimensions(this._content).y
						+ Vector2.getElementPosition(this._content).y;
				Dialog._bottoms.push(a);
				this._bottom = a;
				Dialog._updateMaxBottom();
				return this;
			},
			_buildDialog : function() {
				this._obj = $N('div', {
					className : 'generic_dialog'
				});
				this._obj.style.display = 'none';
				DOM.getRootElement().appendChild(this._obj);
				if (!this._popup)
					this._popup = $N('div', {
						className : 'generic_dialog_popup'
					});
				this._popup.style.left = this._popup.style.top = '';
				this._obj.appendChild(this._popup);
				this._buildDialogContent();
			},
			_showDialog : function() {
				if (this._modal)
					if (this._overlay) {
						this._overlay.style.display = '';
					} else
						this._buildOverlay();
				if (this._obj && this._obj.style.display) {
					this._obj.style.visibility = 'hidden';
					this._obj.style.display = '';
					this._resetDialog();
					this._obj.style.visibility = '';
					this._obj.dialog = this;
				} else
					this._resetDialog();
				clearInterval(this.active_hiding);
				this.active_hiding = setInterval(this._activeResize.bind(this),
						500);
				if (!Dialog.dialogStack)
					Dialog.dialogStack = [];
				var c = Dialog.dialogStack;
				if (c.length) {
					var a = c[c.length - 1];
					if (a != this
							&& (!a._is_stackable || (a._show_loading && a._loading_was_shown)))
						a._hide();
					for ( var b = c.length - 1; b >= 0; b--)
						if (c[b] == this) {
							c.splice(b, 1);
						} else if (!c[b]._shown_while_stacked)
							c[b]._hide(true);
				}
				c.push(this);
				return this;
			},
			_activeResize : function() {
				if (this.last_offset_height != this._content.offsetHeight)
					this.last_offset_height = this._content.offsetHeight;
			},
			_buildDialogContent : function() {
				CSS.addClass(this._obj, 'pop_dialog');
				if (intl_locale_is_rtl())
					CSS.addClass(this._obj, 'pop_dialog_rtl');
				var a;
				if (Dialog._useCSSBorders) {
					a = '<div class="pop_container_advanced">' + '<div class="pop_content" id="pop_content"></div>' + '</div>';
				} else
					a = '<div class="pop_container">'
							+ '<div class="pop_verticalslab"></div>'
							+ '<div class="pop_horizontalslab"></div>'
							+ '<div class="pop_topleft"></div>'
							+ '<div class="pop_topright"></div>'
							+ '<div class="pop_bottomright"></div>'
							+ '<div class="pop_bottomleft"></div>'
							+ '<div class="pop_content pop_content_old" id="pop_content"></div>'
							+ '</div>';
				DOM.setContent(this._popup, HTML(a));
				this._frame = DOM.find(this._popup, 'div.pop_content');
				this._content = this._frame;
			},
			_buildOverlay : function() {
				this._overlay = $N('div', {
					id : 'generic_dialog_overlay'
				});
				if (this._modal_class)
					CSS.addClass(this._overlay, this._modal_class);
				if (this._semi_modal) {
					var a = function(b) {
						if (b.getTarget() == this._obj
								|| b.getTarget() == this._overlay)
							this.hide();
					}.bind(this);
					Event.listen(this._obj, 'click', a);
					Event.listen(this._overlay, 'click', a);
				}
				if (ua.ie() < 7)
					this._overlay.style.height = Vector2
							.getDocumentDimensions().y + 'px';
				onloadRegister(function() {
					document.body.appendChild(this._overlay);
				}.bind(this));
			},
			_resetDialog : function() {
				if (!this._popup)
					return;
				this._resetDialogObj();
			},
			_resetDialogObj : function() {
				var c = DOM.find(this._popup, 'div.pop_content');
				var b = Vector2.getScrollPosition().y;
				var f = Vector2.getViewportDimensions().y;
				var d = Vector2.getElementDimensions(c).y;
				var e = b + this._top + 'px';
				if (this._top + d > f) {
					var a = Math.max(f - d, 0);
					e = ((a / 2) + b) + 'px';
				}
				this._popup.style.top = e;
			},
			_fadeOut : function(b) {
				if (!this._popup)
					return;
				try {
					animation(this._obj).duration(0).checkpoint().to('opacity',
							0).hide().duration(250).ondone(
							this._hide.bind(this, b)).go();
				} catch (a) {
					this._hide(b);
				}
			},
			_hide : function(d) {
				if (this._obj)
					this._obj.style.display = 'none';
				if (this._overlay)
					if (d) {
						this._overlay.style.display = 'none';
					} else {
						DOM.remove(this._overlay);
						this._overlay = null;
					}
				if (this.timeout) {
					clearTimeout(this.timeout);
					this.timeout = null;
				}
				if (this._hidden_objects.length) {
					for ( var b = 0, c = this._hidden_objects.length; b < c; b++)
						this._hidden_objects[b].style.visibility = '';
					this._hidden_objects = [];
				}
				clearInterval(this.active_hiding);
				if (this._bottom) {
					var a = Dialog._bottoms;
					a.splice(a.indexOf(this._bottom), 1);
					Dialog._updateMaxBottom();
				}
				if (d)
					return;
				this.destroy();
			},
			destroy : function() {
				if (Dialog.dialogStack && Dialog.dialogStack.length) {
					var b = Dialog.dialogStack;
					for ( var a = b.length - 1; a >= 0; a--)
						if (b[a] == this)
							b.splice(a, 1);
					if (b.length)
						b[b.length - 1]._showDialog();
				}
				if (this._obj) {
					DOM.remove(this._obj);
					this._obj = null;
				}
				if (this._close_handler)
					this._close_handler( {
						return_data : this._return_data
					});
			},
			_handleButton : function(a) {
				if (typeof a == 'string')
					a = Dialog._findButton(this._buttons, a);
				if (!a)
					return;
				var b = Dialog.call_or_eval(a, a.handler);
				if (b === false)
					return;
				if (a.name == 'cancel') {
					this.cancel();
				} else if (Dialog.call_or_eval(this, this._handler, {
					button : a
				}) !== false)
					this.hide();
			},
			_submitForm : function(d, e, b) {
				var c = this.getFormData();
				c[b.name] = b.label;
				if (this._extra_data)
					copy_properties(c, this._extra_data);
				var a = new AsyncRequest().setURI(e).setData(c).setMethod(d)
						.setReadOnly(d == 'GET');
				this.setAsync(a);
				return false;
			},
			_setFromModel : function(c) {
				var a = {};
				copy_properties(a, c);
				if (a.immediateRendering) {
					this.setImmediateRendering(a.immediateRendering);
					delete a.immediateRendering;
				}
				for ( var d in a) {
					if (d == 'onloadRegister') {
						this.onloadRegister(a[d]);
						continue;
					}
					var b = this['set' + d.substr(0, 1).toUpperCase()
							+ d.substr(1)];
					if (!(!b))
						b.apply(this, $A(a[d]));
				}
			},
			_updateBottom : function() {
				var a = Vector2.getElementDimensions(this._content).y
						+ Vector2.getElementPosition(this._content).y;
				Dialog._bottoms[Dialog._bottoms.length - 1] = a;
				Dialog._updateMaxBottom();
			}
		});
function AsyncRequest(uri) {
	var dispatchResponse = bind(
			this,
			function(asyncResponse) {
				try {
					this.clearStatusIndicator();
					this._measureSaved && this._measureSaved();
					if (this._isPrefetch) {
						this._isPrefetch = false;
						return;
					}
					if (!this.isRelevant()) {
						invokeErrorHandler(1010);
						return;
					}
					if (this.initialHandler(asyncResponse) !== false) {
						clearTimeout(this.timer);
						if (this.handler)
							try {
								var suppress_onload = this
										.handler(asyncResponse);
							} catch (exception) {
								asyncResponse.is_last
										&& this.finallyHandler(asyncResponse);
								throw exception;
							}
						asyncResponse.is_last
								&& this.finallyHandler(asyncResponse);
						if (suppress_onload !== AsyncRequest.suppressOnloadToken) {
							var onload = asyncResponse.onload;
							if (onload)
								for ( var ii = 0; ii < onload.length; ii++)
									try {
										(new Function(onload[ii])).apply(this);
									} catch (exception) {
									}
							if (this.lid && !asyncResponse.isReplay())
								Arbiter
										.inform(
												'tti_ajax',
												{
													s : this.lid,
													d : [
															this._sendTimeStamp || 0,
															(this._sendTimeStamp && this._responseTime) ? (this._responseTime - this._sendTimeStamp)
																	: 0 ]
												}, Arbiter.BEHAVIOR_EVENT);
							var onafterload = asyncResponse.onafterload;
							if (onafterload)
								for ( var ii = 0; ii < onafterload.length; ii++)
									try {
										(new Function(onafterload[ii]))
												.apply(this);
									} catch (exception) {
									}
						}
						var invalidate_cache = asyncResponse.invalidate_cache;
						if (invalidate_cache && invalidate_cache.length)
							Arbiter.inform(Arbiter.PAGECACHE_INVALIDATE,
									invalidate_cache);
					}
					if (asyncResponse.cacheObservation
							&& typeof (TabConsoleCacheobserver) != 'undefined'
							&& TabConsoleCacheobserver.instance)
						TabConsoleCacheobserver.getInstance()
								.addAsyncObservation(
										asyncResponse.cacheObservation);
				} catch (exception) {
				}
			});
	var replayResponses = bind(this, function() {
		if (is_empty(this._asyncResponses))
			return;
		this.setNewSerial();
		for ( var ii = 0; ii < this._asyncResponses.length; ++ii) {
			var r = this._asyncResponses[ii];
			invokeResponseHandler(r, true);
		}
	});
	var dispatchErrorResponse = bind(
			this,
			function(asyncResponse, isTransport) {
				try {
					this.clearStatusIndicator();
					var async_error = asyncResponse.getError();
					if (this._sendTimeStamp) {
						var _duration = (+new Date()) - this._sendTimeStamp;
						var xfb_ip = this._xFbServer || '-';
						asyncResponse.logError('async_error', _duration + ':'
								+ xfb_ip);
					} else
						asyncResponse.logError('async_error');
					if ((!this.isRelevant()) || async_error === 1010)
						return;
					if (async_error == 1357008 || async_error == 1357007
							|| async_error == 1442002 || async_error == 1357001) {
						var is_confirmation = false;
						if (async_error == 1357008 || async_error == 1357007)
							is_confirmation = true;
						var payload = asyncResponse.getPayload();
						this._displayServerDialog(payload.__dialog,
								is_confirmation);
					} else if (this.initialHandler(asyncResponse) !== false) {
						clearTimeout(this.timer);
						try {
							if (isTransport) {
								this.transportErrorHandler(asyncResponse);
							} else
								this.errorHandler(asyncResponse);
						} catch (exception) {
							this.finallyHandler(asyncResponse);
							throw exception;
						}
						this.finallyHandler(asyncResponse);
					}
				} catch (exception) {
				}
			});
	var _interpretTransportResponse = bind(this, function() {
		if (this.getOption('suppressEvaluation')) {
			var r = new AsyncResponse(this, this.transport);
			return {
				asyncResponse : r
			};
		}
		var _sendError = function(p, error_code, str) {
			if (!window.send_error_signal)
				return;
			send_error_signal('async_xport_resp', error_code + ':'
					+ (this._xFbServer || '-') + ':' + p.getURI() + ':'
					+ str.length + ':' + str.substr(0, 1600));
		};
		var shield = "for (;;);";
		var shieldlen = shield.length;
		var text = this.transport.responseText;
		if (text.length <= shieldlen) {
			_sendError(this, '1008_empty', text);
			return {
				transportError : 'Response too short on async to ' + this
						.getURI()
			};
		}
		var offset = 0;
		while (text.charAt(offset) == " " || text.charAt(offset) == "\n")
			offset++;
		offset && text.substring(offset, offset + shieldlen) == shield;
		var safeResponse = text.substring(offset + shieldlen);
		try {
			var response = eval('(' + safeResponse + ')');
		} catch (exception) {
			_sendError(this, '1008_excep', text);
			return {
				transportError : 'eval() failed on async to ' + this.getURI()
			};
		}
		return interpretResponse(response);
	});
	var interpretResponse = bind(this, function(response) {
		if (response.redirect)
			return {
				redirect : response.redirect
			};
		var r = new AsyncResponse(this);
		if (typeof (response.payload) == 'undefined'
				|| typeof (response.error) == 'undefined'
				|| typeof (response.errorDescription) == 'undefined'
				|| typeof (response.errorSummary) == 'undefined'
				|| typeof (response.errorIsWarning) == 'undefined') {
			r.payload = response;
		} else
			copy_properties(r, response);
		return {
			asyncResponse : r
		};
	});
	var invokeResponseHandler = bind(this, function(interp, is_replay) {
		if (typeof (interp.redirect) != 'undefined') {
			(function() {
				this.setURI(interp.redirect).send();
			}).bind(this).defer();
			return;
		}
		if (this.handler || this.errorHandler || this.transportErrorHandler)
			if (typeof (interp.asyncResponse) != 'undefined') {
				var r = interp.asyncResponse;
				r.setReplay(!!is_replay);
				if (!this.isRelevant()) {
					invokeErrorHandler(1010);
					return;
				}
				if (r.inlinejs)
					eval_global(r.inlinejs);
				if (r.lid) {
					this._responseTime = (+new Date());
					if (window.CavalryLogger)
						this.cavalry = CavalryLogger.getInstance(r.lid);
					this.lid = r.lid;
				}
				if (r.getError() && !r.getErrorIsWarning()) {
					var fn = dispatchErrorResponse;
				} else {
					var fn = dispatchResponse;
					if (this._replayable && !is_replay && !r.dontReplay) {
						this._asyncResponses = this._asyncResponses || [];
						this._asyncResponses.push(interp);
					}
				}
				Bootloader.setResourceMap(r.resource_map);
				if (r.bootloadable)
					Bootloader.enableBootload(r.bootloadable);
				fn = fn.shield(null, r);
				fn = fn.defer.bind(fn);
				var is_transitional = false;
				if (this.preBootloadHandler)
					is_transitional = this.preBootloadHandler(r);
				r.css = r.css || [];
				r.js = r.js || [];
				Bootloader.loadResources(r.css.concat(r.js), fn,
						is_transitional, this.getURI());
			} else if (typeof (interp.transportError) != 'undefined') {
				if (this._xFbServer) {
					invokeErrorHandler(1008);
				} else
					invokeErrorHandler(1012);
			} else
				invokeErrorHandler(1007);
	});
	var invokeErrorHandler = bind(
			this,
			function(explicitError) {
				try {
					if (!window.loaded)
						return;
				} catch (ex) {
					return;
				}
				var r = new AsyncResponse(this);
				var err;
				try {
					err = explicitError || this.transport.status || 1004;
				} catch (ex) {
					err = 1005;
				}
				if (this._requestAborted)
					err = 1011;
				try {
					if (this.responseText == '')
						err = 1002;
				} catch (ignore) {
				}
				if (this.transportErrorHandler) {
					var desc, summary;
					var silent = true;
					if (false === navigator.onLine) {
						summary = _tx("No Network Connection");
						desc = _tx("Your browser appears to be offline. Please check your internet connection and try again.");
						err = 1006;
						silent = false;
					} else if (err >= 300 && err <= 399) {
						summary = _tx("Redirection");
						desc = _tx("Your access to Facebook was redirected or blocked by a third party at this time, please contact your ISP or reload. ");
						redir_url = this.transport
								.getResponseHeader("Location");
						if (redir_url)
							goURI(redir_url, true);
						silent = true;
					} else {
						summary = _tx("Oops!");
						desc = _tx("Something went wrong. We're working on getting this fixed as soon as we can. You may be able to try again.");
					}
					!this.getOption('suppressErrorAlerts');
					copy_properties(r, {
						error : err,
						errorSummary : summary,
						errorDescription : desc,
						silentError : silent
					});
					dispatchErrorResponse(r, true);
				}
			});
	var handleResponse = function(response) {
		var asyncResponse = this.interpretResponse(response);
		this.invokeResponseHandler(asyncResponse);
	};
	var onStateChange = function() {
		try {
			if (this.transport.readyState == 4) {
				try {
					if (typeof (this.transport.getResponseHeader) != 'undefined'
							&& this.transport.getResponseHeader('X-FB-Server'))
						this._xFbServer = this.transport
								.getResponseHeader('X-FB-Server');
				} catch (ex) {
				}
				if (this.transport.status >= 200 && this.transport.status < 300) {
					invokeResponseHandler(_interpretTransportResponse());
				} else if (ua.safari()
						&& (typeof (this.transport.status) == 'undefined')) {
					invokeErrorHandler(1002);
				} else if (window.send_error_signal && window.Env
						&& window.Env.retry_ajax_on_network_error
						&& this.transport.status in {
							0 : 1,
							12029 : 1,
							12030 : 1,
							12031 : 1,
							12152 : 1
						} && this.remainingRetries > 0) {
					--this.remainingRetries;
					delete this.transport;
					this.send(true);
					return;
				} else
					invokeErrorHandler();
				if (this.getOption('asynchronous') !== false)
					delete this.transport;
			}
		} catch (exception) {
			try {
				if (!window.loaded)
					return;
			} catch (ex) {
				return;
			}
			delete this.transport;
			if (this.remainingRetries > 0) {
				--this.remainingRetries;
				this.send(true);
			} else {
				!this.getOption('suppressErrorAlerts');
				if (window.send_error_signal)
					send_error_signal('async_xport_resp', '1007:'
							+ (this._xFbServer || '-') + ':' + this.getURI()
							+ ':' + exception.message);
				invokeErrorHandler(1007);
			}
		}
	};
	var onJSONPResponse = function(data, more_chunked_response) {
		var is_first = (this.is_first === undefined);
		this.is_first = is_first;
		if (this.transportIframe && !more_chunked_response)
			(function(x) {
				document.body.removeChild(x);
			}).bind(null, this.transportIframe).defer();
		var r = this.interpretResponse(data);
		r.asyncResponse.is_first = is_first;
		r.asyncResponse.is_last = !more_chunked_response;
		this.invokeResponseHandler(r);
		return more_chunked_response;
	};
	copy_properties(this, {
		onstatechange : onStateChange,
		onjsonpresponse : onJSONPResponse,
		replayResponses : replayResponses,
		invokeResponseHandler : invokeResponseHandler,
		interpretResponse : interpretResponse,
		handleResponse : handleResponse,
		transport : null,
		method : 'POST',
		uri : '',
		timeout : null,
		timer : null,
		initialHandler : bagofholding,
		handler : null,
		errorHandler : null,
		transportErrorHandler : null,
		timeoutHandler : null,
		finallyHandler : bagofholding,
		serverDialogCancelHandler : bagofholding,
		relativeTo : null,
		statusElement : null,
		statusClass : '',
		data : {},
		context : {},
		readOnly : false,
		writeRequiredParams : [ 'post_form_id' ],
		remainingRetries : 0,
		option : {
			asynchronous : true,
			suppressErrorHandlerWarning : false,
			suppressEvaluation : false,
			suppressErrorAlerts : false,
			retries : 0,
			jsonp : false,
			bundle : false,
			useIframeTransport : false,
			tfbEndpoint : true
		},
		_replayable : undefined,
		_replayKey : '',
		_isPrefetch : false
	});
	this.errorHandler = AsyncResponse.defaultErrorHandler;
	this.transportErrorHandler = bind(this, 'errorHandler');
	if (uri != undefined)
		this.setURI(uri);
	return this;
}
Arbiter.subscribe("page_transition", function(b, a) {
	AsyncRequest._id_threshold = a.id;
});
copy_properties(
		AsyncRequest,
		{
			pingURI : function(c, a, b) {
				a = a || {};
				return new AsyncRequest().setURI(c).setData(a).setOption(
						'asynchronous', !b).setOption(
						'suppressErrorHandlerWarning', true).setErrorHandler(
						bagofholding).setTransportErrorHandler(bagofholding)
						.send();
			},
			receiveJSONPResponse : function(b, a, c) {
				if (this._JSONPReceivers[b])
					if (!this._JSONPReceivers[b](a, c))
						delete this._JSONPReceivers[b];
			},
			_hasBundledRequest : function() {
				return AsyncRequest._allBundledRequests.length > 0;
			},
			stashBundledRequest : function() {
				var a = AsyncRequest._allBundledRequests;
				AsyncRequest._allBundledRequests = [];
				return a;
			},
			setBundledRequestProperties : function(b) {
				var c = null;
				if (b.stashedRequests)
					AsyncRequest._allBundledRequests = AsyncRequest._allBundledRequests
							.concat(b.stashedRequests);
				if (!AsyncRequest._hasBundledRequest()) {
					var a = b.callback;
					a && a();
				} else {
					copy_properties(AsyncRequest._bundledRequestProperties, b);
					if (b.start_immediately)
						c = AsyncRequest._sendBundledRequests();
				}
				return c;
			},
			_bundleRequest : function(b) {
				if (b.getOption('jsonp') || b.getOption('useIframeTransport')) {
					b.setOption('bundle', false);
					return false;
				} else if (!b.uri.isFacebookURI()) {
					b.setOption('bundle', false);
					return false;
				} else if (!b.getOption('asynchronous')) {
					b.setOption('bundle', false);
					return false;
				}
				var a = b.uri.getPath();
				if (!AsyncRequest._bundleTimer)
					AsyncRequest._bundleTimer = setTimeout(function() {
						AsyncRequest._sendBundledRequests();
					}, 0);
				AsyncRequest._allBundledRequests.push( [ a, b ]);
				return true;
			},
			_sendBundledRequests : function() {
				clearTimeout(AsyncRequest._bundleTimer);
				AsyncRequest._bundleTimer = null;
				var a = AsyncRequest._allBundledRequests;
				AsyncRequest._allBundledRequests = [];
				var e = {};
				copy_properties(e, AsyncRequest._bundledRequestProperties);
				AsyncRequest._bundledRequestProperties = {};
				if (is_empty(e) && a.length == 1) {
					var g = a[0][1];
					g.setOption('bundle', false).send();
					return g;
				}
				var d = function() {
					e.callback && e.callback();
				};
				if (a.length === 0) {
					d();
					return null;
				}
				var b = [];
				for ( var c = 0; c < a.length; c++)
					b.push( [ a[c][0], URI.implodeQuery(a[c][1].data) ]);
				var f = {
					data : b
				};
				if (e.extra_data)
					copy_properties(f, e.extra_data);
				var g = new AsyncRequest();
				g
						.setURI('/ajax/proxy.php')
						.setData(f)
						.setMethod('POST')
						.setInitialHandler(e.onInitialResponse || bagof(true))
						.setAllowCrossPageTransition(true)
						.setHandler(
								function(l) {
									var k = l.getPayload();
									var n = k.responses;
									if (n.length != a.length) {
										return;
									} else
										for ( var i = 0; i < a.length; i++) {
											var j = a[i][0];
											var m = a[i][1];
											m.id = this.id;
											if (n[i][0] != j) {
												m
														.invokeResponseHandler( {
															transportError : 'Wrong response order in bundled request to ' + j
														});
												continue;
											}
											var h = m
													.interpretResponse(n[i][1]);
											m.invokeResponseHandler(h);
										}
								}).setTransportErrorHandler(function(m) {
							var k = [];
							var i = {
								transportError : m.errorDescription
							};
							for ( var h = 0; h < a.length; h++) {
								var j = a[h][0];
								var l = a[h][1];
								k.push(j);
								l.id = this.id;
								l.invokeResponseHandler(i);
							}
						}).setFinallyHandler(function(h) {
							d();
						}).send();
				return g;
			},
			bootstrap : function(c, b, d) {
				var e = 'GET';
				var f = true;
				var a = {};
				c = URI(c);
				if (d || (b && b.rel == 'async-post')) {
					e = 'POST';
					f = false;
					a = c.getQueryData();
					c.setQueryData( {});
				}
				var g = Parent.byClass(b, 'stat_elem') || b;
				if (g && CSS.hasClass(g, 'async_saving'))
					return false;
				new AsyncRequest(c).setReadOnly(f).setMethod(e).setData(a)
						.setNectarModuleDataSafe(b).setStatusElement(g)
						.setRelativeTo(b).send();
				return false;
			},
			post : function(b, a) {
				new AsyncRequest(b).setReadOnly(false).setMethod('POST')
						.setData(a).send();
				return false;
			},
			clearCache : function() {
				AsyncRequest._reqsCache = {};
			},
			getLastId : function() {
				return AsyncRequest._last_id;
			},
			_JSONPReceivers : {},
			_allBundledRequests : [],
			_bundledRequestProperties : {},
			_bundleTimer : null,
			suppressOnloadToken : {},
			REPLAYABLE_AJAX : 'ajax/replayable',
			_last_id : 2,
			_id_threshold : 2,
			_reqsCache : {}
		});
copy_properties(
		AsyncRequest.prototype,
		{
			setMethod : function(a) {
				this.method = a.toString().toUpperCase();
				return this;
			},
			getMethod : function() {
				return this.method;
			},
			setData : function(a) {
				this.data = a;
				return this;
			},
			getData : function() {
				return this.data;
			},
			setContextData : function(b, c, a) {
				a = a === undefined ? true : a;
				if (a)
					this.context['_log_' + b] = c;
				return this;
			},
			setURI : function(a) {
				var b = URI(a);
				if (this.getOption('useIframeTransport') && !b.isFacebookURI())
					return this;
				if (!this.getOption('jsonp')
						&& !this.getOption('useIframeTransport')
						&& !b.isSameOrigin())
					return this;
				this.uri = b;
				return this;
			},
			getURI : function() {
				return this.uri.toString();
			},
			setInitialHandler : function(a) {
				this.initialHandler = a;
				return this;
			},
			setHandler : function(a) {
				if (!(typeof (a) != 'function'))
					this.handler = a;
				return this;
			},
			getHandler : function() {
				return this.handler;
			},
			setErrorHandler : function(a) {
				if (!(typeof (a) != 'function'))
					this.errorHandler = a;
				return this;
			},
			setTransportErrorHandler : function(a) {
				this.transportErrorHandler = a;
				return this;
			},
			getErrorHandler : function() {
				return this.errorHandler;
			},
			getTransportErrorHandler : function() {
				return this.transportErrorHandler;
			},
			setTimeoutHandler : function(b, a) {
				if (!(typeof (a) != 'function')) {
					this.timeout = b;
					this.timeoutHandler = a;
				}
				return this;
			},
			resetTimeout : function(a) {
				if (!(this.timeoutHandler === null))
					if (a === null) {
						this.timeout = null;
						clearTimeout(this.timer);
						this.timer = null;
					} else {
						this.timeout = a;
						clearTimeout(this.timer);
						this.timer = this._handleTimeout.bind(this).defer(
								this.timeout);
					}
				return this;
			},
			_handleTimeout : function() {
				this.abandon();
				this.timeoutHandler(this);
			},
			setNewSerial : function() {
				this.id = ++AsyncRequest._last_id;
				return this;
			},
			setFinallyHandler : function(a) {
				this.finallyHandler = a;
				return this;
			},
			setServerDialogCancelHandler : function(a) {
				this.serverDialogCancelHandler = a;
				return this;
			},
			setPreBootloadHandler : function(a) {
				this.preBootloadHandler = a;
				return this;
			},
			setReadOnly : function(a) {
				if (!(typeof (a) != 'boolean'))
					this.readOnly = a;
				return this;
			},
			setFBMLForm : function() {
				this.writeRequiredParams = [ "fb_sig" ];
				return this;
			},
			getReadOnly : function() {
				return this.readOnly;
			},
			setRelativeTo : function(a) {
				this.relativeTo = a;
				return this;
			},
			getRelativeTo : function() {
				return this.relativeTo;
			},
			setStatusClass : function(a) {
				this.statusClass = a;
				return this;
			},
			setStatusElement : function(a) {
				this.statusElement = a;
				return this;
			},
			getStatusElement : function() {
				return ge(this.statusElement);
			},
			isRelevant : function() {
				if (!env_get('ajax_threshold') == '1')
					return true;
				if (this._allowCrossPageTransition)
					return true;
				if (!this.id)
					return true;
				return this.id > AsyncRequest._id_threshold;
			},
			clearStatusIndicator : function() {
				var a = this.getStatusElement();
				if (a) {
					CSS.removeClass(a, 'async_saving');
					CSS.removeClass(a, this.statusClass);
				}
			},
			addStatusIndicator : function() {
				var a = this.getStatusElement();
				if (a) {
					CSS.addClass(a, 'async_saving');
					CSS.addClass(a, this.statusClass);
				}
			},
			specifiesWriteRequiredParams : function() {
				return this.writeRequiredParams.every(function(a) {
					this.data[a] = this.data[a] || Env[a]
							|| (ge(a) || {}).value;
					if (this.data[a] !== undefined)
						return true;
					return false;
				}, this);
			},
			setReplayable : function(b, a) {
				this._replayable = b;
				this._replayKey = a || '';
				return this;
			},
			setOption : function(a, b) {
				if (typeof (this.option[a]) != 'undefined')
					this.option[a] = b;
				return this;
			},
			getOption : function(a) {
				typeof (this.option[a]) == 'undefined';
				return this.option[a];
			},
			abort : function() {
				if (this.transport) {
					var a = this.getTransportErrorHandler();
					this.setOption('suppressErrorAlerts', true);
					this.setTransportErrorHandler(bagofholding);
					this._requestAborted = 1;
					this.transport.abort();
					this.setTransportErrorHandler(a);
				}
			},
			abandon : function() {
				clearTimeout(this.timer);
				this.setOption('suppressErrorAlerts', true).setHandler(
						bagofholding).setErrorHandler(bagofholding)
						.setTransportErrorHandler(bagofholding);
				if (this.transport) {
					this._requestAborted = 1;
					this.transport.abort();
				}
			},
			setNectarActionData : function(a) {
				if (this.data.nctr === undefined)
					this.data.nctr = {};
				this.data.nctr._ia = 1;
				if (a) {
					if (this.data.nctr._as === undefined)
						this.data.nctr._as = {};
					copy_properties(this.data.nctr._as, a);
				}
				return this;
			},
			setNectarData : function(a) {
				if (a) {
					if (this.data.nctr === undefined)
						this.data.nctr = {};
					copy_properties(this.data.nctr, a);
				}
				return this;
			},
			setNectarModuleDataSafe : function(a) {
				if (this.setNectarModuleData)
					this.setNectarModuleData(a);
				return this;
			},
			setNectarImpressionIdSafe : function() {
				if (this.setNectarImpressionId)
					this.setNectarImpressionId();
				return this;
			},
			setPrefetch : function(a) {
				this._isPrefetch = a;
				this.setAllowCrossPageTransition(true);
				return this;
			},
			setAllowCrossPageTransition : function(a) {
				this._allowCrossPageTransition = !!a;
				return this;
			},
			send : function(d) {
				if (this._checkCache && this._checkCache())
					return true;
				d = d || false;
				if (!this.uri)
					return false;
				!this.errorHandler
						&& !this.getOption('suppressErrorHandlerWarning');
				if (this.getOption('jsonp') && this.method != 'GET')
					this.setMethod('GET');
				if (this.getOption('useIframeTransport')
						&& this.method != 'GET')
					this.setMethod('GET');
				this.timeoutHandler !== null
						&& (this.getOption('jsonp') || this
								.getOption('useIframeTransport'));
				if (!this.getReadOnly()) {
					if (!this.specifiesWriteRequiredParams())
						return false;
					if (this.method != 'POST')
						return false;
				}
				if (this.method == 'POST' && this.getOption('tfbEndpoint')) {
					this.data.fb_dtsg = Env.fb_dtsg;
					this.data.lsd = getCookie('lsd');
				}
				this._replayable = (!this.getReadOnly() && this._replayable !== false)
						|| this._replayable;
				if (this._replayable)
					Arbiter.inform(AsyncRequest.REPLAYABLE_AJAX, this);
				if (!is_empty(this.context) && this.getOption('tfbEndpoint')) {
					copy_properties(this.data, this.context);
					this.data.ajax_log = 1;
				}
				if (!this.getReadOnly() && this.getOption('tfbEndpoint')
						&& this.method == 'POST'
						&& this.data.post_form_id_source === undefined)
					this.data.post_form_id_source = 'AsyncRequest';
				if (this.getOption('bundle')
						&& AsyncRequest._bundleRequest(this))
					return true;
				this.setNewSerial();
				if (this.getOption('tfbEndpoint'))
					this.uri.addQueryData( {
						__a : 1
					});
				var b = env_get('haste_combo');
				if (b)
					setCookie('force_hcfb', 1, 1000);
				this.finallyHandler = async_callback(this.finallyHandler,
						'final');
				var i, e;
				if (this.method == 'GET') {
					i = this.uri.addQueryData(this.data).toString();
					e = '';
				} else {
					i = this.uri.toString();
					e = URI.implodeQuery(this.data);
				}
				if (this.getOption('jsonp')
						|| this.getOption('useIframeTransport')) {
					i = this.uri.addQueryData( {
						__a : this.id
					}).toString();
					AsyncRequest._JSONPReceivers[this.id] = async_callback(
							bind(this, 'onjsonpresponse'), 'json');
					if (this.getOption('jsonp')) {
						(function() {
							document.body.appendChild($N('script', {
								src : i,
								type : "text/javascript"
							}));
						}).bind(this).defer();
					} else {
						var f = {
							position : 'absolute',
							top : '-1000px',
							left : '-1000px',
							width : '80px',
							height : '80px'
						};
						this.transportIframe = $N('iframe', {
							src : i,
							style : f
						});
						document.body.appendChild(this.transportIframe);
					}
					return true;
				}
				if (this.transport)
					return false;
				var h = null;
				try {
					h = new XMLHttpRequest();
				} catch (c) {
				}
				if (!h)
					try {
						h = new ActiveXObject("Msxml2.XMLHTTP");
					} catch (c) {
					}
				if (!h)
					try {
						h = new ActiveXObject("Microsoft.XMLHTTP");
					} catch (c) {
					}
				if (!h)
					return false;
				h.onreadystatechange = async_callback(bind(this,
						'onstatechange'), 'xhr');
				if (!d)
					this.remainingRetries = this.getOption('retries');
				if (window.send_error_signal || window.ArbiterMonitor)
					this._sendTimeStamp = this._sendTimeStamp || (+new Date());
				this.transport = h;
				try {
					this.transport.open(this.method, i, this
							.getOption('asynchronous'));
				} catch (a) {
					return false;
				}
				var g = env_get('svn_rev');
				if (g)
					this.transport.setRequestHeader('X-SVN-Rev', String(g));
				if (this.method == 'POST')
					this.transport.setRequestHeader('Content-Type',
							'application/x-www-form-urlencoded');
				this.addStatusIndicator();
				this.transport.send(e);
				if (this.timeout !== null)
					this.resetTimeout(this.timeout);
				return true;
			},
			_displayServerDialog : function(c, b) {
				var a = new Dialog(c);
				if (b)
					a
							.setHandler(this._displayConfirmationHandler.bind(
									this, a));
				a.setCancelHandler(function() {
					this.serverDialogCancelHandler.apply(this, arguments);
					this.finallyHandler.apply(this, arguments);
				}.bind(this)).setCloseHandler(this.finallyHandler.bind(this))
						.show();
			},
			_displayConfirmationHandler : function(a) {
				this.data.confirmed = 1;
				copy_properties(this.data, a.getFormData());
				this.send();
			}
		});
function AsyncResponse(b, a) {
	copy_properties(this, {
		error : 0,
		errorSummary : null,
		errorDescription : null,
		onload : null,
		replay : false,
		payload : a || null,
		request : b || null,
		silentError : false,
		is_last : true
	});
	return this;
}
copy_properties(
		AsyncResponse,
		{
			defaultErrorHandler : function(b) {
				try {
					if (!b.silentError) {
						AsyncResponse.verboseErrorHandler(b);
					} else if (typeof (window.Env) == 'undefined'
							|| typeof (window.Env.silent_oops_errors) == 'undefined') {
						AsyncResponse.verboseErrorHandler(b);
					} else
						b.logErrorByGroup('silent', 10);
				} catch (a) {
					alert(b);
				}
			},
			verboseErrorHandler : function(b) {
				try {
					var summary = b.getErrorSummary();
					var desc = b.getErrorDescription();
					b.logErrorByGroup('popup', 10);
					if (b.silentError && desc == '')
						desc = _tx("Something went wrong. We're working on getting this fixed as soon as we can. You may be able to try again.");
					ErrorDialog.show(summary, desc);
				} catch (a) {
					alert(b);
				}
			}
		});
copy_properties(AsyncResponse.prototype, {
	getRequest : function() {
		return this.request;
	},
	getPayload : function() {
		return this.payload;
	},
	getError : function() {
		return this.error;
	},
	getErrorSummary : function() {
		return this.errorSummary;
	},
	setErrorSummary : function(a) {
		a = (a === undefined ? null : a);
		this.errorSummary = a;
		return this;
	},
	getErrorDescription : function() {
		return this.errorDescription;
	},
	getErrorIsWarning : function() {
		return this.errorIsWarning;
	},
	setReplay : function(a) {
		a = (a === undefined ? true : a);
		this.replay = !!a;
		return this;
	},
	isReplay : function() {
		return this.replay;
	},
	logError : function(a, b) {
		if (window.send_error_signal) {
			b = (b === undefined ? '' : (':' + b));
			var c = this.request.getURI();
			if (c && c.indexOf('scribe_endpoint.php') == -1)
				send_error_signal(a, this.error + ':' + (env_get('vip') || '-')
						+ b + ':' + this.request.getURI());
		}
	},
	logErrorByGroup : function(b, a) {
		if (Math.floor(Math.random() * a) == 0)
			if (this.error == 1357010 || this.error < 15000) {
				this.logError('async_error_oops_' + b);
			} else
				this.logError('async_error_logic_' + b);
	}
});
var DOMScroll = {
	getScrollState : function() {
		var d = Vector2.getViewportDimensions();
		var a = Vector2.getDocumentDimensions();
		var b = (a.x > d.x);
		var c = (a.y > d.y);
		b += 0;
		c += 0;
		return new Vector2(b, c);
	},
	_scrollbarSize : null,
	_initScrollbarSize : function() {
		var a = $N('p');
		a.style.width = '100%';
		a.style.height = '200px';
		var b = $N('div');
		b.style.position = 'absolute';
		b.style.top = '0px';
		b.style.left = '0px';
		b.style.visibility = 'hidden';
		b.style.width = '200px';
		b.style.height = '150px';
		b.style.overflow = 'hidden';
		b.appendChild(a);
		document.body.appendChild(b);
		var c = a.offsetWidth;
		b.style.overflow = 'scroll';
		var d = a.offsetWidth;
		if (c == d)
			d = b.clientWidth;
		document.body.removeChild(b);
		DOMScroll._scrollbarSize = c - d;
		if (DOMScroll._scrollbarSize < 5)
			DOMScroll._scrollbarSize = 15;
	},
	getScrollbarSize : function() {
		if (DOMScroll._scrollbarSize === null)
			DOMScroll._initScrollbarSize();
		return DOMScroll._scrollbarSize;
	},
	scrollTo : function(e, d, b, a) {
		d = d || d === undefined;
		if (!(e instanceof Vector2)) {
			var f = Vector2.getScrollPosition().x;
			var g = Vector2.getElementPosition($(e)).y;
			g = g
					- Math.min(0, Math.max(
							Vector2.getViewportDimensions().y / 3, 100));
			e = new Vector2(f, g, 'document');
		}
		if (b) {
			e.y -= Vector2.getViewportDimensions().y / 2;
		} else if (a) {
			e.y -= Vector2.getViewportDimensions().y;
			e.y += a;
		}
		e = e.convertTo('document');
		if (d && window.animation) {
			var c = document.body;
			animation(c).to('scrollTop', e.y).to('scrollLeft', e.x).ease(
					animation.ease.end).duration(750).go();
		} else if (window.scrollTo)
			window.scrollTo(e.x, e.y);
	}
};
function UntrustedLink(a, d, b, c) {
	this.dom = a;
	this.url = a.href;
	this.hash = d;
	this.func_get_params = c || function() {
		return {};
	};
	Event.listen(this.dom, 'click', this.onclick.bind(this));
	Event.listen(this.dom, 'mousedown', this.onmousedown.bind(this));
	Event.listen(this.dom, 'mouseup', this.onmouseup.bind(this));
	Event.listen(this.dom, 'mouseout', this.onmouseout.bind(this));
	this.onmousedown($E(b));
}
UntrustedLink.bootstrap = function(a, d, b, c) {
	if (a.__untrusted)
		return;
	a.__untrusted = true;
	new UntrustedLink(a, d, b, c);
};
UntrustedLink.prototype.getRewrittenURI = function() {
	var a = copy_properties( {
		u : this.url,
		h : this.hash
	}, this.func_get_params(this.dom));
	return new URI('/l.php').setQueryData(a).setSubdomain('www');
};
UntrustedLink.prototype.onclick = function() {
	(function() {
		this.dom.href = this.url;
	}).bind(this).defer(100);
	this.dom.href = this.getRewrittenURI();
};
UntrustedLink.prototype.onmousedown = function(a) {
	if (a.button == 2)
		this.dom.href = this.getRewrittenURI();
};
UntrustedLink.prototype.onmouseup = function() {
	this.dom.href = this.getRewrittenURI();
};
UntrustedLink.prototype.onmouseout = function() {
	this.dom.href = this.url;
};
function ElementController() {
	this.handlers = [ [], [] ];
}
copy_properties(ElementController, {
	ALL : 1,
	TARGETS : 2,
	MODIFIERS : 4,
	BUTTONS : 8
});
ElementController.prototype = {
	initialize : function() {
		this.initialize = bagofholding;
		onloadRegister(this.register.bind(this));
	},
	handle : function(e, event, a) {
		a = a || bagof(true);
		var b = this.handlers[0].concat(this.handlers[1]);
		for ( var c = 0, d = b.length; c < d; c++)
			if (a(b[c].filters, e, event) && b[c].callback(e, event) === false)
				return event.kill();
	},
	_registerHandler : function(b, a, c, d) {
		this.initialize();
		b[d ? 'unshift' : 'push']( {
			callback : a,
			filters : c || 0
		});
	},
	registerHandler : function(a, b, c) {
		this._registerHandler(this.handlers[0], a, b, c);
	},
	registerFallbackHandler : function(a, b, c) {
		this._registerHandler(this.handlers[1], a, b, c);
	}
};
var LinkController = new ElementController();
copy_properties(LinkController,
		{
			key : 'LinkControllerHandler',
			register : function() {
				Event.listen(document.documentElement, 'mousedown',
						this.handler.bind(this));
				Event.listen(document.documentElement, 'keydown', this.handler
						.bind(this));
			},
			handler : function(event) {
				var b = Parent.byTag(event.getTarget(), 'a');
				var a = b && b.getAttribute('href', 2);
				if (!a || b.rel || !this.usesWebProtocol(a)
						|| DataStore.get(b, this.key))
					return;
				DataStore.set(b, this.key, Event.listen(b, 'click', function(
						event) {
					if (a.charAt(a.length - 1) == '#') {
						event.prevent();
						return;
					}
					this.handle(b, event, this.filter);
				}.bind(this)));
			},
			filter : function(a, b, event) {
				if (a & ElementController.ALL)
					return true;
				if ((!(a & ElementController.TARGETS) && b.target)
						|| (!(a & ElementController.MODIFIERS) && event
								.getModifiers().any)
						|| (!(a & ElementController.BUTTONS)
								&& ua.safari() >= 525 && event.which != 1))
					return false;
				return true;
			},
			usesWebProtocol : function(a) {
				var b = a.match(/^(\w+):/);
				return !b || b[1].match(/^http/i);
			}
		});
var FormController = new ElementController();
copy_properties(FormController, {
	register : function() {
		Event.listen(document.documentElement, 'submit', this.handler
				.bind(this));
	},
	handler : function(event) {
		user_action(event.getTarget(), 'form', event);
		return this.handle(event.getTarget(), event);
	}
});
onloadRegister(function() {
	copy_properties(
			AsyncRequest.prototype,
			{
				setNectarModuleData : function(c) {
					if (this.method == 'POST') {
						var d = Env.module;
						if (c && d === undefined) {
							var b = {
								fbpage_fan_confirm : 1
							};
							var e = null;
							for ( var a = c; a && a != document.body; a = a.parentNode) {
								if (!a.id || typeof a.id !== 'string')
									continue;
								if (a.id.startsWith('pagelet_')) {
									d = a.id;
									break;
								}
								if (!e && b[a.id])
									e = a.id;
							}
							if (d === undefined && e)
								d = e;
						}
						if (d !== undefined) {
							if (this.data.nctr === undefined)
								this.data.nctr = {};
							this.data.nctr._mod = d;
						}
					}
				},
				setNectarImpressionId : function() {
					if (this.method == 'POST') {
						var a = env_get('impid');
						if (a !== undefined) {
							if (this.data.nctr === undefined)
								this.data.nctr = {};
							this.data.nctr._impid = a;
						}
					}
				}
			});
});
function htmlspecialchars(a) {
	if (typeof (a) == 'undefined' || a === null || !a.toString)
		return '';
	if (a === false) {
		return '0';
	} else if (a === true)
		return '1';
	return a.toString().replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(
			/'/g, '&#039;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function htmlize(a) {
	return htmlspecialchars(a).replace(/\n/g, '<br />');
}
function escape_js_quotes(a) {
	if (typeof (a) == 'undefined' || !a.toString)
		return '';
	return a.toString().replace(/\\/g, '\\\\').replace(/\n/g, '\\n').replace(
			/\r/g, '\\r').replace(/"/g, '\\x22').replace(/'/g, '\\\'').replace(
			/</g, '\\x3c').replace(/>/g, '\\x3e').replace(/&/g, '\\x26');
}
var DocumentTitle = (function(a) {
	return {
		get : function() {
			return a;
		},
		set : function(b, c) {
			document.title = b;
			if (!c) {
				a = b;
				Arbiter.inform('update_title', b);
			}
		}
	};
})(document.title);
function AjaxPipeRequest(b, a) {
	this._uri = b;
	this._query_data = a;
	this._request = new AsyncRequest();
	this._canvas_id = null;
	this._allow_cross_page_transition = true;
	this._replayable = false;
}
copy_properties(AjaxPipeRequest.prototype,
		{
			setCanvasId : function(a) {
				this._canvas_id = a;
				return this;
			},
			setURI : function(a) {
				this._uri = a;
				return this;
			},
			setData : function(a) {
				this._query_data = a;
				return this;
			},
			setAllowCrossPageTransition : function(a) {
				this._allow_cross_page_transition = a;
				return this;
			},
			setAppend : function(a) {
				this._append = a;
				return this;
			},
			send : function() {
				this._request.setOption('useIframeTransport', true).setURI(
						this._uri).setData(copy_properties( {
					ajaxpipe : 1
				}, this._query_data)).setPreBootloadHandler(
						this._preBootloadHandler.bind(this)).setInitialHandler(
						this._onInitialResponse.bind(this)).setHandler(
						this._onResponse.bind(this)).setReplayable(
						this._replayable).setMethod('GET').setReadOnly(true)
						.setAllowCrossPageTransition(
								this._allow_cross_page_transition);
				AjaxPipeRequest._current_request = this._request;
				this._request.send();
				return this;
			},
			_preBootloadFirstResponse : function(a) {
				return false;
			},
			_fireDomContentCallback : function() {
				this._arbiter.inform('ajaxpipe/domcontent_callback', true,
						Arbiter.BEHAVIOR_STATE);
			},
			_fireOnloadCallback : function() {
				this._arbiter.inform('ajaxpipe/onload_callback', true,
						Arbiter.BEHAVIOR_STATE);
			},
			_isRelevant : function(a) {
				return this._request == AjaxPipeRequest._current_request
						|| a.isReplay() || this._jsNonBlock;
			},
			_preBootloadHandler : function(b) {
				var a = b.getPayload();
				if (!a || a.redirect || !this._isRelevant(b))
					return false;
				var c = false;
				if (b.is_first) {
					!this._append
							&& AjaxPipeRequest.clearCanvas(this._canvas_id);
					this._arbiter = new Arbiter();
					c = this._preBootloadFirstResponse(b);
					this.pipe = new BigPipe( {
						arbiter : this._arbiter,
						rootNodeID : this._canvas_id,
						lid : this._request.lid,
						rrEnabled : b.payload.roadrunner_enabled,
						isAjax : true,
						domContentCallback : this._fireDomContentCallback
								.bind(this),
						onloadCallback : this._fireOnloadCallback.bind(this),
						domContentEvt : 'ajaxpipe/domcontent_callback',
						onloadEvt : 'ajaxpipe/onload_callback',
						isReplay : b.isReplay(),
						jsNonBlock : this._jsNonBlock
					});
				}
				return c;
			},
			_redirect : function(a) {
				return false;
			},
			_versionCheck : function(a) {
				return true;
			},
			_onInitialResponse : function(b) {
				var a = b.getPayload();
				if (!this._isRelevant(b))
					return false;
				if (!a)
					return true;
				if (this._redirect(a) || !this._versionCheck(a))
					return false;
				return true;
			},
			_processFirstPayload : function(a) {
				if (ge(this._canvas_id) && a.canvas_class !== null)
					CSS.setClass(this._canvas_id, a.canvas_class);
			},
			_onResponse : function(b) {
				var a = b.payload;
				if (!this._isRelevant(b))
					return AsyncRequest.suppressOnloadToken;
				if (b.is_first) {
					this._processFirstPayload(a);
					a.provides = a.provides || [];
					a.provides.push('uipage_onload');
					if (this._append)
						a.append = this._canvas_id;
				}
				if (!b.is_last || b.is_first) {
					if (this._canvas_id === null) {
						delete a.content;
					} else if ('content' in a.content
							&& this._canvas_id != 'content') {
						a.content[this._canvas_id] = a.content.content;
						delete a.content.content;
					}
					this.pipe.onPageletArrive(a);
				}
				if (b.is_last)
					AjaxPipeRequest.restoreCanvas(this._canvas_id);
				return AsyncRequest.suppressOnloadToken;
			},
			setFinallyHandler : function(a) {
				this._request.setFinallyHandler(a);
				return this;
			},
			setErrorHandler : function(a) {
				this._request.setErrorHandler(a);
				return this;
			},
			abort : function() {
				this._request.abort();
				if (AjaxPipeRequest._current_request == this._request)
					AjaxPipeRequest._current_request = null;
				this._request = null;
				return this;
			},
			setReplayable : function(a) {
				this._replayable = a;
				return this;
			},
			setJSNonBlock : function(a) {
				this._jsNonBlock = a;
				return this;
			}
		});
copy_properties(AjaxPipeRequest, {
	clearCanvas : function(a) {
		var b = ge(a);
		if (b) {
			b.style.minHeight = '600px';
			DOM.empty(b);
		}
	},
	restoreCanvas : function(a) {
		var b = ge(a);
		if (b)
			b.style.minHeight = '100px';
	},
	getCurrentRequest : function() {
		return AjaxPipeRequest._current_request;
	},
	setCurrentRequest : function(a) {
		AjaxPipeRequest._current_request = a;
	},
	isActiveOnPage : function(b) {
		if (!env_get('ajaxpipe_enabled'))
			return false;
		var a = new RegExp(env_get('ajaxpipe_inactive_page_regex') || null);
		return !a.test(URI(b).getPath());
	}
});
JSCC = window.JSCC || function() {
	var a = {}, b = {};
	return {
		get : function(c) {
			if (c in a) {
				b[c] = a[c]();
				delete a[c];
				return b[c];
			} else
				return b[c];
		},
		init : function(d, c) {
			if (c) {
				a = {};
				b = {};
			}
			JSCC.put(d);
		},
		put : function(c) {
			copy_properties(a, c);
		},
		remove : function(c) {
			if (c in b)
				delete b[c];
		}
	};
}();
var HistoryManager = window.HistoryManager
		|| {
			_IFRAME_BASE_URI : 'http://static.ak.facebook.com/common/history_manager.php',
			history : null,
			current : 0,
			fragment : null,
			_setIframeSrcFragment : function(b) {
				b = b.toString();
				var a = HistoryManager.history.length - 1;
				HistoryManager.iframe.src = HistoryManager._IFRAME_BASE_URI
						+ '?|index=' + a + '#' + encodeURIComponent(b);
				return HistoryManager;
			},
			getIframeSrcFragment : function() {
				return decodeURIComponent(URI(
						HistoryManager.iframe.contentWindow.document.location.href)
						.getFragment());
			},
			nextframe : function(a, b) {
				if (b) {
					HistoryManager._setIframeSrcFragment(a);
					return;
				}
				if (a !== undefined) {
					HistoryManager.iframeQueue.push(a);
				} else {
					HistoryManager.iframeQueue.splice(0, 1);
					HistoryManager.iframeTimeout = null;
					HistoryManager.checkURI();
				}
				if (HistoryManager.iframeQueue.length
						&& !HistoryManager.iframeTimeout) {
					var c = HistoryManager.iframeQueue[0];
					HistoryManager.iframeTimeout = setTimeout(function() {
						HistoryManager._setIframeSrcFragment(c);
					}, 100, false);
				}
			},
			isInitialized : function() {
				return !!HistoryManager._initialized;
			},
			init : function() {
				if (!env_get('ALLOW_TRANSITION_IN_IFRAME')
						&& window != window.top)
					return;
				if (HistoryManager._initialized)
					return HistoryManager;
				var b = URI();
				var a = b.getFragment() || '';
				if (a.charAt(0) === '!') {
					a = a.substr(1);
					b.setFragment(a);
				}
				if (URI.getRequestURI(false).getProtocol().toLowerCase() == 'https')
					HistoryManager._IFRAME_BASE_URI = 'https://s-static.ak.facebook.com/common/history_manager.php';
				copy_properties(HistoryManager, {
					_initialized : true,
					fragment : a,
					orig_fragment : a,
					history : [ b ],
					callbacks : [],
					lastChanged : new Date().getTime(),
					canonical : URI('#'),
					fragmentTimeout : null,
					user : 0,
					iframeTimeout : null,
					iframeQueue : [],
					enabled : true,
					debug : bagofholding
				});
				if (window.history && history.pushState) {
					this.lastURI = document.location.href;
					window.history.replaceState(this.lastURI, null);
					Event.listen(window, 'popstate', function(c) {
						if (c && c.state && HistoryManager.lastURI != c.state) {
							HistoryManager.lastURI = c.state;
							HistoryManager.lastChanged = (+new Date());
							HistoryManager.notify(URI(c.state)
									.getUnqualifiedURI().toString());
						}
					}.bind(HistoryManager));
					if (ua.chrome() > 5 || ua.safari() > 533)
						setInterval(HistoryManager.checkURI, 42, false);
					if (ua.safari() < 534)
						HistoryManager._updateRefererURI(this.lastURI);
					return HistoryManager;
				}
				HistoryManager._updateRefererURI(URI.getRequestURI(false));
				if (ua.safari() < 500 || ua.firefox() < 2) {
					HistoryManager.enabled = false;
					return HistoryManager;
				}
				if (ua.ie() < 8) {
					HistoryManager.iframe = document.createElement('iframe');
					copy_properties(HistoryManager.iframe.style, {
						width : '0',
						height : '0',
						frameborder : '0',
						left : '0',
						top : '0',
						position : 'absolute'
					});
					onloadRegister(function() {
						HistoryManager._setIframeSrcFragment(a);
						document.body.insertBefore(HistoryManager.iframe,
								document.body.firstChild);
					});
				} else if ('onhashchange' in window) {
					Event.listen(window, 'hashchange', function() {
						HistoryManager.checkURI.bind(HistoryManager).defer();
					});
				} else
					setInterval(HistoryManager.checkURI, 42, false);
				return HistoryManager;
			},
			registerURIHandler : function(a) {
				HistoryManager.callbacks.push(a);
				return HistoryManager;
			},
			setCanonicalLocation : function(a) {
				HistoryManager.canonical = URI(a);
				return HistoryManager;
			},
			notify : function(c) {
				if (c == HistoryManager.orig_fragment)
					c = HistoryManager.canonical.getFragment();
				for ( var b = 0; b < HistoryManager.callbacks.length; b++)
					try {
						if (HistoryManager.callbacks[b](c))
							return true;
					} catch (a) {
					}
				return false;
			},
			checkURI : function() {
				if (new Date().getTime() - HistoryManager.lastChanged < 400)
					return;
				if (window.history && history.pushState) {
					var c = document.URL;
					if (c != HistoryManager.lastURI) {
						HistoryManager.lastChanged = (+new Date());
						HistoryManager.lastURI = c;
						if (ua.safari() < 534)
							HistoryManager._updateRefererURI(c);
						HistoryManager.notify(URI(c).getUnqualifiedURI()
								.toString());
					}
					return;
				}
				if (ua.ie() < 8 && HistoryManager.iframeQueue.length)
					return;
				if (ua.safari() && window.history.length == 200) {
					if (!HistoryManager.warned)
						HistoryManager.warned = true;
					return;
				}
				var a = URI().getFragment();
				if (a.charAt(0) == '!')
					a = a.substr(1);
				if (ua.ie() < 8)
					a = HistoryManager.getIframeSrcFragment();
				a = a.replace(/%23/g, '#');
				if (a != HistoryManager.fragment.replace(/%23/g, '#')) {
					HistoryManager.debug( [ a, ' vs ', HistoryManager.fragment,
							'whl: ', window.history.length, 'QHL: ',
							HistoryManager.history.length ].join(' '));
					for ( var b = HistoryManager.history.length - 1; b >= 0; --b)
						if (HistoryManager.history[b].getFragment().replace(
								/%23/g, '#') == a)
							break;
					++HistoryManager.user;
					if (b >= 0) {
						HistoryManager.go(b - HistoryManager.current);
					} else
						HistoryManager.go('#' + a);
					--HistoryManager.user;
				}
				delete a;
			},
			_updateRefererURI : function(e) {
				e = e.toString();
				if (e.charAt(0) != '/' && e.indexOf('//') == -1)
					return;
				var d = new URI(window.location);
				if (d.isFacebookURI()) {
					var a = d.getPath() + window.location.search;
				} else
					var a = '';
				var c = URI(e).getQualifiedURI().setFragment(a).toString();
				var b = 2048;
				if (c.length > b)
					c = c.substring(0, b) + '...';
				setCookie('x-referer', c);
			},
			go : function(c, e, f) {
				if (window.history && history.pushState) {
					e || typeof (c) == 'number';
					var h = URI(c).removeQueryData('ref').toString();
					HistoryManager.lastChanged = (+new Date());
					this.lastURI = h;
					if (f) {
						window.history.replaceState(c, null, h);
					} else
						window.history.pushState(c, null, h);
					if (ua.safari() < 534)
						HistoryManager._updateRefererURI(c);
					return false;
				}
				HistoryManager.debug('go: ' + c);
				if (e === undefined)
					e = true;
				if (!HistoryManager.enabled)
					if (!e)
						return false;
				if (typeof (c) == 'number') {
					if (!c)
						return false;
					var b = c + HistoryManager.current;
					var d = Math.max(0, Math.min(
							HistoryManager.history.length - 1, b));
					HistoryManager.current = d;
					b = HistoryManager.history[d].getFragment()
							|| HistoryManager.orig_fragment;
					b = URI(b).removeQueryData('ref').getUnqualifiedURI()
							.toString();
					HistoryManager.fragment = b;
					HistoryManager.lastChanged = new Date().getTime();
					if (ua.ie() < 8) {
						if (HistoryManager.fragmentTimeout)
							clearTimeout(HistoryManager.fragmentTimeout);
						HistoryManager._temporary_fragment = b;
						HistoryManager.fragmentTimeout = setTimeout(function() {
							window.location.hash = '#!' + b;
							delete HistoryManager._temporary_fragment;
						}, 750, false);
						if (!HistoryManager.user)
							HistoryManager.nextframe(b, f);
					} else if (!HistoryManager.user)
						go_or_replace(window.location, window.location.href
								.split('#')[0]
								+ '#!' + b, f);
					if (e)
						HistoryManager.notify(b);
					HistoryManager._updateRefererURI(b);
					return false;
				}
				c = URI(c);
				if (c.getDomain() == URI().getDomain())
					c = URI('#' + c.getUnqualifiedURI());
				var a = HistoryManager.history[HistoryManager.current]
						.getFragment();
				var g = c.getFragment();
				if (g == a
						|| (a == HistoryManager.orig_fragment && g == HistoryManager.canonical
								.getFragment())) {
					if (e)
						HistoryManager.notify(g);
					HistoryManager._updateRefererURI(g);
					return false;
				}
				if (f)
					HistoryManager.current--;
				var i = (HistoryManager.history.length - HistoryManager.current) - 1;
				HistoryManager.history.splice(HistoryManager.current + 1, i);
				HistoryManager.history.push(URI(c));
				return HistoryManager.go(1, e, f);
			},
			getCurrentFragment : function() {
				var a = HistoryManager._temporary_fragment !== undefined ? HistoryManager._temporary_fragment
						: URI.getRequestURI(false).getFragment();
				return a == HistoryManager.orig_fragment ? HistoryManager.canonical
						.getFragment()
						: a;
			}
		};
var PageTransitions = window.PageTransitions
		|| {
			_transition_handlers : [],
			_scroll_positions : {},
			_scroll_locked : false,
			isInitialized : function() {
				return !!PageTransitions._initialized;
			},
			_init : function() {
				if (!env_get('ALLOW_TRANSITION_IN_IFRAME')
						&& window != window.top)
					return;
				if (PageTransitions._initialized)
					return PageTransitions;
				PageTransitions._initialized = true;
				var d = URI.getRequestURI(false);
				var a = d.getUnqualifiedURI();
				var e = URI(a).setFragment(null);
				var c = a.getFragment();
				if (c.charAt(0) === '!' && e.toString() === c.substr(1))
					a = e;
				copy_properties(PageTransitions, {
					_current_uri : a,
					_most_recent_uri : a,
					_next_uri : a
				});
				var b;
				if (d.getFragment().startsWith('/')) {
					b = d.getFragment();
				} else
					b = a;
				HistoryManager.init().setCanonicalLocation('#' + b)
						.registerURIHandler(
								PageTransitions._historyManagerHandler);
				LinkController.registerFallbackHandler(
						PageTransitions._rewriteHref, LinkController.TARGETS
								| LinkController.MODIFIERS);
				LinkController
						.registerFallbackHandler(PageTransitions._onlinkclick);
				FormController
						.registerFallbackHandler(PageTransitions._onformsubmit);
				Event
						.listen(
								window,
								'scroll',
								function() {
									if (!PageTransitions._scroll_locked)
										PageTransitions._scroll_positions[PageTransitions._current_uri] = Vector2
												.getScrollPosition();
								});
				return PageTransitions;
			},
			registerHandler : function(b, a) {
				PageTransitions._init();
				a = a || 5;
				if (!PageTransitions._transition_handlers[a])
					PageTransitions._transition_handlers[a] = [];
				PageTransitions._transition_handlers[a].push(b);
			},
			getCurrentURI : function(a) {
				if (!PageTransitions._current_uri && !a)
					return new URI(PageTransitions._most_recent_uri);
				return new URI(PageTransitions._current_uri);
			},
			getMostRecentURI : function() {
				return new URI(PageTransitions._most_recent_uri);
			},
			getNextURI : function() {
				return new URI(PageTransitions._next_uri);
			},
			_rewriteHref : function(a) {
				var c = a.getAttribute('href');
				var b = _computeRelativeURI(
						PageTransitions._most_recent_uri.getQualifiedURI(), c)
						.toString();
				if (c != b)
					a.setAttribute('href', b);
			},
			_onlinkclick : function(a) {
				_BusyUIManager.lookBusy(a);
				PageTransitions.go(a.getAttribute('href'));
				return false;
			},
			_onformsubmit : function(a) {
				var c = new URI(Form.getAttribute(a, 'action') || ''), b = _computeRelativeURI(
						PageTransitions._most_recent_uri, c);
				a.setAttribute('action', b.toString());
				if ((Form.getAttribute(a, 'method') || 'GET').toUpperCase() === 'GET') {
					PageTransitions.go(b.addQueryData(Form.serialize(a)));
					return false;
				}
			},
			go : function(d, b) {
				var a = new URI(d).removeQueryData('quickling')
						.getQualifiedURI();
				var c = a.getUnqualifiedURI();
				delete PageTransitions._scroll_positions[c];
				!b && user_action( {
					href : a.toString()
				}, 'uri', null, 'INDIRECT');
				_BusyUIManager.lookBusy();
				PageTransitions._loadPage(a, function(e) {
					if (e) {
						HistoryManager.go(a.toString(), false, b);
					} else
						go_or_replace(window.location, a, b);
				});
			},
			_historyManagerHandler : function(a) {
				if (a.charAt(0) != '/')
					return false;
				user_action( {
					href : a
				}, 'h', null);
				PageTransitions._loadPage(new URI(a), function(b) {
					if (!b)
						go_or_replace(window.location, a, true);
				});
				return true;
			},
			_loadPage : function(e, c) {
				if (URI(e).getFragment()
						&& are_equal(
								URI(e).setFragment(null).getQualifiedURI(),
								URI(PageTransitions._current_uri).setFragment(
										null).getQualifiedURI())) {
					PageTransitions._current_uri = PageTransitions._most_recent_uri = e;
					PageTransitions.restoreScrollPosition();
					_BusyUIManager.stopLookingBusy();
					return;
				}
				var d = PageTransitions._scroll_positions[PageTransitions._current_uri];
				PageTransitions._current_uri = null;
				PageTransitions._next_uri = e;
				if (d)
					DOMScroll.scrollTo(d, false);
				var b = function() {
					PageTransitions._scroll_locked = true;
					var f = PageTransitions._handleTransition(e);
					c && c(f);
				};
				var a = _runHooks('onbeforeleavehooks');
				if (a) {
					_BusyUIManager.stopLookingBusy();
					PageTransitions._warnBeforeLeaving(a, b);
				} else
					b();
			},
			_handleTransition : function(f) {
				window.onbeforeleavehooks = undefined;
				_BusyUIManager.lookBusy();
				if (!f.isSameOrigin())
					return false;
				var e = window.AsyncRequest && AsyncRequest.getLastId();
				Arbiter.inform("pre_page_transition", {
					from : PageTransitions.getMostRecentURI(),
					to : f
				});
				for ( var b = PageTransitions._transition_handlers.length - 1; b >= 0; --b) {
					var a = PageTransitions._transition_handlers[b];
					if (!a)
						continue;
					for ( var c = a.length - 1; c >= 0; --c)
						if (a[c](f) === true) {
							var d = {
								sender : this,
								uri : f,
								id : e
							};
							Arbiter.inform("page_transition", d);
							return true;
						} else
							a.splice(c, 1);
				}
				return false;
			},
			unifyURI : function() {
				PageTransitions._current_uri = PageTransitions._most_recent_uri = PageTransitions._next_uri;
			},
			transitionComplete : function(a) {
				PageTransitions._executeCompletionCallback();
				_BusyUIManager.stopLookingBusy();
				PageTransitions.unifyURI();
				if (!a)
					PageTransitions.restoreScrollPosition();
			},
			_executeCompletionCallback : function() {
				if (PageTransitions._completionCallback)
					PageTransitions._completionCallback();
				PageTransitions._completionCallback = null;
			},
			setCompletionCallback : function(a) {
				PageTransitions._completionCallback = a;
			},
			_warnBeforeLeaving : function(b, a) {
				new Dialog().setTitle(
						_tx("Are you sure you want to leave this page?"))
						.setBody(htmlize(b)).setButtons( [ {
							name : 'leave_page',
							label : _tx("Leave This Page"),
							handler : a
						}, {
							name : 'continue_editing',
							label : _tx("Continue Editing"),
							className : 'inputaux'
						} ]).setModal().show();
			},
			restoreScrollPosition : function() {
				PageTransitions._scroll_locked = false;
				var c = PageTransitions._current_uri;
				var e = PageTransitions._scroll_positions[c];
				if (e) {
					DOMScroll.scrollTo(e, false);
					return;
				}
				function d(f) {
					return (f || null)
							&& (DOM.scry(document.body, "a[name='"
									+ escape_js_quotes(f) + "']")[0] || ge(f));
				}
				var a = d(URI(c).getFragment());
				if (a) {
					var b = Vector2.getElementPosition(a);
					b.x = 0;
					DOMScroll.scrollTo(b);
				}
			}
		};
function _computeRelativeURI(d, b) {
	var e = new URI(), c = b;
	d = new URI(d);
	b = new URI(b);
	if (b.getDomain() && !b.isFacebookURI())
		return c;
	var f = d;
	var a = [ 'Protocol', 'Domain', 'Port', 'Path', 'QueryData', 'Fragment' ];
	a.forEach(function(h) {
		var g = h == 'Path' && f === d;
		if (g)
			e.setPath(_computeRelativePath(d.getPath(), b.getPath()));
		if (!is_empty(b['get' + h]()))
			f = b;
		if (!g)
			e['set' + h](f['get' + h]());
	});
	return e;
}
function _computeRelativePath(b, a) {
	if (!a)
		return b;
	if (a.charAt(0) == '/')
		return a;
	var c = b.split('/').slice(0, -1);
	c[0] !== '';
	a.split('/').forEach(function(d) {
		if (!(d == '.'))
			if (d == '..') {
				if (c.length > 1)
					c = c.slice(0, -1);
			} else
				c.push(d);
	});
	return c.join('/');
}
function go_or_replace(a, d, c) {
	var e = new URI(d);
	if (a.pathname == '/' && e.getPath() != '/' && e.isQuicklingEnabled()) {
		var b = a.search ? {} : {
			q : ''
		};
		e = new URI().setPath('/').setQueryData(b).setFragment(
				e.getUnqualifiedURI()).toString();
		d = e.toString();
	}
	if (c && !(ua.ie() < 8)) {
		a.replace(d);
	} else if (a.href == d) {
		a.reload();
	} else
		a.href = d;
}
var _BusyUIManager = window._BusyUIManager || {
	_looking_busy : false,
	_original_cursors : [],
	lookBusy : function(a) {
		if (a)
			_BusyUIManager._giveProgressCursor(a);
		if (_BusyUIManager._looking_busy)
			return;
		_BusyUIManager._looking_busy = true;
		_BusyUIManager._giveProgressCursor(document.body);
	},
	stopLookingBusy : function() {
		if (!_BusyUIManager._looking_busy)
			return;
		_BusyUIManager._looking_busy = false;
		while (_BusyUIManager._original_cursors.length) {
			var c = _BusyUIManager._original_cursors.pop();
			var b = c[0];
			var a = c[1];
			if (b.style)
				b.style.cursor = a || '';
		}
	},
	_giveProgressCursor : function(a) {
		if (!ua.safari()) {
			_BusyUIManager._original_cursors.push( [ a, a.style.cursor ]);
			a.style.cursor = 'progress';
		}
	}
};
onloadRegister(function() {
	Event.listen(document.documentElement, 'submit', function(b) {
		var a = b.getTarget().getElementsByTagName('*');
		for ( var c = 0; c < a.length; c++)
			if (a[c].getAttribute('placeholder') && Input.isEmpty(a[c]))
				a[c].value = '';
	});
});
PresenceMessage = {
	STARTED : 'presence/started',
	SHUTDOWN : 'presence/shutdown',
	RESTARTED : 'presence/restarted',
	WINDOW_RESIZED : 'presence/window-resized',
	TAB_CLOSED : 'presence/tab-closed',
	TAB_OPENED : 'presence/tab-opened',
	PRESENCE_UPDATER_READY : 'presence/updater-ready',
	getAppMessageType : function(a, b) {
		return 'presence/app_message:' + a + ':' + b;
	},
	getArbiterMessageType : function(a) {
		return 'presence/message:' + a;
	}
};
var Live = {
	fbidToID : {},
	fbidToDark : {},
	deferred : {},
	logAll : false,
	startup : function() {
		Live.startup = bagofholding;
		Arbiter.subscribe(PresenceMessage.getArbiterMessageType('live'),
				Live.handleMessage.bind(Live));
	},
	register : function(b, d, e, a) {
		var c = ge(b);
		if (c) {
			Live.startup();
			Live.fbidToID[d] = b;
			Live.fbidToDark[d] = a;
			delete this.deferred[d];
			DataStore.set(c, 'seqnum', e);
		} else
			this.deferred[d] = [ b, d, e, a ];
	},
	updateDeferred : function() {
		values(this.deferred).each(function(a) {
			this.register.apply(this, a);
		}, this);
	},
	handleMessage : function(g, b) {
		var d = b.obj;
		var c = Live.fbidToID[d.fbid];
		if (!c)
			return;
		var f = ge(c);
		if (!f)
			return;
		if (Live.fbidToDark[d.fbid])
			return;
		var a = DataStore.get(f, 'seqnum');
		if (d.expseq != a) {
			Live.log('mismatch', d.fbid, d.expseq, a);
			return;
		}
		Live.log('seqmatch', d.fbid);
		var e = {
			getRelativeTo : function() {
				return f;
			}
		};
		$A(d.updates).each(function(h) {
			new Function(h).apply(e);
		});
	},
	log : function() {
		if (Live.logAll) {
			var a = $A(arguments).join(":");
			new AsyncSignal('/common/scribe_endpoint.php', {
				c : 'live_sequence',
				m : a
			}).send();
		}
	}
};
var LiveTimer = {
	restart : function(a) {
		this.serverTime = a;
		this.localStartTime = new Date().getTime() / 1000;
		this.updateTimeStamps();
	},
	updateTimeStamps : function() {
		LiveTimer.timestamps = DOM.scry(document.body, 'abbr.timestamp');
		LiveTimer.startLoop(20000);
	},
	addTimeStamps : function(a) {
		if (!a || !LiveTimer.timestamps)
			return;
		var c = DOM.scry(a, 'abbr.timestamp');
		for ( var b = 0; b < c.length; ++b)
			LiveTimer.timestamps.push(c[b]);
		LiveTimer.startLoop(0);
	},
	startLoop : function(a) {
		this.stop();
		this.timeout = setTimeout(function() {
			LiveTimer.loop();
		}, a);
	},
	stop : function() {
		clearTimeout(this.timeout);
	},
	updateNode : function(a, b) {
		LiveTimer.updateNode = (ua.ie() < 7) ? function(c, d) {
			c.nextSibling.nodeValue = d;
		} : function(c, d) {
			c.firstChild.nodeValue = d;
		};
		LiveTimer.updateNode(a, b);
	},
	loop : function(d) {
		if (d)
			LiveTimer.updateTimeStamps();
		var c = Math.floor(new Date().getTime() / 1000
				- LiveTimer.localStartTime);
		var a = -1;
		LiveTimer.timestamps.each(function(g) {
			var f = +new Date(g.getAttribute('data-date')) / 1000;
			var e = LiveTimer.renderRelativeTime(LiveTimer.serverTime + c, f);
			if (e.text)
				LiveTimer.updateNode(g, e.text);
			if (e.next != -1 && (e.next < a || a == -1))
				a = e.next;
		});
		if (a != -1) {
			var b = Math.max(20000, a * 1000);
			LiveTimer.timeout = setTimeout(function() {
				LiveTimer.loop();
			}, b);
		}
	},
	renderRelativeTime : function(c, d) {
		var e = {
			text : "",
			next : -1
		};
		if (c - d > (12 * 3600)
				|| (new Date(c * 1000).getDay() != new Date(d * 1000).getDay()))
			return e;
		var f = c - d, b = Math.floor(f / 60), a = Math.floor(b / 60);
		if (b < 1) {
			e.text = _tx("a few seconds ago");
			e.next = 60 - f % 60;
			return e;
		}
		if (a < 1) {
			if (b == 1) {
				e.text = _tx("about a minute ago");
			} else
				e.text = _tx("{number} minutes ago", {
					number : b
				});
			e.next = 60 - f % 60;
			return e;
		}
		if (a != 11)
			e.next = 3600 - f % 3600;
		if (a == 1) {
			e.text = _tx("about an hour ago");
			return e;
		}
		e.text = _tx("{number} hours ago", {
			number : a
		});
		return e;
	}
};
if (!this.JSON)
	this.JSON = function() {
		function f(n) {
			return n < 10 ? '0' + n : n;
		}
		Date.prototype.toJSON = function() {
			return this.getUTCFullYear() + '-' + f(this.getUTCMonth() + 1)
					+ '-' + f(this.getUTCDate()) + 'T' + f(this.getUTCHours())
					+ ':' + f(this.getUTCMinutes()) + ':'
					+ f(this.getUTCSeconds()) + 'Z';
		};
		var m = {
			'\b' : '\\b',
			'\t' : '\\t',
			'\n' : '\\n',
			'\f' : '\\f',
			'\r' : '\\r',
			'"' : '\\"',
			'\\' : '\\\\'
		};
		function stringify(value, whitelist) {
			var a, i, k, l, v;
			switch (typeof value) {
			case 'string':
				return (new RegExp('[\x00-\x1f\\\\"]')).test(value) ? '"' + value
						.replace(/[\x00-\x1f\\"]/g, function(a) {
							var c = m[a];
							if (c)
								return c;
							c = a.charCodeAt();
							return '\\u00' + Math.floor(c / 16).toString(16)
									+ (c % 16).toString(16);
						}) + '"'
						: '"' + value + '"';
			case 'number':
				return isFinite(value) ? String(value) : 'null';
			case 'boolean':
				return String(value);
			case 'null':
				return 'null';
			case 'object':
				if (DOM.isNode(value))
					return null;
				if (!value)
					return 'null';
				if (typeof value.toJSON === 'function')
					return stringify(value.toJSON());
				a = [];
				if (typeof value.length === 'number'
						&& !(propertyIsEnumerable(value, 'length'))) {
					l = value.length;
					for (i = 0; i < l; i += 1)
						a.push(stringify(value[i], whitelist) || 'null');
					return '[' + a.join(',') + ']';
				}
				if (whitelist) {
					l = whitelist.length;
					for (i = 0; i < l; i += 1) {
						k = whitelist[i];
						if (typeof k === 'string') {
							v = stringify(value[k], whitelist);
							if (v)
								a.push(stringify(k) + ':' + v);
						}
					}
				} else
					for (k in value)
						if (typeof k === 'string') {
							v = stringify(value[k], whitelist);
							if (v)
								a.push(stringify(k) + ':' + v);
						}
				return '{' + a.join(',') + '}';
			}
		}
		return {
			stringify : stringify,
			parse : function(text, filter) {
				var j;
				function walk(k, v) {
					var i, n;
					if (v && typeof v === 'object')
						for (i in v)
							if (Object.prototype.hasOwnProperty.apply(v, [ i ])) {
								n = walk(i, v[i]);
								if (n !== undefined)
									v[i] = n;
							}
					return filter(k, v);
				}
				if (text
						&& /^[\],:{}\s]*$/
								.test(text
										.replace(/\\./g, '@')
										.replace(
												/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(:?[eE][+\-]?\d+)?/g,
												']').replace(
												/(?:^|:|,)(?:\s*\[)+/g, ''))) {
					j = eval('(' + text + ')');
					return typeof filter === 'function' ? walk('', j) : j;
				}
				throw new SyntaxError('decodeJSON');
			}
		};
	}();
this.JSON.encode = this.JSON.stringify;
this.JSON.decode = this.JSON.parse;
function propertyIsEnumerable(a, b) {
	if (a.propertyIsEnumerable)
		return a.propertyIsEnumerable(b);
	for ( var c in a)
		if (c == b)
			return true;
	return false;
}
function ufi_add_ft_hidden_node(c) {
	if (c.link_data)
		return;
	var a = collect_data_attrib(c, 'ft');
	if (count(a)) {
		var b = $N('input', {
			type : 'hidden',
			name : 'link_data',
			value : JSON.encode(a)
		});
		c.appendChild(b);
	}
}
function ufi_add_all_link_data() {
	DOM.scry(document.body, 'form.commentable_item').forEach(
			ufi_add_ft_hidden_node);
}
window.__UIControllerRegistry = window.__UIControllerRegistry || {};
function UIPagelet(c, d, a, b) {
	this._id = c || null;
	this._element = ge(c || $N('div'));
	this._src = d || null;
	this._context_data = a || {};
	this._data = b || {};
	this._handler = bagofholding;
	this._request = null;
	this._use_ajaxpipe = false;
	this._is_bundle = true;
	this._allow_cross_page_transition = false;
	this._append = false;
	return this;
}
UIPagelet.loadFromEndpoint = function(b, e, a, c) {
	c = c || {};
	var d = ('/pagelet/generic.php/' + b).replace(/\/+/g, '/');
	new UIPagelet(e, d, a).setUseAjaxPipe(c.usePipe).setBundleOption(
			b.substring(0, 8) != '/intern/' && c.bundle !== false)
			.setReplayable(c.replayable).setAppend(c.append).setJSNonBlock(
					c.jsNonblock).setAllowCrossPageTransition(c.crossPage).go();
};
copy_properties(UIPagelet.prototype, {
	getElement : function(a) {
		a = a || false;
		if (a)
			this._element = ge(this._id);
		return this._element;
	},
	setHandler : function(a) {
		this._handler = a;
		return this;
	},
	go : function(b, a) {
		if (arguments.length >= 2 || typeof b == 'string') {
			this._src = b;
			this._data = a || {};
		} else if (arguments.length == 1)
			this._data = b;
		this.refresh();
		return this;
	},
	setAllowCrossPageTransition : function(a) {
		this._allow_cross_page_transition = a;
		return this;
	},
	setBundleOption : function(a) {
		this._is_bundle = a;
		return this;
	},
	refresh : function(b) {
		var a = function(d) {
			this._request = null;
			if (b && this._id)
				this._element = ge(this._id);
			var c = HTML(d.getPayload());
			if (this._append) {
				DOM.appendContent(this._element, c);
			} else
				DOM.setContent(this._element, c);
			this._handler();
		}.bind(this);
		if (this._use_ajaxpipe) {
			this._request = new AjaxPipeRequest();
			this._request.setCanvasId(this._id).setAppend(this._append)
					.setJSNonBlock(this._jsNonblock);
		} else
			this._request = new AsyncRequest().setMethod('GET').setReadOnly(
					true).setOption('bundle', this._is_bundle).setHandler(a);
		this._request.setURI(this._src).setReplayable(this._replayable)
				.setAllowCrossPageTransition(this._allow_cross_page_transition)
				.setData( {
					data : JSON.encode(merge(this._context_data, this._data))
				}).send();
		return this;
	},
	cancel : function() {
		if (this._request)
			this._request.abort();
	},
	setUseAjaxPipe : function(a) {
		this._use_ajaxpipe = !!a;
		return this;
	},
	setReplayable : function(a) {
		this._replayable = !!a;
		return this;
	},
	setAppend : function(a) {
		this._append = !!a;
		return this;
	},
	setJSNonBlock : function(a) {
		this._jsNonblock = !!a;
		return this;
	}
});
var Button = (function() {
	var a = 'uiButtonDisabled';
	var c = 'button:blocker';
	var b = 'href';
	function d(i, h) {
		var g = DataStore.get(i, c);
		if (h) {
			if (g) {
				g.remove();
				DataStore.remove(i, c);
			}
		} else if (!g)
			DataStore.set(i, c, Event.listen(i, 'click', bagof(false),
					Event.Priority.URGENT));
	}
	function e(g) {
		var h = Parent.byClass(g, 'uiButton');
		if (!h)
			throw new Error('invalid use case');
		return h;
	}
	function f(g) {
		return DOM.isNode(g, 'a');
	}
	return {
		getInputElement : function(g) {
			g = e(g);
			if (f(g))
				throw new Error('invalid use case');
			return DOM.find(g, 'input');
		},
		isEnabled : function(g) {
			return !CSS.hasClass(e(g), a);
		},
		setEnabled : function(j, g) {
			j = e(j);
			CSS.conditionClass(j, a, !g);
			if (f(j)) {
				var h = j.href;
				var k = DataStore.get(j, b, '#');
				if (g) {
					if (!h)
						j.href = k;
				} else {
					if (h && h !== k)
						DataStore.set(j, b, h);
					j.removeAttribute('href');
				}
				d(j, g);
			} else {
				var i = Button.getInputElement(j);
				i.disabled = !g;
				d(i, g);
			}
		},
		setLabel : function(h, g) {
			h = e(h);
			if (f(h)) {
				var i = DOM.find(h, 'span.uiButtonText');
				DOM.setContent(i, g);
			} else
				Button.getInputElement(h).value = g;
			CSS.conditionClass(h, 'uiButtonNoText', !g);
		},
		setIcon : function(h, g) {
			if (!DOM.isNode(g))
				return;
			CSS.addClass(g, 'customimg');
			h = e(h);
			var i = DOM.scry(h, '.img')[0];
			if (i) {
				DOM.replace(i, g);
			} else
				DOM.prependContent(h, g);
		}
	};
})();
var TooltipLink = {
	setTooltipText : function(a, b) {
		a = Parent.byClass(a, 'uiTooltip');
		if (a)
			DOM.setContent(DOM.find(a, 'span.uiTooltipText'), HTML(b));
	},
	setTooltipEnabled : function(b, a) {
		b = Parent.byClass(b, 'uiTooltip');
		b && CSS.conditionClass(b, 'uiTooltipDisabled', !a);
	}
};

if (window.Bootloader) {
	Bootloader.done( [ "\/nipc" ]);
}