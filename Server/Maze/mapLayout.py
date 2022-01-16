
# TODO 
#    parse csv to map
#    send to /maze

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

# graph = sys.argv[1]


mz = Maze()
mz.Graph.data = sys.argv[1]
mz.Graph.initialize()


result = {
    'maze': mz.__str__(),
    'car': 1
  }

json = json.dumps(result)

print(str(json))
sys.stdout.flush()

# mz.writecsv("gen",result)
# print("gen")

