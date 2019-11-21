addEventListener('fetch', event => {
  event.respondWith(fetchAndApply(event.request))
})

async function fetchAndApply() {
  const init = {
    method: 'GET',
  }

  const API_KEY = await __stockprices_data.get('API_KEY')
  if (API_KEY === null) {
    return new Response('API_KEY not found', { status: 404 })
  }
  const TICKER = await __stockprices_data.get('TICKER')
  if (TICKER === null) {
    return new Response('TICKER not found', { status: 404 })
  }

  const url =
    'https://api.worldtradingdata.com/api/v1/stock' +
    '?symbol=' +
    TICKER +
    '&api_token=' +
    API_KEY

  const stockDataResponse = await fetch(url, init)
  const stockData = await stockDataResponse.json()

  let dailyLimitRemaining = stockDataResponse.headers.get(
    'x-dailylimit-remaining',
  )

  let combinedData = {}
  combinedData['dailyLimitRemaining'] = dailyLimitRemaining
  combinedData['stockData'] = stockData.data[0]

  const responseInit = {
    headers: { 'Content-Type': 'application/json' },
  }

  console.log('Daily API Limit Remaining: ', dailyLimitRemaining)
  return new Response(JSON.stringify(combinedData), responseInit)
}
