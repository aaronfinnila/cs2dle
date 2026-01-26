import { useEffect, useRef, useState } from 'react'
import silhouette from '/assets/silhouette.png'
import countries from "i18n-iso-countries";
import en from "i18n-iso-countries/langs/en.json";

function App() {
  const [playerName, setPlayerName] = useState('')
  const [playerId, setPlayerId] = useState(0)
  const [playerCountry, setPlayerCountry] = useState('')
  const [playerTeam, setPlayerTeam] = useState('')
  const [playerAge, setPlayerAge] = useState(0)
  const [playerRoles, setPlayerRoles] = useState('')
  const [playerRating, setPlayerRating] = useState(0)
  const [playerTop20, setPlayerTop20] = useState(0)
  const [playerMajors, setPlayerMajors] = useState(0)
  const [text, setText] = useState('')
  const [playerGuesses, setPlayerGuesses] = useState<Player[]>([])
  const [correctGuessed, setCorrectGuessed] = useState(false)
  const prevText = useRef("")
  const correctPlayerId = 13

  type Player = {
    name: string,
    id: number,
    country: string,
    team: string,
    roles: string,
    rating: number,
    birth_date: string,
    team_images: string[],
    majors: number,
    top20: number
  }

  useEffect(() => {
    if (!correctGuessed) return
    fetch(`/api/players/${playerId}`)
      .then(res => res.json())
      .then((data: Player) => {
        setPlayerName(data.name)
        setPlayerId(data.id)
        setPlayerCountry(data.country)
        setPlayerTeam(data.team)
        setPlayerAge(calculate_age(data.birth_date))
        setPlayerRoles(data.roles)
        setPlayerRating(data.rating)
        setPlayerTop20(data.top20)
        setPlayerMajors(data.majors)
      })
      .catch(err => console.error(err))
  }, [playerId])

  const handleChange = (e: any) => {5
    prevText.current = text
    setText(e.target.value)
  }

  const handleEnter = (e: any) => {
    setPlayerId(correctPlayerId)
    if (e.key === "Enter") {
      fetch(`/api/players/get_id/${text}`)
      .then(res => res.json())
      .then((data: Player) => {
        if (data.id === correctPlayerId) {
          setCorrectGuessed(true)
        } else {
          setPlayerGuesses(prev => [...prev, data])
        }
      })
    }
  }

  return (
    <div>
      <img className="block mx-auto w-112 h-96" src={`${correctGuessed ? getPlayerImage(playerId) : silhouette}`} alt={playerName}/>
      <h1 className="text-center">{playerName}</h1>
      <h1 className="text-center">{getPlayerAge(playerAge)}</h1>
      <h1 className="text-center">{countryNameToFlag(playerCountry)}</h1>
      <input autoFocus type="text" value={text} onChange={handleChange} onKeyDown={handleEnter} placeholder="Insert player name" className="
        w-52
        mt-6
        block mx-auto
        border-2 border-black-200
        bg-white
        px-4 py-3
        text-lg
        text-gray-900
        placeholder-gray-400
        shadow-md
        focus:outline-none
        transition"/>
        <div>
          {playerGuesses.map(guess => (
            <div key={guess.id} className="flex gap-4 mt-6 justify-center items-center text-2xl">
              <img className="h-24 w-48 object-scale-down" src={getPlayerImage(guess.id)}/>
              {guess.name}
              <span className={`${guess.country === playerCountry ? "bg-green-300" : "bg-red-300"}`}>{countryNameToFlag(guess.country)}</span>
              <span className={`${guess.roles === playerRoles ? "bg-green-300" : "bg-red-300"}`}>{guess.roles}</span>
              <span className={`${guess.rating > playerRating ? "bg-green-300" : "bg-red-300"}`}>{guess.rating}</span>
              <span className={`${guess.team === playerTeam ? "bg-green-300" : "bg-red-300"}`}>{guess.team}</span>
              <span className={`${guess.top20 > playerTop20 ? "bg-green-300" : "bg-red-300"}`}>{guess.top20}</span>
              <span className={`${guess.majors < playerMajors ? "bg-green-300" : "bg-red-300"}`}>{guess.majors}</span>
              <span className={`${calculate_age(guess.birth_date) < playerAge ? "bg-green-300" : "bg-red-300"}`}>{calculate_age(guess.birth_date)}</span>
              </div>
          ))}
          </div>
      </div>
  )
}

function getPlayerImage(id: number): string {
  if (id === 0) {
    return silhouette
  } else {
    return `/api/players/${id}/image`
  }
}

function getTeamImage(id: number): any {
  if (id === 0) {
    return undefined
  } else {
    return `/api/players/${id}/team_image`
  }
}

function getPlayerAge(age: number): any {
  if (age === 0) {
    return null
  } else {
    return age
  }
}

function calculate_age(birthdate: string): number {
  let year: number = Number(birthdate.substring(0, 4))
  let month: number = Number(birthdate.substring(5, 7))
  let day: number = Number(birthdate.substring(8, 10))

  let dateTime = new Date()
  let age: number = 0

  if (month < dateTime.getMonth()+1) {
    age = dateTime.getFullYear() - year
  } else if (month > dateTime.getMonth()+1) {
    age = dateTime.getFullYear() - (year+1)
  } else {
    if (dateTime.getDate() > day) {
      age = dateTime.getFullYear() - year
    } else {
      age = dateTime.getFullYear() - (year+1)
    }
  }
  return age
}

function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

countries.registerLocale(en);

function countryNameToFlag(name: string): string | null {
  const code = countries.getAlpha2Code(name, "en");
  return code ? countryCodeToFlag(code) : null;
}
export default App