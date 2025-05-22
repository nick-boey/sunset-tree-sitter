/**
 * @file The Sunset Language is a programming language designed for engineering calculations.
 * @author Nicholas Boey <nboey@northrop.com.au>
 * @license MIT
 */

/// <reference types="tree-sitter-cli/dsl" />
// @ts-check

module.exports = grammar({
  name: "sunset",

  // Comments and whitespace as extras
  extras: ($) => [$.comment, /[\s]+/],

  word: ($) => $.identifier,

  rules: {
    source_file: ($) => repeat(choice($.number, $.identifier)),

    // Statements
    variableAssignment = $ => seq($.variableProperties, choice($.value, $.))
    // inputAssignment
    // variableProperties
    // metadataAssignment
    // identifierSymbol
    // identifierSubscript
    // descriptionShorthand

    // Expressions
    // ifExpression
    // ifCondExpression
    // ifCompExpression
    // listExpression
    // dictionaryExpression
    // keyValuePair: $ => seq(choice($.identifier))
    // logicOr
    // logicAnd
    // equality: $ => seq($.term, optional(seq(choice("==", "!="), $.term))),
    comparison: $ => seq($.term, optional(seq(choice(">", ">=", "<", "<="), $.term))),
    term: $ => seq($.factor, repeat(seq(choice("-", "+"), $.factor))),
    factor: $ => seq($.power, repeat(seq(choice("/", "*"), $.power))),
    power: $ => seq($.unary, repeat(seq("^", $.unary))),
    unary: $ => seq("-", choice($.unary, $.primary)),
    primary: $ => choice(
      $.quantity,
      // $.call,
      $.identifier,
      // $.elementProperty,
      seq("(", $.expression, ")")
    ),
    // call: $ => seq($.identifier, "(", $.positionalArguments, ")"),

    // Properties
    // namedArguments: $ => seq($.named_argument, repeat(seq(",", $.namedArgument))),
    // positionalArguments: $ => seq($.argument, repeat(seq(",", $.argument))),
    // namedArgument: $ => seq($.identifier, ":", $.argument),
    // argument: $ => choice($.quantity, $.identifier),
    // newElement: $ => seq($.identifier, optional(seq("(", choice($.positionalArguments, $.namedArguments), ")"))),
    // elementProperty: $ => seq($.identifier, repeat(seq(".", $.identifier))),

    // Units and values
    quantity: ($) => seq($.number, optional($.unit)),
    unit: ($) => seq("{", $.unitFactor, "}"),
    unitFactor: ($) =>
      seq($.unit_power, repeat(seq(choice("*", "/"), $.unitPower))),
    unitPower: ($) =>
      seq($.unit_primary, optional(seq("^", choice($.integer)))),
    unitPrimary: ($) => choice(seq("(", $.unitFactor, ")"), $.unitKeyword),

    // Keywords
    if: ($) => "if",
    else: ($) => "else",
    end: ($) => "end",
    // TODO: Include more units
    unitKeyword: ($) => choice("mm", "m", "km"),

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

    // Replace with regex
    number: ($) => seq(choice($.float, $.integer), optional($.exponent)),
    // TODO: This doesn't work and gets picked up as an identifier instead
    exponent: ($) =>
      seq(
        choice("e", "E"),
        optional(choice("+", "-")),
        choice($.float, $.integer),
      ),
    // TODO: Replace with regex
    float: ($) => seq($.integer, ".", $.integer),
    integer: ($) => /[0-9]+/,
    boolean: ($) => choice("true", "false"),

    // Comments
    comment: ($) => token(/\/\/.*/),
  },
});
