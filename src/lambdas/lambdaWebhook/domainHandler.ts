import {sendSlackMessage} from '../../commands/slackCommands'

let message: string 
let description: string | undefined

let statusCode: number | undefined

export async function domainHandler(event:any, slackSecret: string){

    const data: any = JSON.parse(event.body)
  
    switch (data.event) {
      case 'dbt_run_failed':
        statusCode = 200
        message = event.data
        description = `${data?.data?.result?.description}, "https://fivetran.com/dashboard/dbt-transformations?groupId=${data.destination_group_id}"`
  
        console.log('dbt_run_failed alert')
        
        await sendSlackMessage(slackSecret,message,description)
        break
  
      case 'sync_end':
        statusCode = 200
        if (data.data.status === 'FAILURE' || data.data.status === 'FAILURE_WITH_TASK') {
          message = data.event
          description = `${data?.data?.reason}`
          console.log('sync_end alert created')
          await sendSlackMessage(slackSecret,message,description)
        }
        break
  
      default:
        message = `ERROR: ${data.event} is a unsupported event type`
        statusCode = 400
    }
    return {
      statusCode: statusCode,
      body: message
    }

}