# NOTE - read json file and turn to csvfile and letuser can download

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

result = mz.graph2csv()
print("index,North,South,West,East,ND,SD,WD,ED")

for row in result:
    row = [str(cell) for cell in row]
    print(','.join(row))

sys.stdout.flush()