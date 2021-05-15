import matplotlib.pyplot as plt
from random import *

MAX_LVL = 25
EXPONENT = 2
DECIMAL = 10 ** 18
CUSTOMIZATION = 1000000000000000

reserve = 1

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

def zlp_to_blocks(amount, block_decimal):
    value = amount // block_decimal

    if (value > MAX_LVL):
        return MAX_LVL

    return value

def buy(amount):
    b = get_pool_balance(reserve)
    price = get_price(reserve, b)
    new_lvl = zlp_to_blocks(amount, price)
    
    return (price / DECIMAL, new_lvl)

prices = []
lvls = []

for i in range(100):
    amount = randint(1, 100) * (DECIMAL)
    # amount = 500 * DECIMAL
    (price, new_lvl) = buy(amount)
    reserve = reserve + new_lvl

    prices.append(price)
    lvls.append(reserve)

plt.plot(lvls)
plt.ylabel('lvls')
plt.grid(True)
plt.show()
