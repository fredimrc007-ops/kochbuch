// Fasst Zutaten mehrerer Rezepte zusammen (gleicher Name + gleiche Einheit werden addiert)
export function buildShoppingList(entries) {
  const map = new Map()
  for (const { recipe, portions } of entries) {
    const f = portions / (recipe.portions || 1)
    for (const ing of recipe.ingredients) {
      const name = ing.name.trim()
      if (!name) continue
      const unit = (ing.unit || '').trim()
      const key = name.toLowerCase() + '|' + unit.toLowerCase()
      const amount = Number(ing.amount) || 0
      const cur = map.get(key) || { name, unit, amount: 0 }
      cur.amount += amount * f
      map.set(key, cur)
    }
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name, 'de'))
}

export function fmt(n) {
  if (!n) return ''
  return String(Math.round(n * 100) / 100).replace('.', ',')
}
