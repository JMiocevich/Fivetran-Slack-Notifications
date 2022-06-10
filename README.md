# Fivetran Slack Integration
For more instructions and setup go to [Valheim on AWS BlogPost](https://mechanicalrock.github.io/2022/06/09/fivetran-webhook-notifications.html)


## Setup
The following/requirements are needed.
- Access to AWS account with access credentials avaliable for use,  [AWS Docs](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)
- [VsCode](https://code.visualstudio.com) installed
- [NodeJs](https://nodejs.org/en/download/) installed
- [AWS Command Line Interface](https://aws.amazon.com/cli/) installed
- [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) installed

# Setup
- Install required packages using ```npm install```.
- Edit the configuration section in `./ci/scripts/deploy.sh`
- Run ./ci/scripts/deploy.sh
- Goto secrets mananager and edit ```FiveTranSigningKeySecret``` and ```SlackApiSecret```




