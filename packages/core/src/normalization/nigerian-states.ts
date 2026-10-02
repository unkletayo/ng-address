export interface NigerianStateData {
  name: string;
  code: string;
  capital: string;
  geoZone: "North Central" | "North East" | "North West" | "South East" | "South South" | "South West";
  aliases: string[];
  lgas: string[];
}

export const NIGERIAN_STATES: readonly NigerianStateData[] = [
  {
    name: "Abia",
    code: "AB",
    capital: "Umuahia",
    geoZone: "South East",
    aliases: ["abia state"],
    lgas: ["Aba North", "Aba South", "Arochukwu", "Bende", "Ikwuano", "Isiala Ngwa North", "Isiala Ngwa South", "Isuikwuato", "Obi Ngwa", "Ohafia", "Osisioma", "Ugwunagbo", "Ukwa East", "Ukwa West", "Umuahia North", "Umuahia South", "Umu Nneochi"]
  },
  {
    name: "Adamawa",
    code: "AD",
    capital: "Yola",
    geoZone: "North East",
    aliases: ["adamawa state"],
    lgas: ["Demsa", "Fufore", "Ganye", "Girei", "Gombi", "Guyuk", "Hong", "Jada", "Lamurde", "Madagali", "Maiha", "Mayo Belwa", "Michika", "Mubi North", "Mubi South", "Numan", "Shelleng", "Song", "Toungo", "Yola North", "Yola South"]
  },
  {
    name: "Akwa Ibom",
    code: "AK",
    capital: "Uyo",
    geoZone: "South South",
    aliases: ["akwa ibom state", "akwa-ibom"],
    lgas: ["Abak", "Eastern Obolo", "Eket", "Esit Eket", "Essien Udim", "Etim Ekpo", "Etinan", "Ibeno", "Ibesikpo Asutan", "Ibiono-Ibom", "Ika", "Ikono", "Ikot Abasi", "Ikot Ekpene", "Ini", "Itu", "Mbo", "Mkpat-Enin", "Nsit-Atai", "Nsit-Ibom", "Nsit-Ubium", "Obot Akara", "Okobo", "Onna", "Oron", "Oruk Anam", "Udung-Uko", "Ukanafun", "Uruan", "Urue-Offong/Oruko", "Uyo"]
  },
  {
    name: "Anambra",
    code: "AN",
    capital: "Awka",
    geoZone: "South East",
    aliases: ["anambra state"],
    lgas: ["Aguata", "Anambra East", "Anambra West", "Anaocha", "Awka North", "Awka South", "Ayamelum", "Dunukofia", "Ekwusigo", "Idemili North", "Idemili South", "Ihiala", "Njikoka", "Nnewi North", "Nnewi South", "Ogbaru", "Onitsha North", "Onitsha South", "Orumba North", "Orumba South", "Oyi"]
  },
  {
    name: "Bauchi",
    code: "BA",
    capital: "Bauchi",
    geoZone: "North East",
    aliases: ["bauchi state"],
    lgas: ["Alkaleri", "Bauchi", "Bogoro", "Damban", "Darazo", "Dass", "Gamawa", "Ganjuwa", "Giade", "Itas/Gadau", "Jama'are", "Katagum", "Kirfi", "Misau", "Ningi", "Shira", "Tafawa Balewa", "Toro", "Warji", "Zaki"]
  },
  {
    name: "Bayelsa",
    code: "BY",
    capital: "Yenagoa",
    geoZone: "South South",
    aliases: ["bayelsa state"],
    lgas: ["Brass", "Ekeremor", "Kolokuma/Opokuma", "Nembe", "Ogbia", "Sagbama", "Southern Ijaw", "Yenagoa"]
  },
  {
    name: "Benue",
    code: "BE",
    capital: "Makurdi",
    geoZone: "North Central",
    aliases: ["benue state"],
    lgas: ["Ado", "Agatu", "Apa", "Buruku", "Gboko", "Guma", "Gwer East", "Gwer West", "Katsina-Ala", "Konshisha", "Kwande", "Logo", "Makurdi", "Obi", "Ogbadibo", "Ohimini", "Oju", "Okpokwu", "Otukpo", "Tarka", "Ukum", "Ushongo", "Vandeikya"]
  },
  {
    name: "Borno",
    code: "BO",
    capital: "Maiduguri",
    geoZone: "North East",
    aliases: ["borno state"],
    lgas: ["Abadam", "Askira/Uba", "Bama", "Bayo", "Biu", "Chibok", "Damboa", "Dikwa", "Gubio", "Guzamala", "Gwoza", "Hawul", "Jere", "Kaga", "Kala/Balge", "Konduga", "Kukawa", "Kwaya Kusar", "Mafa", "Magumeri", "Maiduguri", "Marte", "Mobbar", "Monguno", "Ngala", "Nganzai", "Shani"]
  },
  {
    name: "Cross River",
    code: "CR",
    capital: "Calabar",
    geoZone: "South South",
    aliases: ["cross river state", "cross-river"],
    lgas: ["Abi", "Akamkpa", "Akpabuyo", "Bakassi", "Bekwarra", "Biase", "Boki", "Calabar Municipal", "Calabar South", "Etung", "Ikom", "Obanliku", "Obubra", "Obudu", "Odukpani", "Ogoja", "Yakuur", "Yala"]
  },
  {
    name: "Delta",
    code: "DE",
    capital: "Asaba",
    geoZone: "South South",
    aliases: ["delta state"],
    lgas: ["Aniocha North", "Aniocha South", "Bomadi", "Burutu", "Ethiope East", "Ethiope West", "Ika North East", "Ika South", "Isoko North", "Isoko South", "Ndokwa East", "Ndokwa West", "Okpe", "Oshimili North", "Oshimili South", "Patani", "Sapele", "Udu", "Ughelli North", "Ughelli South", "Ukwuani", "Uvwie", "Warri North", "Warri South", "Warri South West"]
  },
  {
    name: "Ebonyi",
    code: "EB",
    capital: "Abakaliki",
    geoZone: "South East",
    aliases: ["ebonyi state"],
    lgas: ["Abakaliki", "Afikpo North", "Afikpo South", "Ebonyi", "Ezza North", "Ezza South", "Ikwo", "Ishielu", "Ivo", "Izzi", "Ohaozara", "Ohaukwu", "Onicha"]
  },
  {
    name: "Edo",
    code: "ED",
    capital: "Benin City",
    geoZone: "South South",
    aliases: ["edo state"],
    lgas: ["Akoko-Edo", "Egor", "Esan Central", "Esan North-East", "Esan South-East", "Esan West", "Etsako Central", "Etsako East", "Etsako West", "Igueben", "Ikpoba Okha", "Orhionmwon", "Oredo", "Ovia North-East", "Ovia South-West", "Owan East", "Owan West", "Uhunmwonde"]
  },
  {
    name: "Ekiti",
    code: "EK",
    capital: "Ado Ekiti",
    geoZone: "South West",
    aliases: ["ekiti state"],
    lgas: ["Ado Ekiti", "Efon", "Ekiti East", "Ekiti South-West", "Ekiti West", "Emure", "Gbonyin", "Ido Osi", "Ijero", "Ikere", "Ikole", "Ilejemeje", "Irepodun/Ifelodun", "Ise/Orun", "Moba", "Oye"]
  },
  {
    name: "Enugu",
    code: "EN",
    capital: "Enugu",
    geoZone: "South East",
    aliases: ["enugu state"],
    lgas: ["Aninri", "Awgu", "Enugu East", "Enugu North", "Enugu South", "Ezeagu", "Igbo Etiti", "Igbo Eze North", "Igbo Eze South", "Isi Uzo", "Nkanu East", "Nkanu West", "Nsukka", "Oji River", "Udenu", "Udi", "Uzo Uwani"]
  },
  {
    name: "Federal Capital Territory",
    code: "FC",
    capital: "Abuja",
    geoZone: "North Central",
    aliases: ["fct", "f.c.t", "abuja", "fct abuja", "abuja fct", "federal capital territory abuja"],
    lgas: ["Abaji", "Bwari", "Gwagwalada", "Kuje", "Kwali", "Municipal Area Council"]
  },
  {
    name: "Gombe",
    code: "GO",
    capital: "Gombe",
    geoZone: "North East",
    aliases: ["gombe state"],
    lgas: ["Akko", "Balanga", "Billiri", "Dukku", "Funakaye", "Gombe", "Kaltungo", "Kwami", "Nafada", "Shongom", "Yamaltu/Deba"]
  },
  {
    name: "Imo",
    code: "IM",
    capital: "Owerri",
    geoZone: "South East",
    aliases: ["imo state"],
    lgas: ["Aboh Mbaise", "Ahiazu Mbaise", "Ehime Mbano", "Ezinihitte", "Ideato North", "Ideato South", "Ihitte/Uboma", "Ikeduru", "Isiala Mbano", "Isu", "Mbaitoli", "Ngor Okpala", "Njaba", "Nkwerre", "Nwangele", "Obowo", "Oguta", "Ohaji/Egbema", "Okigwe", "Orlu", "Orsu", "Oru East", "Oru West", "Owerri Municipal", "Owerri North", "Owerri West", "Unuimo"]
  },
  {
    name: "Jigawa",
    code: "JI",
    capital: "Dutse",
    geoZone: "North West",
    aliases: ["jigawa state"],
    lgas: ["Auyo", "Babura", "Biriniwa", "Birnin Kudu", "Buji", "Dutse", "Gagarawa", "Garki", "Gumel", "Guri", "Gwaram", "Gwiwa", "Hadejia", "Jahun", "Kafin Hausa", "Kazaure", "Kiri Kasama", "Kiyawa", "Kaugama", "Maigatari", "Malam Madori", "Miga", "Ringim", "Roni", "Sule Tankarkar", "Taura", "Yankwashi"]
  },
  {
    name: "Kaduna",
    code: "KD",
    capital: "Kaduna",
    geoZone: "North West",
    aliases: ["kaduna state"],
    lgas: ["Birnin Gwari", "Chikun", "Giwa", "Igabi", "Ikara", "Jaba", "Jema'a", "Kachia", "Kaduna North", "Kaduna South", "Kagarko", "Kajuru", "Kaura", "Kauru", "Kubau", "Kudan", "Lere", "Makarfi", "Sabon Gari", "Sanga", "Soba", "Zangon Kataf", "Zaria"]
  },
  {
    name: "Kano",
    code: "KN",
    capital: "Kano",
    geoZone: "North West",
    aliases: ["kano state"],
    lgas: ["Ajingi", "Albasu", "Bagwai", "Bebeji", "Bichi", "Bunkure", "Dala", "Dambatta", "Dawakin Kudu", "Dawakin Tofa", "Doguwa", "Fagge", "Gabasawa", "Garko", "Garun Mallam", "Gaya", "Gezawa", "Gwale", "Gwarzo", "Kabo", "Kano Municipal", "Karaye", "Kibiya", "Kiru", "Kumbotso", "Kunchi", "Kura", "Madobi", "Makoda", "Minjibir", "Nasarawa", "Rano", "Rimin Gado", "Rogo", "Shanono", "Sumaila", "Takai", "Tarauni", "Tofa", "Tsanyawa", "Tudun Wada", "Ungogo", "Warawa", "Wudil"]
  },
  {
    name: "Katsina",
    code: "KT",
    capital: "Katsina",
    geoZone: "North West",
    aliases: ["katsina state"],
    lgas: ["Bakori", "Batagarawa", "Batsari", "Baure", "Bindawa", "Charanchi", "Dandume", "Danja", "Dan Musa", "Daura", "Dutsi", "Dutsin Ma", "Faskari", "Funtua", "Ingawa", "Jibia", "Kafur", "Kaita", "Kankara", "Kankia", "Katsina", "Kurfi", "Kusada", "Mai'Adua", "Malumfashi", "Mani", "Mashi", "Matazu", "Musawa", "Rimi", "Sabuwa", "Safana", "Sandamu", "Zango"]
  },
  {
    name: "Kebbi",
    code: "KE",
    capital: "Birnin Kebbi",
    geoZone: "North West",
    aliases: ["kebbi state"],
    lgas: ["Aleiro", "Arewa Dandi", "Argungu", "Augie", "Bagudo", "Birnin Kebbi", "Bunza", "Dandi", "Fakai", "Gwandu", "Jega", "Kalgo", "Koko/Besse", "Maiyama", "Ngaski", "Sakaba", "Shanga", "Suru", "Danko/Wasagu", "Yauri", "Zuru"]
  },
  {
    name: "Kogi",
    code: "KO",
    capital: "Lokoja",
    geoZone: "North Central",
    aliases: ["kogi state"],
    lgas: ["Adavi", "Ajaokuta", "Ankpa", "Bassa", "Dekina", "Ibaji", "Idah", "Igalamela Odolu", "Ijumu", "Kabba/Bunu", "Kogi", "Lokoja", "Mopa Muro", "Ofu", "Ogori/Magongo", "Okehi", "Okene", "Olamaboro", "Omala", "Yagba East", "Yagba West"]
  },
  {
    name: "Kwara",
    code: "KW",
    capital: "Ilorin",
    geoZone: "North Central",
    aliases: ["kwara state"],
    lgas: ["Asa", "Baruten", "Edu", "Ekiti", "Ifelodun", "Ilorin East", "Ilorin South", "Ilorin West", "Irepodun", "Isin", "Kaiama", "Moro", "Offa", "Oke Ero", "Oyun", "Pategi"]
  },
  {
    name: "Lagos",
    code: "LA",
    capital: "Ikeja",
    geoZone: "South West",
    aliases: ["lagos state", "eko"],
    lgas: ["Agege", "Ajeromi-Ifelodun", "Alimosho", "Amuwo-Odofin", "Apapa", "Badagry", "Epe", "Eti Osa", "Ibeju-Lekki", "Ifako-Ijaiye", "Ikeja", "Ikorodu", "Kosofe", "Lagos Island", "Lagos Mainland", "Mushin", "Ojo", "Oshodi-Isolo", "Shomolu", "Surulere"]
  },
  {
    name: "Nasarawa",
    code: "NA",
    capital: "Lafia",
    geoZone: "North Central",
    aliases: ["nasarawa state", "nassarawa"],
    lgas: ["Akwanga", "Awe", "Doma", "Karu", "Keana", "Keffi", "Kokona", "Lafia", "Nasarawa", "Nasarawa Egon", "Obi", "Toto", "Wamba"]
  },
  {
    name: "Niger",
    code: "NI",
    capital: "Minna",
    geoZone: "North Central",
    aliases: ["niger state"],
    lgas: ["Agaie", "Agwara", "Bida", "Borgu", "Bosso", "Chanchaga", "Edati", "Gbako", "Gurara", "Katcha", "Kontagora", "Lapai", "Lavun", "Magama", "Mariga", "Mashegu", "Mokwa", "Moya", "Paikoro", "Rafi", "Rijau", "Shiroro", "Suleja", "Tafa", "Wushishi"]
  },
  {
    name: "Ogun",
    code: "OG",
    capital: "Abeokuta",
    geoZone: "South West",
    aliases: ["ogun state"],
    lgas: ["Abeokuta North", "Abeokuta South", "Ado-Odo/Ota", "Ewekoro", "Ifo", "Ijebu East", "Ijebu North", "Ijebu North East", "Ijebu Ode", "Ikenne", "Imeko Afon", "Ipokia", "Obafemi Owode", "Odeda", "Odogbolu", "Ogun Waterside", "Remo North", "Shagamu", "Yewa North", "Yewa South"]
  },
  {
    name: "Ondo",
    code: "ON",
    capital: "Akure",
    geoZone: "South West",
    aliases: ["ondo state"],
    lgas: ["Akoko North-East", "Akoko North-West", "Akoko South-East", "Akoko South-West", "Akure North", "Akure South", "Ese Odo", "Idanre", "Ifedore", "Ilaje", "Ile Oluji/Okeigbo", "Irele", "Odigbo", "Okitipupa", "Ondo East", "Ondo West", "Ose", "Owo"]
  },
  {
    name: "Osun",
    code: "OS",
    capital: "Osogbo",
    geoZone: "South West",
    aliases: ["osun state"],
    lgas: ["Atakunmosa East", "Atakunmosa West", "Aiyedaade", "Aiyedire", "Boluwaduro", "Boripe", "Ede North", "Ede South", "Ife Central", "Ife East", "Ife North", "Ife South", "Egbedore", "Ejigbo", "Ifedayo", "Ifelodun", "Ila", "Ilesa East", "Ilesa West", "Irepodun", "Irewole", "Isokan", "Iwo", "Obokun", "Odo Otin", "Ola Oluwa", "Olorunda", "Oriade", "Orolu", "Osogbo"]
  },
  {
    name: "Oyo",
    code: "OY",
    capital: "Ibadan",
    geoZone: "South West",
    aliases: ["oyo state"],
    lgas: ["Afijio", "Akinyele", "Atiba", "Atisbo", "Egbeda", "Ibadan North", "Ibadan North-East", "Ibadan North-West", "Ibadan South-East", "Ibadan South-West", "Ibarapa Central", "Ibarapa East", "Ibarapa North", "Ido", "Irepo", "Iseyin", "Itesiwaju", "Iwajowa", "Ogbomosho North", "Ogbomosho South", "Ogo Oluwa", "Olorunsogo", "Oluyole", "Ona Ara", "Orelope", "Ori Ire", "Oyo East", "Oyo West", "Saki East", "Saki West", "Surulere"]
  },
  {
    name: "Plateau",
    code: "PL",
    capital: "Jos",
    geoZone: "North Central",
    aliases: ["plateau state"],
    lgas: ["Barkin Ladi", "Bassa", "Bokkos", "Jos East", "Jos North", "Jos South", "Kanam", "Kanke", "Langtang North", "Langtang South", "Mangu", "Mikang", "Pankshin", "Qua'an Pan", "Riyom", "Shendam", "Wase"]
  },
  {
    name: "Rivers",
    code: "RI",
    capital: "Port Harcourt",
    geoZone: "South South",
    aliases: ["rivers state", "phc"],
    lgas: ["Abua/Odual", "Ahoada East", "Ahoada West", "Akuku-Toru", "Andoni", "Asari-Toru", "Bonny", "Degema", "Eleme", "Emuoha", "Etche", "Gokana", "Ikwerre", "Khana", "Obio/Akpor", "Ogba/Egbema/Ndoni", "Ogu/Bolo", "Okrika", "Omuma", "Opobo/Nkoro", "Oyigbo", "Port Harcourt", "Tai"]
  },
  {
    name: "Sokoto",
    code: "SO",
    capital: "Sokoto",
    geoZone: "North West",
    aliases: ["sokoto state"],
    lgas: ["Binji", "Bodinga", "Dange Shuni", "Gada", "Goronyo", "Gudu", "Gawabawa", "Illela", "Isa", "Kebbe", "Kware", "Rabah", "Sabon Birni", "Shagari", "Silame", "Sokoto North", "Sokoto South", "Tambuwal", "Tangaza", "Tureta", "Wamako", "Wurno", "Yabo"]
  },
  {
    name: "Taraba",
    code: "TA",
    capital: "Jalingo",
    geoZone: "North East",
    aliases: ["taraba state"],
    lgas: ["Ardo Kola", "Bali", "Donga", "Gashaka", "Gassol", "Ibi", "Jalingo", "Karim Lamido", "Kumi", "Lau", "Sardauna", "Takum", "Ussa", "Wukari", "Yorro", "Zing"]
  },
  {
    name: "Yobe",
    code: "YO",
    capital: "Damaturu",
    geoZone: "North East",
    aliases: ["yobe state"],
    lgas: ["Bade", "Bursari", "Damaturu", "Fika", "Fune", "Geidam", "Gujba", "Gulani", "Jakusko", "Karasuwa", "Machina", "Nangere", "Nguru", "Potiskum", "Tarmuwa", "Yunusari", "Yusufari"]
  },
  {
    name: "Zamfara",
    code: "ZA",
    capital: "Gusau",
    geoZone: "North West",
    aliases: ["zamfara state"],
    lgas: ["Anka", "Bakura", "Birnin Magaji/Kiyaw", "Bukkuyum", "Bungudu", "Gummi", "Gusau", "Kaura Namoda", "Maradun", "Maru", "Shinkafi", "Talata Mafara", "Chafe", "Zurmi"]
  }
];

/**
 * Fast lookup map from normalized alias/name to canonical NigerianStateData.
 */
const STATE_LOOKUP_MAP: Map<string, NigerianStateData> = new Map();

for (const state of NIGERIAN_STATES) {
  STATE_LOOKUP_MAP.set(state.name.toLowerCase().trim(), state);
  STATE_LOOKUP_MAP.set(state.code.toLowerCase().trim(), state);
  for (const alias of state.aliases) {
    STATE_LOOKUP_MAP.set(alias.toLowerCase().trim(), state);
  }
}

/**
 * Resolve any state name, abbreviation, or alias to canonical NigerianStateData.
 */
export function findNigerianState(input: string): NigerianStateData | undefined {
  if (!input) return undefined;
  const key = input.toLowerCase().trim();
  return STATE_LOOKUP_MAP.get(key);
}

/**
 * Find matching LGA within a specific state, or across all states if state not provided.
 */
export function findMatchingLga(
  lgaName: string,
  stateOrStateData?: string | NigerianStateData
): string | undefined {
  if (!lgaName) return undefined;
  const target = lgaName.toLowerCase().trim().replace(/[-_/]/g, " ");

  const stateData =
    typeof stateOrStateData === "string"
      ? findNigerianState(stateOrStateData)
      : stateOrStateData;

  if (stateData) {
    for (const lga of stateData.lgas) {
      const normalizedLga = lga.toLowerCase().replace(/[-_/]/g, " ");
      if (normalizedLga === target || normalizedLga.includes(target) || target.includes(normalizedLga)) {
        return lga;
      }
    }
  } else {
    for (const state of NIGERIAN_STATES) {
      for (const lga of state.lgas) {
        const normalizedLga = lga.toLowerCase().replace(/[-_/]/g, " ");
        if (normalizedLga === target) {
          return lga;
        }
      }
    }
  }

  return undefined;
}
