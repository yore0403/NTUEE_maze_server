
# TODO 
#    genetate a map
#    send to /map

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
import json
import sys

maze_name = sys.argv[1]

mz = Maze()
mz.reset()
mz.generateMap(int(sys.argv[2]),int(sys.argv[3])) # TODO: dynamic mz
# result = {
#     'maze': str(mz.Graph.data),
#     'mazea': str(mz.Graph.nd_dict),
#     'car': 1
#   }


result = mz.Graph.data
with open(sys.argv[1],"w") as f:
    json.dump(result,f)
json = json.dumps(result)
print(str(json))
sys.stdout.flush()

