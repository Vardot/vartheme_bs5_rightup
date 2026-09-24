@smoke @regression @any @theme @search
Feature: Vartheme BS5 Rightup - Header search
      As a site visitor
      I want the search icon in the site header to open a search bar under the header
      So that I can search the site from wherever I am without leaving the page.

  @check @local @development @staging @production
  Scenario: Check that the site header carries the search icon on the home page
    Given I am an anonymous user
     When I go to "/"
      And wait
     Then "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button" should be visible
      And "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button" should have attribute "aria-expanded" with value "false"
      And "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button" should have attribute "aria-label" with value "Search"
      And the search toggle should show the "search" icon

  @check @local @development @staging @production
  Scenario: Check that the search icon reveals the search bar under the header
    Given I am an anonymous user
     When I go to "/"
      And wait
      And I click on the element "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button"
     Then ".icon-toggle--panel-full .icon-toggle__panel" should be visible
      And ".icon-toggle--panel-full .icon-toggle__panel input[name='keywords']" should be visible
      And ".icon-toggle--panel-full .icon-toggle__panel input[name='keywords']" should have attribute "placeholder" with value "Search by keyword"
      And ".icon-toggle--panel-full .icon-toggle__panel input[name='keywords']" should be focused
      And ".icon-toggle--panel-full .icon-toggle__panel .form-actions .btn" should be visible
      And ".icon-toggle--panel-full .icon-toggle__panel .form-actions .btn" should have value "Search"
      And the search bar should sit directly below the site header
      And the page fade should start below the search bar

  @check @local @development @staging @production
  Scenario: Check that the open search reports itself expanded and shows the close icon
    Given I am an anonymous user
     When I go to "/"
      And wait
      And I click on the element "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button"
     Then "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button" should have attribute "aria-expanded" with value "true"
      And "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button" should have attribute "aria-label" with value "Close search"
      And the search toggle should show the "close" icon

  @check @local @development @staging @production
  Scenario: Check that pressing Escape closes the search and returns focus to the icon
    Given I am an anonymous user
     When I go to "/"
      And wait
      And I click on the element "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button"
     Then ".icon-toggle--panel-full .icon-toggle__panel" should be visible
     When I press the key "Escape"
     Then ".icon-toggle--panel-full .icon-toggle__panel" should not be visible
      And "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button" should have attribute "aria-expanded" with value "false"
      And "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button" should be focused
      And the search toggle should show the "search" icon

  @check @local @development @staging @production
  Scenario: Check that clicking the dimmed page closes the search
    Given I am an anonymous user
     When I go to "/"
      And wait
      And I click on the element "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button"
     Then ".icon-toggle--panel-full .icon-toggle__scrim" should be visible
     When I click on the element ".icon-toggle--panel-full .icon-toggle__scrim"
     Then ".icon-toggle--panel-full .icon-toggle__panel" should not be visible
      And ".icon-toggle--panel-full .icon-toggle__scrim" should not be visible
      And "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button" should have attribute "aria-expanded" with value "false"

  @check @local @development @staging @production
  Scenario: Check that searching a keyword lands on the search results page
    Given I am an anonymous user
     When I go to "/"
      And wait
      And I click on the element "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button"
      And I fill in the field ".icon-toggle--panel-full .icon-toggle__panel input[name='keywords']" with "podcast"
      And I click on the element ".icon-toggle--panel-full .icon-toggle__panel .form-actions .btn"
      And wait
     Then the url should match "/search"
      And current url should have the "keywords" parameter with the "podcast" value
      And "input[name='keywords']" should have value "podcast"

  @check @local @development @staging @production
  Scenario: Check that the search results page hides the header search icon
    Given I am an anonymous user
     When I go to "/search?keywords=podcast"
      And wait
     Then "main .view-search" should be visible
      And current url should have the "keywords" parameter with the "podcast" value
      And "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button" should not be visible
      And "header[role='banner'] .icon-toggle--panel-full .icon-toggle__panel" should not be visible

  @check @local @development @staging @production
  Scenario: Check that the search results page carries its own search field
    Given I am an anonymous user
     When I go to "/search?keywords=podcast"
      And wait
     Then "main .view-search" should be visible
      And "main input[name='keywords']" should be visible
      And "main input[name='keywords']" should have value "podcast"

  @check @a11y @local @development @staging @production
  Scenario: Check that the open header search has no serious accessibility violations
    Given I am an anonymous user
     When I go to "/"
      And wait
      And I click on the element "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button"
     Then ".icon-toggle--panel-full .icon-toggle__panel input[name='keywords']" should be visible
      And the page should have no serious accessibility violations

  @check @a11y @local @development @staging @production
  Scenario: Check that the search results page passes the full accessibility check
    Given I am an anonymous user
     When I go to "/search?keywords=podcast"
      And wait
     Then "main .view-search" should be visible
      And the page should pass the full accessibility check

  @check @local @development @staging @production
  Scenario Outline: Check that the header search opens on a "<breakpoint>" screen
    Given I am an anonymous user
      And I am viewing the site on a "<breakpoint>" screen
     When I go to "/"
      And wait
     Then "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button" should be visible
     When I click on the element "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button"
     Then ".icon-toggle--panel-full .icon-toggle__panel input[name='keywords']" should be visible
      And ".icon-toggle--panel-full .icon-toggle__panel .form-actions .btn" should be visible
      And the search bar should sit directly below the site header
      And the page fade should start below the search bar

    Examples: Screens
      | breakpoint |
      | xs         |
      | md         |
      | xxxl       |
