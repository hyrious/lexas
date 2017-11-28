
X = [0, 1, 2, 3, 4, 5]
U = [-1, +1]
y = 0.5

def qi():
  q = {}
  for x in X:
    for u in U:
      q[(x, u)] = 0.0
  return q

def hi():
  return [1] * len(X)

def phi(q, h):
  for x in X:
    h[x] = h[x] if q[(x, -1)] == q[(x, 1)] else 1 if q[(x, -1)] < q[(x, 1)] else -1

def r(q, prec=3):
  return [tuple([round(q[(x, u)], prec) for u in U]) for x in X]

def sr(r):
  return ' '.join('|'.join('%.3f' for _ in x) % x for x in r)

def hr(q):
  return [0 if q[(x, -1)] == q[(x, 1)] else 1 if q[(x, -1)] < q[(x, 1)] else -1 for x in X]

# certain env
def cf(x, u):
  return x + u if 1 <= x <= 4 else x

def cp(x, u):
  return 5 if x == 4 and u == 1 else 1 if x == 1 and u == -1 else 0

def cvi(q, c=1):
  """value iteration"""
  for i in range(c):
    for x in X:
      for u in U:
        if x == 0 or x == 5:
          q[(x, u)] = 0.0
        else:
          q[(x, u)] = cp(x, u) + y * max([q[(cf(x, u), _u)] for _u in U])

def cpi(q, h, c=1):
  """policy iteration"""
  for i in range(c):
    for x in X:
      for u in U:
        if x == 0 or x == 5:
          q[(x, u)] = 0.0
        else:
          q[(x, u)] = cp(x, u) + y * q[(cf(x, u), h[i])]

def ans(h):
  return ['*' if x == 0 or x == 5 else '<' if h[x] == -1 else '>' for x in X]

def shr(h):
  a = ans(h)
  a[0] = a[5] = '*'
  return ' '.join('     %s     ' % x for x in a)

# uncertain env
def uf(x, u, t):
  if x == 0 or x == 5:
    return 1.0 if x == t else 0.0
  if x - 1 == t:
    return 0.8 if u == -1 else 0.05
  elif x == t:
    return 0.15
  elif x + 1 == t:
    return 0.8 if u == 1 else 0.05
  else:
    return 0.0

def up(x, u, t):
  if x == 1 and t == 0:
    return 1
  if x == 4 and t == 5:
    return 5
  else:
    return 0

def uvi(q, c=1):
  for i in range(c):
    for x in X:
      for u in U:
        if x == 0 or x == 5:
          q[(x, u)] = 0.0
        else:
          q[(x, u)] = sum([uf(x, u, x + __u) * (up(x, u, x + __u) + y * max([q[(x + __u, _u)] for _u in U])) for __u in [-1, 0, +1]])

def upi(q, h, c=1):
  for i in range(c):
    for x in X:
      for u in U:
        if x == 0 or x == 5:
          q[(x, u)] = 0.0
        else:
          q[(x, u)] = sum([uf(x, u, x + __u) * (up(x, u, x + __u) + y * q[(x + __u, h[x + __u])]) for __u in [-1, 0, +1]])

# test
def calc(vi, pi=None):
  if pi:
    h = hi()
    ht = None
    while ht != h:
      print(shr(h))
      q = qi()
      qt = None
      while qt != r(q, 7):
        qt = r(q, 7)
        print(sr(r(q)))
        vi(q, h)
      ht = h.copy()
      pi(q, h)
  else:
    h = None
    q = qi()
    qt = None
    while qt != r(q, 7):
      qt = r(q, 7)
      print(sr(r(q)))
      vi(q)
    h = hr(q)
  return shr(h)

def report(msg, vi, pi=None):
  print(msg, ':')
  print(calc(vi, pi))
  print('-' * 71)

report('Certain Value Iteration', cvi)
report('Certain Policy Iteration', cpi, phi)
report('Uncertain Value Iteration', uvi)
report('Uncertain Policy Iteration', upi, phi)
