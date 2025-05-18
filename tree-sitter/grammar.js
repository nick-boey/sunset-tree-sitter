/**
 * @file The Sunset Language is a programming language designed for engineering calculations.
 * @author Nicholas Boey <nboey@northrop.com.au>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "sunset",

  extras: ($) => [$.comment, /[\s]+/],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat(choice($.number, $.identifier, $.if)),

    // Units and values
    quantity: ($) => seq($.number, optional($.unit)),
    unit: ($) => seq("{", $.unit_factor, "}"),
    unit_factor: ($) =>
      seq($.unit_power, repeat(seq(choice("*", "/"), $.unit_power))),
    unit_power: ($) =>
      seq($.unit_primary, optional(seq("^", choice($.integer)))),
    unit_primary: ($) => choice(seq("(", $.unit_factor, ")"), $.unit_keyword),

    // Keywords
    if: ($) => "if",
    else: ($) => "else",
    end: ($) => "end",
    // TODO: Include more units
    unit_keyword: ($) => choice("mm", "m", "km"),

    // Lexical grammar
    // Latex
    latexWord: ($) => /[a-zA-Z0-9*']+/,
    subscript: ($) => seq("_", $.singleSymbol),
    superscript: ($) => seq("^", $.singleSymbol),
    singleSymbol: ($) =>
      choice(
        seq("{", $.singleSymbol, "}"),
        seq($.latexWord, repeat(choice($.subscript, $.superscript))),
      ),

    identifier: ($) => token(/[a-zA-Z_][a-zA-Z0-9]*/),
    string: ($) => seq('"', /[^\r\n\u2028\u2029]*/, '"'),

    number: ($) => seq(choice($.float, $.integer), optional($.exponent)),
    // TODO: This doesn't work and gets picked up as an identifier instead
    exponent: ($) =>
      seq(
        choice("e", "E"),
        optional(choice("+", "-")),
        choice($.float, $.integer),
      ),
    float: ($) => seq($.integer, ".", $.integer),
    integer: ($) => /[0-9]+/,
    boolean: ($) => choice("true", "false"),

    // Comments
    comment: ($) => token(/\/\/.*/),
  },
});
