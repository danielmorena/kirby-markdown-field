# Kirby Markdown Field

A textarea field for [Kirby CMS](https://github.com/getkirby/starterkit) with syntax highlighting for Markdown and Kirbytext.

<img src="screenshot.png" alt="Screenshot" width="75%">

Based on [CodeMirror](https://codemirror.net/2/), the syntax highlighting and field style matches the overall look of the Panel.

Similar to the `textarea` field, the `markdown` field supports:
- Drag & Drop from the sidebar
- `readonly` and `placeholder` field options
- `required `,`minLength` and `maxLength` field validations

## Installation

Clone or download:

1. [Clone](https://github.com/sebastianeberlein/kirby-markdown-field.git) or [download](https://github.com/sebastianeberlein/kirby-markdown-field/archive/master.zip) this repository.
2. Unzip the archive if needed and rename the folder to `markdown`.

**Make sure that the field folder structure looks like this:**

```text
site/fields/markdown/assets/
site/fields/markdown/markdown.php
```

## Setup

The `markdown` field can be used like a regular `textarea` field:

**Within a blueprint:**

```text
fields:
  text:
    title: Text
    type: markdown
```

**Within a template:**

```php
<?php echo $page->text()->kirbytext() ?>
```


## Changelog

**1.0**

- Initial release

## Requirements

- Kirby 2.0+ (only tested in Kirby 2.4+)

## Disclaimer

This plugin is provided "as is" with no guarantee. Use it at your own risk and always test it yourself before using it in a production environment. If you find any issues, please [create a new issue](https://github.com/sebastianeberlein/kirby-markdown-field/issues/new).
