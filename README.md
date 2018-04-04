# Dashier
The 💯 easiest way to pay or GET 😜 paid in Dash 🔥
Web application for easy transfer of Dash. Includes ability to construct new payments, follow, and friend users, as well as interact with posts via likes.
Eerie similarity to Venmo.

# How to Get Started
1. Clone master branch onto own computer
2. Install PostgreSQL locally: https://www.postgresql.org
3. Create a 'novaparse' & 'mocha_testing' database or edit config/config.js accordingly
2. In terminal, change directory into projects directory
3. ```npm install```
4. ```npm start```
5. Connect to localhost:3000 and you're off!

6. If you wish to test - ```npm test```

# Features
Landing Page:
  1. Simple greeting
  2. Join - modal to create an account for yourself
      - Username
      - Password
      - Desired account value
  3. Login - modal to create an account for yourself
      - Username
      - Password
      - Desired account value

Dashboard:
  1. 2 column layout
  2. Left
      - Username, clickable to visit profile
      - Settings, to adjust password
      - Logout
      - Payment Area
      - Account Balance
  3. Right
      - Transaction Feed
      - Displays your own transactions
      - Any transactions that your friends are a part of
      
Profile:
   1. Username
      - If clicked, leads back to dashboard
   2. My posts/tx's
      - Shows posts/tx's that this user has been a part of
  
# Common Use Case
Satoshi wants to pay his friend Vitalik. Vitalik has told him to sign up on Dashier! Satoshi signs up and he exchanges his profile link with Vitalik. They follow each other to become friends. Now they see each other's transactions, much like a popular service Venmo, and in realtime, too.
  
# // TODO
- Finish last few Mocha tests
- Finish off Blockcypher transaction signing (need to contact API publshers)

# EZ Additions
- Post Like counter
- Post Comments

# NOTE
In it's current state, Dashier does not perform transactions on the Dash blockchain.
In order to perform them, a different cryptographic signing format is needed to authorize the tx hashes.
The current funds exchanged are phony.

# Technologies Used
Front-end:
- HTML/CSS
- Javascript/jQuery
- Bootstrap
- EJS Templating
- fontawesome
- Google Fonts

Back-end:
- Node.js
- ExpressJS
- PostgreSQL

Packages:
- sequelize
- client-sessions
- socket.io
- nodemon
- bigi
- buffer
- bcrypt

APIs:
- Blockcypher

Testing:
- Mocha
- Chai
- chai-http
- TestCafe
