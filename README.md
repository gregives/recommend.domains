[![Screenshot of recommend.domains](./images/screenshot.png)](https://recommend.domains)

# [recommend.domains](https://recommend.domains)

Find the perfect domain name for your next project using [ChatGPT](https://openai.com/blog/chatgpt) and the [GoDaddy API](https://developer.godaddy.com/). Built using [Next.js](https://nextjs.org/) 13, [Tailwind](https://tailwindcss.com/) and deployed on [Vercel](https://vercel.com/).

## Run locally

### Clone the repository

```sh
git clone https://github.com/gregives/recommend.domains
```

### Create an OpenAI API key

1. Log in or sign up at https://platform.openai.com/
2. Click on your profile photo in the top right
3. View API keys
4. Create new secret key

### Create a `.env` file

1. Create a file called `.env.local` in the root of the repository
2. Paste your OpenAPI secret key into the `.env.local` file in this format:

```env
OPENAI_API_KEY=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
```

### Create API key and secret for GoDaddy

1. Log in or sign up at https://developer.godaddy.com/
2. Click API Keys in the menu
3. Create New API Key
4. Choose the `ote` environment
5. Paste the key and secret into the `.env.local` file:

```env
OPENAI_API_KEY=...
GODADDY_URL=https://api.ote-godaddy.com
GODADDY_API_KEY=3mM44UcgtKAewW_5rDWLN1QsnNhxD1uJ2kL55
GODADDY_API_SECRET=UWAVgpM1kvWhkbCsvZfYhp
```

### Install dependencies

```sh
yarn
```

### Run the website locally

```sh
yarn dev
```

You should now be able to head to http://localhost:3000 and see the recommend.domains website.

## Contributions

If there's a change you'd like to make to the recommend.domains website, such as adding new features, I'd love for you to open a pull request and I'll take a look!
