/**
 * @file The Sunset Language is a programming language designed for engineering calculations.
 * @author Nicholas Boey <nboey@northrop.com.au>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "sunset",

  rules: {
    // TODO: add the actual grammar rules
    source_file: $ => "hello"
  }
});
