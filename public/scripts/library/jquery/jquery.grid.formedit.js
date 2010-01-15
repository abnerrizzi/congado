
<!-- saved from url=(0065)http://github.com/tonytomov/jqGrid/raw/master/js/grid.formedit.js -->
<HTML><BODY><PRE style="word-wrap: break-word; white-space: pre-wrap;">;(function($){
/**
 * jqGrid extension for form editing Grid Data
 * Tony Tomov tony@trirand.com
 * http://trirand.com/blog/ 
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
**/ 
var rp_ge = null;
$.jgrid.extend({
	searchGrid : function (p) {
		p = $.extend({
			recreateFilter: false,
			drag: true,
			sField:'searchField',
			sValue:'searchString',
			sOper: 'searchOper',
			sFilter: 'filters',
			beforeShowSearch: null,
			afterShowSearch : null,
			onInitializeSearch: null,
			closeAfterSearch : false,
			closeOnEscape : false,
			multipleSearch : false,
			// translation
			// if you want to change or remove the order change it in sopt
			// ['bw','eq','ne','lt','le','gt','ge','ew','cn'] 
			sopt: null,
			onClose : null
			// these are common options
		}, $.jgrid.search, p || {});
		return this.each(function() {
			var $t = this;
			if(!$t.grid) {return;}
			if($.fn.searchFilter) {
				var fid = "fbox_"+$t.p.id;
				if(p.recreateFilter===true) {$("#"+fid).remove();}
				if( $("#"+fid).html() != null ) {
					if ( $.isFunction(p.beforeShowSearch) ) { p.beforeShowSearch($("#"+fid)); };
					showFilter();
					if( $.isFunction(p.afterShowSearch) ) { p.afterShowSearch($("#"+fid)); }
				} else {
					var fields = [],
					colNames = $("#"+$t.p.id).jqGrid("getGridParam","colNames"),
					colModel = $("#"+$t.p.id).jqGrid("getGridParam","colModel"),
					stempl = ['eq','ne','lt','le','gt','ge','bw','bn','in','ni','ew','en','cn','nc'],
					j,pos,k,oprtr;
					oprtr = jQuery.fn.searchFilter.defaults.operators;
					if (p.sopt !=null) {
						oprtr = [];
						k=0;
						for(j=0;j&lt;p.sopt.length;j++) {
							if( (pos= $.inArray(p.sopt[j],stempl)) != -1 ){
								oprtr[k] = {op:p.sopt[j],text: p.odata[pos]};
								k++;
							}
						}
					}
					var searchable;
				    $.each(colModel, function(i, v) {
				        searchable = (typeof v.search === 'undefined') ?  true: v.search ,
				        hidden = (v.hidden === true),
						soptions = $.extend({}, {text: colNames[i], itemval: v.index || v.name}, this.searchoptions),
						ignoreHiding = (soptions.searchhidden === true);
						if(typeof soptions.sopt == 'undefined') soptions.sopt = p.sopt ||  stempl;
						k=0;
						soptions.ops =[];
						if(soptions.sopt.length&gt;0) {
							for(j=0;j&lt;soptions.sopt.length;j++) {
								if( (pos= $.inArray(soptions.sopt[j],stempl)) != -1 ){
									soptions.ops[k] = {op:soptions.sopt[j],text: p.odata[pos]};
									k++;
								}
							}
						}
						if(typeof(this.stype) === 'undefined') this.stype='text';
						if(this.stype == 'select') {
							if ( soptions.dataUrl != null) {}
							else {
								var eov;
								if(soptions.value)
									eov = soptions.value;
								else if(this.editoptions)
									eov = this.editoptions.value;
								if(eov) {
									soptions.dataValues =[];
									if(typeof(eov) === 'string') {
										var so = eov.split(";"),sv;
										for(j=0;j&lt;so.length;j++) {
											sv = so[j].split(":");
											soptions.dataValues[j] ={value:sv[0],text:sv[1]};
										}
									} else if (typeof(eov) === 'object') {
										j=0;
										for (var key in eov) {
											soptions.dataValues[j] ={value:key,text:eov[key]};
											j++;
										}
									}
								}
							}
						}
				        if ((ignoreHiding &amp;&amp; searchable) || (searchable &amp;&amp; !hidden)) {
							fields.push(soptions);
						}
					});
					if(fields.length&gt;0){
						$("&lt;div id='"+fid+"' role='dialog' tabindex='-1'&gt;&lt;/div&gt;").insertBefore("#gview_"+$t.p.id);
						$("#"+fid).searchFilter(fields, { groupOps: p.groupOps, operators: oprtr, onClose:hideFilter, resetText: p.Reset, searchText: p.Find, windowTitle: p.caption,  rulesText:p.rulesText, matchText:p.matchText, onSearch: searchFilters, onReset: resetFilters,stringResult:p.multipleSearch, ajaxSelectOptions: $.extend({},$.jgrid.ajaxOptions,$t.p.ajaxSelectOptions ||{}) });
						$(".ui-widget-overlay","#"+fid).remove();
						if($t.p.direction=="rtl") $(".ui-closer","#"+fid).css("float","left");
						if (p.drag===true) {
							$("#"+fid+" table thead tr:first td:first").css('cursor','move');
							if(jQuery.fn.jqDrag) {
								$("#"+fid).jqDrag($("#"+fid+" table thead tr:first td:first"));
							} else {
								try {
									$("#"+fid).draggable({handle: $("#"+fid+" table thead tr:first td:first")});
								} catch (e) {}
							}
						}
						if(p.multipleSearch === false) {
							$(".ui-del, .ui-add, .ui-del, .ui-add-last, .matchText, .rulesText", "#"+fid).hide();
							$("select[name='groupOp']","#"+fid).hide();
						}
						if ( $.isFunction(p.onInitializeSearch) ) { p.onInitializeSearch( $("#"+fid) ); };
						if ( $.isFunction(p.beforeShowSearch) ) { p.beforeShowSearch($("#"+fid)); };
						showFilter();
						if( $.isFunction(p.afterShowSearch) ) { p.afterShowSearch($("#"+fid)); }
						if(p.closeOnEscape===true){
							$("#"+fid).keydown( function( e ) {
								if( e.which == 27 ) {
									hideFilter($("#"+fid));
								}
							});
						}
					}
				}
			}
			function searchFilters(filters) {
				var hasFilters = (filters !== undefined),
				grid = $("#"+$t.p.id), sdata={};
				if(p.multipleSearch===false) {
					sdata[p.sField] = filters.rules[0].field;
					sdata[p.sValue] = filters.rules[0].data;
					sdata[p.sOper] = filters.rules[0].op;
				} else {
					sdata[p.sFilter] = filters;
				}
				grid[0].p.search = hasFilters;
				$.extend(grid[0].p.postData,sdata);
				grid.trigger("reloadGrid",[{page:1}]);
				if(p.closeAfterSearch) hideFilter($("#"+fid));
			}
			function resetFilters(filters) {
				var hasFilters = (filters !== undefined),
				grid = $("#"+$t.p.id), sdata=[];
				grid[0].p.search = hasFilters;
				if(p.multipleSearch===false) {
					sdata[p.sField] = sdata[p.sValue] = sdata[p.sOper] = "";
				} else {
					sdata[p.sFilter] = "";
				}
				$.extend(grid[0].p.postData,sdata);
				grid.trigger("reloadGrid",[{page:1}]);
			}
			function hideFilter(selector) {
				if(p.onClose){
					var fclm = p.onClose(selector);
					if(typeof fclm == 'boolean' &amp;&amp; !fclm) return;
				}
				selector.hide();
				$(".jqgrid-overlay:first","#gbox_"+$t.p.id).hide();
			}
			function showFilter(){
				var fl = $(".ui-searchFilter").length;
				if(fl &gt; 1) {
					var zI = $("#"+fid).css("zIndex");
					$("#"+fid).css({zIndex:parseInt(zI)+fl});
				}
				$("#"+fid).show();
				$(".jqgrid-overlay:first","#gbox_"+$t.p.id).show();
				try{$(':input:visible',"#"+fid)[0].focus();}catch(_){}
			}
		});
	},
	editGridRow : function(rowid, p){
		p = $.extend({
			top : 0,
			left: 0,
			width: 300,
			height: 'auto',
			dataheight: 'auto',
			modal: false,
			drag: true,
			resize: true,
			url: null,
			mtype : "POST",
			clearAfterAdd :true,
			closeAfterEdit : false,
			reloadAfterSubmit : true,
			onInitializeForm: null,
			beforeInitData: null,
			beforeShowForm: null,
			afterShowForm: null,
			beforeSubmit: null,
			afterSubmit: null,
			onclickSubmit: null,
			afterComplete: null,
			onclickPgButtons : null,
			afterclickPgButtons: null,
			editData : {},
			recreateForm : false,
			jqModal : true,
			closeOnEscape : false,
			addedrow : "first",
			topinfo : '',
			bottominfo: '',
			saveicon : [],
			closeicon : [],
			savekey: [false,13],
			navkeys: [false,38,40],
			checkOnSubmit : false,
			checkOnUpdate : false,
			_savedData : {},
			processing : false,
			onClose : null,
			ajaxEditOptions : {},
			serializeEditData : null,
			viewPagerButtons : true
		}, $.jgrid.edit, p || {});
		rp_ge = p;
		return this.each(function(){
			var $t = this;
			if (!$t.grid || !rowid) { return; }
			var gID = $t.p.id,
			frmgr = "FrmGrid_"+gID,frmtb = "TblGrid_"+gID,
			IDs = {themodal:'editmod'+gID,modalhead:'edithd'+gID,modalcontent:'editcnt'+gID, scrollelm : frmgr},
			onBeforeShow = $.isFunction(rp_ge.beforeShowForm) ? rp_ge.beforeShowForm : false,
			onAfterShow = $.isFunction(rp_ge.afterShowForm) ? rp_ge.afterShowForm : false,
			onBeforeInit = $.isFunction(rp_ge.beforeInitData) ? rp_ge.beforeInitData : false,
			onInitializeForm = $.isFunction(rp_ge.onInitializeForm) ? rp_ge.onInitializeForm : false,
			copydata = null,
			maxCols = 1, maxRows=0,	gurl, postdata, ret, extpost, newData, diff;
			if (rowid=="new") {
				rowid = "_empty";
				p.caption=p.addCaption;
			} else {
				p.caption=p.editCaption;
			};
			if(p.recreateForm===true &amp;&amp; $("#"+IDs.themodal).html() != null) {
				$("#"+IDs.themodal).remove();
			}
			var closeovrl = true;
			if(p.checkOnUpdate &amp;&amp; p.jqModal &amp;&amp; !p.modal) {
				closeovrl = false;
			}
			if ( $("#"+IDs.themodal).html() != null ) {
				$(".ui-jqdialog-title","#"+IDs.modalhead).html(p.caption);
				$("#FormError","#"+frmtb).hide();
				if(rp_ge.topinfo) {
					$(".topinfo","#"+frmtb+"_2").html(rp_ge.topinfo);
					$(".tinfo","#"+frmtb+"_2").show();
				}
					else $(".tinfo","#"+frmtb+"_2").hide();
				if(rp_ge.bottominfo) {
					$(".bottominfo","#"+frmtb+"_2").html(rp_ge.bottominfo);
					$(".binfo","#"+frmtb+"_2").show();
				}
				else $(".binfo","#"+frmtb+"_2").hide();

				if(onBeforeInit) { onBeforeInit($("#"+frmgr)); }
				// filldata
				fillData(rowid,$t,frmgr);
				///
				if(rowid=="_empty" || !rp_ge.viewPagerButtons) {
					$("#pData, #nData","#"+frmtb+"_2").hide();
				} else { 
					$("#pData, #nData","#"+frmtb+"_2").show();
				}
				if(rp_ge.processing===true) {
					rp_ge.processing=false;
					$("#sData", "#"+frmtb+"_2").removeClass('ui-state-active');
				}
				if($("#"+frmgr).data("disabled")===true) {
					$(".confirm","#"+IDs.themodal).hide();
					$("#"+frmgr).data("disabled",false);
				}
				if(onBeforeShow) { onBeforeShow($("#"+frmgr)); }
				$("#"+IDs.themodal).data("onClose",rp_ge.onClose);
				viewModal("#"+IDs.themodal,{gbox:"#gbox_"+gID,jqm:p.jqModal, jqM: false, closeoverlay: closeovrl, modal:p.modal});
				if(!closeovrl) {
					$(".jqmOverlay").click(function(){
						if(!checkUpdates()) return false;
						hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal, onClose: rp_ge.onClose});
						return false;
					});
				}
				if(onAfterShow) { onAfterShow($("#"+frmgr)); }
			} else {
				$($t.p.colModel).each( function(i) {
					var fmto = this.formoptions;
					maxCols = Math.max(maxCols, fmto ? fmto.colpos || 0 : 0 );
					maxRows = Math.max(maxRows, fmto ? fmto.rowpos || 0 : 0 );
				});
				var dh = isNaN(p.dataheight) ? p.dataheight : p.dataheight+"px";
				var flr, frm = $("&lt;form name='FormPost' id='"+frmgr+"' class='FormGrid' style='width:100%;overflow:auto;position:relative;height:"+dh+";'&gt;&lt;/form&gt;").data("disabled",false),
				tbl =$("&lt;table id='"+frmtb+"' class='EditTable' cellspacing='0' cellpading='0' border='0'&gt;&lt;tbody&gt;&lt;/tbody&gt;&lt;/table&gt;");
				$(frm).append(tbl);
				flr = $("&lt;tr id='FormError' style='display:none'&gt;&lt;td class='ui-state-error' colspan='"+(maxCols*2)+"'&gt;&lt;/td&gt;&lt;/tr&gt;");
				flr[0].rp = 0;
				$(tbl).append(flr);
				//topinfo
				flr = $("&lt;tr style='display:none' class='tinfo'&gt;&lt;td class='topinfo' colspan='"+(maxCols*2)+"'&gt;"+rp_ge.topinfo+"&lt;/td&gt;&lt;/tr&gt;");
				flr[0].rp = 0;
				$(tbl).append(flr);
				// set the id.
				// use carefull only to change here colproperties.
				if(onBeforeInit) { onBeforeInit($("#"+frmgr)); }
				// create data
				var rtlb = $t.p.direction == "rtl" ? true :false,
				bp = rtlb ? "nData" : "pData",
				bn = rtlb ? "pData" : "nData",
				valref = createData(rowid,$t,tbl,maxCols),
				// buttons at footer
				bP = "&lt;a href='javascript:void(0)' id='"+bp+"' class='fm-button ui-state-default ui-corner-left'&gt;&lt;span class='ui-icon ui-icon-triangle-1-w'&gt;&lt;/span&gt;&lt;/div&gt;",
				bN = "&lt;a href='javascript:void(0)' id='"+bn+"' class='fm-button ui-state-default ui-corner-right'&gt;&lt;span class='ui-icon ui-icon-triangle-1-e'&gt;&lt;/span&gt;&lt;/div&gt;",
				bS  ="&lt;a href='javascript:void(0)' id='sData' class='fm-button ui-state-default ui-corner-all'&gt;"+p.bSubmit+"&lt;/a&gt;",
				bC  ="&lt;a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'&gt;"+p.bCancel+"&lt;/a&gt;";
				var bt = "&lt;table border='0' class='EditTable' id='"+frmtb+"_2'&gt;&lt;tbody&gt;&lt;tr id='Act_Buttons'&gt;&lt;td class='navButton ui-widget-content'&gt;"+(rtlb ? bN+bP : bP+bN)+"&lt;/td&gt;&lt;td class='EditButton ui-widget-content'&gt;"+bS+bC+"&lt;/td&gt;&lt;/tr&gt;";
				bt += "&lt;tr style='display:none' class='binfo'&gt;&lt;td class='bottominfo' colspan='2'&gt;"+rp_ge.bottominfo+"&lt;/td&gt;&lt;/tr&gt;";
				bt += "&lt;/tbody&gt;&lt;/table&gt;";
				if(maxRows &gt;  0) {
					var sd=[];
					$.each($(tbl)[0].rows,function(i,r){
						sd[i] = r;
					});
					sd.sort(function(a,b){
						if(a.rp &gt; b.rp) {return 1;}
						if(a.rp &lt; b.rp) {return -1;}
						return 0;
					});
					$.each(sd, function(index, row) {
						$('tbody',tbl).append(row);
					});
				}
				p.gbox = "#gbox_"+gID;
				var cle = false;
				if(p.closeOnEscape===true){
					p.closeOnEscape = false;
					cle = true;
				}
				var tms = $("&lt;span&gt;&lt;/span&gt;").append(frm).append(bt);
				createModal(IDs,tms,p,"#gview_"+$t.p.id,$("#gview_"+$t.p.id)[0]);
				if(rtlb) {
					$("#pData, #nData","#"+frmtb+"_2").css("float","right");
					$(".EditButton","#"+frmtb+"_2").css("text-align","left");
				}
				if(rp_ge.topinfo) $(".tinfo","#"+frmtb+"_2").show();
				if(rp_ge.bottominfo) $(".binfo","#"+frmtb+"_2").show();
				tms = null; bt=null;
				$("#"+IDs.themodal).keydown( function( e ) {
					var wkey = e.target;
					if ($("#"+frmgr).data("disabled")===true ) return false; //??
					if(rp_ge.savekey[0] === true &amp;&amp; e.which == rp_ge.savekey[1]) { // save
						if(wkey.tagName != "TEXTAREA") {
							$("#sData", "#"+frmtb+"_2").trigger("click");
							return false;
						}
					}
					if(e.which === 27) {
						if(!checkUpdates()) return false;
						if(cle)	hideModal(this,{gb:p.gbox,jqm:p.jqModal, onClose: rp_ge.onClose});
						return false;
					}
					if(rp_ge.navkeys[0]===true) {
						if($("#id_g","#"+frmtb).val() == "_empty") return true;
						if(e.which == rp_ge.navkeys[1]){ //up
							$("#pData", "#"+frmtb+"_2").trigger("click");
							return false;
						}
						if(e.which == rp_ge.navkeys[2]){ //down
							$("#nData", "#"+frmtb+"_2").trigger("click");
							return false;
						}
					}
				});
				if(p.checkOnUpdate) {
					$("a.ui-jqdialog-titlebar-close span","#"+IDs.themodal).removeClass("jqmClose");
					$("a.ui-jqdialog-titlebar-close","#"+IDs.themodal).unbind("click")
					.click(function(){
						if(!checkUpdates()) return false;
						hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal,onClose: rp_ge.onClose});
						return false;
					});
				}
				p.saveicon = $.extend([true,"left","ui-icon-disk"],p.saveicon);
				p.closeicon = $.extend([true,"left","ui-icon-close"],p.closeicon);
				// beforeinitdata after creation of the form
				if(p.saveicon[0]==true) {
					$("#sData","#"+frmtb+"_2").addClass(p.saveicon[1] == "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
					.append("&lt;span class='ui-icon "+p.saveicon[2]+"'&gt;&lt;/span&gt;");
				}
				if(p.closeicon[0]==true) {
					$("#cData","#"+frmtb+"_2").addClass(p.closeicon[1] == "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
					.append("&lt;span class='ui-icon "+p.closeicon[2]+"'&gt;&lt;/span&gt;");
				}
				if(rp_ge.checkOnSubmit || rp_ge.checkOnUpdate) {
					bS  ="&lt;a href='javascript:void(0)' id='sNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'&gt;"+p.bYes+"&lt;/a&gt;";
					bN  ="&lt;a href='javascript:void(0)' id='nNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'&gt;"+p.bNo+"&lt;/a&gt;";
					bC  ="&lt;a href='javascript:void(0)' id='cNew' class='fm-button ui-state-default ui-corner-all' style='z-index:1002'&gt;"+p.bExit+"&lt;/a&gt;";
					var ii, zI = p.zIndex  || 999; zI ++;
					if ($.browser.msie &amp;&amp; $.browser.version ==6) {
						ii = '&lt;iframe style="display:block;position:absolute;z-index:-1;filter:Alpha(Opacity=\'0\');" src="javascript:false;"&gt;&lt;/iframe&gt;';
					} else { ii="";}
					$("&lt;div class='ui-widget-overlay jqgrid-overlay confirm' style='z-index:"+zI+";display:none;'&gt;&amp;#160;"+ii+"&lt;/div&gt;&lt;div class='confirm ui-widget-content ui-jqconfirm' style='z-index:"+(zI+1)+"'&gt;"+p.saveData+"&lt;br/&gt;&lt;br/&gt;"+bS+bN+bC+"&lt;/div&gt;").insertAfter("#"+frmgr);
					$("#sNew","#"+IDs.themodal).click(function(){
						postIt();
						$("#"+frmgr).data("disabled",false);
						$(".confirm","#"+IDs.themodal).hide();
						return false;
					});
					$("#nNew","#"+IDs.themodal).click(function(){
						$(".confirm","#"+IDs.themodal).hide();
						$("#"+frmgr).data("disabled",false);
						setTimeout(function(){$(":input","#"+frmgr)[0].focus();},0);
						return false;
					});
					$("#cNew","#"+IDs.themodal).click(function(){
						$(".confirm","#"+IDs.themodal).hide();
						$("#"+frmgr).data("disabled",false);
						hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal,onClose: rp_ge.onClose});
						return false;
					});
				}
				// here initform - only once
				if(onInitializeForm) { onInitializeForm($("#"+frmgr)); }
				if(rowid=="_empty" || !rp_ge.viewPagerButtons) { $("#pData,#nData","#"+frmtb+"_2").hide(); } else { $("#pData,#nData","#"+frmtb+"_2").show(); }
				if(onBeforeShow) { onBeforeShow($("#"+frmgr)); }
				$("#"+IDs.themodal).data("onClose",rp_ge.onClose);
				viewModal("#"+IDs.themodal,{gbox:"#gbox_"+gID,jqm:p.jqModal,closeoverlay:closeovrl,modal:p.modal});
				if(!closeovrl) {
					$(".jqmOverlay").click(function(){
						if(!checkUpdates()) return false;
						hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal, onClose: rp_ge.onClose});
						return false;
					});
				}
				if(onAfterShow) { onAfterShow($("#"+frmgr)); }
				$(".fm-button","#"+IDs.themodal).hover(
				   function(){$(this).addClass('ui-state-hover');}, 
				   function(){$(this).removeClass('ui-state-hover');}
				);
				$("#sData", "#"+frmtb+"_2").click(function(e){
					postdata = {}; extpost={};
					$("#FormError","#"+frmtb).hide();
					// all depend on ret array
					//ret[0] - succes
					//ret[1] - msg if not succes
					//ret[2] - the id  that will be set if reload after submit false
					getFormData();
					if(postdata[$t.p.id+"_id"] == "_empty")	postIt();
					else if(p.checkOnSubmit===true ) {
						newData = $.extend({},postdata,extpost);
						diff = compareData(newData,rp_ge._savedData);
						if(diff) {
							$("#"+frmgr).data("disabled",true);
							$(".confirm","#"+IDs.themodal).show();
						} else {
							postIt();
						}
					} else {
						postIt();
					}
					return false;
				});
				$("#cData", "#"+frmtb+"_2").click(function(e){
					if(!checkUpdates()) return false;
					hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal,onClose: rp_ge.onClose});
					return false;
				});
				$("#nData", "#"+frmtb+"_2").click(function(e){
					if(!checkUpdates()) return false;
					$("#FormError","#"+frmtb).hide();
					var npos = getCurrPos();
					npos[0] = parseInt(npos[0]);
					if(npos[0] != -1 &amp;&amp; npos[1][npos[0]+1]) {
						if($.isFunction(p.onclickPgButtons)) {
							p.onclickPgButtons('next',$("#"+frmgr),npos[1][npos[0]]);
						}
						fillData(npos[1][npos[0]+1],$t,frmgr);
						$($t).jqGrid("setSelection",npos[1][npos[0]+1]);
						if($.isFunction(p.afterclickPgButtons)) {
							p.afterclickPgButtons('next',$("#"+frmgr),npos[1][npos[0]+1]);
						}
						updateNav(npos[0]+1,npos[1].length-1);
					};
					return false;
				});
				$("#pData", "#"+frmtb+"_2").click(function(e){
					if(!checkUpdates()) return false;
					$("#FormError","#"+frmtb).hide();
					var ppos = getCurrPos();
					if(ppos[0] != -1 &amp;&amp; ppos[1][ppos[0]-1]) {
						if($.isFunction(p.onclickPgButtons)) {
							p.onclickPgButtons('prev',$("#"+frmgr),ppos[1][ppos[0]]);
						}
						fillData(ppos[1][ppos[0]-1],$t,frmgr);
						$($t).jqGrid("setSelection",ppos[1][ppos[0]-1]);
						if($.isFunction(p.afterclickPgButtons)) {
							p.afterclickPgButtons('prev',$("#"+frmgr),ppos[1][ppos[0]-1]);
						}
						updateNav(ppos[0]-1,ppos[1].length-1);
					};
					return false;
				});
			}
			var posInit =getCurrPos();
			updateNav(posInit[0],posInit[1].length-1);
			function updateNav(cr,totr,rid){
				if (cr==0) { $("#pData","#"+frmtb+"_2").addClass('ui-state-disabled'); } else { $("#pData","#"+frmtb+"_2").removeClass('ui-state-disabled'); }
				if (cr==totr) { $("#nData","#"+frmtb+"_2").addClass('ui-state-disabled'); } else { $("#nData","#"+frmtb+"_2").removeClass('ui-state-disabled'); }
			}
			function getCurrPos() {
				var rowsInGrid = $($t).jqGrid("getDataIDs"),
				selrow = $("#id_g","#"+frmtb).val(),
				pos = $.inArray(selrow,rowsInGrid);
				return [pos,rowsInGrid];
			}
			function checkUpdates () {
				var stat = true;
				$("#FormError","#"+frmtb).hide();
				if(rp_ge.checkOnUpdate) {
					postdata = {}; extpost={};
					getFormData();
					newData = $.extend({},postdata,extpost);
					diff = compareData(newData,rp_ge._savedData);
					if(diff) {
						$("#"+frmgr).data("disabled",true);
						$(".confirm","#"+IDs.themodal).show();
						stat = false;
					}
				}
				return stat;
			}
			function getFormData(){
				$(".FormElement", "#"+frmtb).each(function(i) {
					var celm = $(".customelement", this);
					if (celm.length) {
						var  elem = celm[0], nm = elem.name;
						$.each($t.p.colModel, function(i,n){
							if(this.name == nm &amp;&amp; this.editoptions &amp;&amp; $.isFunction(this.editoptions.custom_value)) {
								try {
									postdata[nm] = this.editoptions.custom_value($("#"+nm,"#"+frmtb),'get');
									if (postdata[nm] === undefined) throw "e1";
								} catch (e) {
									if (e=="e1") info_dialog(jQuery.jgrid.errors.errcap,"function 'custom_value' "+$.jgrid.edit.msg.novalue,jQuery.jgrid.edit.bClose);
									else info_dialog(jQuery.jgrid.errors.errcap,e.message,jQuery.jgrid.edit.bClose);
								}
								return true;
							}
						});
					} else {
					switch ($(this).get(0).type) {
						case "checkbox":
							if($(this).attr("checked")) {
								postdata[this.name]= $(this).val();
							}else {
								var ofv = $(this).attr("offval");
								postdata[this.name]= ofv;
							}
						break;
						case "select-one":
							postdata[this.name]= $("option:selected",this).val();
							extpost[this.name]= $("option:selected",this).text();
						break;
						case "select-multiple":
							postdata[this.name]= $(this).val();
							if(postdata[this.name]) postdata[this.name] = postdata[this.name].join(",");
							else postdata[this.name] ="";
							var selectedText = [];
							$("option:selected",this).each(
								function(i,selected){
									selectedText[i] = $(selected).text();
								}
							);
							extpost[this.name]= selectedText.join(",");
						break;								
						case "password":
						case "text":
						case "textarea":
						case "button":
							postdata[this.name] = $(this).val();
							postdata[this.name] = !$t.p.autoencode ? postdata[this.name] : $.jgrid.htmlEncode(postdata[this.name]);
						break;
					}
					}
				});
				return true;
			}
			function createData(rowid,obj,tb,maxcols){
				var nm, hc,trdata, cnt=0,tmp, dc,elc, retpos=[], ind=false, rp,cp,
				tdtmpl = "&lt;td class='CaptionTD ui-widget-content'&gt;&amp;#160;&lt;/td&gt;&lt;td class='DataTD ui-widget-content' style='white-space:pre'&gt;&amp;#160;&lt;/td&gt;", tmpl=""; //*2
				for (var i =1;i&lt;=maxcols;i++) {
					tmpl += tdtmpl;
				}
				if(rowid != '_empty') {
					ind = $(obj).jqGrid("getInd",rowid);
				}
				$(obj.p.colModel).each( function(i) {
					nm = this.name;
					// hidden fields are included in the form
					if(this.editrules &amp;&amp; this.editrules.edithidden == true) {
						hc = false;
					} else {
						hc = this.hidden === true ? true : false;
					}
					dc = hc ? "style='display:none'" : "";
					if ( nm !== 'cb' &amp;&amp; nm !== 'subgrid' &amp;&amp; this.editable===true &amp;&amp; nm !== 'rn') {
						if(ind === false) {
							tmp = "";
						} else {
							if(nm == obj.p.ExpandColumn &amp;&amp; obj.p.treeGrid === true) {
								tmp = $("td:eq("+i+")",obj.rows[ind]).text();
							} else {
								try {
									tmp =  $.unformat($("td:eq("+i+")",obj.rows[ind]),{rowId:rowid, colModel:this},i);
								} catch (_) {
									tmp = $("td:eq("+i+")",obj.rows[ind]).html();
								}
							}
						}
						var opt = $.extend({}, this.editoptions || {} ,{id:nm,name:nm});
						frmopt = $.extend({}, {elmprefix:'',elmsuffix:'',rowabove:false,rowcontent:''}, this.formoptions || {}),
						rp = parseInt(frmopt.rowpos) || cnt+1,
						cp = parseInt((parseInt(frmopt.colpos) || 1)*2);
						if(rowid == "_empty" &amp;&amp; opt.defaultValue ) {
							tmp = $.isFunction(opt.defaultValue) ? opt.defaultValue() : opt.defaultValue; 
						}
						if(!this.edittype) this.edittype = "text";
						elc = createEl(this.edittype,opt,tmp,false,$.extend({},$.jgrid.ajaxOptions,obj.p.ajaxSelectOptions || {}));
						if(tmp == "" &amp;&amp; this.edittype == "checkbox") {tmp = $(elc).attr("offval");}
						if(rp_ge.checkOnSubmit || rp_ge.checkOnUpdate) rp_ge._savedData[nm] = tmp;
						$(elc).addClass("FormElement");
						trdata = $(tb).find("tr[rowpos="+rp+"]");
						if(frmopt.rowabove) {
							var newdata = $("&lt;tr&gt;&lt;td class='contentinfo' colspan='"+(maxcols*2)+"'&gt;"+frmopt.rowcontent+"&lt;/td&gt;&lt;/tr&gt;");
							$(tb).append(newdata);
							newdata[0].rp = rp;
						}
						if ( trdata.length==0 ) {
							trdata = $("&lt;tr "+dc+" rowpos='"+rp+"'&gt;&lt;/tr&gt;").addClass("FormData").attr("id","tr_"+nm);
							$(trdata).append(tmpl);
							$(tb).append(trdata);
							trdata[0].rp = rp;
						}
						$("td:eq("+(cp-2)+")",trdata[0]).html( typeof frmopt.label === 'undefined' ? obj.p.colNames[i]: frmopt.label);
						$("td:eq("+(cp-1)+")",trdata[0]).append(frmopt.elmprefix).append(elc).append(frmopt.elmsuffix);
						retpos[cnt] = i;
						cnt++;
					};
				});
				if( cnt &gt; 0) {
					var idrow = $("&lt;tr class='FormData' style='display:none'&gt;&lt;td class='CaptionTD'&gt;&lt;/td&gt;&lt;td colspan='"+ (maxcols*2-1)+"' class='DataTD'&gt;&lt;input class='FormElement' id='id_g' type='text' name='"+obj.p.id+"_id' value='"+rowid+"'/&gt;&lt;/td&gt;&lt;/tr&gt;");
					idrow[0].rp = cnt+999;
					$(tb).append(idrow);
					if(rp_ge.checkOnSubmit || rp_ge.checkOnUpdate) rp_ge._savedData.id = rowid;
				}
				return retpos;
			}
			function fillData(rowid,obj,fmid){
				var nm, hc,cnt=0,tmp, fld,opt,vl,vlc;
				if(rp_ge.checkOnSubmit || rp_ge.checkOnUpdate) {rp_ge._savedData = {};rp_ge._savedData.id=rowid;}
				var cm = obj.p.colModel;
				if(rowid == '_empty') {
					$(cm).each(function(i){
						nm = this.name;
						opt = $.extend({}, this.editoptions || {} );
						fld = $("#"+$.jgrid.jqID(nm),"#"+fmid);
						if(fld[0] != null) {
							vl = "";
							if(opt.defaultValue ) {
								vl = $.isFunction(opt.defaultValue) ? opt.defaultValue() : opt.defaultValue;
								if(fld[0].type=='checkbox') {
									vlc = vl.toLowerCase();
									if(vlc.search(/(false|0|no|off|undefined)/i)&lt;0 &amp;&amp; vlc!=="") {
										fld[0].checked = true;
										fld[0].defaultChecked = true;
										fld[0].value = vl;
									} else {
										fld.attr({checked:"",defaultChecked:""});
									}
								} else {fld.val(vl); }
							} else {
								if( fld[0].type=='checkbox' ) {
									fld[0].checked = false;
									fld[0].defaultChecked = false;
									vl = $(fld).attr("offval");
								} else if (fld[0].type.substr(0,6)=='select') {
									fld[0].selectedIndex = 0; 
								} else {
									fld.val(vl);
								}
							}
							if(rp_ge.checkOnSubmit===true || rp_ge.checkOnUpdate) rp_ge._savedData[nm] = vl;
						}
					});
					$("#id_g","#"+fmid).val(rowid);
					return;
				}
				var tre = $(obj).jqGrid("getInd",rowid,true);
				if(!tre) return;
				$('td',tre).each( function(i) {
					nm = cm[i].name;
					// hidden fields are included in the form
					if ( nm !== 'cb' &amp;&amp; nm !== 'subgrid' &amp;&amp; nm !== 'rn' &amp;&amp; cm[i].editable===true) {
						if(nm == obj.p.ExpandColumn &amp;&amp; obj.p.treeGrid === true) {
							tmp = $(this).text();
						} else {
							try {
								tmp =  $.unformat(this,{rowId:rowid, colModel:cm[i]},i);
							} catch (_) {
								tmp = $(this).html();
							}
						}
						if(rp_ge.checkOnSubmit===true || rp_ge.checkOnUpdate) rp_ge._savedData[nm] = tmp;
						nm = $.jgrid.jqID(nm);
						switch (cm[i].edittype) {
							case "password":
							case "text":
							case "button" :
							case "image":
								tmp = $.jgrid.htmlDecode(tmp);
								$("#"+nm,"#"+fmid).val(tmp);
								break;
							case "textarea":
								if(tmp == "&amp;nbsp;" || tmp == "&amp;#160;" || (tmp.length==1 &amp;&amp; tmp.charCodeAt(0)==160) ) {tmp='';}
								$("#"+nm,"#"+fmid).val(tmp);
								break;
							case "select":
								var opv = tmp.split(",");
								opv = $.map(opv,function(n){return $.trim(n)});
								$("#"+nm+" option","#"+fmid).each(function(j){
									if (!cm[i].editoptions.multiple &amp;&amp; (opv[0] == $(this).text() || opv[0] == $(this).val()) ){
										this.selected= true;
									} else if (cm[i].editoptions.multiple){
										if(  $.inArray($(this).text(), opv ) &gt; -1 || $.inArray($(this).val(), opv ) &gt; -1  ){
											this.selected = true;
										}else{
											this.selected = false;
										}
									} else {
										this.selected = false;
									}
								});
								break;
							case "checkbox":
								tmp = tmp+"";
								tmp = tmp.toLowerCase();
								if(tmp.search(/(false|0|no|off|undefined)/i)&lt;0 &amp;&amp; tmp!=="") {
									$("#"+nm,"#"+fmid).attr("checked",true);
									$("#"+nm,"#"+fmid).attr("defaultChecked",true); //ie
								} else {
									$("#"+nm,"#"+fmid).attr("checked",false);
									$("#"+nm,"#"+fmid).attr("defaultChecked",""); //ie
								}
								break;
							case 'custom' :
								try {
									if(cm[i].editoptions &amp;&amp; $.isFunction(cm[i].editoptions.custom_value)) {
										var dummy = cm[i].editoptions.custom_value($("#"+nm,"#"+fmid),'set',tmp);
									} else throw "e1";
								} catch (e) {
									if (e=="e1") info_dialog(jQuery.jgrid.errors.errcap,"function 'custom_value' "+$.jgrid.edit.msg.nodefined,jQuery.jgrid.edit.bClose);
									else info_dialog(jQuery.jgrid.errors.errcap,e.message,jQuery.jgrid.edit.bClose);
								}
								break;
						}
						cnt++;
					}
				});
				if(cnt&gt;0) { $("#id_g","#"+frmtb).val(rowid); }
			}
			function postIt() {
				var copydata, ret=[true,"",""], onCS = {};
				if($.isFunction(rp_ge.beforeCheckValues)) {
					var retvals = rp_ge.beforeCheckValues(postdata,$("#"+frmgr),postdata[$t.p.id+"_id"] == "_empty" ? "add" : "edit");
					if(retvals &amp;&amp; typeof(retvals) === 'object') postdata = retvals;
				}
				for( var key in postdata ){
					ret = checkValues(postdata[key],key,$t);
					if(ret[0] == false) break;
				}
				if(ret[0]) {
					if( $.isFunction( rp_ge.onclickSubmit)) { onCS = rp_ge.onclickSubmit(rp_ge,postdata) || {}; }
					if( $.isFunction(rp_ge.beforeSubmit))  { ret = rp_ge.beforeSubmit(postdata,$("#"+frmgr)); }
				}
				gurl = rp_ge.url ? rp_ge.url : $($t).jqGrid('getGridParam','editurl');
				if(ret[0]) {
					if(!gurl) { ret[0]=false; ret[1] += " "+$.jgrid.errors.nourl; }
				}
				if(ret[0] === false) {
					$("#FormError&gt;td","#"+frmtb).html(ret[1]);
					$("#FormError","#"+frmtb).show();
					return;
				}
				if(!rp_ge.processing) {
					rp_ge.processing = true;
					$("#sData", "#"+frmtb+"_2").addClass('ui-state-active');
					// we add to pos data array the action - the name is oper
					postdata.oper = postdata[$t.p.id+"_id"] == "_empty" ? "add" : "edit";
					var idname;
					if($.isFunction($t.p.idName) ) idname = $t.p.idName();
					else idname = $t.p.idName || "id";
					if(postdata.oper != "add") 
						postdata[idname] = postdata[$t.p.id+"_id"];
					delete postdata[$t.p.id+"_id"];
					postdata = $.extend(postdata,rp_ge.editData,onCS);
					$.ajax( $.extend({
						url:gurl,
						type: rp_ge.mtype,
						data: $.isFunction(rp_ge.serializeEditData) ? rp_ge.serializeEditData(postdata) :  postdata,
						complete:function(data,Status){
							if(Status != "success") {
							    ret[0] = false;
							    if ($.isFunction(rp_ge.errorTextFormat)) {
							        ret[1] = rp_ge.errorTextFormat(data);
							    } else {
							        ret[1] = Status + " Status: '" + data.statusText + "'. Error code: " + data.status;
								}
							} else {
								// data is posted successful
								// execute aftersubmit with the returned data from server
								if( $.isFunction(rp_ge.afterSubmit) ) {
									ret = rp_ge.afterSubmit(data,postdata);
								}
							}
							if(ret[0] === false) {
								$("#FormError&gt;td","#"+frmtb).html(ret[1]);
								$("#FormError","#"+frmtb).show();
							} else {
								// remove some values if formattaer select or checkbox
								$.each($t.p.colModel, function(i,n){
									if(extpost[this.name] &amp;&amp; this.formatter &amp;&amp; this.formatter=='select') {
										try {delete extpost[this.name];} catch (e) {}
									}
								});
								postdata = $.extend(postdata,extpost);
								// the action is add
								if(postdata.oper == "add" ) {
									//id processing
									// user not set the id ret[2]
									if(!ret[2]) { ret[2] = parseInt($t.p.records)+1; }
									postdata[idname] = ret[2];
									if(rp_ge.closeAfterAdd) {
										if(rp_ge.reloadAfterSubmit) { $($t).trigger("reloadGrid"); }
										else {
											$($t).jqGrid("addRowData",ret[2],postdata,p.addedrow);
											$($t).jqGrid("setSelection",ret[2]);
										}
										hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal,onClose: rp_ge.onClose});
									} else if (rp_ge.clearAfterAdd) {
										if(rp_ge.reloadAfterSubmit) { $($t).trigger("reloadGrid"); }
										else { $($t).jqGrid("addRowData",ret[2],postdata,p.addedrow); }
										fillData("_empty",$t,frmgr);
									} else {
										if(rp_ge.reloadAfterSubmit) { $($t).trigger("reloadGrid"); }
										else { $($t).jqGrid("addRowData",ret[2],postdata,p.addedrow); }
									}
								} else {
									// the action is update
									if(rp_ge.reloadAfterSubmit) {
										$($t).trigger("reloadGrid");
										if( !rp_ge.closeAfterEdit ) { setTimeout(function(){$($t).jqGrid("setSelection",postdata[idname]);},1000); }
									} else {
										if($t.p.treeGrid === true) {
											$($t).jqGrid("setTreeRow",postdata[idname],postdata);
										} else {
											$($t).jqGrid("setRowData",postdata[idname],postdata);
										}
									}
									if(rp_ge.closeAfterEdit) { hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal,onClose: rp_ge.onClose}); }
								}
								if($.isFunction(rp_ge.afterComplete)) {
									copydata = data;
									setTimeout(function(){rp_ge.afterComplete(copydata,postdata,$("#"+frmgr));copydata=null;},500);
								}
							}
							rp_ge.processing=false;
							if(rp_ge.checkOnSubmit || rp_ge.checkOnUpdate) {
								$("#"+frmgr).data("disabled",false);
								if(rp_ge._savedData.id !="_empty") rp_ge._savedData = postdata;
							}
							$("#sData", "#"+frmtb+"_2").removeClass('ui-state-active');
							try{$(':input:visible',"#"+frmgr)[0].focus();} catch (e){}
						},
						error:function(xhr,st,err){
							$("#FormError&gt;td","#"+frmtb).html(st+ " : "+err);
							$("#FormError","#"+frmtb).show();
							rp_ge.processing=false;
							$("#"+frmgr).data("disabled",false);
							$("#sData", "#"+frmtb+"_2").removeClass('ui-state-active');
						}
					}, $.jgrid.ajaxOptions, rp_ge.ajaxEditOptions ));
				}
				
			}
			function compareData(nObj, oObj ) {
				var ret = false,key;
				for (key in nObj) {
					if(nObj[key] != oObj[key]) {
						ret = true;
						break;
					}
				}
				return ret;
			}
		});
	},
	viewGridRow : function(rowid, p){
		p = $.extend({
			top : 0,
			left: 0,
			width: 0,
			height: 'auto',
			dataheight: 'auto',
			modal: false,
			drag: true,
			resize: true,
			jqModal: true,
			closeOnEscape : false,
			labelswidth: '30%',
			closeicon: [],
			navkeys: [false,38,40],
			onClose: null,
			beforeShowForm : null,
			viewPagerButtons : true
		}, $.jgrid.view, p || {});
		return this.each(function(){
			var $t = this;
			if (!$t.grid || !rowid) { return; }
			if(!p.imgpath) { p.imgpath= $t.p.imgpath; }
			// I hate to rewrite code, but ...
			var gID = $t.p.id,
			frmgr = "ViewGrid_"+gID , frmtb = "ViewTbl_"+gID,
			IDs = {themodal:'viewmod'+gID,modalhead:'viewhd'+gID,modalcontent:'viewcnt'+gID, scrollelm : frmgr},
			maxCols = 1, maxRows=0;
			if ( $("#"+IDs.themodal).html() != null ) {
				$(".ui-jqdialog-title","#"+IDs.modalhead).html(p.caption);
				$("#FormError","#"+frmtb).hide();
				fillData(rowid,$t);
				if($.isFunction(p.beforeShowForm)) p.beforeShowForm($("#"+frmgr));
				viewModal("#"+IDs.themodal,{gbox:"#gbox_"+gID,jqm:p.jqModal, jqM: false, modal:p.modal});
				focusaref();
			} else {
				$($t.p.colModel).each( function(i) {
					var fmto = this.formoptions;
					maxCols = Math.max(maxCols, fmto ? fmto.colpos || 0 : 0 );
					maxRows = Math.max(maxRows, fmto ? fmto.rowpos || 0 : 0 );
				});
				var dh = isNaN(p.dataheight) ? p.dataheight : p.dataheight+"px";
				var flr, frm = $("&lt;form name='FormPost' id='"+frmgr+"' class='FormGrid' style='width:100%;overflow:auto;position:relative;height:"+dh+";'&gt;&lt;/form&gt;"),
				tbl =$("&lt;table id='"+frmtb+"' class='EditTable' cellspacing='1' cellpading='2' border='0' style='table-layout:fixed'&gt;&lt;tbody&gt;&lt;/tbody&gt;&lt;/table&gt;");
				// set the id.
				$(frm).append(tbl);
				var valref = createData(rowid, $t, tbl, maxCols),
				rtlb = $t.p.direction == "rtl" ? true :false,
				bp = rtlb ? "nData" : "pData",
				bn = rtlb ? "pData" : "nData",

				// buttons at footer
				bP = "&lt;a href='javascript:void(0)' id='"+bp+"' class='fm-button ui-state-default ui-corner-left'&gt;&lt;span class='ui-icon ui-icon-triangle-1-w'&gt;&lt;/span&gt;&lt;/div&gt;",
				bN = "&lt;a href='javascript:void(0)' id='"+bn+"' class='fm-button ui-state-default ui-corner-right'&gt;&lt;span class='ui-icon ui-icon-triangle-1-e'&gt;&lt;/span&gt;&lt;/div&gt;",
				bC  ="&lt;a href='javascript:void(0)' id='cData' class='fm-button ui-state-default ui-corner-all'&gt;"+p.bClose+"&lt;/a&gt;";
				if(maxRows &gt;  0) {
					var sd=[];
					$.each($(tbl)[0].rows,function(i,r){
						sd[i] = r;
					});
					sd.sort(function(a,b){
						if(a.rp &gt; b.rp) {return 1;}
						if(a.rp &lt; b.rp) {return -1;}
						return 0;
					});
					$.each(sd, function(index, row) {
						$('tbody',tbl).append(row);
					});
				}
				p.gbox = "#gbox_"+gID;
				var cle = false;
				if(p.closeOnEscape===true){
					p.closeOnEscape = false;
					cle = true;
				}				
				var bt = $("&lt;span&gt;&lt;/span&gt;").append(frm).append("&lt;table border='0' class='EditTable' id='"+frmtb+"_2'&gt;&lt;tbody&gt;&lt;tr id='Act_Buttons'&gt;&lt;td class='navButton ui-widget-content' width='"+p.labelswidth+"'&gt;"+(rtlb ? bN+bP : bP+bN)+"&lt;/td&gt;&lt;td class='EditButton ui-widget-content'&gt;"+bC+"&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;");
				createModal(IDs,bt,p,"#gview_"+$t.p.id,$("#gview_"+$t.p.id)[0]);
				if(rtlb) {
					$("#pData, #nData","#"+frmtb+"_2").css("float","right");
					$(".EditButton","#"+frmtb+"_2").css("text-align","left");
				}
				if(!p.viewPagerButtons) $("#pData, #nData","#"+frmtb+"_2").hide();
				bt = null;
				$("#"+IDs.themodal).keydown( function( e ) {
					if(e.which === 27) {
						if(cle)	hideModal(this,{gb:p.gbox,jqm:p.jqModal, onClose: p.onClose});
						return false;
					}
					if(p.navkeys[0]===true) {
						if(e.which === p.navkeys[1]){ //up
							$("#pData", "#"+frmtb+"_2").trigger("click");
							return false;
						}
						if(e.which === p.navkeys[2]){ //down
							$("#nData", "#"+frmtb+"_2").trigger("click");
							return false;
						}
					}
				});
				p.closeicon = $.extend([true,"left","ui-icon-close"],p.closeicon);
				if(p.closeicon[0]==true) {
					$("#cData","#"+frmtb+"_2").addClass(p.closeicon[1] == "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
					.append("&lt;span class='ui-icon "+p.closeicon[2]+"'&gt;&lt;/span&gt;");
				}
				if($.isFunction(p.beforeShowForm)) p.beforeShowForm($("#"+frmgr));
				viewModal("#"+IDs.themodal,{gbox:"#gbox_"+gID,jqm:p.jqModal, modal:p.modal});
				$(".fm-button:not(.ui-state-disabled)","#"+frmtb+"_2").hover(
				   function(){$(this).addClass('ui-state-hover');}, 
				   function(){$(this).removeClass('ui-state-hover');}
				);
				focusaref();
				$("#cData", "#"+frmtb+"_2").click(function(e){
					hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal, onClose: p.onClose});
					return false;
				});
				$("#nData", "#"+frmtb+"_2").click(function(e){
					$("#FormError","#"+frmtb).hide();
					var npos = getCurrPos();
					npos[0] = parseInt(npos[0]);
					if(npos[0] != -1 &amp;&amp; npos[1][npos[0]+1]) {
						if($.isFunction(p.onclickPgButtons)) {
							p.onclickPgButtons('next',$("#"+frmgr),npos[1][npos[0]]);
						}
						fillData(npos[1][npos[0]+1],$t);
						$($t).jqGrid("setSelection",npos[1][npos[0]+1]);
						if($.isFunction(p.afterclickPgButtons)) {
							p.afterclickPgButtons('next',$("#"+frmgr),npos[1][npos[0]+1]);
						}
						updateNav(npos[0]+1,npos[1].length-1);
					};
					focusaref();
					return false;
				});
				$("#pData", "#"+frmtb+"_2").click(function(e){
					$("#FormError","#"+frmtb).hide();
					var ppos = getCurrPos();
					if(ppos[0] != -1 &amp;&amp; ppos[1][ppos[0]-1]) {
						if($.isFunction(p.onclickPgButtons)) {
							p.onclickPgButtons('prev',$("#"+frmgr),ppos[1][ppos[0]]);
						}
						fillData(ppos[1][ppos[0]-1],$t);
						$($t).jqGrid("setSelection",ppos[1][ppos[0]-1]);
						if($.isFunction(p.afterclickPgButtons)) {
							p.afterclickPgButtons('prev',$("#"+frmgr),ppos[1][ppos[0]-1]);
						}
						updateNav(ppos[0]-1,ppos[1].length-1);
					};
					focusaref();
					return false;
				});
			};
			function focusaref(){ //Sfari 3 issues
				if(p.closeOnEscape===true || p.navkeys[0]===true) {
					setTimeout(function(){$(".ui-jqdialog-titlebar-close","#"+IDs.modalhead).focus()},0);
				}
			}
			var posInit =getCurrPos();
			updateNav(posInit[0],posInit[1].length-1);
			function updateNav(cr,totr,rid){
				if (cr==0) { $("#pData","#"+frmtb+"_2").addClass('ui-state-disabled'); } else { $("#pData","#"+frmtb+"_2").removeClass('ui-state-disabled'); }
				if (cr==totr) { $("#nData","#"+frmtb+"_2").addClass('ui-state-disabled'); } else { $("#nData","#"+frmtb+"_2").removeClass('ui-state-disabled'); }
			}
			function getCurrPos() {
				var rowsInGrid = $($t).jqGrid("getDataIDs"),
				selrow = $("#id_g","#"+frmtb).val(),
				pos = $.inArray(selrow,rowsInGrid);
				return [pos,rowsInGrid];
			}
			function createData(rowid,obj,tb,maxcols){
				var nm, hc,trdata, tdl, tde, cnt=0,tmp, dc, retpos=[], ind=false,
				tdtmpl = "&lt;td class='CaptionTD form-view-label ui-widget-content' width='"+p.labelswidth+"'&gt;&amp;#160;&lt;/td&gt;&lt;td class='DataTD form-view-data ui-helper-reset ui-widget-content'&gt;&amp;#160;&lt;/td&gt;", tmpl="",
				tdtmpl2 = "&lt;td class='CaptionTD form-view-label ui-widget-content'&gt;&amp;#160;&lt;/td&gt;&lt;td class='DataTD form-view-data ui-widget-content'&gt;&amp;#160;&lt;/td&gt;",
				fmtnum = ['integer','number','currency'],max1 =0, max2=0 ,maxw,setme, viewfld;
				for (var i =1;i&lt;=maxcols;i++) {
					tmpl += i == 1 ? tdtmpl : tdtmpl2;
				}
				// find max number align rigth with property formatter
				$(obj.p.colModel).each( function(i) {
					if(this.editrules &amp;&amp; this.editrules.edithidden === true) {
						hc = false;
					} else {
						hc = this.hidden === true ? true : false;
					}
					if(!hc &amp;&amp; this.align==='right') {
						if(this.formatter &amp;&amp; $.inArray(this.formatter,fmtnum) !== -1 ) {
							max1 = Math.max(max1,parseInt(this.width,10));
						} else {
							max2 = Math.max(max2,parseInt(this.width,10));
						}
					}
				});
				maxw  = max1 !==0 ? max1 : max2 !==0 ? max2 : 0;
				ind = $(obj).jqGrid("getInd",rowid);
				$(obj.p.colModel).each( function(i) {
					nm = this.name;
					setme = false;
					// hidden fields are included in the form
					if(this.editrules &amp;&amp; this.editrules.edithidden === true) {
						hc = false;
					} else {
						hc = this.hidden === true ? true : false;
					}
					dc = hc ? "style='display:none'" : "";
					viewfld = (typeof this.viewable != 'boolean') ? true : this.viewable;
					if ( nm !== 'cb' &amp;&amp; nm !== 'subgrid' &amp;&amp; nm !== 'rn' &amp;&amp; viewfld) {
						if(ind === false) {
							tmp = "";
						} else {
							if(nm == obj.p.ExpandColumn &amp;&amp; obj.p.treeGrid === true) {
								tmp = $("td:eq("+i+")",obj.rows[ind]).text();
							} else {
								tmp = $("td:eq("+i+")",obj.rows[ind]).html();
							}
						}
						setme = this.align === 'right' &amp;&amp; maxw !==0 ? true : false;
						var opt = $.extend({}, this.editoptions || {} ,{id:nm,name:nm}),
						frmopt = $.extend({},{rowabove:false,rowcontent:''}, this.formoptions || {}),
						rp = parseInt(frmopt.rowpos) || cnt+1,
						cp = parseInt((parseInt(frmopt.colpos) || 1)*2);
						if(frmopt.rowabove) {
							var newdata = $("&lt;tr&gt;&lt;td class='contentinfo' colspan='"+(maxcols*2)+"'&gt;"+frmopt.rowcontent+"&lt;/td&gt;&lt;/tr&gt;");
							$(tb).append(newdata);
							newdata[0].rp = rp;
						}
						trdata = $(tb).find("tr[rowpos="+rp+"]");
						if ( trdata.length==0 ) {
							trdata = $("&lt;tr "+dc+" rowpos='"+rp+"'&gt;&lt;/tr&gt;").addClass("FormData").attr("id","trv_"+nm);
							$(trdata).append(tmpl);
							$(tb).append(trdata);
							trdata[0].rp = rp;
						}
						$("td:eq("+(cp-2)+")",trdata[0]).html('&lt;b&gt;'+ (typeof frmopt.label === 'undefined' ? obj.p.colNames[i]: frmopt.label)+'&lt;/b&gt;');
						$("td:eq("+(cp-1)+")",trdata[0]).append("&lt;span&gt;"+tmp+"&lt;/span&gt;").attr("id","v_"+nm);
						if(setme){
							$("td:eq("+(cp-1)+") span",trdata[0]).css({'text-align':'right',width:maxw+"px"});
						}
						retpos[cnt] = i;
						cnt++;
					};
				});
				if( cnt &gt; 0) {
					var idrow = $("&lt;tr class='FormData' style='display:none'&gt;&lt;td class='CaptionTD'&gt;&lt;/td&gt;&lt;td colspan='"+ (maxcols*2-1)+"' class='DataTD'&gt;&lt;input class='FormElement' id='id_g' type='text' name='id' value='"+rowid+"'/&gt;&lt;/td&gt;&lt;/tr&gt;");
					idrow[0].rp = cnt+99;
					$(tb).append(idrow);
				}
				return retpos;
			};
			function fillData(rowid,obj){
				var nm, hc,cnt=0,tmp, opt,trv;
				trv = $(obj).jqGrid("getInd",rowid,true);
				if(!trv) return;
				$('td',trv).each( function(i) {
					nm = obj.p.colModel[i].name;
					// hidden fields are included in the form
					if(obj.p.colModel[i].editrules &amp;&amp; obj.p.colModel[i].editrules.edithidden === true) {
						hc = false;
					} else {
						hc = obj.p.colModel[i].hidden === true ? true : false;
					}
					if ( nm !== 'cb' &amp;&amp; nm !== 'subgrid' &amp;&amp; nm !== 'rn') {
						if(nm == obj.p.ExpandColumn &amp;&amp; obj.p.treeGrid === true) {
							tmp = $(this).text();
						} else {
							tmp = $(this).html();
						}
						opt = $.extend({},obj.p.colModel[i].editoptions || {});
						nm = $.jgrid.jqID("v_"+nm);
						$("#"+nm+" span","#"+frmtb).html(tmp);
						if (hc) { $("#"+nm,"#"+frmtb).parents("tr:first").hide(); }
						cnt++;
					}
				});
				if(cnt&gt;0) { $("#id_g","#"+frmtb).val(rowid); }
			};
		});
	},
	delGridRow : function(rowids,p) {
		p = $.extend({
			top : 0,
			left: 0,
			width: 240,
			height: 'auto',
			dataheight : 'auto',
			modal: false,
			drag: true,
			resize: true,
			url : '',
			mtype : "POST",
			reloadAfterSubmit: true,
			beforeShowForm: null,
			afterShowForm: null,
			beforeSubmit: null,
			onclickSubmit: null,
			afterSubmit: null,
			jqModal : true,
			closeOnEscape : false,
			delData: {},
			delicon : [],
			cancelicon : [],
			onClose : null,
			ajaxDelOptions : {},
			processing : false,
			serializeDelData : null
		}, $.jgrid.del, p ||{});
		rp_ge = p;
		return this.each(function(){
			var $t = this;
			if (!$t.grid ) { return; }
			if(!rowids) { return; }
			var onBeforeShow = typeof p.beforeShowForm === 'function' ? true: false,
			onAfterShow = typeof p.afterShowForm === 'function' ? true: false,
			gID = $t.p.id, onCS = {},
			dtbl = "DelTbl_"+gID,
			IDs = {themodal:'delmod'+gID,modalhead:'delhd'+gID,modalcontent:'delcnt'+gID, scrollelm: dtbl};
			if (isArray(rowids)) { rowids = rowids.join(); }
			if ( $("#"+IDs.themodal).html() != null ) {
				$("#DelData&gt;td","#"+dtbl).text(rowids);
				$("#DelError","#"+dtbl).hide();
				if( rp_ge.processing === true) {
					rp_ge.processing=false;
					$("#dData", "#"+dtbl).removeClass('ui-state-active');
				}
				if(onBeforeShow) { p.beforeShowForm($("#"+dtbl)); }
				viewModal("#"+IDs.themodal,{gbox:"#gbox_"+gID,jqm:p.jqModal,jqM: false, modal:p.modal});
				if(onAfterShow) { p.afterShowForm($("#"+dtbl)); }
			} else {
				var dh = isNaN(p.dataheight) ? p.dataheight : p.dataheight+"px";
				var tbl = "&lt;div id='"+dtbl+"' class='formdata' style='width:100%;overflow:auto;position:relative;height:"+dh+";'&gt;";
				tbl += "&lt;table class='DelTable'&gt;&lt;tbody&gt;";
				// error data 
				tbl += "&lt;tr id='DelError' style='display:none'&gt;&lt;td class='ui-state-error'&gt;&lt;/td&gt;&lt;/tr&gt;";
				tbl += "&lt;tr id='DelData' style='display:none'&gt;&lt;td &gt;"+rowids+"&lt;/td&gt;&lt;/tr&gt;";
				tbl += "&lt;tr&gt;&lt;td class=\"delmsg\" style=\"white-space:pre;\"&gt;"+p.msg+"&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td &gt;&amp;#160;&lt;/td&gt;&lt;/tr&gt;";
				// buttons at footer
				tbl += "&lt;/tbody&gt;&lt;/table&gt;&lt;/div&gt;"
				var bS  = "&lt;a href='javascript:void(0)' id='dData' class='fm-button ui-state-default ui-corner-all'&gt;"+p.bSubmit+"&lt;/a&gt;",
				bC  = "&lt;a href='javascript:void(0)' id='eData' class='fm-button ui-state-default ui-corner-all'&gt;"+p.bCancel+"&lt;/a&gt;";
				tbl += "&lt;table cellspacing='0' cellpadding='0' border='0' class='EditTable' id='"+dtbl+"_2'&gt;&lt;tbody&gt;&lt;tr&gt;&lt;td class='DataTD ui-widget-content'&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr style='display:block;height:3px;'&gt;&lt;td&gt;&lt;/td&gt;&lt;/tr&gt;&lt;tr&gt;&lt;td class='DelButton EditButton'&gt;"+bS+"&amp;#160;"+bC+"&lt;/td&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;";
				p.gbox = "#gbox_"+gID;
				createModal(IDs,tbl,p,"#gview_"+$t.p.id,$("#gview_"+$t.p.id)[0]);
				$(".fm-button","#"+dtbl+"_2").hover(
				   function(){$(this).addClass('ui-state-hover');}, 
				   function(){$(this).removeClass('ui-state-hover');}
				);
				p.delicon = $.extend([true,"left","ui-icon-scissors"],p.delicon);
				p.cancelicon = $.extend([true,"left","ui-icon-cancel"],p.cancelicon);
				if(p.delicon[0]==true) {
					$("#dData","#"+dtbl+"_2").addClass(p.delicon[1] == "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
					.append("&lt;span class='ui-icon "+p.delicon[2]+"'&gt;&lt;/span&gt;");
				}
				if(p.cancelicon[0]==true) {
					$("#eData","#"+dtbl+"_2").addClass(p.cancelicon[1] == "right" ? 'fm-button-icon-right' : 'fm-button-icon-left')
					.append("&lt;span class='ui-icon "+p.cancelicon[2]+"'&gt;&lt;/span&gt;");
				}				
				$("#dData","#"+dtbl+"_2").click(function(e){
					var ret=[true,""]; onCS = {};
					var postdata = $("#DelData&gt;td","#"+dtbl).text(); //the pair is name=val1,val2,...
					if( typeof p.onclickSubmit === 'function' ) { onCS = p.onclickSubmit(rp_ge) || {}; }
					if( typeof p.beforeSubmit === 'function' ) { ret = p.beforeSubmit(postdata); }
					if(ret[0]){
						var gurl = rp_ge.url ? rp_ge.url : $($t).jqGrid('getGridParam','editurl');
						if(!gurl) { ret[0]=false;ret[1] += " "+$.jgrid.errors.nourl;}
					}
					if(ret[0] === false) {
						$("#DelError&gt;td","#"+dtbl).html(ret[1]);
						$("#DelError","#"+dtbl).show();
					} else {
						if(!rp_ge.processing) {
							rp_ge.processing = true;
							$(this).addClass('ui-state-active');
							var postd = $.extend({oper:"del"},rp_ge.delData, onCS);
							var idname;
							if($.isFunction($t.p.idName) ) idname = $t.p.idName();
							else idname = $t.p.idName || "id";
							postd[idname] = postdata;
							$.ajax( $.extend({
								url:gurl,
								type: p.mtype,
								data: $.isFunction(p.serializeDelData) ? p.serializeDelData(postd) : postd,
								complete:function(data,Status){
									if(Status != "success") {
										ret[0] = false;
									    if ($.isFunction(rp_ge.errorTextFormat)) {
									        ret[1] = rp_ge.errorTextFormat(data);
									    } else {
									        ret[1] = Status + " Status: '" + data.statusText + "'. Error code: " + data.status;
										}
									} else {
										// data is posted successful
										// execute aftersubmit with the returned data from server
										if( typeof rp_ge.afterSubmit === 'function' ) {
											ret = rp_ge.afterSubmit(data,postd);
										}
									}
									if(ret[0] === false) {
										$("#DelError&gt;td","#"+dtbl).html(ret[1]);
										$("#DelError","#"+dtbl).show();
									} else {
										if(rp_ge.reloadAfterSubmit) {
											if($t.p.treeGrid) {
												$($t).jqGrid("setGridParam",{treeANode:0,datatype:$t.p.treedatatype});
											}
											$($t).trigger("reloadGrid");
										} else {
											var toarr = [];
											toarr = postdata.split(",");
											if($t.p.treeGrid===true){
												try {$($t).jqGrid("delTreeNode",toarr[0])} catch(e){}
											} else {
												for(var i=0;i&lt;toarr.length;i++) {
													$($t).jqGrid("delRowData",toarr[i]);
												}
											}
											$t.p.selrow = null;
											$t.p.selarrrow = [];
										}
										if($.isFunction(rp_ge.afterComplete)) {
											setTimeout(function(){rp_ge.afterComplete(data,postdata);},500);
										}
									}
									rp_ge.processing=false;
									$("#dData", "#"+dtbl+"_2").removeClass('ui-state-active');
									if(ret[0]) { hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal, onClose: rp_ge.onClose}); }
								},
								error:function(xhr,st,err){
									$("#DelError&gt;td","#"+dtbl).html(st+ " : "+err);
									$("#DelError","#"+dtbl).show();
									rp_ge.processing=false;
									$("#dData", "#"+dtbl+"_2").removeClass('ui-state-active');;
								}
							}, $.jgrid.ajaxOptions, p.ajaxDelOptions));
						}
					}
					return false;
				});
				$("#eData", "#"+dtbl+"_2").click(function(e){
					hideModal("#"+IDs.themodal,{gb:"#gbox_"+gID,jqm:p.jqModal, onClose: rp_ge.onClose});
					return false;
				});
				if(onBeforeShow) { p.beforeShowForm($("#"+dtbl)); }
				viewModal("#"+IDs.themodal,{gbox:"#gbox_"+gID,jqm:p.jqModal,modal:p.modal});
				if(onAfterShow) { p.afterShowForm($("#"+dtbl)); }
			}
			if(p.closeOnEscape===true) {
				setTimeout(function(){$(".ui-jqdialog-titlebar-close","#"+IDs.modalhead).focus()},0);
			}
		});
	},
	navGrid : function (elem, o, pEdit,pAdd,pDel,pSearch, pView) {
		o = $.extend({
			edit: true,
			editicon: "ui-icon-pencil",
			add: true,
			addicon:"ui-icon-plus",
			del: true,
			delicon:"ui-icon-trash",
			search: true,
			searchicon:"ui-icon-search",
			refresh: true,
			refreshicon:"ui-icon-refresh",
			refreshstate: 'firstpage',
			view: false,
			viewicon : "ui-icon-document",
			position : "left",
			closeOnEscape : true,
			afterRefresh : null
		}, $.jgrid.nav, o ||{});
		return this.each(function() {       
			var alertIDs = {themodal:'alertmod',modalhead:'alerthd',modalcontent:'alertcnt'},
			$t = this, vwidth, vheight, twd, tdw;
			if(!$t.grid) { return; }
			if ($("#"+alertIDs.themodal).html() == null) {
				if (typeof window.innerWidth != 'undefined') {
					vwidth = window.innerWidth,
					vheight = window.innerHeight
				} else if (typeof document.documentElement != 'undefined' &amp;&amp; typeof document.documentElement.clientWidth != 'undefined' &amp;&amp; document.documentElement.clientWidth != 0) {
					vwidth = document.documentElement.clientWidth,
					vheight = document.documentElement.clientHeight
				} else {
					vwidth=1024;
					vheight=768;
				}
				createModal(alertIDs,"&lt;div&gt;"+o.alerttext+"&lt;/div&gt;&lt;span tabindex='0'&gt;&lt;span tabindex='-1' id='jqg_alrt'&gt;&lt;/span&gt;&lt;/span&gt;",{gbox:"#gbox_"+$t.p.id,jqModal:true,drag:true,resize:true,caption:o.alertcap,top:vheight/2-25,left:vwidth/2-100,width:200,height:'auto',closeOnEscape:o.closeOnEscape},"","",true);
			}
			var tbd,
			navtbl = $("&lt;table cellspacing='0' cellpadding='0' border='0' class='ui-pg-table navtable' style='float:left;table-layout:auto;'&gt;&lt;tbody&gt;&lt;tr&gt;&lt;/tr&gt;&lt;/tbody&gt;&lt;/table&gt;"),
			sep = "&lt;td class='ui-pg-button ui-state-disabled' style='width:4px;'&gt;&lt;span class='ui-separator'&gt;&lt;/span&gt;&lt;/td&gt;",
			pgid = $($t.p.pager).attr("id") || 'pager';
			if($t.p.direction == "rtl") $(navtbl).attr("dir","rtl").css("float","right");
			if (o.add) {
				pAdd = pAdd || {};
				tbd = $("&lt;td class='ui-pg-button ui-corner-all'&gt;&lt;/td&gt;");
				$(tbd).append("&lt;div class='ui-pg-div'&gt;&lt;span class='ui-icon "+o.addicon+"'&gt;&lt;/span&gt;"+o.addtext+"&lt;/div&gt;");
				$("tr",navtbl).append(tbd);
				$(tbd,navtbl)
				.attr({"title":o.addtitle || "",id : pAdd.id || "add_"+$t.p.id})
				.click(function(){
					if (typeof o.addfunc == 'function') {
						o.addfunc();
					} else {
						$($t).jqGrid("editGridRow","new",pAdd);
					}
					return false;
				}).hover(function () {$(this).addClass("ui-state-hover");},
					function () {$(this).removeClass("ui-state-hover");}
				);
				tbd = null;
			}
			if (o.edit) {
				tbd = $("&lt;td class='ui-pg-button ui-corner-all'&gt;&lt;/td&gt;");
				pEdit = pEdit || {};
				$(tbd).append("&lt;div class='ui-pg-div'&gt;&lt;span class='ui-icon "+o.editicon+"'&gt;&lt;/span&gt;"+o.edittext+"&lt;/div&gt;");
				$("tr",navtbl).append(tbd);
				$(tbd,navtbl)
				.attr({"title":o.edittitle || "",id: pEdit.id || "edit_"+$t.p.id})
				.click(function(){
					var sr = $t.p.selrow;
					if (sr) {
						if(typeof o.editfunc == 'function') {
							o.editfunc(sr);
						} else {
							$($t).jqGrid("editGridRow",sr,pEdit);
						}
					} else {
						viewModal("#"+alertIDs.themodal,{gbox:"#gbox_"+$t.p.id,jqm:true});
						$("#jqg_alrt").focus();
					}
					return false;
				}).hover( function () {$(this).addClass("ui-state-hover");},
					function () {$(this).removeClass("ui-state-hover");}
				);
				tbd = null;
			}
			if (o.view) {
				tbd = $("&lt;td class='ui-pg-button ui-corner-all'&gt;&lt;/td&gt;");
				pView = pView || {};
				$(tbd).append("&lt;div class='ui-pg-div'&gt;&lt;span class='ui-icon "+o.viewicon+"'&gt;&lt;/span&gt;"+o.viewtext+"&lt;/div&gt;");
				$("tr",navtbl).append(tbd);
				$(tbd,navtbl)
				.attr({"title":o.viewtitle || "",id: pView.id || "view_"+$t.p.id})
				.click(function(){
					var sr = $t.p.selrow;
					if (sr) {
						$($t).jqGrid("viewGridRow",sr,pView);
					} else {
						viewModal("#"+alertIDs.themodal,{gbox:"#gbox_"+$t.p.id,jqm:true});
						$("#jqg_alrt").focus();
					}
					return false;
				}).hover( function () {$(this).addClass("ui-state-hover");},
					function () {$(this).removeClass("ui-state-hover");}
				);
				tbd = null;
			}
			if (o.del) {
				tbd = $("&lt;td class='ui-pg-button ui-corner-all'&gt;&lt;/td&gt;");
				pDel = pDel || {};
				$(tbd).append("&lt;div class='ui-pg-div'&gt;&lt;span class='ui-icon "+o.delicon+"'&gt;&lt;/span&gt;"+o.deltext+"&lt;/div&gt;");
				$("tr",navtbl).append(tbd);
				$(tbd,navtbl)
				.attr({"title":o.deltitle || "",id: pDel.id || "del_"+$t.p.id})
				.click(function(){
					var dr;
					if($t.p.multiselect) {
						dr = $t.p.selarrrow;
						if(dr.length==0) { dr = null; }
					} else {
						dr = $t.p.selrow;
					}
					if (dr) { $($t).jqGrid("delGridRow",dr,pDel); }
					else  {viewModal("#"+alertIDs.themodal,{gbox:"#gbox_"+$t.p.id,jqm:true}); $("#jqg_alrt").focus(); }
					return false;
				}).hover(function () {$(this).addClass("ui-state-hover");},
					function () {$(this).removeClass("ui-state-hover");}
				);
				tbd = null;
			}
			if(o.add || o.edit || o.del || o.view) { $("tr",navtbl).append(sep); }
			if (o.search) {
				tbd = $("&lt;td class='ui-pg-button ui-corner-all'&gt;&lt;/td&gt;");
				pSearch = pSearch || {};
				$(tbd).append("&lt;div class='ui-pg-div'&gt;&lt;span class='ui-icon "+o.searchicon+"'&gt;&lt;/span&gt;"+o.searchtext+"&lt;/div&gt;");
				$("tr",navtbl).append(tbd);
				$(tbd,navtbl)
				.attr({"title":o.searchtitle  || "",id:pSearch.id || "search_"+$t.p.id})
				.click(function(){
					$($t).jqGrid("searchGrid",pSearch);
					return false;
				}).hover(function () {$(this).addClass("ui-state-hover");},
					function () {$(this).removeClass("ui-state-hover");}
				);
				tbd = null;
			}
			if (o.refresh) {
				tbd = $("&lt;td class='ui-pg-button ui-corner-all'&gt;&lt;/td&gt;");
				$(tbd).append("&lt;div class='ui-pg-div'&gt;&lt;span class='ui-icon "+o.refreshicon+"'&gt;&lt;/span&gt;"+o.refreshtext+"&lt;/div&gt;");
				$("tr",navtbl).append(tbd);
				$(tbd,navtbl)
				.attr({"title":o.refreshtitle  || "",id: "refresh_"+$t.p.id})
				.click(function(){
					$t.p.search = false;
					try {
						var gID = $t.p.id;
						$("#fbox_"+gID).searchFilter().reset();
                        $t.clearToolbar(false);
					} catch (e) {}
					switch (o.refreshstate) {
						case 'firstpage':
						    $($t).trigger("reloadGrid", [{page:1}]);
							break;
						case 'current':
						    $($t).trigger("reloadGrid", [{current:true}]);
							break;
					}
					if($.isFunction(o.afterRefresh)) o.afterRefresh();
					return false;
				}).hover(function () {$(this).addClass("ui-state-hover");},
					function () {$(this).removeClass("ui-state-hover");}
				);
				tbd = null;
			}
			tdw = $(".ui-jqgrid").css("font-size") || "11px";
			$('body').append("&lt;div id='testpg2' class='ui-jqgrid ui-widget ui-widget-content' style='font-size:"+tdw+";visibility:hidden;' &gt;&lt;/div&gt;");
			twd = $(navtbl).clone().appendTo("#testpg2").width();
			$("#testpg2").remove();
			$("#"+pgid+"_"+o.position,"#"+pgid).append(navtbl);
			if($t.p._nvtd) {
				if(twd &gt; $t.p._nvtd[0] ) {
					$("#"+pgid+"_"+o.position,"#"+pgid).width(twd);
					$t.p._nvtd[0] = twd;
				}
				$t.p._nvtd[1] = twd;
			}
		});
	},
	navButtonAdd : function (elem, p) {
		p = $.extend({
			caption : "newButton",
			title: '',
			buttonicon : 'ui-icon-newwin',
			onClickButton: null,
			position : "last",
			cursor : 'pointer'
		}, p ||{});
		return this.each(function() {
			if( !this.grid)  { return; }
			if( elem.indexOf("#") != 0) { elem = "#"+elem; }
			var findnav = $(".navtable",elem)[0], $t = this;
			if (findnav) {
				var tbd = $("&lt;td&gt;&lt;/td&gt;");
				$(tbd).addClass('ui-pg-button ui-corner-all').append("&lt;div class='ui-pg-div'&gt;&lt;span class='ui-icon "+p.buttonicon+"'&gt;&lt;/span&gt;"+p.caption+"&lt;/div&gt;");
				if(p.id) {$(tbd).attr("id",p.id);}
				if(p.position=='first'){
					if(findnav.rows[0].cells.length ===0 ) {
						$("tr",findnav).append(tbd);
					} else {
						$("tr td:eq(0)",findnav).before(tbd);
					}
				} else {
					$("tr",findnav).append(tbd);
				}
				$(tbd,findnav)
				.attr("title",p.title  || "")
				.click(function(e){
					if ($.isFunction(p.onClickButton) ) { p.onClickButton.call($t,e); }
					return false;
				})
				.hover(
					function () {$(this).addClass("ui-state-hover");},
					function () {$(this).removeClass("ui-state-hover");}
				)
				.css("cursor",p.cursor ? p.cursor : "normal");
			}
		});
	},
	navSeparatorAdd:function (elem,p) {
		p = $.extend({
			sepclass : "ui-separator",
			sepcontent: ''
		}, p ||{});		
		return this.each(function() {
			if( !this.grid)  { return; }
			if( elem.indexOf("#") != 0) { elem = "#"+elem; }
			var findnav = $(".navtable",elem)[0];
			if(findnav) {
				var sep = "&lt;td class='ui-pg-button ui-state-disabled' style='width:4px;'&gt;&lt;span class='"+p.sepclass+"'&gt;&lt;/span&gt;"+p.sepcontent+"&lt;/td&gt;";
				$("tr",findnav).append(sep);
			}
		});
	},
	GridToForm : function( rowid, formid ) {
		return this.each(function(){
			var $t = this;
			if (!$t.grid) { return; } 
			var rowdata = $($t).jqGrid("getRowData",rowid);
			if (rowdata) {
				for(var i in rowdata) {
					if ( $("[name="+i+"]",formid).is("input:radio") || $("[name="+i+"]",formid).is("input:checkbox"))  {
						$("[name="+i+"]",formid).each( function() {
							if( $(this).val() == rowdata[i] ) {
								$(this).attr("checked","checked");
							} else {
								$(this).attr("checked","");
							}
						});
					} else {
					// this is very slow on big table and form.
						$("[name="+i+"]",formid).val(rowdata[i]);
					}
				}
			}
		});
	},
	FormToGrid : function(rowid, formid, mode, position){
		return this.each(function() {
			var $t = this;
			if(!$t.grid) { return; }
			if(!mode) mode = 'set';
			if(!position) position = 'first';
			var fields = $(formid).serializeArray();
			var griddata = {};
			$.each(fields, function(i, field){
				griddata[field.name] = field.value;
			});
			if(mode=='add') $($t).jqGrid("addRowData",rowid,griddata, position);
			else if(mode=='set') $($t).jqGrid("setRowData",rowid,griddata);
		});
	}
});
})(jQuery);
</PRE></BODY></HTML>