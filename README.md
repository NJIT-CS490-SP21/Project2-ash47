# Project2-ash47

<details>
    <summary><b>Description</b></summary>
    This project creates a simple tic tac toe multiplayer game. In this game, all the users who join the server are added to a queue. The first two users in the queue are assigned X and O respectively. The rest of the users are considered spectators, they cannot make a move but can see the live game. As the players in front of the queue logs out, the players behind are promoted. This game also tracks the score for each user who logged in and saves it in a database.

</details>

# Flask and create-react-app


### Requirements
Run following commands in your terminal:
1.  ```bash
    npm install
    ``` 
2. ```bash
    pip install -r requirements.txt
    ```
alternate

2. ```bash
    sudo pip install -r requirements.txt
    ```
### Setup
1. Run the following code in the project direcotry 
```bash
echo "DANGEROUSLY_DISABLE_HOST_CHECK=true" > .env.development.local
```

## Run Application
1. Run command in terminal (in your project directory): `python app.py`
2. Run command in another terminal, `cd` into the project directory, and run `npm run start`
3. Preview web page in browser '/'

### Deploy to Heroku
1. Create a Heroku app: 
```bash
heroku create --buildpack heroku/python
```
2. Add nodejs buildpack: 
```bash
heroku buildpacks:add --index 1 heroku/nodejs
```
3. Push to Heroku: 
```bash
git push heroku main
```


## Issues

<details>
  <summary><b>Known bugs:</b></summary>
  
  * **User stays in line queue forever if application is closed without logging out** As the app stands, when users join the server their usernames get stored in an array on the server. The name is added to the array when a user clicks on the login button, and the username is removed when clicked on the logout button. These are the only ways a name gets added or removed from the array. So, when the user closes the tab without logging out the username stays the array forever (or until the server restarts)
       + This issue can be addrested by 

 * **A player can make any move if X or O.** The first user who joins the server is assigned to player X, and the second one to join the server is assigned player O. Both players can only click on the board when its tier turn respectevly. But if both players have same usernames any of them would be able to play as both X and Os.
</details>
<details>
  <summary><b>Techinical issues:</b></summary>
  
  * **Bug:** Board would be blank if a user joins mid-game, and would only see moves made after after the point he/she joined the server.
    + **Fix:** To fix the issue, I made an array on server side which whould keep track of current state of the game board and current turn. And any time a user that is not a player (first two users) joins the server. A request from client side is sent asking for the latest state of the board. 

 * **Bug:** Anyone can reset the game board
    + **Fix:** To fix this issue, I checked if current player is one of the first two playes in the queue, and if not, the reset button would not be accesiable to the current user.
</details>



