import ProxyAgent from 'proxy-agent'

export const proxyAgent = new ProxyAgent(process.env.API_PROXY)
