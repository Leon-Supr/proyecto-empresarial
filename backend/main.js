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
  const selectedCursor = inputCursor

  // const res = await fetch("https://www.airbnb.mx/api/v3/StaysSearch/f0b08e64a95f60a1fc57ae264831e932e6bd4f810b92dd20620449c34a59747b?operationName=StaysSearch&locale=es-419&currency=MXN", {
  //   "headers": {
  //     "accept": "*/*",
  //     "accept-language": "es-419,es;q=0.9",
  //     "content-type": "application/json",
  //     "ect": "4g",
  //     "priority": "u=1, i",
  //     "sec-ch-device-memory": "8",
  //     "sec-ch-dpr": "2",
  //     "sec-ch-ua": "\"Chromium\";v=\"139\", \"Not;A=Brand\";v=\"99\"",
  //     "sec-ch-ua-mobile": "?1",
  //     "sec-ch-ua-platform": "\"Android\"",
  //     "sec-ch-ua-platform-version": "\"6.0\"",
  //     "sec-ch-viewport-width": "716",
  //     "sec-fetch-dest": "empty",
  //     "sec-fetch-mode": "cors",
  //     "sec-fetch-site": "same-origin",
  //     "x-airbnb-api-key": "d306zoyjsyarp7ifhu67rjxn52tv0t20",
  //     "x-airbnb-client-trace-id": "1u4iluo0wn6zqw18p09nn0a1m2h9",
  //     "x-airbnb-graphql-platform": "web",
  //     "x-airbnb-graphql-platform-client": "minimalist-niobe",
  //     "x-airbnb-network-log-link": "1f5k5sr1e3qhyn0l5uc1r15id8b4",
  //     "x-airbnb-supports-airlock-v2": "true",
  //     "x-client-request-id": "18nxk9s0o5nq9q0jzuu6v1i52lvt",
  //     "x-client-version": "7316e3ab573d63dcaae174ef35e0919905acec1d",
  //     "x-csrf-token": "",
  //     "x-csrf-without-token": "1",
  //     "x-niobe-short-circuited": "true",
  //     "cookie": "_user_attributes=%7B%22curr%22%3A%22MXN%22%7D; bev=1753935508_EAYzJkZDhmNWI0NG; everest_cookie=1753935508.EAZDAxOWE1ZTE3ZTFjYz.jzjp31VX9B5BM8l8n8Z1wWuu4BdTPTS1nlGQLjerskw; cdn_exp_5e67fe4f6858a3639=treatment; _ccv=cban%3A0_183215%3D1%2C0_200000%3D1%2C0_183345%3D1%2C0_183243%3D1%2C0_183216%3D1%2C0_179751%3D1%2C0_200003%3D1%2C0_200005%3D1%2C0_179754%3D1%2C0_179750%3D1%2C0_179737%3D1%2C0_179744%3D1%2C0_179739%3D1%2C0_179743%3D1%2C0_179749%3D1%2C0_200012%3D1%2C0_200011%3D1%2C0_183217%3D1%2C0_183219%3D1%2C0_183096%3D1%2C0_179747%3D1%2C0_179740%3D1%2C0_179752%3D1%2C0_183241%3D1%2C0_200007%3D1%2C0_183346%3D1%2C0_183095%3D1%2C0_210000%3D1%2C0_210001%3D1%2C0_210002%3D1%2C0_210003%3D1%2C0_210004%3D1%2C0_210010%3D1%2C0_210012%3D1%2C0_210008%3D1%2C0_210016%3D1%2C0_210017%3D1; FPID=FPID2.2.QKmL9rTEoYJqgJkblhxSIOoKLnMde8OZIq%2F%2Bt6OSavk%3D.1753935510; FPAU=1.1.59524152.1753935510; tzo=-360; _gcl_au=1.1.114564323.1753935571; _ga=GA1.1.439162200.1753935572; _scid=3eb31e70-f087-4091-779e-12fcc6d1b67e; _cci=cban%3Aac-eee5f6ac-517d-4b17-803e-fb5b51672c43; previousTab=%7B%22id%22%3A%224c122c16-3bff-4be3-a9aa-0faba41b9850%22%7D; jitney_client_session_id=65c1b052-70b8-477f-861f-d3844d9dd276; jitney_client_session_created_at=1757046337.347; FPLC=O6semuDid2o%2F5f9WCuOhvOE01NrzpaKvZ5OrpAA7qu5KD9UbCuM%2FUXt0PwC85Sk9ZnKkdmDtsXXEe1wiukuTTN2cC26zdQVYwKxnzdKRcJM5dq8i0XQF4V4nVgraBA%3D%3D; cfrmfctr=MOBILE; cbkp=1; frmfctr=compact; ak_bmsc=8F3C105441DC81E3FF4271C4F784717B~000000000000000000000000000000~YAAQxifIF8NQ7/CYAQAA8NYgGB2cr2S3eeGZ5KZbdikUHOzK8RoQrmZ/2FHXgZFb9u/axI59VXnqE24nod1Qn1NVqjtmZsZHuu/KI7tFjtNttbmMzjgTP/MUh0VpU6AmU78w82XtlX82H9rxlzMYEUn4x4yAz5KmnEkCdsldKFVXrQei3weO7Lwltip9f4nqUVUVHH2vB8j1ybaVoFPi6j/gIW2WSb+gvCC0jNbu/gTVXx1UaQxviSMabTTILnpgOh4ClsC2fsgMdXTjPEhIiyAEIGuuBjF/sydq9d5mXRVRId9/NVLbhS1TeSZt45eoBj9E/2Jazl6sM+wiS2S/GmwJ+gDhJ/vNDe0waLo4TjBiCZ/7vmsp8dkmojWDs5wO85GyPPU/OJdHyRFoMIse0Xk3; FPGSID=1.1757046341.1757046566.G-2P6Q8PGG16.z4wKLVQEvtiFw9FsiCiQfA; jitney_client_session_updated_at=1757046886.543; bm_sv=EE5D0865FE47780365A380E1464D5CB1~YAAQxCfIFxDPWRWZAQAAJ9wnGB0djgkCUWlZUuEIZXGiB+O95+y3cnN3607xkx3Cfw8ykOz8GIOrf4uaB+DSeKTohwXIudBej13oxcDEGsTN/vKCkvAd5eAM2jNi7KXLEk+QFKtRH8HAwhp6GPNmM++vfRtuvLLhGWT1ZAc6GLj8Yo/1TDD01k3/1DjxBz1II04eds9fUaABMdlo+nzYi3eNmmdEo+MlPn7tXWrVITURxM7a1/2TRg4yDjqqoaGF~1; _ga_2P6Q8PGG16=GS2.1.s1757046340$o9$g1$t1757046889$j60$l0$h1411304686",
  //     "Referer": `https://www.airbnb.mx/s/Mazatl%C3%A1n--Sin./homes?refinement_paths%5B%5D=%2Fhomes&date_picker_type=flexible_dates&flexible_trip_dates%5B%5D=september&flexible_trip_dates%5B%5D=october&flexible_trip_dates%5B%5D=november&place_id=ChIJwTcYaEFTn4YRsnI88arEpGI&acp_id=27420724-758c-42a1-9aa6-da8fe5262924&flexible_trip_lengths%5B%5D=one_week&adults=2&source=structured_search_input_header&search_type=autocomplete_click&query=Mazatl%C3%A1n%2C%20Sin.&monthly_start_date=2025-10-01&monthly_length=3&monthly_end_date=2026-01-01&search_mode=regular_search&price_filter_input_type=2&price_filter_num_nights=5&channel=EXPLORE&federated_search_session_id=523d0e28-a646-4716-b169-234ed67116df&cursor=${selectedCursor}`
  //   },
  //   "body": `{\"operationName\":\"StaysSearch\",\"variables\":{\"staysSearchRequest\":{\"cursor\":\"${selectedCursor}\",\"metadataOnly\":false,\"requestedPageType\":\"STAYS_SEARCH\",\"searchType\":\"autocomplete_click\",\"source\":\"structured_search_input_header\",\"treatmentFlags\":[\"feed_map_decouple_m11_treatment\",\"recommended_amenities_2024_treatment_b\",\"filter_redesign_2024_treatment\",\"filter_reordering_2024_roomtype_treatment\",\"p2_category_bar_removal_treatment\",\"selected_filters_2024_treatment\",\"recommended_filters_2024_treatment_b\",\"m13_search_input_phase2_treatment\",\"m13_search_input_services_enabled\"],\"maxMapItems\":9999,\"rawParams\":[{\"filterName\":\"acpId\",\"filterValues\":[\"27420724-758c-42a1-9aa6-da8fe5262924\"]},{\"filterName\":\"adults\",\"filterValues\":[\"2\"]},{\"filterName\":\"cdnCacheSafe\",\"filterValues\":[\"false\"]},{\"filterName\":\"channel\",\"filterValues\":[\"EXPLORE\"]},{\"filterName\":\"datePickerType\",\"filterValues\":[\"flexible_dates\"]},{\"filterName\":\"federatedSearchSessionId\",\"filterValues\":[\"523d0e28-a646-4716-b169-234ed67116df\"]},{\"filterName\":\"flexibleTripDates\",\"filterValues\":[\"september\",\"october\",\"november\"]},{\"filterName\":\"flexibleTripLengths\",\"filterValues\":[\"one_week\"]},{\"filterName\":\"itemsPerGrid\",\"filterValues\":[\"18\"]},{\"filterName\":\"monthlyEndDate\",\"filterValues\":[\"2026-01-01\"]},{\"filterName\":\"monthlyLength\",\"filterValues\":[\"3\"]},{\"filterName\":\"monthlyStartDate\",\"filterValues\":[\"2025-10-01\"]},{\"filterName\":\"placeId\",\"filterValues\":[\"ChIJwTcYaEFTn4YRsnI88arEpGI\"]},{\"filterName\":\"priceFilterInputType\",\"filterValues\":[\"2\"]},{\"filterName\":\"priceFilterNumNights\",\"filterValues\":[\"5\"]},{\"filterName\":\"query\",\"filterValues\":[\"Mazatlán, Sin.\"]},{\"filterName\":\"refinementPaths\",\"filterValues\":[\"/homes\"]},{\"filterName\":\"screenSize\",\"filterValues\":[\"small\"]},{\"filterName\":\"searchMode\",\"filterValues\":[\"regular_search\"]},{\"filterName\":\"tabId\",\"filterValues\":[\"home_tab\"]},{\"filterName\":\"version\",\"filterValues\":[\"1.8.3\"]}]},\"staysMapSearchRequestV2\":{\"cursor\":\"${selectedCursor}\",\"metadataOnly\":false,\"requestedPageType\":\"STAYS_SEARCH\",\"searchType\":\"autocomplete_click\",\"source\":\"structured_search_input_header\",\"treatmentFlags\":[\"feed_map_decouple_m11_treatment\",\"recommended_amenities_2024_treatment_b\",\"filter_redesign_2024_treatment\",\"filter_reordering_2024_roomtype_treatment\",\"p2_category_bar_removal_treatment\",\"selected_filters_2024_treatment\",\"recommended_filters_2024_treatment_b\",\"m13_search_input_phase2_treatment\",\"m13_search_input_services_enabled\"],\"rawParams\":[{\"filterName\":\"acpId\",\"filterValues\":[\"27420724-758c-42a1-9aa6-da8fe5262924\"]},{\"filterName\":\"adults\",\"filterValues\":[\"2\"]},{\"filterName\":\"cdnCacheSafe\",\"filterValues\":[\"false\"]},{\"filterName\":\"channel\",\"filterValues\":[\"EXPLORE\"]},{\"filterName\":\"datePickerType\",\"filterValues\":[\"flexible_dates\"]},{\"filterName\":\"federatedSearchSessionId\",\"filterValues\":[\"523d0e28-a646-4716-b169-234ed67116df\"]},{\"filterName\":\"flexibleTripDates\",\"filterValues\":[\"september\",\"october\",\"november\"]},{\"filterName\":\"flexibleTripLengths\",\"filterValues\":[\"one_week\"]},{\"filterName\":\"monthlyEndDate\",\"filterValues\":[\"2026-01-01\"]},{\"filterName\":\"monthlyLength\",\"filterValues\":[\"3\"]},{\"filterName\":\"monthlyStartDate\",\"filterValues\":[\"2025-10-01\"]},{\"filterName\":\"placeId\",\"filterValues\":[\"ChIJwTcYaEFTn4YRsnI88arEpGI\"]},{\"filterName\":\"priceFilterInputType\",\"filterValues\":[\"2\"]},{\"filterName\":\"priceFilterNumNights\",\"filterValues\":[\"5\"]},{\"filterName\":\"query\",\"filterValues\":[\"Mazatlán, Sin.\"]},{\"filterName\":\"refinementPaths\",\"filterValues\":[\"/homes\"]},{\"filterName\":\"screenSize\",\"filterValues\":[\"small\"]},{\"filterName\":\"searchMode\",\"filterValues\":[\"regular_search\"]},{\"filterName\":\"tabId\",\"filterValues\":[\"home_tab\"]},{\"filterName\":\"version\",\"filterValues\":[\"1.8.3\"]}]},\"isLeanTreatment\":false,\"aiSearchEnabled\":false,\"skipExtendedSearchParams\":false},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"f0b08e64a95f60a1fc57ae264831e932e6bd4f810b92dd20620449c34a59747b\"}}}`,
  //   "method": "POST"
  // });

  const res = await fetch("https://www.airbnb.mx/api/v3/StaysSearch/7f99ffbcba205a71d75e20e168f214cccec329b62e48d65f4d3b7f691d96c54c?operationName=StaysSearch&locale=es-419&currency=MXN", {
    "headers": {
      "accept": "*/*",
      "accept-language": "es-419,es;q=0.9",
      "content-type": "application/json",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Brave\";v=\"141\", \"Not?A_Brand\";v=\"8\", \"Chromium\";v=\"141\"",
      "sec-ch-ua-mobile": "?1",
      "sec-ch-ua-platform": "\"Android\"",
      "sec-ch-ua-platform-version": "\"6.0\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "x-airbnb-api-key": "d306zoyjsyarp7ifhu67rjxn52tv0t20",
      "x-airbnb-client-trace-id": "0nnmm5l0z2h7hb11la0jf0hemdsj",
      "x-airbnb-graphql-platform": "web",
      "x-airbnb-graphql-platform-client": "minimalist-niobe",
      "x-airbnb-network-log-link": "0tk55vz0ireia30n0ku8w0rtv0n6",
      "x-airbnb-supports-airlock-v2": "true",
      "x-client-request-id": "0a024aq1g7sk421nfpuo41griivy",
      "x-client-version": "6ec9218c1f5d945e33c1b94ac3f4a49d1da5c058",
      "x-csrf-token": "",
      "x-csrf-without-token": "1",
      "x-niobe-short-circuited": "true",
      "cookie": "_user_attributes=%7B%22curr%22%3A%22MXN%22%7D; bev=1759806082_EAZjlkZjQ0MzkxZD; everest_cookie=1759806082.EANTBkNjIyN2U1M2FkNj.h-5uvgmCX6Z4eIlEPgSzGYy_Ws-KvJ3o7Dy2q2tyMCc; cdn_exp_12abc5c2c444da7a4=treatment; cdn_exp_d652210e07870cfc3=control; previousTab=%7B%22id%22%3A%2238675d9f-e1c0-4d7c-b60a-3c1a153aa203%22%7D; jitney_client_session_id=8a2a0757-9b9c-4e6f-9d65-2f25b43c6390; jitney_client_session_created_at=1759806083.718; _cci=cban%3Aac-c083dec5-6442-4fe9-8ed0-c031f7b85516; _ccv=cban%3A0_183215%3D1%2C0_200000%3D1%2C0_183345%3D1%2C0_183243%3D1%2C0_183216%3D1%2C0_179751%3D1%2C0_200003%3D1%2C0_200005%3D1%2C0_183219%3D1%2C0_179747%3D1%2C0_183241%3D1%2C0_200007%3D1%2C0_210000%3D1%2C0_210001%3D1%2C0_210002%3D1%2C0_210003%3D1%2C0_210004%3D1%2C0_210010%3D1%2C0_210012%3D1%2C0_210008%3D1%2C0_210017%3D1%2C0_179754%3D0%2C0_179750%3D0%2C0_179737%3D0%2C0_179744%3D0%2C0_179739%3D0%2C0_179743%3D0%2C0_179749%3D0%2C0_200012%3D0%2C0_200011%3D0%2C0_183217%3D0%2C0_183096%3D0%2C0_179740%3D0%2C0_179752%3D0%2C0_183346%3D0%2C0_183095%3D0%2C0_210016%3D0%2C0_210018%3D0%2C0_210020%3D0%2C0_210021%3D0; cfrmfctr=DESKTOP; cbkp=4; jitney_client_session_updated_at=1759806108.663; frmfctr=compact; ak_bmsc=34E12FFA8EB26D99F18CB5B81B303E1F~000000000000000000000000000000~YAAQLcLJF0V6xX+ZAQAAgz+evB27oJxxVAHqK5O83XWs9Kdry2Lr2KCAnlkspL2uhg6J9ibnPiwBgfGobKzdCQc+yLgXkUekCTjVMtvqBxn43LL2bolae+EN29fj/+82HBBpQmpO3hrW1sqWO6T6zPWs/enh9lXgOSSCZEt0UkvQbTMCknyHg8EVg6VNep53l7lsMRdInI5eIZS4ww0sd17qFzg/w40Q35ZeUzg6HIdiFGTvtxaTobW2Bh02d16LBPAv/iYGfhkjWFTf297pl2Y2CH/qjfT1swToarnTZ8EGksuZTi1ew0ADoZZmFaCBT+Va+ozlM2FtuCav3/AdwJwxC7oL10gL4AhNf/o0I/fkxwu8UbeaknKxrEYeMEE2UWeUjwzGvpcDIQAfSX487CfDv6c=; tzo=-360; bm_sv=6DBD2224DD8424EC87DEF959E069C5A9~YAAQLcLJF316xX+ZAQAAuleevB1BzZz8lSl344M/Cbxx3RmgaBc6vPD9E8Ec62PSRJAx7Tat5kS+hsZClb3Kc+/0euvi1aFVJNaJeMV/fuuI3AHLFoRp5yKg7TSGXNEyo9oaL77dznrpQjPujIt5Xdurw+Y9GVI17HyLtQohUo46KNH/7xquLtG0YKIHoUPZsk1qmNACFkdSn6jp/Hd3l3GatU66tRJGS+qBVmZ/UvBlIWJTtpVVpMSverT6Vi+O~1",
      "Referer": `https://www.airbnb.mx/s/Mazatl%C3%A1n--Sinaloa/homes?refinement_paths%5B%5D=%2Fhomes&place_id=ChIJwTcYaEFTn4YRsnI88arEpGI&date_picker_type=flexible_dates&flexible_trip_dates%5B%5D=october&flexible_trip_dates%5B%5D=november&flexible_trip_dates%5B%5D=december&adults=2&source=structured_search_input_header&search_type=AUTOSUGGEST&query=Mazatl%C3%A1n%2C%20Sinaloa&flexible_trip_lengths%5B%5D=one_week&monthly_start_date=2025-11-01&monthly_length=3&monthly_end_date=2026-02-01&search_mode=regular_search&price_filter_input_type=2&channel=EXPLORE&federated_search_session_id=11c1df8f-2795-4cd2-8f96-df2977bc3783&pagination_search=true&cursor=${selectedCursor}%3D`
    },
    "body": `{\"operationName\":\"StaysSearch\",\"variables\":{\"staysSearchRequest\":{\"cursor\":\"${selectedCursor}=\",\"metadataOnly\":false,\"requestedPageType\":\"STAYS_SEARCH\",\"searchType\":\"AUTOSUGGEST\",\"source\":\"structured_search_input_header\",\"treatmentFlags\":[\"feed_map_decouple_m11_treatment\",\"recommended_amenities_2024_treatment_b\",\"filter_redesign_2024_treatment\",\"filter_reordering_2024_roomtype_treatment\",\"p2_category_bar_removal_treatment\",\"selected_filters_2024_treatment\",\"recommended_filters_2024_treatment_b\",\"m13_search_input_phase2_treatment\",\"m13_search_input_services_enabled\"],\"maxMapItems\":9999,\"rawParams\":[{\"filterName\":\"adults\",\"filterValues\":[\"2\"]},{\"filterName\":\"cdnCacheSafe\",\"filterValues\":[\"false\"]},{\"filterName\":\"channel\",\"filterValues\":[\"EXPLORE\"]},{\"filterName\":\"datePickerType\",\"filterValues\":[\"flexible_dates\"]},{\"filterName\":\"federatedSearchSessionId\",\"filterValues\":[\"11c1df8f-2795-4cd2-8f96-df2977bc3783\"]},{\"filterName\":\"flexibleTripDates\",\"filterValues\":[\"october\",\"november\",\"december\"]},{\"filterName\":\"flexibleTripLengths\",\"filterValues\":[\"one_week\"]},{\"filterName\":\"itemsPerGrid\",\"filterValues\":[\"18\"]},{\"filterName\":\"monthlyEndDate\",\"filterValues\":[\"2026-02-01\"]},{\"filterName\":\"monthlyLength\",\"filterValues\":[\"3\"]},{\"filterName\":\"monthlyStartDate\",\"filterValues\":[\"2025-11-01\"]},{\"filterName\":\"placeId\",\"filterValues\":[\"ChIJwTcYaEFTn4YRsnI88arEpGI\"]},{\"filterName\":\"priceFilterInputType\",\"filterValues\":[\"2\"]},{\"filterName\":\"query\",\"filterValues\":[\"Mazatlán, Sinaloa\"]},{\"filterName\":\"refinementPaths\",\"filterValues\":[\"/homes\"]},{\"filterName\":\"screenSize\",\"filterValues\":[\"small\"]},{\"filterName\":\"searchMode\",\"filterValues\":[\"regular_search\"]},{\"filterName\":\"tabId\",\"filterValues\":[\"home_tab\"]},{\"filterName\":\"version\",\"filterValues\":[\"1.8.3\"]}]},\"staysMapSearchRequestV2\":{\"cursor\":\"${selectedCursor}=\",\"metadataOnly\":false,\"requestedPageType\":\"STAYS_SEARCH\",\"searchType\":\"AUTOSUGGEST\",\"source\":\"structured_search_input_header\",\"treatmentFlags\":[\"feed_map_decouple_m11_treatment\",\"recommended_amenities_2024_treatment_b\",\"filter_redesign_2024_treatment\",\"filter_reordering_2024_roomtype_treatment\",\"p2_category_bar_removal_treatment\",\"selected_filters_2024_treatment\",\"recommended_filters_2024_treatment_b\",\"m13_search_input_phase2_treatment\",\"m13_search_input_services_enabled\"],\"rawParams\":[{\"filterName\":\"adults\",\"filterValues\":[\"2\"]},{\"filterName\":\"cdnCacheSafe\",\"filterValues\":[\"false\"]},{\"filterName\":\"channel\",\"filterValues\":[\"EXPLORE\"]},{\"filterName\":\"datePickerType\",\"filterValues\":[\"flexible_dates\"]},{\"filterName\":\"federatedSearchSessionId\",\"filterValues\":[\"11c1df8f-2795-4cd2-8f96-df2977bc3783\"]},{\"filterName\":\"flexibleTripDates\",\"filterValues\":[\"october\",\"november\",\"december\"]},{\"filterName\":\"flexibleTripLengths\",\"filterValues\":[\"one_week\"]},{\"filterName\":\"monthlyEndDate\",\"filterValues\":[\"2026-02-01\"]},{\"filterName\":\"monthlyLength\",\"filterValues\":[\"3\"]},{\"filterName\":\"monthlyStartDate\",\"filterValues\":[\"2025-11-01\"]},{\"filterName\":\"placeId\",\"filterValues\":[\"ChIJwTcYaEFTn4YRsnI88arEpGI\"]},{\"filterName\":\"priceFilterInputType\",\"filterValues\":[\"2\"]},{\"filterName\":\"query\",\"filterValues\":[\"Mazatlán, Sinaloa\"]},{\"filterName\":\"refinementPaths\",\"filterValues\":[\"/homes\"]},{\"filterName\":\"screenSize\",\"filterValues\":[\"small\"]},{\"filterName\":\"searchMode\",\"filterValues\":[\"regular_search\"]},{\"filterName\":\"tabId\",\"filterValues\":[\"home_tab\"]},{\"filterName\":\"version\",\"filterValues\":[\"1.8.3\"]}]},\"isLeanTreatment\":false,\"aiSearchEnabled\":false,\"skipExtendedSearchParams\":false},\"extensions\":{\"persistedQuery\":{\"version\":1,\"sha256Hash\":\"7f99ffbcba205a71d75e20e168f214cccec329b62e48d65f4d3b7f691d96c54c\"}}}`,
    "method": "POST"
  });

  console.log(res.status, res.statusText);


  const data = await res.json();
  const publicaciones = data.data.presentation.staysSearch.results.searchResults;

  // Price: publicaciones[key].structuredDisplayPrice.primaryLine.originalPrice // discountedPrice
  // Si solo tiene un precio aparece como ...primaryLine.price
  // Formato string = "$4,131 MXN"

  // const price = 0;
  // const priceRoute = publicaciones[key].structuredDisplayPrice.primaryLine;
  // if (priceRoute.discountedPrice) {
  //   price = parseInt(priceRoute.discountedPrice.replace(/[^\d]/g, ""), 10); // Si hay precio con descuento
  // } else if (priceRoute.price) {
  //   price = parseInt(priceRoute.price.replace(/[^\d]/g, ""), 10); // Si es precio normal
  // } else {
  //   console.log("No hubo precio")
  // }

  const pagina = [];
  const decodedIdsArray = [];

  for (const key in publicaciones) {
    if (Object.prototype.hasOwnProperty.call(publicaciones, key)) {
      const nombrePublicacion = publicaciones[key].demandStayListing.description.name.localizedStringWithTranslationPreference
      const encodedId = publicaciones[key].demandStayListing.id
      const decodedId = atob(encodedId).replace("DemandStayListing:", "")
      decodedIdsArray.push(decodedId)

      // Cálculo del precio dentro del scope del for
      let price = 0;
      const priceRoute = publicaciones[key].structuredDisplayPrice.primaryLine;
      if (priceRoute.discountedPrice) {
        price = parseInt(priceRoute.discountedPrice.replace(/[^\d]/g, ""), 10);
      } else if (priceRoute.price) {
        price = parseInt(priceRoute.price.replace(/[^\d]/g, ""), 10);
      } else {
        console.log("No hubo precio para " + nombrePublicacion);
      }

      console.log(`${key} -> ${nombrePublicacion} --> ${decodedId} --> ${price}`);

      pagina.push({ nombrePublicacion, decodedId, price });
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