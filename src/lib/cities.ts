export interface City {
  name: string;
  country: string;
  region: string;
  lat: number;
  lon: number;
  /** Standard (non-DST) UTC offset in hours used to interpret entered clock time. */
  utcOffset: number;
}

export const CITIES: City[] = [
  // North America
  { name: "New York", country: "USA", region: "North America", lat: 40.71, lon: -74.0, utcOffset: -5 },
  { name: "Los Angeles", country: "USA", region: "North America", lat: 34.05, lon: -118.24, utcOffset: -8 },
  { name: "San Francisco", country: "USA", region: "North America", lat: 37.77, lon: -122.42, utcOffset: -8 },
  { name: "Chicago", country: "USA", region: "North America", lat: 41.85, lon: -87.65, utcOffset: -6 },
  { name: "Houston", country: "USA", region: "North America", lat: 29.76, lon: -95.37, utcOffset: -6 },
  { name: "Denver", country: "USA", region: "North America", lat: 39.74, lon: -104.99, utcOffset: -7 },
  { name: "Seattle", country: "USA", region: "North America", lat: 47.61, lon: -122.33, utcOffset: -8 },
  { name: "Boston", country: "USA", region: "North America", lat: 42.36, lon: -71.06, utcOffset: -5 },
  { name: "Honolulu", country: "USA", region: "North America", lat: 21.31, lon: -157.86, utcOffset: -10 },
  { name: "Toronto", country: "Canada", region: "North America", lat: 43.65, lon: -79.38, utcOffset: -5 },
  { name: "Vancouver", country: "Canada", region: "North America", lat: 49.28, lon: -123.12, utcOffset: -8 },
  { name: "Montreal", country: "Canada", region: "North America", lat: 45.5, lon: -73.57, utcOffset: -5 },
  { name: "Mexico City", country: "Mexico", region: "North America", lat: 19.43, lon: -99.13, utcOffset: -6 },

  // South America
  { name: "São Paulo", country: "Brazil", region: "South America", lat: -23.55, lon: -46.63, utcOffset: -3 },
  { name: "Rio de Janeiro", country: "Brazil", region: "South America", lat: -22.91, lon: -43.17, utcOffset: -3 },
  { name: "Buenos Aires", country: "Argentina", region: "South America", lat: -34.6, lon: -58.38, utcOffset: -3 },
  { name: "Lima", country: "Peru", region: "South America", lat: -12.05, lon: -77.04, utcOffset: -5 },
  { name: "Bogotá", country: "Colombia", region: "South America", lat: 4.71, lon: -74.07, utcOffset: -5 },
  { name: "Santiago", country: "Chile", region: "South America", lat: -33.45, lon: -70.67, utcOffset: -4 },

  // Europe
  { name: "London", country: "UK", region: "Europe", lat: 51.51, lon: -0.13, utcOffset: 0 },
  { name: "Dublin", country: "Ireland", region: "Europe", lat: 53.35, lon: -6.26, utcOffset: 0 },
  { name: "Lisbon", country: "Portugal", region: "Europe", lat: 38.72, lon: -9.14, utcOffset: 0 },
  { name: "Paris", country: "France", region: "Europe", lat: 48.85, lon: 2.35, utcOffset: 1 },
  { name: "Madrid", country: "Spain", region: "Europe", lat: 40.42, lon: -3.7, utcOffset: 1 },
  { name: "Berlin", country: "Germany", region: "Europe", lat: 52.52, lon: 13.4, utcOffset: 1 },
  { name: "Frankfurt", country: "Germany", region: "Europe", lat: 50.11, lon: 8.68, utcOffset: 1 },
  { name: "Rome", country: "Italy", region: "Europe", lat: 41.9, lon: 12.5, utcOffset: 1 },
  { name: "Amsterdam", country: "Netherlands", region: "Europe", lat: 52.37, lon: 4.9, utcOffset: 1 },
  { name: "Brussels", country: "Belgium", region: "Europe", lat: 50.85, lon: 4.35, utcOffset: 1 },
  { name: "Zurich", country: "Switzerland", region: "Europe", lat: 47.38, lon: 8.54, utcOffset: 1 },
  { name: "Vienna", country: "Austria", region: "Europe", lat: 48.21, lon: 16.37, utcOffset: 1 },
  { name: "Prague", country: "Czechia", region: "Europe", lat: 50.08, lon: 14.44, utcOffset: 1 },
  { name: "Budapest", country: "Hungary", region: "Europe", lat: 47.5, lon: 19.04, utcOffset: 1 },
  { name: "Warsaw", country: "Poland", region: "Europe", lat: 52.23, lon: 21.01, utcOffset: 1 },
  { name: "Stockholm", country: "Sweden", region: "Europe", lat: 59.33, lon: 18.07, utcOffset: 1 },
  { name: "Oslo", country: "Norway", region: "Europe", lat: 59.91, lon: 10.75, utcOffset: 1 },
  { name: "Copenhagen", country: "Denmark", region: "Europe", lat: 55.68, lon: 12.57, utcOffset: 1 },
  { name: "Helsinki", country: "Finland", region: "Europe", lat: 60.17, lon: 24.94, utcOffset: 2 },
  { name: "Athens", country: "Greece", region: "Europe", lat: 37.98, lon: 23.73, utcOffset: 2 },
  { name: "Kyiv", country: "Ukraine", region: "Europe", lat: 50.45, lon: 30.52, utcOffset: 2 },
  { name: "Istanbul", country: "Turkey", region: "Europe", lat: 41.01, lon: 28.98, utcOffset: 3 },
  { name: "Moscow", country: "Russia", region: "Europe", lat: 55.76, lon: 37.62, utcOffset: 3 },

  // Middle East & Africa
  { name: "Dubai", country: "UAE", region: "Middle East & Africa", lat: 25.2, lon: 55.27, utcOffset: 4 },
  { name: "Abu Dhabi", country: "UAE", region: "Middle East & Africa", lat: 24.47, lon: 54.37, utcOffset: 4 },
  { name: "Doha", country: "Qatar", region: "Middle East & Africa", lat: 25.29, lon: 51.53, utcOffset: 3 },
  { name: "Riyadh", country: "Saudi Arabia", region: "Middle East & Africa", lat: 24.71, lon: 46.68, utcOffset: 3 },
  { name: "Tel Aviv", country: "Israel", region: "Middle East & Africa", lat: 32.08, lon: 34.78, utcOffset: 2 },
  { name: "Cairo", country: "Egypt", region: "Middle East & Africa", lat: 30.04, lon: 31.24, utcOffset: 2 },
  { name: "Casablanca", country: "Morocco", region: "Middle East & Africa", lat: 33.57, lon: -7.59, utcOffset: 1 },
  { name: "Algiers", country: "Algeria", region: "Middle East & Africa", lat: 36.75, lon: 3.06, utcOffset: 1 },
  { name: "Tunis", country: "Tunisia", region: "Middle East & Africa", lat: 36.81, lon: 10.18, utcOffset: 1 },
  { name: "Lagos", country: "Nigeria", region: "Middle East & Africa", lat: 6.52, lon: 3.38, utcOffset: 1 },
  { name: "Accra", country: "Ghana", region: "Middle East & Africa", lat: 5.6, lon: -0.19, utcOffset: 0 },
  { name: "Addis Ababa", country: "Ethiopia", region: "Middle East & Africa", lat: 9.03, lon: 38.74, utcOffset: 3 },
  { name: "Nairobi", country: "Kenya", region: "Middle East & Africa", lat: -1.29, lon: 36.82, utcOffset: 3 },
  { name: "Johannesburg", country: "South Africa", region: "Middle East & Africa", lat: -26.2, lon: 28.05, utcOffset: 2 },

  // South & Central Asia
  { name: "Mumbai", country: "India", region: "South & Central Asia", lat: 19.08, lon: 72.88, utcOffset: 5.5 },
  { name: "Delhi", country: "India", region: "South & Central Asia", lat: 28.61, lon: 77.21, utcOffset: 5.5 },
  { name: "Bengaluru", country: "India", region: "South & Central Asia", lat: 12.97, lon: 77.59, utcOffset: 5.5 },
  { name: "Karachi", country: "Pakistan", region: "South & Central Asia", lat: 24.86, lon: 67.01, utcOffset: 5 },
  { name: "Dhaka", country: "Bangladesh", region: "South & Central Asia", lat: 23.81, lon: 90.41, utcOffset: 6 },
  { name: "Kathmandu", country: "Nepal", region: "South & Central Asia", lat: 27.72, lon: 85.32, utcOffset: 5.75 },
  { name: "Colombo", country: "Sri Lanka", region: "South & Central Asia", lat: 6.93, lon: 79.85, utcOffset: 5.5 },

  // East Asia
  { name: "Beijing", country: "China", region: "East Asia", lat: 39.9, lon: 116.4, utcOffset: 8 },
  { name: "Shanghai", country: "China", region: "East Asia", lat: 31.23, lon: 121.47, utcOffset: 8 },
  { name: "Guangzhou", country: "China", region: "East Asia", lat: 23.13, lon: 113.26, utcOffset: 8 },
  { name: "Shenzhen", country: "China", region: "East Asia", lat: 22.54, lon: 114.06, utcOffset: 8 },
  { name: "Chengdu", country: "China", region: "East Asia", lat: 30.57, lon: 104.07, utcOffset: 8 },
  { name: "Hong Kong", country: "China", region: "East Asia", lat: 22.32, lon: 114.17, utcOffset: 8 },
  { name: "Taipei", country: "Taiwan", region: "East Asia", lat: 25.03, lon: 121.57, utcOffset: 8 },
  { name: "Tokyo", country: "Japan", region: "East Asia", lat: 35.68, lon: 139.65, utcOffset: 9 },
  { name: "Osaka", country: "Japan", region: "East Asia", lat: 34.69, lon: 135.5, utcOffset: 9 },
  { name: "Seoul", country: "South Korea", region: "East Asia", lat: 37.57, lon: 126.98, utcOffset: 9 },
  { name: "Busan", country: "South Korea", region: "East Asia", lat: 35.18, lon: 129.08, utcOffset: 9 },
  { name: "Ulaanbaatar", country: "Mongolia", region: "East Asia", lat: 47.89, lon: 106.91, utcOffset: 8 },

  // Southeast Asia
  { name: "Singapore", country: "Singapore", region: "Southeast Asia", lat: 1.35, lon: 103.82, utcOffset: 8 },
  { name: "Kuala Lumpur", country: "Malaysia", region: "Southeast Asia", lat: 3.14, lon: 101.69, utcOffset: 8 },
  { name: "Bangkok", country: "Thailand", region: "Southeast Asia", lat: 13.76, lon: 100.5, utcOffset: 7 },
  { name: "Chiang Mai", country: "Thailand", region: "Southeast Asia", lat: 18.79, lon: 98.99, utcOffset: 7 },
  { name: "Jakarta", country: "Indonesia", region: "Southeast Asia", lat: -6.21, lon: 106.85, utcOffset: 7 },
  { name: "Surabaya", country: "Indonesia", region: "Southeast Asia", lat: -7.25, lon: 112.75, utcOffset: 7 },
  { name: "Manila", country: "Philippines", region: "Southeast Asia", lat: 14.6, lon: 120.98, utcOffset: 8 },
  { name: "Ho Chi Minh City", country: "Vietnam", region: "Southeast Asia", lat: 10.82, lon: 106.63, utcOffset: 7 },
  { name: "Hanoi", country: "Vietnam", region: "Southeast Asia", lat: 21.03, lon: 105.85, utcOffset: 7 },
  { name: "Phnom Penh", country: "Cambodia", region: "Southeast Asia", lat: 11.56, lon: 104.92, utcOffset: 7 },
  { name: "Vientiane", country: "Laos", region: "Southeast Asia", lat: 17.97, lon: 102.6, utcOffset: 7 },
  { name: "Yangon", country: "Myanmar", region: "Southeast Asia", lat: 16.87, lon: 96.2, utcOffset: 6.5 },
  { name: "Bandar Seri Begawan", country: "Brunei", region: "Southeast Asia", lat: 4.94, lon: 114.94, utcOffset: 8 },

  // Oceania
  { name: "Sydney", country: "Australia", region: "Oceania", lat: -33.87, lon: 151.21, utcOffset: 10 },
  { name: "Melbourne", country: "Australia", region: "Oceania", lat: -37.81, lon: 144.96, utcOffset: 10 },
  { name: "Brisbane", country: "Australia", region: "Oceania", lat: -27.47, lon: 153.03, utcOffset: 10 },
  { name: "Perth", country: "Australia", region: "Oceania", lat: -31.95, lon: 115.86, utcOffset: 8 },
  { name: "Auckland", country: "New Zealand", region: "Oceania", lat: -36.85, lon: 174.76, utcOffset: 12 },
  { name: "Wellington", country: "New Zealand", region: "Oceania", lat: -41.29, lon: 174.78, utcOffset: 12 },
  { name: "Port Moresby", country: "Papua New Guinea", region: "Oceania", lat: -9.44, lon: 147.18, utcOffset: 10 },
  { name: "Suva", country: "Fiji", region: "Oceania", lat: -18.14, lon: 178.44, utcOffset: 12 },
];

export const REGIONS = Array.from(new Set(CITIES.map((c) => c.region)));

export function cityKey(city: City): string {
  return `${city.name}|${city.country}`;
}
