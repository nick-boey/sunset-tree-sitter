package tree_sitter_sunset_test

import (
	"testing"

	tree_sitter "github.com/tree-sitter/go-tree-sitter"
	tree_sitter_sunset "github.com/nick-boey/sunset-docs/bindings/go"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_sunset.Language())
	if language == nil {
		t.Errorf("Error loading Sunset Language grammar")
	}
}
