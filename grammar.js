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
    source_file: ($) => repeat(
      choice(
        $._expression,
        $.variableAssignment)
    ),

    // Statements
    variableAssignment: ($) =>
      seq(
        $.variableProperties,
        "=",
        choice(
          $._expression,
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

    _expression: ($) => choice($._arithmeticExpression),

    _comparisonExpression: $ => prec.left(
      0,
      seq(
        field("left", $._expression),
        choice($.lessThan, $.lessThanEqualTo, $.greaterThan, $.greaterThanEqualTo),
        field("right", $._expression),
      )
    ),

    _arithmeticExpression: $ => choice(
      $.number,
      $.identifier,
      $.binaryOperation,
      seq("(", $._arithmeticExpression, ")")
    ),

    binaryOperation: $ => choice(
      $._power,
      $._factor,
      $._term,
    ),

    _power: $ => prec.left(
      3,
      seq(
        field("left", $._expression),
        field("operator", $.power),
        field("right", $._expression)
      )
    ),
    _factor: $ => prec.left(
      2, seq(
        field("left", $._expression),
        field("operator", choice($.multiply, $.divide)),
        field("right", $._expression)
      )),
    _term: $ => prec.left(
      1, seq(
        field("left", $._expression),
        field("operator", choice($.add, $.subtract)),
        field("right", $._expression)
      )),
    //call: $ => seq($.identifier, "(", $.positionalArguments, ")"),

    // Properties
    // namedArguments: $ => seq($.namedArgument, repeat(seq(",", $.namedArgument))),
    // positionalArguments: $ => seq($.argument, repeat(seq(",", $.argument))),
    // namedArgument: $ => seq($.identifier, ":", $.argument),
    // argument: $ => choice($.quantity, $.identifier),
    // newElement: $ => seq($.identifier, optional(seq("(", choice($.positionalArguments, $.namedArguments), ")"))),
    // elementProperty: $ => seq($.identifier, repeat(seq(".", $.identifier))),

    // Units and values
    quantity: ($) => seq($.number, optional($.unit)),
    unit: $ => seq(
      "{", $._unitExpression, "}"
    ),
    _unitExpression: ($) => choice(
      $.unitKeyword,
      $.unitBinaryOperation,
      seq("(", $._unitExpression, ")")
    ),
    unitBinaryOperation: $ => choice(
      $._unitPower,
      $._unitFactor,
    ),
    _unitPower: $ => prec.left(
      3,
      seq(
        field("left", $._unitExpression),
        field("operator", $.power),
        field("right", $.integer)
      )
    ),
    _unitFactor: $ => prec.left(
      2, seq(
        field("left", $._unitExpression),
        field("operator", choice($.multiply, $.divide)),
        field("right", $._unitExpression)
      )
    ),

    // Keywords
    if: ($) => "if",
    else: ($) => "else",
    end: ($) => "end",
    // TODO: Include more units
    unitKeyword: ($) => choice("mm", "m", "km"),

    // Operators
    multiply: $ => "*",
    divide: $ => "/",
    add: $ => "+",
    subtract: $ => "-",
    power: $ => "^",
    lessThan: ($) => "<",
    greaterThan: $ => ">",
    lessThanEqualTo: $ => "<=",
    greaterThanEqualTo: $ => ">=",
    equalTo: $ => "==",
    notEqualTo: $ => "!=",
    not: $ => "!",

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
