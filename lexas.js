'use strict'

Array.prototype.last = function(rindex = 1) {
  return this[this.length - rindex];
};

const TOKEN = {
  OPERAND: Symbol.for('OPERAND'),
  OPERATOR: Symbol.for('OPERATOR'),
  SKIP: Symbol.for('SKIP'),
  LEFT: Symbol.for('LEFT'),
  RIGHT: Symbol.for('RIGHT'),
  BINARY: Symbol.for('BINARY'),
  BRACKET: Symbol.for('BRACKET'),
}

const EOP = { type: TOKEN.OPERATOR, symbol: '$', precedence: -1, fixity: 'left' }
class Lexas {
  constructor(rules) {
    this.stack = [{ oprand: [], op: [] }]
    this.rules = rules
  }
  lex() {
    if (!this.str) return null
    let m, ret
    for (const [rule, out] of this.rules) {
      ret = out
      if (typeof rule === 'string') {
        if (this.str.startsWith(rule))
          m = rule
      } else if (m = this.str.match(rule))
        m = m[0]
      if (m) {
        this.str = this.str.substring(m.length)
        break
      }
    }
    if (typeof ret === 'function') ret = ret(m)
    return ret
  }
  parse(str) {
    this.str = str
    let x
    while (x = this.lex()) this.doToken(x)
    this.doStack(EOP)
    return this.stack.last().oprand.last()
  }
  compare(a, b) {
    if (a.precedence > b.precedence) return true
    if (a.precedence < b.precedence) return false
    if (a.fixity !== b.fixity) {
      throw new Error(`Can't compose ${a.symbol} with ${b.symbol}.`)
      return
    }
    return a.fixity == 'left'
  }
  doStack(x) {
    while (this.stack.last().op.length && this.compare(this.stack.last().op.last(), x)) {
      const rhs = this.stack.last().oprand.pop()
      const lhs = this.stack.last().oprand.pop()
      const op = this.stack.last().op.pop()
      this.stack.last().oprand.push({ type: TOKEN.BINARY, op, lhs, rhs })
    }
  }
  doToken(x) {
    switch (x.type) {
      case TOKEN.OPERAND: this.stack.last().oprand.push(x); break
      case TOKEN.LEFT: this.stack.push({ oprand: [], op: [], match: x.match, value: x.value }); break
      case TOKEN.RIGHT: {
        if (x.value !== this.stack.last().match)
          throw new Error(`Mismatched bracket, expected ${this.stack.last().match}, got ${x.value}`)
        else {
          this.doStack(EOP)
          let last = this.stack.pop()
          this.stack.last().oprand.push({ type: TOKEN.BRACKET, symbol: last.value, node: last.oprand.last() })
        }
        break
      }
      case TOKEN.OPERATOR: {
        this.doStack(x)
        this.stack.last().op.push(x)
      }
    }
  }
}
