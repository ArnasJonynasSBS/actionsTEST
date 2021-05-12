var excludedGrids = [];
var changes_params = {};
var need_to_notify = false;
var need_to_inform = false;
var is_saving = false;
var onmousedownValue = null;
var onmousemoveValue = null;
var already_selected = false;
var notify_user = '';
var position_recalculated = false;
var expandTimeout = null;
var expanded = true;
var grid_selected_rows_cache = {};
var GridsOnAfterValueChangedFunction = {};
var GridsOnValueChangedFunction = {};
var GridsSelectAll = {};

/*** INIT ***/
/**
 * 
 * @param {type} object
 * @returns {Boolean}
 */
function validateCode(object) {
    if (!(object instanceof $)) {
        object = $(object);
    }

    var result = object.val().replace(/([A-Za-ząčęėįšųūž0-9\s]*)/i, "");
    if ('' !== result) {
        $(object).addClass('fill-in');
        return false;
    }
    $(object).removeClass('fill-in');
    return true;
}

function addGridEvents()
{
    if (typeof(GetGrids) !== typeof(Function)){
        return false;
    }
    
    GetGrids();

    var rows_to_not_delete = {};
    
    if (!(typeof Grids.OnAfterValueChanged !== 'undefined' && $.isFunction(Grids.OnAfterValueChanged))) {
        Grids.OnAfterValueChanged = function(grid, row, col, val){
            if (typeof GridsOnAfterValueChangedFunction[grid.id] == 'function') {
                GridsOnAfterValueChangedFunction[grid.id](grid, row, col, val);
            }
        };
    }

     if (!(typeof Grids.OnValueChanged !== 'undefined' && $.isFunction(Grids.OnValueChanged))) {
        Grids.OnValueChanged = function(grid, row, col, val){
            if (typeof GridsOnValueChangedFunction[grid.id] == 'function') {
                return GridsOnValueChangedFunction[grid.id](grid, row, col, val);
            }

            return val;
        };
    }

    if (!(typeof Grids.OnRowDelete !== 'undefined' && $.isFunction(Grids.OnRowDelete))) {
        Grids.OnRowDelete = function(grid, row) {
            if (row.CanDelete === 0) {
                grid.SetAttribute(row, null, 'Deleted', 0, 1);

                if (row.parent_id && row.parent_id > 0) {
                    while (row.parentNode && row.parentNode.Kind == "Data") {
                        if ((typeof row.parentNode.CanDelete == "undefined" || row.parentNode.CanDelete === 1) && !rows_to_not_delete[row.parentNode.id]) {
                            rows_to_not_delete[row.parentNode.id] = row.parentNode;
                        }

                        row = row.parentNode;
                    }
                }
            }

            if ((grid.id == "task_work_grid" || grid.id == "task_material_grid") && row.Added) {
                grid.RemoveRow(row);
                if (typeof checkCanTransferForFactApproval == 'function') {
                    checkCanTransferForFactApproval();
                } 
            }
        };
    }

    if (!(typeof Grids.OnSave !== 'undefined' && $.isFunction(Grids.OnSave))) {
        Grids.OnSave = function(grid)  {
            if(!is_saving) {

                var gridId = grid.id;
                gridId = gridId.split("_", 2);

                if(gridId == 'user,substitution') {
                    is_saving = true;

                    var saveButtons = document.getElementsByClassName(' GSCellSpaceButton GSToolSave GSEmpty');

                    for (var i = 0; i < saveButtons.length; i++) {
                        onmousedownValue = saveButtons[i].getAttribute('onmousedown');
                        onmousemoveValue = saveButtons[i].getAttribute('onmousemove');

                        saveButtons[i].removeAttribute('onmousedown');
                        saveButtons[i].removeAttribute('onmousemove');
                    }
                    
                    grid.Disable();
                }

                if ($('.ui-pnotify-container.alert-info').length == 0) {
                    showMessage(_TRANSLATIONS.SAVING, "info-message");
                }
                
                for (i in rows_to_not_delete) {
                    var row = rows_to_not_delete[i];

                    grid.SetAttribute(row, null, 'Deleted', 0, 1);
                    grid.AcceptChanges(row);
                }

                rows_to_not_delete = {};
            }
        }
    }

    if (!(typeof Grids.OnTip !== 'undefined' && $.isFunction(Grids.OnTip))) {
        Grids.OnTip = function(grid, row, col, tip) {
            var grid_id = grid.id;
            if ((
                    (grid_id.search("billing-project-billing-grid-") >= 0) || 
                    (grid_id == "material_order_list") ||
                    (grid_id == "equipment_order_list")
                ) 
                && (col == 'Panel') && (tip == 'COMMENT_COMMENTS')) {
                return row.comment;
            }else{
                return tip;
            }
        }
    }

    if (!(typeof Grids.OnDataSend !== 'undefined' && $.isFunction(Grids.OnDataSend))) {
        Grids.OnDataSend = function(grid, source, data, hideLoader) {
            showLoader();
        };
    }

    if (!(typeof Grids.OnRenderPageFinish !== 'undefined' && $.isFunction(Grids.OnRenderPageFinish))) {
        Grids.OnRenderPageFinish = function(grid, source) {
            hideLoader();
        };
    }

    if (!(typeof Grids.OnFilterFinish !== 'undefined' && $.isFunction(Grids.OnFilterFinish))) {
        Grids.OnFilterFinish = function(grid, source) {
            hideLoader();
        };
    }

    if (!(typeof Grids.OnReady  !== 'undefined' && $.isFunction(Grids.OnReady))) {
        Grids.OnReady = function(grid, source) {
            hideLoader();
            clearGridCacheSelectedRows(grid);
            delete GridsSelectAll[grid.id];
        };
    }

    if (!(typeof Grids.OnRowAdd  !== 'undefined' && $.isFunction(Grids.OnRowAdd))) {
        Grids.OnRowAdd = function(grid, row) {
            if (grid.id == "production_project_part_grid" || grid.id == "production_project_part_grid_popup") {
                grid.Focus(row, 'name', null, true);
                grid.StartEdit();
            }else if(grid.id == "production_project_gantt"){
                if (typeof ganttGridRowAdd == 'function') {
                    ganttGridRowAdd(grid, row);
                }
            }
        }
    }

    if (!(typeof Grids.OnDataGet !== 'undefined' && $.isFunction(Grids.OnDataGet))) {
        /**
         *Used to handle session timout
         * @param {type} grid
         * @param {type} source
         * @param {type} data
         * @param {type} IO
         * @returns {undefined}
         */
        Grids.OnDataGet = function(grid, source, data, IO) {
            // if filter button exists and its attribute is disabled, then remove these attribute
            if ($('#filter_button').attr('disabled')) {
                $('#filter_button').removeAttr('disabled');
            }

            hideLoader();
                        
            if (IO.user_logged_out === '1') {
                if (IO.callback_function === 'window.location') {
                    window.location.replace(IO.location);
                } else {
                    window.location.reload();
                }
            }
            if (IO.sequencecard_operaction_deleted) {
                $('#operation-edit-container').html('');
            }
        };
    }

    if (!(typeof Grids.OnShowMessage !== 'undefined' && $.isFunction(Grids.OnShowMessage))) {
        Grids.OnShowMessage = function(grid, message) {
            hideLoader();
        };
    }

    if (!(typeof Grids.OnRenderFinish !== 'undefined' && $.isFunction(Grids.OnRenderFinish))) {
        Grids.OnRenderFinish = function(Grid) {
            hideLoader();
            if (Grid.id === $('#gantt_id').val()) {
                var F = Grid.GetRows(Grid.Foot);
                for (var i = 0; i < F.length; i++) {
                    if (LoadCache('gantt_resource_use_state') === '1') {
                        Grid.ShowRow(F[i]);
                    } else {
                        Grid.HideRow(F[i]);
                    }
                }
            }
        };
    }

    if (!(typeof Grids.OnRowMove !== 'undefined' && $.isFunction(Grids.OnRowMove))) {
        Grids.OnRowMove = function(grid, row, old_parent, old_next) {
            if(grid.id == "production_project_gantt"){
                if (typeof ganttGridRowMove == 'function') {
                    ganttGridRowMove(grid, row, old_parent);
                }
            }else{
                recalculatePositions(grid, row, true);
            }
        }
    }

    if (!(typeof Grids.OnDeleteAll !== 'undefined' && $.isFunction(Grids.OnDeleteAll))) {
        var grid_delete_clicks = {};

        Grids.OnDeleteAll = function(grid, type) {
            if (typeof grid_delete_clicks[grid.id] == "undefined") {
                grid_delete_clicks[grid.id] = 0;
            }
            // count number of clicks on delete button
            grid_delete_clicks[grid.id]++;
            var rows = grid.Rows;

            for (var rid in rows) {
                var r = grid.GetRowById(rid);
                if (r.Kind == 'Data' && r.Fixed != 'Foot') {
                    // if number of clicks on delete button is not ewen, then undelete rows
                    if (grid_delete_clicks[grid.id] % 2 == 0) {
                        grid.SetValue(r, 'Deleted', false, 1);
                        grid.SetValue(r, 'Changed', 0, 1);
                    } else {
                    // if number of clicks on delete button is ewen, then check all rows to delete
                        grid.SetValue(r, 'Deleted', true, 1);
                        grid.SetValue(r, 'Changed', 1, 1);                    
                    }
                }
            }
        }
    }

    if (!(typeof Grids.OnChange !== 'undefined' && $.isFunction(Grids.OnChange))) {
        Grids.OnChange = function(grid, row, col, event) {
            if (grid.id == "production_project_part_grid" || grid.id == "production_project_part_grid_popup") {
                setTimeout(function(){
                    if (position_recalculated) {
                        position_recalculated = false;
                        grid.Save();
                    };
                }, 100);
            } else if (grid.id == "task_work_grid" || grid.id == "task_material_grid") {
                if (col == "contractor_fact_qty" || col == "contractor_fact_suma") {
                    setTimeout(function(){
                        if (col == "contractor_fact_suma") {
                            if(row.contractor_fact_sumaChanged == 1){
                                grid.SetValue(row, "contractor_fact_suma_changed", 1, 1);
                                grid.SetValue(row, "final_fact_suma", row.contractor_fact_suma, 1);
                            } else { 
                                grid.SetValue(row, "contractor_fact_suma_changed",  0, 1); 
                                grid.SetValue(row, "final_fact_suma", row.final_fact_sumaOrig, 1); 
                            }
                        } else if (col == "contractor_fact_qty") {
                            if(row.contractor_fact_qtyChanged == 1){
                                grid.SetValue(row, "contractor_fact_qty_changed", 1, 1);
                                grid.SetValue(row, "contractor_fact_qty", roundNumber(row.contractor_fact_qty,3), 1);


                                grid.SetValue(row, "final_fact_qty", roundNumber(row.contractor_fact_qty,3), 1);
                                grid.SetValue(row, "final_fact_suma", roundNumber(row.contractor_fact_qty,3)*row.unit_price, 1)
                            } else { 
                                grid.SetValue(row, "contractor_fact_qty_changed", 0, 1);
                                grid.SetValue(row, "final_fact_qty", row.final_fact_qtyOrig, 1);
                                grid.SetValue(row, "final_fact_suma", row.final_fact_sumaOrig, 1)
                            }
                        }


                        if (typeof checkCanTransferForFactApproval == 'function') {
                            checkCanTransferForFactApproval();
                        }
                    }, 100);
                }

                if (typeof checkCanTariffSubmitToApprove == 'function') {
                    checkCanTariffSubmitToApprove(grid, row, col);
                }
            }
        }
    }

    if (!(typeof Grids.OnSelect !== 'undefined' && $.isFunction(Grids.OnSelect))) {
        Grids.OnSelect = function(grid, row, deselect) {
            GridsSelectAll[grid.id] = false;

            if(deselect){
                removeGridCacheSelectedRow(grid, row);
            }else{
                addGridCacheSelectedRow(grid, row);
            }

            if (grid.id == "production_project_part_grid_popup") {
                var rows = grid.Rows;
                for (var rid in rows) {
                    var r = grid.GetRowById(rid);
                    if ('Data' === r.Kind) {
                        grid.SetAttribute(r, null, 'Selected', 0, 1);

                        if (1 === deselect) {
                            grid.SetAttribute(r, null, 'CanSelect', 1, 1);
                        } else if (row.id != r.id) {
                            grid.SetAttribute(r, null, 'CanSelect', 0, 1);
                        }
                    }
                }
            } else if (grid.id == "file_type_grid") {
                $('#categories-dialog').dialog("close");
                $('#file_type_static').val(row.id);
                $('#file_type_name').text(row.name);
                grid.DeselectAll();
            } else if (grid.id == 'resource_tgrid') {
                var rows = grid.Rows;
                if (3 === row.type) {
                    // Outsider selected
                    for (var rid in rows) {
                        if (!isNaN(rid)) {
                            var r = grid.GetRowById(rid);
                            if ('Data' === r.Kind) {
                                if (1 === deselect) {
                                    // If deselected
                                    $.taskObject.task_data.resources_company_id = null;
                                    grid.ShowRow(r);
                                    grid.task.task_data.is_resource_outsider = false;
                                    grid.task.task_data.recalculate_time = true;
                                    grid.task.clearContactPersons();
                                } else {
                                    grid.task.task_data.is_resource_outsider = true;
                                    if ('company/company' === row.object_code) {
                                        $.taskObject.task_data.resources_company_id = row.object_id;
                                    }
                                    grid.task.task_data.recalculate_time = false;
                                    if (r.id !== row.id) {
                                        grid.HideRow(r);
                                    }
                                }
                            }
                        }
                    }
                } else {
                    grid.task.clearContactPersons();
                    grid.task.task_data.is_resource_outsider = false;
                    grid.task.task_data.recalculate_time = true;
                    var selected_rows = grid.GetSelRows();
                    for (var rid in rows) {
                        if (!isNaN(rid)) {
                            var r = grid.GetRowById(rid);
                            if ('Data' === r.Kind) {
                                if (1 === deselect) {
                                    if (selected_rows.length <= 1) {
                                        // If deselected
                                        grid.ShowRow(r);
                                    }
                                } else {
                                    $.taskObject.task_data.resources_company_id = null;
                                    if (3 === parseInt(r.type, 10)) {
                                        grid.HideRow(r);
                                    }
                                }
                            }
                        }
                    }
                }
            } else if($.inArray(grid.id, excludedGrids) == -1) {
                // Set selected current row
                grid.SetValue(row, 'selected', !deselect, 1);
                //grid.SetValue(row, 'Changed', 0, 1);

                if (!deselect) {
                    selectAllParents(grid, row.parentNode, deselect);
                } else {
                    deselectAllParentsWithCheck(grid, row.parentNode);
                }


                // Select All childs
                selectAllChilds(grid, row.firstChild, deselect);
                selectedSequance(grid, row, deselect);
            }

            if (grid.id == "work_estimate_grid") {
                var params = {
                    colException: ['is_main'],
                    defName: ['Task', 'TaskNoSides']
                };
                checkAllColumns(grid, row, deselect, params);
            }
        }
    }

    if (!(typeof Grids.OnSelectAll !== 'undefined' && $.isFunction(Grids.OnSelectAll))) {
        Grids.OnSelectAll = function(grid, select) {
            if (typeof GridsSelectAll[grid.id] == "undefined") {
                GridsSelectAll[grid.id] = true;
            }

            selectAllChilds(grid, grid.GetFirst(), !GridsSelectAll[grid.id]);

            GridsSelectAll[grid.id] = !GridsSelectAll[grid.id];

            return true;
        }
            
    }

    function selectAllChilds(grid, row, deselect) {
        if (row && (typeof row.CanSelect == "undefined" || row.CanSelect != 0)) {
            while (row && row.Kind == "Data") {
                if (row.firstChild) {
                    selectAllChilds(grid, row.firstChild, deselect);
                }

                grid.SetValue(row, 'selected', !deselect, 1);
                //grid.SetValue(row, 'Changed', 0, 1);

                row = row.nextSibling;
            }
        }
    }

    function selectAllParents(grid, row, deselect)
    {
        if (row.Kind == "Data") {
            if (row.parentNode) {
                selectAllParents(grid, row.parentNode, deselect);
            }

            grid.SetValue(row, 'selected', !deselect, 1);
            grid.SetValue(row, 'Changed', 0, 1);
        }
    }
    
    function deselectAllParentsWithCheck(grid, row)
    {
        if (row.Kind == "Data") {

            var parentChild = row.firstChild;
            var hasSelected = false;
            
            while (parentChild && parentChild.Kind == "Data") {
                if (parentChild.selected == 1) {
                    hasSelected = true;
                    break;
                }

                parentChild = parentChild.nextSibling;
            }

            if (!hasSelected) {
                grid.SetValue(row, 'selected', 0, 1);
                grid.SetValue(row, 'Changed', 0, 1);
                
                if (row.parentNode) {
                    deselectAllParentsWithCheck(grid, row.parentNode);
                }
            }
            
        }
    }

    if (!(typeof Grids.OnExpand !== 'undefined' && $.isFunction(Grids.OnExpand))) {
        Grids.OnExpand = function(Grid, Row) {
            expanded = false;

            if (expandTimeout){
                clearTimeout(expandTimeout);
                expandTimeout = null;
            }

            expandTimeout = setTimeout(function () {
                Grids.OnExpandAllFinish(Grid, Row);
            }, 1000);
        }
    }

    if (!(typeof Grids.OnExpandAllFinish !== 'undefined' && $.isFunction(Grids.OnExpandAllFinish))) {
        Grids.OnExpandAllFinish = function(Grid, Row) {
            expanded = true;
        }
    }

    if (!(typeof Grids.OnClickPanelSelect !== 'undefined' && $.isFunction(Grids.OnClickPanelSelect))) {
        Grids.OnClickPanelSelect = function(Grid){
            if (Grid.id == "materialmaterial_order" || Grid.id == "sale_estimate_grid") {
                checkSelected(Grid);
            }
        }
    }

    if (!(typeof Grids.OnClickHeaderSelect !== 'undefined' && $.isFunction(Grids.OnClickHeaderSelect))) {
        Grids.OnClickHeaderSelect = function(Grid){
            if (Grid.id == "materialmaterial_order" || Grid.id == "sale_estimate_grid") {
                checkSelected(Grid);
            }
        }
    }
}

function addGridCacheSelectedRow(grid, row){
    if (typeof grid_selected_rows_cache[grid.id] == 'undefined') {
        clearGridCacheSelectedRows(grid);
    }

    grid_selected_rows_cache[grid.id][row.id] = row;
}

function removeGridCacheSelectedRow(grid, row){
    delete grid_selected_rows_cache[grid.id][row.id];
}

function getGridCacheSelectedRows(grid){
    if (grid && grid.hasOwnProperty("id")) {
        return $.map(grid_selected_rows_cache[grid.id], function(value, index) {
            return [value];
        });
    }
}

function clearGridCacheSelectedRows(grid){
    grid_selected_rows_cache[grid.id] = {};
}

/*
 * Call close TGrid pop ups bind function on window load finish
 * 
 */
$(document).ready(function() {
    closeTgridPopups();
    addGridEvents();

    if (history.state && history.state.tab_id) {
        $('#'+history.state.tab_id).trigger('click');
    }
});

function prepareDatePicker(class_string, drops_position) {
    var settings = {
        "singleDatePicker": true,
        "drops": (drops_position && drops_position == 'down' ? 'down' : 'up'),
        "autoUpdateInput": false,
        locale: {
            "format": "YYYY-MM-DD",
            firstDay: 1,
            "daysOfWeek": [
                "Sk",
                "Pr",
                "An",
                "Tr",
                "Kt",
                "Pn",
                "Št"
            ],
            "monthNames": [
                "Sausis",
                "Vasaris",
                "Kovas",
                "Balandis",
                "Gegužė",
                "Birželis",
                "Liepa",
                "Rugpjūtis",
                "Rugsėjis",
                "Spalis",
                "Lapkritis",
                "Gruodis"
            ],
        },
    };

    if (class_string) {
        class_string = '.'+class_string;
    } else {
        class_string = '.date';
    }
    
    
    $(class_string).not('.has-datepicker').daterangepicker(settings);
    $(class_string+'.no-value').not('.has-datepicker').val('');

    $(class_string).not('.has-datepicker').addClass('has-datepicker');

    $(class_string).on('apply.daterangepicker', function(ev, picker) {
        if (picker.startDate.format('YYYY-MM-DD') != $(this).val()) {
            $(this).parents('form').first().change();
        }

        $(this).val(picker.startDate.format('YYYY-MM-DD'));
        $(this).attr('value', picker.startDate.format('YYYY-MM-DD'));
    });
}

function roundNumber ( a, b ) {
    var tmp1 = "e".concat(b+1);
    var tmp2 = "e-".concat(b+1);
    var tmp3 = "e".concat(b);
    var tmp4 = "e-".concat(b);
    a = Number(Math.round(a+tmp1)+tmp2);
    a =  Number(Math.round(a+tmp3)+tmp4);
    return a;
}

/**
 * Close all TGrids dialog (menus, etc) when tabs is clicking
 * Ends row edit mode
 **/
function closeTgridMenus() {
    for (var i in GetGrids()) {
        var G = Grids[i];
        console.log(G);
        if ((typeof G) !== 'undefined' && G !== null && G !== false) {
            G.CloseDialog();
            G.EndEdit(0);
        }
    }
}

function deleteGridsOnClose(grid_ids)
{
    for (var i in Grids) {
        var G = Grids[i];

        if (parseInt(i) >= 0) {
            delete Grids[i];
        }
    }
}

/**
 * Close all TGrids dialog (menus, etc) when tabs is clicking
 * Ends row edit mode
 **/
function closeTgridPopups() {
    $('div#tabs ul li a').bind('click', function() {
        for (var i in GetGrids()) {
            var G = Grids[i];
            if ((typeof G) !== 'undefined' && G !== null && G !== false) {
                G.CloseDialog();
                G.EndEdit(0);
            }
        }
    });
    $('div.sub-tab').bind('click', function() {
        for (var i in GetGrids()) {
            var G = Grids[i];
            if ((typeof G) !== 'undefined' && G !== null && G !== false) {
                G.CloseDialog();
                G.EndEdit(0);
            }
        }
    });
}
function isPositiveInteger(value) {
    if ((parseFloat(value) === parseInt(value)) && !isNaN(value) && value >= 0) {
        return true;
    } else {
        return false;
    }
}

function isInteger(value) {
    if ((parseFloat(value) === parseInt(value)) && !isNaN(value)) {
        return true;
    } else {
        return false;
    }
}

function disableAllGrids() {
    for (var i in GetGrids()) {
        var G = Grids[i];
        if ((typeof G) !== 'undefined' && G !== null && G !== false) {
            G.Disable();
        }
    }
}

function enableAllGrids() {
    for (var i in GetGrids()) {
        var G = Grids[i];
        if ((typeof G) !== 'undefined' && G !== null && G !== false) {
            G.Enable();
        }
    }
}

function destroyDialog(dialog, G, reload, reload_after_log_work, keep_dialog_html, keep_content) {
    if (!keep_content) {
        dialog.html('');
    }
    
    if (dialog.is(':data(uiDialog)')) {
        dialog.dialog('destroy');
    }
    if ((typeof G) !== 'undefined' && G !== null && G !== '') {
        G.Enable();
        if ((typeof reload) !== 'undefined' && reload === 1) {
            showLoader();
            G.Reload();
            if ((typeof reload_after_log_work) === 'undefined' || reload_after_log_work !== 0) {
                updateProjectTaskListGridAndGantt(G);
            }
        } else {
            hideLoader();
        }
    } else {
        hideLoader();
        var G = Grids.Active;
        if ((typeof G) !== 'undefined' && G !== null) {
            G.Enable();
        }

    }
    dialog.parent().removeClass('ui-widget-content');

    if (!keep_dialog_html) {
        dialog.remove();
    }

    $(document).trigger('dialog_destroyed');
}

function validateStringLagTime(input) {
    var timespent = $.trim($(input).val());
    var validated = $.trim(timespent.replace(/(\+|-)?(([0-9]+(h|(min))$)+)|(([0-9]+(h))+(\s)*([0-9]+(min)$)+)|([0-9]+(h|(min))$)+/g, ""));

    var valid = validated.length === 0 || $.trim(timespent.toUpperCase()) === '0h' || $.trim(timespent.toUpperCase()) === '0min' || $.trim(timespent.toUpperCase()) === '0h 0min' || timespent === 0;

    if (!valid) {
        $(input).addClass('fill-in');
    } else {
        $(input).removeClass('fill-in');
    }

    return valid;
}

function validateStringTime(input) {
    var timespent = $.trim($(input).val().toUpperCase());
    var validated = $.trim(timespent.replace(/(([0-9]+(h|(min))$)+)|(([0-9]+(h))+(\s)*([0-9]+(min)$)+)|([0-9]+(h|(min))$)+/i, ""));
    var valid = validated.length === 0 || $.trim(timespent.toUpperCase()) === '0H' || $.trim(timespent.toUpperCase()) === '0MIN' || $.trim(timespent.toUpperCase()) === '0H 0MIN' || timespent === 0;

    if (!valid) {
        $(input).addClass('fill-in');
    } else {
        $(input).removeClass('fill-in');
    }

    return valid;
}

$(document).ready(function() {

    if (typeof (_TRANSLATIONS) === 'undefined') {
        alert('Nerastas vertimų failas!!!');
        return false;
    }

    $('#login_box_trigger').click(login_box_expand);
    $('#login_box_trigger').click(login_box_showhide);
    $('#login-box .services[id!=active_user]').hide();

    $('#login-box')
            .bind('mouseover', function() {
                $('table.login').show();
                $(this).find('.services').show();
            }).bind('mouseout', function() {
        $('.services[id!=active_user]').hide();
        $('table.login').hide();
    });
    $('.block-sales-order-new .choice').hover(function() {
        $(this).addClass('hover');
    }, function() {
        $(this).removeClass('hover');
    });
    $('.block-sales-order-new #step12 input[type=text]').keyup(function() {
        plates_next_char($(this).attr('id').substr(10));
    });
    /** date picker **/
    $(function() {
/*        $("#date_from").on('click', function() {
            $(this).datepicker({
                showOn: 'focus'
            }).focus();
        });

        $("#date_until").on('click', function() {
            $(this).datepicker({
                showOn: 'focus'
            }).focus();
        });

        $("input.date-picker").on('click', function() {
            $(this).datepicker({
                showOn: 'focus'
            }).focus();
        });*/

/*        if ((typeof $("input.datetime-picker").datetimepicker) === 'function') {
            $("input.datetime-picker").datetimepicker({
                dateFormat: 'yy-mm-dd',
                hourGrid: 4,
                minuteGrid: 10
            });
        }
        $("input.time-picker").on('click', function() {
            $(this).timeEntry({
                show24Hours: true,
                showSeconds: false
            }).focus();
        });*/
    });

    $('ul.tree li:last-child').addClass('last');
    initToggler();

});

function initToggler() {
    $('.toggler').unbind().on('click', function() {
        $(this).parent().find('ul:first').toggle();
        if ($(this).hasClass('expanded')) {
            $(this).removeClass('expanded').addClass('expand');
        } else {
            $(this).removeClass('expand').addClass('expanded');
        }
        return false;
    });
}
/*** DEBUG ***/
function clog() {
    if (console) {
        if (arguments.length > 1) {
            console.log(arguments);
        }
        else if (arguments.length === 1) {
            console.log(arguments[0]);
        }
        else {
            console.log(new Date());
        }
    }
}

function login_box_showhide() {
    showHideBox($('#login_box'));
    return false;
}

function login_box_expand() {
    $('#login_box').slideDown();
    $('#login_box_trigger').unbind('click', login_box_expand).bind('click', login_box_collapse);
    return false;
}
function login_box_collapse() {
    $('#login_box').slideUp();
    $('#login_box_trigger').unbind('click', login_box_collapse).bind('click', login_box_expand);
    return false;
}

function logout_showhide() {
    showHideBox($('#user_logout'));
}

function quickFindOrder() {
    showHideBox($('#quick_find_order'));
}

function showHideBox($box) {
    if ($box.hasClass('hidden')) {
        $box.slideDown('slow', function() {
            $box.removeClass('hidden');
        });
    }
    else {
        $box.slideUp('slow', function() {
            $box.addClass('hidden');
        });
    }
}

function nextStep(step) {
    if ($('#step' + step).length > 0)
        $('#step' + step).fadeOut(200, function() {
            $('#step' + (step + 1)).fadeIn(200);
        });
    else
        $('#step' + 1).fadeOut(200, function() {
            $('#step' + (step + 1)).fadeIn(200);
        });
    return false;
}

function resetStep(step) {
    $('#step' + step).fadeOut(200, function() {
        $('#step1').fadeIn(200);
    });
    return false;
}

function order_shipping() {
    $('.block-sales-order-new .step').fadeOut(200, function() {
        $('.block-sales-order-new #shipping_trigger').hide();
        $('.block-sales-order-new #money, .block-sales-order-new #shipping, .block-sales-order-new #customer').fadeIn(200);
    });
    recalcTotals();
}

function order_wizard() {
    $('.block-sales-order-new #money, .block-sales-order-new #shipping, .block-sales-order-new #customer').fadeOut(200, function() {
        $('.block-sales-order-new #shipping_trigger').show();
        $('.block-sales-order-new div.step').fadeIn(200);
        $('.block-sales-order-new .step1, .block-sales-order-new h2.step, .block-sales-order-new #custom').fadeIn(200);
    });
}

function business_customer(field) {
    if (field.checked) {
        $('tr.business').fadeIn();
    }
    else {
        $('tr.business').fadeOut();
    }
}

function invoice_add_line() {
    var $tr = $('#invoiceForm #InvoiceContent tr.datarow:last').clone();
    var num = parseInt($tr.attr('id').substr(4)) + 1;
    $tr.attr('id', 'row-' + num);
    $tr.find('input, textarea').each(function() {
        if ($(this).attr('name').indexOf('[type]') < 0)
            $(this).attr('name', $(this).attr('name').split('[' + (num - 1) + ']').join('[' + num + ']')).val('');
        else
            $(this).attr('name', $(this).attr('name').split('[' + (num - 1) + ']').join('[' + num + ']'));

        if ($(this).attr('name').indexOf('[qty]') > 0)
            $(this).val('1');
        if ($(this).attr('name').indexOf('[unit]') > 0)
            $(this).val('vnt.');
    });
    $tr.find('.row-sum span').text('0.00');
    $tr.insertAfter($('#invoiceForm #InvoiceContent tr.datarow:last'));
}

function update_invoice_row(elem) {
    var $row = $(elem).closest('tr');
    $row.find('input').removeClass('error');
    var sum = $row.find('input.row-qty').val() * $row.find('input.row-prc').val();
    if (isNaN(sum)) {
        if (isNaN($row.find('input.row-qty').val()))
            $row.find('input.row-qty').addClass('error');
        if (isNaN($row.find('input.row-prc').val()))
            $row.find('input.row-prc').addClass('error');
        $row.find('.row-sum span').text('0.00');
    }
    else
        $row.find('.row-sum span').text(Number(sum).toFixed(2));
    update_invoice_totals();
}

function update_invoice_totals() {
    var sum = 0;
    $('#InvoiceContent td.row-sum span').each(function() {
        sum += Number($(this).text());
    });
    $('#totalExclVat span').text(sum.toFixed(2));
    $('#totalVat span').text(Number(sum * Number(VAT_RATE) / 100).toFixed(2));
    $('#totalInclVat span').text(Number(sum * (1 + Number(VAT_RATE) / 100)).toFixed(2));
}

function add_more_attachments() {
    var $obj = $('#tpl').clone().attr('id', '').insertAfter($('<br />').insertAfter($('.tpl:last')));
    $obj = $obj.find('input:button');
    $obj.attr('id', 'file_' + ($('input.file').length - 1));
    uploaders[uploaders.length] = new AjaxUpload('#' + $obj.attr('id'), {
        autoSubmit: false,
        name: 'file',
        data: {
            index: $('input.file').length - 1
        },
        action: BASE_URL + 'order/ajax/upload',
        onComplete: uploadComplete,
        onChange: uploaderChange
    });
    $obj.prev().val('');
}

function producer_show_line(elem) {
    $(elem).hide().parent().parent().find('td:first').next().find('table').show();
}

function plates_next_char(curPos) {
    var $curItem = $('#item_text_' + curPos);
    if ($curItem.val().length > 1) {
        var nextChar = $curItem.val().charAt(1);
        $curItem.val($curItem.val().charAt(0));
        $curItem.next().val(nextChar).next().focus();
    }
    else if ($curItem.val().length === 0) {
        return false;
    }
    else {
        $curItem.next().focus();
    }
}

/***************************************************************/

function showLoader() {
    var $loader = $('#ajaxLoader');

    $loader.show();
    $('#ajaxLoaderAnimation').show();
}


function hideLoader() {
    $('#ajaxLoader').hide();
    $('#ajaxLoaderAnimation').hide();
}

function selectorNextStep(type, id) {
    showLoader();
    $('#selectorStep').load(BASE_URL + 'order/ajax/selectorNextStep', {
        node_type: type,
        node_id: id
    }, hideLoader);
}

function selectorPartnerNextStep(type, id) {
    showLoader();
    $('#selectorStep').load(BASE_URL + 'partner/ajax/selectorNextStep', {
        node_type: type,
        node_id: id
    }, hideLoader);
}

var uploadedFiles = new Array();
var addingToBasketId = 0;
var addingToPartnerBasketId = 0;

function addToBasket(id, skipcheck) {
    if (typeof skipcheck === 'undefined')
        skipcheck = false;
    var desc = $("textarea[name='description']").val();
    var qty = $("input[name='qty']").val();

    if (!skipcheck && swfu.getStats().files_queued) {
        addingToBasketId = id;
        //uploadNext();
        swfu.startUpload();
        return false;
    }
    addingToBasketId = 0;

    var files = uploadedFiles.join(':');
    uploadedFiles = new Array();

    showLoader();
    $('#order_sales_basket').load(BASE_URL + 'order/ajax/addToBasket', {
        id: id,
        qty: qty,
        description: desc,
        files: files
    }, function() {
        selectorNextStep('', '');
    });
}

function addToPartnerBasket(id, skipcheck) {
    if (typeof skipcheck === 'undefined')
        skipcheck = false;
    var desc = $("textarea[name='description']").val();
    var qty = $("input[name='qty']").val();

    if (!skipcheck && swfu.getStats().files_queued) {
        addingToPartnerBasketId = id;
        //uploadNext();
        swfu.startUpload();
        return false;
    }
    addingToPartnerBasketId = 0;

    var files = uploadedFiles.join(':');
    uploadedFiles = new Array();

    showLoader();
    $('#order_sales_basket').load(BASE_URL + 'partner/ajax/addToBasket', {
        id: id,
        qty: qty,
        description: desc,
        files: files
    }, function() {
        selectorPartnerNextStep('', '');
    });
}

function addToOrder(id, skipcheck) {

    if (typeof skipcheck === 'undefined')
        skipcheck = false;
    var desc = $("textarea[name='description']").val();
    var qty = $("input[name='qty']").val();
    var discount = $("select[name='discount']").val();

    if (!skipcheck) {
        addingToBasketId = id;
        uploadNext();
        return false;
    }
    addingToBasketId = 0;

    var files = uploadedFiles.join(':');
    uploadedFiles = new Array();

    showLoader();
    $('#uploaded_files').val(files);
    $('#new_product_fieldset').load(BASE_URL + 'order/ajax/addtoorder', $('#new_product_form').serialize(), function() {
        selectorNextStep('', '');
        window.location.reload();
    });

}

function updateDiscount(index, value, changePercentage) {
    if (!isNaN(value)) {
        if (typeof updateDiscountTimeout === 'undefined')
            updateDiscountTimeout = new Array();
        if (typeof (updateDiscountTimeout[index]) !== 'undefined')
            clearTimeout(updateDiscountTimeout[index]);
        if (changePercentage) {
            updateDiscountTimeout[index] = setTimeout("$.post('" + BASE_URL + "order/ajax/updateItemDiscount', 'index=" + index + "&discount_percentage=" + value + "', function(sum){ $('tr#row_" + index + " td.center:last').text(sum); recalcTotals(); })", 250);
        }
        else {
            updateDiscountTimeout[index] = setTimeout("$.post('" + BASE_URL + "order/ajax/updateItemDiscount', 'index=" + index + "&discount_id=" + value + "', function(sum){ $('tr#row_" + index + " td.center:last').text(sum); recalcTotals(); })", 250);
        }
    }
}

function removeFromBasket(index) {
    showLoader();
    $('#order_sales_basket').load(BASE_URL + 'order/ajax/removeFromBasket', {
        index: index
    }, hideLoader);
}

function removeFromPartnerBasket(index) {
    showLoader();
    $('#order_sales_basket').load(BASE_URL + 'partner/ajax/removeFromBasket', {
        index: index
    }, hideLoader);
}

function findCustomer() {
    $.getJSON(BASE_URL + 'order/ajax/findcustomer/code/' + $('#order_customer_code').val(), '', loadCustomer);
}

function loadCustomer(data) {
    if (typeof data.customer !== 'undefined') {
        var cust = data.customer;
        $('#order_customer_firstname').val(cust.first_name);
        $('#order_customer_lastname').val(cust.last_name);
        $('#order_customer_phone').val(cust.phone);
        $('#order_customer_email').val(cust.email);
        $('#order_customer_business').attr('checked', (cust.company_id > 0)).change();
    }
    loadCompany(data);
}

function findCompany() {
    $.getJSON(BASE_URL + 'order/ajax/findcompany/code/' + $('#order_customer_company_code').val(), '', loadCompany);
}

function loadCompany(data) {
    if (typeof data.company !== 'undefined') {
        var comp = data.company;
        $('#order_customer_company_code').val(comp.code);
        $('#order_customer_company_vatcode').val(comp.vat_code);
        $('#order_customer_company_name').val(comp.name);
        $('#order_customer_company_address_street').val(comp.street);
        $('#order_customer_company_address_postcode').val(comp.postcode);
        $('#order_customer_company_address_city').val(comp.city_id);
    }
}

function updateProductFields(select) {
    if ($(select).val() === 'standard')
        $('tr.standard').show();
    else
        $('tr.standard').hide();
    if ($(select).val() === 'plates')
        $('tr.plates').show();
    else
        $('tr.plates').hide();
    if ($(select).val() === 'canvas')
        $('tr.canvas').show();
    else
        $('tr.canvas').hide();
}

function changePlatesBackgroundColor(color) {
    var colorCode = '';
    switch (color) {
        case 'golden' :
            colorCode = 'goldenRod';
            break;
        case 'yellow' :
            colorCode = 'yellow';
            break;
        case 'blue' :
            colorCode = 'blue';
            break;
        case 'orange' :
            colorCode = 'orange';
            break;
        case 'purple' :
            colorCode = 'purple';
            break;
        case 'white' :
        default:
            colorCode = 'white';
            break;
    }
    $('#plates_text input.char').css('background-color', colorCode);
}

function changePlatesTextColor(color) {
    $('#plates_text').removeClass().addClass(color);
}

function changePlatesIcon(icon) {
    if (icon === '') {
        $('#plates_text #item_text_0').removeClass().addClass('char').attr('readonly', false);
    }
    else {
        switch (icon) {
            case 'LT' :
                className = 'icon-lt';
                break;
            case 'P' :
                className = 'icon-p';
                break;
            case 'ZAL' :
                className = 'icon-zal';
                break;
            case 'LRY' :
                className = 'icon-lry';
                break;
        }
        $('#plates_text #item_text_0').val('').attr('readonly', true).removeClass().addClass('char').addClass(className);
    }
}

var DragIcon = null;

function initDraggableIcons() {
    $('.imgNoBorder a img').each(function() {
        $(this).mousedown(function(e) {
            dragIcon = this;
            dragCopy = $(this).clone().css('position', 'absolute').attr('id', 'dragcopy').css({
                left: (e.pageX - 18) + 'px',
                top: (e.pageY - 18) + 'px'
            });
            $(document.body).append(dragCopy);
            $(document).mousemove(function(e) {
                dragCopy.css({
                    left: (e.pageX - 18) + 'px',
                    top: (e.pageY - 18) + 'px'
                });
            });
            enableDropping();
            return false;
        });
        $(this).click(function() {
            if (dragCopy)
                $('#dragcopy').mouseup();
        });
    });
    $('#plates_text input.char').click(function() {
        $this = $(this);
        if ($this.hasClass('clover') || $this.hasClass('playboy') || $this.hasClass('horseshoe') || $this.hasClass('truck') || $this.hasClass('heart')) {
            $this.removeClass().addClass('char').attr('readonly', false);
        }
    });
}

function enableDropping() {
    $('#plates_text input.char').mouseup(function() {
        if (trim($('select#item_icon').val()) === '' || $(this).attr('id') !== 'item_text_0') {
            $(this).removeClass().addClass('char').addClass($(dragIcon).attr('rel')).val('').attr('readonly', true);
        }
        disableDropping();
        dragIcon = null;
        dragCopy.remove();
        dragCopy = null;
    });
    $('#dragcopy').mouseup(function(e) {
        $('#plates_text input.char').each(function() {
            if ($(this).offset().left <= e.pageX && $(this).offset().left + $(this).width() >= e.pageX &&
                    $(this).offset().top <= e.pageY && $(this).offset().top + $(this).height() >= e.pageY) {
                $(this).mouseup();
            }
        });
        if (dragCopy) {
            dragCopy.remove();
            dragCopy = null;
            disableDropping();
        }
    });
    $(document.body).mouseup(function() {
        disableDropping();
        dragIcon = null;
    });
}

function disableDropping() {
    $('#plates_text input.char').unbind('mouseup');
    $(document.body).unbind('mouseup');
    $(document).unbind('mousemove');
}

function initializeCharValidation() {
    $('#plates_text .char').keyup(function(e) {
        if (e.keyCode === 0)
            e.keyCode = $(this).val().charCodeAt(0);
        if (e.keyCode === 37)
            $(this).prev().focus();
        if (e.keyCode === 39)
            $(this).next().focus();
        e.keyCode = $(this).val().charCodeAt(0);
        if ((e.keyCode < 'a'.charCodeAt(0) || e.keyCode > 'z'.charCodeAt(0)) && (e.keyCode < 'A'.charCodeAt(0) || e.keyCode > 'Z'.charCodeAt(0)) && (e.keyCode < '0'.charCodeAt(0) || e.keyCode > '9'.charCodeAt(0)) && 'ĄČĘĖĮŠŲŪŽąčęėįšųūž'.indexOf(String.fromCharCode(e.keyCode)) < 0) {
            $(this).val('');
            return false;
        }
        if ($(this).val().length > 1)
            $(this).val($(this).val().substr(0, 1));
        if ($(this).val().length === 1)
            $(this).next().focus();
    });
}

function serializePlates() {
    var res = new Array();
    $('#plates_text input.char').each(function() {
        var $this = $(this);
        $this.removeClass('char');
        var key = trim($this.attr('class'));
        $this.addClass('char');
        if (key !== '')
            res[res.length] = '[' + key + ']';
        else
            res[res.length] = $this.val();
    });
    var holderStr = ($('input[name=item\[holder\]]').attr('checked') ? '&holder=1' : '');
    return 'background=' + $('#item_color_bg').val() + '&color=' + $('#item_color_text').val() + '&text=' + res.join('|') + holderStr;
}

function addPlatesToBasket(id) {
    $('#order_sales_basket').load(BASE_URL + 'order/ajax/addPlatesToBasket', {
        id: id,
        data: serializePlates()
    }, function() {
        selectorNextStep('', '');
    });
}

function addPlatesToPartnerBasket(id) {
    $('#order_sales_basket').load(BASE_URL + 'partner/ajax/addPlatesToBasket', {
        id: id,
        data: serializePlates()
    }, function() {
        selectorPartnerNextStep('', '');
    });
}


var canvasId = null;
function addCanvasToBasket(id, file) {
    if (canvasId === null) {

        canvasId = id;

        swfu.startUpload();
        return;
    }

    $('#order_sales_basket').load(BASE_URL + 'order/ajax/addCanvasToBasket', {
        id: id,
        file: file,
        description: $("textarea[name='description']").val()
    }, function() {
        canvasId = null;
        selectorNextStep('', '');
    });
}

function addCanvasToPartnerBasket(id, file) {
    if (canvasId === null) {

        canvasId = id;

        swfu.startUpload();
        return;
    }

    $('#order_sales_basket').load(BASE_URL + 'partner/ajax/addCanvasToBasket', {
        id: id,
        file: file,
        description: $("textarea[name='description']").val()
    }, function() {
        canvasId = null;
        selectorPartnerNextStep('', '');
    });
}


function updateInitPrice(index, newPrice) {
    if (!isNaN(newPrice)) {
        $.post(BASE_URL + 'order/ajax/updateItemInitPrice', {
            index: index,
            price: newPrice
        }, function(sum) {
            $('tr#row_' + index + ' td.center:last').text(sum);
            $('#old_init_price_' + index).text(Number(newPrice).toFixed(2));
            recalcTotals();
        });
    }
    else
        clog(newPrice);
}

function recalcTotals() {
    if (typeof (TAX_RATE) === 'undefined' || isNaN(TAX_RATE))
        TAX_RATE = 0;
    if ($('#endprice_without_vat').length > 0) {
        var sum = 0;
        $('#order_sales_basket tr:not(.first)').each(function() {
            sum += Number($(this).find('td:nth(4)').text().split(' ')[0]);
        });
        $('#endprice_without_vat').text(Number(sum).toFixed(2));
        $('#endprice_with_vat').text(Number(sum * (1 + TAX_RATE / 100)).toFixed(2));
    }

}

function trim(str) {
    if (typeof ($.trim(str)) === 'function')
        return $.trim(str);
    else {
        while (str[0] === ' ')
            str = str.substr(1);
        while (str[str.length - 1] === ' ')
            str = str.substr(0, str.length - 1);
        return str;
    }
}

function preparePing() {
    setTimeout(function() {
        $.get(PING_URL, '', preparePing);
    }, PING_REFRESH * 10000);
}

function checkAllInvoices() {
    var flag = $('input[name=export_all]').attr('checked');
    $('input.export').attr('checked', flag);
}

function initSWFU() {
    swfu = new SWFUpload({
        upload_url: BASE_URL + "order/ajax/upload",
        flash_url: MEDIA_URL + "swfupload.swf",
        file_size_limit: "20 MB",
        file_post_name: "Filedata",
        button_placeholder_id: "file_0",
        button_image_url: SKIN_URL + "images/swfu_button.png",
        button_text: '<span class="btnText">Surasti</span>',
        button_text_style: ".btnText { font-size: 11px; font-family: Arial, Tahoma, Veradana; width: 120px; text-align: center; }",
        button_action: SWFUpload.BUTTON_ACTION.SELECT_FILES,
        button_width: 120,
        button_height: 19,
        debug: false,
        file_queued_handler: function(fObj) {
            $('#files').val($('#files').attr('type') === 'text' ? fObj.name : $('#files').val() + fObj.name + '\n');
        },
        file_queue_error_handler: function(fObj, code, msg) {
            if (code === SWFUpload.QUEUE_ERROR.FILE_EXCEEDS_SIZE_LIMIT)
                alert('Failas "' + fObj.name + '" nebuvo pridėtas nes viršija leistiną failo dydį');
            else if (code === SWFUpload.QUEUE_ERROR.ZERO_BYTE_FILE)
                alert('Failas "' + fObj.name + '" nebuvo pridėtas nes jis yra tuščias');
            else
                alert('Klaida ' + code + ': ' + msg);
        },
        upload_error_handler: function(fObj, code, msg) {
            alert('Įkeliant failą "' + fObj.name + '" įvyko klaida ' + code + ': ' + msg);
        },
        upload_success_handler: function(fObj, sData, response) {
            if (sData.substring(0, 5) !== 'ERROR')
                uploadedFiles[uploadedFiles.length] = sData;
            else
                alert(fObj.name + ': ' + sData.substring(7));
        },
        upload_complete_handler: function(fObj) {
            var i = 0;
            while (swfu.getFile(i) !== null) {
                if (swfu.getFile(i).filestatus === -1) {
                    swfu.startUpload();
                    return;
                }
                i++;
            }
            if (addingToBasketId > 0)
                addToBasket(addingToBasketId, true);
            if (addingToPartnerBasketId > 0)
                addToPartnerBasket(addingToPartnerBasketId, true);
        }
    });
}


function json_encode(mixed_val) {
    // http://kevin.vanzonneveld.net
    // +      original by: Public Domain (http://www.json.org/json2.js)
    // + reimplemented by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      improved by: Michael White
    // +      input by: felix
    // +      bugfixed by: Brett Zamir (http://brett-zamir.me)
    // *        example 1: json_encode(['e', {pluribus: 'unum'}]);
    // *        returns 1: '[\n    "e",\n    {\n    "pluribus": "unum"\n}\n]'
    /*
     http://www.JSON.org/json2.js
     2008-11-19
     Public Domain.
     NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.
     See http://www.JSON.org/js.html
     */
    var retVal, json = this.window.JSON;
    try {
        if (typeof json === 'object' && typeof json.stringify === 'function') {
            retVal = json.stringify(mixed_val); // Errors will not be caught here if our own equivalent to resource
            //  (an instance of PHPJS_Resource) is used
            if (retVal === undefined) {
                throw new SyntaxError('json_encode');
            }
            return retVal;
        }

        var value = mixed_val;

        var quote = function(string) {
            var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
            var meta = {// table of character substitutions
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };

            escapable.lastIndex = 0;
            return escapable.test(string) ? '"' + string.replace(escapable, function(a) {
                var c = meta[a];
                return typeof c === 'string' ? c : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' : '"' + string + '"';
        };

        var str = function(key, holder) {
            var gap = '';
            var indent = '    ';
            var i = 0; // The loop counter.
            var k = ''; // The member key.
            var v = ''; // The member value.
            var length = 0;
            var mind = gap;
            var partial = [];
            var value = holder[key];

            // If the value has a toJSON method, call it to obtain a replacement value.
            if (value && typeof value === 'object' && typeof value.toJSON === 'function') {
                value = value.toJSON(key);
            }

            // What happens next depends on the value's type.
            switch (typeof value) {
                case 'string':
                    return quote(value);

                case 'number':
                    // JSON numbers must be finite. Encode non-finite numbers as null.
                    return isFinite(value) ? String(value) : 'null';

                case 'boolean':
                case 'null':
                    // If the value is a boolean or null, convert it to a string. Note:
                    // typeof null does not produce 'null'. The case is included here in
                    // the remote chance that this gets fixed someday.
                    return String(value);

                case 'object':
                    // If the type is 'object', we might be dealing with an object or an array or
                    // null.
                    // Due to a specification blunder in ECMAScript, typeof null is 'object',
                    // so watch out for that case.
                    if (!value) {
                        return 'null';
                    }
                    if ((this.PHPJS_Resource && value instanceof this.PHPJS_Resource) || (window.PHPJS_Resource && value instanceof window.PHPJS_Resource)) {
                        throw new SyntaxError('json_encode');
                    }

                    // Make an array to hold the partial results of stringifying this object value.
                    gap += indent;
                    partial = [];

                    // Is the value an array?
                    if (Object.prototype.toString.apply(value) === '[object Array]') {
                        // The value is an array. Stringify every element. Use null as a placeholder
                        // for non-JSON values.
                        length = value.length;
                        for (i = 0; i < length; i += 1) {
                            partial[i] = str(i, value) || 'null';
                        }

                        // Join all of the elements together, separated with commas, and wrap them in
                        // brackets.
                        v = partial.length === 0 ? '[]' : gap ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']' : '[' + partial.join(',') + ']';
                        gap = mind;
                        return v;
                    }

                    // Iterate through all of the keys in the object.
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }

                    // Join all of the member texts together, separated with commas,
                    // and wrap them in braces.
                    v = partial.length === 0 ? '{}' : gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}' : '{' + partial.join(',') + '}';
                    gap = mind;
                    return v;
                case 'undefined':
                    // Fall-through
                case 'function':
                    // Fall-through
                default:
                    // throw new SyntaxError('json_encode');
            }
        };

        // Make a fake root object containing our value under the key of ''.
        // Return the result of stringifying the value.
        return str('', {
            '': value
        });

    } catch (err) { // Todo: ensure error handling above throws a SyntaxError in all cases where it could
        // (i.e., when the JSON global is not available and there is an error)
        if (!(err instanceof SyntaxError)) {
            throw new Error('Unexpected error type in json_encode()');
        }
        this.php_js = this.php_js || {};
        this.php_js.last_error_json = 4; // usable by json_last_error()
        return null;
    }
}
/**
 * Validates form inputs according their attributes
 * @param {type} form_id
 * @param {type} only_visible
 * @returns {Boolean} */
function validateForm(form_id, only_visible, callback) {
    var valid = true;
    if ('undefined' === typeof only_visible) {
        only_visible = true;
    }
    //Unmark before invalid fields
    $('#' + form_id).find('.fill-in').each(function() {
        $(this).removeClass('fill-in');
    });
    // Check all required fields
    $('#' + form_id).find('.required').each(function() {
        if (($(this).attr('type') === 'radio') && (!only_visible || $(this).is(":visible")))
        {
            if (!$('input[name=' + $(this).attr('name') + ']').is(':checked'))
            {
                $(this).parent().addClass('fill-in');
                valid = false;
            }
        } else if (($.trim($(this).val()) === ''
                || $.trim($(this).val()) === '-1'
                || $(this).val( ) === null)
                && (!only_visible || $(this).is(":visible"))
                && this.nodeName === 'SELECT')
        {

            $(this).addClass('fill-in');
            $('#' + form_id + ' #' + $(this).attr('id') + '_chzn a').addClass('fill-in');

            valid = false;
        } else {
            if (($.trim($(this).val()) === ''
                    || $(this).val() === null)
                    && (!only_visible || $(this).is(":visible")))
            {
                $(this).addClass('fill-in');
                if ($('#' + form_id + ' #token-input' + $(this).attr('id')))
                {
                    $('#' + form_id + ' #token-input-' + $(this).attr('id')).parents('ul').addClass('fill-in');
                }
                valid = false;
            }
        }
    });
    // Check input value by pattern
    $('#' + form_id + ' .validate').each(function()
    {
        if (($(this).attr('pattern') !== '' && (!only_visible || $(this).is(":visible"))))
        {
            var tester = new RegExp($(this).attr('pattern'));
            if (!tester.test($(this).val()))
            {
                valid = false;
                $(this).addClass('fill-in');
            }
        }
        if ($(this).hasClass('validate-number'))
        {
            valid = valid && validateNumber($(this));
        }
    }
    );
    if( true === valid && 'function' === typeof callback ) {
        callback($('#' + form_id));
    }
    return valid;
}

$('.validate-number').on('keyup', function(event)
{
    if ('undefined' !== typeof event.which)
    {

        var result = validateNumber($(this));
        if (result) {
            $(this).keyup();
        }
        return result;
    }
}
);
/**
 * Validates number.
 * Number can be positive or negative, float and int
 * @param obj - jQuery object - input of the form
 */
function validateNumber(obj, event)
{
    if ('' === obj.val()) {
        return true;
    }
    obj.removeClass('fill-in');
    var value = obj.val( );
    obj.val(value.replace(',', '.'));

    var tester = RegExp(/^(0[0-9]+)$/);
    if (tester.test(obj.val()))
    {
        value = obj.val();
        obj.val('0.' + value.substring(1));

    } else {
        tester = RegExp(/^(-0[0-9]+)$/);
        if (tester.test(obj.val()))
        {
            value = obj.val();
            obj.val('-0.' + value.substring(2));

        }
    }

    if (isNaN(obj.val()))
    {
        obj.addClass('fill-in');
        return false;
    }
    var validator = RegExp(/^(([0]{1}|((-?[0]{1}[.,]{1})|(-?[1-9]{1}[0-9]*[.,]{0,1}))[0-9]*))$/);
    if (!validator.test(obj.val())) {
        obj.addClass('fill-in');
        return false;
    }

    if (obj.attr('precision'))
    {
        var precision = obj.attr('precision');
        var number = 10;
        var obj_value = obj.val();
        var splitted = obj_value.split('.');
        if (typeof splitted[1] !== 'undefined' && splitted[1].length > precision)
        {
            for (var i = precision; i > 1; i--)
            {
                number *= 10;
            }
            obj.val(Math.floor(obj_value * number) / number);
        }
    }

    if (obj.hasClass('not-negative') && obj.val() < 0) {
        obj.addClass('fill-in');
        return false;
    }
    if (obj.hasClass('validate-price') && obj.val() > 0) {
        obj.val(value.replace('.',','));

        return true;
    }

    return true;
}


/*
 * converts seconds to hours (8.1) h
 */
/*function secondsToHours(seconds) {
 var remainder_seconds = seconds / 3600;
 var hours = seconds / 3600;
 
 alert(remainder_seconds);
 alert(hours);
 }*/

/*
 * converts seconds to (days)d (hours)h (minutes)min
 */
function secondsToStringTime(seconds, show_days) {
    if (null === show_days)
        show_days = true;
    var days = 0;
    if (show_days) {
        days = Math.floor(seconds / 28800);
        seconds = seconds - (days * 28800);
    }
    var hours = Math.floor(seconds / 3600);
    seconds = seconds - (hours * 3600);
    var minutes = Math.floor(seconds / 60);

    if (days > 0) {
        days = days + 'd ';
    } else {
        days = '';
    }

    if (hours > 0) {
        hours = hours + 'h ';
    } else {
        hours = '';
    }

    if (minutes > 0) {
        minutes = minutes + 'min ';
    } else {
        minutes = '';
    }
    time = days + hours + minutes;
    return $.trim(time);
}

/*
 * converts  (days)d (hours)h (minutes)min to seconds
 */

function stringTimeToSeconds(lag_string) {
    var expression_lenght = $.trim(lag_string).length;

    var y = 0;
    var month = 0;
    var d = 0;
    var h = 0;
    var m = 0;
    var s = 0;

    var lag = String(lag_string + '-').split('d');
    if (2 === lag.length) {
        var d = lag[0];
        if ($.trim(lag[1]) !== '-') {
            var lag_string = lag[1];
        } else {
            var lag_string = "";
        }
    }
    var lag = String(lag_string + '-').split('h');
    if (2 === lag.length) {
        var h = lag[0];
        if ($.trim(lag[1]) !== '-') {
            var lag_string = lag[1];
        } else {
            var lag_string = "";
        }
    }
    var lag = String(lag_string + '-').split('min');
    if (2 === lag.length) {
        var m = lag[0];
        if ($.trim(lag[1]) !== '-') {
            var lag_string = lag[1];
        } else {
            var lag_string = "";
        }
    }
    var seconds = (d * 60 * 60 * 8) + (h * 60 * 60) + (m * 60);

    if (0 > seconds && 0 < expression_lenght) {
        return 'error';
    }
    return seconds;
}

function stringTimeToSeconds2(lag_string){
    var m = 60;
    var h = m * 60;
    var d = h * 8;
    var w = d * 5;
    var month = w * 4;

    var seconds_sum = 0;
    var symbols = String(lag_string).match(/(\d+\w+)/g);
    if (symbols) {
        for (var i = 0; i < symbols.length; i++) {
            var smbl = symbols[i];
            var tmp = smbl.match(/[a-zA-Z]+/);
            if (tmp) {
                var tm = tmp[0].toLowerCase();
                switch(tm){
                    case "m":
                        seconds_sum += parseFloat(smbl) * month;
                    break;
                    case "w":
                        seconds_sum += parseFloat(smbl) * w;
                    break;
                    case "d":
                        seconds_sum += parseFloat(smbl) * d;
                    break;
                    case "h":
                        seconds_sum += parseFloat(smbl) * h;
                    break;
                    case "min":
                        seconds_sum += parseFloat(smbl) * m;
                    break;
                }
            };
        };
    }
    return seconds_sum;
}

function secondsToHours(seconds) {
    var hours = seconds / 3600;
    return hours;
}


/*actions for multi column select */

function highLightTR(event, trElm, normBackColor, normTextColor, hiLightBackColor, hiLightTextColor) {
    var tbdyElm = trElm.parentNode;

    event = (event) ? event : ((window.event) ? window.event : null);

    for (var i = 0; i < tbdyElm.childNodes.length; i++) {
        var node = tbdyElm.childNodes[i]; // a list of tr

        //check to see if we are dealign with a table row
        if (typeof (node) !== "undefined" && node.tagName === "TR") {

            //if we are dealing with the one that is not clicked
            if (node.id !== trElm.id) {

                //If it is selected and if they don't have crtl or alt help down the un-select it. Otherwise leave it
                if ((node.getAttribute("selected") === "true") && (!(event.ctrlKey || event.metaKey))) {
                    deselect(node, normBackColor, normTextColor);
                }

                // else this is the node that was clicked
            } else {
                //only for the case that it is selected and they have ctrl and alt pressed then un-select it.
                if ((node.getAttribute("selected") === "true") && (event.ctrlKey || event.metaKey)) {
                    deselect(node, normBackColor, normTextColor);
                } else {
                    select(node, hiLightBackColor, hiLightTextColor);
                }
            }
        }
    }
}

function select(node, hiLightBackColor, hiLightTextColor) {
    node.setAttribute("selected", "true");
    node.bgColor = hiLightBackColor;

    try {
        changeTextColor(node, htLightTextColor);
    } catch (e) {

    }
}

function deselect(node, normBackColor, normTextColor) {
    node.setAttribute("selected", "");
    node.bgColor = normBackColor;
    try {
        changeTextColor(node, normTextColor);
    } catch (e) {
    }
}



function _submit(min) {
    var selectedContactsTblElm = document.getElementById("selected_contacts");
    if (selectedContactsTblElm) {
        var aRows = selectedContactsTblElm.rows;
        var szRows = aRows.length;
        var contactIds = "";
        if (szRows >= min) {
            for (var i = 0; i < szRows; i++) {
                var row = aRows[i];
                if (typeof (row) !== "undefined" && row.id) {
                    contactIds += row.id + ",";
                }
            }
            contactIds = contactIds.substr(0, contactIds.length - 1);
            alert(contactIds);
        } else {
            alert("Please choose at least " + min + " contact(s).");
        }
    }
}
// only IE support
function changeHighLightTR(event, tblElm) {
    event = (event) ? event : ((window.event) ? window.event : null);
    if (event) {
        var aRows = tblElm.rows;
        var szRows = aRows.length;
        var selectedRowIndex = -1;
        var selectedRow = null;
        for (var i = 0; i < szRows; i++) {
            var row = aRows[i];
            if (typeof (row) !== "undefined" && row.getAttribute("selected") === "true") {
                selectedRow = row;

                selectedRowIndex = row.rowIndex;
                break;
            }
        }

        switch (event.keyCode) {
            case 38:
                // UP
                if (selectedRowIndex > 0) {
                    highLightTR(event, aRows[selectedRowIndex - 1], '#ffffff', '#000000', '#316AC5', '#ffffff');
                }
                break;
            case 40:
                // DOWN
                if ((selectedRowIndex >= 0) && (selectedRowIndex < szRows - 1)) {
                    highLightTR(event, aRows[selectedRowIndex + 1], '#ffffff', '#000000', '#316AC5', '#ffffff');
                }
                break;
            default:
                break;
        }
    }
}

function showHideEditField(editable_div_id, plain_text_div_id, show) {
    if (show) {
        $('#' + editable_div_id).show().attr('style', 'display: inline');
        $('#' + editable_div_id).removeClass('hidden').addClass('form-inline');
        $('#' + plain_text_div_id).hide();
    } else {
        $('#' + editable_div_id).hide();
        $('#' + plain_text_div_id).show().attr('style', 'display: inline');
    }
}


/**************************************************************
 * included from http://www.quirksmode.org/js/cookies.html
 *************************************************************/
/**
 * 
 * @param {type} name
 * @param {type} value
 * @param {type} days
 * @returns {undefined}
 */
function createCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    }
    top.document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = top.document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ')
            c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0)
            return c.substring(nameEQ.length, c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, null, -1);
}

/**************************************************************
 * Actual code below
 *************************************************************/

var cookieRegistry = [];

function listenCookieChange(cookieName, callback) {

    setInterval(function() {
        if (cookieRegistry[cookieName]) {
            if (readCookie(cookieName) !== cookieRegistry[cookieName]) {
                // update registry so we dont get triggered again
                var old_value = cookieRegistry[cookieName];
                var new_value = readCookie(cookieName);
                cookieRegistry[cookieName] = new_value;
                return callback(new_value, old_value);
            }
            if ('-1' === readCookie(cookieName)) {
                $.cookie(cookieName, null);
            }
        } else {
            cookieRegistry[cookieName] = readCookie(cookieName);
        }

    }, 5000);
}

function updateCookieValue(cookieName, cookieValue, callback) {

    setInterval(function() {
        createCookie(cookieName, cookieValue);
        return callback();
    }, 5000);
}

/**************************************************************
 * Test below
 *************************************************************/




/*** Hover delay plugin****/
/**
 * hoverIntent r6 // 2011.02.26 // jQuery 1.5.1+
 * <http://cherne.net/brian/resources/jquery.hoverIntent.html>
 * 
 *@param $
 * @author    Brian Cherne brian(at)cherne(dot)net
 */
(function($) {
    /**
     * 
     * @param  f  onMouseOver function || An object with configuration options
     * @param  g  onMouseOut function  || Nothing (use configuration options object)
     * @returns {@exp;@call;@call;bind}
     */
    $.fn.hoverIntent = function(f, g) {
        var cfg = {
            sensitivity: 7,
            interval: 100,
            timeout: 0
        };

        cfg = $.extend(cfg, g ? {
            over: f,
            out: g
        } : f);
        var cX, cY, pX, pY;
        var track = function(ev) {
            cX = ev.pageX;
            cY = ev.pageY;
        };

        var compare = function(ev, ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            if ((Math.abs(pX - cX) + Math.abs(pY - cY)) < cfg.sensitivity) {
                $(ob).unbind("mousemove", track);
                ob.hoverIntent_s = 1;
                return cfg.over.apply(ob, [ev]);
            } else {
                pX = cX;
                pY = cY;
                ob.hoverIntent_t = setTimeout(function() {
                    compare(ev, ob);
                }, cfg.interval);
            }
        };

        var delay = function(ev, ob) {
            ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            ob.hoverIntent_s = 0;
            return cfg.out.apply(ob, [ev]);
        };

        var handleHover = function(e) {
            var ev = jQuery.extend({}, e);
            var ob = this;
            if (ob.hoverIntent_t) {
                ob.hoverIntent_t = clearTimeout(ob.hoverIntent_t);
            }
            if (e.type === "mouseenter") {
                pX = ev.pageX;
                pY = ev.pageY;
                $(ob).bind("mousemove", track);
                if (ob.hoverIntent_s !== 1) {
                    ob.hoverIntent_t = setTimeout(function() {
                        compare(ev, ob);
                    }, cfg.interval);
                }
            } else {
                $(ob).unbind("mousemove", track);
                if (ob.hoverIntent_s === 1) {
                    ob.hoverIntent_t = setTimeout(function() {
                        delay(ev, ob);
                    }, cfg.timeout);
                }
            }
        };

        return this.bind('mouseenter', handleHover).bind('mouseleave', handleHover);
    };
})(jQuery);
/*!
 * jQuery Cookie Plugin
 * https://github.com/carhartl/jquery-cookie
 *
 * Copyright 2011, Klaus Hartl
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.opensource.org/licenses/GPL-2.0
 */
(function($) {
    $.cookie = function(key, value, options) {

        // key and at least value given, set cookie...
        if (arguments.length > 1 && (!/Object/.test(Object.prototype.toString.call(value)) || value === null || value === undefined)) {
            options = $.extend({}, options);

            if (value === null || value === undefined) {
                options.expires = -1;
            }

            if (typeof options.expires === 'number') {
                var days = options.expires, t = options.expires = new Date();
                t.setDate(t.getDate() + days);
            }

            value = String(value);

            return (document.cookie = [
                encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value),
                options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
                options.path ? '; path=' + options.path : '',
                options.domain ? '; domain=' + options.domain : '',
                options.secure ? '; secure' : ''
            ].join(''));
        }

        // key and possibly options given, get cookie...
        options = value || {};
        var decode = options.raw ? function(s) {
            return s;
        } : decodeURIComponent;

        var pairs = document.cookie.split('; ');
        for (var i = 0, pair; pair === pairs[i] && pairs[i].split('='); i++) {
            if (decode(pair[0]) === key)
                return decode(pair[1] || ''); // IE saves cookies with empty string as "c; ", e.g. without "=" as opposed to EOMB, thus pair[1] may be undefined
        }
        return null;
    };
})(jQuery);


/**
 * miliseconds converts to date and replaces letters in given in format with required value.
 * @TODO need to make function more global (cases, year format...) or find another function to replace this.
 
 * 
 * @param {type} miliseconds
 * @param {type} format
 * @returns {unresolved}
 */
function milisecondsToDate(miliseconds, format) {
    var formatted_date = format;
    if (miliseconds > 0) {
        if ($.trim(format) === '') {
            format = 'Y-m-d';
        }
        var date = new Date(miliseconds);
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        if (month < 10) {
            month = '0' + month;
        }
        var day = date.getDate();
        if (day < 10) {
            day = '0' + day;
        }
        formatted_date = formatted_date.replace('Y', year);
        formatted_date = formatted_date.replace('m', month);
        formatted_date = formatted_date.replace('d', day);
    }
    return formatted_date;
}

function milisecondsToHours(miliseconds) {
    return (miliseconds / 3600000);
}

/**
 * Serializes form to object
 */
$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
/**
 * Adds class 'changed to input'
 
 * @param {type} input
 * @returns {undefined}
 */
function markInputChanged(input) {
    var j_input = $(input);
    if (!j_input.hasClass('changed')) {
        j_input.addClass('changed');
    }
}
/**
 * Removes class 'changed from input'
 
 * @param {type} input
 * @returns {undefined}
 */
function markInputUnchanged(input) {

    var j_input = $(input);
    j_input.removeClass('changed');
}

function initInplaceEdit() {
    $('.div_editable').each(function() {
        $(this).on('click', function() {
            var value_text = $(this).find('span.value_text');
            if (!value_text.is(':visible')) {
                return false;
            }
            value_text.hide();

            var editable_field = $(this).find('.editable-field-container');
            var first_editable_field = $(this).find('.editable_field :first');

            editable_field.show(1, function() {
                if (first_editable_field.hasClass('mce_editor')) {
                    try {
                        tinyMCE.execCommand('mceAddControl', false, first_editable_field.attr('id'));
                    } catch (e) {
                        console.log(e);
                    }
                }
                if (first_editable_field.is('select')) {
                    if ($('#' + first_editable_field.attr('id') + '_chzn').length > 0) {
                        $('#' + first_editable_field.attr('id') + '_chzn').trigger('mousedown');
                    } else {
                        first_editable_field.trigger('mousedown');
                    }
                } else {
                    first_editable_field.focus();
                }
            });
            addBlurEvent();

        });
    });
}

function addBlurEvent() {
    $(document).mouseup(function(e) {
        //var obj = $(this);

        var container = $(this).find('.editable-field-container:visible');
        var text_editor = $('.mce_forecolor:visible');
        var calendar = $('#ui-datepicker-div:visible');
        if ('undefined' !== typeof container && container.has(e.target).length === 0
                && 'undefined' !== typeof text_editor && text_editor.has(e.target).length === 0
                && 'undefined' !== typeof calendar && calendar.has(e.target).length === 0)
        {


            var new_value = '';
            container.find('.editable_field').each(function() {
                if ($(this).is('select')) {
                    new_value += $(this).find('option:selected').text() + ' ';
                }
                else
                {
                    new_value += $(this).val() + ' ';
                }
                var el_id = $(this).attr('id');
                if (tinyMCE.getInstanceById(el_id))
                {
                    var content = '';
                    var mce_editor = tinyMCE.get(el_id);
                    if ('undefined' !== typeof mce_editor) {
                        content = mce_editor.getContent();
                        $(this).html(content);
                        if ($.trim(content).length > 0) {
                            $(this).parents('.div_editable')
                                    .find('span.value_text').html(content);
                        }
                        tinyMCE.execCommand('mceFocus', false, el_id);
                        tinyMCE.execCommand('mceRemoveControl', true, el_id);
                    }
                }
            });
            setTimeout(function() {
                if ($.trim(new_value) === '') {
                    if (container.find('.editable_field').is('select')) {
                        new_value = _TRANSLATIONS.SELECT_AN_OPTION;
                    } else {
                        new_value = _TRANSLATIONS.NO_INFORMATION;
                    }
                }
                hideEditFields(container, new_value);
            }, 30);

        }

    });

}
function hideEditFields(obj, new_value) {
    $(obj).parents('.div_editable').find('span.value_text').text(new_value).show();
    $(obj).hide();
    $(obj).trigger('change');

}

var inputDelay = (function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    };
})();
function htmlEntities(str) {
    return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function showHideFieldsetContent(container_id) {
    if ($('#' + container_id).is(':visible')) {
        $('#' + container_id).hide();
    } else {
        $('#' + container_id).show();

    }
}

/*
 * Common dialogue() function that creates our dialogue qTip.
 * We'll use this method to create both our prompt and confirm dialogues
 * as they share very similar styles, but with varying content and titles.
 */
function dialogue(content, title) {
    /* 
     * Since the dialogue isn't really a tooltip as such, we'll use a dummy
     * out-of-DOM element as our target instead of an actual element like document.body
     */
    $('<div />').qtip(
            {
                content: {
                    text: content,
                    title: title
                },
                position: {
                    my: 'center',
                    at: 'center', // Center it...
                    target: $(window) // ... in the window
                },
                show: {
                    ready: true, // Show it straight away
                    modal: {
                        on: true, // Make it modal (darken the rest of the page)...
                        blur: false // ... but don't close the tooltip when clicked
                    }
                },
                hide: false, // We'll hide it maunally so disable hide events
                style: 'qtip-light qtip-rounded qtip-dialogue', // Add a few styles
                events: {
                    // Hide the tooltip when any buttons in the dialogue are clicked
                    render: function(event, api) {
                        $('button', api.elements.content).click(api.hide);
                    },
                    // Destroy the tooltip once it's hidden as we no longer need it!
                    hide: function(event, api) {
                        api.destroy();
                    }
                }
            });
}

// Our Confirm method
function Confirm(question, title, buttons, callback)
{
    // Content will consist of the question and ok/cancel buttons
    var message = $('<p />', {
        text: question
    });
    var ok = $('<button />', {
        text: 'Ok',
        click: function() {
            callback(true);
        }
    }),
    cancel = $('<button />', {
        text: 'Cancel',
        click: function() {
            callback(false);
        }
    });
    message.add(ok);
    dialogue(message.add(ok), title);
}



$(document).ready(function() {

    window.createGrowl = function(persistent, title, body) {
        // Use the last visible jGrowl qtip as our positioning target
        var target = $('.qtip.jgrowl:visible:last');

        // Create your jGrowl qTip...
        $(document.body).qtip({
            // Any content config you want here really.... go wild!
            content: {
                text: body,
                title: {
                    text: title,
                    button: _TRANSLATIONS.CLOSE
                }
            },
            position: {
                my: 'top right',
                // Not really important...
                at: (target.length ? 'bottom' : 'top') + ' right',
                // If target is window use 'top right' instead of 'bottom right'
                target: target.length ? target : $(window),
                // Use our target declared above
                adjust: {y: 5},
                effect: function(api, newPos) {
                    // Animate as usual if the window element is the target
                    $(this).animate(newPos, {
                        duration: 200,
                        queue: false
                    });

                    // Store the final animate position
                    api.cache.finalPos = newPos;
                }
            },
            show: {
                event: false,
                // Don't show it on a regular event
                ready: true,
                // Show it when ready (rendered)
                effect: function() {
                    $(this).stop(0, 1).fadeIn(400);
                },
                // Matches the hide effect
                delay: 0,
                // Needed to prevent positioning issues
                // Custom option for use with the .get()/.set() API, awesome!
                persistent: persistent
            },
            hide: {
                event: false,
                // Don't hide it on a regular event
                effect: function(api) {
                    // Do a regular fadeOut, but add some spice!
                    $(this).stop(0, 1).fadeOut(400).queue(function() {
                        // Destroy this tooltip after fading out
                        api.destroy();

                        // Update positions
                        updateGrowls();
                    });
                }
            },
            style: {
                classes: 'jgrowl qtip-dark qtip-rounded',
                width: 300,
                // Some nice visual classes
                tip: false // No tips for this one (optional ofcourse)
            },
            events: {
                render: function(event, api) {
                    // Trigger the timer (below) on render
                    timer.call(api.elements.tooltip, event);
                }
            }
        }).removeData('qtip');
    };

    // Make it a window property see we can call it outside via updateGrowls() at any point
    window.updateGrowls = function() {
        // Loop over each jGrowl qTip
        var each = $('.qtip.jgrowl'),
                width = each.outerWidth(),
                height = each.outerHeight(),
                gap = each.eq(0).qtip('option', 'position.adjust.y'),
                pos;

        each.each(function(i) {
            var api = $(this).data('qtip');

            // Set target to window for first or calculate manually for subsequent growls
            api.options.position.target = !i ? $(window) : [
                pos.left + width, pos.top + (height * i) + Math.abs(gap * (i - 1))
            ];
            api.set('position.at', 'top right');

            // If this is the first element, store its finak animation position
            // so we can calculate the position of subsequent growls above
            if (!i) {
                pos = api.cache.finalPos;
            }
        });
    };

    // Setup our timer function
    function timer(event) {
        var api = $(this).data('qtip'),
                lifespan = 7000; // 5 second lifespan

        // If persistent is set to true, don't do anything.
        if (api.get('show.persistent') === true) {
            return;
        }

        // Otherwise, start/clear the timer depending on event type
        clearTimeout(api.timer);
        if (event.type !== 'mouseover') {
            api.timer = setTimeout(api.hide, lifespan);
        }
    }

    // Utilise delegate so we don't have to rebind for every qTip!
    $(document).delegate('.qtip.jgrowl', 'mouseover mouseout', timer);
});

function showMessage(message, class_name, persistant, delay) {
    if (undefined === persistant) {
        persistant = false;
    }
    
    if (typeof delay === 'undefined') {
        delay = 2000;
    }

    try {
        var header = _TRANSLATIONS.INFO;
        var type = '';
        switch(class_name){
            case "error":
            case "error-message":
                header =  _TRANSLATIONS.ERROR;
                type = 'error';
            break;
            case "success":
            case "success-message":
                type = 'success';
            break;
            default:
                header = _TRANSLATIONS.INFO;
                type = 'info';
        }
        new PNotify({
            title: header,
            text: message,
            type: type,
            buttons: {
                sticker: false,
            },
            delay: delay,
            styling: "bootstrap3"
        });
        //createGrowl(persistant, '<span class="' + class_name + '">' + header + '</span>', message);
    } catch (e) {
        console.log(e);
    }
}

function hideMessage(class_name) {
    // workaround for ie 8+

    $("#messageIcon").hide().removeClass(class_name);

    if (class_name === 'undefined' || class_name === null) {
        $("#ajaxMessage").animate(2000, function() {
            $(this).removeClass($(this).attr("class_name")).hide();
        });
    }
    else {
        $("#ajaxMessage").attr("class_name", class_name).animate(2000, function() {
            $(this).removeClass($(this).attr("class_name")).hide();
        });
    }
}


function initChosen(id, options) {
    var chzn_options = {
        placeholder_text: _TRANSLATIONS.SELECT_AN_OPTION,
        no_results_text: _TRANSLATIONS.NO_RESULT_MATCH,
        disable_search_threshold: 21,
        allow_single_deselect: !$('#' + id).hasClass('required')
    };
    chzn_options = $.extend(chzn_options, options);
    $('#' + id).chosen(chzn_options);
}

function stringTimeToMiliseconds(string) {
    var matches = string.match(/([+|-]*)([0-9.]*)(ms|m|s|h|d|w)*/i);
    if ('' !== matches) {
        var sign = matches[1];
        var number = matches[2];
        var time_type = matches[3];
        if (time_type) {
            switch (time_type.toLowerCase()) {
                case 'w':
                    number = number * 144000000;
                    break;
                case 'd':
                    number = number * 28800000;
                    break;
                case 'h':
                    number = number * 3600000;
                    break;
                case 'm':
                    number = number * 60000;
                    break;
                case 's':
                    number = number * 1000;
                    break;
                case 'ms':
                    break;
                default:
                    break;
            }
            if ('-' === sign) {
                number = -1 * number;
            }
            return number;
        }
    }
    return 0;
}

function fullCalendarheaderContent() {
    return {
        createButton: function() {
            $(document).trigger('createNewEvent');
        }
        /*   printButton  : function(){$( document ).trigger( 'printCalendar', t );},*/
        /*  refreshData  : function(){$('#calendar').fullCalendar('refetchEvents');}*/
    };
}

/**
 * formats seconds as HH:mm
 * @param {int} seconds
 * @returns {String}
 */
function secondsToTime(seconds) {
    if (isNaN(seconds)) {
        return '--:--'
    }
    var sign = '';
    if (seconds < 0) {
        sign = '-';
        seconds = seconds * (-1);
    }
    var hours = Math.floor(seconds / 3600);
    var minutes = Math.floor(((seconds - 3600 * hours)) / 60);
    if (hours < 10) {
        hours = '0' + hours;
    }
    if (minutes < 10) {
        minutes = '0' + minutes;
    }
    return sign + hours + ':' + minutes;
}
/**
 * converts HH:mm to seconds
 * @param {String} time
 * @returns {int}
 */
function timeToSeconds(time) {
    if ('object' === typeof time) {
        time = time.val();
    }
    var parts = time.split(':');

    return ((Number(parts[0]) * 3600) + (Number(parts[1]) * 60));
}

function validateTime(time) {
    if ('object' === typeof time) {
        time = time.val();
    }
    var parts = time.split(':');
    return (24 > Number(parts[0]) && 60 > Number(parts[1]));

}

function confirmDialogClose(dialogContainer) {
    if (0 >= $('#confirm_close_dialog').length) {
        $('body').append('<div id="confirm_close_dialog" class="hidden"></div>');
    }
    var buttons = {};
    buttons[_TRANSLATIONS.YES] = function() {
        dialogContainer.dialog('option', 'beforeClose', function() {
        });
        dialogContainer.dialog('close');
        dialogContainer.remove();
        destroyDialog($(this));
    };
    buttons[_TRANSLATIONS.NO] = function() {
        destroyDialog($(this));
        return false;
    };
    $('#confirm_close_dialog').dialog({
        width: 350,
        modal: true,
        buttons: buttons,
        close: function() {
            destroyDialog($(this));
            return false;
        }
    }).text(_TRANSLATIONS.ALL_CHANGES_WILL_BE_LOST_DO_YOU_WANT_TO_CONTINUE).addClass('center');
}
function setQuickLinksFieldsDefaultValues() {
    $('#project-type-id').val($('select#project-type-id option:first').attr('value'));
    $('#project-datapicker-container').hide();
    $('#pa-project-name').empty();
    $('#pa-project-datapicker').val('');
    $('#pa-project-id').val('');
    $('#pa-project-label').val('');
    $('.quick-links-select').each(function() {
        $(this).children('option:first').attr('value');
        $(this).val($(this).children('option:first').attr('value'));
        $(this).trigger('liszt:updated');
    });
}
function toggleQuickLinks()
{
    if ($('#quick-links-controll-switch').hasClass('open'))
    {
        $('#quick-links-controll-switch').removeClass('open');
    }
    else
    {
        $('#quick-links-controll-switch').addClass('open');
        setQuickLinksFieldsDefaultValues();
    }
    $('#quick_links_container').toggle();
}
$(document).mouseup(function(e)
{
    var container = $("#quick_links_container");
    if (container.has(e.target).length === 0 &&
            'quick_links_container' != e.target.id &&
            'quick-links-controll-switch' != e.target.id &&
            ('ABBR' !== e.target.tagName ||
                    0 === $(document.elementFromPoint((e.clientX - 20), e.clientY)).parents('#quick_links_container').length
                    ))
    {
        $('#quick-links-controll-switch').removeClass('open');
        container.hide();
    }
});
/**
* 

 * @param jQuery object (dom element) container
 * @param string url
 * @returns void */
function loadTaskMaterialData(container, url) {
    var request = $.ajax({
        url: url,
        type: "POST",
        dataType: "html"
    });

    request.done(function(msg) {
        container.html(msg);
    });

    request.fail(function(jqXHR, textStatus) {
        alert("Request failed: " + textStatus);
    });
}
/**
 * t
 */
function toggleContainer(container, callback) {
    container.toggleClass('hidden');
    callback();
}


//check all columns checkbox
function checkAllColumns(grid, row, deselect, params){
    if (params.defName && ($.inArray(row.Def.Name, params.defName) != -1)) {
        for (var col in grid.Cols) {
            var c = grid.Cols[col];
            if (c.Type == "Bool" && row[c.Name+"CanEdit"] != 0) {
                if (params.colException && ($.inArray(c.Name, params.colException) != -1)) {
                    continue;
                }
                if (deselect) {
                    changeValue(grid, row, {column: col, value: 0});
                }else{
                    changeValue(grid, row, {column: col, value: 1});
                }
            }
        }
    }
}

function changeChildsValue(grid, row, column, value) {
    doRecursion(grid, row, 'changeValue', {column: column, value: parseInt(value)}, true);
}

function changeAllRowsValue(grid, row, column, value, def) {
    value = (value ? 0 : 1);

    var rows = grid.Rows;

    for (i in rows) {
        if (typeof def == 'object') {
            if (rows[i].Kind != 'Data' || (def && !def[rows[i].Def.Name])) { continue; }
        } else {
            if (rows[i].Kind != 'Data' || (def && rows[i].Def.Name != def)) { continue; }
        }
        if (rows[i][column+"CanEdit"] != 0) {
            changeValue(grid, rows[i], {column: column, value: value});
        }
    }
}



function setAllRowsValue(grid, column, value, def_name){
    var grid = Grids[grid];
    var _rows = grid.Rows;
    for (i in _rows) {
        var _row = _rows[i];
        if (_row.Def.Name != def_name && _row.Kind == "Data" && parseInt(_row.id) > 0 && _row[column+"CanEdit"] != 0) {
            changeValue(grid, _row , {column: column, value: value});
        }
    }
}

function changeValue(grid, row, params) {
    grid.SetValue(row, params.column, params.value, 1);
}

function calculateSum(Row, Column) {
    var sum = 0;

    if (Row.childNodes.length > 0) {
        // Get group first child
        var child = Row.firstChild;

        // Select all childs 
        while (child.nextSibling) {
            if (child[Column]) {
                sum += child[Column];
            }

            child = child.nextSibling;
        }

        // Select last child 
        if (Row.lastChild[Column]) {
            sum += Row.lastChild[Column];
        }
    }
    
    return sum;
}

function selectedSequance(grid, row, deselect) {
    if ('undefined' === typeof grid.row_select_sequence) {
        grid.row_select_sequence = [];
    }

    if (!row.is_project) {
        if (deselect) {
            var position = $.inArray(row.id, grid.row_select_sequence);
            if (~position) {
                grid.row_select_sequence.splice(position, 1);
            }
        } else {
            grid.row_select_sequence.push(row.id);
        }
    }
}

function openChooseMaterialDialog(R, G, M) {

    var url = BASE_URL + 'material/order/choosematerial';
    var buttons = {};

    if (R.categoryId) {
        url += '/category/'+R.categoryId;
    }

    if (R.materialId) {
        url += '/material/'+R.materialId;
    }

    buttons[_TRANSLATIONS.CHOOSE] = function() {
        var category = $('#category').val();
        var categoryTitle = $('#category').find('option[value='+category+']').first().text();
        var material = $('#material').val();
        var materialTile = $('#material').find('option[value='+material+']').first().text();

        if (!M) {
            M = "material"
        }

        G.SetValue(R, "category", categoryTitle, 1);
        G.SetValue(R, M, materialTile, 1);
        G.SetValue(R, "categoryId", category, 1);
        G.SetValue(R, "materialId", material, 1);

        $(this).dialog('destroy');
        $('#choose-material').html('');
    };

    buttons[_TRANSLATIONS.CANCEL] =  function() {
        $(this).dialog('destroy');
        $('#choose-material').html('');
    };

    $('#choose-material').load(url).dialog({
        position: {'top': 7},
        width: 520,
        height: 450,
        modal: true,
        buttons: buttons,
        close: function() {
            $('#choose-material').html('');
            $('#choose-material').dialog('destroy');
        },
    });
}

var position = 1;

function calcPos(grid, row, notFirstLap) {

    if (!notFirstLap) {
        position = 1;
    }

    if (row.nextSibling) {
        while(row.nextSibling) {
            grid.SetValue(row, 'position', position, 1);
            if (row.firstChild) {
                calcPos(grid, row.firstChild, true);
            }

            position++;
            row = row.nextSibling;
        }
    }

    grid.SetValue(row, 'position', position, 1);

    if (!row.nextSibling && row.firstChild) {
        calcPos(grid, row.firstChild, true);
    }

    return true;
}

function getFirstRow(row, grid) {
    if (row) {
        if (row.Level > 0) {
            return getFirstRow(row.parentNode);
        }

        return row.parentNode.firstChild;
    } else if (grid){
        return grid.Body.firstChild.firstChild;
    } else {
        return null;
    }
}

function doRecursion(grid, row, fn, fnParams, withoutSelf) {
    /*var _row = row;
    console.log(row.firstChild);
    if (row.firstChild) {
        row = row.firstChild;
        while (row.nextSibling) {
            window[fn](grid, row, fnParams);
            row = row.nextSibling;

        }

        window[fn](grid, _row.lastChild, fnParams);
    }*/

    var index = 0;
    while(row.nextSibling) {
        //console.log(row);
        if (row.firstChild) {
            doRecursion(grid, row.firstChild, fn, fnParams);
        }

        if (withoutSelf && index == 0) {
            row = row.nextSibling;
            continue;
        }

        window[fn](grid, row, fnParams);
        row = row.nextSibling;
        index++;
    }

    if (!row.nextSibling) {
        if (!withoutSelf) {
            window[fn](grid, row, fnParams);
        }

        if (row.firstChild) {
            doRecursion(grid, row.firstChild, fn, fnParams);
        }
    }
}

function preventGridLink(event) {
    var e = event || window.event; 
    e.preventDefault();
}

function recalculatePositions(grid, row) {
    setTimeout(function(){
        //Get first row
        var firstRow = getFirstRow(row, grid);
        var clc = calcPos(grid, firstRow);
        if (clc){
            position_recalculated = true;
        };

    }, 50);
}

$(document).on({
    click: function() {
        $('.simplyfied_tab').addClass('gray').removeClass('active_simplyfied_tabs');
        $(this).removeClass('gray').addClass('active_simplyfied_tabs');
        $('.simplyfied_tab_container').hide();
        $('#'+$(this).attr('id')+'_container').show();
    }
}, ".simplyfied_tab");

function addGroupOrItem(grid, isGroup, row, measurementId) {
    if (row) {
        if (row.is_group) {
            var newRow = grid.AddRow(row, null, 7, null);
        } else {
            if (row.parentNode && row.nodeName == "I") {
                var newRow = grid.AddRow(row.parentNode, null, 7, null);
            } else {
                var newRow = grid.AddRow(null, null, 7, null);
            }
        }
    } else {
        var newRow = grid.AddRow(null, null, true);
    }

    newRow.CanSelect = 0;

    if (isGroup) {
        newRow.is_group = 1;
        grid.ChangeDef(newRow, "Group", 1);
        grid.SetValue(newRow, 'name', _TRANSLATIONS.NEW_GROUP, 1);
    } else {
        grid.ChangeDef(newRow, "R", 1);
        grid.SetValue(newRow, 'name', _TRANSLATIONS.NEW_TASK, 1);
        grid.SetValue(newRow, 'billable', 1, 1);

        if (measurementId) {
           grid.SetValue(newRow, 'measurement_id', measurementId, 1);
        } else {
            grid.SetValue(newRow, 'measurement_id', 1, 1);
       }
    }
    
    grid.Focus(newRow, 'name', null, true);

    if (row && row.nodeName == "I") {
        recalculatePositions(grid, getFirstRow(row));
    } else {
        recalculatePositions(grid, getFirstRow(newRow));
    }
}

function addGridItem(grid, row, in_row) {
    if (in_row) {
        var newRow = grid.AddRow(row, null, 7);
        grid.SetValue(newRow, 'parent_id', row.id, 1);
    }else{
        var newRow = grid.AddRow(row.parentNode, row.nextSibling, 7);
        grid.SetValue(newRow, 'parent_id', row.parentNode.id, 1);
    }

    recalculatePositions(grid, getFirstRow(newRow));
}

function filter(button) {
    var form = $(button).parents('form').first();
    var gridId = form.attr('data-grid-id');
    var grid = Grids[gridId];

    if (grid) {
        formInputs = $(form).find('.filter_input');
/*
        if (formInputs.css('display') == 'none') {
            formInputs.removeAttr('style');
            formInputs.css('display', 'inline-block');
        }*/

        var needToReload = false;
        var needToReloadLayout = false;

        $.each(formInputs, function(){
            if ($(this).attr('name')) {
                needToReload = true;

                var value = $(this).val();

                if ($(this).attr('type') == 'checkbox') {
                    if ($(this).attr('checked') == 'checked') {
                        value = 1;
                    } else {
                        value = 0;
                    }
                }
                button.attr('disabled', 'disabled');
                grid.Source.Data.Param[$(this).attr('name')] = value;


                if ($(this).attr('data-reload_layout') == 1 && $(this).attr('data-value') != $(this).val()) {
                    needToReloadLayout = true;
                    grid.Source.Layout.Param[$(this).attr('name')] = $(this).val();
                    $(this).attr('data-value', $(this).val());
                }
            }
        });

        if (needToReload) {

            if (!needToReloadLayout) {
                grid.ReloadBody();
            } else {
                grid.Reload();
            }
        }
    }
}

function updateChangesList(grid_id) {
    if ($('#'+grid_id+'-changes').length > 0 && changes_params[grid_id]) {
        changes_params[grid_id].short = 1;
         $('#'+grid_id+'-changes').load(changes_params[grid_id].url, changes_params[grid_id]);
    }  
}

function openShortDetailsDialog(url, dialogId, dialogParams, params, tabId){
    dialogParams.modal = true;
    dialogParams.position = [($(window).width() / 2) - (dialogParams.width / 2), 40];
    dialogParams.closeText = _TRANSLATIONS.CLOSE;
    dialogParams.close = function(){
        $('#' + dialogId).remove();
    };

    $('body').append('<div id="' + dialogId + '" style="overflow:visible;"></div>');
    
    var dialog = $('#' + dialogId).load(BASE_URL + url, params, function(data) {
        var IS_JSON = true;
        try {
            var json = $.parseJSON(data);
        } catch(err) {
            IS_JSON = false;
        }

        if (IS_JSON && json && json.error == "1") {
            showMessage(json.error_message, "error-message");
            $('#' + dialogId).html('');
            $('#' + dialogId).dialog('destroy');
        }

        if (tabId && tabId.tabId){
            $('#'+tabId.tabId+' a').trigger('click');
        }
    }).dialog(dialogParams);

    dialog.dialog('option', 'resizable', false);
    dialog.dialog('option', 'title', '');
}

function splitItem(Grid, url, saveUrl) {
    if (0 >= $('#split-item-dialog').length) {
        $('body').append('<div id="split-item-dialog" class="hidden"></div>');
    }
    
    var buttons = {};

    buttons[_TRANSLATIONS.SAVE] = function() {
        showLoader();
        var current_value = new Number($('#edit-current_total_value').val());
        var total = $('#edit-maximum_split_total').val();

        valid = (current_value > 0 && current_value < total);
        if (!valid) {
            hideLoader();
            showMessage(_TRANSLATIONS.PRODUCTION_INCORRECT_SPLIT_VALUE, 'error-message');
            return;
        }

        var form = $('#edit-item-split-form');
        $.post(saveUrl, form.serialize(), function(response) {
            hideLoader();
            if (response.success) {
                destroyDialog($('#split-item-dialog'));
                showMessage(response.success_message, "success-message");
                Grid.Enable();
                Grid.ReloadBody();
            }
        }, 'json');
    };

    buttons[_TRANSLATIONS.CANCEL] = function() {
        $('#split-item-dialog').html('');
        Grid.Enable();
        destroyDialog($(this));
    };

    $('#split-item-dialog').load(url).dialog({
        modal: true,
        width: 400,
        height: 240,
        buttons: buttons,
        close: function(){
            $('#split-item-dialog').html('');
            Grid.Enable();
        }
    });

    Grid.Disable();
}

/**
 * @param modal_id ID of bootstrap modal window
 * @param grid_id  ID of grid
 */

function closeModal(modal_id, grid_id)
{
    $('#'+modal_id).modal('hide');
    
    if (grid_id) {
        Grids[grid_id].ReloadBody();
    }
}

function importFile(id, title, data)
{
    var dialog = $('#'+id);

    if (dialog.length > 0) {
        dialog.removeClass('hidden');
    }else{
        dialog = $('<div/>').attr('id', id).css('z-index', '99999').appendTo('body');
    }

    var settings = {
        title: title +' importavimas',
        buttons: {
            import: {
                title: "Importuoti",
                onclick: "importData()",
                class: "md-button md-raised md-ink-ripple green-button mini-button save import_button",
                icon: "fa fa-upload",
            }
        },
        onclose: function(e) {
            dialog.remove();
        },
    };

    data["modal_id"] = id;

    dialog.loadinmodal(BASE_URL+ 'production/import/openimport/ajax/1/', data, settings);
}

var GLOBAL_HISTORY_STATES = {};
var GLOBAL_CURRENT_HISTORY_STATE_NR = 0;
var GLOBAL_CURRENT_HISTORY_STATE_INFO = {};

function loadHistoryState(state)
{
    if (state != null) {
        if (state.remove_content) {
            $("#"+state.old_content_id).hide();
        }else if (typeof state.tab_id == 'undefined') {
            if (state.old_content_id != state.new_content_id) {
                $("#"+state.old_content_id).hide();
            }
            
            var content = $('#'+state.new_content_id);
            if (content.length == 0) {
                content = $("<div/>").attr('id', state.new_content_id).addClass('loaded-page flex-auto').appendTo("#content-layout");
            }
            content.loadContent(state.load_url, state.params, true);
        } else {
            $("#"+state.old_content_id).hide();
            var content = $('#'+state.new_content_id);
            if (content.length == 0) {
                content = $("<div/>").attr('id', state.new_content_id).addClass('loaded-page flex-auto').appendTo("#content-layout");
            }

            content.loadContent(state.load_url, state.params, true, function(){
                if (state.tab_id && $('#'+state.tab_id).length > 0) {
                    setTimeout(function(){
                        $('#'+state.tab_id).trigger('click', {triggered: true});
                    }, 1000 );
                }
            });
        }
    }
}

function addHistoryState(state){

    if (state == null) {
        state = {};
    }

    var new_nr = GLOBAL_CURRENT_HISTORY_STATE_NR + 1;

    state.history_state_nr = new_nr;

    var page_title = '';
    var page_url = '';
    
    if (typeof state.page_title != "undefined") {
        page_title = state.page_title;
    }
    if (typeof state.page_url != "undefined") {
        page_url = BASE_URL + state.page_url;
    }

    if (typeof state.content_data != "undefined") {
        var url = generateUrl(state.content_data.load_url_data.url, state.content_data.load_url_data.params);
        if (state.content_data.inside_url_data.url) {
            page_url = BASE_URL + generateUrl(state.content_data.inside_url_data.url, {'inside': btoa(JSON.stringify(state.content_data))});
        }

        state.content_data.load_url = BASE_URL+url;
    }

    GLOBAL_HISTORY_STATES[new_nr] = state;
    setHistoryStateInfo(state);
    GLOBAL_CURRENT_HISTORY_STATE_NR++;

    var st = {
        state: state,
        states: GLOBAL_HISTORY_STATES,
    };

    history.pushState(st, page_title, page_url);

    if (typeof state.content_data != "undefined") {
        if (!state.content_data.dont_load) {
            loadHistoryState(state.content_data);
        }
    }
}

function replaceHistoryState(state){
    setHistoryStateInfo(state);

    var page_title = '';
    var page_url = '';

    if (state != null && typeof state.page_title != "undefined") {
        page_title = state.page_title;
    }
    if (state != null && typeof state.page_url == "undefined") {
        page_url = state.page_url;
    }

    var st = {
        state: state,
        states: GLOBAL_HISTORY_STATES,
    };

   history.replaceState(st, page_title, page_url);
}

function getHistoryStateInfo(){
    return GLOBAL_CURRENT_HISTORY_STATE_INFO;
}

function getHistoryStates(){
    return GLOBAL_HISTORY_STATES;
}

function setHistoryStateInfo(state){
    var state_nr = (state != null && typeof state.history_state_nr != "undefined" ? state.history_state_nr : 0);

    GLOBAL_CURRENT_HISTORY_STATE_INFO = {
        state_nr: state_nr,
        action: (state_nr >= GLOBAL_CURRENT_HISTORY_STATE_NR ? 'next' : 'back'),
        current_state: state,
        old_state: (typeof GLOBAL_HISTORY_STATES[GLOBAL_CURRENT_HISTORY_STATE_NR] != "undefined" ? GLOBAL_HISTORY_STATES[GLOBAL_CURRENT_HISTORY_STATE_NR] : null),
    };
}

window.onpopstate = function(event) {
    var st = event.state;
    var state_nr = (st != null && st.state != null && typeof st.state.history_state_nr != "undefined" ? st.state.history_state_nr : 0);
    
    if (st != null && st.state != null){
        GLOBAL_HISTORY_STATES[state_nr] = st.state;
    }

    if (st == null) {
        replaceHistoryState(null);
    }else{
        replaceHistoryState(st.state);
    }

    GLOBAL_CURRENT_HISTORY_STATE_NR = state_nr;

    var history_state_info = getHistoryStateInfo();

    if (history_state_info.old_state != null && typeof history_state_info.old_state.content_data != "undefined") {
        if (typeof history_state_info.old_state.content_data.new_content_id !== 'undefined') {
            $('#' + history_state_info.old_state.content_data.new_content_id).remove();
        }
    }

    if (history_state_info.current_state != null && typeof history_state_info.current_state.content_data != "undefined") {
        if (typeof history_state_info.current_state.content_data.new_content_id !== 'undefined') {
            $('#' + history_state_info.current_state.content_data.new_content_id).show();
        }
    }else if (history_state_info.old_state != null && typeof history_state_info.old_state.content_data != "undefined") {
        if (typeof history_state_info.old_state.content_data.old_content_id !== 'undefined') {
            $('#' + history_state_info.old_state.content_data.old_content_id).show();
        }
    }

    if (st != null && st.state != null && typeof st.state.content_data != "undefined") {
        loadHistoryState(st.state.content_data);
    }else{
        angular.element(window).triggerHandler('resize');
    }

    $(document).trigger("changeHistoryState", history_state_info);
};

if (history.state != null) {
    if (typeof history.state.states != "undefined") {
        GLOBAL_HISTORY_STATES = history.state.states;
    }
    if (typeof history.state.state != "undefined" && history.state.state != null) {
        GLOBAL_CURRENT_HISTORY_STATE_NR = history.state.state.history_state_nr;
        setHistoryStateInfo(history.state.state);
    }
}else{
    setHistoryStateInfo(null);
}

function generateUrl(url, params)
{
    angular.forEach(params, function(prm_value, prm_key) {
        url += "/"+prm_key+"/"+prm_value;
    });
    return url;
}

function closeHistoryStateWindow()
{
    if (history.state) {
        $('#'+history.state.new_content_id).hide();
        $('#'+history.state.old_content_id).show();
    }
}

function setTabToHistory(tab_id)
{
    var obj = {
        content_data: {
            tab_id: tab_id,
            dont_load: true,
        }
    };

    var tmp_obj = {};
    var history_state = getHistoryStateInfo().current_state;
    $.extend(true, tmp_obj, history_state, obj);
    addHistoryState(tmp_obj);
}

function number_format(number, decimals, dec_point, thousands_point) {
    if (number == null || !isFinite(number)) {
        throw new TypeError("number is not valid");
    }

    if (!decimals) {
        var len = number.toString().split('.').length;
        decimals = len > 1 ? len : 0;
    }

    if (!dec_point) {
        dec_point = '.';
    }

    if (!thousands_point) {
        thousands_point = ',';
    }

    number = parseFloat(number).toFixed(decimals);

    number = number.replace(".", dec_point);

    var splitNum = number.split(dec_point);
    splitNum[0] = splitNum[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousands_point);
    number = splitNum.join(dec_point);

    return number;
}

function multdec ( val1, val2 ) {
    return parseFloat( val1 * Math.pow(10, 1)) * parseFloat(val2 * Math.pow(10, 1) ) / Math.pow(10, 2);
}
