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
  const [text, setText] = useState('')
  const prevText = useRef("")
  const correctPlayerId = 13

  type Player = {
    name: string,
    id: number,
    country: string,
    team: string,
    roles: string,
    birth_date: string,
    team_images: string[],
    majors: number,
    top20: number
  }

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
      })
      .catch(err => console.error(err))
  }, [playerId])

  const handleChange = (e: any) => {
    prevText.current = text
    setText(e.target.value)
  }

  const handleEnter = (e: any) => {
    if (e.key === "Enter") {
      let tempId: number = 0
      fetch(`/api/players/get_id/${text}`)
      .then(res => res.json())
      .then((data: Player) => {
        tempId = data.id
        if (tempId === correctPlayerId) {
          setPlayerId(tempId)
        } else {
          console.log(data.country + " " + data.name + " " + data.team + " " + data.roles + " majors: " + data.majors + " highest top20: " + data.top20)
        }
      })
    }
  }

  return (
    <div>
      <img className="block mx-auto" src={getPlayerImage(playerId)} alt={playerName}/>
      <h1 className="text-center">{playerName}</h1>
      <h1 className="text-center">{getPlayerAge(playerAge)}</h1>
      <h1 className="text-center">{countryNameToFlag(playerCountry)}</h1>
      <img className="block mx-auto h-24 w-48 object-scale-down" src={getTeamImage(playerId)} alt={playerName}/>
      <input type="text" value={text} onChange={handleChange} onKeyDown={handleEnter} placeholder="Insert player name" className="
        w-52
        block mx-auto
        border-2 border-black-200
        bg-white
        px-4 py-3
        text-lg
        text-gray-900
        placeholder-gray-400
        shadow-md
        focus:ring-4 focus:ring-blue-100
        focus:outline-none
        transition"/>
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
    return null
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