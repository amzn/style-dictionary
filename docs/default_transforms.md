## Default Transforms
[lib/common/transforms.js](https://github.com/amzn/style-dictionary/blob/master/lib/common/transforms.js)

<table>
  <thead>
   <tr>
     <th>Name</th>
     <th>Type</th>
     <th>Matcher</th>
     <th>Description</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>attribute/cti</td>
      <td>attribute</td>
      <td>all</td>
      <td>Adds: category, type, item, subitem, state. Based on path of the property.</td>
    </tr>
    <tr>
      <td>attribute/color</td>
      <td>attribute</td>
      <td>function isColor(prop) {
  return prop.attributes.category === 'color';
}</td>
      <td>Adds: hex, hsl, hsv, rgb, red, blue, green.</td>
    </tr>
    <tr>
      <td>name/human</td>
      <td>name</td>
      <td>all</td>
      <td>padding base</td>
    </tr>
    <tr>
      <td>name/cti/camel</td>
      <td>name</td>
      <td>all</td>
      <td>sizePaddingBase</td>
    </tr>
    <tr>
      <td>name/cti/kebab</td>
      <td>name</td>
      <td>all</td>
      <td>size-padding-base</td>
    </tr>
    <tr>
      <td>name/cti/snake</td>
      <td>name</td>
      <td>all</td>
      <td>size_padding_base</td>
    </tr>
    <tr>
      <td>name/cti/constant</td>
      <td>name</td>
      <td>all</td>
      <td>SIZE_PADDING_BASE</td>
    </tr>
    <tr>
      <td>name/ti/constant</td>
      <td>name</td>
      <td>all</td>
      <td>PADDING_BASE</td>
    </tr>
    <tr>
      <td>name/cti/pascal</td>
      <td>name</td>
      <td>all</td>
      <td>SizePaddingBase</td>
    </tr>
    <tr>
      <td>color/rgb</td>
      <td>value</td>
      <td>function isColor(prop) {
  return prop.attributes.category === 'color';
}</td>
      <td>rgb(255,255,255)</td>
    </tr>
    <tr>
      <td>color/hex</td>
      <td>value</td>
      <td>function isColor(prop) {
  return prop.attributes.category === 'color';
}</td>
      <td>#ffffff</td>
    </tr>
    <tr>
      <td>color/hex8</td>
      <td>value</td>
      <td>function isColor(prop) {
  return prop.attributes.category === 'color';
}</td>
      <td>#ffffffff</td>
    </tr>
    <tr>
      <td>color/hex8android</td>
      <td>value</td>
      <td>function isColor(prop) {
  return prop.attributes.category === 'color';
}</td>
      <td>#ffffff Android puts the alpha channel first, which is not the standard</td>
    </tr>
    <tr>
      <td>color/UIColor</td>
      <td>value</td>
      <td>function isColor(prop) {
  return prop.attributes.category === 'color';
}</td>
      <td>[UIColor colorWithRed:0.80f green:0.80f blue:0.80f alpha:1.0f]</td>
    </tr>
    <tr>
      <td>size/sp</td>
      <td>value</td>
      <td>function isFontSize(prop) {
  return prop.attributes.category === 'size' &&
    (prop.attributes.type === 'font' || prop.attributes.type === 'icon');
}</td>
      <td>10.0sp</td>
    </tr>
    <tr>
      <td>size/dp</td>
      <td>value</td>
      <td>function isNotFontSize(prop) {
  return prop.attributes.category === 'size' &&
    prop.attributes.type !== 'font' &&
    prop.attributes.type !== 'icon';
}</td>
      <td>10.0dp</td>
    </tr>
    <tr>
      <td>size/remToSp</td>
      <td>value</td>
      <td>function isFontSize(prop) {
  return prop.attributes.category === 'size' &&
    (prop.attributes.type === 'font' || prop.attributes.type === 'icon');
}</td>
      <td>160.0sp (value * 16)</td>
    </tr>
    <tr>
      <td>size/remToDp</td>
      <td>value</td>
      <td>function isNotFontSize(prop) {
  return prop.attributes.category === 'size' &&
    prop.attributes.type !== 'font' &&
    prop.attributes.type !== 'icon';
}</td>
      <td>160.0sp (value * 16)</td>
    </tr>
    <tr>
      <td>size/px</td>
      <td>value</td>
      <td>function isSize(prop) {
  return prop.attributes.category === 'size';
}</td>
      <td>10px</td>
    </tr>
    <tr>
      <td>size/rem</td>
      <td>value</td>
      <td>function isSize(prop) {
  return prop.attributes.category === 'size';
}</td>
      <td>10rem</td>
    </tr>
    <tr>
      <td>size/remToPt</td>
      <td>value</td>
      <td>function isSize(prop) {
  return prop.attributes.category === 'size';
}</td>
      <td>160.00pt (value * 16)</td>
    </tr>
    <tr>
      <td>size/remToPx</td>
      <td>value</td>
      <td>function isSize(prop) {
  return prop.attributes.category === 'size';
}</td>
      <td>160px (value * 16)</td>
    </tr>
    <tr>
      <td>content/icon</td>
      <td>value</td>
      <td>function (prop) {
      return prop.attributes.category === 'content' && prop.attributes.type === 'icon';
    }</td>
      <td></td>
    </tr>
    <tr>
      <td>content/quote</td>
      <td>value</td>
      <td>function (prop) {
      return prop.attributes.category === 'content';
    }</td>
      <td>'arrow_drop_down'</td>
    </tr>
    <tr>
      <td>content/objC/literal</td>
      <td>value</td>
      <td>function (prop) {
      return prop.attributes.category === 'content';
    }</td>
      <td>@"arrow_drop_down"</td>
    </tr>
    <tr>
      <td>font/objC/literal</td>
      <td>value</td>
      <td>function (prop) {
      return prop.attributes.category === 'font';
    }</td>
      <td>@"arrow_drop_down"</td>
    </tr>
    <tr>
      <td>time/seconds</td>
      <td>value</td>
      <td>function (prop) {
      return prop.attributes.category === 'time';
    }</td>
      <td>0.5s (value / 1000)</td>
    </tr>
    <tr>
      <td>asset/base64</td>
      <td>value</td>
      <td>function (prop) {
      return prop.attributes.category === 'asset';
    }</td>
      <td>Converts the file to a base64 string</td>
    </tr>
    <tr>
      <td>asset/path</td>
      <td>value</td>
      <td>function (prop) {
      return prop.attributes.category === 'asset';
    }</td>
      <td>[pwd]/value</td>
    </tr>
    <tr>
      <td>asset/objC/literal</td>
      <td>value</td>
      <td>function (prop) {
      return prop.attributes.category === 'asset';
    }</td>
      <td>@"asset"</td>
    </tr>
  </tbody>
</table>