# DiscordLinked  
A simple plugin to connect discord to a site/app/game/etc.    

# Creating a app on discord

#### Head over to https://discord.com/developers/applications

![image](https://user-images.githubusercontent.com/56242467/195375349-4b11f7af-302a-47a8-8614-d8b09f4c3656.png)

#### Next, you must create a discord application

![image](https://user-images.githubusercontent.com/56242467/195375540-ec7e240e-5118-4144-bd88-b8b9d81dcfb2.png)

#### Next, head down to the `OAuth2` tab

![image](https://user-images.githubusercontent.com/56242467/195375665-ee319e7d-205b-4d26-ab36-b401c02101b6.png)

#### Now, we see some of the information we need. 
![msedge_wW6s5O8jsP](https://user-images.githubusercontent.com/56242467/195515837-e7dd08c8-bd46-430b-bb9b-1f6e8b29aa31.png)

#### We will need `Client ID` as well as adding some redirects.

Once you have your `Client ID` keep it nearby for later.  
We now need to add a few redirects to our discord app, so it knows where to go.  
These redirects are official Domain/IPs that are trusted within this application. Such as your site/app/game/etc.    

![image](https://user-images.githubusercontent.com/56242467/195378346-78bbf89e-c6df-4265-bd2b-3d5c345e24c1.png)

> **Note**  
> If you have many servers, add each Domain/IP.  
> These redirects also work with local hosting!

## Client ID  

You will need to supply your `Client ID` inside of `discordLinked.js`  
Open the `discordLinked.js` file, and find the declaration of `CLIENT_ID` and input your `Client ID` value inside the empty string.  

## Connecting to a site/app/game/etc via your discord app    
![image](https://user-images.githubusercontent.com/56242467/195381931-e89f7ed2-237d-4422-9c4f-29bd86add424.png)  
When connecting to a game, users will be prompted to login via discord if they are not already logged in, and will be prompted to authorize your discord app to use their data.
Upon authorization, the site/app/game/etc will load.  

## Networking  
If you want to enable sharing this discord user's information to the server, you have to enable it in this plugin by finding and setting the declaration of `NETWORK` to `true` It is `false` by default.  
With networking enabled, this plugin will send a packet to the server with the name of `dAPI256` and the basic data of the discord user. This data is in the format of discord's [userObject](https://discord.com/developers/docs/resources/user#user-object) and is serialized as a string.  

# Implementation  

#### #INCLUDE SCRIPT discordLinked.js  `Vylocity only`

> **Note**  
> Outside of Vylocity, just include the script into the project files.  

## How to reference  
window.DiscordUser | DiscordUser `JavaScript`  
DiscordUser `VyScript`

## API  

###  DiscordUser.getID()
   - `returns`: Returns the id of the logged in discord user  

###  DiscordUser.getUserName()
   - `returns`: Returns the username of the logged in discord user    

###  DiscordUser.getAvatar()
   - `returns`: Returns the avatar hash of the logged in discord user 

###  DiscordUser.getBanner()
   - `returns`: Returns the banner hash of the logged in discord user 

###  DiscordUser.getBannerColor()
   - `returns`: Returns the banner color of the logged in discord user 

###  DiscordUser.getAccentColor()
   - `returns`: Returns the accent color of the logged in discord user 

###  DiscordUser.getNitro()
   - `returns`: Returns the nitro membership of the logged in discord user  
    0: None
    1: Nitro Classic
    2: Nitro

###  DiscordUser.get2FA()
   - `returns`: Returns if the logged in discord user has 2fa enabled  

###  DiscordUser.getTag()
   - `returns`: Returns the tag of the logged in discord user  

###  DiscordUser.getPublicFlags()
   - `returns`: Returns the public flags on the logged in discord user's account  

###  DiscordUser.isBot()
   - `returns`: Returns if the logged in discord user is a bot  

###  DiscordUser.isVerfied()
   - `returns`: Returns if the logged in discord user has verified their email address  

###  DiscordUser.createDiscordAvii(pWidth, pHeight, pCallback)  `Vylocity only`
   - `pWidth`: The width to make the discord avatar icon     
   - `pHeight`: The height to make the discord avatar icon    
   - `pCallback`: A callback function that will be called when this icon is ready    
   - `description`: Inside of the callback, the icon will be ready to be used. The `atlasName` will be the `id` of `DiscordUser` and the `iconName` will be the static name of `avii`  
