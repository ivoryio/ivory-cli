import shell from 'shelljs'

export const createReactApp = (appName: string) => {
  const result = shell.exec(`yarn create react-app --color always --template @ivoryio ${appName}`)
  if (result.code !== 0) {
    shell.echo('Error: create react-app failed with ivory template failed')
    shell.echo(result.stderr)
    shell.exit(result.code)
  }
}
