import { Hono } from 'hono'
import { Bindings } from 'hono/types'
export interface Env {}

const app = new Hono<Bindings>()

app.get('/coins/:asset', async (c) => {
  const asset = c.req.param('asset') || 'bitcoin' // Default to 'bitcoin' if no asset is specified
  const apiUrl = `https://api.coingecko.com/api/v3/coins/${asset}`
  
  try {
    const response = await fetch(apiUrl)
	console.log(response)
    if (!response.ok) {
      throw new Error( response.statusText || 'error getting coin feed please be sure to use valid asset name')
    }
    const data: any = await response.json()
    const assetInfo = {
      id: data.id,
      symbol: data.symbol,
      name: data.name,
      current_price: data.market_data.current_price.usd,
      market_cap: data.market_data.market_cap.usd,
      total_volume: data.market_data.total_volume.usd
    }
    return c.json(assetInfo)
  } catch (error: any) {
    return c.json({ error: error.message }, 500)
  }
})

app.use(async (c, next) => {
	const start = Date.now()
	await next()
	const end = Date.now()
	c.res.headers.set('X-Response-Time', `${end - start}`)
	
	return c.json({ error: `worker error: ${c.error?.message}`})
  })

export default app

// export default () => runWorker()