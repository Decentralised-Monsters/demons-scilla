import matplotlib.pyplot as plt
from random import *

MAX_BUY = 1
EXPONENT = 2
DECIMAL = 10 ** 12
CUSTOMIZATION = 3214500000000000000000

reserve = 100
total_supply = 0

def buy():
  return ((total_supply // 26) + 1) * 7500


prices = []
counter = []

for i in range(100):
    amount = randint(i, 100) * (DECIMAL)
    # amount = 500 * DECIMAL
    price = buy()
    reserve -= 1
    total_supply += 1

    prices.append(price)

# plt.plot(block_list)
# plt.ylabel('blocks')
# plt.grid(True)

plt.plot(prices)
plt.ylabel('price')
plt.grid(True)
plt.show()
