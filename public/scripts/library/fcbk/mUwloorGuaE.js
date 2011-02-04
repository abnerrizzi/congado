/*1294075899,176820662*/

if (window.CavalryLogger) {
	CavalryLogger.start_js( [ "7BbUj" ]);
}

function Rect(e, d, a, c, b) {
	if (this === window) {
		if (e instanceof Rect)
			return e;
		if (e instanceof Vector2)
			return new Rect(e.y, e.x, e.y, e.x, e.domain);
		return Rect.getElementBounds($(e));
	}
	copy_properties(this, {
		t : e,
		r : d,
		b : a,
		l : c,
		domain : b || 'pure'
	});
}
copy_properties(Rect.prototype, {
	w : function() {
		return this.r - this.l;
	},
	h : function() {
		return this.b - this.t;
	},
	toString : function() {
		return '((' + this.l + ', ' + this.t + '), (' + this.r + ', ' + this.b
				+ '))';
	},
	contains : function(b) {
		b = Rect(b).convertTo(this.domain);
		var a = this;
		if (b instanceof Vector2) {
			return (a.l <= b.x && a.r >= b.x && a.t <= b.y && a.b >= b.y);
		} else
			return (a.l <= b.l && a.r >= a.r && a.t <= b.t && a.b >= b.b);
	},
	add : function(c, d) {
		if (arguments.length == 1) {
			if (c.domain != 'pure')
				c = c.convertTo(this.domain);
			return this.add(c.x, c.y);
		}
		var a = parseFloat(c);
		var b = parseFloat(d);
		return new Rect(this.t + b, this.r + a, this.b + b, this.l + a,
				this.domain);
	},
	sub : function(a, b) {
		if (arguments.length == 1) {
			return this.add(a.mul(-1));
		} else
			return this.add(-a, -b);
	},
	boundWithin : function(a) {
		var b = 0, c = 0;
		if (this.l < a.l) {
			b = a.l - this.l;
		} else if (this.r > a.r)
			b = a.r - this.r;
		if (this.t < a.t) {
			c = a.t - this.t;
		} else if (this.b > a.b)
			c = a.b - this.b;
		return this.add(b, c);
	},
	getPositionVector : function() {
		return new Vector2(this.l, this.t, this.domain);
	},
	getDimensionVector : function() {
		return new Vector2(this.w(), this.h(), 'pure');
	},
	convertTo : function(a) {
		if (this.domain == a)
			return this;
		if (a == 'pure')
			return new Rect(this.t, this.r, this.b, this.l, 'pure');
		if (this.domain == 'pure')
			return new Rect(0, 0, 0, 0);
		var b = new Vector2(this.l, this.t, this.domain).convertTo(a);
		return new Rect(b.y, b.x + this.w(), b.y + this.h(), b.x, a);
	}
});
copy_properties(Rect, {
	newFromVectors : function(b, a) {
		return new Rect(b.y, b.x + a.x, b.y + a.y, b.x, b.domain);
	},
	getElementBounds : function(a) {
		return Rect.newFromVectors(Vector2.getElementPosition(a), Vector2
				.getElementDimensions(a));
	},
	getViewportBounds : function() {
		return Rect.newFromVectors(Vector2.getScrollPosition(), Vector2
				.getViewportDimensions());
	}
});
function Collection(e, d) {
	if (!e.__collection__) {
		var a = new Function();
		for ( var c in e.prototype)
			a.prototype[c] = Collection._call.bind(null, c);
		e.__collection__ = a;
	}
	var b = new e.__collection__();
	b._elements = d;
	return b;
}
Collection._call = function(b) {
	var a = Array.prototype.slice.call(arguments, 1);
	this._elements.each(function(c) {
		c[b].apply(c, a);
	});
	return this;
};
function Scroller(a) {
	this.canvas = a;
	this.scrollZone = 50;
	this.velocity = 100;
	this.coefficient = 1;
}
Scroller.findScrollParent = function(a) {
	var b;
	a = a.parentNode;
	while (a) {
		if (a.scrollHeight != a.offsetTop) {
			b = CSS.getStyle(a, 'overflowY');
			if (b == 'scroll' || b == 'auto')
				return a;
		}
		a = a.parentNode;
	}
	return document.body;
};
Scroller.prototype.activate = function() {
	this.activate = bagofholding;
	this.event = Event.listen(document, 'mousemove', this._onmousemove
			.bind(this));
	this.interval = this._intervalHandler.bind(this).recur(50);
	this.cursor = null;
};
Scroller.prototype.deactivate = function() {
	delete this.activate;
	this.event && this.event.remove();
	this.event = null;
	clearInterval(this.interval);
};
Scroller.prototype._onmousemove = function(event) {
	this.cursor = new Vector2.getEventPosition(event);
};
Scroller.prototype._intervalHandler = function() {
	if (!this.cursor)
		return;
	var c = this.canvas == document.body ? Rect.getViewportBounds()
			: Rect(this.canvas);
	var a = new Rect(this.cursor.y - c.t, c.r - this.cursor.x, c.b
			- this.cursor.y, this.cursor.x - c.l);
	var b = new Vector2(0, 0);
	if (a.t < a.b && a.t < this.scrollZone) {
		b.y = -this.scrollZone + a.t;
	} else if (a.b < this.scrollZone)
		b.y = this.scrollZone - a.b;
	b.y = this._doMath(b.y);
	if (a.l < a.r && a.l < this.scrollZone) {
		b.x = -this.scrollZone + a.l;
	} else if (a.r < this.scrollZone)
		b.x = this.scrollZone - a.r;
	b.x = this._doMath(b.x);
	if (b.x || b.y) {
		b.scrollElementBy(this.canvas);
		if (document.body == this.canvas)
			this.cursor = this.cursor.add(b);
		Arbiter.inform('scroller/scroll', this.cursor);
	}
};
Scroller.prototype._doMath = function(a) {
	return Math.floor(Math.pow((a >= 0 ? Math.min(a, this.scrollZone) : Math
			.max(a, -this.scrollZone))
			/ this.scrollZone * this.velocity, this.coefficient));
};
var Drag = {};
Drag.currentDraggable = null;
Drag.grab = function(a) {
	if (Drag.currentDraggable)
		Drag._onmouseup();
	a.lastDragOver = null;
	Drag.attachDragEvents();
	Drag.currentDraggable = a;
};
Drag.attachDragEvents = function() {
	document.onselectstart = function() {
		document.onselectstart = null;
		return false;
	};
	if (Drag.dragEventsAttached)
		return;
	Drag.dragEventsAttached = true;
	Arbiter.subscribe('scroller/scroll', Drag._onmousemove);
	Event.listen(document, {
		mousemove : Drag._onmousemove,
		mouseup : Drag._onmouseup
	});
};
Drag.droppables = {};
Drag.addDroppable = function(b, a) {
	(Drag.droppables[b] = Drag.droppables[b] || []).push(a);
};
Drag.removeDroppable = function(b, a) {
	Drag.droppables[b] = Drag.droppables[b].filter(function(c) {
		return c != a;
	});
};
Drag._onmousemove = function(event, c) {
	if (!Drag.currentDraggable)
		return;
	var d = c || Vector2.getEventPosition(event), b = Drag.currentDraggable, e = Drag.droppables[b.namespace];
	if (b.namespace && b.active && e) {
		var j = {};
		e.each(function(k) {
			j[k.zIndex] = k.zIndex;
		});
		var i = [];
		for ( var f in j)
			i.push(j[f]);
		i.sort();
		var g = b.lastDragOver, a = null;
		for ( var h = i.length - 1; h >= 0; h--)
			if (g && g.dom != null && g.zIndex == i[h] && g.pointInside(d)) {
				a = g;
				break;
			} else
				for ( var f = 0; f < e.length; f++) {
					if (i[h] != e[f].zIndex)
						continue;
					if (g != e[f] && b.dom != e[f].dom && e[f].pointInside(d)) {
						a = e[f];
						h = -1;
						break;
					}
				}
		if (a && a != g) {
			a.ondragover(b);
			Drag.currentDraggable.adjustCursorPosition();
		}
		if (a)
			a.ondragmove(b, d.sub(Vector2.getElementPosition(a.dom)));
		b.lastDragOver = a;
	}
	Drag.currentDraggable._onmousemove(d);
};
Drag._onmouseup = function(a) {
	document.onselectstart = null;
	if (Drag.currentDraggable) {
		Drag.currentDraggable._ondrop();
		Drag.currentDraggable = null;
	}
};
function Draggable(b) {
	if (!b)
		throw new Error('Element should be a DOM node');
	if (this == window) {
		if (b instanceof Array) {
			var a = [];
			b.each(function(c) {
				a.push(new Draggable(c));
			});
			return new Collection(Draggable, a);
		} else
			return new Draggable(b);
	} else {
		this.data = {};
		this.handles = [];
		this.dom = b;
		this.boundingBox = null;
		this.useScroller = true;
		this.grabPctX = this.grabPctY = 0;
		this.addHandle(this.dom);
	}
}
Draggable.prototype.destroy = function() {
	this.handles.each(function(a) {
		this.removeHandle(a.obj);
	}.bind(this));
	this.data = this.dom = null;
};
Draggable.prototype.adjustCursorPosition = function() {
	var a = Vector2.getElementDimensions(this.dom);
	this.cursorPositionVector = new Vector2(parseInt(this.grabPctX * a.x, 10),
			parseInt(this.grabPctY * a.y, 10));
};
Draggable.prototype._onclick = function(event) {
	if (this.active)
		return Event.kill(event);
};
Draggable.prototype._ongrab = function(a) {
	this.ongrab();
	if (this.useScroller) {
		if (!this.scroller)
			this.scroller = new Scroller(Scroller.findScrollParent(this.dom));
		this.scroller.activate();
	}
	if (this.active) {
		if (!this.oldPosition)
			this.oldPosition = this.dom.style.position;
		this.dom.style.position = this.absolute ? 'absolute' : 'relative';
		a.sub(this.cursorPositionVector).setElementPosition(this.dom);
	}
};
Draggable.prototype._onmousedown = function(event) {
	var b = $E(event).getTarget();
	if (DOM.isNode(b, [ 'input', 'select', 'textarea', 'object', 'embed' ]))
		return true;
	var c = Vector2.getEventPosition(event), a = Vector2
			.getElementDimensions(this.dom);
	this.draggableInitialVector = Vector2.getElementPosition(this.dom);
	this.cursorPositionVector = c.sub(this.draggableInitialVector);
	this.grabPctX = a.x === 0 ? 0 : this.cursorPositionVector.x / a.x;
	this.grabPctY = a.y === 0 ? 0 : this.cursorPositionVector.y / a.y;
	Drag.grab(this, event);
	if (this.gutter) {
		this.cursorInitialVector = c;
	} else {
		this._setActive(true);
		this._ongrab(c);
	}
	return Event.kill(event);
};
Draggable.prototype._onmousemove = function(d) {
	if (!this.active)
		if (d.distanceTo(this.cursorInitialVector) >= this.gutter) {
			this._setActive(true);
			this._ongrab(d);
		}
	if (this.active) {
		var c = Vector2.getElementPosition(this.dom).sub(
				new Vector2(parseInt(this.dom.style.left ? this.dom.style.left
						: CSS.getStyle(this.dom, 'left'), 10) || 0, parseInt(
						this.dom.style.top ? this.dom.style.top : CSS.getStyle(
								this.dom, 'top'), 10) || 0));
		var e = d.sub(c).sub(this.cursorPositionVector);
		if (this.boundingBox) {
			var a = Rect.newFromVectors(e, Vector2
					.getElementDimensions(this.dom));
			a = a.boundWithin(this.boundingBox);
			e = a.getPositionVector(a);
			if (this.boundingBox.w() == 0) {
				var b = new Vector2(this.draggableInitialVector.x, e.y,
						'document');
			} else if (this.boundingBox.h() == 0) {
				var b = new Vector2(e.x, this.draggableInitialVector.y,
						'document');
			} else
				var b = e;
		} else
			var b = e;
		b.setElementPosition(this.dom);
		this.ondrag(d);
	}
};
Draggable.prototype._ondrop = function() {
	this.scroller && this.scroller.deactivate();
	if (this.active) {
		(function() {
			this._setActive(false);
		}).bind(this).defer();
		this.ondrop();
		if (this.lastDragOver)
			this.lastDragOver.ondrop(this);
	}
};
Draggable.prototype.killDrag = function() {
	this._setActive(false);
	Drag._onmouseup();
};
Draggable.prototype.setBoundingBox = function(a) {
	this.boundingBox = a;
	return this;
};
Draggable.prototype.resetPosition = function() {
	this.dom.style.position = this.oldPosition;
	this.oldPosition = null;
	this.dom.style.left = '';
	this.dom.style.top = '';
	return this;
};
Draggable.prototype.setUseAbsolute = function(a) {
	this.absolute = a;
	return this;
};
Draggable.prototype.ondrag = bagofholding;
Draggable.prototype.setDragHandler = function(a) {
	this.ondrag = a;
	return this;
};
Draggable.prototype.ongrab = bagofholding;
Draggable.prototype.setGrabHandler = function(a) {
	this.ongrab = a;
	return this;
};
Draggable.prototype.ondrop = bagofholding;
Draggable.prototype.setDropHandler = function(a) {
	this.ondrop = a;
	return this;
};
Draggable.prototype.gutter = 0;
Draggable.prototype.setGutter = function(a) {
	this.gutter = a;
	return this;
};
Draggable.prototype.setNamespace = function(a) {
	this.namespace = a;
	return this;
};
Draggable.prototype.setUseScroller = function(a) {
	this.useScroller = a;
	return this;
};
Draggable.prototype.handles = null;
Draggable.prototype.addHandle = function(a) {
	if (this.handles.length == 1 && this.handles[0].obj == this.dom)
		this.removeHandle(this.dom);
	this.handles.push( {
		obj : a,
		evt : [ Event.listen(a, 'mousedown', this._onmousedown.bind(this)),
				Event.listen(a, 'click', this._onclick.bind(this)),
				Event.listen(a, 'drag', Event.kill),
				Event.listen(a, 'selectstart', Event.kill) ]
	});
	return this;
};
Draggable.prototype.removeHandle = function(a) {
	this.handles = this.handles.filter(function(b) {
		if (b.obj != a) {
			return true;
		} else {
			b.evt.each(function(c) {
				c.remove();
			});
			return false;
		}
	});
};
Draggable.prototype.getDOM = function() {
	return this.dom;
};
Draggable.prototype.setKey = function(a, b) {
	this.data[a] = b;
	return this;
};
Draggable.prototype.getKey = function(a) {
	return this.data[a];
};
Draggable.prototype._setActive = function(b) {
	this.dom.activeDrag = this.active = b;
	for ( var a = 0; a < this.handles.length; a++)
		this.handles[a].obj.activeDrag = b;
};
function Droppable(b) {
	if (!b)
		throw new Error('Element should be a DOM node');
	if (this == window) {
		if (b instanceof Array) {
			var a = [];
			b.each(function(c) {
				a.push(new Droppable(c));
			});
			return new Collection(Droppable, a);
		} else
			return new Droppable(b);
	} else {
		this.data = {};
		this.dom = b;
		this.namespace = null;
	}
}
Droppable.prototype.destroy = function() {
	if (this.namespace)
		Drag.removeDroppable(this.namespace, this);
	this.data = this.dom = null;
};
Droppable.prototype.setNamespace = function(a) {
	if (this.namespace)
		Drag.removeDroppable(a, this);
	this.namespace = a;
	Drag.addDroppable(a, this);
	return this;
};
Droppable.prototype.zIndex = 0;
Droppable.prototype.setZIndex = function(a) {
	this.zIndex = a;
	return this;
};
Droppable.prototype.pointInside = function(b) {
	var a = Vector2.getElementPosition(this.dom);
	return a.x <= b.x && this.dom.offsetWidth + a.x > b.x && a.y <= b.y
			&& this.dom.offsetHeight + a.y > b.y;
};
Droppable.prototype.ondragover = bagofholding;
Droppable.prototype.setDragOverHandler = function(a) {
	this.ondragover = a;
	return this;
};
Droppable.prototype.ondragmove = bagofholding;
Droppable.prototype.setDragMoveHandler = function(a) {
	this.ondragmove = a;
	return this;
};
Droppable.prototype.ondrop = bagofholding;
Droppable.prototype.setDropHandler = function(a) {
	this.ondrop = a;
	return this;
};
Droppable.prototype.getDOM = Draggable.prototype.getDOM;
Droppable.prototype.setKey = Draggable.prototype.setKey;
Droppable.prototype.getKey = Draggable.prototype.getKey;
function SortableGroup() {
	this.namespace = 'sortable' + (++SortableGroup.instanceCount);
	this.draggables = {};
	this.droppables = {};
	this.sortables = {};
	this.linkedGroups = [];
	this.linkedGroups.onbeforelinkjump = bagofholding;
	this.linkedGroups.onlinkjump = bagofholding;
	this.rootNode = null;
	this.boundingBox = null;
	this.neverEmpty = false;
	this.hasEmptyMessage = false;
	this.isDroppable = true;
	this.requireSameParent = true;
	this.anchor = null;
	this.disabled = false;
}
SortableGroup.instanceCount = 0;
SortableGroup.prototype = {
	gutter : 15,
	onbeforegrabcallback : bagofholding,
	onbeforedragover : bagofholding,
	ondragover : bagofholding,
	ondropcallback : bagofholding,
	ongrabcallback : bagofholding,
	onorderchange : bagofholding,
	addEmptyMessage : function(b, c) {
		var a = 'placeholder';
		if (b.parentNode != c)
			DOM.appendContent(c, b);
		this._initializeAdded(a, b);
		this.hasEmptyMessage = true;
		this.sortables[a] = b;
		this.droppables[a] = (new Droppable(b)).setNamespace(this.namespace)
				.setDragOverHandler(this._dragOverHandlerShim.bind(this, a));
		return this;
	},
	addSortable : function(b, c, a) {
		this._initializeAdded(b, c);
		this.sortables[b] = c;
		this.draggables[b] = (new Draggable(c)).setNamespace(this.namespace)
				.setGutter(this.gutter).setUseAbsolute(true).setGrabHandler(
						this.grabHandler.bind(this, b)).setDropHandler(
						this.dropHandler.bind(this, b)).setKey('key', b)
				.setBoundingBox(this.boundingBox);
		if (a)
			this.draggables[b].addHandle(a);
		this.droppables[b] = (new Droppable(c)).setNamespace(this.namespace)
				.setDragOverHandler(this._dragOverHandlerShim.bind(this, b));
		return this;
	},
	destroy : function() {
		for ( var c in this.droppables)
			this.droppables[c].destroy();
		for ( var b in this.draggables)
			this.draggables[b].destroy();
		this.droppables = this.draggables = this.rootNode = null;
		this.linkedGroups.remove(this);
		for ( var a = 0; a < this.linkedGroups.length; a++)
			this.linkedGroups[a].linkedGroups = this.linkedGroups;
	},
	dragOverHandler : function(f, d) {
		if (!this.isDroppable && !this.anchor)
			return;
		var h = false;
		if (!(d in this.draggables)) {
			this.linkedGroups.onbeforelinkjump.call(this, d);
			if (!this.migrateLinkedSortable(d))
				throw new Error('Draggable dropped onto a foreign droppable!');
			h = true;
		}
		var a = true, b = this.getSortables(), c = this.sortables[d], e = this.sortables[f];
		if (!this.anchor) {
			var i = b.length;
			for ( var g = 0; g < i; g++)
				if (b[g] == e) {
					break;
				} else if (b[g] == c) {
					a = false;
					break;
				}
		} else
			e = this.anchor;
		this.onbeforedragover(c, e);
		var j = this.linkedGroups.placeholder;
		this.insertPlaceholder(j, e, a || this.anchor);
		j.parentNode.insertBefore(c, j);
		this.ondragover(c, e);
		if (h)
			this.linkedGroups.onlinkjump.call(this, d);
	},
	dropHandler : function(a) {
		if (this._checkLastRemaining()) {
			this.draggables[a].resetPosition();
			return;
		}
		var c = this.linkedGroups.placeholder;
		CSS.removeClass(this.sortables[a], 'drag');
		this.draggables[a].resetPosition();
		c.parentNode.insertBefore(this.sortables[a], c);
		c.parentNode.removeChild(c);
		for ( var b = 0; b < this.linkedGroups.length; b++)
			if (this.linkedGroups[b].anchor)
				delete this.linkedGroups[b].anchor;
		this.ondropcallback(a, this.sortables[a]);
		this.onorderchange();
	},
	getOrder : function() {
		var d = [], a = this.getSortables();
		for ( var b = 0; b < a.length; b++)
			for ( var c in this.sortables)
				if (this.sortables[c] == a[b]) {
					d.push(c);
					break;
				}
		return d;
	},
	getSortables : function() {
		return this.rootNode ? this.rootNode.childNodes : [];
	},
	grabHandler : function(a) {
		if (this.disabled || this._checkLastRemaining()) {
			this.draggables[a].killDrag();
			return;
		}
		this.onbeforegrabcallback(this.sortables[a], a);
		var b = this.linkedGroups.placeholder;
		var c = this.sortables[a];
		CSS.setClass(b, c.className);
		CSS.addClass(b, 'droppable_placeholder');
		CSS.addClass(c, 'drag');
		Vector2.getElementDimensions(c).setElementDimensions(b);
		c.parentNode.insertBefore(b, c);
		this.ongrabcallback(this.sortables[a], a);
		if (!this.isDroppable) {
			this.anchor = c.nextSibling;
			if (!this.anchor) {
				this.anchor = $N('div');
				c.parentNode.appendChild(this.anchor);
			}
		}
	},
	insertPlaceholder : function(b, c, a) {
		if (a) {
			DOM.insertBefore(b, c);
		} else
			DOM.insertAfter(c, b);
	},
	keyExists : function(a) {
		return this.sortables[a];
	},
	link : function(d) {
		d.linkedGroups = this.linkedGroups;
		if (!this.linkedGroups.length)
			this.linkedGroups.push(this);
		this.linkedGroups.push(d);
		for ( var b = 0; b < this.linkedGroups.length; b++)
			if (this.linkedGroups[b].namespace != this.namespace) {
				this.linkedGroups[b].namespace = this.namespace;
				for ( var c in this.linkedGroups[b].droppables) {
					this.linkedGroups[b].droppables[c]
							.setNamespace(this.namespace);
					var a = this.linkedGroups[b].draggables[c];
					a && a.setNamespace(this.namespace);
				}
			}
		return this;
	},
	migrateLinkedSortable : function(b) {
		for ( var a = 0; a < this.linkedGroups.length; a++)
			if (b in this.linkedGroups[a].draggables) {
				this.sortables[b] = this.linkedGroups[a].sortables[b];
				this.draggables[b] = this.linkedGroups[a].draggables[b];
				this.draggables[b].setGrabHandler(
						this.grabHandler.bind(this, b)).setDropHandler(
						this.dropHandler.bind(this, b));
				this.droppables[b] = this.linkedGroups[a].droppables[b];
				this.droppables[b].setDragOverHandler(this._dragOverHandlerShim
						.bind(this, b));
				delete this.linkedGroups[a].sortables[b];
				delete this.linkedGroups[a].draggables[b];
				delete this.linkedGroups[a].droppables[b];
				return true;
			}
		return false;
	},
	removeSortable : function(a) {
		if (a in this.sortables) {
			this.draggables[a].destroy();
			this.droppables[a].destroy();
			delete this.draggables[a];
			delete this.droppables[a];
			delete this.sortables[a];
		}
	},
	setDisabled : function(a) {
		this.disabled = a;
		return this;
	},
	setBeforeGrabCallback : function(a) {
		this.onbeforegrabcallback = a;
		return this;
	},
	setBoundingBox : function(a) {
		this.boundingBox = a;
		for ( var b in this.draggables)
			this.draggables[b].setBoundingBox(this.boundingBox);
		return this;
	},
	setBeforeDragOverCallback : function(a) {
		this.onbeforedragover = a;
		return this;
	},
	setDragOverCallback : function(a) {
		this.ondragover = a;
		return this;
	},
	setDropCallback : function(a) {
		this.ondropcallback = a;
		return this;
	},
	setDroppable : function(a) {
		this.isDroppable = a;
		return this;
	},
	setGrabCallback : function(a) {
		this.ongrabcallback = a;
		return this;
	},
	setBeforeLinkJumpHandler : function(a) {
		this.linkedGroups.onbeforelinkjump = a;
		return this;
	},
	setInsertPlaceholderHandler : function(a) {
		this.insertPlaceholder = a;
	},
	setLinkJumpHandler : function(a) {
		this.linkedGroups.onlinkjump = a;
		return this;
	},
	setNeverEmpty : function(a) {
		this.neverEmpty = a;
	},
	setOrderChangeHandler : function(a) {
		this.onorderchange = a;
		return this;
	},
	setRequireSameParent : function(a, b) {
		this.requireSameParent = b;
	},
	setSortablesGetter : function(a) {
		this.getSortables = a;
	},
	_checkLastRemaining : function(a) {
		var b = this.hasEmptyMessage ? 2 : 1;
		return this.neverEmpty && this.getSortables().length == b;
	},
	_dragOverHandlerShim : function(b, a) {
		this.dragOverHandler(b, a.getKey('key'));
	},
	_initializeAdded : function(a, b) {
		if (this.rootNode === null) {
			this.rootNode = b.parentNode;
			if (!this.linkedGroups.placeholder)
				this.linkedGroups.placeholder = $N(b.tagName, {
					className : 'dragPlaceholder',
					style : {
						padding : '0px'
					}
				});
		} else if (this.requireSameParent && this.rootNode != b.parentNode)
			throw new Error(
					'All sortables of a collection must share the same parentNode');
		if (a in this.draggables)
			throw new Error('All sortables must have a unique key');
	}
};
function Tabset(a, b) {
	if (!Tabset.instances)
		Tabset.instances = {};
	Tabset.instances[a] = this;
	onleaveRegister(function() {
		Tabset.instances = {};
	});
	this.id = a;
	this.selectedId = b;
}
Tabset.getInstance = function(a) {
	if (Tabset.instances && Tabset.instances[a])
		return Tabset.instances[a];
	return null;
};
Tabset.prototype.getFullTabId = function(a) {
	return this.id + '_' + a;
};
Tabset.prototype.selectTab = function(c, b, a) {
	if (a && !a())
		return false;
	if (this.selectedId) {
		this.lastSelected = this.selectedId;
		CSS.removeClass(ge(this.selectedId), 'Tabset_selected');
	}
	this.selectedId = c;
	CSS.addClass(ge(this.selectedId), 'Tabset_selected');
	if (b)
		return b();
	return true;
};
Tabset.prototype.unselect = function() {
	if (this.selectedId)
		CSS.removeClass($(this.selectedId), 'Tabset_selected');
};
Tabset.prototype.hasTabElem = function(a) {
	return ge(this.id + '_' + a);
};
Tabset.prototype.getTabElem = function(a) {
	return $(this.id + '_' + a);
};

if (window.Bootloader) {
	Bootloader.done( [ "7BbUj" ]);
}