Feature: Ecommerce validation


    Scenario: Placing the order 
        Given a login to Ecommerce applicaiton with "anshika@gmail.com" and "Iamking@000"
        When Add "adidas original" to Cart 
        Then Verify "adidas original" is displayed in the Cart
        When Enter valid details and Place the Order 
        Then Verify order is present in the OrderHistory