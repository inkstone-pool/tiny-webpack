export function jsonLoader(source){
    console.log('jsonloader__________________________',source)
    return `export default${JSON.stringify(source)}`
}