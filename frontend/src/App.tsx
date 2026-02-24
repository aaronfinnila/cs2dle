import { useEffect, useRef, useState } from 'react'
import silhouette from '/assets/silhouette.png'
import confetti from 'canvas-confetti'
import { Trophy, Medal } from 'lucide-react'
import { Player } from './types'
import { GuessRow } from './components/GuessRow'
import React from 'react'
import { 
  calculate_age, 
  countryNameToFlag, 
  getPlayerImage, 
  getPlayerAge,
  getTeamImage
} from './utils'

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
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode')
    return saved !== null ? JSON.parse(saved) : true
  })
  
  const inputRef = useRef<HTMLInputElement>(null)
  const prevText = useRef("")
  
  // api url fixed
  const baseUrl = import.meta.env.VITE_API_URL;
  const apiKey = import.meta.env.VITE_API_KEY;

  const [correctPlayerId, setCorrectPlayerId] = useState(0)

  useEffect(() => {
    fetch(`${baseUrl}/players`, {
      headers: {
        'X-API-KEY': apiKey
      }
    })
      .then(res => res.json())
      .then((data: Player[]) => {
        setAllPlayers(data)
        if (data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.length)
            setCorrectPlayerId(data[randomIndex].id)
        }
      })
      .catch(err => console.error("Failed to load players for autocomplete", err))
  }, [])

  useEffect(() => {
    if (!correctGuessed) return
    fetch(`${baseUrl}/players/${playerId}`, {
      headers: {
        'X-API-KEY': apiKey
      }
    })
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
        setPlayerTeamHistory(data.team_history)
      })
      .catch(err => console.error(err))
  }, [playerId])

    useEffect(() => {
    if (!playerId) return
    fetch(`${baseUrl}/players/${playerId}`, {
      headers: {
        'X-API-KEY': apiKey
      }
    })
      .then(res => {
        if (!res.ok) {
           if (allPlayers.length > 0) {
            const randomIndex = Math.floor(Math.random() * allPlayers.length)
            setPlayerId(allPlayers[randomIndex].id)
          }
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

  useEffect(() => {
    if (correctGuessed) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [correctGuessed]);

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
    fetch(`${baseUrl}/players/get_id/${name}`, {
      headers: {
        'X-API-KEY': apiKey
      }
    })
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
      setPlayerGuesses(prev => [...prev, data])
      
      if (data.id === correctPlayerId) {
        setTimeout(() => {
          setCorrectGuessed(true)
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 }
          })
        }, 5500)
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
    <div className={`flex flex-col min-h-screen py-8 relative transition-colors duration-300 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-900'}`}>
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
                Guess the mystery CS2 player! Each guess reveals more clues to help you find the correct answer. The mystery player is from a current top 30 team, based on HLTV rankings.
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
                      <Medal className="w-6 h-6 text-yellow-500" />
                      <span>Highest HLTV Top 20 placement.</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <Trophy className="w-6 h-6 text-yellow-500" />
                      <span>Major championships won.</span>
                   </div>
                </div>
              </div>

              <div className={`text-sm space-y-2 border-t pt-4 ${darkMode ? 'text-gray-400 border-gray-600' : 'text-gray-500 border-gray-200'}`}>
                <p>
                  <strong>Data Sources:</strong> Mainly <a href="https://liquipedia.net/counterstrike/" target="_blank" className={`underline ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-500'}`}>Liquipedia</a>. 
                  Rating, Top 20 placements, and Majors won are from <a href="https://www.hltv.org/" target="_blank" className={`underline ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-500'}`}>HLTV</a>,
                  last updated on 23.2.2026. Rating is based on past 3 months.
                </p>
                <p>
                  <strong>Images:</strong> Sourced from <a href="https://liquipedia.net/counterstrike/" target="_blank" className={`underline ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-500'}`}>Liquipedia</a>.
                </p>
                <p className="italic">
                  * Note: Player ratings, Top 20 placements and Majors won are gathered manually and may be slightly outdated.
                </p>
                <p className="pt-2 text-center font-medium">
                  Built and maintained by <a href="https://github.com/aaronfinnila/cs2dle" target="_blank" className={`underline ${darkMode ? 'hover:text-blue-400' : 'hover:text-blue-500'}`}>Aaron Finnilä</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <h1 className={`text-4xl font-black tracking-tighter text-center mb-6 transition-colors duration-300 ${darkMode ? 'text-white' : 'text-gray-800'}`}>cs2dle</h1>
      <div className={`mx-auto w-full max-w-[37.5rem] px-4 transition-all duration-300 ${darkMode ? 'drop-shadow-[0_0_15px_rgba(255,255,255,0.15)]' : ''}`}>
        <img 
          key={correctGuessed ? 'revealed' : 'silhouette'}
          className={`block mx-auto h-96 w-full object-fill ${correctGuessed ? 'animate-fade-in' : ''}`} 
          src={`${correctGuessed ? getPlayerImage(playerId) : silhouette}`}
          onError={(e) => {
            e.currentTarget.src = silhouette
          }}
        />
      </div>
      <div className={`transition-all duration-1000 ${correctGuessed ? 'opacity-100 max-h-screen' : 'opacity-0 max-h-0 overflow-hidden'}`}>
        <h1 className="text-center text-4xl font-black mt-4 animate-fade-in">{correctGuessed ? playerName : null}</h1>
        <h1 className="text-center text-2xl font-bold animate-fade-in animation-delay-200">{correctGuessed ? getPlayerAge(playerAge) + " years old" : null}</h1>
        <h1 className="text-center text-5xl my-2 animate-fade-in animation-delay-400">{correctGuessed ? countryNameToFlag(playerCountry) : null}</h1>
        <h1 className="text-center text-xl font-semibold animate-fade-in animation-delay-600">{correctGuessed ? `Rating: ${playerRating}` : null}</h1>
        <div className="flex items-center justify-center gap-2 text-xl font-semibold animate-fade-in animation-delay-800">
          {correctGuessed ? (
            <>
              {playerMajors} Majors <Trophy className="w-6 h-6 text-yellow-500" />
            </>
          ) : null}
        </div>
        <div className="flex items-center justify-center gap-2 text-xl font-semibold animate-fade-in animation-delay-1000">
          {correctGuessed ? (
            <>
              Highest Top20 placement: {playerTop20 === 0 ? "N/A" : playerTop20} <Medal className="w-6 h-6 text-yellow-500" />
            </>
          ) : null}
        </div>
        <div className="flex items-center justify-center gap-4 mt-4 animate-fade-in animation-delay-1000">
             {correctGuessed && 
             Array.from({ length: 3 }).map((_, index, arr) => {
               const num = arr.length - index
               const teamImageUrl = getTeamImage(playerId, num)
               return (
                <React.Fragment key={num}>
               {teamImageUrl ? (
                 <img 
                   key={num} 
                   src={teamImageUrl} 
                   className="h-12 w-auto object-contain" 
                   onError={(e) => {
                     e.currentTarget.style.display = 'none';
                     const questionMark = e.currentTarget.nextElementSibling;
                     if (questionMark && questionMark.classList.contains('team-fallback')) {
                       (questionMark as HTMLElement).style.display = 'flex';
                     }
                   }}
                 />
               ) : null}
               <div 
                 className={`team-fallback h-12 w-12 items-center justify-center text-2xl font-bold ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}
                 style={{ display: teamImageUrl ? 'none' : 'flex' }}
               >
                 ?
               </div>
               {index < arr.length - 1 && (
                <span className="text-xl opacity-70">→</span>
               )}
                </React.Fragment>
               )
            }
          )
        }
        </div>
      </div>
      
      <div className="relative w-full max-w-[36rem] mx-auto mt-6 px-4">
        {correctGuessed ? (
          <button 
            onClick={() => window.location.reload()}
            className={`
              w-full
              block
              border-2
              px-6 py-4
              text-2xl
              font-bold
              shadow-md
              hover:cursor-pointer
              transition-all duration-300
              ${darkMode 
                ? 'bg-green-600 border-green-500 text-white hover:bg-green-500' 
                : 'bg-green-500 border-green-400 text-white hover:bg-green-400'}
            `}
          >
            Play Again
          </button>
        ) : (
          <>
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
                            src={getPlayerImage(player.id) || silhouette} 
                            alt={player.name} 
                            className="w-full h-full object-cover scale-150 origin-top" 
                            onError={(e) => {
                                e.currentTarget.src = silhouette
                            }}
                        />
                    </div>
                    <span>{player.name}</span>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>

        <div className={`flex justify-center flex-col overflow-x-auto overflow-y-hidden px-4 my-8 ${playerGuesses.length === 0 ? 'hidden' : ''}`}>
          <div className={`flex gap-2 w-full max-w-7xl mx-auto items-center text-2xl font-bold text-center mb-2 transition-colors duration-300 min-w-max ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <div className="w-72 shrink-0"></div>
            <div className="w-24 shrink-0">{playerGuesses.length > 0 && '🌍'}</div>
            <div className="w-48 shrink-0">{playerGuesses.length > 0 && 'Role'}</div>
            <div className="w-28 shrink-0">{playerGuesses.length > 0 && 'Rating'}</div>
            <div className="w-48 shrink-0">{playerGuesses.length > 0 && 'Team'}</div>
            <div className="w-28 shrink-0 flex justify-center">{playerGuesses.length > 0 && <Medal className="w-6 h-6 text-yellow-500" />}</div>
            <div className="w-28 shrink-0 flex justify-center">{playerGuesses.length > 0 && <Trophy className="w-6 h-6 text-yellow-500" />}</div>
            <div className="w-28 shrink-0">{playerGuesses.length > 0 && 'Age'}</div>
          </div>
          {playerGuesses.map(guess => (
              <GuessRow 
                key={guess.id} 
                guess={guess} 
                darkMode={darkMode}
                target={{
                  country: playerCountry,
                  roles: playerRoles,
                  rating: playerRating,
                  team: playerTeam,
                  team_history: playerTeamHistory,
                  top20: playerTop20,
                  majors: playerMajors,
                  age: playerAge
                }}
              />
          ))}
          </div>
        <div className={`mt-auto text-center text-sm font-medium transition-colors duration-300 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
        Click <span className="font-bold">?</span> in top right for more info
      </div>
    </div>
  )
}

export default App
