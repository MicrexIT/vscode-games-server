# Down-time Game Scores API

Simple API server for storing and retrieving game scores for the VS Code Down-time extension.

## Setup

1. Create a free MongoDB Atlas account at https://www.mongodb.com/cloud/atlas/register
2. Set up a free tier cluster
3. Create a database called `gamescores`
4. Get your connection string from MongoDB Atlas
5. Copy `.env.example` to `.env` and update the MongoDB connection string

## Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Deployment

This API can be deployed to any of these platforms:

### Railway

1. Push this directory to a GitHub repository
2. Sign up at https://railway.app/
3. Create a new project from GitHub
4. Select your repository
5. Add the MongoDB URI as an environment variable
6. Deploy

### Render

1. Push this directory to a GitHub repository
2. Sign up at https://render.com/
3. Create a new Web Service
4. Connect your GitHub repository
5. Set the build command to `npm install`
6. Set the start command to `npm start`
7. Add the MongoDB URI as an environment variable
8. Deploy

### Fly.io (Free tier available)

1. Install the Fly CLI: https://fly.io/docs/getting-started/installing-flyctl/
2. Run `fly launch` in this directory
3. Add the MongoDB URI as a secret: `fly secrets set MONGODB_URI=your_mongodb_uri`
4. Deploy with `fly deploy`

## API Endpoints

- `GET /scores/:game` - Get top scores for a game
- `GET /scores/:game/:username` - Get the best score for a user by username in a game
- `GET /scores/:game/token/:token` - Get the best score for a user by token in a game
- `POST /scores` - Save a new score

### User Identification System

The API uses a token-based identification system. Each VS Code extension installation generates a unique token and a random username in the format `[adjective]-[animal]-[number]`. This allows:

1. Players to have fun, memorable usernames
2. Score tracking across different sessions
3. Ability to regenerate usernames while maintaining score history

The token is never exposed in API responses to maintain privacy.

## Example POST body:

```json
{
  "game": "snake",
  "score": 100,
  "username": "quiet-tiger-123",
  "token": "550e8400-e29b-41d4-a716-446655440000"
}
```
