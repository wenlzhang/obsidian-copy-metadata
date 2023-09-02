# Copy Metadata

![](https://img.shields.io/github/license/wenlzhang/obsidian-copy-metadata) ![](https://img.shields.io/github/v/release/wenlzhang/obsidian-copy-metadata?style=flat-square) ![](https://img.shields.io/github/downloads/wenlzhang/obsidian-copy-metadata/total)

An [Obsidian](https://obsidian.md/) plugin to copy metadata to clipboard and insert it into file name.

## Features

- Copy file creation time into clipboard
- Append file creation time into file name

This plugin will automatically update a modified property in your frontmatter/YAML when you edit a note.

## Usage

Copy Metadata uses [moment.js](https://momentjs.com/docs/#/displaying/format/) to format the metadata time info. In addition, **square brackets** are needed to surround the content that is not part of the format string.

- For example, if ` - 202301011200` is the desired text, then `[ - ]YYYYMMDDHHmm` needs to be configured in settings.

## Credits

- [Obsidian: Update Frontmatter Modified Date](https://github.com/alangrainger/obsidian-frontmatter-modified-date)
    - This plugin serves as a starting template.

## Support me

<a href='https://ko-fi.com/C0C66C1TB' target='_blank'><img height='36' style='border:0px;height:36px;' src='https://storage.ko-fi.com/cdn/kofi1.png?v=3' border='0' alt='Buy Me a Coffee at ko-fi.com' /></a>
