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
<script src="jquery-sexy-select.js"></script>
<script>
  $(document).ready(function () {
    $('#colors').sexySelect();
  });
</script>
```

