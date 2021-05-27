<script context="module">
  const STACK = [];

  let is;
  let t;

  function isSearch(e) {
    return e.target.tagName === 'INPUT' && e.target.type === 'search';
  }

  function update(e) {
    if (isSearch(e)) {
      is = e.target.value.length === 0;
    }
  }

  function push(el, close, current, firstElement, lastElement, loadingCallback) {
    STACK.push({
      el, close, current, firstElement, lastElement, loadingCallback,
    });
  }

  function pop(e) {
    if (!STACK.length) return;

    const {
      el, close, current,
    } = STACK[STACK.length - 1];

    setTimeout(() => current.focus(), 60);

    if (e instanceof KeyboardEvent) {
      close({ target: el });
      return;
    }

    clearTimeout(t);
    t = setTimeout(() => STACK.pop(), 120);
  }

  function sync(e) {
    if (e.keyCode === 9 && STACK.length) {
      const { firstElement, lastElement, loadingCallback } = STACK[STACK.length - 1];

      if (loadingCallback()) {
        e.preventDefault();
      } else if (e.shiftKey && e.target === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && e.target === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
    if (e.keyCode === 27) {
      if (isSearch(e)) {
        if (is) pop(e);
      } else pop(e);
    }
  }

  window.addEventListener('focus', update);
  window.addEventListener('keyup', update);
  window.addEventListener('keydown', sync);
</script>

<script>
  import { createEventDispatcher } from 'svelte';

  let ref = null;
  let cssClass = '';
  let fixedClass = '';

  export let id = '';
  export let modal = false;
  export let visible = null;
  export let loading = false;
  export let autofocus = false;
  export { cssClass as class };

  const dispatch = createEventDispatcher();

  function handleSubmit(e) {
    if (e.target.checkValidity()) {
      dispatch('submit', e);
      pop(e);
    }
  }

  function closeMe(e) {
    if (modal && ref === e.target) {
      dispatch('cancel', e);
      pop(e);
    }
  }

  $: if (ref) {
    if (visible === false) pop();
    if (visible) {
      const nodes = ref.querySelectorAll('input,button,textarea');
      const children = [];

      for (let i = 0; i < nodes.length; i += 1) {
        if (nodes[i].getAttribute('nofocus') === '' || nodes[i].dataset.nofocus === '') continue; // eslint-disable-line
        if (nodes[i].tagName === 'INPUT' && nodes[i].type === 'hidden') continue; // eslint-disable-line
        if (nodes[i].readOnly || nodes[i].disabled) continue; // eslint-disable-line
        children.push(nodes[i]);
      }

      const lastNode = children[children.length - 1];
      const firstNode = children[0];

      push(ref, closeMe, document.activeElement, firstNode, lastNode, () => loading);

      if (autofocus) {
        setTimeout(() => {
          if (firstNode && !loading) firstNode.focus();
        }, 60);
      }
    }
  }

  $: fixedClass = modal ? 'overlay' : 'inline';
  $: fixedProps = { ...(id ? { id } : null), class: cssClass || null };
</script>

<style>
  .overlay {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    display: flex;
    position: fixed;
    align-items: center;
    justify-content: center;
    background-color: rgba(0, 0, 0, .3);
  }

  .wrapper {
    background-color: white;
    box-shadow: 0 2px 3px rgba(0, 0, 0, .2);
  }

  .loading {
    opacity: .3;
    pointer-events: none;
  }

  .inline {
    display: inline-block;
  }

  form {
    padding: 10px;
  }
</style>

{#if visible}
  <div class={fixedClass} on:click={closeMe} bind:this={ref} role="dialog">
    <div class="wrapper">
      <slot name="before" />
      <form {...fixedProps} on:submit|preventDefault={handleSubmit} class:loading={loading}>
        <slot />
      </form>
      <slot name="after" />
    </div>
  </div>
{/if}