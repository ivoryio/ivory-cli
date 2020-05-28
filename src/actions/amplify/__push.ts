import shell from 'shelljs'

export const amplifyPush = (): void => {
  const command = `amplify push --yes`

  shell.echo(command)
  const result = shell.exec(command)
  if (result.code !== 0) {
    shell.echo(`Error: failed to run amplify push with command`)
    shell.echo(result.stderr)
    shell.exit(result.code)
  }
}
