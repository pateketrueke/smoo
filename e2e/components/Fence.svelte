<script>
  import { Fence } from 'smoo';

  let show;
  let sub;

  function toggle() {
    show = !show;
  }

  function open() {
    sub = !sub;
  }
</script>

<button on:click={toggle}>Open modal</button>
<Fence modal autofocus bind:visible={show} on:cancel={toggle} on:submit={toggle}>
  <h3>It works.</h3>
  <input type="hidden" />
  <p><input type="number" readonly /></p>
  <p><textarea disabled>OK</textarea></p>
  <p><input type="search" /></p>
  <p><input type="text" required /></p>
  <p>
    <button type="button" on:click={open}>nested</button>
    <button type="submit">close</button>
  </p>
  <details>
    <summary>Focus me</summary>
    <button>OSOM</button>
  </details>
  <select>
    <option>1</option>
    <option>2</option>
    <option>3</option>
  </select>
  <a href="/">Just a link</a>
  <a href="/" tabindex="-1">Just a link</a>
  <div slot="after">
    <Fence modal autofocus bind:visible={sub} on:cancel={open} on:submit={open}>
      <h4>Sub modal</h4>
      <input type="number" />
      <button nofocus type="button" on:click={open}>x</button>
    </Fence>
  </div>
</Fence>
