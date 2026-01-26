import { useEffect, useRef, useState } from 'react'
import silhouette from '/assets/silhouette.png'
import countries from "i18n-iso-countries"
import en from "i18n-iso-countries/langs/en.json"

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
  const correctPlayerId = Math.floor(Math.random() * (110))

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

    useEffect(() => {
    if (!playerId) return
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
          setPlayerGuesses(prev => [...prev, data])
          setCorrectGuessed(true)
        } else {
          setPlayerGuesses(prev => [...prev, data])
        }
      })
    }
  }

  return (
    <div>
      <img className="block mx-auto w-150 h-96 object-fill" src={`${correctGuessed ? getPlayerImage(playerId) : silhouette}`} alt={playerName}/>
      <h1 className="text-center">{correctGuessed ? playerName : null}</h1>
      <h1 className="text-center">{correctGuessed ? getPlayerAge(playerAge) + " years old" : null}</h1>
      <h1 className="text-center">{correctGuessed ? countryNameToFlag(playerCountry) : null}</h1>
      <h1 className="text-center">{correctGuessed ? playerRating : null}</h1>
      <h1 className="text-center">{correctGuessed ? playerMajors + " Majors 🏆" : null}</h1>
      <h1 className="text-center">{correctGuessed ? `Highest Top20 placement: ${playerTop20 === 0 ? "N/A" : playerTop20} 🏅` : null}</h1>
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
        <div className="flex justify-center flex-col">
          <div className="flex gap-2 mt-2 w-full max-w-5xl mx-auto items-center text-xl font-bold text-center mb-2">
            <div className="w-52 shrink-0"></div>
            <div className="w-12 shrink-0">{playerGuesses.length > 0 && '🌍'}</div>
            <div className="w-32 shrink-0">{playerGuesses.length > 0 && 'Role'}</div>
            <div className="w-16 shrink-0">{playerGuesses.length > 0 && 'Rating'}</div>
            <div className="w-32 shrink-0">{playerGuesses.length > 0 && 'Team'}</div>
            <div className="w-16 shrink-0">{playerGuesses.length > 0 && '🏅'}</div>
            <div className="w-16 shrink-0">{playerGuesses.length > 0 && '🏆'}</div>
            <div className="w-16 shrink-0">{playerGuesses.length > 0 && 'Age'}</div>
          </div>
          {playerGuesses.map(guess => (
            <div key={guess.id} className="flex gap-2 mt-6 w-full max-w-5xl mx-auto items-center text-2xl h-32">
              <img className="h-32 w-52 object-fill shrink-0" src={getPlayerImage(guess.id)}/>
              <div className={`w-12 h-full flex items-center justify-center shrink-0 ${guess.country === playerCountry ? "bg-green-300" : "bg-red-300"}`}>{countryNameToFlag(guess.country)}</div>
              <div className={`w-32 h-full flex items-center justify-center shrink-0 truncate ${getRolesColor(guess.roles, playerRoles)}`}>{guess.roles}</div>
              <div className={`w-16 h-full flex flex-col items-center justify-center shrink-0 ${guess.rating === playerRating ? "bg-green-300" : "bg-red-300"}`}>
                <span>{guess.rating}</span>
                {guess.rating !== playerRating && <span>{guess.rating < playerRating ? "↑" : "↓"}</span>}
              </div>
              <div className={`w-32 h-full flex items-center justify-center shrink-0 ${guess.team === playerTeam ? "bg-green-300" : "bg-red-300"}`}>
                <img className="max-h-24 max-w-[80%] object-contain" src={getTeamImage(guess.id)} alt={guess.team} />
              </div>
              <div className={`w-16 h-full flex flex-col items-center justify-center shrink-0 ${guess.top20 === playerTop20 ? "bg-green-300" : "bg-red-300"}`}>
                <span>{getPlayerTop20(guess.top20, playerTop20)}</span>
                <span>{getTop20Arrows(guess.top20, playerTop20)}</span>
              </div>
              <div className={`w-16 h-full flex flex-col items-center justify-center shrink-0 ${guess.majors === playerMajors ? "bg-green-300" : "bg-red-300"}`}>
                <span>{guess.majors}</span>
                {guess.majors !== playerMajors && <span>{guess.majors < playerMajors ? "↑" : "↓"}</span>}
              </div>
              <div className={`w-16 h-full flex flex-col items-center justify-center shrink-0 ${calculate_age(guess.birth_date) === playerAge ? "bg-green-300" : "bg-red-300"}`}>
                <span>{calculate_age(guess.birth_date)}</span>
                {calculate_age(guess.birth_date) !== playerAge && <span>{calculate_age(guess.birth_date) < playerAge ? "↑" : "↓"}</span>}
              </div>
              </div>
          ))}
          </div>
      </div>
  )
}

function getPlayerTop20(guessTop20: number, correctTop20: number): string {
  if (guessTop20 === 0 && correctTop20 === 0) {
    return "N/A"
  } else return `${guessTop20}`
}

function getRolesColor(guessRoles: string, correctRoles: string): string {
  if (guessRoles === correctRoles) {
    return "bg-green-300"
  } else if (correctRoles.includes(guessRoles)) {
    return "bg-orange-300"
  } else if (guessRoles.includes(correctRoles)) {
    return "bg-orange-300"
  } else {
    return "bg-red-300"
  }
}

function getTop20Arrows(guessTop20: number, correctTop20: number): string {
  if (guessTop20 === correctTop20) {
    return ""
  } else if (guessTop20 < correctTop20) {
    return "↑"
  } else {
    return "↓"
  }
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