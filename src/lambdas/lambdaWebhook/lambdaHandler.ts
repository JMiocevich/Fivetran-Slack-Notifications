import { secureEnvironmentVariable } from '../../aws/secretsClient'
import {domainHandler} from './domainHandler'
import * as crypto from 'crypto'


let slackSecret: string
let fiveTranSigningKey: string


export async function handler(event: any) {
  const decryptRequest: Promise<void> = decryptSecret()
  await decryptRequest

  slackSecret = process.env.SLACK_API_SECRET || ''
  fiveTranSigningKey = process.env.FIVETRAN_SIGNING_KEY_SECRET || ''

  const generated_key = signKey(fiveTranSigningKey, event.body)
  fiveTranSigningVerification(generated_key, event.headers['X-Fivetran-Signature-256'])

  return await domainHandler(event, slackSecret)
  
  
}

function signKey(clientKey: string, msg: string) {
  return crypto.createHmac('sha256', clientKey).update(msg).digest('hex')
}

function fiveTranSigningVerification(generatedKey: string, fiveTranKey: string) {
  if (crypto.timingSafeEqual(Buffer.from(generatedKey), Buffer.from(fiveTranKey))) {
    console.log('ValidToken')
  } else throw new Error(`Invalid Signature`)
}

// opsGenie secret decryption
async function decryptSecret() {
  const slackApiSecretArn: string = process.env.SLACK_API_SECRET_ARN || 'not_set'
  const fiveTranSigningKeyArn: string = process.env.FIVETRAN_SIGNING_KEY_ARN || 'not_set'

  if (slackApiSecretArn === 'FILL_ME_IN') {
    console.error(
      `slackTokenArn "${slackApiSecretArn}" has the value 'FILL_ME_IN' in AWS SecretsManager, this needs to be populated.`
    )
  }

  if (fiveTranSigningKeyArn === 'FILL_ME_IN') {
    console.error(
      `fiveTranSigningKeyArn "${fiveTranSigningKeyArn}" has the value 'FILL_ME_IN' in AWS SecretsManager, this needs to be populated.`
    )
  }

  await secureEnvironmentVariable(slackApiSecretArn, 'SLACK_API_SECRET')
  await secureEnvironmentVariable(fiveTranSigningKeyArn, 'FIVETRAN_SIGNING_KEY_SECRET')
}
