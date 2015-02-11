/**
Template Controllers

@module Templates
**/

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

Template['inlineForm'].created = function(){
    var template = this;

    // set on start to the first value
    if(_.isArray(this.data.items)) {
        // get the index of the selection
        var key = null;
        _.find(this.data.items, function(item, k){
            if(item.value === template.data.value) {
                key = k;
                return true;
            }
        });

        // get the current value
        if(key)
            TemplateVar.set('selection', key);
        // set current value
        else {
            TemplateVar.set('selection', 0);
        }
    }
};

Template['inlineForm'].rendered = function(){
    setInputSize(this);

    // autofocus field
    if(this.data.autofocus && !Helpers.isMobile())
        this.$('input').focus();
};


Template['inlineForm'].helpers({
    /**
    Get the last set value

    @method ((getValue))
    @param {String} type if the type is "date", it will reformat to DD.MM.YYYY
    */
    'getValue': function(type){
        return (type === 'date' && moment(setInputSize(Template.instance())).isValid())
            ? moment(setInputSize(Template.instance())).format('DD.MM.YYYY')
            : setInputSize(Template.instance());

    },
    /**
    Get the selection

    @method ((selection))
    */
    'selection': function(value){
        var selectionIndex = TemplateVar.get('selection');
        return (value) ? this.items[selectionIndex].value : this.items[selectionIndex].text;
    },
    /**
    Return true, if the current item is not selected

    @method ((isNotSelected))
    */
    'isNotSelected': function(){
        var selectionIndex = TemplateVar.get('selection');
            parentData = Template.parentData(1);
        return (parentData.items[selectionIndex].value !== this.value);
    },
    /**
    Return the custom parsley validator attribute

    @method ((isNotSelected))
    */
    'customValidatorAttr': function(){
        var attr = {};
        if(this.customValidator)
            attr['data-parsley-'+ this.customValidator] = 'true';
        return this.customValidator ? attr : '';
    },
    /**
    Return a disbaled attribute if its disbaled

    @method ((disabledAttribute))
    */
    'disabledAttribute': function(){
        return (this.disabled) ? {disabled: 'disabled'} : '';
    }
})


Template['inlineForm'].events({
    /**
    Grows the input size

    @event keyup input
    */
    'keyup input': function(e, template){
        setInputSize(template, e.currentTarget.value);
    },
    /**
    Store the inputs value, when blur

    @event blur input
    */
    // 'blur input': function(e, template){
    //     var formData = Session.get('formData');
    //     formData[template.data.name] = e.currentTarget.value;
    //     Session.set('formData', formData);

    //     // GA
    //     ga('send', 'event', formData.insuranceSelection +'Wizard', template.data.name, e.currentTarget.value);
    // },
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

    @event click button.selection
    */
    'click button.selection': function(e, template){

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