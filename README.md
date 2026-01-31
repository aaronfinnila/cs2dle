# cs2dle

cs2dle is a daily guessing game for Counter-Strike 2 professional players. Test your esports knowledge by guessing the pro player based on attributes like nationality, team, age, and role.

**Live Website:** [cs2dle.org](https://cs2dle.org)

## Features

- **Daily Player:** A new pro player to guess every day.
- **Attribute Clues:** Get feedback on your guesses based on:
  - Nationality (with geographic proximity indicators)
  - Team History
  - Age / Birth Date
  - In-Game Role
- **Player Database:** Comprehensive database of top tier CS2 professionals.

## Tech Stack

This project is built as a modern full-stack application.

### Frontend
- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Canvas Confetti

### Backend
- **Framework:** Java Spring Boot
- **Database:** PostgreSQL
- **Security:** JWT Authentication
- **Build Tool:** Maven

### Data Pipeline
- **Scripting:** Python
- **Source:** Liquipedia API
- **Libraries:** `requests`, `mwparserfromhell`, `psycopg2`

## Getting Started

Follow these instructions to set up the project locally for development.

### Prerequisites
- Node.js & npm
- Java JDK 17+
- PostgreSQL
- Python 3.x

### 1. Database Setup
Create a PostgreSQL database for the application.

```sql
CREATE DATABASE cs2dle;
```

### 2. Backend Setup
Navigate to the backend directory and configure the environment.

```bash
cd backend/rest-service
```

You need to set the following environment variables (or configure them in `application.properties`):
- `DB_URL`: JDBC URL (e.g., `jdbc:postgresql://localhost:5432/cs2dle`)
- `DB_USER`: Database username
- `DB_PASSWORD`: Database password
- `JWT_SECRET`: Secret key for JWT tokens

Run the application:
```bash
./mvnw spring-boot:run
```

### 3. Frontend Setup
Navigate to the frontend directory.

```bash
cd frontend
```

Install dependencies and start the development server:
```bash
npm install
npm run dev
```

### 4. Data Population
To populate the database with player data, use the provided Python script.

```bash
cd backend/rest-service
pip install requests mwparserfromhell python-dotenv psycopg2
```

Create a `.env` file in this directory with your database credentials:
```env
DB_NAME=cs2dle
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
```

Run the script (note: it respects Liquipedia's rate limits, so it may take some time):
```bash
python get_playerdata.py
```

## License & Credits

- **Data Source:** Player data is fetched from [Liquipedia Counter-Strike](https://liquipedia.net/counterstrike/) under the CC-BY-SA 3.0 license.
- **Disclaimer:** This project is not affiliated with Valve Corporation or Counter-Strike 2.
