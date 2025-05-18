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
    source_file: ($) => choice($.float, $.integer),

    // Latex word
    // Alphanumeric
    // Comment

    number: ($) => seq(choice($.float, $.integer), optional($.exponent)),

    exponent: ($) =>
      seq(
        choice("e", "E"),
        optional(choice("+", "-")),
        choice($.float, $.integer),
      ),

    float: ($) => seq($.integer, ".", $.integer),

    integer: ($) => /[0-9]+/,

    boolean: ($) => choice("true", "false"),

    newline: ($) => choice("\r\n", "\n"),
  },
});
