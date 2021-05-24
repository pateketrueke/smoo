> Hold your horses!
>
> ![Build status](https://github.com/pateketrueke/smoo/workflows/build/badge.svg)
> [![NPM version](https://badge.fury.io/js/smoo.svg)](http://badge.fury.io/js/smoo)
> [![Known Vulnerabilities](https://snyk.io/test/npm/smoo/badge.svg)](https://snyk.io/test/npm/smoo)

```html
<script>
  import { Fence } from 'smoo';

  let visible = false;

  function open() {
    visible = true;
  }
</script>

<Fence modal bind:visible>
  <h1>It works.</h1>
</Fence>

<button on:click={open}>Open modal</button>
```

## How it works?

`smoo` lets you place any kind of markup or components inside a `<div role="dialog">...</div>`

## Components

We only have a `Fence` component, because it's the only thing you need to guard your cows.

### `<Fence {id} {class} {loading} {modal} {visible} {autofocus} on:submit on:cancel />`

This is a `<form />` wrapper that handle various effects:

- Allows you to subscribe to any connection status and block its content while loading...
- All focusable inputs found during `onMount(...)` will be traped an cycled back and forth
- When rendered as a modal-overlay, it can be canceled with the `ESC` key or clicking outside
- It can setup `autofocus` on the first input-element found inside the inner `<form />` wrapper (js only)

> Before submitting HTML5 validation will run, if it's valid a `submit` event will be triggered.
> The `cancel` event is fired when you click outside the modal, or press the `ESC` key to close the modal.

Available props:

- `{id}` &mdash; Used `id` for the inner `<form />` element
- `{class}` &mdash; Used `class` for the inner `<form />` element
- `{loading}` &mdash; Its presence will protect the UI with `pointer-events:none`
- `{modal}` &mdash; Its presence will render the inner `<form />` in a modal-overlay
- `{visible}` &mdash; Its value is used to toggle the render of the entire custom-element
- `{autofocus}` &mdash; Its presence enables `focus()` on the first input-element found

> Add the `nofocus` or `data-nofocus` attribute to any element to skip autofocus on it (useful for close-icons, etc.).
