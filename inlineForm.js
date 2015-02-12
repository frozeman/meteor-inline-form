/**
Template Controllers

@module Templates
**/

/**
Get an input forms values

@method InlineForm
@param {string} containerElements the selector for a container element, or selector for `inline-form` element(s)
@return {Object} 
*/
InlineForm = function(containerElements) {
    if(_.isString(containerElements)) {
        var $elements = ($(containerElements).hasClass('inline-form'))
                ? $(containerElements)
                : $(containerElements).find('.inline-form'),
            returnValue = {};
        
        _.each($elements.toArray(), function(item){
            if($(item).hasClass('inline-form')) {
                if($(item).find('input')[0]) {

                    returnValue[$(item).find('input').prop('name')] = $(item).find('input').val();
                } else if($(item).find('button, span.disabled')[0]) {

                    returnValue[$(item).find('button, span.disabled').data('name')] = $(item).find('button, span.disabled').attr('data-value');
                }
            }
        });
        
        return returnValue;
    }
};


/**
Sets the input size based on the input text

@method setInputSize
*/
var setInputSize = function(template, value) {
    value = value || template.data.value;

    // set default size of the input
    if(template.view.isRendered && (_.isFinite(value) || _.isString(value))) {

        var length = String(value).length;
        // length = (length > 2) ? length-2: length;
        template.$('input').attr('size', length);
    } else if(template.view.isRendered)
        template.$('input').attr('size', 2);

    return value;
};

/**
Selects the correct value and stores in the session

@method selectValues
@param {Event} e
@param {Object} template
@param {Boolean} chooseOppositeValue if FALSE, it will compare to the clicked buttons value, otherwise it will take the opposite value.
*/
var selectValues = function(e, template, chooseOppositeValue){
    var selectionIndex,
        value;
    _.find(template.data.items, function(item, key){
        if ((!chooseOppositeValue && item.value === $(e.currentTarget).attr('data-value')) ||
            (chooseOppositeValue && item.value !== $(e.currentTarget).attr('data-value'))) {
            value = item.value;
            selectionIndex = key;
            return true;
        }
    });


    TemplateVar.set(template, 'selection', selectionIndex);

    if(!chooseOppositeValue)
        TemplateVar.set(template, 'showModal', false);
};


/**
The inline form element template

@class [template] inlineForm
@constructor
**/

Template['InlineForm'].created = function(){
    var template = this;

    TemplateVar.set('selection', 0);
};

Template['InlineForm'].rendered = function(){
    setInputSize(this);

    // autofocus field
    if(this.data.autofocus && !Helpers.isMobile())
        this.$('input').focus();
};


Template['InlineForm'].helpers({
    /**
    Sets the default value of an selection and makes sure its reactive, when the contexts value changes.

    @method (setSelectionValue)
    */
    'setSelectionValue': function(){
        var _this = this;

        // set on start to the first value
        if(_.isArray(this.items) && this.value) {
            // get the index of the selection
            var key = null;
            _.find(this.items, function(item, k){
                if(item.value == _this.value) {
                    key = k;
                    return true;
                }
            });

            // get the current value
            if(key)
                TemplateVar.set('selection', key);
        }
    },
    /**
    Get the last set value

    @method (getValue)
    @param {String} type if the type is "date", it will reformat to DD.MM.YYYY
    */
    'getValue': function(type){
        return (type === 'date' && moment(setInputSize(Template.instance())).isValid())
            ? moment(setInputSize(Template.instance())).format('DD.MM.YYYY')
            : setInputSize(Template.instance());
    },
    /**
    Get the selection

    @method (selection)
    @paran {Boolean} value If true it will get the value, otherwise the text of the item.
    */
    'selection': function(value){
        var selectionIndex = TemplateVar.get('selection');
        return (value) ? this.items[selectionIndex].value : this.items[selectionIndex].text;
    },
    /**
    Return true, if the current item is not selected

    @method (isNotSelected)
    */
    'isNotSelected': function(){
        var selectionIndex = TemplateVar.get('selection');
            parentData = Template.parentData(1);
        return (parentData.items[selectionIndex].value !== this.value);
    },
    /**
    Check if type === date

    @method (isDate)
    */
    'isDate': function(){
        return (this.type === 'date');
    },
    /**
    Return a disbaled attribute if its disbaled

    @method (disabledAttribute)
    */
    'disabledAttribute': function(){
        return (this.disabled) ? {disabled: 'disabled'} : '';
    }
})


Template['InlineForm'].events({
    /**
    Grows the input size

    @event keyup input
    */
    'keyup input': function(e, template){
        setInputSize(template, e.currentTarget.value);
    },
    /**
    Prevent default on all buttons, to prevent validation

    @event click button
    */
    'click button': function(e){
        e.preventDefault();
        // e.stopPropagation();
    },
    /**
    Show the modal, or switch the selection, if there are only two values

    @event click .inline-form > button
    */
    'click .inline-form > button': function(e, template){

        // dont show the modal, just switch the selection, if there are only two
        if(_.isArray(template.data.items) && template.data.items.length === 2) {

            selectValues(e, template, true);

        // show modal
        } else {

            if(!TemplateVar.get('showModal')) 
                TemplateVar.set('showModal', true);
            else
                TemplateVar.set('showModal', false);
        }

    },
    /**
    Select from the modal

    @event click .wizard-modal button
    */
    'click .simple-modal button': selectValues
});