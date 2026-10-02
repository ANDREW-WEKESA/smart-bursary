// Kenya Counties with Constituencies, Sub-Counties, and Wards - ALL 47 COUNTIES
// Structure: County → Constituency → Wards

interface LocationData {
  constituencies: {
    [constituency: string]: {
      subCounty: string;
      wards: string[];
    };
  };
}

export const kenyaLocations: { [county: string]: LocationData } = {
  "Mombasa": {
    constituencies: {
      "Changamwe": {
        subCounty: "Changamwe",
        wards: ["Port Reitz", "Kipevu", "Airport", "Changamwe", "Chaani"]
      },
      "Jomvu": {
        subCounty: "Jomvu",
        wards: ["Jomvu Kuu", "Miritini", "Mikindani"]
      },
      "Kisauni": {
        subCounty: "Kisauni",
        wards: ["Mjambere", "Junda", "Bamburi", "Mwakirunge", "Mtopanga", "Magogoni", "Shanzu"]
      },
      "Likoni": {
        subCounty: "Likoni",
        wards: ["Mtongwe", "Shika Adabu", "Bofu", "Likoni", "Timbwani"]
      },
      "Mvita": {
        subCounty: "Mvita",
        wards: ["Mji Wa Kale/Makadara", "Tudor", "Tononoka", "Shimanzi/Ganjoni", "Majengo"]
      },
      "Nyali": {
        subCounty: "Nyali",
        wards: ["Frere Town", "Ziwa La Ng'Ombe", "Mkomani", "Kongowea", "Kadzandani"]
      }
    }
  },
  "Kwale": {
    constituencies: {
      "Msambweni": {
        subCounty: "Msambweni",
        wards: ["Gombato Bongwe", "Ukunda", "Kinondo", "Ramisi"]
      },
      "Lunga Lunga": {
        subCounty: "Lunga Lunga",
        wards: ["Lunga Lunga", "Mwereni", "Vanga"]
      },
      "Matuga": {
        subCounty: "Matuga",
        wards: ["Tsimba Golini", "Waa", "Tiwi", "Kubo South", "Mkongani"]
      },
      "Kinango": {
        subCounty: "Kinango",
        wards: ["Puma", "Kinango", "Mackinnon Road", "Chengoni/Samburu", "Mwavumbo"]
      }
    }
  },
  "Kilifi": {
    constituencies: {
      "Kilifi North": {
        subCounty: "Kilifi North",
        wards: ["Tezo", "Sokoni", "Kibarani", "Watamu", "Mnarani", "Shimo La Tewa", "Chasimba"]
      },
      "Kilifi South": {
        subCounty: "Kilifi South",
        wards: ["Junju", "Mwarakaya", "Shimo La Tewa", "Mtepeni", "Mwanamwinga"]
      },
      "Kaloleni": {
        subCounty: "Kaloleni",
        wards: ["Mariakani", "Kaloleni", "Mwanamwinga", "Jibana"]
      },
      "Rabai": {
        subCounty: "Rabai",
        wards: ["Rabai/Kisurutini", "Ruruma", "Kambe/Ribe", "Mazeras"]
      },
      "Ganze": {
        subCounty: "Ganze",
        wards: ["Bamba", "Ganze", "Jaribuni"]
      },
      "Malindi": {
        subCounty: "Malindi",
        wards: ["Malindi Town", "Shella", "Jilore", "Kakuyuni", "Langobaya", "Ganda"]
      },
      "Magarini": {
        subCounty: "Magarini",
        wards: ["Marafa", "Gongoni", "Adu", "Garashi", "Sabaki"]
      }
    }
  },
  "Tana River": {
    constituencies: {
      "Garsen": {
        subCounty: "Garsen",
        wards: ["Garsen South", "Garsen North", "Garsen Central", "Garsen West"]
      },
      "Galole": {
        subCounty: "Galole",
        wards: ["Wayu", "Chewani", "Mikinduni", "Masalani"]
      },
      "Bura": {
        subCounty: "Bura",
        wards: ["Bura", "Bangale", "Sala", "Madogo", "Hirimani"]
      }
    }
  },
  "Lamu": {
    constituencies: {
      "Lamu East": {
        subCounty: "Lamu East",
        wards: ["Faza", "Kiunga", "Basuba"]
      },
      "Lamu West": {
        subCounty: "Lamu West",
        wards: ["Witu", "Bahari", "Hongwe", "Mkomani", "Mkunumbi"]
      }
    }
  },
  "Taita Taveta": {
    constituencies: {
      "Taveta": {
        subCounty: "Taveta",
        wards: ["Challa", "Mahoo", "Bomeni", "Macha"]
      },
      "Wundanyi": {
        subCounty: "Wundanyi",
        wards: ["Wundanyi/Mbale", "Mwatate", "Werugha"]
      },
      "Mwatate": {
        subCounty: "Mwatate",
        wards: ["Bura", "Chawia", "Wusi/Kishushe", "Ronge"]
      },
      "Voi": {
        subCounty: "Voi",
        wards: ["Voi", "Sagalla", "Kaloleni", "Kasigau", "Mbololo"]
      }
    }
  },
  "Garissa": {
    constituencies: {
      "Garissa Township": {
        subCounty: "Garissa Township",
        wards: ["Galbet", "Waberi", "Township", "Iftin"]
      },
      "Balambala": {
        subCounty: "Balambala",
        wards: ["Balambala", "Saka", "Sankuri", "Dadaab"]
      },
      "Lagdera": {
        subCounty: "Lagdera",
        wards: ["Lagdera", "Benane", "Goreale", "Sabena"]
      },
      "Dadaab": {
        subCounty: "Dadaab",
        wards: ["Dadaab", "Labasigale", "Dertu", "Abakaile"]
      },
      "Fafi": {
        subCounty: "Fafi",
        wards: ["Fafi", "Nanighi", "Bura", "Jarajilla"]
      },
      "Ijara": {
        subCounty: "Ijara",
        wards: ["Ijara", "Hulugho", "Sangailu", "Masalani"]
      }
    }
  },
  "Wajir": {
    constituencies: {
      "Wajir North": {
        subCounty: "Wajir North",
        wards: ["Bute", "Batalu", "Danaba", "Gurar"]
      },
      "Wajir East": {
        subCounty: "Wajir East",
        wards: ["Wagberi", "Khorof/Harar", "Barwago", "Wajir"]
      },
      "Tarbaj": {
        subCounty: "Tarbaj",
        wards: ["Tarbaj", "Wajir Bor", "Elben", "Sarman"]
      },
      "Wajir West": {
        subCounty: "Wajir West",
        wards: ["Ganyure/Wagalla", "Eldas", "Della", "Lakoley South Central"]
      },
      "Eldas": {
        subCounty: "Eldas",
        wards: ["Lakoley North/Basir", "Elnur/Tula Tula", "Della/Dimtu", "Ganyure"]
      },
      "Wajir South": {
        subCounty: "Wajir South",
        wards: ["Ibrahim Ure", "Ademasajida", "Habaswein", "Benane"]
      }
    }
  },
  "Mandera": {
    constituencies: {
      "Mandera West": {
        subCounty: "Mandera West",
        wards: ["Takaba South", "Takaba", "Dandu", "Lagsure"]
      },
      "Banissa": {
        subCounty: "Banissa",
        wards: ["Banissa", "Derkhale", "Guba", "Malkamari"]
      },
      "Mandera North": {
        subCounty: "Mandera North",
        wards: ["Ashabito", "Libehia", "Fino", "Khalalio", "Arabia"]
      },
      "Mandera South": {
        subCounty: "Mandera South",
        wards: ["Elwak South", "Elwak North", "Shimbir Fatuma", "Wargadud"]
      },
      "Mandera East": {
        subCounty: "Mandera East",
        wards: ["Rhamu", "Rhamu Dimtu", "Kutulo", "Shimbir"]
      },
      "Lafey": {
        subCounty: "Lafey",
        wards: ["Lafey", "Wayu", "Fino", "Lafey Central"]
      }
    }
  },
  "Marsabit": {
    constituencies: {
      "Moyale": {
        subCounty: "Moyale",
        wards: ["Moyale Township", "Uran", "Obbu", "Sololo", "Heilu/Manyatta"]
      },
      "North Horr": {
        subCounty: "North Horr",
        wards: ["North Horr", "Dukana", "Maikona", "Turbi", "Illeret"]
      },
      "Saku": {
        subCounty: "Saku",
        wards: ["Marsabit Central", "Sagante/Jaldesa", "Kargi South", "Kargi Central"]
      },
      "Laisamis": {
        subCounty: "Laisamis",
        wards: ["Laisamis", "Korr/Ngurunit", "Logologo", "Loiyangalani"]
      }
    }
  },
  "Isiolo": {
    constituencies: {
      "Isiolo North": {
        subCounty: "Isiolo North",
        wards: ["Wabera", "Bulla Pesa", "Ngaremara"]
      },
      "Isiolo South": {
        subCounty: "Isiolo South",
        wards: ["Kinna", "Garba Tula", "Oldonyiro", "Sericho"]
      }
    }
  },
  "Meru": {
    constituencies: {
      "Igembe North": {
        subCounty: "Igembe North",
        wards: ["Igembe North", "Ntunene", "Antubetwe", "Antuambui"]
      },
      "Igembe South": {
        subCounty: "Igembe South",
        wards: ["Maua", "Mitunguu", "Kangeta", "Kianjai"]
      },
      "Igembe Central": {
        subCounty: "Igembe Central",
        wards: ["Igembe Central", "Akirang'ondu", "Athiru Ruujine"]
      },
      "Tigania West": {
        subCounty: "Tigania West",
        wards: ["Akithii", "Kiegoi/Antubetwe Kiongo", "Mbeu", "Nkondi"]
      },
      "Tigania East": {
        subCounty: "Tigania East",
        wards: ["Thangatha", "Muthara", "Mikinduri", "Naathu", "Mutuati"]
      },
      "North Imenti": {
        subCounty: "Imenti North",
        wards: ["Miriga Mieru East", "Miriga Mieru West", "Municipality", "Abothuguchi Central"]
      },
      "Buuri": {
        subCounty: "Buuri",
        wards: ["Buuri", "Timau", "Kisima", "Kiirua/Naari"]
      },
      "Central Imenti": {
        subCounty: "Imenti Central",
        wards: ["Abogeta East", "Abogeta West", "Kiagu", "Mitunguu"]
      },
      "South Imenti": {
        subCounty: "Imenti South",
        wards: ["Igoji East", "Igoji West", "Nkuene", "Abothuguchi West"]
      }
    }
  },
  "Tharaka Nithi": {
    constituencies: {
      "Tharaka": {
        subCounty: "Tharaka North",
        wards: ["Mukothima", "Kaanwa", "Nkondi", "Marimanti"]
      },
      "Chuka/Igambang'ombe": {
        subCounty: "Chuka/Igambang'ombe",
        wards: ["Karingani", "Mariani", "Magumoni", "Mugwe"]
      },
      "Maara": {
        subCounty: "Maara",
        wards: ["Chogoria", "Ganga", "Maara", "Mitheru"]
      }
    }
  },
  "Embu": {
    constituencies: {
      "Manyatta": {
        subCounty: "Manyatta",
        wards: ["Gaturi South", "Kithimu", "Nginda", "Ruguru/Ngandori"]
      },
      "Runyenjes": {
        subCounty: "Runyenjes",
        wards: ["Kyeni North", "Kyeni South", "Central Ward", "Runyenjes"]
      },
      "Mbeere South": {
        subCounty: "Mbeere South",
        wards: ["Mavuria", "Kiritiri", "Makima", "Mbeti South"]
      },
      "Mbeere North": {
        subCounty: "Mbeere North",
        wards: ["Muminji", "Evurore", "Nthawa"]
      }
    }
  },
  "Kitui": {
    constituencies: {
      "Mwingi North": {
        subCounty: "Mwingi North",
        wards: ["Ngomeni", "Kyuso", "Mumoni", "Tseikuru", "Tharaka"]
      },
      "Mwingi West": {
        subCounty: "Mwingi West",
        wards: ["Migwani", "Kiomo/Kyethani", "Central", "Kivou"]
      },
      "Mwingi Central": {
        subCounty: "Mwingi Central",
        wards: ["Central", "Nguni", "Township", "Nuu"]
      },
      "Kitui West": {
        subCounty: "Kitui West",
        wards: ["Kauwi", "Matinyani", "Kwa Mutonga", "Mutonguni"]
      },
      "Kitui Rural": {
        subCounty: "Kitui Rural",
        wards: ["Kisasi", "Mbitini", "Kanyangi"]
      },
      "Kitui Central": {
        subCounty: "Kitui Central",
        wards: ["Township", "Miambani", "Mulango", "Kyangwithya West"]
      },
      "Kitui East": {
        subCounty: "Kitui East",
        wards: ["Zombe/Mwitika", "Chuluni", "Endau/Malalani", "Mutitu/Kaliku"]
      },
      "Kitui South": {
        subCounty: "Kitui South",
        wards: ["Ikanga/Kyatune", "Mutomo", "Mutha", "Ikutha"]
      }
    }
  },
  "Machakos": {
    constituencies: {
      "Machakos Town": {
        subCounty: "Machakos Town",
        wards: ["Kalama", "Kola", "Muvuti/Kiima-Kimwe", "Mumbuni North", "Mua", "Mutituni", "Machakos Central"]
      },
      "Mavoko": {
        subCounty: "Mavoko",
        wards: ["Syokimau/Mulolongo", "Mlolongo", "Kinanie", "Muthwani", "Athi River"]
      },
      "Masinga": {
        subCounty: "Masinga",
        wards: ["Ekalakala", "Kivaa", "Masinga Central", "Ndithini", "Muthesya"]
      },
      "Yatta": {
        subCounty: "Yatta",
        wards: ["Kithimani", "Ikombe", "Ndalani", "Matuu"]
      },
      "Kangundo": {
        subCounty: "Kangundo",
        wards: ["Kangundo West", "Kangundo Central", "Kangundo East"]
      },
      "Matungulu": {
        subCounty: "Matungulu",
        wards: ["Tala", "Kyeleni", "Matungulu North", "Matungulu West", "Matungulu East"]
      },
      "Kathiani": {
        subCounty: "Kathiani",
        wards: ["Kathiani", "Mitaboni", "Ikalaasa", "Upper Kaewa/Iveti"]
      },
      "Mwala": {
        subCounty: "Mwala",
        wards: ["Masii", "Muthetheni", "Wamunyu", "Kibauni", "Makutano/Mwala"]
      }
    }
  },
  "Makueni": {
    constituencies: {
      "Makueni": {
        subCounty: "Makueni",
        wards: ["Mbitini", "Wote", "Mavindini", "Kalawa"]
      },
      "Kibwezi West": {
        subCounty: "Kibwezi West",
        wards: ["Makindu", "Nguumo", "Kikumbulyu North", "Kikumbulyu South", "Nguu/Masumba"]
      },
      "Kibwezi East": {
        subCounty: "Kibwezi East",
        wards: ["Mtito Andei", "Thange", "Ivingoni", "Masongaleni"]
      },
      "Kilome": {
        subCounty: "Kilome",
        wards: ["Kilome", "Kasikeu", "Mukaa"]
      },
      "Kaiti": {
        subCounty: "Kaiti",
        wards: ["Mukuyuni", "Kithungo", "Kisau/Kiteta", "Mavindini"]
      },
      "Mbooni": {
        subCounty: "Mbooni",
        wards: ["Tulimani", "Kaliani", "Kithuki", "Waia/Kako", "Mbooni"]
      }
    }
  },
  "Nyandarua": {
    constituencies: {
      "Kinangop": {
        subCounty: "Kinangop",
        wards: ["Gathara", "Murungaru", "Njabini/Kiburu", "North Kinangop", "Central Kinangop"]
      },
      "Kipipiri": {
        subCounty: "Kipipiri",
        wards: ["Wanjohi", "Kipipiri", "Githioro"]
      },
      "Ol Kalou": {
        subCounty: "Ol Kalou",
        wards: ["Karau", "Mirangine", "Rurii", "Kaimbaga"]
      },
      "Ol Joro Orok": {
        subCounty: "Ol Joro Orok",
        wards: ["Gathanji", "Gatimu", "Weru", "Charagita"]
      },
      "Ndaragwa": {
        subCounty: "Ndaragwa",
        wards: ["Leshau/Pondo", "Kiriita", "Central", "Shamata"]
      }
    }
  },
  "Nyeri": {
    constituencies: {
      "Tetu": {
        subCounty: "Tetu",
        wards: ["Aguthi/Gaaki", "Wamagana", "Dedan Kimathi"]
      },
      "Kieni": {
        subCounty: "Kieni",
        wards: ["Gakawa", "Thegu River", "Naromoru/Kiamathaga", "Mweiga", "Mugunda"]
      },
      "Mathira": {
        subCounty: "Mathira",
        wards: ["Iria-ini", "Magutu", "Konyu", "Kirimukuyu"]
      },
      "Othaya": {
        subCounty: "Othaya",
        wards: ["Mahiga", "Iria-ini", "Karima", "Chinga"]
      },
      "Mukurweini": {
        subCounty: "Mukurweini",
        wards: ["Gikondi", "Mukurwe-ini West", "Mukurwe-ini Central"]
      },
      "Nyeri Town": {
        subCounty: "Nyeri Town",
        wards: ["Rware", "Gatitu/Muruguru", "Ruring'u", "Kamakwa/Mukaro"]
      }
    }
  },
  "Kirinyaga": {
    constituencies: {
      "Mwea": {
        subCounty: "Mwea",
        wards: ["Mutithi", "Kangai", "Thiba", "Wamumu"]
      },
      "Gichugu": {
        subCounty: "Gichugu",
        wards: ["Baragwi", "Njukiini", "Ngariama", "Karumandi"]
      },
      "Ndia": {
        subCounty: "Ndia",
        wards: ["Mukure", "Kiine", "Kariti"]
      },
      "Kirinyaga Central": {
        subCounty: "Kirinyaga Central",
        wards: ["Kerugoya", "Inoi", "Mutira", "Kanyekini"]
      }
    }
  },
  "Murang'a": {
    constituencies: {
      "Kangema": {
        subCounty: "Kangema",
        wards: ["Muguru", "Kanyenya-ini", "Rwathia"]
      },
      "Mathioya": {
        subCounty: "Mathioya",
        wards: ["Kiru", "Kanyenyaini", "Ithanga", "Kamacharia"]
      },
      "Kiharu": {
        subCounty: "Kiharu",
        wards: ["Wangu", "Mugoiri", "Mbiri", "Township", "Murarandia"]
      },
      "Kigumo": {
        subCounty: "Kigumo",
        wards: ["Kinyona", "Kigumo", "Kahumbu", "Muthithi"]
      },
      "Maragwa": {
        subCounty: "Maragwa",
        wards: ["Makuyu", "Kambiti", "Kamahuha", "Ichagaki"]
      },
      "Kandara": {
        subCounty: "Kandara",
        wards: ["Kagundu-ini", "Ng'araria", "Muruka", "Kandara/Kabuta"]
      },
      "Gatanga": {
        subCounty: "Gatanga",
        wards: ["Kariara", "Kakuzi/Mitubiri", "Gatanga", "Gatukuyu"]
      }
    }
  },
  "Kiambu": {
    constituencies: {
      "Kiambu": {
        subCounty: "Kiambu",
        wards: ["Township", "Riabai", "Ndumberi", "Tinganga"]
      },
      "Thika Town": {
        subCounty: "Thika Town",
        wards: ["Township", "Kamenu", "Hospital", "Gatuanyaga", "Ngoliba"]
      },
      "Ruiru": {
        subCounty: "Ruiru",
        wards: ["Biashara", "Gatongora", "Kahawa Sukari", "Kahawa Wendani", "Kiuu", "Mwiki", "Mwihoko"]
      },
      "Juja": {
        subCounty: "Juja",
        wards: ["Juja", "Witeithie", "Kalimoni", "Theta", "Murera"]
      },
      "Gatundu South": {
        subCounty: "Gatundu South",
        wards: ["Kiamwangi", "Kiganjo", "Ndarugu", "Ngenda", "Githunguri"]
      },
      "Gatundu North": {
        subCounty: "Gatundu North",
        wards: ["Gituamba", "Githobokoni", "Chania", "Mang'u"]
      },
      "Lari": {
        subCounty: "Lari",
        wards: ["Kinale", "Kijabe", "Nyanduma", "Kamburu", "Lari/Kirenga"]
      },
      "Limuru": {
        subCounty: "Limuru",
        wards: ["Bibirioni", "Limuru Central", "Limuru East", "Ndeiya", "Ngecha Tigoni"]
      },
      "Kikuyu": {
        subCounty: "Kikuyu",
        wards: ["Karai", "Nachu", "Sigona", "Kikuyu", "Kinoo"]
      },
      "Kabete": {
        subCounty: "Kabete",
        wards: ["Gitaru", "Muguga", "Nyadhuna", "Kabete", "Uthiru"]
      },
      "Githunguri": {
        subCounty: "Githunguri",
        wards: ["Githunguri", "Githiga", "Ikinu", "Ngewa", "Komothai"]
      },
      "Kiambaa": {
        subCounty: "Kiambaa",
        wards: ["Cianda", "Karuri", "Ndenderu", "Muchatha", "Kihara"]
      }
    }
  },
  "Turkana": {
    constituencies: {
      "Turkana North": {
        subCounty: "Turkana North",
        wards: ["Kaeris", "Lake Zone", "Kibish", "Nakalale"]
      },
      "Turkana West": {
        subCounty: "Turkana West",
        wards: ["Kakuma", "Lopur", "Letea", "Songot", "Kalobeyei"]
      },
      "Turkana Central": {
        subCounty: "Turkana Central",
        wards: ["Kalokol", "Lodwar Township", "Kanamkemer", "Kotaruk/Lobei"]
      },
      "Loima": {
        subCounty: "Loima",
        wards: ["Kotaruk", "Lokiriama/Lorengippi", "Loima"]
      },
      "Turkana South": {
        subCounty: "Turkana South",
        wards: ["Kalapata", "Lobokat", "Kaputir", "Katilia"]
      },
      "Turkana East": {
        subCounty: "Turkana East",
        wards: ["Kapedo/Napeitom", "Katilia", "Lokori/Kochodin"]
      }
    }
  },
  "West Pokot": {
    constituencies: {
      "Pokot South": {
        subCounty: "Pokot South",
        wards: ["Chepareria", "Batei", "Lelan"]
      },
      "Sigor": {
        subCounty: "Pokot North",
        wards: ["Suam", "Kodich", "Kasei", "Riwo", "Alale", "Tapach"]
      },
      "Kacheliba": {
        subCounty: "Pokot Central",
        wards: ["Mnagei", "Sekerr", "Masool", "Weiwei"]
      },
      "Kapenguria": {
        subCounty: "West Pokot",
        wards: ["Kapenguria", "Mnagei", "Endugh", "Siyoi"]
      }
    }
  },
  "Samburu": {
    constituencies: {
      "Samburu North": {
        subCounty: "Samburu North",
        wards: ["El-Barta", "Nachola", "Ndoto", "Ngilai"]
      },
      "Samburu East": {
        subCounty: "Samburu Central",
        wards: ["Lodokejek", "Suguta Marmar", "Maralal", "Loosuk"]
      },
      "Samburu West": {
        subCounty: "Samburu East",
        wards: ["Wamba North", "Wamba East", "Wamba West", "Waso"]
      }
    }
  },
  "Trans Nzoia": {
    constituencies: {
      "Kwanza": {
        subCounty: "Kwanza",
        wards: ["Keiyo", "Kapomboi", "Bidii", "Kapomboi"]
      },
      "Endebess": {
        subCounty: "Endebess",
        wards: ["Chepchoina", "Endebess", "Matumbei"]
      },
      "Saboti": {
        subCounty: "Saboti",
        wards: ["Saboti", "Tuwani", "Machewa", "Kinyoro", "Matisi"]
      },
      "Kiminini": {
        subCounty: "Kiminini",
        wards: ["Kiminini", "Waitaluk", "Sirende", "Hospital", "Sikhendu"]
      },
      "Cherangany": {
        subCounty: "Cherangani",
        wards: ["Makutano", "Kaplamai", "Motosiet", "Cherangani/Suwerwa", "Chepsiro/Kiptoror"]
      }
    }
  },
  "Uasin Gishu": {
    constituencies: {
      "Soy": {
        subCounty: "Soy",
        wards: ["Soy", "Sergoit", "Moisbridge", "Ziwa", "Megun", "Kipsomba"]
      },
      "Turbo": {
        subCounty: "Turbo",
        wards: ["Ngenyilel", "Tapsagoi", "Kamagut", "Kiplombe", "Kapsaos", "Huruma"]
      },
      "Moiben": {
        subCounty: "Moiben",
        wards: ["Moiben", "Kimumu", "Tembelio", "Kaptagat"]
      },
      "Ainabkoi": {
        subCounty: "Ainabkoi",
        wards: ["Ainabkoi/Olare", "Kapsoya", "Kaptagat", "Kimumu"]
      },
      "Kapseret": {
        subCounty: "Kapseret",
        wards: ["Simat/Kapseret", "Kipkenyo", "Ngeria", "Megun"]
      },
      "Kesses": {
        subCounty: "Kesses",
        wards: ["Racecourse", "Cheptiret/Kipchamo", "Tulwet/Chuiyat", "Tarakwa"]
      }
    }
  },
  "Elgeyo Marakwet": {
    constituencies: {
      "Marakwet East": {
        subCounty: "Marakwet East",
        wards: ["Kapyego", "Sambirir", "Endo", "Embobut/Embulot"]
      },
      "Marakwet West": {
        subCounty: "Marakwet West",
        wards: ["Kapsowar", "Lelan", "Sengwer", "Cherang'any/Chebororwa", "Moiben/Kuserwo"]
      },
      "Keiyo North": {
        subCounty: "Keiyo North",
        wards: ["Emsoo", "Kamariny", "Kapchemutwa", "Tambach"]
      },
      "Keiyo South": {
        subCounty: "Keiyo South",
        wards: ["Kaptarakwa", "Chepkorio", "Soy North", "Soy South", "Kabiemit", "Metkei"]
      }
    }
  },
  "Nandi": {
    constituencies: {
      "Tinderet": {
        subCounty: "Tinderet",
        wards: ["Songhor/Soba", "Tindiret", "Chemelil/Chemase", "Kapsimotwo"]
      },
      "Aldai": {
        subCounty: "Aldai",
        wards: ["Kabisaga", "Ndalat", "Kemeloi/Maraba", "Kobujoi"]
      },
      "Nandi Hills": {
        subCounty: "Nandi Hills",
        wards: ["Nandi Hills", "Chepkunyuk", "Ol'lessos", "Kapchorua"]
      },
      "Chesumei": {
        subCounty: "Chesumei",
        wards: ["Kaptel/Kamoiywo", "Kiptuya", "Kosirai", "Lelmokwo/Ngechek", "Chemundu/Kapng'etuny"]
      },
      "Emgwen": {
        subCounty: "Emgwen",
        wards: ["Emgwen", "Chepkumia", "Kapkangani", "Kapsabet"]
      },
      "Mosop": {
        subCounty: "Mosop",
        wards: ["Kabiyet", "Ndurio", "Kabwareng", "Chepterwai", "Kipkaren"]
      }
    }
  },
  "Baringo": {
    constituencies: {
      "Baringo North": {
        subCounty: "Baringo North",
        wards: ["Barwessa", "Kabartonjo", "Saimo/Kipsaraman", "Saimo/Soi", "Bartabwa"]
      },
      "Baringo Central": {
        subCounty: "Baringo Central",
        wards: ["Kabarnet", "Sacho", "Tenges", "Ewalel/Chapchap", "Kapropita"]
      },
      "Baringo South": {
        subCounty: "Baringo South",
        wards: ["Marigat", "Ilchamus", "Mochongoi", "Mukutani"]
      },
      "Mogotio": {
        subCounty: "Mogotio",
        wards: ["Mogotio", "Emining", "Kisanana"]
      },
      "Eldama Ravine": {
        subCounty: "Eldama Ravine",
        wards: ["Lembus", "Lembus Kwen", "Ravine", "Koibatek"]
      },
      "Tiaty": {
        subCounty: "Tiaty",
        wards: ["Churo/Amaya", "Ribkwo", "Silale", "Loiyamorock", "Tangulbei/Korossi"]
      }
    }
  },
  "Laikipia": {
    constituencies: {
      "Laikipia West": {
        subCounty: "Laikipia West",
        wards: ["Igwamiti", "Marmanet", "Rumuruti Township", "Githiga", "Salama"]
      },
      "Laikipia East": {
        subCounty: "Laikipia East",
        wards: ["Thingithu", "Nanyuki", "Umande", "Ngobit"]
      },
      "Laikipia North": {
        subCounty: "Laikipia North",
        wards: ["Mukogodo West", "Mukogodo East", "Segera", "Sosian"]
      }
    }
  },
  "Nakuru": {
    constituencies: {
      "Nakuru Town East": {
        subCounty: "Nakuru Town East",
        wards: ["Biashara", "Flamingo", "Menengai West", "Nakuru East"]
      },
      "Nakuru Town West": {
        subCounty: "Nakuru Town West",
        wards: ["Barut", "London", "Kaptembwo", "Kapkures", "Rhoda"]
      },
      "Naivasha": {
        subCounty: "Naivasha",
        wards: ["Naivasha East", "Viwandani", "Hells Gate", "Mai Mahiu", "Olkaria"]
      },
      "Gilgil": {
        subCounty: "Gilgil",
        wards: ["Gilgil", "Elementaita", "Mbaruk/Eburu", "Malewa West"]
      },
      "Molo": {
        subCounty: "Molo",
        wards: ["Molo", "Turi", "Elburgon", "Mariashoni"]
      },
      "Njoro": {
        subCounty: "Njoro",
        wards: ["Mau Narok", "Njoro", "Kihingo", "Mauche", "Nessuit", "Lare"]
      },
      "Rongai": {
        subCounty: "Rongai",
        wards: ["Mosop", "Menengai", "Solai", "Soin", "Visoi"]
      },
      "Subukia": {
        subCounty: "Subukia",
        wards: ["Subukia", "Kabutie", "Kabazi", "Waseges"]
      },
      "Kuresoi South": {
        subCounty: "Kuresoi South",
        wards: ["Keringet", "Kiptagich", "Tinet", "Chemosit"]
      },
      "Kuresoi North": {
        subCounty: "Kuresoi North",
        wards: ["Nyota", "Sinendet", "Kiptororo", "Chesunet"]
      },
      "Bahati": {
        subCounty: "Bahati",
        wards: ["Lanet/Umoja", "Bahati", "Dundori", "Kabatini", "Kiamaina"]
      }
    }
  },
  "Narok": {
    constituencies: {
      "Narok North": {
        subCounty: "Narok North",
        wards: ["Olokurto", "Narok Town", "Nkareta", "Olorropil", "Melili"]
      },
      "Narok South": {
        subCounty: "Narok South",
        wards: ["Mosiro", "Ildamat", "Keekonyokie", "Suswa"]
      },
      "Narok East": {
        subCounty: "Narok East",
        wards: ["Mau", "Enaibelbel", "Aitong"]
      },
      "Narok West": {
        subCounty: "Narok West",
        wards: ["Ilmotiok", "Melelo", "Loita", "Sogoo", "Sagamian"]
      },
      "Kilgoris": {
        subCounty: "Transmara West",
        wards: ["Angata Barikoi", "Kilgoris Central", "Keyian", "Shankoe", "Kimintet"]
      },
      "Transmara East": {
        subCounty: "Transmara East",
        wards: ["Lolgorian", "Keyian", "Angata", "Ololmasani", "Ilkerin"]
      }
    }
  },
  "Kajiado": {
    constituencies: {
      "Kajiado North": {
        subCounty: "Kajiado North",
        wards: ["Ongata Rongai", "Nkaimurunya", "Oloolua", "Ngong"]
      },
      "Kajiado Central": {
        subCounty: "Kajiado Central",
        wards: ["Purko", "Ildamat", "Dalalekutuk", "Matapato North", "Matapato South"]
      },
      "Kajiado East": {
        subCounty: "Kajiado East",
        wards: ["Kaputiei North", "Kitengela", "Oloosirkon/Sholinke", "Kenyawa-Poka", "Imaroro"]
      },
      "Kajiado West": {
        subCounty: "Kajiado West",
        wards: ["Keekonyokie", "Iloodokilani", "Magadi", "Ewuaso Oonkidong'i", "Mosiro"]
      },
      "Kajiado South": {
        subCounty: "Kajiado South",
        wards: ["Entonet/Lenkism", "Rombo", "Kimana", "Ilasit", "Kuku"]
      }
    }
  },
  "Kericho": {
    constituencies: {
      "Kipkelion East": {
        subCounty: "Kipkelion East",
        wards: ["Londiani", "Kedowa/Kimugul", "Chepseon", "Tendeno/Sorget"]
      },
      "Kipkelion West": {
        subCounty: "Kipkelion West",
        wards: ["Kunyak", "Kamasian", "Kipkelion", "Chilchila"]
      },
      "Ainamoi": {
        subCounty: "Ainamoi",
        wards: ["Ainamoi", "Kapsoit", "Kapkugerwet", "Kapsuser"]
      },
      "Bureti": {
        subCounty: "Bureti",
        wards: ["Tebesonik", "Cheboin", "Chemosot", "Litein", "Cheplanget", "Kisiara"]
      },
      "Belgut": {
        subCounty: "Belgut",
        wards: ["Waldai", "Kabianga", "Cheptororiet/Seretut", "Chaik", "Kapsuser"]
      },
      "Sigowet/Soin": {
        subCounty: "Sigowet/Soin",
        wards: ["Sigowet", "Kaplelartet", "Soliat"]
      }
    }
  },
  "Bomet": {
    constituencies: {
      "Sotik": {
        subCounty: "Sotik",
        wards: ["Ndanai/Abosi", "Chemagel", "Kipsonoi", "Kapletundo", "Rongena/Manaret"]
      },
      "Chepalungu": {
        subCounty: "Chepalungu",
        wards: ["Kong'asis", "Nyangores", "Sigor", "Chebunyo", "Siongiroi"]
      },
      "Bomet East": {
        subCounty: "Bomet East",
        wards: ["Merigi", "Kembu", "Longisa", "Kipreres", "Chemaner"]
      },
      "Bomet Central": {
        subCounty: "Bomet Central",
        wards: ["Silibwet Township", "Ndaraweta", "Singorwet", "Chesoen", "Mutarakwa"]
      },
      "Konoin": {
        subCounty: "Konoin",
        wards: ["Kimulot", "Chepchabas", "Boito", "Embomos", "Mogogosiek"]
      }
    }
  },
  "Kakamega": {
    constituencies: {
      "Lugari": {
        subCounty: "Lugari",
        wards: ["Mautuma", "Lugari", "Lumakanda", "Chekalini", "Chevaywa", "Lwandeti"]
      },
      "Likuyani": {
        subCounty: "Likuyani",
        wards: ["Likuyani", "Sango", "Kongoni", "Nzoia", "Sinoko"]
      },
      "Malava": {
        subCounty: "Malava",
        wards: ["West Kabras", "Chemuche", "East Kabras", "Butali/Chegulo", "Manda-Shivanga", "Shirugu-Mugai", "South Kabras"]
      },
      "Lurambi": {
        subCounty: "Lurambi",
        wards: ["Butsotso East", "Butsotso South", "Butsotso Central", "Sheywe", "Mahiakalo", "Shirere"]
      },
      "Navakholo": {
        subCounty: "Navakholo",
        wards: ["Ingostse-Mathia", "Shinoyi-Shikomari-Esumeyia", "Bunyala West", "Bunyala East", "Bunyala Central"]
      },
      "Mumias West": {
        subCounty: "Mumias West",
        wards: ["Mumias Central", "Mumias North", "Etenje", "Musanda", "Malaha/Isongo/Makunga", "Kholera"]
      },
      "Mumias East": {
        subCounty: "Mumias East",
        wards: ["Lubao", "Lusheya/Lubinu", "Malanga", "East Wanga"]
      },
      "Matungu": {
        subCounty: "Matungu",
        wards: ["Koyonzo", "Kholera", "Khalaba", "Mayoni", "Namamali"]
      },
      "Butere": {
        subCounty: "Butere",
        wards: ["Marenyo-Shianda", "Marama West", "Marama Central", "Marenyo", "Marama North", "Marama South"]
      },
      "Khwisero": {
        subCounty: "Khwisero",
        wards: ["Kisa North", "Kisa East", "Kisa West", "Kisa Central"]
      },
      "Shinyalu": {
        subCounty: "Shinyalu",
        wards: ["Isukha North", "Murhanda", "Isukha Central", "Isukha South", "Isukha East", "Isukha West"]
      },
      "Ikolomani": {
        subCounty: "Ikolomani",
        wards: ["Idakho South", "Idakho East", "Idakho North", "Idakho Central"]
      }
    }
  },
  "Vihiga": {
    constituencies: {
      "Vihiga": {
        subCounty: "Vihiga",
        wards: ["Lugaga-Wamuluma", "South Maragoli", "Central Maragoli", "Mungoma"]
      },
      "Sabatia": {
        subCounty: "Sabatia",
        wards: ["Busali", "Lyaduywa/Izava", "West Sabatia", "Chavakali", "North Maragoli", "Wodanga"]
      },
      "Hamisi": {
        subCounty: "Hamisi",
        wards: ["Shiru", "Muhudu", "Banja", "Tambua", "Jepkoyai", "Gisambai", "Shamakhokho"]
      },
      "Luanda": {
        subCounty: "Luanda",
        wards: ["Luanda Township", "Wemilabi", "Mwibona", "Luanda South", "Emabungo"]
      },
      "Emuhaya": {
        subCounty: "Emuhaya",
        wards: ["North East Bunyore", "Central Bunyore", "West Bunyore"]
      }
    }
  },
  "Bungoma": {
    constituencies: {
      "Mt. Elgon": {
        subCounty: "Mt. Elgon",
        wards: ["Cheptais", "Chesikaki", "Chepyuk", "Kapkateny", "Kaptama", "Elgon"]
      },
      "Sirisia": {
        subCounty: "Sirisia",
        wards: ["Namwela", "Malakisi/South Kulisiru", "Lwandanyi", "Sirisia"]
      },
      "Kabuchai": {
        subCounty: "Kabuchai",
        wards: ["Kabuchai/Chwele", "West Nalondo", "Bwake/Luuya", "Mukuyuni"]
      },
      "Bumula": {
        subCounty: "Bumula",
        wards: ["Bumula", "Khasoko", "Kabula", "Kimaeti", "South Bukusu", "Siboti"]
      },
      "Kanduyi": {
        subCounty: "Kanduyi",
        wards: ["Bukembe West", "Bukembe East", "Township", "Khalaba", "Musikoma", "East Sang'alo", "Marakaru/Tuuti"]
      },
      "Webuye East": {
        subCounty: "Webuye East",
        wards: ["Ndivisi", "Maraka", "Mihuu"]
      },
      "Webuye West": {
        subCounty: "Webuye West",
        wards: ["Khalaba", "Sitikho", "Matulo"]
      },
      "Kimilili": {
        subCounty: "Kimilili",
        wards: ["Kimilili", "Maeni", "Kamukuywa"]
      },
      "Tongaren": {
        subCounty: "Tongaren",
        wards: ["Ndalu/Tabani", "Mbakalo", "Naitiri/Kabuyefwe", "Milima", "Tongaren"]
      }
    }
  },
  "Busia": {
    constituencies: {
      "Teso North": {
        subCounty: "Teso North",
        wards: ["Ang'urai North", "Ang'urai South", "Ang'urai East", "Malaba North", "Malaba South", "Malaba Central"]
      },
      "Teso South": {
        subCounty: "Teso South",
        wards: ["Ang'orom", "Chakol South", "Chakol North", "Amukura West", "Amukura East"]
      },
      "Nambale": {
        subCounty: "Nambale",
        wards: ["Nambale Township", "Bukhayo North/Walatsi", "Bukhayo East", "Bukhayo Central"]
      },
      "Matayos": {
        subCounty: "Matayos",
        wards: ["Budalang'i", "Marachi North", "Marachi Central", "Marachi East", "Marachi West"]
      },
      "Butula": {
        subCounty: "Butula",
        wards: ["Marachi Central", "Kingandole", "Marachi North", "Elugulu"]
      },
      "Funyula": {
        subCounty: "Funyula",
        wards: ["Namboboto Nambuku", "Ageng'a Nanguba", "Bwiri", "Nambale"]
      },
      "Budalang'i": {
        subCounty: "Budalang'i",
        wards: ["Bunyala North", "Bunyala South", "Bunyala Central", "Bunyala West"]
      }
    }
  },
  "Siaya": {
    constituencies: {
      "Alego Usonga": {
        subCounty: "Alego Usonga",
        wards: ["Siaya Township", "Usonga", "West Alego", "Central Alego", "South East Alego"]
      },
      "Gem": {
        subCounty: "Gem",
        wards: ["Yala Township", "North Gem", "West Gem", "Central Gem", "East Gem", "South Gem"]
      },
      "Ugenya": {
        subCounty: "Ugenya",
        wards: ["West Ugenya", "Ukwala", "North Ugenya", "East Ugenya"]
      },
      "Ugunja": {
        subCounty: "Ugunja",
        wards: ["Ugunja", "Sidindi", "Sigomere", "Sihay"]
      },
      "Bondo": {
        subCounty: "Bondo",
        wards: ["West Yimbo", "Central Sakwa", "South Sakwa", "Yimbo East", "West Sakwa", "North Sakwa"]
      },
      "Rarieda": {
        subCounty: "Rarieda",
        wards: ["West Asembo", "North Uyoma", "South Uyoma", "West Uyoma", "East Asembo"]
      }
    }
  },
  "Kisumu": {
    constituencies: {
      "Kisumu East": {
        subCounty: "Kisumu East",
        wards: ["Kajulu", "Kolwa East", "Manyatta B", "Nyalenda A"]
      },
      "Kisumu West": {
        subCounty: "Kisumu West",
        wards: ["Central Kisumu", "Kolwa Central", "North West Kisumu", "South West Kisumu", "Kisumu North"]
      },
      "Kisumu Central": {
        subCounty: "Kisumu Central",
        wards: ["Market Milimani", "Railways", "Migosi", "Shaurimoyo Kaloleni", "Nyalenda B"]
      },
      "Seme": {
        subCounty: "Seme",
        wards: ["Central Seme", "East Asembo", "West Asembo", "North Seme"]
      },
      "Nyando": {
        subCounty: "Nyando",
        wards: ["Muhoroni", "Miwani", "Ombeyi", "Awasi/Onjiko", "Ahero"]
      },
      "Muhoroni": {
        subCounty: "Muhoroni",
        wards: ["Miwani", "Ombeyi", "Muhoroni/Koru", "Chemilil", "Masogo/Nyang'oma"]
      },
      "Nyakach": {
        subCounty: "Nyakach",
        wards: ["South West Nyakach", "North Nyakach", "Central Nyakach", "West Nyakach", "South East Nyakach"]
      }
    }
  },
  "Homa Bay": {
    constituencies: {
      "Kasipul": {
        subCounty: "Kasipul",
        wards: ["West Kasipul", "South Kasipul", "Central Kasipul", "East Kamagak", "West Kamagak"]
      },
      "Kabondo Kasipul": {
        subCounty: "Kabondo Kasipul",
        wards: ["Kabondo East", "Kabondo West", "Kokwanyo/Kakelo", "Koja"]
      },
      "Karachuonyo": {
        subCounty: "Karachuonyo",
        wards: ["Wang'chieng", "North Karachuonyo", "Central", "Kendu Bay Town", "Kanyaluo"]
      },
      "Rangwe": {
        subCounty: "Rangwe",
        wards: ["West Gem", "East Gem", "Kagan", "Kochia"]
      },
      "Homa Bay Town": {
        subCounty: "Homa Bay Town",
        wards: ["Homa Bay Central", "Homa Bay Arujo", "Homa Bay West", "Homa Bay East"]
      },
      "Ndhiwa": {
        subCounty: "Ndhiwa",
        wards: ["Kwabwai", "Kanyadoto", "Kanyikela", "Kabuoch North", "Kabuoch South/Pala"]
      },
      "Suba North": {
        subCounty: "Suba North",
        wards: ["Mfangano Island", "Rusinga Island", "Kasgunga", "Gembe", "Lambwe"]
      },
      "Suba South": {
        subCounty: "Suba South",
        wards: ["Gwassi South", "Gwassi North", "Kaksingri West", "Ruma-Kaksingri East"]
      }
    }
  },
  "Migori": {
    constituencies: {
      "Rongo": {
        subCounty: "Rongo",
        wards: ["North Kamagambo", "Central Kamagambo", "East Kamagambo", "South Kamagambo"]
      },
      "Awendo": {
        subCounty: "Awendo",
        wards: ["North Sakwa", "South Sakwa", "West Sakwa", "Central Sakwa"]
      },
      "Suna East": {
        subCounty: "Suna East",
        wards: ["God Jope", "Suna Central", "Kakrao", "Kwa"]
      },
      "Suna West": {
        subCounty: "Suna West",
        wards: ["Wiga", "Wasweta II", "Ragana-Oruba", "Wasimbete"]
      },
      "Uriri": {
        subCounty: "Uriri",
        wards: ["West Kanyamkago", "North Kanyamkago", "Central Kanyamkago", "South Kanyamkago", "East Kanyamkago"]
      },
      "Nyatike": {
        subCounty: "Nyatike",
        wards: ["Karungu", "Kaler", "Got Kachola", "Muhuru", "Macalder/Kanyarwanda"]
      },
      "Kuria West": {
        subCounty: "Kuria West",
        wards: ["Bukira East", "Bukira Central/Ikerege", "Isibania", "Makerero", "Masaba"]
      },
      "Kuria East": {
        subCounty: "Kuria East",
        wards: ["Nyabasi East", "Nyabasi West", "Kegonga", "Ntimaru West", "Ntimaru East"]
      }
    }
  },
  "Kisii": {
    constituencies: {
      "Kitutu Chache North": {
        subCounty: "Kitutu Chache North",
        wards: ["Monyerero", "Sensi", "Marani", "Kitutu Central", "Nyacheki", "Bogusero"]
      },
      "Kitutu Chache South": {
        subCounty: "Kitutu Chache South",
        wards: ["Bogetenga", "Bogiakumu", "Borabu/Chitago", "Mwamonari", "Nyakoe", "Kitutu Masaba"]
      },
      "Nyaribari Masaba": {
        subCounty: "Nyaribari Masaba",
        wards: ["Ichuni", "Nyamasibi", "Masimba", "Gesusu", "Kiamokama"]
      },
      "Nyaribari Chache": {
        subCounty: "Nyaribari Chache",
        wards: ["Bobaracho", "Kisii Central", "Keumbu", "Kiogoro", "Birongo", "Ibeno"]
      },
      "Bobasi": {
        subCounty: "Bobasi",
        wards: ["Masige West", "Masige East", "Basi Central", "Nyacheki", "Sameta/Mokwerero", "Bobasi/Boitangare"]
      },
      "South Mugirango": {
        subCounty: "South Mugirango",
        wards: ["Tabaka", "Boikanga", "Bomariba", "Bomorenda", "Bogetenga"]
      },
      "Bomachoge Borabu": {
        subCounty: "Bomachoge Borabu",
        wards: ["Boochi/Tendere", "Bokimonge", "Magenche", "Bosoti/Sengera"]
      },
      "Bomachoge Chache": {
        subCounty: "Bomachoge Chache",
        wards: ["Majoge Bassi", "Bogiakumu", "Bosoti/Sengera", "Nyamasibi"]
      },
      "Bonchari": {
        subCounty: "Bonchari",
        wards: ["Bomorenda", "Bogiakumu", "Bomariba", "Bokeira", "Riana"]
      }
    }
  },
  "Nyamira": {
    constituencies: {
      "Kitutu Masaba": {
        subCounty: "Kitutu Masaba",
        wards: ["Rigoma", "Gachuba", "Kemera", "Magombo", "Manga", "Gesima"]
      },
      "West Mugirango": {
        subCounty: "West Mugirango",
        wards: ["Bogichora", "Bosamaro", "Bonyamatuta", "Township"]
      },
      "North Mugirango": {
        subCounty: "North Mugirango",
        wards: ["Itibo", "Bomwagamo", "Bokeira", "Magwagwa", "Ekerenyo"]
      },
      "Borabu": {
        subCounty: "Borabu",
        wards: ["Mekenene", "Nyansiongo", "Esise", "Kiabonyoru"]
      }
    }
  },
  "Nairobi": {
    constituencies: {
      "Westlands": {
        subCounty: "Westlands",
        wards: ["Kitisuru", "Parklands/Highridge", "Karura", "Kangemi", "Mountain View"]
      },
      "Dagoretti North": {
        subCounty: "Dagoretti North",
        wards: ["Kilimani", "Kawangware", "Gatina", "Kileleshwa", "Kabiro"]
      },
      "Dagoretti South": {
        subCounty: "Dagoretti South",
        wards: ["Mutuini", "Ngando", "Riruta", "Uthiru/Ruthimitu", "Waithaka"]
      },
      "Langata": {
        subCounty: "Langata",
        wards: ["Karen", "Nairobi West", "Mugumo-ini", "South C", "Nyayo Highrise"]
      },
      "Kibra": {
        subCounty: "Kibra",
        wards: ["Laini Saba", "Lindi", "Makina", "Woodley/Kenyatta Golf Course", "Sarang'ombe"]
      },
      "Roysambu": {
        subCounty: "Roysambu",
        wards: ["Githurai", "Kahawa West", "Zimmerman", "Roysambu", "Kahawa"]
      },
      "Kasarani": {
        subCounty: "Kasarani",
        wards: ["Clay City", "Mwiki", "Kasarani", "Njiru", "Ruai"]
      },
      "Ruaraka": {
        subCounty: "Ruaraka",
        wards: ["Baba Dogo", "Utalii", "Mathare North", "Lucky Summer", "Korogocho"]
      },
      "Embakasi South": {
        subCounty: "Embakasi South",
        wards: ["Imara Daima", "Kwa Njenga", "Kwa Reuben", "Pipeline", "Kware"]
      },
      "Embakasi North": {
        subCounty: "Embakasi North",
        wards: ["Kariobangi North", "Dandora Area I", "Dandora Area II", "Dandora Area III", "Dandora Area IV"]
      },
      "Embakasi Central": {
        subCounty: "Embakasi Central",
        wards: ["Kayole North", "Kayole Central", "Kayole South", "Komarock", "Matopeni/Spring Valley"]
      },
      "Embakasi East": {
        subCounty: "Embakasi East",
        wards: ["Upper Savannah", "Lower Savannah", "Embakasi", "Utawala", "Mihang'o"]
      },
      "Embakasi West": {
        subCounty: "Embakasi West",
        wards: ["Umoja I", "Umoja II", "Mowlem", "Kariobangi South"]
      },
      "Makadara": {
        subCounty: "Makadara",
        wards: ["Maringo/Hamza", "Viwandani", "Harambee", "Makongeni"]
      },
      "Kamukunji": {
        subCounty: "Kamukunji",
        wards: ["Pumwani", "Eastleigh North", "Eastleigh South", "Airbase", "California"]
      },
      "Starehe": {
        subCounty: "Starehe",
        wards: ["Nairobi Central", "Ngara", "Pangani", "Ziwani/Kariokor", "Landimawe", "Nairobi South"]
      },
      "Mathare": {
        subCounty: "Mathare",
        wards: ["Hospital", "Mabatini", "Huruma", "Ngei", "Mlango Kubwa", "Kiamaiko"]
      }
    }
  }
};

// Helper functions
export const getCounties = (): string[] => {
  return Object.keys(kenyaLocations).sort();
};

export const getConstituencies = (county: string): string[] => {
  if (!county || !kenyaLocations[county]) return [];
  return Object.keys(kenyaLocations[county].constituencies).sort();
};

export const getSubCounty = (county: string, constituency: string): string => {
  if (!county || !constituency || !kenyaLocations[county]) return "";
  const constituencyData = kenyaLocations[county].constituencies[constituency];
  return constituencyData ? constituencyData.subCounty : "";
};

export const getWards = (county: string, constituency: string): string[] => {
  if (!county || !constituency || !kenyaLocations[county]) return [];
  const constituencyData = kenyaLocations[county].constituencies[constituency];
  return constituencyData ? constituencyData.wards.sort() : [];
};

// Get all sub-counties for a county (unique list)
export const getSubCounties = (county: string): string[] => {
  if (!county || !kenyaLocations[county]) return [];
  const subCounties = new Set<string>();
  Object.values(kenyaLocations[county].constituencies).forEach(c => {
    subCounties.add(c.subCounty);
  });
  return Array.from(subCounties).sort();
};
