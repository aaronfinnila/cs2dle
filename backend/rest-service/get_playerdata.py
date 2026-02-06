import requests
import mwparserfromhell
import re
import time
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import Json
import os


players = [
"apEX",
"ropz",
"ZywOo",
"flameZ",
"mezii",
"FalleN",
"yuurih",
"YEKINDAR",
"KSCERATO",
"molodoy",
"NiKo",
"TeSeS",
"m0NESY",
"kyxsan",
"kyousuke",
"Brollan",
"torzsi",
"Spinx",
"Jimpphat",
"xertioN",
"karrigan",
"frozen",
"Twistzz",
"broky",
"jcobbb",
"sh1ro",
"magixx",
"tN1R",
"zont1x",
"donk",
"bLitz",
"Techno",
"mzinho",
"910",
"cobrazera",
"huNter-",
"malbsMd",
"SunPayus",
"HeavyGod",
"MATYS",
"MAJ3R",
"XANTARES",
"woxic",
"soulfly",
"Wicadia",
"NAF",
"EliGE",
"NertZ",
"siuhy",
"ultimate",
"bodyy",
"Maka",
"Lucky",
"Ex3rcice",
"Graviti",
"HooXi",
"phzy",
"jabbi",
"Staehr",
"ryu",
"vsm",
"biguzera",
"piriajr",
"nqz",
"snow",
"JT",
"hallzerk",
"Grim",
"Kvem",
"nicx",
"alex666",
"npl",
"kensizor",
"esenthial",
"segukawa",
"Jame",
"BELCHONOKK",
"xiELO",
"nota",
"zweih",
"dumau",
"latto",
"n1ssim",
"lux",
"saadzin",
"xfl0ud",
"nilo",
"Chr1zN",
"yxngstxr",
"Alkaren",
"chelo",
"VINI",
"skullz",
"try",
"noway",
"makazze",
"Aleksib",
"iM",
"w0nderful",
"Aleksib",
"b1t"
]


API_URL = "https://liquipedia.net/counterstrike/api.php"

# Headers for ToS of the API
HEADERS = {
    "User-Agent": "CS2Stats (aaronfinnilaa@gmail.com) testing Python requests",
    "Accept-Encoding": "gzip"
}

def fetch_player_wikitext(player_name):
    params = {
        "action": "parse",
        "page": player_name,
        "format": "json",
        "prop": "wikitext"
    }
    response = requests.get(API_URL, params=params, headers=HEADERS)
    response.raise_for_status()
    data = response.json()
    return data.get("parse", {}).get("wikitext", {}).get("*", "")

def parse_infobox(wikitext):
    wikicode = mwparserfromhell.parse(wikitext)
    templates = wikicode.filter_templates()
    
    info = {
        "country": None,
        "birth_date": None,
        "team": None,
        "roles": None,
        "image": None,
        "team_history": []
    }
    
    for t in templates:
        if t.name.matches("Infobox player") or t.name.matches("Infobox Player"):
            for field in ["country", "birth_date", "team", "roles", "image"]:
                if t.has(field):
                    info[field] = str(t.get(field).value).strip()
                if t.has("team_history"):
                    teams_text = str(t.get("team_history").value)
                    teams = re.split(r",|\n", teams_text)
                    info["team_history"] = [t.split("|")[-1].strip('}') for t in teams if t.strip()
                                            and all(x not in t for x in ["Counter-Strike", "Substitute", "Inactive", "Stand-in"])]
            break
    return info

def fetch_team_image(team_name):
    params = {
        "action": "parse",
        "page": team_name,
        "format": "json",
        "prop": "wikitext"
    }
    response = requests.get(API_URL, params=params, headers=HEADERS)
    response.raise_for_status()
    data = response.json()
    wikitext = data.get("parse", {}).get("wikitext", {}).get("*", "")
    
    wikicode = mwparserfromhell.parse(wikitext)
    templates = wikicode.filter_templates()
    
    for t in templates:
        if t.name.matches("Infobox team") or t.name.matches("Infobox Team"):
            if t.has("image"):
                image_filename = str(t.get("image").value).strip()

                image_filename = image_filename.replace("File:", "").strip()
                params = {
                    "action": "query",
                    "titles": f"File:{image_filename}",
                    "prop": "imageinfo",
                    "iiprop": "url",
                    "format": "json"
                }
                response = requests.get(API_URL, params=params, headers=HEADERS)
                response.raise_for_status()
                data = response.json()

                pages = data.get("query", {}).get("pages", {})
                page_data = next(iter(pages.values()), {})
                if "imageinfo" in page_data:
                    return page_data["imageinfo"][0].get("url")
            break
    
    return None

def clean_teams(teams):
    for i, t in enumerate(teams):
        if "}" in t:
            teams[i] = t.split("}", 1)[0].strip()

    teams_new = []
    for t in teams:
        if t not in teams_new:
            teams_new.append(t)

    return teams_new

def fetch_player_data(player_name):
    wikitext = fetch_player_wikitext(player_name)
    info = parse_infobox(wikitext)

    player_image = None
    if info.get("image"):
        image_filename = str(info.get("image")).strip()
        image_filename = image_filename.replace("File:", "").strip()
        params = {
            "action": "query",
            "titles": f"File:{image_filename}",
            "prop": "imageinfo",
            "iiprop": "url",
            "format": "json"
        }
        response = requests.get(API_URL, params=params, headers=HEADERS)
        response.raise_for_status()
        data = response.json()

        pages = data.get("query", {}).get("pages", {})
        page_data = next(iter(pages.values()), {})
        if "imageinfo" in page_data:
            player_image = page_data["imageinfo"][0].get("url")

    team_images = []
    team_history = clean_teams(info["team_history"])
    for team in team_history:
        team_images.append(fetch_team_image(team))
        print(f"Fetched {team} image")
        print(f"Waiting 30s...")
        time.sleep(30) # Liquipedia ToS: 30s between parse requests
    
    player_data = {
        "name": player_name,
        "country": info["country"],
        "birth_date": info["birth_date"],
        "team": info["team"],
        "roles": info["roles"],
        "image": None, # player_image
        "team_history": clean_teams(info["team_history"]),
        "team_images": [] # team_images
    }
    return player_data

all_players_data = []

for player in players:
    try:
        data = fetch_player_data(player)
        all_players_data.append(data)
        print(f"Fetched {player}")
        if len(all_players_data) < len(players):
            print(f"Waiting 30s...")
            time.sleep(30)  # Liquipedia ToS: 30s between parse requests
    except Exception as e:
        print(f"Error fetching {player}: {e}")

load_dotenv()

DB_NAME = os.getenv("DB_NAME")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")

conn = None
cursor = None

try:
    conn = psycopg2.connect(dbname=DB_NAME, user=DB_USER, password=DB_PASSWORD, host=DB_HOST, port=DB_PORT)
    cursor = conn.cursor()
    
    for player_data in all_players_data:
        cursor.execute("""
            INSERT INTO players (name, country, birth_date, team, roles, image, team_history, team_images)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (name) 
            DO UPDATE SET 
                country = EXCLUDED.country,
                birth_date = EXCLUDED.birth_date,
                team = EXCLUDED.team,
                roles = EXCLUDED.roles,
                team_history = EXCLUDED.team_history,
                updated_at = CURRENT_TIMESTAMP
        """, (
            player_data["name"],
            player_data["country"],
            player_data["birth_date"],
            player_data["team"],
            player_data["roles"],
            player_data["image"],
            Json(player_data["team_history"]),
            Json(player_data["team_images"])
        ))
    
    conn.commit()
    print(f"Successfully inserted/updated {len(all_players_data)} players in database")
    
except psycopg2.Error as e:
    print(f"Database error: {e}")
    if conn:
        conn.rollback()
finally:
    if cursor:
        cursor.close()
    if conn:
        conn.close()