import { useEffect, useRef, useState } from 'react'
import silhouette from '/assets/silhouette.png'
import countries from "i18n-iso-countries"
import en from "i18n-iso-countries/langs/en.json"
import confetti from 'canvas-confetti'

type Player = {
  name: string,
  id: number,
  country: string,
  team: string,
  roles: string,
  rating: number,
  birth_date: string,
  team_images: string[],
  team_history: string[],
  majors: number,
  top20: number
}

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
  const [playerTeamHistory, setPlayerTeamHistory] = useState<string[]>([])
  const [text, setText] = useState('')
  const [playerGuesses, setPlayerGuesses] = useState<Player[]>([])
  const [correctGuessed, setCorrectGuessed] = useState(false)
  
  const [allPlayers, setAllPlayers] = useState<Player[]>([])
  const [suggestions, setSuggestions] = useState<Player[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  
  const inputRef = useRef<HTMLInputElement>(null)
  const prevText = useRef("")
  const rollPlayerId = () => Math.floor(Math.random() * 110)
  const [correctPlayerId] = useState(rollPlayerId)

  const handleCloseAbout = () => {
    setShowAbout(false)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 50)
  }

  useEffect(() => {
    fetch('/api/players')
      .then(res => res.json())
      .then((data: Player[]) => setAllPlayers(data))
      .catch(err => console.error("Failed to load players for autocomplete", err))
  }, [])

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
        setPlayerMajors(data.majors)      })
      .catch(err => console.error(err))
  }, [playerId])

    useEffect(() => {
    if (!playerId) return
    fetch(`/api/players/${playerId}`)
      .then(res => {
        if (!res.ok) {
          setPlayerId(rollPlayerId)
        }
      return res.json()})
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
        setPlayerTeamHistory(data.team_history)
      })
      .catch(err => console.error(err))
  }, [playerId])

  const handleChange = (e: any) => {
    const value = e.target.value
    prevText.current = text
    setText(value)

    if (value.toLowerCase() === "goat") {
      const zywoo = allPlayers.filter(player => player.name === "ZywOo")
      setSuggestions(zywoo)
      setShowSuggestions(true)
      return
    }

    if (value.length > 0) {
      const filtered = allPlayers.filter(player => 
        player.name.toLowerCase().startsWith(value.toLowerCase())
      )
      setSuggestions(filtered)
      setShowSuggestions(true)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const submitGuess = (name: string) => {
    setText(name)
    setShowSuggestions(false)
    setSuggestions([])
    
    setPlayerId(correctPlayerId)
    fetch(`/api/players/get_id/${name}`)
    .then(res => {
      if (!res.ok) {
        alert("Player not found")
        throw new Error("Player not found")
      }
    return res.json()})
    .then((data: Player) => {
      if (playerGuesses.some(guess => guess.id === data.id)) {
        return
      }
      setText('')
      if (data.id === correctPlayerId) {
        setCorrectGuessed(true)
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 }
        })
      } else {
        setPlayerGuesses(prev => [...prev, data])
      }
    })
    .catch(e => console.error(e))
  }

  const handleSuggestionClick = (name: string) => {
    submitGuess(name)
  }

  const handleEnter = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault()
      if (suggestions.length > 0) {
        submitGuess(suggestions[0].name)
      } else {
        submitGuess(text)
      }
    }
  }

  return (
    <div className={`min-h-screen py-8 relative transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900'}`}>
      <button 
        onClick={() => setDarkMode(!darkMode)}
        className={`absolute top-4 right-16 w-10 h-10 rounded-full shadow-md flex items-center justify-center font-bold hover:cursor-pointer transition duration-300 ${darkMode ? 'bg-gray-800 text-yellow-300 hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
      >
        {darkMode ? '☀️' : '🌙'}
      </button>

      <button 
        onClick={() => setShowAbout(true)}
        className={`absolute top-4 right-4 w-10 h-10 rounded-full shadow-md flex items-center justify-center font-bold hover:cursor-pointer transition duration-300 ${darkMode ? 'bg-gray-800 text-white hover:bg-gray-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
      >
        ?
      </button>

      {showAbout && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleCloseAbout}>
          <div 
            className={`rounded-xl shadow-2xl max-w-2xl w-full p-8 relative transition-colors duration-300 ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`} 
            onClick={e => e.stopPropagation()}
          >
            <button 
              onClick={handleCloseAbout}
              className={`absolute top-4 right-4 font-bold text-xl hover:cursor-pointer ${darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
            >
              ✕
            </button>
            
            <h2 className={`text-3xl font-black tracking-tighter text-center mb-6 ${darkMode ? 'text-white' : 'text-gray-800'}`}>About cs2dle</h2>
            
            <div className={`space-y-6 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              <p className="text-lg text-center">
                Guess the mystery CS2 player! The player changes every day. Each guess reveals more clues to help you find the correct answer. The mystery player is from a current top 30 team, based on HLTV rankings.
              </p>

              <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <h3 className="font-bold mb-2 text-lg">Guide</h3>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-green-300 rounded"></div>
                  <span><span className="font-bold">Green:</span> Correct property.</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-red-300 rounded"></div>
                  <span><span className="font-bold">Red:</span> Incorrect property.</span>
                </div>
                <div className="flex items-start gap-2 mb-4">
                  <div className="w-4 h-4 bg-orange-300 rounded mt-1 shrink-0"></div>
                  <div>
                    <span className="font-bold">Orange:</span> Partially correct.
                    <ul className="list-disc list-inside ml-2 text-sm mt-1">
                      <li><strong>Team:</strong> Player played for this team in the past.</li>
                      <li><strong>Role:</strong> One of the player's roles matches.</li>
                    </ul>
                  </div>
                </div>

                <div className={`border-t pt-2 mt-2 ${darkMode ? 'border-gray-600' : 'border-gray-300'}`}>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">🏅</span>
                      <span>Highest HLTV Top 20 placement.</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-xl">🏆</span>
                      <span>Major championships won.</span>
                   </div>
                </div>
              </div>

              <div className={`text-sm space-y-2 border-t pt-4 ${darkMode ? 'text-gray-400 border-gray-600' : 'text-gray-500 border-gray-200'}`}>
                <p>
                  <strong>Data Sources:</strong> Mainly <a href="https://liquipedia.net/counterstrike/" target="_blank" className={`underline ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-500'}`}>Liquipedia</a>. 
                  Rating, Top 20 placements, and Majors won are from <a href="https://www.hltv.org/" target="_blank" className={`underline ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-500'}`}>HLTV</a>.
                </p>
                <p>
                  <strong>Images:</strong> Sourced from <a href="https://liquipedia.net/counterstrike/" target="_blank" className={`underline ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-500'}`}>Liquipedia</a>.
                </p>
                <p className="italic">
                  * Note: Player ratings, Top 20 placements and Majors won are gathered manually and may be slightly outdated.
                </p>
                <p className="pt-2 text-center font-medium">
                  Built and maintained by <a href="https://github.com/aaronfinnila" target="_blank" className={`underline ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-500'}`}>Aaron Finnilä</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className={`text-4xl font-black tracking-tighter text-center mb-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>cs2dle</h1>
      <div className={`mx-auto w-full max-w-[37.5rem] px-4 transition-all duration-300 ${darkMode ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]' : ''}`}>
        <img className="block mx-auto h-96 w-full object-fill" src={`${correctGuessed ? getPlayerImage(playerId) : silhouette}`}/>
      </div>
      <h1 className="text-center text-xl font-bold mt-4">{correctGuessed ? playerName : null}</h1>
      <h1 className="text-center">{correctGuessed ? getPlayerAge(playerAge) + " years old" : null}</h1>
      <h1 className="text-center">{correctGuessed ? countryNameToFlag(playerCountry) : null}</h1>
      <h1 className="text-center">{correctGuessed ? playerRating : null}</h1>
      <h1 className="text-center">{correctGuessed ? playerMajors + " Majors 🏆" : null}</h1>
      <h1 className="text-center">{correctGuessed ? `Highest Top20 placement: ${playerTop20 === 0 ? "N/A" : playerTop20} 🏅` : null}</h1>
      
      <div className="relative w-full max-w-[36rem] mx-auto mt-6 px-4">
        <input 
          ref={inputRef}
          autoFocus 
          type="text" 
          value={text} 
          onChange={handleChange} 
          onKeyDown={handleEnter} 
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Insert player name" 
          className={`
            w-full
            block
            border-2
            px-6 py-4
            text-2xl
            shadow-md
            focus:outline-none
            transition-colors duration-300
            ${darkMode 
              ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
              : 'bg-white border-black-200 text-gray-900 placeholder-gray-400'}
          `}
        />
        {showSuggestions && suggestions.length > 0 && (
          <ul className={`absolute z-10 left-0 right-0 mx-4 border shadow-lg max-h-80 overflow-y-auto transition-colors duration-300 ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            {suggestions.map((player) => (
              <li 
                key={player.id}
                onClick={() => handleSuggestionClick(player.name)}
                className={`px-6 py-3 cursor-pointer flex items-center gap-4 text-xl transition-colors duration-200 ${darkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-900'}`}
              >
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <img 
                        src={getPlayerImage(player.id)} 
                        alt={player.name} 
                        className="w-full h-full object-cover scale-150 origin-top" 
                    />
                </div>
                <span>{player.name}</span>
              </li>
            ))}
          </ul>
        )}
      </div>

        <div className="flex justify-center flex-col overflow-x-auto px-4 mt-8">
          <div className={`flex gap-2 w-full max-w-7xl mx-auto items-center text-2xl font-bold text-center mb-2 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className="w-72 shrink-0"></div>
            <div className="w-24 shrink-0">{playerGuesses.length > 0 && '🌍'}</div>
            <div className="w-48 shrink-0">{playerGuesses.length > 0 && 'Role'}</div>
            <div className="w-28 shrink-0">{playerGuesses.length > 0 && 'Rating'}</div>
            <div className="w-48 shrink-0">{playerGuesses.length > 0 && 'Team'}</div>
            <div className="w-28 shrink-0">{playerGuesses.length > 0 && '🏅'}</div>
            <div className="w-28 shrink-0">{playerGuesses.length > 0 && '🏆'}</div>
            <div className="w-28 shrink-0">{playerGuesses.length > 0 && 'Age'}</div>
          </div>
          {playerGuesses.map(guess => (
            <div key={guess.id} className={`flex gap-2 mt-6 w-full max-w-7xl mx-auto items-center text-3xl h-40 transition-colors duration-300 ${darkMode ? 'text-gray-900' : 'text-gray-900'}`}>
              <img className="h-40 w-72 object-fill shrink-0" src={getPlayerImage(guess.id)}/>
              <div className={`w-24 h-full flex items-center justify-center shrink-0 ${guess.country === playerCountry ? "bg-green-300" : "bg-red-300"}`}>{countryNameToFlag(guess.country)}</div>
              <div className={`w-48 h-full flex items-center justify-center shrink-0 truncate ${getRolesColor(guess.roles, playerRoles)}`}>{guess.roles.toLowerCase()}</div>
              <div className={`w-28 h-full flex flex-col items-center justify-center shrink-0 ${guess.rating === playerRating ? "bg-green-300" : "bg-red-300"}`}>
                <span>{guess.rating}</span>
                {guess.rating !== playerRating && <span>{guess.rating < playerRating ? "↑" : "↓"}</span>}
              </div>
              <div className={`w-48 h-full flex items-center justify-center shrink-0 ${getTeamColor(playerTeamHistory, playerTeam, guess.team)}`}>
                <img className="max-h-32 max-w-[80%] object-contain" src={getTeamImage(guess.id)} alt={guess.team} />
              </div>
              <div className={`w-28 h-full flex flex-col items-center justify-center shrink-0 ${guess.top20 === playerTop20 ? "bg-green-300" : "bg-red-300"}`}>
                <span>{getPlayerTop20(guess.top20)}</span>
                <span>{getTop20Arrows(guess.top20, playerTop20)}</span>
              </div>
              <div className={`w-28 h-full flex flex-col items-center justify-center shrink-0 ${guess.majors === playerMajors ? "bg-green-300" : "bg-red-300"}`}>
                <span>{guess.majors}</span>
                {guess.majors !== playerMajors && <span>{guess.majors < playerMajors ? "↑" : "↓"}</span>}
              </div>
              <div className={`w-28 h-full flex flex-col items-center justify-center shrink-0 ${calculate_age(guess.birth_date) === playerAge ? "bg-green-300" : "bg-red-300"}`}>
                <span>{calculate_age(guess.birth_date)}</span>
                {calculate_age(guess.birth_date) !== playerAge && <span>{calculate_age(guess.birth_date) < playerAge ? "↑" : "↓"}</span>}
              </div>
              </div>
          ))}
          </div>
      </div>
  )
}

function getTeamColor(team_history: string[], correctTeam: string, guessTeam: string): string {
  if (guessTeam === correctTeam) {
    return "bg-green-300"
  } else if (team_history.includes(guessTeam)) {
    return "bg-orange-300"
  } else {
    return "bg-red-300"
  }
}

function getPlayerTop20(guessTop20: number): string {
  if (guessTop20 === 0) {
    return "N/A"
  } else return `${guessTop20}`
}

function getRolesColor(guessRoles: string, correctRoles: string): string {
  const normalize = (r: string) => r.toLowerCase().replace(/rifler/g, "rifle");
  const normalizedGuess = normalize(guessRoles);
  const normalizedCorrect = normalize(correctRoles);

  if (normalizedGuess === normalizedCorrect) {
    return "bg-green-300"
  } else if (normalizedCorrect.includes(normalizedGuess)) {
    return "bg-orange-300"
  } else if (normalizedGuess.includes(normalizedCorrect)) {
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