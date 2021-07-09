import matplotlib.pyplot as plt
from random import *

MAX_BUY = 1
EXPONENT = 2
DECIMAL = 10 ** 18
CUSTOMIZATION = 3214500000000000000000

reserve = 100
total_supply = 0

def get_pool_balance(s):
    n = EXPONENT + 1
    mn = CUSTOMIZATION // n
    ts = s + 1
    s_pow = ts ** n

    return mn * s_pow

def get_price(s, b):
    n = EXPONENT + 1
    mn = CUSTOMIZATION // n
    ts = s + 1
    sk = ts + 1
    sk_exp = sk ** n
    value = mn * sk_exp

    return value - b

def get_count(a, p):
  return a // p

def buy(amount):
  b = get_pool_balance(total_supply)
  price = get_price(total_supply, b)
  count = get_count(amount, price)

  print(price // DECIMAL)

  return (price, count)


prices = []
counter = []

for i in range(100):
    amount = randint(i, 200) * (DECIMAL)
    # amount = 500 * DECIMAL
    (price, count) = buy(amount)
    reserve -= 1
    total_supply += 1

    prices.append(price)
    counter.append(count)

# plt.plot(block_list)
# plt.ylabel('blocks')
# plt.grid(True)

plt.plot(prices)
plt.ylabel('price')
plt.grid(True)
plt.show()