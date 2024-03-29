/*1293473825,176832694*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "ZtuLL" ]);
}

function EmuController(a, d, b, c) {
	this.impression = d;
	this.context = b;
	this.flags = c;
	this.containerId = a;
	DataStore.set($(a), 'emuController', this);
	return this;
}
copy_properties(EmuController, {
	fromContainer : function(a) {
		var b = ge(a);
		if (!b)
			return null;
		return DataStore.get(b, 'emuController');
	},
	getEventClass : function(a) {
		return "emuEvent" + String(a).trim();
	}
});
copy_properties(EmuController.prototype, {
	EVENT_HANDLER_PATH : '/ajax/emu/end.php',
	CLICK : 1,
	FAN : "fad_fan",
	FLAG_LOGGING_DISABLED_JAVASCRIPT : 4,
	event : function(c, b, d, a) {
		var e = {
			eid : this.impression,
			f : this.flags,
			c : this.context,
			ui : this.containerId,
			en : c,
			a : 1
		};
		if (b)
			e.ed = JSON.encode(b);
		if (!a)
			var a = bagofholding;
		var f = new AsyncRequest().setURI(this.EVENT_HANDLER_PATH).setData(e)
				.setErrorHandler(a);
		if (d)
			f.setHandler(d);
		f.send();
	},
	redirect : function() {
		var a = {
			eid : this.impression,
			f : this.flags,
			c : this.context,
			ui : this.containerId,
			en : this.CLICK,
			a : 0,
			sig : Math.floor(Math.random() * 65535) + 65536
		};
		if (a.f & this.FLAG_LOGGING_DISABLED_JAVASCRIPT)
			a.f -= this.FLAG_LOGGING_DISABLED_JAVASCRIPT;
		var b = new URI(this.EVENT_HANDLER_PATH);
		b.setQueryData(a);
		goURI(b);
	}
});
var ShortClickHandlers = {
	EVENT_NAME_CAME_BACK : 'cameback',
	onclicked : function(a) {
		if (this.onsite)
			return;
		if (a.button !== 0 || a.getModifiers().any)
			return;
		this.click_ts = (+new Date());
		if (this.listeners !== undefined)
			for ( var b in this.listeners)
				this.listeners[b].remove();
		this.listeners = {
			focus : Event.listen(window, 'focus', ShortClickHandlers.oncameback
					.bind(this))
		};
	},
	oncameback : function(c) {
		var b = (+new Date()) - this.click_ts;
		this.listeners[c.type].remove();
		var a = {
			click_ts : this.click_ts,
			length : b,
			trigger : c.type
		};
		this.sendData(ShortClickHandlers.EVENT_NAME_CAME_BACK, a);
	}
};
function EmuTracker(a, c) {
	this.base = EmuController.fromContainer(a);
	!this.base;
	this.onsite = c;
	var b = DOM.scry($(a), "a."
			+ EmuController.getEventClass(EmuTracker.EVENT_CLICK));
	b.each(function(d) {
		Event.listen(d, 'click', ShortClickHandlers.onclicked.bind(this));
	}.bind(this));
	return this;
}
copy_properties(EmuTracker, {
	EVENT_CLICK : 1
});
copy_properties(EmuTracker.prototype, {
	sendData : function(b, a) {
		this.base.event(b, a);
	}
});
function ScrollingPager(d, c, a, b) {
	this.scroll_loader_id = d;
	this.pagelet_src = c;
	this.data = a;
	this.options = b || {};
	if (this.options.target_id) {
		this.target_id = this.options.target_id;
		this.options.append = true;
	} else
		this.target_id = d;
	this.handler = null;
}
ScrollingPager.prototype = {
	register : function() {
		this.onvisible = new OnVisible($(this.scroll_loader_id), this
				.getHandler(), false, this.options.buffer, this.options);
	},
	getHandler : function() {
		if (this.handler)
			return this.handler;
		function a() {
			CSS.addClass($(this.scroll_loader_id).firstChild, 'async_saving');
			UIPagelet.loadFromEndpoint(this.pagelet_src, this.target_id,
					this.data, this.options);
		}
		return a.bind(this);
	},
	setHandler : function(a) {
		this.handler = a;
	}
};

if (window.Bootloader) {
	Bootloader.done( [ "ZtuLL" ]);
}