const unless: string[] = [
  '/query',
  '/upload',
  '/submit',
  '/validation',
  '/login'
]

export default unless.map((e) => '/api' + e)