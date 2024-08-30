export const levelText = (level: 1 | 2 | 3) => {
  switch (level) {
    case 1:
      return 'Level 1'
    case 2:
      return 'Level 2'
    case 3:
      return 'Level 3'
    default:
      return ''
  }
}
