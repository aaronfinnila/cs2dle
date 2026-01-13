import { useEffect, useState } from 'react'

function App() {
  const [userName, setUserName] = useState('')

  type User = {
    name: string
  }

  useEffect(() => {
    fetch('/api/users/1')
      .then(res => res.json())
      .then((data: User) => setUserName(data.name))
      .catch(err => console.error(err))
  }, [])

  return (
    <div>
      <h1>User name:</h1>
      <p>{userName}</p>
    </div>
  )
}

export default App