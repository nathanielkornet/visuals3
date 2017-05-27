export function getRandomHexColor () {
  const letters = '0123456789ABCD'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 13)]
  }

  // that good green
  // color = color.substring(0,3) + 'FF' + color.substring(5, 7)
  return color
}
