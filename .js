/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/** ******  left menu  *********************** **/
$(function () {
    $('#menu_toggle').click(function () {
        if ($('body').hasClass('nav-md')) {
            $.cookie("menu", "nav-sm", { expires: 14, path: '/' });
            $('body').removeClass('nav-md');
            $('body').addClass('nav-sm');

            $('#sidebar-menu li.active-sm ul').attr('style','display:none');
            $('#sidebar-menu li ul').attr('style','display:none');
            $('#sidebar-menu li').removeClass('active');
            $('#sidebar-menu li').removeClass('active-sm');    

            if ($('body').hasClass('nav-sm')) {
                $('.menu-text').addClass('hidden');
            } 

            if ($('#sidebar-menu li').hasClass('active')) {
                $('#sidebar-menu li.active').addClass('active-sm');
                $('#sidebar-menu li.active').removeClass('active');
            }
        } else {
            if ($('body').hasClass('nav-sm')) {
                $.cookie("menu", "nav-md", {expires: 14, path: '/' });
            }
            $('body').removeClass('nav-sm');
            $('body').addClass('nav-md');
            $('.sidebar-footer').show();
            if ($('body').hasClass('nav-md')) {
                $('.menu-text').removeClass('hidden');
            }

            if ($('#sidebar-menu li').hasClass('active-sm')) {
                $('#sidebar-menu li.active-sm').addClass('active');
                $('#sidebar-menu li.active-sm').removeClass('active-sm');
            }

        }
    });

    $('#content_container').click(function() {
        if ($('body').hasClass('nav-sm')) {
            $('#sidebar-menu li').removeClass('nv active');
            $('#sidebar-menu li ul').attr('style', 'display:none');
        }
    });

});

/* Sidebar Menu active class */
$(function () {
    var url = window.location;
    $('#sidebar-menu a[href="' + url + '"]').parent('li').addClass('current-page');
/*    $('#sidebar-menu a').filter(function () {
        return this.href == url;
    }).parent('li').addClass('current-page').parent('ul').slideDown().parent().addClass('active');*/
});

/** ******  /left menu  *********************** **/



/** ******  tooltip  *********************** **/
$(function () {
        $('[data-toggle="tooltip"]').tooltip()
    })
    /** ******  /tooltip  *********************** **/
    /** ******  progressbar  *********************** **/
if ($(".progress .progress-bar")[0]) {
    $('.progress .progress-bar').progressbar(); // bootstrap 3
}
/** ******  /progressbar  *********************** **/
/** ******  switchery  *********************** **/
if ($(".js-switch")[0]) {
    var elems = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
    elems.forEach(function (html) {
        var switchery = new Switchery(html, {
            color: '#26B99A'
        });
    });
}
/** ******  /switcher  *********************** **/
/** ******  collapse panel  *********************** **/
// Close ibox function
$('.close-link').click(function () {
    var content = $(this).closest('div.x_panel');
    content.remove();
});

/** ******  /collapse panel  *********************** **/

/** ******  /iswitch  *********************** **/
/** ******  star rating  *********************** **/
// Starrr plugin (https://github.com/dobtco/starrr)
var __slice = [].slice;

(function ($, window) {
    var Starrr;

    Starrr = (function () {
        Starrr.prototype.defaults = {
            rating: void 0,
            numStars: 5,
            change: function (e, value) {}
        };

        function Starrr($el, options) {
            var i, _, _ref,
                _this = this;

            this.options = $.extend({}, this.defaults, options);
            this.$el = $el;
            _ref = this.defaults;
            for (i in _ref) {
                _ = _ref[i];
                if (this.$el.data(i) != null) {
                    this.options[i] = this.$el.data(i);
                }
            }
            this.createStars();
            this.syncRating();
            this.$el.on('mouseover.starrr', 'span', function (e) {
                return _this.syncRating(_this.$el.find('span').index(e.currentTarget) + 1);
            });
            this.$el.on('mouseout.starrr', function () {
                return _this.syncRating();
            });
            this.$el.on('click.starrr', 'span', function (e) {
                return _this.setRating(_this.$el.find('span').index(e.currentTarget) + 1);
            });
            this.$el.on('starrr:change', this.options.change);
        }

        Starrr.prototype.createStars = function () {
            var _i, _ref, _results;

            _results = [];
            for (_i = 1, _ref = this.options.numStars; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
                _results.push(this.$el.append("<span class='glyphicon .glyphicon-star-empty'></span>"));
            }
            return _results;
        };

        Starrr.prototype.setRating = function (rating) {
            if (this.options.rating === rating) {
                rating = void 0;
            }
            this.options.rating = rating;
            this.syncRating();
            return this.$el.trigger('starrr:change', rating);
        };

        Starrr.prototype.syncRating = function (rating) {
            var i, _i, _j, _ref;

            rating || (rating = this.options.rating);
            if (rating) {
                for (i = _i = 0, _ref = rating - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
                    this.$el.find('span').eq(i).removeClass('glyphicon-star-empty').addClass('glyphicon-star');
                }
            }
            if (rating && rating < 5) {
                for (i = _j = rating; rating <= 4 ? _j <= 4 : _j >= 4; i = rating <= 4 ? ++_j : --_j) {
                    this.$el.find('span').eq(i).removeClass('glyphicon-star').addClass('glyphicon-star-empty');
                }
            }
            if (!rating) {
                return this.$el.find('span').removeClass('glyphicon-star').addClass('glyphicon-star-empty');
            }
        };

        return Starrr;

    })();
    return $.fn.extend({
        starrr: function () {
            var args, option;

            option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            return this.each(function () {
                var data;

                data = $(this).data('star-rating');
                if (!data) {
                    $(this).data('star-rating', (data = new Starrr($(this), option)));
                }
                if (typeof option === 'string') {
                    return data[option].apply(data, args);
                }
            });
        }
    });
})(window.jQuery, window);

$(function () {
    return $(".starrr").starrr();
});

$(document).ready(function () {
    prepareComponents();
/*    Grids.OnGetDefaultColor = function(grid, row, col, r, g, b) {
        if (row.Kind == 'Data') {
            return 'rgb(255,255,255)';
        }
    }*/

    $('.flat').on('ifChecked ifUnchecked', function(event) {
        if(event.type == 'ifChecked') {
            $('#'+$(this).attr('id')).val(1);
        } else {
            $('#'+$(this).attr('id')).val(0);
        }
    });

    $('#stars').on('starrr:change', function (e, value) {
        $('#count').html(value);
    });


    $('#stars-existing').on('starrr:change', function (e, value) {
        $('#count-existing').html(value);
    });

    if ($('body').hasClass('nav-sm')) {
        $('#sidebar-menu li.active ul').hide();
    }

});
/** ******  /star rating  *********************** **/
/** ******  table  *********************** **/
$('table input').on('ifChecked', function () {
    check_state = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('table input').on('ifUnchecked', function () {
    check_state = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});

var check_state = '';
$('.bulk_action input').on('ifChecked', function () {
    check_state = '';
    $(this).parent().parent().parent().addClass('selected');
    countChecked();
});
$('.bulk_action input').on('ifUnchecked', function () {
    check_state = '';
    $(this).parent().parent().parent().removeClass('selected');
    countChecked();
});
$('.bulk_action input#check-all').on('ifChecked', function () {
    check_state = 'check_all';
    countChecked();
});
$('.bulk_action input#check-all').on('ifUnchecked', function () {
    check_state = 'uncheck_all';
    countChecked();
});

function countChecked() 
{
    if (check_state == 'check_all') {
        $(".bulk_action input[name='table_records']").iCheck('check');
    }
    if (check_state == 'uncheck_all') {
        $(".bulk_action input[name='table_records']").iCheck('uncheck');
    }
    var n = $(".bulk_action input[name='table_records']:checked").length;
    if (n > 0) {
        $('.column-title').hide();
        $('.bulk-actions').show();
        $('.action-cnt').html(n + ' Records Selected');
    } else {
        $('.column-title').show();
        $('.bulk-actions').hide();
    }
}
    /** ******  /table  *********************** **/
    /** ******    *********************** **/
    /** ******    *********************** **/
    /** ******    *********************** **/
    /** ******    *********************** **/
    /** ******    *********************** **/
    /** ******    *********************** **/
    /** ******  Accordion  *********************** **/

$(function () {
    $(".expand").on("click", function () {
        $(this).next().slideToggle(200);
        $expand = $(this).find(">:first-child");

        if ($expand.text() == "+") {
            $expand.text("-");
        } else {
            $expand.text("+");
        }
    });
});

/** ******  Accordion  *********************** **/
/** ******  scrollview  *********************** **/
$(document).ready(function () {
    $(".scroll-view").niceScroll({
        touchbehavior: true,
        cursorcolor: "rgba(42, 63, 84, 0.35)"
    });
});
/** ******  /scrollview  *********************** */

function toogleMenu(item) {
    if (item.parent().is('.active')) {
        item.parent().removeClass('active');
        item.next().slideUp();
        item.parent().removeClass('nv');
        item.parent().addClass('vn');
    } else {
        $('#sidebar-menu li ul').slideUp();
        item.parent().removeClass('vn');
        item.parent().addClass('nv');
        item.next().slideDown();
        $('#sidebar-menu li').removeClass('active');
        item.parent().addClass('active');
    }
}

/**
 * Load data from url into modal and open it
 * @param  {string} url      Data url
 * @param  {object} data     Post data
 * @param  {object} settings Modal additional settings
 */
$.prototype.loadinmodal = function(url, data, settings, grid) {
    var element = $(this).html('');

    if (!$(this).hasClass('dialog_exist')) {
        $(this).addClass('dialog_exist');

        $.post(url, data, function(content){
            element.createModal(settings, grid, content);
        });
    }
}

var openned_modals = 0;

/**
 * Create and open modal dialog
 * @param  {object} settings Modal settings
 */
$.prototype.createModal = function(settings, grid, content) {
    if (!settings) {
        var settings = {};
    }

    var html = '';
    $(this).addClass('modal').addClass('fade');
    //$(this).attr('tabindex', '-10').attr('role', 'dialog');


    var modal_dialog = $('<div/>').addClass('modal-dialog').appendTo($(this));
    
    if (settings.width) {
        modal_dialog.css('width', settings.width+'px');
    }

    var modal_content = $('<div/>').addClass('modal-content').appendTo(modal_dialog);

    var modal_header = $('<div/>')
            .addClass('modal-header')
            .append([
                (typeof settings.without_close == 'undefined' || settings.without_close != true ? $('<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>') : ''),
                $('<h4/>').html((settings && settings.title ? settings.title : ''))
            ]).appendTo(modal_content);

    var modal_body = $('<div/>').addClass('modal-body').html(content).appendTo(modal_content);

    var modal_footer = $('<div/>').addClass('modal-footer').appendTo(modal_content);

    if (settings.submit) {
        modal_footer.append(
            $('<button/>')
                .addClass('md-raised mini-button md-button md-ink-ripple green-button save')
                .append(['<i class="fa fa-save"></i> ', 'Išsaugoti'])
                .attr({'onclick': settings.submit+'()', type: 'button'})
        );
    }

    if (settings.header_close) {
        modal_header.prepend(
                $('<button type="button" class="close" aria-label="Close"<span aria-hidden="true">&times;</span></button>')
                    .on('click', settings.header_close.onclick)
            );
    }

    for (var b in settings.buttons) {
        var button = settings.buttons[b];

        var btn = null;

        if (button.attr) {
            if (typeof button.attr == "object") {
                btn = $('<button/>').attr('type', 'button').attr(button.attr);
            }else{
                btn = $('<button '+button.attr+'/>').attr('type', 'button');
            }
        }else{
            btn = $('<button/>').attr('type', 'button');
        }


        if (button.id){
            btn.attr('id', button.id);
        }

        if (button.tooltip){
            btn.attr('data-tip', button.tooltip);
        }

        if (button.class){
            btn.addClass(button.class);
        }

        if (button.tooltip){
            btn.addClass('tip');
        }

        if (button.onclick){
            if (typeof button.onclick == 'function') {
                btn.on('click', button.onclick);
            }else{
                btn.attr('onclick', button.onclick);
            }
        }

        if (button.icon){
            btn.append("<i class='"+button.icon+"'></i> ");
        }

        btn.append(button.title).appendTo(modal_footer);
    }

    if (settings.delete) {
        modal_footer.append(
            $('<button/>')
                .addClass('md-raised mini-button md-button md-ink-ripple red-button')
                .append(['<i class="fa fa-trash"></i> ', 'Ištrinti'])
                .attr({'onclick': settings.delete+'()', type: 'button'})
        );
    }

    if (typeof settings.cancel == 'undefined' || settings.cancel != false) {
        modal_footer.append(
            $('<button/>')
                .addClass('md-raised mini-button md-button md-ink-ripple')
                .append(['<i class="fa fa-close"></i> ', 'Atšaukti'])
                .attr({'data-dismiss': 'modal', type: 'button'})
        );
    }

    $(this).modal({
        show: true,
        backdrop: false,
    });

    var scroll = $('body').scrollTop();

    $(this).on('shown.bs.modal', function() {
        $(this).find('input:not([type=hidden])').first().focus();
        $(this).find('.modal-dialog').css('z-index', '1050');

        if (!$(this).data('compiled_angular')) {
            compileAjaxAngular($(this));
            $(this).data('compiled_angular', true);
        }
        
        prepareComponents();

        if ($(this).find('.grid-container').length > 0) {
            $('body').scrollTop(0);
        }

        openned_modals++;
    });
    if ($(this).find('.grid-container').length > 0 || settings.onclose) {
        $(this).on('hidden.bs.modal', function(e) {

            $('body').scrollTop(scroll);

            if ($(this).find('.grid-container').length > 0) {
                $(this).find('.grid-container').each(function(){
                    if (Grids[$(this).attr('id')]) {
                        Grids[$(this).attr('id')].Dispose();
                    }
                });
            }
            
            if (settings.onclose) {
                settings.onclose(e);
            }
        });
    }

    if (settings.beforeClose) {
        $(this).on('hide.bs.modal', function(e) {
            if (typeof settings.beforeClose == 'function') {
                settings.beforeClose(e, settings);
            } else if(typeof window[settings.beforeClose] == 'function') {
                window[settings.beforeClose](settings);
            }
        });
    }

    if (grid) {
        grid.Disable();

        $(this).on('hidden.bs.modal', function () {
            grid.Enable();
        });
    }


    $(this).on('hidden.bs.modal', function(e) {
        $(this).removeClass('dialog_exist');
        openned_modals--;

        if (openned_modals > 0) {
            $('body').addClass('modal-open');
        } else {
            $('body').removeClass('modal-open');
            $(this).data('compiled_angular', false);
        }

    });

    enableWysiwyg();

    $(this).triggerHandler('onAfterElementLoaded');
}

/**
 * Create xpanel block view
 */
$.prototype.xpanel = function() {
    var settings = $(this).data();

    var html = '<div><div><div class="x_panel">';
    html += '<div class="x_content"'+($(this).hasClass('closed') ? ' style="display: none;"' : '')+'></div>';
    html += '</div></div></div>';

    $(this).wrap(html);

    if (!$(this).hasClass('no-header')) {

        var header = $(document.createElement('div')).addClass('x_title').append(
            $(document.createElement('h2')).text((settings && settings.title ? settings.title : '')),
            $(document.createElement('ul')).addClass('nav navbar-right panel_toolbox').append(
                $(document.createElement('li')).append(
                    $(document.createElement('a')).addClass('collapse-link').data(settings).data('open', (settings.open ? ' data-open="'+settings.open+'"' : '' )).data('open', (settings.close ? ' data-open="'+settings.close+'"' : '' )).append(
                        $(document.createElement('i')).addClass('fa fa-chevron-'+($(this).hasClass('closed') ? 'down' : 'up'))
                    )
                )
            ),
            $(document.createElement('div')).addClass('clearfix')
        );
    }

    $(this).parent().before(header);
    
    // when you need to make something after xpanel where loaded add atribute ( data-after-load )
    if(typeof window[settings.afterLoad] !== 'undefined' && typeof window[settings.afterLoad] === 'function'){
        window[settings.afterLoad]();
    }
}

// Collapse ibox function
$(document).on({
    click: function() {
        var collapse_link = $(this).find('.collapse-link').first();
        var x_panel = $(collapse_link).parents('.x_panel').first();
        var button = $(collapse_link).find('i');
        var content = x_panel.find('.x_content');
        var settings = $(collapse_link).data();
        
        if (content.is(':visible')) {
            if (typeof window[settings.close] === 'function'){
                window[settings.close]();
            }
        } else {
            if (settings.url) {
                content.find('.x-panel').loadContent(settings.url, settings);
            }

            if (typeof window[settings.open] === 'function'){
                window[settings.open]();
            }
        }

        content.slideToggle(200);

        (x_panel.hasClass('fixed_height_390') ? x_panel.toggleClass('').toggleClass('fixed_height_390') : '');
        (x_panel.hasClass('fixed_height_320') ? x_panel.toggleClass('').toggleClass('fixed_height_320') : '');
        button.toggleClass('fa-chevron-up').toggleClass('fa-chevron-down');

        setTimeout(function () {
            x_panel.resize();
        }, 50);
    }
}, ".x_title");

/**
 * Prepare bootstrap date year picker
 */
function prepareDateYearPicker()
{
    $('.date-year').datepicker({
        format: "yyyy",
        minViewMode: 2,
        language: "lt",
        orientation: "bottom auto",
        autoclose: true,
    });
}

/**
 * Prepare components list which are initiated on page load
 * 
 */
function prepareComponents()
{
    $('.x-panel:not(".has-x-panel")').each(function() {
        $(this).xpanel();
        $(this).addClass('has-x-panel');
    });

    prepareDateYearPicker();
    prepareDatePicker();
    prepareDateTimePicker();
    enableWysiwyg();
    enableICheck();
    enableMultiselect();
    enableSelectpicker();
    enableTooltips();

    replaceNumberCommaWithDot();
    prepareBootstrapDatepicker();
}

/**
 * Prepare bootstrap datepicker
 * 
 */
function prepareBootstrapDatepicker()
{
    $('.datepicker:not(".has-datepicker")').each(function() {
        $('.datepicker').datetimepicker({
            format: 'YYYY-MM-DD',
            locale: 'lt',
            //maxDate: 'now',
        });
        $('.datepicker').addClass('has-datepicker');
    });
}

/**
 *  Enable bootstrap tooltip view
 */
function enableTooltips(){
    $('[data-toggle="tooltip"]').tooltip();
}

/**
 *  Enable bootstrap selectpicker view
 */
function enableSelectpicker() {
    $('.selectpicker').selectpicker({ dropupAuto: true });
}

/**
 *  Enable functionality for dynamic content loading to element
 *
 * @param {string} url Data url
 * @param {object} object Object of data
 * @param {bool}   reload Is need reload dat
 */
$.prototype.loadContent = function(url, data, reload, callback) {
    if (!data) {
        data = {};
    }

    if (!$(this).html() || $(this).html().trim().length == 0 || reload) {
        $(this).load(url, data, function(){
            if (callback) {
                callback();
            }
            compileAjaxAngular($(this));
            prepareComponents();
        });
    }

    return $(this);
}

/**
 * Load content into panel
 * @param  {string} url Content Url
 */
$.prototype.loadinpanel = function(url, callback) {
    $(this).loadContent(url, {}, false, callback);
    enableICheck();
}

/**
 * Prepare bootstrap multiselect component
 * @param  {Boolean} is_dropup Is with dropup functionality
 */
function enableMultiselect(is_dropup)
{
    if (typeof is_dropup == "undefined") {
        is_dropup = false;
    }

    $('select.multiselect:not(".has-multiselect")').multiselect({
        enableFiltering: true,
        includeSelectAllOption: true,
        maxHeight: 400,
        enableCaseInsensitiveFiltering: true,
        filterPlaceholder: 'Paieška',
        selectAllText: 'Pažymėti visus',
        nonSelectedText: 'Pasirinkite',
        allSelectedText: 'Visi pažymėti',
        nSelectedText: 'pasirinkti',
        buttonWidth: 'auto',
        selectAllName: 'select-all-name',
        dropUp: is_dropup
    });

    $('select.multiselect:not(".has-multiselect")').addClass('has-multiselect');
}

var wysiwygEditors = {};

/**
 * Enables wysiwyg editors
 */
function enableWysiwyg(settings) 
{
    var plugins = [
        'placeholder',
        'advlist autolink lists link image charmap print preview anchor',
        'searchreplace visualblocks code fullscreen',
        'insertdatetime media table contextmenu paste code'
    ];


    if (settings) {
        if (settings.plugins) {
            plugins = plugins.concat(settings.plugins);
        }
    }

    $('.wysiwyg:not(.has-wysiwyg)').each(function(index){
        if ($(this).attr('id').length == 0) {
            $(this).attr('id', 'wysiwyg-editor-'+(index+1));
        }

        var wid = $(this).attr('id');
        var weditor = null;

        var params = {
            selector: '#'+wid,
            plugins: plugins,
            toolbar: ($(this).attr('readonly') ? false : 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent'),
            menubar: false,
            statusbar: ($(this).attr('readonly') ? false : true),
            toolbar_items_size : 'small',
            readonly:  $(this).attr('readonly') ? 1 : 0,
            autoresize_bottom_margin: 0,
            setup: function (editor) {
                wysiwygEditors[wid] = editor;

                editor.on('change', function () {
                    var wform = $('#'+wid).parents('form').first();

                    if (wform.length > 0 && wform.attr('id').length > 0) {
                        formChanged[wform.attr('id')] = true;
                    }

                    editor.save();

                    if ($('#'+editor.id).attr('onChangeEvent')) {
                        window[$('#'+editor.id).attr('onChangeEvent')](editor);
                    }
                });

                if ($('#'+editor.id).prop('readonly')) {
                    //editor.settings.readonly = true;
                }
            },
        };

        tinymce.init(params);

        $(this).addClass('has-wysiwyg');
    })
}

/**
 * Enable dropzone functionalit for file upload
 * 
 * @param  {string}   object_code     Document object code
 * @param  {string}   prefix          Document prefix
 * @param  {string}   url             Document URL
 * @param  {integer}   maxFilesize     Document max size in bytes
 * @param  {integer}   fileCountPrefix 
 * @param  {integer}   file_data       Additional uploaded form data wwith file
 * @param  {Function} callback        Function name, which will be call after upload
 */
function enableDropzone(object_code, prefix, url, maxFilesize, fileCountPrefix, file_data, callback)
{
    Dropzone.autoDiscover = false;

    if ($('#'+prefix+'-dropzone:not(.has-dropzone)').length > 0) {
        $('#'+prefix+'-dropzone:not(.has-dropzone)').dropzone({
            init: function() {
                var $this = this;
                $("button#clear-dropzone").click(function() {
                    $this.removeAllFiles(true);
                });

                this.on("addedfile", function(file) {
                    // send additional data to post
                    this.on('sending', function(file, xhr, formData) {
                        formData.append('description',$('#'+prefix+'-file_description').val());
                        formData.append('object_id', $('#'+prefix+'_object_id').val());
                        formData.append('object_code', $('#'+prefix+'_object_code').val());
                        formData.append('new_object_code', $('#'+prefix+'_new_object_code').val());

                        for (i in file_data) {
                            formData.append(i, file_data[i]);
                        }
                    });
                });

                $(document).on('click', '#'+prefix+'-upload_file', function() {
                    $this.processQueue();
                });
            },
            paramName: "file",
            maxFilesize: maxFilesize,
            maxFiles : 25,
            parallelUploads: 25,
            addRemoveLinks: true,
            uploadMultiple: true,
            autoProcessQueue : false,
            dictDefaultMessage: "Vilkite failus čia arba paspauskite norėdami pasirinkti",
            dictFileTooBig: "Failo dydis yra didesnis už leidžiamą dydį: "+maxFilesize+" mb",
            dictInvalidFileType: "Neteisingas failo formatas. Leidžiami tokie failo formatai: image/*,application/pdf,.psd, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .odt, .csv, .txt, .dwg, .dxf, .rar, .zip, .adoc, .7z, .html, .htm, .ods, .webm, .mpg, .mp2, .mpeg, .mpe, .mpv, .ogg, .mp4, .m4p, .m4v, .mov, .avi, .wmv, .msg",
            dictMaxFilesExceeded: "Viršytas maksimalus leidžiamas failų kiekis",
            dictRemoveFile: "Pašalinti",
            url: url,
            acceptedFiles: "image/*,application/pdf,.psd, .doc, .docx, .xls, .xlsx, .ppt, .pptx, .odt, .csv, .txt, .dwg, .dxf, .rar, .zip, .adoc, .7z, .html, .htm, .ods, .webm, .mpg, .mp2, .mpeg, .mpe, .mpv, .ogg, .mp4, .m4p, .m4v, .mov, .avi, .wmv, .msg",
            success: function(file, response) {
                if (this.getUploadingFiles().length === 0 && this.getQueuedFiles().length === 0) {
                    var file_ids = $('#'+prefix+'_documents');

                    if (response.success) {
                        showMessage(response.success_message, 'success');

                        for (var i in response.Data ) {
                            var file_id = response.Data[i];
                            file_ids.val(file_id+';'+$(file_ids).val());
                        }

                        angular.element( $('#document_list_'+object_code + ' .datatable') ).scope().reloadDataTable();

                        this.removeAllFiles(true);
                        $('#'+prefix+'-file_description').val('');

                        //on upload count number of files
                        $('#'+prefix+'_documents_count').text(parseInt($('#'+prefix+'_documents_count').text())+response.Data.length).triggerHandler('change');

                        var post_data = {
                            file_ids: response.Data,
                        };

                        var form = $('#'+prefix+'-document_upload_form');
                        var url = form.data('notify-url');
                        
                        if ($('#'+prefix+'_object_id').val() > 0) {
                            $.post(url, post_data);
                        }

                        if (callback) {
                            callback();
                        }
                    } else {
                        showMessage(response.error_message, 'error');
                    }
                }
            },
        });

        $('#'+prefix+'-dropzone:not(.has-dropzone)').addClass('has-dropzone');
    }
}

/**
 * Enable icheck element functionality
 * 
 */
function enableICheck() 
{
    if ($('input.flat:not(.has-icheck)').length > 0) {
        $('input.flat:not(.has-icheck)').iCheck({
            checkboxClass: 'icheckbox_flat-green',
            radioClass: 'iradio_flat-blue',
        });

        $('input[type="checkbox"]').addClass('has-icheck');
    }
}

/**
 * Enable functionality for treegrid to move row object between grids
 * 
 * @param  {string}   old_grid_id                ID of old grid
 * @param  {string}   new_grid_id                ID of new grid
 * @param  {string}   modal_id                   Modal window ID
 * @param  {string}   hidden_tariff_input        ID of hidden input
 * @param  {object}   excluded_cols              Object of columns, which are not should be setted
 * @param  {integer}   parent_excluded_cols      Object of parent cols which will be excluded
 * @param  {object}   parent_values              Object of parent data
 * @param  {object}   cols_replacements          Name of cols which should be replaced
 * @param  {object}   new_grid_cols_replacements Object of new cols, which should be replaced in new grid
 * @param  {Function} callback                   
 * @param  {object}   dublicates_col             Object of duplicate calls
 */
function moveRowsInDifferentGrids(old_grid_id, new_grid_id, modal_id, hidden_tariff_input, excluded_cols, parent_excluded_cols, parent_values, cols_replacements, new_grid_cols_replacements, callback, dublicates_col)
{
    $('.choose-materials').attr('disabled', 'disabled');

    var grid = Grids[old_grid_id];
    var new_grid = Grids[new_grid_id];
    var rows = grid.GetSelRows();
    
    grid.SelectAllRows(0);

    var parents = (dublicates_col ? getGridParents(new_grid.Rows, dublicates_col) : {});

    for (var r in rows) {
        if (rows[r].Def && rows[r].Def.Name == "Parent") {

            if (dublicates_col) {
                var dublicatedParent = getDublicateGridParent(rows[r], new_grid.Rows, dublicates_col);

                if (dublicatedParent) {
                    parents[rows[r].id] = dublicatedParent.id;
                    continue;
                } else if (rows[r][dublicates_col] && new_grid.GetRowById(rows[r][dublicates_col], dublicates_col)) {
                    var parent = new_grid.GetRowById(rows[r][dublicates_col], dublicates_col);

                    if (parent && parent.Deleted) {
                        parent.Deleted = false;
                    }

                    parents[rows[r].id] = parent.id;
                    continue;
                }
            }


            if (rows[r].parent_id > 0 && parents[rows[r].parent_id]) {
                var new_row = new_grid.AddRow(new_grid.GetRowById(parents[rows[r].parent_id]), null, 1);
            } else {
                var new_row = new_grid.AddRow(null, null, 1);
            }

            new_grid.ChangeDef(new_row, "Parent", 1);

            for (p in parent_values) {
               new_row[p] = parent_values[p];
            }

            new_row.Expanded = 1;
            parents[rows[r].id] = new_row.id;

            
        } else {
            var new_row = new_grid.AddRow(new_grid.GetRowById(parents[rows[r].parent_id]), null, 1);
        }
        
        new_row.is_new = 1;

        var cols = new_grid.Cols;

        for (i in cols) {
            if (!excluded_cols || $.inArray(i, excluded_cols) === -1) {
                var value_index = index = i;

                if (cols_replacements && cols_replacements[i]) {
                    if ($.isArray(cols_replacements[i])) {
                        for (j in cols_replacements[i]) {
                            if (rows[r][cols_replacements[i][j]]) {
                                value_index = cols_replacements[i][j];
                            }
                        }
                    } else {
                        value_index = cols_replacements[i];
                    }
                }

                if (new_grid_cols_replacements && new_grid_cols_replacements[i]) {
                    index = new_grid_cols_replacements[i];
                }

                if (rows[r][value_index] && i != "id") {
                    if (new_row.parent_id > 0) {
                        new_grid.SetValue(new_row, index, rows[r][value_index], 1);
                        new_grid.ExpandParents(new_row);
                    } else if(!parent_excluded_cols || $.inArray(i, parent_excluded_cols) === -1) {
                        new_grid.SetValue(new_row, index, rows[r][value_index], 1);
                    }
                }
            }
        }

        console.log(hidden_tariff_input);

        $('#'+hidden_tariff_input).val($('#'+hidden_tariff_input).val()+new_row.tariff_id+';');
    }

    $('#'+modal_id).modal('hide');

    delete Grids[old_grid_id];
    $('#'+modal_id).remove();


    if (callback) {
        callback();
    }
}

/**
 * Get parent of duplicated grid
 * 
 * @param  {object} row            Object of grid row
 * @param  {object} rows           Object of all grid rows
 * @param  {object} dublicates_col Object of duplicated cols
 */
function getDublicateGridParent(row, rows, dublicates_col)
{
    for (r in rows) {
        var _row = rows[r];

        if (_row.Kind == "Data" && _row.Def.Name == "Parent" && !_row.Deleted) {
            if (_row[dublicates_col] == row[dublicates_col]) {
                return _row;
            }
        }
    }

    return null;
}

/**
 * Get parents of grid
 * 
 * @param  {object} rows           Object of treegrid rows
 * @param  {object} dublicates_col Object of duplicate cols
 */
function getGridParents(rows, dublicates_col)
{
    var parents = {};

    for (r in rows) {
        var row = rows[r];

        if (row.Kind == "Data" && row.Def.Name == "Parent" && !row.Deleted) {
            parents[row[dublicates_col]] = row.id;
        }
    }

    return parents;
}

/**
 * Get selected rows 
 * 
 * @param  {object} Grid Object of treegrid
 */
function getSelectedRows(Grid) {
    var rows = getGridCacheSelectedRows(Grid);

    if (!rows) {
        setTimeout(function(){getSelectedRows(Grid)}, 200);
    } else {
        return rows;
    }
}

/**
 * Prepare bootstrap select element with search
 * 
 * @param  {string} select_id   ID of select element
 * @param  {string} placeholder Placeholder of element
 * @param  {object} data        Object of elements
 */
function enableSelectWithSearch(select_id, placeholder, data)
{
    $("#"+select_id).select2({
        placeholder: placeholder,
        allowClear: true,
        data: data
    });
}

/**
 * Redirect to custom url
 * 
 * @param  {string} url Full URl
 */
function returnBack(url)
{
    window.location.href = url;
}

/**
 * Validate entered elements to input
 * @param  {object} e Element object
 */
function validateNumbersWithDot(e) 
{           
    var charCode;
    if (e.keyCode > 0) {
        charCode = e.which || e.keyCode;
    }
    else if (typeof (e.charCode) != "undefined") {
        charCode = e.which || e.keyCode;
    }
    if (charCode == 46)
        return true
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}

/**
 * Prepare bootstrap datetimepicker component
 * 
 */
function prepareDateTimePicker()
{
    $('.datetimepicker:not(".has-datetimepicker")').each(function() {
        $('.datetimepicker').datetimepicker({
            format: 'YYYY-MM-DD HH:mm:ss',
            locale: 'lt',
            maxDate: new Date(),
        });
        $('.datetimepicker').addClass('has-datetimepicker');
    })
}

/**
 * Prepare datetimepicker with min date parameter
 * 
 * @param  string input_class   Class of input
 * @param  string min_date      Date from
 */
function prepareDateTimePickerWithMinDate(input_class, min_date)
{
    $('.'+input_class+':not(".has-datetimepicker")').each(function() {
        $('.'+input_class).datetimepicker({
            format: 'YYYY-MM-DD HH:mm:ss',
            locale: 'lt',
            maxDate: new Date(),
            minDate: (min_date ? min_date : new Date())
        });
        $('.'+input_class).addClass('has-datetimepicker');
    })
}

/**
 * Calculate month difference between two dates
 * 
 * @param  {date} start Start date
 * @param  {date} end   Finish date
 * @return {integer}    Months difference
 */
function calculateMonthsDifference(start, end)
{
    var start_date = moment(start).format('YYYY-MM-DD');
    var end_date = moment(end).format('YYYY-MM-DD');

    var difference = moment(end_date).diff(moment(start_date), 'months', true);
    return difference.toFixed(2);
}

/**
 * Get current date
 *  
 * @return {date} Get current date formatd
 */
function getCurrentDate()
{
    var current_date = moment().format("YYYY-MM-DD");

    return current_date
}

/**
 * Add some days to date
 * 
 * @param {date} initial_date   Date
 * @param {integer} day_number  Number of days
 */
function addOnDayToDate(initial_date, day_number)
{
    if (initial_date) {
        var date = moment(initial_date).add(day_number, 'days').format('YYYY-MM-DD');
        return date;
    }
}

/**
 * Prepare modal to show before  save info
 * 
 * @param  {function} checker       Checker function
 * @param  {function} save          Save function
 * @param  {function} exit          Save function
 * @param  {boolean} dontOpenModal True/false
 */
function checkEditedInfo(checker, save, exit, dontOpenModal) 
{
    var result = true;
    
    if (checker) {
        if (window[checker]()) {
            if (!dontOpenModal) {
                var ts = $.now();

                var settings = {
                    submit: save,
                    onclose: function(){
                        $('#save-changes-dialog-'+ts).remove();
                    },
                    buttons: {
                        exit: {
                            title: "Uždaryti nesaugant pakeitimų",
                            class: "md-raised mini-button md-button md-ink-ripple red-button",
                            onclick: exit+'()',
                        },
                    }
                };

                $('body').append('<div class="save-changes-dialog" id="save-changes-dialog-'+ts+'"></div>');

                $('#save-changes-dialog-'+ts).createModal(settings, null, '<strong>Ar išsaugoti pakeitimus?</strong>');
            }

            result = false;
        }
    }

    return result;
}

var formChanged = [];


/**
 * Check if form changed
 * @param  {string} id Element id
 */
function monitorChanges(id) 
{
    if ($('#'+id).length > 0) {
        $('#'+id).change(function(){
            formChanged[id] = true;
        });
    }
}

/**
 * Do reset form changed
 * @param  {string} id      Form element id
 * @param  {bool} reset_all True/false
 */
function resetChanges(id, reset_all) 
{
    if (reset_all) {
        formChanged = [];
    } else if (formChanged && formChanged[id]){
        formChanged[id] = false;
    }
}

/**
 * Check for element changes
 * 
 * @param  {integer} id Element ID
 * @return {bool}    True/false
 */
function checkChanges(id) 
{
    if (formChanged && formChanged[id] && formChanged[id] == true) {
        return true;
    }

    return false;
}

var ts = '';

/**
 * Prepare form confirmation modal
 * 
 * @param  {string} message           Confirmation message
 * @param  {string} action            Action to show
 * @param  {string} actionTitle       Confirm action title
 * @param  {string} icon              Confirm action fontawesome class
 * @param  {string} button_class      Confirm button class
 * @param  {string} popup_id          Modal ID
 * @param  {object} additional_params Object of additional params
 */
function askForAction(message, action, actionTitle, icon, button_class, popup_id, additional_params)
{
    if (!popup_id) {
        popup_id = 'ask-for-action-dialog';
    }

    var div = $('<div />').attr('id', popup_id).css('z-index', '99999');
    $('body').append(div);

    if (!button_class) {
        var button_class = 'md-raised mini-button md-primary md-button md-ink-ripple';
    }

    var params = {
        buttons: {
            send: {
                class: button_class,
                title: actionTitle,
                onclick: "onclickActionDialog('"+action+"', '"+popup_id+"', "+(additional_params && additional_params.check_for_hide ? true : false)+")",
                icon: icon,
                id: 'send_for_approval',
            }
        },
        onclose: function() {$('#'+popup_id).remove()},
    }

    var content = '<strong>'+message+'</strong>';

    if (additional_params && additional_params.with_return_reason_form_id) {
        content += '<div style="margin-top: 18px;"><form id="'+additional_params.with_return_reason_form_id+'"><div class="form-group"><label for="return-reason">Priežastis<span class="required-symbol">*</span>:</label><textarea class="form-control" id="return-reason" rows="3" required></textarea></div></form></div>';
    }

    if (additional_params && additional_params.merge_with_params) {
        if (additional_params.buttons) {
            params.buttons = $.extend(params.buttons, additional_params.buttons);
        }

        if (additional_params.cancel !== 'undefined') {
            params.cancel = additional_params.cancel;
        }
    }

    $('#'+popup_id).createModal(params, null, content);
}

/**
 * Show modal before
 * 
 * @param  {string} action         Action string
 * @param  {string} popup_id       Modal ID
 * @param  {bool} check_for_hide  True/false
 * @return {[type]}                
 */
function onclickActionDialog(action, popup_id, check_for_hide)
{
    if (!popup_id) {
        popup_id = 'ask-for-action-dialog';
    }

    if (!check_for_hide) {
        disableButtonOnClick('send_for_approval');
    }

    var fn = window[action];
    if(typeof fn === 'function') {
        if (check_for_hide) {
            if (fn()) {
                disableButtonOnClick('send_for_approval');
                $('#'+popup_id).modal('hide');
            }
        } else {
            fn();
            $('#'+popup_id).modal('hide');
        }
    } else {
        $('#'+popup_id).modal('hide');
    }
}

function calcSequanceNr(Row, Col, is_tree)
{
    if (Row && Row.Kind == "Data") {
        if (is_tree) {
            var count = 1;
            var parentNode = Row.parentNode;
            var first_level = false;

            if (parentNode.nodeName == "I") {
                while (parentNode.nextSibling) {
                    count++;
                    parentNode = parentNode.nextSibling;
                }                
            } else {
                first_level = true;
            }

            return (Row == Row.parentNode.firstChild ? count+(first_level ? "" : ".1") :  Row.previousSibling[Col].split(".").slice(0, -1).join(".")+(first_level ? "" : ".") + (Number(Row.previousSibling[Col].split(".").pop())+1 ));
        } else {
            if (!Row.previousSibling && Row.parentNode.nodeName == "B") {
                return 1;
            }

            return Number(Row.previousSibling[Col])+1;
        }
    }

    return "";
}

/**
 * Remove disabled attribute from choose button
 * @return {[type]} [description]
 */
function activateChooseMaterialsButton()
{
    $('.choose-materials').removeAttr('disabled');
}
function disableChooseMaterialsButton()
{
    $('.choose-materials').attr('disabled', 'disabled');
}

/**
 * Check if entered char is number
 * @param  {object}  evt Object of current element
 */
function isNumberKey(evt){ 
    var charCode = (evt.which) ? evt.which : event.keyCode; 
    if ( (48 <= charCode && charCode <= 57) || (96 <= charCode && charCode <= 105) || charCode == 8)
        return true;
    return false;
}

/**
 * Prepare parent recursively
 *  
 * @param  {object}   grid        Object of grid
 * @param  {object}   row         Object of row
 * @param  {Function} fn          Function to call 
 * @param  {object}   fnParams    Object of params
 * @param  {bool}   withoutSelf   True/false
 */
function doParentRecursion(grid, row, fn, fnParams, withoutSelf) 
{
    if (row.Kind != "Data") {
        return;
    }

    if (!withoutSelf) {
        window[fn](grid, row, fnParams);
    }

    if (row.parentNode) {
        doParentRecursion(grid, row.parentNode, fn, fnParams);
    }

    return true;
}

/**
 *  Set parent value of row
 * @param {object} grid   Object of grid
 * @param {object} row    Additional params object
 */
function setParentValue(grid, row, params)
{
    for (var i in params.cols) {
        var col = params.cols[i];

        if (params.delta) {
            var value = row[col] + params.delta;
        } else if (params.row_object) {
            var value = row[col] - params.row_object[col];
        }


        if (value !== undefined) {
            // don't set value for columns from array 
            if (params.exclude_cols) {
                if (params.exclude_cols.indexOf(col) == -1) {
                    grid.SetValue(row, col, value, 1);
                }
            } else {
                grid.SetValue(row, col, value, 1);
            }
        }
    }
}

/**
 *  Add disabled attribute on custom button
 * @param  {string} button_id Button ID
 */
function disableButtonOnClick(button_id)
{
    $('#'+button_id).attr('disabled', 'disabled');
}

/**
 * Enable button after post
 * @param  {string} button_id Button ID
 */
function enableButtonAfterPost(button_id)
{
    if ($('#'+button_id).attr('disabled') == 'disabled') {
        $('#'+button_id).removeAttr('disabled');
    }
}

/**
 * Replace value with comma in input to dot
 * 
 */
function replaceNumberCommaWithDot()
{
    $("input.number_value").bind('change keyup input paste keydown',function(e){
        var key = e.which ? e.which : event.keyCode;
        if(key == 110 || key == 188 || key == 17 || key == 86){
            e.preventDefault();
            if($(this).val().indexOf('.') == -1 && e.type === 'keydown'){
                $(this).val($(this).val() + '.');
            }          
        }
        if (key == 109) {
            e.preventDefault();
            var value = $(this).val();
            $(this).val(value.replace("-",""));
        }
    });

    $('input.number_value').keypress(function(event) {
        return isNumber(event, this);
    });
}

/**
 * Do custom action when data was imported
 * 
 * @param  {string} modal_id Modal ID
 * @param  {string} table_id Table ID
 * @param  {string} grid_id  Grid  ID
 */
function onImportFinished(modal_id, table_id, grid_id)
{
    if (table_id) {
        var table_scope = angular.element($("#"+table_id+" .datatable")).scope();
        table_scope.reloadDataTable();
    }
    
    closeModal(modal_id, grid_id);
}

/**
 * Check if entered character in input is number
 * 
 * @param  {[type]}  evt     [description]
 * @param  {[type]}  element [description]
 * @return {Boolean}         [description]
 */
function isNumber(evt, element) 
{
    var charCode = (evt.which) ? evt.which : event.keyCode

    if (
        (charCode != 45 || $(element).val().indexOf('-') != -1) &&      // “-” CHECK MINUS, AND ONLY ONE.
        (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}


/**
 * Common function to load documents block in modal from core
 * @param  {int} object_id   Object id
 * @param  {int} object_code Object code
 */
function loadDocuments(object_id, object_code, settings)
{
    var id = object_code.replace('/', '_')+'_'+ $.now();

    if (!settings) {
        settings = {};
    }
    
    settings.modal_id = id;

    var url = BASE_URL + '/core/coreapi/documents';
    var params = {
        object_id       : object_id,
        object_code     : object_code,
        can_upload      : (settings && settings.can_upload == true ? 1 : 0),
        only_one_file   : (settings && settings.only_one_file == true ? 1 : 0),
        can_delete      : (settings && settings.can_delete == true ? 1 : 0),
    };

    if (settings && settings.grid_id) {
        params.grid_id = settings.grid_id;
    }

    if (settings && settings.row_id) {
        params.row_id = settings.row_id;
    }

    if (settings && settings.height) {
        params.height = settings.height;
    }


    settings.cancel = false;

    settings.buttons = {
        cancel: {
            class: "md-raised mini-button md-button md-ink-ripple",
            title: "Uždaryti",
            attr: {
                "data-dismiss": "modal",
            },
            onclick: function(){
                if (typeof settings.cancel_callback == "function") {
                    settings.cancel_callback({modal_id: id});
                }
            },
            "icon": "fa fa-close",
        }
    };


    $('body').append('<div id="'+id+'"></div>');

    $('#'+id).loadinmodal(url, params, settings);
}
