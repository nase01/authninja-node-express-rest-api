export const splitEnvVar = (variable) => {
  return process.env[variable].split(',')
}
