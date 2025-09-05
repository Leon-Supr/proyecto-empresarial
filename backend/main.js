// deno-lint-ignore-file no-unused-vars
import { writeFileSync } from 'node:fs';
import * as fetches from './fetches.js'

const ids = ["817970082933532688", "954473174946152883", "1015537343207542410", "1015555116231236815", "641235233453546192", "1015519545063348954"]

const cursorGen = (num) => {
  // Generador de cursores cabrones
  const cursorArray = []
  let cursorOffset = 0;
  for (let i = 0; i < num; i++) {
    const cursor = `{"section_offset":0,"items_offset":${cursorOffset},"version":1}`
    const encodedCursor = btoa(cursor)
    cursorArray.push(encodedCursor)
    cursorOffset += 18;
  }
  return cursorArray
}

async function fetchado(inputCursor) { // Es la función principal, con esta se hará el fetch del cursor que se ingrese
  const cursor1 = "eyJzZWN0aW9uX29mZnNldCI6MCwiaXRlbXNfb2Zmc2V0IjoxOCwidmVyc2lvbiI6MX0=" // Paginado 2
  const _cursor2 = "eyJzZWN0aW9uX29mZnNldCI6MCwiaXRlbXNfb2Zmc2V0IjozNiwidmVyc2lvbiI6MX0=" // Paginado 3
  const _cursorExperimental = "eyJzZWN0aW9uX29mZnNldCI6MCwiaXRlbXNfb2Zmc2V0IjowLCJ2ZXJzaW9uIjoxfQ" // Experimento poniendo offset 0
  const selectedCursor = inputCursor

  // const res = await fetch(`https://www.airbnb.mx/api/v3/StaysSearch/f580a5d74bce8912fc96740f8ded51b8cdf084e5058cc38f464f85997b3907d6?operationName=StaysSearch&locale=es-419&currency=MXN`, {
  //   "headers": {
  //     "accept": "*/*",
  //     "accept-language": "es-419,es;q=0.9",
  //     "content-type": "application/json",
  //     "ect": "4g",
  //     "priority": "u=1, i",
  //     "sec-ch-device-memory": "8",
  //     "sec-ch-dpr": "1.125",
  //     "sec-ch-ua": "\"Not)A;Brand\";v=\"8\", \"Chromium\";v=\"138\"",
  //     "sec-ch-ua-mobile": "?0",
  //     "sec-ch-ua-platform": "\"Linux\"",
  //     "sec-ch-ua-platform-version": "\"6.15.7\"",
  //     "sec-ch-viewport-width": "940",
  //     "sec-fetch-dest": "empty",
  //     "sec-fetch-mode": "cors",
  //     "sec-fetch-site": "same-origin",
  //     "x-airbnb-api-key": "d306zoyjsyarp7ifhu67rjxn52tv0t20",
  //     "x-airbnb-client-trace-id": "0agkzso12mib1705fwtf202cz6ug",
  //     "x-airbnb-graphql-platform": "web",
  //     "x-airbnb-graphql-platform-client": "minimalist-niobe",
  //     "x-airbnb-supports-airlock-v2": "true",
  //     "x-client-request-id": "0wdndnu15xt7yk1vlsy2g03skz0u",
  //     "x-client-version": "59dff14978d066419548b4ac2b9b7ce811ec6a8e",
  //     "x-csrf-token": "",
  //     "x-csrf-without-token": "1",
  //     "x-niobe-short-circuited": "true",
  //     "cookie": "_user_attributes=%7B%22curr%22%3A%22MXN%22%7D; bev=1753497960_EANWE3MzUzMTllMT; everest_cookie=1753497960.EAYzM2ODY2N2VkZGFiMm.yx9cmftPfPZedwwRK5iOApctSG28_pEzhTAZ2bqrJNI; _ccv=cban%3A0_183215%3D1%2C0_200000%3D1%2C0_183345%3D1%2C0_183243%3D1%2C0_183216%3D1%2C0_179751%3D1%2C0_200003%3D1%2C0_200005%3D1%2C0_179754%3D1%2C0_179750%3D1%2C0_179737%3D1%2C0_179744%3D1%2C0_179739%3D1%2C0_179743%3D1%2C0_179749%3D1%2C0_200012%3D1%2C0_200011%3D1%2C0_183217%3D1%2C0_183219%3D1%2C0_183096%3D1%2C0_179747%3D1%2C0_179740%3D1%2C0_179752%3D1%2C0_183241%3D1%2C0_200007%3D1%2C0_183346%3D1%2C0_183095%3D1%2C0_210000%3D1%2C0_210001%3D1%2C0_210002%3D1%2C0_210003%3D1%2C0_210004%3D1%2C0_210010%3D1%2C0_210012%3D1%2C0_210008%3D1%2C0_210016%3D1%2C0_210017%3D1; FPID=FPID2.2.QzHT%2FONUGAVwjOVTuKklKPZ4Z82BRMTXLYrHDwaZhcI%3D.1753497961; FPAU=1.1.123641453.1753497961; cdn_exp_5e67fe4f6858a3639=control; ak_bmsc=83D029883DBF5A70932B84114A365C61~000000000000000000000000000000~YAAQxyfIF+aC41WYAQAABfARWRy+oRCa4C4+agbSOmNk/5M/dRkBrqYCf1hSdAMGGJh8w1TR9Vdx1B/UJV6Ipk5lve0b6uFeCpOTMh0eSip1WZHLFdIgTsQpeh2H/vWlQoHwbrhsZ+ddJy4jS54fNv1NpURs22xOlNKppaxxefipdf7usoO68bsb38K1gWpPNRJv3nn8xHAez14ZnqM2Vlb36N6wCb3hzKlPylVqvs4VKgAOTZe0vPydMhVdmzxQZY1pyvVcSWq7p7PuAL7nu8MScQY/xG4jPJNAb3iMYYSkeqrSVRKev+AzmBTSt/iPiHgF5iLFZK06ve3V8kjB3v7LXPptyynDx1u7cDEUQn3E7tEsrpJx5ormv7ncgRL0; jitney_client_session_id=6e1ea9bc-1378-4162-8960-0882038701af; jitney_client_session_created_at=1753841785.566; frmfctr=wide; tzo=-360; _gcl_au=1.1.1029343634.1753841793; _ga=GA1.1.1824079734.1753841793; FPLC=Rb6THkl3RNBo%2FZ6hX8zBE%2BOHaH9Is52%2B0%2FdKrzC4XnZ6EdtwzhGP21OK9C5LLVe917UV%2F1BbO9GvGD%2FAZ3%2FmVttkM688GYv17r2dKEgmR1DkoGBGEYf73hEUPIvwUA%3D%3D; _scid=94505caa-26b6-480a-69c5-8f6b208c9984; _gtmeec=eyJleHRlcm5hbF9pZCI6IjE3NTM0OTc5NjBfRUFOV0UzTXpVek1UbGxNVCJ9; previousTab=%7B%22id%22%3A%2217c8b86c-fd7e-4ad4-b0db-2e90028c5492%22%7D; _cci=cban%3Aac-80b70637-4d27-4964-99f9-10d6c9df2048; jitney_client_session_updated_at=1753842778.816; FPGSID=1.1753841793.1753842780.G-2P6Q8PGG16.cAMlkTI9sff4y91WoiLpsA; cfrmfctr=MOBILE; cbkp=2; bm_sv=FE0E5C5296C4A6921AC6869E320EA1B2~YAAQsrzAF5vo+laYAQAA1zstWRwsr4QdfLZEkqq5O7TFBqNcRC1RSdJS+RmaN3XsVSjpKAuplFsMRyinxGREsq+PAMXtgUFdPC2PBIOkamEzltYPUg2ijkPssQMnLX8sS0WOcKzLaej8tHSlM5fXhsZoSn20CgwcakaHaIsoZRanEDc7ZVLbnRCGNXsiGsJJ3ElSSj7AHG+jom7P+UfyyfkDkftIouaOZgW9rW+yxzwueerOBfKeuYaqBYqOGtmC~1; _ga_2P6Q8PGG16=GS2.1.s1753841793$o1$g1$t1753842793$j45$l0$h368321115",
  //     "Referer": `https://www.airbnb.mx/s/Mazatl%C3%A1n--Sinaloa/homes?refinement_paths%5B%5D=%2Fhomes&place_id=ChIJwTcYaEFTn4YRsnI88arEpGI&date_picker_type=flexible_dates&flexible_trip_dates%5B%5D=august&flexible_trip_dates%5B%5D=september&flexible_trip_dates%5B%5D=october&flexible_trip_dates%5B%5D=november&flexible_trip_lengths%5B%5D=one_week&adults=2&source=structured_search_input_header&search_type=unknown&query=Mazatl%C3%A1n%2C%20Sinaloa&monthly_start_date=2025-08-01&monthly_length=3&monthly_end_date=2025-11-01&search_mode=regular_search&price_filter_input_type=2&price_filter_num_nights=5&channel=EXPLORE&pagination_search=true&federated_search_session_id=ce9e3611-3544-49fd-ad83-c9e67e711d14&cursor=${selectedCursor}`
  //   },
  //   "body": `{\"operationName\":\"StaysSearch\",\"variables\":{\"staysSearchRequest\":{\"cursor\":\"${selectedCursor}\",\"metadataOnly\":false,\"requestedPageType\":\"STAYS_SEARCH\",\"searchType\":\"unknown\",\"source\":\"structured_search_input_header\",\"treatmentFlags\":[\"feed_map_decouple_m11_treatment\",\"recommended_amenities_2024_treatment_b\",\"filter_redesign_2024_treatment\",\"filter_reordering_2024_roomtype_treatment\",\"p2_category_bar_removal_treatment\",\"selected_filters_2024_treatment\",\"recommended_filters_2024_treatment_b\",\"m13_search_input_phase2_treatment\",\"m13_search_input_services_enabled\"],\"maxMapItems\":9999,\"rawParams\":[{\"filterName\":\"adults\",\"filterValues\":[\"2\"]},{\"filterName\":\"cdnCacheSafe\",\"filterValues\":[\"false\"]},{\"filterName\":\"channel\",\"filterValues\":[\"EXPLORE\"]},{\"filterName\":\"datePickerType\",\"filterValues\":[\"flexible_dates\"]},{\"filterName\":\"federatedSearchSessionId\",\"filterValues\":[\"ce9e3611-3544-49fd-ad83-c9e67e711d14\"]},{\"filterName\":\"flexibleTripDates\",\"filterValues\":[\"august\",\"september\",\"october\",\"november\"]},{\"filterName\":\"flexibleTripLengths\",\"filterValues\":[\"one_week\"]},{\"filterName\":\"itemsPerGrid\",\"filterValues\":[\"18\"]},{\"filterName\":\"monthlyEndDate\",\"filterValues\":[\"2025-11-01\"]},{\"filterName\":\"monthlyLength\",\"filterValues\":[\"3\"]},{\"filterName\":\"monthlyStartDate\",\"filterValues\":[\"2025-08-01\"]},{\"filterName\":\"placeId\",\"filterValues\":[\"ChIJwTcYaEFTn4YRsnI88arEpGI\"]},{\"filterName\":\"priceFilterInputType\",\"filterValues\":[\"2\"]},{\"filterName\":\"priceFilterNumNights\",\"filterValues\":[\"5\"]},{\"filterName\":\"query\",\"filterValues\":[\"Mazatlán, Sinaloa\"]},{\"filterName\":\"refinementPaths\",\"filterValues\":[\"/homes\"]},{\"filterName\":\"screenSize\",\"filterValues\":[\"large\"]},{\"filterName\":\"searchMode\",\"filterValues\":[\"regular_search\"]},{\"filterName\":\"tabId\",\"filterValues\":[\"home_tab\"]},{\"filterName\":\"version\",\"filterValues\":[\"1.8.3\"]}]},\"staysMapSearchRequestV2\":{\"cursor\":\"${selectedCursor}\",\"metadataOnly\":false,\"requestedPageType\":\"STAYS_SEARCH\",\"searchType\":\"unknown\",\"source\":\"structured_search_input_header\",\"treatmentFlags\":[\"feed_map_decouple_m11_treatment\",\"recommended_amenities_2024_treatment_b\",\"filter_redesign_2024_treatment\",\"filter_reordering_2024_roomtype_treatment\",\"p2_category_bar_removal_treatment\",\"selected_filters_2024_treatment\",\"recommended_filters_2024_treatment_b\",\"m13_search_input_phase2_treatment\",\"m13_search_input_services_enabled\"],\"rawParams\":[{\"filterName\":\"adults\",\"filterValues\":[\"2\"]},{\"filterName\":\"cdnCacheSafe\",\"filterValues\":[\"false\"]},{\"filterName\":\"channel\",\"filterValues\":[\"EXPLORE\"]},{\"filterName\":\"datePickerType\",\"filterValues\":[\"flexible_dates\"]},{\"filterName\":\"federatedSearchSessionId\",\"filterValues\":[\"ce9e3611-3544-49fd-ad83-c9e67e711d14\"]},{\"filterName\":\"flexibleTripDates\",\"filterValues\":[\"august\",\"september\",\"october\",\"november\"]},{\"filterName\":\"flexibleTripLengths\",\"filterValues\":[\"one_week\"]},{\"filterName\":\"monthlyEndDate\",\"filterValues\":[\"2025-11-01\"]},{\"filterName\":\"monthlyLength\",\"filterValues\":[\"3\"]},{\"filterName\":\"monthlyStartDate\",\"filterValues\":[\"2025-08-01\"]},{\"filterName\":\"placeId\",\"filterValues\":[\"ChIJwTcYaEFTn4YRsnI88arEpGI\"]},{\"filterName\":\"priceFilterInputType\",\"filterValues\":[\"2\"]},{\"filterName\":\"priceFilterNumNights\",\"filterValues\":[\"5\"]},{\"filterName\":\"query\",\"filterValues\":[\"Mazatlán, Sinaloa\"]},{\"filterName\":\"refinementPaths\",\"filterValues\":[\"/homes\"]},{\"filterName\":\"screenSize\",\"filterValues\":[\"large\"]},{\"filterName\":\"searchMode\",\"filterValues\":[\"regular_search\"]},{\"filterName\":\"tabId\",\"filterValues\":[\"home_tab\"]},{\"filterName\":\"version\",\"filterValues\":[\"1.8.3\"]}]},\"isLeanTreatment\":false,\"skipExtendedSearchParams\":false,\"wishlistTenantIntegrationEnabled\":true},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"f580a5d74bce8912fc96740f8ded51b8cdf084e5058cc38f464f85997b3907d6\"}}}`,
  //   "method": "POST"
  // });

  const res = await fetch("https://www.airbnb.mx/api/v3/StaysSearch/f0b08e64a95f60a1fc57ae264831e932e6bd4f810b92dd20620449c34a59747b?operationName=StaysSearch&locale=es-419&currency=MXN", {
    "headers": {
      "accept": "*/*",
      "accept-language": "es-419,es;q=0.9",
      "content-type": "application/json",
      "ect": "4g",
      "priority": "u=1, i",
      "sec-ch-device-memory": "8",
      "sec-ch-dpr": "2",
      "sec-ch-ua": "\"Chromium\";v=\"139\", \"Not;A=Brand\";v=\"99\"",
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": "\"Android\"",
      "sec-ch-ua-platform-version": "\"6.0\"",
      "sec-ch-viewport-width": "716",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "x-airbnb-api-key": "d306zoyjsyarp7ifhu67rjxn52tv0t20",
      "x-airbnb-client-trace-id": "1u4iluo0wn6zqw18p09nn0a1m2h9",
      "x-airbnb-graphql-platform": "web",
      "x-airbnb-graphql-platform-client": "minimalist-niobe",
      "x-airbnb-network-log-link": "1f5k5sr1e3qhyn0l5uc1r15id8b4",
      "x-airbnb-supports-airlock-v2": "true",
      "x-client-request-id": "18nxk9s0o5nq9q0jzuu6v1i52lvt",
      "x-client-version": "7316e3ab573d63dcaae174ef35e0919905acec1d",
      "x-csrf-token": "",
      "x-csrf-without-token": "1",
      "x-niobe-short-circuited": "true",
      "cookie": "_user_attributes=%7B%22curr%22%3A%22MXN%22%7D; bev=1753935508_EAYzJkZDhmNWI0NG; everest_cookie=1753935508.EAZDAxOWE1ZTE3ZTFjYz.jzjp31VX9B5BM8l8n8Z1wWuu4BdTPTS1nlGQLjerskw; cdn_exp_5e67fe4f6858a3639=treatment; _ccv=cban%3A0_183215%3D1%2C0_200000%3D1%2C0_183345%3D1%2C0_183243%3D1%2C0_183216%3D1%2C0_179751%3D1%2C0_200003%3D1%2C0_200005%3D1%2C0_179754%3D1%2C0_179750%3D1%2C0_179737%3D1%2C0_179744%3D1%2C0_179739%3D1%2C0_179743%3D1%2C0_179749%3D1%2C0_200012%3D1%2C0_200011%3D1%2C0_183217%3D1%2C0_183219%3D1%2C0_183096%3D1%2C0_179747%3D1%2C0_179740%3D1%2C0_179752%3D1%2C0_183241%3D1%2C0_200007%3D1%2C0_183346%3D1%2C0_183095%3D1%2C0_210000%3D1%2C0_210001%3D1%2C0_210002%3D1%2C0_210003%3D1%2C0_210004%3D1%2C0_210010%3D1%2C0_210012%3D1%2C0_210008%3D1%2C0_210016%3D1%2C0_210017%3D1; FPID=FPID2.2.QKmL9rTEoYJqgJkblhxSIOoKLnMde8OZIq%2F%2Bt6OSavk%3D.1753935510; FPAU=1.1.59524152.1753935510; tzo=-360; _gcl_au=1.1.114564323.1753935571; _ga=GA1.1.439162200.1753935572; _scid=3eb31e70-f087-4091-779e-12fcc6d1b67e; _cci=cban%3Aac-eee5f6ac-517d-4b17-803e-fb5b51672c43; previousTab=%7B%22id%22%3A%224c122c16-3bff-4be3-a9aa-0faba41b9850%22%7D; jitney_client_session_id=65c1b052-70b8-477f-861f-d3844d9dd276; jitney_client_session_created_at=1757046337.347; FPLC=O6semuDid2o%2F5f9WCuOhvOE01NrzpaKvZ5OrpAA7qu5KD9UbCuM%2FUXt0PwC85Sk9ZnKkdmDtsXXEe1wiukuTTN2cC26zdQVYwKxnzdKRcJM5dq8i0XQF4V4nVgraBA%3D%3D; cfrmfctr=MOBILE; cbkp=1; frmfctr=compact; ak_bmsc=8F3C105441DC81E3FF4271C4F784717B~000000000000000000000000000000~YAAQxifIF8NQ7/CYAQAA8NYgGB2cr2S3eeGZ5KZbdikUHOzK8RoQrmZ/2FHXgZFb9u/axI59VXnqE24nod1Qn1NVqjtmZsZHuu/KI7tFjtNttbmMzjgTP/MUh0VpU6AmU78w82XtlX82H9rxlzMYEUn4x4yAz5KmnEkCdsldKFVXrQei3weO7Lwltip9f4nqUVUVHH2vB8j1ybaVoFPi6j/gIW2WSb+gvCC0jNbu/gTVXx1UaQxviSMabTTILnpgOh4ClsC2fsgMdXTjPEhIiyAEIGuuBjF/sydq9d5mXRVRId9/NVLbhS1TeSZt45eoBj9E/2Jazl6sM+wiS2S/GmwJ+gDhJ/vNDe0waLo4TjBiCZ/7vmsp8dkmojWDs5wO85GyPPU/OJdHyRFoMIse0Xk3; FPGSID=1.1757046341.1757046566.G-2P6Q8PGG16.z4wKLVQEvtiFw9FsiCiQfA; jitney_client_session_updated_at=1757046886.543; bm_sv=EE5D0865FE47780365A380E1464D5CB1~YAAQxCfIFxDPWRWZAQAAJ9wnGB0djgkCUWlZUuEIZXGiB+O95+y3cnN3607xkx3Cfw8ykOz8GIOrf4uaB+DSeKTohwXIudBej13oxcDEGsTN/vKCkvAd5eAM2jNi7KXLEk+QFKtRH8HAwhp6GPNmM++vfRtuvLLhGWT1ZAc6GLj8Yo/1TDD01k3/1DjxBz1II04eds9fUaABMdlo+nzYi3eNmmdEo+MlPn7tXWrVITURxM7a1/2TRg4yDjqqoaGF~1; _ga_2P6Q8PGG16=GS2.1.s1757046340$o9$g1$t1757046889$j60$l0$h1411304686",
      "Referer": `https://www.airbnb.mx/s/Mazatl%C3%A1n--Sin./homes?refinement_paths%5B%5D=%2Fhomes&date_picker_type=flexible_dates&flexible_trip_dates%5B%5D=september&flexible_trip_dates%5B%5D=october&flexible_trip_dates%5B%5D=november&place_id=ChIJwTcYaEFTn4YRsnI88arEpGI&acp_id=27420724-758c-42a1-9aa6-da8fe5262924&flexible_trip_lengths%5B%5D=one_week&adults=2&source=structured_search_input_header&search_type=autocomplete_click&query=Mazatl%C3%A1n%2C%20Sin.&monthly_start_date=2025-10-01&monthly_length=3&monthly_end_date=2026-01-01&search_mode=regular_search&price_filter_input_type=2&price_filter_num_nights=5&channel=EXPLORE&federated_search_session_id=523d0e28-a646-4716-b169-234ed67116df&cursor=${selectedCursor}`
    },
    "body": `{\"operationName\":\"StaysSearch\",\"variables\":{\"staysSearchRequest\":{\"cursor\":\"${selectedCursor}\",\"metadataOnly\":false,\"requestedPageType\":\"STAYS_SEARCH\",\"searchType\":\"autocomplete_click\",\"source\":\"structured_search_input_header\",\"treatmentFlags\":[\"feed_map_decouple_m11_treatment\",\"recommended_amenities_2024_treatment_b\",\"filter_redesign_2024_treatment\",\"filter_reordering_2024_roomtype_treatment\",\"p2_category_bar_removal_treatment\",\"selected_filters_2024_treatment\",\"recommended_filters_2024_treatment_b\",\"m13_search_input_phase2_treatment\",\"m13_search_input_services_enabled\"],\"maxMapItems\":9999,\"rawParams\":[{\"filterName\":\"acpId\",\"filterValues\":[\"27420724-758c-42a1-9aa6-da8fe5262924\"]},{\"filterName\":\"adults\",\"filterValues\":[\"2\"]},{\"filterName\":\"cdnCacheSafe\",\"filterValues\":[\"false\"]},{\"filterName\":\"channel\",\"filterValues\":[\"EXPLORE\"]},{\"filterName\":\"datePickerType\",\"filterValues\":[\"flexible_dates\"]},{\"filterName\":\"federatedSearchSessionId\",\"filterValues\":[\"523d0e28-a646-4716-b169-234ed67116df\"]},{\"filterName\":\"flexibleTripDates\",\"filterValues\":[\"september\",\"october\",\"november\"]},{\"filterName\":\"flexibleTripLengths\",\"filterValues\":[\"one_week\"]},{\"filterName\":\"itemsPerGrid\",\"filterValues\":[\"18\"]},{\"filterName\":\"monthlyEndDate\",\"filterValues\":[\"2026-01-01\"]},{\"filterName\":\"monthlyLength\",\"filterValues\":[\"3\"]},{\"filterName\":\"monthlyStartDate\",\"filterValues\":[\"2025-10-01\"]},{\"filterName\":\"placeId\",\"filterValues\":[\"ChIJwTcYaEFTn4YRsnI88arEpGI\"]},{\"filterName\":\"priceFilterInputType\",\"filterValues\":[\"2\"]},{\"filterName\":\"priceFilterNumNights\",\"filterValues\":[\"5\"]},{\"filterName\":\"query\",\"filterValues\":[\"Mazatlán, Sin.\"]},{\"filterName\":\"refinementPaths\",\"filterValues\":[\"/homes\"]},{\"filterName\":\"screenSize\",\"filterValues\":[\"small\"]},{\"filterName\":\"searchMode\",\"filterValues\":[\"regular_search\"]},{\"filterName\":\"tabId\",\"filterValues\":[\"home_tab\"]},{\"filterName\":\"version\",\"filterValues\":[\"1.8.3\"]}]},\"staysMapSearchRequestV2\":{\"cursor\":\"${selectedCursor}\",\"metadataOnly\":false,\"requestedPageType\":\"STAYS_SEARCH\",\"searchType\":\"autocomplete_click\",\"source\":\"structured_search_input_header\",\"treatmentFlags\":[\"feed_map_decouple_m11_treatment\",\"recommended_amenities_2024_treatment_b\",\"filter_redesign_2024_treatment\",\"filter_reordering_2024_roomtype_treatment\",\"p2_category_bar_removal_treatment\",\"selected_filters_2024_treatment\",\"recommended_filters_2024_treatment_b\",\"m13_search_input_phase2_treatment\",\"m13_search_input_services_enabled\"],\"rawParams\":[{\"filterName\":\"acpId\",\"filterValues\":[\"27420724-758c-42a1-9aa6-da8fe5262924\"]},{\"filterName\":\"adults\",\"filterValues\":[\"2\"]},{\"filterName\":\"cdnCacheSafe\",\"filterValues\":[\"false\"]},{\"filterName\":\"channel\",\"filterValues\":[\"EXPLORE\"]},{\"filterName\":\"datePickerType\",\"filterValues\":[\"flexible_dates\"]},{\"filterName\":\"federatedSearchSessionId\",\"filterValues\":[\"523d0e28-a646-4716-b169-234ed67116df\"]},{\"filterName\":\"flexibleTripDates\",\"filterValues\":[\"september\",\"october\",\"november\"]},{\"filterName\":\"flexibleTripLengths\",\"filterValues\":[\"one_week\"]},{\"filterName\":\"monthlyEndDate\",\"filterValues\":[\"2026-01-01\"]},{\"filterName\":\"monthlyLength\",\"filterValues\":[\"3\"]},{\"filterName\":\"monthlyStartDate\",\"filterValues\":[\"2025-10-01\"]},{\"filterName\":\"placeId\",\"filterValues\":[\"ChIJwTcYaEFTn4YRsnI88arEpGI\"]},{\"filterName\":\"priceFilterInputType\",\"filterValues\":[\"2\"]},{\"filterName\":\"priceFilterNumNights\",\"filterValues\":[\"5\"]},{\"filterName\":\"query\",\"filterValues\":[\"Mazatlán, Sin.\"]},{\"filterName\":\"refinementPaths\",\"filterValues\":[\"/homes\"]},{\"filterName\":\"screenSize\",\"filterValues\":[\"small\"]},{\"filterName\":\"searchMode\",\"filterValues\":[\"regular_search\"]},{\"filterName\":\"tabId\",\"filterValues\":[\"home_tab\"]},{\"filterName\":\"version\",\"filterValues\":[\"1.8.3\"]}]},\"isLeanTreatment\":false,\"aiSearchEnabled\":false,\"skipExtendedSearchParams\":false},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"f0b08e64a95f60a1fc57ae264831e932e6bd4f810b92dd20620449c34a59747b\"}}}`,
    "method": "POST"
  });

  console.log(res.status, res.statusText);


  const data = await res.json();
  const publicaciones = data.data.presentation.staysSearch.results.searchResults;

  const pagina = [];
  const decodedIdsArray = [];

  for (const key in publicaciones) {
    if (Object.prototype.hasOwnProperty.call(publicaciones, key)) {
      const nombrePublicacion = publicaciones[key].demandStayListing.description.name.localizedStringWithTranslationPreference
      const encodedId = publicaciones[key].demandStayListing.id
      const decodedId = atob(encodedId).replace("DemandStayListing:", "")
      decodedIdsArray.push(decodedId)
      console.log(key + " -> " + nombrePublicacion + " --> " + decodedId) //Esto era un pagina.push
      pagina.push({ nombrePublicacion, decodedId })
    }
  }




  for (let i = 0; i < pagina.length; i++) {
    for (let j = 0; j < ids.length; j++) {
      if (decodedIdsArray[i] == ids[j]) {
        console.log(`Ha coincidido: ${decodedIdsArray[i]} en la posición ${i}`);
      }
    }
  }


  const JSONToFile = (obj, filename) =>
    writeFileSync(`${filename}.json`, JSON.stringify(obj, null, 2));

  JSONToFile(data, './response');


  return pagina
}

export { cursorGen, fetchado }