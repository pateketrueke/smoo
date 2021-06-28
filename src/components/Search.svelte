<script>
  import { createEventDispatcher } from 'svelte';

  let cssClass = '';
  let isBlocked = false;
  let isFocus = false;
  let isOpen = null;
  let term = '';
  let input = null;
  let list = null;

  export { cssClass as class };
  export let value = [];
  export let data = [];
  export let nofilter = false;
  export let disabled = false;
  export let multiple = false;
  export let autoclose = false;
  export let label = 'name';
  export let fallback = 'No names were found';
  export let placeholder = 'Search for names...';
  export let keys = ['name', 'value'];
  export let id = 'search';
  export let pk = 'id';

  const dispatch = createEventDispatcher();

  function isActive() {
    return document.activeElement === input;
  }

  function isOption() {
    return list && list.contains(document.activeElement);
  }

  function search(e) {
    term = e.target.value.toLowerCase();
  }

  function sync(e) {
    search(e);
    dispatch('input', e.target.value);
    isOpen = e.target.value.length > 0 || null;
  }

  function pick(rowId) {
    if (!value.includes(rowId)) {
      value = !multiple ? [rowId] : value.concat(rowId);
    } else {
      value = !multiple ? [] : value.filter(rid => rid !== rowId);
    }
    dispatch('change', value);
  }

  function reset(e, skip) {
    if (isOption()) {
      document.activeElement.click();
    }
    if (!skip) {
      e.stopPropagation();
      e.preventDefault();
      input.focus();
    }
    dispatch('close', e);
    isOpen = null;
  }

  function select(e) {
    pick(e.target.value);
    if (!multiple && autoclose) {
      setTimeout(() => !isBlocked && reset(e), 120);
    }
  }

  function open() {
    isOpen = true;
  }

  let t;
  function close(e) {
    dispatch('blur', e);
    isBlocked = true;
    clearTimeout(t);
    t = setTimeout(() => {
      isBlocked = false;
      if (isActive()) return;
      if (!isOption() && !isFocus) {
        dispatch('close', e);
        isOpen = null;
      }
    }, 150);
  }

  function set() {
    isFocus = true;
  }

  function unset() {
    isFocus = false;
  }

  function focus(el) {
    const target = el && el.querySelector('input');
    if (target) {
      target.focus();
      if (!multiple) target.click();
    }
  }

  function check(e) {
    if (!isOpen) {
      if (e.keyCode === 38 || e.keyCode === 40) {
        isOpen = true;
      }
    } else {
      if (e.keyCode === 9) {
        setTimeout(() => {
          if (!isOption()) reset(e, true);
        }, 120);
      }
      if (e.keyCode === 38 && isActive()) {
        e.preventDefault();
        focus(list.querySelector('li:last-child'));
      }
      if (e.keyCode === 40 && isActive()) {
        e.preventDefault();
        focus(list.querySelector('li:first-child'));
      }
      if (e.keyCode === 13 || e.keyCode === 27) reset(e);
    }
  }

  $: fixedProps = { ...(id ? { id } : null), class: cssClass || null };
  $: fixedType = multiple ? 'checkbox' : 'radio';
  $: filteredData = nofilter ? data : data.filter(item => {
    if (keys.some(key => item[key].toLowerCase().includes(term))) return true;
    return !term;
  });
  $: if (isOpen) dispatch('open', { input, list });
</script>

<style>
  .smoo-search--search { position: relative; }
  .smoo-search--values {
    transform: translateY(-1px);
    list-style-type: none;
    background-color: white;
    border: 1px solid silver;
    position: absolute;
    display: none;
    padding: 0;
    margin: 0;
  }
  .smoo-search--values[open] { display: block; }
  .smoo-search--option { vertical-align: middle; }
  .smoo-search--option label { display: flex; align-items: center; }

  :global(.smoo-search--input svg + input) { padding-left: 1.5em; }
  :global(.smoo-search--input svg) { position: absolute; top: .2em; height: 1em; }
</style>

<div role="listbox" class="smoo-search--search" on:keydown={check}>
  <label for={id} role="search" class="smoo-search--input">
    <slot name="before" />
    <input
      type="search" class="smoo-search--field" {disabled} {placeholder} {...fixedProps}
      bind:this={input} on:keyup={search} on:change={search} on:input={sync} on:blur={close} on:mouseup={open} on:focus
    />
    <slot name="after" />
  </label>
  <ul role="menu" class="smoo-search--values" open={isOpen} bind:this={list} on:mouseenter={set} on:mouseleave={unset}>
    {#each filteredData as item}
      <li role="menuitem" class="smoo-search--option">
        <label for="{id}-{pk}-{item[pk]}">
          <input id="{id}-{pk}-{item[pk]}"
            type={fixedType} value={item[pk]} checked={value.includes(item[pk].toString())}
            on:change={select} on:blur={close}
          />
          <slot {item} name="item"><span class="smoo-search--value">{item[label]}</span></slot>
        </label>
      </li>
    {:else}
      <li class="smoo-search--empty" on:click={reset}><slot name="empty">{fallback}</slot></li>
    {/each}
  </ul>
</div>
