export type Photo = { id: string; alt: string }

export const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'Estates', href: '#estates' },
  { label: 'Experiences', href: '#experiences' },
  { label: 'Locations', href: '#locations' },
  { label: 'About', href: '#arrival' },
]

/** Sections tracked by the side progress indicator, in page order. */
export const chapters = [
  { id: 'home', label: 'Home' },
  { id: 'estates', label: 'Estates' },
  { id: 'interiors', label: 'Interiors' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'experiences', label: 'Experiences' },
  { id: 'locations', label: 'Locations' },
]

export const hero = {
  photo: {
    id: '1571003123894-1f0594d2b5d9',
    alt: 'Infinity pool lined with curtained cabanas glowing at dusk above the ocean',
  },
  estate: 'Villa Solana',
  place: 'Uluwatu, Bali',
  coords: '8.8291° S · 115.0849° E',
}

export const arrival = {
  photo: {
    id: '1600566753376-12c8ab7fb75b',
    alt: 'Modern estate entrance glowing at blue hour, timber screen and stone path',
  },
  stats: [
    { value: '50+', label: 'Exclusive Estates' },
    { value: '12', label: 'Global Destinations' },
    { value: '100%', label: 'Curated & Verified' },
  ],
}

export type Estate = {
  name: string
  place: string
  country: string
  style: string
  description: string
  photo: Photo
}

export const estates: Estate[] = [
  {
    name: 'Casa Marea',
    place: 'Malibu',
    country: 'California, USA',
    style: 'Coastal estate',
    description: 'A beachfront pavilion of glass and white oak, set directly on the sand of Carbon Beach.',
    photo: { id: '1615571022219-eb45cf7faa9d', alt: 'Contemporary beach house on the sand with waves rolling in' },
  },
  {
    name: 'Villa Kalliste',
    place: 'Santorini',
    country: 'Greece',
    style: 'Cycladic cliffside villa',
    description: 'Whitewashed terraces carved into the caldera, facing the most famous sunset in the Aegean.',
    photo: { id: '1570077188670-e3a8d69ac5ff', alt: 'Whitewashed Oia villas cascading down the Santorini caldera at dusk' },
  },
  {
    name: 'Villa del Lago',
    place: 'Lake Como',
    country: 'Italy',
    style: 'Lakeside retreat',
    description: 'A private boathouse and alpine lodge where still water meets the Dolomite peaks.',
    photo: { id: '1470770841072-f978cf4d019e', alt: 'Timber lake house on still turquoise water beneath forested mountains' },
  },
  {
    name: 'The Atlantic House',
    place: 'Cape Town',
    country: 'South Africa',
    style: 'Contemporary villa',
    description: 'Cantilevered white volumes and an infinity pool beneath the Twelve Apostles.',
    photo: { id: '1580587771525-78b9dba3b914', alt: 'Contemporary white villa with glass walls and a long infinity pool' },
  },
  {
    name: 'Palm Reflection',
    place: 'Dubai',
    country: 'UAE',
    style: 'Waterfront residence',
    description: 'Pavilion villas mirrored in a still reflecting pool, minutes from the Arabian Gulf.',
    photo: { id: '1571896349842-33c89424de2d', alt: 'Low pavilion villas mirrored in a still reflecting pool at night' },
  },
]

export const enterHome = {
  entrance: { id: '1600585153490-76fb20a32601', alt: 'Black-clad modern residence with a glowing glass entrance at night' },
  interior: { id: '1564078516393-cf04bd966897', alt: 'Double-height living room with a curved sofa and dusk light through tall windows' },
}

export type Room = { name: string; description: string; photo: Photo }

export const rooms: Room[] = [
  {
    name: 'Living Room',
    description: 'Double-height volumes, hand-finished plaster and walls of glass that dissolve into the horizon at dusk.',
    photo: enterHome.interior,
  },
  {
    name: 'Kitchen',
    description: 'A chef’s kitchen in oak and honed stone, with a scullery, wine room and island for twelve.',
    photo: { id: '1600585152220-90363fe7e115', alt: 'Minimal kitchen with a white stone island, oak cabinetry and pendant lights' },
  },
  {
    name: 'Master Suite',
    description: 'A private wing with a glass-walled bath, dressing gallery and uninterrupted views from the bed.',
    photo: { id: '1578683010236-d716f9a3f461', alt: 'Master bedroom with a low bed facing floor-to-ceiling windows' },
  },
  {
    name: 'Guest Rooms',
    description: 'Four suites, each with its own terrace, tailored linen and quiet, hotel-grade detailing.',
    photo: { id: '1611892440504-42a792e24d32', alt: 'Warm, moody guest suite with a timber ceiling and garden views' },
  },
  {
    name: 'Entertainment',
    description: 'A panelled library-lounge, cinema and cellar — made for long evenings and good company.',
    photo: { id: '1590381105924-c72589b9ef3f', alt: 'Wood-panelled library lounge with warm lamps and leather seating' },
  },
]

export const interiorGallery: Photo[] = [
  ...rooms.map((r) => r.photo),
  { id: '1600607687939-ce8a6c25118c', alt: 'Open-plan living space with a sculptural sofa and garden views' },
  { id: '1638799869566-b17fa794c4de', alt: 'Marble bathroom with a freestanding tub and walk-in shower' },
  { id: '1617806118233-18e1de247200', alt: 'Dining room with emerald velvet chairs and a sculptural pendant' },
  { id: '1600210491892-03d54c0aaf87', alt: 'Arched windows framing a bright living room with a stone fireplace' },
]

export const lifestyle = {
  background: { id: '1561501900-3701fa6a0864', alt: 'Coastal estate terrace and infinity pool beneath a pink sunset' },
  features: [
    { name: 'Infinity Pools', photo: { id: '1543489822-c49534f3271f', alt: 'Infinity pool edge meeting the sea beneath a white pergola' } },
    { name: 'Private Beach Access', photo: { id: '1507525428034-b723cf961d3e', alt: 'Quiet beach at sunrise with gentle waves' } },
    { name: 'Entertainment', photo: { id: '1561501878-aabd62634533', alt: 'Open-air pavilion lounge lit at night above the water' } },
    { name: 'Wellness & Spa', photo: { id: '1600334129128-685c5582fd35', alt: 'Hot-stone massage with white orchids in a spa' } },
  ],
}

export const featured = {
  name: 'The Horizon Residence',
  place: 'Cape Town, South Africa',
  price: '$8,750,000',
  specs: [
    { value: '5', label: 'Bedrooms' },
    { value: '6', label: 'Bathrooms' },
    { value: '6,200', label: 'Sq Ft' },
  ],
  description:
    'A striking blend of modern architecture and natural beauty, offering panoramic views, refined interiors, and complete privacy.',
  photos: [
    { id: '1600585154340-be6161a56a0c', alt: 'The Horizon Residence at dusk, lit timber and glass volumes among trees' },
    { id: '1600607687939-ce8a6c25118c', alt: 'Open living room with sculptural sofa and garden views' },
    { id: '1600585154084-4e5fe7c39198', alt: 'Living area opening onto a covered terrace with outdoor dining' },
    { id: '1576485290814-1c72aa4bbb8e', alt: 'View over Camps Bay and the Twelve Apostles at golden hour' },
  ] as Photo[],
  captions: ['The approach', 'The living pavilion', 'Indoor–outdoor living', 'The view'],
}

export const architecture = {
  lead: { id: '1448630360428-65456885c650', alt: 'Dark stone facade with deep-set windows against a blue sky' },
  principles: [
    {
      n: '01',
      title: 'Form',
      text: 'Architecture as sculpture — bold geometry, honest materials and proportions that feel inevitable.',
      photo: { id: '1487958449943-2429e8be8625', alt: 'Angular white glass building with sharp folded geometry' },
    },
    {
      n: '02',
      title: 'Light',
      text: 'Homes composed around the sun — how it enters in the morning, and how the house glows at night.',
      photo: { id: '1600573472556-e636c2acda88', alt: 'Perforated timber screen facade glowing with interior light at dusk' },
    },
    {
      n: '03',
      title: 'Place',
      text: 'Every estate belongs to its landscape: a cliff, a lake, a coastline — never an afterthought.',
      photo: { id: '1596394516093-501ba68a0ba6', alt: 'Open-air bed on a wooden deck overlooking a lake and mountains' },
    },
  ],
}

export const experiences = [
  {
    n: '01',
    title: 'Private Travel',
    text: 'Jet and helicopter transfers arranged door to door, with private terminals and discreet ground teams.',
    photo: { id: '1506012787146-f92b2d7d6d96', alt: 'Private aircraft wing above the clouds at sunset' },
  },
  {
    n: '02',
    title: 'Gourmet Dining',
    text: 'Residential chefs, sommelier-led cellars and tasting menus served on your own terrace.',
    photo: { id: '1414235077428-338989a2e8c0', alt: 'Candlelit fine-dining course with wine glasses' },
  },
  {
    n: '03',
    title: 'Concierge Services',
    text: 'Yacht charters, reservations and bespoke itineraries — handled by one dedicated team, day or night.',
    photo: { id: '1567899378494-47b22a2ae96a', alt: 'Superyacht cruising turquoise water along a green coastline' },
  },
  {
    n: '04',
    title: 'Security & Privacy',
    text: 'Vetted estate staff, discreet protection and gated arrivals so your life remains your own.',
    photo: { id: '1600585154526-990dced4db0d', alt: 'Dark modern residence facade with a private, lit entrance at night' },
  },
]

export type Destination = {
  city: string
  country: string
  lat: number
  lon: number
  estates: number
  note: string
  photo: Photo
}

export const destinations: Destination[] = [
  { city: 'Malibu', country: 'United States', lat: 34.03, lon: -118.78, estates: 8, note: 'Oceanfront pavilions along the Pacific Coast Highway.', photo: { id: '1506953823976-52e1fdc0149a', alt: 'Palm tree leaning over a calm Pacific beach' } },
  { city: 'Miami', country: 'United States', lat: 25.76, lon: -80.19, estates: 6, note: 'Waterfront residences on Star Island and Fisher Island.', photo: { id: '1535498730771-e735b998cd64', alt: 'Miami skyline reflected on the bay at pink dusk' } },
  { city: 'London', country: 'United Kingdom', lat: 51.51, lon: -0.13, estates: 5, note: 'Georgian townhouses and garden squares in Mayfair and Chelsea.', photo: { id: '1513635269975-59663e0ac1ad', alt: 'Aerial view over the Thames and Tower Bridge in London' } },
  { city: 'Lake Como', country: 'Italy', lat: 45.99, lon: 9.26, estates: 4, note: 'Historic villas and boathouses along the western shore.', photo: { id: '1501785888041-af3ef285b470', alt: 'Boat crossing a turquoise alpine lake between mountains' } },
  { city: 'Santorini', country: 'Greece', lat: 36.39, lon: 25.46, estates: 5, note: 'Cave villas carved into the caldera at Oia and Imerovigli.', photo: { id: '1613395877344-13d4a8e0d49e', alt: 'Blue domes of Santorini above the Aegean Sea' } },
  { city: 'Dubai', country: 'United Arab Emirates', lat: 25.2, lon: 55.27, estates: 7, note: 'Palm Jumeirah waterfronts and desert-edge compounds.', photo: { id: '1518684079-3c830dcef090', alt: 'Burj Al Arab on its island in the turquoise Gulf' } },
  { city: 'Cape Town', country: 'South Africa', lat: -33.92, lon: 18.42, estates: 6, note: 'Clifftop villas between Table Mountain and the Atlantic.', photo: { id: '1580060839134-75a5edca2e99', alt: 'Aerial view of Cape Town, Table Mountain and the coastline' } },
]

export const privateCollection = [
  { name: 'Alpenglow Lodge', place: 'Aspen, Colorado', style: 'Mountain retreat', photo: { id: '1510798831971-661eb04b3739', alt: 'Timber mountain lodge glowing in a snowy forest beside a still lake' } },
  { name: 'Casa Selva', place: 'Tulum, Mexico', style: 'Private compound', photo: { id: '1582610116397-edb318620f90', alt: 'Tropical courtyard pool framed by palms and a pavilion' } },
  { name: 'The Pines', place: 'Big Sur, California', style: 'Architectural residence', photo: { id: '1601918774946-25832a4be0d6', alt: 'A-frame house lit warmly among towering forest trees' } },
]

export const finale = {
  photo: { id: '1599809275671-b5942cabc7a2', alt: 'Mediterranean villa terrace with a fire bowl and pool at sunset' },
}

/** Stills used for the "Watch the Film" sequence. */
export const film: { photo: Photo; caption: string }[] = [
  { photo: hero.photo, caption: 'Villa Solana — Uluwatu' },
  { photo: estates[1].photo, caption: 'Villa Kalliste — Santorini' },
  { photo: rooms[0].photo, caption: 'The living pavilion' },
  { photo: lifestyle.background, caption: 'Evenings on the terrace' },
  { photo: estates[2].photo, caption: 'Villa del Lago — Lake Como' },
  { photo: finale.photo, caption: 'Live beyond ordinary' },
]
