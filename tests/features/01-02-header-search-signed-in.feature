@smoke @regression @any @theme @search
Feature: Vartheme BS5 Rightup - Header search for signed in users
      As a signed in user of any role
      I want the header search to open under the header exactly as it does for a visitor
      So that the admin toolbar never displaces the search bar or the page fade.

  @check @local @development @staging @production
  Scenario Outline: Check that the header search opens for the "<user>" user
    Given I am a logged in user with the "<user>" user
     When I go to "/"
      And wait
     Then "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button" should be visible
     When I click on the element "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button"
     Then "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button" should have attribute "aria-expanded" with value "true"
      And ".icon-toggle--panel-full .icon-toggle__panel input[name='keywords']" should be visible
      And ".icon-toggle--panel-full .icon-toggle__panel input[name='keywords']" should have attribute "placeholder" with value "Search by keyword"
      And ".icon-toggle--panel-full .icon-toggle__panel .form-actions .btn" should have value "Search"
      And the search bar should sit directly below the site header
      And the page fade should start below the search bar

    Examples: Testing users
      | user           |
      | Normal user    |
      | Content editor |
      | Content admin  |
      | SEO admin      |
      | Site admin     |
      | Super admin    |

  @check @local @development @staging @production
  Scenario Outline: Check that the admin toolbar stays clear of the search bar for the "<user>" user
    Given I am a logged in user with the "<user>" user
     When I go to "/"
      And wait
      And I click on the element "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button"
     Then ".icon-toggle--panel-full .icon-toggle__panel" should be visible
      And the search bar should sit directly below the site header
      And the admin toolbar should stay above the search bar and the page fade

    Examples: Testing users with the admin toolbar
      | user           |
      | Content editor |
      | Content admin  |
      | SEO admin      |
      | Site admin     |
      | Super admin    |

  @check @local @development @staging @production
  Scenario Outline: Check that the search results page hides the header search icon for the "<user>" user
    Given I am a logged in user with the "<user>" user
     When I go to "/search?keywords=podcast"
      And wait
     Then "main .view-search" should be visible
      And "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button" should not be visible
      And "header[role='banner'] .icon-toggle--panel-full .icon-toggle__panel" should not be visible

    Examples: Testing users
      | user           |
      | Normal user    |
      | Content editor |
      | Content admin  |
      | SEO admin      |
      | Site admin     |
      | Super admin    |

  @check @a11y @local @development @staging @production
  Scenario Outline: Check that the open header search has no serious accessibility violations for the "<user>" user
    Given I am a logged in user with the "<user>" user
     When I go to "/"
      And wait
      And I click on the element "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button"
     Then ".icon-toggle--panel-full .icon-toggle__panel input[name='keywords']" should be visible
      And the page should have no serious accessibility violations

    Examples: Testing users
      | user           |
      | Normal user    |
      | Content editor |
      | Content admin  |
      | SEO admin      |
      | Site admin     |
      | Super admin    |

  @check @local @development @staging @production
  Scenario: Check that a signed in user can search from the header
    Given I am a logged in user with the "Content editor" user
     When I go to "/"
      And wait
      And I click on the element "header[role='banner'] .icon-toggle--panel-full .icon-toggle__button"
      And I fill in the field ".icon-toggle--panel-full .icon-toggle__panel input[name='keywords']" with "podcast"
      And I click on the element ".icon-toggle--panel-full .icon-toggle__panel .form-actions .btn"
      And wait
     Then the url should match "/search"
      And current url should have the "keywords" parameter with the "podcast" value
