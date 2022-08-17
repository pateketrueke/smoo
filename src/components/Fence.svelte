<script context="module">
  import { tabbable } from 'tabbable';

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

  function push(el, close, current, loadingCallback) {
    STACK.push({
      el, close, current, loadingCallback,
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
      const { el, loadingCallback } = STACK[STACK.length - 1];
      const children = tabbable(el);
      const lastNode = children[children.length - 1];
      const firstNode = children[0];

      if (loadingCallback()) {
        e.preventDefault();
      } else if (e.shiftKey && e.target === firstNode) {
        e.preventDefault();
        lastNode.focus();
      } else if (!e.shiftKey && e.target === lastNode) {
        e.preventDefault();
        firstNode.focus();
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
  export let noform = false;
  export let visible = null;
  export let loading = false;
  export let autofocus = false;
  export { cssClass as class };

  const dispatch = createEventDispatcher();

  function handleSubmit(e) {
    if (e.target.checkValidity()) {
      dispatch('submit', e);
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
      requestAnimationFrame(() => {
        const children = tabbable(ref);
        const firstNode = children[0];

        push(ref, closeMe, document.activeElement, () => loading);

        if (autofocus) {
          setTimeout(() => {
            if (firstNode && !loading) firstNode.focus();
          }, 60);
        }
      });
    }
  }

  $: fixedClass = modal ? 'overlay' : 'inline';
  $: fixedProps = { ...(id ? { id } : null), class: cssClass || null };
</script>

<style>
  .smoo-fence--overlay {
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

  .smoo-fence--wrapper {
    background-color: white;
    box-shadow: 0 2px 3px rgba(0, 0, 0, .2);
  }

  .smoo-fence--loading {
    opacity: .3;
    pointer-events: none;
  }

  .smoo-fence--inline {
    display: inline-block;
  }

  .smoo-fence--form {
    padding: 10px;
  }
</style>

{#if visible}
  <div class="smoo-fence--{fixedClass}" on:click={closeMe} bind:this={ref} role="dialog">
    <div class="smoo-fence--wrapper">
      <slot name="before" />

      <slot name="main" props={fixedProps} />
      {#if !noform}
        <form {...fixedProps} on:submit|preventDefault={handleSubmit} class:smoo-fence--loading={loading} class="smoo-fence--form">
          <slot />
        </form>
      {/if}

      <slot name="after" />
    </div>
  </div>
{/if}
