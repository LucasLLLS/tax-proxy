import { IOContext } from '@vtex/api'

interface Credentials {
  baseUrl: string
  taxHub: string
  loginCredentials: Token
  appKey: string
  appToken: string
}

interface Token{
    Authorization: string
    janisClient: string
    host: string
}

export const getConfig = (ctx: IOContext) => {
  if (ctx.account === 'jumboargentinaqavea' || ctx.account === 'jumboargentinaqa' || ctx.account === 'discoargentinaqa' || ctx.account === 'jumboargentinaqadisco') {
    return qa
  } else if (ctx.account === 'veaargentina' || ctx.account === 'jumboargentina' || ctx.account === 'discoargentina') {
    return production
  } else { return noConfig }
}

const qa: Credentials = {
  baseUrl: 'https://tnd.janisqa.in',
  taxHub: '/api/1/taxhub',
  loginCredentials: {
    Authorization: 'Bearer xxx',
    janisClient: 'jumboargentinaqa',
    host: 'veaargentina',
  },
  appKey: 'key',
  appToken: 'token'
}

const production: Credentials = {
  baseUrl: 'https://tnd.janis.in',
  taxHub: '/api/1/taxhub',
  loginCredentials: {
    Authorization: 'Bearer xxx',
    janisClient: 'jumboargentina',
    host: 'veaargentina',
  },
  appKey: 'key',
  appToken: 'token'
}

const noConfig: Credentials = {
  baseUrl: '',
  taxHub: '',
  loginCredentials: {
    Authorization: '',
    janisClient: '',
    host: '',
  },
  appKey: '',
  appToken: ''
}
