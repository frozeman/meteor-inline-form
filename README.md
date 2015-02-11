# Inline Form

This package contains an element, which can add a input or select into an inline text.

![screenshot](screenshot.png)

## Installation

    $ meteor add frozeman:inline-form


## Usage

### Text input

To add a text input just add the following into an inline text:

```html
<p>Lorem ipsum Enim {{> InlineForm name="myInput" value="Some default text"}} irure qui tempor velit do Ut id elit cupidatat reprehenderit do labore dolor Ut enim in.</p>
```

Text inputs can get the following values:


- `name="myInput"` - (required) The name of the input/select field
- `value="my data"` - (optional) the initial value
- `placeholder="Placeholder Text"` - Add a placeholder text, works only for the input
- `width="200px"` - set a fixed width (default is to autogrow)
- `disabled=true` - disables the input/select,
- `type="date"` - If you pass type date, it will set the input as `<input type="date">`


### Select

To add a select simply use the `items` property and give it an array with `text` and `value` properties:

```js
[{
    text: 'Option 1',
    value: 'myValue1'
},{
    text: 'Option 2',
    value: 'myValue2'
}]
```

```html
<p>Lorem ipsum Enim {{> InlineForm name="myInput" items=myItems value="myValue2"}} irure qui tempor velit do Ut id elit cupidatat reprehenderit do labore dolor Ut enim in.</p>
```

If you pass a `value` property, it will pre-select the item, which matches this value.

## Get the form values

To get the form data use the `InlineForm()` function and pass the `span.inline-form` elements, or a parent selector:

```js
// get all inline form elements visible
InlineForm('.inline-form')

// get only the inline form elements inside this container
InlineForm('.my-container')
```

The result will be an object with key-values. The key is the input/selects name passed with the `name` property:

```js
{
    myField: 'some value',
    myOtherField: 'some other value'
}
```