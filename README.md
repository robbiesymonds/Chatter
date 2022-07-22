# Chatter

Explore your Messenger chat from a new perspective.

## 🚀 Getting Started
Install [Deno CLI](https://deno.land) version 1.23.0 or higher.

From within your project folder, start the server using the `deno task` command:
```
deno task start
```
Now open http://localhost:3000 in your browser and upload your chats!

<br />

## 💬  Exporting Messenger

I'll leave it up to you figure out how to download your data from Facebook. The files you are looking for are named `message_[X].json`, these will be uploaded to the app. (at the time of writing this is how Facebook gives it to you):

<br />

## 👨‍💻 Sharing with Friends

It's tedious to share your exported data for various reasons, instead you can enable a "static viewing" mode so that they cam experience it without needing to upload anything.

**Recommended Approach:**
1. Fork this repository into a private repo.
2. Add your `message_[X].json` files into the `data` directory.
3. Set the `ENABLE_STATIC` environment variable to `true`.
4. Specify a value in the `PASSWORD` variable to restrict access *(Optional)*.
5. Use [Deno Deploy](https://deno.com/deploy) to host your instance for free.


## 💾 Planned Changes
Feedback & pull requests are welcome! 

**Potential Features:**
- Exploration view for messages.
- Ability to view the actual assets for photos, videos, gifs, and audio.
- Measure response delay from when mentioned via `@`.
- Nickname resolution based on system messages.
- Group chat specific statistics?