# cs2dle

cs2dle is a daily guessing game for Counter-Strike 2 professional players. Test your esports knowledge by guessing the pro player based on attributes like nationality, team, age, and role.

**Note:** Currently, the player changes on every page refresh rather than daily.

**Live Website:** [cs2dle.org](https://cs2dle.org)  
**Repository:** [github.com/aaronfinnila/cs2dle](https://github.com/aaronfinnila/cs2dle)

## Features

- **Player to Guess:** A new pro player appears on every page refresh.
- **Attribute Clues:** Get feedback on your guesses based on:
  - Nationality
  - Team
  - Rating
  - Roles
  - Majors Won
  - Highest Top20 Placement
  - Age
- **Player Database:** Comprehensive database of top tier CS2 professionals.

## Tech Stack

This project is built as a fullstack application using React for the frontend, Spring Boot for the backend, and PostgreSQL for the database.

### Frontend
- **Framework:** React + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Animations:** Canvas Confetti

### Backend
- **Framework:** Java Spring Boot
- **Database:** PostgreSQL
- **Build Tool:** Maven

### Data Pipeline
- **Scripting:** Python
- **Source:** Player data is fetched from [Liquipedia](https://liquipedia.net/counterstrike/) using their MediaWiki API
- **Additional Data:** Player ratings, highest top 20 placements, and majors won are gathered by hand from [HLTV](https://www.hltv.org) for the live version
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

Navigate to the backend directory:
```bash
cd backend/rest-service
```

#### Set up Python Virtual Environment
Create and activate a virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

Install the required dependencies:
```bash
pip install requests mwparserfromhell python-dotenv psycopg2
```

#### Configure the Script
Before running the script, you need to:

1. **Add player names** to the `players` array at the top of `get_playerdata.py`. The script will fetch data for the players listed in this array.

2. **Create a `.env` file** in the `backend/rest-service` directory with your database credentials:
```env
DB_NAME=cs2dle
DB_USER=postgres
DB_PASSWORD=yourpassword
DB_HOST=localhost
DB_PORT=5432
```

#### Run the Script
Run the script (note: it respects Liquipedia's rate limits, so it may take some time):
```bash
python get_playerdata.py
```

## License & Credits

- **Data Source:** Player data is fetched from [Liquipedia Counter-Strike](https://liquipedia.net/counterstrike/) under the CC-BY-SA 3.0 license.
- **Disclaimer:** This project is not affiliated with Valve Corporation or Counter-Strike 2.
