> Hold your horses!
>
> ![Build status](https://github.com/pateketrueke/smoo/workflows/build/badge.svg)
> [![NPM version](https://badge.fury.io/js/smoo.svg)](http://badge.fury.io/js/smoo)
> [![Known Vulnerabilities](https://snyk.io/test/npm/smoo/badge.svg)](https://snyk.io/test/npm/smoo)

```html
<script>
  import { Fence, Search } from 'smoo';

  let users = [
    { id: 1, name: 'Juanito Hace', value: 'j@do.e' },
    { id: 2, name: 'Carlangas Marca', value: 'cmrx@so.co' },
  ];

  let members = [];
  let visible = false;

  function open() {
    visible = true;
  }
  function close() {
    visible = false;
  }
</script>

<Fence modal bind:visible on:cancel={close}>
  <h1>It works.</h1>
  <Search multiple data={users} bind:value={members} />
  <pre>Got: {JSON.stringify(members)}</pre>
</Fence>

<button on:click={open}>Open modal</button>
```

## How it works?

`smoo` lets you place any kind of markup or components inside a `<div role="dialog">...</div>`,
it also brings to you many other useful components, you'll see below.

## Components

We have a `Fence` component, i.e. a thing you need to guard your cows...

### `<Fence {id} {class} {loading} {modal} {visible} {autofocus} on:submit on:cancel />`

This is a `<form />` wrapper that handle various effects:

- Allows you to subscribe to any connection status and block its content while loading...
- All focusable inputs found during `onMount(...)` will be traped an cycled back and forth
- When rendered as a modal-overlay, it can be canceled with the <kbd>ESC</kbd> key or clicking outside
- It can setup `autofocus` on the first input-element found inside the inner `<form />` wrapper (js only)

> Before submitting HTML5 validation will run, if it's valid a `submit` event will be triggered.
> The `cancel` event is fired when you click outside the modal, or press the <kbd>ESC</kbd> key to close the modal.

Available props:

- `{id}` &mdash; Used `id` for the inner `<form />` element
- `{class}` &mdash; Used `class` for the inner `<form />` element
- `{loading}` &mdash; Its presence will protect the UI with `pointer-events:none`
- `{modal}` &mdash; Its presence will render the inner `<form />` in a modal-overlay
- `{noform}` &mdash; It disables the `<form />` render, use the `main` slot instead
- `{visible}` &mdash; Its value is used to toggle the render of the entire custom-element
- `{autofocus}` &mdash; Its presence enables `focus()` on the first input-element found

Available slots:

- `before` &mdash; Renders before the `<form />` tag
- `after` &mdash; Renders after the `<form />` tag

> Add the `nofocus` or `data-nofocus` attribute to any element to skip autofocus on it (useful for close-icons, etc.).

### `<Search {id} {pk} {keys} {data} {value} {class} {label} {disabled} {multiple} {autoclose} {placeholder} on:change />`

This is an `<input type="search" />` wrapper that handle various effects:

- It is fully accessible through the keyboard, e.g.
  - you can press <kbd>ESC</kbd> to clear search
  - on items, press <kbd>ESC</kbd> to focus back to the input
- It allows you to customize the data-source used and the render options
- The search input fires their `input`, `focus` and `blur` events, while the dropdown fires `open` and `close` events.

> It uses _checkboxes_ or _radios_ to enable selection through the keyboard,
> once values are choosen a `change` event is fired with the current selection.
> You can use CSS to hide those inputs and render the items by using `:focus` and `:checked` selectors.

Available props:

- `{id}` &mdash; Used `id` for the inner `<input />` element
- `{pk}` &mdash; Property to identify each item from `data` list, default is `id`
- `{keys}` &mdash; Properties to filter-out when searching for values, default are `['name', 'value']`
- `{data}` &mdash; Used data-source to retrieve items when searching, it must be an `Array`
- `{value}` &mdash; This is an `Array` of selected ids from the data-source, can be bound
- `{class}` &mdash; Used `class` for the inner `<input />` element
- `{label}` &mdash; Property used to print a human-readable value from each rendered item
- `{nofilter}` &mdash; its presence will disable the filtering over the passed data-source
- `{disabled}` &mdash; It just disables the `<input />` field, while disabled options are hidden
- `{multiple}` &mdash; Enable multiple selection of values (`checkbox` vs `radio`), disabled by default
- `{autoclose}` &mdash; Close the dropdown on click-selection, it should not work with `multiple` options, disabled by default
- `{fallback}` &mdash; This message is shown when no results are found while searching
- `{placeholder}` &mdash; Custom `placeholder` for the `<input />` field

Available slots:

- `before` &mdash; Renders before the `<input />` tag
- `after` &mdash; Renders before the `<input />` tag
- `item` &mdash; Renders each value, use `let:item` to access its props
- `empty` &mdash; Renders when no values where found in the data-source

> If you like, place an icon like `<svg slot="before">...</svg>` and it will be positioned inside the `<input />` on its left.
> Later you can use CSS to customize this through the `[role=search]` selector.
