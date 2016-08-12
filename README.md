Balance

A webapp that allows users to add friends, and keep track of money that each
person owes another.

Built Using Mongodb, Node.js, and Express framework for backend,
and Jade html pre-processor, CSS and JS for frontend.

Built on boilerplate code provided by Sahat at https://github.com/sahat/hackathon-starter

Current features:
 - User authentication locally
 - User authentication through google and facebook
 - Ability to add friends to a friend list
 - Ability to add a debt for a specific friend with a message attached
 - View friends list
 - Update profile information

Future features:
 - View stream of all debts to friends
 - View total money owed to all friends
 - Add friends to groups
 - See dates of debts

Still to be done:
 - Lots of validation checks
    - validate amount in posted debt (ie, non negative amount)
    - sync friend list between users (add user to friendsList and vice versa)
    - Smaller validation checks that are slipping by me atm
 - Frontend design
    - Material inspired?
    - Mobile first design
 - Lots of testing
 - Deploy on server
