if($((function(){$("#menu_toggle").click((function(){$("body").hasClass("nav-md")?($.cookie("menu","nav-sm",{expires:14,path:"/"}),$("body").removeClass("nav-md"),$("body").addClass("nav-sm"),$("#sidebar-menu li.active-sm ul").attr("style","display:none"),$("#sidebar-menu li ul").attr("style","display:none"),$("#sidebar-menu li").removeClass("active"),$("#sidebar-menu li").removeClass("active-sm"),$("body").hasClass("nav-sm")&&$(".menu-text").addClass("hidden"),$("#sidebar-menu li").hasClass("active")&&($("#sidebar-menu li.active").addClass("active-sm"),$("#sidebar-menu li.active").removeClass("active"))):($("body").hasClass("nav-sm")&&$.cookie("menu","nav-md",{expires:14,path:"/"}),$("body").removeClass("nav-sm"),$("body").addClass("nav-md"),$(".sidebar-footer").show(),$("body").hasClass("nav-md")&&$(".menu-text").removeClass("hidden"),$("#sidebar-menu li").hasClass("active-sm")&&($("#sidebar-menu li.active-sm").addClass("active"),$("#sidebar-menu li.active-sm").removeClass("active-sm")))})),$("#content_container").click((function(){$("body").hasClass("nav-sm")&&($("#sidebar-menu li").removeClass("nv active"),$("#sidebar-menu li ul").attr("style","display:none"))}))})),$((function(){var e=window.location;$('#sidebar-menu a[href="'+e+'"]').parent("li").addClass("current-page")})),$((function(){$('[data-toggle="tooltip"]').tooltip()})),$(".progress .progress-bar")[0]&&$(".progress .progress-bar").progressbar(),$(".js-switch")[0]){var elems=Array.prototype.slice.call(document.querySelectorAll(".js-switch"));elems.forEach((function(e){new Switchery(e,{color:"#26B99A"})}))}$(".close-link").click((function(){$(this).closest("div.x_panel").remove()}));var __slice=[].slice;!function(e,t){var a;a=function(){function t(t,a){var i,n,o=this;for(i in this.options=e.extend({},this.defaults,a),this.$el=t,n=this.defaults)n[i],null!=this.$el.data(i)&&(this.options[i]=this.$el.data(i));this.createStars(),this.syncRating(),this.$el.on("mouseover.starrr","span",(function(e){return o.syncRating(o.$el.find("span").index(e.currentTarget)+1)})),this.$el.on("mouseout.starrr",(function(){return o.syncRating()})),this.$el.on("click.starrr","span",(function(e){return o.setRating(o.$el.find("span").index(e.currentTarget)+1)})),this.$el.on("starrr:change",this.options.change)}return t.prototype.defaults={rating:void 0,numStars:5,change:function(e,t){}},t.prototype.createStars=function(){var e,t,a;for(a=[],e=1,t=this.options.numStars;1<=t?e<=t:e>=t;1<=t?e++:e--)a.push(this.$el.append("<span class='glyphicon .glyphicon-star-empty'></span>"));return a},t.prototype.setRating=function(e){return this.options.rating===e&&(e=void 0),this.options.rating=e,this.syncRating(),this.$el.trigger("starrr:change",e)},t.prototype.syncRating=function(e){var t,a,i,n;if(e||(e=this.options.rating),e)for(t=a=0,n=e-1;0<=n?a<=n:a>=n;t=0<=n?++a:--a)this.$el.find("span").eq(t).removeClass("glyphicon-star-empty").addClass("glyphicon-star");if(e&&e<5)for(t=i=e;e<=4?i<=4:i>=4;t=e<=4?++i:--i)this.$el.find("span").eq(t).removeClass("glyphicon-star").addClass("glyphicon-star-empty");if(!e)return this.$el.find("span").removeClass("glyphicon-star").addClass("glyphicon-star-empty")},t}(),e.fn.extend({starrr:function(){var t,i;return i=arguments[0],t=2<=arguments.length?__slice.call(arguments,1):[],this.each((function(){var n;if((n=e(this).data("star-rating"))||e(this).data("star-rating",n=new a(e(this),i)),"string"==typeof i)return n[i].apply(n,t)}))}})}(window.jQuery,window),$((function(){return $(".starrr").starrr()})),$(document).ready((function(){prepareComponents(),$(".flat").on("ifChecked ifUnchecked",(function(e){"ifChecked"==e.type?$("#"+$(this).attr("id")).val(1):$("#"+$(this).attr("id")).val(0)})),$("#stars").on("starrr:change",(function(e,t){$("#count").html(t)})),$("#stars-existing").on("starrr:change",(function(e,t){$("#count-existing").html(t)})),$("body").hasClass("nav-sm")&&$("#sidebar-menu li.active ul").hide()})),$("table input").on("ifChecked",(function(){check_state="",$(this).parent().parent().parent().addClass("selected"),countChecked()})),$("table input").on("ifUnchecked",(function(){check_state="",$(this).parent().parent().parent().removeClass("selected"),countChecked()}));var check_state="";function countChecked(){"check_all"==check_state&&$(".bulk_action input[name='table_records']").iCheck("check"),"uncheck_all"==check_state&&$(".bulk_action input[name='table_records']").iCheck("uncheck");var e=$(".bulk_action input[name='table_records']:checked").length;e>0?($(".column-title").hide(),$(".bulk-actions").show(),$(".action-cnt").html(e+" Records Selected")):($(".column-title").show(),$(".bulk-actions").hide())}function toogleMenu(e){e.parent().is(".active")?(e.parent().removeClass("active"),e.next().slideUp(),e.parent().removeClass("nv"),e.parent().addClass("vn")):($("#sidebar-menu li ul").slideUp(),e.parent().removeClass("vn"),e.parent().addClass("nv"),e.next().slideDown(),$("#sidebar-menu li").removeClass("active"),e.parent().addClass("active"))}$(".bulk_action input").on("ifChecked",(function(){check_state="",$(this).parent().parent().parent().addClass("selected"),countChecked()})),$(".bulk_action input").on("ifUnchecked",(function(){check_state="",$(this).parent().parent().parent().removeClass("selected"),countChecked()})),$(".bulk_action input#check-all").on("ifChecked",(function(){check_state="check_all",countChecked()})),$(".bulk_action input#check-all").on("ifUnchecked",(function(){check_state="uncheck_all",countChecked()})),$((function(){$(".expand").on("click",(function(){$(this).next().slideToggle(200),$expand=$(this).find(">:first-child"),"+"==$expand.text()?$expand.text("-"):$expand.text("+")}))})),$(document).ready((function(){$(".scroll-view").niceScroll({touchbehavior:!0,cursorcolor:"rgba(42, 63, 84, 0.35)"})})),$.prototype.loadinmodal=function(e,t,a,i){var n=$(this).html("");$(this).hasClass("dialog_exist")||($(this).addClass("dialog_exist"),$.post(e,t,(function(e){n.createModal(a,i,e)})))};var openned_modals=0;function prepareDateYearPicker(){$(".date-year").datepicker({format:"yyyy",minViewMode:2,language:"lt",orientation:"bottom auto",autoclose:!0})}function prepareComponents(){$('.x-panel:not(".has-x-panel")').each((function(){$(this).xpanel(),$(this).addClass("has-x-panel")})),prepareDateYearPicker(),prepareDatePicker(),prepareDateTimePicker(),enableWysiwyg(),enableICheck(),enableMultiselect(),enableSelectpicker(),enableTooltips(),replaceNumberCommaWithDot(),prepareBootstrapDatepicker()}function prepareBootstrapDatepicker(){$('.datepicker:not(".has-datepicker")').each((function(){$(".datepicker").datetimepicker({format:"YYYY-MM-DD",locale:"lt"}),$(".datepicker").addClass("has-datepicker")}))}function enableTooltips(){$('[data-toggle="tooltip"]').tooltip()}function enableSelectpicker(){$(".selectpicker").selectpicker({dropupAuto:!0})}function enableMultiselect(e){void 0===e&&(e=!1),$('select.multiselect:not(".has-multiselect")').multiselect({enableFiltering:!0,includeSelectAllOption:!0,maxHeight:400,enableCaseInsensitiveFiltering:!0,filterPlaceholder:"Paieška",selectAllText:"Pažymėti visus",nonSelectedText:"Pasirinkite",allSelectedText:"Visi pažymėti",nSelectedText:"pasirinkti",buttonWidth:"auto",selectAllName:"select-all-name",dropUp:e}),$('select.multiselect:not(".has-multiselect")').addClass("has-multiselect")}$.prototype.createModal=function(e,t,a){e||(e={}),$(this).addClass("modal").addClass("fade");var i=$("<div/>").addClass("modal-dialog").appendTo($(this));e.width&&i.css("width",e.width+"px");var n=$("<div/>").addClass("modal-content").appendTo(i),o=$("<div/>").addClass("modal-header").append([void 0===e.without_close||1!=e.without_close?$('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'):"",$("<h4/>").html(e&&e.title?e.title:"")]).appendTo(n),s=($("<div/>").addClass("modal-body").html(a).appendTo(n),$("<div/>").addClass("modal-footer").appendTo(n));for(var l in e.submit&&s.append($("<button/>").addClass("md-raised mini-button md-button md-ink-ripple green-button save").append(['<i class="fa fa-save"></i> ',"Išsaugoti"]).attr({onclick:e.submit+"()",type:"button"})),e.header_close&&o.prepend($('<button type="button" class="close" aria-label="Close"<span aria-hidden="true">&times;</span></button>').on("click",e.header_close.onclick)),e.buttons){var r=e.buttons[l],d=null;d=r.attr?"object"==typeof r.attr?$("<button/>").attr("type","button").attr(r.attr):$("<button "+r.attr+"/>").attr("type","button"):$("<button/>").attr("type","button"),r.id&&d.attr("id",r.id),r.tooltip&&d.attr("data-tip",r.tooltip),r.class&&d.addClass(r.class),r.tooltip&&d.addClass("tip"),r.onclick&&("function"==typeof r.onclick?d.on("click",r.onclick):d.attr("onclick",r.onclick)),r.icon&&d.append("<i class='"+r.icon+"'></i> "),d.append(r.title).appendTo(s)}e.delete&&s.append($("<button/>").addClass("md-raised mini-button md-button md-ink-ripple red-button").append(['<i class="fa fa-trash"></i> ',"Ištrinti"]).attr({onclick:e.delete+"()",type:"button"})),void 0!==e.cancel&&0==e.cancel||s.append($("<button/>").addClass("md-raised mini-button md-button md-ink-ripple").append(['<i class="fa fa-close"></i> ',"Atšaukti"]).attr({"data-dismiss":"modal",type:"button"})),$(this).modal({show:!0,backdrop:!1});var c=$("body").scrollTop();$(this).on("shown.bs.modal",(function(){$(this).find("input:not([type=hidden])").first().focus(),$(this).find(".modal-dialog").css("z-index","1050"),$(this).data("compiled_angular")||(compileAjaxAngular($(this)),$(this).data("compiled_angular",!0)),prepareComponents(),$(this).find(".grid-container").length>0&&$("body").scrollTop(0),openned_modals++})),($(this).find(".grid-container").length>0||e.onclose)&&$(this).on("hidden.bs.modal",(function(t){$("body").scrollTop(c),$(this).find(".grid-container").length>0&&$(this).find(".grid-container").each((function(){Grids[$(this).attr("id")]&&Grids[$(this).attr("id")].Dispose()})),e.onclose&&e.onclose(t)})),e.beforeClose&&$(this).on("hide.bs.modal",(function(t){"function"==typeof e.beforeClose?e.beforeClose(t,e):"function"==typeof window[e.beforeClose]&&window[e.beforeClose](e)})),t&&(t.Disable(),$(this).on("hidden.bs.modal",(function(){t.Enable()}))),$(this).on("hidden.bs.modal",(function(e){$(this).removeClass("dialog_exist"),--openned_modals>0?$("body").addClass("modal-open"):($("body").removeClass("modal-open"),$(this).data("compiled_angular",!1))})),enableWysiwyg(),$(this).triggerHandler("onAfterElementLoaded")},$.prototype.xpanel=function(){var e=$(this).data(),t='<div><div><div class="x_panel">';if(t+='<div class="x_content"'+($(this).hasClass("closed")?' style="display: none;"':"")+"></div>",t+="</div></div></div>",$(this).wrap(t),!$(this).hasClass("no-header"))var a=$(document.createElement("div")).addClass("x_title").append($(document.createElement("h2")).text(e&&e.title?e.title:""),$(document.createElement("ul")).addClass("nav navbar-right panel_toolbox").append($(document.createElement("li")).append($(document.createElement("a")).addClass("collapse-link").data(e).data("open",e.open?' data-open="'+e.open+'"':"").data("open",e.close?' data-open="'+e.close+'"':"").append($(document.createElement("i")).addClass("fa fa-chevron-"+($(this).hasClass("closed")?"down":"up"))))),$(document.createElement("div")).addClass("clearfix"));$(this).parent().before(a),void 0!==window[e.afterLoad]&&"function"==typeof window[e.afterLoad]&&window[e.afterLoad]()},$(document).on({click:function(){var e=$(this).find(".collapse-link").first(),t=$(e).parents(".x_panel").first(),a=$(e).find("i"),i=t.find(".x_content"),n=$(e).data();i.is(":visible")?"function"==typeof window[n.close]&&window[n.close]():(n.url&&i.find(".x-panel").loadContent(n.url,n),"function"==typeof window[n.open]&&window[n.open]()),i.slideToggle(200),t.hasClass("fixed_height_390")&&t.toggleClass("").toggleClass("fixed_height_390"),t.hasClass("fixed_height_320")&&t.toggleClass("").toggleClass("fixed_height_320"),a.toggleClass("fa-chevron-up").toggleClass("fa-chevron-down"),setTimeout((function(){t.resize()}),50)}},".x_title"),$.prototype.loadContent=function(e,t,a,i){return t||(t={}),$(this).html()&&0!=$(this).html().trim().length&&!a||$(this).load(e,t,(function(){i&&i(),compileAjaxAngular($(this)),prepareComponents()})),$(this)},$.prototype.loadinpanel=function(e,t){$(this).loadContent(e,{},!1,t),enableICheck()};var wysiwygEditors={};function enableWysiwyg(e){var t=["placeholder","advlist autolink lists link image charmap print preview anchor","searchreplace visualblocks code fullscreen","insertdatetime media table contextmenu paste code"];e&&e.plugins&&(t=t.concat(e.plugins)),$(".wysiwyg:not(.has-wysiwyg)").each((function(e){0==$(this).attr("id").length&&$(this).attr("id","wysiwyg-editor-"+(e+1));var a=$(this).attr("id"),i={selector:"#"+a,plugins:t,toolbar:!$(this).attr("readonly")&&"insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent",menubar:!1,statusbar:!$(this).attr("readonly"),toolbar_items_size:"small",readonly:$(this).attr("readonly")?1:0,autoresize_bottom_margin:0,setup:function(e){wysiwygEditors[a]=e,e.on("change",(function(){var t=$("#"+a).parents("form").first();t.length>0&&t.attr("id").length>0&&(formChanged[t.attr("id")]=!0),e.save(),$("#"+e.id).attr("onChangeEvent")&&window[$("#"+e.id).attr("onChangeEvent")](e)})),$("#"+e.id).prop("readonly")}};tinymce.init(i),$(this).addClass("has-wysiwyg")}))}function enableDropzone(e,t,a,n,o,s,l){Dropzone.autoDiscover=!1,$("#"+t+"-dropzone:not(.has-dropzone)").length>0&&($("#"+t+"-dropzone:not(.has-dropzone)").dropzone({init:function(){var e=this;$("button#clear-dropzone").click((function(){e.removeAllFiles(!0)})),this.on("addedfile",(function(e){this.on("sending",(function(e,a,n){for(i in n.append("description",$("#"+t+"-file_description").val()),n.append("object_id",$("#"+t+"_object_id").val()),n.append("object_code",$("#"+t+"_object_code").val()),n.append("new_object_code",$("#"+t+"_new_object_code").val()),s)n.append(i,s[i])}))})),$(document).on("click","#"+t+"-upload_file",(function(){e.processQueue()}))},paramName:"file",maxFilesize:n,maxFiles:25,parallelUploads:25,addRemoveLinks:!0,uploadMultiple:!0,autoProcessQueue:!1,dictDefaultMessage:"Vilkite failus čia arba paspauskite norėdami pasirinkti",dictFileTooBig:"Failo dydis yra didesnis už leidžiamą dydį: "+n+" mb",dictInvalidFileType:"Neteisingas failo formatas. Leidžiami tokie failo formatai: image/*,application/pdf,.psd, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .odt, .csv, .txt, .dwg, .dxf, .rar, .zip, .adoc, .7z, .html, .htm, .ods, .webm, .mpg, .mp2, .mpeg, .mpe, .mpv, .ogg, .mp4, .m4p, .m4v, .mov, .avi, .wmv, .msg",dictMaxFilesExceeded:"Viršytas maksimalus leidžiamas failų kiekis",dictRemoveFile:"Pašalinti",url:a,acceptedFiles:"image/*,application/pdf,.psd, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .odt, .csv, .txt, .dwg, .dxf, .rar, .zip, .adoc, .7z, .html, .htm, .ods, .webm, .mpg, .mp2, .mpeg, .mpe, .mpv, .ogg, .mp4, .m4p, .m4v, .mov, .avi, .wmv, .msg",success:function(a,i){if(0===this.getUploadingFiles().length&&0===this.getQueuedFiles().length){var n=$("#"+t+"_documents");if(i.success){for(var o in showMessage(i.success_message,"success"),i.Data){var s=i.Data[o];n.val(s+";"+$(n).val())}angular.element($("#document_list_"+e+" .datatable")).scope().reloadDataTable(),this.removeAllFiles(!0),$("#"+t+"-file_description").val(""),$("#"+t+"_documents_count").text(parseInt($("#"+t+"_documents_count").text())+i.Data.length).triggerHandler("change");var r={file_ids:i.Data},d=$("#"+t+"-document_upload_form").data("notify-url");$("#"+t+"_object_id").val()>0&&$.post(d,r),l&&l()}else showMessage(i.error_message,"error")}}}),$("#"+t+"-dropzone:not(.has-dropzone)").addClass("has-dropzone"))}function enableICheck(){$("input.flat:not(.has-icheck)").length>0&&($("input.flat:not(.has-icheck)").iCheck({checkboxClass:"icheckbox_flat-green",radioClass:"iradio_flat-blue"}),$('input[type="checkbox"]').addClass("has-icheck"))}function moveRowsInDifferentGrids(e,t,a,n,o,s,l,r,d,c,u){$(".choose-materials").attr("disabled","disabled");var h=Grids[e],m=Grids[t],f=h.GetSelRows();h.SelectAllRows(0);var v=u?getGridParents(m.Rows,u):{};for(var g in f){if(f[g].Def&&"Parent"==f[g].Def.Name){if(u){var b=getDublicateGridParent(f[g],m.Rows,u);if(b){v[f[g].id]=b.id;continue}if(f[g][u]&&m.GetRowById(f[g][u],u)){var k=m.GetRowById(f[g][u],u);k&&k.Deleted&&(k.Deleted=!1),v[f[g].id]=k.id;continue}}if(f[g].parent_id>0&&v[f[g].parent_id])var C=m.AddRow(m.GetRowById(v[f[g].parent_id]),null,1);else C=m.AddRow(null,null,1);for(p in m.ChangeDef(C,"Parent",1),l)C[p]=l[p];C.Expanded=1,v[f[g].id]=C.id}else C=m.AddRow(m.GetRowById(v[f[g].parent_id]),null,1);C.is_new=1;var y=m.Cols;for(i in y)if(!o||-1===$.inArray(i,o)){var _=index=i;if(r&&r[i])if($.isArray(r[i]))for(j in r[i])f[g][r[i][j]]&&(_=r[i][j]);else _=r[i];d&&d[i]&&(index=d[i]),f[g][_]&&"id"!=i&&(C.parent_id>0?(m.SetValue(C,index,f[g][_],1),m.ExpandParents(C)):s&&-1!==$.inArray(i,s)||m.SetValue(C,index,f[g][_],1))}console.log(n),$("#"+n).val($("#"+n).val()+C.tariff_id+";")}$("#"+a).modal("hide"),delete Grids[e],$("#"+a).remove(),c&&c()}function getDublicateGridParent(e,t,a){for(r in t){var i=t[r];if("Data"==i.Kind&&"Parent"==i.Def.Name&&!i.Deleted&&i[a]==e[a])return i}return null}function getGridParents(e,t){var a={};for(r in e){var i=e[r];"Data"!=i.Kind||"Parent"!=i.Def.Name||i.Deleted||(a[i[t]]=i.id)}return a}function getSelectedRows(e){var t=getGridCacheSelectedRows(e);if(t)return t;setTimeout((function(){getSelectedRows(e)}),200)}function enableSelectWithSearch(e,t,a){$("#"+e).select2({placeholder:t,allowClear:!0,data:a})}function returnBack(e){window.location.href=e}function validateNumbersWithDot(e){var t;return(e.keyCode>0||void 0!==e.charCode)&&(t=e.which||e.keyCode),46==t||!(t>31&&(t<48||t>57))}function prepareDateTimePicker(){$('.datetimepicker:not(".has-datetimepicker")').each((function(){$(".datetimepicker").datetimepicker({format:"YYYY-MM-DD HH:mm:ss",locale:"lt",maxDate:new Date}),$(".datetimepicker").addClass("has-datetimepicker")}))}function prepareDateTimePickerWithMinDate(e,t){$("."+e+':not(".has-datetimepicker")').each((function(){$("."+e).datetimepicker({format:"YYYY-MM-DD HH:mm:ss",locale:"lt",maxDate:new Date,minDate:t||new Date}),$("."+e).addClass("has-datetimepicker")}))}function calculateMonthsDifference(e,t){var a=moment(e).format("YYYY-MM-DD"),i=moment(t).format("YYYY-MM-DD");return moment(i).diff(moment(a),"months",!0).toFixed(2)}function getCurrentDate(){return moment().format("YYYY-MM-DD")}function addOnDayToDate(e,t){if(e)return moment(e).add(t,"days").format("YYYY-MM-DD")}function checkEditedInfo(e,t,a,i){var n=!0;if(e&&window[e]()){if(!i){var o=$.now(),s={submit:t,onclose:function(){$("#save-changes-dialog-"+o).remove()},buttons:{exit:{title:"Uždaryti nesaugant pakeitimų",class:"md-raised mini-button md-button md-ink-ripple red-button",onclick:a+"()"}}};$("body").append('<div class="save-changes-dialog" id="save-changes-dialog-'+o+'"></div>'),$("#save-changes-dialog-"+o).createModal(s,null,"<strong>Ar išsaugoti pakeitimus?</strong>")}n=!1}return n}var formChanged=[];function monitorChanges(e){$("#"+e).length>0&&$("#"+e).change((function(){formChanged[e]=!0}))}function resetChanges(e,t){t?formChanged=[]:formChanged&&formChanged[e]&&(formChanged[e]=!1)}function checkChanges(e){return!(!formChanged||!formChanged[e]||1!=formChanged[e])}var ts="";function askForAction(e,t,a,i,n,o,s){o||(o="ask-for-action-dialog");var l=$("<div />").attr("id",o).css("z-index","99999");$("body").append(l),n||(n="md-raised mini-button md-primary md-button md-ink-ripple");var r={buttons:{send:{class:n,title:a,onclick:"onclickActionDialog('"+t+"', '"+o+"', "+!(!s||!s.check_for_hide)+")",icon:i,id:"send_for_approval"}},onclose:function(){$("#"+o).remove()}},d="<strong>"+e+"</strong>";s&&s.with_return_reason_form_id&&(d+='<div style="margin-top: 18px;"><form id="'+s.with_return_reason_form_id+'"><div class="form-group"><label for="return-reason">Priežastis<span class="required-symbol">*</span>:</label><textarea class="form-control" id="return-reason" rows="3" required></textarea></div></form></div>'),s&&s.merge_with_params&&(s.buttons&&(r.buttons=$.extend(r.buttons,s.buttons)),"undefined"!==s.cancel&&(r.cancel=s.cancel)),$("#"+o).createModal(r,null,d)}function onclickActionDialog(e,t,a){t||(t="ask-for-action-dialog"),a||disableButtonOnClick("send_for_approval");var i=window[e];"function"==typeof i?a?i()&&(disableButtonOnClick("send_for_approval"),$("#"+t).modal("hide")):(i(),$("#"+t).modal("hide")):$("#"+t).modal("hide")}function calcSequanceNr(e,t,a){if(e&&"Data"==e.Kind){if(a){var i=1,n=e.parentNode,o=!1;if("I"==n.nodeName)for(;n.nextSibling;)i++,n=n.nextSibling;else o=!0;return e==e.parentNode.firstChild?i+(o?"":".1"):e.previousSibling[t].split(".").slice(0,-1).join(".")+(o?"":".")+(Number(e.previousSibling[t].split(".").pop())+1)}return e.previousSibling||"B"!=e.parentNode.nodeName?Number(e.previousSibling[t])+1:1}return""}function activateChooseMaterialsButton(){$(".choose-materials").removeAttr("disabled")}function disableChooseMaterialsButton(){$(".choose-materials").attr("disabled","disabled")}function isNumberKey(e){var t=e.which?e.which:event.keyCode;return 48<=t&&t<=57||96<=t&&t<=105||8==t}function doParentRecursion(e,t,a,i,n){if("Data"==t.Kind)return n||window[a](e,t,i),t.parentNode&&doParentRecursion(e,t.parentNode,a,i),!0}function setParentValue(e,t,a){for(var i in a.cols){var n=a.cols[i];if(a.delta)var o=t[n]+a.delta;else a.row_object&&(o=t[n]-a.row_object[n]);void 0!==o&&(a.exclude_cols?-1==a.exclude_cols.indexOf(n)&&e.SetValue(t,n,o,1):e.SetValue(t,n,o,1))}}function disableButtonOnClick(e){$("#"+e).attr("disabled","disabled")}function enableButtonAfterPost(e){"disabled"==$("#"+e).attr("disabled")&&$("#"+e).removeAttr("disabled")}function replaceNumberCommaWithDot(){$("input.number_value").bind("change keyup input paste keydown",(function(e){var t=e.which?e.which:event.keyCode;if(110!=t&&188!=t&&17!=t&&86!=t||(e.preventDefault(),-1==$(this).val().indexOf(".")&&"keydown"===e.type&&$(this).val($(this).val()+".")),109==t){e.preventDefault();var a=$(this).val();$(this).val(a.replace("-",""))}})),$("input.number_value").keypress((function(e){return isNumber(e,this)}))}function onImportFinished(e,t,a){t&&angular.element($("#"+t+" .datatable")).scope().reloadDataTable(),closeModal(e,a)}function isNumber(e,t){var a=e.which?e.which:event.keyCode;return 45==a&&-1==$(t).val().indexOf("-")||46==a&&-1==$(t).val().indexOf(".")||!(a<48||a>57)}function loadDocuments(e,t,a){var i=t.replace("/","_")+"_"+$.now();a||(a={}),a.modal_id=i;var n=BASE_URL+"/core/coreapi/documents",o={object_id:e,object_code:t,can_upload:a&&1==a.can_upload?1:0,only_one_file:a&&1==a.only_one_file?1:0};a&&a.grid_id&&(o.grid_id=a.grid_id),a&&a.row_id&&(o.row_id=a.row_id),a&&a.height&&(o.height=a.height),a.cancel=!1,a.buttons={cancel:{class:"md-raised mini-button md-button md-ink-ripple",title:"Uždaryti",attr:{"data-dismiss":"modal"},onclick:function(){"function"==typeof a.cancel_callback&&a.cancel_callback({modal_id:i})},icon:"fa fa-close"}},$("body").append('<div id="'+i+'"></div>'),$("#"+i).loadinmodal(n,o,a)}
