import axios from 'axios'

export async function sendSlackMessage(
  slackSecret: string,
    message: string,
    description: string,
   
  ) {
   const url= slackSecret

   await axios.post(url, {
    
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": `Fivetran Alert: ${message}`,
            "emoji": true
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": description
          }
        }
      ]
    
  });
  
  }