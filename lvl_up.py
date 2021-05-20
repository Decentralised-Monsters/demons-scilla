import matplotlib.pyplot as plt
from random import *

DECIMAL = 200000000000000000

current_lvl = 1000

def lvl_up(amount):
  value = amount // DECIMAL + current_lvl

  return value

lvls = []

for i in range(100):
    amount = 20 * (10**18)
    # amount = 500 * DECIMAL
    lvl = lvl_up(amount)

    current_lvl = lvl

    print(current_lvl)

    lvls.append(lvl // 1000)

# plt.plot(block_list)
# plt.ylabel('blocks')
# plt.grid(True)

plt.plot(lvls)
plt.ylabel('lvls')
plt.grid(True)
plt.show()
