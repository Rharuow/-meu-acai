# Introduction

This project is a front-end for the ice creams market place.

## To-do

- [ ] Home page

  > **Tip:** This is the initial page for the ice creams market place Admin plataform

  - [ ] Verify if has 'session' in cookie
  - [ ] If not found 'session' in cookie, show the sign in page
  - [ ] If has 'session' in cookie, show the dashboard page

- [x] Sign in page

  > **Tip:** This page contain form to sign in and save the session in cookies

  - [x] Add React Hook Form with validation fields name and password
  - [x] Add logo image to the card form
  - [x] Create handle function to submit the form
  - [x] Submit the form to the router (/api/v1/signin) of the API server
  - [x] Save in cookie 'session' the session.

- [x] Not Found page
  - [x] Add lottie
  - [x] Add text saying "Ops... Not found here..."
  - [x] Button to back navigation
