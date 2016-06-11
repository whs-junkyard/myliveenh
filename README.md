# MyLive Enhancements

- [Download on Web Store](https://chrome.google.com/webstore/detail/mylive-enhancements/ccfgikjibmnofldagnilnppfpefdekok)
- [Talk to us on MyLive Talk Facebook group](https://www.facebook.com/groups/MyLiveTalk/)

## Generating release

Use `gulp release` to do a full build and generate release.zip.

Export `MOZ=true` to disable modules that are incompatible with Firefox.

Make sure the old build folder are removed first, because otherwise contents inside will be copied to the zip.

## Gulp targets

- default: build for development
- watch: auto compile files on changes. Does not include files used in settings page
- release: build, compress and zip release. Cleaning the build directory (`rm -rf build`) before running this is highly recommended.
- build-emoji-db: update src/emojipicker/emoji.json

## Developing new plugins

Each plugin are CommonJS packages located in `src/`. To create plugins:

1. Create a subfolder in `src/`
2. Create package.json:

   ```json
   {
	   	"name": "<plugin name>",
	   	"description": "<setting name>",
	   	"category": "<setting category>",
	   	"default_enabled": true,
	   	"private": true,
	   	"content_scripts": [
	   		{
	   			"matches": ["http://mylive.in.th/"],
	   			"js": ["content_script.js"],
	   			"css": ["content_script.css"],
	   			"run_at": "document_end",
	   			"stop_angular": true
	   		}
	   	]
   }
   ```

   Make sure `"private": true` is listed, the package name is the same as folder name.

3. Create `content_script.js`

   ```js
   import $ from 'jquery';
   import plugin from 'core/plugin';

   plugin('<plugin name>', () => {
       // plugin code goes here
   });
   ```

   The `plugin` command checks whether the plugin is enabled in settings, and call the callback if it is. It also prevent multiple loading of the module.

4. Create `content_script.scss`. (`scss` is automatically compiled to `css` during build step). Note that it will ALWAYS load regardless of plugin status.

## package.json

<tools/chrome-manifest.js> will collect some chrome-related metadata from CommonJS package file automatically. Here are the metadata collected:

- `permissions`: See [permissions](https://developer.chrome.com/extensions/declare_permissions) in Chrome docs. The hardcoded permissions are:
  - `http://mylive.in.th/*``
  - `http://*.mylive.in.th/*``
  - `storage`
- `content_scripts`: See [content script](https://developer.chrome.com/extensions/content_scripts) in Chrome docs. The [build script](tools/merge-content-script.js) will merge items with same permissions automatically.
  - Additionally, `"stop_angular": true` can be listed alongside `js` to disable angular for that page. To resume angular execution, pass `true` as the third argument to `plugin`.

The settings page and loader also collect additional data:

- `description2` (String): Help text
- `no_disable` (Boolean): Hide disable option from settings page. This is for core modules only.
- `settings` (Object): Setting options. The enable/disable option is automatically generated, this is for additional options.
  - See [notifyfollowing](src/notifyfollowing/package.json) for example
- `default_enabled` (Boolean): Is this plugin enabled after MyLive Enhancements is installed/updated.
