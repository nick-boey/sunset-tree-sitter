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
