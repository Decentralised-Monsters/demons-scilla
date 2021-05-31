import matplotlib.pyplot as plt
from random import *

DECIMAL = 10**18

current_lvl = 5000
max_lvl = 5999
emissionPerDay = 1000000000000000000




def claim():
  return current_lvl // 5000 * emissionPerDay

valeus = []

for i in range(100):
    current_lvl += i * 10

    v = claim()

    print(v // DECIMAL)

    valeus.append(v // DECIMAL)

plt.plot(valeus)
plt.ylabel('valeus')
plt.grid(True)
plt.show()
