<script>
  import { Search } from '../src/main';

  let users = [
    { id: 1, name: 'Juanito Hace', value: 'j@do.e' },
    { id: 2, name: 'Carlangas Marca', value: 'cmrx@so.co' },
  ];

  let ev = 'close';
  let members = [];
  let options = {
    nofilter: false,
    multiple: false,
    disabled: false,
  };

  function toggle(e, key) {
    options = { ...options, [key]: e.target.checked };
    members = [];
  }

  function set(event) {
    return () => { ev = event; };
  }
</script>

<Search {...options} data={users} bind:value={members} on:blur={set('blur')} on:focus={set('focus')} on:open={set('open')} on:close={set('close')}>
  <span slot="item" let:item>
    {item.name}<br /><small>{item.value}</small>
  </span>
  <svg slot="before" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill-rule="evenodd" d="M14.53 15.59a8.25 8.25 0 111.06-1.06l5.69 5.69a.75.75 0 11-1.06 1.06l-5.69-5.69zM2.5 9.25a6.75 6.75 0 1111.74 4.547.746.746 0 00-.443.442A6.75 6.75 0 012.5 9.25z"></path>
  </svg>
  <span slot="after">e: {ev}</span>
</Search>
<label><input type="checkbox" on:change={e => toggle(e, 'multiple')} /> Multiple?</label>
<label><input type="checkbox" on:change={e => toggle(e, 'nofilter')} /> No filter?</label>
<label><input type="checkbox" on:change={e => toggle(e, 'disabled')} /> Disabled?</label>
<label><input type="checkbox" on:change={e => toggle(e, 'autoclose')} /> Auto close?</label>
<pre>Got: {JSON.stringify(members)}</pre>
