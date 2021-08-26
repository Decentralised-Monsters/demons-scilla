import matplotlib.pyplot as plt
from random import *

DECIMAL = 10**18

blocks_for_rewards = 2160   # no. of block per day
rewards = 191203703703703
number_of_days = 365
# rewards = (0.0001851851 * DECIMAL) // blocks_for_rewards
BLOCK_NUMBER = 2870309

def claim(current_block, acumulated_block):
  blocks = current_block - acumulated_block
  return blocks * rewards

valeus = []

acumulated_block = 2870309

for i in range(number_of_days):
    BLOCK_NUMBER += blocks_for_rewards

    v = claim(BLOCK_NUMBER, acumulated_block)

    valeus.append(v // DECIMAL)

plt.plot(valeus)
plt.xlabel('days')
plt.ylabel('DMZ')
plt.grid(True)
plt.show()
