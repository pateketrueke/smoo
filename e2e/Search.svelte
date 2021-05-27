<script>
  import { Search } from '../src/main';

  let users = [
    { id: 1, name: 'Juanito Hace', value: 'j@do.e' },
    { id: 2, name: 'Carlangas Marca', value: 'cmrx@so.co' },
  ];

  let members = [];
  let multiple = false;

  function toggle(e) {
    multiple = e.target.checked;
  }
</script>

<label>
  <input type="checkbox" on:change={toggle} />
  Multiple?
</label>
<Search {multiple} data={users} bind:value={members}>
  <span slot="item" let:item>
    {item.name}<br /><small>{item.value}</small>
  </span>
  <svg slot="before" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
    <path fill-rule="evenodd" d="M14.53 15.59a8.25 8.25 0 111.06-1.06l5.69 5.69a.75.75 0 11-1.06 1.06l-5.69-5.69zM2.5 9.25a6.75 6.75 0 1111.74 4.547.746.746 0 00-.443.442A6.75 6.75 0 012.5 9.25z"></path>
  </svg>
</Search>
<pre>Got: {JSON.stringify(members)}</pre>
