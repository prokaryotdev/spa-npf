import { stateCommands } from "./content-footer";

/**
 * Where a report or an application lands: the Force's own map of the
 * country, Force Headquarters → State Command → Division.
 *
 * Every report, call and request carries a `Jurisdiction`. It is what puts a
 * robbery in Kano on the Kano State Command's board and not on Lagos's, and
 * what lets a Kano duty officer send only Kano units to it.
 *
 * Commands are the 36 State Commands and the FCT Command, one per state, as
 * the Force is organised. The 774 Local Government Areas are the ones in the
 * Constitution's First Schedule; every LGA has divisional police cover, so the
 * LGA is the key a division is found by. The Force's own directory of
 * divisions (names, addresses, phone lines) is not public, so this build names
 * a division by the LGA it covers and the API supplies the real one: see
 * `divisionFor` and docs/API-CONTRACT.md.
 */

export type Jurisdiction = {
  /** State name as the Force writes it: "Lagos", "Akwa Ibom", "FCT". */
  state: string;
  /** Local Government Area, from the state's own list. */
  lga: string;
  /** The division that covers that LGA. */
  division: string;
  /** Street, landmark or village: what an officer drives to. */
  address?: string;
};

export type NgState = {
  name: string;
  capital: string;
  /** Geopolitical zone, as Customer Centers groups the commands. */
  zone: string;
  /** Command headquarters, for "nearest command" by location. */
  lat: number;
  lng: number;
  lgas: string[];
};

/** Capital coordinates, two decimals: enough to pick a state, no more. */
const COORDS: Record<string, [number, number]> = {
  FCT: [9.06, 7.49], Abia: [5.53, 7.49], Adamawa: [9.21, 12.48],
  "Akwa Ibom": [5.04, 7.91], Anambra: [6.21, 7.07], Bauchi: [10.31, 9.84],
  Bayelsa: [4.93, 6.27], Benue: [7.73, 8.54], Borno: [11.83, 13.15],
  "Cross River": [4.96, 8.33], Delta: [6.2, 6.73], Ebonyi: [6.32, 8.11],
  Edo: [6.34, 5.63], Ekiti: [7.62, 5.22], Enugu: [6.44, 7.5],
  Gombe: [10.29, 11.17], Imo: [5.48, 7.03], Jigawa: [11.76, 9.34],
  Kaduna: [10.52, 7.44], Kano: [12.0, 8.52], Katsina: [12.99, 7.6],
  Kebbi: [12.45, 4.2], Kogi: [7.8, 6.74], Kwara: [8.5, 4.55],
  Lagos: [6.6, 3.35], Nasarawa: [8.49, 8.52], Niger: [9.61, 6.56],
  Ogun: [7.15, 3.35], Ondo: [7.25, 5.19], Osun: [7.77, 4.56],
  Oyo: [7.38, 3.95], Plateau: [9.9, 8.86], Rivers: [4.82, 7.03],
  Sokoto: [13.06, 5.24], Taraba: [8.89, 11.36], Yobe: [11.75, 11.96],
  Zamfara: [12.16, 6.66],
};

const LGAS: Record<string, string[]> = {
  FCT: [
    "Abaji", "Abuja Municipal", "Bwari", "Gwagwalada", "Kuje", "Kwali",
  ],
  Abia: [
    "Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano",
    "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa",
    "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umu-Nneochi",
    "Umuahia North", "Umuahia South",
  ],
  Adamawa: [
    "Demsa", "Fufore", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada",
    "Lamurde", "Madagali", "Maiha", "Mayo-Belwa", "Michika", "Mubi North",
    "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North",
    "Yola South",
  ],
  "Akwa Ibom": [
    "Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo",
    "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono Ibom", "Ika", "Ikono",
    "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat Enin", "Nsit Atai",
    "Nsit Ibom", "Nsit Ubium", "Obot Akara", "Okobo", "Onna", "Oron",
    "Oruk Anam", "Udung Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo",
  ],
  Anambra: [
    "Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North",
    "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North",
    "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South",
    "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South",
    "Oyi",
  ],
  Bauchi: [
    "Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa",
    "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau",
    "Ningi", "Shira", "Tafawa-Balewa", "Toro", "Warji", "Zaki",
  ],
  Bayelsa: [
    "Brass", "Ekeremor", "Kolokuma-Opokuma", "Nembe", "Ogbia", "Sagbama",
    "Southern Ijaw", "Yenagoa",
  ],
  Benue: [
    "Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West",
    "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo",
    "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo",
    "Vandeikya",
  ],
  Borno: [
    "Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa",
    "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge",
    "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri",
    "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani",
  ],
  "Cross River": [
    "Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki",
    "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra",
    "Obudu", "Odukpani", "Ogoja", "Yakurr", "Yala",
  ],
  Delta: [
    "Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East",
    "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South",
    "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South",
    "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani",
    "Uvwie", "Warri North", "Warri South", "Warri South West",
  ],
  Ebonyi: [
    "Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North",
    "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu",
    "Onicha",
  ],
  Edo: [
    "Akoko Edo", "Egor", "Esan Central", "Esan North East", "Esan South East",
    "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben",
    "Ikpoba-Okha", "Oredo", "Orhionmwon", "Ovia North East", "Ovia South West",
    "Owan East", "Owan West", "Uhunmwonde",
  ],
  Ekiti: [
    "Ado-Ekiti", "Efon", "Ekiti East", "Ekiti South West", "Ekiti West",
    "Emure", "Gbonyin", "Ido-Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje",
    "Irepodun-Ifelodun", "Ise-Orun", "Moba", "Oye",
  ],
  Enugu: [
    "Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu",
    "Igbo-Etiti", "Igbo-Eze North", "Igbo-Eze South", "Isi-Uzo", "Nkanu East",
    "Nkanu West", "Nsukka", "Oji-River", "Udenu", "Udi", "Uzo-Uwani",
  ],
  Gombe: [
    "Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo",
    "Kwami", "Nafada", "Shongom", "Yamaltu/Deba",
  ],
  Imo: [
    "Aboh-Mbaise", "Ahiazu-Mbaise", "Ehime-Mbano", "Ezinihitte", "Ideato North",
    "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu",
    "Mbaitoli", "Ngor-Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta",
    "Ohaji-Egbema", "Okigwe", "Orlu", "Orsu", "Oru-East", "Oru-West",
    "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo",
  ],
  Jigawa: [
    "Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa",
    "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun",
    "Kafin Hausa", "Kaugama", "Kazaure", "Kiri Kasama", "Kiyawa", "Maigatari",
    "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura",
    "Yankwashi",
  ],
  Kaduna: [
    "Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a",
    "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura",
    "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba",
    "Zangon Kataf", "Zaria",
  ],
  Kano: [
    "Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala",
    "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa",
    "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo",
    "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura",
    "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo",
    "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada",
    "Ungogo", "Warawa", "Wudil",
  ],
  Katsina: [
    "Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi",
    "Dandume", "Danja", "Danmusa", "Daura", "Dutsi", "Dutsin-Ma", "Faskari",
    "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia",
    "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi",
    "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango",
  ],
  Kebbi: [
    "Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi",
    "Bunza", "Dandi", "Danko/Wasagu", "Fakai", "Gwandu", "Jega", "Kalgo",
    "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Yauri",
    "Zuru",
  ],
  Kogi: [
    "Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah",
    "Igalamela-Odolu", "Ijumu", "Kabba-Bunu", "Kogi", "Lokoja", "Mopa-Muro",
    "Ofu", "Ogori Magongo", "Okehi", "Okene", "Olamaboro", "Omala",
    "Yagba East", "Yagba West",
  ],
  Kwara: [
    "Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South",
    "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke-Ero",
    "Oyun", "Pategi",
  ],
  Lagos: [
    "Agege", "Ajeromi/Ifelodun", "Alimosho", "Amuwo Odofin", "Apapa", "Badagry",
    "Epe", "Eti-Osa", "Ibeju/Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu",
    "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi/Isolo",
    "Somolu", "Surulere",
  ],
  Nasarawa: [
    "Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia",
    "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba",
  ],
  Niger: [
    "Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako",
    "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga",
    "Mashegu", "Mokwa", "Muya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja",
    "Tafa", "Wushishi",
  ],
  Ogun: [
    "Abeokuta North", "Abeokuta South", "Ado Odo-Ota", "Egbado North",
    "Egbado South", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North",
    "Ijebu North-East", "Ijebu-Ode", "Ikenne", "Imeko-Afon", "Ipokia",
    "Obafemi-Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North",
    "Shagamu",
  ],
  Ondo: [
    "Akoko North-East", "Akoko North-West", "Akoko South-East",
    "Akoko South-West", "Akure North", "Akure South", "Ese-Odo", "Idanre",
    "Ifedore", "Ilaje", "Ile-Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa",
    "Ondo East", "Ondo West", "Ose", "Owo",
  ],
  Osun: [
    "Aiyedire", "Atakunmosa East", "Atakunmosa West", "Ayedaade", "Boluwaduro",
    "Boripe", "Ede North", "Ede South", "Egbedore", "Ejigbo", "Ife Central",
    "Ife East", "Ife North", "Ife South", "Ifedayo", "Ifelodun", "Ila",
    "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo",
    "Obokun", "Odo Otin", "Ola-Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo",
  ],
  Oyo: [
    "Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North",
    "Ibadan North East", "Ibadan North West", "Ibadan South East",
    "Ibadan South West", "Ibarapa Central", "Ibarapa East", "Ibarapa North",
    "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Kajola", "Lagelu",
    "Ogbomosho North", "Ogbomosho South", "Ogo-Oluwa", "Olorunsogo", "Oluyole",
    "Ona-Ara", "Orelope", "Ori-Ire", "Oyo East", "Oyo West", "Saki East",
    "Saki West", "Surulere",
  ],
  Plateau: [
    "Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South",
    "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang",
    "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase",
  ],
  Rivers: [
    "Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni",
    "Asari-Toru", "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana",
    "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika",
    "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai",
  ],
  Sokoto: [
    "Binji", "Bodinga", "Dange-Shuni", "Gada", "Goronyo", "Gudu", "Gwadabawa",
    "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari",
    "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta",
    "Wamako", "Wurno", "Yabo",
  ],
  Taraba: [
    "Ardo-Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo",
    "Karim-Lamido", "Kurmi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari",
    "Yorro", "Zing",
  ],
  Yobe: [
    "Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani",
    "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa",
    "Yunusari", "Yusufari",
  ],
  Zamfara: [
    "Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi",
    "Gusau", "Kaura-Namoda", "Maradun", "Maru", "Shinkafi", "Talata-Mafara",
    "Tsafe", "Zurmi",
  ],
};

/** All 37 commands, FCT first, then A–Z, which is how people look for them. */
export const STATES: NgState[] = Object.keys(LGAS).map((name) => {
  const command = stateCommands.find((c) => c.state === name);
  if (!command) throw new Error(`No command for ${name}`);
  const [lat, lng] = COORDS[name];
  return {
    name,
    capital: command.city,
    zone: command.zone,
    lat,
    lng,
    lgas: LGAS[name],
  };
});

export const stateNamed = (name: string) =>
  STATES.find((s) => s.name === name) ?? null;

/** "Lagos State Command", "FCT Command". English; display sites call t(). */
export const commandOf = (state: string) =>
  state === "FCT" ? "FCT Command" : `${state} State Command`;

/**
 * The division that answers for an LGA. Named by the LGA until the API hands
 * back the Force's directory; the shape does not change when it does.
 */
export const divisionFor = (state: string, lga: string) =>
  lga ? `${lga} Division` : "";

/** A complete jurisdiction from the two choices a person actually makes. */
export function jurisdiction(
  state: string,
  lga: string,
  address?: string,
): Jurisdiction {
  return { state, lga, division: divisionFor(state, lga), address };
}

/** One line for a board or a receipt: "Ikeja, Lagos". */
export const placeLine = (j: Pick<Jurisdiction, "state" | "lga">) =>
  j.state === "FCT" ? `${j.lga}, FCT` : `${j.lga}, ${j.state}`;

/**
 * A street line with the LGA and state added only where it does not
 * already say them: "Ikeja, Lagos" stays as it is, "Allen Avenue" becomes
 * "Allen Avenue, Ikeja, Lagos".
 */
export function placeOf(
  area: string,
  where: Pick<Jurisdiction, "state" | "lga">,
  withState = true,
) {
  const has = (s: string) => area.toLowerCase().includes(s.toLowerCase());
  const parts = [area];
  if (where.lga && !has(where.lga)) parts.push(where.lga);
  if (withState && !has(where.state) && !(where.state === "FCT" && has("Abuja")))
    parts.push(where.state);
  return parts.join(", ");
}

/**
 * The command whose headquarters is closest to a point. A suggestion only:
 * near a state line the closest capital can be across it, so the form shows
 * the guess and the person confirms it.
 */
export function nearestState(lat: number, lng: number): NgState {
  let best = STATES[0];
  let bestD = Infinity;
  for (const s of STATES) {
    const d = (s.lat - lat) ** 2 + ((s.lng - lng) * Math.cos((lat * Math.PI) / 180)) ** 2;
    if (d < bestD) {
      bestD = d;
      best = s;
    }
  }
  return best;
}
