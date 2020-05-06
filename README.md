# VuePress Plugin Zengarden Pagination

Provides Pagination for your VuePress blog 🚀

## Installation

```bash
npm i --save-dev vuepress-plugin-zengarden-pagination
# or 
yarn add -D vuepress-plugin-zengarden-pagination
```

## Usage

Add the following to your `config.js` or `index.js` file.

```javascript
['zengarden-pagination']
```

You should now have `this.$pagination` available.

## Configuration

If you don't have your posts in the default `posts` directory, or want to change anything else from the default setup, then you can do so.

```javascript
['zengarden-pagination', {
    title: 'Articles Page #',
    path: '/articles/',
    dist: '/articles/', // TODO: make use of this!
    frontmatter: {
        layout: 'Directory'
    }
}]
```
