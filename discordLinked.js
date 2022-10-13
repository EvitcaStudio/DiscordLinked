(() => {
	const DISCORD_OAUTH2_BASE_URL = 'https://discordapp.com/api/oauth2/authorize';
	const DISCORD_USERS_BASE_URL = 'https://discordapp.com/api/users/@me';
	const DISCORD_AVATAR_BASE_URL = 'https://cdn.discordapp.com/avatars/';
	const REDIRECT_URI = encodeURIComponent(window.location.href.split('?')[0]);
	// Discord images are by default a size of 128x128
	const DISCORD_IMAGE_WIDTH = 128;
	const DISCORD_IMAGE_HEIGHT = 128;

// #BEGIN CODE_EDIT
	const CLIENT_ID = '';
	const AUTO_AUTH = false;
	// If you want this plugin to send a packet to the server with the data of the discord user. If this is set to true it will send a packet named `dAPI256` in which the data is the account info of the discord user
	// It will need to be parsed into an object server side
	const NETWORK = false;
// #END CODE_EDIT

	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	const image = new Image();
	// Allows crossOrigin images to be drawn onto a canvas
	image.crossOrigin = 'anonymous';
	// Preset the canvas to the default discord image size of 128x128
	canvas.width = DISCORD_IMAGE_WIDTH;
	canvas.height = DISCORD_IMAGE_HEIGHT;
	
	class DiscordUserInstance {
		constructor(pUserObject){
			this.userObject = pUserObject;
		}

		// UserObject.id https://discord.com/developers/docs/resources/user#user-object
		getID() {
			return this.userObject.id;
		}

		// UserObject.premium_type https://discord.com/developers/docs/resources/user#user-object
		getUserName() {
			return this.userObject.username;
		}

		// UserObject.avatar https://discord.com/developers/docs/resources/user#user-object
		getAvatar() {
			return this.userObject.avatar;
		}

		// UserObject.banner https://discord.com/developers/docs/resources/user#user-object
		getBanner() {
			return this.userObject.banner_color;
		}

		// UserObject.banner_color https://discord.com/developers/docs/resources/user#user-object
		getBannerColor() {
			return this.userObject.banner_color;
		}

		// UserObject.accent_color https://discord.com/developers/docs/resources/user#user-object
		getAccentColor() {
			return this.userObject.accent_color;
		}

		// UserObject.premium_type https://discord.com/developers/docs/resources/user#user-object
		getNitro() {
			// 0: None
			// 1: Nitro Classic
			// 2: Nitro
			return this.userObject.premium_type;
		}

		// UserObject.mfa_enabled https://discord.com/developers/docs/resources/user#user-object
		get2FA() {
			return this.userObject.mfa_enabled;
		}
		// UserObject.discriminator https://discord.com/developers/docs/resources/user#user-object
		getTag() {
			return this.userObject.discriminator;
		}

		getPublicFlags() {
			return this.userObject.public_flags;
		}

		// UserObject.bot https://discord.com/developers/docs/resources/user#user-object
		isBot() {
			return this.userObject.bot;
		}

		// UserObject.bot https://discord.com/developers/docs/resources/user#user-object
		isVerfied() {
			return this.userObject.verified;
		}

		// Converts the user's discord avatar to a dataURL
		avatarToBase64(pWidth, pHeight, pCallback) {
			image.src = DISCORD_AVATAR_BASE_URL + this.getID() + '/' + this.getAvatar();
			canvas.width = pWidth;
			canvas.height = pHeight;
			image.addEventListener('load', (e) => {
				// Draw the avatar
				ctx.drawImage(image, 0, 0, pWidth, pHeight);
				// Get the base64 image of the avatar that was drawn
				const dataURL = canvas.toDataURL();
				// Clear the canvas for the next draw
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				canvas.width = DISCORD_IMAGE_WIDTH;
				canvas.height = DISCORD_IMAGE_HEIGHT;
				pCallback(dataURL, pWidth, pHeight);
			});
		}

		// Creates a icon for this Discord Users avatar image
		createDiscordAvii(pWidth=128, pHeight=128, pCallback) {
			const self = this;
			this.avatarToBase64(pWidth, pHeight, (pDataURL, pWidth, pHeight) => {
				const id = self.getID();
				if (VYLO) VYLO.Icon.newAtlas(id);
				if (VYLO) VYLO.Icon.newIcon(id, 'avii', pWidth, pHeight);
				if (VYLO) VYLO.Icon.setDataURL(pDataURL, id, 'avii', null, null, pCallback);				
			});
		}
	}

	class DiscordHandlerInstance {
		constructor() {
			this.storedIDs = [];
		}
		// Get the parameters from the URL
		getURIFragment() {
			// Grab the parameters and create a URLSearchParam object
			const fragment = new URLSearchParams(window.location.hash.slice(1));
			return fragment;
		}

		generateID(pID = 29) {
			const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
			const makeID = function() {
				let ID = '';
				for (let i = 0; i < pID; i++) {
					ID += chars.charAt(Math.floor(Math.random() * chars.length));
				}
				return ID;
			}
			let ID = makeID();
			while(this.storedIDs.includes(ID)) {
				ID = makeID();
			}
			this.storedIDs.push(ID);
			return ID;
		}

		login() {
			// If there is a accesstoken in the URL, this means we have visited the auth page and obtained it
			// We can now use this accesstoken to exchange it for user info
			if (this.getURIFragment().get('access_token')) {
				this.grabDiscordUser();
			// If there is no code then we need to go to the auth page to get one
			} else {
				// Move to the auth page to get the accesstoken that will be exchanged for a user object
				// When the accesstoken is grabbed, it will redirect the client to the game client again and it will have the token as a param in the URL
				const randomID = this.generateID();
				localStorage.setItem('oauth_discord_state', randomID);
				window.location.assign(DISCORD_OAUTH2_BASE_URL + '?client_id=' + CLIENT_ID + '&redirect_uri=' + REDIRECT_URI + '&response_type=token&scope=identify&prompt=none&state=' + btoa(randomID) + '');
			}
		}

		grabDiscordUser() {
			const xhttp = new XMLHttpRequest();
			const fragment = this.getURIFragment();
			const tokenType = fragment.get('token_type');
			const accessToken = fragment.get('access_token');
			const state = fragment.get('state');
			const xhrData = {
				[tokenType]: accessToken
			};

			// Remove the parameters from the URL, incase of a refresh so it doesn't try to reload the user with the same token
			window.history.replaceState(null, null, window.location.pathname);

			// In the event the state does not match the stored state, it's possible that someone intercepted the request or otherwise falsely authorized themselves to another user's resources, and the request should be denied.
			if (localStorage.getItem('oauth_discord_state') !== atob(decodeURIComponent(state))) {
				return;
			}

			xhttp.open('GET', DISCORD_USERS_BASE_URL, true);
			xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhttp.setRequestHeader('Authorization', tokenType + ' ' + accessToken);
			xhttp.send(xhrData);
			
			xhttp.onloadend = () => {
				const userObject = JSON.parse(xhttp.responseText);
				const DiscordUser = new DiscordUserInstance(userObject);
				window.DiscordUser = DiscordUser;
				if (VYLO) VYLO.global.DiscordUser = DiscordUser;
				if (NETWORK) {
					this.sendUserToServer();
				}
			};
		}

		// If networking is enabled, then this will send a packet to the server with the discord user data 
		sendUserToServer() {
			if (VYLO) {
				if (VYLO.Client) VYLO.Client.sendPacket('dAPI256', JSON.stringify(DiscordUser));
			}
		}
	}

	const DiscordHandler = new DiscordHandlerInstance();
	window.DiscordHandler = DiscordHandler;
	if (VYLO) VYLO.global.DiscordHandler = DiscordHandler;
	if (AUTO_AUTH) DiscordHandler.login();

})();