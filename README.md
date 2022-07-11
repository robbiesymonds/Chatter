# Chatter

Explore your Messenger chat from a new perspective.

## 🚀 Getting Started
Install [Deno CLI](https://deno.land) version 1.23.0 or higher.

From within your project folder, start the server using the `deno task` command:
```
deno task start
```
Now open http://localhost:8000 in your browser and upload your chats!

<br />

## 💬  Exporting Messenger

I'll leave it up to you figure out how to download your data from Facebook. The shape of the `.zip` uploaded must be as follows (at the time of writing this is how Facebook gives it to you):
```
[chat-name].zip
 -> gifs/...
 -> photos/...
 -> videos/...
 -> audio/...
 -> message_[X].json
```

<br />

## 👨‍💻 Sharing with Friends

It's not ideal to share your exported data with friends for various reasons, so instead you could host your own copy of the 

**Recommended Approach:**
1. Fork this repository into a private repo.
2. Add your `.zip` file into the repository.
2. Specify the `STATIC_FILE` environment variable to the path of your `.zip` file.
2. Use [Deno Deploy](https://deno.com/deploy) to host your instance for free.