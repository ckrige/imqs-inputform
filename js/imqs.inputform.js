/*
 * Input Form
 * Dynamic input form
 *
 * by Cobus Krige
 *
 *
 * License
 * http://creativecommons.org/licenses/by-sa/3.0/
 */
( /** @param {Object=} undefined*/ function(window, document, $, undefined) {

    // our single global variable
    var iq = {};
    ( window.iq ) ? iq = window.iq : window.iq = iq ;

    iq.inputform = {};

        /**
         * @enum {string}
         * The Different FieldTypes That are supported
         */
        iq.inputform.FieldType = {
            TEXT: "Text",
            TEXTAREA: "TextArea",
            SELECT: "Select",
            CHECKBOX: "Checkbox",
            DATETIME: "DateTime",
            DATETIMELOCAL: "DateTimeLocal",
            MONTH: "Month",
            NUMBER: "Number",
            WEEK: "Week",
            LABEL: "Label",
            CHECKLIST: "CheckList"
        };


    /** @constructor
     * @param {boolean} isrequired indicates if field is required
     * @param {boolean} isnewline indicates if field should be shown on a new line
     * @param {string} description label description for the field
     * @param {iq.inputform.FieldType} type the field type associated with the field  -see FieldType enum
     * @param {number|null} position of input field
     * @param {string|null} tab description of the tab control for the field
     * @param {Array.<string>|null} value value(s) for the field
     * @param {object|null} meta additional info for field
     * This is the field object that is passed to the the fields property on
     * the Control object.
     *
     * **/
    iq.inputform.Field = function(isrequired,isnewline,description,type,position,tab,value,meta){
        /** @type {string|null}*/
        this.description = description;
        /** @type {iq.inputform.FieldType|null}*/
        this.type = type;
        /** @type {number|null}*/
        this.position = position;
        /** @type {string|null}*/
        this.tab = tab;
        /** @type {object|null}*/
        this.meta = meta;
        /** @type {boolean} */
        this.isnewline = isnewline;
        /** @type {boolean} */
        this.isrequired = isrequired;
        /** @type {Array.<string>|null}*/
        this.value = value;
        /** @type {string|null} */
        this.id = 'inputfield-' + this.createGuid();
    };

    /**
    * @return {string}
    * Create a pseudo js GUID, used to give controls a unique name
    */
    iq.inputform.Field.prototype.createGuid = function () {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    };

    /** @constructor
     * @param {string} divId id of the element where the input form should be added to
     * @param {boolean} canSave indicates whether saving functionality is available
     * @param {string} requiredMessage the required message to be shown
     * @param {string} validationErrorMessage the validation message to be shown

     * This is the field object that is passed to the the fields property on
     * the Control object.
     *
     * **/
    iq.inputform.Control = function(divId,canSave,requiredMessage,validationErrorMessage){
        /** @type {string}*/
        this.parentControl = $( "#" + divId );
            /** @type {string}*/
            this.parentID = divId;
            /** @type {Array.< iq.inputform.Field>}*/
            this.fields = [];
            /** @type {Array.<string>}*/
            this.tabs = [];
            /** @type {boolean}*/
            this.canSave = canSave;
            /** @type {boolean}*/
            this.isDirty = false;
            /** @type {string} */
            this.requiredMessage = requiredMessage;
            /** @type {string} */
            this.validationErrorMessage = validationErrorMessage;
        };


    iq.inputform.Control.prototype.show = function (){
            var self = this;
            var html = "";

            this.parentControl.empty();

            //get all tabs
            this.getTabList();

            //create the controls
            //if we have tabs
            if (this.tabs.length >0){
               html = this.addTabControls(self);
               this.parentControl.append(html);
               $('#tabs').smartTab({autoProgress: false,stopOnFocus:true,transitionEffect:'none', autoHeight:true});
            }
            //no tabs
            else {

                var found_elements = this.fields;

                found_elements.sort(function(a,b){return a.position- b.position});
                html += "<div class='inputform_MainDiv'>";
                html += this.addControls(found_elements);
                html += "</div>";

               this.parentControl.append(html);
            }

            //create the buttons
            var buttonSaveCancel = "<div class='inputform_SaveDiv'>";
            buttonSaveCancel += "<input disabled id='inputform-" + this.parentID + "-SaveButton' type='button' value='Save' />";
            buttonSaveCancel += "<input disabled id='inputform-" + this.parentID + "-CancelButton' type='button' value='Cancel' />";
            buttonSaveCancel += "</div>";

            if (this.canSave)  this.parentControl.append(buttonSaveCancel);

            $( "#" + this.parentID).change(function(ev){
                self.checkDirtyStatus(ev.target);
            });

            $( "#" + this.parentID).keyup(function(ev){
                self.checkDirtyStatus(ev.target);
            });

            $( '#inputform-' + this.parentID +'-CancelButton').click(function(ev){
                 self.resetAllControls();
            });

            $( '#inputform-' + this.parentID +'-SaveButton').click(function(ev){
                self.saveAllControls();
            });


    };

    //set the values in the fields array based on current input
    iq.inputform.Control.prototype.saveAllControls = function () {

        if (!this.canSave)return;

        //validate that all required fields are completed, else complain and exit
        if (this.validateAllFields() === false) {
            $('#errormsg').text(this.validationErrorMessage);
            return;
        }

        var type = null;
        var self = this;

        //loop thru all fields and handle according to type
        //set value in associated .fields element

        $('#'+ this.parentID).find("[id^='inputfield-']").each(function () {

            type = this.localName;
            var searchID = this.id;
            var pos = null;

            $(self.fields).each(function (index) {
                if (this.id === searchID) pos = index;
            });

            switch (type) {
                case 'textarea':
                    self.fields[pos].value = [];
                    self.fields[pos].value.push($(this).val());
                    break;
                case 'input':
                    if (this.type === 'checkbox') {
                        if (this.id.indexOf(":") === -1) {
                            self.fields[pos].value = [];
                            if (this.checked)self.fields[pos].value.push('checked');
                        }
                        else {
                            //get the index number
                            var indexItems = this.id.split(":");
                            $(self.fields).each(function (index) {
                                if (this.id === indexItems[0]) pos = index;
                            });
                            self.fields[pos].value[indexItems[1]] = "";
                            if (this.checked) {
                                self.fields[pos].value[indexItems[1]] = self.fields[pos].meta.options[indexItems[1]];
                            }
                        }
                    }
                    else {
                        self.fields[pos].value = [];
                        self.fields[pos].value.push($(this).val());
                        break;
                    }
                    break;
                case 'select':
                    self.fields[pos].value = [];
                    self.fields[pos].value.push($(this).val());
                    break;
            }

        });

        //refresh entire page
        this.show();
        //wash up
        this.setDirty(false);
    };

    iq.inputform.Control.prototype.validateAllFields = function () {
        //check that all fields that are marked as required  actually contain data.
        //at this stage only text elements (input text and textarea) are checked

        var validationPass = true;

        $(this.fields).each(function () {
            if (this.isrequired) {
                if (this.type !== iq.inputform.FieldType.CHECKBOX && this.type !== iq.inputform.FieldType.CHECKLIST && this.type !== iq.inputform.FieldType.SELECT) {
                    if ($('#' + this.id).val() === "") {
                        validationPass = false;
                    }
                }
            }
        });

        return validationPass;
    };

    iq.inputform.Control.prototype.resetAllControls = function () {

        //reset all controls back to the values that were in place before
        //user started editing.

        if (!this.canSave)return;

        var type = null;
        $('#'+ this.parentID).find("[id^='inputfield-']").each(function () {

            var self = this;
            //type = $(this).attr('type');
            type = this.localName;
            switch (type) {

                case 'textarea':
                    $(this).val($(this).attr('data'));
                    break;
                case 'input':
                    if (this.type === 'checkbox') {
                        $(this).prop('checked', false);
                        if ($(this).attr('data') === 'checked') {
                            $(this).prop('checked', true);
                        }
                    }
                    else {
                        $(this).val($(this).attr('data'))
                    }

                    break;

                case 'select':
                    var selectObj = this;

                    if ($(selectObj).attr('data') !== "") {
                        $(selectObj).val($(selectObj).attr('data'))
                    }
                    else {
                        $(selectObj).val($(selectObj).children()[0].value);
                    }
            }

        });

        $('#errormsg').text('');
        this.setDirty(false);
    };


    iq.inputform.Control.prototype.checkDirtyStatus = function(targetObj){

       //TODO need to handle checks and selects
        if ($(targetObj).attr('data') === undefined)return;

        if ($(targetObj).attr('data') !==  $(targetObj).val()) this.setDirty(true);

    }

    iq.inputform.Control.prototype.setDirty = function (dirty) {

        this.isDirty = dirty;

        $('#inputform-' + this.parentID +'-SaveButton').prop('disabled', !dirty);
        $('#inputform-' + this.parentID +'-CancelButton').prop('disabled', !dirty);

    };


    iq.inputform.Control.prototype.addTabControls = function (self) {
        //add tab controls for input grouping
        //the tab controls are supplied by the 3'rd party component smartTab

        var html = '';
        var htmltabcontent = '';
        var tabcount = 0;
        var tabname = null;

        html += "<div id='tabs'><ul>";

        $(this.tabs).each(function () {
            tabname = this;

            //create the tab portion
            html += "<li><a href='#tabs-" + tabcount + "'>" + tabname + "</a></li>";

            //create the tab content portion
            htmltabcontent += "<div id='tabs-" + tabcount + "'>";

            //select all controls to be added to tab content and sort by position
            var found_tabelements = $.grep(self.fields, function (v) {
                return v.tab.toString() === tabname.toString();
            });

            found_tabelements.sort(function (a, b) {
                return a.position - b.position
            });

            htmltabcontent += self.addControls(found_tabelements);

            htmltabcontent += "</div>";
            tabcount++;
        });

        html += "</ul>";
        html += htmltabcontent;
        html += "</div>";

        return html;
    };




    iq.inputform.Control.prototype.addControls = function (found_elements) {

        //returns string comprised of all the elements passed
        var html = '';
        var isfirstLine = false;
        var hasRequired = false;
        var disabled = this.canSave === false ? "disabled" : "";
        var counter = 0;

        html += "<table class='inputform_MainTable' >";
        $(found_elements).each(function () {
            if (this.isnewline === true) {
                if (isfirstLine === false) {
                    isfirstLine = true;
                }
                else {
                    html += "</tr>";
                }
                html += "<tr>";
            }

            html += this.type === iq.inputform.FieldType.TEXTAREA ? "<td colspan='2'>" : "<td>";
            if (this.isrequired === true) {
                html += "<label class='inputform_labelStyle'>* </label>";
                hasRequired = true;
            }
            var cssDesc = this.type === iq.inputform.FieldType.LABEL ? "stMain_Desc_Label" : "stMain_Desc_Normal";
            html += "<label class='" + cssDesc + "'>" + this.description + "</label>";
            if (this.type === iq.inputform.FieldType.TEXTAREA) {
                html += "<table><tr>";
            }
            else if (this.type === iq.inputform.FieldType.CHECKLIST) {
                html += "<table class='inputform_CheckList'>";
            }
            else {
                html += "</td>";
            }

            var options = '';
            var values = this.value === null || this.value === undefined ? [] : this.value;

            switch (this.type) {

                case iq.inputform.FieldType.TEXT:
                    var placeholder = this.meta['placeholder'] === undefined ? "" : this.meta['placeholder'];
                    var textvalue = $(values).length > 0 ? $(values)[0] : "";
                    html += "<td><input id='" + this.id + "' " + disabled + " type='text' placeholder='" + placeholder + "' class='inputform_Text' value='" + textvalue + "' data='" + textvalue + "'></td>";
                    break;
                case iq.inputform.FieldType.TEXTAREA:
                    var textareavalue = $(values).length > 0 ? $(values)[0] : "";
                    html += "<td colspan='4' ><textarea id='" + this.id + "' " + disabled + " class='inputform_TextArea'  data='" + textareavalue + "'>" + textareavalue + "</textarea></td></tr></table></td>";
                    break;
                case iq.inputform.FieldType.CHECKLIST:
                    var self = this;
                    var cntChk = 0;
                    $(this.meta['options']).each(function () {
                        var selectTrue = values.indexOf(this.toString()) !== -1 ? "checked" : "";
                        options += "<tr><td><label class='inputform_CheckListLabel'>" + this + "</label></td> <td class='inputform_CheckListRow'><input id='" + self.id + ":" + +cntChk + "' " + disabled + "  type='checkbox' " + selectTrue + " data='" + selectTrue + "'></td></tr>"
                        cntChk++;
                    });
                    html += options + "</table></td>";
                    break;
                case iq.inputform.FieldType.SELECT:
                    var selectvalue = $(values).length > 0 ? $(values)[0] : "";
                    $(this.meta['options']).each(function () {
                        var selectTrue = selectvalue === this.toString() ? "selected" : "";
                        options += "<option value='" + this + "' " + selectTrue + ">" + this + "</option>"
                    });
                    html += "<td><select id='" + this.id + "' " + disabled + " class='inputform_Select'  data='" + selectvalue + "'>" + options + "</select></td>";
                    break;
                case iq.inputform.FieldType.CHECKBOX:
                    var checkvalue = $(values).length > 0 ? $(values)[0] : "";
                    html += "<td><input id='" + this.id + "' " + disabled + "  type='checkbox' " + checkvalue + "  data='" + checkvalue + "'></td>";
                    break;
                case iq.inputform.FieldType.DATETIME:
                    var datetimevalue = $(values).length > 0 ? $(values)[0] : "";
                    html += "<td><input id='" + this.id + "' " + disabled + "  type='date' class='inputform_DateTime'  value='" + datetimevalue + "' data='" + datetimevalue + "'></td>";
                    break;
                case iq.inputform.FieldType.DATETIMELOCAL:
                    var datetimelocalvalue = $(values).length > 0 ? $(values)[0] : "";
                    html += "<td><input id='" + this.id + "' " + disabled + "  type='datetime-local' value='" + datetimelocalvalue + "' data='" + datetimelocalvalue + "'></td>";
                    break;
                case iq.inputform.FieldType.MONTH:
                    var monthvalue = $(values).length > 0 ? $(values)[0] : "";
                    html += "<td><input id='" + this.id + "' " + disabled + "  type='month' value='" + monthvalue + "' data='" + monthvalue + "'></td>";
                    break;
                case iq.inputform.FieldType.NUMBER:
                    var numbervalue = $(values).length > 0 ? $(values)[0] : "";
                    html += "<td><input id='" + this.id + "' " + disabled + "  type='number' value='" + numbervalue + "' data='" + numbervalue + "'></td>";
                    break;
                case iq.inputform.FieldType.WEEK:
                    var weekvalue = $(values).length > 0 ? $(values)[0] : "";
                    html += "<td><input id='" + this.id + "' " + disabled + "  type='week' value='" + weekvalue + "' data='" + weekvalue + "'></td>";
                    break;
            }
            counter++;
        });

        html += "</tr></table>";

        if (hasRequired === true) {
            html += "<div class='inputform_requiredMessage' >" + this.requiredMessage +  "</div>"
        }

        html += "<div id='errormsg' class='inputform_errorMessage' ></div>"
        return html;
    };

    iq.inputform.Control.prototype.getTabList = function(){
       //create the tab list for the control, only add unique tab value, do not add blank or undefined tab
       var self = this;
       $(this.fields).each(function(){
             if (self.tabs.indexOf(this.tab) === -1 && this.tab !== "" && this.tab !== undefined)self.tabs.push(this.tab);
       });
    }


}(window, document, jQuery));