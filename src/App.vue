<script setup>
import { ref, computed, onMounted } from 'vue'
import { db, exportAll, importAll } from './db'
import { buildShoppingList, fmt } from './shopping'
import { seedRecipes } from './seed'

const tab = ref('recipes')            // recipes | shopping | backup
const recipes = ref([])
const shopping = ref([])
const search = ref('')
const view = ref(null)                // Rezept in Ansicht
const portions = ref(1)
const edit = ref(null)                // Rezept im Editor
const picks = ref({})                 // id -> Portionen für Einkaufsliste
const msg = ref('')

async function load() {
  recipes.value = await db.recipes.orderBy('title').toArray()
  shopping.value = await db.shopping.toArray()
}
onMounted(load)

const filtered = computed(() => {
  const q = search.value.trim().toLowerCase()
  return recipes.value.filter(r => !q || r.title.toLowerCase().includes(q) ||
    r.ingredients.some(i => i.name.toLowerCase().includes(q)))
})

function open(r) { view.value = r; portions.value = r.portions }
function newRecipe() {
  edit.value = { title: '', portions: 4, ingredients: [{ amount: '', unit: '', name: '' }], steps: '' }
}
function editRecipe(r) { edit.value = JSON.parse(JSON.stringify(r)); view.value = null }
async function save() {
  const r = edit.value
  if (!r.title.trim()) { msg.value = 'Bitte einen Titel eingeben.'; return }
  r.ingredients = r.ingredients.filter(i => i.name.trim())
  r.portions = Number(r.portions) || 1
  await db.recipes.put(JSON.parse(JSON.stringify(r)))
  edit.value = null; msg.value = ''; await load()
}
async function remove(r) {
  if (!confirm(`„${r.title}" wirklich löschen?`)) return
  await db.recipes.delete(r.id); view.value = null; await load()
}
async function loadSeed() {
  await db.recipes.bulkAdd(JSON.parse(JSON.stringify(seedRecipes))); await load()
}

function togglePick(r) {
  const p = { ...picks.value }
  if (p[r.id]) delete p[r.id]; else p[r.id] = r.portions
  picks.value = p
}
const pickCount = computed(() => Object.keys(picks.value).length)
async function makeList() {
  const entries = recipes.value.filter(r => picks.value[r.id])
    .map(r => ({ recipe: r, portions: Number(picks.value[r.id]) || r.portions }))
  const items = buildShoppingList(entries).map(i => ({ ...i, done: 0 }))
  await db.shopping.clear(); await db.shopping.bulkAdd(items)
  picks.value = {}; await load(); tab.value = 'shopping'
}
async function toggleDone(i) { await db.shopping.update(i.id, { done: i.done ? 0 : 1 }); await load() }
async function clearList() { await db.shopping.clear(); await load() }
const addItem = ref('')
async function addManual() {
  if (!addItem.value.trim()) return
  await db.shopping.add({ name: addItem.value.trim(), unit: '', amount: 0, done: 0 })
  addItem.value = ''; await load()
}

async function doExport() {
  const blob = new Blob([await exportAll()], { type: 'application/json' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob)
  a.download = `kochbuch-${new Date().toISOString().slice(0, 10)}.json`
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 5000)
}
async function doImport(e) {
  const f = e.target.files[0]; if (!f) return
  if (!confirm('Import ersetzt alle vorhandenen Rezepte. Fortfahren?')) return
  try { await importAll(await f.text()); msg.value = 'Import erfolgreich.'; await load() }
  catch (err) { msg.value = 'Fehler: ' + err.message }
  e.target.value = ''
}
</script>

<template>
  <header><h1>🍳 Mein Kochbuch</h1></header>
  <div class="wrap">

    <!-- Editor -->
    <template v-if="edit">
      <h2>{{ edit.id ? 'Rezept bearbeiten' : 'Neues Rezept' }}</h2>
      <div class="card">
        <input v-model="edit.title" placeholder="Titel" />
        <p class="row"><span>Portionen:</span><input v-model="edit.portions" type="number" min="1" style="width:90px" /></p>
        <h2>Zutaten</h2>
        <div class="ing" v-for="(i, n) in edit.ingredients" :key="n">
          <input v-model="i.amount" inputmode="decimal" placeholder="Menge" />
          <input v-model="i.unit" placeholder="Einheit" />
          <input v-model="i.name" placeholder="Zutat" />
          <button class="b alt sm" @click="edit.ingredients.splice(n, 1)">✕</button>
        </div>
        <button class="b alt sm" @click="edit.ingredients.push({ amount: '', unit: '', name: '' })">+ Zutat</button>
        <h2>Zubereitung (ein Schritt pro Zeile)</h2>
        <textarea v-model="edit.steps"></textarea>
        <p class="mute" v-if="msg">{{ msg }}</p>
        <div class="row" style="margin-top:12px">
          <button class="b" @click="save">Speichern</button>
          <button class="b alt" @click="edit = null; msg = ''">Abbrechen</button>
        </div>
      </div>
    </template>

    <!-- Rezeptansicht -->
    <template v-else-if="view">
      <button class="b alt sm" style="margin-top:12px" @click="view = null">← Zurück</button>
      <h2 style="font-size:1.4rem">{{ view.title }}</h2>
      <div class="card">
        <p class="row"><span>Portionen:</span>
          <button class="b alt sm" @click="portions = Math.max(1, portions - 1)">−</button>
          <b>{{ portions }}</b>
          <button class="b alt sm" @click="portions++">+</button></p>
        <ul style="padding-left:18px">
          <li v-for="(i, n) in view.ingredients" :key="n">
            {{ fmt((Number(i.amount) || 0) * portions / view.portions) }} {{ i.unit }} {{ i.name }}
          </li>
        </ul>
      </div>
      <div class="card"><ol><li v-for="(s, n) in view.steps.split('\n').filter(x => x.trim())" :key="n">{{ s }}</li></ol></div>
      <div class="row">
        <button class="b" @click="editRecipe(view)">Bearbeiten</button>
        <button class="b alt" @click="remove(view)">Löschen</button>
      </div>
    </template>

    <!-- Rezepte -->
    <template v-else-if="tab === 'recipes'">
      <div class="row" style="margin-top:12px">
        <input class="grow" v-model="search" placeholder="Suchen (Titel oder Zutat)" />
        <button class="b" @click="newRecipe">+ Neu</button>
      </div>
      <p v-if="!recipes.length" class="card">Noch keine Rezepte.
        <button class="b alt sm" @click="loadSeed">Beispielrezepte laden</button></p>
      <div class="card" v-for="r in filtered" :key="r.id">
        <div class="row">
          <input type="checkbox" style="width:22px;height:22px" :checked="!!picks[r.id]" @change="togglePick(r)" title="Für Einkaufsliste" />
          <div class="grow" @click="open(r)" style="cursor:pointer">
            <b>{{ r.title }}</b><div class="mute">{{ r.ingredients.length }} Zutaten · {{ r.portions }} Portionen</div>
          </div>
          <input v-if="picks[r.id]" v-model="picks[r.id]" type="number" min="1" style="width:70px" />
        </div>
      </div>
      <button v-if="pickCount" class="b" style="position:fixed;bottom:64px;right:16px;z-index:6" @click="makeList">
        🛒 Einkaufsliste ({{ pickCount }})</button>
    </template>

    <!-- Einkaufsliste -->
    <template v-else-if="tab === 'shopping'">
      <h2>Einkaufsliste</h2>
      <p v-if="!shopping.length" class="mute">Leer. Hake in „Rezepte" Gerichte an und tippe auf „Einkaufsliste".</p>
      <ul style="padding:0">
        <li class="s" v-for="i in shopping" :key="i.id">
          <input type="checkbox" :checked="!!i.done" @change="toggleDone(i)" />
          <span :class="{ done: i.done }">{{ fmt(i.amount) }} {{ i.unit }} {{ i.name }}</span>
        </li>
      </ul>
      <div class="row"><input class="grow" v-model="addItem" placeholder="Eigenen Artikel hinzufügen" @keyup.enter="addManual" />
        <button class="b" @click="addManual">+</button></div>
      <p v-if="shopping.length"><button class="b alt" @click="clearList">Liste leeren</button></p>
    </template>

    <!-- Sicherung -->
    <template v-else>
      <h2>Sicherung</h2>
      <div class="card">
        <p>Alle Rezepte liegen nur auf diesem Gerät. Exportiere sie regelmäßig als Datei,
          um sie zu sichern oder aufs andere Gerät zu bringen.</p>
        <button class="b" @click="doExport">Rezepte exportieren</button>
        <p><label>Import (ersetzt alles):<input type="file" accept=".json,application/json" @change="doImport" /></label></p>
        <p class="mute" v-if="msg">{{ msg }}</p>
      </div>
    </template>
  </div>

  <nav v-if="!edit && !view">
    <button :class="{ on: tab === 'recipes' }" @click="tab = 'recipes'">📖 Rezepte</button>
    <button :class="{ on: tab === 'shopping' }" @click="tab = 'shopping'">🛒 Einkauf</button>
    <button :class="{ on: tab === 'backup' }" @click="tab = 'backup'">💾 Sicherung</button>
  </nav>
</template>
