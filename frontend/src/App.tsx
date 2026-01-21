import { useEffect, useState } from 'react'

function App() {
  const [playerName, setPlayerName] = useState('')

  type Player = {
    name: string,
    image: string
  }

  useEffect(() => {
    fetch('/api/players/6')
      .then(res => res.json())
      .then((data: Player) => {
        setPlayerName(data.name)
        setPlayerImageUrl(data.image)})
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>Player name:</h1>
      <p>{playerName}</p>
      <img src={`/api/players/${playerId}/image`}></img>
    </div>
  )
}

export default App