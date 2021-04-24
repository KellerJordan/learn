N = int(1e7)
k = 235
for i in range(N):
    k = 7 * k
    k <<= 3
    k = k % 234399

print(k)

