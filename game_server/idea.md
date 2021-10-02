# ideas

phone are client, but the **browser is also a client** so it needs to be connected to the web socket with a **special id** so it doesn't count as a user.

## web socket architecture :

- message architecture 

  ```json
  {
      "user_id": "only client to server",
      "game_id": "path",
      "type": "string",
      "data": {},
  }
  ```

- **two servers** architecture, one for handling the web socket and other one for handling the web server, it can be separated in container.

## other stuff

- make game state (start stop) all player have to press a button to start etc..