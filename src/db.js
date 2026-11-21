import Dexie from 'dexie'

export const db = new Dexie('kochbuch')
db.version(1).stores({
  recipes: '++id, title',
  shopping: '++id, done'
})

export async function exportAll() {
  return JSON.stringify({
    format: 'kochbuch-v1',
    recipes: await db.recipes.toArray(),
    shopping: await db.shopping.toArray()
  }, null, 2)
}

export async function importAll(text) {
  const data = JSON.parse(text)
  if (data.format !== 'kochbuch-v1') throw new Error('Unbekanntes Dateiformat')
  await db.transaction('rw', db.recipes, db.shopping, async () => {
    await db.recipes.clear(); await db.shopping.clear()
    await db.recipes.bulkAdd(data.recipes || [])
    await db.shopping.bulkAdd(data.shopping || [])
  })
}
