const z = (amount, unit, name) => ({ amount, unit, name })
export const seedRecipes = [
  {
    title: 'Acht Schätze austrochinesische Art', portions: 4,
    ingredients: [
      z(150,'g','Schweinsfilet'), z(150,'g','Hühnerbrust'), z(150,'g','Rindsfilet'), z(150,'g','Shrimps'),
      z(1,'','Zwiebel'), z(1,'','Paprika'), z(100,'g','Bambussprossen'), z(10,'g','Muer-Morcheln'),
      z(100,'g','Champignons'), z(100,'g','Zuckererbsen'), z(50,'g','Erdnüsse'), z(2,'','Jungzwiebeln'),
      z(3,'Zehen','Knoblauch'), z(1,'Stück','Ingwer'), z(1,'EL','Doubanjiang'), z(1,'EL','Tianmianjiang'),
      z(1,'EL','Haixianjiang (Hoisin)'), z(2,'EL','Sojasauce hell'), z(1,'TL','Sojasauce dunkel'),
      z(2,'EL','Reiswein'), z(1,'TL','Zucker'), z(1,'EL','Kartoffelstärke'), z(1,'','Ei')
    ],
    steps: 'Fleisch in Streifen schneiden und mit Salz, Pfeffer, Reiswein, Sojasauce, Stärke und Ei 15 Min. marinieren.\nMorcheln 20 Min. einweichen, Zuckererbsen kurz blanchieren.\nSauce aus Reiswein, Sojasaucen, Zucker, Stärke und 100 ml Wasser verrühren.\nFleisch und Shrimps einzeln im heißen Wok anbraten, herausnehmen.\nIngwer, Knoblauch und Jungzwiebeln anbraten, die drei Bohnensaucen kurz mitrösten.\nGemüse 3–4 Min. scharf braten, Fleisch zurück in den Wok, Sauce dazu und binden lassen.\nMit Erdnüssen und Jungzwiebelgrün bestreuen. Dazu Jasminreis.'
  },
  {
    title: 'Ramen mit Hackfleisch', portions: 4,
    ingredients: [
      z(300,'g','Schweinehack'), z(3,'Zehen','Knoblauch'), z(1,'Stück','Ingwer'), z(1,'EL','Doubanjiang'),
      z(4,'EL','Sojasauce hell'), z(1,'EL','Reiswein'), z(1,'TL','Zucker'), z(2,'EL','Sesamöl'),
      z(1,'l','Hühnerbrühe'), z(1,'EL','Miso-Paste'), z(400,'g','Ramen-Nudeln'), z(4,'','Eier'),
      z(2,'','Jungzwiebeln'), z(150,'g','Champignons'), z(2,'Handvoll','Spinat'), z(1,'Dose','Mais')
    ],
    steps: 'Eier 6½ Min. kochen, abschrecken, schälen.\nHack in Sesamöl knusprig braten, Knoblauch, Ingwer, Doubanjiang zugeben, mit Sojasauce, Reiswein, Zucker einkochen.\nPilze separat anbraten.\nBrühe mit Sojasauce erhitzen, Miso extra auflösen und erst zum Schluss einrühren.\nNudeln separat kochen, Spinat die letzten 30 Sek. mitgaren.\nIn Schüsseln anrichten: Nudeln, Brühe, Hack, Pilze, Ei, Mais, Jungzwiebeln.'
  }
]
