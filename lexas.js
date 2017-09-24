'use strict'

class Lexas {
  constructor({ tokens, rules }) {
    this.tokens = tokens
    this.grammar = {}
    for (let [id, pattern] of rules) {
      if (!(id in this.grammar)) this.grammar[id] = []
      this.grammar[id].push(pattern)
    }
    for (let id in this.grammar) {
      let rules = this.grammar[id]
      let left = [], right = []
      for (let rule of rules) {
        if (rule[0] === id)
          left.push(rule)
        else
          right.push(rule)
      }
      if (left.length) {
        right.forEach(n => n.push(`_${id}`))
        this.grammar[id] = right
        left.forEach(l => (l.shift(), l.push(`_${id}`)))
        this.grammar[`_${id}`] = left
      }
    }
  }
  lex(str, pos = 0, patterns = this.grammar[this.tokens[0]], id = this.tokens[0], token = this.tokens[0]) {
    let child = [], length = 0
    for (let rule of patterns) {
      for (let elem of rule) {
        let ret
        if (elem in this.grammar)
          ret = this.lex(str, pos + length, this.grammar[elem], elem, this.tokens.includes(elem) ? elem : token)
        if (str.startsWith(elem, pos))
          ret = { token, child: elem, length: elem.length }
        if (ret && ret.length) {
          child.push(ret)
          length += ret.length
        } else break
      }
    }
    return { token, child, length }
  }
  flattenLex(...args) {
    let ret = []
    let lexed = this.lex(...args)
    const _dfs = node => {
      if (typeof node.child === 'string') ret.push(node)
      else node.child.forEach(_dfs)
    }
    _dfs(lexed)
    return ret
  }
  parse(flexed) {
    
  }
}
