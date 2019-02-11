module.exports = {
  showWelcomeMessage: function () {
    const fiveSpaces = '     '
    process.stdout.write('Welcome! The create command will do the follwong:\n')
    process.stdout.write(`${fiveSpaces}1. Create the initial project structure\n`)
    process.stdout.write(`${fiveSpaces}2. Create the AWS CloudFormation stacks for development\n`)
    process.stdout.write(`${fiveSpaces}3. Configure AWS Amplify to point to the development environment\n`)

    process.stdout.write(`Before we start we need additional information. Please answer the following questions.\n`)
  }
}
