# Sunset Language - Tree Sitter

This repository contains the [Tree-sitter](https:"//tree-sitter.github.io/tree-sitter") grammar definitions for the Sunset Language.

## Developer guide

Install the [Tree-sitter CLI](https://github.com/tree-sitter/tree-sitter/tree/master/cli).

If you have `rustup` installed, the command `cargo install tree-sitter-cli` is the simplest way to do this.

Run this command to generate the C code for the grammar.

```bash
tree-sitter generate
```

To test this on a file named `example.sunset`, use the following CLI command:

```bash
tree-sitter parse example.sunset
```

The grammar is contained in the `grammar.js` file - edit it and re-run `tree-sitter generate` to test the updated grammar. Refer to the [Tree-sitter documentation](https://tree-sitter.github.io/tree-sitter/creating-parsers/3-writing-the-grammar.html) for further information on the Tree-sitter DSL.

### Testing

Automated testing has been set up in the ./tree-sitter/tests/corpus/ folder. These may be run using the following command:

```bash
tree-sitter test
```

For more information on writing tests, see the [Tree-sitter documentation](https://tree-sitter.github.io/tree-sitter/creating-parsers/5-writing-tests.html).

## Installation instructions

### Neovim (`nvim-treesitter`)

To install this grammar in Neovim and enable syntax higlighting, you will need to:

1. Add this parser to the [`nvim-treesitter` plugin configuration](https://github.com/nvim-treesitter/nvim-treesitter?tab=readme-ov-file#adding-parsers).
This will allow nvim-treesitter to find the repository, download and compile the file.
You will also need to create a new file type for the Sunset language to associate the `.sunset` file extension.

This requires the following to be added to you `init.lua` configuration file:

```lua
-- Associate the .sunset file extension with the file type
vim.filetype.add({
  extension = {
    sunset = "sunset",
  },
})

-- Configure nvim-treesitter
local parser_config = require("nvim-treesitter.parsers").get_parser_configs()
parser_config.sunset = {
  install_info = {
    url = "https://github.com/sunset-lang/tree-sitter-sunset",
    branch = "main",
  },
}
```

2. Add the highlighting query (`queries\highlights.scm`) to the `nvim-treesitter` queries folder, which is in the Neovim runtime folder.
This is because `nvim-treesitter` [does not copy the queries by default](https://github.com/nvim-treesitter/nvim-treesitter?tab=readme-ov-file#adding-queries).
On LazyVim installed on Windows, this folder is located by default at `%APPDATA%\Local\nvim-data\lazy\nvim-treesitter\queries\sunset\`. You may need to create the `sunset` folder.

3. Check that the highlighting feature is installed with `:checkhealth`. Under `nvim-treesitter`, you should now see the `sunset` language with a tick next to the highlighting feature.
