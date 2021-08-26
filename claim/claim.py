import matplotlib.pyplot as plt
from random import *

DECIMAL = 10**18

blocks_for_rewards = 2160
rewards = (0.0001851851 * DECIMAL) // blocks_for_rewards
BLOCK_NUMBER = 2870309

def claim(current_block, acumulated_block):
  blocks = current_block - acumulated_block
  return blocks * rewards

valeus = []

acumulated_block = 2870309

for i in range(1000):
    BLOCK_NUMBER += 3

    v = claim(BLOCK_NUMBER, acumulated_block)

    valeus.append(v // DECIMAL)

plt.plot(valeus)
plt.ylabel('valeus')
plt.grid(True)
plt.show()
