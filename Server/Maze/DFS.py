import math
import csv
import pandas as pd
import numpy as np
from node import Node
from graph import Graph
from grid import Grid
from maze import Maze
import random
import time
import sys 
import json
# 1. filename 2. start 3. ori 4. end 5. str

maze_path = sys.argv[1]

mz = Maze(maze_path) # TODO get map from server

mz.explored = [] # reset
# calculate shortest path
mz.set_car(int(sys.argv[2]))
path = mz.Graph.shortestPath(int(sys.argv[2]), int(sys.argv[3]))
path_str = mz.pathToString(path)

mz.set_car(int(sys.argv[2]))

for ch in sys.argv[4]:
  next_idx, next_ori =mz.move_car(ch)
# next_idx, next_ori =2,2
reach_goal = (int(next_idx) == int(sys.argv[3]))
equal_path_len = (len(path_str) == len(sys.argv[4]))

result = {
    'maze': mz.__str__(),
    'path': path_str,
    'length': len(path_str),
    'reach_goal':reach_goal,
    'equal_path_len':equal_path_len,
    'pos':next_idx
  }

json = json.dumps(result)

print(str(json))
sys.stdout.flush()


# while(True):
#     nxt = input("Enter command: ")
#     if nxt == 'exit':break
#     for i in range(len(nxt)):
#         mz.move_car(nxt[i])
#         print(mz)