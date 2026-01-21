import { useEffect, useState } from 'react'

function App() {
  const [playerName, setPlayerName] = useState('')
  const [playerId, setPlayerId] = useState(0)

  type Player = {
    name: string,
    id: number
  }

  useEffect(() => {
    fetch('/api/players/6')
      .then(res => res.json())
      .then((data: Player) => {
        setPlayerName(data.name)
        setPlayerId(data.id)})
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>Player name: {playerName}</h1>
      <img src={`/api/players/${playerId}/image`}></img>
    </div>
  )
}

export default App