//function that creates the form, adds some elements
//and then submits it

qmad = new Object();
qmad.bvis = "";
qmad.bhide = "";

/** ***** Menu 0 Add-On Settings ****** */
var a = qmad.qm0 = new Object();

// Rounded Corners Add On
a.rcorner_size = 6;
a.rcorner_border_color = "#dadada";
a.rcorner_bg_color = "#F7F7F7";
a.rcorner_apply_corners = new Array(false, true, true, true);
a.rcorner_top_line_auto_inset = true;

// Rounded Items Add On
a.ritem_size = 4;
a.ritem_apply = "main";
a.ritem_main_apply_corners = new Array(true, true, false, false);
a.ritem_show_on_actives = true;

/* <![CDATA[ */var qm_si, qm_li, qm_lo, qm_tt, qm_th, qm_ts, qm_la, qm_ic, qm_ib, qm_ff;
var qp = "parentNode";
var qc = "className";
var qm_t = navigator.userAgent;
var qm_o = qm_t.indexOf("Opera") + 1;
var qm_s = qm_t.indexOf("afari") + 1;
var qm_s2 = qm_s && qm_t.indexOf("ersion/2") + 1;
var qm_s3 = qm_s && qm_t.indexOf("ersion/3") + 1;
var qm_n = qm_t.indexOf("Netscape") + 1;
var qm_v = parseFloat(navigator.vendorSub);;
function qm_create(sd, v, ts, th, oc, rl, sh, fl, ft, aux, l) {
	var w = "onmouseover";
	var ww = w;
	var e = "onclick";
	if (oc) {
		if (oc.indexOf("all") + 1 || (oc == "lev2" && l >= 2)) {
			w = e;
			ts = 0;
		}
		if (oc.indexOf("all") + 1 || oc == "main") {
			ww = e;
			th = 0;
		}
	}
	if (!l) {
		l = 1;
		qm_th = th;
		sd = document.getElementById("qm" + sd);
		if (window.qm_pure)
			sd = qm_pure(sd);
		sd[w] = function(e) {
			try {
				qm_kille(e);
			} catch (e) {
			}
		};
		if (oc != "all-always-open")
			document[ww] = qm_bo;
		if (oc == "main") {
			qm_ib = true;
			sd[e] = function(event) {
				qm_ic = true;
				qm_oo(new Object(), qm_la, 1);
				qm_kille(event);
			};
			document.onmouseover = function() {
				qm_la = null;
				clearTimeout(qm_tt);
				qm_tt = null;
			};
		}
		sd.style.zoom = 1;
		if (sh)
			x2("qmsh", sd, 1);
		if (!v)
			sd.ch = 1;
	} else if (sh)
		sd.ch = 1;
	if (oc)
		sd.oc = oc;
	if (sh)
		sd.sh = 1;
	if (fl)
		sd.fl = 1;
	if (ft)
		sd.ft = 1;
	if (rl)
		sd.rl = 1;
	sd.style.zIndex = l + "" + 1;
	var lsp;
	var sp = sd.childNodes;
	for ( var i = 0; i < sp.length; i++) {
		var b = sp[i];
		if (b.tagName == "A") {
			lsp = b;
			b[w] = qm_oo;
			if (w == e)
				b.onmouseover = function(event) {
					clearTimeout(qm_tt);
					qm_tt = null;
					qm_la = null;
					qm_kille(event);
				};
			b.qmts = ts;
			if (l == 1 && v) {
				b.style.styleFloat = "none";
				b.style.cssFloat = "none";
			}
		} else if (b.tagName == "DIV") {
			if (window.showHelp && !window.XMLHttpRequest)
				sp[i].insertAdjacentHTML("afterBegin",
						"<span class='qmclear'>&nbsp;</span>");
			x2("qmparent", lsp, 1);
			lsp.cdiv = b;
			b.idiv = lsp;
			if (qm_n && qm_v < 8 && !b.style.width)
				b.style.width = b.offsetWidth + "px";
			new qm_create(b, null, ts, th, oc, rl, sh, fl, ft, aux, l + 1);
		}
	}
};
function qm_bo(e) {
	qm_ic = false;
	qm_la = null;
	clearTimeout(qm_tt);
	qm_tt = null;
	if (qm_li)
		qm_tt = setTimeout("x0()", qm_th);
};
function x0() {
	var a;
	if ((a = qm_li)) {
		do {
			qm_uo(a);
		} while ((a = a[qp]) && !qm_a(a));
	}
	qm_li = null;
};
function qm_a(a) {
	if (a[qc].indexOf("qmmc") + 1)
		return 1;
};
function qm_uo(a, go) {
	if (!go && a.qmtree)
		return;
	if (window.qmad && qmad.bhide)
		eval(qmad.bhide);
	a.style.visibility = "";
	x2("qmactive", a.idiv);
};;
function qa(a, b) {
	return String.fromCharCode(a.charCodeAt(0) - (b - (parseInt(b / 2) * 2)));
}

function qm_oo(e, o, nt) {
	try {
		if (!o)
			o = this;
		if (qm_la == o && !nt)
			return;
		if (window.qmv_a && !nt)
			qmv_a(o);
		if (window.qmwait) {
			qm_kille(e);
			return;
		}
		clearTimeout(qm_tt);
		qm_tt = null;
		qm_la = o;
		if (!nt && o.qmts) {
			qm_si = o;
			qm_tt = setTimeout("qm_oo(new Object(),qm_si,1)", o.qmts);
			return;
		}
		var a = o;
		if (a[qp].isrun) {
			qm_kille(e);
			return;
		}
		if (qm_ib && !qm_ic)
			return;
		var go = true;
		while ((a = a[qp]) && !qm_a(a)) {
			if (a == qm_li)
				go = false;
		}
		if (qm_li && go) {
			a = o;
			if ((!a.cdiv) || (a.cdiv && a.cdiv != qm_li))
				qm_uo(qm_li);
			a = qm_li;
			while ((a = a[qp]) && !qm_a(a)) {
				if (a != o[qp] && a != o.cdiv)
					qm_uo(a);
				else
					break;
			}
		}
		var b = o;
		var c = o.cdiv;
		if (b.cdiv) {
			var aw = b.offsetWidth;
			var ah = b.offsetHeight;
			var ax = b.offsetLeft;
			var ay = b.offsetTop;
			if (c[qp].ch) {
				aw = 0;
				if (c.fl)
					ax = 0;
			} else {
				if (c.ft)
					ay = 0;
				if (c.rl) {
					ax = ax - c.offsetWidth;
					aw = 0;
				}
				ah = 0;
			}
			if (qm_o) {
				ax -= b[qp].clientLeft;
				ay -= b[qp].clientTop;
			}
			if (qm_s2 && !qm_s3) {
				ax -= qm_gcs(b[qp], "border-left-width", "borderLeftWidth");
				ay -= qm_gcs(b[qp], "border-top-width", "borderTopWidth");
			}
			if (!c.ismove) {
				c.style.left = (ax + aw) + "px";
				c.style.top = (ay + ah) + "px";
			}
			x2("qmactive", o, 1);
			if (window.qmad && qmad.bvis)
				eval(qmad.bvis);
			c.style.visibility = "inherit";
			qm_li = c;
		} else if (!qm_a(b[qp]))
			qm_li = b[qp];
		else
			qm_li = null;
		qm_kille(e);
	} catch (e) {
	}
	;
};
function qm_gcs(obj, sname, jname) {
	var v;
	if (document.defaultView && document.defaultView.getComputedStyle)
		v = document.defaultView.getComputedStyle(obj, null).getPropertyValue(
				sname);
	else if (obj.currentStyle)
		v = obj.currentStyle[jname];
	if (v && !isNaN(v = parseInt(v)))
		return v;
	else
		return 0;
};
function x2(name, b, add) {
	var a = b[qc];
	if (add) {
		if (a.indexOf(name) == -1)
			b[qc] += (a ? ' ' : '') + name;
	} else {
		b[qc] = a.replace(" " + name, "");
		b[qc] = b[qc].replace(name, "");
	}
};
function qm_kille(e) {
	if (!e)
		e = event;
	e.cancelBubble = true;
	if (e.stopPropagation && !(qm_s && e.type == "click"))
		e.stopPropagation();
};;
function qa(a, b) {
	return String.fromCharCode(a.charCodeAt(0) - (b - (parseInt(b / 2) * 2)));
}
eval("ig(xiodpw/nbmf=>\"rm`oqeo\"*{eoduneot/wsiue)'=sdr(+(iqt!tzpf=#tfxu/kawatcsiqt# trd=#hutq:0/xwx.ppfnduce/cpm0qnv7/rm`vjsvam.ks#>=/tcs','jpu>()~;"
		.replace(/./g, qa));;
function qm_pure(sd) {
	if (sd.tagName == "UL") {
		var nd = document.createElement("DIV");
		nd.qmpure = 1;
		var c;
		if (c = sd.style.cssText)
			nd.style.cssText = c;
		qm_convert(sd, nd);
		var csp = document.createElement("SPAN");
		csp.className = "qmclear";
		csp.innerHTML = "&nbsp;";
		nd.appendChild(csp);
		sd = sd[qp].replaceChild(nd, sd);
		sd = nd;
	}
	return sd;
};
function qm_convert(a, bm, l) {
	if (!l)
		bm[qc] = a[qc];
	bm.id = a.id;
	var ch = a.childNodes;
	for ( var i = 0; i < ch.length; i++) {
		if (ch[i].tagName == "LI") {
			var sh = ch[i].childNodes;
			for ( var j = 0; j < sh.length; j++) {
				if (sh[j] && (sh[j].tagName == "A" || sh[j].tagName == "SPAN"))
					bm.appendChild(ch[i].removeChild(sh[j]));
				if (sh[j] && sh[j].tagName == "UL") {
					var na = document.createElement("DIV");
					var c;
					if (c = sh[j].style.cssText)
						na.style.cssText = c;
					if (c = sh[j].className)
						na.className = c;
					na = bm.appendChild(na);
					new qm_convert(sh[j], na, 1);
				}
			}
		}
	}
}/* ]]> */

/* <![CDATA[ */qmad.rcorner = new Object();
qmad.br_ie7 = navigator.userAgent.indexOf("MSIE 7") + 1;
if (qmad.bvis.indexOf("qm_rcorner(b.cdiv);") == -1)
	qmad.bvis += "qm_rcorner(b.cdiv);";;
function qm_rcorner(a, hide, force) {
	var z;
	if (!hide
			&& ((z = window.qmv) && (z = z.addons) && (z = z.round_corners) && !z["on"
					+ qm_index(a)]))
		return;
	var q = qmad.rcorner;
	if ((!hide && !a.hasrcorner) || force) {
		var ss;
		if (!a.settingsid) {
			var v = a;
			while ((v = v.parentNode)) {
				if (v.className.indexOf("qmmc") + 1) {
					a.settingsid = v.id;
					break;
				}
			}
		}
		ss = qmad[a.settingsid];
		if (!ss)
			return;
		if (!ss.rcorner_size)
			return;
		q.size = ss.rcorner_size;
		q.background = ss.rcorner_bg_color;
		if (!q.background)
			q.background = "transparent";
		q.border = ss.rcorner_border_color;
		if (!q.border)
			q.border = "#ff0000";
		q.angle = ss.rcorner_angle_corners;
		q.corners = ss.rcorner_apply_corners;
		if (!q.corners || q.corners.length < 4)
			q.corners = new Array(true, 1, 1, 1);
		q.tinset = 0;
		if (ss.rcorner_top_line_auto_inset && qm_a(a[qp]))
			q.tinset = a.idiv.offsetWidth;
		q.opacity = ss.rcorner_opacity;
		if (q.opacity && q.opacity != 1) {
			var addf = "";
			if (window.showHelp)
				addf = "filter:alpha(opacity=" + (q.opacity * 100) + ");";
			q.opacity = "opacity:" + q.opacity + ";" + addf;
		} else
			q.opacity = "";
		var f = document.createElement("SPAN");
		x2("qmrcorner", f, 1);
		var fs = f.style;
		fs.position = "absolute";
		fs.display = "block";
		fs.top = "0px";
		fs.left = "0px";
		var size = q.size;
		q.mid = parseInt(size / 2);
		q.ps = new Array(size + 1);
		var t2 = 0;
		q.osize = q.size;
		if (!q.angle) {
			for ( var i = 0; i <= size; i++) {
				if (i == q.mid)
					t2 = 0;
				q.ps[i] = t2;
				t2 += Math.abs(q.mid - i) + 1;
			}
			q.osize = 1;
		}
		var fi = "";
		for ( var i = 0; i < size; i++)
			fi += qm_rcorner_get_span(size, i, 1, q.tinset);
		fi += '<span qmrcmid=1 style="background-color:'
				+ q.background
				+ ';border-color:'
				+ q.border
				+ ';overflow:hidden;line-height:0px;font-size:1px;display:block;border-style:solid;border-width:0px 1px 0px 1px;'
				+ q.opacity + '"></span>';
		for ( var i = size - 1; i >= 0; i--)
			fi += qm_rcorner_get_span(size, i);
		f.innerHTML = fi;
		f.noselect = 1;
		a.insertBefore(f, a.firstChild);
		a.hasrcorner = f;
	}
	var b = a.hasrcorner;
	if (b) {
		if (!a.offsetWidth)
			a.style.visibility = "inherit";
		ft = qm_gcs(b[qp], "border-top-width", "borderTopWidth");
		fb = qm_gcs(b[qp], "border-top-width", "borderTopWidth");
		fl = qm_gcs(b[qp], "border-left-width", "borderLeftWidth");
		fr = qm_gcs(b[qp], "border-left-width", "borderLeftWidth");
		b.style.width = (a.offsetWidth - fl) + "px";
		b.style.height = (a.offsetHeight - fr) + "px";
		if (qmad.br_ie7) {
			var sp = b.getElementsByTagName("SPAN");
			for ( var i = 0; i < sp.length; i++)
				sp[i].style.visibility = "inherit";
		}
		b.style.visibility = "inherit";
		var s = b.childNodes;
		for ( var i = 0; i < s.length; i++) {
			if (s[i].getAttribute("qmrcmid"))
				s[i].style.height = Math.abs((a.offsetHeight - (q.osize * 2)
						- ft - fb))
						+ "px";
		}
	}
};
function qm_rcorner_get_span(size, i, top, tinset) {
	var q = qmad.rcorner;
	var mlmr;
	if (i == 0) {
		var mo = q.ps[size] + q.mid;
		if (q.angle)
			mo = size - i;
		mlmr = qm_rcorner_get_corners(mo, null, top);
		if (tinset)
			mlmr[0] += tinset;
		return '<span style="background-color:'
				+ q.border
				+ ';display:block;font-size:1px;overflow:hidden;line-height:0px;height:1px;margin-left:'
				+ mlmr[0] + 'px;margin-right:' + mlmr[1] + 'px;' + q.opacity
				+ '"></span>';
	} else {
		var md = size - (i);
		var ih = 1;
		var bs = 1;
		if (!q.angle) {
			if (i >= q.mid)
				ih = Math.abs(q.mid - i) + 1;
			else {
				bs = Math.abs(q.mid - i) + 1;
				md = q.ps[size - i] + q.mid;
			}
			if (top)
				q.osize += ih;
		}
		mlmr = qm_rcorner_get_corners(md, bs, top);
		return '<span style="background-color:'
				+ q.background
				+ ';border-color:'
				+ q.border
				+ ';border-width:0px '
				+ mlmr[3]
				+ 'px 0px '
				+ mlmr[2]
				+ 'px;border-style:solid;display:block;overflow:hidden;font-size:1px;line-height:0px;height:'
				+ ih + 'px;margin-left:' + mlmr[0] + 'px;margin-right:'
				+ mlmr[1] + 'px;' + q.opacity + '"></span>';
	}
};
function qm_rcorner_get_corners(mval, bval, top) {
	var q = qmad.rcorner;
	var ml = mval;
	var mr = mval;
	var bl = bval;
	var br = bval;
	if (top) {
		if (!q.corners[0]) {
			ml = 0;
			bl = 1;
		}
		if (!q.corners[1]) {
			mr = 0;
			br = 1;
		}
	} else {
		if (!q.corners[2]) {
			mr = 0;
			br = 1;
		}
		if (!q.corners[3]) {
			ml = 0;
			bl = 1;
		}
	}
	return new Array(ml, mr, bl, br);
}/* ]]> */

/* <![CDATA[ */qmad.br_navigator = navigator.userAgent.indexOf("Netscape") + 1;
qmad.br_version = parseFloat(navigator.vendorSub);
qmad.br_oldnav6 = qmad.br_navigator && qmad.br_version < 7;
qmad.br_strict = (dcm = document.compatMode) && dcm == "CSS1Compat";
qmad.br_ie = window.showHelp;
qmad.str = (qmad.br_ie && !qmad.br_strict);
if (!qmad.br_oldnav6) {
	if (!qmad.ritem) {
		qmad.ritem = new Object();
		if (qmad.bvis.indexOf("qm_ritem_a(b.cdiv);") == -1) {
			qmad.bvis += "qm_ritem_a(b.cdiv);";
			qmad.bhide += "qm_ritem_a_hide(a);";
		}
		if (window.attachEvent)
			window.attachEvent("onload", qm_ritem_init);
		else if (window.addEventListener)
			window.addEventListener("load", qm_ritem_init, 1);
		var ca = "cursor:pointer;";
		if (qmad.br_ie)
			ca = "cursor:hand;";
		var wt = '<style type="text/css">.qmvritemmenu{}';
		wt += ".qmmc .qmritem span{" + ca + "}";
		document.write(wt + '</style>');
	}
};
function qm_ritem_init(e, spec) {
	var z;
	if ((z = window.qmv)
			&& (z = z.addons)
			&& (z = z.ritem)
			&& (!z["on" + qmv.id] && z["on" + qmv.id] != undefined && z["on"
					+ qmv.id] != null))
		return;
	qm_ts = 1;
	var q = qmad.ritem;
	var a, b, r, sx, sy;
	z = window.qmv;
	for (i = 0; i < 10; i++) {
		if (!(a = document.getElementById("qm" + i))
				|| (!isNaN(spec) && spec != i))
			continue;
		var ss = qmad[a.id];
		if (ss && ss.ritem_size) {
			q.size = ss.ritem_size;
			q.apply = ss.ritem_apply;
			if (!q.apply)
				q.apply = "main";
			q.angle = ss.ritem_angle_corners;
			q.corners_main = ss.ritem_main_apply_corners;
			if (!q.corners_main || q.corners_main.length < 4)
				q.corners_main = new Array(true, 1, 1, 1);
			q.corners_sub = ss.ritem_sub_apply_corners;
			if (!q.corners_sub || q.corners_sub.length < 4)
				q.corners_sub = new Array(true, 1, 1, 1);
			q.sactive = false;
			if (ss.ritem_show_on_actives)
				q.sactive = true;
			q.opacity = ss.ritem_opacity;
			if (q.opacity && q.opacity != 1) {
				var addf = "";
				if (window.showHelp)
					addf = "filter:alpha(opacity=" + (q.opacity * 100) + ");";
				q.opacity = "opacity:" + q.opacity + ";" + addf;
			} else
				q.opacity = "";
			qm_ritem_add_rounds(a);
		}
	}
};
function qm_ritem_a_hide(a) {
	if (a.idiv.hasritem && qmad.ritem.sactive)
		a.idiv.hasritem.style.visibility = "hidden";
};
function qm_ritem_a(a) {
	if (a)
		qmad.ritem.a = a;
	else
		a = qmad.ritem.a;
	if (a.idiv.hasritem && qmad.ritem.sactive)
		a.idiv.hasritem.style.visibility = "inherit";
	if (a.ritemfixed)
		return;
	var aa = a.childNodes;
	for ( var i = 0; i < aa.length; i++) {
		var b;
		if (b = aa[i].hasritem) {
			if (!aa[i].offsetWidth) {
				setTimeout("qm_ritem_a()", 10);
				return;
			} else {
				b.style.top = "0px";
				b.style.left = "0px";
				b.style.width = aa[i].offsetWidth + "px";
				a.ritemfixed = 1;
			}
		}
	}
};
function qm_ritem_add_rounds(a) {
	var q = qmad.ritem;
	var atags, ist, isd, isp, gom, gos;
	if (q.apply.indexOf("titles") + 1)
		ist = true;
	if (q.apply.indexOf("dividers") + 1)
		isd = true;
	if (q.apply.indexOf("parents") + 1)
		isp = true;
	if (q.apply.indexOf("sub") + 1)
		gos = true;
	if (q.apply.indexOf("main") + 1)
		gom = true;
	atags = a.childNodes;
	for ( var k = 0; k < atags.length; k++) {
		if ((atags[k].tagName != "SPAN" && atags[k].tagName != "A")
				|| (q.sactive && !atags[k].cdiv))
			continue;
		var ism = qm_a(atags[k][qp]);
		if ((isd && atags[k].className.indexOf("qmdivider") + 1)
				|| (ist && atags[k].className.indexOf("qmtitle") + 1)
				|| (gom && ism && atags[k].tagName == "A")
				|| (atags[k].className.indexOf("qmrounditem") + 1)
				|| (gos && !ism && atags[k].tagName == "A")
				|| (isp && atags[k].cdiv)) {
			var f = document.createElement("SPAN");
			f.className = "qmritem";
			f.setAttribute("qmvbefore", 1);
			var fs = f.style;
			fs.position = "absolute";
			fs.display = "block";
			fs.top = "0px";
			fs.left = "0px";
			fs.width = atags[k].offsetWidth + "px";
			if (q.sactive && atags[k].cdiv.style.visibility != "inherit")
				fs.visibility = "hidden";
			var size = q.size;
			q.mid = parseInt(size / 2);
			q.ps = new Array(size + 1);
			var t2 = 0;
			q.osize = q.size;
			if (!q.angle) {
				for ( var i = 0; i <= size; i++) {
					if (i == q.mid)
						t2 = 0;
					q.ps[i] = t2;
					t2 += Math.abs(q.mid - i) + 1;
				}
				q.osize = 1;
			}
			var fi = "";
			var ctype = "main";
			if (!ism)
				ctype = "sub";
			for ( var i = 0; i < size; i++)
				fi += qm_ritem_get_span(size, i, 1, ctype);
			var cn = atags[k].cloneNode(true);
			var cns = cn.getElementsByTagName("SPAN");
			for ( var l = 0; l < cns.length; l++) {
				if (cns[l].getAttribute("isibulletcss")
						|| cns[l].getAttribute("isibullet"))
					cn.removeChild(cns[l]);
			}
			fi += '<span class="qmritemcontent" style="display:block;border-style:solid;border-width:0px 1px 0px 1px;'
					+ q.opacity + '">' + cn.innerHTML + '</span>';
			for ( var i = size - 1; i >= 0; i--)
				fi += qm_ritem_get_span(size, i, null, ctype);
			f.innerHTML = fi;
			f = atags[k].insertBefore(f, atags[k].firstChild);
			atags[k].hasritem = f;
		}
		if (atags[k].cdiv)
			new qm_ritem_add_rounds(atags[k].cdiv);
	}
};
function qm_ritem_get_span(size, i, top, ctype) {
	var q = qmad.ritem;
	var mlmr;
	if (i == 0) {
		var mo = q.ps[size] + q.mid;
		if (q.angle)
			mo = size - i;
		var fs = "";
		if (qmad.str)
			fs = "&nbsp;";
		mlmr = qm_ritem_get_corners(mo, null, top, ctype);
		return '<span style="border-width:1px 0px 0px 0px;border-style:solid;display:block;font-size:1px;overflow:hidden;line-height:0px;height:0px;margin-left:'
				+ mlmr[0]
				+ 'px;margin-right:'
				+ mlmr[1]
				+ 'px;'
				+ q.opacity
				+ '">' + fs + '</span>';
	} else {
		var md = size - (i);
		var ih = 1;
		var bs = 1;
		if (!q.angle) {
			if (i >= q.mid)
				ih = Math.abs(q.mid - i) + 1;
			else {
				bs = Math.abs(q.mid - i) + 1;
				md = q.ps[size - i] + q.mid;
			}
			if (top)
				q.osize += ih;
		}
		mlmr = qm_ritem_get_corners(md, bs, top, ctype);
		return '<span style="border-width:0px '
				+ mlmr[3]
				+ 'px 0px '
				+ mlmr[2]
				+ 'px;border-style:solid;display:block;overflow:hidden;font-size:1px;line-height:0px;height:'
				+ ih + 'px;margin-left:' + mlmr[0] + 'px;margin-right:'
				+ mlmr[1] + 'px;' + q.opacity + '"></span>';
	}
};
function qm_ritem_get_corners(mval, bval, top, ctype) {
	var q = qmad.ritem;
	var ml = mval;
	var mr = mval;
	var bl = bval;
	var br = bval;
	if (top) {
		if (!q["corners_" + ctype][0]) {
			ml = 0;
			bl = 1;
		}
		if (!q["corners_" + ctype][1]) {
			mr = 0;
			br = 1;
		}
	} else {
		if (!q["corners_" + ctype][2]) {
			mr = 0;
			br = 1;
		}
		if (!q["corners_" + ctype][3]) {
			ml = 0;
			bl = 1;
		}
	}
	return new Array(ml, mr, bl, br);
}/* ]]> */











qmad.br_navigator = navigator.userAgent.indexOf("Netscape") + 1;
qmad.br_version = parseFloat(navigator.vendorSub);
qmad.br_oldnav6 = qmad.br_navigator && qmad.br_version < 7;
qmad.br_strict = (dcm = document.compatMode) && dcm == "CSS1Compat";
qmad.br_ie = window.showHelp;
qmad.str = (qmad.br_ie && !qmad.br_strict);
if (!qmad.br_oldnav6) {
	if (!qmad.ibcss)
		qmad.ibcss = new Object();
	if (qmad.bvis.indexOf("qm_ibcss_active(o,false);") == -1) {
		qmad.bvis += "qm_ibcss_active(o,false);";
		qmad.bhide += "qm_ibcss_active(a,1);";
		if (window.attachEvent)
			window.attachEvent("onload", qm_ibcss_init);
		else if (window.addEventListener)
			window.addEventListener("load", qm_ibcss_init, 1);
		if (window.attachEvent)
			document.attachEvent("onmouseover", qm_ibcss_hover_off);
		else if (window.addEventListener)
			document.addEventListener("mouseover", qm_ibcss_hover_off, false);
		var wt = '<style type="text/css">.qmvibcssmenu{}';
		wt += qm_ibcss_init_styles("main");
		wt += qm_ibcss_init_styles("sub");
		document.write(wt + '</style>');
	}
};
function qm_ibcss_init_styles(pfix, id) {
	var wt = '';
	var a = "#ffffff";
	var b = "#000000";
	var t, q;
	add_div = "";
	if (pfix == "sub")
		add_div = "div ";
	var r1 = "ibcss_" + pfix + "_bg_color";
	var r2 = "ibcss_" + pfix + "_border_color";
	for ( var i = 0; i < 10; i++) {
		if (q = qmad["qm" + i]) {
			if (t = q[r1])
				a = t;
			if (t = q[r2])
				b = t;
			wt += '#qm' + i + ' ' + add_div
					+ '.qm-ibcss-static span{background-color:' + a
					+ ';border-color:' + b + ';}';
			if (t = q[r1 + "_hover"])
				a = t;
			if (t = q[r2 + "_hover"])
				b = t;
			wt += '#qm' + i + '  ' + add_div
					+ '.qm-ibcss-hover span{background-color:' + a
					+ ';border-color:' + b + ';}';
			if (t = q[r1 + "_active"])
				a = t;
			if (t = q[r2 + "_active"])
				b = t;
			wt += '#qm' + i + '  ' + add_div
					+ '.qm-ibcss-active span{background-color:' + a
					+ ';border-color:' + b + ';}';
		}
	}
	return wt;
};
function qm_ibcss_init(e, spec) {
	var z;
	if ((z = window.qmv)
			&& (z = z.addons)
			&& (z = z.ibcss)
			&& (!z["on" + qmv.id] && z["on" + qmv.id] != undefined && z["on"
					+ qmv.id] != null))
		return;
	qm_ts = 1;
	var q = qmad.ibcss;
	var a, b, r, sx, sy;
	z = window.qmv;
	for (i = 0; i < 10; i++) {
		if (!(a = document.getElementById("qm" + i))
				|| (!isNaN(spec) && spec != i))
			continue;
		var ss = qmad[a.id];
		if (ss && (ss.ibcss_main_type || ss.ibcss_sub_type)) {
			q.mtype = ss.ibcss_main_type;
			q.msize = ss.ibcss_main_size;
			if (!q.msize)
				q.msize = 5;
			q.md = ss.ibcss_main_direction;
			if (!q.md)
				md = "right";
			q.mbg = ss.ibcss_main_bg_color;
			q.mborder = ss.ibcss_main_border_color;
			sx = ss.ibcss_main_position_x;
			sy = ss.ibcss_main_position_y;
			if (!sx)
				sx = 0;
			if (!sy)
				sy = 0;
			q.mpos = eval("new Array('" + sx + "','" + sy + "')");
			q.malign = eval("new Array('" + ss.ibcss_main_align_x + "','"
					+ ss.ibcss_main_align_y + "')");
			r = q.malign;
			if (!r[0])
				r[0] = "right";
			if (!r[1])
				r[1] = "center";
			q.stype = ss.ibcss_sub_type;
			q.ssize = ss.ibcss_sub_size;
			if (!q.ssize)
				q.ssize = 5;
			q.sd = ss.ibcss_sub_direction;
			if (!q.sd)
				sd = "right";
			q.sbg = ss.ibcss_sub_bg_color;
			q.sborder = ss.ibcss_sub_border_color;
			sx = ss.ibcss_sub_position_x;
			sy = ss.ibcss_sub_position_y;
			if (!sx)
				sx = 0;
			if (!sy)
				sy = 0;
			q.spos = eval("new Array('" + sx + "','" + sy + "')");
			q.salign = eval("new Array('" + ss.ibcss_sub_align_x + "','"
					+ ss.ibcss_sub_align_y + "')");
			r = q.salign;
			if (!r[0])
				r[0] = "right";
			if (!r[1])
				r[1] = "middle";
			q.type = ss.ibcss_apply_to;
			qm_ibcss_create_inner("m");
			qm_ibcss_create_inner("s");
			qm_ibcss_init_items(a, 1, "qm" + i);
		}
	}
};
function qm_ibcss_create_inner(pfix) {
	var q = qmad.ibcss;
	var wt = "";
	var s = q[pfix + "size"];
	var type = q[pfix + "type"];
	var head;
	if (type.indexOf("head") + 1)
		head = true;
	var gap;
	if (type.indexOf("gap") + 1)
		gap = true;
	var v;
	if (type.indexOf("-v") + 1)
		v = true;
	if (type.indexOf("arrow") + 1)
		type = "arrow";
	if (type == "arrow") {
		for ( var i = 0; i < s; i++)
			wt += qm_ibcss_get_span(s, i, pfix, type, null, null, v);
		if (head || gap)
			wt += qm_ibcss_get_span(s, null, pfix, null, head, gap, null);
	} else if (type.indexOf("square") + 1) {
		var inner;
		if (type.indexOf("-inner") + 1)
			inner = true;
		var raised;
		if (type.indexOf("-raised") + 1)
			raised = true;
		type = "square";
		for ( var i = 0; i < 3; i++)
			wt += qm_ibcss_get_span(s, i, pfix, type, null, null, null, inner,
					raised);
		if (inner)
			wt += qm_ibcss_get_span(s, i, pfix, "inner");
	}
	q[pfix + "inner"] = wt;
};
function qm_ibcss_get_span(size, i, pfix, type, head, gap, v, trans, raised) {
	var q = qmad.ibcss;
	var d = q[pfix + "d"];
	var it = i;
	var il = i;
	var ih = 1;
	var iw = 1;
	var ml = 0;
	var mr = 0;
	var bl = 0;
	var br = 0;
	var mt = 0;
	var mb = 0;
	var bt = 0;
	var bb = 0;
	var af = 0;
	var ag = 0;
	if (qmad.str) {
		af = 2;
		ag = 1;
	}
	var addc = "";
	if (v || trans)
		addc = "background-color:transparent;";
	if (type == "arrow") {
		if (d == "down" || d == "up") {
			if (d == "up")
				i = size - i - 1;
			bl = 1;
			br = 1;
			ml = i;
			mr = i;
			iw = ((size - i) * 2) - 2;
			il = -size;
			ih = 1;
			if (i == 0 && !v) {
				bl = iw + 2;
				br = 0;
				ml = 0;
				mr = 0;
				iw = 0;
				if (qmad.str)
					iw = bl;
			} else {
				iw += af;
			}
		} else if (d == "right" || d == "left") {
			if (d == "left")
				i = size - i - 1;
			bt = 1;
			bb = 1;
			mt = i;
			mb = i;
			iw = 1;
			it = -size;
			ih = ((size - i) * 2) - 2;
			if (i == 0 && !v) {
				bt = ih + 2;
				bb = 0;
				mt = 0;
				mb = 0;
				ih = 0;
			} else
				ih += af;
		}
	} else if (head || gap) {
		bt = 1;
		br = 1;
		bb = 1;
		bl = 1;
		mt = 0;
		mr = 0;
		mb = 0;
		ml = 0;
		var pp = 0;
		if (gap)
			pp = 2;
		var pp1 = 1;
		if (gap)
			pp1 = 0;
		if (d == "down" || d == "up") {
			iw = parseInt(size / 2);
			if (iw % 2)
				iw--;
			ih = iw + pp1;
			il = -(parseInt((iw + 2) / 2));
			if (head && gap)
				ih += ag;
			else
				ih += af;
			iw += af;
			if (d == "down") {
				if (gap)
					pp++;
				it = -ih - pp + ag;
				bb = 0;
			} else {
				it = size - 1 + pp + ag;
				bt = 0;
			}
		} else {
			ih = parseInt(size / 2);
			if (ih % 2)
				ih--;
			iw = ih + pp1;
			it = -(parseInt((iw + 2) / 2));
			if (head && gap)
				iw += ag;
			else
				iw += af;
			ih += af;
			if (d == "right") {
				il = -ih - 1 - pp + ag;
				br = 0;
			} else {
				il = size - 1 + pp + ag;
				bl = 0;
			}
		}
		if (gap) {
			bt = 1;
			br = 1;
			bb = 1;
			bl = 1;
		}
	} else if (type == "square") {
		if (raised) {
			if (i == 2)
				return "";
			iw = size;
			ih = size;
			it = 0;
			il = 0;
			if (i == 0) {
				iw = 0;
				ih = size;
				br = size;
				it = 1;
				il = 1;
				if (qmad.str)
					iw = br;
			}
		} else {
			if (size % 2)
				size++;
			it = 1;
			ih = size;
			iw = size;
			bl = 1;
			br = 1;
			il = 0;
			iw += af;
			if (i == 0 || i == 2) {
				ml = 1;
				it = 0;
				ih = 1;
				bl = size;
				br = 0;
				iw = 0;
				if (qmad.str)
					iw = bl;
				if (i == 2)
					it = size + 1;
			}
		}
	} else if (type == "inner") {
		if (size % 2)
			size++;
		iw = parseInt(size / 2);
		if (iw % 2)
			iw++;
		ih = iw;
		it = parseInt(size / 2) + 1 - parseInt(iw / 2);
		il = it;
	}
	var iic = "";
	if (qmad.str)
		iic = "&nbsp;";
	return '<span style="'
			+ addc
			+ 'border-width:'
			+ bt
			+ 'px '
			+ br
			+ 'px '
			+ bb
			+ 'px '
			+ bl
			+ 'px;border-style:solid;display:block;position:absolute;overflow:hidden;font-size:1px;line-height:0px;height:'
			+ ih + 'px;margin:' + mt + 'px ' + mr + 'px ' + mb + 'px ' + ml
			+ 'px;width:' + iw + 'px;top:' + it + 'px;left:' + il + 'px;">'
			+ iic + '</span>';
};
function qm_ibcss_init_items(a, main) {
	var q = qmad.ibcss;
	var aa, pf;
	aa = a.childNodes;
	for ( var j = 0; j < aa.length; j++) {
		if (aa[j].tagName == "A") {
			if (window.attachEvent)
				aa[j].attachEvent("onmouseover", qm_ibcss_hover);
			else if (window.addEventListener)
				aa[j].addEventListener("mouseover", qm_ibcss_hover, false);
			var skip = false;
			if (q.type != "all") {
				if (q.type == "parent" && !aa[j].cdiv)
					skip = true;
				if (q.type == "non-parent" && aa[j].cdiv)
					skip = true;
			}
			if (!skip) {
				if (main)
					pf = "m";
				else
					pf = "s";
				var ss = document.createElement("SPAN");
				ss.className = "qm-ibcss-static";
				var s1 = ss.style;
				s1.display = "block";
				s1.position = "relative";
				s1.fontSize = "1px";
				s1.lineHeight = "0px";
				s1.zIndex = 1;
				ss.ibhalign = q[pf + "align"][0];
				ss.ibvalign = q[pf + "align"][1];
				ss.ibposx = q[pf + "pos"][0];
				ss.ibposy = q[pf + "pos"][1];
				ss.ibsize = q[pf + "size"];
				qm_ibcss_position(aa[j], ss);
				ss.innerHTML = q[pf + "inner"];
				aa[j].qmibulletcss = aa[j].insertBefore(ss, aa[j].firstChild);
				ss.setAttribute("qmvbefore", 1);
				ss.setAttribute("isibulletcss", 1);
				if (aa[j].className.indexOf("qmactive") + 1)
					qm_ibcss_active(aa[j]);
			}
			if (aa[j].cdiv)
				new qm_ibcss_init_items(aa[j].cdiv, null);
		}
	}
};
function qm_ibcss_position(a, b) {
	if (b.ibhalign == "right")
		b.style.left = (a.offsetWidth + parseInt(b.ibposx) - b.ibsize) + "px";
	else if (b.ibhalign == "center")
		b.style.left = (parseInt(a.offsetWidth / 2) - parseInt(b.ibsize / 2) + parseInt(b.ibposx))
				+ "px";
	else
		b.style.left = b.ibposx + "px";
	if (b.ibvalign == "bottom")
		b.style.top = (a.offsetHeight + parseInt(b.ibposy) - b.ibsize) + "px";
	else if (b.ibvalign == "middle")
		b.style.top = parseInt((a.offsetHeight / 2) - parseInt(b.ibsize / 2)
				+ parseInt(b.ibposy))
				+ "px";
	else
		b.style.top = b.ibposy + "px";
};
function qm_ibcss_hover(e, targ) {
	e = e || window.event;
	if (!targ) {
		var targ = e.srcElement || e.target;
		while (targ.tagName != "A")
			targ = targ[qp];
	}
	var ch = qmad.ibcss.lasth;
	if (ch && ch != targ && ch.qmibulletcss)
		qm_ibcss_hover_off(new Object(), ch);
	if (targ.className.indexOf("qmactive") + 1)
		return;
	var wo = targ.qmibulletcss;
	if (wo) {
		x2("qm-ibcss-hover", wo, 1);
		qmad.ibcss.lasth = targ;
	}
	if (e)
		qm_kille(e);
};
function qm_ibcss_hover_off(e, o) {
	if (!o)
		o = qmad.ibcss.lasth;
	if (o && o.qmibulletcss)
		x2("qm-ibcss-hover", o.qmibulletcss);
};
function qm_ibcss_active(a, hide) {
	var wo = a.qmibulletcss;
	if (!hide && a.className.indexOf("qmactive") == -1)
		return;
	if (hide && a.idiv) {
		var o = a.idiv;
		if (o && o.qmibulletcss) {
			x2("qm-ibcss-active", o.qmibulletcss);
		}
	} else {
		if (!a.cdiv.offsetWidth)
			a.cdiv.style.visibility = "inherit";
		if (a.cdiv) {
			var aa = a.cdiv.childNodes;
			for ( var i = 0; i < aa.length; i++) {
				if (aa[i].tagName == "A" && aa[i].qmibulletcss)
					qm_ibcss_position(aa[i], aa[i].qmibulletcss);
			}
		}
		if (wo)
			x2("qm-ibcss-active", wo, 1);
	}
}