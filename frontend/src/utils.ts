import countries from "i18n-iso-countries"
import en from "i18n-iso-countries/langs/en.json"
import silhouette from '/assets/silhouette.png'

countries.registerLocale(en);

export function countryCodeToFlag(code: string): string {
  return code
    .toUpperCase()
    .replace(/./g, char =>
      String.fromCodePoint(127397 + char.charCodeAt(0))
    );
}

export function countryNameToFlag(name: string): string | null {
  const code = countries.getAlpha2Code(name, "en");
  return code ? countryCodeToFlag(code) : null;
}

export function calculate_age(birthdate: string): number {
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

export function getPlayerAge(age: number): any {
  if (age === 0) {
    return null
  } else {
    return age
  }
}

export function getPlayerImage(id: number): string {
  if (id === 0) {
    return silhouette
  } else {
    return `/api/players/${id}/image`
  }
}

export function getTeamImage(id: number, num: number): any {
  if (id === 0) {
    return undefined
  } else {
    // num 1 = latest team, 2 = second latest, etc
    return `/api/players/${id}/team_image_${num}`
  }
}

export function getTeamColor(team_history: string[], correctTeam: string, guessTeam: string): string {
  if (guessTeam === correctTeam) {
    return "bg-green-300"
  } else if (team_history.includes(guessTeam)) {
    return "bg-orange-300"
  } else {
    return "bg-red-300"
  }
}

export function getRolesColor(guessRoles: string, correctRoles: string): string {
  const normalize = (r: string) => r.toLowerCase().replace(/rifler/g, "rifle").replace(/\s+/g, '');
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

export function getPlayerTop20(guessTop20: number): string {
  if (guessTop20 === 0) {
    return "N/A"
  } else return `${guessTop20}`
}

export function getTop20Arrows(guessTop20: number, correctTop20: number): string {
  if (guessTop20 === correctTop20) {
    return ""
  } else if (guessTop20 < correctTop20) {
    return "↑"
  } else {
    return "↓"
  }
}
