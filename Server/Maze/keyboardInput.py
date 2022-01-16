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

mz = Maze(sys.argv[1]) # TODO get map from server

my_list = sys.argv[5].split(",")

my_list = [int(i) for i in my_list if i != '']

mz.explored = my_list # reset
# nd_start = int(input("Enter starting node: "))

mz.set_car(int(sys.argv[2]),int(sys.argv[3]))

next_idx, next_ori =mz.move_car(sys.argv[4])
# next_idx, next_ori =2,2





result = {
    'maze': mz.__str__(),
    'car': next_idx,
    'orientation': next_ori,
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