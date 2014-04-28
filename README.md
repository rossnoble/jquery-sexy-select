jquery-sexy-select
==================

Yet another jquery UI select box wrapper!

## Usage

Create a regular old `select` element with options

```html
<select id="colors" name="colors">
  <option value="red">Red</option>
  <option value="blue">Blue</option>
  <option value="green">Green</option>
</select>
```

Include `jquery`, `jquery-ui` and `jquery-sexy-select` and bind to select box

```html
<script src="jquery.js"></script>
<script src="jquery-ui.js"></script>
<script src="jquery.sexyselect.js"></script>
<script>
  $(document).ready(function () {
    $('#colors').sexySelect();
  });
</script>
```

By default this will generate the following HTML:

```html
<div class="sexy-select">
  <div class="sexy-select-text">Red</div>
  <ul class="sexy-select-options" style="display: none">
    <li data-value="red" class="active">Red</li>
    <li data-value="blue">Blue</li>
    <li data-value="green">Green</li>
  </ul>
  <select id="colors" name="colors" style="display: none">
    <option value="red">Red</option>
    <option value="blue">Blue</option>
    <option value="green">Green</option>
  </select>
</div>
```
