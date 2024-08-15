Feature: Ecommerce validation


    @Regression
    @Web
    Scenario: Placing the order 
        Given a login to Ecommerce2 applicaiton with "anshika@gmail.com" and "Iamking@000"
        Then Verify error mesage is displayed

    @Regression
    @Web
    Scenario: Placing the order 
        Given a login to Ecommerce2 applicaiton with " " and " "
        Then Verify error mesage is displayed

    @Regression
    @Web
    Scenario Outline: Placing the order2
        Given a login to Ecommerce2 applicaiton with "<username>" and "<password>"
        Then Verify error mesage is displayed

    Examples:
    | username          |    password |
    | anshika@gmail.com | Iamking@000 |
    | test@test.com     | 123ewqasdxc |