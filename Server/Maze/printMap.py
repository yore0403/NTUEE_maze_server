# TODO 
#    print map from csv
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

maze_path = sys.argv[1]

mz = Maze(maze_path)

result = {
    'maze_path': "mz.Graph.getData()",
    'maze': mz.__str__(),
    'car': -1
}
# result = {}

json = json.dumps(result)
print(str(json))
sys.stdout.flush()