const dayjs = require('dayjs')
const pathlib = require('path')

module.exports = (options, context) => {

    /**
     * setup configuration of this plugin
     */
    let config = {
        limit: options.limit || 5,
        path: options.path || '/posts/',
        title: options.title || 'Posts Page #'
    }

    /**
     * filter the pages by the path from the configuration
     */
    let filterByPath = options.filterByPath || function(page) {
        return page.path.startsWith(options.path)
    }

    /**
     * sort the posts by day from date in frontmatter
     */
    let sortPosts = function (prev, next) {
        const prevTime = dayjs(prev.frontmatter.date);
        const nextTime = dayjs(next.frontmatter.date);
        return prevTime - nextTime > 0 ? -1 : 1;
    }

    return {

        name: 'vuepress-plugin-zengarden-pagination',

        /**
         * generate some pages
         */
        additionalPages() {

            // only work with pages that are in the given path
            // - see configuration
            let posts = context.pages.filter(filterByPath)

            // only work with pages that are published
            // - see vuepress-plugin-zengarden-publish
            posts = posts.filter(function(page) {
                return page.frontmatter.publish
            })

            // sort the posts
            // - see configuration
            posts.sort(sortPosts)

            // create container for the pages to create
            let pages = []

            // chunk the posts by limit
            for (let i = 0; i < posts.length; i += config.limit) {

                // create pagination page index
                let page_title_index = i / config.limit + 1
                let pages_array_index = i / config.limit

                // generate page title
                let title = config.title.replace('#', page_title_index)

                // overwrite title for posts pagination index page (/posts/index.html)
                if (!pages_array_index) {
                    title = title.slice(0, title.indexOf(' '))
                }

                // create page path
                let path = config.path
                if (pages_array_index) {
                    path += page_title_index + '/'
                }

                // push page info to the array of pages
                pages.push({
                    path: path,
                    title: title,
                    frontmatter: {
                        publish: false, // set to false so other plugins using this value don't include this page
                        pagination: {
                            index: pages_array_index,
                            page: page_title_index
                        },
                        layout: options.frontmatter.layout
                    }
                })

            }

            // return the pages to create
            return pages
        },

        /**
         * generate dynamic modules
         */
        clientDynamicModules() {
            // prefix to be used as the folder name in @vuepress/core/.temp/dynamic
            const DIRECTORY_PREFIX = 'zengarden-pagination'

            // stringify the options of the plugin
            let options_json_string = JSON.stringify(config)

            // actually create the dynamic modules
            return [
                {
                    name: `${DIRECTORY_PREFIX}/options.js`,
                    content: `export default ${options_json_string}`
                }
            ]
        },

        /**
         * enhance app files
         */
        enhanceAppFiles() {
            
            // add the $pagination object to the vue root element
            return [
                pathlib.resolve(__dirname, 'pagination.js')
            ]
        },

    }
}