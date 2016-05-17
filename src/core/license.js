import $ from 'jquery';
import topcoat from 'topcoat/css/topcoat-desktop-dark.min.css'; // eslint-disable-line no-unused-vars

$('License').each(function(){
	let licenseName = this.getAttribute('name');
	let licenseText = $(`script[type=license][name=${licenseName}]`).text()
		.replace(/\{yyyy\}/g, this.getAttribute('year'))
		.replace(/\{owner\}/g, this.getAttribute('owner'))
		.replace(/^[\n]+/g, '')
		.replace(/[\n]+$/g, '');

	let license = $('<pre class="license" />').text(licenseText);
	$(this).replaceWith(license);
});
