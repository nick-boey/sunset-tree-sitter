import XCTest
import SwiftTreeSitter
import TreeSitterSunset

final class TreeSitterSunsetTests: XCTestCase {
    func testCanLoadGrammar() throws {
        let parser = Parser()
        let language = Language(language: tree_sitter_sunset())
        XCTAssertNoThrow(try parser.setLanguage(language),
                         "Error loading Sunset Language grammar")
    }
}
