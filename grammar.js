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
    source_file: ($) => repeat(choice($.expression, $.variableAssignment)),

    // Statements
    variableAssignment: ($) =>
      seq(
        $.variableProperties,
        "=",
        choice(
          $.expression,
          // $.ifExpression,
          // $.newElement
        ),
        // TODO: Add shorthand description and reference
      ),
    // inputAssignment
    variableProperties: ($) =>
      seq(
        field("variableName", $.identifier),
        // Add multisymbol shorthand and identifier symbol shorthand
        field("unit", optional($.unit)),
      ),
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

    expression: ($) => $.term,
    // logicOr
    // logicAnd
    // equality: $ => seq($.term, optional(seq(choice("==", "!="), $.term))),
    // comparison: ($) =>
    //  seq($.term, optional(seq(choice(">", ">=", "<", "<="), $.term))),
    term: ($) =>
      choice(
        prec.left(
          3,
          seq(
            field("left", $.factor),
            field("operator", choice($.add, $.subtract)),
            field("right", $.factor),
          ),
        ),
        $.factor,
      ),
    factor: ($) =>
      choice(
        prec.left(
          2,
          seq(
            field("left", $.power),
            field("operator", choice($.multiply, $.divide)),
            field("right", $.power),
          ),
        ),
        $.power,
      ),
    power: ($) =>
      choice(
        prec.left(
          1,
          seq(field("operand", $._unary), "^", field("exponent", $._unary)),
        ),
        $._unary,
      ),
    _unary: ($) => seq(optional("-"), $._primary),
    _primary: ($) =>
      choice(
        $.quantity,
        // $.call,
        $.identifier,
        // $.elementProperty,
        seq("(", $.expression, ")"),
      ),
    // call: $ => seq($.identifier, "(", $.positionalArguments, ")"),

    // Properties
    // namedArguments: $ => seq($.namedArgument, repeat(seq(",", $.namedArgument))),
    // positionalArguments: $ => seq($.argument, repeat(seq(",", $.argument))),
    // namedArgument: $ => seq($.identifier, ":", $.argument),
    // argument: $ => choice($.quantity, $.identifier),
    // newElement: $ => seq($.identifier, optional(seq("(", choice($.positionalArguments, $.namedArguments), ")"))),
    // elementProperty: $ => seq($.identifier, repeat(seq(".", $.identifier))),

    // Units and values
    add: ($) => "+",
    subtract: ($) => "-",
    multiply: ($) => "*",
    divide: ($) => "/",
    quantity: ($) => seq($.number, optional($.unit)),
    unit: ($) => seq("{", $.unitFactor, "}"),
    unitFactor: ($) =>
      choice(
        prec.left(
          2,
          seq(
            field("left", $.unitPower),
            field("operator", token(choice("*", "/"))),
            field("right", $.unitPower),
          ),
        ),
        $.unitPower,
      ),
    unitPower: ($) =>
      choice(
        prec.left(
          1,
          seq(
            field("operand", $.unitPrimary),
            "^",
            field("exponent", $.number),
          ),
        ),
        $.unitPrimary,
      ),
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
    subscript: ($) => seq("j", $.singleSymbol),
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
