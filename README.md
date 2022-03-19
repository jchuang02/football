# Dashboard.football

## Introduction

[Dashboard.football](https://dashboard.football/) is a dashboard application displaying information about football/soccer competitions around the world.

Users can select the teams and competitions they want to follow. They can find live match information, results of previous matches, and the times of upcoming games.

---

## Technologies

Dashboard.football is a Gatsby React application. It uses a number of open sourced libraries and dependencies, as well as a few APIs.

### State Management, Forms, and Utilities

- [Redux](https://redux.js.org/): For complex state management.
- [firebase](https://firebase.google.com/): For user authentication and accounts.
- [final-form](https://final-form.org/): For form management.
- [MUI-RFF](https://github.com/lookfirst/mui-rff): To get Final Form to play well with Material UI.
- [lodash](https://lodash.com/): For specific utility functions, like `_.uniq`

### UI and Styling

- [Material-UI](https://mui.com/): For UI Components and Styling
- [react-spring](https://react-spring.io/): For custom animations.
- [iconoir-react](https://iconoir.com/): Open sourced React library for SVG Icons.

### APIs

-[api-football](https://www.api-football.com/): For the football data.

---

## Getting Started

### Setup

To get started developing dashboard.football, remember to first npm install after cloning the repo.

You will also need to obtain a free API key from [api-football](https://www.api-football.com/)
and put the key into a `.env.development` and `.env.production` file like so,

```js
GATSBY_APP_FOOTBALL_API_KEY = YOUR_API_KEY_HERE;
```

and put that inside the `src` folder.

### Startup

You can now start develop dashboard.football with

```bash
    gatsby develop
```

To view a production build of dashboard.football, use

```bash
    gatsby build
```

and view the files of the production build in the `./public` folder or by using

```bash
    gatsby serve
```
