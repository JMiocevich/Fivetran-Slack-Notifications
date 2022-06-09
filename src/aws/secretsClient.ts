import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager'
import AWSXRay from 'aws-xray-sdk'

// Configure the context missing strategy to do nothing
AWSXRay.setContextMissingStrategy(() => {})

let sm: SecretsManagerClient

function getClient(): SecretsManagerClient {
  if (!sm) {
    const smClient = new SecretsManagerClient({
      region: process.env.AWS_REGION
    })
    sm = AWSXRay.captureAWSv3Client(smClient)
  }
  return sm
}

export async function decryptSecret(secretId: string) {
  console.debug(JSON.stringify({
    message: 'Decrypting Secret',
    data: secretId
  }))

  const sm = getClient()
  const command = new GetSecretValueCommand({
    SecretId: secretId
  })
  const response = await sm.send(command)
  const value = response.SecretString
  return value
}

/**
 * Decrypt a secret and put the decrypted value in an environment variable.
 * Te lambda must have permission to decrypt the secret
 * @param secretId The ID of the secret to decrypt
 * @param destEnvVariableName The environment variable to configure
 */
export async function secureEnvironmentVariable(secretId: string, destEnvVariableName: string) {
  const value = await decryptSecret(secretId)
  process.env[destEnvVariableName] = value
}
