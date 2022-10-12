# vyDiscord  
A simple plugin to connect discord to vylocity.  


# Implementation  

#### #INCLUDE SCRIPT vyDiscord.min.js  

# Creating a app on discord

#### Head over to https://discord.com/developers/applications

![image](https://user-images.githubusercontent.com/56242467/195375349-4b11f7af-302a-47a8-8614-d8b09f4c3656.png)

#### Next, you must create a discord application

![image](https://user-images.githubusercontent.com/56242467/195375540-ec7e240e-5118-4144-bd88-b8b9d81dcfb2.png)

#### Next, head down to the `OAuth2` tab

![image](https://user-images.githubusercontent.com/56242467/195375665-ee319e7d-205b-4d26-ab36-b401c02101b6.png)

#### Now, we see some of the information we need. 

![image](https://user-images.githubusercontent.com/56242467/195376162-9b4a34f6-01ae-40f5-b89c-95f27738e3f0.png)

#### We will need `Client ID` and `Client Secret` as well as adding some redirects.

If your `Client Secret` value isn't showing, you need to reset it. 

> **Warning**  
> If you reset your `Client Secret` you will need to update it everywhere else you use it (such as this plugin)

Once you have these values keep them nearby for later.  
We now need to add a few redirects to our discord app, so it knows where to go.  
These redirects are official Domain/IPs that are trusted within this application. Such as your game server.  

![image](https://user-images.githubusercontent.com/56242467/195378346-78bbf89e-c6df-4265-bd2b-3d5c345e24c1.png)

> **Note**  
> If you have many servers, add each Domain/IP.  
> These redirects also work with local hosting!

## Client ID and Client Secret

You will need to supply your `Client ID` and `Client Secret` inside of `vyDiscord.js`  
Open the `vyDiscord.js` file, and find the declarations of `CLIENT_ID` and `CLIENT_SECRET` and input your `Client ID` and `Client Secret` values inside the empty strings.  

## Connecting to a game via your discord app    
![image](https://user-images.githubusercontent.com/56242467/195381931-e89f7ed2-237d-4422-9c4f-29bd86add424.png)  
When connecting to a game, users will be prompted to login via discord if they are not already logged in, and will be prompted to authorize your discord app to use their data.
Upon authorization, the game will load.  

## Networking  
If you want to enable sharing this discord user's information to the server, you have to enable it in this plugin by finding and setting the declaration of `NETWORK` to `true` It is `false` by default.  
With networking enabled, this plugin will send a packet to the server with the name of `dAPI256` and the basic data of the discord user. This data is in the format of discord's [userObject](https://discord.com/developers/docs/resources/user#user-object) and is serialized as a string.  
