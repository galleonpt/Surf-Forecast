### Arquivo "server.ts"

- o app no this.app vem da classe Server que nós extendemos

### Arquivo "stormGlass.ts"

partial -> o tipo StormGlassPoint tem as chaves opcionais (tranforma todas as chaves em opcionais, desta forma na verificacao somos forçados a ver se os dados sao undefined)
!! -> obriga a que o retorno seja boolean
bind -> ele proprio cha o isValidPoint chamando o parametro para dentro dele

### Arquivo "internal-error.ts"

class generica para erros

captureStackTrace -> caso dê um erro, a class nao aparece. a gente so mostra a partir de onde o erro foi chamado
