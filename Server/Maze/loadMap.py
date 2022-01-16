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
maze_path = sys.argv[1]

mz = Maze(maze_path) # TODO get map from server

mz.explored = [] # reset
# nd_start = int(input("Enter starting node: "))

result = {
    'maze': mz.__str__(),
    'car': -1,
    'orientation': -1,
    'explored': mz.explored
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