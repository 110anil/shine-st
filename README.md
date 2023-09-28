This is the source code for [shinestudio.in](shinestudio.in).

## To run the development server

1. First, clone this repository
2. Then create a file named `.env.local` at the root of the project. contents of the file can be shared by @smile. He received an email "ShineStudio.in Website details & credentials". That email had an attachment `.env.local`
3. run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next.js`](https://nextjs.org/docs)

## More details about this project

This project uses the following []

- JS Framework: NextJs with ReactJs
- [MailSend](https://accounts.mailersend.com/) for sending emails. Mailsend is used to send emails to `smile@shinestudio.in` when a user fills in the "Contact Us" form on the website.
  - Login with github 
  - Attached Email: `smile@shinestudio.in`

- Github: code is available on github: https://github.com/110anil/shine-st
  - Username: 110anil
  - Attached Email: `smile@shinestudio.in`
  - @smile: Ensure that no SSH keys added by anyone are left associated in the account once the work is complete by any developer. Also no one must have access to the account. Remove all collaborators.
- Vercel: Website is hosted on vercel: https://vercel.com/login
  - Login with github
  - Attached Email: `smile@shinestudio.in`
  - Vercel automatically pulls code from github. new deployments are automatically trigged when code is pushed to github on branch 'main'.
  - in the `settings` tab, you'll find `Environment Variables` which are same as the  file `.env.local`. These hold API keys for Mailsend, ImageKit
- Godaddy
  - Login Email: `smile@shinestudio.in`
  - Godaddy hosts the domain & all the DNS records
  - This is the most important account.
  - Any DNS changes must be done in @smile's supervision
  - No one must have account access
  - Auto renewal must be enabled. and payment Credit Card must be added
  - the Email: smile@shinestudio.in works because of DNS settings in this account
  - This account also holds DNS settings which point website traffic to vercel
  - This account also holds DNS settings which enable mailTrap to send emails
- ImageKit accounts: This is where we store all data
  - all images are stored here. Albums + website images
  - the data is divided into 5 accounts, so that we don't exceed the 20GB usage per account 
  - We use 5 accounts
  - Login here: https://imagekit.io/login/
  - Account 1: shinegarg110@gmail.com
  - Account 2: shinegarg111@gmail.com
  - Account 3: smilegarg110@gmail.com
  - Account 4: 110anilgarg@gmail.com
  - Account 5: smile@shinestudio.in
- Recovery email for all the @gmail.com accounts is `smile@shinestudio.in`

## Important website urls

- Dashboard(www.shinestudio.in/dashboard)
- Edit/Update user access to the website dashboard(www.shinestudio.in/edit-albums/usermanagement)
- Upload album(www.shinestudio.in/upload-albums)
- Edit album(www.shinestudio.in/edit-albums)
- Find album(www.shinestudio.in/find-albums)
- Change album PIN(www.shinestudio.in/change-pin)
