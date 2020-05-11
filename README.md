# HOODIFY
*The #1 online hood to sell your hoods.*

A simple light-hearted ecommerce web application where users can buy and sell hoodies.

![Screenshot of the main page of the Hoodify application](./extras/hoodify.png)

## Live Link
[View Hoodify live!](https://hoodify-next-prod.herokuapp.com/)

## Features (frontend)
* Built with Next.js, GraphQL, Apollo Client, React
* Shopping cart & credit card checkout (Stripe)
* User accounts, authentication, permissions
* Various UI/UX features: pagination, search bar autocomplete, progress bar loader, animations
* Deployed on Heroku
* Testing with Jest and Enzyme

## Link to backend
[View Hoodify's backend repository](https://github.com/osubuu/hoodify-backend)

## NOTE
Certain functionalities are still linked to development services:
* Emails are still set to be sent to a fake SMTP testing server.
* Credit card checkout can only be done with fake values. Please **only** use the following:
```
credit card number: 4242 4242 4242 4242
expiry date: any future date
cvc: any 3 digits
