<script>
  import { createEventDispatcher } from 'svelte';

  let cssClass = '';
  let isFocus = false;
  let isOpen = null;
  let term = '';
  let input = null;
  let list = null;

  export { cssClass as class };
  export let value = [];
  export let data = [];
  export let disabled = false;
  export let multiple = false;
  export let label = 'name';
  export let fallback = 'No names were found';
  export let placeholder = 'Search for names...';
  export let keys = ['name', 'value'];
  export let id = 'search';
  export let pk = 'id';

  const dispatch = createEventDispatcher();

  function search(e) {
    term = e.target.value.toLowerCase();
  }

  function pick(rowId) {
    if (!input || input.disabled) return;
    if (!value.includes(rowId)) {
      value = !multiple ? [rowId] : value.concat(rowId);
    } else {
      value = !multiple ? [] : value.filter(rid => rid !== rowId);
    }
    dispatch('change', value);
  }

  function open() {
    isOpen = true;
  }

  let t;
  function close() {
    clearTimeout(t);
    t = setTimeout(() => {
      if (document.activeElement === input) return;
      if (!isFocus && list && !list.contains(document.activeElement)) isOpen = null;
    }, 60);
  }

  function set() {
    isFocus = true;
  }

  function unset() {
    isFocus = false;
  }

  function check(e) {
    if (e.keyCode === 27) {
      if (list && list.contains(document.activeElement)) {
        e.stopPropagation();
        e.preventDefault();
        input.focus();
      }
    }
  }

  $: fixedProps = { ...(id ? { id } : null), class: cssClass || null };
  $: fixedType = multiple ? 'checkbox' : 'radio';
  $: filteredData = data.filter(item => {
    if (keys.some(key => item[key].toLowerCase().includes(term))) return true;
    return !term;
  });
</script>

<style>
  .search { position: relative; }
  .values {
    list-style-type: none;
    background-color: white;
    border: 1px solid silver;
    position: absolute;
    display: none;
    padding: 0;
    margin: 0;
  }
  .values[open] { display: block; }
  .option { vertical-align: middle; }
  .option label { display: flex; align-items: center; }

  :global(.input svg + input) { padding-left: 1.5em; }
  :global(.input svg) { position: absolute; top: .2em; height: 1em; }
</style>

<div role="listbox" class="search" on:keydown={check}>
  <label for={id} role="search" class="input">
    <slot name="before" />
    <input type="search" class="field" {disabled} {placeholder} {...fixedProps} bind:this={input} on:keyup={search} on:change={search} on:focus={open} on:blur={close} />
    <slot name="after" />
  </label>
  <ul role="menu" class="values" open={isOpen} bind:this={list} on:mouseenter={set} on:mouseleave={unset}>
    {#each filteredData as item}
      <li role="menuitem" class="option">
        <label for="{id}-{pk}-{item[pk]}">
          <input id="{id}-{pk}-{item[pk]}" type={fixedType} checked={value.includes(item[pk])} on:change={() => pick(item[pk])} on:blur={close} />
          <slot {item} name="item"><span class="value">{item[label]}</span></slot>
        </label>
      </li>
    {:else}
      <li><slot name="empty">{fallback}</slot></li>
    {/each}
  </ul>
</div>
