# Grammar reference

This describes the grammar using an Extended Backus-Naur Form syntax.

By default rules skip spaces but not new lines. Rules in ALLCAPS do not skip spaces.

## Grammar syntax

```ebnf
() is a grouping
"" string literals
... is a range
| options
? is zero or one
+ is one or more
* is zero or more
```

## Declarations

The key statements that define create new identifiers.

```ebnf
elementFile               -> elementDeclaration* ;
scriptFile                -> ( ifStatement | variableAssignment )* ;

elementDeclaration        -> IDENTIFIER ("(" IDENTIFIER ")")? ":" NEWLINE
                            "inputs:" NEWLINE
                              inputAssignment*
                            "calculations:" NEWLINE
                              (ifStatement | variableAssignment)*
                            end NEWLINE ;

ifStatement              -> (ifCompStatement | ifCondStatement) ;

// Comparison statements have half of the condition after the if keyword and the remaining half
// half on each new condition branch. It is similar in nature to a switch or match statement.
ifCompStatement          -> if IDENTIFIER ":" NEWLINE
                            ( comparisonOperator term ":" NEWLINE
                              variableAssignment* )*
                            else ":" NEWLINE
                              variableAssignment *
                            end NEWLINE ;

ifCondStatement          -> if expression ":" NEWLINE
                           ( else if expression ":" NEWLINE
                            variableAssignment* )*
                           else ":" NEWLINE
                           variableAssignment*
                           end NEWLINE ;

variableAssignment      -> variableProperties "=" ( expression | ifExpression | NEWELEMENT )
                            descriptionShorthand? referenceShorthand? NEWLINE
                            metadataAssignment* NEWLINE ;

inputAssignment         -> variableProperties "=" ( value | NEWELEMENT )
                            descriptionShorthand? referenceShorthand? NEWLINE
                            metadataAssignment* NEWLINE ;

variableProperties      -> ( IDENTIFIER ( "<" MULTISYMBOL ">" )?
                            | IDENTIFIERSYMBOL ) unit ;

metadataAssignment      -> "s:" MULTISYMBOL NEWLINE
                            | "d:" STRING
                            | "l:" STRING
                            | "r:" STRING ;

IDENTIFIERSYMBOL        -> "@" ALPHA+ ALPHANUM* IDENTIFIERSUBSCRIPT ;
IDENTIFIERSUBSCRIPT     -> "_" ALPHANUM+ ;

descriptionShorthand    -> string ;
```

Design notes:

- `IDENTIFIERSYMBOL` is used for quickly creating variable identifiers that are defined only by a symbol.
  They can only consist of letters, numbers and valid underscores to signify subscripts.

## Expressions

Expressions are the parts of statements that evaluate to a value.

```ebnf
ifExpression            -> (ifCompExpression | ifCondExpression) ;

ifCondExpression        -> if expression ":" NEWLINE
                            expression NEWLINE
                           ( else if expression ":" NEWLINE
                            expression NEWLINE )*
                           else ":" NEWLINE
                           end NEWLINE ;

ifCompExpression        -> if IDENTIFIER ":" NEWLINE
                            ( comparisonOperator term ":" NEWLINE
                              expression NEWLINE )*
                            else ":" NEWLINE
                              expression NEWLINE
                            end NEWLINE ;

listExpression          -> "[" (expression ( "," expression )* )? "]" ;
dictionaryExpression    -> "[" keyValuePair ( "," keyValuePair )* "]" ;
keyValuePair            -> ( value | identifier ) ":" expression ;

expression              -> logic_or ;
logic_or                -> logic_and ( "or" logic_and )* ;
logic_and               -> equality ( "and" equality )* ;
equality                -> comparison ( ( "!=" | "==" ) comparison )* ;
comparison              -> term ( ( ">" | ">=" | "<" | "<=" ) term )* ;
term                    -> factor ( ( "-" | "+" ) factor )* ;
factor                  -> power ( ( "/" | "*" ) power )* ;
power                   -> unary ( "^" unary )*
unary                   -> "-" unary | primary ;
primary                 -> value | call
                            | IDENTIFIER | ELEMENTPROPERTY
                            | "(" expression ")";
call                    -> identifier "(" positionalArguments ")" ;
```

## Element properties

Element properties are variables that exist within an element.

```ebnf
namedArguments          -> namedArgument ("," namedArgument)* ;
positionalArguments     -> argument ("," argument)* ;
namedArgument           -> identifier ":" argument ;
argument                -> value | identifier ;
NEWELEMENT              -> IDENTIFIER ("(" (positionalArguments | namedArguments)? ")") ;
ELEMENTPROPERTY         -> IDENTIFIER ("." IDENTIFIER)* ;
```

Notes:

- You can't directly use an element's property without first assigning it to a variable.

## Units and values

```ebnf
quantity                -> NUMBER unit? ;

unit                    -> "{" unitFactor "}" ;
unitFactor              -> unitPower ( ( "/" | "*" ) unitPower )* ;
unitPower               -> unitPrimary ( ( "^" ) (unitPrimary | NUMBER) )* ;
unitPrimary             -> "(" unitFactor ")" | UNITKEYWORD
```

## Keywords

Reserved words used in the language.

```ebnf
IF                      -> "if" ;
ELSE                    -> "else" ;
END                     -> "end" ;
UNITKEYWORD             -> "m" | "mm" | ... ; \\ Include all unit keywords
```

## Lexical grammar

Basic grammar used to lex the input.

```ebnf
REFERENCE               -> <any char except "{" or "}">+ ;
multisymbol             -> SINGLESYMBOL+ ;
SINGLESYMBOL            -> "{" SINGLESYMBOL "}"
                            | LATEXWORD (SUBSCRIPT? | SUPERSCRIPT?)* ;
SUBSCRIPT               -> "_" SINGLESYMBOL ;
SUPERSCRIPT             -> "^" SINGLESYMBOL ;

IDENTIFIER              -> ( ALPHA | "_" ) ( ALPHANUMERIC | "_" )* ;
STRING                  -> "\"" <any char except "\"" or NEWLINE>* "\"" ;
MULTILINESTRING         -> "\"\"\"" <any char except "\"\"\"">* "\"\"\"" ;
LATEXWORD               -> (ALPHA | "*" | "'" )+ ;
ALPHANUMERIC            -> ALPHA | DIGIT ;
ALPHA                   -> "a" ... "z" | "A" ... "Z" ;

COMMENT                 -> "//" <any char except NEWLINE>* NEWLINE ;
REPORT                  -> "///" <any char except NEWLINE>* NEWLINE ;

NUMBER                  -> (FLOAT | INTEGER) EXPONENT? ;
EXPONENT                -> ("e" | "E") ("+" | "-" )? (FLOAT | INTEGER)
FLOAT                   -> DIGIT+ "." DIGIT+ ;
INTEGER                 -> DIGIT+ ;
DIGIT                   -> "0" ... "9" ;
BOOLEAN                 -> "true" | "false" ;
NEWLINE                 -> "\n" | "\r\n" ;
```
