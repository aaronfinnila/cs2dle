import { useEffect, useState } from 'react'
import Button from './Button'

function App() {
  const [playerName, setPlayerName] = useState('')
  const [playerId, setPlayerId] = useState(6)

  type Player = {
    name: string,
    id: number
  }

  useEffect(() => {
    if (!playerId) return
    fetch(`/api/players/${playerId}`)
      .then(res => res.json())
      .then((data: Player) => {
        setPlayerName(data.name)
        setPlayerId(data.id)
      })
      .catch(err => console.error(err))
  }, [playerId])

  return (
    <div>
      <h1 className="text-center">Player name: {playerName}</h1>
      <img className="block mx-auto" src={`/api/players/${playerId}/image`} alt={`Player ${playerId}`} />
      <Button onClick={() => setPlayerId(id => id + 1)} text={"Next player"}/>
      <Button onClick={() => setPlayerId(id => id - 1)} text={"Last player"}/>
    </div>
  )
}

export default App