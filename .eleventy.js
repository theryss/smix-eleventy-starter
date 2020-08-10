module.exports = function(config) {
	// *** Collection imports
	const collections = require("./eleventy/collections");

	// *** Filter imports
	const collectionFilters = require("./eleventy/filters/collections");
	const urlFilters = require("./eleventy/filters/urls");
	const dateFilters = require("./eleventy/filters/dates");

	// *** Shortcode imports
	const shortcodes = require("./eleventy/shortcodes");

	// *** Misc imports
	const env = require("./eleventy/env");

	// *** Misc Options
	// Additional files to watch for changes
	config.addWatchTarget("./eleventy/");

	// *** Forestry CMS Config
	// Run serve on 0.0.0.0 on staging
	if (env.is11tyStaging)
		config.setBrowserSyncConfig({
			host: "0.0.0.0"
		});

	// Copy as-is from root to output path
	// We can avoid this on development env
	if (env.is11tyStaging || env.is11tyProduction)
		config.addPassthroughCopy("admin");

	// *** Plugins
	config.addPlugin(require("@11ty/eleventy-plugin-rss"));

	// *** Shortcodes
	// Jekyll replacement for post_url tag as an 11ty shortcode
	config.addShortcode("getUrl", shortcodes.postUrl);
	config.addShortcode("getOwnerInfo", shortcodes.getOwnerInfo);
	config.addShortcode("isOldPost", shortcodes.isOldPost);

	// *** Filters
	// Dates
	config.addFilter("friendlyDate", dateFilters.friendlyDate);
	config.addFilter("dateInISO8601", dateFilters.dateInISO8601);
	// Filter posts per tag
	config.addFilter("byTag", collectionFilters.byTag);
	// Absolute url
	config.addFilter("absoluteUrl", urlFilters.absoluteUrl);
	// Parse the date using our own date filters to account for any article updates; overriding 11ty's RSS plugin
	config.addNunjucksFilter("rssLastUpdatedDate", dateFilters.lastUpdatedDate);
	// config.addFilter("htmlToAbsoluteUrls", feedFilters.htmlToAbsoluteUrls);

	// *** Collections
	// Articles
	config.addCollection("articles", collections.articles);

	const { Liquid } = require("liquidjs");
	const liquidJsOptions = {
		extname: ".liquid",
		dynamicPartials: false,
		strict_filters: true,
		root: ["src/includes", "src/layouts"]
	};
	const liquidEngine = new Liquid(liquidJsOptions);
	config.setLibrary("liquid", liquidEngine);

	return {
		pathPrefix: "/", // useful for GitHub pages
		dir: {
			input: "./",
			output: "dist",
			includes: "src/includes",
			layouts: "src/layouts",
			data: "src/data"
		}
	};
};
